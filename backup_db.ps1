# PowerShell Backup Script for PostgreSQL Database
# Usage: .\backup_db.ps1

param(
    [switch]$Restore = $false,
    [string]$RestoreFile = ""
)

$BackupDir = ".\backups"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = "$BackupDir\learning_platform_backup_$Timestamp.sql"

# Create backups directory if it doesn't exist
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
    Write-Host "✅ Created backup directory: $BackupDir"
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ Error: .env file not found"
    exit 1
}

# Load .env file
$envContent = Get-Content ".env"
$env_vars = @{}
foreach ($line in $envContent) {
    if ($line -and -not $line.StartsWith("#")) {
        $key, $value = $line -split '=', 2
        if ($key) {
            $env_vars[$key.Trim()] = $value.Trim()
        }
    }
}

$postgresUser = $env_vars["POSTGRES_USER"]
$postgresDb = $env_vars["POSTGRES_DB"]

if (-not $postgresUser -or -not $postgresDb) {
    Write-Host "❌ Error: Missing POSTGRES_USER or POSTGRES_DB in .env"
    exit 1
}

if ($Restore) {
    # Restore mode
    if (-not $RestoreFile) {
        Write-Host "❌ Error: Please specify -RestoreFile parameter"
        Write-Host "Available backups:"
        Get-ChildItem $BackupDir -Filter "*.sql" | ForEach-Object { Write-Host "  - $($_.Name)" }
        exit 1
    }
    
    if (-not (Test-Path $RestoreFile)) {
        Write-Host "❌ Error: Backup file not found: $RestoreFile"
        exit 1
    }
    
    Write-Host "⚠️  WARNING: This will overwrite your current database!"
    $confirm = Read-Host "Are you sure? (yes/no)"
    if ($confirm -ne "yes") {
        Write-Host "Restore cancelled"
        exit 0
    }
    
    Write-Host "🔄 Restoring from: $RestoreFile"
    $restoreContent = Get-Content $RestoreFile -Raw
    $restoreContent | docker compose exec -T postgres psql -U $postgresUser $postgresDb
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Restore successful"
    } else {
        Write-Host "❌ Restore failed"
        exit 1
    }
} else {
    # Backup mode
    Write-Host "💾 Creating backup..."
    $backupContent = docker compose exec -T postgres pg_dump -U $postgresUser $postgresDb
    $backupContent | Out-File -FilePath $BackupFile -Encoding UTF8
    
    if ($LASTEXITCODE -eq 0) {
        $fileSize = (Get-Item $BackupFile).Length
        Write-Host "✅ Backup successful: $BackupFile"
        Write-Host "📊 Size: $('{0:N0}' -f $fileSize) bytes"
    } else {
        Write-Host "❌ Backup failed"
        exit 1
    }
}
