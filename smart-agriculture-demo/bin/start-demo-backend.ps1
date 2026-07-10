$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$jar = Join-Path $projectRoot "ruoyi-admin\target\ruoyi-admin.jar"
$outLog = Join-Path $projectRoot "logs\demo-backend.out.log"
$errLog = Join-Path $projectRoot "logs\demo-backend.err.log"

& (Join-Path $PSScriptRoot "start-demo-mysql.ps1")

if (-not (Test-Path (Join-Path $projectRoot "logs"))) {
    New-Item -ItemType Directory -Path (Join-Path $projectRoot "logs") | Out-Null
}

if (-not (Test-Path $jar)) {
    throw "Jar not found. Run: mvn -pl ruoyi-admin -am -DskipTests package"
}

$listener = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
if ($listener) {
    Write-Host "Backend is already running on port 8080."
    exit 0
}

Start-Process -FilePath "java" `
    -ArgumentList @("-jar", $jar) `
    -WorkingDirectory $projectRoot `
    -WindowStyle Hidden `
    -RedirectStandardOutput $outLog `
    -RedirectStandardError $errLog

Start-Sleep -Seconds 12
$listener = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
if (-not $listener) {
    Write-Host "Backend failed to start. Check log: $errLog"
    exit 1
}

Write-Host "Backend started: http://localhost:8080, PID=$($listener.OwningProcess)"
