# Use Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json /app
RUN yarn install

# Copy source code
COPY . /app

# Build TypeScript code
RUN yarn prisma:generate
RUN yarn build

# Copy .env file to the working directory
COPY .env ./

# Set environment variables
ARG PORT
ENV PORT=${PORT}

# Expose the port the app runs on
EXPOSE ${PORT}

# Command to run the application
CMD [ "yarn", "server:dist:migprod" ]

