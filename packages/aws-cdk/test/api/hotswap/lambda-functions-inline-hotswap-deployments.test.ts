import { Lambda } from 'aws-sdk';
import * as setup from './hotswap-test-setup';
import { HotswapMode } from '../../../lib/api/hotswap/common';

let mockUpdateLambdaCode: (params: Lambda.Types.UpdateFunctionCodeRequest) => Lambda.Types.FunctionConfiguration;
let mockTagResource: (params: Lambda.Types.TagResourceRequest) => {};
let mockUntagResource: (params: Lambda.Types.UntagResourceRequest) => {};
let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;

beforeEach(() => {
  hotswapMockSdkProvider = setup.setupHotswapTests();
  mockUpdateLambdaCode = jest.fn().mockReturnValue({});
  mockTagResource = jest.fn();
  mockUntagResource = jest.fn();
  hotswapMockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
    tagResource: mockTagResource,
    untagResource: mockUntagResource,
  });
});

describe.each([HotswapMode.FALL_BACK, HotswapMode.HOTSWAP_ONLY])('these tests do not depend on the hotswap type', (hotswapMode) => {
  test('calls the updateLambdaCode() API when it receives only a code difference in a Lambda function (Inline Node.js code)', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              ZipFile: 'exports.handler = () => {return true}',
            },
            Runtime: 'nodejs14.x',
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
              Runtime: 'nodejs14.x',
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
      ZipFile: expect.any(Buffer),
    });
  });

  test('calls the updateLambdaCode() API when it receives only a code difference in a Lambda function (Inline Python code)', async () => {
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
    expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
      FunctionName: 'my-function',
      ZipFile: expect.any(Buffer),
    });
  });

  test('throw a CfnEvaluationException when it receives an unsupported function runtime', async () => {
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
    await expect(tryHotswap).rejects.toThrow('runtime ruby2.7 is unsupported, only node.js and python runtimes are currently supported.');
  });
});
