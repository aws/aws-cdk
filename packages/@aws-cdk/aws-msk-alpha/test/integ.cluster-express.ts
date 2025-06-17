import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as msk from '../lib';

const app = new cdk.App();

class ExpressMskStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 2,
      restrictDefaultSecurityGroup: false,
    });

    // Create an express broker MSK cluster
    const expressCluster = new msk.Cluster(this, 'ExpressCluster', {
      clusterName: 'integ-test-express',
      kafkaVersion: msk.KafkaVersion.V3_8_X,
      vpc,
      express: true,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.M7G,
        ec2.InstanceSize.XLARGE,
      ),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new cdk.CfnOutput(this, 'ExpressBootstrapBrokers', {
      value: expressCluster.bootstrapBrokersTls,
    });
  }
}

const stack = new ExpressMskStack(app, 'aws-cdk-msk-express-integ');

new IntegTest(app, 'MskExpressCluster', {
  testCases: [stack],
});
