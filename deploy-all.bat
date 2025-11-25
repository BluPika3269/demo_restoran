REM ====================================
REM   POKRETANJE SKRIPTE U TERMINALU:
REM   .\deploy-all.bat
REM ====================================

@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
echo ====================================
echo   DEPLOYMENT SKRIPTA
echo ====================================
echo.
echo Pokretanje skripte:
echo   deploy-all.bat
echo.
echo Ova skripta ce:
echo   - Sinkronizirati lokalnu bazu na Neon
echo   - Commit i push na GitHub
echo   - Deploy na Vercel produkciju
echo.
echo ====================================
echo.

cd /d "e:\Damii\Posao\PRIVATNO\Web stranice\Nokti"

echo ====================================
echo   SINKRONIZACIJA BAZE
echo ====================================
echo.
echo Odaberi akciju za bazu:
echo [1] Uploadaj lokalne podatke na Neon (web_stranica_nokti)
echo [2] Resetiraj Neon + uploadaj lokalne podatke (BRISE SVE!)
echo [3] Preskoci sinkronizaciju baze
echo.
choice /C 123 /N /M "Upisi izbor (1/2/3): "
set db_choice=%ERRORLEVEL%

if "%db_choice%"=="1" (
    echo.
    echo Sinkroniziram lokalnu bazu web_stranica_nokti na Neon...
    call node sync-local-to-neon.js
    echo Baza sinkronizirana!
)

if "%db_choice%"=="2" (
    echo.
    echo Resetiram i kreiram Neon bazu...
    cd client
    set "DATABASE_URL=postgresql://neondb_owner:npg_rgSBQKc4Gk1T@ep-flat-credit-agkt1oxd-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require"
    call npx prisma migrate reset --force --skip-seed
    cd ..
    echo.
    echo Uploadam lokalne podatke na Neon...
    call node sync-local-to-neon.js
    echo Baza resetirana i napunjena podacima iz lokalne baze!
)

if "%db_choice%"=="3" (
    echo Preskacem sinkronizaciju baze...
)

echo.
echo ====================================
echo   GIT DEPLOYMENT
echo ====================================
echo.

echo [1/4] Git add sve promjene...
git add .

echo.
echo [2/4] Git commit...
set /p "commit_msg=Upisi poruku commita (ili Enter za default): "
if "!commit_msg!"=="" set "commit_msg=Update deployment"
git commit -m "!commit_msg!"

echo.
echo [3/4] Git push na GitHub...
git push origin master

echo.
echo [4/5] Postavljam DATABASE_URL na Vercelu...
cd client
echo postgresql://neondb_owner:npg_rgSBQKc4Gk1T@ep-flat-credit-agkt1oxd-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require^&connection_limit=1^&pool_timeout=0 > .env.temp
vercel env add DATABASE_URL production --force < .env.temp
del .env.temp

echo.
echo [5/5] Deploy na Vercel produkciju...
echo Povezujem se sa Vercel projektom...
vercel link --yes
echo.
echo Pokrecem deployment...
vercel --prod --yes
cd ..

echo.
echo ====================================
echo   USPJEŠNO!
echo ====================================
echo.
echo Frontend + Backend deployani!
echo Baza sinkronizirana na Neon!
echo Provjeri aplikaciju na Vercel dashboardu
echo.
pause
