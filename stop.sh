#!/bin/bash

echo "🛑 Stopping Frontend..."
pkill -f "npm run dev" # Stops Next.js/React process

echo "🛑 Stopping Backend..."
pkill -f "npm run start:dev" # Stops NestJS process

echo "🛑 Stopping Database (Docker)..."
docker stop socio-db

echo "✅ All services stopped!"
