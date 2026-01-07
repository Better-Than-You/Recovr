#!/bin/bash
# Backend startup script for macOS/Linux

cd "$(dirname "$0")"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies if needed
if [ ! -f "venv/installed" ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
    touch venv/installed
fi

# Check if database exists
if [ ! -f "dca.db" ]; then
    echo "Creating and seeding database..."
    python seed.py
fi

# Start the server
echo "Starting Flask backend on http://localhost:5000"
python app.py
