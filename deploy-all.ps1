# POKRETANJE SKRIPTE - .\deploy-all.ps1

# Postavi UTF-8 encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# DEPLOYMENT SKRIPTA
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   DEPLOYMENT SKRIPTA" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pokretanje skripte:" -ForegroundColor Yellow
Write-Host "   .\deploy-all.ps1" -ForegroundColor Yellow
Write-Host ""
Write-Host "Ova skripta ce:" -ForegroundColor Green
Write-Host "   - Sinkronizirati lokalnu bazu na Neon"
Write-Host "   - Commit i push na GitHub"
Write-Host "   - Deploy na Vercel produkciju"
Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "e:\Damii\Posao\PRIVATNO\Web stranice\Nokti"

# SINKRONIZACIJA BAZE
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   SINKRONIZACIJA BAZE" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Odaberi akciju za bazu:"
Write-Host "[1] Uploadaj lokalne podatke na Neon (dodaj podatke)" -ForegroundColor Green
Write-Host "[2] Resetiraj Neon bazu + uploadaj podatke (BRISE SVE!)" -ForegroundColor Red
Write-Host "[3] Preskoci sinkronizaciju baze" -ForegroundColor Gray
Write-Host ""
$db_choice = Read-Host -Prompt "Upisi izbor (1/2/3)"

if ($db_choice -eq "1") {
    Write-Host ""
    Write-Host "Sinkroniziram lokalnu bazu na Neon..." -ForegroundColor Yellow
    Set-Location server
    $env:DATABASE_URL = "postgresql://neondb_owner:npg_rgSBQKc4Gk1T@ep-flat-credit-agkt1oxd-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
    npx tsx prisma/seed.ts
    Set-Location ..
    Write-Host "Baza sinkronizirana!" -ForegroundColor Green
}

if ($db_choice -eq "2") {
    Write-Host ""
    Write-Host "UPOZORENJE: Ovo ce OBRISATI SVE podatke na Neon bazi!" -ForegroundColor Red
    $confirm = Read-Host -Prompt "Upisi DA za potvrdu"
    if ($confirm -eq "DA") {
        Write-Host ""
        Write-Host "Resetiram Neon bazu..." -ForegroundColor Yellow
        Set-Location server
        $env:DATABASE_URL = "postgresql://neondb_owner:npg_rgSBQKc4Gk1T@ep-flat-credit-agkt1oxd-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
        npx prisma migrate reset --force
        npx tsx prisma/seed.ts
        Set-Location ..
        Write-Host "Baza resetirana i napunjena podacima!" -ForegroundColor Green
    } else {
        Write-Host "Reset baze otkazan." -ForegroundColor Gray
    }
}

if ($db_choice -eq "3") {
    Write-Host "Preskacem sinkronizaciju baze..." -ForegroundColor Gray
}

# GIT DEPLOYMENT
Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   GIT DEPLOYMENT" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/4] Git add sve promjene..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "[2/4] Git commit..." -ForegroundColor Yellow
$commit_msg = Read-Host -Prompt "Upisi poruku commita (ili Enter za default)"
if ([string]::IsNullOrWhiteSpace($commit_msg)) {
    $commit_msg = "Update deployment"
}
git commit -m "$commit_msg"

Write-Host ""
Write-Host "[3/4] Git push na GitHub..." -ForegroundColor Yellow
git push origin master

Write-Host ""
Write-Host "[4/4] Deploy na Vercel produkciju..." -ForegroundColor Yellow
Set-Location client
vercel --prod --yes

Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "   USPJESNO!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend + Backend deployani!" -ForegroundColor Green
Write-Host "Baza sinkronizirana na Neon!" -ForegroundColor Green
Write-Host "Provjeri aplikaciju na Vercel dashboardu" -ForegroundColor Cyan
Write-Host ""
$null = Read-Host -Prompt "Pritisni Enter za izlaz"
