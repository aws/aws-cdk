/// !cdk-integ aws-cdk-bedrock-agentcore-evaluator-tags

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as agentcore from '../../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-bedrock-agentcore-evaluator-tags');

new agentcore.Evaluator(stack, 'TaggedEvaluator', {
  evaluatorName: 'integ_tagged_evaluator',
  level: agentcore.EvaluationLevel.SESSION,
  evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
    instructions: 'Evaluate helpfulness. Context: {context}. Available tools: {available_tools}.',
    modelId: 'us.anthropic.claude-sonnet-4-6',
    ratingScale: agentcore.EvaluatorRatingScale.categorical([
      { label: 'Good', definition: 'Helpful response.' },
      { label: 'Bad', definition: 'Not helpful.' },
    ]),
  }),
  tags: {
    Environment: 'IntegTest',
    Team: 'CDKAbstractions',
  },
});

new integ.IntegTest(app, 'EvaluatorTagsTest', {
  testCases: [stack],
});
