# runs the parcel-bundler npm package to package and install dependencies of nodejs lambda functions
ARG VERSION=13.8.0-alpine3.11
FROM node:$VERSION

RUN yarn global add parcel-bundler@^1

CMD [ "parcel" ]
