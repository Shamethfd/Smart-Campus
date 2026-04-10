#!/bin/bash
# Local development runner - loads .env.local and starts Spring Boot

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found!"
    echo "📋 Copy .env.local.example to .env.local and fill in your secrets:"
    echo "   cp .env.local.example .env.local"
    exit 1
fi

# Load environment variables from .env.local
set -a
source .env.local
set +a

if [ -z "$GOOGLE_CLIENT_ID" ]; then
    echo "❌ GOOGLE_CLIENT_ID is missing in .env.local"
    exit 1
fi

if [ -z "$GOOGLE_CLIENT_SECRET" ]; then
    echo "❌ GOOGLE_CLIENT_SECRET is missing in .env.local"
    exit 1
fi

if [ "$GOOGLE_CLIENT_ID" = "YOUR_GOOGLE_CLIENT_ID_HERE" ]; then
    echo "❌ GOOGLE_CLIENT_ID is still a placeholder. Update .env.local with your real Google Web client ID."
    exit 1
fi

if [ "$GOOGLE_CLIENT_SECRET" = "YOUR_GOOGLE_CLIENT_SECRET_HERE" ]; then
    echo "❌ GOOGLE_CLIENT_SECRET is still a placeholder. Update .env.local with your real Google client secret."
    exit 1
fi

echo "✅ Environment variables loaded from .env.local"
echo "🚀 Starting Smart Campus API..."

# Run Maven Spring Boot
mvn spring-boot:run -DskipTests
