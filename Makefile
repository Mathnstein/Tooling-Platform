# Variables
CLUSTER_NAME=tooling-cluster
GATEWAY_IMG=tooling-platform-gateway:local
GATEWAY_DIR=./services/gateway

PORTAL_IMG=tooling-platform-portal:local
PORTAL_DIR=./apps/portal

.PHONY: sync-all gateway-sync portal-sync logs status init-envs

# The "Full Refresh" - Build, Import, and Apply
sync-all: gateway-sync portal-sync

# Sync only the Portal (Next.js)
portal-sync:
	docker build -t $(PORTAL_IMG) $(PORTAL_DIR)
	k3d image import $(PORTAL_IMG) -c $(CLUSTER_NAME)
	kubectl apply -k k8s/environments/dev
	@echo "🌐 Portal synced."

gateway-sync:
	docker build -t $(GATEWAY_IMG) $(GATEWAY_DIR)
	k3d image import $(GATEWAY_IMG) -c $(CLUSTER_NAME)
	kubectl apply -k k8s/environments/dev
	@echo "🚀 Gateway synced and rolled out."

# Quick access to logs
logs:
	kubectl logs -l 'app in (gateway, portal)' --prefix -f

# Quick check on all resources
status:
	kubectl get pods -k k8s/environments/dev

# Initialize environment files from examples
init-envs:
	@echo "Searching for environment templates..."
	@find . -name "*.example" -not -path "*/node_modules/*" | while read -r src; do \
		dst=$${src%.example}; \
		if [ ! -f "$$dst" ]; then \
			cp "$$src" "$$dst"; \
			echo "Created $$dst from example"; \
		else \
			echo "$$dst already exists, skipping..."; \
		fi \
	done
	@echo "Environment initialization complete!"