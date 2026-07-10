$ErrorActionPreference = "Continue"

$basedir = "C:\Program Files\MySQL\MySQL Server 8.0"
$mysqladmin = Join-Path $basedir "bin\mysqladmin.exe"

if (Test-Path $mysqladmin) {
    & $mysqladmin --host=127.0.0.1 --port=3307 --user=root --password=smart123456 shutdown 2>$null
    Start-Sleep -Seconds 2
}

$processes = Get-CimInstance Win32_Process |
    Where-Object { $_.Name -like "mysqld*.exe" -and $_.CommandLine -like "*F:\smart_agriculture_mysql_data_demo*" }

foreach ($process in $processes) {
    Stop-Process -Id $process.ProcessId -Force
}

Write-Host "Demo MySQL stopped."
