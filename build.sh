#!/usr/bin/env bash
set -e

echo "=== KoiShak Build ==="

# Build frontend
echo "Building frontend..."
cd frontend
npm ci
npm run build
cd ..

# Install backend deps
echo "Installing backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

echo "=== Build complete ==="
