/// !cdk-integ STACK CrossRegionBothReferenceTestDefaultTestDeployAssertDF898EC2

import * as cdk from 'aws-cdk-lib/core';
import * as cxapi from 'aws-cdk-lib/cx-api';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  context: { [cxapi.DEFAULT_CROSS_STACK_REFERENCES]: 'both' },
});

const producingStack = new cdk.Stack(app, 'CrossRegionBothRefProducerInteg', {
  crossRegionReferences: true,
  env: {
    region: 'us-east-1',
  },
});

const stringValue = 'MY_PARAMETER_VALUE_BOTH';
const parameterName = 'KNOWN_PARAMETER_NAME_BOTH';
const param = new ssm.StringParameter(producingStack, 'SomeParameter', {
  parameterName: parameterName,
  stringValue,
});

const consumingStack = new cdk.Stack(app, 'CrossRegionBothRefConsumerInteg', {
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

new IntegTest(app, 'CrossRegionBothReferenceTest', {
  testCases: [consumingStack],
  regions: ['us-east-2'],
  diffAssets: true,
});
