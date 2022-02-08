import { Lambda } from 'aws-sdk';
import { testStack } from '../../util';
import * as setup from './hotswap-test-setup';

let mockUpdateLambdaCode: (params: Lambda.Types.UpdateFunctionCodeRequest) => Lambda.Types.FunctionConfiguration;
let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;

beforeEach(() => {
});

test('can hotswap a lambda function in a 1-level nested stack', async () => {
  // GIVEN
  hotswapMockSdkProvider = setup.setupHotswapNestedStackTests('LambdaRoot');
  mockUpdateLambdaCode = jest.fn().mockReturnValue({});
  hotswapMockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
  });

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
  }));

  setup.pushNestedStackResourceSummaries('LambdaRoot',
    setup.stackSummaryOf('NestedStack', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/NestedStack/abcd',
    ),
  );

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

























test('hotswappable changes do not override hotswappable changes in their ancestors', async () => {
  // GIVEN
  hotswapMockSdkProvider = setup.setupHotswapNestedStackTests('TwoLevelLambdaRoot', ['ChildStack']);
  mockUpdateLambdaCode = jest.fn().mockReturnValue({});
  hotswapMockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
  });

  const lambdaRoot = testStack({
    stackName: 'TwoLevelLambdaRoot',
    template: {
      Resources: {
        ChildStack: {
          Type: 'AWS::CloudFormation::Stack',
          Properties: {
            TemplateURL: 'https://www.magic-url.com',
          },
          Metadata: {
            'aws:asset:path': 'one-lambda-one-stack-stack.nested.template.json',
          },
        },
      },
    },
  });

  setup.addTemplateToCloudFormationLookupMock(lambdaRoot);
  setup.addTemplateToCloudFormationLookupMock(testStack({
    stackName: 'ChildStack',
    template: {
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: 'current-bucket',
              S3Key: 'current-key',
            },
            FunctionName: 'child-function',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
        GrandChildStack: {
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
  }));
  setup.addTemplateToCloudFormationLookupMock(testStack({
    stackName: 'GrandChildStack',
    template: {
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
  }));

  setup.pushNestedStackResourceSummaries('TwoLevelLambdaRoot',
    setup.stackSummaryOf('ChildStack', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/ChildStack/abcd',
    ),
  );
  setup.pushNestedStackResourceSummaries('ChildStack',
    setup.stackSummaryOf('GrandChildStack', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/GrandChildStack/abcd',
    ),
  );

  const cdkStackArtifact = testStack({ stackName: 'TwoLevelLambdaRoot', template: lambdaRoot.template });

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'child-function',
    S3Bucket: 'new-bucket',
    S3Key: 'current-key',
  });
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'my-function',
    S3Bucket: 'current-bucket',
    S3Key: 'new-key',
  });
});

test('hotswappable changes do not override hotswappable changes in their ancestors', async () => {
  // GIVEN
  hotswapMockSdkProvider = setup.setupHotswapNestedStackTests('TwoLevelLambdaRoot', ['ChildStack']);
  mockUpdateLambdaCode = jest.fn().mockReturnValue({});
  hotswapMockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
  });

  const lambdaRoot = testStack({
    stackName: 'TwoLevelLambdaRoot',
    template: {
      Resources: {
        ChildStack: {
          Type: 'AWS::CloudFormation::Stack',
          Properties: {
            TemplateURL: 'https://www.magic-url.com',
          },
          Metadata: {
            'aws:asset:path': 'one-lambda-one-stack-stack.nested.template.json',
          },
        },
      },
    },
  });

  setup.addTemplateToCloudFormationLookupMock(lambdaRoot);
  setup.addTemplateToCloudFormationLookupMock(testStack({
    stackName: 'ChildStack',
    template: {
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: 'current-bucket',
              S3Key: 'current-key',
            },
            FunctionName: 'child-function',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
        GrandChildStack: {
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
  }));
  setup.addTemplateToCloudFormationLookupMock(testStack({
    stackName: 'GrandChildStack',
    template: {
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
  }));

  setup.pushNestedStackResourceSummaries('TwoLevelLambdaRoot',
    setup.stackSummaryOf('ChildStack', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/ChildStack/abcd',
    ),
  );
  setup.pushNestedStackResourceSummaries('ChildStack',
    setup.stackSummaryOf('GrandChildStack', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/GrandChildStack/abcd',
    ),
  );

  const cdkStackArtifact = testStack({ stackName: 'TwoLevelLambdaRoot', template: lambdaRoot.template });

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'child-function',
    S3Bucket: 'new-bucket',
    S3Key: 'current-key',
  });
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'my-function',
    S3Bucket: 'current-bucket',
    S3Key: 'new-key',
  });
});
