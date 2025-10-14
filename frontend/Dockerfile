# Use Bun for everything (install, build, serve)
FROM oven/bun:1

# Set working directory
WORKDIR /app

# Copy dependency files first for caching
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy all source files
COPY . .

# Build your Vite app
RUN bun run build

# Expose the Vite preview port
EXPOSE 4173

# Serve built app
CMD ["bun", "run", "preview", "--port", "4173", "--host"]
