#!/bin/bash
# Frontend startup script for macOS/Linux

cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
fi

# Start the development server
echo "Starting Vite development server on http://localhost:5173"
npm run dev
