import { SynthUtils } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as core from '@aws-cdk/core';
import * as path from 'path';
import * as inc from '../lib';

describe('CDK Include', () => {
  let stack: core.Stack;

  beforeEach(() => {
    stack = new core.Stack();
  });

  test('throws a validation exception for a template with a missing required top-level resource property', () => {
    expect(() => {
      includeTestTemplate(stack, 'bucket-policy-without-bucket.json');
    }).toThrow(/missing required property: bucket/);
  });

  test('throws a validation exception for a template with a resource property expecting an array assigned the wrong type', () => {
    includeTestTemplate(stack, 'bucket-with-cors-rules-not-an-array.json');

    expect(() => {
      SynthUtils.synthesize(stack);
    }).toThrow(/corsRules: "CorsRules!" should be a list/);
  });

  test('throws a validation exception for a template with a null array element of a complex type with required fields', () => {
    includeTestTemplate(stack, 'bucket-with-cors-rules-null-element.json');

    expect(() => {
      SynthUtils.synthesize(stack);
    }).toThrow(/allowedMethods: required but missing/);
  });

  test('throws a validation exception for a template with a missing nested resource property', () => {
    includeTestTemplate(stack, 'bucket-with-invalid-cors-rule.json');

    expect(() => {
      SynthUtils.synthesize(stack);
    }).toThrow(/allowedOrigins: required but missing/);
  });
});

function includeTestTemplate(scope: core.Construct, testTemplate: string): inc.CfnInclude {
  return new inc.CfnInclude(scope, 'MyScope', {
    templateFile: _testTemplateFilePath(testTemplate),
  });
}

function _testTemplateFilePath(testTemplate: string) {
  return path.join(__dirname, 'test-templates', 'invalid', testTemplate);
}
