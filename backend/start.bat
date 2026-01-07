@echo off
REM Backend startup script for Windows

cd /d "%~dp0"

REM Check if virtual environment exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies if needed
if not exist "venv\installed" (
    echo Installing dependencies...
    pip install -r requirements.txt
    type nul > venv\installed
)

REM Check if database exists
if not exist "dca.db" (
    echo Creating and seeding database...
    python seed.py
)

REM Start the server
echo Starting Flask backend on http://localhost:5000
python app.py
