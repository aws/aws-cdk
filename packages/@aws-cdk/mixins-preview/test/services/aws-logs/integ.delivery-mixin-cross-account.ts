/*
 * Our integration tests act as snapshot tests to make sure the rendered template is stable.
 * If any changes to the result are required,
 * you need to perform an actual CloudFormation deployment of this application,
 * and, if it is successful, a new snapshot will be written out.
 *
 * For more information on CDK integ tests,
 * see the main CONTRIBUTING.md file.
 *
 * Notes on how to run this integ test (if you need to update it)
 * Replace 123456789012 and 234567890123 with your own account numbers
 *
 * 1. Configure Accounts
 *   a. Destination Account (123456789012) should be bootstrapped for us-east-1
 *   b. Source Account (234567890123) should be bootstrapped for us-east-1
 *      and needs to set trust permissions for destination account (123456789012)
 *     - `cdk bootstrap --trust 123456789012 --cloudformation-execution-policies 'arn:aws:iam::aws:policy/AdministratorAccess' 'aws://234567890123/us-east-1'`
 *     - assuming this is the default profile for aws credentials
 *
 * 2. Set environment variables
 *   a. `export CDK_INTEG_ACCOUNT=123456789012` //Destination Account
 *   b. `export CDK_INTEG_CROSS_ACCOUNT=234567890123` //Source Account
 *
 * 3. Run the integ test (from the @aws-cdk/mixins-preview/test directory)
 *   a. Get temporary console access credentials for Destination Account
 *     - `yarn integ services/aws-logs/integ.delivery-mixin-cross-account.js`
 *   b. Fall back if temp credentials do not work (account info may be in snapshot)
 *     - `yarn integ services/aws-logs/integ.delivery-mixin-cross-account.js --profiles cross-account`
 *
 * 4. Ensure you account IDs are replaced by dummy account IDs in the template.json files that were added to the snapshot if you are updating this test
 * Note: Integration test should be successful, the destination name that is generated should be consistent based on the id we provided and its position in the stack
*/

import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as events from 'aws-cdk-lib/aws-events';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import { CfnEventBusLogsMixin } from '../../../lib/services/aws-events/mixins';
import '../../../lib/with';
import { FirehoseDeliveryDestination, S3DeliveryDestination } from '../../../lib/services/aws-logs';
import type { Construct } from 'constructs';

const app = new cdk.App();
const destinationAccount = process.env.CDK_INTEG_ACCOUNT || '123456789012';
const sourceAccount = process.env.CDK_INTEG_CROSS_ACCOUNT || '234567890123';
const firehoseDestName = 'cdk-fh-FHDeliveryDestination-dest-destinationstack';
const s3DestName = 'cdk-s3-S3DeliveryDestination-dest-destinationstack';

class DestinationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // KMS Key for Bucket encryption
    const key = new kms.Key(this, 'DeliveryBucketKey', {
      enabled: true,
    });

    // S3 Bucket Destination
    const bucket = new s3.Bucket(this, 'DeliveryBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      encryptionKey: key,
    });

    const firehoseBucket = new s3.Bucket(this, 'FirehoseBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    // Firehose delivery stream Destination
    const deliveryStream = new firehose.CfnDeliveryStream(this, 'DeliveryStream', {
      s3DestinationConfiguration: {
        bucketArn: firehoseBucket.bucketArn,
        bufferingHints: {
          intervalInSeconds: 10,
          sizeInMBs: 1,
        },
        roleArn: new iam.Role(this, 'FirehoseRole', {
          assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
          inlinePolicies: {
            s3: new iam.PolicyDocument({
              statements: [new iam.PolicyStatement({
                actions: ['s3:PutObject'],
                resources: [firehoseBucket.arnForObjects('*')],
              })],
            }),
          },
        }).roleArn,
      },
      deliveryStreamEncryptionConfigurationInput: {
        keyType: 'AWS_OWNED_CMK',
      },
    });

    // S3 delivery destination
    new S3DeliveryDestination(this, 'S3DeliveryDestination', {
      bucket,
      encryptionKey: key,
      sourceAccountId: sourceAccount,
    });

    // Firehose delivery destination
    new FirehoseDeliveryDestination(this, 'FHDeliveryDestination', {
      deliveryStream,
      sourceAccountId: sourceAccount,
    });
  }
}

class SourceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Source Resource
    const eventBus = new events.EventBus(this, 'EventBus', {
      eventBusName: 'vended-logs-mixin-event-bus',
      logConfig: {
        includeDetail: events.IncludeDetail.NONE,
        level: events.Level.ERROR,
      },
    });

    const s3Destination = logs.CfnDeliveryDestination.fromDeliveryDestinationArn(this, 's3Dest', `arn:aws:logs:us-east-1:${destinationAccount}:delivery-destination:${s3DestName}`);
    const firehoseDestination = logs.CfnDeliveryDestination.fromDeliveryDestinationArn(this, 'FhDest', `arn:aws:logs:us-east-1:${destinationAccount}:delivery-destination:${firehoseDestName}`);

    // Setup error logs delivery to S3
    eventBus.with(CfnEventBusLogsMixin.ERROR_LOGS.toDestination(s3Destination));
    // Setup error logs delivery to Firehose
    eventBus.with(CfnEventBusLogsMixin.ERROR_LOGS.toDestination(firehoseDestination));
  }
}

const destStack = new DestinationStack(app, 'destination-stack', {
  env: {
    account: destinationAccount,
    region: 'us-east-1',
  },
});

const sourceStack = new SourceStack(app, 'source-stack', {
  env: {
    account: sourceAccount,
    region: 'us-east-1',
  },
});

new integ.IntegTest(app, 'DeliveryTest', {
  testCases: [destStack, sourceStack],
});
