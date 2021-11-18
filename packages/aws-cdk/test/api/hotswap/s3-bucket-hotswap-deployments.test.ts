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
/*eslint-disable*/

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
            'src-bucket'
          ],
          SourceObjectKeys: [
            'src-key-old'
          ],
          DestinationBucketName: 'dest-bucket',
          //DestinationBucketKeyPrefix
        },
        Metadata: {
          'aws:asset:path': 'old-path',
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
              'src-bucket'
            ],
            SourceObjectKeys: [
              'src-key-new'
            ],
            DestinationBucketName: 'dest-bucket',
            //DestinationBucketKeyPrefix
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

test("correctly evaluates the service token when it references a lambda found in the template", async () => {
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
            'src-bucket'
          ],
          SourceObjectKeys: [
            'src-key-old'
          ],
          DestinationBucketName: 'dest-bucket',
          //DestinationBucketKeyPrefix
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
              'src-bucket'
            ],
            SourceObjectKeys: [
              'src-key-old'
            ],
            DestinationBucketName: 'dest-bucket',
            //DestinationBucketKeyPrefix
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


/*
// TODO
test("correctly falls back to taking the service token from the current stack if it can't evaluate it in the template", async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Parameters: {
      Param1: { Type: 'String' },
      AssetBucketParam: { Type: 'String' },
    },
    Resources: {
      Func: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          Code: {
            S3Bucket: { Ref: 'AssetBucketParam' },
            S3Key: 'current-key',
          },
          FunctionName: { Ref: 'Param1' },
        },
        Metadata: {
          'aws:asset:path': 'old-path',
        },
      },
    },
  });
  setup.pushStackResourceSummaries(setup.stackSummaryOf('Func', 'AWS::Lambda::Function', 'my-function'));
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Parameters: {
        Param1: { Type: 'String' },
        AssetBucketParam: { Type: 'String' },
      },
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: { Ref: 'AssetBucketParam' },
              S3Key: 'new-key',
            },
            FunctionName: { Ref: 'Param1' },
          },
          Metadata: {
            'aws:asset:path': 'new-path',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await cfnMockProvider.tryHotswapDeployment(cdkStackArtifact, { AssetBucketParam: 'asset-bucket' });

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockLambdaInvoke).toHaveBeenCalledWith({
    FunctionName: 'my-function',
    S3Bucket: 'asset-bucket',
    S3Key: 'new-key',
  });
});
*/

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
            'src-bucket'
          ],
          SourceObjectKeys: [
            'src-key-old'
          ],
          DestinationBucketName: { 'Fn::Sub': '${BucketParam}' },
          //DestinationBucketKeyPrefix
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
              'src-bucket'
            ],
            SourceObjectKeys: [
              'src-key-new'
            ],
            DestinationBucketName: { 'Fn::Sub': '${BucketParam}' },
            //DestinationBucketKeyPrefix
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
            'src-bucket'
          ],
          SourceObjectKeys: [
            'src-key-old'
          ],
          DestinationBucketName: 'website-bucket',
          //DestinationBucketKeyPrefix
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
              'src-key-old'
            ],
            DestinationBucketName: 'website-bucket',
            //DestinationBucketKeyPrefix
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

  /*
  test('calls the updateLambdaCode() API when it receives a code difference in a Lambda function with no name', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: 'current-bucket',
              S3Key: 'current-key',
            },
          },
          Metadata: {
            'aws:asset:path': 'current-path',
          },
        },
      },
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          Func: {
            Type: 'AWS::Lambda::Function',
            Properties: {
              Code: {
                S3Bucket: 'current-bucket',
                S3Key: 'new-key',
              },
            },
            Metadata: {
              'aws:asset:path': 'current-path',
            },
          },
        },
      },
    });

    // WHEN
    setup.pushStackResourceSummaries(setup.stackSummaryOf('Func', 'AWS::Lambda::Function', 'mock-function-resource-id'));
    const deployStackResult = await cfnMockProvider.tryHotswapDeployment(cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
      FunctionName: 'mock-function-resource-id',
      S3Bucket: 'current-bucket',
      S3Key: 'new-key',
    });
  });

  /*
  test('does not call the updateLambdaCode() API when it receives a change that is not a code difference in a Lambda function', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: 'current-bucket',
              S3Key: 'current-key',
            },
            PackageType: 'Zip',
          },
        },
      },
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          Func: {
            Type: 'AWS::Lambda::Function',
            Properties: {
              Code: {
                S3Bucket: 'current-bucket',
                S3Key: 'current-key',
              },
              PackageType: 'Image',
            },
          },
        },
      },
    });
  
    // WHEN
    const deployStackResult = await cfnMockProvider.tryHotswapDeployment(cdkStackArtifact);
  
    // THEN
    expect(deployStackResult).toBeUndefined();
    expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
  });
  
  test('does not call the updateLambdaCode() API when a resource with type that is not AWS::Lambda::Function but has the same properties is changed', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        Func: {
          Type: 'AWS::NotLambda::NotAFunction',
          Properties: {
            Code: {
              S3Bucket: 'current-bucket',
              S3Key: 'current-key',
            },
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    });
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          Func: {
            Type: 'AWS::NotLambda::NotAFunction',
            Properties: {
              Code: {
                S3Bucket: 'current-bucket',
                S3Key: 'new-key',
              },
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

    // THEN
    expect(deployStackResult).toBeUndefined();
    expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
  });*/