# 📁 Database Scripts

Thư mục này chứa các scripts và migrations cho database của dự án Bún Bò Huế Cổ Đô.

## 📋 Danh Sách Files

### 🗄️ Setup Scripts

#### `railway_complete.sql`

- **Mô tả**: Database dump hoàn chỉnh tối ưu cho Railway MySQL 8.0+
- **Bao gồm**:
  - Schema đầy đủ (17 tables)
  - Sample data (admin, menu, coupons)
  - UTF8MB4 encoding
- **Sử dụng**: Setup database mới hoặc restore từ backup
- **Chạy khi**: Lần đầu setup project, deploy lên Railway, hoặc restore

```bash
# Via MySQL client
mysql -h <host> -u <user> -p<password> <database> < database/railway_complete.sql

# Via Railway CLI
railway run mysql -h <host> -u <user> -p < database/railway_complete.sql
```

### 🔄 Migration Scripts

#### `migration_add_suggestion_columns.sql`

- **Mô tả**: Thêm các cột quản lý gợi ý mã giảm giá
- **Chức năng**:
  - Thêm `show_in_suggestions` (boolean)
  - Thêm `suggestion_priority` (int)
  - Thêm `suggestion_badge` (varchar)
- **Chạy thủ công**:

```bash
mysql -h <host> -u <user> -p<password> <database> < database/migration_add_suggestion_columns.sql
```

- **Chạy qua Node.js** (khuyến nghị):

```bash
node database/run-migration.js
```

### 🔧 Utility Scripts

#### `run-migration.js`

- **Mô tả**: Script Node.js để chạy migration an toàn
- **Tính năng**:
  - ✅ Kiểm tra cột đã tồn tại chưa
  - ✅ Hiển thị table structure trước/sau
  - ✅ Error handling tốt
  - ✅ Auto-rollback nếu lỗi
- **Sử dụng**:

```bash
node database/run-migration.js
```

#### `enable-suggestions.js`

- **Mô tả**: Enable suggestions cho các mã giảm giá active
- **Tính năng**:
  - 🔍 Tự động tìm 6 mã active gần nhất
  - 🏆 Tự động gán priority (1-6)
  - 🏷️ Tự động tạo badge labels
  - 💾 Update database
- **Sử dụng**:

```bash
node database/enable-suggestions.js
```

## 🚀 Quick Start Guide

### Lần Đầu Setup Project

1. **Tạo database mới**:

```bash
mysql -h <host> -u <user> -p
CREATE DATABASE railway;
```

2. **Import full setup**:

```bash
mysql -h <host> -u <user> -p railway < database/railway_complete.sql
```

3. **Chạy migration** (nếu cần):

```bash
node database/run-migration.js
```

4. **Enable một số suggestions**:

```bash
node database/enable-suggestions.js
```

### Cập Nhật Database Đang Chạy

1. **Chạy migration mới**:

```bash
node database/run-migration.js
```

2. **Verify**:

```bash
node database/enable-suggestions.js
```

### Backup & Restore

#### Backup Database

```bash
mysqldump -h <host> -u <user> -p railway > backup_$(date +%Y%m%d).sql
```

#### Restore Database

```bash
mysql -h <host> -u <user> -p railway < backup_20251127.sql
```

## 📊 Database Schema

### Coupons Table Structure

Sau khi chạy migration, bảng `coupons` có các cột sau:

| Column                    | Type            | Default   | Description                |
| ------------------------- | --------------- | --------- | -------------------------- |
| `id`                      | int             | AUTO      | Primary key                |
| `code`                    | varchar(50)     | -         | Mã giảm giá (unique)       |
| `description`             | varchar(255)    | -         | Mô tả                      |
| `discount_type`           | enum            | -         | 'percentage' hoặc 'fixed'  |
| `discount_value`          | decimal(10,2)   | -         | Giá trị giảm               |
| `min_order_amount`        | decimal(10,2)   | 0         | Đơn hàng tối thiểu         |
| `max_discount_amount`     | decimal(10,2)   | NULL      | Giảm tối đa                |
| `usage_limit`             | int             | NULL      | Giới hạn sử dụng           |
| `used_count`              | int             | 0         | Đã sử dụng                 |
| `valid_from`              | timestamp       | NOW       | Hiệu lực từ                |
| `valid_until`             | timestamp       | NULL      | Hiệu lực đến               |
| `is_active`               | boolean         | TRUE      | Active/Inactive            |
| `show_in_popup`           | boolean         | FALSE     | Hiện popup trang chủ       |
| `popup_priority`          | int             | 999       | Thứ tự popup               |
| `popup_badge`             | varchar(20)     | NULL      | Badge popup                |
| `popup_gradient`          | varchar(100)    | NULL      | Gradient popup             |
| **`show_in_suggestions`** | **boolean**     | **FALSE** | **Hiện gợi ý checkout** ⭐ |
| **`suggestion_priority`** | **int**         | **999**   | **Thứ tự gợi ý** ⭐        |
| **`suggestion_badge`**    | **varchar(50)** | **NULL**  | **Badge gợi ý** ⭐         |

⭐ = Cột mới được thêm bởi migration

## 🔐 Environment Variables

Các scripts sử dụng biến môi trường từ `.env.local`:

```env
DB_HOST=shuttle.proxy.rlwy.net
DB_PORT=33172
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=railway
```

## ⚠️ Lưu Ý

1. **Backup trước khi migration**: Luôn backup database trước khi chạy migration
2. **Test trên local**: Test migration trên local database trước
3. **Check dependencies**: Đảm bảo đã cài `mysql2` package
4. **Verify sau migration**: Luôn verify table structure sau khi chạy

## 🐛 Troubleshooting

### Lỗi: "Column already exists"

```bash
# Migration script tự động kiểm tra, nhưng nếu cần drop:
ALTER TABLE coupons DROP COLUMN show_in_suggestions;
ALTER TABLE coupons DROP COLUMN suggestion_priority;
ALTER TABLE coupons DROP COLUMN suggestion_badge;
```

### Lỗi: "mysql2 not found"

```bash
npm install mysql2
```

### Lỗi: "Connection refused"

```bash
# Kiểm tra .env.local có đúng không
cat .env.local | grep DB_
```

## 📚 Tài Liệu Liên Quan

- [Main README](../README.md)
- [API Documentation](../src/app/api/README.md)
- [Admin Guide](../docs/ADMIN_GUIDE.md)
