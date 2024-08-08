import * as events from 'aws-cdk-lib/aws-events';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as redshiftserverless from 'aws-cdk-lib/aws-redshiftserverless';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'redshift-query-events');

const namespace = new redshiftserverless.CfnNamespace(stack, 'Namespace', {
  namespaceName: 'namespace',
});

const workGroup = new redshiftserverless.CfnWorkgroup(stack, 'WorkGroup', {
  workgroupName: 'workgroup',
  namespaceName: namespace.namespaceName,
  subnetIds: ['subnet-06c91b5d4c16df0ff', 'subnet-04b90752f12ed5174', 'subnet-0d42bcb68396ffd19'],
  securityGroupIds: ['sg-0f3ee03c20cc6056c'],
});
workGroup.addDependency(namespace);

const queue = new sqs.Queue(stack, 'dlq');

const timer3 = new events.Rule(stack, 'Timer3', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});
timer3.addTarget(new targets.RedshiftQuery(workGroup.attrWorkgroupWorkgroupArn, {
  database: 'dev',
  deadLetterQueue: queue,
  sql: 'SELECT * FROM baz',
}));

new IntegTest(app, 'LogGroup', {
  testCases: [stack],
});

app.synth();
