FROM public.ecr.aws/docker/library/node:20-alpine

# Create a simple test application inline
RUN echo 'console.log("ECR Dual-Stack Integration Test Application");' > /app.js && \
    echo 'console.log("Application started successfully");' >> /app.js && \
    echo 'console.log("Timestamp:", new Date().toISOString());' >> /app.js && \
    echo 'setInterval(() => console.log("Heartbeat:", new Date().toISOString()), 30000);' >> /app.js

# Expose port (for testing purposes)
EXPOSE 3000

# Run the application
CMD [ "node", "/app.js" ]