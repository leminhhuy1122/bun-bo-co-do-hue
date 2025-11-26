# 🔒 Role-Based Access Control - Hoàn thành!

## ✅ Đã áp dụng

### Tính năng mới:

- **Staff/User** (role != 'admin'): **KHÔNG thấy** tab "Quản Lý Nhân Viên"
- **Admin** (role = 'admin'): Thấy **đầy đủ** tất cả tabs

### Cách hoạt động:

```typescript
// 1. Load thông tin user từ localStorage
const [currentUser, setCurrentUser] = useState<{
  id: number;
  username: string;
  role: string;
  full_name: string;
} | null>(null);

useEffect(() => {
  const userStr = localStorage.getItem("adminUser");
  if (userStr) {
    const user = JSON.parse(userStr);
    setCurrentUser(user);
  }
}, []);

// 2. Ẩn button Staff trong sidebar
{
  currentUser?.role === "admin" && (
    <button onClick={() => setActiveTab("staff")}>
      <UserPlus size={20} />
      <span>Quản Lý Nhân Viên</span>
    </button>
  );
}

// 3. Ẩn content StaffTab
{
  activeTab === "staff" && currentUser?.role === "admin" && (
    <StaffTab showToast={showToast} />
  );
}
```

## 🎯 Test Case

### 1. Admin Login:

```
Username: admin
Password: admin123
Role: admin

✅ Thấy tất cả 9 tabs:
- Dashboard
- Quản Lý Đơn Hàng
- Quản Lý Thực Đơn
- Quản Lý Đặt Bàn
- Quản Lý Mã Giảm Giá
- Quản Lý Khách Hàng
- Thông Báo SMS
- Thông Báo Email
- Quản Lý Nhân Viên ⭐
```

### 2. Staff Login:

```
Username: staff1
Password: password123
Role: staff

✅ Chỉ thấy 8 tabs:
- Dashboard
- Quản Lý Đơn Hàng
- Quản Lý Thực Đơn
- Quản Lý Đặt Bàn
- Quản Lý Mã Giảm Giá
- Quản Lý Khách Hàng
- Thông Báo SMS
- Thông Báo Email
❌ KHÔNG thấy: Quản Lý Nhân Viên
```

## 📝 Hướng dẫn test

### Bước 1: Tạo staff account

1. Login admin: `admin` / `admin123`
2. Vào tab "Quản Lý Nhân Viên"
3. Click "Thêm Nhân Viên"
4. Nhập:
   - Username: `staff1`
   - Password: `test123`
   - Role: **Staff**
5. Click "Thêm"

### Bước 2: Test với staff

1. Đăng xuất
2. Login: `staff1` / `test123`
3. ✅ Kiểm tra sidebar → KHÔNG có tab "Quản Lý Nhân Viên"

### Bước 3: Test lại admin

1. Đăng xuất
2. Login: `admin` / `admin123`
3. ✅ Kiểm tra sidebar → CÓ tab "Quản Lý Nhân Viên"

## 🔐 Security Notes

### Hiện tại:

- ✅ UI Level: Ẩn button và content
- ⚠️ API Level: Chưa có middleware check role

### Nên làm thêm (Optional):

```typescript
// src/app/api/staff/route.ts
export async function GET() {
  // Thêm check role từ token
  const token = request.headers.get("authorization");
  const decoded = jwt.verify(token, JWT_SECRET);

  if (decoded.role !== "admin") {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 403 }
    );
  }

  // ... continue
}
```

## 🎨 Cải tiến trong tương lai

### 1. Permission System

```typescript
const permissions = {
  admin: [
    "dashboard",
    "orders",
    "menu",
    "reservations",
    "coupons",
    "customers",
    "sms",
    "email",
    "staff",
  ],
  staff: ["dashboard", "orders", "menu", "reservations"],
  viewer: ["dashboard"],
};
```

### 2. Fine-grained Control

```typescript
// Ví dụ: Staff chỉ xem được, không chỉnh sửa
{
  currentUser?.role === "staff" && (
    <button disabled className="opacity-50">
      Chỉnh sửa (Cần quyền Admin)
    </button>
  );
}
```

## ✅ Checklist

- [x] Ẩn button "Quản Lý Nhân Viên" với staff
- [x] Ẩn content StaffTab với staff
- [x] Load user info từ localStorage
- [x] Check role === "admin"
- [x] No compile errors
- [ ] Test với staff account
- [ ] Test với admin account
- [ ] Verify localStorage có đúng user info

---

**Hoàn thành!** Staff giờ không thể thấy hoặc truy cập tab Quản Lý Nhân Viên. 🎉
