# Hướng dẫn Upload Hình Ảnh Món Ăn

## 📁 Thư mục này dùng để lưu hình ảnh món ăn

### Quy tắc đặt tên file:

- Sử dụng tên slug của món ăn (giống với `slug` trong database)
- Format: `[slug].jpg` hoặc `[slug].png`
- Ví dụ:
  - `bun-bo-hue-dac-biet.jpg`
  - `bun-bo-hue-thuong.jpg`
  - `nem-lui.jpg`
  - `banh-beo.jpg`

### Danh sách món ăn cần hình:

Dựa vào database, các món ăn hiện tại cần hình:

**Món Chính (main):**

- `bun-bo-hue-dac-biet.jpg` - Bún Bò Huế Đặc Biệt
- `bun-bo-hue-thuong.jpg` - Bún Bò Huế Thường
- `bun-bo-hue-chay.jpg` - Bún Bò Huế Chay
- `bun-rieu-cua.jpg` - Bún Riêu Cua
- `bun-thit-nuong.jpg` - Bún Thịt Nướng
- `com-bo-kho.jpg` - Cơm Bò Kho

**Món Phụ (side):**

- `banh-beo.jpg` - Bánh Bèo
- `banh-loc.jpg` - Bánh Lọc
- `cha-gio.jpg` - Chả Giò
- `nem-lui.jpg` - Nem Lụi

**Đồ Uống (drink):**

- `tra-da.jpg` - Trà Đá
- `nuoc-mia.jpg` - Nước Mía
- `coca-cola.jpg` - Coca Cola

**Tráng Miệng (dessert):**

- `che-hue.jpg` - Chè Huế

### Cách sử dụng:

1. Chuẩn bị hình ảnh món ăn (định dạng JPG hoặc PNG)
2. Đổi tên file theo slug của món (xem danh sách ở trên)
3. Copy file vào thư mục này (`public/images/`)
4. Hình sẽ tự động hiển thị tại `/images/[tên-file].jpg`

### Kích thước đề xuất:

- Width: 800px - 1200px
- Height: 600px - 900px
- Tỷ lệ: 4:3 hoặc 16:9
- Format: JPG (nén 80-90% quality)
- Dung lượng: < 500KB mỗi ảnh

### Lưu ý:

- File name phải viết thường, không dấu, dùng dấu gạch ngang (-)
- Nếu thêm món mới trong admin, đặt tên file theo slug được tạo tự động
- Có thể xem slug của món trong database table `menu_items` cột `slug`

Tôi mới cập nhật 17 món ăn mới hãy cập nhật lại menu
`bun-bo-dac-biet.jpg` - Bún Bò Đặc Biệt
`bun-bo-bap-hoa.jpg` - Bún Bò Bắp Hoa
`bun-bo-gio-heo.jpg` - Bún Bò Giò Heo
`bun-bo-tai-nam.jpg` - Bún Bò Tái Nạm
`bun-cha-cua-cha-hue.jpg` - Bún Chả Cua - Chả Huế
`chen-xi-quach.jpg` - Chén Xí Quách
`chen-hot-ga.jpg` - Chén Hột Gà
`chen-cha-cua-them.jpg` - Chén Chả Cua Thêm
`chen-tiet-luoc.jpg` - Chén Tiết Luộc
`rau-nhung-hanh-ngam.jpg` - Rau Nhúng & Hành Ngâm Giấm
`nuoc-mia-tac.jpg` - Nước Mía Tắc
`sua-dau-nanh-la-dua.jpg` - Sữa Đậu Nành (Lá Dứa)
`nuoc-sam.jpg` - Nước Sâm
`nuoc-rau-ma-dau-xanh.jpg` - Rau Má Đậu Xanh
`tra-da.jpg` - Trà Đá
`tra-tac.jpg` - Trà Tắc
`nuoc-coca.jpg` - coca

cập nhật thêm 3 combo mới:
`combo-4-nguoi.jpg` - combo Gia đình 4 người ( bao gồm:Bốn tô bún bò (Đặc Biệt, Bắp Hoa, Giò Heo, Tái Nạm) Một chén Xí Quách, Một chén Chả Cua, 2 ly Nước Mía Tắc, 2 ly Rau Má Đậu Xanh)
`combo-2-nguoi.jpg` - combo cặp đôi 2 người (Một tô Bún Bò Đặc Biệ, một tô Bún Bò Tái Nạm, hai ly Nước Mía Tắc )
`combo-1-nguoi.jpg` - combo cô đơn tiết kiệm 1 người ( Bún Bò Đặc Biệt, một chén Xí Quách,một ly Nước Mía Tắc, một đĩa nhỏ Rau Nhúng & Hành Ngâm )

chúng ta sẽ tới với dashboard
nó sẽ hiển thị

- doanh thu
  doanh thu sẽ được tính như sau: sau khi người dùng thực hiện đặt đơn xong và trên admin cập nhật trạng thái đơn hàng " Hoàn Thành " thì sẽ cập nhật doanh thu thêm.

- đơn hàng đã đặt

hiển thị số lượng đơn hàng đã hoàn thành trong phần đơn hàng

- khách hàng đã đặt
  hiển thị Tổng số khách hàng trong khách hàng
- số bàn đã đặt
  hiển thị số bàn đã đặt bằng cách kiểm tra trạng thái nếu " hoàn thành " thì sẽ tính
