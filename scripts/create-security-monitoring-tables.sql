-- Create threat alerts table
CREATE TABLE IF NOT EXISTS threat_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  threat_type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  source_ip INET NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'investigating', 'resolved', 'false_positive')),
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for threat alerts
CREATE INDEX IF NOT EXISTS idx_threat_alerts_status ON threat_alerts(status);
CREATE INDEX IF NOT EXISTS idx_threat_alerts_severity ON threat_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_threat_alerts_created_at ON threat_alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_threat_alerts_source_ip ON threat_alerts(source_ip);

-- Create security audit log table
CREATE TABLE IF NOT EXISTS security_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id VARCHAR(100),
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for audit log
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_action ON security_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_timestamp ON security_audit_log(timestamp);

-- Create security metrics view
CREATE OR REPLACE VIEW security_metrics_summary AS
SELECT 
  DATE_TRUNC('hour', timestamp) as hour,
  severity,
  COUNT(*) as event_count
FROM security_logs 
WHERE timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', timestamp), severity
ORDER BY hour DESC;

-- Create function to automatically clean old security logs
CREATE OR REPLACE FUNCTION cleanup_old_security_logs()
RETURNS void AS $$
BEGIN
  -- Delete logs older than 90 days
  DELETE FROM security_logs 
  WHERE timestamp < NOW() - INTERVAL '90 days';
  
  -- Delete resolved threat alerts older than 30 days
  DELETE FROM threat_alerts 
  WHERE status = 'resolved' 
  AND resolved_at < NOW() - INTERVAL '30 days';
  
  -- Delete audit logs older than 1 year
  DELETE FROM security_audit_log 
  WHERE timestamp < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Create function to detect anomalous behavior
CREATE OR REPLACE FUNCTION detect_anomalous_behavior()
RETURNS TABLE(
  ip_address INET,
  event_count BIGINT,
  severity_score NUMERIC,
  threat_level TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sl.ip_address::INET,
    COUNT(*) as event_count,
    SUM(CASE 
      WHEN sl.severity = 'critical' THEN 10
      WHEN sl.severity = 'high' THEN 5
      WHEN sl.severity = 'medium' THEN 2
      ELSE 1
    END) as severity_score,
    CASE 
      WHEN SUM(CASE 
        WHEN sl.severity = 'critical' THEN 10
        WHEN sl.severity = 'high' THEN 5
        WHEN sl.severity = 'medium' THEN 2
        ELSE 1
      END) >= 50 THEN 'CRITICAL'
      WHEN SUM(CASE 
        WHEN sl.severity = 'critical' THEN 10
        WHEN sl.severity = 'high' THEN 5
        WHEN sl.severity = 'medium' THEN 2
        ELSE 1
      END) >= 20 THEN 'HIGH'
      WHEN SUM(CASE 
        WHEN sl.severity = 'critical' THEN 10
        WHEN sl.severity = 'high' THEN 5
        WHEN sl.severity = 'medium' THEN 2
        ELSE 1
      END) >= 10 THEN 'MEDIUM'
      ELSE 'LOW'
    END as threat_level
  FROM security_logs sl
  WHERE sl.timestamp >= NOW() - INTERVAL '1 hour'
    AND sl.ip_address IS NOT NULL
  GROUP BY sl.ip_address
  HAVING COUNT(*) >= 10 -- Only IPs with 10+ events in the last hour
  ORDER BY severity_score DESC;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE threat_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policies for threat alerts (admin access only)
CREATE POLICY "Admin can view threat alerts" ON threat_alerts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.raw_user_meta_data->>'role' = 'admin' 
           OR auth.users.app_metadata->>'role' = 'admin')
    )
  );

CREATE POLICY "Admin can manage threat alerts" ON threat_alerts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.raw_user_meta_data->>'role' = 'admin' 
           OR auth.users.app_metadata->>'role' = 'admin')
    )
  );

-- Create policies for audit log (admin access only)
CREATE POLICY "Admin can view audit log" ON security_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (auth.users.raw_user_meta_data->>'role' = 'admin' 
           OR auth.users.app_metadata->>'role' = 'admin')
    )
  );

CREATE POLICY "System can insert audit log" ON security_audit_log
  FOR INSERT WITH CHECK (true);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON threat_alerts TO authenticated;
GRANT SELECT, INSERT ON security_audit_log TO authenticated;
GRANT SELECT ON security_metrics_summary TO authenticated;

-- Create trigger to automatically create threat alerts for critical events
CREATE OR REPLACE FUNCTION auto_create_threat_alert()
RETURNS TRIGGER AS $$
BEGIN
  -- Create threat alert for high and critical severity events
  IF NEW.severity IN ('high', 'critical') THEN
    INSERT INTO threat_alerts (
      threat_type,
      description,
      severity,
      source_ip,
      user_id,
      metadata,
      status
    ) VALUES (
      NEW.event_type,
      CASE 
        WHEN NEW.event_type = 'rate_limit_exceeded' THEN 'Rate limit exceeded - potential DDoS attack'
        WHEN NEW.event_type = 'sql_injection_attempt' THEN 'SQL injection attempt detected'
        WHEN NEW.event_type = 'xss_attempt' THEN 'Cross-site scripting attempt detected'
        WHEN NEW.event_type = 'authentication_failure' THEN 'Multiple authentication failures detected'
        ELSE 'Security threat detected: ' || NEW.event_type
      END,
      NEW.severity,
      NEW.ip_address::INET,
      NEW.user_id,
      NEW.details,
      'active'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_create_threat_alert
  AFTER INSERT ON security_logs
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_threat_alert();
