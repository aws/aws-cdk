FROM node:20-alpine

# Install TypeScript globally
RUN npm install -g typescript

# Create app directory
WORKDIR /app

# Copy function code
COPY index.ts .

# Compile TypeScript to JavaScript
RUN tsc index.ts

# Expose port (for testing purposes)
EXPOSE 3000

# Run the application
CMD [ "node", "index.js" ]