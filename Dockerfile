# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:10-alpine AS build

WORKDIR /usr/src/app

# Copy the all *.json file because we need semantic.json to.
# Other wise semantic ui wont compile.
COPY *.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:alpine

# Copy custom-nginx configuration file to the default.conf file
COPY --from=build /usr/src/app/custom-nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/build /usr/share/nginx/html