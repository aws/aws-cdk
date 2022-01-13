import { Lambda } from 'aws-sdk';
import * as setup from './hotswap-test-setup';
import { zipString } from '../../../lib/api/hotswap/lambda-functions';

let mockUpdateLambdaCode: (params: Lambda.Types.UpdateFunctionCodeRequest) => Lambda.Types.FunctionConfiguration;
let mockTagResource: (params: Lambda.Types.TagResourceRequest) => {};
let mockUntagResource: (params: Lambda.Types.UntagResourceRequest) => {};
let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;

beforeEach(() => {
  hotswapMockSdkProvider = setup.setupHotswapTests();
  mockUpdateLambdaCode = jest.fn();
  mockTagResource = jest.fn();
  mockUntagResource = jest.fn();
  hotswapMockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
    tagResource: mockTagResource,
    untagResource: mockUntagResource,
  });
});

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
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'my-function',
    ZipFile: await zipString('index.js', newCode),
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
  const newCode = 'def handler(event, context):\n  return False';
  const cdkStackArtifact = setup.cdkStackArtifactOf({
    template: {
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              ZipFile: newCode,
            },
            Runtime: 'python3.9',
            FunctionName: 'my-function',
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
    ZipFile: await zipString('index.py', newCode),
  });
});
