import { App, Stack } from 'aws-cdk-lib';
import { AnyPrincipal, Role } from 'aws-cdk-lib/aws-iam';
import { CrossRegionInferenceProfile } from 'aws-cdk-lib/aws-bedrock';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'aws-bedrock-cross-region-inference-profile-integ');
const role = new Role(stack, 'Role', { assumedBy: new AnyPrincipal() });
const profile = CrossRegionInferenceProfile.US_ANTHROPIC_CLAUDE_3_5_SONNET_20240620_V1_0;

profile.grantInvoke('us-east-1', role);

new IntegTest(app, 'InvokeModel', {
  testCases: [stack],
});

app.synth();
