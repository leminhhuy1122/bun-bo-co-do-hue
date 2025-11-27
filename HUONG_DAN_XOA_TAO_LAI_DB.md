# HUONG DAN XOA VA TAO LAI DATABASE RAILWAY

## Cach 1: Su dung Railway Dashboard

### Buoc 1: Xoa database cu

1. Vao https://railway.app/
2. Chon project > MySQL service
3. Click tab "Query" hoac "Data"
4. Copy va chay lenh nay:

```sql
DROP DATABASE IF EXISTS railway;
CREATE DATABASE railway CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE railway;
```

### Buoc 2: Import database moi

1. Mo file: database/bun_bo_hue_co_do_railway.sql
2. Copy TOAN BO noi dung
3. Paste vao Query Editor cua Railway
4. Click Execute (hoac Ctrl+Enter)

### Buoc 3: Verify

Chay lenh nay de kiem tra:

```sql
-- Kiem tra encoding
SHOW VARIABLES LIKE 'character_set_database';
SHOW VARIABLES LIKE 'collation_database';

-- Kiem tra du lieu tieng Viet
SELECT id, name, description FROM menu_items LIMIT 5;
```

Neu hien thi dung tieng Viet (khong co ???) la thanh cong!

---

## Cach 2: Su dung TablePlus (KHUYEN NGHI)

### Tai TablePlus

https://tableplus.com/ (Free trial)

### Ket noi Railway MySQL

- Host: nozomi.proxy.rlwy.net
- Port: 53540
- User: root
- Password: YkiTcRzEAsDvItFFtNlZLEqwfshFQxUu
- Database: railway

### Import Database

1. Click nut "+" > New Connection > MySQL
2. Nhap thong tin tren
3. Click "Test" de thu ket noi
4. Click "Connect"
5. Chuot phai vao database "railway" > "Drop Database"
6. Chuot phai > "Create Database" > Ten: railway, Charset: utf8mb4, Collation: utf8mb4_unicode_ci
7. File > Import > From SQL Dump
8. Chon file: database/bun_bo_hue_co_do_railway.sql
9. Execute

---

## Cach 3: Su dung PowerShell Script (TU DONG)

Chay lenh nay:

```powershell
cd "d:\hoc_tap\lap trinh web\huy test"
.\update-db-railway.ps1
```

Khi hoi "Are you sure you want to continue?", go "yes"

Script se tu dong:

1. Xoa database cu
2. Tao database moi voi UTF8MB4
3. Import du lieu moi
4. Verify encoding
5. Test tieng Viet

---

## Cach 4: Su dung MySQL Command Line

```powershell
# Ket noi vao Railway MySQL
mysql -h nozomi.proxy.rlwy.net -P 53540 -u root -p

# Khi duoc hoi password, nhap: YkiTcRzEAsDvItFFtNlZLEqwfshFQxUu

# Trong MySQL prompt, chay:
DROP DATABASE IF EXISTS railway;
CREATE DATABASE railway CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE railway;
SOURCE database/bun_bo_hue_co_do_railway.sql;
exit;
```

---

## Sau khi import thanh cong

### Test local:

```powershell
npm run dev
```

Mo http://localhost:3000/menu
Kiem tra tieng Viet hien thi dung

### Test admin:

1. Vao http://localhost:3000/admin
2. Login voi:
   - Username: admin
   - Password: admin123

### Neu OK:

- Code da duoc push len GitHub
- Vercel se tu dong deploy sau vai phut
- Kiem tra production site

---

## Troubleshooting

### Loi: "Access denied"

- Kiem tra lai password trong .env.local
- Copy chinh xac password: YkiTcRzEAsDvItFFtNlZLEqwfshFQxUu

### Loi: "Connection timeout"

- Kiem tra internet connection
- Thu tat firewall/antivirus
- Thu ket noi tu mang khac

### Tieng Viet van bi loi

- Dam bao import file bun_bo_hue_co_do_railway.sql (KHONG PHAI file cu)
- Kiem tra encoding:
  ```sql
  SHOW CREATE DATABASE railway;
  ```
  Phai co: CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci

### File SQL qua lon, upload lau

- Su dung TablePlus hoac MySQL Workbench (nhanh hon)
- Hoac chia nho file SQL thanh nhieu phan

---

## Thong tin quan trong

### Database Info:

- Host: nozomi.proxy.rlwy.net
- Port: 53540
- Database: railway
- User: root
- Password: YkiTcRzEAsDvItFFtNlZLEqwfshFQxUu

### Admin Login:

- Username: admin
- Password: admin123

### Du lieu moi bao gom:

- 21 menu items (mon an)
- 5 coupons (ma giam gia)
- 1 admin user
- 6 toppings
- Settings co ban
- Khong co du lieu test (orders, logs)

---

## Check final

Sau khi import xong, chay test nay:

```sql
-- Check so luong data
SELECT
    (SELECT COUNT(*) FROM menu_items) as menu_count,
    (SELECT COUNT(*) FROM coupons) as coupon_count,
    (SELECT COUNT(*) FROM users) as user_count,
    (SELECT COUNT(*) FROM toppings) as topping_count;

-- Ket qua mong doi:
-- menu_count: 21
-- coupon_count: 5
-- user_count: 1
-- topping_count: 6

-- Test tieng Viet
SELECT name, description FROM menu_items WHERE id = 15;
-- Phai hien thi: "Bún Bò Đặc Biệt" (khong co ???)
```

Neu tat ca deu OK, xong! 🎉
