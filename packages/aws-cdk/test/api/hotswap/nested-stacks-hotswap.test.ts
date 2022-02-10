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

test('hotswappable changes in nested stacks do not override hotswappable changes in their parent stack', async () => {
  // GIVEN
  hotswapMockSdkProvider = setup.setupHotswapNestedStackTests('SiblingLambdaRoot', ['NestedStack']);
  mockUpdateLambdaCode = jest.fn().mockReturnValue({});
  hotswapMockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
  });

  const lambdaRoot = testStack({
    stackName: 'SiblingLambdaRoot',
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
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: 'current-bucket',
              S3Key: 'current-key',
            },
            FunctionName: 'root-function',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
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

  setup.pushNestedStackResourceSummaries('SiblingLambdaRoot',
    setup.stackSummaryOf('NestedStack', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/NestedStack/abcd',
    ),
  );

  lambdaRoot.template.Resources.Func.Properties.Code.S3Bucket = 'new-bucket';
  const cdkStackArtifact = testStack({ stackName: 'SiblingLambdaRoot', template: lambdaRoot.template });

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'root-function',
    S3Bucket: 'new-bucket',
    S3Key: 'current-key',
  });
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'my-function',
    S3Bucket: 'current-bucket',
    S3Key: 'new-key',
  });
});

test('non-hotswappable changes in nested stacks result in a full deployment, even if their parent contains a hotswappable change', async () => {
  // GIVEN
  hotswapMockSdkProvider = setup.setupHotswapNestedStackTests('NonHotswappableRoot', ['NestedStack']);
  mockUpdateLambdaCode = jest.fn().mockReturnValue({});
  hotswapMockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
  });

  const root = testStack({
    stackName: 'NonHotswappableRoot',
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
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: 'current-bucket',
              S3Key: 'current-key',
            },
            FunctionName: 'root-function',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    },
  });

  setup.addTemplateToCloudFormationLookupMock(root);
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
            PackageType: 'Image',
            FunctionName: 'my-function',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    },
  }));

  setup.pushNestedStackResourceSummaries('NonHotswappableRoot',
    setup.stackSummaryOf('NestedStack', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/NestedStack/abcd',
    ),
  );

  root.template.Resources.Func.Properties.Code.S3Bucket = 'new-bucket';
  const cdkStackArtifact = testStack({ stackName: 'NonHotswappableRoot', template: root.template });

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
});

test('deleting a nested stack results in a full deployment, even if their parent contains a hotswappable change', async () => {
  // GIVEN
  hotswapMockSdkProvider = setup.setupHotswapNestedStackTests('NestedStackDeletionRoot', ['NestedStack']);
  mockUpdateLambdaCode = jest.fn().mockReturnValue({});
  hotswapMockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
  });

  const root = testStack({
    stackName: 'NestedStackDeletionRoot',
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
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: 'current-bucket',
              S3Key: 'current-key',
            },
            FunctionName: 'root-function',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    },
  });

  setup.addTemplateToCloudFormationLookupMock(root);
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

  setup.pushNestedStackResourceSummaries('NestedStackDeletionRoot',
    setup.stackSummaryOf('NestedStack', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/NestedStack/abcd',
    ),
  );

  root.template.Resources.Func.Properties.Code.S3Bucket = 'new-bucket';
  delete root.template.Resources.NestedStack;
  const cdkStackArtifact = testStack({ stackName: 'NestedStackDeletionRoot', template: root.template });

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
});

test('creating a nested stack results in a full deployment, even if their parent contains a hotswappable change', async () => {
  // GIVEN
  hotswapMockSdkProvider = setup.setupHotswapNestedStackTests('NestedStackCreationRoot', ['NestedStack']);
  mockUpdateLambdaCode = jest.fn().mockReturnValue({});
  hotswapMockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
  });

  const root = testStack({
    stackName: 'NestedStackCreationRoot',
    template: {
      Resources: {
        Func: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: 'current-bucket',
              S3Key: 'current-key',
            },
            FunctionName: 'root-function',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    },
  });

  setup.addTemplateToCloudFormationLookupMock(root);

  root.template.Resources.Func.Properties.Code.S3Bucket = 'new-bucket';
  root.template.Resources.NestedStack = {
    Type: 'AWS::CloudFormation::Stack',
    Properties: {
      TemplateURL: 'https://www.magic-url.com',
    },
    Metadata: {
      'aws:asset:path': 'one-lambda-stack.nested.template.json',
    },
  };
  const cdkStackArtifact = testStack({ stackName: 'NestedStackCreationRoot', template: root.template });

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
});

test('multi-sibling + 3-layer nested stack structure is hotswappable', async () => {
  // GIVEN
  hotswapMockSdkProvider = setup.setupHotswapNestedStackTests('MultiLayerRoot', ['ChildStack', 'GrandChildStackA', 'GrandChildStackB']);
  mockUpdateLambdaCode = jest.fn().mockReturnValue({});
  hotswapMockSdkProvider.stubLambda({
    updateFunctionCode: mockUpdateLambdaCode,
  });

  const lambdaFunctionResource = {
    Type: 'AWS::Lambda::Function',
    Properties: {
      Code: {
        S3Bucket: 'current-bucket',
        S3Key: 'current-key',
      },
    },
    Metadata: {
      'aws:asset:path': 'old-path',
    },
  };

  const root = testStack({
    stackName: 'MultiLayerRoot',
    template: {
      Resources: {
        ChildStack: {
          Type: 'AWS::CloudFormation::Stack',
          Properties: {
            TemplateURL: 'https://www.magic-url.com',
          },
          Metadata: {
            'aws:asset:path': 'one-unnamed-lambda-two-stacks-stack.nested.template.json',
          },
        },
        Func: lambdaFunctionResource,
      },
    },
  });

  setup.addTemplateToCloudFormationLookupMock(root);
  setup.addTemplateToCloudFormationLookupMock(testStack({
    stackName: 'ChildStack',
    template: {
      Resources: {
        GrandChildStackA: {
          Type: 'AWS::CloudFormation::Stack',
          Properties: {
            TemplateURL: 'https://www.magic-url.com',
          },
          Metadata: {
            'aws:asset:path': 'one-unnamed-lambda-stack.nested.template.json',
          },
        },
        GrandChildStackB: {
          Type: 'AWS::CloudFormation::Stack',
          Properties: {
            TemplateURL: 'https://www.magic-url.com',
          },
          Metadata: {
            'aws:asset:path': 'one-unnamed-lambda-stack.nested.template.json',
          },
        },
        Func: lambdaFunctionResource,
      },
    },
  }));
  setup.addTemplateToCloudFormationLookupMock(testStack({
    stackName: 'GrandChildStackA',
    template: {
      Resources: {
        Func: lambdaFunctionResource,
      },
    },
  }));
  setup.addTemplateToCloudFormationLookupMock(testStack({
    stackName: 'GrandChildStackB',
    template: {
      Resources: {
        Func: lambdaFunctionResource,
      },
    },
  }));

  setup.pushNestedStackResourceSummaries('MultiLayerRoot',
    setup.stackSummaryOf('ChildStack', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/ChildStack/abcd',
    ),
    setup.stackSummaryOf('Func', 'AWS::Lambda::Function', 'root-function'),
  );
  setup.pushNestedStackResourceSummaries('ChildStack',
    setup.stackSummaryOf('GrandChildStackA', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/GrandChildStackA/abcd',
    ),
    setup.stackSummaryOf('GrandChildStackB', 'AWS::CloudFormation::Stack',
      'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/GrandChildStackB/abcd',
    ),
    setup.stackSummaryOf('Func', 'AWS::Lambda::Function', 'child-function'),
  );
  setup.pushNestedStackResourceSummaries('GrandChildStackA',
    setup.stackSummaryOf('Func', 'AWS::Lambda::Function', 'grandchild-A-function'),
  );
  setup.pushNestedStackResourceSummaries('GrandChildStackB',
    setup.stackSummaryOf('Func', 'AWS::Lambda::Function', 'grandchild-B-function'),
  );

  root.template.Resources.Func.Properties.Code.S3Key = 'new-key';
  const cdkStackArtifact = testStack({ stackName: 'MultiLayerRoot', template: root.template });

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).not.toBeUndefined();
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'root-function',
    S3Bucket: 'current-bucket',
    S3Key: 'new-key',
  });
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'child-function',
    S3Bucket: 'current-bucket',
    S3Key: 'new-key',
  });
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'grandchild-A-function',
    S3Bucket: 'current-bucket',
    S3Key: 'new-key',
  });
  expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
    FunctionName: 'grandchild-B-function',
    S3Bucket: 'current-bucket',
    S3Key: 'new-key',
  });
});
