FROM node:22-alpine AS build


#install dependencies for client and server
WORKDIR /server
COPY package.json package-lock.json ./
RUN npm install

WORKDIR /client
COPY package.json package-lock.json ./
RUN npm install

COPY . .


RUN npm run build


FROM nginx:alpine


COPY --from=build /app/dist /usr/share/nginx/html


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]