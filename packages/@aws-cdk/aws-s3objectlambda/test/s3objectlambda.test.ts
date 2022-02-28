import { Template } from '@aws-cdk/assertions';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { AccessPoint } from '../lib';

let stack: cdk.Stack;
let bucket: s3.Bucket;
let handler: lambda.Function;

beforeEach(() => {
  stack = new cdk.Stack();
  bucket = new s3.Bucket(stack, 'MyBucket');
  handler = new lambda.Function(stack, 'MyFunction', {
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'index.hello',
    code: new lambda.InlineCode('def hello(): pass'),
  });
});

test('Can create a valid access point', () => {
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

  expect(Template.fromStack(stack).findOutputs('*')).toEqual(
    {
      AccessPointName: {
        Value: {
          Ref: 'MyObjectLambda3F9602DC',
        },
      },
      DomainName: {
        Value: {
          'Fn::Join': [
            '',
            [
              {
                Ref: 'MyObjectLambda3F9602DC',
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
                Ref: 'MyObjectLambda3F9602DC',
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
                Ref: 'MyObjectLambda3F9602DC',
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
                Ref: 'MyObjectLambda3F9602DC',
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
  );

  Template.fromStack(stack).hasResourceProperties('AWS::S3ObjectLambda::AccessPoint', {
    ObjectLambdaConfiguration: {
      AllowedFeatures: [
        'GetObject-PartNumber',
        'GetObject-Range',
      ],
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
  });
});

test('Can create an access point without specifying the name', () => {
  new AccessPoint(stack, 'MyObjectLambda', {
    bucket,
    handler,
  });
  Template.fromStack(stack).hasResourceProperties('AWS::S3ObjectLambda::AccessPoint', {
    ObjectLambdaConfiguration: {
      AllowedFeatures: [],
    },
  });
});

test('Slashes are removed from the virtual hosted url', () => {
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
  expect(Template.fromStack(stack).findOutputs('*')).toEqual( {
    VirtualHostedUrlKeyBeginsSlash: {
      Value: {
        'Fn::Join': [
          '',
          [
            'https://',
            {
              Ref: 'MyObjectLambda3F9602DC',
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
              Ref: 'MyObjectLambda3F9602DC',
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
              Ref: 'MyObjectLambda3F9602DC',
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
  });
});

test('Validates the access point name', () => {
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
