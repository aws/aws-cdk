import { randomUUID } from 'crypto';
import { DeliveryStream, DestinationBindOptions, DestinationConfig, IDestination } from '@aws-cdk/aws-kinesisfirehose-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CloudwatchLogsLogDestination, FirehoseLogDestination, IPipe, ISource, ITarget, IncludeExecutionData, InputTransformation, LogLevel, Pipe, S3LogDestination, SourceConfig, TargetConfig } from '../lib';
import { name } from '../package.json';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-logs');
const sourceQueue = new cdk.aws_sqs.Queue(stack, 'SourceQueue');
const targetQueue = new cdk.aws_sqs.Queue(stack, 'TargetQueue');

// When this module is promoted from alpha, TestSource and TestTarget should
// be replaced with SqsSource from @aws-cdk/aws-pipes-sources-alpha and
// SqsTarget from @aws-cdk/aws-pipes-targets-alpha
if (!name.endsWith('-alpha')) {
  throw new Error('aws-pipes has exited alpha, TestSource and TestTarget should now be replaced with SqsSource and SqsTarget');
}

class TestSource implements ISource {
  sourceArn: string;
  sourceParameters = undefined;
  constructor(private readonly queue: cdk.aws_sqs.Queue) {
    this.queue = queue;
    this.sourceArn = queue.queueArn;
  }
  bind(_pipe: IPipe): SourceConfig {
    return {
      sourceParameters: this.sourceParameters,
    };
  }
  grantRead(pipeRole: cdk.aws_iam.IRole): void {
    this.queue.grantConsumeMessages(pipeRole);
  }
}

class TestTarget implements ITarget {
  targetArn: string;
  inputTransformation: InputTransformation = InputTransformation.fromEventPath('$.body');
  constructor(private readonly queue: cdk.aws_sqs.Queue) {
    this.queue = queue;
    this.targetArn = queue.queueArn;
  }
  bind(_pipe: Pipe): TargetConfig {
    return {
      targetParameters: {
        inputTemplate: this.inputTransformation.bind(_pipe).inputTemplate,
      },
    };
  }
  grantPush(pipeRole: cdk.aws_iam.IRole): void {
    this.queue.grantSendMessages(pipeRole);
  }
}

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

const deliveryStream = new DeliveryStream(stack, 'Delivery Stream', {
  destination: mockS3Destination,
});

const logBucket = new cdk.aws_s3.Bucket(stack, 'LogBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

new Pipe(stack, 'Pipe', {
  pipeName: 'BaseTestPipe',
  source: new TestSource(sourceQueue),
  target: new TestTarget(targetQueue),
  logLevel: LogLevel.TRACE,
  logIncludeExecutionData: [IncludeExecutionData.ALL],
  logDestinations: [
    new CloudwatchLogsLogDestination(logGroup),
    new FirehoseLogDestination(deliveryStream),
    new S3LogDestination({
      bucket: logBucket,
      prefix: 'aws-pipes',
    }),
  ],
});

const test = new IntegTest(app, 'integtest-pipes-logs', {
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
  Messages: [{ Body: uniqueIdentifier }],
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(1),
  interval: cdk.Duration.seconds(15),
});

app.synth();
