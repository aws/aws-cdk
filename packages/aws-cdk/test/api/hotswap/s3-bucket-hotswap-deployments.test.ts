import { Lambda } from 'aws-sdk';
import { REQUIRED_BY_CFN } from '../../../lib/api/hotswap/s3-bucket-deployments';
import * as setup from './hotswap-test-setup';

let mockLambdaInvoke: (params: Lambda.Types.InvocationRequest) => Lambda.Types.InvocationResponse;
let cfnMockProvider: setup.CfnMockProvider;
let payload: { [key: string]: any};

beforeEach(() => {
  cfnMockProvider = setup.setupHotswapTests();
  mockLambdaInvoke = jest.fn();
  cfnMockProvider.setLambdaInvocationMock(mockLambdaInvoke);

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

test('calls the lambdaInvoke() API when it receives an asset difference in an s3 bucket deployment and an IAM Policy difference using old-style synthesis', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
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
      S3Deployment: {
        Type: 'Custom::CDKBucketDeployment',
        Properties: {
          ServiceToken: 'a-lambda-arn',
          SourceBucketNames: [
            'src-bucket-old',
          ],
          SourceObjectKeys: [
            'src-key-old',
          ],
          DestinationBucketName: 'WebsiteBucketOld',
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
            PolicyDocument: {
              Statement: [
                {
                  Action: [
                    's3:GetObject*',
                  ],
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
        S3Deployment: {
          Type: 'Custom::CDKBucketDeployment',
          Properties: {
            ServiceToken: 'a-lambda-arn',
            SourceBucketNames: [
              'src-bucket-new',
            ],
            SourceObjectKeys: [
              'src-key-new',
            ],
            DestinationBucketName: 'WebsiteBucketNew',
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
      'src-bucket-new',
    ],
    SourceObjectKeys: [
      'src-key-new',
    ],
    DestinationBucketName: 'WebsiteBucketNew',
  };

  expect(mockLambdaInvoke).toHaveBeenCalledWith({
    FunctionName: 'a-lambda-arn',
    Payload: JSON.stringify(payload),
  });
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


test('does not call the lambdaInvoke() API when the difference in the s3 deployment is not referred to in the IAM policy change', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
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
      S3Deployment: {
        Type: 'Custom::CDKBucketDeployment',
        Properties: {
          ServiceToken: 'a-lambda-arn',
          SourceBucketNames: [
            'src-bucket-old',
          ],
          SourceObjectKeys: [
            'src-key-old',
          ],
          DestinationBucketName: 'DifferentBucketOld',
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
            PolicyDocument: {
              Statement: [
                {
                  Action: [
                    's3:GetObject*',
                  ],
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
        S3Deployment: {
          Type: 'Custom::CDKBucketDeployment',
          Properties: {
            ServiceToken: 'a-lambda-arn',
            SourceBucketNames: [
              'src-bucket-new',
            ],
            SourceObjectKeys: [
              'src-key-new',
            ],
            DestinationBucketName: 'DifferentBucketNew',
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