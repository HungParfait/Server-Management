FROM node:16 AS ui-build
WORKDIR /usr/src/app
COPY client/server-web-app ./client/
RUN cd client ; npm install ; npm run build

FROM node:16 AS server-build
WORKDIR /root/
COPY --from=ui-build /usr/src/app/client/dist ./public/
COPY backend/package*.json ./
RUN cd backend ; npm install
COPY backend/ ./

EXPOSE 3000

CMD ["npm", "start"]