FROM node:18 AS base

FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci
RUN npm install -g ts-node typescript @types/node

FROM base AS runner
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE ${PORT:-3000}

CMD ["npm", "start"]