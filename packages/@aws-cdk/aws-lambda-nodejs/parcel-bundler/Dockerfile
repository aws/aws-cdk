# runs the parcel-bundler npm package to package and install dependencies of nodejs lambda functions
ARG NODE_TAG
FROM node:${NODE_TAG}

RUN yarn global add parcel-bundler@^1

CMD [ "parcel" ]
