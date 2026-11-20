/*
 * Integration test for OnlineEvaluationConfig with skill and managed third-party evaluators,
 * the raised evaluator limit (25) and the raised log group limit (10).
 */

/// !cdk-integ aws-cdk-bedrock-agentcore-online-evaluation-evaluator-types

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as agentcore from 'aws-cdk-lib/aws-bedrockagentcore';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-online-evaluation-evaluator-types');

// 10 log groups (the maximum)
const logGroupNames = Array.from({ length: 10 }, (_, i) => new logs.LogGroup(stack, `AgentLogGroup${i}`, {
  logGroupName: `/aws/bedrock-agentcore/integ-test-evaluator-types-${i}`,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  retention: logs.RetentionDays.ONE_DAY,
}).logGroupName);

new agentcore.OnlineEvaluationConfig(stack, 'EvaluatorTypesEvaluation', {
  onlineEvaluationConfigName: 'integ_test_evaluator_types',
  evaluators: [
    // Built-in (15)
    agentcore.EvaluatorSelector.builtin(agentcore.BuiltinEvaluator.GOAL_SUCCESS_RATE),
    agentcore.EvaluatorSelector.builtin(agentcore.BuiltinEvaluator.HELPFULNESS),
    agentcore.EvaluatorSelector.builtin(agentcore.BuiltinEvaluator.CORRECTNESS),
    agentcore.EvaluatorSelector.builtin(agentcore.BuiltinEvaluator.FAITHFULNESS),
    agentcore.EvaluatorSelector.builtin(agentcore.BuiltinEvaluator.HARMFULNESS),
    agentcore.EvaluatorSelector.builtin(agentcore.BuiltinEvaluator.STEREOTYPING),
    agentcore.EvaluatorSelector.builtin(agentcore.BuiltinEvaluator.REFUSAL),
    agentcore.EvaluatorSelector.builtin(agentcore.BuiltinEvaluator.COHERENCE),
    agentcore.EvaluatorSelector.builtin(agentcore.BuiltinEvaluator.RESPONSE_RELEVANCE),
    agentcore.EvaluatorSelector.builtin(agentcore.BuiltinEvaluator.CONCISENESS),
    agentcore.EvaluatorSelector.builtin(agentcore.BuiltinEvaluator.INSTRUCTION_FOLLOWING),
    agentcore.EvaluatorSelector.builtin(agentcore.BuiltinEvaluator.TOOL_SELECTION_ACCURACY),
    agentcore.EvaluatorSelector.builtin(agentcore.BuiltinEvaluator.TOOL_PARAMETER_ACCURACY),
    agentcore.EvaluatorSelector.builtin(agentcore.BuiltinEvaluator.SKILL_SELECTION_ACCURACY),
    agentcore.EvaluatorSelector.builtin(agentcore.BuiltinEvaluator.SKILL_INSTRUCTION_FOLLOWING),
    // Managed third-party (10) -> 25 total, the maximum
    agentcore.EvaluatorSelector.thirdParty(agentcore.ThirdPartyEvaluator.DEEP_EVAL_BIAS),
    agentcore.EvaluatorSelector.thirdParty(agentcore.ThirdPartyEvaluator.DEEP_EVAL_TOXICITY),
    agentcore.EvaluatorSelector.thirdParty(agentcore.ThirdPartyEvaluator.DEEP_EVAL_PII_LEAKAGE),
    agentcore.EvaluatorSelector.thirdParty(agentcore.ThirdPartyEvaluator.DEEP_EVAL_TASK_COMPLETION),
    agentcore.EvaluatorSelector.thirdParty(agentcore.ThirdPartyEvaluator.DEEP_EVAL_CONVERSATION_COMPLETENESS),
    agentcore.EvaluatorSelector.thirdParty(agentcore.ThirdPartyEvaluator.DEEP_EVAL_TURN_RELEVANCY),
    agentcore.EvaluatorSelector.thirdParty(agentcore.ThirdPartyEvaluator.DEEP_EVAL_TOOL_USE),
    agentcore.EvaluatorSelector.thirdParty(agentcore.ThirdPartyEvaluator.AUTO_EVAL_SECURITY),
    agentcore.EvaluatorSelector.thirdParty(agentcore.ThirdPartyEvaluator.AUTO_EVAL_HUMOR),
    agentcore.EvaluatorSelector.thirdParty(agentcore.ThirdPartyEvaluator.AUTO_EVAL_POSSIBLE),
  ],
  dataSource: agentcore.DataSourceConfig.fromCloudWatchLogs({
    logGroupNames,
    serviceNames: ['integ-test-agent.default'],
  }),
  executionStatus: agentcore.ExecutionStatus.DISABLED,
});

new integ.IntegTest(app, 'BedrockAgentCoreOnlineEvaluationEvaluatorTypes', {
  testCases: [stack],
});
