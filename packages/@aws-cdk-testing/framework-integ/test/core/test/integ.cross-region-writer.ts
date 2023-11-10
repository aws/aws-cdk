import * as cdk from 'aws-cdk-lib/core';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const producingStack = new cdk.Stack(app, 'CrossRegionRefProducerInteg', {
  crossRegionReferences: true,
  env: {
    region: 'us-east-1',
  },
});

const stringValue = 'MY_PARAMETER_VALUE';

// Physical name of resource referenced across envs must be known at synth time either
// hardcoded or using `PhysicalName.GENERATE_IF_NEEDED`. Hardcode here cause SSM is weird
// with generate if needed currently.
const parameterName = 'KNOWN_PARAMETER_NAME';
new ssm.StringParameter(producingStack, 'SomeParameter', {
  parameterName: parameterName,
  stringValue,
});

const integTest = new IntegTest(app, 'CrossRegionWriterInteg', {
  testCases: [producingStack],
  // Explicitly deploy to us-east-2 to guarantee a cross stack reference, if you exclude this
  // it doesn't respect the `env` parameter passed to the stack.
  regions: ['us-east-2'],
});

integTest.assertions.awsApiCall('SSM', 'getParameters', {
  Names: [parameterName],
});
