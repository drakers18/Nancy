# Step 1: Build the React app
FROM node:18 AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the React app source code
COPY . .

# Build the React app for production
RUN npm run build

# Step 2: Serve the app with NGINX
FROM nginx:alpine

# Copy the build folder from the build stage into NGINX's default html folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
