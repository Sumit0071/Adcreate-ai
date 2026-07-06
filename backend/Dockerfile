# Stage 1: Build environment
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies for build process)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Production environment
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy dependency files
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies to keep the image small
RUN npm ci --omit=dev

# Generate Prisma client for production
RUN npx prisma generate

# Copy built code from the builder stage
COPY --from=builder /app/dist ./dist

# Create the generated directory for static files/media
RUN mkdir -p generated

# Expose the default port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]