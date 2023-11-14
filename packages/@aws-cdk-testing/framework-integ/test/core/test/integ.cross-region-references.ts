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
const param = new ssm.StringParameter(producingStack, 'SomeParameter', {
  parameterName: parameterName,
  stringValue,
});

const consumingStack = new cdk.Stack(app, 'CrossRegionRefConsumerInteg', {
  crossRegionReferences: true,
  env: {
    region: 'us-east-2',
  },
});

new ssm.StringParameter(consumingStack, 'SomeParameterMirrored', {
  parameterName: parameterName,
  stringValue: param.stringValue,
});

// Add an explicit dependency because otherwise IntegTest doesn't deploy the producing stack
// and adding it to the list of `testCases` doesn't ensure order apparently.
consumingStack.addDependency(producingStack);

new IntegTest(app, 'CrossRegionSSMReferenceTest', {
  testCases: [consumingStack],
  // Explicitly deploy to us-east-2 to guarantee a cross stack reference, if you exclude this
  // it doesn't respect the `env` parameter passed to the stack.
  regions: ['us-east-2'],
  diffAssets: true,
});

// The assertions stack doesn't support deploying to a specific region which causes it to fail,
// verified manually for now.
// const getParam = integ.assertions.awsApiCall('SSM', 'getParameter', {
//   Name: referencingParam.parameterName,
// });
//
// getParam.expect(ExpectedResult.objectLike({
//   Type: 'String',
//   Value: stringValue,
// }));
