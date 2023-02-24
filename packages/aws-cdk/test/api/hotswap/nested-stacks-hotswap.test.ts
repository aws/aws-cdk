import { Lambda } from 'aws-sdk';
import * as setup from './hotswap-test-setup';
import { HotswapMode } from '../../../lib/api/hotswap/common';
import { testStack } from '../../util';

let mockUpdateLambdaCode: (params: Lambda.Types.UpdateFunctionCodeRequest) => Lambda.Types.FunctionConfiguration;
let mockPublishVersion: jest.Mock<Lambda.FunctionConfiguration, Lambda.PublishVersionRequest[]>;
let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;

// TODO: more tests for parent vs child containing hotswappable changes
describe.each([HotswapMode.FALL_BACK, HotswapMode.HOTSWAP_ONLY])('%p mode', (hotswapMode) => {
  test('can hotswap a lambda function in a 1-level nested stack', async () => {
    // GIVEN
    hotswapMockSdkProvider = setup.setupHotswapNestedStackTests('LambdaRoot');
    mockUpdateLambdaCode = jest.fn().mockReturnValue({});
    hotswapMockSdkProvider.stubLambda({
      updateFunctionCode: mockUpdateLambdaCode,
    });

    const rootStack = testStack({
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

    setup.addTemplateToCloudFormationLookupMock(rootStack);
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

    const cdkStackArtifact = testStack({ stackName: 'LambdaRoot', template: rootStack.template });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

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
    hotswapMockSdkProvider = setup.setupHotswapNestedStackTests('TwoLevelLambdaRoot');
    mockUpdateLambdaCode = jest.fn().mockReturnValue({});
    hotswapMockSdkProvider.stubLambda({
      updateFunctionCode: mockUpdateLambdaCode,
    });

    const rootStack = testStack({
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

    setup.addTemplateToCloudFormationLookupMock(rootStack);
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

    const cdkStackArtifact = testStack({ stackName: 'TwoLevelLambdaRoot', template: rootStack.template });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

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
    hotswapMockSdkProvider = setup.setupHotswapNestedStackTests('SiblingLambdaRoot');
    mockUpdateLambdaCode = jest.fn().mockReturnValue({});
    hotswapMockSdkProvider.stubLambda({
      updateFunctionCode: mockUpdateLambdaCode,
    });

    const rootStack = testStack({
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

    setup.addTemplateToCloudFormationLookupMock(rootStack);
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

    rootStack.template.Resources.Func.Properties.Code.S3Bucket = 'new-bucket';
    const cdkStackArtifact = testStack({ stackName: 'SiblingLambdaRoot', template: rootStack.template });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

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

  test(`non-hotswappable changes in nested stacks result in a full deployment, even if their parent contains a hotswappable change in CLASSIC mode,
        but perform a hotswap deployment in HOTSWAP_ONLY`,
  async () => {
    // GIVEN
    hotswapMockSdkProvider = setup.setupHotswapNestedStackTests('NonHotswappableRoot');
    mockUpdateLambdaCode = jest.fn().mockReturnValue({});
    hotswapMockSdkProvider.stubLambda({
      updateFunctionCode: mockUpdateLambdaCode,
    });

    const rootStack = testStack({
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

    setup.addTemplateToCloudFormationLookupMock(rootStack);
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

    rootStack.template.Resources.Func.Properties.Code.S3Bucket = 'new-bucket';
    const cdkStackArtifact = testStack({ stackName: 'NonHotswappableRoot', template: rootStack.template });

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();

    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
        FunctionName: 'root-function',
        S3Bucket: 'new-bucket',
        S3Key: 'current-key',
      });
    }
  });

  test(`deleting a nested stack results in a full deployment in CLASSIC mode, even if their parent contains a hotswappable change,
        but results in a hotswap deployment in HOTSWAP_ONLY mode`,
  async () => {
    // GIVEN
    hotswapMockSdkProvider = setup.setupHotswapNestedStackTests('NestedStackDeletionRoot');
    mockUpdateLambdaCode = jest.fn().mockReturnValue({});
    hotswapMockSdkProvider.stubLambda({
      updateFunctionCode: mockUpdateLambdaCode,
    });

    const rootStack = testStack({
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

    setup.addTemplateToCloudFormationLookupMock(rootStack);
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

    rootStack.template.Resources.Func.Properties.Code.S3Bucket = 'new-bucket';
    delete rootStack.template.Resources.NestedStack;
    const cdkStackArtifact = testStack({ stackName: 'NestedStackDeletionRoot', template: rootStack.template });

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
        FunctionName: 'root-function',
        S3Bucket: 'new-bucket',
        S3Key: 'current-key',
      });
    }
  });

  test(`creating a nested stack results in a full deployment in CLASSIC mode, even if their parent contains a hotswappable change,
        but results in a hotswap deployment in HOTSWAP_ONLY mode`,
  async () => {
    // GIVEN
    hotswapMockSdkProvider = setup.setupHotswapNestedStackTests('NestedStackCreationRoot');
    mockUpdateLambdaCode = jest.fn().mockReturnValue({});
    hotswapMockSdkProvider.stubLambda({
      updateFunctionCode: mockUpdateLambdaCode,
    });

    const rootStack = testStack({
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

    setup.addTemplateToCloudFormationLookupMock(rootStack);

    rootStack.template.Resources.Func.Properties.Code.S3Bucket = 'new-bucket';
    rootStack.template.Resources.NestedStack = {
      Type: 'AWS::CloudFormation::Stack',
      Properties: {
        TemplateURL: 'https://www.magic-url.com',
      },
      Metadata: {
        'aws:asset:path': 'one-lambda-stack.nested.template.json',
      },
    };
    const cdkStackArtifact = testStack({ stackName: 'NestedStackCreationRoot', template: rootStack.template });

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();

    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
        FunctionName: 'root-function',
        S3Bucket: 'new-bucket',
        S3Key: 'current-key',
      });
    }
  });

  test(`attempting to hotswap a newly created nested stack with the same logical ID as a resource with a different type results in a full deployment in CLASSIC mode
        and a hotswap deployment in HOTSWAP_ONLY mode`,
  async () => {
    // GIVEN
    hotswapMockSdkProvider = setup.setupHotswapNestedStackTests('NestedStackTypeChangeRoot');
    mockUpdateLambdaCode = jest.fn().mockReturnValue({});
    hotswapMockSdkProvider.stubLambda({
      updateFunctionCode: mockUpdateLambdaCode,
    });

    const rootStack = testStack({
      stackName: 'NestedStackTypeChangeRoot',
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
          FutureNestedStack: {
            Type: 'AWS::Lambda::Function',
            Properties: {
              Code: {
                S3Bucket: 'current-bucket',
                S3Key: 'new-key',
              },
              FunctionName: 'spooky-function',
            },
            Metadata: {
              'aws:asset:path': 'old-path',
            },
          },
        },
      },
    });

    setup.addTemplateToCloudFormationLookupMock(rootStack);

    rootStack.template.Resources.Func.Properties.Code.S3Bucket = 'new-bucket';
    rootStack.template.Resources.FutureNestedStack = {
      Type: 'AWS::CloudFormation::Stack',
      Properties: {
        TemplateURL: 'https://www.magic-url.com',
      },
      Metadata: {
        'aws:asset:path': 'one-lambda-stack.nested.template.json',
      },
    };
    const cdkStackArtifact = testStack({ stackName: 'NestedStackTypeChangeRoot', template: rootStack.template });

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();

    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
        FunctionName: 'root-function',
        S3Bucket: 'new-bucket',
        S3Key: 'current-key',
      });
    }
  });

  test('multi-sibling + 3-layer nested stack structure is hotswappable', async () => {
    // GIVEN
    hotswapMockSdkProvider = setup.setupHotswapNestedStackTests('MultiLayerRoot');
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

    const rootStack = testStack({
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

    setup.addTemplateToCloudFormationLookupMock(rootStack);
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

    rootStack.template.Resources.Func.Properties.Code.S3Key = 'new-key';
    const cdkStackArtifact = testStack({ stackName: 'MultiLayerRoot', template: rootStack.template });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

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

  test('can hotswap a lambda function in a 1-level nested stack with asset parameters', async () => {
    // GIVEN
    hotswapMockSdkProvider = setup.setupHotswapNestedStackTests('LambdaRoot');
    mockUpdateLambdaCode = jest.fn().mockReturnValue({});
    hotswapMockSdkProvider.stubLambda({
      updateFunctionCode: mockUpdateLambdaCode,
    });

    const rootStack = testStack({
      stackName: 'LambdaRoot',
      template: {
        Resources: {
          NestedStack: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'https://www.magic-url.com',
              Parameters: {
                referencetoS3BucketParam: {
                  Ref: 'S3BucketParam',
                },
                referencetoS3KeyParam: {
                  Ref: 'S3KeyParam',
                },
              },
            },
            Metadata: {
              'aws:asset:path': 'one-lambda-stack-with-asset-parameters.nested.template.json',
            },
          },
        },
        Parameters: {
          S3BucketParam: {
            Type: 'String',
            Description: 'S3 bucket for asset',
          },
          S3KeyParam: {
            Type: 'String',
            Description: 'S3 bucket for asset',
          },
        },
      },
    });

    setup.addTemplateToCloudFormationLookupMock(rootStack);
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

    const cdkStackArtifact = testStack({ stackName: 'LambdaRoot', template: rootStack.template });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact, {
      S3BucketParam: 'bucket-param-value',
      S3KeyParam: 'key-param-value',
    });

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
      FunctionName: 'my-function',
      S3Bucket: 'bucket-param-value',
      S3Key: 'key-param-value',
    });
  });

  test('can hotswap a lambda function in a 2-level nested stack with asset parameters', async () => {
    // GIVEN
    hotswapMockSdkProvider = setup.setupHotswapNestedStackTests('LambdaRoot');
    mockUpdateLambdaCode = jest.fn().mockReturnValue({});
    hotswapMockSdkProvider.stubLambda({
      updateFunctionCode: mockUpdateLambdaCode,
    });

    const rootStack = testStack({
      stackName: 'LambdaRoot',
      template: {
        Resources: {
          ChildStack: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'https://www.magic-url.com',
              Parameters: {
                referencetoGrandChildS3BucketParam: {
                  Ref: 'GrandChildS3BucketParam',
                },
                referencetoGrandChildS3KeyParam: {
                  Ref: 'GrandChildS3KeyParam',
                },
                referencetoChildS3BucketParam: {
                  Ref: 'ChildS3BucketParam',
                },
                referencetoChildS3KeyParam: {
                  Ref: 'ChildS3KeyParam',
                },
              },
            },
            Metadata: {
              'aws:asset:path': 'one-lambda-one-stack-stack-with-asset-parameters.nested.template.json',
            },
          },
        },
        Parameters: {
          GrandChildS3BucketParam: {
            Type: 'String',
            Description: 'S3 bucket for asset',
          },
          GrandChildS3KeyParam: {
            Type: 'String',
            Description: 'S3 bucket for asset',
          },
          ChildS3BucketParam: {
            Type: 'String',
            Description: 'S3 bucket for asset',
          },
          ChildS3KeyParam: {
            Type: 'String',
            Description: 'S3 bucket for asset',
          },
        },
      },
    });

    setup.addTemplateToCloudFormationLookupMock(rootStack);
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
              FunctionName: 'my-function',
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
              'aws:asset:path': 'one-lambda-stack-with-asset-parameters.nested.template.json',
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

    setup.pushNestedStackResourceSummaries('LambdaRoot',
      setup.stackSummaryOf('ChildStack', 'AWS::CloudFormation::Stack',
        'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/ChildStack/abcd',
      ),
    );

    setup.pushNestedStackResourceSummaries('ChildStack',
      setup.stackSummaryOf('GrandChildStack', 'AWS::CloudFormation::Stack',
        'arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/GrandChildStack/abcd',
      ),
    );
    const cdkStackArtifact = testStack({ stackName: 'LambdaRoot', template: rootStack.template });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact, {
      GrandChildS3BucketParam: 'child-bucket-param-value',
      GrandChildS3KeyParam: 'child-key-param-value',
      ChildS3BucketParam: 'bucket-param-value',
      ChildS3KeyParam: 'key-param-value',
    });

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
      FunctionName: 'my-function',
      S3Bucket: 'bucket-param-value',
      S3Key: 'key-param-value',
    });
    expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
      FunctionName: 'my-function',
      S3Bucket: 'child-bucket-param-value',
      S3Key: 'child-key-param-value',
    });
  });

  test('looking up objects in nested stacks works', async () => {
    hotswapMockSdkProvider = setup.setupHotswapNestedStackTests('LambdaRoot');
    mockUpdateLambdaCode = jest.fn().mockReturnValue({});
    mockPublishVersion = jest.fn();
    hotswapMockSdkProvider.stubLambda({
      updateFunctionCode: mockUpdateLambdaCode,
      publishVersion: mockPublishVersion,
    });

    const rootStack = testStack({
      stackName: 'LambdaRoot',
      template: {
        Resources: {
          NestedStack: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'https://www.magic-url.com',
            },
            Metadata: {
              'aws:asset:path': 'one-lambda-version-stack.nested.template.json',
            },
          },
        },
      },
    });

    setup.addTemplateToCloudFormationLookupMock(rootStack);
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
          },
          Version: {
            Type: 'AWS::Lambda::Version',
            Properties: {
              FunctionName: { Ref: 'Func' },
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

    const cdkStackArtifact = testStack({ stackName: 'LambdaRoot', template: rootStack.template });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockPublishVersion).toHaveBeenCalledWith({
      FunctionName: 'my-function',
    });
  });
});
