import '@aws-cdk/assert/jest';
import * as core from '@aws-cdk/core';
import * as path from 'path';
import * as inc from '../lib';
import * as futils from '../lib/file-utils';

// tslint:disable:object-literal-key-quotes
/* eslint-disable quotes */

describe('CDK Include', () => {
  let stack: core.Stack;

  beforeEach(() => {
    stack = new core.Stack();
  });

  test('can ingest a template with a S3 Bucket that has a CorsRule, and output it unchanged', () => {
    includeTestTemplate(stack, 'bucket.yaml');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('bucket.yaml'),
    );
  });

  test('can ingest a complex cloudformation template with Fn::Join and Fn::GetAtt and output it unchanged', () => {
    includeTestTemplate(stack, 'sample-join-getatt.yaml');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('../sample-join-getatt.json'),
    ); 
  });

  test('can ingest a template with many functions and conditions and output it unchanged', () => {
    includeTestTemplate(stack, 'functions-and-conditions.yaml');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('../functions-and-conditions.json'),
    ); 
  });


  test('can ingest a yaml template with parameters and output it unchanged', () => {
      includeTestTemplate(stack, 'bucket-with-parameters.yaml');

      expect(stack).toMatchTemplate(
          loadTestFileToJsObject('../bucket-with-parameters.json'),
      );
  });
});

  interface IncludeTestTemplateProps {
    /** @default true */
    readonly preserveLogicalIds?: boolean;
  }
  
  function includeTestTemplate(scope: core.Construct, testTemplate: string, _props: IncludeTestTemplateProps = {}): inc.CfnInclude {
    return new inc.CfnInclude(scope, 'MyScope', {
      templateFile: _testTemplateFilePath(testTemplate),
      // preserveLogicalIds: props.preserveLogicalIds,
    });
  }
  
  function loadTestFileToJsObject(testTemplate: string): any {
    return futils.readYamlSync(_testTemplateFilePath(testTemplate));
  }
  
  function _testTemplateFilePath(testTemplate: string) {
    return path.join(__dirname, 'test-templates/yaml', testTemplate);
  }