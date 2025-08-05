import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new App();
const instanceIdentifier = 'test-instance-lookup';

const stackLookup = new Stack(app, 'aws-cdk-rds-instance-lookup', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
});

const lookedUpInstance = rds.DatabaseInstance.fromLookup(stackLookup, 'LookedUpInstance', {
  instanceIdentifier,
});

new CfnOutput(stackLookup, 'LookedUpInstanceEndpoint', {
  value: lookedUpInstance.instanceEndpoint.socketAddress,
});

new CfnOutput(stackLookup, 'LookedUpInstanceIdentifier', {
  value: lookedUpInstance.instanceIdentifier,
});

new CfnOutput(stackLookup, 'LookedUpInstanceResourceIdentifier', {
  value: lookedUpInstance.instanceResourceId ?? 'undefined',
});

new CfnOutput(stackLookup, 'LookedUpInstanceArn', {
  value: lookedUpInstance.instanceArn,
});

new CfnOutput(stackLookup, 'SecurityGroupIds', {
  value: lookedUpInstance.connections.securityGroups.map(sg => sg.securityGroupId).join(','),
});

// test grant
const dbAccessRole = new iam.Role(stackLookup, 'DbAccessRole', {
  assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
  description: 'Role for accessing the RDS instance via IAM authentication',
});

lookedUpInstance.grantConnect(dbAccessRole, 'admin');

// test metric
lookedUpInstance.metricCPUUtilization().createAlarm(stackLookup, 'HighCPUAlarm', {
  threshold: 90,
  evaluationPeriods: 3,
  alarmDescription: 'Database CPU utilization is high',
  comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
});

lookedUpInstance.metricFreeableMemory().createAlarm(stackLookup, 'LowMemoryAlarm', {
  threshold: 100 * 1024 * 1024,
  evaluationPeriods: 3,
  alarmDescription: 'Database is running low on memory',
  comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
});

new IntegTest(app, 'integ-rds-instance-from-lookup', {
  testCases: [stackLookup],
  enableLookups: true,
  stackUpdateWorkflow: false,
  hooks: {
    preDeploy: [
      `aws rds create-db-instance --db-instance-identifier ${instanceIdentifier} --engine mysql --engine-version 8.0.42 --master-username admin --master-user-password Admin1234 --allocated-storage 20 --db-instance-class db.t3.micro --enable-iam-database-authentication`,
      `aws rds wait db-instance-available --db-instance-identifier ${instanceIdentifier}`,
    ],
    postDeploy: [
      `aws rds delete-db-instance --db-instance-identifier ${instanceIdentifier} --skip-final-snapshot`,
    ],
  },
});
