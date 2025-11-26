# 🔧 SỬA LỖI ĐĂNG NHẬP ADMIN

## ❌ Vấn đề

Tài khoản admin không đăng nhập được vì:

- Password hash trong database **không đúng** với password `admin123`
- Hash cũ: `$2a$10$rLFUZvF3qZ6x...` (sai)
- Hash mới: `$2b$10$oOIGxPzZbuKPZfqe9zi57uRiZPZZHC9HfP2Dah6s9FsmogjQhTeuO` (đúng)

## ✅ Giải pháp

### Cách 1: Chạy lại SQL Setup (Nếu chưa có data quan trọng)

1. Mở **phpMyAdmin**
2. Chọn database `bun_bo_hue_co_do`
3. Click tab **"SQL"**
4. Mở file: `database/FULL_DATABASE_SETUP.sql`
5. Copy toàn bộ nội dung
6. Paste vào phpMyAdmin
7. Click **"Go"**
8. ✅ Xong!

**Đăng nhập:**

- Username: `admin`
- Password: `admin123`

---

### Cách 2: Chỉ Update Password (Nếu đã có data)

1. Mở **phpMyAdmin**
2. Chọn database `bun_bo_hue_co_do`
3. Click tab **"SQL"**
4. Copy & paste lệnh này:

```sql
UPDATE users
SET password = '$2b$10$oOIGxPzZbuKPZfqe9zi57uRiZPZZHC9HfP2Dah6s9FsmogjQhTeuO'
WHERE username = 'admin';
```

5. Click **"Go"**
6. ✅ Xong!

**Hoặc dùng file có sẵn:**

- Mở file: `database/UPDATE_ADMIN_PASSWORD.sql`
- Copy toàn bộ
- Paste vào phpMyAdmin → Go

---

### Cách 3: Test qua Terminal (Nếu cần verify)

```bash
# Chạy script test hash
node generate-admin-hash.js
```

Kết quả sẽ hiện:

```
Password: admin123
Hash: $2b$10$oOIGxPzZbuKPZfqe9zi57uRiZPZZHC9HfP2Dah6s9FsmogjQhTeuO
```

---

## 🔍 Kiểm tra Database

### Xem user hiện tại:

```sql
SELECT id, username, role, status,
       LEFT(password, 20) as password_preview
FROM users
WHERE username = 'admin';
```

**Kết quả mong muốn:**

```
id: 1
username: admin
role: admin
status: active
password_preview: $2b$10$oOIGxPzZbuKP...
```

⚠️ **Quan trọng**: Password phải bắt đầu bằng `$2b$10$` (không phải `$2a$10$`)

---

## 🧪 Test Đăng Nhập

### 1. Qua Browser:

```
URL: http://localhost:3004/admin
Username: admin
Password: admin123
```

### 2. Qua API (curl):

```bash
curl -X POST http://localhost:3004/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Response mong muốn:**

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin",
      "full_name": "Quản Trị Viên"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 🔒 Về Bcrypt Hash

### Sự khác biệt:

- `$2a$` - Bcrypt version cũ (có thể không tương thích)
- `$2b$` - Bcrypt version mới (khuyến nghị)

### Cấu trúc Hash:

```
$2b$10$oOIGxPzZbuKPZfqe9zi57uRiZPZZHC9HfP2Dah6s9FsmogjQhTeuO
│  │  │  └─────────────────────────┬──────────────────────────┘
│  │  │                            └─ Hash value (53 chars)
│  │  └─ Salt (22 chars)
│  └─ Cost factor (10 = 2^10 iterations)
└─ Algorithm version ($2b)
```

---

## 🛠️ Troubleshooting

### ❌ Vẫn không đăng nhập được?

#### 1. Kiểm tra Console Log (F12):

```javascript
// Browser Console
localStorage.getItem("adminToken");
localStorage.getItem("adminUser");
```

#### 2. Kiểm tra Terminal Log:

```
Login Error: ...
```

#### 3. Kiểm tra Database Connection:

```sql
-- Test connection
SELECT 1;

-- Check users table exists
SHOW TABLES LIKE 'users';

-- Count users
SELECT COUNT(*) FROM users;
```

#### 4. Reset hoàn toàn:

```sql
-- Xóa user cũ
DELETE FROM users WHERE username = 'admin';

-- Insert lại với hash mới
INSERT INTO users (username, password, full_name, email, phone, role) VALUES
('admin', '$2b$10$oOIGxPzZbuKPZfqe9zi57uRiZPZZHC9HfP2Dah6s9FsmogjQhTeuO', 'Quản Trị Viên', 'admin@bunbohuecodo.vn', '0901234567', 'admin');
```

---

## 📁 Files Đã Cập Nhật

1. ✅ `database/FULL_DATABASE_SETUP.sql` - Hash đã được cập nhật
2. ✅ `database/UPDATE_ADMIN_PASSWORD.sql` - File update riêng
3. ✅ `generate-admin-hash.js` - Script tạo hash mới

---

## ✅ Checklist

- [ ] Đã chạy `database/UPDATE_ADMIN_PASSWORD.sql` trong phpMyAdmin
- [ ] Đã verify hash trong database bắt đầu bằng `$2b$10$`
- [ ] Đã test đăng nhập với admin/admin123
- [ ] Đã check localStorage có token sau khi login
- [ ] Server đang chạy (npm run dev)
- [ ] XAMPP MySQL đang bật

---

**Giờ đăng nhập sẽ hoạt động!** 🎉

Nếu vẫn lỗi, check:

1. Browser Console (F12) → Tab Console
2. Network tab → Request to /api/auth/login
3. Server terminal → Error logs
