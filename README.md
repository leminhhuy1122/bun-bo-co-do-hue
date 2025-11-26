# 🍜 Bún Bò Huế Cố Đô - Website Nhà Hàng

Website nhà hàng Bún Bò Huế Cố Đô được xây dựng bằng **Next.js 14**, **TypeScript**, và **Tailwind CSS**. Dự án bao gồm đầy đủ các tính năng của một website nhà hàng hiện đại với giao diện đẹp mắt, responsive và trải nghiệm người dùng tuyệt vời.

![Bún Bò Huế](https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1200&h=400&fit=crop)

## ✨ Tính Năng Chính

### 🏠 Trang Chủ

- **Hero Banner** với hình ảnh món ăn hấp dẫn và CTA rõ ràng
- **Combo Section** hiển thị các combo tiết kiệm với giá ưu đãi
- **Popup Khuyến Mãi** tự động hiện khi vào trang (session-based)
- **Món Bán Chạy** showcase các món được yêu thích nhất
- **Câu Chuyện Nhà Hàng** giới thiệu về quán

### 📖 Thực Đơn (E-Menu)

- Hiển thị danh sách món ăn với hình ảnh, giá, mô tả chi tiết
- **Tìm kiếm** và **lọc** món ăn (Tất cả / Bán chạy / Cay nồng)
- **Modal chi tiết món** với khả năng:
  - Chọn mức độ cay (Ít cay / Vừa / Thêm cay)
  - Thêm topping (Thêm tái, nạm, chả cua, giò heo, bún...)
  - Nhập ghi chú đặc biệt
  - Điều chỉnh số lượng
- Phân loại theo danh mục: Món chính, Đồ uống, Tráng miệng

### 🛒 Giỏ Hàng & Thanh Toán

- **Giỏ hàng persistent** (lưu vào localStorage)
- Hiển thị đầy đủ thông tin món, topping, ghi chú
- Tăng/giảm số lượng hoặc xóa món
- **Nhập mã giảm giá** với validation:
  - Kiểm tra mã có tồn tại
  - Kiểm tra giá trị đơn hàng tối thiểu
  - Hỗ trợ cả giảm theo % và giảm cố định
  - Giới hạn số tiền giảm tối đa
- **Chọn phương thức thanh toán**:
  - Tiền mặt khi nhận hàng (COD)
  - Chuyển khoản ngân hàng
  - Ví điện tử MoMo
- Form thông tin khách hàng với validation
- Tổng kết đơn hàng rõ ràng

### 📅 Đặt Bàn (Reservation)

- Form đặt bàn với các trường:
  - Họ tên, số điện thoại (bắt buộc)
  - Email (tùy chọn)
  - Ngày, giờ đặt bàn
  - Số lượng khách
  - Ghi chú yêu cầu đặc biệt
- Validation đầy vào (format số điện thoại, ngày tối thiểu...)
- Xác nhận đặt bàn thành công

### 🎁 Hệ Thống Khuyến Mãi

- **4 mã giảm giá** mẫu:
  - `WELCOME2024`: Giảm 20% cho khách mới (đơn từ 100K)
  - `COMBO50K`: Giảm 50K (đơn từ 200K)
  - `FREESHIP`: Giảm 20K phí ship (đơn từ 150K)
  - `HAPPYHOUR`: Giảm 15% từ 14h-16h (đơn từ 50K)
- Popup hiển thị mã khi vào web lần đầu
- Copy mã nhanh chỉ bằng 1 click

### 📱 Responsive Design

- Tối ưu cho mọi thiết bị (Desktop, Tablet, Mobile)
- Mobile menu collapsible
- Grid layout linh hoạt

## 🎨 Thiết Kế UI/UX

### Bảng Màu Chủ Đạo

- **Đỏ Trầm** (`#B91C1C`): Màu chủ đạo, gợi cảm giác cay nồng
- **Nâu Đất** (`#78350F`): Tông màu ấm, truyền thống
- **Vàng** (`#CA8A04`): Nhấn mạnh, ưu đãi, sang trọng
- **Kem** (`#FEF3C7`): Background nhẹ nhàng, dễ chịu

### Typography

- **Display Font**: Playfair Display (cho tiêu đề - thanh lịch, cổ điển)
- **Body Font**: Inter (nội dung - hiện đại, dễ đọc)

### Hiệu Ứng

- Hover effects mượt mà
- Transitions tự nhiên
- Shadow và gradient tinh tế
- Animations cho popup và hero banner

## 🗂️ Cấu Trúc Dự Án

```
bun-bo-hue-co-do/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Trang chủ
│   │   ├── globals.css          # CSS toàn cục
│   │   ├── menu/
│   │   │   └── page.tsx         # Trang thực đơn
│   │   ├── checkout/
│   │   │   └── page.tsx         # Trang thanh toán
│   │   ├── reservation/
│   │   │   └── page.tsx         # Trang đặt bàn
│   │   └── about/
│   │       └── page.tsx         # Trang giới thiệu
│   ├── components/              # React Components
│   │   ├── Navbar.tsx          # Header navigation
│   │   ├── Footer.tsx          # Footer với thông tin liên hệ
│   │   ├── Hero.tsx            # Hero banner trang chủ
│   │   ├── MenuCard.tsx        # Card hiển thị món ăn
│   │   ├── MenuModal.tsx       # Modal chi tiết món + chọn topping
│   │   ├── BookingForm.tsx     # Form đặt bàn
│   │   ├── PromoPopup.tsx      # Popup khuyến mãi
│   │   └── ComboSection.tsx    # Section hiển thị combo
│   ├── context/
│   │   └── CartContext.tsx     # Context quản lý giỏ hàng (global state)
│   ├── data/                   # Dữ liệu demo (JSON)
│   │   ├── menu.json           # 14 món ăn + topping
│   │   ├── combos.json         # 3 combo tiết kiệm
│   │   └── promos.json         # 4 mã giảm giá
│   └── types/
│       └── index.ts            # TypeScript interfaces
├── public/
│   └── images/                 # Hình ảnh (nếu có)
├── tailwind.config.ts          # Config Tailwind (theme màu custom)
├── tsconfig.json               # TypeScript config
├── package.json
└── README.md
```

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **State Management**: React Context API
- **Data Storage**: localStorage (giỏ hàng), sessionStorage (popup)

## 🚀 Cài Đặt và Chạy Dự Án

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Chạy development server

```bash
npm run dev
```

Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

### 3. Build cho production

```bash
npm run build
npm start
```

## 📦 Các Package Chính

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "next": "^14.2.0",
    "lucide-react": "^0.344.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

## 🔥 Các Chức Năng Nổi Bật

### 1. **CartContext** - Quản Lý Giỏ Hàng

Context API quản lý toàn bộ logic giỏ hàng:

- `addToCart()`: Thêm món (kèm topping, ghi chú)
- `removeFromCart()`: Xóa món
- `updateQuantity()`: Tăng/giảm số lượng
- `applyCoupon()`: Áp dụng mã giảm giá
- `getCartTotal()`: Tính tổng tiền
- `getFinalTotal()`: Tổng sau giảm giá

### 2. **MenuModal** - Tùy Chỉnh Món Ăn

- Chọn mức độ cay
- Thêm nhiều topping
- Ghi chú riêng
- Tính giá real-time

### 3. **Validation Mã Giảm Giá**

```typescript
- Kiểm tra mã có tồn tại
- Kiểm tra giá trị đơn hàng tối thiểu
- Tính discount theo type (percentage/fixed)
- Áp dụng maxDiscount nếu có
```

### 4. **LocalStorage Persistence**

Giỏ hàng được lưu tự động, không mất khi reload trang.

### 5. **CouponInput Component** - Nhập Mã Nâng Cao ✨

- Dropdown gợi ý mã khả dụng
- Quick apply (1 click)
- Copy mã nhanh
- Show/hide suggestions
- Error handling với message rõ ràng
- Success notification
- Quick access chips

### 6. **Admin Dashboard** 🔐 (MỚI!)

**Login Demo**: `admin / admin123`

**6 Module Quản Lý:**

1. **📊 Dashboard**:

   - Thống kê doanh thu, đơn hàng real-time
   - Đơn hàng gần đây
   - Biểu đồ doanh thu 7 ngày
   - Top món bán chạy

2. **📦 Orders Management**:

   - Danh sách đơn hàng đầy đủ
   - Cập nhật trạng thái (Pending → Confirmed → Delivering → Delivered)
   - Chi tiết đơn, in hóa đơn

3. **🍜 Menu Management**:

   - CRUD thực đơn (placeholder - cần backend)
   - Thêm/Sửa/Xóa món

4. **📅 Reservations Management**:

   - Quản lý đặt bàn
   - Xác nhận/Hủy đặt bàn
   - Lịch đặt bàn theo ngày

5. **🎁 Coupons Management**:

   - Tạo mã giảm giá mới (Percentage/Fixed)
   - Sửa/Xóa mã
   - Tracking số lần sử dụng
   - Progress bar usage limit

6. **👥 Customers Management**:
   - Danh sách khách hàng
   - Lịch sử mua hàng
   - Tổng chi tiêu

## 🎯 Các Trang Web

| Route          | Mô Tả                                             |
| -------------- | ------------------------------------------------- |
| `/`            | Trang chủ với hero, combo, món bán chạy           |
| `/menu`        | Thực đơn đầy đủ với tìm kiếm & filter             |
| `/checkout`    | Giỏ hàng & thanh toán                             |
| `/reservation` | Đặt bàn trước                                     |
| `/about`       | Giới thiệu về nhà hàng                            |
| `/admin`       | **🔐 Admin Dashboard** (Quản lý toàn bộ hệ thống) |

## 💡 Hướng Phát Triển Tiếp

- [ ] Tích hợp Backend API (Node.js/Express hoặc NestJS)
- [ ] Database (MongoDB/PostgreSQL) để lưu đơn hàng thật
- [ ] Authentication (đăng nhập khách hàng)
- [ ] Lịch sử đơn hàng
- [ ] Review và rating món ăn
- [ ] Tích hợp thanh toán online (VNPay, MoMo API)
- [ ] Admin dashboard quản lý menu, đơn hàng
- [ ] Gửi email xác nhận đơn hàng
- [ ] Thông báo real-time (Socket.io)
- [ ] Multi-language support (i18n)

## 📝 Giải Thích Kiến Trúc

### Luồng Hoạt Động

1. **User vào trang chủ** → Popup khuyến mãi hiện (nếu lần đầu) → Xem combo & món bán chạy
2. **User vào /menu** → Tìm/lọc món → Click món → Modal chi tiết → Chọn topping/cay/ghi chú → Thêm vào giỏ
3. **User vào /checkout** → Xem giỏ hàng → Nhập mã giảm giá → Điền thông tin → Chọn thanh toán → Đặt hàng
4. **User vào /reservation** → Điền form → Submit → Xác nhận đặt bàn

### State Management Flow

```
CartContext (Global)
    ↓
Navbar (hiển thị số lượng trong giỏ)
    ↓
MenuPage → MenuModal → addToCart()
    ↓
CheckoutPage → applyCoupon() → getFinalTotal()
```

### Component Hierarchy

```
RootLayout (CartProvider)
  ├── Navbar
  ├── Page Content
  │   ├── Hero
  │   ├── ComboSection
  │   ├── PromoPopup
  │   ├── MenuCard → MenuModal
  │   └── BookingForm
  └── Footer
```

## 🙏 Credits

- **Design Inspiration**: Modern restaurant websites
- **Images**: Unsplash (placeholder images)
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Playfair Display, Inter)

## 📞 Liên Hệ

- **Email**: info@bunbohuecoddo.vn
- **Phone**: 0234.567.890
- **Address**: 123 Lê Duẩn, Thành phố Huế

---

**Developed with ❤️ by Senior Full-stack Developer**

🎉 Chúc bạn thành công với dự án!
