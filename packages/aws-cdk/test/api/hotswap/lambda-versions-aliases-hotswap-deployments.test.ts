import { PublishVersionCommand, UpdateAliasCommand } from '@aws-sdk/client-lambda';
import * as setup from './hotswap-test-setup';
import { HotswapMode } from '../../../lib/api/hotswap/common';
import { mockLambdaClient } from '../../util/mock-sdk';
import { silentTest } from '../../util/silent';

jest.mock('@aws-sdk/client-lambda', () => {
  const original = jest.requireActual('@aws-sdk/client-lambda');

  return {
    ...original,
    waitUntilFunctionUpdated: jest.fn(),
  };
});

let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;

beforeEach(() => {
  hotswapMockSdkProvider = setup.setupHotswapTests();
});

describe.each([HotswapMode.FALL_BACK, HotswapMode.HOTSWAP_ONLY])('%p mode', (hotswapMode) => {
  silentTest('hotswaps a Version if it points to a changed Function, even if it itself is unchanged', async () => {
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
    expect(mockLambdaClient).toHaveReceivedCommandWith(PublishVersionCommand, {
      FunctionName: 'my-function',
    });
  });

  silentTest('hotswaps a Version if it points to a changed Function, even if it itself is replaced', async () => {
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
    expect(mockLambdaClient).toHaveReceivedCommandWith(PublishVersionCommand, {
      FunctionName: 'my-function',
    });
  });

  silentTest('hotswaps a Version and an Alias if the Function they point to changed', async () => {
    // GIVEN
    mockLambdaClient.on(PublishVersionCommand).resolves({
      Version: 'v2',
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

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockLambdaClient).toHaveReceivedCommandWith(UpdateAliasCommand, {
      FunctionName: 'my-function',
      FunctionVersion: 'v2',
      Name: 'dev',
    });
  });
});
