import * as sfn from '@aws-cdk/aws-stepfunctions';
import { App, Stack } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { EmrCreateCluster } from '../../lib';

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
