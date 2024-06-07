FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json .
COPY yarn*.lock .
RUN npm i
COPY . .
RUN npm run build

#Stage 2
FROM nginx:latest
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
