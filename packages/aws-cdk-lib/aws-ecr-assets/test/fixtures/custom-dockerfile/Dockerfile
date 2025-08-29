FROM public.ecr.aws/lambda/nodejs:18

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY app.js ./

# Simple test application
CMD ["app.handler"]
