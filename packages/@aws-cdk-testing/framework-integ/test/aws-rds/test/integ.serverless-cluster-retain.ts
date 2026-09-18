import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new App();
const stack = new Stack(app, 'aws-cdk-rds-serverless-cluster-retain');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });

new rds.ServerlessCluster(stack, 'Cluster', {
  engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
  vpc,
  removalPolicy: RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
});

new IntegTest(app, 'ServerlessClusterRetainInteg', {
  testCases: [stack],
});
