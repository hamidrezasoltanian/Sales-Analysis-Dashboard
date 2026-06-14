@echo off
REM Sales Dashboard - Windows Deployment Preparation Script
REM این اسکریپت فایل‌های مورد نیاز برای deployment روی لینوکس را آماده می‌کند

echo 🚀 آماده‌سازی فایل‌ها برای deployment روی سرور لینوکس
echo.

REM بررسی وجود فایل‌های مورد نیاز
if not exist "Sales-Analysis-Dashboard-main" (
    echo ❌ پوشه Sales-Analysis-Dashboard-main یافت نشد
    pause
    exit /b 1
)

if not exist "backend" (
    echo ❌ پوشه backend یافت نشد
    pause
    exit /b 1
)

echo ✅ فایل‌های مورد نیاز یافت شدند
echo.

REM ایجاد پوشه deployment
if not exist "deployment-package" mkdir deployment-package

REM کپی فایل‌ها
echo 📁 کپی فایل‌ها...
xcopy "Sales-Analysis-Dashboard-main" "deployment-package\Sales-Analysis-Dashboard-main" /E /I /Y
xcopy "backend" "deployment-package\backend" /E /I /Y
copy "deploy-linux.sh" "deployment-package\" /Y
copy "deployment-guide.md" "deployment-package\" /Y
copy "README-DEPLOYMENT.md" "deployment-package\" /Y

echo ✅ فایل‌ها کپی شدند
echo.

REM ایجاد فایل tar برای آپلود آسان‌تر
echo 📦 ایجاد فایل فشرده...
powershell -Command "Compress-Archive -Path 'deployment-package\*' -DestinationPath 'sales-dashboard-deployment.zip' -Force"

echo ✅ فایل sales-dashboard-deployment.zip ایجاد شد
echo.

echo 🎉 آماده‌سازی تکمیل شد!
echo.
echo 📋 مراحل بعدی:
echo    1. فایل sales-dashboard-deployment.zip را به سرور لینوکس آپلود کنید
echo    2. روی سرور: unzip sales-dashboard-deployment.zip
echo    3. روی سرور: chmod +x deploy-linux.sh
echo    4. روی سرور: ./deploy-linux.sh
echo.
echo 📁 فایل‌های آماده شده:
echo    • sales-dashboard-deployment.zip - فایل کامل برای آپلود
echo    • deployment-package/ - پوشه فایل‌های جداگانه
echo.
pause
