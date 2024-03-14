FROM node:alpine3.18

# Declare build time environment variable
ARG NODE_ENV

# Set the environment variable
ENV NODE_ENV=$NODE_ENV

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "run", "start"]