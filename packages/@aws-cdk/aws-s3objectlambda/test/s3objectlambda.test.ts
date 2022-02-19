import { Template } from '@aws-cdk/assertions';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { AccessPoint } from '../lib';

test('Can create a valid access point', () => {
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'MyBucket');
  const handler = new lambda.Function(stack, 'MyFunction', {
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'index.hello',
    code: new lambda.InlineCode('def hello(): pass'),
  });
  const accessPoint = new AccessPoint(stack, 'MyObjectLambda', {
    bucket,
    handler,
    accessPointName: 'obj-lambda',
    supportsGetObjectRange: true,
    supportsGetObjectPartNumber: true,
    payload: { foo: 10 },
  });
  new cdk.CfnOutput(stack, 'AccessPointName', {
    value: accessPoint.accessPointName,
  });
  new cdk.CfnOutput(stack, 'DomainName', {
    value: accessPoint.domainName,
  });
  new cdk.CfnOutput(stack, 'RegionalDomainName', {
    value: accessPoint.regionalDomainName,
  });
  new cdk.CfnOutput(stack, 'VirtualHostedUrl', {
    value: accessPoint.virtualHostedUrlForObject('key', {
      regional: true,
    }),
  });
  new cdk.CfnOutput(stack, 'VirtualHostedRegionalUrl', {
    value: accessPoint.virtualHostedUrlForObject('key', {
      regional: false,
    }),
  });
  expect(Template.fromStack(stack).toJSON()).toEqual({
    Outputs: {
      AccessPointName: {
        Value: {
          Ref: 'MyObjectLambdaLambdaAccessPointB177C27B',
        },
      },
      DomainName: {
        Value: {
          'Fn::Join': [
            '',
            [
              {
                Ref: 'MyObjectLambdaLambdaAccessPointB177C27B',
              },
              '-',
              {
                Ref: 'AWS::AccountId',
              },
              '.s3-object-lambda.',
              {
                Ref: 'AWS::URLSuffix',
              },
            ],
          ],
        },
      },
      RegionalDomainName: {
        Value: {
          'Fn::Join': [
            '',
            [
              {
                Ref: 'MyObjectLambdaLambdaAccessPointB177C27B',
              },
              '-',
              {
                Ref: 'AWS::AccountId',
              },
              '.s3-object-lambda.',
              {
                Ref: 'AWS::Region',
              },
              '.',
              {
                Ref: 'AWS::URLSuffix',
              },
            ],
          ],
        },
      },
      VirtualHostedRegionalUrl: {
        Value: {
          'Fn::Join': [
            '',
            [
              'https://',
              {
                Ref: 'MyObjectLambdaLambdaAccessPointB177C27B',
              },
              '-',
              {
                Ref: 'AWS::AccountId',
              },
              '.s3-object-lambda.',
              {
                Ref: 'AWS::URLSuffix',
              },
              '/key',
            ],
          ],
        },
      },
      VirtualHostedUrl: {
        Value: {
          'Fn::Join': [
            '',
            [
              'https://',
              {
                Ref: 'MyObjectLambdaLambdaAccessPointB177C27B',
              },
              '-',
              {
                Ref: 'AWS::AccountId',
              },
              '.s3-object-lambda.',
              {
                Ref: 'AWS::Region',
              },
              '.',
              {
                Ref: 'AWS::URLSuffix',
              },
              '/key',
            ],
          ],
        },
      },
    },
    Resources: {
      MyBucketF68F3FF0: {
        DeletionPolicy: 'Retain',
        Type: 'AWS::S3::Bucket',
        UpdateReplacePolicy: 'Retain',
      },
      MyFunction3BAA72D1: {
        DependsOn: [
          'MyFunctionServiceRoleDefaultPolicyB705ABD4',
          'MyFunctionServiceRole3C357FF2',
        ],
        Properties: {
          Code: {
            ZipFile: 'def hello(): pass',
          },
          Handler: 'index.hello',
          Role: {
            'Fn::GetAtt': [
              'MyFunctionServiceRole3C357FF2',
              'Arn',
            ],
          },
          Runtime: 'nodejs14.x',
        },
        Type: 'AWS::Lambda::Function',
      },
      MyFunctionServiceRole3C357FF2: {
        Properties: {
          AssumeRolePolicyDocument: {
            Statement: [
              {
                Action: 'sts:AssumeRole',
                Effect: 'Allow',
                Principal: {
                  Service: 'lambda.amazonaws.com',
                },
              },
            ],
            Version: '2012-10-17',
          },
          ManagedPolicyArns: [
            {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                ],
              ],
            },
          ],
        },
        Type: 'AWS::IAM::Role',
      },
      MyFunctionServiceRoleDefaultPolicyB705ABD4: {
        Properties: {
          PolicyDocument: {
            Statement: [
              {
                Action: 's3-object-lambda:WriteGetObjectResponse',
                Effect: 'Allow',
                Resource: '*',
              },
            ],
            Version: '2012-10-17',
          },
          PolicyName: 'MyFunctionServiceRoleDefaultPolicyB705ABD4',
          Roles: [
            {
              Ref: 'MyFunctionServiceRole3C357FF2',
            },
          ],
        },
        Type: 'AWS::IAM::Policy',
      },
      MyObjectLambdaLambdaAccessPointB177C27B: {
        Properties: {
          Name: 'obj-lambda',
          ObjectLambdaConfiguration: {
            AllowedFeatures: [
              'GetObject-PartNumber',
              'GetObject-Range',
            ],
            SupportingAccessPoint: {
              'Fn::GetAtt': [
                'MyObjectLambdaSupportingAccessPointA2D2026E',
                'Arn',
              ],
            },
            TransformationConfigurations: [
              {
                Actions: [
                  'GetObject',
                ],
                ContentTransformation: {
                  AwsLambda: {
                    FunctionArn: {
                      'Fn::GetAtt': [
                        'MyFunction3BAA72D1',
                        'Arn',
                      ],
                    },
                    FunctionPayload: '{"foo":10}',
                  },
                },
              },
            ],
          },
        },
        Type: 'AWS::S3ObjectLambda::AccessPoint',
      },
      MyObjectLambdaSupportingAccessPointA2D2026E: {
        Properties: {
          Bucket: {
            Ref: 'MyBucketF68F3FF0',
          },
        },
        Type: 'AWS::S3::AccessPoint',
      },
    },
  },
  );
});

test('Can create an access point without specifying the name', () => {
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'MyBucket');
  const handler = new lambda.Function(stack, 'MyFunction', {
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'index.hello',
    code: new lambda.InlineCode('def hello(): pass'),
  });
  new AccessPoint(stack, 'MyObjectLambda', {
    bucket,
    handler,
  });
  expect(Template.fromStack(stack).toJSON()).toEqual({
    Resources: {
      MyBucketF68F3FF0: {
        Type: 'AWS::S3::Bucket',
        UpdateReplacePolicy: 'Retain',
        DeletionPolicy: 'Retain',
      },
      MyFunctionServiceRole3C357FF2: {
        Type: 'AWS::IAM::Role',
        Properties: {
          AssumeRolePolicyDocument: {
            Statement: [{
              Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: {
                Service: 'lambda.amazonaws.com',
              },
            }],
            Version: '2012-10-17',
          },
          ManagedPolicyArns: [{
            'Fn::Join': [
              '',
              ['arn:', {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'],
            ],
          }],
        },
      },
      MyFunctionServiceRoleDefaultPolicyB705ABD4: {
        Type: 'AWS::IAM::Policy',
        Properties: {
          PolicyDocument: {
            Statement: [{
              Action: 's3-object-lambda:WriteGetObjectResponse',
              Effect: 'Allow',
              Resource: '*',
            }],
            Version: '2012-10-17',
          },
          PolicyName: 'MyFunctionServiceRoleDefaultPolicyB705ABD4',
          Roles: [{
            Ref: 'MyFunctionServiceRole3C357FF2',
          }],
        },
      },
      MyFunction3BAA72D1: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          Code: { ZipFile: 'def hello(): pass' },
          Role: {
            'Fn::GetAtt': [
              'MyFunctionServiceRole3C357FF2',
              'Arn',
            ],
          },
          Handler: 'index.hello',
          Runtime: 'nodejs14.x',
        },
        DependsOn: [
          'MyFunctionServiceRoleDefaultPolicyB705ABD4',
          'MyFunctionServiceRole3C357FF2',
        ],
      },
      MyObjectLambdaSupportingAccessPointA2D2026E: {
        Type: 'AWS::S3::AccessPoint',
        Properties: {
          Bucket: {
            Ref: 'MyBucketF68F3FF0',
          },
        },
      },
      MyObjectLambdaLambdaAccessPointB177C27B: {
        Type: 'AWS::S3ObjectLambda::AccessPoint',
        Properties: {
          ObjectLambdaConfiguration: {
            AllowedFeatures: [],
            SupportingAccessPoint: {
              'Fn::GetAtt': [
                'MyObjectLambdaSupportingAccessPointA2D2026E',
                'Arn',
              ],
            },
            TransformationConfigurations: [{
              Actions: ['GetObject'],
              ContentTransformation: {
                AwsLambda: {
                  FunctionArn: {
                    'Fn::GetAtt': [
                      'MyFunction3BAA72D1',
                      'Arn',
                    ],
                  },
                },
              },
            }],
          },
        },
      },
    },
  });
});

test('Slashes are removed from the virtual hosted url', () => {
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'MyBucket');
  const handler = new lambda.Function(stack, 'MyFunction', {
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'index.hello',
    code: new lambda.InlineCode('def hello(): pass'),
  });
  const accessPoint = new AccessPoint(stack, 'MyObjectLambda', {
    bucket,
    handler,
  });
  new cdk.CfnOutput(stack, 'VirtualHostedUrlNoKey', {
    value: accessPoint.virtualHostedUrlForObject(),
  });
  new cdk.CfnOutput(stack, 'VirtualHostedUrlKeyBeginsSlash', {
    value: accessPoint.virtualHostedUrlForObject('/key1/key2'),
  });
  new cdk.CfnOutput(stack, 'VirtualHostedUrlKeyEndsSlash', {
    value: accessPoint.virtualHostedUrlForObject('key1/key2/'),
  });
  expect(Template.fromStack(stack).toJSON()).toEqual({
    Outputs: {
      VirtualHostedUrlKeyBeginsSlash: {
        Value: {
          'Fn::Join': [
            '',
            [
              'https://',
              {
                Ref: 'MyObjectLambdaLambdaAccessPointB177C27B',
              },
              '-',
              {
                Ref: 'AWS::AccountId',
              },
              '.s3-object-lambda.',
              {
                Ref: 'AWS::Region',
              },
              '.',
              {
                Ref: 'AWS::URLSuffix',
              },
              '/key1/key2',
            ],
          ],
        },
      },
      VirtualHostedUrlKeyEndsSlash: {
        Value: {
          'Fn::Join': [
            '',
            [
              'https://',
              {
                Ref: 'MyObjectLambdaLambdaAccessPointB177C27B',
              },
              '-',
              {
                Ref: 'AWS::AccountId',
              },
              '.s3-object-lambda.',
              {
                Ref: 'AWS::Region',
              },
              '.',
              {
                Ref: 'AWS::URLSuffix',
              },
              '/key1/key2',
            ],
          ],
        },
      },
      VirtualHostedUrlNoKey: {
        Value: {
          'Fn::Join': [
            '',
            [
              'https://',
              {
                Ref: 'MyObjectLambdaLambdaAccessPointB177C27B',
              },
              '-',
              {
                Ref: 'AWS::AccountId',
              },
              '.s3-object-lambda.',
              {
                Ref: 'AWS::Region',
              },
              '.',
              {
                Ref: 'AWS::URLSuffix',
              },
            ],
          ],
        },
      },
    },
    Resources: {
      MyBucketF68F3FF0: {
        DeletionPolicy: 'Retain',
        Type: 'AWS::S3::Bucket',
        UpdateReplacePolicy: 'Retain',
      },
      MyFunction3BAA72D1: {
        DependsOn: [
          'MyFunctionServiceRoleDefaultPolicyB705ABD4',
          'MyFunctionServiceRole3C357FF2',
        ],
        Properties: {
          Code: {
            ZipFile: 'def hello(): pass',
          },
          Handler: 'index.hello',
          Role: {
            'Fn::GetAtt': [
              'MyFunctionServiceRole3C357FF2',
              'Arn',
            ],
          },
          Runtime: 'nodejs14.x',
        },
        Type: 'AWS::Lambda::Function',
      },
      MyFunctionServiceRole3C357FF2: {
        Properties: {
          AssumeRolePolicyDocument: {
            Statement: [
              {
                Action: 'sts:AssumeRole',
                Effect: 'Allow',
                Principal: {
                  Service: 'lambda.amazonaws.com',
                },
              },
            ],
            Version: '2012-10-17',
          },
          ManagedPolicyArns: [
            {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                ],
              ],
            },
          ],
        },
        Type: 'AWS::IAM::Role',
      },
      MyFunctionServiceRoleDefaultPolicyB705ABD4: {
        Properties: {
          PolicyDocument: {
            Statement: [
              {
                Action: 's3-object-lambda:WriteGetObjectResponse',
                Effect: 'Allow',
                Resource: '*',
              },
            ],
            Version: '2012-10-17',
          },
          PolicyName: 'MyFunctionServiceRoleDefaultPolicyB705ABD4',
          Roles: [
            {
              Ref: 'MyFunctionServiceRole3C357FF2',
            },
          ],
        },
        Type: 'AWS::IAM::Policy',
      },
      MyObjectLambdaLambdaAccessPointB177C27B: {
        Properties: {
          ObjectLambdaConfiguration: {
            AllowedFeatures: [],
            SupportingAccessPoint: {
              'Fn::GetAtt': [
                'MyObjectLambdaSupportingAccessPointA2D2026E',
                'Arn',
              ],
            },
            TransformationConfigurations: [
              {
                Actions: [
                  'GetObject',
                ],
                ContentTransformation: {
                  AwsLambda: {
                    FunctionArn: {
                      'Fn::GetAtt': [
                        'MyFunction3BAA72D1',
                        'Arn',
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
        Type: 'AWS::S3ObjectLambda::AccessPoint',
      },
      MyObjectLambdaSupportingAccessPointA2D2026E: {
        Properties: {
          Bucket: {
            Ref: 'MyBucketF68F3FF0',
          },
        },
        Type: 'AWS::S3::AccessPoint',
      },
    },
  });
});

test('Validates the access point name', () => {
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'MyBucket');
  const handler = new lambda.Function(stack, 'MyFunction', {
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'index.hello',
    code: new lambda.InlineCode('def hello(): pass'),
  });
  expect(() => new AccessPoint(stack, 'MyObjectLambda1', {
    bucket,
    handler,
    accessPointName: 'aa',
  })).toThrowError(/name must be between 3 and 50 characters long/);
  expect(() => new AccessPoint(stack, 'MyObjectLambda2', {
    bucket,
    handler,
    accessPointName: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  })).toThrowError(/name must be between 3 and 50 characters long/);
  expect(() => new AccessPoint(stack, 'MyObjectLambda3', {
    bucket,
    handler,
    accessPointName: 'aaaa-s3alias',
  })).toThrowError(/name cannot end with the suffix -s3alias/);
  expect(() => new AccessPoint(stack, 'MyObjectLambda4', {
    bucket,
    handler,
    accessPointName: '-aaaaa',
  })).toThrowError(/name cannot begin or end with a dash/);
  expect(() => new AccessPoint(stack, 'MyObjectLambda5', {
    bucket,
    handler,
    accessPointName: 'aaaaa-',
  })).toThrowError(/name cannot begin or end with a dash/);
  expect(() => new AccessPoint(stack, 'MyObjectLambda6', {
    bucket,
    handler,
    accessPointName: 'Aaaaa',
  })).toThrowError(/name must begin with a number or lowercase letter and not contain underscores, uppercase letters, or periods/);
  expect(() => new AccessPoint(stack, 'MyObjectLambda7', {
    bucket,
    handler,
    accessPointName: '$aaaaa',
  })).toThrowError(/name must begin with a number or lowercase letter and not contain underscores, uppercase letters, or periods/);
  expect(() => new AccessPoint(stack, 'MyObjectLambda8', {
    bucket,
    handler,
    accessPointName: 'aaaAaaa',
  })).toThrowError(/name must begin with a number or lowercase letter and not contain underscores, uppercase letters, or periods/);
  expect(() => new AccessPoint(stack, 'MyObjectLambda9', {
    bucket,
    handler,
    accessPointName: 'aaa_aaa',
  })).toThrowError(/name must begin with a number or lowercase letter and not contain underscores, uppercase letters, or periods/);
  expect(() => new AccessPoint(stack, 'MyObjectLambda10', {
    bucket,
    handler,
    accessPointName: 'aaa.aaa',
  })).toThrowError(/name must begin with a number or lowercase letter and not contain underscores, uppercase letters, or periods/);
});
