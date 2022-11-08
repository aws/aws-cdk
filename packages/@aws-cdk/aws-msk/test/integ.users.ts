import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as msk from '../lib';

class UsersStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2 });

    const cluster = new msk.Cluster(this, 'Cluster', {
      clusterName: 'integ-test-users',
      kafkaVersion: msk.KafkaVersion.V2_8_1,
      vpc,
      encryptionInTransit: {
        clientBroker: msk.ClientBrokerEncryption.TLS,
      },
      clientAuthentication: msk.ClientAuthentication.sasl({
        scram: true,
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const [secret1, secret2] = cluster.addUser('test-user1', 'test-user-2');

    // Test lazy instance of the AwsCustomResource
    new cdk.CfnOutput(this, 'BootstrapBrokers', { value: cluster.bootstrapBrokersSaslScram });
    new cdk.CfnOutput(this, 'User1SecretName', { value: secret1.secretName });
    new cdk.CfnOutput(this, 'User2SecretName', { value: secret2.secretName });
  }
}

const app = new cdk.App();
const stack = new UsersStack(app, 'aws-cdk-msk-user-integ');
new IntegTest(app, 'MskUsers', {
  testCases: [stack],
});
app.synth();
