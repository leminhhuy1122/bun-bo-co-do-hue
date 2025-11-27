# 🍜 Bún Bò Huế Cố Đô

Website đặt món và đặt bàn trực tuyến cho nhà hàng Bún Bò Huế Cố Đô.

🔗 **Link Deploy:** https://bun-bo-co-do-hue.vercel.app/

---

## 📋 Mục Lục

1. [Giới Thiệu Dự Án](#giới-thiệu-dự-án)
2. [Mục Tiêu & Đối Tượng](#mục-tiêu--đối-tượng)
3. [Kiến Trúc Hệ Thống](#kiến-trúc-hệ-thống)
4. [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
5. [Thiết Kế Giao Diện](#thiết-kế-giao-diện)
6. [Cơ Sở Dữ Liệu](#cơ-sở-dữ-liệu)
7. [Tính Năng Chính](#tính-năng-chính)
8. [Bảo Mật](#bảo-mật)
9. [Hướng Dẫn Cài Đặt](#hướng-dẫn-cài-đặt)
10. [Demo & Screenshots](#demo--screenshots)

---

## 🎯 Giới Thiệu Dự Án

**Bún Bò Huế Cố Đô** là hệ thống quản lý nhà hàng toàn diện với website đặt món trực tuyến, giúp khách hàng dễ dàng:

- Xem thực đơn với hình ảnh và giá cả chi tiết
- Đặt món online và thanh toán linh hoạt
- Đặt bàn trước để đảm bảo chỗ ngồi
- Nhận thông báo đơn hàng qua SMS và Email

---

## 🎯 Mục Tiêu & Đối Tượng

### Mục Tiêu

- ✅ **Số hóa quy trình đặt hàng:** Giảm tải cho nhân viên, tăng hiệu quả phục vụ
- ✅ **Tối ưu trải nghiệm khách hàng:** Giao diện thân thiện, đặt món nhanh chóng
- ✅ **Quản lý hiệu quả:** Dashboard admin quản lý đơn hàng, menu, đặt bàn
- ✅ **Tăng doanh thu:** Hệ thống khuyến mãi, combo tiết kiệm, tích điểm thành viên

### Đối Tượng Sử Dụng

1. **Khách hàng (Customer)**

   - Người yêu thích ẩm thực Huế
   - Khách hàng muốn đặt món online
   - Nhóm/gia đình muốn đặt bàn trước

2. **Nhân viên nhà hàng (Staff)**

   - Nhân viên phục vụ
   - Nhân viên bếp
   - Nhân viên giao hàng

3. **Quản trị viên (Admin)**
   - Chủ nhà hàng
   - Quản lý vận hành

---

## 🏗️ Kiến Trúc Hệ Thống

### Sitemap (Sơ đồ Trang Web)

```
bun-bo-co-do-hue.vercel.app/
│
├── / (Trang chủ)
│   ├── Hero Section (Banner chính)
│   ├── Features (Điểm nổi bật)
│   ├── Combos (Ưu đãi combo)
│   └── Story (Câu chuyện thương hiệu)
│
├── /menu (Thực đơn)
│   ├── Bún Bò Huế (Món chính)
│   ├── Món Phụ (Side dishes)
│   ├── Đồ Uống (Drinks)
│   └── Combo (Combo meals)
│
├── /reservation (Đặt bàn)
│   └── Booking Form
│
├── /checkout (Thanh toán)
│   ├── Giỏ hàng
│   ├── Thông tin khách hàng
│   ├── Áp dụng mã giảm giá
│   └── Xác nhận đơn hàng
│
├── /about (Về chúng tôi)
│   ├── Câu chuyện thương hiệu
│   ├── Giá trị cốt lõi
│   └── Hành trình 16 năm
│
└── /admin (Quản trị)
    ├── Dashboard
    ├── Quản lý đơn hàng
    ├── Quản lý menu
    ├── Quản lý đặt bàn
    ├── Quản lý khách hàng
    ├── Quản lý mã giảm giá
    ├── Quản lý nhân viên
    └── Logs (SMS/Email)
```

### Domain & Hosting

- **Domain:** `bun-bo-co-do-hue.vercel.app`
- **Hosting:** Vercel (Serverless Platform)
- **Database:** Railway MySQL (Cloud Database)
- **CDN:** Vercel Edge Network (Auto)

---

## 🛠️ Công Nghệ Sử Dụng

### Framework & Libraries

#### Frontend

```typescript
Next.js 14.2          // React Framework với App Router
TypeScript 5.4        // Type-safe JavaScript
React 18.3            // UI Library
TailwindCSS 3.4       // Utility-first CSS
Lucide React          // Icon Library
```

#### Backend

```typescript
Next.js API Routes    // Serverless API
MySQL2 3.15           // Database Driver
JWT 9.0               // Authentication
Bcrypt 3.0            // Password Hashing
Nodemailer 7.0        // Email Service
```

#### State Management

```typescript
React Context API     // Global State (Cart, Notifications)
React Hooks           // Local State (useState, useEffect)
```

### Tech Stack Chi Tiết

| Lớp                | Công Nghệ           | Mục Đích                          |
| ------------------ | ------------------- | --------------------------------- |
| **Framework**      | Next.js 14.2        | Server-Side Rendering, API Routes |
| **Language**       | TypeScript 5.4      | Type Safety, Better DX            |
| **Styling**        | TailwindCSS 3.4     | Utility-first, Responsive Design  |
| **Database**       | MySQL 8.0 (Railway) | Relational Database               |
| **ORM**            | Raw SQL + mysql2    | Optimized Queries                 |
| **Authentication** | JWT + Bcrypt        | Secure Auth System                |
| **SMS**            | Infobip API         | SMS Notifications                 |
| **Email**          | Nodemailer + Gmail  | Email Notifications               |
| **Deployment**     | Vercel              | Serverless Platform               |

---

## 🎨 Thiết Kế Giao Diện

### Brand Identity

#### Màu Sắc (Color Palette)

```css
--hue-red: #B33A2B        /* Màu đỏ chủ đạo - Màu nước dùng bún bò */
--hue-redDark: #291812    /* Màu nâu đậm - Heading */
--hue-cream: #F8EFEB      /* Màu kem - Background */
--accent-orange: #E07A44  /* Màu cam - Secondary */
--broth-brown: #3B1F18    /* Màu nâu nước dùng - Emphasis */
```

#### Typography (Font Chữ)

```css
/* Display Font */
font-family: "Playfair Display", serif;
/* Sử dụng cho: Headings, Logo */

/* Body Font */
font-family: "Inter", sans-serif;
/* Sử dụng cho: Body text, UI elements */
```

### UI/UX Design Principles

#### Responsive Design

```
Mobile First Approach:
- Base styles: Mobile (375px+)
- Breakpoints:
  * xs: 480px   (Small phones)
  * sm: 640px   (Large phones)
  * md: 768px   (Tablets)
  * lg: 1024px  (Desktop)
  * xl: 1280px  (Large Desktop)
```

#### Component Layout

1. **Header/Navbar**

   - Desktop: Logo + Navigation + Cart Icon + Login
   - Mobile: Hamburger Menu + Logo + Cart Icon

2. **Hero Section**

   - Desktop: 2-column grid (Content + Image)
   - Mobile: Stack layout (Title → Image → Buttons)

3. **Cards**

   - Consistent padding: `p-4 sm:p-6 md:p-8`
   - Hover effects: `hover:shadow-2xl transition-all`
   - Rounded corners: `rounded-xl sm:rounded-2xl`

4. **Buttons**
   - Primary: Red gradient with white text
   - Secondary: White with red border
   - Sizes: `py-2.5 md:py-3`, `text-sm md:text-base`

#### Animation & Effects

```css
/* Loading Transitions */
animate-fadeIn      // 0.3s fade in
animate-scaleIn     // 0.3s scale + fade
animate-float       // 3s floating effect
animate-pulse       // Badge notification

/* Page Loader */
backdrop-blur-sm    // Blur background
animate-spin        // Spinning bowl icon
animate-bounce      // Loading dots
```

---

## 🗄️ Cơ Sở Dữ Liệu

### ERD (Entity Relationship Diagram)

```
┌─────────────────┐       ┌──────────────────┐
│     USERS       │       │    CUSTOMERS     │
├─────────────────┤       ├──────────────────┤
│ id (PK)         │       │ id (PK)          │
│ username        │       │ full_name        │
│ password        │       │ email (UNIQUE)   │
│ full_name       │       │ phone            │
│ email           │       │ total_orders     │
│ role (ENUM)     │       │ total_spent      │
│ status          │       │ loyalty_points   │
└─────────────────┘       └──────────────────┘
                                   │
                                   │ 1:N
                                   ▼
┌─────────────────┐       ┌──────────────────┐
│   MENU_ITEMS    │       │     ORDERS       │
├─────────────────┤       ├──────────────────┤
│ id (PK)         │◄──┐   │ id (PK)          │
│ name            │   │   │ order_number     │
│ slug (UNIQUE)   │   │   │ customer_id (FK) │
│ price           │   │   │ customer_name    │
│ category        │   │   │ customer_phone   │
│ is_available    │   │   │ order_status     │
│ is_featured     │   │   │ payment_method   │
│ sold_count      │   │   │ subtotal         │
└─────────────────┘   │   │ discount_amount  │
                      │   │ total_amount     │
                      │   │ coupon_code (FK) │
                      │   │ sms_sent         │
                      │   │ email_sent       │
                      │   └──────────────────┘
                      │            │
                      │            │ 1:N
                      │            ▼
                      │   ┌──────────────────┐
                      └───│  ORDER_ITEMS     │
                          ├──────────────────┤
                          │ id (PK)          │
                          │ order_id (FK)    │
                          │ menu_item_id(FK) │
                          │ item_name        │
                          │ item_price       │
                          │ quantity         │
                          │ subtotal         │
                          └──────────────────┘

┌─────────────────┐       ┌──────────────────┐
│    COUPONS      │       │  RESERVATIONS    │
├─────────────────┤       ├──────────────────┤
│ id (PK)         │       │ id (PK)          │
│ code (UNIQUE)   │       │ reservation_num  │
│ discount_type   │       │ customer_id (FK) │
│ discount_value  │       │ customer_name    │
│ min_order_amt   │       │ customer_phone   │
│ usage_limit     │       │ reservation_date │
│ used_count      │       │ reservation_time │
│ valid_until     │       │ number_of_guests │
│ is_active       │       │ status (ENUM)    │
└─────────────────┘       │ sms_sent         │
                          └──────────────────┘

┌─────────────────┐       ┌──────────────────┐
│    SMS_LOGS     │       │   EMAIL_LOGS     │
├─────────────────┤       ├──────────────────┤
│ id (PK)         │       │ id (PK)          │
│ order_id (FK)   │       │ order_id (FK)    │
│ reservation_id  │       │ reservation_id   │
│ phone_number    │       │ email            │
│ message_type    │       │ subject          │
│ message_content │       │ status (ENUM)    │
│ status (ENUM)   │       │ error_message    │
│ provider        │       │ sent_at          │
│ cost            │       └──────────────────┘
└─────────────────┘
```

### Database Schema Details

#### Core Tables (17 tables)

1. **users** - Quản lý tài khoản admin/staff
2. **customers** - Khách hàng và loyalty program
3. **menu_items** - Danh sách món ăn
4. **orders** - Đơn hàng
5. **order_items** - Chi tiết đơn hàng
6. **reservations** - Đặt bàn
7. **coupons** - Mã giảm giá
8. **combos** - Combo khuyến mãi
9. **combo_items** - Chi tiết combo
10. **toppings** - Topping thêm
11. **reviews** - Đánh giá món ăn
12. **sms_logs** - Lịch sử SMS
13. **sms_settings** - Cấu hình SMS
14. **email_logs** - Lịch sử Email
15. **email_settings** - Cấu hình Email
16. **settings** - Cấu hình hệ thống
17. **staff** - Nhân viên (future)

### Key Optimizations

#### Indexes

```sql
-- Primary Keys (Auto)
PRIMARY KEY (id)

-- Unique Constraints
UNIQUE KEY (email)
UNIQUE KEY (order_number)
UNIQUE KEY (code) -- for coupons

-- Foreign Key Indexes
KEY idx_order_id (order_id)
KEY idx_customer_id (customer_id)
KEY idx_menu_item_id (menu_item_id)

-- Query Optimization
KEY idx_status (order_status)
KEY idx_created (created_at)
KEY idx_phone (customer_phone)
KEY idx_category (category)
```

#### Stored Procedures

```sql
-- Apply coupon validation
PROCEDURE apply_coupon(
  IN p_coupon_code VARCHAR(50),
  IN p_order_amount DECIMAL(10,2),
  OUT p_is_valid BOOLEAN,
  OUT p_discount_amount DECIMAL(10,2)
)

-- Create order with transaction
PROCEDURE create_order(
  IN p_customer_info JSON,
  IN p_order_items JSON,
  OUT p_order_id INT
)
```

#### Views (5 views)

```sql
-- Báo cáo doanh thu theo ngày
VIEW daily_sales

-- Top món bán chạy
VIEW top_selling_items

-- Thống kê SMS
VIEW sms_statistics

-- Thống kê Email
VIEW email_statistics

-- Chi tiết đơn hàng đầy đủ
VIEW order_details_full
```

### Migration Strategy

```bash
# Setup database
database/railway_complete.sql

# Tables & Constraints
- Character set: UTF8MB4
- Collation: utf8mb4_unicode_ci
- Engine: InnoDB
- Foreign Keys with CASCADE
```

---

## ⚙️ Tính Năng Chính

### 1. Frontend Features

#### 🛍️ Đặt Món Online

- [x] Xem thực đơn với hình ảnh HD
- [x] Tìm kiếm và lọc món ăn
- [x] Thêm topping và ghi chú
- [x] Giỏ hàng với số lượng động
- [x] Floating cart button (mobile + desktop)
- [x] Áp dụng mã giảm giá
- [x] Popup khuyến mãi tự động
- [x] Multiple payment methods

#### 📅 Đặt Bàn

- [x] Form đặt bàn với validation
- [x] Chọn ngày/giờ và số người
- [x] Yêu cầu đặc biệt
- [x] Xác nhận qua SMS/Email

#### 🎨 UI/UX Enhancements

- [x] **Page Loader** - Loading khi chuyển trang
- [x] **Loading Spinner** - Loading khi fetch data
- [x] **Toast Notifications** - Thông báo real-time
- [x] **Success Modals** - Modal xác nhận đơn hàng
- [x] **Responsive Design** - Mobile-first approach
- [x] **Snow Effect** - Hiệu ứng tuyết rơi (seasonal)
- [x] **Smooth Animations** - Fade, scale, float effects

### 2. Backend Features

#### 🔐 Authentication & Authorization

```typescript
// JWT-based authentication
- Login: POST /api/auth/login
- Role-based access: admin, staff, customer
- Password hashing: bcrypt (salt rounds: 10)
- Token expiry: 7 days
```

#### 📦 API Endpoints

**Menu API**

```typescript
GET  /api/menu              // Lấy toàn bộ menu
GET  /api/menu?category=X   // Lọc theo category
GET  /api/menu/[id]         // Chi tiết món
POST /api/menu              // Thêm món (admin)
PUT  /api/menu/[id]         // Cập nhật món (admin)
```

**Order API**

```typescript
POST / api / orders; // Tạo đơn hàng
GET / api / orders; // Lấy danh sách đơn (admin)
GET / api / orders / [id]; // Chi tiết đơn
PUT / api / orders / [id]; // Cập nhật trạng thái
POST / api / orders / [id] / send - sms; // Gửi SMS
POST / api / orders / [id] / send - email; // Gửi Email
```

**Coupon API**

```typescript
GET / api / coupons; // Danh sách mã
POST / api / coupons / validate; // Validate mã
GET / api / coupons / popup; // Popup khuyến mãi
```

**Reservation API**

```typescript
POST / api / reservations; // Đặt bàn
GET / api / reservations; // Danh sách đặt bàn (admin)
PUT / api / reservations / [id]; // Cập nhật trạng thái
```

#### 📧 Notification System

**SMS Integration (Infobip)**

```typescript
Features:
- Order confirmation SMS
- Status update SMS
- Reservation reminder SMS
- Configurable templates
- Error logging

Provider: Infobip Global SMS API
Base URL: https://api.infobip.com
```

**Email Integration (Nodemailer + Gmail)**

```typescript
Features:
- HTML email templates
- Order confirmation email
- Reservation confirmation
- Attachments support
- Error retry logic

SMTP: smtp.gmail.com:587
Auth: App-specific password
```

### 3. Admin Dashboard

#### 📊 Analytics

- [x] Doanh thu theo ngày/tuần/tháng
- [x] Top món bán chạy
- [x] Số lượng đơn hàng theo trạng thái
- [x] Tỷ lệ chuyển đổi đơn hàng
- [x] Thống kê khách hàng mới

#### 🎛️ Management

- [x] **Quản lý đơn hàng:** Filter, search, update status
- [x] **Quản lý menu:** CRUD operations, toggle availability
- [x] **Quản lý đặt bàn:** Xác nhận, hủy, sắp xếp bàn
- [x] **Quản lý khách hàng:** Xem lịch sử, loyalty points
- [x] **Quản lý mã giảm giá:** Tạo, sửa, theo dõi usage
- [x] **Quản lý nhân viên:** Role assignment
- [x] **SMS/Email logs:** Track delivery status

---

## 🔒 Bảo Mật

### 1. Authentication & Authorization

#### Password Security

```typescript
// Bcrypt hashing with salt rounds
const hashedPassword = await bcrypt.hash(password, 10);

// Password validation
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

#### JWT Implementation

```typescript
// Token generation
const token = jwt.sign({ userId, username, role }, process.env.JWT_SECRET, {
  expiresIn: "7d",
});

// Token verification
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

#### Role-Based Access Control (RBAC)

```typescript
enum Role {
  ADMIN = "admin", // Full access
  STAFF = "staff", // Limited access
  CUSTOMER = "customer", // Public access
}

// Middleware protection
const requireAdmin = (handler) => {
  return async (req, res) => {
    const user = await verifyToken(req);
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    return handler(req, res);
  };
};
```

### 2. Input Validation

#### Server-Side Validation

```typescript
// Phone validation
const phoneRegex = /^[0-9]{10,11}$/;

// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// SQL Injection prevention
const query = "SELECT * FROM users WHERE email = ?";
db.execute(query, [userEmail]); // Parameterized queries
```

#### Client-Side Validation

```typescript
// Form validation hooks
const [errors, setErrors] = useState({});

const validate = () => {
  const newErrors = {};
  if (!name.trim()) newErrors.name = "Vui lòng nhập tên";
  if (!phoneRegex.test(phone)) newErrors.phone = "SĐT không hợp lệ";
  return newErrors;
};
```

### 3. Security Headers

```typescript
// Next.js security headers
headers: [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];
```

### 4. Environment Variables Protection

```bash
# .env.local (NOT committed to Git)
DB_HOST=xxx
DB_PASSWORD=xxx
JWT_SECRET=xxx
INFOBIP_API_KEY=xxx
EMAIL_PASSWORD=xxx

# .gitignore
.env.local
.env.production
```

### 5. XSS & CSRF Protection

```typescript
// React automatically escapes JSX
<div>{userInput}</div>; // Safe from XSS

// CSRF token for forms
const csrfToken = generateToken();
<input type="hidden" name="csrf" value={csrfToken} />;
```

### 6. Rate Limiting

```typescript
// API rate limiting (Future Enhancement)
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
};
```

---

## 🚀 Hướng Dẫn Cài Đặt

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
MySQL >= 8.0
```

### 1. Clone Repository

```bash
git clone https://github.com/leminhhuy1122/bun-bo-co-do-hue.git
cd bun-bo-co-do-hue
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local with your credentials
```

**Required Environment Variables:**

```env
# Database (Railway MySQL)
DB_HOST=your-railway-host
DB_PORT=33172
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=railway

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# SMS (Infobip)
SMS_ENABLED=true
SMS_PROVIDER=infobip
INFOBIP_API_KEY=your-api-key
INFOBIP_BASE_URL=https://api.infobip.com
INFOBIP_SENDER=BBHCODO

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM_NAME=Bún Bò Huế Cố Đô

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 4. Setup Database

```bash
# Import database schema
mysql -u root -p railway < database/railway_complete.sql

# Or use Railway web interface
# Upload: database/railway_complete.sql
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Build for Production

```bash
npm run build
npm start
```

### 7. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

---

## 📸 Demo & Screenshots

### 🌐 Live Demo

**URL:** https://bun-bo-co-do-hue.vercel.app/

### Admin Login

```
Username: admin
Password: admin123
```

### Test Credit Cards (Sandbox)

```
VISA: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
```

### Screenshots

#### 1. Homepage

- Hero section với CTA buttons
- Featured combos carousel
- Tại sao chọn chúng tôi
- Câu chuyện thương hiệu

#### 2. Menu Page

- Grid layout responsive
- Search & filter functionality
- Quick add to cart
- Modal chi tiết món

#### 3. Checkout Page

- Cart summary
- Customer information form
- Coupon code input
- Payment methods

#### 4. Admin Dashboard

- Revenue statistics
- Recent orders table
- Quick actions
- Analytics charts

---

## 📊 Performance & Optimization

### Core Web Vitals

```
✅ LCP (Largest Contentful Paint): < 2.5s
✅ FID (First Input Delay): < 100ms
✅ CLS (Cumulative Layout Shift): < 0.1
```

### Optimization Techniques

1. **Image Optimization**

   - Next.js Image component
   - Lazy loading
   - WebP format
   - Responsive images

2. **Code Splitting**

   - Dynamic imports
   - Route-based splitting
   - Component lazy loading

3. **Caching Strategy**

   - Static Generation (SSG)
   - Incremental Static Regeneration (ISR)
   - API response caching
   - Browser caching headers

4. **Database Optimization**
   - Indexed columns
   - Optimized queries
   - Connection pooling
   - Prepared statements

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Contributors

- **Lê Minh Huy** - Full Stack Developer
- GitHub: [@leminhhuy1122](https://github.com/leminhhuy1122)

---

## 📞 Contact & Support

**Email:** leminhhuy1122@gmail.com  
**Website:** https://bun-bo-co-do-hue.vercel.app/  
**GitHub Issues:** [Report Bug](https://github.com/leminhhuy1122/bun-bo-co-do-hue/issues)

---

## 🙏 Acknowledgments

- Next.js Team for amazing framework
- Vercel for hosting platform
- Railway for database hosting
- Infobip for SMS service
- TailwindCSS community
- Lucide Icons

---

**Made with ❤️ by Bún Bò Huế Cố Đô Team**
