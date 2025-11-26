# 🚀 HƯỚNG DẪN DEPLOY LÊN VERCEL

## Bước 1: Chuẩn bị

1. Tạo tài khoản Vercel: https://vercel.com/signup
2. Connect với GitHub account
3. Push code lên GitHub (nếu chưa có)

## Bước 2: Push code lên GitHub

```powershell
# Khởi tạo git (nếu chưa có)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Add remote (thay YOUR_USERNAME và YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push
git push -u origin main
```

## Bước 3: Deploy trên Vercel

### 3.1. Import Project

1. Vào https://vercel.com/new
2. Chọn "Import Git Repository"
3. Chọn repo vừa push
4. Click "Import"

### 3.2. Configure Project

- Framework Preset: **Next.js**
- Root Directory: **.**
- Build Command: `npm run build`
- Output Directory: `.next`

### 3.3. Environment Variables

Click "Environment Variables" và thêm:

```
DB_HOST=your-railway-host.railway.app
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-railway-password
DB_NAME=railway

JWT_SECRET=bunbohuecodo-production-secret-2024
JWT_EXPIRES_IN=7d

SMS_ENABLED=true
ESMS_API_KEY=7F309E7E3EC1F8F898658AB62F8019
ESMS_SECRET_KEY=CA5887BE17F524D3B33F54A5C41E17
SMS_BRAND_NAME=

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=leminhhuy1122@gmail.com
EMAIL_PASSWORD=nwwcmufesbxqbrsl
EMAIL_FROM_NAME=Bún Bò Huế Cố Đô
```

### 3.4. Deploy

1. Click "Deploy"
2. Chờ 2-3 phút
3. Done! 🎉

## Bước 4: Update URLs

Sau khi deploy xong, Vercel sẽ cho bạn URL (ví dụ: https://bun-bo-hue-abc123.vercel.app)

Update lại Environment Variables:

```
NEXT_PUBLIC_APP_URL=https://your-actual-url.vercel.app
NEXT_PUBLIC_API_URL=https://your-actual-url.vercel.app/api
```

Sau đó Redeploy lại.

## Bước 5: Setup Custom Domain (Optional)

1. Vercel Dashboard → Project → Settings → Domains
2. Add your domain (ví dụ: bunbohuecodo.com)
3. Update DNS records theo hướng dẫn
4. Chờ SSL tự động active

## ⚡ Auto Deploy

Từ giờ, mỗi khi push code lên GitHub:

- Vercel tự động build và deploy
- Không cần làm gì thêm!

## 🔍 Troubleshooting

### Lỗi database connection:

- Kiểm tra Railway MySQL có "Public Networking" enabled
- Kiểm tra environment variables trên Vercel
- Check Railway logs

### Lỗi build:

- Kiểm tra `npm run build` trên local trước
- Xem build logs trên Vercel để debug

### Lỗi 404:

- Đảm bảo Next.js app router được config đúng
- Check Vercel logs

## 📊 Monitoring

- Vercel Analytics: Xem traffic, performance
- Railway Metrics: Xem database usage
- Vercel Logs: Debug errors
