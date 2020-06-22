# Based on lambci build image with yarn and parcel
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
RUN yarn global add parcel@2.0.0-beta.1

CMD [ "parcel" ]
