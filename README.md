# Tooling Platform

We all have encountered the company full of home made scripts, standalone apps or random tools that an engineer or developer built for their needs. But distribution and deployment of these are a second thought.

This is the point of the Tooling Platform - a Kubernetes cluster that allows for containerized apps, cli scripts or jobs to be submitted in a central location.

The only requirements is that a tool has been dockerized, or already exists on a hub somewhere and can be added to the /apps directory from there.

## Architecture

* **Gateway:** Apollo Router/Gateway (Node.js) serving as the single entry point.
* **Messenger Service:** RabbitMQ-backed microservice for asynchronous job processing.
* **Portal:** Next.js frontend (App Router) for internal tooling management.
* **Orchestration:** K3d (Lightweight Kubernetes) for local development parity.

## Prerequisites

Ensure you have the following installed:

* [Docker](https://docs.docker.com/get-docker/)
* [k3d](https://k3d.io/)
* [kubectl](https://kubernetes.io/docs/tasks/tools/)
* [make](https://www.gnu.org/software/make/)

## Quick Start (Local Development)

### 1. Spin up the CLuster
```bash
k3d cluster create tooling-cluster -p "8080:80@loadbalancer"
```

### 2. Setup Environment variables
```bash
make init-envs
```

### 3. Deploy the stack
```bash
make sync-all
```

## Development Workflow
Useful Commands
- _make sync-all_	Full rebuild and deploy of all services.
- _make logs_	Stream interleaved logs from all containers.
- _make status_	Check the health of pods, services, and configmaps.
- _kubectl apply -k k8s/environments/dev_	Manual Kustomize apply (triggers rolling restarts).


## Repo Layout
apps/                    # Top level dir for all applications
├── portal/              # NextJS frontend for this platform
└── ...others/
k8s/
├── base/                # Core Blueprints (Deployments, Services)
└── envs/                # Overlays
    ├── dev/             # Local development configs & .env files
    └── prod/            # Production scale and secrets (Encrypted/Ignored)
services/
└──  gateway/            # GraphQL API
