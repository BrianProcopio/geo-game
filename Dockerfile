FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3535

CMD ["bun", "run", "dev", "--host", "--port", "3535"]
