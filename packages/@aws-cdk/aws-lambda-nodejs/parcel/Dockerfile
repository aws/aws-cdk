# The correct lambci build image based on the runtime of the function will be
# passed as build arg. The default allows to do `docker build .` when testing.
ARG IMAGE=lambci/lambda:build-nodejs12.x
FROM $IMAGE

# Ensure npm cache is not owned by root because the image will not run
# as root and can potentially run `npm install`.
RUN mkdir /npm-cache && \
    chown -R 1000:1000 /npm-cache && \
    npm config --global set cache /npm-cache

# Install yarn
RUN npm install --global yarn

# Install parcel 2 (fix the version since it's still in beta)
# install at "/" so that node_modules will be in the path for /asset-input
ARG PARCEL_VERSION=2.0.0-beta.1
RUN cd / && npm install parcel@$PARCEL_VERSION

CMD [ "parcel" ]
