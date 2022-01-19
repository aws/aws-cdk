import { Lambda } from 'aws-sdk';
import * as setup from './hotswap-test-setup';

let mockUpdateLambdaCode: (params: Lambda.Types.UpdateFunctionCodeRequest) => Lambda.Types.FunctionConfiguration;
let mockTagResource: (params: Lambda.Types.TagResourceRequest) => {};
let mockUntagResource: (params: Lambda.Types.UntagResourceRequest) => {};
let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;
let mockMakeRequest: (operation: string, params: any) => {};

beforeEach(() => {
  hotswapMockSdkProvider = setup.setupHotswapTests();
  mockUpdateLambdaCode = jest.fn().mockReturnValue({
    PackageType: 'Image',
  });
  mockTagResource = jest.fn();
  mockUntagResource = jest.fn();
  mockMakeRequest = jest.fn().mockReturnValue({
    promise: () => Promise.resolve({}),
    response: {},
    addListeners: () => {},
  });
  hotswapMockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
    tagResource: mockTagResource,
    untagResource: mockUntagResource,
  }, {
    // these are needed for the waiter API that the Lambda service hotswap uses
    api: {
      waiters: {},
    },
    makeRequest: mockMakeRequest,
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

test('calls the getFunction() API with a delay of 5', async () => {
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
  await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  const waiters = (hotswapMockSdkProvider.mockSdkProvider.sdk.lambda() as any).api.waiters;
  expect(mockMakeRequest).toHaveBeenCalledWith('getFunction', { FunctionName: 'my-function' });
  expect(waiters).toEqual(expect.objectContaining({
    updateFunctionCodeToFinish: expect.objectContaining({
      name: 'UpdateFunctionCodeToFinish',
      delay: 5,
    }),
  }));
});
