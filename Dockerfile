# Telos Whiteboard — lean production image for Coolify
FROM node:20-alpine AS build

WORKDIR /opt/node_app

COPY package.json yarn.lock ./
COPY excalidraw-app/package.json ./excalidraw-app/
COPY packages ./packages
COPY scripts ./scripts
COPY public ./public
COPY excalidraw-app ./excalidraw-app
COPY tsconfig.json ./
COPY .env.production ./

# Collaboration WebSocket server (set in Coolify build args / env)
ARG VITE_APP_WS_SERVER_URL=https://collab.yourdomain.com
ENV VITE_APP_WS_SERVER_URL=${VITE_APP_WS_SERVER_URL}

RUN yarn install --frozen-lockfile --network-timeout 600000 \
  && yarn --cwd excalidraw-app build:app:docker

FROM nginx:stable-alpine AS runner

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /opt/node_app/excalidraw-app/build /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
