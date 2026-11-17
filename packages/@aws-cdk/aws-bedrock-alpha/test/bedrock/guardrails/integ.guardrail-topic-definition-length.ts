/*
 * Integration test for the denied topic definition length limit per topics tier.
 *
 * The CLASSIC tier (the default) accepts a definition of up to 200 characters
 * and the STANDARD tier accepts up to 1000 characters. Both guardrails below
 * use a definition of exactly the maximum length.
 *
 * The STANDARD tier requires a cross-region guardrail profile. This test uses
 * the system-defined profile `us.guardrail.v1:0` of the account and region
 * the stack is deployed to (us-east-1).
 */

/// !cdk-integ aws-cdk-bedrock-guardrail-topic-definition-length

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as bedrock from '../../../bedrock';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-bedrock-guardrail-topic-definition-length');

const CLASSIC_MAX_DEFINITION_LENGTH = 200;
const STANDARD_MAX_DEFINITION_LENGTH = 1000;

function definitionOfLength(length: number): string {
  const sentence = 'Questions about investing money in stocks, bonds, funds or other financial products and how to grow savings. ';
  const definition = sentence.repeat(Math.ceil(length / sentence.length)).slice(0, length - 1).trimEnd() + '.';
  if (definition.length !== length) {
    throw new Error(`expected a definition of ${length} characters, got ${definition.length}`);
  }
  return definition;
}

// CLASSIC tier (default): definition of exactly 200 characters
new bedrock.Guardrail(stack, 'ClassicGuardrail', {
  guardrailName: 'TopicLengthClassic',
  description: 'Denied topic with a 200 character definition on the CLASSIC tier',
  deniedTopics: [
    bedrock.Topic.custom({
      name: 'Investment_Advice_Classic',
      definition: definitionOfLength(CLASSIC_MAX_DEFINITION_LENGTH),
      examples: ['Which stocks should I buy this year?'],
    }),
  ],
});

// STANDARD tier: definition of exactly 1000 characters
new bedrock.Guardrail(stack, 'StandardGuardrail', {
  guardrailName: 'TopicLengthStandard',
  description: 'Denied topic with a 1000 character definition on the STANDARD tier',
  topicsTierConfig: bedrock.TierConfig.STANDARD,
  crossRegionConfig: {
    guardrailProfileArn: stack.formatArn({
      service: 'bedrock',
      resource: 'guardrail-profile',
      resourceName: 'us.guardrail.v1:0',
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    }),
  },
  deniedTopics: [
    bedrock.Topic.custom({
      name: 'Investment_Advice_Standard',
      definition: definitionOfLength(STANDARD_MAX_DEFINITION_LENGTH),
      examples: ['Which stocks should I buy this year?'],
    }),
  ],
});

new integ.IntegTest(app, 'BedrockGuardrailTopicDefinitionLength', {
  testCases: [stack],
  // us.guardrail.v1:0 can only be called from US source Regions
  // https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-cross-region-support.html
  regions: ['us-east-1', 'us-east-2', 'us-west-2'],
});
