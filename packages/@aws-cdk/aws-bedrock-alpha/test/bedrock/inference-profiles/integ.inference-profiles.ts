import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as bedrock from '../../../bedrock';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-inference-profiles-integ', {
  env: {
    region: 'us-east-1',
  },
});

// Create a cross-region inference profile
const crossRegionProfile = bedrock.CrossRegionInferenceProfile.fromConfig({
  geoRegion: bedrock.CrossRegionInferenceProfileRegion.US,
  model: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
});

// Create an application inference profile with a foundation model
const appProfileWithModel = new bedrock.ApplicationInferenceProfile(stack, 'AppProfileWithModel', {
  applicationInferenceProfileName: 'test-app-profile-model',
  description: 'Application inference profile with foundation model for cost tracking',
  modelSource: bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_3_5_SONNET_V1_0,
  tags: {
    Environment: 'Integration',
    Purpose: 'Testing',
  },
});

// Create an application inference profile with a cross-region profile
const appProfileWithCrossRegion = new bedrock.ApplicationInferenceProfile(stack, 'AppProfileWithCrossRegion', {
  applicationInferenceProfileName: 'test-app-profile-cross-region',
  description: 'Application inference profile with cross-region profile for multi-region cost tracking',
  modelSource: crossRegionProfile,
});

// Create a prompt router
const promptRouter = bedrock.PromptRouter.fromDefaultId(
  bedrock.DefaultPromptRouterIdentifier.ANTHROPIC_CLAUDE_V1,
  'us-east-1',
);

// Create an agent using an application inference profile
const agentWithAppProfile = new bedrock.Agent(stack, 'AgentWithAppProfile', {
  agentName: 'test-agent-with-app-profile',
  instruction: 'You are a helpful assistant that uses an application inference profile for cost tracking and monitoring.',
  foundationModel: appProfileWithModel,
  description: 'Agent using application inference profile',
});

// Create an agent using a cross-region inference profile
const agentWithCrossRegion = new bedrock.Agent(stack, 'AgentWithCrossRegion', {
  agentName: 'test-agent-with-cross-region',
  instruction: 'You are a helpful assistant that uses cross-region inference for better availability and resilience.',
  foundationModel: crossRegionProfile,
  description: 'Agent using cross-region inference profile',
});

// Create a prompt using a prompt router
const promptWithRouter = new bedrock.Prompt(stack, 'PromptWithRouter', {
  promptName: 'test-prompt-with-router',
  description: 'Prompt using intelligent routing between models',
  variants: [
    bedrock.PromptVariant.text({
      variantName: 'default-variant',
      promptText: 'You are an AI assistant. Please help the user with their question: {{question}}',
      model: promptRouter,
    }),
  ],
});

// Output the ARNs for verification
new cdk.CfnOutput(stack, 'AppProfileWithModelArn', {
  value: appProfileWithModel.inferenceProfileArn,
  description: 'ARN of the application inference profile with foundation model',
});

new cdk.CfnOutput(stack, 'AppProfileWithCrossRegionArn', {
  value: appProfileWithCrossRegion.inferenceProfileArn,
  description: 'ARN of the application inference profile with cross-region profile',
});

new cdk.CfnOutput(stack, 'CrossRegionProfileId', {
  value: crossRegionProfile.inferenceProfileId,
  description: 'ID of the cross-region inference profile',
});

new cdk.CfnOutput(stack, 'PromptRouterArn', {
  value: promptRouter.promptRouterArn,
  description: 'ARN of the prompt router',
});

new cdk.CfnOutput(stack, 'AgentWithAppProfileArn', {
  value: agentWithAppProfile.agentArn,
  description: 'ARN of the agent using application inference profile',
});

new cdk.CfnOutput(stack, 'AgentWithCrossRegionArn', {
  value: agentWithCrossRegion.agentArn,
  description: 'ARN of the agent using cross-region inference profile',
});

new cdk.CfnOutput(stack, 'PromptWithRouterArn', {
  value: promptWithRouter.promptArn,
  description: 'ARN of the prompt using prompt router',
});

new IntegTest(app, 'BedrockInferenceProfilesTest', {
  testCases: [stack],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: false,
      },
    },
  },
});
