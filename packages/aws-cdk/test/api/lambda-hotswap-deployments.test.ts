import { Lambda } from 'aws-sdk';
import { tryHotswapDeployment } from '../../lib/api/hotswap-deployments';
import * as setup from './hotswap-test-setup';

let mockUpdateLambdaCode: (params: Lambda.Types.UpdateFunctionCodeRequest) => Lambda.Types.FunctionConfiguration;

beforeEach(() => {
  setup.setupHotswapTests();
  mockUpdateLambdaCode = jest.fn();
  setup.mockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
  });
});

test('returns undefined when a new Lambda function is added to the Stack', async () => {
  // GIVEN
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await tryHotswapDeployment(setup.mockSdkProvider, {}, setup.currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
});

test('calls the updateLambdaCode() API when it receives only a code difference in a Lambda function', async () => {
  // GIVEN
  setup.currentCfnStack.setTemplate({
    Resources: {
      Func: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          Code: {
            S3Bucket: 'current-bucket',
            S3Key: 'current-key',
          },
          FunctionName: 'my-function',
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
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: 'current-bucket',
              S3Key: 'new-key',
            },
            FunctionName: 'my-function',
          },
          Metadata: {
            'aws:asset:path': 'new-path',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await tryHotswapDeployment(setup.mockSdkProvider, {}, setup.currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'my-function',
    S3Bucket: 'current-bucket',
    S3Key: 'new-key',
  });
});

test('calls the updateLambdaCode() API when it receives a code difference in a Lambda function with no name', async () => {
  // GIVEN
  setup.currentCfnStack.setTemplate({
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
          'aws:asset:path': 'old-path',
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
            'aws:asset:path': 'new-path',
          },
        },
      },
    },
  });

  // WHEN
  setup.currentCfnStackResources.push(setup.stackSummaryOf('Func', 'AWS::Lambda::Function', 'mock-function-resource-id'));
  const deployStackResult = await tryHotswapDeployment(setup.mockSdkProvider, {}, setup.currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'mock-function-resource-id',
    S3Bucket: 'current-bucket',
    S3Key: 'new-key',
  });
});

test('does not call the updateLambdaCode() API when it receives a change that is not a code difference in a Lambda function', async () => {
  // GIVEN
  setup.currentCfnStack.setTemplate({
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
  const deployStackResult = await tryHotswapDeployment(setup.mockSdkProvider, {}, setup.currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
});

test("correctly evaluates the function's name when it references a different resource from the template", async () => {
  // GIVEN
  setup.currentCfnStack.setTemplate({
    Resources: {
      Bucket: {
        Type: 'AWS::S3::Bucket',
      },
      Func: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          Code: {
            S3Bucket: 'current-bucket',
            S3Key: 'current-key',
          },
          FunctionName: {
            'Fn::Join': ['-', [
              'lambda',
              { Ref: 'Bucket' },
              'function',
            ]],
          },
        },
        Metadata: {
          'aws:asset:path': 'old-path',
        },
      },
    },
  });
  setup.currentCfnStackResources.push(setup.stackSummaryOf('Bucket', 'AWS::S3::Bucket', 'mybucket'));
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        Bucket: {
          Type: 'AWS::S3::Bucket',
        },
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: 'current-bucket',
              S3Key: 'new-key',
            },
            FunctionName: {
              'Fn::Join': ['-', [
                'lambda',
                { Ref: 'Bucket' },
                'function',
              ]],
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
  const deployStackResult = await tryHotswapDeployment(setup.mockSdkProvider, {}, setup.currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'lambda-mybucket-function',
    S3Bucket: 'current-bucket',
    S3Key: 'new-key',
  });
});

test("correctly falls back to taking the function's name from the current stack if it can't evaluate it in the template", async () => {
  // GIVEN
  setup.currentCfnStack.setTemplate({
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
  setup.currentCfnStackResources.push(setup.stackSummaryOf('Func', 'AWS::Lambda::Function', 'my-function'));
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
  const deployStackResult = await tryHotswapDeployment(setup.mockSdkProvider, {
    AssetBucketParam: 'asset-bucket',
  }, setup.currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'my-function',
    S3Bucket: 'asset-bucket',
    S3Key: 'new-key',
  });
});

test('does not call the updateLambdaCode() API when a resource with type that is not AWS::Lambda::Function but has the same properties is changed', async () => {
  // GIVEN
  setup.currentCfnStack.setTemplate({
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
  const deployStackResult = await tryHotswapDeployment(setup.mockSdkProvider, {}, setup.currentCfnStack, cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
});
