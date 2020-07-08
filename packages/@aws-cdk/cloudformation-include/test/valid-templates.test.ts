import { ResourcePart } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
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

  test('can ingest a template with only an empty S3 Bucket, and output it unchanged', () => {
    includeTestTemplate(stack, 'only-empty-bucket.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('only-empty-bucket.json'),
    );
  });

  test('throws an exception if asked for resource with a logical ID not present in the template', () => {
    const cfnTemplate = includeTestTemplate(stack, 'only-empty-bucket.json');

    expect(() => {
      cfnTemplate.getResource('LogicalIdThatDoesNotExist');
    }).toThrow(/Resource with logical ID 'LogicalIdThatDoesNotExist' was not found in the template/);
  });

  test('can ingest a template with only an empty S3 Bucket, and change its property', () => {
    const cfnTemplate = includeTestTemplate(stack, 'only-empty-bucket.json');

    const cfnBucket = cfnTemplate.getResource('Bucket') as s3.CfnBucket;
    cfnBucket.bucketName = 'my-bucket-name';

    expect(stack).toMatchTemplate({
      "Resources": {
        "Bucket": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": "my-bucket-name",
          },
        },
      },
    });
  });

  test('can ingest a template with only an S3 Bucket with complex properties, and output it unchanged', () => {
    const cfnTemplate = includeTestTemplate(stack, 'only-bucket-complex-props.json');
    const cfnBucket = cfnTemplate.getResource('Bucket') as s3.CfnBucket;

    expect((cfnBucket.corsConfiguration as any).corsRules).toHaveLength(1);
    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('only-bucket-complex-props.json'),
    );
  });

  test('allows referring to a bucket defined in the template in your CDK code', () => {
    const cfnTemplate = includeTestTemplate(stack, 'only-empty-bucket.json');
    const cfnBucket = cfnTemplate.getResource('Bucket') as s3.CfnBucket;

    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.AnyPrincipal(),
    });
    role.addToPolicy(new iam.PolicyStatement({
      actions: ['s3:*'],
      resources: [cfnBucket.attrArn],
    }));

    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      "PolicyDocument": {
        "Statement": [
          {
            "Action": "s3:*",
            "Resource": {
              "Fn::GetAtt": [
                "Bucket",
                "Arn",
              ],
            },
          },
        ],
      },
    });
  });

  test('can ingest a template with a Bucket Ref-erencing a KMS Key, and output it unchanged', () => {
    includeTestTemplate(stack, 'bucket-with-encryption-key.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('bucket-with-encryption-key.json'),
    );
  });

  xtest('correctly changes the logical IDs, including references, if imported with preserveLogicalIds=false', () => {
    const cfnTemplate = includeTestTemplate(stack, 'bucket-with-encryption-key.json', {
      preserveLogicalIds: false,
    });

    // even though the logical IDs in the resulting template are different than in the input template,
    // the L1s can still be retrieved using their original logical IDs from the template file,
    // and any modifications to them will be reflected in the resulting template
    const cfnBucket = cfnTemplate.getResource('Bucket') as s3.CfnBucket;
    cfnBucket.bucketName = 'my-bucket-name';

    expect(stack).toMatchTemplate({
      "Resources": {
        "MyScopeKey7673692F": {
          "Type": "AWS::KMS::Key",
          "Properties": {
            "KeyPolicy": {
              "Statement": [
                {
                  "Action": [
                    "kms:*",
                  ],
                  "Effect": "Allow",
                  "Principal": {
                    "AWS": {
                      "Fn::Join": ["", [
                        "arn:",
                        { "Ref": "AWS::Partition" },
                        ":iam::",
                        { "Ref": "AWS::AccountId" },
                        ":root",
                      ]],
                    },
                  },
                  "Resource": "*",
                },
              ],
              "Version": "2012-10-17",
            },
          },
          "DeletionPolicy": "Delete",
          "UpdateReplacePolicy": "Delete",
        },
        "MyScopeBucket02C1313B": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": "my-bucket-name",
            "BucketEncryption": {
              "ServerSideEncryptionConfiguration": [
                {
                  "ServerSideEncryptionByDefault": {
                    "KMSMasterKeyID": {
                      "Fn::GetAtt": [
                        "MyScopeKey7673692F",
                        "Arn",
                      ],
                    },
                    "SSEAlgorithm": "aws:kms",
                  },
                },
              ],
            },
          },
          "DeletionPolicy": "Retain",
          "UpdateReplacePolicy": "Retain",
        },
      },
    });
  });

  test('can ingest a template with an Fn::If expression for simple values, and output it unchanged', () => {
    includeTestTemplate(stack, 'if-simple-property.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('if-simple-property.json'),
    );
  });

  test('can ingest a template with an Fn::If expression for complex values, and output it unchanged', () => {
    includeTestTemplate(stack, 'if-complex-property.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('if-complex-property.json'),
    );
  });

  test('can ingest a template with intrinsic functions and conditions, and output it unchanged', () => {
    includeTestTemplate(stack, 'functions-and-conditions.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('functions-and-conditions.json'),
    );
  });

  test('can ingest a template with a Ref expression for an array value, and output it unchanged', () => {
    includeTestTemplate(stack, 'ref-array-property.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('ref-array-property.json'),
    );
  });

  test('renders non-Resources sections unchanged', () => {
    includeTestTemplate(stack, 'only-empty-bucket-with-parameters.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('only-empty-bucket-with-parameters.json'),
    );
  });

  test('resolves DependsOn with a single String value to the actual L1 class instance', () => {
    const cfnTemplate = includeTestTemplate(stack, 'resource-attribute-depends-on.json');
    const cfnBucket2 = cfnTemplate.getResource('Bucket2');

    expect(cfnBucket2.node.dependencies).toHaveLength(1);
    // we always render dependsOn as an array, even if it's a single string
    expect(stack).toHaveResourceLike('AWS::S3::Bucket', {
      "Properties": {
        "BucketName": "bucket2",
      },
      "DependsOn": [
        "Bucket1",
      ],
    }, ResourcePart.CompleteDefinition);
  });

  test('resolves DependsOn with an array of String values to the actual L1 class instances', () => {
    const cfnTemplate = includeTestTemplate(stack, 'resource-attribute-depends-on-array.json');
    const cfnBucket2 = cfnTemplate.getResource('Bucket2');

    expect(cfnBucket2.node.dependencies).toHaveLength(2);
    expect(stack).toHaveResourceLike('AWS::S3::Bucket', {
      "Properties": {
        "BucketName": "bucket2",
      },
      "DependsOn": [
        "Bucket0",
        "Bucket1",
      ],
    }, ResourcePart.CompleteDefinition);
  });

  test('correctly parses Conditions and the Condition resource attribute', () => {
    const cfnTemplate = includeTestTemplate(stack, 'resource-attribute-condition.json');
    const alwaysFalseCondition = cfnTemplate.getCondition('AlwaysFalseCond');
    const cfnBucket = cfnTemplate.getResource('Bucket');

    expect(cfnBucket.cfnOptions.condition).toBe(alwaysFalseCondition);
    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('resource-attribute-condition.json'),
    );
  });

  test('correctly parses templates with parameters', () => {
    const cfnTemplate = includeTestTemplate(stack, 'bucket-with-parameters.json');
    const param = cfnTemplate.getParameter('BucketName');
    new s3.CfnBucket(stack, 'NewBucket', {
      bucketName: param.valueAsString,
    });

    const originalTemplate = loadTestFileToJsObject('bucket-with-parameters.json');
    expect(stack).toMatchTemplate({
      "Resources": {
        ...originalTemplate.Resources,
        "NewBucket": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Ref": "BucketName",
            },
          },
        },
      },
      "Parameters": {
        ...originalTemplate.Parameters,
      },
    });
  });

  test('getParameter() throws an exception if asked for a Parameter with a name that is not present in the template', () => {
    const cfnTemplate = includeTestTemplate(stack, 'bucket-with-parameters.json');

    expect(() => {
      cfnTemplate.getParameter('FakeBucketNameThatDoesNotExist');
    }).toThrow(/Parameter with name 'FakeBucketNameThatDoesNotExist' was not found in the template/);
  });

  test('reflects changes to a retrieved CfnCondition object in the resulting template', () => {
    const cfnTemplate = includeTestTemplate(stack, 'resource-attribute-condition.json');
    const alwaysFalseCondition = cfnTemplate.getCondition('AlwaysFalseCond');

    alwaysFalseCondition.expression = core.Fn.conditionEquals(1, 2);

    expect(stack).toMatchTemplate({
      "Conditions": {
        "AlwaysFalseCond": {
          "Fn::Equals": [1, 2],
        },
      },
      "Resources": {
        "Bucket": {
          "Type": "AWS::S3::Bucket",
          "Condition": "AlwaysFalseCond",
        },
      },
    });
  });

  test('correctly handles the CreationPolicy resource attribute', () => {
    const cfnTemplate = includeTestTemplate(stack, 'resource-attribute-creation-policy.json');
    const cfnBucket = cfnTemplate.getResource('Bucket');

    expect(cfnBucket.cfnOptions.creationPolicy).toBeDefined();

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('resource-attribute-creation-policy.json'),
    );
  });

  test('correctly handles the UpdatePolicy resource attribute', () => {
    const cfnTemplate = includeTestTemplate(stack, 'resource-attribute-update-policy.json');
    const cfnBucket = cfnTemplate.getResource('Bucket');

    expect(cfnBucket.cfnOptions.updatePolicy).toBeDefined();

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('resource-attribute-update-policy.json'),
    );
  });

  test("correctly handles referencing the ingested template's resources across Stacks", () => {
    // for cross-stack sharing to work, we need an App
    const app = new core.App();
    stack = new core.Stack(app, 'MyStack');
    const cfnTemplate = includeTestTemplate(stack, 'only-empty-bucket.json');
    const cfnBucket = cfnTemplate.getResource('Bucket') as s3.CfnBucket;

    const otherStack = new core.Stack(app, 'OtherStack');
    const role = new iam.Role(otherStack, 'Role', {
      assumedBy: new iam.AnyPrincipal(),
    });
    role.addToPolicy(new iam.PolicyStatement({
      actions: ['s3:*'],
      resources: [cfnBucket.attrArn],
    }));

    expect(stack).toMatchTemplate({
      ...loadTestFileToJsObject('only-empty-bucket.json'),
      "Outputs": {
        "ExportsOutputFnGetAttBucketArn436138FE": {
          "Value": {
            "Fn::GetAtt": ["Bucket", "Arn"],
          },
          "Export": {
            "Name": "MyStack:ExportsOutputFnGetAttBucketArn436138FE",
          },
        },
      },
    });

    expect(otherStack).toHaveResourceLike('AWS::IAM::Policy', {
      "PolicyDocument": {
        "Statement": [
          {
            "Action": "s3:*",
            "Resource": {
              "Fn::ImportValue": "MyStack:ExportsOutputFnGetAttBucketArn436138FE",
            },
          },
        ],
      },
    });
  });

  test('correctly re-names references to resources in the template if their logical IDs have been changed', () => {
    const cfnTemplate = includeTestTemplate(stack, 'bucket-with-encryption-key.json');
    const cfnKey = cfnTemplate.getResource('Key');
    cfnKey.overrideLogicalId('TotallyDifferentKey');

    const originalTemplate = loadTestFileToJsObject('bucket-with-encryption-key.json');
    expect(stack).toMatchTemplate({
      "Resources": {
        "Bucket": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketEncryption": {
              "ServerSideEncryptionConfiguration": [
                {
                  "ServerSideEncryptionByDefault": {
                    "KMSMasterKeyID": {
                      "Fn::GetAtt": ["TotallyDifferentKey", "Arn"],
                    },
                    "SSEAlgorithm": "aws:kms",
                  },
                },
              ],
            },
          },
          "Metadata": {
            "Object1": "Location1",
            "KeyRef": { "Ref": "TotallyDifferentKey" },
            "KeyArn": { "Fn::GetAtt": ["TotallyDifferentKey", "Arn"] },
          },
          "DeletionPolicy": "Retain",
          "UpdateReplacePolicy": "Retain",
        },
        "TotallyDifferentKey": originalTemplate.Resources.Key,
      },
    });
  });

  test("throws an exception when encountering a Resource type it doesn't recognize", () => {
    expect(() => {
      includeTestTemplate(stack, 'non-existent-resource-type.json');
    }).toThrow(/Unrecognized CloudFormation resource type: 'AWS::FakeService::DoesNotExist'/);
  });

  test('can ingest a template that contains outputs and modify them', () => {
    const cfnTemplate = includeTestTemplate(stack, 'outputs-with-references.json');

    const output = cfnTemplate.getOutput('Output1');
    output.value = 'a mutated value';
    output.description = undefined;
    output.exportName = 'an export';
    output.condition = new core.CfnCondition(stack, 'MyCondition', {
      expression: core.Fn.conditionIf('AlwaysFalseCond', core.Aws.NO_VALUE, true),
    });

    const originalTemplate = loadTestFileToJsObject('outputs-with-references.json');

    expect(stack).toMatchTemplate({
      "Conditions": {
        ...originalTemplate.Conditions,
        "MyCondition": {
          "Fn::If": [
            "AlwaysFalseCond",
            { "Ref": "AWS::NoValue" },
            true,
          ],
        },
      },
      "Parameters": {
        ...originalTemplate.Parameters,
      },
      "Resources": {
        ...originalTemplate.Resources,
      },
      "Outputs": {
        "Output1": {
          "Value": "a mutated value",
          "Export": {
            "Name": "an export",
          },
          "Condition": "MyCondition",
        },
        "OutputWithNoCondition": {
          "Value": "some-value",
        },
      },
    });
  });

  test('can ingest a template that contains outputs and get those outputs', () => {
    const cfnTemplate = includeTestTemplate(stack, 'outputs-with-references.json');
    const output = cfnTemplate.getOutput('Output1');

    expect(output.condition).toBe(cfnTemplate.getCondition('AlwaysFalseCond'));
    expect(output.description).toBeDefined();
    expect(output.value).toBeDefined();
    expect(output.exportName).toBeDefined();

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('outputs-with-references.json'),
    );
  });

  test("throws an exception when attempting to retrieve an Output that doesn't exist", () => {
    const cfnTemplate = includeTestTemplate(stack, 'outputs-with-references.json');

    expect(() => {
      cfnTemplate.getOutput('FakeOutput');
    }).toThrow(/Output with logical ID 'FakeOutput' was not found in the template/);
  });

  test("can ingest a template with nested stacks", () => {
    new inc.CfnInclude(stack, 'ParentStack', {
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
        "OneMore": {
          templateFile: _testTemplateFilePath('child-import-stack.json'),
          nestedStacks: {
            "GrandChildStack": {
              templateFile: _testTemplateFilePath('grandchild-import-stack.json'),
            },
          },
        }
      }
    });

    expect(stack).toMatchTemplate({
      "Resources": {
        "ParentStackChildStackChildStackNestedStackChildStackChildStackNestedStackResource073851CB": {
          "Type": "AWS::CloudFormation::Stack",
          "Properties": {
            "TemplateURL": {
              "Fn::Join": [
                "",
                [
                  "https://s3.",
                  {
                    "Ref": "AWS::Region"
                  },
                  ".",
                  {
                    "Ref": "AWS::URLSuffix"
                  },
                  "/",
                  {
                    "Ref": "AssetParameters7a8a8d5c47dae7d76f7bf14a4fc33c2acdf38e476f8645d558fec9f3528b3957S3Bucket5480236A"
                  },
                  "/",
                  {
                    "Fn::Select": [
                      0,
                      {
                        "Fn::Split": [
                          "||",
                          {
                            "Ref": "AssetParameters7a8a8d5c47dae7d76f7bf14a4fc33c2acdf38e476f8645d558fec9f3528b3957S3VersionKey9901D60B"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "Fn::Select": [
                      1,
                      {
                        "Fn::Split": [
                          "||",
                          {
                            "Ref": "AssetParameters7a8a8d5c47dae7d76f7bf14a4fc33c2acdf38e476f8645d558fec9f3528b3957S3VersionKey9901D60B"
                          }
                        ]
                      }
                    ]
                  }
                ]
              ]
            },
            "Parameters": {
              "referencetoAssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3BucketEAA24F0CRef": {
                "Ref": "AssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3BucketEAA24F0C"
              },
              "referencetoAssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3VersionKey1194CAB2Ref": {
                "Ref": "AssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3VersionKey1194CAB2"
              }
            }
          }
        },
        "ParentStackChildStackAnotherChildStackNestedStackChildStackAnotherChildStackNestedStackResource6FDCA9E2": {
          "Type": "AWS::CloudFormation::Stack",
          "Properties": {
            "TemplateURL": {
              "Fn::Join": [
                "",
                [
                  "https://s3.",
                  {
                    "Ref": "AWS::Region"
                  },
                  ".",
                  {
                    "Ref": "AWS::URLSuffix"
                  },
                  "/",
                  {
                    "Ref": "AssetParameters762502734b658dd30024e60aeb85c21fdb9820aff1a5fe1247707eb0201f610aS3Bucket89948AA9"
                  },
                  "/",
                  {
                    "Fn::Select": [
                      0,
                      {
                        "Fn::Split": [
                          "||",
                          {
                            "Ref": "AssetParameters762502734b658dd30024e60aeb85c21fdb9820aff1a5fe1247707eb0201f610aS3VersionKeyB87086DD"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "Fn::Select": [
                      1,
                      {
                        "Fn::Split": [
                          "||",
                          {
                            "Ref": "AssetParameters762502734b658dd30024e60aeb85c21fdb9820aff1a5fe1247707eb0201f610aS3VersionKeyB87086DD"
                          }
                        ]
                      }
                    ]
                  }
                ]
              ]
            },
            "Parameters": {
              "referencetoAssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3BucketEAA24F0CRef": {
                "Ref": "AssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3BucketEAA24F0C"
              },
              "referencetoAssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3VersionKey1194CAB2Ref": {
                "Ref": "AssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3VersionKey1194CAB2"
              }
            }
          }
        },
        "ChildStack": {
          "Type": "AWS::CloudFormation::Stack",
          "Properties": {
            "TemplateURL": "https://cfn-templates-set.s3.amazonaws.com/child-import-stack.json",
            "Parameters": {
              "MyBucketParameter": "some-magic-bucket-name"
            }
          }
        },
        "ParentStackAnotherChildStackChildStackNestedStackAnotherChildStackChildStackNestedStackResourceEA7AD2B1": {
          "Type": "AWS::CloudFormation::Stack",
          "Properties": {
            "TemplateURL": {
              "Fn::Join": [
                "",
                [
                  "https://s3.",
                  {
                    "Ref": "AWS::Region"
                  },
                  ".",
                  {
                    "Ref": "AWS::URLSuffix"
                  },
                  "/",
                  {
                    "Ref": "AssetParameters7a8a8d5c47dae7d76f7bf14a4fc33c2acdf38e476f8645d558fec9f3528b3957S3Bucket5480236A"
                  },
                  "/",
                  {
                    "Fn::Select": [
                      0,
                      {
                        "Fn::Split": [
                          "||",
                          {
                            "Ref": "AssetParameters7a8a8d5c47dae7d76f7bf14a4fc33c2acdf38e476f8645d558fec9f3528b3957S3VersionKey9901D60B"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "Fn::Select": [
                      1,
                      {
                        "Fn::Split": [
                          "||",
                          {
                            "Ref": "AssetParameters7a8a8d5c47dae7d76f7bf14a4fc33c2acdf38e476f8645d558fec9f3528b3957S3VersionKey9901D60B"
                          }
                        ]
                      }
                    ]
                  }
                ]
              ]
            },
            "Parameters": {
              "referencetoAssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3BucketEAA24F0CRef": {
                "Ref": "AssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3BucketEAA24F0C"
              },
              "referencetoAssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3VersionKey1194CAB2Ref": {
                "Ref": "AssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3VersionKey1194CAB2"
              }
            }
          }
        },
        "ParentStackAnotherChildStackAnotherChildStackNestedStackAnotherChildStackAnotherChildStackNestedStackResource117236A1": {
          "Type": "AWS::CloudFormation::Stack",
          "Properties": {
            "TemplateURL": {
              "Fn::Join": [
                "",
                [
                  "https://s3.",
                  {
                    "Ref": "AWS::Region"
                  },
                  ".",
                  {
                    "Ref": "AWS::URLSuffix"
                  },
                  "/",
                  {
                    "Ref": "AssetParameters762502734b658dd30024e60aeb85c21fdb9820aff1a5fe1247707eb0201f610aS3Bucket89948AA9"
                  },
                  "/",
                  {
                    "Fn::Select": [
                      0,
                      {
                        "Fn::Split": [
                          "||",
                          {
                            "Ref": "AssetParameters762502734b658dd30024e60aeb85c21fdb9820aff1a5fe1247707eb0201f610aS3VersionKeyB87086DD"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "Fn::Select": [
                      1,
                      {
                        "Fn::Split": [
                          "||",
                          {
                            "Ref": "AssetParameters762502734b658dd30024e60aeb85c21fdb9820aff1a5fe1247707eb0201f610aS3VersionKeyB87086DD"
                          }
                        ]
                      }
                    ]
                  }
                ]
              ]
            },
            "Parameters": {
              "referencetoAssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3BucketEAA24F0CRef": {
                "Ref": "AssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3BucketEAA24F0C"
              },
              "referencetoAssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3VersionKey1194CAB2Ref": {
                "Ref": "AssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3VersionKey1194CAB2"
              }
            }
          }
        },
        "AnotherChildStack": {
          "Type": "AWS::CloudFormation::Stack",
          "Properties": {
            "TemplateURL": "https://cfn-templates-set.s3.amazonaws.com/child-import-stack.json",
            "Parameters": {
              "MyBucketParameter": "some-magic-bucket-name"
            }
          }
        }
      },
      "Parameters": {
        "AssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3BucketEAA24F0C": {
          "Type": "String",
          "Description": "S3 bucket for asset \"5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50\""
        },
        "AssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50S3VersionKey1194CAB2": {
          "Type": "String",
          "Description": "S3 key for asset version \"5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50\""
        },
        "AssetParameters5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50ArtifactHash9C417847": {
          "Type": "String",
          "Description": "Artifact hash for asset \"5dc7d4a99cfe2979687dc74f2db9fd75f253b5505a1912b5ceecf70c9aefba50\""
        },
        "AssetParameters7a8a8d5c47dae7d76f7bf14a4fc33c2acdf38e476f8645d558fec9f3528b3957S3Bucket5480236A": {
          "Type": "String",
          "Description": "S3 bucket for asset \"7a8a8d5c47dae7d76f7bf14a4fc33c2acdf38e476f8645d558fec9f3528b3957\""
        },
        "AssetParameters7a8a8d5c47dae7d76f7bf14a4fc33c2acdf38e476f8645d558fec9f3528b3957S3VersionKey9901D60B": {
          "Type": "String",
          "Description": "S3 key for asset version \"7a8a8d5c47dae7d76f7bf14a4fc33c2acdf38e476f8645d558fec9f3528b3957\""
        },
        "AssetParameters7a8a8d5c47dae7d76f7bf14a4fc33c2acdf38e476f8645d558fec9f3528b3957ArtifactHashFE4E4A25": {
          "Type": "String",
          "Description": "Artifact hash for asset \"7a8a8d5c47dae7d76f7bf14a4fc33c2acdf38e476f8645d558fec9f3528b3957\""
        },
        "AssetParameters762502734b658dd30024e60aeb85c21fdb9820aff1a5fe1247707eb0201f610aS3Bucket89948AA9": {
          "Type": "String",
          "Description": "S3 bucket for asset \"762502734b658dd30024e60aeb85c21fdb9820aff1a5fe1247707eb0201f610a\""
        },
        "AssetParameters762502734b658dd30024e60aeb85c21fdb9820aff1a5fe1247707eb0201f610aS3VersionKeyB87086DD": {
          "Type": "String",
          "Description": "S3 key for asset version \"762502734b658dd30024e60aeb85c21fdb9820aff1a5fe1247707eb0201f610a\""
        },
        "AssetParameters762502734b658dd30024e60aeb85c21fdb9820aff1a5fe1247707eb0201f610aArtifactHash55B958A4": {
          "Type": "String",
          "Description": "Artifact hash for asset \"762502734b658dd30024e60aeb85c21fdb9820aff1a5fe1247707eb0201f610a\""
        }
      }
    });
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

/*function includeTemplateWithNestedStack(scope: core.Construct, testTemplate: string, _props: IncludeTestTemplateProps = {}): inc.CfnInclude {
  return new inc.CfnInclude(scope, 'MyNestedScope', {
    templateFile: _testTemplateFilePath(testTemplate),
//    nestedStacks: true,
    // preserveLogicalIds: props.preserveLogicalIds,
  });
}*/

function loadTestFileToJsObject(testTemplate: string): any {
  return futils.readJsonSync(_testTemplateFilePath(testTemplate));
}

function _testTemplateFilePath(testTemplate: string) {
  return path.join(__dirname, 'test-templates', testTemplate);
}
