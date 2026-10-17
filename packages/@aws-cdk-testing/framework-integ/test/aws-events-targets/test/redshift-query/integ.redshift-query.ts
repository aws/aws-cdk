import * as events from 'aws-cdk-lib/aws-events';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as redshiftserverless from 'aws-cdk-lib/aws-redshiftserverless';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'redshift-query-events');

const namespace = new redshiftserverless.CfnNamespace(stack, 'Namespace', {
  namespaceName: `namespace-${stack.stackName}`,
});

const workGroup = new redshiftserverless.CfnWorkgroup(stack, 'WorkGroup', {
  workgroupName: `workgroup-${stack.stackName}`,
  namespaceName: namespace.namespaceName,
});
workGroup.addDependency(namespace);

const queue = new sqs.Queue(stack, 'dlq');

const secret = new secretsmanager.Secret(stack, 'Secret');

const timer3 = new events.Rule(stack, 'Timer3', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});
timer3.addTarget(new targets.RedshiftQuery(workGroup.attrWorkgroupWorkgroupArn, {
  database: 'dev',
  deadLetterQueue: queue,
  sql: ['SELECT * FROM baz'],
  secret,
}));

timer3.addTarget(new targets.RedshiftQuery(workGroup.attrWorkgroupWorkgroupArn, {
  database: 'dev',
  deadLetterQueue: queue,
  sql: ['SELECT * FROM foo', 'SELECT * FROM bar'],
  secret,
}));

new IntegTest(app, 'LogGroup', {
  testCases: [stack],
});

app.synth();
