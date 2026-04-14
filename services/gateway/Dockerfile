# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

RUN apk update && apk upgrade --no-cache && adduser -D apollo

# Copy only the compiled JS and production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder --chown=apollo:apollo /app/dist ./dist

USER apollo
EXPOSE $PORT
CMD ["node", "dist/index.js"]