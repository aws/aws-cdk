import { Lambda } from 'aws-sdk';
import * as setup from './hotswap-test-setup';

let mockUpdateLambdaCode: (params: Lambda.Types.UpdateFunctionCodeRequest) => Lambda.Types.FunctionConfiguration;
let mockUpdateLambdaConfiguration: (
  params: Lambda.Types.UpdateFunctionConfigurationRequest
) => Lambda.Types.FunctionConfiguration;
let mockTagResource: (params: Lambda.Types.TagResourceRequest) => {};
let mockUntagResource: (params: Lambda.Types.UntagResourceRequest) => {};
let mockMakeRequest: (operation: string, params: any) => AWS.Request<any, AWS.AWSError>;
let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;

beforeEach(() => {
  hotswapMockSdkProvider = setup.setupHotswapTests();
  mockUpdateLambdaCode = jest.fn().mockReturnValue({});
  mockUpdateLambdaConfiguration = jest.fn().mockReturnValue({});
  mockTagResource = jest.fn();
  mockUntagResource = jest.fn();
  mockMakeRequest = jest.fn().mockReturnValue({
    promise: () => Promise.resolve({}),
    response: {},
    addListeners: () => {},
  });
  hotswapMockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
    updateFunctionConfiguration: mockUpdateLambdaConfiguration,
    tagResource: mockTagResource,
    untagResource: mockUntagResource,
  }, {
    makeRequest: mockMakeRequest,
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
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
});

test('calls the updateLambdaCode() API when it receives only a code difference in a Lambda function', async () => {
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
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'my-function',
    S3Bucket: 'current-bucket',
    S3Key: 'new-key',
  });
});

test('calls the tagResource() API when it receives only a tag difference in a Lambda function', async () => {
  // GIVEN
  const currentTemplate = {
    Resources: {
      Func: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          Code: {
            S3Bucket: 'current-bucket',
            S3Key: 'current-key',
          },
          FunctionName: 'my-function',
          Tags: [
            {
              Key: 'to-be-deleted',
              Value: 'a-value',
            },
            {
              Key: 'to-be-changed',
              Value: 'current-tag-value',
            },
          ],
        },
        Metadata: {
          'aws:asset:path': 'old-path',
        },
      },
    },
  };

  setup.setCurrentCfnStackTemplate(currentTemplate);
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
            FunctionName: 'my-function',
            Tags: [
              {
                Key: 'to-be-changed',
                Value: 'new-tag-value',
              },
              {
                Key: 'to-be-added',
                Value: 'added-tag-value',
              },
            ],
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();

  expect(mockUntagResource).toHaveBeenCalledWith({
    Resource: 'arn:aws:lambda:here:123456789012:function:my-function',
    TagKeys: ['to-be-deleted'],
  });

  expect(mockTagResource).toHaveBeenCalledWith({
    Resource: 'arn:aws:lambda:here:123456789012:function:my-function',
    Tags: {
      'to-be-changed': 'new-tag-value',
      'to-be-added': 'added-tag-value',
    },
  });

  expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
});

test("correctly evaluates the function's name when it references a different resource from the template", async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
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
  setup.pushStackResourceSummaries(setup.stackSummaryOf('Bucket', 'AWS::S3::Bucket', 'mybucket'));
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
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

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
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact, { AssetBucketParam: 'asset-bucket' });

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'my-function',
    S3Bucket: 'asset-bucket',
    S3Key: 'new-key',
  });
});

test("will not perform a hotswap deployment if it cannot find a Ref target (outside the function's name)", async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Parameters: {
      Param1: { Type: 'String' },
    },
    Resources: {
      Func: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          Code: {
            S3Bucket: { 'Fn::Sub': '${Param1}' },
            S3Key: 'current-key',
          },
        },
        Metadata: {
          'aws:asset:path': 'old-path',
        },
      },
    },
  });
  setup.pushStackResourceSummaries(setup.stackSummaryOf('Func', 'AWS::Lambda::Function', 'my-func'));
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Parameters: {
        Param1: { Type: 'String' },
      },
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: { 'Fn::Sub': '${Param1}' },
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

  // THEN
  await expect(() =>
    hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact),
  ).rejects.toThrow(/Parameter or resource 'Param1' could not be found for evaluation/);
});

test("will not perform a hotswap deployment if it doesn't know how to handle a specific attribute (outside the function's name)", async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      Bucket: {
        Type: 'AWS::S3::Bucket',
      },
      Func: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          Code: {
            S3Bucket: { 'Fn::GetAtt': ['Bucket', 'UnknownAttribute'] },
            S3Key: 'current-key',
          },
        },
        Metadata: {
          'aws:asset:path': 'old-path',
        },
      },
    },
  });
  setup.pushStackResourceSummaries(
    setup.stackSummaryOf('Func', 'AWS::Lambda::Function', 'my-func'),
    setup.stackSummaryOf('Bucket', 'AWS::S3::Bucket', 'my-bucket'),
  );
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
              S3Bucket: { 'Fn::GetAtt': ['Bucket', 'UnknownAttribute'] },
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

  // THEN
  await expect(() =>
    hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact),
  ).rejects.toThrow("We don't support the 'UnknownAttribute' attribute of the 'AWS::S3::Bucket' resource. This is a CDK limitation. Please report it at https://github.com/aws/aws-cdk/issues/new/choose");
});

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
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

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
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

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
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
});

test('calls getFunction() after function code is updated with delay 1', async () => {
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
  await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(mockMakeRequest).toHaveBeenCalledWith('getFunction', { FunctionName: 'my-function' });
  expect(hotswapMockSdkProvider.getLambdaApiWaiters()).toEqual(expect.objectContaining({
    updateFunctionPropertiesToFinish: expect.objectContaining({
      name: 'UpdateFunctionPropertiesToFinish',
      delay: 1,
    }),
  }));
});

test('calls getFunction() after function code is updated and VpcId is empty string with delay 1', async () => {
  // GIVEN
  mockUpdateLambdaCode = jest.fn().mockReturnValue({
    VpcConfig: {
      VpcId: '',
    },
  });
  hotswapMockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
    tagResource: mockTagResource,
    untagResource: mockUntagResource,
  });
  setup.setCurrentCfnStackTemplate({
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
  await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(hotswapMockSdkProvider.getLambdaApiWaiters()).toEqual(expect.objectContaining({
    updateFunctionPropertiesToFinish: expect.objectContaining({
      name: 'UpdateFunctionPropertiesToFinish',
      delay: 1,
    }),
  }));
});

test('calls getFunction() after function code is updated on a VPC function with delay 5', async () => {
  // GIVEN
  mockUpdateLambdaCode = jest.fn().mockReturnValue({
    VpcConfig: {
      VpcId: 'abc',
    },
  });
  hotswapMockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
    tagResource: mockTagResource,
    untagResource: mockUntagResource,
  });
  setup.setCurrentCfnStackTemplate({
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
  await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(hotswapMockSdkProvider.getLambdaApiWaiters()).toEqual(expect.objectContaining({
    updateFunctionPropertiesToFinish: expect.objectContaining({
      name: 'UpdateFunctionPropertiesToFinish',
      delay: 5,
    }),
  }));
});


test('calls the updateLambdaConfiguration() API when it receives difference in Description field of a Lambda function', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      Func: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          Code: {
            S3Bucket: 's3-bucket',
            S3Key: 's3-key',
          },
          FunctionName: 'my-function',
          Description: 'Old Description',
        },
        Metadata: {
          'aws:asset:path': 'asset-path',
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
              S3Bucket: 's3-bucket',
              S3Key: 's3-key',
            },
            FunctionName: 'my-function',
            Description: 'New Description',
          },
          Metadata: {
            'aws:asset:path': 'asset-path',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateLambdaConfiguration).toHaveBeenCalledWith({
    FunctionName: 'my-function',
    Description: 'New Description',
  });
});

test('calls the updateLambdaConfiguration() API when it receives difference in Environment field of a Lambda function', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      Func: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          Code: {
            S3Bucket: 's3-bucket',
            S3Key: 's3-key',
          },
          FunctionName: 'my-function',
          Environment: {
            Variables: {
              Key1: 'Value1',
              Key2: 'Value2',
            },
          },
        },
        Metadata: {
          'aws:asset:path': 'asset-path',
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
              S3Bucket: 's3-bucket',
              S3Key: 's3-key',
            },
            FunctionName: 'my-function',
            Environment: {
              Variables: {
                Key1: 'Value1',
                Key2: 'Value2',
                NewKey: 'NewValue',
              },
            },
          },
          Metadata: {
            'aws:asset:path': 'asset-path',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateLambdaConfiguration).toHaveBeenCalledWith({
    FunctionName: 'my-function',
    Environment: {
      Variables: {
        Key1: 'Value1',
        Key2: 'Value2',
        NewKey: 'NewValue',
      },
    },
  });
});

test('calls both updateLambdaCode() and updateLambdaConfiguration() API when it receives both code and configuration change', async () => {
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
          FunctionName: 'my-function',
          Description: 'Old Description',
        },
        Metadata: {
          'aws:asset:path': 'asset-path',
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
              S3Bucket: 'new-bucket',
              S3Key: 'new-key',
            },
            FunctionName: 'my-function',
            Description: 'New Description',
          },
          Metadata: {
            'aws:asset:path': 'asset-path',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateLambdaConfiguration).toHaveBeenCalledWith({
    FunctionName: 'my-function',
    Description: 'New Description',
  });
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'my-function',
    S3Bucket: 'new-bucket',
    S3Key: 'new-key',
  });
});

test('Lambda hotswap works properly with changes of environment variables, description, tags with tokens', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      EventBus: {
        Type: 'AWS::Events::EventBus',
        Properties: {
          Name: 'my-event-bus',
        },
      },
      Func: {
        Type: 'AWS::Lambda::Function',
        Properties: {
          Code: {
            S3Bucket: 's3-bucket',
            S3Key: 's3-key',
          },
          FunctionName: 'my-function',
          Environment: {
            Variables: {
              token: { 'Fn::GetAtt': ['EventBus', 'Arn'] },
              literal: 'oldValue',
            },
          },
          Description: {
            'Fn::Join': ['', [
              'oldValue',
              { 'Fn::GetAtt': ['EventBus', 'Arn'] },
            ]],
          },
          Tags: [
            {
              Key: 'token',
              Value: { 'Fn::GetAtt': ['EventBus', 'Arn'] },
            },
            {
              Key: 'literal',
              Value: 'oldValue',
            },
          ],
        },
        Metadata: {
          'aws:asset:path': 'asset-path',
        },
      },
    },
  });

  setup.pushStackResourceSummaries(
    setup.stackSummaryOf('EventBus', 'AWS::Events::EventBus', 'my-event-bus'),
  );

  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        EventBus: {
          Type: 'AWS::Events::EventBus',
          Properties: {
            Name: 'my-event-bus',
          },
        },
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: 's3-bucket',
              S3Key: 's3-key',
            },
            FunctionName: 'my-function',
            Environment: {
              Variables: {
                token: { 'Fn::GetAtt': ['EventBus', 'Arn'] },
                literal: 'newValue',
              },
            },
            Description: {
              'Fn::Join': ['', [
                'newValue',
                { 'Fn::GetAtt': ['EventBus', 'Arn'] },
              ]],
            },
            Tags: [
              {
                Key: 'token',
                Value: { 'Fn::GetAtt': ['EventBus', 'Arn'] },
              },
              {
                Key: 'literal',
                Value: 'newValue',
              },
            ],
          },
          Metadata: {
            'aws:asset:path': 'asset-path',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateLambdaConfiguration).toHaveBeenCalledWith({
    FunctionName: 'my-function',
    Environment: {
      Variables: {
        token: 'arn:aws:events:here:123456789012:event-bus/my-event-bus',
        literal: 'newValue',
      },
    },
    Description: 'newValuearn:aws:events:here:123456789012:event-bus/my-event-bus',
  });
  expect(mockTagResource).toHaveBeenCalledWith({
    Resource: 'arn:aws:lambda:here:123456789012:function:my-function',
    Tags: {
      token: 'arn:aws:events:here:123456789012:event-bus/my-event-bus',
      literal: 'newValue',
    },
  });
});
