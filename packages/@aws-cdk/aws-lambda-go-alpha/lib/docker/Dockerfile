# The correct AWS SAM build image based on the runtime of the function will be
# passed as build arg. The default allows to do `docker build .` when testing.
ARG IMAGE=public.ecr.aws/sam/build-provided.al2023
FROM $IMAGE

# set the GOCACHE
ENV GOPATH=/go
ENV GOCACHE=$GOPATH/.cache/go-build
ENV GOPROXY=direct

# Ensure all users can write to GOPATH
RUN mkdir $GOPATH && \
  chmod -R 777 $GOPATH

# Setting a non-root user to run default command, 
# This will be overridden later when the Docker container is running, using either the local OS user or props.user.
USER nobody

CMD [ "go" ]
