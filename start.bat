@echo off
color 0A
echo =========================================
echo       KHOI DONG DU AN APPBANLE
echo =========================================
echo.

echo [1/2] Dang khoi dong Backend (Node.js)...
start "AppBanLe - Backend" cmd /k "node app.js"

echo [2/2] Dang khoi dong Frontend (Vite/React)...
cd frontend
start "AppBanLe - Frontend" cmd /k "npm run dev"

echo.
echo Hoan thanh! Ca 2 server dang chay o cua so khac.
echo Ban co the truy cap ung dung tai http://localhost:5173
echo.
pause
