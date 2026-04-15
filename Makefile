# Variables
CLUSTER_NAME=platform-tooling-cluster
GATEWAY_IMG=platform-tooling-gateway:local
GATEWAY_DIR=./services/gateway

PORTAL_IMG=platform-tooling-portal:local
PORTAL_DIR=./apps/portal

RABBIT_MGMT_PORT=15672
RABBIT_AMQP_PORT=5672

.PHONY: init-envs cluster-up cluster-down apply-all apply-portal apply-gateway sync-all sync-portal sync-gateway logs status

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

# Create the cluster using the config file
cluster-up:
	@echo "Starting k3d cluster from config..."
	@k3d cluster create --config k3d-config.yaml

# Delete the cluster
cluster-down:
	@echo "Deleting k3d cluster..."
	@k3d cluster delete --config k3d-config.yaml

# Forward RabbitMQ ports for local access
forward-rabbit:
	@echo "Forwarding RabbitMQ ports..."
	@kubectl port-forward svc/platform-tooling-messenger-service $(RABBIT_MGMT_PORT):15672 > /dev/null 2>&1 &
	@kubectl port-forward svc/platform-tooling-messenger-service $(RABBIT_AMQP_PORT):5672 > /dev/null 2>&1 &
	@echo "RabbitMQ UI: http://localhost:$(RABBIT_MGMT_PORT)"
	@echo "RabbitMQ AMQP: amqp://localhost:$(RABBIT_AMQP_PORT)"
	@echo "Run 'make forward-stop' to close connections."

forward-stop:
	@echo "Closing all port-forwarding connections..."
	@pkill -f "kubectl port-forward" || echo "No processes found."

# The "Apply & import only" commands (No rebuilding)
# Use these when the cluster was restarted but the code hasn't changed.
apply-all:
	@k3d image import $(PORTAL_IMG) $(GATEWAY_IMG) -c $(CLUSTER_NAME)
	@kubectl apply -k k8s/envs/dev
	@kubectl rollout restart deployment/gateway-deployment deployment/portal-deployment || true
	@echo "Manifests applied and deployments restarted."

apply-portal:
	@k3d image import $(PORTAL_IMG) -c $(CLUSTER_NAME)
	@kubectl apply -k k8s/envs/dev
	@kubectl rollout restart deployment/portal-deployment || true
	@echo "Portal manifests refreshed."

apply-gateway:
	@k3d image import $(GATEWAY_IMG) -c $(CLUSTER_NAME)
	@kubectl apply -k k8s/envs/dev
	@kubectl rollout restart deployment/gateway-deployment || true
	@echo "Gateway manifests refreshed."

# The "Full Refresh" - Build, Import, and Apply
sync-all: sync-gateway sync-portal

# Sync only the Portal (Next.js)
sync-portal:
	docker build -t $(PORTAL_IMG) $(PORTAL_DIR)
	k3d image import $(PORTAL_IMG) -c $(CLUSTER_NAME)
	@$(MAKE) apply-portal

sync-gateway:
	docker build -t $(GATEWAY_IMG) $(GATEWAY_DIR)
	k3d image import $(GATEWAY_IMG) -c $(CLUSTER_NAME)
	@$(MAKE) apply-gateway

# Quick access to logs
logs:
	kubectl logs -l 'app in (gateway, portal)' --prefix -f

# Quick check on all resources
status:
	kubectl get pods -k k8s/envs/dev
