import * as path from 'path';
import '@aws-cdk/assert-internal/jest';
import * as core from '@aws-cdk/core';
import * as constructs from 'constructs';
import * as inc from '../lib';
import * as futils from '../lib/file-utils';

/* eslint-disable quote-props */
/* eslint-disable quotes */

describe('CDK Include for templates with SAM transform', () => {
  let stack: core.Stack;

  beforeEach(() => {
    stack = new core.Stack();
  });

  test('can ingest a template with only a minimal SAM function using S3Location for CodeUri, and output it unchanged', () => {
    includeTestTemplate(stack, 'only-minimal-sam-function-codeuri-as-s3location.yaml');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('only-minimal-sam-function-codeuri-as-s3location.yaml'),
    );
  });

  test('can ingest a template with only a SAM function using an array with DDB CRUD for Policies, and output it unchanged', () => {
    includeTestTemplate(stack, 'only-sam-function-policies-array-ddb-crud.yaml');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('only-sam-function-policies-array-ddb-crud.yaml'),
    );
  });

  test('can ingest a template with only a minimal SAM function using a parameter for CodeUri, and output it unchanged', () => {
    includeTestTemplate(stack, 'only-minimal-sam-function-codeuri-as-param.yaml');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('only-minimal-sam-function-codeuri-as-param.yaml'),
    );
  });

  test('can ingest a template with only a minimal SAM function using a parameter for CodeUri Bucket property, and output it unchanged', () => {
    includeTestTemplate(stack, 'only-minimal-sam-function-codeuri-bucket-as-param.yaml');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('only-minimal-sam-function-codeuri-bucket-as-param.yaml'),
    );
  });

  test('can ingest a template with only a SAM function using an array with DDB CRUD for Policies with an Fn::If expression, and output it unchanged', () => {
    includeTestTemplate(stack, 'only-sam-function-policies-array-ddb-crud-if.yaml');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('only-sam-function-policies-array-ddb-crud-if.yaml'),
    );
  });
});

function includeTestTemplate(scope: constructs.Construct, testTemplate: string): inc.CfnInclude {
  return new inc.CfnInclude(scope, 'MyScope', {
    templateFile: _testTemplateFilePath(testTemplate),
  });
}

function loadTestFileToJsObject(testTemplate: string): any {
  return futils.readYamlSync(_testTemplateFilePath(testTemplate));
}

function _testTemplateFilePath(testTemplate: string) {
  return path.join(__dirname, 'test-templates', 'sam', testTemplate);
}
