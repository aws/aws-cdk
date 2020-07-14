import { ResourcePart } from '@aws-cdk/assert';
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

  test('can ingest a template with one child', () => {
    const parentTemplate = new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-onechild.json'),
      nestedStacks: {
        'ChildStack': {
          templateFile: testTemplateFilePath('grandchild-import-stack.json'),
        },
      },
    });

    const childStack = parentTemplate.getNestedStack('ChildStack');
    expect(childStack.stack).toMatchTemplate(
      loadTestFileToJsObject('grandchild-stack.expected.json'),
    );
  });

  test('can ingest a template with two children', () => {
    const parentTemplate = new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-export-stack.json'),
      nestedStacks: {
        'ChildStack': {
          templateFile: testTemplateFilePath('grandchild-import-stack.json'),
        },
        'AnotherChildStack': {
          templateFile: testTemplateFilePath('grandchild-import-stack.json'),
        },
      },
    });

    const childStack = parentTemplate.getNestedStack('ChildStack');
    const anotherChildStack = parentTemplate.getNestedStack('AnotherChildStack');
    expect(childStack.stack).toMatchTemplate(
      loadTestFileToJsObject('grandchild-stack.expected.json'),
    );

    expect(anotherChildStack.stack).toMatchTemplate(
      loadTestFileToJsObject('grandchild-stack.expected.json'),
    );
  });

  test('can ingest a template with one child and one grandchild', () => {
    const parentTemplate = new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-export-stack.json'),
      nestedStacks: {
        'ChildStack': {
          templateFile: testTemplateFilePath('child-import-stack.json'),
          nestedStacks: {
            'GrandChildStack': {
              templateFile: testTemplateFilePath('grandchild-import-stack.json'),
            },
          },
        },
      },
    });

    const childStack = parentTemplate.getNestedStack('ChildStack');
    const grandChildStack = childStack.includedTemplate.getNestedStack('GrandChildStack');
    expect(childStack.stack).toMatchTemplate(
      loadTestFileToJsObject('child-stack.expected.json'),
    );

    expect(grandChildStack.stack).toMatchTemplate(
      loadTestFileToJsObject('grandchild-stack.expected.json'),
    );
  });

  test('asset parameters generated in parent and child are identical', () => {
    new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-onechild.json'),
      nestedStacks: {
        'ChildStack': {
          templateFile: testTemplateFilePath('grandchild-import-stack.json'),
        },
      },
    });

    const parentStack = loadTestFileToJsObject('parent-onechild.json');

    const assetParam = 'AssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3BucketEAA24F0C';
    const assetParamKey = 'AssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3VersionKey1194CAB2';
    expect(stack).toMatchTemplate({
      "Parameters": {
        ...parentStack.Parameters,
        [assetParam]: {
          "Type": "String",
          "Description": "S3 bucket for asset \"5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50\""
        },
        [assetParamKey]: {
          "Type": "String",
          "Description": "S3 key for asset version \"5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50\""
        },
        "AssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50ArtifactHash9C417847": {
          "Type": "String",
          "Description": "Artifact hash for asset \"5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50\""
        },
      },
      "Resources": {
        ...parentStack.Resources,
        "ChildStack": {
          "Type": "AWS::CloudFormation::Stack",
          "Properties": {
            "TemplateURL": {
              "Fn::Join": [ "", [
                "https://s3.",
                  { "Ref": "AWS::Region" },
                  ".",
                  { "Ref": "AWS::URLSuffix" },
                  "/",
                  { "Ref": assetParam },
                  "/",
                  { "Fn::Select": [
                    0,
                    { "Fn::Split": [
                        "||",
                        { "Ref": assetParamKey }
                    ]}
                  ]},
                  {
                    "Fn::Select": [
                      1,
                      { "Fn::Split": [
                          "||",
                          { "Ref": assetParamKey, }
                      ]}
                    ]
                  }
                ]
              ]
            },
            "Parameters": {
              "MyBucketParameter": "some-magic-bucket-name"
            }
          }
        },
      }
    });
  });


  test('asset parameters generated in parent, child and grandchild are identical', () => {
    const parentTemplate = new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-onechild.json'),
      nestedStacks: {
        'ChildStack': {
          templateFile: testTemplateFilePath('child-no-bucket.json'),
          nestedStacks: {
            'GrandChildStack': {
              templateFile: testTemplateFilePath('grandchild-import-stack.json')
            }
          }
        },
      },
    });

    const childTemplate = parentTemplate.getNestedStack('ChildStack');
    const grandChildTemplate = childTemplate.includedTemplate.getNestedStack('GrandChildStack');

    const assetParam = 'referencetoAssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3BucketEAA24F0CRef';
    const assetParamKey = 'referencetoAssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3VersionKey1194CAB2Ref';

    expect(childTemplate.stack).toMatchTemplate({
      "Parameters": {
        "MyBucketParameter": {
          "Type": "String",
          "Default": "default-bucket-param-name"
        },
        [assetParam]: {
          "Type": "String"
        },
        [assetParamKey]: {
          "Type": "String"
        },
      },
      "Resources": {
        "GrandChildStack": {
          "Type": "AWS::CloudFormation::Stack",
          "Properties": {
            "TemplateURL": {
              "Fn::Join": [ "", [
                "https://s3.",
                  { "Ref": "AWS::Region" },
                  ".",
                  { "Ref": "AWS::URLSuffix" },
                  "/",
                  { "Ref": assetParam },
                  "/",
                  { "Fn::Select": [
                    0,
                    { "Fn::Split": [
                        "||",
                        { "Ref": assetParamKey }
                    ]}
                  ]},
                  {
                    "Fn::Select": [
                      1,
                      { "Fn::Split": [
                          "||",
                          { "Ref": assetParamKey, }
                      ]}
                    ]
                  }
                ]
              ],
            },
            "Parameters": {
              "MyBucketParameter": "some-other-bucket-name"
            }
          },
        }
      },
    });

    expect(grandChildTemplate.stack).toMatchTemplate(
      loadTestFileToJsObject('grandchild-import-stack.json')
    );
  });

  test('throws an error when provided a nested stack that is not present in the template', () => {
    expect(() => {
      new inc.CfnInclude(stack, 'ParentStack', {
        templateFile: testTemplateFilePath('parent-export-stack.json'),
        nestedStacks: {
          'FakeStack': {
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
          'ChildStack': {
            templateFile: testTemplateFilePath('child-import-stack.json'),
            nestedStacks: {
              'BucketImport': {
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
        'ChildStack': {
          templateFile: testTemplateFilePath('child-import-stack.json'),
          nestedStacks: {
            'GrandChildStack': {
              templateFile: testTemplateFilePath('grandchild-import-stack.json'),
            },
          },
        },
      },
    });

    const childTemplate = parent.getNestedStack('ChildStack').includedTemplate;
    const grandChild = childTemplate.getNestedStack('GrandChildStack');
    const bucket = grandChild.includedTemplate.getResource('BucketImport') as s3.CfnBucket;

    bucket.bucketName = 'modified-bucket-name';

    expect(grandChild.stack).toHaveResource('AWS::S3::Bucket', { BucketName: 'modified-bucket-name' });
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
        'ChildStack': {
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
        'ChildStack': {
          templateFile: testTemplateFilePath('child-import-stack.json'),
        },
      },
    });

    expect(() => {
      const childTemplate = parentTemplate.getNestedStack('ChildStack').includedTemplate;
      childTemplate.getNestedStack('BucketImport');
    }).toThrow(/Resource with logical ID 'BucketImport' is not a CloudFormation Stack/);
  });

  test('getNestedStack() throws an exception when getting a resource that exists in the template, but was not specified in the props', () => {
    const parentTemplate = new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-export-stack.json'),
      nestedStacks: {
        'ChildStack': {
          templateFile: testTemplateFilePath('child-import-stack.json'),
        },
      },
    });

    expect(() => {
      parentTemplate.getNestedStack('AnotherChildStack').includedTemplate.getNestedStack('BucketImport');
    }).toThrow(/Nested Stack 'AnotherChildStack' was not included in the nestedStacks property when including the parent template/);
  });

  test('correctly handles renaming of references across nested stacks', () => {
    const parentTemplate = new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('cross-stack-refs.json'),
      nestedStacks: {
        'ChildStack': {
          templateFile: testTemplateFilePath('child-import-stack.json'),
        },
      },
    });
    const cfnBucket = parentTemplate.getResource('Bucket');
    cfnBucket.overrideLogicalId('DifferentBucket');
    const parameter = parentTemplate.getParameter('Param');
    parameter.overrideLogicalId('DifferentParameter');

    expect(stack).toHaveResourceLike('AWS::CloudFormation::Stack', {
      "Parameters": {
        "Param1": {
          "Ref": "DifferentParameter",
        },
        "Param2": {
          "Fn::GetAtt": ["DifferentBucket", "Arn"],
        },
      },
    });
  });

  test('ensure that getResource() returns a CfnStack', () => {
    const cfnTemplate = new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-export-stack.json'),
    });

    const childStack1 = cfnTemplate.getResource('ChildStack');

    expect(childStack1).toBeInstanceOf(core.CfnStack);
  });

  test('attributes are correctly parsed', () => {
    new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-with-attributes.json'),
    });

    expect(stack).toHaveResourceLike('AWS::CloudFormation::Stack', {
      "Properties": {
        "TemplateURL": "https://cfn-templates-set.s3.amazonaws.com/child-import-stack.json",
      },
      "Metadata": {
        "Property1": "Value1",
      },
      "DeletionPolicy": "Retain",
      "DependsOn": [
        "ChildStack",
      ],
      "UpdateReplacePolicy": "Retain",
    }, ResourcePart.CompleteDefinition);
  });

  test('correctly parses NotificationsARNs, Timeout', () => {
    new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-with-attributes.json'),
    });

    expect(stack).toHaveResourceLike('AWS::CloudFormation::Stack', {
      "Type": "AWS::CloudFormation::Stack",
      "Properties": {
        "TemplateURL": "https://cfn-templates-set.s3.amazonaws.com/child-import-stack.json",
        "NotificationARNs": ["arn1"],
        "TimeoutInMinutes": 5,
      },
    }, ResourcePart.CompleteDefinition);
  });

  test('correctly modifies the templateUrl property of a nested stack whose template has been passed', () => {
    new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('only-nested-stack.json'),
      nestedStacks: {
        'NestedStack': {
          // doesn't matter in this test
          templateFile: testTemplateFilePath('child-import-stack.json'),
        },
      },
    });

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('only-nested-stack.expected.json'),
    );
  });
});

function loadTestFileToJsObject(testTemplate: string): any {
  return futils.readJsonSync(testTemplateFilePath(testTemplate));
}

function testTemplateFilePath(testTemplate: string) {
  return path.join(__dirname, 'test-templates/nested', testTemplate);
}
