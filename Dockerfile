FROM node:20-alpine AS build
WORKDIR /opt/node_app

COPY package.json yarn.lock ./
COPY excalidraw-app/package.json ./excalidraw-app/
COPY packages ./packages
COPY scripts ./scripts
RUN yarn install --frozen-lockfile --network-timeout 600000

COPY . .
ARG VITE_APP_WS_SERVER_URL
ENV VITE_APP_WS_SERVER_URL=${VITE_APP_WS_SERVER_URL}

RUN yarn --cwd excalidraw-app build:app:docker

FROM nginx:stable-alpine AS runner
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /opt/node_app/excalidraw-app/build /usr/share/nginx/html
EXPOSE 80