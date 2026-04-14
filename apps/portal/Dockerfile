# Stage 1: Install dependencies and build the app
FROM node:24-alpine AS builder
WORKDIR /app

RUN apk update && apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production runner
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN apk update && apk upgrade --no-cache

# Create a non-root user for security
RUN adduser -D nextjs
USER nextjs

# Copy standalone build from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]