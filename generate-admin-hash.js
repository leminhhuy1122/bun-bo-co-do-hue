const bcrypt = require("bcryptjs");

async function generateHash() {
  const password = "admin123";
  const hash = await bcrypt.hash(password, 10);
  console.log("\n=================================");
  console.log("Password:", password);
  console.log("Hash:", hash);
  console.log("=================================\n");
  console.log("SQL UPDATE command:");
  console.log(
    `UPDATE users SET password = '${hash}' WHERE username = 'admin';`
  );
  console.log("\n");
}

generateHash();
