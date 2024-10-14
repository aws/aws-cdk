import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as msk from '../lib';

const app = new cdk.App();

class MskClusterSaslScramIamStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    // SASL/SCRAM and IAM authenticated msk cluster integ test
    new msk.Cluster(this, 'ClusterSaslScramIam', {
      clusterName: 'integ-test-sasl-scram-iam-auth',
      kafkaVersion: msk.KafkaVersion.V3_6_0,
      vpc,
      encryptionInTransit: {
        clientBroker: msk.ClientBrokerEncryption.TLS,
      },
      clientAuthentication: msk.ClientAuthentication.sasl({
        iam: true,
        scram: true,
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}

const stack = new MskClusterSaslScramIamStack(app, 'aws-cdk-msk-sasl-scram-iam-integ');

new IntegTest(app, 'MskClusterSaslScramIam', {
  testCases: [stack],
});

app.synth();
