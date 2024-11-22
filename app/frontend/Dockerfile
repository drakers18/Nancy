FROM node:14 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Load environment variables from the .env file
#COPY .env .env

# Run the build command
RUN npm run build

FROM nginx:alpine

WORKDIR /etc/nginx

# Copies the nginx configuration and builds the react project so it can be served by nginx
COPY ./nginx.conf ./conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

# The actual website runs on port 3000
EXPOSE 3000

ENTRYPOINT [ "nginx" ]

CMD [ "-g", "daemon off;" ]