import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as msk from '../lib';

const app = new cdk.App();

class MskClusterVpcConnectivityTestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    // Multi-VPC private connectivity (cross-account access) with SASL/IAM.
    //
    // NOTE: Amazon MSK does not allow enabling VPC connectivity auth schemes during the
    // initial cluster creation. To deploy this for real, first deploy the cluster without
    // `vpcConnectivity`, then add it and deploy again. This integ test is snapshot-only.
    const cluster = new msk.Cluster(this, 'Cluster', {
      clusterName: 'integ-test-vpc-connectivity',
      kafkaVersion: msk.KafkaVersion.V3_5_1,
      vpc,
      encryptionInTransit: {
        clientBroker: msk.ClientBrokerEncryption.TLS,
      },
      clientAuthentication: msk.ClientAuthentication.sasl({ iam: true }),
      vpcConnectivity: msk.VpcConnectivity.sasl({ iam: true }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Resource-based cluster policy granting cross-account access to create VPC connections.
    cluster.addClusterPolicy(new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          actions: [
            'kafka:CreateVpcConnection',
            'kafka:GetBootstrapBrokers',
            'kafka:DescribeCluster',
            'kafka:DescribeClusterV2',
          ],
          principals: [new iam.AccountRootPrincipal()],
          resources: [cluster.clusterArn],
        }),
      ],
    }));
  }
}

const stack = new MskClusterVpcConnectivityTestStack(app, 'aws-cdk-msk-vpc-connectivity-integ');

new IntegTest(app, 'MskClusterVpcConnectivity', {
  testCases: [stack],
});

app.synth();
