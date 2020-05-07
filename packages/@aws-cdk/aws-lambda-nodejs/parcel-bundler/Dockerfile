# runs the parcel-bundler npm package to package and install dependencies of nodejs lambda functions
ARG NODE_TAG
FROM node:${NODE_TAG}

RUN yarn global add parcel-bundler@^1

# add the global node_modules folder to NODE_PATH so that plugins can find parcel-bundler
ENV NODE_PATH /usr/local/share/.config/yarn/global/node_modules

CMD [ "parcel" ]
