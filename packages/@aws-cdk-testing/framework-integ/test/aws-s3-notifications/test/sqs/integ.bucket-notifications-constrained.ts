import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import { Key } from 'aws-cdk-lib/aws-kms';
import { AccountRootPrincipal, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

const app = new cdk.App();
const stack4 = new cdk.Stack(app, 'sqs-bucket-notifications-4');

const key4 = new Key(stack4, 'Key4');
key4.addToResourcePolicy(
  new PolicyStatement({
    actions: [
      'kms:ReEncrypt*',
      'kms:Encrypt',
    ],
    resources: ['*'],
    principals: [new ServicePrincipal('s3.amazonaws.com'), new AccountRootPrincipal()],
  }),
);
const queue4 = new sqs.Queue(stack4, 'Queue4', {
  encryption: sqs.QueueEncryption.KMS,
  encryptionMasterKey: key4,
});
const bucket4 = new s3.Bucket(stack4, 'Bucket4', {
  encryptionKey: key4,
});
bucket4.addObjectCreatedNotification(new s3n.SqsDestination(queue4, false));
bucket4.addObjectRemovedNotification(new s3n.SqsDestination(queue4, false));
const queuePolicy = new PolicyStatement({
  actions: [
    'sqs:GetQueueAttributes',
    'sqs:GetQueueUrl',
    'sqs:SendMessage',
  ],
  resources: [queue4.queueArn],
  principals: [new ServicePrincipal('s3.amazonaws.com')],
});
queue4.addToResourcePolicy(queuePolicy);

new integ.IntegTest(app, 'SQSBucketNotificationsTest4', {
  testCases: [stack4],
  diffAssets: true,
});

/**
 * TODO: As of authoring this, we can do assertion testing in encrypted resources, because
 * we need a way to add permissions to `SingletonFunction`. Eg: [kms:Decrypt, kms:Encrypt]
 * Once, this is achievable, then just uncommenting the below code will do the work for us.
 *
 * This is already tested by deploying, Just permission was missing, once permission is added
 * though console, Tests were succeeded.
 *
 * integTest4.assertions
 * // First remove the test notifications
 * .awsApiCall('SQS', 'purgeQueue', {
 *   QueueUrl: queue4.queueUrl,
 * })
 * .next(integTest4.assertions
 *   .awsApiCall('S3', 'putObject', {
 *     Bucket: bucket4.bucketName,
 *     Key: 'image.png',
 *     Body: 'Some content',
 *   }))
 * .next(integTest4.assertions
 *   .awsApiCall('SQS', 'receiveMessage', {
 *     QueueUrl: queue4.queueUrl,
 *     WaitTimeSeconds: 20,
 *   })
 *   .assertAtPath('Messages.0.Body.Records.0.s3.object.key', integ.ExpectedResult.stringLikeRegexp('image\\.png')));
 */

app.synth();