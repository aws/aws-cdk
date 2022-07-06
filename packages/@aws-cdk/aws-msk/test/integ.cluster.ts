/// !cdk-integ pragma:ignore-assets
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as msk from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-msk-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });

const cluster = new msk.Cluster(stack, 'Cluster', {
  clusterName: 'integ-test',
  kafkaVersion: msk.KafkaVersion.V2_8_1,
  vpc,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// Test lazy instance of the AwsCustomResource
new cdk.CfnOutput(stack, 'BootstrapBrokers', { value: cluster.bootstrapBrokersTls });
new cdk.CfnOutput(stack, 'BootstrapBrokers2', { value: cluster.bootstrapBrokersTls });

// iam authenticated msk cluster integ test
const cluster2 = new msk.Cluster(stack, 'Cluster2', {
  clusterName: 'iam-auth-integ-test',
  kafkaVersion: msk.KafkaVersion.V2_6_1,
  vpc,
  encryptionInTransit: {
    clientBroker: msk.ClientBrokerEncryption.TLS,
  },
  clientAuthentication: msk.ClientAuthentication.sasl({
    iam: true,
  }),
});

// Test lazy instance of the AwsCustomResource
new cdk.CfnOutput(stack, 'BootstrapBrokers3', { value: cluster2.bootstrapBrokersSaslIam });

app.synth();
