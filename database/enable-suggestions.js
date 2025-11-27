// Enable some existing coupons to show in suggestions
const mysql = require("mysql2/promise");
require("dotenv").config({ path: ".env.local" });

async function enableSuggestions() {
  let connection;

  try {
    console.log("🔄 Connecting to database...");

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("✅ Connected!\n");

    // Get all active coupons
    console.log("📋 Fetching active coupons...");
    const [coupons] = await connection.query(`
      SELECT id, code, description, discount_type, discount_value
      FROM coupons 
      WHERE is_active = TRUE
      ORDER BY created_at ASC
      LIMIT 6
    `);

    if (coupons.length === 0) {
      console.log(
        "⚠️  No active coupons found. Please create some coupons first."
      );
      return;
    }

    console.log(`Found ${coupons.length} active coupons:\n`);
    coupons.forEach((c, i) => {
      console.log(`${i + 1}. ${c.code} - ${c.description}`);
    });

    // Enable them for suggestions
    console.log("\n🔧 Enabling coupons for suggestions...");

    for (let i = 0; i < coupons.length; i++) {
      const coupon = coupons[i];
      const priority = i + 1; // 1, 2, 3, ...

      // Auto-generate badge if not exists
      let badge = "";
      if (coupon.discount_type === "percentage") {
        badge = `-${coupon.discount_value}%`;
      } else {
        badge = `-${Math.floor(coupon.discount_value / 1000)}K`;
      }

      await connection.query(
        `
        UPDATE coupons 
        SET 
          show_in_suggestions = TRUE,
          suggestion_priority = ?,
          suggestion_badge = ?
        WHERE id = ?
      `,
        [priority, badge, coupon.id]
      );

      console.log(`✅ ${coupon.code}: Priority ${priority}, Badge "${badge}"`);
    }

    console.log(
      "\n✨ Successfully enabled suggestions for all active coupons!"
    );
    console.log("🎉 Reload the checkout page to see them.\n");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

enableSuggestions();
