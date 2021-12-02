import { Lambda } from 'aws-sdk';
import { REQUIRED_BY_CFN } from '../../../lib/api/hotswap/s3-bucket-deployments';
import * as setup from './hotswap-test-setup';

let mockLambdaInvoke: (params: Lambda.Types.InvocationRequest) => Lambda.Types.InvocationResponse;
let cfnMockProvider: setup.CfnMockProvider;

const payloadWithoutCustomResProps = {
  RequestType: 'Update',
  ResponseURL: REQUIRED_BY_CFN,
  PhysicalResourceId: REQUIRED_BY_CFN,
  StackId: REQUIRED_BY_CFN,
  RequestId: REQUIRED_BY_CFN,
  LogicalResourceId: REQUIRED_BY_CFN,
};

beforeEach(() => {
  cfnMockProvider = setup.setupHotswapTests();
  mockLambdaInvoke = jest.fn();
  cfnMockProvider.setInvokeLambdaMock(mockLambdaInvoke);
});

test('calls the lambdaInvoke() API when it receives only an asset difference in an s3 bucket deployment', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      S3Deployment: {
        Type: 'Custom::CDKBucketDeployment',
        Properties: {
          ServiceToken: 'a-lambda-arn',
          SourceBucketNames: ['src-bucket'],
          SourceObjectKeys: ['src-key-old'],
          DestinationBucketName: 'dest-bucket',
          DestinationBucketKeyPrefix: 'my-key/some-old-prefix',
        },
      },
    },
  });
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        S3Deployment: {
          Type: 'Custom::CDKBucketDeployment',
          Properties: {
            ServiceToken: 'a-lambda-arn',
            SourceBucketNames: ['src-bucket'],
            SourceObjectKeys: ['src-key-new'],
            DestinationBucketName: 'dest-bucket',
            DestinationBucketKeyPrefix: 'my-key/some-new-prefix',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await cfnMockProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();

  expect(mockLambdaInvoke).toHaveBeenCalledWith({
    FunctionName: 'a-lambda-arn',
    Payload: JSON.stringify({
      ...payloadWithoutCustomResProps,
      ResourceProperties: {
        SourceBucketNames: ['src-bucket'],
        SourceObjectKeys: ['src-key-new'],
        DestinationBucketName: 'dest-bucket',
        DestinationBucketKeyPrefix: 'my-key/some-new-prefix',
      },
    }),
  });
});

/*
test('correctly evaluates the service token when it references a lambda found in the template', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      Lambda: {
        Type: 'AWS::Lambda::Function',
      },
      S3Deployment: {
        Type: 'Custom::CDKBucketDeployment',
        Properties: {
          ServiceToken: 'a-lambda-arn',
          SourceBucketNames: ['src-bucket'],
          SourceObjectKeys: [
            'src-key-old',
          ],
          DestinationBucketName: 'dest-bucket',
        },
      },
    },
  });
  setup.pushStackResourceSummaries(setup.stackSummaryOf('Lambda', 'AWS::Lambda::Function', 'my-deployment-lambda'));
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        Lambda: {
          Type: 'AWS::Lambda::Function',
        },
        S3Deployment: {
          Type: 'Custom::CDKBucketDeployment',
          Properties: {
            ServiceToken: {
              'Fn::GetAtt': ['Lambda', 'Arn'],
            },
            SourceBucketNames: ['src-bucket'],
            SourceObjectKeys: [
              'src-key-old',
            ],
            DestinationBucketName: 'dest-bucket',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await cfnMockProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockLambdaInvoke).toHaveBeenCalledWith({
    FunctionName: 'arn:aws:lambda:here:123456789012:function:my-deployment-lambda',
    Payload: JSON.stringify({
      ...payloadWithoutCustomResProps,
      ResourceProperties: {
        SourceBucketNames: ['src-bucket'],
        SourceObjectKeys: [
          'src-key-old',
        ],
        DestinationBucketName: 'dest-bucket',
      },
    }),
  });
});
*/

test('does not call the invoke() API when a resource with type that is not Custom::CDKBucketDeployment but has the same properties is changed', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      S3Deployment: {
        Type: 'Custom::NotCDKBucketDeployment',
        Properties: {
          ServiceToken: 'a-lambda-arn',
          SourceBucketNames: ['src-bucket'],
          SourceObjectKeys: ['src-key-old'],
          DestinationBucketName: 'dest-bucket',
        },
      },
    },
  });
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        S3Deployment: {
          Type: 'Custom::NotCDKBucketDeployment',
          Properties: {
            ServiceToken: 'a-lambda-arn',
            SourceBucketNames: ['src-bucket'],
            SourceObjectKeys: ['src-key-new'],
            DestinationBucketName: 'dest-bucket',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await cfnMockProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockLambdaInvoke).not.toHaveBeenCalled();
});

test('does not call the invokeLambda() api if the updated Policy has no Roles', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      S3Deployment: {
        Type: 'Custom::CDKBucketDeployment',
        Properties: {
          ServiceToken: 'a-lambda-arn',
          SourceBucketNames: ['src-bucket'],
          SourceObjectKeys: ['src-key-old'],
          DestinationBucketName: 'dest-bucket',
        },
      },
      Policy: {
        Type: 'AWS::IAM::Policy',
        Properties: {
          PolicyDocument: {
            Statement: [
              {
                Action: ['s3:GetObject*'],
                Effect: 'Allow',
                Resource: {
                  'Fn::GetAtt': [
                    'WebsiteBucketOld',
                    'Arn',
                  ],
                },
              },
            ],
          },
        },
      },
    },
  });
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        S3Deployment: {
          Type: 'Custom::CDKBucketDeployment',
          Properties: {
            ServiceToken: 'a-lambda-arn',
            SourceBucketNames: ['src-bucket'],
            SourceObjectKeys: ['src-key-new'],
            DestinationBucketName: 'dest-bucket',
          },
        },
        Policy: {
          Type: 'AWS::IAM::Policy',
          Properties: {
            PolicyDocument: {
              Statement: [
                {
                  Action: ['s3:GetObject*'],
                  Effect: 'Allow',
                  Resource: {
                    'Fn::GetAtt': [
                      'WebsiteBucketNew',
                      'Arn',
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await cfnMockProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockLambdaInvoke).not.toHaveBeenCalled();
});

describe('old-style synthesis', () => {
  let serviceRole: any;
  let policy: any;
  let policy2: any;
  let deploymentLambda: any;
  let s3Deployment: any;
  beforeEach(() => {
    serviceRole = {
      Type: 'AWS::IAM::Role',
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
      },
    };

    policy = {
      Type: 'AWS::IAM::Policy',
      Properties: {
        Roles: [
          { Ref: 'ServiceRole' },
        ],
        PolicyDocument: {
          Statement: [
            {
              Action: ['s3:GetObject*'],
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': [
                  'WebsiteBucketOld',
                  'Arn',
                ],
              },
            },
          ],
        },
      },
    };

    policy2 = {
      Type: 'AWS::IAM::Policy',
      Properties: {
        Roles: [
          { Ref: 'ServiceRole' },
        ],
        PolicyDocument: {
          Statement: [
            {
              Action: ['s3:GetObject*'],
              Effect: 'Allow',
              Resource: {
                'Fn::GetAtt': [
                  'DifferentBucketOld',
                  'Arn',
                ],
              },
            },
          ],
        },
      },
    };

    deploymentLambda = {
      Type: 'AWS::Lambda::Function',
      Role: {
        'Fn::GetAtt': [
          'ServiceRole',
          'Arn',
        ],
      },
    };

    s3Deployment = {
      Type: 'Custom::CDKBucketDeployment',
      Properties: {
        ServiceToken: {
          'Fn::GetAtt': [
            'S3DeploymentLambda',
            'Arn',
          ],
        },
        SourceBucketNames: ['src-bucket-old'],
        SourceObjectKeys: ['src-key-old'],
        DestinationBucketName: 'WebsiteBucketOld',
      },
    };

    setup.pushStackResourceSummaries(
      setup.stackSummaryOf('S3DeploymentLambda', 'AWS::Lambda::Function', 'my-deployment-lambda'),
      setup.stackSummaryOf('ServiceRole', 'AWS::IAM::Role', 'my-service-role'),
    );
  });

  test('calls the lambdaInvoke() API when it receives an asset difference in an s3 bucket deployment and an IAM Policy difference using old-style synthesis', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        ServiceRole: serviceRole,
        Policy: policy,
        S3DeploymentLambda: deploymentLambda,
        S3Deployment: s3Deployment,
      },
    });

    s3Deployment.Properties.SourceBucketNames = ['src-bucket-new'];
    s3Deployment.Properties.SourceObjectKeys = ['src-key-new'];
    s3Deployment.Properties.DestinationBucketName = 'WebsiteBucketNew';

    policy.Properties.PolicyDocument.Statement[0].Resource = {
      'Fn::GetAtt': [
        'WebsiteBucketNew',
        'Arn',
      ],
    };

    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          ServiceRole: serviceRole,
          Policy: policy,
          S3DeploymentLambda: deploymentLambda,
          S3Deployment: s3Deployment,
        },
      },
    });

    // WHEN
    const deployStackResult = await cfnMockProvider.tryHotswapDeployment(cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockLambdaInvoke).toHaveBeenCalledWith({
      FunctionName: 'arn:aws:lambda:here:123456789012:function:my-deployment-lambda',
      Payload: JSON.stringify({
        ...payloadWithoutCustomResProps,
        ResourceProperties: {
          SourceBucketNames: ['src-bucket-new'],
          SourceObjectKeys: ['src-key-new'],
          DestinationBucketName: 'WebsiteBucketNew',
        },
      }),
    });
  });

  test('does not call the lambdaInvoke() API when the difference in the s3 deployment is referred to in one IAM policy change but not another', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        ServiceRole: serviceRole,
        Policy1: policy,
        Policy2: policy2,
        S3DeploymentLambda: deploymentLambda,
        S3Deployment: s3Deployment,
      },
    });

    policy.Properties.PolicyDocument.Statement[0].Resource = {
      'Fn::GetAtt': [
        'WebsiteBucketNew',
        'Arn',
      ],
    };

    policy2.Properties.PolicyDocument.Statement[0].Resource = {
      'Fn::GetAtt': [
        'DifferentBucketNew',
        'Arn',
      ],
    };
    policy2.Properties.Roles = [
      { Ref: 'ServiceRole' },
      'different-role',
    ];

    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          ServiceRole: serviceRole,
          Policy1: policy,
          Policy2: policy2,
          S3DeploymentLambda: deploymentLambda,
          S3Deployment: s3Deployment,
        },
      },
    });

    // WHEN
    const deployStackResult = await cfnMockProvider.tryHotswapDeployment(cdkStackArtifact);

    // THEN
    expect(deployStackResult).toBeUndefined();
    expect(mockLambdaInvoke).not.toHaveBeenCalled();
  });

  test('does not call the lambdaInvoke() API when the lambda that references the role is referred to by something other than an s3 deployment', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        ServiceRole: serviceRole,
        Policy: policy,
        S3DeploymentLambda: deploymentLambda,
        S3Deployment: s3Deployment,
        Endpoint: {
          Type: 'AWS::Lambda::Permission',
          Properties: {
            Action: 'lambda:InvokeFunction',
            FunctionName: {
              'Fn::GetAtt': [
                'S3DeploymentLambda',
                'Arn',
              ],
            },
            Principal: 'apigateway.amazonaws.com',
          },
        },
      },
    });

    policy.Properties.PolicyDocument.Statement[0].Resource = {
      'Fn::GetAtt': [
        'WebsiteBucketNew',
        'Arn',
      ],
    };

    s3Deployment.Properties.SourceBucketNames = ['src-bucket-new'];
    s3Deployment.Properties.SourceObjectKeys = ['src-key-new'];
    s3Deployment.Properties.DestinationBucketName = 'WebsiteBucketNew';

    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          ServiceRole: serviceRole,
          Policy: policy,
          S3DeploymentLambda: deploymentLambda,
          S3Deployment: s3Deployment,
          Endpoint: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
              Action: 'lambda:InvokeFunction',
              FunctionName: {
                'Fn::GetAtt': [
                  'S3DeploymentLambda',
                  'Arn',
                ],
              },
              Principal: 'apigateway.amazonaws.com',
            },
          },
        },
      },
    });

    // WHEN
    const deployStackResult = await cfnMockProvider.tryHotswapDeployment(cdkStackArtifact);

    // THEN
    expect(deployStackResult).toBeUndefined();
    expect(mockLambdaInvoke).not.toHaveBeenCalled();
  });

  test('calls the lambdaInvoke() API when it receives an asset difference in two s3 bucket deployments and IAM Policy differences using old-style synthesis', async () => {
    // GIVEN
    let s3Deployment2 = {
      Type: 'Custom::CDKBucketDeployment',
      Properties: {
        ServiceToken: {
          'Fn::GetAtt': [
            'S3DeploymentLambda2',
            'Arn',
          ],
        },
        SourceBucketNames: ['src-bucket-old'],
        SourceObjectKeys: ['src-key-old'],
        DestinationBucketName: 'DifferentBucketOld',
      },
    };

    policy2.Properties.Roles = [
      { Ref: 'ServiceRole2' },
    ];

    setup.setCurrentCfnStackTemplate({
      Resources: {
        ServiceRole: serviceRole,
        ServiceRole2: serviceRole,
        Policy1: policy,
        Policy2: policy2,
        S3DeploymentLambda: deploymentLambda,
        S3DeploymentLambda2: deploymentLambda,
        S3Deployment: s3Deployment,
        S3Deployment2: s3Deployment2,
      },
    });

    policy.Properties.PolicyDocument.Statement[0].Resource = {
      'Fn::GetAtt': [
        'WebsiteBucketNew',
        'Arn',
      ],
    };

    policy2.Properties.PolicyDocument.Statement[0].Resource = {
      'Fn::GetAtt': [
        'DifferentBucketNew',
        'Arn',
      ],
    };

    s3Deployment.Properties.SourceBucketNames = ['src-bucket-new'];
    s3Deployment.Properties.SourceObjectKeys = ['src-key-new'];
    s3Deployment.Properties.DestinationBucketName = 'WebsiteBucketNew';

    s3Deployment2.Properties.SourceBucketNames = ['src-bucket-new'];
    s3Deployment2.Properties.SourceObjectKeys = ['src-key-new'];
    s3Deployment2.Properties.DestinationBucketName = 'DifferentBucketNew';

    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          ServiceRole: serviceRole,
          ServiceRole2: serviceRole,
          Policy1: policy,
          Policy2: policy2,
          S3DeploymentLambda: deploymentLambda,
          S3DeploymentLambda2: deploymentLambda,
          S3Deployment: s3Deployment,
          S3Deployment2: s3Deployment2,
        },
      },
    });

    // WHEN
    setup.pushStackResourceSummaries(
      setup.stackSummaryOf('S3DeploymentLambda2', 'AWS::Lambda::Function', 'my-deployment-lambda-2'),
      setup.stackSummaryOf('ServiceRole2', 'AWS::IAM::Role', 'my-service-role-2'),
    );

    const deployStackResult = await cfnMockProvider.tryHotswapDeployment(cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();

    expect(mockLambdaInvoke).toHaveBeenCalledWith({
      FunctionName: 'arn:aws:lambda:here:123456789012:function:my-deployment-lambda',
      Payload: JSON.stringify({
        ...payloadWithoutCustomResProps,
        ResourceProperties: {
          SourceBucketNames: ['src-bucket-new'],
          SourceObjectKeys: ['src-key-new'],
          DestinationBucketName: 'WebsiteBucketNew',
        },
      }),
    });

    expect(mockLambdaInvoke).toHaveBeenCalledWith({
      FunctionName: 'arn:aws:lambda:here:123456789012:function:my-deployment-lambda-2',
      Payload: JSON.stringify({
        ...payloadWithoutCustomResProps,
        ResourceProperties: {
          SourceBucketNames: ['src-bucket-new'],
          SourceObjectKeys: ['src-key-new'],
          DestinationBucketName: 'DifferentBucketNew',
        },
      }),
    });
  });

  test('does not call the lambdaInvoke() API when it receives an asset difference in an s3 bucket deployment that references two different policies', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        ServiceRole: serviceRole,
        Policy1: policy,
        Policy2: policy2,
        S3DeploymentLambda: deploymentLambda,
        S3Deployment: s3Deployment,
      },
    });

    policy.Properties.PolicyDocument.Statement[0].Resource = {
      'Fn::GetAtt': [
        'WebsiteBucketNew',
        'Arn',
      ],
    };

    s3Deployment.Properties.SourceBucketNames = ['src-bucket-new'];
    s3Deployment.Properties.SourceObjectKeys = ['src-key-new'];
    s3Deployment.Properties.DestinationBucketName = 'WebsiteBucketNew';

    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          ServiceRole: serviceRole,
          Policy1: policy,
          Policy2: policy2,
          S3DeploymentLambda: deploymentLambda,
          S3Deployment: s3Deployment,
        },
      },
    });

    // WHEN
    const deployStackResult = await cfnMockProvider.tryHotswapDeployment(cdkStackArtifact);

    // THEN
    expect(deployStackResult).toBeUndefined();
    expect(mockLambdaInvoke).not.toHaveBeenCalled();
  });

  test('does not call the lambdaInvoke() API when a policy is referenced by a resource that is not an s3 deployment', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        ServiceRole: serviceRole,
        Policy1: policy,
        S3DeploymentLambda: deploymentLambda,
        S3Deployment: s3Deployment,
        NotADeployment: {
          Type: 'AWS::Not::S3Deployment',
          Properties: {
            Prop: {
              Ref: 'ServiceRole',
            },
          },
        },
      },
    });

    policy.Properties.PolicyDocument.Statement[0].Resource = {
      'Fn::GetAtt': [
        'WebsiteBucketNew',
        'Arn',
      ],
    };

    s3Deployment.Properties.SourceBucketNames = ['src-bucket-new'];
    s3Deployment.Properties.SourceObjectKeys = ['src-key-new'];
    s3Deployment.Properties.DestinationBucketName = 'WebsiteBucketNew';

    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          ServiceRole: serviceRole,
          Policy1: policy,
          S3DeploymentLambda: deploymentLambda,
          S3Deployment: s3Deployment,
          NotADeployment: {
            Type: 'AWS::Not::S3Deployment',
            Properties: {
              Prop: {
                Ref: 'ServiceRole',
              },
            },
          },
        },
      },
    });

    // WHEN
    const deployStackResult = await cfnMockProvider.tryHotswapDeployment(cdkStackArtifact);

    // THEN
    expect(deployStackResult).toBeUndefined();
    expect(mockLambdaInvoke).not.toHaveBeenCalled();
  });
});