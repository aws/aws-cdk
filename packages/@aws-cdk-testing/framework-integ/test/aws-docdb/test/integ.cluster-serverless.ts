import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as constructs from 'constructs';
import { DatabaseCluster } from 'aws-cdk-lib/aws-docdb';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends cdk.Stack {
  constructor(scope: constructs.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    new DatabaseCluster(this, 'Database', {
      masterUser: {
        username: 'docdb',
      },
      vpc,
      serverlessV2ScalingConfiguration: {
        minCapacity: 0.5,
        maxCapacity: 2,
      },
      engineVersion: '5.0.0',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}

const app = new cdk.App();

const stack = new TestStack(app, 'aws-cdk-docdb-cluster-serverless');

new IntegTest(app, 'aws-cdk-docdb-cluster-serverless-integ', {
  testCases: [stack],
});
