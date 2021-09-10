# The correct AWS SAM build image based on the runtime of the function will be
# passed as build arg. The default allows to do `docker build .` when testing.
ARG IMAGE=lambci/lambda:build-go1.x
FROM $IMAGE

# set the GOCACHE
ENV GOCACHE=$GOPATH/.cache/go-build
ENV GOPROXY=direct

# Ensure all users can write to GOPATH
RUN chmod -R 777 $GOPATH

CMD [ "go" ]
