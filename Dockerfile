# Use the official Node.js image as a base image
FROM node:14

# Set the working directory inside the container
WORKDIR /index

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that your app runs on
EXPOSE 3000

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

# Command to run your application
CMD ["npm", "start"]