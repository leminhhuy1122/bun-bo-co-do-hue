// Test kết nối Railway MySQL
import "dotenv/config";
import mysql from "mysql2/promise";

async function testRailwayConnection() {
  console.log("🧪 Testing Railway MySQL connection...\n");

  const config = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };

  console.log("Config:", {
    host: config.host,
    port: config.port,
    user: config.user,
    database: config.database,
  });

  try {
    console.log("\n⏳ Connecting...");
    const connection = await mysql.createConnection(config);
    console.log("✅ Connected successfully!\n");

    // Test query
    console.log("📊 Testing queries...");
    const [tables] = await connection.query("SHOW TABLES");
    console.log(
      `✅ Found ${tables.length} tables:`,
      tables.map((t: any) => Object.values(t)[0])
    );

    // Test orders count
    const [orders] = await connection.query(
      "SELECT COUNT(*) as count FROM orders"
    );
    console.log(`✅ Orders count: ${(orders as any)[0].count}`);

    // Test reservations count
    const [reservations] = await connection.query(
      "SELECT COUNT(*) as count FROM reservations"
    );
    console.log(`✅ Reservations count: ${(reservations as any)[0].count}`);

    await connection.end();
    console.log("\n✅ All tests passed! Railway connection working! 🎉");
  } catch (error: any) {
    console.error("\n❌ Connection failed:", error.message);
    console.error("\nTroubleshooting:");
    console.error("1. Check DB_HOST, DB_USER, DB_PASSWORD in .env.local");
    console.error('2. Make sure Railway MySQL has "Public Networking" enabled');
    console.error("3. Check firewall/network settings");
    process.exit(1);
  }
}

testRailwayConnection();
