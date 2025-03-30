import { App, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AwsApiCall, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as iam from 'aws-cdk-lib/aws-iam';
import { SET_UNIQUE_REPLICATION_ROLE_NAME } from 'aws-cdk-lib/cx-api';

class TestStack extends Stack {
  public readonly sourceBucket: s3.Bucket;
  public readonly destinationBucket: s3.Bucket;
  public readonly replicationRole: iam.Role;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.destinationBucket = new s3.Bucket(this, 'DestinationBucket', {
      versioned: true,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const destinationKmsKey = new kms.Key(this, 'DestinationKmsKey', {
      removalPolicy: RemovalPolicy.DESTROY,
    });
    const sourceKmsKey = new kms.Key(this, 'SourceKmsKey', {
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.replicationRole = new iam.Role(this, 'ReplicationRole', {
      assumedBy: new iam.ServicePrincipal('s3.amazonaws.com'),
    });

    this.sourceBucket = new s3.Bucket(this, 'SourceBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: true,
      encryptionKey: sourceKmsKey,
      replicationRole: this.replicationRole,
      replicationRules: [
        {
          destination: this.destinationBucket,
          priority: 2,
          sseKmsEncryptedObjects: true,
          kmsKey: destinationKmsKey,
          replicationTimeControl: s3.ReplicationTimeValue.FIFTEEN_MINUTES,
          metrics: s3.ReplicationTimeValue.FIFTEEN_MINUTES,
        },
      ],
    });

    this.replicationRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['s3:GetReplicationConfiguration', 's3:ListBucket'],
      resources: [this.sourceBucket.bucketArn],
      effect: iam.Effect.ALLOW,
    }));
    this.replicationRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['s3:GetObjectVersionForReplication', 's3:GetObjectVersionAcl', 's3:GetObjectVersionTagging'],
      resources: [this.sourceBucket.arnForObjects('*')],
      effect: iam.Effect.ALLOW,
    }));
    this.replicationRole.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['s3:ReplicateObject', 's3:ReplicateDelete', 's3:ReplicateTags', 's3:ObjectOwnerOverrideToBucketOwner'],
      resources: [this.destinationBucket.arnForObjects('*')],
      effect: iam.Effect.ALLOW,
    }));
    sourceKmsKey.grantDecrypt(this.replicationRole);
    destinationKmsKey.grantEncrypt(this.replicationRole);
  }
}

// Disabled SET_UNIQUE_REPLICATION_ROLE_NAME feature flag
const app = new App({
  postCliContext: {
    [SET_UNIQUE_REPLICATION_ROLE_NAME]: false,
  },
});
const stack = new TestStack(app, 'BucketReplicationTestStack');
const integ = new IntegTest(app, 'ReplicationInteg', {
  testCases: [stack],
});

const firstAssertion = integ.assertions
  .awsApiCall('S3', 'putObject', {
    Bucket: stack.sourceBucket.bucketName,
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
    Bucket: stack.sourceBucket.bucketName,
    Key: 'prefix-test-object',
    Body: 'test-object-body',
    ContentType: 'text/plain',
  })
  .waitForAssertions({
    totalTimeout: Duration.minutes(5),
  }) as AwsApiCall;

const thirdAssertion = integ.assertions
  .awsApiCall('S3', 'getObject', {
    Bucket: stack.destinationBucket.bucketName,
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
    Bucket: stack.destinationBucket.bucketName,
    Key: 'prefix-test-object',
  })
  .waitForAssertions({
    totalTimeout: Duration.minutes(15),
  });

const fifthAssertion = integ.assertions
  .awsApiCall('S3', 'getObject', {
    Bucket: stack.destinationBucket.bucketName,
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
