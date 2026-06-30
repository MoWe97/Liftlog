# Stage 1: build frontend
FROM node:23-slim AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

COPY frontend/ ./
RUN npm run build

# Stage 2: Python runtime
FROM python:3.12-slim

WORKDIR /app/backend

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./

COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
