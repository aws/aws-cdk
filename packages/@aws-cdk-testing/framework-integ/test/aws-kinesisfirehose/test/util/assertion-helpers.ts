import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';

/**
 * Waits for specified amount of keys in the prefix. Returns the IApiCall for the list objects call.
 * Waits for only one key unless specified otherwise.
 */
export function waitForKeys(assertions: integ.IDeployAssert, bucket: s3.IBucket, prefix: String, numKeys?: number): integ.IApiCall {
  const waitForKey = assertions.awsApiCall('S3', 'listObjectsV2', {
    Bucket: bucket.bucketName,
    Prefix: prefix,
  }).expect(integ.ExpectedResult.objectLike({
    KeyCount: numKeys ?? 1,
  })).waitForAssertions({
    interval: cdk.Duration.seconds(5),
    totalTimeout: cdk.Duration.minutes(2),
  });

  const api = waitForKey as integ.AwsApiCall;
  api.waiterProvider?.addPolicyStatementFromSdkCall('s3', 'ListBucket', [bucket.bucketArn]);
  api.waiterProvider?.addPolicyStatementFromSdkCall('s3', 'GetObject', [bucket.arnForObjects('*')]);
  return waitForKey;
}

/**
 * Serializes and puts the specified data object as input to the delivery stream.
 */
export function putData(assertions: integ.IDeployAssert, deliveryStream: firehose.IDeliveryStream, dataObject: any): integ.IApiCall {
  return assertions.awsApiCall('Firehose', 'putRecord', {
    DeliveryStreamName: deliveryStream.deliveryStreamName,
    Record: {
      Data: JSON.stringify(dataObject),
    },
  });
}
