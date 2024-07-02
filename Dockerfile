# Use a Node.js base image 
FROM node:18-alpine 

# Set the working directory in the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install 
RUN npm install pm2 -g


# Copy the rest of your application code 
COPY . .

# Expose the port your app listens on 
EXPOSE 5000 

# Set the entrypoint command to start your server 
# CMD ["node", "server.js"] 
CMD ["pm2-runtime", "server.js"]
