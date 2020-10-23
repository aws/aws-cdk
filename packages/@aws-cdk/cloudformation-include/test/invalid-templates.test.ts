import * as path from 'path';
import { SynthUtils } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as core from '@aws-cdk/core';
import * as constructs from 'constructs';
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

  test("throws a validation exception for a template with a DependsOn that doesn't exist", () => {
    expect(() => {
      includeTestTemplate(stack, 'non-existent-depends-on.json');
    }).toThrow(/Resource 'Bucket2' depends on 'Bucket1' that doesn't exist/);
  });

  test("throws a validation exception for a template referencing a Condition in the Conditions section that doesn't exist", () => {
    expect(() => {
      includeTestTemplate(stack, 'non-existent-condition-in-conditions.json');
    }).toThrow(/Referenced Condition with name 'AlwaysFalse' was not found in the template/);
  });

  test('throws a validation exception for a template using Fn::GetAtt in the Conditions section', () => {
    expect(() => {
      includeTestTemplate(stack, 'getatt-in-conditions.json');
    }).toThrow(/Using GetAtt in Condition definitions is not allowed/);
  });

  test("throws a validation exception for a template referencing a Condition resource attribute that doesn't exist", () => {
    expect(() => {
      includeTestTemplate(stack, 'non-existent-condition.json');
    }).toThrow(/Resource 'Bucket' uses Condition 'AlwaysFalseCond' that doesn't exist/);
  });

  test("throws a validation exception for a template referencing a Condition in an If expression that doesn't exist", () => {
    expect(() => {
      includeTestTemplate(stack, 'non-existent-condition-in-if.json');
    }).toThrow(/Condition 'AlwaysFalse' used in an Fn::If expression does not exist in the template/);
  });

  test("throws an exception when encountering a CFN function it doesn't support", () => {
    expect(() => {
      includeTestTemplate(stack, 'only-codecommit-repo-using-cfn-functions.json');
    }).toThrow(/Unsupported CloudFormation function 'Fn::ValueOfAll'/);
  });

  test('throws a validation exception when encountering an unrecognized resource attribute', () => {
    expect(() => {
      includeTestTemplate(stack, 'non-existent-resource-attribute.json');
    }).toThrow(/The 'NonExistentResourceAttribute' resource attribute is not supported by cloudformation-include yet/);
  });

  test("throws a validation exception when encountering a Ref-erence to a template element that doesn't exist", () => {
    expect(() => {
      includeTestTemplate(stack, 'ref-ing-a-non-existent-element.json');
    }).toThrow(/Element used in Ref expression with logical ID: 'DoesNotExist' not found/);
  });

  test("throws a validation exception when encountering a GetAtt reference to a resource that doesn't exist", () => {
    expect(() => {
      includeTestTemplate(stack, 'getting-attribute-of-a-non-existent-resource.json');
    }).toThrow(/Resource used in GetAtt expression with logical ID: 'DoesNotExist' not found/);
  });

  test("throws a validation exception when an Output references a Condition that doesn't exist", () => {
    expect(() => {
      includeTestTemplate(stack, 'output-referencing-nonexistant-condition.json');
    }).toThrow(/Output with name 'SomeOutput' refers to a Condition with name 'NonexistantCondition' which was not found in this template/);
  });

  test("throws a validation exception when a Resource property references a Mapping that doesn't exist", () => {
    expect(() => {
      includeTestTemplate(stack, 'non-existent-mapping.json');
    }).toThrow(/Mapping used in FindInMap expression with name 'NonExistentMapping' was not found in the template/);
  });

  test("throws a validation exception when a Rule references a Parameter that isn't in the template", () => {
    expect(() => {
      includeTestTemplate(stack, 'rule-referencing-a-non-existent-parameter.json');
    }).toThrow(/Rule references parameter 'Subnets' which was not found in the template/);
  });

  test("throws a validation exception when Fn::Sub in string form uses a key that isn't in the template", () => {
    expect(() => {
      includeTestTemplate(stack, 'fn-sub-key-not-in-template-string.json');
    }).toThrow(/Element referenced in Fn::Sub expression with logical ID: 'AFakeResource' was not found in the template/);
  });

  test('throws a validation exception when Fn::Sub has an empty ${} reference', () => {
    expect(() => {
      includeTestTemplate(stack, 'fn-sub-${}-only.json');
    }).toThrow(/Element referenced in Fn::Sub expression with logical ID: '' was not found in the template/);
  });

  test("throws an exception for a template with a non-number string passed to a property with type 'number'", () => {
    includeTestTemplate(stack, 'alphabetical-string-passed-to-number.json');

    expect(() => {
      SynthUtils.synthesize(stack);
    }).toThrow(/"abc" should be a number/);
  });

  test('throws an exception for a template with a short-form Fn::GetAtt whose string argument does not contain a dot', () => {
    expect(() => {
      includeTestTemplate(stack, 'short-form-get-att-no-dot.yaml');
    }).toThrow(/Short-form Fn::GetAtt must contain a '.' in its string argument, got: 'Bucket1Arn'/);
  });
});

function includeTestTemplate(scope: constructs.Construct, testTemplate: string): inc.CfnInclude {
  return new inc.CfnInclude(scope, 'MyScope', {
    templateFile: _testTemplateFilePath(testTemplate),
  });
}

function _testTemplateFilePath(testTemplate: string) {
  return path.join(__dirname, 'test-templates', 'invalid', testTemplate);
}
