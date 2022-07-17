FROM node:16 AS server-build
WORKDIR /usr/src/app
COPY backend/package*.json ./
RUN cd backend ; npm install
COPY backend/ ./

EXPOSE 3000

CMD ["node", "index.js"]


