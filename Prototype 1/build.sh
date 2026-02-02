#!/bin/bash
set -e
echo "Starting custom build script..."
cd frontend
echo "Installing dependencies..."
npm install
echo "Dependencies installed."
echo "Running build..."
npm run build
echo "Build complete."
