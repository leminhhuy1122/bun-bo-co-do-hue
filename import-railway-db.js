// Script tu dong import database vao Railway
// Chay: node import-railway-db.js

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

const DB_CONFIG = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true,
  charset: "utf8mb4",
};

async function importDatabase() {
  console.log("\n==============================================");
  console.log("  IMPORT DATABASE VAO RAILWAY TU DONG");
  console.log("==============================================\n");

  let connection;

  try {
    // Ket noi database
    console.log("⏳ Dang ket noi Railway MySQL...");
    console.log(`   Host: ${DB_CONFIG.host}`);
    console.log(`   Port: ${DB_CONFIG.port}`);
    console.log(`   Database: ${DB_CONFIG.database}\n`);

    connection = await mysql.createConnection(DB_CONFIG);
    console.log("✓ Ket noi thanh cong!\n");

    // Buoc 1: Xoa va tao lai database
    console.log("⏳ Buoc 1: Xoa database cu...");
    await connection.query(`DROP DATABASE IF EXISTS ${DB_CONFIG.database}`);
    console.log("✓ Da xoa database cu\n");

    console.log("⏳ Buoc 2: Tao database moi voi UTF8MB4...");
    await connection.query(
      `CREATE DATABASE ${DB_CONFIG.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log("✓ Da tao database moi\n");

    await connection.query(`USE ${DB_CONFIG.database}`);

    // Buoc 2: Doc file SQL
    const sqlFile = path.join(
      __dirname,
      "database",
      "bun_bo_hue_co_do_railway.sql"
    );
    console.log("⏳ Buoc 3: Doc file SQL...");
    console.log(`   File: ${sqlFile}`);

    if (!fs.existsSync(sqlFile)) {
      throw new Error("Khong tim thay file SQL!");
    }

    let sqlContent = fs.readFileSync(sqlFile, "utf8");
    console.log(
      `✓ Da doc file SQL (${(sqlContent.length / 1024).toFixed(2)} KB)\n`
    );

    // Buoc 3: Tach va thuc thi tung lenh SQL
    console.log("⏳ Buoc 4: Import du lieu vao Railway...");
    console.log("   (Co the mat vai phut, vui long cho...)\n");

    // Loai bo comment va chia thanh cac batch nho
    const statements = sqlContent
      .split("\n")
      .filter((line) => !line.trim().startsWith("--") && line.trim() !== "")
      .join("\n")
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    let progress = 0;
    const total = statements.length;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      if (statement.trim().length > 0) {
        try {
          await connection.query(statement);
          progress++;

          // Hien thi progress moi 10%
          if (progress % Math.ceil(total / 10) === 0) {
            const percent = Math.round((progress / total) * 100);
            console.log(
              `   Progress: ${percent}% (${progress}/${total} statements)`
            );
          }
        } catch (err) {
          // Ignore mot so loi khong quan trong
          if (
            !err.message.includes("already exists") &&
            !err.message.includes("duplicate")
          ) {
            console.warn(`   Warning: ${err.message.substring(0, 100)}...`);
          }
        }
      }
    }

    console.log("✓ Import thanh cong!\n");

    // Buoc 4: Verify
    console.log("⏳ Buoc 5: Kiem tra du lieu...");

    const [tables] = await connection.query("SHOW TABLES");
    console.log(`✓ So luong bang: ${tables.length}`);

    const [menuItems] = await connection.query(
      "SELECT id, name, description FROM menu_items LIMIT 3"
    );
    console.log("\n✓ Test tieng Viet:");
    menuItems.forEach((item) => {
      console.log(
        `   - ${item.name}: ${item.description?.substring(0, 50)}...`
      );
    });

    const [counts] = await connection.query(`
      SELECT 
        (SELECT COUNT(*) FROM menu_items) as menu_count,
        (SELECT COUNT(*) FROM coupons) as coupon_count,
        (SELECT COUNT(*) FROM users) as user_count,
        (SELECT COUNT(*) FROM toppings) as topping_count
    `);

    console.log("\n✓ So luong du lieu:");
    console.log(`   - Menu items: ${counts[0].menu_count}`);
    console.log(`   - Coupons: ${counts[0].coupon_count}`);
    console.log(`   - Users: ${counts[0].user_count}`);
    console.log(`   - Toppings: ${counts[0].topping_count}`);

    console.log("\n==============================================");
    console.log("  ✅ HOAN TAT!");
    console.log("==============================================\n");
    console.log("Next steps:");
    console.log("  1. Chay: npm run dev");
    console.log("  2. Mo: http://localhost:3000/menu");
    console.log("  3. Kiem tra tieng Viet hien thi dung\n");
    console.log("Admin login:");
    console.log("  - Username: admin");
    console.log("  - Password: admin123\n");
  } catch (error) {
    console.error("\n❌ LOI:", error.message);
    console.error("\nChi tiet:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("✓ Da dong ket noi database\n");
    }
  }
}

// Chay script
importDatabase();
