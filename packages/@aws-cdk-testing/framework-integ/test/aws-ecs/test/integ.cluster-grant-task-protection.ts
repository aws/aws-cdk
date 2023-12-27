import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });
const taskRole = new iam.Role(stack, 'TaskRole', {
  assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
});
cluster.grantTaskProtection(taskRole);

new integ.IntegTest(app, 'aws-ecs-cluster-grant-task-protection', {
  testCases: [stack],
});

app.synth();
