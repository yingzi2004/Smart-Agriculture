$ErrorActionPreference = "Continue"

$processes = Get-CimInstance Win32_Process |
    Where-Object { $_.Name -like "java*.exe" -and $_.CommandLine -like "*ruoyi-admin.jar*" }

foreach ($process in $processes) {
    Stop-Process -Id $process.ProcessId -Force
}

Write-Host "Backend stopped."
