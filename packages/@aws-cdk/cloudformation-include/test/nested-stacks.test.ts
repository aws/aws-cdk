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

  test('can ingest a template with nested stacks and generate each nested template correctly', () => {
    const parentTemplate = new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-export-stack.json'),
      nestedStacks: {
        "ChildStack": {
          templateFile: testTemplateFilePath('child-import-stack.json'),
          nestedStacks: {
            "GrandChildStack": {
              templateFile: testTemplateFilePath('grandchild-import-stack.json'),
            },
          },
        },
        "AnotherChildStack": {
          templateFile: testTemplateFilePath('child-import-stack.json'),
          nestedStacks: {
            "GrandChildStack": {
              templateFile: testTemplateFilePath('grandchild-import-stack.json'),
            },
          },
        },
      },
    });

    expect(parentTemplate.getNestedStack('ChildStack').stack).toMatchTemplate(
      loadTestFileToJsObject(('child-stack.expected.json')),
    );

    expect(parentTemplate.getNestedStack('ChildStack').includedTemplate.getNestedStack('GrandChildStack').stack).toMatchTemplate(
      loadTestFileToJsObject(('grandchild-stack.expected.json')),
    );

    expect(parentTemplate.getNestedStack('AnotherChildStack').stack).toMatchTemplate(
      loadTestFileToJsObject(('another-child-stack.expected.json')),
    );

    expect(parentTemplate.getNestedStack('AnotherChildStack').includedTemplate.getNestedStack('GrandChildStack').stack).toMatchTemplate(
      loadTestFileToJsObject(('grandchild-stack.expected.json')),
    );
  });

  test('throws an error when provided a nested stack that is not present in the template', () => {
    expect(() => {
      new inc.CfnInclude(stack, 'ParentStack', {
        templateFile: testTemplateFilePath('parent-export-stack.json'),
        nestedStacks: {
          "FakeStack": {
            templateFile: testTemplateFilePath('child-import-stack.json'),
          },
        },
      });
    }).toThrow(/Nested Stack with logical ID 'FakeStack' was not found in the template/);
  });

  test('Throws an error when NestedStacks contains an ID that is not a CloudFormation::Stack in the template', () => {
    expect(() => {
      new inc.CfnInclude(stack, 'ParentStack', {
        templateFile: testTemplateFilePath('parent-export-stack.json'),
        nestedStacks: {
          "ChildStack": {
            templateFile: testTemplateFilePath('child-import-stack.json'),
            nestedStacks: {
              "BucketImport": {
                templateFile: testTemplateFilePath('grandchild-import-stack.json'),
              },
            },
          },
        },
      });
    }).toThrow(/Nested Stack with logical ID 'BucketImport' is not an AWS::CloudFormation::Stack resource/);
  });

  test('can modify resources in nested stacks', () => {
    const parent = new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-export-stack.json'),
      nestedStacks: {
        "ChildStack": {
          templateFile: testTemplateFilePath('child-import-stack.json'),
          nestedStacks: {
            "GrandChildStack": {
              templateFile: testTemplateFilePath('grandchild-import-stack.json'),
            },
          },
        },
      },
    });

    const grandChildTemplate = parent.getNestedStack('ChildStack').includedTemplate.getNestedStack('GrandChildStack').includedTemplate;
    const bucket = grandChildTemplate.getResource('BucketImport') as s3.CfnBucket;

    bucket.bucketName = 'modified-bucket-name';

    const grandChildStack = parent.getNestedStack('ChildStack').includedTemplate.getNestedStack('GrandChildStack').stack;
    expect(grandChildStack).toHaveResource('AWS::S3::Bucket', { BucketName: 'modified-bucket-name' });
  });

  test('templates with nested stacks that do not exist in the nested stacks property have those stacks ignored', () => {
    new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-export-stack.json'),
    });

    expect(stack).toMatchTemplate(loadTestFileToJsObject('parent-export-stack.json'));
  });

  test('getNestedStack() throws an exception when getting a resource that does not exist in the template', () => {
    const parentTemplate = new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-export-stack.json'),
      nestedStacks: {
        "ChildStack": {
          templateFile: testTemplateFilePath('child-import-stack.json'),
        },
      },
    });

    expect(() => {
      parentTemplate.getNestedStack('FakeStack');
    }).toThrow(/Nested Stack with logical ID 'FakeStack' was not found/);
  });

  test('getNestedStack() throws an exception when getting a resource that exists in the template, but is not a Stack', () => {
    const parentTemplate = new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-export-stack.json'),
      nestedStacks: {
        "ChildStack": {
          templateFile: testTemplateFilePath('child-import-stack.json'),
        },
      },
    });

    expect(() => {
      parentTemplate.getNestedStack('ChildStack').includedTemplate.getNestedStack('BucketImport');
    }).toThrow(/Resource with logical ID 'BucketImport' is not a CloudFormation Stack/);
  });

  test('getNestedStack() throws an exception when getting a resource that exists in the template, but was not specified in the props', () => {
    const parentTemplate = new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-export-stack.json'),
      nestedStacks: {
        "ChildStack": {
          templateFile: testTemplateFilePath('child-import-stack.json'),
        },
      },
    });

    expect(() => {
      parentTemplate.getNestedStack('AnotherChildStack').includedTemplate.getNestedStack('BucketImport');
    }).toThrow(/Nested Stack with logical ID 'AnotherChildStack' was not specified in the CfnInclude props/);
  });
});

function loadTestFileToJsObject(testTemplate: string): any {
  return futils.readJsonSync(testTemplateFilePath(testTemplate));
}

function testTemplateFilePath(testTemplate: string) {
  return path.join(__dirname, 'test-templates/nested', testTemplate);
}
