# syntax=docker/dockerfile:experimental
FROM public.ecr.aws/lambda/python:3.6

# Install SSH
RUN apk add --no-cache openssh-client

# Generate a new SSH key pair
RUN ssh-keygen -t rsa -b 2048 -f /root/.ssh/id_rsa -q -N ""

# Export the public key to a file
RUN ssh-keygen -y -f /root/.ssh/id_rsa > /root/.ssh/id_rsa.pub

WORKDIR /app

CMD python3 -m http.server 8000