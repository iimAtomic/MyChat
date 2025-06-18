# Builder stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npx prisma migrate deploy

RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Installer uniquement prod dependencies
RUN npm install --production

# Copier build + prisma + .prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose port
EXPOSE 3001

CMD ["node", "dist/main.js"]
