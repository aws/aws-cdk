# runs the parcel-bundler npm package to package and install dependencies of nodejs lambda functions
ARG LAMBCI_LAMBDA_TAG=build-nodejs12.x
FROM lambci/lambda:${LAMBCI_LAMBDA_TAG}

RUN npm install --global yarn

RUN yarn global add parcel-bundler@^1 parcel-plugin-externals

# add the global node_modules folder to NODE_PATH so that plugins can find parcel-bundler
ENV NODE_PATH=/usr/local/share/.config/yarn/global/node_modules:$NODE_PATH

CMD [ "parcel" ]
