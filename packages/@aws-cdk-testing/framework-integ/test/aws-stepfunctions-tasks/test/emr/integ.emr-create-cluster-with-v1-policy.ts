import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { EmrCreateCluster } from 'aws-cdk-lib/aws-stepfunctions-tasks';

const app = new App();

const stack = new Stack(app, 'aws-cdk-emr-create-cluster');

new EmrCreateCluster(stack, 'EmrCreateCluster', {
  instances: {},
  name: 'Cluster',
  integrationPattern: sfn.IntegrationPattern.RUN_JOB,
});

new IntegTest(app, 'EmrCreateClusterTest', {
  testCases: [stack],
});

app.synth();
