FROM jsii/superchain

WORKDIR /app

ARG BUILD_ARGS

COPY . .

RUN ./build.sh ${BUILD_ARGS} && ./link-all.sh

ENTRYPOINT ["/app/node_modules/.bin/cdk"]
