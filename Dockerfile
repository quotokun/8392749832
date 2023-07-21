# Use an official Node.js image as the base image
FROM node:14

# Set the working directory in the image
WORKDIR /app

# Copy the package.json and package-lock.json to the image
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code to the image
COPY . .

# Specify the command to run when the image starts as a container
CMD [ "npm", "start" ]

