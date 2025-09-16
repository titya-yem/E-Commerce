# Use latest Node.js Alpine image
FROM node:20-alpine

# Install build tools for native modules
RUN apk add --no-cache python3 make g++ bash

# Create non-root user
RUN addgroup app && adduser -S -G app app

# Set working directory
WORKDIR /app

# Copy dependency files first
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Switch to non-root user
USER app

# Expose backend port
EXPOSE 3000

# Start the app using ts-node
CMD ["yarn", "dev"]
