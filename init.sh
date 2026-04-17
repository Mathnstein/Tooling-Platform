#!/bin/bash
# Setup .env file
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Created .env from .env.example"
    else
        echo "❌ Error: Neither .env nor .env.example found."
        exit 1
    fi
fi

# Load the variables
set -a
source <(grep -v '^#' .env | grep -v '^$' | sed 's/\r$//')
set +a

# Generate the actual config k3d will use
# envsubst is standard on Linux/Mac (gettext package)
envsubst < k3d-config.base.yaml > k3d-config.yaml

echo "✅ Generated k3d-config.yaml using port ${CLUSTER_PORT}"

# Generate k8s/envs/.env.gateway
cat <<EOF > ./k8s/envs/.env.gateway
# GENERATED FILE - DO NOT EDIT
NODE_ENV=$NODE_ENV
PORT=$LOCAL_GATEWAY_PORT
API_DOMAIN=$API_DOMAIN_CLUSTER
EOF

# Generate k8s/envs/.env.messenger.secrets
cat <<EOF > ./k8s/envs/.env.messenger.secrets
# GENERATED FILE - DO NOT EDIT
username=$MESSENGER_USER
password=$MESSENGER_PASS
API_DOMAIN=$API_DOMAIN_CLUSTER
EOF

echo "✅ K8s environment files synchronized from root .env"

# 2. Sync Portal .env (Vite needs VITE_ prefix for browser safety)
cat <<EOF > ./apps/portal/.env
# GENERATED FILE - DO NOT EDIT
NEXT_PUBLIC_LOCAL_PORT=$LOCAL_GATEWAY_PORT
NEXT_PUBLIC_CLUSTER_PORT=$CLUSTER_PORT
API_IN_CLUSTER=$API_IN_CLUSTER
NODE_ENV=$NODE_ENV
EOF

# 3. Sync Gateway .env
cat <<EOF > ./services/gateway/.env
# GENERATED FILE - DO NOT EDIT
PORT=$LOCAL_GATEWAY_PORT
NODE_ENV=$NODE_ENV
MESSENGER_USER=$MESSENGER_USER
MESSENGER_PASS=$MESSENGER_PASS
API_DOMAIN=$API_DOMAIN_LOCAL
API_IN_CLUSTER=$API_IN_CLUSTER
EOF

echo "✅ node environment files synchronized from root .env"