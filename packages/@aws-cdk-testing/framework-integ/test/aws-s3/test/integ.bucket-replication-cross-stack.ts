import { App, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as iam from 'aws-cdk-lib/aws-iam';
import { AwsApiCall, IntegTest } from '@aws-cdk/integ-tests-alpha';

class DestStack extends Stack {
  public readonly role: iam.Role;
  public readonly bucket: s3.Bucket;
  public readonly key: kms.Key;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.role = new iam.Role(this, 'ReplicationRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    this.bucket = new s3.Bucket(this, 'DestinationBucket', {
      versioned: true,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.bucket.addReplicationPolicy(this.role.roleArn);

    this.key = new kms.Key(this, 'DestinationKmsKey', {
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}

class SourceStack extends Stack {
  public readonly bucket: s3.Bucket;

  constructor(scope: App, id: string, props: StackProps & {
    replicationRole: iam.Role;
    destinationBucket: s3.Bucket;
    destinationKmsKey?: kms.Key;
  }) {
    super(scope, id, props);

    const sourceKmsKey = new kms.Key(this, 'SourceKmsKey', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.bucket = new s3.Bucket(this, 'SourceBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: true,
      encryptionKey: sourceKmsKey,
      replicationRules: [
        {
          destination: props.destinationBucket,
          priority: 2,
          sseKmsEncryptedObjects: true,
          kmsKey: props.destinationKmsKey,
          replicationTimeControl: s3.ReplicationTimeValue.FIFTEEN_MINUTES,
          metrics: s3.ReplicationTimeValue.FIFTEEN_MINUTES,
        },
      ],
    });
  }
}

const app = new App();
const destStack = new DestStack(app, 'DestStack');
const sourceStack = new SourceStack(app, 'SourceStack', {
  replicationRole: destStack.role,
  destinationBucket: destStack.bucket,
  destinationKmsKey: destStack.key,
});

const integ = new IntegTest(app, 'Integ', {
  testCases: [destStack, sourceStack],
});

const firstAssertion = integ.assertions
  .awsApiCall('S3', 'putObject', {
    Bucket: sourceStack.bucket.bucketName,
    Key: 'test-object',
    Body: 'test-object-body',
    ContentType: 'text/plain',
  })
  .waitForAssertions({
    totalTimeout: Duration.minutes(5),
  }) as AwsApiCall;
firstAssertion.waiterProvider?.addToRolePolicy({
  Effect: 'Allow',
  Action: ['kms:*'],
  Resource: ['*'],
});

const secondAssertion = integ.assertions
  .awsApiCall('S3', 'putObject', {
    Bucket: sourceStack.bucket.bucketName,
    Key: 'prefix-test-object',
    Body: 'test-object-body',
    ContentType: 'text/plain',
  })
  .waitForAssertions({
    totalTimeout: Duration.minutes(5),
  }) as AwsApiCall;

const thirdAssertion = integ.assertions
  .awsApiCall('S3', 'getObject', {
    Bucket: destStack.bucket.bucketName,
    Key: 'test-object',
  })
  .waitForAssertions({
    totalTimeout: Duration.minutes(15),
  }) as AwsApiCall;
thirdAssertion.waiterProvider?.addToRolePolicy({
  Effect: 'Allow',
  Action: ['s3:*'],
  Resource: ['*'],
});

const fourthAssertion = integ.assertions
  .awsApiCall('S3', 'getObject', {
    Bucket: destStack.bucket.bucketName,
    Key: 'prefix-test-object',
  })
  .waitForAssertions({
    totalTimeout: Duration.minutes(15),
  });

const fifthAssertion = integ.assertions
  .awsApiCall('S3', 'getObject', {
    Bucket: destStack.bucket.bucketName,
    Key: 'prefix-test-object',
  })
  .waitForAssertions({
    totalTimeout: Duration.minutes(15),
  });

firstAssertion
  .next(secondAssertion)
  .next(thirdAssertion)
  .next(fourthAssertion)
  .next(fifthAssertion);
