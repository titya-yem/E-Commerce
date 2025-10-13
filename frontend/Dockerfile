# Stage 1: Build with Node
FROM node:20 AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lock ./
RUN npm install

# Copy source files and environment
COPY .env ./
COPY . .

# Fix all SVG folder names and filenames to lowercase
RUN find src/assets/svg -depth -type d -exec bash -c 'd="$1"; mv "$d" "$(dirname "$d")/$(basename "$d" | tr "[:upper:]" "[:lower:]")"' _ {} \;
RUN find src/assets/svg -type f -name "*.svg" -exec bash -c 'f="$1"; mv "$f" "$(dirname "$f")/$(basename "$f" | tr "[:upper:]" "[:lower:]")"' _ {} \;

# Build Vite app
RUN npm run build

# Stage 2: Serve with Bun
FROM oven/bun:1 AS runtime
WORKDIR /app

# Copy built files
COPY --from=build /app/dist /app/dist

EXPOSE 4173

CMD ["bun", "run", "preview", "--port", "4173", "--host"]
