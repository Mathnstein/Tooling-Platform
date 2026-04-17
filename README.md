# Tooling Platform

We all have encountered the company full of home made scripts, standalone apps or random tools that an engineer or developer built for their needs. But distribution and deployment of these are a second thought.

This is the point of the Tooling Platform - a Kubernetes cluster that allows for containerized apps, cli scripts or jobs to be submitted in a central location.

The only requirements is that a tool has been dockerized, or already exists on a hub somewhere and can be added to the /apps directory from there.

## Architecture

* **Gateway:** Apollo Router/GraphQL (Node.js) serving as the single entry point.
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
### 2. Setup Environment variables
```bash
make init-envs
```

```bash
make cluser-up
```

### 3. Deploy the stack
```bash
make sync-all
```

## Development Workflow
1. _make init-envs_: Create the require .env files (may need to go adjust contents for your session)
2. _make cluster-up_: Setup the k3d cluster
3. _make apply-all_ **or** _make sync-all_: Import all existing images **or** build and then import all images
4. _make forward-rabbit_: If you want to expose the RabbitMQ UI
5.  _make forward-stop_: Stop all port forwarding 
6. _make cluster-down_: Shut down the cluster, removing all containers

Useful Commands
- _make logs_	Stream interleaved logs from all containers.
- _make status_	Check the health of pods, services, and configmaps.
- _make sync-schema_ Will generate the graphql schema and codegen into the portal

## Repo Layout
```
apps/                    # Top level dir for all applications
├── portal/              # NextJS frontend for this platform
└── ...others/
k8s/
├── base/                # Core Blueprints (Deployments, Services)
└── envs/                # Overlays for the environments of each deployment
services/
└──  gateway/            # GraphQL API
```
