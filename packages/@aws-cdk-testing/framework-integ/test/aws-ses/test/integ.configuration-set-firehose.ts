import { App, Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new App();
const stack = new Stack(app, 'ses-configuration-set-firehose');

const configurationSet = new ses.ConfigurationSet(stack, 'ConfigurationSet', {
  maxDeliveryDuration: Duration.minutes(10),
});

const bucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: RemovalPolicy.DESTROY,
});

const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
});

const mockS3Destination: firehose.IDestination = {
  bind(_scope: Construct, _options: firehose.DestinationBindOptions): firehose.DestinationConfig {
    const bucketGrant = bucket.grantReadWrite(role);
    return {
      extendedS3DestinationConfiguration: {
        bucketArn: bucket.bucketArn,
        roleArn: role.roleArn,
      },
      dependables: [bucketGrant],
    };
  },
};

const firehoseDeliveryStream = new firehose.DeliveryStream(stack, 'Firehose', {
  destination: mockS3Destination,
});

configurationSet.addEventDestination('FirehoseDestination', {
  destination: ses.EventDestination.firehoseDeliveryStream({
    deliveryStream: firehoseDeliveryStream,
  }),
});

const integTest = new IntegTest(app, 'ses-configuration-set-firehose-test', {
  testCases: [stack],
});

integTest.assertions.awsApiCall('sesv2', 'getConfigurationSetEventDestinations', {
  ConfigurationSetName: configurationSet.configurationSetName,
}).expect(ExpectedResult.objectLike({
  EventDestinations: Match.arrayWith([
    Match.objectLike({
      Enabled: true,
      KinesisFirehoseDestination: {
        DeliveryStreamArn: firehoseDeliveryStream.deliveryStreamArn,
      },
    }),
  ]),
}));
