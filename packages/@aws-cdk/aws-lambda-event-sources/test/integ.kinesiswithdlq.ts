import * as kinesis from '@aws-cdk/aws-kinesis';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sqs from '@aws-cdk/aws-sqs';
import { App, Stack } from "@aws-cdk/core";
import { KinesisEventSource, SqsDlq } from '../lib';

/*
 * Stack verification steps:
 * * aws lambda invoke --function-name <deployed 'FP' function name> --invocation-type Event --payload '"Event"' response.json
 * * Validate two executions of fn lambda
 * * Validate one message in dlq
 */

// tslint:disable:no-console
async function handler(event: any) {
    console.log('event:', JSON.stringify(event, undefined, 2));
    throw new Error();
}

class KinesisWithDLQTest extends Stack {
    constructor(scope: App, id: string) {
        super(scope, id);

        const fn = new lambda.Function(this, 'F', {
            runtime: lambda.Runtime.NODEJS_10_X,
            handler: 'index.handler',
            code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`)
        });

        const stream = new kinesis.Stream(this, 'S');

        const dlq = new sqs.Queue(this, 'Q');

        fn.addEventSource(new KinesisEventSource(stream, {
            startingPosition: lambda.StartingPosition.TRIM_HORIZON,
            onFailure: new SqsDlq(dlq),
            retryAttempts: 2
        }));

        new lambda.Function(this, 'FP', {
            runtime: lambda.Runtime.NODEJS_10_X,
            handler: 'index.handler',
            code: lambda.Code.fromInline(`
var AWS = require('aws-sdk');
exports.handler = event => {
    const kinesis = new AWS.Kinesis();
    kinesis.putRecord({
        Data: 'Hello World',
        PartitionKey: 'Hello Key',
        StreamName: '${stream.streamName}'
    }, (err, data) => {
        if (err) {
            console.log(\`Error: \${err}\`);
        }
    })
}
            `)
        });
    }
}

const app = new App();
new KinesisWithDLQTest(app, 'lambda-event-source-kinesis-with-dlq');
app.synth();
