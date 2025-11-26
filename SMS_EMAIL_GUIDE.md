# 📱📧 HƯỚNG DẪN CÁC HIỆN SMS & EMAIL

## 📋 MỤC LỤC

1. [Tổng quan](#tổng-quan)
2. [Cấu hình SMS](#cấu-hình-sms)
3. [Cấu hình Email](#cấu-hình-email)
4. [Cách sử dụng](#cách-sử-dụng)
5. [Troubleshooting](#troubleshooting)

---

## 🎯 TỔNG QUAN

### ✅ Các tính năng đã triển khai:

**SMS:**

- ✅ Gửi thông báo trạng thái đơn hàng (pending, confirmed, preparing, delivering, completed, cancelled)
- ✅ Gửi xác nhận đặt hàng
- ✅ Gửi xác nhận đặt bàn
- ✅ Lưu log vào database (`sms_logs`)
- ✅ Hỗ trợ simulation mode (không cần API key)
- ✅ Validate số điện thoại Việt Nam
- ✅ Format tự động (+84)

**Email:**

- ✅ Gửi email xác nhận đơn hàng (HTML đẹp)
- ✅ Gửi email thông báo trạng thái
- ✅ Lưu log vào database (`email_logs`)
- ✅ Responsive email template
- ✅ Support Gmail SMTP
- ✅ Simulation mode

---

## 📱 CẤU HÌNH SMS

### **Bước 1: Đăng ký tài khoản eSMS**

1. Truy cập: https://esms.vn
2. Đăng ký tài khoản mới
3. Nạp tiền (tối thiểu 100.000đ)
4. Lấy API Key và Secret Key tại: **Cấu hình → API**

### **Bước 2: Cấu hình trong `.env.local`**

```env
# CÁCH 1: Gửi không brandname (KHUYẾN NGHỊ cho testing)
SMS_ENABLED=true
ESMS_API_KEY=7F309E7E3EC1F8F898658AB62F8019
ESMS_SECRET_KEY=CA5887BE17F524D3B33F54A5C41E17
SMS_BRAND_NAME=          # ← ĐỂ TRỐNG

# CÁCH 2: Gửi có brandname (cho production)
SMS_ENABLED=true
ESMS_API_KEY=your_api_key_here
ESMS_SECRET_KEY=your_secret_key_here
SMS_BRAND_NAME=BBHCD    # ← Brandname đã được duyệt
```

### **Bước 3: Đăng ký Brandname (Optional - cho production)**

1. Login vào eSMS
2. Vào **Quản lý Brandname**
3. Đăng ký brandname mới: `BBHCD` hoặc `BunBoHueCoDo`
4. Upload giấy phép kinh doanh
5. Chờ duyệt 1-2 ngày làm việc
6. Sau khi duyệt, cập nhật vào `.env.local`

### **SMS Error Codes:**

| Code | Ý nghĩa              | Giải pháp               |
| ---- | -------------------- | ----------------------- |
| 100  | Thành công           | ✅                      |
| 104  | Brandname chưa duyệt | Set `SMS_BRAND_NAME=""` |
| 99   | Lỗi hệ thống         | Thử lại sau             |
| 101  | Hết tiền             | Nạp thêm tiền           |
| 102  | Tài khoản bị khóa    | Liên hệ support         |

---

## 📧 CẤU HÌNH EMAIL

### **Bước 1: Tạo App Password cho Gmail**

1. Truy cập: https://myaccount.google.com/apppasswords
2. Đăng nhập Gmail của bạn
3. Bật **Xác minh 2 bước** (nếu chưa bật)
4. Tạo **Mật khẩu ứng dụng**:
   - Chọn app: **Mail**
   - Chọn thiết bị: **Windows Computer**
   - Click **Tạo**
5. Copy mật khẩu 16 ký tự (dạng: `xxxx xxxx xxxx xxxx`)

### **Bước 2: Cấu hình trong `.env.local`**

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=youremail@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx    # ← App Password 16 ký tự
EMAIL_FROM_NAME=Bún Bò Huế Cố Đô
```

### **Hỗ trợ các email provider khác:**

**Outlook/Hotmail:**

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=youremail@outlook.com
EMAIL_PASSWORD=your_password
```

**Yahoo Mail:**

```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=youremail@yahoo.com
EMAIL_PASSWORD=your_app_password
```

---

## 🚀 CÁCH SỬ DỤNG

### **1. Gửi SMS từ Admin Panel**

1. Mở http://localhost:3003/admin
2. Vào tab **Đơn Hàng**
3. Click nút **📱 SMS** bên cạnh đơn hàng
4. SMS sẽ được gửi đến số điện thoại khách hàng

### **2. Gửi Email từ Admin Panel**

1. Mở http://localhost:3003/admin
2. Vào tab **Đơn Hàng**
3. Click nút **📧 Email** bên cạnh đơn hàng
4. Email sẽ được gửi đến email khách hàng

### **3. Xem lịch sử SMS/Email**

**SMS:**

- Admin → Tab **SMS** → Xem lịch sử gửi, thống kê

**Email:**

- Kiểm tra database table `email_logs`
- Hoặc tạo tab Email History trong admin (tương tự SMS tab)

---

## 🔧 TROUBLESHOOTING

### **SMS không gửi được:**

**Lỗi: "Brandname chưa được duyệt"**

```env
# Giải pháp: Set brandname = rỗng
SMS_BRAND_NAME=
```

**Lỗi: "Số điện thoại không hợp lệ"**

- Kiểm tra số điện thoại khách hàng có đúng format: `0xxxxxxxxx`
- Hệ thống tự động chuyển thành `+84xxxxxxxxx`

**SMS vào simulation mode:**

```
# Kiểm tra .env.local có đúng không:
SMS_ENABLED=true
ESMS_API_KEY=xxxxx  # ← Không được để trống hoặc YOUR_API_KEY
```

---

### **Email không gửi được:**

**Lỗi: "Invalid login"**

- Kiểm tra đã bật **Xác minh 2 bước** trên Gmail
- Kiểm tra đã tạo **App Password** chưa
- Không dùng mật khẩu Gmail thông thường

**Lỗi: "Connection timeout"**

```env
# Thử đổi port:
EMAIL_PORT=465
EMAIL_SECURE=true
```

**Email vào spam:**

- Khách hàng cần check thư mục Spam/Junk
- Thêm email vào Contacts để tránh spam

---

## 📊 THỐNG KÊ & LOG

### **Database Tables:**

**`sms_logs`** - Lưu lịch sử SMS

```sql
SELECT * FROM sms_logs
ORDER BY sent_at DESC
LIMIT 10;
```

**`email_logs`** - Lưu lịch sử Email

```sql
SELECT * FROM email_logs
ORDER BY sent_at DESC
LIMIT 10;
```

### **Thống kê SMS:**

```sql
SELECT
  COUNT(*) as total,
  SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
FROM sms_logs;
```

---

## 💡 KHUYẾN NGHỊ

### **Cho Development:**

- ✅ Dùng SMS không brandname (`SMS_BRAND_NAME=""`)
- ✅ Dùng Gmail cá nhân với App Password
- ✅ Test với số điện thoại của bạn

### **Cho Production:**

- ✅ Đăng ký brandname chính thức
- ✅ Dùng email domain riêng (vd: contact@bunbohuecodo.vn)
- ✅ Setup monitoring cho SMS/Email logs
- ✅ Backup API keys an toàn

---

## 📞 HỖ TRỢ

**eSMS Support:**

- Hotline: 1900 2166
- Email: support@esms.vn

**Gmail Support:**

- Help: https://support.google.com/mail

**Dự án support:**

- Email: leminhhuy1122@gmail.com

---

**Cập nhật lần cuối: 25/11/2025**
