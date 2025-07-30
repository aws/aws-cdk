FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy function code
COPY index.js .

# Expose port (for testing purposes)
EXPOSE 3000

# Run the application
CMD [ "node", "index.js" ]