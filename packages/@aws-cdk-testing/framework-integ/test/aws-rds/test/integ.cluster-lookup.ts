import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new App();
const clusterIdentifier = 'test-cluster-lookup';

const stackLookup = new Stack(app, 'aws-cdk-rds-cluster-lookup', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});

// Lookup the existing cluster created by the preDeploy hook
const lookedUpCluster = rds.DatabaseCluster.fromLookup(stackLookup, 'LookedUpCluster', {
  clusterIdentifier,
});

new CfnOutput(stackLookup, 'LookedUpClusterEndpoint', {
  value: lookedUpCluster.clusterEndpoint.socketAddress,
});

new CfnOutput(stackLookup, 'LookedUpClusterReadEndpoint', {
  value: lookedUpCluster.clusterReadEndpoint.socketAddress,
});

new CfnOutput(stackLookup, 'LookedUpClusterIdentifier', {
  value: lookedUpCluster.clusterIdentifier,
});

new CfnOutput(stackLookup, 'LookedUpClusterResourceIdentifier', {
  value: lookedUpCluster.clusterResourceIdentifier,
});

new CfnOutput(stackLookup, 'LookedUpClusterArn', {
  value: lookedUpCluster.clusterArn,
});

new CfnOutput(stackLookup, 'SecurityGroupIds', {
  value: lookedUpCluster.connections.securityGroups.map(sg => sg.securityGroupId).join(','),
});

// test grant
const dbAccessRole = new iam.Role(stackLookup, 'DbAccessRole', {
  assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
  description: 'Role for accessing the Aurora cluster via IAM authentication',
});

lookedUpCluster.grantConnect(dbAccessRole, 'admin');
lookedUpCluster.grantDataApiAccess(dbAccessRole);

// test metric
lookedUpCluster.metricDatabaseConnections().createAlarm(stackLookup, 'HighConnectionsAlarm', {
  threshold: 100,
  evaluationPeriods: 3,
  alarmDescription: 'Database has high number of connections',
  comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
});

lookedUpCluster.metricCPUUtilization().createAlarm(stackLookup, 'HighCPUAlarm', {
  threshold: 90,
  evaluationPeriods: 3,
  alarmDescription: 'Database CPU utilization is high',
  comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
});

lookedUpCluster.metricFreeableMemory().createAlarm(stackLookup, 'LowMemoryAlarm', {
  threshold: 100 * 1024 * 1024,
  evaluationPeriods: 3,
  alarmDescription: 'Database is running low on memory',
  comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
});

lookedUpCluster.metricDeadlocks().createAlarm(stackLookup, 'DeadlockAlarm', {
  threshold: 5,
  evaluationPeriods: 2,
  alarmDescription: 'Database has deadlocks',
  comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
});

new IntegTest(app, 'integ-rds-cluster-from-lookup', {
  testCases: [stackLookup],
  enableLookups: true,
  stackUpdateWorkflow: false,
  // Create Aurora cluster before the test and delete it after
  hooks: {
    preDeploy: [
      `aws rds create-db-cluster --db-cluster-identifier ${clusterIdentifier} --engine aurora-mysql --engine-version 8.0.mysql_aurora.3.09.0 --master-username admin --master-user-password Admin1234 --enable-http-endpoint --enable-iam-database-authentication --region us-east-1`,
      `aws rds create-db-instance --db-instance-identifier ${clusterIdentifier}-instance --db-cluster-identifier ${clusterIdentifier} --engine aurora-mysql --db-instance-class db.r5.large --region us-east-1`,
      `aws rds wait db-instance-available --db-instance-identifier ${clusterIdentifier}-instance --region us-east-1`,
    ],
    postDeploy: [
      `aws rds delete-db-instance --db-instance-identifier ${clusterIdentifier}-instance --skip-final-snapshot --region us-east-1`,
      `aws rds delete-db-cluster --db-cluster-identifier ${clusterIdentifier} --skip-final-snapshot --region us-east-1`,
    ],
  },
});
