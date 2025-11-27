// Run database migration to add suggestion columns
const mysql = require("mysql2/promise");
require("dotenv").config({ path: ".env.local" });

async function runMigration() {
  let connection;

  try {
    console.log("🔄 Connecting to Railway database...");

    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("✅ Connected successfully!\n");

    // Check if columns already exist
    console.log("🔍 Checking if columns already exist...");
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = '${process.env.DB_NAME}' 
        AND TABLE_NAME = 'coupons'
        AND COLUMN_NAME IN ('show_in_suggestions', 'suggestion_priority', 'suggestion_badge')
    `);

    if (columns.length > 0) {
      console.log("⚠️  Columns already exist:");
      columns.forEach((col) => console.log(`   - ${col.COLUMN_NAME}`));
      console.log(
        "\n🚫 Migration skipped. Run DROP command first if you want to recreate.\n"
      );
      return;
    }

    console.log("✅ Columns do not exist. Proceeding with migration...\n");

    // Run migration
    console.log("🔧 Adding columns to coupons table...");
    await connection.query(`
      ALTER TABLE coupons
      ADD COLUMN show_in_suggestions BOOLEAN DEFAULT FALSE AFTER popup_gradient,
      ADD COLUMN suggestion_priority INT DEFAULT 999 AFTER show_in_suggestions,
      ADD COLUMN suggestion_badge VARCHAR(50) DEFAULT NULL AFTER suggestion_priority
    `);

    console.log("✅ Columns added successfully!\n");

    // Verify
    console.log("🔍 Verifying table structure...");
    const [structure] = await connection.query(`
      DESCRIBE coupons
    `);

    console.log("\n📋 Updated table structure:");
    console.table(
      structure.map((col) => ({
        Field: col.Field,
        Type: col.Type,
        Null: col.Null,
        Default: col.Default,
      }))
    );

    console.log("\n✨ Migration completed successfully!");
    console.log(
      "📝 You can now manage coupon suggestions from the admin panel.\n"
    );
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Database connection closed.");
    }
  }
}

// Run the migration
runMigration();
