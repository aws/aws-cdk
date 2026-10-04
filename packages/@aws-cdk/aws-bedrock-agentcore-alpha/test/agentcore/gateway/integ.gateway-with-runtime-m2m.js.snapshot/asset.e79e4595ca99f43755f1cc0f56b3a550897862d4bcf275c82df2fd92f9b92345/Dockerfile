# Minimal test application for Gateway integration
FROM public.ecr.aws/docker/library/python:3.12-slim

WORKDIR /app

# Copy application code
COPY app.py .

# Expose port for AgentCore Runtime
EXPOSE 8080

# Run the application
CMD ["python", "app.py"]
