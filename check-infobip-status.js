// Check Infobip SMS Status and Configuration
require("dotenv").config({ path: ".env.local" });

const INFOBIP_API_KEY = process.env.INFOBIP_API_KEY;
const INFOBIP_BASE_URL =
  process.env.INFOBIP_BASE_URL || "https://api.infobip.com";

async function checkInfobipStatus() {
  console.log("\n🔍 KIỂM TRA INFOBIP CONFIGURATION\n");
  console.log("━".repeat(60));

  // 1. Check API Key
  console.log("\n1️⃣  API KEY:");
  if (!INFOBIP_API_KEY) {
    console.log("   ❌ Không tìm thấy INFOBIP_API_KEY trong .env.local");
    return;
  }
  console.log(`   ✅ API Key: ${INFOBIP_API_KEY.substring(0, 20)}...`);
  console.log(`   📡 Base URL: ${INFOBIP_BASE_URL}`);

  // 2. Check account balance
  console.log("\n2️⃣  ACCOUNT BALANCE:");
  try {
    const balanceResponse = await fetch(
      `${INFOBIP_BASE_URL}/account/1/balance`,
      {
        headers: {
          Authorization: `App ${INFOBIP_API_KEY}`,
          Accept: "application/json",
        },
      }
    );

    if (balanceResponse.ok) {
      const balance = await balanceResponse.json();
      console.log("   ✅ Kết nối thành công!");
      console.log(`   💰 Balance: ${balance.balance} ${balance.currency}`);
    } else {
      const error = await balanceResponse.text();
      console.log("   ❌ Không thể lấy balance:", balanceResponse.status);
      console.log("   📄 Response:", error);
    }
  } catch (error) {
    console.log("   ❌ Lỗi kết nối:", error.message);
  }

  // 3. Check recent SMS logs
  console.log("\n3️⃣  SMS LOGS (24h gần nhất):");
  try {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const logsUrl = `${INFOBIP_BASE_URL}/sms/1/logs?from=${yesterday.toISOString()}&to=${now.toISOString()}&limit=5`;

    const logsResponse = await fetch(logsUrl, {
      headers: {
        Authorization: `App ${INFOBIP_API_KEY}`,
        Accept: "application/json",
      },
    });

    if (logsResponse.ok) {
      const logs = await logsResponse.json();
      console.log(
        `   ✅ Tìm thấy ${logs.results?.length || 0} SMS trong 24h qua\n`
      );

      if (logs.results && logs.results.length > 0) {
        logs.results.forEach((log, index) => {
          console.log(`   📨 SMS #${index + 1}:`);
          console.log(`      ID: ${log.messageId}`);
          console.log(`      To: ${log.to}`);
          console.log(`      From: ${log.from}`);
          console.log(
            `      Status: ${log.status?.name || "Unknown"} (${
              log.status?.groupName || "Unknown"
            })`
          );
          console.log(`      Text: ${log.text?.substring(0, 50)}...`);

          if (log.error) {
            console.log(
              `      ❌ Error: ${log.error.name} - ${log.error.description}`
            );
          }

          console.log("");
        });
      } else {
        console.log("   📭 Chưa có SMS nào được gửi");
      }
    } else {
      const error = await logsResponse.text();
      console.log("   ⚠️  Không thể lấy logs:", logsResponse.status);
      console.log("   📄 Response:", error);
    }
  } catch (error) {
    console.log("   ❌ Lỗi khi lấy logs:", error.message);
  }

  // 4. Test send SMS
  console.log("\n4️⃣  TEST GỬI SMS:");
  console.log("   ⚠️  Nhập số điện thoại để test (VD: +84901234567)");
  console.log("   💡 Lưu ý: Số phải có format +84... (không phải 0...)");
  console.log("   💡 Nếu không có brand name active, dùng số thay vì tên");

  console.log("\n━".repeat(60));
  console.log("\n📋 KẾT LUẬN:");
  console.log("   1. Kiểm tra balance có đủ credit không");
  console.log("   2. Kiểm tra SMS logs để thấy lỗi cụ thể");
  console.log("   3. Số điện thoại phải có format quốc tế: +84...");
  console.log("   4. Brand name phải được Infobip approve trước");
  console.log("   5. Nếu brand chưa active, dùng số điện thoại làm sender\n");
}

checkInfobipStatus().catch(console.error);
