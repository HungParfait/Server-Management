FROM node:16 AS ui-build
WORKDIR /app
COPY ./server-web-app ./client/
RUN cd client ; npm install ; npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=ui-build /app/client/dist /app
COPY nginx.conf /etc/nginx/nginx.conf