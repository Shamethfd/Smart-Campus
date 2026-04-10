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

echo "✅ Environment variables loaded from .env.local"
echo "🚀 Starting Smart Campus API..."

# Run Maven Spring Boot
mvn spring-boot:run -DskipTests
