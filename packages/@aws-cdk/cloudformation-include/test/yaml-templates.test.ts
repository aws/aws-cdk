import * as path from 'path';
import '@aws-cdk/assert/jest';
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

  test('can ingest a template with all long-form CloudFormation functions and output it unchanged', () => {
    includeTestTemplate(stack, 'long-form-vpc.yaml');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('long-form-vpc.yaml'),
    );
  });

  test('can ingest a template with year-month-date parsed as string instead of Date', () => {
    includeTestTemplate(stack, 'year-month-date-as-strings.yaml');

    expect(stack).toMatchTemplate({
      "AWSTemplateFormatVersion": "2010-09-09",
      "Resources": {
        "Role": {
          "Type": "AWS::IAM::Role",
          "Properties": {
            "AssumeRolePolicyDocument": {
              "Version": "2012-10-17",
              "Statement": [
                {
                  "Effect": "Allow",
                  "Principal": {
                    "Service": ["ec2.amazonaws.com"],
                  },
                  "Action": ["sts:AssumeRole"],
                },
              ],
            },
          },
        },
      },
    });
  });

  test('can ingest a template with the short form Base64 function', () => {
    includeTestTemplate(stack, 'short-form-base64.yaml');

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

  test('can ingest a template with the short form !Cidr function', () => {
    includeTestTemplate(stack, 'short-form-cidr.yaml');

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

  test('can ingest a template with the short form !FindInMap function, in both hyphen and bracket notation', () => {
    includeTestTemplate(stack, 'short-form-find-in-map.yaml');

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
        "Bucket1": {
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
        "Bucket2": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::FindInMap": [
                "RegionMap",
                "region-1",
                "HVMG2",
              ],
            },
          },
        },
      },
    });
  });

  test('can ingest a template with the short form !GetAtt function', () => {
    includeTestTemplate(stack, 'short-form-get-att.yaml');

    expect(stack).toMatchTemplate({
      "Resources": {
        "ELB": {
          "Type": "AWS::ElasticLoadBalancing::LoadBalancer",
          "Properties": {
            "AvailabilityZones": [
              "us-east-1a",
            ],
            "Listeners": [
              {
                "LoadBalancerPort": "80",
                "InstancePort": "80",
                "Protocol": "HTTP",
              },
            ],
          },
        },
        "Bucket0": {
          "Type": "AWS::S3::Bucket",
          "Properties": { "BucketName": "some-bucket" },
        },
        "Bucket1": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": { "Fn::GetAtt": "Bucket0.Arn" },
            "AccessControl": { "Fn::GetAtt": ["ELB", "SourceSecurityGroup.GroupName"] },
          },
        },
        "Bucket2": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": { "Fn::GetAtt": ["Bucket1", "Arn"] },
            "AccessControl": { "Fn::GetAtt": "ELB.SourceSecurityGroup.GroupName" },
          },
        },
      },
    });
  });

  test('can ingest a template with short form Select, GetAZs, and Ref functions', () => {
    includeTestTemplate(stack, 'short-form-select.yaml');

    expect(stack).toMatchTemplate({
      "Resources": {
        "Subnet1": {
          "Type": "AWS::EC2::Subnet",
          "Properties": {
            "VpcId": {
              "Fn::Select": [0, { "Fn::GetAZs": "" }],
            },
            "CidrBlock": "10.0.0.0/24",
            "AvailabilityZone": {
              "Fn::Select": ["0", { "Fn::GetAZs": "eu-west-2" }],
            },
          },
        },
        "Subnet2": {
          "Type": "AWS::EC2::Subnet",
          "Properties": {
            "VpcId": {
              "Ref": "Subnet1",
            },
            "CidrBlock": "10.0.0.0/24",
            "AvailabilityZone": {
              "Fn::Select": [0, { "Fn::GetAZs": "eu-west-2" }],
            },
          },
        },
      },
    });
  });

  test('can ingest a template with the short form !ImportValue function', () => {
    includeTestTemplate(stack, 'short-form-import-value.yaml');

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

  test('can ingest a template with the short form !Join function', () => {
    includeTestTemplate(stack, 'short-form-join.yaml');

    expect(stack).toMatchTemplate({
      "Resources": {
        "Bucket": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::Join": [' ', [
                "NamePart1 ",
                { "Fn::ImportValue": "SomeSharedValue" },
              ]],
            },
          },
        },
      },
    });
  });

  test('can ingest a template with the short form !Split function that uses both brackets and hyphens', () => {
    includeTestTemplate(stack, 'short-form-split.yaml');

    expect(stack).toMatchTemplate({
      "Resources": {
        "Bucket1": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::Split": [' ', {
                "Fn::ImportValue": "SomeSharedBucketName",
              }],
            },
          },
        },
        "Bucket2": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::Split": [' ', {
                "Fn::ImportValue": "SomeSharedBucketName",
              }],
            },
          },
        },
      },
    });
  });

  test('can ingest a template with the short form !Transform function', () => {
    // Note that this yaml template fails validation. It is unclear how to invoke !Transform.
    includeTestTemplate(stack, 'invalid/short-form-transform.yaml');

    expect(stack).toMatchTemplate({
      "Resources": {
        "Bucket": {
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
          "Fn::And": [
            {
              "Fn::Not": [
                { "Fn::Equals": [{ "Ref": "AWS::Region" }, "completely-made-up-region"] },
              ],
            },
            {
              "Fn::Or": [
                { "Fn::Equals": [{ "Ref": "AWS::Region" }, "completely-made-up-region"] },
                { "Fn::Equals": [{ "Ref": "AWS::Region" }, "completely-made-up-region"] },
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
                { "Ref": "AWS::NoValue" },
              ],
            },
          },
        },
      },
    });
  });

  test('can ingest a template with the short form Conditions', () => {
    includeTestTemplate(stack, 'short-form-conditions.yaml');

    expect(stack).toMatchTemplate({
      "Conditions": {
        "AlwaysTrueCond": {
          "Fn::Not": [
            { "Fn::Equals": [{ "Ref": "AWS::Region" }, "completely-made-up-region1"] },
          ],
        },
        "AnotherAlwaysTrueCond": {
          "Fn::Not": [
            { "Fn::Equals": [{ "Ref": "AWS::Region" }, "completely-made-up-region2"] },
          ],
        },
        "ThirdAlwaysTrueCond": {
          "Fn::Not": [
            { "Fn::Equals": [{ "Ref": "AWS::Region" }, "completely-made-up-region3"] },
          ],
        },
        "CombinedCond": {
          "Fn::Or": [
            { "Condition": "AlwaysTrueCond" },
            { "Condition": "AnotherAlwaysTrueCond" },
            { "Condition": "ThirdAlwaysTrueCond" },
          ],
        },
      },
      "Resources": {
        "Bucket": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::If": [
                "CombinedCond",
                "MyBucketName",
                { "Ref": "AWS::NoValue" },
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

  test('can ingest a YAML tempalte with Fn::Sub in string form and output it unchanged', () => {
    includeTestTemplate(stack, 'short-form-fnsub-string.yaml');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('short-form-fnsub-string.yaml'),
    );
  });

  test('can ingest a YAML tmeplate with Fn::Sub in map form and output it unchanged', () => {
    includeTestTemplate(stack, 'short-form-sub-map.yaml');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('short-form-sub-map.yaml'),
    );
  });

  test('the parser throws an error on a YAML tmeplate with short form import value that uses short form sub', () => {
    expect(() => {
      includeTestTemplate(stack, 'invalid/short-form-import-sub.yaml');
    }).toThrow(/A node can have at most one tag/);
  });
});

function includeTestTemplate(scope: constructs.Construct, testTemplate: string): inc.CfnInclude {
  return new inc.CfnInclude(scope, 'MyScope', {
    templateFile: _testTemplateFilePath(testTemplate),
  });
}

function loadTestFileToJsObject(testTemplate: string): any {
  return futils.readYamlSync(_testTemplateFilePath(testTemplate));
}

function _testTemplateFilePath(testTemplate: string) {
  return path.join(__dirname, 'test-templates/yaml', testTemplate);
}
