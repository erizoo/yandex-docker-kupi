# Stage 1: Build
FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

COPY . .

# Сборка проекта
RUN npm run build

# Stage 2: Production
FROM node:16-alpine AS production

WORKDIR /app

# Устанавливаем PM2 глобально
RUN npm install -g pm2

# Копируем package.json и package-lock.json из builder стадии
COPY --from=builder /app/package*.json ./

# Устанавливаем только production зависимости
RUN npm ci --omit=dev

# Копируем директорию со сборкой приложения
COPY --from=builder /app/dist ./dist/

# Удаляем исходные файлы и ненужные конфиги
RUN rm -rf ./src

# Экспонируем порт, который использует ваше приложение
EXPOSE 3000

# Указываем команду для запуска приложения с помощью PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
