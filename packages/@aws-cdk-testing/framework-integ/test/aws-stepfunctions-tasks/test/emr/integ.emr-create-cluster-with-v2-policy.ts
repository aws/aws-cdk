import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { App, Stack } from 'aws-cdk-lib';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ENABLE_EMR_SERVICE_POLICY_V2 } from 'aws-cdk-lib/cx-api';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { EmrCreateCluster } from 'aws-cdk-lib/aws-stepfunctions-tasks';

const enableEmrServicePolicyV2 = { [ENABLE_EMR_SERVICE_POLICY_V2]: true };

const app = new App({
  context: enableEmrServicePolicyV2,
});

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