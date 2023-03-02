import { Lambda } from 'aws-sdk';
import * as setup from './hotswap-test-setup';
import { HotswapMode } from '../../../lib/api/hotswap/common';
import { REQUIRED_BY_CFN } from '../../../lib/api/hotswap/s3-bucket-deployments';

let mockLambdaInvoke: (params: Lambda.Types.InvocationRequest) => Lambda.Types.InvocationResponse;
let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;

const payloadWithoutCustomResProps = {
  RequestType: 'Update',
  ResponseURL: REQUIRED_BY_CFN,
  PhysicalResourceId: REQUIRED_BY_CFN,
  StackId: REQUIRED_BY_CFN,
  RequestId: REQUIRED_BY_CFN,
  LogicalResourceId: REQUIRED_BY_CFN,
};

beforeEach(() => {
  hotswapMockSdkProvider = setup.setupHotswapTests();
  mockLambdaInvoke = jest.fn();
  hotswapMockSdkProvider.setInvokeLambdaMock(mockLambdaInvoke);
});

describe.each([HotswapMode.FALL_BACK, HotswapMode.HOTSWAP_ONLY])('%p mode', (hotswapMode) => {
  test('calls the lambdaInvoke() API when it receives only an asset difference in an S3 bucket deployment and evaluates CFN expressions in S3 Deployment Properties', async () => {
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
              SourceObjectKeys: {
                'Fn::Split': [
                  '-',
                  'key1-key2-key3',
                ],
              },
              DestinationBucketName: 'dest-bucket',
              DestinationBucketKeyPrefix: 'my-key/some-new-prefix',
            },
          },
        },
      },
    });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();

    expect(mockLambdaInvoke).toHaveBeenCalledWith({
      FunctionName: 'a-lambda-arn',
      Payload: JSON.stringify({
        ...payloadWithoutCustomResProps,
        ResourceProperties: {
          SourceBucketNames: ['src-bucket'],
          SourceObjectKeys: ['key1', 'key2', 'key3'],
          DestinationBucketName: 'dest-bucket',
          DestinationBucketKeyPrefix: 'my-key/some-new-prefix',
        },
      }),
    });
  });

  test('does not call the invoke() API when a resource with type that is not Custom::CDKBucketDeployment but has the same properties is changed', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        S3Deployment: {
          Type: 'Custom::NotCDKBucketDeployment',
          Properties: {
            SourceObjectKeys: ['src-key-old'],
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
              SourceObjectKeys: ['src-key-new'],
            },
          },
        },
      },
    });

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockLambdaInvoke).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(deployStackResult?.noOp).toEqual(true);
      expect(mockLambdaInvoke).not.toHaveBeenCalled();
    }
  });

  test('does not call the invokeLambda() api if the updated Policy has no Roles in CLASSIC mode but does in HOTSWAP_ONLY mode', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Parameters: {
        WebsiteBucketParamOld: { Type: 'String' },
        WebsiteBucketParamNew: { Type: 'String' },
      },
      Resources: {
        S3Deployment: {
          Type: 'Custom::CDKBucketDeployment',
          Properties: {
            ServiceToken: 'a-lambda-arn',
            SourceObjectKeys: ['src-key-old'],
            SourceBucketNames: ['src-bucket'],
            DestinationBucketName: 'dest-bucket',
          },
        },
        Policy: {
          Type: 'AWS::IAM::Policy',
          Properties: {
            PolicyName: 'my-policy',
            PolicyDocument: {
              Statement: [
                {
                  Action: ['s3:GetObject*'],
                  Effect: 'Allow',
                  Resource: {
                    Ref: 'WebsiteBucketParamOld',
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
        Parameters: {
          WebsiteBucketParamOld: { Type: 'String' },
          WebsiteBucketParamNew: { Type: 'String' },
        },
        Resources: {
          S3Deployment: {
            Type: 'Custom::CDKBucketDeployment',
            Properties: {
              ServiceToken: 'a-lambda-arn',
              SourceObjectKeys: ['src-key-new'],
              SourceBucketNames: ['src-bucket'],
              DestinationBucketName: 'dest-bucket',
            },
          },
          Policy: {
            Type: 'AWS::IAM::Policy',
            Properties: {
              PolicyName: 'my-policy',
              PolicyDocument: {
                Statement: [
                  {
                    Action: ['s3:GetObject*'],
                    Effect: 'Allow',
                    Resource: {
                      Ref: 'WebsiteBucketParamNew',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    });

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockLambdaInvoke).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(mockLambdaInvoke).toHaveBeenCalledWith({
        FunctionName: 'a-lambda-arn',
        Payload: JSON.stringify({
          ...payloadWithoutCustomResProps,
          ResourceProperties: {
            SourceObjectKeys: ['src-key-new'],
            SourceBucketNames: ['src-bucket'],
            DestinationBucketName: 'dest-bucket',
          },
        }),
      });
    }
  });

  test('throws an error when the serviceToken fails evaluation in the template', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        S3Deployment: {
          Type: 'Custom::CDKBucketDeployment',
          Properties: {
            ServiceToken: {
              Ref: 'BadLamba',
            },
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
            Type: 'Custom::CDKBucketDeployment',
            Properties: {
              ServiceToken: {
                Ref: 'BadLamba',
              },
              SourceBucketNames: ['src-bucket'],
              SourceObjectKeys: ['src-key-new'],
              DestinationBucketName: 'dest-bucket',
            },
          },
        },
      },
    });

    // WHEN
    await expect(() =>
      hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact),
    ).rejects.toThrow(/Parameter or resource 'BadLamba' could not be found for evaluation/);

    expect(mockLambdaInvoke).not.toHaveBeenCalled();
  });

  describe('old-style synthesis', () => {
    const parameters = {
      WebsiteBucketParamOld: { Type: 'String' },
      WebsiteBucketParamNew: { Type: 'String' },
      DifferentBucketParamNew: { Type: 'String' },
    };

    const serviceRole = {
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

    const policyOld = {
      Type: 'AWS::IAM::Policy',
      Properties: {
        PolicyName: 'my-policy-old',
        Roles: [
          { Ref: 'ServiceRole' },
        ],
        PolicyDocument: {
          Statement: [
            {
              Action: ['s3:GetObject*'],
              Effect: 'Allow',
              Resource: {
                Ref: 'WebsiteBucketParamOld',
              },
            },
          ],
        },
      },
    };

    const policyNew = {
      Type: 'AWS::IAM::Policy',
      Properties: {
        PolicyName: 'my-policy-new',
        Roles: [
          { Ref: 'ServiceRole' },
        ],
        PolicyDocument: {
          Statement: [
            {
              Action: ['s3:GetObject*'],
              Effect: 'Allow',
              Resource: {
                Ref: 'WebsiteBucketParamNew',
              },
            },
          ],
        },
      },
    };

    const policy2Old = {
      Type: 'AWS::IAM::Policy',
      Properties: {
        PolicyName: 'my-policy-old-2',
        Roles: [
          { Ref: 'ServiceRole' },
        ],
        PolicyDocument: {
          Statement: [
            {
              Action: ['s3:GetObject*'],
              Effect: 'Allow',
              Resource: {
                Ref: 'WebsiteBucketParamOld',
              },
            },
          ],
        },
      },
    };

    const policy2New = {
      Type: 'AWS::IAM::Policy',
      Properties: {
        PolicyName: 'my-policy-new-2',
        Roles: [
          { Ref: 'ServiceRole2' },
        ],
        PolicyDocument: {
          Statement: [
            {
              Action: ['s3:GetObject*'],
              Effect: 'Allow',
              Resource: {
                Ref: 'DifferentBucketParamOld',
              },
            },
          ],
        },
      },
    };

    const deploymentLambda = {
      Type: 'AWS::Lambda::Function',
      Role: {
        'Fn::GetAtt': [
          'ServiceRole',
          'Arn',
        ],
      },
    };

    const s3DeploymentOld = {
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

    const s3DeploymentNew = {
      Type: 'Custom::CDKBucketDeployment',
      Properties: {
        ServiceToken: {
          'Fn::GetAtt': [
            'S3DeploymentLambda',
            'Arn',
          ],
        },
        SourceBucketNames: ['src-bucket-new'],
        SourceObjectKeys: ['src-key-new'],
        DestinationBucketName: 'WebsiteBucketNew',
      },
    };

    beforeEach(() => {
      setup.pushStackResourceSummaries(
        setup.stackSummaryOf('S3DeploymentLambda', 'AWS::Lambda::Function', 'my-deployment-lambda'),
        setup.stackSummaryOf('ServiceRole', 'AWS::IAM::Role', 'my-service-role'),
      );
    });

    test('calls the lambdaInvoke() API when it receives an asset difference in an S3 bucket deployment and an IAM Policy difference using old-style synthesis', async () => {
      // GIVEN
      setup.setCurrentCfnStackTemplate({
        Resources: {
          Parameters: parameters,
          ServiceRole: serviceRole,
          Policy: policyOld,
          S3DeploymentLambda: deploymentLambda,
          S3Deployment: s3DeploymentOld,
        },
      });

      const cdkStackArtifact = setup.cdkStackArtifactOf({
        template: {
          Resources: {
            Parameters: parameters,
            ServiceRole: serviceRole,
            Policy: policyNew,
            S3DeploymentLambda: deploymentLambda,
            S3Deployment: s3DeploymentNew,
          },
        },
      });

      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact, { WebsiteBucketParamOld: 'WebsiteBucketOld', WebsiteBucketParamNew: 'WebsiteBucketNew' });

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

    test(`does not call the lambdaInvoke() API when the difference in the S3 deployment is referred to in one IAM policy change but not another
          in CLASSIC mode but does in HOTSWAP_ONLY`,
    async () => {
      // GIVEN
      setup.setCurrentCfnStackTemplate({
        Resources: {
          ServiceRole: serviceRole,
          Policy1: policyOld,
          Policy2: policy2Old,
          S3DeploymentLambda: deploymentLambda,
          S3Deployment: s3DeploymentOld,
        },
      });

      const cdkStackArtifact = setup.cdkStackArtifactOf({
        template: {
          Resources: {
            ServiceRole: serviceRole,
            Policy1: policyNew,
            Policy2: {
              Properties: {
                Roles: [
                  { Ref: 'ServiceRole' },
                  'different-role',
                ],
                PolicyDocument: {
                  Statement: [
                    {
                      Action: ['s3:GetObject*'],
                      Effect: 'Allow',
                      Resource: {
                        'Fn::GetAtt': [
                          'DifferentBucketNew',
                          'Arn',
                        ],
                      },
                    },
                  ],
                },
              },
            },
            S3DeploymentLambda: deploymentLambda,
            S3Deployment: s3DeploymentNew,
          },
        },
      });

      if (hotswapMode === HotswapMode.FALL_BACK) {
        // WHEN
        const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

        // THEN
        expect(deployStackResult).toBeUndefined();
        expect(mockLambdaInvoke).not.toHaveBeenCalled();
      } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
        // WHEN
        const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

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
      }
    });

    test(`does not call the lambdaInvoke() API when the lambda that references the role is referred to by something other than an S3 deployment
          in CLASSIC mode but does in HOTSWAP_ONLY mode`,
    async () => {
      // GIVEN
      setup.setCurrentCfnStackTemplate({
        Resources: {
          ServiceRole: serviceRole,
          Policy: policyOld,
          S3DeploymentLambda: deploymentLambda,
          S3Deployment: s3DeploymentOld,
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

      const cdkStackArtifact = setup.cdkStackArtifactOf({
        template: {
          Resources: {
            ServiceRole: serviceRole,
            Policy: policyNew,
            S3DeploymentLambda: deploymentLambda,
            S3Deployment: s3DeploymentNew,
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

      if (hotswapMode === HotswapMode.FALL_BACK) {
        // WHEN
        const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

        // THEN
        expect(deployStackResult).toBeUndefined();
        expect(mockLambdaInvoke).not.toHaveBeenCalled();
      } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
        // WHEN
        const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

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
      }
    });

    test('calls the lambdaInvoke() API when it receives an asset difference in two S3 bucket deployments and IAM Policy differences using old-style synthesis', async () => {
      // GIVEN
      const s3Deployment2Old = {
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

      const s3Deployment2New = {
        Type: 'Custom::CDKBucketDeployment',
        Properties: {
          ServiceToken: {
            'Fn::GetAtt': [
              'S3DeploymentLambda2',
              'Arn',
            ],
          },
          SourceBucketNames: ['src-bucket-new'],
          SourceObjectKeys: ['src-key-new'],
          DestinationBucketName: 'DifferentBucketNew',
        },
      };

      setup.setCurrentCfnStackTemplate({
        Resources: {
          ServiceRole: serviceRole,
          ServiceRole2: serviceRole,
          Policy1: policyOld,
          Policy2: policy2Old,
          S3DeploymentLambda: deploymentLambda,
          S3DeploymentLambda2: deploymentLambda,
          S3Deployment: s3DeploymentOld,
          S3Deployment2: s3Deployment2Old,
        },
      });

      const cdkStackArtifact = setup.cdkStackArtifactOf({
        template: {
          Resources: {
            Parameters: parameters,
            ServiceRole: serviceRole,
            ServiceRole2: serviceRole,
            Policy1: policyNew,
            Policy2: policy2New,
            S3DeploymentLambda: deploymentLambda,
            S3DeploymentLambda2: deploymentLambda,
            S3Deployment: s3DeploymentNew,
            S3Deployment2: s3Deployment2New,
          },
        },
      });

      // WHEN
      setup.pushStackResourceSummaries(
        setup.stackSummaryOf('S3DeploymentLambda2', 'AWS::Lambda::Function', 'my-deployment-lambda-2'),
        setup.stackSummaryOf('ServiceRole2', 'AWS::IAM::Role', 'my-service-role-2'),
      );

      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact, {
        WebsiteBucketParamOld: 'WebsiteBucketOld',
        WebsiteBucketParamNew: 'WebsiteBucketNew',
        DifferentBucketParamNew: 'WebsiteBucketNew',
      });

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

    test(`does not call the lambdaInvoke() API when it receives an asset difference in an S3 bucket deployment that references two different policies
          in CLASSIC mode but does in HOTSWAP_ONLY mode`,
    async () => {
      // GIVEN
      setup.setCurrentCfnStackTemplate({
        Resources: {
          ServiceRole: serviceRole,
          Policy1: policyOld,
          Policy2: policy2Old,
          S3DeploymentLambda: deploymentLambda,
          S3Deployment: s3DeploymentOld,
        },
      });

      const cdkStackArtifact = setup.cdkStackArtifactOf({
        template: {
          Resources: {
            ServiceRole: serviceRole,
            Policy1: policyNew,
            Policy2: {
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
                          'DifferentBucketNew',
                          'Arn',
                        ],
                      },
                    },
                  ],
                },
              },
            },
            S3DeploymentLambda: deploymentLambda,
            S3Deployment: s3DeploymentNew,
          },
        },
      });

      if (hotswapMode === HotswapMode.FALL_BACK) {
        // WHEN
        const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

        // THEN
        expect(deployStackResult).toBeUndefined();
        expect(mockLambdaInvoke).not.toHaveBeenCalled();
      } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
        // WHEN
        const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

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
      }
    });

    test(`does not call the lambdaInvoke() API when a policy is referenced by a resource that is not an S3 deployment
          in CLASSIC mode but does in HOTSWAP_ONLY mode`,
    async () => {
      // GIVEN
      setup.setCurrentCfnStackTemplate({
        Resources: {
          ServiceRole: serviceRole,
          Policy1: policyOld,
          S3DeploymentLambda: deploymentLambda,
          S3Deployment: s3DeploymentOld,
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

      const cdkStackArtifact = setup.cdkStackArtifactOf({
        template: {
          Resources: {
            ServiceRole: serviceRole,
            Policy1: policyNew,
            S3DeploymentLambda: deploymentLambda,
            S3Deployment: s3DeploymentNew,
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

      if (hotswapMode === HotswapMode.FALL_BACK) {
        // WHEN
        const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

        // THEN
        expect(deployStackResult).toBeUndefined();
        expect(mockLambdaInvoke).not.toHaveBeenCalled();
      } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
        // WHEN
        const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

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
      }
    });
  });
});
