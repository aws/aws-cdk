import { AccountRootPrincipal, Role } from '@aws-cdk/aws-iam';
import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests';
import { ProfilingGroup } from '../lib';

const app = new App();

const stack = new Stack(app, 'ProfilingGroupTestStack');

const profilingGroup1 = new ProfilingGroup(stack, 'ProfilingGroupWithExplicitlySetName', {
  profilingGroupName: 'ExplicitlySetName',
});
const profilingGroup2 = new ProfilingGroup(stack, 'ProfilingGroupWithImplicitlySetName');

const publishAppRole = new Role(stack, 'PublishAppRole', {
  assumedBy: new AccountRootPrincipal(),
});
profilingGroup1.grantPublish(publishAppRole);
profilingGroup2.grantPublish(publishAppRole);

const importedGroupWithExplicitlySetName = ProfilingGroup.fromProfilingGroupName(
  stack,
  'ImportedProfilingGroupWithExplicitlySetName',
  profilingGroup1.profilingGroupName,
);

const importedGroupWithImplicitlySetName = ProfilingGroup.fromProfilingGroupName(
  stack,
  'ImportedProfilingGroupWithImplicitlySetName',
  profilingGroup2.profilingGroupName,
);

const importedGroupFromArn = ProfilingGroup.fromProfilingGroupArn(
  stack,
  'ImportedProfilingGroupFromArn',
  'arn:aws:codeguru-profiler:a-region-1:1234567890:profilingGroup/MyAwesomeProfilingGroup',
);

new CfnOutput(stack, 'ExplicitlySetProfilingGroupName', {
  value: importedGroupWithExplicitlySetName.profilingGroupName,
});

new CfnOutput(stack, 'ImplicitlySetProfilingGroupName', {
  value: importedGroupWithImplicitlySetName.profilingGroupName,
});

new CfnOutput(stack, 'ImportedFromArnProfilingGroupName', {
  value: importedGroupFromArn.profilingGroupName,
});

new CfnOutput(stack, 'ImportedFromArnProfilingGroupArn', {
  value: importedGroupFromArn.profilingGroupArn,
});

const testCase = new IntegTest(app, 'test', {
  testCases: [stack],
});

const describe = testCase.assertions.awsApiCall('CloudFormation', 'describeStacks', {
  StackName: 'ProfilingGroupTestStack',
});

describe.assertAtPath('Stacks.0.Outputs.0.OutputKey', ExpectedResult.stringLikeRegexp('ExplicitlySetProfilingGroupName'));
describe.assertAtPath('Stacks.0.Outputs.0.OutputValue', ExpectedResult.stringLikeRegexp('ExplicitlySetName'));

describe.assertAtPath('Stacks.0.Outputs.1.OutputKey', ExpectedResult.stringLikeRegexp('ImplicitlySetProfilingGroupName'));
describe.assertAtPath('Stacks.0.Outputs.1.OutputValue', ExpectedResult.stringLikeRegexp('ProfilingGroupTestStackProfilingGroupWithImplicitlySetName98463923'));

describe.assertAtPath('Stacks.0.Outputs.2.OutputKey', ExpectedResult.stringLikeRegexp('ImportedFromArnProfilingGroupName'));
describe.assertAtPath('Stacks.0.Outputs.2.OutputValue', ExpectedResult.stringLikeRegexp('MyAwesomeProfilingGroup'));

describe.assertAtPath('Stacks.0.Outputs.3.OutputKey', ExpectedResult.stringLikeRegexp('ImportedFromArnProfilingGroupArn'));
describe.assertAtPath('Stacks.0.Outputs.3.OutputValue', ExpectedResult.stringLikeRegexp('arn:aws:codeguru-profiler:a-region-1:1234567890:profilingGroup/MyAwesomeProfilingGroup'));