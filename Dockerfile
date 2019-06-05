FROM node:10-alpine

WORKDIR /usr/src/app

# Copy the all *.json file because we need semantic.json to.
# Other wise semantic ui wont compile.
COPY *.json ./

RUN npm install

COPY . .

RUN npm run build
