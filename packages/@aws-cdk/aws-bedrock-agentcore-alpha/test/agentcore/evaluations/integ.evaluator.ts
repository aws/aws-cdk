/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as agentcore from '../../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'EvaluatorIntegTest');

// LLM-as-a-Judge evaluator
new agentcore.Evaluator(stack, 'LlmEvaluator', {
  evaluatorName: 'integ_llm_evaluator',
  level: agentcore.EvaluationLevel.SESSION,
  evaluatorConfig: agentcore.EvaluatorConfig.llmAsAJudge({
    evaluationInstructions: 'Evaluate the helpfulness of the assistant response. Context: {context}',
    modelId: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
    ratingScale: agentcore.RatingScale.numerical([
      { label: 'Very Good', definition: 'Completely accurate and helpful', value: 1 },
      { label: 'Good', definition: 'Mostly accurate', value: 0.75 },
      { label: 'Poor', definition: 'Significant errors', value: 0.25 },
      { label: 'Very Poor', definition: 'Completely incorrect', value: 0 },
    ]),
  }),
});

new integ.IntegTest(app, 'EvaluatorTest', {
  testCases: [stack],
});
