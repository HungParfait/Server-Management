FROM node:16 AS ui-build
WORKDIR /app
COPY client/server-web-app ./client/
RUN cd client ; npm install ; npm run build

FROM node:16 AS server-build
WORKDIR /usr/src/app
COPY --from=ui-build /app/client/dist ./public/dist
COPY backend/package*.json ./
RUN cd backend ; npm install
COPY backend/ ./

EXPOSE 3000

CMD ["node", "index.js"]