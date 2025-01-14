import { UpdateFunctionCodeCommand } from '@aws-sdk/client-lambda';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
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

describe.each([HotswapMode.FALL_BACK, HotswapMode.HOTSWAP_ONLY])(
  'these tests do not depend on the hotswap type',
  (hotswapMode) => {
    silentTest(
      'calls the updateLambdaCode() API when it receives only a code difference in a Lambda function (Inline Node.js code)',
      async () => {
        // GIVEN
        setup.setCurrentCfnStackTemplate({
          Resources: {
            Func: {
              Type: 'AWS::Lambda::Function',
              Properties: {
                Code: {
                  ZipFile: 'exports.handler = () => {return true}',
                },
                Runtime: Runtime.NODEJS_LATEST.name,
                FunctionName: 'my-function',
              },
            },
          },
        });
        const newCode = 'exports.handler = () => {return false}';
        const cdkStackArtifact = setup.cdkStackArtifactOf({
          template: {
            Resources: {
              Func: {
                Type: 'AWS::Lambda::Function',
                Properties: {
                  Code: {
                    ZipFile: newCode,
                  },
                  Runtime: Runtime.NODEJS_LATEST.name,
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
        expect(mockLambdaClient).toHaveReceivedCommandWith(UpdateFunctionCodeCommand, {
          FunctionName: 'my-function',
          ZipFile: expect.any(Buffer),
        });
      },
    );

    silentTest(
      'calls the updateLambdaCode() API when it receives only a code difference in a Lambda function (Inline Python code)',
      async () => {
        // GIVEN
        setup.setCurrentCfnStackTemplate({
          Resources: {
            Func: {
              Type: 'AWS::Lambda::Function',
              Properties: {
                Code: {
                  ZipFile: 'def handler(event, context):\n  return True',
                },
                Runtime: 'python3.9',
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
                    ZipFile: 'def handler(event, context):\n  return False',
                  },
                  Runtime: 'python3.9',
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
        expect(mockLambdaClient).toHaveReceivedCommandWith(UpdateFunctionCodeCommand, {
          FunctionName: 'my-function',
          ZipFile: expect.any(Buffer),
        });
      },
    );

    silentTest('throw a CfnEvaluationException when it receives an unsupported function runtime', async () => {
      // GIVEN
      setup.setCurrentCfnStackTemplate({
        Resources: {
          Func: {
            Type: 'AWS::Lambda::Function',
            Properties: {
              Code: {
                ZipFile: 'def handler(event:, context:) true end',
              },
              Runtime: 'ruby2.7',
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
                  ZipFile: 'def handler(event:, context:) false end',
                },
                Runtime: 'ruby2.7',
                FunctionName: 'my-function',
              },
            },
          },
        },
      });

      // WHEN
      const tryHotswap = hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      await expect(tryHotswap).rejects.toThrow(
        'runtime ruby2.7 is unsupported, only node.js and python runtimes are currently supported.',
      );
    });
  },
);
