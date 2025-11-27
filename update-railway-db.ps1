# Script cap nhat database moi len Railway
# Khac phuc loi tieng Viet va toi uu hoa cho Railway

Write-Host "=== CAP NHAT DATABASE MOI LEN RAILWAY ===" -ForegroundColor Green
Write-Host ""

# Doc thong tin tu .env.local
Write-Host "Doc thong tin ket noi tu .env.local..." -ForegroundColor Yellow

$envFile = ".\.env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "✗ Không tìm thấy file .env.local!" -ForegroundColor Red
    exit
}

$dbHost = ""
$dbPort = ""
$dbUser = ""
$dbPassword = ""
$dbName = ""

Get-Content $envFile | ForEach-Object {
    if ($_ -match "^DB_HOST=(.+)") { $dbHost = $matches[1].Trim() }
    if ($_ -match "^DB_PORT=(.+)") { $dbPort = $matches[1].Trim() }
    if ($_ -match "^DB_USER=(.+)") { $dbUser = $matches[1].Trim() }
    if ($_ -match "^DB_PASSWORD=(.+)") { $dbPassword = $matches[1].Trim() }
    if ($_ -match "^DB_NAME=(.+)") { $dbName = $matches[1].Trim() }
}

Write-Host "✓ Thông tin kết nối:" -ForegroundColor Green
Write-Host "  Host: $dbHost" -ForegroundColor Cyan
Write-Host "  Port: $dbPort" -ForegroundColor Cyan
Write-Host "  Database: $dbName" -ForegroundColor Cyan
Write-Host "  User: $dbUser" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra file SQL
$sqlFile = ".\database\bun_bo_hue_co_do_railway.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Host "✗ Không tìm thấy file: $sqlFile" -ForegroundColor Red
    exit
}

Write-Host "✓ File SQL tìm thấy: $sqlFile" -ForegroundColor Green
Write-Host ""

# Xác nhận trước khi thực hiện
Write-Host "⚠️  CẢNH BÁO: Script này sẽ XÓA toàn bộ dữ liệu hiện tại!" -ForegroundColor Yellow
Write-Host "⚠️  và import database mới với encoding UTF8MB4 đầy đủ." -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Bạn có chắc chắn muốn tiếp tục? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "Đã hủy!" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Đang cập nhật database..." -ForegroundColor Yellow
Write-Host ""

# Kiểm tra mysql client
$mysqlPath = $null
$possiblePaths = @(
    "C:\xampp\mysql\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe",
    "mysql" # Trong PATH
)

foreach ($path in $possiblePaths) {
    if ($path -eq "mysql") {
        try {
            $null = Get-Command mysql -ErrorAction Stop
            $mysqlPath = "mysql"
            break
        } catch {
            continue
        }
    } elseif (Test-Path $path) {
        $mysqlPath = $path
        break
    }
}

if (-not $mysqlPath) {
    Write-Host "✗ Không tìm thấy MySQL client!" -ForegroundColor Red
    Write-Host "Vui lòng cài đặt MySQL hoặc XAMPP" -ForegroundColor Yellow
    exit
}

Write-Host "✓ MySQL client: $mysqlPath" -ForegroundColor Green
Write-Host ""

# Bước 1: Drop toàn bộ database (để đảm bảo clean import)
Write-Host "Bước 1: Xóa database cũ..." -ForegroundColor Yellow
$dropCmd = "DROP DATABASE IF EXISTS ``$dbName``; CREATE DATABASE ``$dbName`` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
$dropCmd | & $mysqlPath -h $dbHost -P $dbPort -u $dbUser -p$dbPassword 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Đã tạo lại database mới với UTF8MB4" -ForegroundColor Green
} else {
    Write-Host "✗ Lỗi khi tạo database!" -ForegroundColor Red
    exit
}

Write-Host ""

# Bước 2: Import SQL file
Write-Host "Bước 2: Import database mới..." -ForegroundColor Yellow
Get-Content $sqlFile | & $mysqlPath -h $dbHost -P $dbPort -u $dbUser -p$dbPassword $dbName --default-character-set=utf8mb4 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Import thành công!" -ForegroundColor Green
} else {
    Write-Host "✗ Lỗi khi import!" -ForegroundColor Red
    exit
}

Write-Host ""

# Bước 3: Verify encoding
Write-Host "Bước 3: Kiểm tra encoding..." -ForegroundColor Yellow
$verifyCmd = @"
SELECT 
    DEFAULT_CHARACTER_SET_NAME, 
    DEFAULT_COLLATION_NAME 
FROM information_schema.SCHEMATA 
WHERE SCHEMA_NAME = '$dbName';
"@

$verifyCmd | & $mysqlPath -h $dbHost -P $dbPort -u $dbUser -p$dbPassword $dbName --default-character-set=utf8mb4 2>&1

Write-Host ""

# Bước 4: Test dữ liệu tiếng Việt
Write-Host "Bước 4: Test dữ liệu tiếng Việt..." -ForegroundColor Yellow
$testCmd = "SELECT name, description FROM menu_items LIMIT 3;"
$testCmd | & $mysqlPath -h $dbHost -P $dbPort -u $dbUser -p$dbPassword $dbName --default-character-set=utf8mb4 2>&1

Write-Host ""
Write-Host "=== HOÀN TẤT ===" -ForegroundColor Green
Write-Host ""
Write-Host "Database đã được cập nhật thành công!" -ForegroundColor Green
Write-Host ""
Write-Host "Kiem tra ket qua:" -ForegroundColor Yellow
Write-Host "1. Mo http://localhost:3000 de xem website" -ForegroundColor White
Write-Host "2. Kiem tra Menu de xem tieng Viet hien thi dung" -ForegroundColor White
Write-Host "3. Neu OK, commit va push code len GitHub" -ForegroundColor White
Write-Host "4. Vercel/Railway se tu dong deploy phien ban moi" -ForegroundColor White
Write-Host ""

