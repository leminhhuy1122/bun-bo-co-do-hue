# Hướng dẫn cập nhật Database trên Railway

## Vấn đề
Database hiện tại bị lỗi encoding tiếng Việt khi deploy lên Railway/Vercel.

## Giải pháp
Đã tạo file SQL mới với encoding UTF8MB4 đầy đủ: `database/bun_bo_hue_co_do_railway.sql`

## Cách cập nhật Database trên Railway

### Phương án 1: Sử dụng Railway Dashboard (KHUYẾN NGHỊ)

1. **Truy cập Railway Dashboard**:
   - Vào https://railway.app/
   - Chọn project của bạn
   - Click vào MySQL service

2. **Mở MySQL Query Editor**:
   - Click tab "Query" hoặc "Data"
   - Hoặc click "Connect" để lấy thông tin kết nối

3. **Import Database**:
   - Click "Import" hoặc "Execute SQL"
   - Copy toàn bộ nội dung file `database/bun_bo_hue_co_do_railway.sql`
   - Paste và Execute

### Phương án 2: Sử dụng MySQL Workbench

1. **Tải MySQL Workbench**: https://dev.mysql.com/downloads/workbench/

2. **Kết nối đến Railway**:
   ```
   Host: nozomi.proxy.rlwy.net
   Port: 53540
   Username: root
   Password: YkiTcRzEAsDvItFFtNlZLEqwfshFQxUu
   Database: railway
   ```

3. **Import SQL**:
   - File → Run SQL Script
   - Chọn file `database/bun_bo_hue_co_do_railway.sql`
   - Click Run

### Phương án 3: Sử dụng Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Connect to MySQL and import
railway run mysql -h $MYSQLHOST -u $MYSQLUSER -p$MYSQLPASSWORD $MYSQLDATABASE < database/bun_bo_hue_co_do_railway.sql
```

### Phương án 4: Sử dụng TablePlus (Đơn giản nhất)

1. **Tải TablePlus**: https://tableplus.com/
2. **Tạo connection mới** với thông tin từ `.env.local`
3. **Import SQL**: File → Import → From SQL Dump
4. Chọn file `database/bun_bo_hue_co_do_railway.sql`

## Verify sau khi import

Chạy các query sau để kiểm tra:

```sql
-- Kiểm tra encoding
SHOW VARIABLES LIKE 'character_set%';
SHOW VARIABLES LIKE 'collation%';

-- Kiểm tra bảng
SHOW TABLES;

-- Kiểm tra dữ liệu tiếng Việt
SELECT * FROM menu_items LIMIT 5;
SELECT * FROM settings;

-- Kiểm tra số lượng records
SELECT 
    (SELECT COUNT(*) FROM menu_items) as menu_count,
    (SELECT COUNT(*) FROM coupons) as coupon_count,
    (SELECT COUNT(*) FROM users) as user_count;
```

Kết quả mong đợi:
- ✅ Tiếng Việt hiển thị đúng (không bị ��� hoặc ???)
- ✅ Có ít nhất 20 menu items
- ✅ Có 5 coupons
- ✅ Có 1 admin user (username: admin, password: admin123)

## Thông tin quan trọng

### Admin Login
- Username: `admin`
- Password: `admin123`

### Test Database
Sau khi import, test bằng cách:
1. Restart Next.js local: `npm run dev`
2. Truy cập http://localhost:3000
3. Kiểm tra menu có hiển thị tiếng Việt đúng không
4. Thử đặt hàng để test toàn bộ flow

## Deployment lên Vercel

Sau khi database đã OK:

```bash
# 1. Commit và push code mới
git add .
git commit -m "Fix Vietnamese encoding in database"
git push origin main

# 2. Vercel sẽ tự động deploy
# Kiểm tra log tại: https://vercel.com/dashboard
```

## Troubleshooting

### Lỗi: "Access denied"
- Kiểm tra lại password trong `.env.local`
- Đảm bảo Railway MySQL service đang chạy
- Thử reset password từ Railway Dashboard

### Lỗi: "Connection timeout"
- Kiểm tra firewall/antivirus
- Thử kết nối từ mạng khác
- Kiểm tra Railway service status

### Tiếng Việt vẫn bị lỗi
- Đảm bảo đã import file `bun_bo_hue_co_do_railway.sql` (không phải file cũ)
- Check encoding của database: `SHOW CREATE DATABASE railway;`
- Phải là: `CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`

## Files đã được tối ưu

1. ✅ `database/bun_bo_hue_co_do_railway.sql` - Database mới với UTF8MB4
2. ✅ `src/lib/db.ts` - Loại bỏ cảnh báo collation
3. ✅ `.env.local` - Cấu hình kết nối Railway

## Next Steps

1. Import database mới vào Railway (chọn một trong 4 phương án trên)
2. Test local: `npm run dev`
3. Commit code: `git add . && git commit -m "Fix database encoding"`
4. Push: `git push origin main`
5. Vercel auto-deploy
6. Test production site

---

**Lưu ý**: File SQL mới đã loại bỏ dữ liệu test (orders, logs) để database sạch sẽ. Chỉ giữ lại:
- Menu items (21 món)
- Coupons (5 mã)
- Settings cơ bản
- Toppings (6 loại)
- Admin user (1 account)
