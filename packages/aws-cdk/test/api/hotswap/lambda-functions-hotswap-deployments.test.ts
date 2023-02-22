import { Lambda } from 'aws-sdk';
import * as setup from './hotswap-test-setup';
import { HotswapMode } from '../../../lib/api/hotswap/common';

let mockUpdateLambdaCode: (params: Lambda.Types.UpdateFunctionCodeRequest) => Lambda.Types.FunctionConfiguration;
let mockUpdateLambdaConfiguration: (
  params: Lambda.Types.UpdateFunctionConfigurationRequest
) => Lambda.Types.FunctionConfiguration;
let mockMakeRequest: (operation: string, params: any) => AWS.Request<any, AWS.AWSError>;
let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;

beforeEach(() => {
  hotswapMockSdkProvider = setup.setupHotswapTests();
  mockUpdateLambdaCode = jest.fn().mockReturnValue({});
  mockUpdateLambdaConfiguration = jest.fn().mockReturnValue({});
  mockMakeRequest = jest.fn().mockReturnValue({
    promise: () => Promise.resolve({}),
    response: {},
    addListeners: () => {},
  });
  hotswapMockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
    updateFunctionConfiguration: mockUpdateLambdaConfiguration,
  }, {
    makeRequest: mockMakeRequest,
  });
});

describe.each([HotswapMode.FALL_BACK, HotswapMode.HOTSWAP_ONLY])('%p mode', (hotswapMode) => {
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

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(deployStackResult?.noOp).toEqual(true);
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
    }
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
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
      FunctionName: 'my-function',
      S3Bucket: 'current-bucket',
      S3Key: 'new-key',
    });
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
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

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
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact, { AssetBucketParam: 'asset-bucket' });

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
      hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact),
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
      hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact),
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
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

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

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(deployStackResult?.noOp).toEqual(true);
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
    }
  });

  test(`when it receives a non-hotswappable change that includes a code difference in a Lambda function, it does not call the updateLambdaCode()
        API in CLASSIC mode but does in HOTSWAP_ONLY mode`,
  async () => {
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
                S3Key: 'new-key',
              },
              FunctionName: 'my-function',
              PackageType: 'Image',
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
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
        FunctionName: 'my-function',
        S3Bucket: 'current-bucket',
        S3Key: 'new-key',
      });
    }
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

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(deployStackResult?.noOp).toEqual(true);
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
    }
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
    await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

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
    await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

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
    await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

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
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

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
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

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
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

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

  test('Lambda hotswap works properly with changes of environment variables and description with tokens', async () => {
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
            },
            Metadata: {
              'aws:asset:path': 'asset-path',
            },
          },
        },
      },
    });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

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
  });

  test('S3ObjectVersion is hotswappable', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Key: 'current-key',
              S3ObjectVersion: 'current-obj',
            },
            FunctionName: 'my-function',
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
                S3Key: 'new-key',
                S3ObjectVersion: 'new-obj',
              },
              FunctionName: 'my-function',
            },
          },
        },
      },
    });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
      FunctionName: 'my-function',
      S3Key: 'new-key',
      S3ObjectVersion: 'new-obj',
    });
  });
});
