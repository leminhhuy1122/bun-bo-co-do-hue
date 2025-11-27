# Update Railway Database Script
# Fix Vietnamese encoding and optimize for Railway

Write-Host "=== UPDATE DATABASE TO RAILWAY ===" -ForegroundColor Green
Write-Host ""

# Read connection info from .env.local
Write-Host "Reading connection info from .env.local..." -ForegroundColor Yellow

$envFile = ".\.env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "ERROR: .env.local file not found!" -ForegroundColor Red
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

Write-Host "Connection info:" -ForegroundColor Green
Write-Host "  Host: $dbHost" -ForegroundColor Cyan
Write-Host "  Port: $dbPort" -ForegroundColor Cyan
Write-Host "  Database: $dbName" -ForegroundColor Cyan
Write-Host "  User: $dbUser" -ForegroundColor Cyan
Write-Host ""

# Check SQL file
$sqlFile = ".\database\bun_bo_hue_co_do_railway.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Host "ERROR: SQL file not found: $sqlFile" -ForegroundColor Red
    exit
}

Write-Host "SQL file found: $sqlFile" -ForegroundColor Green
Write-Host ""

# Confirm before proceeding
Write-Host "WARNING: This script will DROP all existing data!" -ForegroundColor Yellow
Write-Host "and import new database with full UTF8MB4 encoding." -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Are you sure you want to continue? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "Cancelled!" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Updating database..." -ForegroundColor Yellow
Write-Host ""

# Find mysql client
$mysqlPath = $null
$possiblePaths = @(
    "C:\xampp\mysql\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe",
    "mysql" # In PATH
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
    Write-Host "ERROR: MySQL client not found!" -ForegroundColor Red
    Write-Host "Please install MySQL or XAMPP" -ForegroundColor Yellow
    exit
}

Write-Host "MySQL client: $mysqlPath" -ForegroundColor Green
Write-Host ""

# Step 1: Drop and recreate database
Write-Host "Step 1: Dropping old database..." -ForegroundColor Yellow
$dropCmd = "DROP DATABASE IF EXISTS ``$dbName``; CREATE DATABASE ``$dbName`` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
$dropCmd | & $mysqlPath -h $dbHost -P $dbPort -u $dbUser -p$dbPassword 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database recreated with UTF8MB4" -ForegroundColor Green
} else {
    Write-Host "ERROR creating database!" -ForegroundColor Red
    exit
}

Write-Host ""

# Step 2: Import SQL file
Write-Host "Step 2: Importing new database..." -ForegroundColor Yellow
Get-Content $sqlFile | & $mysqlPath -h $dbHost -P $dbPort -u $dbUser -p$dbPassword $dbName --default-character-set=utf8mb4 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "Import successful!" -ForegroundColor Green
} else {
    Write-Host "ERROR importing!" -ForegroundColor Red
    exit
}

Write-Host ""

# Step 3: Verify encoding
Write-Host "Step 3: Verifying encoding..." -ForegroundColor Yellow
$verifyCmd = @"
SELECT 
    DEFAULT_CHARACTER_SET_NAME, 
    DEFAULT_COLLATION_NAME 
FROM information_schema.SCHEMATA 
WHERE SCHEMA_NAME = '$dbName';
"@

$verifyCmd | & $mysqlPath -h $dbHost -P $dbPort -u $dbUser -p$dbPassword $dbName --default-character-set=utf8mb4 2>&1

Write-Host ""

# Step 4: Test Vietnamese data
Write-Host "Step 4: Testing Vietnamese data..." -ForegroundColor Yellow
$testCmd = "SELECT name, description FROM menu_items LIMIT 3;"
$testCmd | & $mysqlPath -h $dbHost -P $dbPort -u $dbUser -p$dbPassword $dbName --default-character-set=utf8mb4 2>&1

Write-Host ""
Write-Host "=== COMPLETED ===" -ForegroundColor Green
Write-Host ""
Write-Host "Database updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Open http://localhost:3000 to check website" -ForegroundColor White
Write-Host "2. Verify Vietnamese text displays correctly" -ForegroundColor White
Write-Host "3. If OK, commit and push to GitHub" -ForegroundColor White
Write-Host "4. Vercel/Railway will auto-deploy new version" -ForegroundColor White
Write-Host ""
