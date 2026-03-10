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

// Create an online evaluation configuration with basic settings
new agentcore.OnlineEvaluationConfig(stack, 'BasicEvaluation', {
  configName: 'integ_test_basic_eval',
  evaluators: [
    agentcore.EvaluatorReference.builtin(agentcore.BuiltinEvaluator.HELPFULNESS),
    agentcore.EvaluatorReference.builtin(agentcore.BuiltinEvaluator.CORRECTNESS),
  ],
  dataSource: agentcore.DataSourceConfig.fromCloudWatchLogs({
    logGroupNames: [logGroup.logGroupName],
    serviceNames: ['integ-test-agent.default'],
  }),
  description: 'Basic integration test evaluation with CloudWatch Logs',
});

new integ.IntegTest(app, 'BedrockAgentCoreOnlineEvaluation', {
  testCases: [stack],
});

app.synth();
