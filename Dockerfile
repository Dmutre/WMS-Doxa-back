FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD pnpm start:dev && pnpm db:seed
