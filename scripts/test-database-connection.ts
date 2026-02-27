// Test database connection and verify all tables are accessible
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

async function testDatabaseConnection() {
  console.log("[v0] Testing database connection...")

  try {
    // Test basic connection
    const result = await sql`SELECT NOW() as current_time`
    console.log("[v0] ✅ Database connection successful!")
    console.log("[v0] Server time:", result[0].current_time)

    // List all tables
    console.log("\n[v0] Checking tables...")
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    console.log("[v0] Found", tables.length, "tables:")
    tables.forEach((table) => {
      console.log("[v0]  -", table.table_name)
    })

    // Check RLS status
    console.log("\n[v0] Checking Row Level Security...")
    const rlsStatus = await sql`
      SELECT tablename, rowsecurity 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `

    const tablesWithoutRLS = rlsStatus.filter((t) => !t.rowsecurity)
    if (tablesWithoutRLS.length > 0) {
      console.log("[v0] ⚠️ Tables without RLS enabled:")
      tablesWithoutRLS.forEach((t) => console.log("[v0]  -", t.tablename))
    } else {
      console.log("[v0] ✅ All tables have RLS enabled!")
    }

    // Check for required tables
    console.log("\n[v0] Verifying required tables...")
    const requiredTables = [
      "user_profiles",
      "chat_sessions",
      "chat_messages",
      "chat_history",
      "goal_progress",
      "outcome_measurements",
      "ai_feedback",
      "user_interactions",
      "user_preferences",
      "texas_high_schools",
    ]

    const existingTableNames = tables.map((t) => t.table_name)
    const missingTables = requiredTables.filter((t) => !existingTableNames.includes(t))

    if (missingTables.length > 0) {
      console.log("[v0] ⚠️ Missing required tables:")
      missingTables.forEach((t) => console.log("[v0]  -", t))
      console.log("[v0] Run fix-missing-tables-v2.sql to create them")
    } else {
      console.log("[v0] ✅ All required tables exist!")
    }

    // Test a simple query on user_profiles
    console.log("\n[v0] Testing user_profiles table...")
    const profileCount = await sql`SELECT COUNT(*) as count FROM user_profiles`
    console.log("[v0] User profiles count:", profileCount[0].count)

    console.log("\n[v0] ✅ All database tests passed!")
  } catch (error) {
    console.error("[v0] ❌ Database test failed:", error)
    throw error
  }
}

// Run the test
testDatabaseConnection()
