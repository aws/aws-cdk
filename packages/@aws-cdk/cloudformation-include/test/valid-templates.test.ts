import * as path from 'path';
import { ResourcePart } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as ssm from '@aws-cdk/aws-ssm';
import * as core from '@aws-cdk/core';
import * as constructs from 'constructs';
import * as inc from '../lib';
import * as futils from '../lib/file-utils';

/* eslint-disable quote-props */
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

  test('accepts strings for properties with type number', () => {
    includeTestTemplate(stack, 'string-for-number.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('string-for-number.json'),
    );
  });

  test('accepts numbers for properties with type string', () => {
    includeTestTemplate(stack, 'number-for-string.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('number-for-string.json'),
    );
  });

  test('correctly changes the logical IDs, including references, if imported with preserveLogicalIds=false', () => {
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
          "Metadata": {
            "Object1": "Location1",
            "KeyRef": { "Ref": "MyScopeKey7673692F" },
            "KeyArn": { "Fn::GetAtt": ["MyScopeKey7673692F", "Arn"] },
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

  test('can ingest a UserData script, and output it unchanged', () => {
    includeTestTemplate(stack, 'user-data.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('user-data.json'),
    );
  });

  test('can correctly ingest a resource with a property of type: Map of Lists of primitive types', () => {
    const cfnTemplate = includeTestTemplate(stack, 'ssm-association.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('ssm-association.json'),
    );
    const association = cfnTemplate.getResource('Association') as ssm.CfnAssociation;
    expect(Object.keys(association.parameters as any)).toHaveLength(2);
  });

  test('can ingest a template with intrinsic functions and conditions, and output it unchanged', () => {
    includeTestTemplate(stack, 'functions-and-conditions.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('functions-and-conditions.json'),
    );
  });

  test('can ingest a JSON template with string-form Fn::GetAtt, and output it unchanged', () => {
    includeTestTemplate(stack, 'get-att-string-form.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('get-att-string-form.json'),
    );
  });

  test('can ingest a template with Fn::Sub in string form with escaped and unescaped references and output it unchanged', () => {
    includeTestTemplate(stack, 'fn-sub-string.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('fn-sub-string.json'),
    );
  });

  test('can parse the string argument Fn::Sub with escaped references that contain whitespace', () => {
    includeTestTemplate(stack, 'fn-sub-escaping.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('fn-sub-escaping.json'),
    );
  });

  test('can ingest a template with Fn::Sub in map form and output it unchanged', () => {
    includeTestTemplate(stack, 'fn-sub-map-dotted-attributes.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('fn-sub-map-dotted-attributes.json'),
    );
  });

  test('can ingest a template with Fn::Sub shadowing a logical ID from the template and output it unchanged', () => {
    includeTestTemplate(stack, 'fn-sub-shadow.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('fn-sub-shadow.json'),
    );
  });

  test('can ingest a template with Fn::Sub attribute expression shadowing a logical ID from the template, and output it unchanged', () => {
    includeTestTemplate(stack, 'fn-sub-shadow-attribute.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('fn-sub-shadow-attribute.json'),
    );
  });

  test('can modify resources used in Fn::Sub in map form references and see the changes in the template', () => {
    const cfnTemplate = includeTestTemplate(stack, 'fn-sub-shadow.json');

    cfnTemplate.getResource('AnotherBucket').overrideLogicalId('NewBucket');

    expect(stack).toHaveResourceLike('AWS::S3::Bucket', {
      "BucketName": {
        "Fn::Sub": [
          "${AnotherBucket}",
          {
            "AnotherBucket": { "Ref": "NewBucket" },
          },
        ],
      },
    });
  });

  test('can modify resources used in Fn::Sub in string form and see the changes in the template', () => {
    const cfnTemplate = includeTestTemplate(stack, 'fn-sub-override.json');

    cfnTemplate.getResource('Bucket').overrideLogicalId('NewBucket');

    expect(stack).toHaveResourceLike('AWS::S3::Bucket', {
      "BucketName": {
        "Fn::Sub": "${NewBucket}-${!Bucket}-${NewBucket.DomainName}",
      },
    });
  });

  test('can ingest a template with Fn::Sub with brace edge cases and output it unchanged', () => {
    includeTestTemplate(stack, 'fn-sub-brace-edges.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('fn-sub-brace-edges.json'),
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

  test('allows Conditions to reference Mappings', () => {
    includeTestTemplate(stack, 'condition-using-mapping.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('condition-using-mapping.json'),
    );
  });

  test('correctly change references to Conditions when renaming them', () => {
    const cfnTemplate = includeTestTemplate(stack, 'condition-same-name-as-resource.json');
    const alwaysFalse = cfnTemplate.getCondition('AlwaysFalse');
    alwaysFalse.overrideLogicalId('TotallyFalse');

    expect(stack).toMatchTemplate({
      "Parameters": {
        "Param": {
          "Type": "String",
        },
      },
      "Conditions": {
        "AlwaysTrue": {
          "Fn::Not": [{ "Condition": "TotallyFalse" }],
        },
        "TotallyFalse": {
          "Fn::Equals": [{ "Ref": "Param" }, 2],
        },
      },
      "Resources": {
        "AlwaysTrue": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::If": ["TotallyFalse",
                { "Ref": "Param" },
                { "Ref": "AWS::NoValue" }],
            },
          },
        },
      },
    });
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

  test('reflects changes to a retrieved CfnParameter object in the resulting template', () => {
    const cfnTemplate = includeTestTemplate(stack, 'bucket-with-parameters.json');
    const stringParam = cfnTemplate.getParameter('BucketName');
    const numberParam = cfnTemplate.getParameter('CorsMaxAge');

    stringParam.default = 'MyDefault';
    stringParam.allowedPattern = '[0-9]*$';
    stringParam.allowedValues = ['123123', '456789'];
    stringParam.constraintDescription = 'MyNewConstraint';
    stringParam.description = 'a string of numeric characters';
    stringParam.maxLength = 6;
    stringParam.minLength = 2;

    numberParam.maxValue = 100;
    numberParam.minValue = 4;
    numberParam.noEcho = false;
    numberParam.type = "NewType";
    const originalTemplate = loadTestFileToJsObject('bucket-with-parameters.json');

    expect(stack).toMatchTemplate({
      "Resources": {
        ...originalTemplate.Resources,
      },
      "Parameters": {
        ...originalTemplate.Parameters,
        "BucketName": {
          ...originalTemplate.Parameters.BucketName,
          "Default": "MyDefault",
          "AllowedPattern": "[0-9]*$",
          "AllowedValues": ["123123", "456789"],
          "ConstraintDescription": "MyNewConstraint",
          "Description": "a string of numeric characters",
          "MaxLength": 6,
          "MinLength": 2,
        },
        "CorsMaxAge": {
          ...originalTemplate.Parameters.CorsMaxAge,
          "MaxValue": 100,
          "MinValue": 4,
          "NoEcho": false,
          "Type": "NewType",
        },
      },
    });
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

  test('can include a template with a custom resource that uses attributes', () => {
    const cfnTemplate = includeTestTemplate(stack, 'custom-resource-with-attributes.json');
    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('custom-resource-with-attributes.json'),
    );

    const alwaysFalseCondition = cfnTemplate.getCondition('AlwaysFalseCond');
    expect(cfnTemplate.getResource('CustomBucket').cfnOptions.condition).toBe(alwaysFalseCondition);
  });

  test("throws an exception when a custom resource uses a Condition attribute that doesn't exist in the template", () => {
    expect(() => {
      includeTestTemplate(stack, 'custom-resource-with-bad-condition.json');
    }).toThrow(/Resource 'CustomResource' uses Condition 'AlwaysFalseCond' that doesn't exist/);
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

  test('can ingest a template that contains Mappings, and retrieve those Mappings', () => {
    const cfnTemplate = includeTestTemplate(stack, 'only-mapping-and-bucket.json');
    const someMapping = cfnTemplate.getMapping('SomeMapping');

    someMapping.setValue('region', 'key2', 'value2');

    expect(stack).toMatchTemplate({
      "Mappings": {
        "SomeMapping": {
          "region": {
            "key1": "value1",
            "key2": "value2",
          },
        },
      },
      "Resources": {
        "Bucket": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::FindInMap": [
                "SomeMapping",
                { "Ref": "AWS::Region" },
                "key1",
              ],
            },
          },
        },
      },
    });
  });

  test("throws an exception when attempting to retrieve a Mapping that doesn't exist in the template", () => {
    const cfnTemplate = includeTestTemplate(stack, 'only-mapping-and-bucket.json');

    expect(() => {
      cfnTemplate.getMapping('NonExistentMapping');
    }).toThrow(/Mapping with name 'NonExistentMapping' was not found in the template/);
  });

  test('handles renaming Mapping references', () => {
    const cfnTemplate = includeTestTemplate(stack, 'only-mapping-and-bucket.json');
    const someMapping = cfnTemplate.getMapping('SomeMapping');

    someMapping.overrideLogicalId('DifferentMapping');

    expect(stack).toMatchTemplate({
      "Mappings": {
        "DifferentMapping": {
          "region": {
            "key1": "value1",
          },
        },
      },
      "Resources": {
        "Bucket": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::FindInMap": [
                "DifferentMapping",
                { "Ref": "AWS::Region" },
                "key1",
              ],
            },
          },
        },
      },
    });
  });

  test('can ingest a template that uses Fn::FindInMap for the value of a boolean property', () => {
    includeTestTemplate(stack, 'find-in-map-for-boolean-property.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('find-in-map-for-boolean-property.json'),
    );
  });

  test('can ingest a template that contains Rules, and allows retrieving those Rules', () => {
    const cfnTemplate = includeTestTemplate(stack, 'only-parameters-and-rule.json');
    const rule = cfnTemplate.getRule('TestVpcRule');

    expect(rule).toBeDefined();

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('only-parameters-and-rule.json'),
    );
  });

  test('fails when trying to replace Parameters referenced in Fn::ValueOf expressions with user-provided values', () => {
    expect(() => {
      includeTestTemplate(stack, 'only-parameters-and-rule.json', {
        parameters: {
          'Subnets': ['subnet-1234abcd'],
        },
      });
    }).toThrow(/Cannot substitute parameter 'Subnets' used in Fn::ValueOf expression with attribute 'VpcId'/);
  });

  test("throws an exception when attempting to retrieve a Rule that doesn't exist in the template", () => {
    const cfnTemplate = includeTestTemplate(stack, 'only-parameters-and-rule.json');

    expect(() => {
      cfnTemplate.getRule('DoesNotExist');
    }).toThrow(/Rule with name 'DoesNotExist' was not found in the template/);
  });

  test('can ingest a template that contains Hooks, and allows retrieving those Hooks', () => {
    const cfnTemplate = includeTestTemplate(stack, 'hook-code-deploy-blue-green-ecs.json');
    const hook = cfnTemplate.getHook('EcsBlueGreenCodeDeployHook');

    expect(hook).toBeDefined();
    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('hook-code-deploy-blue-green-ecs.json'),
    );
  });

  test("throws an exception when attempting to retrieve a Hook that doesn't exist in the template", () => {
    const cfnTemplate = includeTestTemplate(stack, 'hook-code-deploy-blue-green-ecs.json');

    expect(() => {
      cfnTemplate.getHook('DoesNotExist');
    }).toThrow(/Hook with logical ID 'DoesNotExist' was not found in the template/);
  });

  test('replaces references to parameters with the user-specified values in Resources, Conditions, Metadata, and Options sections', () => {
    includeTestTemplate(stack, 'parameter-references.json', {
      parameters: {
        'MyParam': 'my-s3-bucket',
      },
    });

    expect(stack).toMatchTemplate({
      "Transform": {
        "Name": "AWS::Include",
        "Parameters": {
          "Location": "my-s3-bucket",
        },
      },
      "Metadata": {
        "Field": {
          "Fn::If": [
            "AlwaysFalse",
            "AWS::NoValue",
            "my-s3-bucket",
          ],
        },
      },
      "Conditions": {
        "AlwaysFalse": {
          "Fn::Equals": ["my-s3-bucket", "Invalid?BucketName"],
        },
      },
      "Resources": {
        "Bucket": {
          "Type": "AWS::S3::Bucket",
          "Metadata": {
            "Field": "my-s3-bucket",
          },
          "Properties": {
            "BucketName": "my-s3-bucket",
          },
        },
      },
      "Outputs": {
        "MyOutput": {
          "Value": "my-s3-bucket",
        },
      },
    });
  });

  test('replaces parameters with falsey values in Ref expressions', () => {
    includeTestTemplate(stack, 'resource-attribute-creation-policy.json', {
      parameters: {
        'CountParameter': 0,
      },
    });

    expect(stack).toMatchTemplate({
      "Resources": {
        "Bucket": {
          "Type": "AWS::S3::Bucket",
          "CreationPolicy": {
            "AutoScalingCreationPolicy": {
              "MinSuccessfulInstancesPercent": 50,
            },
            "ResourceSignal": {
              "Count": 0,
              "Timeout": "PT5H4M3S",
            },
          },
        },
      },
    });
  });

  test('replaces parameters in Fn::Sub expressions', () => {
    includeTestTemplate(stack, 'fn-sub-parameters.json', {
      parameters: {
        'MyParam': 'my-s3-bucket',
      },
    });

    expect(stack).toMatchTemplate({
      "Resources": {
        "Bucket": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::Sub": "my-s3-bucket",
            },
          },
        },
      },
    });
  });

  test('does not modify Fn::Sub variables shadowing a replaced parameter', () => {
    includeTestTemplate(stack, 'fn-sub-shadow-parameter.json', {
      parameters: {
        'MyParam': 'MyValue',
      },
    });

    expect(stack).toMatchTemplate({
      "Resources": {
        "Bucket": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::Sub": [
                "${MyParam}",
                {
                  "MyParam": "MyValue",
                },
              ],
            },
          },
        },
      },
    });
  });

  test('replaces parameters with falsey values in Fn::Sub expressions', () => {
    includeTestTemplate(stack, 'fn-sub-parameters.json', {
      parameters: {
        'MyParam': '',
      },
    });

    expect(stack).toMatchTemplate({
      "Resources": {
        "Bucket": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": { "Fn::Sub": "" },
          },
        },
      },
    });
  });

  test('throws an exception when parameters are passed a resource name', () => {
    expect(() => {
      includeTestTemplate(stack, 'bucket-with-parameters.json', {
        parameters: {
          'Bucket': 'noChange',
        },
      });
    }).toThrow(/Parameter with logical ID 'Bucket' was not found in the template/);
  });

  test('throws an exception when provided a parameter to replace that is not in the template with parameters', () => {
    expect(() => {
      includeTestTemplate(stack, 'bucket-with-parameters.json', {
        parameters: {
          'FakeParameter': 'DoesNotExist',
        },
      });
    }).toThrow(/Parameter with logical ID 'FakeParameter' was not found in the template/);
  });

  test('throws an exception when provided a parameter to replace in a template with no parameters', () => {
    expect(() => {
      includeTestTemplate(stack, 'only-empty-bucket.json', {
        parameters: {
          'FakeParameter': 'DoesNotExist',
        },
      });
    }).toThrow(/Parameter with logical ID 'FakeParameter' was not found in the template/);
  });

  test('can ingest a template that contains properties not in the current CFN spec, and output it unchanged', () => {
    includeTestTemplate(stack, 'properties-not-in-cfn-spec.json');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('properties-not-in-cfn-spec.json'),
    );
  });
});

interface IncludeTestTemplateProps {
  /** @default true */
  readonly preserveLogicalIds?: boolean;

  /** @default {} */
  readonly parameters?: { [parameterName: string]: any }
}

function includeTestTemplate(scope: constructs.Construct, testTemplate: string, props: IncludeTestTemplateProps = {}): inc.CfnInclude {
  return new inc.CfnInclude(scope, 'MyScope', {
    templateFile: _testTemplateFilePath(testTemplate),
    parameters: props.parameters,
    preserveLogicalIds: props.preserveLogicalIds,
  });
}

function loadTestFileToJsObject(testTemplate: string): any {
  return futils.readJsonSync(_testTemplateFilePath(testTemplate));
}

function _testTemplateFilePath(testTemplate: string) {
  return path.join(__dirname, 'test-templates', testTemplate);
}
