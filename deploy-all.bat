@echo off
echo ====================================
echo   FULL DEPLOYMENT SCRIPT
echo ====================================
echo.
echo To run this script:
echo   .\deploy-all.bat
echo.
echo This script will:
echo   - Sync local database to Neon
echo   - Commit and push to GitHub
echo   - Deploy to Vercel production
echo.
echo ====================================
echo.

cd /d "e:\Damii\Posao\PRIVATNO\Web stranice\Nokti"

echo ====================================
echo   DATABASE SYNC
echo ====================================
echo.
echo Choose database action:
echo [1] Upload local data to Neon (append)
echo [2] Reset Neon database + upload local data (DELETE ALL)
echo [3] Skip database sync
echo.
set /p db_choice="Enter choice (1/2/3): "

if "%db_choice%"=="1" (
    echo.
    echo Syncing local database to Neon...
    cd server
    set DATABASE_URL=postgresql://neondb_owner:npg_rgSBQKc4Gk1T@ep-flat-credit-agkt1oxd-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
    call npx tsx prisma/seed.ts
    cd ..
    echo Database synced!
)

if "%db_choice%"=="2" (
    echo.
    echo WARNING: This will DELETE ALL data on Neon database!
    set /p confirm="Type YES to confirm: "
    if /i "%confirm%"=="YES" (
        echo.
        echo Resetting Neon database...
        cd server
        set DATABASE_URL=postgresql://neondb_owner:npg_rgSBQKc4Gk1T@ep-flat-credit-agkt1oxd-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
        call npx prisma migrate reset --force
        call npx tsx prisma/seed.ts
        cd ..
        echo Database reset and seeded!
    ) else (
        echo Database reset cancelled.
    )
)

if "%db_choice%"=="3" (
    echo Skipping database sync...
)

echo.
echo ====================================
echo   GIT DEPLOYMENT
echo ====================================
echo.

echo [1/4] Git add all changes...
git add .

echo.
echo [2/4] Git commit...
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Update deployment
git commit -m "%commit_msg%"

echo.
echo [3/4] Git push to GitHub...
git push origin master

echo.
echo [4/4] Deploying to Vercel production...
cd client
call vercel --prod --yes

echo.
echo ====================================
echo   SUCCESS!
echo ====================================
echo.
echo Frontend + Backend deployed!
echo Database synced to Neon!
echo Check your app at Vercel dashboard
echo.
pause
