import '@aws-cdk/assert-internal/jest';
import { MatchStyle } from '@aws-cdk/assert-internal';
import * as ecr from '@aws-cdk/aws-ecr';
import * as cdk from '@aws-cdk/core';
import * as lambda from '../lib';

/**
 * Boilerplate code to create a Function with a given insights version
 */
function functionWithInsightsVersion(
  stack: cdk.Stack,
  id: string,
  insightsVersion: lambda.LambdaInsightsVersion,
  architecture?: lambda.Architecture,
): lambda.IFunction {
  return new lambda.Function(stack, id, {
    code: new lambda.InlineCode('foo'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_10_X,
    architecture,
    insightsVersion,
  });
}

/**
 * Check if the function's Role has the Lambda Insights IAM policy
 */
function verifyRoleHasCorrectPolicies(stack: cdk.Stack) {
  expect(stack).toHaveResource('AWS::IAM::Role', {
    ManagedPolicyArns:
      [
        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole']] },
        { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy']] },
      ],
  });
}

// This test code has app.synth() because the lambda-insights code has functions that are only run on synthesis
describe('lambda-insights', () => {
  test('can provide arn to enable insights', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});
    const layerArn = 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:14';
    functionWithInsightsVersion(stack, 'MyLambda', lambda.LambdaInsightsVersion.fromInsightVersionArn(layerArn));

    verifyRoleHasCorrectPolicies(stack);

    expect(stack).toHaveResource('AWS::Lambda::Function', {
      Layers: [layerArn],
    });

    // On synthesis it should not throw an error
    expect(() => app.synth()).not.toThrow();
  });

  test('can provide a version to enable insights', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    functionWithInsightsVersion(stack, 'MyLambda', lambda.LambdaInsightsVersion.VERSION_1_0_54_0);

    verifyRoleHasCorrectPolicies(stack);

    expect(stack).toHaveResource('AWS::Lambda::Function', {
      Layers: ['arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:2'],
    });

    // On synthesis it should not throw an error
    expect(() => app.synth()).not.toThrow();
  });

  test('existing region with existing but unsupported version throws error', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'af-south-1' },
    });

    // AF-SOUTH-1 exists, 1.0.54.0 exists, but 1.0.54.0 isn't supported in AF-SOUTH-1
    functionWithInsightsVersion(stack, 'BadVersion', lambda.LambdaInsightsVersion.VERSION_1_0_54_0);

    // On synthesis it should throw an error
    expect(() => app.synth()).toThrow('Insights version 1.0.54.0 is not supported in region af-south-1');
  });

  test('using a specific version without providing a region', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});

    functionWithInsightsVersion(stack, 'MyLambda', lambda.LambdaInsightsVersion.VERSION_1_0_54_0);

    // Should be looking up a mapping
    expect(stack).toHaveResource('AWS::Lambda::Function', {
      Layers: [{
        'Fn::FindInMap': [
          'LambdaInsightsVersions10540',
          {
            Ref: 'AWS::Region',
          },
          'arn',
        ],
      }],
    });

    // On synthesis it should not throw an error
    expect(() => app.synth()).not.toThrow();
  });

  // Here we're error checking the code which verifies if the mapping exists already
  test('can create two functions in a region agnostic stack with the same version', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});

    functionWithInsightsVersion(stack, 'MyLambda1', lambda.LambdaInsightsVersion.VERSION_1_0_54_0);
    functionWithInsightsVersion(stack, 'MyLambda2', lambda.LambdaInsightsVersion.VERSION_1_0_54_0);

    /* eslint-disable quote-props */
    expect(stack).toMatchTemplate({
      Resources: {
        MyLambda1ServiceRole69A7E1EA: {
          'Type': 'AWS::IAM::Role',
          'Properties': {
            'AssumeRolePolicyDocument': {
              'Statement': [
                {
                  'Action': 'sts:AssumeRole',
                  'Effect': 'Allow',
                  'Principal': {
                    'Service': 'lambda.amazonaws.com',
                  },
                },
              ],
              'Version': '2012-10-17',
            },
            'ManagedPolicyArns': [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      'Ref': 'AWS::Partition',
                    },
                    ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                  ],
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      'Ref': 'AWS::Partition',
                    },
                    ':iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy',
                  ],
                ],
              },
            ],
          },
        },
        MyLambda1AAFB4554: {
          'Type': 'AWS::Lambda::Function',
          'Properties': {
            'Code': {
              'ZipFile': 'foo',
            },
            'Role': {
              'Fn::GetAtt': [
                'MyLambda1ServiceRole69A7E1EA',
                'Arn',
              ],
            },
            'Handler': 'index.handler',
            'Layers': [
              {
                'Fn::FindInMap': [
                  'LambdaInsightsVersions10540',
                  {
                    'Ref': 'AWS::Region',
                  },
                  'arn',
                ],
              },
            ],
            'Runtime': 'nodejs10.x',
          },
          'DependsOn': [
            'MyLambda1ServiceRole69A7E1EA',
          ],
        },
        MyLambda2ServiceRoleD09B370C: {
          'Type': 'AWS::IAM::Role',
          'Properties': {
            'AssumeRolePolicyDocument': {
              'Statement': [
                {
                  'Action': 'sts:AssumeRole',
                  'Effect': 'Allow',
                  'Principal': {
                    'Service': 'lambda.amazonaws.com',
                  },
                },
              ],
              'Version': '2012-10-17',
            },
            'ManagedPolicyArns': [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      'Ref': 'AWS::Partition',
                    },
                    ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                  ],
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      'Ref': 'AWS::Partition',
                    },
                    ':iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy',
                  ],
                ],
              },
            ],
          },
        },
        MyLambda2254B54D5: {
          'Type': 'AWS::Lambda::Function',
          'Properties': {
            'Code': {
              'ZipFile': 'foo',
            },
            'Role': {
              'Fn::GetAtt': [
                'MyLambda2ServiceRoleD09B370C',
                'Arn',
              ],
            },
            'Handler': 'index.handler',
            'Layers': [
              {
                'Fn::FindInMap': [
                  'LambdaInsightsVersions10540',
                  {
                    'Ref': 'AWS::Region',
                  },
                  'arn',
                ],
              },
            ],
            'Runtime': 'nodejs10.x',
          },
          'DependsOn': [
            'MyLambda2ServiceRoleD09B370C',
          ],
        },
      },
      Mappings: {
        LambdaInsightsVersions10540: {
          'ap-northeast-1': {
            arn: 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension:2',
          },
          'ap-northeast-2': {
            'arn': 'arn:aws:lambda:ap-northeast-2:580247275435:layer:LambdaInsightsExtension:2',
          },
          'ap-south-1': {
            'arn': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension:2',
          },
          'ap-southeast-1': {
            'arn': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension:2',
          },
          'ap-southeast-2': {
            'arn': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension:2',
          },
          'ca-central-1': {
            'arn': 'arn:aws:lambda:ca-central-1:580247275435:layer:LambdaInsightsExtension:2',
          },
          'eu-central-1': {
            'arn': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension:2',
          },
          'eu-north-1': {
            'arn': 'arn:aws:lambda:eu-north-1:580247275435:layer:LambdaInsightsExtension:2',
          },
          'eu-west-1': {
            'arn': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension:2',
          },
          'eu-west-2': {
            'arn': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension:2',
          },
          'eu-west-3': {
            'arn': 'arn:aws:lambda:eu-west-3:580247275435:layer:LambdaInsightsExtension:2',
          },
          'sa-east-1': {
            'arn': 'arn:aws:lambda:sa-east-1:580247275435:layer:LambdaInsightsExtension:2',
          },
          'us-east-1': {
            'arn': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:2',
          },
          'us-east-2': {
            'arn': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension:2',
          },
          'us-west-1': {
            'arn': 'arn:aws:lambda:us-west-1:580247275435:layer:LambdaInsightsExtension:2',
          },
          'us-west-2': {
            'arn': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension:2',
          },
        },
      },
    }, MatchStyle.EXACT);
    // On synthesis it should not throw an error
    expect(() => app.synth()).not.toThrow();
  });

  test('insights layer is skipped for container images and the role is updated', () => {
    const stack = new cdk.Stack();
    new lambda.DockerImageFunction(stack, 'MyFunction', {
      code: lambda.DockerImageCode.fromEcr(ecr.Repository.fromRepositoryArn(stack, 'MyRepo',
        'arn:aws:ecr:us-east-1:0123456789:repository/MyRepo')),
      insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_98_0,
    });

    expect(stack).toCountResources('AWS::Lambda::LayerVersion', 0);

    expect(stack).toHaveResourceLike('AWS::IAM::Role', {
      'AssumeRolePolicyDocument': {
        'Statement': [
          {
            'Action': 'sts:AssumeRole',
            'Principal': {
              'Service': 'lambda.amazonaws.com',
            },
          },
        ],
      },
      'ManagedPolicyArns': [
        {},
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                'Ref': 'AWS::Partition',
              },
              ':iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy',
            ],
          ],
        },
      ],
    });
  });

  test('can use with arm architecture', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    functionWithInsightsVersion(stack, 'MyLambda', lambda.LambdaInsightsVersion.VERSION_1_0_119_0, lambda.Architecture.ARM_64);

    expect(stack).toHaveResource('AWS::Lambda::Function', {
      Layers: ['arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension-Arm64:1'],
    });

    // On synthesis it should not throw an error
    expect(() => app.synth()).not.toThrow();
  });

  test('throws if arm is not available in this version', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    expect(() => functionWithInsightsVersion(stack, 'MyLambda', lambda.LambdaInsightsVersion.VERSION_1_0_98_0, lambda.Architecture.ARM_64)).toThrow('Insights version 1.0.98.0 does not exist.');
  });
  test('throws if arm is available in this version, but not in this region', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {
      env: { account: '123456789012', region: 'us-west-1' },
    });
    functionWithInsightsVersion(stack, 'MyLambda', lambda.LambdaInsightsVersion.VERSION_1_0_119_0, lambda.Architecture.ARM_64);

    // On synthesis it should not throw an error
    expect(() => app.synth()).toThrow('Insights version 1.0.119.0 is not supported in region us-west-1');
  });

  test('can create two functions, with different architectures in a region agnostic stack with the same version', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack', {});

    functionWithInsightsVersion(stack, 'MyLambda1', lambda.LambdaInsightsVersion.VERSION_1_0_119_0);
    functionWithInsightsVersion(stack, 'MyLambda2', lambda.LambdaInsightsVersion.VERSION_1_0_119_0, lambda.Architecture.ARM_64);

    /* eslint-disable quote-props */
    expect(stack).toMatchTemplate({
      Resources: {
        MyLambda1ServiceRole69A7E1EA: {
          'Type': 'AWS::IAM::Role',
          'Properties': {
            'AssumeRolePolicyDocument': {
              'Statement': [
                {
                  'Action': 'sts:AssumeRole',
                  'Effect': 'Allow',
                  'Principal': {
                    'Service': 'lambda.amazonaws.com',
                  },
                },
              ],
              'Version': '2012-10-17',
            },
            'ManagedPolicyArns': [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      'Ref': 'AWS::Partition',
                    },
                    ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                  ],
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      'Ref': 'AWS::Partition',
                    },
                    ':iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy',
                  ],
                ],
              },
            ],
          },
        },
        MyLambda1AAFB4554: {
          'Type': 'AWS::Lambda::Function',
          'Properties': {
            'Code': {
              'ZipFile': 'foo',
            },
            'Role': {
              'Fn::GetAtt': [
                'MyLambda1ServiceRole69A7E1EA',
                'Arn',
              ],
            },
            'Handler': 'index.handler',
            'Layers': [
              {
                'Fn::FindInMap': [
                  'LambdaInsightsVersions101190',
                  {
                    'Ref': 'AWS::Region',
                  },
                  'arn',
                ],
              },
            ],
            'Runtime': 'nodejs10.x',
          },
          'DependsOn': [
            'MyLambda1ServiceRole69A7E1EA',
          ],
        },
        MyLambda2ServiceRoleD09B370C: {
          'Type': 'AWS::IAM::Role',
          'Properties': {
            'AssumeRolePolicyDocument': {
              'Statement': [
                {
                  'Action': 'sts:AssumeRole',
                  'Effect': 'Allow',
                  'Principal': {
                    'Service': 'lambda.amazonaws.com',
                  },
                },
              ],
              'Version': '2012-10-17',
            },
            'ManagedPolicyArns': [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      'Ref': 'AWS::Partition',
                    },
                    ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                  ],
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      'Ref': 'AWS::Partition',
                    },
                    ':iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy',
                  ],
                ],
              },
            ],
          },
        },
        MyLambda2254B54D5: {
          'Type': 'AWS::Lambda::Function',
          'Properties': {
            'Code': {
              'ZipFile': 'foo',
            },
            'Role': {
              'Fn::GetAtt': [
                'MyLambda2ServiceRoleD09B370C',
                'Arn',
              ],
            },
            'Architectures': [
              'arm64',
            ],
            'Handler': 'index.handler',
            'Layers': [
              {
                'Fn::FindInMap': [
                  'LambdaInsightsVersions101190arm64',
                  {
                    'Ref': 'AWS::Region',
                  },
                  'arn',
                ],
              },
            ],
            'Runtime': 'nodejs10.x',
          },
          'DependsOn': [
            'MyLambda2ServiceRoleD09B370C',
          ],
        },
      },
      Mappings: {
        LambdaInsightsVersions101190: {
          'af-south-1': {
            'arn': 'arn:aws:lambda:af-south-1:012438385374:layer:LambdaInsightsExtension:9',
          },
          'ap-east-1': {
            'arn': 'arn:aws:lambda:ap-east-1:519774774795:layer:LambdaInsightsExtension:9',
          },
          'ap-northeast-1': {
            'arn': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension:23',
          },
          'ap-northeast-2': {
            'arn': 'arn:aws:lambda:ap-northeast-2:580247275435:layer:LambdaInsightsExtension:16',
          },
          'ap-south-1': {
            'arn': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension:16',
          },
          'ap-southeast-1': {
            'arn': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension:16',
          },
          'ap-southeast-2': {
            'arn': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension:16',
          },
          'ca-central-1': {
            'arn': 'arn:aws:lambda:ca-central-1:580247275435:layer:LambdaInsightsExtension:16',
          },
          'cn-north-1': {
            'arn': 'arn:aws-cn:lambda:cn-north-1:488211338238:layer:LambdaInsightsExtension:9',
          },
          'cn-northwest-1': {
            'arn': 'arn:aws-cn:lambda:cn-northwest-1:488211338238:layer:LambdaInsightsExtension:9',
          },
          'eu-central-1': {
            'arn': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension:16',
          },
          'eu-north-1': {
            'arn': 'arn:aws:lambda:eu-north-1:580247275435:layer:LambdaInsightsExtension:16',
          },
          'eu-south-1': {
            'arn': 'arn:aws:lambda:eu-south-1:339249233099:layer:LambdaInsightsExtension:9',
          },
          'eu-west-1': {
            'arn': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension:16',
          },
          'eu-west-2': {
            'arn': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension:16',
          },
          'eu-west-3': {
            'arn': 'arn:aws:lambda:eu-west-3:580247275435:layer:LambdaInsightsExtension:16',
          },
          'me-south-1': {
            'arn': 'arn:aws:lambda:me-south-1:285320876703:layer:LambdaInsightsExtension:9',
          },
          'sa-east-1': {
            'arn': 'arn:aws:lambda:sa-east-1:580247275435:layer:LambdaInsightsExtension:16',
          },
          'us-east-1': {
            'arn': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension:16',
          },
          'us-east-2': {
            'arn': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension:16',
          },
          'us-west-1': {
            'arn': 'arn:aws:lambda:us-west-1:580247275435:layer:LambdaInsightsExtension:16',
          },
          'us-west-2': {
            'arn': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension:16',
          },
        },
        'LambdaInsightsVersions101190arm64': {
          'ap-northeast-1': {
            'arn': 'arn:aws:lambda:ap-northeast-1:580247275435:layer:LambdaInsightsExtension-Arm64:1',
          },
          'ap-south-1': {
            'arn': 'arn:aws:lambda:ap-south-1:580247275435:layer:LambdaInsightsExtension-Arm64:1',
          },
          'ap-southeast-1': {
            'arn': 'arn:aws:lambda:ap-southeast-1:580247275435:layer:LambdaInsightsExtension-Arm64:1',
          },
          'ap-southeast-2': {
            'arn': 'arn:aws:lambda:ap-southeast-2:580247275435:layer:LambdaInsightsExtension-Arm64:1',
          },
          'eu-central-1': {
            'arn': 'arn:aws:lambda:eu-central-1:580247275435:layer:LambdaInsightsExtension-Arm64:1',
          },
          'eu-west-1': {
            'arn': 'arn:aws:lambda:eu-west-1:580247275435:layer:LambdaInsightsExtension-Arm64:1',
          },
          'eu-west-2': {
            'arn': 'arn:aws:lambda:eu-west-2:580247275435:layer:LambdaInsightsExtension-Arm64:1',
          },
          'us-east-1': {
            'arn': 'arn:aws:lambda:us-east-1:580247275435:layer:LambdaInsightsExtension-Arm64:1',
          },
          'us-east-2': {
            'arn': 'arn:aws:lambda:us-east-2:580247275435:layer:LambdaInsightsExtension-Arm64:1',
          },
          'us-west-2': {
            'arn': 'arn:aws:lambda:us-west-2:580247275435:layer:LambdaInsightsExtension-Arm64:1',
          },
        },
      },
    }, MatchStyle.EXACT);
    // On synthesis it should not throw an error
    expect(() => app.synth()).not.toThrow();
  });
});
