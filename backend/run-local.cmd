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

REM Run Maven Spring Boot
mvn spring-boot:run -DskipTests
