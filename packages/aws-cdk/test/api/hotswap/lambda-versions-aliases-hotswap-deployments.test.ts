import { Lambda } from 'aws-sdk';
import * as setup from './hotswap-test-setup';
import { HotswapMode } from '../../../lib/api/hotswap/common';

let mockUpdateLambdaCode: (params: Lambda.Types.UpdateFunctionCodeRequest) => Lambda.Types.FunctionConfiguration;
let mockPublishVersion: jest.Mock<Lambda.FunctionConfiguration, Lambda.PublishVersionRequest[]>;
let mockUpdateAlias: (params: Lambda.UpdateAliasRequest) => Lambda.AliasConfiguration;
let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;

beforeEach(() => {
  hotswapMockSdkProvider = setup.setupHotswapTests();
  mockUpdateLambdaCode = jest.fn().mockReturnValue({});
  mockPublishVersion = jest.fn();
  mockUpdateAlias = jest.fn();
  hotswapMockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
    publishVersion: mockPublishVersion,
    updateAlias: mockUpdateAlias,
    waitFor: jest.fn(),
  });
});

describe.each([HotswapMode.FALL_BACK, HotswapMode.HOTSWAP_ONLY])('%p mode', (hotswapMode) => {
  test('hotswaps a Version if it points to a changed Function, even if it itself is unchanged', async () => {
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
        },
        Version: {
          Type: 'AWS::Lambda::Version',
          Properties: {
            FunctionName: { Ref: 'Func' },
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
          },
          Version: {
            Type: 'AWS::Lambda::Version',
            Properties: {
              FunctionName: { Ref: 'Func' },
            },
          },
        },
      },
    });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockPublishVersion).toHaveBeenCalledWith({
      FunctionName: 'my-function',
    });
  });

  test('hotswaps a Version if it points to a changed Function, even if it itself is replaced', async () => {
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
        },
        Version1: {
          Type: 'AWS::Lambda::Version',
          Properties: {
            FunctionName: { Ref: 'Func' },
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
          },
          Version2: {
            Type: 'AWS::Lambda::Version',
            Properties: {
              FunctionName: { Ref: 'Func' },
            },
          },
        },
      },
    });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockPublishVersion).toHaveBeenCalledWith({
      FunctionName: 'my-function',
    });
  });

  test('hotswaps a Version and an Alias if the Function they point to changed', async () => {
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
        },
        Version1: {
          Type: 'AWS::Lambda::Version',
          Properties: {
            FunctionName: { Ref: 'Func' },
          },
        },
        Alias: {
          Type: 'AWS::Lambda::Alias',
          Properties: {
            FunctionName: { Ref: 'Func' },
            FunctionVersion: { 'Fn::GetAtt': ['Version1', 'Version'] },
            Name: 'dev',
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
          },
          Version2: {
            Type: 'AWS::Lambda::Version',
            Properties: {
              FunctionName: { Ref: 'Func' },
            },
          },
          Alias: {
            Type: 'AWS::Lambda::Alias',
            Properties: {
              FunctionName: { Ref: 'Func' },
              FunctionVersion: { 'Fn::GetAtt': ['Version2', 'Version'] },
              Name: 'dev',
            },
          },
        },
      },
    });
    mockPublishVersion.mockReturnValue({
      Version: 'v2',
    });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockUpdateAlias).toHaveBeenCalledWith({
      FunctionName: 'my-function',
      FunctionVersion: 'v2',
      Name: 'dev',
    });
  });
});
