/// !cdk-integ STACK CrossRegionWeakReferenceTestDefaultTestDeployAssert239C05E0

import * as cdk from 'aws-cdk-lib/core';
import * as cxapi from 'aws-cdk-lib/cx-api';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  context: { [cxapi.DEFAULT_CROSS_STACK_REFERENCES]: 'weak' },
});

const producingStack = new cdk.Stack(app, 'CrossRegionWeakRefProducerInteg', {
  crossRegionReferences: true,
  env: {
    region: 'us-east-1',
  },
});

const stringValue = 'MY_PARAMETER_VALUE_WEAK';
const parameterName = 'KNOWN_PARAMETER_NAME_WEAK';
const param = new ssm.StringParameter(producingStack, 'SomeParameter', {
  parameterName: parameterName,
  stringValue,
});

const consumingStack = new cdk.Stack(app, 'CrossRegionWeakRefConsumerInteg', {
  crossRegionReferences: true,
  env: {
    region: 'us-east-2',
  },
});

new ssm.StringParameter(consumingStack, 'SomeParameterMirrored', {
  parameterName: parameterName,
  stringValue: param.stringValue,
});

consumingStack.addDependency(producingStack);

new IntegTest(app, 'CrossRegionWeakReferenceTest', {
  testCases: [consumingStack],
  regions: ['us-east-2'],
  diffAssets: true,
});
