@echo off
REM Frontend startup script for Windows

cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
)

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
)

REM Start the development server
echo Starting Vite development server on http://localhost:5173
call npm run dev
