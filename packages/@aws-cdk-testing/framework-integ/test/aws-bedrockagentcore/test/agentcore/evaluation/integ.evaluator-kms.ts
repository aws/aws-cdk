/*
 * Integration test for Bedrock AgentCore Evaluator encrypted with a customer-managed KMS key
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-evaluator-kms

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-evaluator-kms');

// Customer-managed key used to encrypt the evaluator at rest
const key = new kms.Key(stack, 'EvaluatorKey', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new agentcore.Evaluator(stack, 'EncryptedEvaluator', {
  evaluatorName: 'integ_test_encrypted_eval',
  level: agentcore.EvaluationLevel.SESSION,
  description: 'Evaluator encrypted with a customer-managed KMS key',
  evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
    instructions: 'Evaluate whether the agent response is helpful, accurate, and well-structured. Context: {context}. Available tools: {available_tools}.',
    modelId: 'us.anthropic.claude-sonnet-4-6',
    ratingScale: agentcore.EvaluatorRatingScale.categorical([
      { label: 'Good', definition: 'The response fully addresses the user query with accurate information.' },
      { label: 'Bad', definition: 'The response fails to address the query or contains inaccurate information.' },
    ]),
  }),
  kmsKey: key,
});

new integ.IntegTest(app, 'BedrockAgentCoreEvaluatorKms', {
  testCases: [stack],
});
