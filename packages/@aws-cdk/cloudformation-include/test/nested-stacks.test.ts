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
      templateFile: testTemplateFilePath('parent-one-child.json'),
      nestedStacks: {
        'ChildStack': {
          templateFile: testTemplateFilePath('grandchild-import-stack.json'),
        },
      },
    });

    const childStack = parentTemplate.getNestedStack('ChildStack');
    expect(childStack.stack).toMatchTemplate(
      loadTestFileToJsObject('grandchild-import-stack.json'),
    );
  });

  test('can ingest a template with two children', () => {
    const parentTemplate = new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-two-children.json'),
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
      loadTestFileToJsObject('grandchild-import-stack.json'),
    );

    expect(anotherChildStack.stack).toMatchTemplate(
      loadTestFileToJsObject('grandchild-import-stack.json'),
    );
  });

  test('can ingest a template with one child and one grandchild', () => {
    const parentTemplate = new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-two-children.json'),
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
      loadTestFileToJsObject('grandchild-import-stack.json'),
    );
  });

  test('throws an error when provided a nested stack that is not present in the template', () => {
    expect(() => {
      new inc.CfnInclude(stack, 'ParentStack', {
        templateFile: testTemplateFilePath('parent-two-children.json'),
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
        templateFile: testTemplateFilePath('parent-two-children.json'),
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
      templateFile: testTemplateFilePath('parent-two-children.json'),
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

  test('asset parameters generated in parent and child are identical', () => {
    new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-one-child.json'),
      nestedStacks: {
        'ChildStack': {
          templateFile: testTemplateFilePath('grandchild-import-stack.json'),
        },
      },
    });

    const assetParam = 'AssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3BucketEAA24F0C';
    const assetParamKey = 'AssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3VersionKey1194CAB2';
    expect(stack).toMatchTemplate({
      "Parameters": {
        [assetParam]: {
          "Type": "String",
          "Description": "S3 bucket for asset \"5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50\"",
        },
        [assetParamKey]: {
          "Type": "String",
          "Description": "S3 key for asset version \"5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50\"",
        },
        "AssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50ArtifactHash9C417847": {
          "Type": "String",
          "Description": "Artifact hash for asset \"5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50\"",
        },
      },
      "Resources": {
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
                    { "Ref": assetParamKey },
                  ]},
                ]},
                { "Fn::Select": [
                  1,
                  { "Fn::Split": [
                    "||",
                    { "Ref": assetParamKey },
                  ]},
                ]},
              ]],
            },
            "Parameters": {
              "MyBucketParameter": "some-magic-bucket-name",
            },
          },
        },
      },
    });
  });

  test('templates with nested stacks that were not provided in the nestedStacks property are left unmodified', () => {
    new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-two-children.json'),
    });

    expect(stack).toMatchTemplate(loadTestFileToJsObject('parent-two-children.json'));
  });

  test('getNestedStack() throws an exception when getting a resource that does not exist in the template', () => {
    const parentTemplate = new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-two-children.json'),
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
      templateFile: testTemplateFilePath('parent-two-children.json'),
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
      templateFile: testTemplateFilePath('parent-two-children.json'),
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

  test('returns the CfnStack object from getResource() for a nested stack that was not in the nestedStacks property', () => {
    const cfnTemplate = new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-two-children.json'),
    });

    const childStack1 = cfnTemplate.getResource('ChildStack');

    expect(childStack1).toBeInstanceOf(core.CfnStack);
  });

  test('attributes are correctly parsed', () => {
    new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-with-attributes.json'),
      nestedStacks: {
        'ChildStack': {
          templateFile: testTemplateFilePath('child-import-stack.json'),
        },
        'AnotherChildStack': {
          templateFile: testTemplateFilePath('child-import-stack.json'),
        },
      },
    });

    expect(stack).toHaveResourceLike('AWS::CloudFormation::Stack', {
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
      "TemplateURL": "https://cfn-templates-set.s3.amazonaws.com/child-import-stack.json",
      "NotificationARNs": ["arn1"],
      "TimeoutInMinutes": 5,
    });
  });
});

describe('asset parameters are correctly passed from parent to grandchild', () => {
  let stack: core.Stack;
  let parentTemplate: inc.CfnInclude;
  let child: inc.IncludedNestedStack;
  let grandChild: inc.IncludedNestedStack;

  let parentBucketParam: string;
  let parentKeyParam: string;
  let grandChildBucketParam: string;
  let parentKeyRef: string;

  let childBucketParam: string;
  let childKeyParam: string;

  beforeAll(() => {
    stack = new core.Stack();
    parentTemplate = new inc.CfnInclude(stack, 'ParentStack', {
      templateFile: testTemplateFilePath('parent-one-child.json'),
      nestedStacks: {
        'ChildStack': {
          templateFile: testTemplateFilePath('child-no-bucket.json'),
          nestedStacks: {
            'GrandChildStack': {
              templateFile: testTemplateFilePath('grandchild-import-stack.json'),
            },
          },
        },
      },
    });

    child = parentTemplate.getNestedStack('ChildStack');
    grandChild = child.includedTemplate.getNestedStack('GrandChildStack');

    parentBucketParam = 'AssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3BucketEAA24F0C';
    parentKeyParam = 'AssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3VersionKey1194CAB2';
    grandChildBucketParam = 'referencetoAssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3BucketEAA24F0CRef';
    parentKeyRef =  'referencetoAssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3VersionKey1194CAB2Ref';

    childBucketParam = 'AssetParameters891fd3ec75dc881b0fe40dc9fd1b433672637585c015265a5f0dab6bf79818d5S3Bucket23278F13';
    childKeyParam = 'AssetParameters891fd3ec75dc881b0fe40dc9fd1b433672637585c015265a5f0dab6bf79818d5S3VersionKey7316205A';
  });

  test('correctly creates parameters in the parent stack, and passes them to the child stack', () => {
    expect(stack).toMatchTemplate({
      "Parameters": {
        [parentBucketParam]: {
          "Type": "String",
          "Description": "S3 bucket for asset \"5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50\"",
        },
        [parentKeyParam]: {
          "Type": "String",
          "Description": "S3 key for asset version \"5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50\"",
        },
        "AssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50ArtifactHash9C417847": {
          "Type": "String",
          "Description": "Artifact hash for asset \"5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50\"",
        },
        [childBucketParam] : {
          "Type": "String",
          "Description": "S3 bucket for asset \"891fd3ec75dc881b0fe40dc9fd1b433672637585c015265a5f0dab6bf79818d5\"",
        },
        [childKeyParam]: {
          "Type": "String",
          "Description": "S3 key for asset version \"891fd3ec75dc881b0fe40dc9fd1b433672637585c015265a5f0dab6bf79818d5\"",
        },
        "AssetParameters891fd3ec75dc881b0fe40dc9fd1b433672637585c015265a5f0dab6bf79818d5ArtifactHashA1DE5198": {
          "Type": "String",
          "Description": "Artifact hash for asset \"891fd3ec75dc881b0fe40dc9fd1b433672637585c015265a5f0dab6bf79818d5\"",
        },
      },
      "Resources": {
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
                { "Ref": childBucketParam },
                "/",
                { "Fn::Select": [
                  0,
                  { "Fn::Split": [
                    "||",
                    { "Ref": childKeyParam },
                  ]},
                ]},
                { "Fn::Select": [
                  1,
                  { "Fn::Split": [
                    "||",
                    { "Ref": childKeyParam },
                  ]},
                ]},
              ]],
            },
            "Parameters": {
              "MyBucketParameter": "some-magic-bucket-name",
              [grandChildBucketParam]: {
                "Ref": parentBucketParam,
              },
              [parentKeyRef]: {
                "Ref": parentKeyParam,
              },
            },
          },
        },
      },
    });
  });

  test('correctly creates parameters in the child stack, and passes them to the grandchild stack', () => {
    expect(child.stack).toMatchTemplate({
      "Parameters": {
        "MyBucketParameter": {
          "Type": "String",
          "Default": "default-bucket-param-name",
        },
        [grandChildBucketParam]: {
          "Type": "String",
        },
        [parentKeyRef]: {
          "Type": "String",
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
                { "Ref": grandChildBucketParam },
                "/",
                { "Fn::Select": [
                  0,
                  { "Fn::Split": [
                    "||",
                    { "Ref": parentKeyRef },
                  ]},
                ]},
                {
                  "Fn::Select": [
                    1,
                    { "Fn::Split": [
                      "||",
                      { "Ref": parentKeyRef },
                    ]},
                  ],
                },
              ]],
            },
            "Parameters": {
              "MyBucketParameter": "some-other-bucket-name",
            },
          },
        },
      },
    });
  });

  test('leaves grandchild stack unmodified', () => {
    expect(grandChild.stack).toMatchTemplate(
      loadTestFileToJsObject('grandchild-import-stack.json'),
    );
  });
});

function loadTestFileToJsObject(testTemplate: string): any {
  return futils.readJsonSync(testTemplateFilePath(testTemplate));
}

function testTemplateFilePath(testTemplate: string) {
  return path.join(__dirname, 'test-templates/nested', testTemplate);
}
