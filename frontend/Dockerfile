# ==============================================================================
# Frontend Dockerfile (React + Vite)
# Multi-stage build for Development and Production
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. Base Node Image Stage
# ------------------------------------------------------------------------------
FROM node:20-alpine AS base
WORKDIR /app

# ------------------------------------------------------------------------------
# 2. Development Stage
# ------------------------------------------------------------------------------
FROM base AS development

# Copy dependency files
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

EXPOSE 5173

# Source code will be mounted from the host
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ------------------------------------------------------------------------------
# 3. Builder Stage (Production)
# ------------------------------------------------------------------------------
FROM base AS builder

# Copy package files and install clean dependencies
COPY package*.json ./
RUN npm ci

# Copy application code
COPY . .

# Accept build arguments for environment variables
ARG VITE_API_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Assign build arguments to environment variables for Vite
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Build the production bundle
RUN npm run build

# ------------------------------------------------------------------------------
# 4. Production Stage (Nginx)
# ------------------------------------------------------------------------------
FROM nginx:alpine AS production

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx routing configuration if you have one (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Nginx serves static files using the default CMD ["nginx", "-g", "daemon off;"]
