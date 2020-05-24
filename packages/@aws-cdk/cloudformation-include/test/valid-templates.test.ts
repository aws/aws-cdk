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

  test("throws an exception when encountering a Resource type it doesn't recognize", () => {
    expect(() => {
      includeTestTemplate(stack, 'non-existent-resource-type.json');
    }).toThrow(/Unrecognized CloudFormation resource type: 'AWS::FakeService::DoesNotExist'/);
  });

  test("throws an exception when encountering a CFN function it doesn't support", () => {
    expect(() => {
      includeTestTemplate(stack, 'only-codecommit-repo-using-cfn-functions.json');
    }).toThrow(/Unsupported CloudFormation function 'Fn::Base64'/);
  });

  test('throws an exception when encountering the Condition attribute in a resource', () => {
    expect(() => {
      includeTestTemplate(stack, 'resource-attribute-condition.json');
    }).toThrow(/The Condition resource attribute is not supported by cloudformation-include yet/);
  });

  test('throws an exception when encountering the CreationPolicy attribute in a resource', () => {
    expect(() => {
      includeTestTemplate(stack, 'resource-attribute-creation-policy.json');
    }).toThrow(/The CreationPolicy resource attribute is not supported by cloudformation-include yet/);
  });

  test('throws an exception when encountering the UpdatePolicy attribute in a resource', () => {
    expect(() => {
      includeTestTemplate(stack, 'resource-attribute-update-policy.json');
    }).toThrow(/The UpdatePolicy resource attribute is not supported by cloudformation-include yet/);
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
  return futils.readJsonSync(_testTemplateFilePath(testTemplate));
}

function _testTemplateFilePath(testTemplate: string) {
  return path.join(__dirname, 'test-templates', testTemplate);
}
