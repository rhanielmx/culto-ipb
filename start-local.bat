@echo off
cd /d "%~dp0"
echo ============================================
echo  Iniciando culto-ipb com banco local
echo ============================================
echo.
echo [1/3] Subindo PostgreSQL...
docker compose up -d || ( echo ERRO: Docker Desktop esta rodando? & pause & exit /b 1 )
echo.
echo [2/3] Aguardando banco...
timeout /t 3 /nobreak >nul
echo.
echo [3/3] Sincronizando schema...
npx prisma db push || ( echo ERRO no prisma db push & pause & exit /b 1 )
echo.
echo === PRONTO! Rodando em http://localhost:3000 ===
echo.
echo Para expor pra internet, abra outro terminal e rode:
echo    ngrok http 3000
echo.
npm run dev -- --host 0.0.0.0
pause
