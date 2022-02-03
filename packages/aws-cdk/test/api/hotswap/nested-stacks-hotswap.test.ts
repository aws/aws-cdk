import { Lambda } from 'aws-sdk';
import { testStack } from '../../util';
import * as setup from './hotswap-test-setup';

let mockUpdateLambdaCode: (params: Lambda.Types.UpdateFunctionCodeRequest) => Lambda.Types.FunctionConfiguration;
let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;

beforeEach(() => {
  hotswapMockSdkProvider = setup.setupHotswapTests();
  mockUpdateLambdaCode = jest.fn().mockReturnValue({});
  hotswapMockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
  });
});

test('can hotswap a lambda function in a 1-level nested stack', async () => {
  // GIVEN
  const lambdaRoot = testStack({
    stackName: 'LambdaRoot',
    template: {
      Resources: {
        NestedStack: {
          Type: 'AWS::CloudFormation::Stack',
          Properties: {
            TemplateURL: 'https://www.magic-url.com',
          },
          Metadata: {
            'aws:asset:path': 'one-lambda-stack.nested.template.json',
          },
        },
      },
    },
  });

  setup.addTemplateToCloudFormationLookupMock(lambdaRoot);
  setup.addTemplateToCloudFormationLookupMock(testStack({
    stackName: 'NestedStack',
    template: {
      Resources: {
        NestedTemplate: {
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
        },
      },
    },
  }));

  const cdkStackArtifact = testStack({ stackName: 'LambdaRoot', template: lambdaRoot.template });

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
