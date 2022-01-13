import { Lambda } from 'aws-sdk';
import * as setup from './hotswap-test-setup';

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

test('calls the updateLambdaCode() API when it receives only a code difference in a Lambda function', async () => {
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
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'my-function',
    ImageUri: 'new-image',
  });
});
