# С помощью директивы AS можно дать образу имя
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Устанавливаем зависимости
RUN npm i
COPY . .
RUN npm run build

FROM node:16-alpine as production
WORKDIR /app
# С помощью параметера --from указываем, что копировать нужно из образа builder
# Копируем package.json и package-lock.json (потребуются для установки зависимостей)
COPY --from=builder /app/package*.json ./
# Устанавливаем только зависимости, необходимые в продакшене
# --omit=dev означает «пропустить dev-зависимости»
RUN npm --prod
RUN rm -rf ./src
# Копируем директорию со сборкой приложения
COPY --from=builder /app/dist ./dist/

# Указываем команду для запуска приложения
CMD ["node", "./dist/main.js"]
