import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as bedrock from 'aws-cdk-lib/aws-bedrock';

const app = new App();
const stack = new Stack(app, 'BedrockNovaModelStack');

bedrock.FoundationModel.fromFoundationModelId(
  stack,
  'NovaModel',
  bedrock.FoundationModelIdentifier.AMAZON_NOVA_2_LITE_V1_0,
);

new IntegTest(app, 'BedrockNovaModelInteg', {
  testCases: [stack],
});
