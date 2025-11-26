#!/bin/bash

# Start MongoDB with docker-compose
echo "Starting MongoDB..."
docker-compose up -d mongodb

# Wait for MongoDB to be ready
sleep 5

# Start NestJS backend
echo "Starting NestJS backend..."
cd backend
npm run start:dev &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend..."
cd ../frontend
npm run start:dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID