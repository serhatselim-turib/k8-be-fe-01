# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---- run ----
# nginx imajı /etc/nginx/templates altındaki *.template dosyalarını
# başlangıçta envsubst ile /etc/nginx/conf.d altına işler.
FROM nginx:1.27-alpine
ENV BACKEND_URL=http://backend:8080
ENV NGINX_ENVSUBST_FILTER=^BACKEND_URL$
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
