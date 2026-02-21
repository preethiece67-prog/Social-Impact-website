# ==============================================================================
# Backend Dockerfile (FastAPI)
# Multi-stage build for Development and Production
# ==============================================================================

# ------------------------------------------------------------------------------
# 1. Base Stage
# ------------------------------------------------------------------------------
FROM python:3.11-slim AS base

# Prevent Python from writing .pyc files & buffer output
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Install system dependencies required for building pip packages and healthchecks
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 8000

# ------------------------------------------------------------------------------
# 2. Builder Stage
# ------------------------------------------------------------------------------
FROM base AS builder

COPY requirements.txt .

# Install dependencies into user directory to cleanly copy them later
RUN pip install --user -r requirements.txt

# ------------------------------------------------------------------------------
# 3. Development Stage
# ------------------------------------------------------------------------------
FROM base AS development

# Copy python dependencies
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

WORKDIR /app

# Code is mounted dynamically via docker-compose volume
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# ------------------------------------------------------------------------------
# 4. Production Stage
# ------------------------------------------------------------------------------
FROM base AS production

# Copy python dependencies
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Create non-root user for security
RUN addgroup --system appuser && adduser --system --group appuser
USER appuser

WORKDIR /app

# Copy application code
COPY --chown=appuser:appuser . .

# Optimized startup command using standard workers
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4", "--proxy-headers"]
