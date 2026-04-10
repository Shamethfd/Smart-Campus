@echo off
REM Local development runner for Windows - loads .env.local and starts Spring Boot

REM Check if .env.local exists
if not exist .env.local (
    echo ❌ .env.local not found!
    echo 📋 Copy .env.local.example to .env.local and fill in your secrets:
    echo    copy .env.local.example .env.local
    pause
    exit /b 1
)

echo ✅ Loading environment variables from .env.local
echo 🚀 Starting Smart Campus API...

REM Load each variable from .env.local (simple approach)
for /f "delims== tokens=1,*" %%A in (.env.local) do (
    if not "%%A"=="" (
        if not "%%A:~0,1%%"=="#" (
            set "%%A=%%B"
        )
    )
)

if "%GOOGLE_CLIENT_ID%"=="" (
    echo ❌ GOOGLE_CLIENT_ID is missing in .env.local
    pause
    exit /b 1
)

if "%GOOGLE_CLIENT_SECRET%"=="" (
    echo ❌ GOOGLE_CLIENT_SECRET is missing in .env.local
    pause
    exit /b 1
)

if /I "%GOOGLE_CLIENT_ID%"=="YOUR_GOOGLE_CLIENT_ID_HERE" (
    echo ❌ GOOGLE_CLIENT_ID is still a placeholder. Update .env.local with your real Google Web client ID.
    pause
    exit /b 1
)

if /I "%GOOGLE_CLIENT_SECRET%"=="YOUR_GOOGLE_CLIENT_SECRET_HERE" (
    echo ❌ GOOGLE_CLIENT_SECRET is still a placeholder. Update .env.local with your real Google client secret.
    pause
    exit /b 1
)

REM Run Maven Spring Boot
mvn spring-boot:run -DskipTests
