/* eslint-disable */
// tslint:disable:no-console
// tslint:disable:no-var-requires

const AWS = require('aws-sdk');

export const handler = (event: any) => {
    const kinesis = new AWS.Kinesis();
    console.log(`event: ${JSON.stringify(event)}`);
    kinesis.putRecord({
        Data: 'Hello World',
        PartitionKey: 'Hello Key',
        StreamName: '${stream.streamName}'
    }, (err: any, data: any) => {
        if (err) {
            console.log(`Error: ${err}`);
        } else {
            console.log(`Data: ${data}`);
        }
    });
};
