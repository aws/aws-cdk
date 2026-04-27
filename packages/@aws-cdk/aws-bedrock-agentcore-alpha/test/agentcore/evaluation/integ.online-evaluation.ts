/*
 * Integration test for Bedrock AgentCore OnlineEvaluationConfig construct
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-online-evaluation

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as agentcore from '../../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-online-evaluation');

// Create a CloudWatch log group for the agent traces
const logGroup = new logs.LogGroup(stack, 'AgentLogGroup', {
  logGroupName: '/aws/bedrock-agentcore/integ-test-agent',
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  retention: logs.RetentionDays.ONE_DAY,
});

// Create a custom LLM-as-a-Judge evaluator
const customEvaluator = new agentcore.Evaluator(stack, 'CustomEvaluator', {
  evaluatorName: 'integ_test_custom_eval',
  level: agentcore.EvaluationLevel.SESSION,
  description: 'Custom evaluator for integration testing',
  evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
    instructions: 'Evaluate whether the agent response is helpful, accurate, and well-structured. Context: {context}. Available tools: {available_tools}.',
    modelId: 'us.anthropic.claude-sonnet-4-6',
    ratingScale: agentcore.EvaluatorRatingScale.categorical([
      { label: 'Good', definition: 'The response fully addresses the user query with accurate information.' },
      { label: 'Bad', definition: 'The response fails to address the query or contains inaccurate information.' },
    ]),
  }),
});

// Create an online evaluation configuration with built-in and custom evaluators
new agentcore.OnlineEvaluationConfig(stack, 'BasicEvaluation', {
  configName: 'integ_test_basic_eval',
  evaluators: [
    agentcore.EvaluatorReference.builtin(agentcore.BuiltinEvaluator.HELPFULNESS),
    agentcore.EvaluatorReference.builtin(agentcore.BuiltinEvaluator.CORRECTNESS),
    agentcore.EvaluatorReference.custom(customEvaluator),
  ],
  dataSource: agentcore.DataSourceConfig.fromCloudWatchLogs({
    logGroupNames: [logGroup.logGroupName],
    serviceNames: ['integ-test-agent.default'],
  }),
  description: 'Integration test evaluation with built-in and custom evaluators',
  executionStatus: agentcore.ExecutionStatus.ENABLED,
});

new integ.IntegTest(app, 'BedrockAgentCoreOnlineEvaluation', {
  testCases: [stack],
});

app.synth();
