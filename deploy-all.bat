@echo off
echo ====================================
echo   FULL DEPLOYMENT - FRONTEND + BACKEND
echo ====================================
echo.

cd /d "e:\Damii\Posao\PRIVATNO\Web stranice\Nokti"

echo [1/5] Git add all changes...
git add .

echo.
echo [2/5] Git commit...
set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Update deployment
git commit -m "%commit_msg%"

echo.
echo [3/5] Git push to GitHub...
git push origin master

echo.
echo [4/5] Deploying to Vercel production...
cd client
call vercel --prod --yes

echo.
echo [5/5] Deployment complete!
echo.
echo ====================================
echo   SUCCESS!
echo ====================================
echo.
echo Frontend + Backend deployed!
echo Check your app at Vercel dashboard
echo.
pause
