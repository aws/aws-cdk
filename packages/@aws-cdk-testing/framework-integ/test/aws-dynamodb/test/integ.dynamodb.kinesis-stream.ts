import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-dynamodb-kinesis-stream');

const stream = new kinesis.Stream(stack, 'Stream');

new dynamodb.Table(stack, 'Table', {
  partitionKey: { name: 'hashKey', type: dynamodb.AttributeType.STRING },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  kinesisStream: stream,
  kinesisPrecisionTimestamp: dynamodb.ApproximateCreationDateTimePrecision.MILLISECOND,
});

app.synth();
