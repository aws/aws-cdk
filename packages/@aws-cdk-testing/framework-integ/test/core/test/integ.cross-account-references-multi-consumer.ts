/// !cdk-integ CrossAccountMultiConsumerTestDefaultTestDeployAssert2460BCA3

import * as cdk from 'aws-cdk-lib/core';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cxapi from 'aws-cdk-lib/cx-api';

/**
 * This test has hard-coded fake accounts, and also won't work with
 * the integ test mechanism, to automatically create and update stacks.
 * But it's still a valuable resource to assist in the manual test of
 * cross-account scenarios, automating part of the work.
 */

const app = new cdk.App({
  context: { [cxapi.DEFAULT_CROSS_STACK_REFERENCES]: 'weak' },
});

const producingStack = new cdk.Stack(app, 'CrossAccountMultiConsumerProducer', {
  env: {
    region: 'eu-central-1',
    account: '111111111111',
  },
});

const stringValue = 'MY_PARAMETER_VALUE_MULTI';
const param1 = new ssm.StringParameter(producingStack, 'ParamOne', {
  parameterName: 'KNOWN_PARAM_MULTI_1',
  stringValue,
});

const param2 = new ssm.StringParameter(producingStack, 'ParamTwo', {
  parameterName: 'KNOWN_PARAM_MULTI_2',
  stringValue,
});

const consumer1 = new cdk.Stack(app, 'CrossAccountMultiConsumerOne', {
  env: {
    region: 'us-east-1',
    account: '222222222222',
  },
});

new ssm.StringParameter(consumer1, 'MirroredParam1', {
  parameterName: 'KNOWN_PARAM_MULTI_1_MIRROR',
  stringValue: param1.stringValue,
});

const consumer2 = new cdk.Stack(app, 'CrossAccountMultiConsumerTwo', {
  env: {
    region: 'us-east-2',
    account: '222222222222',
  },
});

new ssm.StringParameter(consumer2, 'MirroredParam2', {
  parameterName: 'KNOWN_PARAM_MULTI_2_MIRROR',
  stringValue: param2.stringValue,
});

consumer1.addDependency(producingStack);
consumer2.addDependency(producingStack);

new IntegTest(app, 'CrossAccountMultiConsumerTest', {
  testCases: [consumer1, consumer2],
  regions: ['eu-central-1'],
  diffAssets: true,
});

app.synth();
