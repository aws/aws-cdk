# The correct AWS SAM build image based on the runtime of the function will be
# passed as build arg. The default allows to do `docker build .` when testing.
ARG IMAGE=public.ecr.aws/sam/build-python3.7
FROM $IMAGE

# Ensure rsync is installed
RUN yum -q list installed rsync &>/dev/null || yum install -y rsync

# create non root user and change allow execute command for non root user
RUN /sbin/useradd -u 1000 user && chmod 711 /

CMD [ "python" ]
