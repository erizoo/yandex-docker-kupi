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
FROM nginx:1.23.1-alpine AS production

# Копируем конфигурационный файл nginx
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Копируем билд фронтенда в nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Экспонируем порт
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]
