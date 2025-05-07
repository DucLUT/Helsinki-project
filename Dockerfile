# Use a Debian-based Node.js image for the build stage
FROM node:22 AS build

WORKDIR /app/server
COPY server/package*.json /app/server/
RUN npm install --legacy-peer-deps

WORKDIR /app/client
COPY client/package*.json /app/client/
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Use a Debian-based Node.js image for the runtime stage
FROM node:22

WORKDIR /app

COPY --from=build /app ./

WORKDIR /app/server
COPY server/package*.json /app/server/
RUN npm install --omit=dev --legacy-peer-deps

WORKDIR /app/client
COPY client/package*.json /app/client/
RUN npm install --omit=dev --legacy-peer-deps

EXPOSE 8080

CMD ["node", "server/server.js"]