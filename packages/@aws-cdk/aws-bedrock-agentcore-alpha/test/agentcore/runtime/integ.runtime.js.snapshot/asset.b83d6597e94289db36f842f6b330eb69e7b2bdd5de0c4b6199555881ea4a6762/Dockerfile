# Use Python 3.11 slim image for minimal size
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy the application file
COPY app.py .

# No external dependencies needed - using Python standard library only
# If requirements.txt exists and has content, uncomment the following:
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Expose port 8080
EXPOSE 8080

# Run the simple HTTP server
CMD ["python", "app.py"]
