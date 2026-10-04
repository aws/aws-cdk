/// !cdk-integ STACK SameRegionStrongReferenceTestDefaultTestDeployAssertACC46230

import * as cdk from 'aws-cdk-lib/core';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cxapi from 'aws-cdk-lib/cx-api';

const app = new cdk.App({
  context: { [cxapi.DEFAULT_CROSS_STACK_REFERENCES]: 'strong' },
});

const producingStack = new cdk.Stack(app, 'SameRegionStrongRefProducerInteg', {
  env: {
    region: 'us-east-1',
  },
});

const stringValue = 'MY_PARAMETER_VALUE_SAME_REGION_STRONG';
const parameterName = 'KNOWN_PARAMETER_NAME_SAME_REGION_STRONG';
const param = new ssm.StringParameter(producingStack, 'SomeParameter', {
  parameterName: parameterName,
  stringValue,
});

const consumingStack = new cdk.Stack(app, 'SameRegionStrongRefConsumerInteg', {
  env: {
    region: 'us-east-1',
  },
});

new ssm.StringParameter(consumingStack, 'SomeParameterMirrored', {
  parameterName: parameterName + '_MIRRORED',
  stringValue: param.stringValue,
});

consumingStack.addDependency(producingStack);

new IntegTest(app, 'SameRegionStrongReferenceTest', {
  testCases: [consumingStack],
  regions: ['us-east-1'],
  diffAssets: true,
});
