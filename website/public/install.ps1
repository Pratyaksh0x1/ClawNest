# ClawNest 1-Line Installer for Windows (PowerShell)
# Set sail on the Grand Line of Code! 🏴‍☠️

$ErrorActionPreference = 'Stop'

Write-Host "   _____ _                 _   _           _   " -ForegroundColor Yellow
Write-Host "  / ____| |               | \ | |         | |  " -ForegroundColor Yellow
Write-Host " | |    | | __ ___      __|  \| | ___  ___| |_ " -ForegroundColor Yellow
Write-Host " | |    | |/ _` \ \ /\ / /| . ` |/ _ \/ __| __|" -ForegroundColor Yellow
Write-Host " | |____| | (_| |\ V  V / | |\  |  __/\__ \ |_ " -ForegroundColor Yellow
Write-Host "  \_____|_|\__,_| \_/\_/  |_| \_|\___||___/\__|" -ForegroundColor Yellow
Write-Host "       🏴‍☠️ THE KING OF AI PIRATES 🏴‍☠️`n" -ForegroundColor Cyan

Write-Host "⚓ Ahoy, Captain! Preparing ClawNest on your Windows vessel..." -ForegroundColor Cyan

$InstallDir = Join-Path $HOME ".clawnest"
$BinDir = Join-Path $HOME ".local\bin"

# 1. Verify Bun
if (-not (Get-Command "bun" -ErrorAction SilentlyContinue)) {
    Write-Host "⚡ Bun not found. Installing Bun..." -ForegroundColor Yellow
    Invoke-RestMethod -Uri "https://bun.sh/install.ps1" | Invoke-Expression
    $env:BUN_INSTALL = Join-Path $HOME ".bun"
    $env:PATH = "$($env:BUN_INSTALL)\bin;$($env:PATH)"
}

# 2. Verify Git
if (-not (Get-Command "git" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git is required to clone ClawNest. Please install git from https://git-scm.com/ and re-run." -ForegroundColor Red
    Exit 1
}

# 3. Clone or pull repo
if (Test-Path "$InstallDir\.git") {
    Write-Host "🔄 Updating existing ClawNest..." -ForegroundColor Green
    git -C $InstallDir pull --quiet
} else {
    Write-Host "🚀 Cloning ClawNest repository..." -ForegroundColor Green
    git clone --depth 1 "https://github.com/Pratyaksh0x1/ClawNest.git" $InstallDir --quiet
}

# 4. Install dependencies
Write-Host "🔨 Provisioning your pirate crew (installing packages with Bun)..." -ForegroundColor Cyan
Push-Location $InstallDir
try {
    bun install
} finally {
    Pop-Location
}

# 5. Create shim / launcher batch file
if (-not (Test-Path $BinDir)) {
    New-Item -ItemType Directory -Force -Path $BinDir | Out-Null
}

$CmdLauncher = Join-Path $BinDir "clawnest.cmd"
$PsLauncher = Join-Path $BinDir "clawnest.ps1"

Set-Content -Path $CmdLauncher -Value "@echo off`nbun run `"$InstallDir\index.ts`" %*"
Set-Content -Path $PsLauncher -Value "& bun run `"$InstallDir\index.ts`" @args"

# 6. Ensure PATH
$UserPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::User)
if ($UserPath -notlike "*$BinDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$BinDir;$UserPath", [EnvironmentVariableTarget]::User)
    $env:PATH = "$BinDir;$($env:PATH)"
    Write-Host "💡 Added $BinDir to your User PATH!" -ForegroundColor Yellow
}

Write-Host "`n✨ ClawNest is ready to conquer the Grand Line!" -ForegroundColor Green
Write-Host "Run the command below in any terminal:" -ForegroundColor Yellow
Write-Host "  clawnest wakeup`n" -ForegroundColor Cyan

# Prompt to launch
$launch = Read-Host "Wake up ClawNest right now? (Y/N)"
if ($launch -eq '' -or $launch -match '^[Yy]') {
    & bun run "$InstallDir\index.ts" wakeup
}
