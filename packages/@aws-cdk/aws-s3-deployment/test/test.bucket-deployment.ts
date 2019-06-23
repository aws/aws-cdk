import { expect, haveResource } from '@aws-cdk/assert';
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import path = require('path');
import s3deploy = require('../lib');

// tslint:disable:max-line-length
// tslint:disable:object-literal-key-quotes

export = {
  'deploy from local directory asset'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');

    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
      source: s3deploy.Source.asset(path.join(__dirname, 'my-website')),
      destinationBucket: bucket,
    });

    // THEN
    expect(stack).to(haveResource('Custom::CDKBucketDeployment', {
      "ServiceToken": {
        "Fn::GetAtt": [
          "CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C81C01536",
          "Arn"
        ]
      },
      "SourceBucketName": {
        "Ref": "DeployAssetS3BucketB84349C9"
      },
      "SourceObjectKey": {
        "Fn::Join": [
          "",
          [
            {
              "Fn::Select": [
                0,
                {
                  "Fn::Split": [
                    "||",
                    {
                      "Ref": "DeployAssetS3VersionKeyB05C8986"
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
                      "Ref": "DeployAssetS3VersionKeyB05C8986"
                    }
                  ]
                }
              ]
            }
          ]
        ]
      },
      "DestinationBucketName": {
        "Ref": "DestC383B82A"
      }
    }));
    test.done();
  },

  'fails if local asset is a non-zip file'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');

    // THEN
    test.throws(() => new s3deploy.BucketDeployment(stack, 'Deploy', {
      source: s3deploy.Source.asset(path.join(__dirname, 'my-website', 'index.html')),
      destinationBucket: bucket,
    }), /Asset path must be either a \.zip file or a directory/);

    test.done();
  },

  'deploy from a local .zip file'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');

    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
      source: s3deploy.Source.asset(path.join(__dirname, 'my-website.zip')),
      destinationBucket: bucket,
    });

    test.done();
  },

  'retainOnDelete can be used to retain files when resource is deleted'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');

    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
      source: s3deploy.Source.asset(path.join(__dirname, 'my-website.zip')),
      destinationBucket: bucket,
      retainOnDelete: true,
    });

    expect(stack).to(haveResource('Custom::CDKBucketDeployment', {
      RetainOnDelete: true
    }));

    test.done();
  },

  'lambda execution role gets permissions to read from the source bucket and read/write in destination'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const source = new s3.Bucket(stack, 'Source');
    const bucket = new s3.Bucket(stack, 'Dest');

    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
      source: s3deploy.Source.bucket(source, 'file.zip'),
      destinationBucket: bucket,
    });

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      "PolicyDocument": {
        "Statement": [
          {
            "Action": [
              "s3:GetObject*",
              "s3:GetBucket*",
              "s3:List*"
            ],
            "Effect": "Allow",
            "Resource": [
              {
                "Fn::GetAtt": [
                  "Source71E471F1",
                  "Arn"
                ]
              },
              {
                "Fn::Join": [
                  "",
                  [
                    {
                      "Fn::GetAtt": [
                        "Source71E471F1",
                        "Arn"
                      ]
                    },
                    "/*"
                  ]
                ]
              }
            ]
          },
          {
            "Action": [
              "s3:GetObject*",
              "s3:GetBucket*",
              "s3:List*",
              "s3:DeleteObject*",
              "s3:PutObject*",
              "s3:Abort*"
            ],
            "Effect": "Allow",
            "Resource": [
              {
                "Fn::GetAtt": [
                  "DestC383B82A",
                  "Arn"
                ]
              },
              {
                "Fn::Join": [
                  "",
                  [
                    {
                      "Fn::GetAtt": [
                        "DestC383B82A",
                        "Arn"
                      ]
                    },
                    "/*"
                  ]
                ]
              }
            ]
          }
        ],
        "Version": "2012-10-17"
      },
      "PolicyName": "CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRoleDefaultPolicy88902FDF",
      "Roles": [
        {
          "Ref": "CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRole89A01265"
        }
      ]
    }));
    test.done();
  },
};
