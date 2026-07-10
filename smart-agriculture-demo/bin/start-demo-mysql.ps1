$ErrorActionPreference = "Stop"

$basedir = "C:\Program Files\MySQL\MySQL Server 8.0"
$datadir = "F:\smart_agriculture_mysql_data_demo"
$projectRoot = Split-Path -Parent $PSScriptRoot
$logDir = Join-Path $projectRoot "logs"
$outLog = Join-Path $logDir "demo-mysql.out.log"
$errLog = Join-Path $logDir "demo-mysql.err.log"

if (-not (Test-Path (Join-Path $basedir "bin\mysqld.exe"))) {
    throw "mysqld.exe not found. Please check MySQL path: $basedir"
}

if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir | Out-Null
}

$listener = Get-NetTCPConnection -LocalPort 3307 -State Listen -ErrorAction SilentlyContinue
if ($listener) {
    Write-Host "Demo MySQL is already running on port 3307."
    exit 0
}

if (-not (Test-Path $datadir)) {
    Write-Host "Initializing Demo MySQL data directory: $datadir"
    & (Join-Path $basedir "bin\mysqld.exe") --no-defaults --initialize-insecure "--basedir=$basedir" "--datadir=$datadir" --console
}

$argsLine = "--no-defaults ""--basedir=$basedir"" ""--datadir=$datadir"" --port=3307 --bind-address=127.0.0.1 --mysqlx=0 --console"
$process = Start-Process -FilePath (Join-Path $basedir "bin\mysqld.exe") `
    -ArgumentList $argsLine `
    -WorkingDirectory $projectRoot `
    -WindowStyle Hidden `
    -RedirectStandardOutput $outLog `
    -RedirectStandardError $errLog `
    -PassThru

Start-Sleep -Seconds 5
$listener = Get-NetTCPConnection -LocalPort 3307 -State Listen -ErrorAction SilentlyContinue
if (-not $listener) {
    Write-Host "Demo MySQL failed to start. Check log: $errLog"
    exit 1
}

Write-Host "Demo MySQL started: 127.0.0.1:3307, PID=$($listener.OwningProcess)"
