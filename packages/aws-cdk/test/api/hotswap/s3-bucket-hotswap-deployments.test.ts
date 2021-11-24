import { Lambda } from 'aws-sdk';
import { REQUIRED_BY_CFN } from '../../../lib/api/hotswap/s3-bucket-deployments';
import * as setup from './hotswap-test-setup';

let mockLambdaInvoke: (params: Lambda.Types.InvocationRequest) => Lambda.Types.InvocationResponse;
let cfnMockProvider: setup.CfnMockProvider;
let payload: { [key: string]: any};

beforeEach(() => {
  cfnMockProvider = setup.setupHotswapTests();
  mockLambdaInvoke = jest.fn();
  cfnMockProvider.setInvokeLambdaMock(mockLambdaInvoke);

  payload = {
    RequestType: 'Update',
    ResponseURL: REQUIRED_BY_CFN,
    PhysicalResourceId: REQUIRED_BY_CFN,
    StackId: REQUIRED_BY_CFN,
    RequestId: REQUIRED_BY_CFN,
    LogicalResourceId: REQUIRED_BY_CFN,
  };
});

test('returns undefined when a new S3 Deployment is added to the Stack', async () => {
  // GIVEN
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        Deployment: {
          Type: 'Custom::CDKBucketDeployment',
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await cfnMockProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
});

test('calls the lambdaInvoke() API when it receives only an asset difference in an s3 bucket deployment', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      S3Deployment: {
        Type: 'Custom::CDKBucketDeployment',
        Properties: {
          ServiceToken: 'a-lambda-arn',
          SourceBucketNames: [
            'src-bucket',
          ],
          SourceObjectKeys: [
            'src-key-old',
          ],
          DestinationBucketName: 'dest-bucket',
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
            SourceBucketNames: [
              'src-bucket',
            ],
            SourceObjectKeys: [
              'src-key-new',
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
  payload.ResourceProperties = {
    SourceBucketNames: [
      'src-bucket',
    ],
    SourceObjectKeys: [
      'src-key-new',
    ],
    DestinationBucketName: 'dest-bucket',
  };

  expect(mockLambdaInvoke).toHaveBeenCalledWith({
    FunctionName: 'a-lambda-arn',
    Payload: JSON.stringify(payload),
  });
});

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
          SourceBucketNames: [
            'src-bucket',
          ],
          SourceObjectKeys: [
            'src-key-old',
          ],
          DestinationBucketName: 'dest-bucket',
        },
        Metadata: {
          'aws:asset:path': 'old-path',
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
              'Fn::Join': ['-', [
                'lambda',
                { Ref: 'Lambda' },
                'function',
              ]],
            },
            SourceBucketNames: [
              'src-bucket',
            ],
            SourceObjectKeys: [
              'src-key-old',
            ],
            DestinationBucketName: 'dest-bucket',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await cfnMockProvider.tryHotswapDeployment(cdkStackArtifact);
  payload.ResourceProperties = {
    SourceBucketNames: [
      'src-bucket',
    ],
    SourceObjectKeys: [
      'src-key-old',
    ],
    DestinationBucketName: 'dest-bucket',
  };


  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockLambdaInvoke).toHaveBeenCalledWith({
    FunctionName: 'lambda-my-deployment-lambda-function',
    Payload: JSON.stringify(payload),
  });
});

test("will not perform a hotswap deployment if it cannot find a Ref target (outside the function's name)", async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Parameters: {
      BucketParam: { Type: 'String' },
    },
    Resources: {
      S3Deployment: {
        Type: 'Custom::CDKBucketDeployment',
        Properties: {
          ServiceToken: 'my-lambda',
          SourceBucketNames: [
            'src-bucket',
          ],
          SourceObjectKeys: [
            'src-key-old',
          ],
          DestinationBucketName: { 'Fn::Sub': '${BucketParam}' },
        },
      },
    },
  });
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Parameters: {
        BucketParam: { Type: 'String' },
      },
      Resources: {
        S3Deployment: {
          Type: 'Custom::CDKBucketDeployment',
          Properties: {
            ServiceToken: 'my-lambda',
            SourceBucketNames: [
              'src-bucket',
            ],
            SourceObjectKeys: [
              'src-key-new',
            ],
            DestinationBucketName: { 'Fn::Sub': '${BucketParam}' },
          },
        },
      },
    },
  });

  // THEN
  await expect(() =>
    cfnMockProvider.tryHotswapDeployment(cdkStackArtifact),
  ).rejects.toThrow(/Parameter or resource 'BucketParam' could not be found for evaluation/);
});

test("will not perform a hotswap deployment if it doesn't know how to handle a specific attribute (outside the function's name)", async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      Bucket: {
        Type: 'AWS::S3::Bucket',
      },
      S3Deployment: {
        Type: 'Custom::CDKBucketDeployment',
        Properties: {
          ServiceToken: 'my-lambda',
          SourceBucketNames: [
            'src-bucket',
          ],
          SourceObjectKeys: [
            'src-key-old',
          ],
          DestinationBucketName: 'website-bucket',
        },
      },
    },
  });
  setup.pushStackResourceSummaries(
    setup.stackSummaryOf('S3Deployment', 'Custom::CDKBucketDeployment', 'my-s3-deployment'),
    setup.stackSummaryOf('Bucket', 'AWS::S3::Bucket', 'asset-bucket'),
  );
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        Bucket: {
          Type: 'AWS::S3::Bucket',
        },
        S3Deployment: {
          Type: 'Custom::CDKBucketDeployment',
          Properties: {
            ServiceToken: 'my-lambda',
            SourceBucketNames: [
              { 'Fn::GetAtt': ['Bucket', 'UnknownAttribute'] },
            ],
            SourceObjectKeys: [
              'src-key-old',
            ],
            DestinationBucketName: 'website-bucket',
          },
        },
      },
    },
  });

  // THEN
  await expect(() =>
    cfnMockProvider.tryHotswapDeployment(cdkStackArtifact),
  ).rejects.toThrow("We don't support the 'UnknownAttribute' attribute of the 'AWS::S3::Bucket' resource. This is a CDK limitation. Please report it at https://github.com/aws/aws-cdk/issues/new/choose");
});

test('does not call the invoke() API when a resource with type that is not Custom::CDKBucketDeployment but has the same properties is changed', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      S3Deployment: {
        Type: 'Custom::NotCDKBucketDeployment',
        Properties: {
          ServiceToken: 'a-lambda-arn',
          SourceBucketNames: [
            'src-bucket',
          ],
          SourceObjectKeys: [
            'src-key-old',
          ],
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
            SourceBucketNames: [
              'src-bucket',
            ],
            SourceObjectKeys: [
              'src-key-new',
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
  expect(deployStackResult).toBeUndefined();
  expect(mockLambdaInvoke).not.toHaveBeenCalled();
});

test('can use the DestinationBucketKeyPrefix property', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      S3Deployment: {
        Type: 'Custom::CDKBucketDeployment',
        Properties: {
          ServiceToken: 'a-lambda-arn',
          SourceBucketNames: [
            'src-bucket',
          ],
          SourceObjectKeys: [
            'src-key-old',
          ],
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
            SourceBucketNames: [
              'src-bucket',
            ],
            SourceObjectKeys: [
              'src-key-new',
            ],
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
  payload.ResourceProperties = {
    SourceBucketNames: [
      'src-bucket',
    ],
    SourceObjectKeys: [
      'src-key-new',
    ],
    DestinationBucketName: 'dest-bucket',
    DestinationBucketKeyPrefix: 'my-key/some-new-prefix',
  };

  expect(mockLambdaInvoke).toHaveBeenCalledWith({
    FunctionName: 'a-lambda-arn',
    Payload: JSON.stringify(payload),
  });
});

test('does not call the invokeLambda() api if the updated Policy has no Roles', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      S3Deployment: {
        Type: 'Custom::CDKBucketDeployment',
        Properties: {
          ServiceToken: 'a-lambda-arn',
          SourceBucketNames: [
            'src-bucket',
          ],
          SourceObjectKeys: [
            'src-key-old',
          ],
          DestinationBucketName: 'dest-bucket',
        },
      },
      Policy: {
        Type: 'AWS::IAM::Policy',
        Properties: {
          PolicyDocument: {
            Statement: [
              {
                Action: [
                  's3:GetObject*',
                ],
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
        Policy: {
          Type: 'AWS::IAM::Policy',
          Properties: {
            S3Deployment: {
              Type: 'Custom::CDKBucketDeployment',
              Properties: {
                ServiceToken: 'a-lambda-arn',
                SourceBucketNames: [
                  'src-bucket',
                ],
                SourceObjectKeys: [
                  'src-key-new',
                ],
                DestinationBucketName: 'dest-bucket',
              },
            },
            PolicyDocument: {
              Statement: [
                {
                  Action: [
                    's3:GetObject*',
                  ],
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
              Action: [
                's3:GetObject*',
              ],
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
              Action: [
                's3:GetObject*',
              ],
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
        SourceBucketNames: [
          'src-bucket-old',
        ],
        SourceObjectKeys: [
          'src-key-old',
        ],
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
        'WebsiteBucketNewasdf',
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
    payload.ResourceProperties = {
      SourceBucketNames: [
        'src-bucket-new',
      ],
      SourceObjectKeys: [
        'src-key-new',
      ],
      DestinationBucketName: 'WebsiteBucketNew',
    };

    expect(mockLambdaInvoke).toHaveBeenCalledWith({
      FunctionName: 'arn:aws:lambda:here:123456789012:function:my-deployment-lambda',
      Payload: JSON.stringify(payload),
    });
    policy2;
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
    setup.pushStackResourceSummaries(
      setup.stackSummaryOf('S3DeploymentLambda', 'AWS::Lambda::Function', 'my-deployment-lambda'),
      setup.stackSummaryOf('ServiceRole', 'AWS::IAM::Role', 'my-service-role'),
    );

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

  test('calls the lambdaInvoke() API when it receives an asset difference in two s3 bucket deployments and IAM Policy differences using old-style synthesis', async () => {
    // GIVEN
    let s3Deployment2 = {
      Type: 'Custom::CDKBucketDeployment',
      Properties: {
        ServiceToken: {
          'Fn::GetAtt': [
            'S3DeploymentLambda',
            'Arn',
          ],
        },
        SourceBucketNames: [
          'src-bucket-old',
        ],
        SourceObjectKeys: [
          'src-key-old',
        ],
        DestinationBucketName: 'DifferentBucketOld',
      },
    };

    setup.setCurrentCfnStackTemplate({
      Resources: {
        ServiceRole: serviceRole,
        Policy1: policy,
        Policy2: policy2,
        S3DeploymentLambda: deploymentLambda,
        S3Deployment: s3Deployment,
        S3Deployment2: s3Deployment2,
      },
    });
    setup.pushStackResourceSummaries(
      setup.stackSummaryOf('S3DeploymentLambda', 'AWS::Lambda::Function', 'my-deployment-lambda'),
      setup.stackSummaryOf('ServiceRole', 'AWS::IAM::Role', 'my-service-role'),
    );

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
          Policy1: policy,
          Policy2: policy2,
          S3DeploymentLambda: deploymentLambda,
          S3Deployment: s3Deployment,
          S3Deployment2: s3Deployment2,
        },
      },
    });

    // WHEN
    const deployStackResult = await cfnMockProvider.tryHotswapDeployment(cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();

    payload.ResourceProperties = {
      SourceBucketNames: [
        'src-bucket-new',
      ],
      SourceObjectKeys: [
        'src-key-new',
      ],
      DestinationBucketName: 'WebsiteBucketNew',
    };

    expect(mockLambdaInvoke).toHaveBeenCalledWith({
      FunctionName: 'arn:aws:lambda:here:123456789012:function:my-deployment-lambda',
      Payload: JSON.stringify(payload),
    });

    payload.ResourceProperties.DestinationBucketName = 'DifferentBucketNew';;

    expect(mockLambdaInvoke).toHaveBeenCalledWith({
      FunctionName: 'arn:aws:lambda:here:123456789012:function:my-deployment-lambda',
      Payload: JSON.stringify(payload),
    });
  });
});