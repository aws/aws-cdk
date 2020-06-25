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

  test('can ingest a template with all long cfn functions except Fn::Sub, Fn::GetAtt, and Fn::Join, and output it unchanged', () => {
    includeTestTemplate(stack, 'long-form-functions.yaml');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('long-form-functions.yaml'),
    );
  });

  test('can ingest a template with long form Fn::Join and Fn::GetAtt, and output it unchanged', () => {
    includeTestTemplate(stack, 'long-form-sample.yaml');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('long-form-sample.yaml'),
    );
  });

  test('can ingest a yaml template with all short form functions except !GetAtt and !Join and !Sub', () => {
    includeTestTemplate(stack, 'short-form-functions.yaml');

    expect(stack).toMatchTemplate({
      "Mappings": {
        "RegionMap": {
          "region-1": {
            "HVM64": "name1",
            "HVMG2": "name2",
          },
        },
      },
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
        "Vpc": {
          "Type": "AWS::EC2::VPC",
          "Properties": {
            "CidrBlock": {
              "Fn::If": [
                "AlwaysTrueCond",
                {
                  "Fn::Cidr": [
                    "192.168.1.1/24",
                    2,
                    5,
                  ],
                },
                {
                  "Fn::Cidr": [
                    "10.0.0.0/24",
                    "6",
                    "5",
                  ],
                },
              ],
            },
          },
        },
        "Bucket": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::If": [
                "AndCond",
                {
                  "Fn::FindInMap": [
                    "RegionMap",
                    "region-1",
                    "HVM64",
                  ],
                },
                "Unreachable",
              ],
            },
          },
        },
        "Subnet1": {
          "Type": "AWS::EC2::Subnet",
          "Properties": {
            "VpcId": {
              "Fn::If": [
                "AlwaysTrueCond",
                {
                  "Fn::Split": [
                    ",",
                    {
                      "Fn::ImportValue": "ImportedVpcId",
                    },
                  ],
                },
                "Unreachable",
              ],
            },
            "CidrBlock": "10.0.0.0/24",
            "AvailabilityZone": {
              "Fn::Select": [
                "0",
                {
                  "Fn::GetAZs": "",
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
                0,
                {
                  "Fn::Cidr": [
                    "10.0.0.0/24",
                    5,
                    2,
                  ],
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
        "TransformBucket": {
          "Type": "AWS::S3::Bucket",
          "Properties": {
            "BucketName": {
              "Fn::If": [
                "AndCond",
                {
                  "Fn::Transform": {
                    "Name": "AWS::Include",
                    "Parameters": {
                      "Location": "location",
                      "AnotherParameter": {
                        "Fn::Base64": "AnotherValue",
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    });
  });

  test('can ingest a yaml template with short form !GetAtt and !Join', () => {
    includeTestTemplate(stack, 'short-form-sample.yaml');

    expect(stack).toMatchTemplate({
      "Resources": {
        "RecordServiceS3Bucket2": {
          "Type": "AWS::S3::Bucket",
          "DeletionPolicy": "Retain",
          "Properties": {
            "ReplicationConfiguration": {
              "Role": {
                "Fn::GetAtt": [
                  "WorkItemBucketBackupRole",
                  {
                    "Ref": 'AWS::Region',
                  },
                ],
              },
              "Rules": [{
                "Destination": {
                  "Bucket": {
                    "Fn::Join": [ "", [
                      "arn:aws:s3:::", {
                        "Fn::Join": [ "-", [
                          { "Ref": "AWS::Region" },
                          { "Ref": "AWS::StackName" },
                          "replicationbucket",
                        ]],
                      },
                    ]],
                  },
                  "StorageClass": "STANDARD",
                },
                "Id": "Backup",
                "Prefix": "",
                "Status": "Enabled",
              }],
            },
            "VersioningConfiguration": {
              "Status": "Enabled",
            },
          },
        },
        "RecordServiceS3Bucket": {
          "Type": "AWS::S3::Bucket",
          "DeletionPolicy": "Retain",
          "Properties": {
            "ReplicationConfiguration": {
              "Role": {
                "Fn::GetAtt": [
                  "WorkItemBucketBackupRole",
                  {
                    "Ref": 'AWS::Region',
                  },
                ],
              },
              "Rules": [{
                "Destination": {
                  "Bucket": {
                    "Fn::Join": ["", [
                      "arn:aws:s3:::", {
                        "Fn::Join": ["-", [
                          { "Ref": "AWS::Region" },
                          { "Ref": "AWS::StackName" },
                          "replicationbucket",
                        ]],
                      },
                    ]],
                  },
                  "StorageClass": "STANDARD",
                },
                "Id": "Backup",
                "Prefix": "",
                "Status": "Enabled",
              }],
            },
            "VersioningConfiguration": {
              "Status": "Enabled",
            },
          },
        },
        "WorkItemBucketBackupRole": {
          "Type": "AWS::IAM::Role",
          "Properties": {
            "AssumeRolePolicyDocument": {
              "Statement": [{
                "Action": ["sts:AssumeRole"],
                "Effect": "Allow",
                "Principal": {
                  "Service": ["s3.amazonaws.com"],
                },
              }],
            },
          },
        },
        "BucketBackupPolicy": {
          "Type": "AWS::IAM::Policy",
          "Properties": {
            "PolicyDocument": {
              "Statement": [{
                "Action": [
                  "s3:GetReplicationConfiguration",
                  "s3:ListBucket",
                ],
                "Effect": "Allow",
                "Resource": [{
                  "Fn::Join": ["", [
                    "arn:aws:s3:::", {
                      "Ref": "RecordServiceS3Bucket",
                    },
                  ],
                  ],
                }],
              }, {
                "Action": [
                  "s3:GetObjectVersion",
                  "s3:GetObjectVersionAcl",
                ],
                "Effect": "Allow",
                "Resource": [{
                  "Fn::Join": ["", [
                    "arn:aws:s3:::", {
                      "Ref": "RecordServiceS3Bucket",
                    },
                    "/*",
                  ]],
                }],
              }, {
                "Action": [
                  "s3:ReplicateObject",
                  "s3:ReplicateDelete",
                ],
                "Effect": "Allow",
                "Resource": [{
                  "Fn::Join": ["", [
                    "arn:aws:s3:::", {
                      "Fn::Join": ["-", [
                        { "Ref": "AWS::Region" },
                        { "Ref": "AWS::StackName" },
                        "replicationbucket",
                      ]],
                    },
                    "/*",
                  ]],
                }],
              }],
            },
            "PolicyName": "BucketBackupPolicy",
            "Roles": [{
              "Ref": "WorkItemBucketBackupRole",
            }],
          },
        },
      },
    });
  });

  test('can ingest a yaml template with parameters and output it unchanged', () => {
    includeTestTemplate(stack, 'bucket-with-parameters.yaml');

    expect(stack).toMatchTemplate(
      loadTestFileToJsObject('bucket-with-parameters.yaml'),
    );
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
  return futils.readYamlSync(_testTemplateFilePath(testTemplate));
}

function _testTemplateFilePath(testTemplate: string) {
  return path.join(__dirname, 'test-templates/yaml', testTemplate);
}