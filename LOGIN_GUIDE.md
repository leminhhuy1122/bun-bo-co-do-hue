# 🔐 HƯỚNG DẪN ĐĂNG NHẬP & QUẢN LÝ USER

## ✅ Đã sửa xong!

### Vấn đề cũ:

- Trang admin đang dùng **hardcoded login** (kiểm tra cứng `admin/admin123`)
- Không gọi API `/api/auth/login` thật từ database
- Dù tạo user mới trong database vẫn không đăng nhập được

### Đã sửa:

- ✅ Trang admin giờ **gọi API login thật** từ database
- ✅ Kiểm tra username/password qua bcrypt
- ✅ Lưu token vào localStorage
- ✅ Auto-login khi reload trang (nếu có token hợp lệ)
- ✅ Xóa dòng "Demo: admin / admin123"

---

## 📝 Cách sử dụng

### 1. **Đăng nhập với tài khoản Admin mặc định**

Trong database có sẵn 1 admin:

```
Username: admin
Password: admin123
```

**Cách đăng nhập:**

1. Mở: `http://localhost:3000/admin`
2. Nhập: `admin` / `admin123`
3. Click "Đăng Nhập"
4. ✅ Thành công!

---

### 2. **Tạo tài khoản Staff mới**

**Sau khi đăng nhập admin:**

1. Click tab **"Quản Lý Nhân Viên"** (icon UserPlus)
2. Click nút **"Thêm Nhân Viên"**
3. Điền form:
   - **Tên đăng nhập**: `staff1` (ví dụ)
   - **Mật khẩu**: `password123` (ví dụ)
   - **Vai trò**: Chọn `Staff` hoặc `Admin`
4. Click **"Thêm"**
5. ✅ Toast: "Thêm nhân viên thành công"

**Đăng xuất và test:**

1. Click nút "Đăng Xuất" (dưới sidebar)
2. Đăng nhập lại với `staff1` / `password123`
3. ✅ Đăng nhập thành công!

---

### 3. **Kiểm tra user trong database**

**Cách 1: Qua phpMyAdmin**

```sql
SELECT id, username, role, status, created_at
FROM users
ORDER BY created_at DESC;
```

**Cách 2: Qua API (nếu cần)**

```bash
# GET danh sách staff
curl http://localhost:3000/api/staff
```

---

## 🔒 Bảo mật

### Password Hashing:

- Tất cả password được hash bằng **bcryptjs** (salt rounds: 10)
- Không lưu plain text password
- Hash mẫu: `$2a$10$rLFUZvF3qZ6x...`

### JWT Token:

- Lưu trong `localStorage` với key `adminToken`
- Chứa: `{ id, username, role }`
- Expire: 7 ngày (config trong `.env.local`)

### Status Check:

- Chỉ user có `status = 'active'` mới đăng nhập được
- Có thể disable user bằng cách set `status = 'inactive'`

---

## 🛠️ Troubleshooting

### ❌ "Tên đăng nhập không tồn tại"

**Nguyên nhân:**

- Username không có trong database
- Hoặc user có `status = 'inactive'`

**Giải pháp:**

```sql
-- Kiểm tra user
SELECT * FROM users WHERE username = 'staff1';

-- Nếu status = 'inactive', set lại:
UPDATE users SET status = 'active' WHERE username = 'staff1';
```

---

### ❌ "Mật khẩu không đúng"

**Nguyên nhân:**

- Password nhập sai
- Password hash trong DB bị lỗi

**Giải pháp:**

1. Thử lại password cẩn thận
2. Hoặc reset password qua SQL:

```sql
-- Reset password thành "newpass123"
-- (hash này là của "newpass123")
UPDATE users
SET password = '$2a$10$XqZ8JvF3qZ6xqXkqYQGxk.7bN/8YXvQVJqvC8x9FqH.oCKF0Z0LNO'
WHERE username = 'staff1';
```

---

### ❌ "Lỗi kết nối đến server"

**Nguyên nhân:**

- Server không chạy
- Database không kết nối được

**Giải pháp:**

```bash
# 1. Kiểm tra server đang chạy
npm run dev

# 2. Kiểm tra XAMPP MySQL đang bật
# 3. Test API trực tiếp:
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 📊 Database Schema

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,        -- bcrypt hash
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    role ENUM('admin', 'staff', 'customer') DEFAULT 'customer',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🎯 Role-Based Access (Tương lai)

**Hiện tại**: Tất cả user đăng nhập đều thấy full dashboard

**Nâng cao** (có thể làm thêm):

```typescript
// Ẩn tab Staff nếu user không phải admin
{
  currentUser?.role === "admin" && (
    <button onClick={() => setActiveTab("staff")}>
      <UserPlus size={20} />
      <span>Quản Lý Nhân Viên</span>
    </button>
  );
}
```

---

## ✅ Test Checklist

- [x] Đăng nhập với admin/admin123
- [ ] Tạo staff mới qua tab "Quản Lý Nhân Viên"
- [ ] Đăng xuất
- [ ] Đăng nhập với staff vừa tạo
- [ ] Kiểm tra token được lưu trong localStorage
- [ ] Reload trang, vẫn giữ đăng nhập
- [ ] Đăng nhập sai password → hiện lỗi
- [ ] Đăng nhập username không tồn tại → hiện lỗi

---

## 📞 Hỗ trợ

Nếu vẫn gặp vấn đề, check:

1. Console log trong browser (F12)
2. Terminal log của Next.js server
3. MySQL error log trong XAMPP

**Happy coding!** 🚀
