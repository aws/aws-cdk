import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import { KinesisEventSource, SqsDlq } from 'aws-cdk-lib/aws-lambda-event-sources';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

/*
 * Stack verification steps:
 * * aws kinesis put-record --stream-name <value of stack output: InputKinesisStreamName> --partition-key 123 --data testdata
 * * aws sqs receive-message --queue-url <value of stack output: DlqSqsQueueUrl> --max-number-of-messages 1 --query 'Messages[0].Body'
 * The last command should return a string that contains the Lambda function ARN in it.
 */

async function handler(event: any) {
  // eslint-disable-next-line no-console
  console.log('event:', JSON.stringify(event, undefined, 2));
  throw new Error();
}

class KinesisWithDLQTest extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const fn = new lambda.Function(this, 'F', {
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = ${handler.toString()}`),
    });
    new CfnOutput(this, 'FunctionArn', { value: fn.functionArn });

    const stream = new kinesis.Stream(this, 'S');
    new CfnOutput(this, 'InputKinesisStreamName', { value: stream.streamName });

    const dlq = new sqs.Queue(this, 'Q');
    new CfnOutput(this, 'DlqSqsQueueUrl', { value: dlq.queueUrl });

    fn.addEventSource(new KinesisEventSource(stream, {
      startingPosition: lambda.StartingPosition.TRIM_HORIZON,
      onFailure: new SqsDlq(dlq),
      retryAttempts: 0,
    }));
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
new KinesisWithDLQTest(app, 'lambda-event-source-kinesis-with-dlq');
app.synth();
