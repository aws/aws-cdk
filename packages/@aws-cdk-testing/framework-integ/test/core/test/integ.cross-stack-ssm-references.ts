import { App, CfnOutput, RemovalPolicy, Stack, CrossStackReferenceType, StackReferences } from 'aws-cdk-lib/core';
import type { StackProps } from 'aws-cdk-lib/core';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';

/**
 * Integration test for SSM-based cross-stack references.
 *
 * Verifies that cross-stack references via SSM Parameters work with real
 * AWS resources:
 *
 * Test Case 1 (SSM mode):
 *   Producer creates an SQS Queue.
 *   Consumer creates a CloudWatch Alarm that monitors the queue depth,
 *   referencing the queue name across stacks via {{resolve:ssm:...}}.
 *
 * Test Case 2 (MIXED mode):
 *   Producer creates an S3 Bucket.
 *   Consumer creates an IAM Role with a policy granting read access to
 *   the bucket, referencing the bucket ARN via SSM (with a CFN Export
 *   also present for migration purposes).
 */

// ---------------------------------------------------------------------------
// Test Case 1: SSM mode - SQS Queue monitored by CloudWatch Alarm
// ---------------------------------------------------------------------------

class SqsProducerStack extends Stack {
  public readonly queue: sqs.Queue;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.queue = new sqs.Queue(this, 'SharedQueue', {
      encryption: sqs.QueueEncryption.SQS_MANAGED,
    });
    StackReferences.of(this.queue).toHere([CrossStackReferenceType.SSM]);
  }
}

interface SqsConsumerStackProps extends StackProps {
  readonly queue: sqs.Queue;
}

class SqsConsumerStack extends Stack {
  constructor(scope: Construct, id: string, props: SqsConsumerStackProps) {
    super(scope, id, props);

    // CloudWatch Alarm references queue.queueName across stacks via SSM
    new cloudwatch.Alarm(this, 'QueueDepthAlarm', {
      metric: props.queue.metricApproximateNumberOfMessagesVisible(),
      threshold: 100,
      evaluationPeriods: 1,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    new CfnOutput(this, 'MonitoredQueueUrl', {
      value: props.queue.queueUrl,
    });
  }
}

// ---------------------------------------------------------------------------
// Test Case 2: MIXED mode - S3 Bucket with IAM Role for read access
// ---------------------------------------------------------------------------

class S3ProducerStack extends Stack {
  public readonly bucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'SharedBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // MIXED mode: create both CFN Export and SSM Parameter
    StackReferences.of(this.bucket).toHere([
      CrossStackReferenceType.CFN_EXPORTS,
      CrossStackReferenceType.SSM,
    ]);
  }
}

interface S3ConsumerStackProps extends StackProps {
  readonly bucket: s3.Bucket;
}

class S3ConsumerStack extends Stack {
  constructor(scope: Construct, id: string, props: S3ConsumerStackProps) {
    super(scope, id, props);

    // IAM Policy references bucket.bucketArn across stacks via SSM
    const role = new iam.Role(this, 'BucketReaderRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    role.addToPolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject', 's3:ListBucket'],
      resources: [props.bucket.bucketArn, props.bucket.arnForObjects('*')],
    }));

    new CfnOutput(this, 'BucketArn', {
      value: props.bucket.bucketArn,
    });
    new CfnOutput(this, 'ReaderRoleArn', {
      value: role.roleArn,
    });
  }
}

// ---------------------------------------------------------------------------
// IntegTest setup
// ---------------------------------------------------------------------------

const app = new App();

const sqsProducer = new SqsProducerStack(app, 'SsmRefProducer');
const sqsConsumer = new SqsConsumerStack(app, 'SsmRefConsumer', {
  queue: sqsProducer.queue,
});

const s3Producer = new S3ProducerStack(app, 'SsmRefMixedProducer');
const s3Consumer = new S3ConsumerStack(app, 'SsmRefMixedConsumer', {
  bucket: s3Producer.bucket,
});

const testCase = new IntegTest(app, 'SsmCrossStackReferencesTest', {
  testCases: [sqsProducer, sqsConsumer, s3Producer, s3Consumer],
});

// ---------------------------------------------------------------------------
// Assertions
// ---------------------------------------------------------------------------

// Verify Test Case 1: Queue URL was resolved through SSM reference
const describeConsumer = testCase.assertions.awsApiCall('CloudFormation', 'describeStacks', {
  StackName: sqsConsumer.stackName,
});

// Ensure the assertion stack deploys after consumer stacks
const assertStack = Stack.of(describeConsumer);
assertStack.addDependency(sqsConsumer);
assertStack.addDependency(s3Consumer);

describeConsumer.expect(ExpectedResult.objectLike({
  Stacks: Match.arrayWith([
    Match.objectLike({
      Outputs: Match.arrayWith([
        Match.objectLike({
          OutputKey: 'MonitoredQueueUrl',
          OutputValue: Match.stringLikeRegexp('https://sqs\\..*\\.amazonaws\\.com/.*'),
        }),
      ]),
    }),
  ]),
}));

// Verify Test Case 2: Bucket ARN was resolved through MIXED SSM reference
const describeMixedConsumer = testCase.assertions.awsApiCall('CloudFormation', 'describeStacks', {
  StackName: s3Consumer.stackName,
});

describeMixedConsumer.expect(ExpectedResult.objectLike({
  Stacks: Match.arrayWith([
    Match.objectLike({
      Outputs: Match.arrayWith([
        Match.objectLike({
          OutputKey: 'BucketArn',
          OutputValue: Match.stringLikeRegexp('arn:aws:s3:::.*'),
        }),
      ]),
    }),
  ]),
}));

// Verify SSM Parameters were actually created in the producer stacks

// Test Case 1: SSM parameters exist under /cdk/cross-stack-refs/SsmRefProducer/
const ssmParamsProducer = testCase.assertions.awsApiCall('SSM', 'getParametersByPath', {
  Path: '/cdk/cross-stack-refs/SsmRefProducer/',
});

ssmParamsProducer.expect(ExpectedResult.objectLike({
  Parameters: Match.arrayWith([
    Match.objectLike({
      Name: Match.stringLikeRegexp('/cdk/cross-stack-refs/SsmRefProducer/.*'),
      Type: 'String',
    }),
  ]),
}));

// Test Case 2: SSM parameter stores the S3 bucket ARN
const ssmParamsMixed = testCase.assertions.awsApiCall('SSM', 'getParametersByPath', {
  Path: '/cdk/cross-stack-refs/SsmRefMixedProducer/',
});

ssmParamsMixed.expect(ExpectedResult.objectLike({
  Parameters: Match.arrayWith([
    Match.objectLike({
      Name: Match.stringLikeRegexp('/cdk/cross-stack-refs/SsmRefMixedProducer/.*'),
      Type: 'String',
      Value: Match.stringLikeRegexp('arn:aws:s3:::.*'),
    }),
  ]),
}));
