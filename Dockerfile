FROM jsii/superchain

WORKDIR /app

COPY . .

RUN ./build.sh && ./link-all.sh

ENTRYPOINT ["/app/node_modules/.bin/cdk"]
