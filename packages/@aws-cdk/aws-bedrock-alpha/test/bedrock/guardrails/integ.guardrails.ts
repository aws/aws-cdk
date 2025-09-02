/*
 * Integration test for Bedrock Guardrail construct
 */

/// !cdk-integ aws-cdk-bedrock-guardrail-1

import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as bedrock from '../../../bedrock';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-guardrail-1');

// Create a guardrail
new bedrock.Guardrail(stack, 'TestGuardrail', {
  guardrailName: 'TestGuardrail',
  description: 'This is a test guardrail',
  deniedTopics: [bedrock.Topic.FINANCIAL_ADVICE],
  contentFilters: [
    {
      type: bedrock.ContentFilterType.MISCONDUCT,
      inputStrength: bedrock.ContentFilterStrength.LOW,
      outputStrength: bedrock.ContentFilterStrength.LOW,
    },
  ],
  contextualGroundingFilters: [
    {
      type: bedrock.ContextualGroundingFilterType.GROUNDING,
      threshold: 0.99,
    },
  ],
  piiFilters: [
    {
      type: bedrock.GeneralPIIType.ADDRESS,
      action: bedrock.GuardrailAction.ANONYMIZE,
    },
  ],
  regexFilters: [
    {
      name: 'TestRegexFilter',
      description: 'This is a test regex filter',
      pattern: '/^[A-Z]{2}d{6}$/',
      action: bedrock.GuardrailAction.ANONYMIZE,
    },
  ],
  wordFilters: [
    {
      text: 'reggaeton',
      inputAction: bedrock.GuardrailAction.BLOCK,
      outputAction: bedrock.GuardrailAction.NONE,
    },
  ],
  managedWordListFilters: [
    {
      type: bedrock.ManagedWordFilterType.PROFANITY,
      inputAction: bedrock.GuardrailAction.BLOCK,
      outputAction: bedrock.GuardrailAction.NONE,
    },
  ],
});

new integ.IntegTest(app, 'BedrockGuardrail', {
  testCases: [stack],
});

app.synth();
