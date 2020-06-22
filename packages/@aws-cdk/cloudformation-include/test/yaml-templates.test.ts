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

  test('can ingest a template with only an empty S3 Bucket, and output it unchanged', () => {
    includeTestTemplate(stack, 'bucket.yaml');

    const foo = loadTestFileToJsObject('bucket.yaml');

    for (const prop of Object.keys(foo)) {
        console.log(prop);
    }
    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('bucket.yaml'),
    );
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
});