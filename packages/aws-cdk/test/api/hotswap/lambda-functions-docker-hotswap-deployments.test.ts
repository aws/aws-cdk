import { UpdateFunctionCodeCommand, waitUntilFunctionUpdatedV2 } from '@aws-sdk/client-lambda';
import * as setup from './hotswap-test-setup';
import { HotswapMode } from '../../../lib/api/hotswap/common';
import { mockLambdaClient } from '../../util/mock-sdk';
import { silentTest } from '../../util/silent';

jest.mock('@aws-sdk/client-lambda', () => {
  const original = jest.requireActual('@aws-sdk/client-lambda');

  return {
    ...original,
    waitUntilFunctionUpdatedV2: jest.fn(),
  };
});

let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;

beforeEach(() => {
  jest.restoreAllMocks();
  hotswapMockSdkProvider = setup.setupHotswapTests();
  mockLambdaClient.on(UpdateFunctionCodeCommand).resolves({
    PackageType: 'Image',
  });
});

describe.each([HotswapMode.FALL_BACK, HotswapMode.HOTSWAP_ONLY])('%p mode', (hotswapMode) => {
  silentTest(
    'calls the updateLambdaCode() API when it receives only a code difference in a Lambda function',
    async () => {
      // GIVEN
      setup.setCurrentCfnStackTemplate({
        Resources: {
          Func: {
            Type: 'AWS::Lambda::Function',
            Properties: {
              Code: {
                ImageUri: 'current-image',
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
                  ImageUri: 'new-image',
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
      expect(mockLambdaClient).toHaveReceivedCommandWith(UpdateFunctionCodeCommand, {
        FunctionName: 'my-function',
        ImageUri: 'new-image',
      });
    },
  );

  silentTest('calls the waiter with a delay of 5', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              ImageUri: 'current-image',
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
                ImageUri: 'new-image',
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
    expect(waitUntilFunctionUpdatedV2).toHaveBeenCalledWith(
      expect.objectContaining({
        minDelay: 5,
        maxDelay: 5,
        maxWaitTime: 5 * 60,
      }),
      { FunctionName: 'my-function' },
    );
  });
});
