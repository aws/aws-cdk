import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new App();
const stack = new Stack(app, 'AuroraMysqlVersionOfStack');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });

// Use .of() without explicit major version - should infer '8.0'
new rds.DatabaseCluster(stack, 'Cluster', {
  engine: rds.DatabaseClusterEngine.auroraMysql({
    version: rds.AuroraMysqlEngineVersion.of('8.0.mysql_aurora.3.08.0'),
  }),
  vpc,
  writer: rds.ClusterInstance.provisioned('writer', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
  }),
  removalPolicy: RemovalPolicy.DESTROY,
});

new IntegTest(app, 'AuroraMysqlVersionOfInteg', {
  testCases: [stack],
});
