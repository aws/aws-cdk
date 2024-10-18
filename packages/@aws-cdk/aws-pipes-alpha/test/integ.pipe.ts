import { randomUUID } from 'crypto';
import { DeliveryStream, DestinationBindOptions, DestinationConfig, IDestination } from '@aws-cdk/aws-kinesisfirehose-alpha';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SqsSource } from '@aws-cdk/aws-pipes-sources-alpha';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SqsTarget } from '@aws-cdk/aws-pipes-targets-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Code } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { CloudwatchLogsLogDestination, DynamicInput, EnrichmentParametersConfig, FirehoseLogDestination, IEnrichment, IPipe, IncludeExecutionData, InputTransformation, LogLevel, Pipe, S3LogDestination, S3OutputFormat } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');
const targetQueue = new cdk.aws_sqs.Queue(stack, 'TargetQueue');

const enrichmentHandlerCode = 'exports.handler = async (event) => { return event.map( record => ({...record, body: `${record.body}-${record.name}-${record.static}` }) ) };';
const enrichmentLambda = new cdk.aws_lambda.Function(stack, 'EnrichmentLambda', {
  code: Code.fromInline(enrichmentHandlerCode),
  handler: 'index.handler',
  runtime: cdk.aws_lambda.Runtime.NODEJS_LATEST,
});

const logGroup = new cdk.aws_logs.LogGroup(stack, 'LogGroup', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const firehoseBucket = new cdk.aws_s3.Bucket(stack, 'FirehoseBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const role = new cdk.aws_iam.Role(stack, 'Role', {
  assumedBy: new cdk.aws_iam.ServicePrincipal('firehose.amazonaws.com'),
});

const mockS3Destination: IDestination = {
  bind(_scope: Construct, _options: DestinationBindOptions): DestinationConfig {
    const bucketGrant = firehoseBucket.grantReadWrite(role);
    return {
      extendedS3DestinationConfiguration: {
        bucketArn: firehoseBucket.bucketArn,
        roleArn: role.roleArn,
      },
      dependables: [bucketGrant],
    };
  },
};

const deliveryStream = new DeliveryStream(stack, 'Delivery Stream No Source Or Encryption Key', {
  destination: mockS3Destination,
});

const logBucket = new cdk.aws_s3.Bucket(stack, 'LogBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

class TestEnrichment implements IEnrichment {
  enrichmentArn: string;

  inputTransformation: InputTransformation = InputTransformation.fromObject({
    body: DynamicInput.fromEventPath('$.body'),
    name: DynamicInput.pipeName,
    static: 'static',
  });
  constructor(private readonly lambda: cdk.aws_lambda.Function) {
    this.enrichmentArn = lambda.functionArn;
  }
  bind(pipe: IPipe): EnrichmentParametersConfig {
    return {
      enrichmentParameters: {
        inputTemplate: this.inputTransformation.bind(pipe).inputTemplate,
      },
    };
  }
  grantInvoke(pipeRole: cdk.aws_iam.IRole): void {
    this.lambda.grantInvoke(pipeRole);
  }
}

const pipe = new Pipe(stack, 'Pipe', {
  pipeName: 'BaseTestPipe',
  source: new SqsSource(sourceQueue),
  target: new SqsTarget(targetQueue, {
    inputTransformation: InputTransformation.fromEventPath('$.body'),
  }),
  enrichment: new TestEnrichment(enrichmentLambda),
  logLevel: LogLevel.TRACE,
  logIncludeExecutionData: [IncludeExecutionData.ALL],
  logDestinations: [
    new CloudwatchLogsLogDestination(logGroup),
    new FirehoseLogDestination(deliveryStream),
    new S3LogDestination({
      bucket: logBucket,
      prefix: 'aws-pipes',
      outputFormat: S3OutputFormat.JSON,
    }),
  ],
});

const test = new IntegTest(app, 'integtest-pipe-sqs-to-sqs', {
  testCases: [stack],
});

const uniqueIdentifier = randomUUID();
const putMessageOnQueue = test.assertions.awsApiCall('SQS', 'sendMessage', {
  QueueUrl: sourceQueue.queueUrl,
  MessageBody: uniqueIdentifier,
});

putMessageOnQueue.next(test.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: targetQueue.queueUrl,
})).expect(ExpectedResult.objectLike({
  Messages: [{ Body: uniqueIdentifier+ '-' + pipe.pipeName + '-static' }],
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(2),
  interval: cdk.Duration.seconds(15),
});

app.synth();
