import * as events from 'aws-cdk-lib/aws-events';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as redshift from '@aws-cdk/aws-redshift-alpha'
import * as redshiftserverless from 'aws-cdk-lib/aws-redshiftserverless';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'log-group-events');

const vpc = new ec2.Vpc(stack, 'VPC');

const cluster = new redshift.Cluster(stack, 'Cluster', {
  vpc,
  masterUser: {
    masterUsername: 'admin',
  },
  defaultDatabaseName: 'dev',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const workGroup = new redshiftserverless.CfnWorkgroup(stack, 'WorkGroup', {
  workgroupName: 'workgroup',
});

const importedCluster = redshift.Cluster.fromClusterAttributes(stack, 'ImportedCluster', {
  clusterName: 'imported-cluster',
  clusterEndpointAddress: 'imported-cluster-endpoint',
  clusterEndpointPort: 5439,
  securityGroups: [],
});

const timer = new events.Rule(stack, 'Timer', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});
timer.addTarget(new targets.RedshiftQuery(`arn:aws:redshift:${cluster.env.region}:${cluster.env.account}:cluster:${cluster.clusterName}`, {}));

const customRule = new events.Rule(stack, 'CustomRule', {
  eventPattern: {
    source: ['cdk-integ'],
    detailType: ['cdk-integ-custom-rule'],
  },
});
customRule.addTarget(new targets.RedshiftQuery(`arn:aws:redshift:${importedCluster.env.region}:${importedCluster.env.account}:cluster:${importedCluster.clusterName}`, {
  database: 'dev',
}));

const queue = new sqs.Queue(stack, 'dlq');

const timer3 = new events.Rule(stack, 'Timer3', {
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});
timer3.addTarget(new targets.RedshiftQuery(workGroup.attrWorkgroupWorkgroupArn, {
  database: 'dev',
  deadLetterQueue: queue,
  sql: [
    'SELECT * FROM foo',
    'SELECT * FROM bar',
  ],
}));

new IntegTest(app, 'LogGroup', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
