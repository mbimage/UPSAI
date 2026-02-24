-- Create security logs table
CREATE TABLE IF NOT EXISTS security_logs (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  details JSONB,
  severity VARCHAR(20) DEFAULT 'medium',
  ip_address VARCHAR(45),
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_logs_timestamp ON security_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_security_logs_severity ON security_logs(severity);
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON security_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_logs_ip_address ON security_logs(ip_address);

-- Create blocked IPs table
CREATE TABLE IF NOT EXISTS blocked_ips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  blocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  blocked_until TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create index for blocked IPs
CREATE INDEX IF NOT EXISTS idx_blocked_ips_ip_address ON blocked_ips(ip_address);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_active ON blocked_ips(is_active) WHERE is_active = TRUE;

-- Create security settings table
CREATE TABLE IF NOT EXISTS security_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_name VARCHAR(100) NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Insert default security settings
INSERT INTO security_settings (setting_name, setting_value, description) VALUES
  ('rate_limiting', '{"enabled": true, "window_ms": 900000, "max_requests": 100}', 'Rate limiting configuration'),
  ('threat_detection', '{"enabled": true, "risk_threshold": 5}', 'Threat detection settings'),
  ('audit_logging', '{"enabled": true, "retention_days": 90}', 'Audit logging configuration'),
  ('blocked_countries', '{"countries": []}', 'List of blocked country codes'),
  ('allowed_origins', '{"origins": ["https://upsideai.app"]}', 'Allowed CORS origins')
ON CONFLICT (setting_name) DO NOTHING;

-- Create function to clean old logs
CREATE OR REPLACE FUNCTION clean_old_security_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM security_logs 
  WHERE timestamp < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Create function to check if IP is blocked
CREATE OR REPLACE FUNCTION is_ip_blocked(check_ip INET)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM blocked_ips 
    WHERE ip_address = check_ip 
    AND is_active = TRUE 
    AND (blocked_until IS NULL OR blocked_until > NOW())
  );
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_ips ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;

-- Create policies (admin access only)
CREATE POLICY "Admin can view security logs" ON security_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "System can insert security logs" ON security_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can manage blocked IPs" ON blocked_ips
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admin can manage security settings" ON security_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Grant necessary permissions
GRANT SELECT, INSERT ON security_logs TO authenticated;
GRANT SELECT ON blocked_ips TO authenticated;
GRANT SELECT ON security_settings TO authenticated;
