/// !cdk-integ STACK SameRegionBothReferenceTestDefaultTestDeployAssertEF80EB0E

import * as cdk from 'aws-cdk-lib/core';
import * as cxapi from 'aws-cdk-lib/cx-api';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  context: { [cxapi.DEFAULT_CROSS_STACK_REFERENCES]: 'both' },
});

const producingStack = new cdk.Stack(app, 'SameRegionBothRefProducerInteg', {
  env: {
    region: 'us-east-1',
  },
});

const stringValue = 'MY_PARAMETER_VALUE_SAME_REGION_BOTH';
const parameterName = 'KNOWN_PARAMETER_NAME_SAME_REGION_BOTH';
const param = new ssm.StringParameter(producingStack, 'SomeParameter', {
  parameterName: parameterName,
  stringValue,
});

const consumingStack = new cdk.Stack(app, 'SameRegionBothRefConsumerInteg', {
  env: {
    region: 'us-east-1',
  },
});

new ssm.StringParameter(consumingStack, 'SomeParameterMirrored', {
  parameterName: parameterName + '_MIRRORED',
  stringValue: param.stringValue,
});

consumingStack.addDependency(producingStack);

new IntegTest(app, 'SameRegionBothReferenceTest', {
  testCases: [consumingStack],
  regions: ['us-east-1'],
  diffAssets: true,
});
