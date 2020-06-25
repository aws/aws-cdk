import '@aws-cdk/assert/jest';
import { ResourcePart } from '@aws-cdk/assert';
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

  test('can ingest a template with conditions and short form functions', () => {
    const cfnTemplate = includeTestTemplate(stack, 'short-form-functions.yaml');
    const alwaysTrueCondition = cfnTemplate.getCondition('AlwaysTrueCond');
    const andCondition = cfnTemplate.getCondition('AndCond');

    /*expect(alwaysTrueCondition).toMatchObject({
        "Fn::Not": [
          {
            "Fn::Equals": [
              {
                "Ref": "AWS::Region"
              },
              "completely-made-up-region"
            ]
          }
        ]
      }
    );*/

   /* expect(andCondition).toBe({
        "AndCond": {
            "Fn::And": [
              {
                "Condition": "AlwaysTrueCond"
              },
              {
                "Fn::Or": [
                  {
                    "Condition": "AlwaysTrueCond"
                  },
                  {
                    "Condition": "AlwaysTrueCond"
                  }
                ]
              }
            ]
          }
      }
    );*/
  });

  test('can ingest a template with a VPC that uses short form !Cidr', () => {
    includeTestTemplate(stack, 'short-form-functions.yaml');

    expect(stack).toHaveResourceLike('AWS::EC2::VPC', {
      "Properties": {
        "CidrBlock": {
          "Fn::If": [
            "AlwaysTrueCond",
            {
              "Fn::Cidr": [
                "192.168.1.1/24",
                2,
                5
              ]
            },
            {
              "Fn::Cidr": [
                "10.0.0.0/24",
                "6",
                "5"
              ]
            }
          ]
        }
      }
    }, ResourcePart.CompleteDefinition);
  });

  test('can ingest a template with a Bucket that uses short form !FindInMap', () => {
    includeTestTemplate(stack, 'short-form-functions.yaml');

    expect(stack).toHaveResourceLike('AWS::S3::Bucket', {
      "Properties": {
        "BucketName": {
          "Fn::If": [
            "AndCond",
            {
              "Fn::FindInMap": [
                "RegionMap",
                "region-1",
                "HVM64"
              ]
            },
            "Unreachable"
          ]
        }
      }
    }, ResourcePart.CompleteDefinition);
  });

  test('can ingest a template with a subnet that uses short form !If, !Split, !ImportValue, !GetAZs, and !Select', () => {
    includeTestTemplate(stack, 'short-form-functions.yaml');

    expect(stack).toHaveResourceLike('AWS::EC2::Subnet', {
      "Properties": {
        "VpcId": {
          "Fn::If": [
            "AlwaysTrueCond",
            {
              "Fn::Split": [
                ",",
                {
                  "Fn::ImportValue": "ImportedVpcId"
                }
              ]
            },
            "Unreachable"
          ]
        },
        "CidrBlock": "10.0.0.0/24",
        "AvailabilityZone": {
          "Fn::Select": [
            "0",
            {
              "Fn::GetAZs": ""
            }
          ]
        }
      }
    }, ResourcePart.CompleteDefinition);
  });

  test('can ingest a template with a subnet that uses short form !Cidr, the other form of !GetAZs, and !Select', () => {
    includeTestTemplate(stack, 'short-form-functions.yaml');

    expect(stack).toHaveResourceLike('AWS::EC2::Subnet', {
      "Properties": {
        "VpcId": {
          "Fn::Select": [
            0,
            {
              "Fn::Cidr": [
                "10.0.0.0/24",
                5,
                2
              ]
            }
          ]
        },
        "CidrBlock": "10.0.0.0/24",
        "AvailabilityZone": {
          "Fn::Select": [
            "0",
            {
              "Fn::GetAZs": "eu-west-2"
            }
          ]
        }
      }
    }, ResourcePart.CompleteDefinition);
  });

  test('can ingest a template with a bucket that uses short form !Transform, !If, and !Base64', () => {
    includeTestTemplate(stack, 'short-form-functions.yaml');

    expect(stack).toHaveResourceLike('AWS::S3::Bucket', {
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
                    "Fn::Base64": "AnotherValue"
                  }
                }
              }
            }
          ]
        }
      }
    }, ResourcePart.CompleteDefinition);
  });

  test('can ingest a template with ServiceBucket that uses short form !GetAtt and !Join', () => {
    includeTestTemplate(stack, 'short-form-sample.yaml');

    expect(stack).toHaveResourceLike('AWS::S3::Bucket', {
      "DeletionPolicy": "Retain",
      "Properties": {
        "ReplicationConfiguration": {
          "Role": {
            "Fn::GetAtt": [
              "WorkItemBucketBackupRole",
              {
                "Ref": 'AWS::Region'
              }
            ]
          },
          "Rules": [{
            "Destination": {
              "Bucket": {
                "Fn::Join": [ "", [
                  "arn:aws:s3:::", {
                    "Fn::Join": [ "-", [
                      { "Ref": "AWS::Region" },
                      { "Ref": "AWS::StackName" },
                      "replicationbucket"
                    ]]
                  }
                ]]
              },
              "StorageClass": "STANDARD"
            },
            "Id": "Backup",
            "Prefix": "",
            "Status": "Enabled"
          }]
        },
        "VersioningConfiguration": {
          "Status": "Enabled"
        }
      }
    }, ResourcePart.CompleteDefinition);
  });

  test('can ingest a template with Role', () => {
    includeTestTemplate(stack, 'short-form-sample.yaml');

    expect(stack).toHaveResourceLike('AWS::IAM::Role', {
      "Properties": {
        "AssumeRolePolicyDocument": {
          "Statement": [{
            "Action": [ "sts:AssumeRole" ],
            "Effect": "Allow",
            "Principal": {
              "Service": [ "s3.amazonaws.com" ]
            }
          }]
        }
      }
    }, ResourcePart.CompleteDefinition);
  });


  test('can ingest a template with Policy that uses short form !Join and !Ref', () => {
    includeTestTemplate(stack, 'short-form-sample.yaml');

    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      "Properties": {
        "PolicyDocument": {
          "Statement": [{
            "Action": [
              "s3:GetReplicationConfiguration",
              "s3:ListBucket"
            ],
            "Effect": "Allow",
            "Resource": [{
              "Fn::Join": [ "", [
                  "arn:aws:s3:::", {
                    "Ref": "RecordServiceS3Bucket"
                  }
                ]
              ]
            }]
          },{
            "Action": [
              "s3:GetObjectVersion",
              "s3:GetObjectVersionAcl"
            ],
            "Effect": "Allow",
            "Resource": [{
              "Fn::Join": [ "", [
                  "arn:aws:s3:::", {
                    "Ref": "RecordServiceS3Bucket"
                  },
                  "/*"
                ]
              ]
            }]
          }, {
            "Action": [
              "s3:ReplicateObject",
              "s3:ReplicateDelete"
            ],
            "Effect": "Allow",
            "Resource": [{
              "Fn::Join": [ "", [ 
                 "arn:aws:s3:::", {
                   "Fn::Join": [ "-", [ 
                     { "Ref": "AWS::Region" }, 
                     { "Ref": "AWS::StackName" }, 
                     "replicationbucket"
                   ]]
                 }, 
                 "/*"
              ]]
            }]
          }]
        },
        "PolicyName": "BucketBackupPolicy",
        "Roles": [{
          "Ref": "WorkItemBucketBackupRole"
        }]
      }
    }, ResourcePart.CompleteDefinition);
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