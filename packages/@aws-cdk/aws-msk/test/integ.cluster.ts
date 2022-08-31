import * as ec2 from '@aws-cdk/aws-ec2';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { IntegTest, AssertionsProvider, ExpectedResult } from '@aws-cdk/integ-tests';
import * as msk from '../lib';

const app = new cdk.App();

class FeatureFlagStack extends cdk.Stack {
  public readonly bucketArn: string;
  public readonly bucket: s3.IBucket;
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2 });

    this.bucket = new s3.Bucket(this, 'LoggingBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const cluster = new msk.Cluster(this, 'Cluster', {
      clusterName: 'integ-test',
      kafkaVersion: msk.KafkaVersion.V2_8_1,
      vpc,
      logging: {
        s3: {
          bucket: this.bucket,
        },
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.bucketArn = this.exportValue(this.bucket.bucketArn);
    // Test lazy instance of the AwsCustomResource
    new cdk.CfnOutput(this, 'BootstrapBrokers', { value: cluster.bootstrapBrokersTls });
    new cdk.CfnOutput(this, 'BootstrapBrokers2', { value: cluster.bootstrapBrokersTls });

    // iam authenticated msk cluster integ test
    const cluster2 = new msk.Cluster(this, 'ClusterIAM', {
      clusterName: 'integ-test-iam-auth',
      kafkaVersion: msk.KafkaVersion.V2_8_1,
      vpc,
      logging: {
        s3: {
          bucket: this.bucket,
        },
      },
      encryptionInTransit: {
        clientBroker: msk.ClientBrokerEncryption.TLS,
      },
      clientAuthentication: msk.ClientAuthentication.sasl({
        iam: true,
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Test lazy instance of the AwsCustomResource
    new cdk.CfnOutput(this, 'BootstrapBrokers3', { value: cluster2.bootstrapBrokersSaslIam });
  }
}

const stack = new FeatureFlagStack(app, 'aws-cdk-msk-integ');

const integ = new IntegTest(app, 'MskLogging', {
  testCases: [stack],
});

const objects = integ.assertions.awsApiCall('S3', 'listObjectsV2', {
  Bucket: stack.bucket.bucketName,
  MaxKeys: 1,
  Prefix: `AWSLogs/${stack.account}/KafkaBrokerLogs`,
});
const assertionProvider = objects.node.tryFindChild('SdkProvider') as AssertionsProvider;
assertionProvider.addPolicyStatementFromSdkCall('s3', 'ListBucket', [stack.bucketArn]);
assertionProvider.addPolicyStatementFromSdkCall('s3', 'GetObject', [`${stack.bucketArn}/*`]);

objects.expect(ExpectedResult.objectLike({
  KeyCount: 1,
}));

app.synth();
