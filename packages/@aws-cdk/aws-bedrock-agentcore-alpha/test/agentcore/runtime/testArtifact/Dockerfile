# Test Dockerfile for Bedrock Agent Core Runtime tests
FROM public.ecr.aws/lambda/python:3.11

# Copy requirements if they exist
COPY requirements.txt* ./

# Install dependencies if requirements.txt exists
RUN if [ -f requirements.txt ]; then pip install -r requirements.txt; fi

# Copy the agent code
COPY . .

# Set the command for the agent runtime
CMD ["app.handler"]
