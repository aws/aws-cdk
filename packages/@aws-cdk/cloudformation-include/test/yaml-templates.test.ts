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

  test('can ingest a template with all long-form CloudFormation functions and output it unchanged', () => {
    includeTestTemplate(stack, 'long-form-vpc.yaml');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('long-form-vpc.yaml'),
    );
  });

  test('can ingest a template with the short form !Base64', () => {
    includeTestTemplate(stack, 'short-base64.yaml');

    expect(stack).toMatchTemplate({
      "Resources": {
        "Base64Bucket": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::Base64": "NonBase64BucketName",
            },
          },
        },
      },
    });
  });

  test('can ingest a template with the short form !Cidr', () => {
    includeTestTemplate(stack, 'short-cidr.yaml');

    expect(stack).toMatchTemplate({
      "Resources": {
        "CidrVpc1": {
          "Type": "AWS::EC2::VPC",
          "Properties": {
            "CidrBlock": {
              "Fn::Cidr": [
                "192.168.1.1/24",
                2,
                5,
              ],
            },
          },
        },
        "CidrVpc2": {
          "Type": "AWS::EC2::VPC",
          "Properties": {
            "CidrBlock": {
              "Fn::Cidr": [
                "192.168.1.1/24",
                "2",
                "5",
              ],
            },
          },
        },
      },
    });
  });

  test('can ingest a template with the short form !FindInMap', () => {
    includeTestTemplate(stack, 'short-find-in-map.yaml');

    expect(stack).toMatchTemplate({
      "Mappings": {
        "RegionMap": {
          "region-1": {
            "HVM64": "name1",
            "HVMG2": "name2",
          },
        },
      },
      "Resources": {
        "Bucket": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::FindInMap": [
                "RegionMap",
                "region-1",
                "HVM64",
              ],
            },
          },
        },
      },
    });
  });

  test('can ingest a template with the short form !GetAtt', () => {
    includeTestTemplate(stack, 'short-get-att.yaml');

    expect(stack).toMatchTemplate({
      "Resources": {
        "Bucket1": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": "SomeBucketName",
            "ReplicationConfiguration": {
              "Role": "some-role",
              "Rules": [
                {
                  "Destination": {
                    "Bucket": "Bucket1",
                    "StorageClass": "STANDARD",
                  },
                  "Status": "Enabled",
                },
              ],
            },
          },
        },
        "Bucket2": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::GetAtt": [
                "Bucket1",
                "BucketName",
              ],
            },
          },
        },
        "Bucket3": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::GetAtt": [
                "Bucket1",
                "BucketName",
              ],
            },
          },
        },
        "Bucket4": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::GetAtt": [
                "Bucket1",
                "Rules.Destination",
              ],
            },
          },
        },
        "Bucket5": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::GetAtt": [
                "Bucket1",
                "Rules.Destination",
              ],
            },
          },
        },
      },
    });
  });

  test('can ingest a template with the short form !Select, !GetAZs, and !Ref', () => {
    includeTestTemplate(stack, 'short-select.yaml');

    expect(stack).toMatchTemplate({
      "Resources": {
        "Subnet1": {
          "Type": "AWS::EC2::Subnet",
          "Properties": {
            "VpcId": {
              "Fn::Select": [
                0,
                {
                  "Fn::GetAZs": "",
                },
              ],
            },
            "CidrBlock": "10.0.0.0/24",
            "AvailabilityZone": {
              "Fn::Select": [
                "0",
                {
                  "Fn::GetAZs": "eu-west-2",
                },
              ],
            },
          },
        },
        "Subnet2": {
          "Type": "AWS::EC2::Subnet",
          "Properties": {
            "VpcId": {
              "Fn::Select": [
                "0",
                {
                  "Fn::GetAZs": "",
                },
              ],
            },
            "CidrBlock": "10.0.0.0/24",
            "AvailabilityZone": {
              "Fn::Select": [
                0,
                {
                  "Fn::GetAZs": "eu-west-2",
                },
              ],
            },
          },
        },
        "Bucket": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Ref": "Subnet2",
            },
          },
        },
      },
    });
  });

  test('can ingest a template with the short form !ImportValue', () => {
    includeTestTemplate(stack, 'short-import-value.yaml');

    expect(stack).toMatchTemplate({
      "Resources": {
        "Bucket1": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::ImportValue": "SomeSharedValue",
            },
          },
        },
      },
    });
  });

  test('can ingest a template with the short form !Join', () => {
    includeTestTemplate(stack, 'short-join.yaml');

    expect(stack).toMatchTemplate({
      "Resources": {
        "Bucket": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::Join": [
                ' ',
                [
                  "NamePart1 ",
                  {
                    "Fn::ImportValue": "SomeSharedValue",
                  },
                ],
              ],
            },
          },
        },
      },
    });
  });

  test('can ingest a template with the short form !Split', () => {
    includeTestTemplate(stack, 'short-split.yaml');

    expect(stack).toMatchTemplate({
      "Resources": {
        "Bucket": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::Split": [
                ' ',
                {
                  "Fn::ImportValue": "SomeSharedBucketName",
                },
              ],
            },
          },
        },
      },
    });
  });

  test('can ingest a template with the short form !Transform', () => {
    includeTestTemplate(stack, 'short-transform.yaml');

    expect(stack).toMatchTemplate({
      "Resources": {
        "Bucket1": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::Transform": {
                "Name": "SomeMacroName",
                "Parameters": {
                  "key1": "value1",
                  "key2": "value2",
                },
              },
            },
          },
        },
      },
    });
  });

  test('can ingest a template with the short form conditionals', () => {
    includeTestTemplate(stack, 'short-form-conditionals.yaml');

    expect(stack).toMatchTemplate({

      "Conditions": {
        "AlwaysTrueCond": {
          "Fn::Not": [
            {
              "Fn::Equals": [
                {
                  "Ref": "AWS::Region",
                },
                "completely-made-up-region",
              ],
            },
          ],
        },
        "AndCond": {
          "Fn::And": [
            {
              "Condition": "AlwaysTrueCond",
            },
            {
              "Fn::Or": [
                {
                  "Condition": "AlwaysTrueCond",
                },
                {
                  "Condition": "AlwaysTrueCond",
                },
              ],
            },
          ],
        },
      },
      "Resources": {
        "Bucket": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::If": [
                "AlwaysTrueCond",
                "MyBucketName",
                "Unreachable",
              ],
            },
          },
        },
      },
    });
  });

  test('can ingest a yaml with long-form functions and output it unchanged', () => {
    includeTestTemplate(stack, 'long-form-subnet.yaml');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('long-form-subnet.yaml'),
    );
  });
});

function includeTestTemplate(scope: core.Construct, testTemplate: string): inc.CfnInclude {
  return new inc.CfnInclude(scope, 'MyScope', {
    templateFile: _testTemplateFilePath(testTemplate),
  });
}

function loadTestFileToJsObject(testTemplate: string): any {
  return futils.readYamlSync(_testTemplateFilePath(testTemplate), futils.shortForms);
}

function _testTemplateFilePath(testTemplate: string) {
  return path.join(__dirname, 'test-templates/yaml', testTemplate);
}
