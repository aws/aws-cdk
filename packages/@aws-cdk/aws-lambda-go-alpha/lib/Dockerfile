# The correct AWS SAM build image based on the runtime of the function will be
# passed as build arg. The default allows to do `docker build .` when testing.
ARG IMAGE=public.ecr.aws/sam/build-go1.x
FROM $IMAGE

# set the GOCACHE
ENV GOPATH=/go
ENV GOCACHE=$GOPATH/.cache/go-build
ENV GOPROXY=direct

# Ensure all users can write to GOPATH
RUN mkdir $GOPATH && \
  chmod -R 777 $GOPATH

CMD [ "go" ]
