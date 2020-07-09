import '@aws-cdk/assert/jest';
import * as s3 from '@aws-cdk/aws-s3';
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

  test("can ingest a template with nested stacks", () => {
    const parentTemplate = new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: _testTemplateFilePath('parent-export-stack.json'),
      nestedStacks: {
        "ChildStack": {
          templateFile: _testTemplateFilePath('child-import-stack.json'),
          nestedStacks: {
            "GrandChildStack": {
              templateFile: _testTemplateFilePath('grandchild-import-stack.json'),
            },
          },
        },
        "AnotherChildStack": {
          templateFile: _testTemplateFilePath('child-import-stack.json'),
          nestedStacks: {
            "GrandChildStack": {
              templateFile: _testTemplateFilePath('grandchild-import-stack.json'),
            },
          },
        },
      },
    });

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject(('parent-stack.expected.json')),
    );

    expect(parentTemplate.getNestedStack('ChildStack')).toMatchTemplate(
      loadTestFileToJsObject(('child-stack.expected.json')),
    );

    expect(parentTemplate.getNestedStackTemplate('ChildStack').getNestedStack('GrandChildStack')).toMatchTemplate(
      loadTestFileToJsObject(('grandchild-stack.expected.json')),
    );

    expect(parentTemplate.getNestedStack('AnotherChildStack')).toMatchTemplate(
      loadTestFileToJsObject(('another-child-stack.expected.json')),
    );

    expect(parentTemplate.getNestedStackTemplate('AnotherChildStack').getNestedStack('GrandChildStack')).toMatchTemplate(
      loadTestFileToJsObject(('grandchild-stack.expected.json')),
    );
  });

  test("throws an error when NestedStacks contain a stack not found in the template", () => {
    expect(() => {
      new inc.CfnInclude(stack, 'ParentStack', {
        templateFile: _testTemplateFilePath('parent-export-stack.json'),
        nestedStacks: {
          "FakeStack": {
            templateFile: _testTemplateFilePath('child-import-stack.json'),
          },
        },
      });
    }).toThrow(/Nested Stack with logical ID 'FakeStack' was not found in the template/);
  });

  test("Throws an error when NestedStacks contains an ID that isn't a CloudFormation::Stack in the template", () => {
    expect(() => {
      new inc.CfnInclude(stack, 'ParentStack', {
        templateFile: _testTemplateFilePath('parent-export-stack.json'),
        nestedStacks: {
          "ChildStack": {
            templateFile: _testTemplateFilePath('child-import-stack.json'),
            nestedStacks: {
              "BucketImport": {
                templateFile: _testTemplateFilePath('grandchild-import-stack.json'),
              },
            },
          },
        },
      });
    }).toThrow(/Nested Stack with logical ID 'BucketImport' is not an AWS::CloudFormation::Stack resource/);
  });

  test("can modify resources in nested stacks", () => {
    const parent = new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: _testTemplateFilePath('parent-export-stack.json'),
      nestedStacks: {
        "ChildStack": {
          templateFile: _testTemplateFilePath('child-import-stack.json'),
          nestedStacks: {
            "GrandChildStack": {
              templateFile: _testTemplateFilePath('grandchild-import-stack.json'),
            },
          },
        },
      },
    });

    const grandChildTemplate = parent.getNestedStackTemplate('ChildStack').getNestedStackTemplate('GrandChildStack');
    const bucket = grandChildTemplate.getResource('BucketImport') as s3.CfnBucket;

    bucket.bucketName = 'modified-bucket-name';

    const grandChildStack = parent.getNestedStackTemplate('ChildStack').getNestedStack('GrandChildStack');
    expect(grandChildStack).toHaveResource('AWS::S3::Bucket', { BucketName: 'modified-bucket-name' });
  });

  test("templates with nested stacks that don't exist in the nested stacks property have those stacks ignored", () => {
    const parentTemplate = new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: _testTemplateFilePath('parent-export-stack.json'),
      nestedStacks: {
        "ChildStack": {
          templateFile: _testTemplateFilePath('child-import-stack.json'),
        },
      },
    });

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('parent-stack-ignore.expected.json'),
    );

    expect(parentTemplate.getNestedStack('ChildStack')).toMatchTemplate(
      loadTestFileToJsObject('child-stack-ignore.expected.json'),
    );
  });
});

function loadTestFileToJsObject(testTemplate: string): any {
  return futils.readJsonSync(_testTemplateFilePath(testTemplate));
}

function _testTemplateFilePath(testTemplate: string) {
  return path.join(__dirname, 'test-templates/nested', testTemplate);
}
