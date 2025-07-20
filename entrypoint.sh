#!/bin/sh

corepack enable pnpm

echo "Deploying database..."
pnpm db:deploy

echo "Starting server..."
node server.js