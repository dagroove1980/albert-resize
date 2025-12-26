#!/bin/bash
# Script to set up environment variables via Vercel CLI
# Run this after you have all the values ready

echo "🚀 Setting up AlbertResize environment variables..."
echo ""

# Check if logged in
vercel whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Not logged into Vercel. Run: vercel login"
    exit 1
fi

echo "✅ Logged into Vercel"
echo ""

# AUTH_SECRET (already generated)
AUTH_SECRET="MbAj5lo/iGxcBGR6PQ87fY4CXxc9VzK+a5hGnCsz1dY="

echo "📝 Adding environment variables..."
echo ""

# Function to add env var
add_env() {
    local key=$1
    local value=$2
    local environments=${3:-"production,preview,development"}
    
    echo "Adding $key..."
    echo "$value" | vercel env add "$key" "$environments" --yes 2>&1 | grep -v "Vercel CLI"
    echo "✅ $key added"
    echo ""
}

# Note: You'll need to provide these values
# For now, this script shows the structure

echo "⚠️  IMPORTANT: Some values need to be obtained from external services:"
echo ""
echo "1. KV_REST_API_URL & KV_REST_API_TOKEN - From Vercel KV dashboard"
echo "2. GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET - From Google Cloud Console"
echo "3. GITHUB_CLIENT_ID & GITHUB_CLIENT_SECRET - From GitHub OAuth Apps"
echo "4. PADDLE_* - From Paddle dashboard"
echo "5. REPLICATE_API_TOKEN - From Replicate account"
echo ""
echo "Once you have all values, you can add them manually in Vercel dashboard"
echo "or update this script with the actual values and run it."
echo ""
echo "To add manually via CLI, use:"
echo "  echo 'your-value' | vercel env add VARIABLE_NAME production,preview,development"
echo ""

# Add AUTH_SECRET (we have this)
echo "Adding AUTH_SECRET..."
echo "$AUTH_SECRET" | vercel env add AUTH_SECRET production,preview,development --yes
echo "✅ AUTH_SECRET added"
echo ""

echo "📋 Remaining variables to add:"
echo "  - KV_REST_API_URL (from KV dashboard)"
echo "  - KV_REST_API_TOKEN (from KV dashboard)"
echo "  - GOOGLE_CLIENT_ID"
echo "  - GOOGLE_CLIENT_SECRET"
echo "  - GITHUB_CLIENT_ID"
echo "  - GITHUB_CLIENT_SECRET"
echo "  - PADDLE_API_KEY"
echo "  - PADDLE_WEBHOOK_SECRET"
echo "  - PADDLE_ENVIRONMENT (sandbox or production)"
echo "  - PADDLE_STARTER_PRICE_ID"
echo "  - PADDLE_PRO_PRICE_ID"
echo "  - PADDLE_BUSINESS_PRICE_ID"
echo "  - REPLICATE_API_TOKEN"
echo ""
echo "💡 Tip: Use the Vercel dashboard for easier setup:"
echo "   https://vercel.com/dashboard → Your Project → Settings → Environment Variables"

