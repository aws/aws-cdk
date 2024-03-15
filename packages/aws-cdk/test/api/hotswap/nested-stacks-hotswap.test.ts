/* eslint-disable import/order */
import { Lambda } from 'aws-sdk';
import * as setup from './hotswap-test-setup';
import { HotswapMode } from '../../../lib/api/hotswap/common';
import { testStack } from '../../util';

let mockUpdateLambdaCode: (params: Lambda.Types.UpdateFunctionCodeRequest) => Lambda.Types.FunctionConfiguration;
let mockPublishVersion: jest.Mock<Lambda.FunctionConfiguration, Lambda.PublishVersionRequest[]>;
let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;

describe.each([HotswapMode.FALL_BACK, HotswapMode.HOTSWAP_ONLY])('%p mode', (hotswapMode) => {
  test('can hotswap a lambda function in a 1-level nested stack', async () => {
    // GIVEN
    hotswapMockSdkProvider = setup.setupHotswapNestedStackTests('LambdaRoot');
    mockUpdateLambdaCode = jest.fn().mockReturnValue({});
    hotswapMockSdkProvider.stubLambda({
      updateFunctionCode: mockUpdateLambdaCode,
    });

    const oldRootStack = testStack({
      stackName: 'LambdaRoot',
      template: {
        Resources: {
          NestedStack: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'https://www.amazoff.com',
            },
            Metadata: {
              'aws:asset:path': 'one-lambda-stack.nested.template.json',
            },
          },
        },
      },
    });

    setup.addTemplateToCloudFormationLookupMock(oldRootStack);
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
              'aws:asset:path': 'old-lambda-path',
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

    // WHEN
    oldRootStack.template.Resources.NestedStack.Properties.TemplateURL = 'https://www.amazon.com';
    const newRootStack = testStack({ stackName: 'LambdaRoot', template: oldRootStack.template });
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, newRootStack);

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

    const oldRootStack = testStack({
      stackName: 'TwoLevelLambdaRoot',
      template: {
        Resources: {
          ChildStack: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'https://www.amazoff.com',
            },
            Metadata: {
              'aws:asset:path': 'one-lambda-one-stack-stack.nested.template.json',
            },
          },
        },
      },
    });

    setup.addTemplateToCloudFormationLookupMock(oldRootStack);

    const oldChildStack = testStack({
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
              'aws:asset:path': 'old-lambda-path',
            },
          },
          GrandChildStack: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'https://www.amazoff.com',
            },
            Metadata: {
              'aws:asset:path': 'one-lambda-stack.nested.template.json',
            },
          },
        },
      },
    });
    setup.addTemplateToCloudFormationLookupMock(oldChildStack);

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
              'aws:asset:path': 'old-lambda-path',
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

    // WHEN
    oldRootStack.template.Resources.ChildStack.Properties.TemplateURL = 'https://www.amazon.com';
    oldChildStack.template.Resources.GrandChildStack.Properties.TemplateURL = 'https://www.amazon.com';

    // write the new templates to disk
    const newRootStack = testStack({ stackName: oldRootStack.stackName, template: oldRootStack.template });
    testStack({ stackName: oldChildStack.stackName, template: oldChildStack.template });

    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, newRootStack);

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

    const oldRootStack = testStack({
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
              'aws:asset:path': 'old-lambda-path',
            },
          },
        },
      },
    });

    setup.addTemplateToCloudFormationLookupMock(oldRootStack);
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
              'aws:asset:path': 'old-lambda-path',
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

    // WHEN
    oldRootStack.template.Resources.Func.Properties.Code.S3Bucket = 'new-bucket';
    oldRootStack.template.Resources.NestedStack.Properties.TemplateURL = 'https://www.amazon.com';
    // write the updated templates to disk
    const newRootStack = testStack({ stackName: oldRootStack.stackName, template: oldRootStack.template });
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, newRootStack);

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

    const oldRootStack = testStack({
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
              'aws:asset:path': 'old-lambda-path',
            },
          },
        },
      },
    });

    setup.addTemplateToCloudFormationLookupMock(oldRootStack);
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
              'aws:asset:path': 'old-lambda-path',
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

    oldRootStack.template.Resources.Func.Properties.Code.S3Bucket = 'new-bucket';
    oldRootStack.template.Resources.NestedStack.Properties.TemplateURL = 'https://www.amazon.com';
    const newRootStack = testStack({ stackName: oldRootStack.stackName, template: oldRootStack.template });

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, newRootStack);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();

    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, newRootStack);

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

    const oldRootStack = testStack({
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
              'aws:asset:path': 'old-lambda-path',
            },
          },
        },
      },
    });

    setup.addTemplateToCloudFormationLookupMock(oldRootStack);
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
              'aws:asset:path': 'old-lambda-path',
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

    oldRootStack.template.Resources.Func.Properties.Code.S3Bucket = 'new-bucket';
    delete oldRootStack.template.Resources.NestedStack;
    const newRootStack = testStack({ stackName: oldRootStack.stackName, template: oldRootStack.template });

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, newRootStack);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, newRootStack);

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

    const oldRootStack = testStack({
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
              'aws:asset:path': 'old-lambda-path',
            },
          },
        },
      },
    });

    setup.addTemplateToCloudFormationLookupMock(oldRootStack);

    oldRootStack.template.Resources.Func.Properties.Code.S3Bucket = 'new-bucket';
    oldRootStack.template.Resources.NestedStack = {
      Type: 'AWS::CloudFormation::Stack',
      Properties: {
        TemplateURL: 'https://www.amazon.com',
      },
      Metadata: {
        'aws:asset:path': 'one-lambda-stack.nested.template.json',
      },
    };
    // we need this because testStack() immediately writes the template to disk, so changing the template afterwards is not going to update the file.
    const newRootStack = testStack({ stackName: oldRootStack.stackName, template: oldRootStack.template });

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, newRootStack);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();

    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, newRootStack);

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

    const oldRootStack = testStack({
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
              'aws:asset:path': 'old-lambda-path',
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
              'aws:asset:path': 'old-lambda-path',
            },
          },
        },
      },
    });

    setup.addTemplateToCloudFormationLookupMock(oldRootStack);

    oldRootStack.template.Resources.Func.Properties.Code.S3Bucket = 'new-bucket';
    oldRootStack.template.Resources.FutureNestedStack = {
      Type: 'AWS::CloudFormation::Stack',
      Properties: {
        TemplateURL: 'https://www.amazon.com',
      },
      Metadata: {
        'aws:asset:path': 'one-lambda-stack.nested.template.json',
      },
    };
    // write the updated template to disk
    const newRootStack = testStack({ stackName: oldRootStack.stackName, template: oldRootStack.template });

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, newRootStack);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateLambdaCode).not.toHaveBeenCalled();

    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, newRootStack);

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
        'aws:asset:path': 'old-lambda-path',
      },
    };

    const oldRootStack = testStack({
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

    setup.addTemplateToCloudFormationLookupMock(oldRootStack);

    const oldChildStack = testStack({
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
    });
    setup.addTemplateToCloudFormationLookupMock(oldChildStack);

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

    // WHEN
    oldRootStack.template.Resources.Func.Properties.Code.S3Key = 'new-key';
    oldRootStack.template.Resources.ChildStack.Properties.TemplateURL = 'https://www.amazon.com';
    oldChildStack.template.Resources.GrandChildStackA.Properties.TemplateURL = 'https://www.amazon.com';
    oldChildStack.template.Resources.GrandChildStackB.Properties.TemplateURL = 'https://www.amazon.com';

    const newRootStack = testStack({ stackName: oldRootStack.stackName, template: oldRootStack.template });
    //testStack({ stackName: oldChildStack.stackName, template: oldChildStack.template });

    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, newRootStack);

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
              'aws:asset:path': 'old-lambda-path',
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

    rootStack.template.Resources.NestedStack.Properties.TemplateURL = 'https://www.amazon.com';

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, rootStack, {
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

  test('can hotswap a lambda function in a 2-level nested stack with dependency on an output of 2nd level sibling stack', async () => {
    // GIVEN: RootStack has one child stack `FirstLevelNestedStack` which further has two child stacks
    // `NestedLambdaStack` and `NestedSiblingStack`. `NestedLambdaStack` takes two parameters s3Key
    // and s3Bucket and use them for a Lambda function.
    // RootStack resolves s3Bucket from a root template parameter and passed to FirstLevelRootStack which
    // resolves s3Key through output of `NestedSiblingStack`
    hotswapMockSdkProvider = setup.setupHotswapNestedStackTests('RootStack');
    mockUpdateLambdaCode = jest.fn().mockReturnValue({});
    hotswapMockSdkProvider.stubLambda({
      updateFunctionCode: mockUpdateLambdaCode,
    });

    const oldRootStack = testStack({
      stackName: 'RootStack',
      template: {
        Resources: {
          FirstLevelNestedStack: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'https://www.magic-url.com',
              Parameters: {
                S3BucketParam: {
                  Ref: 'S3BucketParam',
                },
              },
            },
            Metadata: {
              'aws:asset:path': 'one-stack-with-two-nested-stacks-stack.template.json',
            },
          },
        },
        Parameters: {
          S3BucketParam: {
            Type: 'String',
            Description: 'S3 bucket for asset',
          },
        },
      },
    });

    const oldFirstLevelNestedStack = testStack({
      stackName: 'FirstLevelNestedStack',
      template: {
        Resources: {
          NestedLambdaStack: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'https://www.magic-url.com',
              Parameters: {
                referenceToS3BucketParam: {
                  Ref: 'S3BucketParam',
                },
                referenceToS3StackKeyOutput: {
                  'Fn::GetAtt': [
                    'NestedSiblingStack',
                    'Outputs.NestedOutput',
                  ],
                },
              },
            },
            Metadata: {
              'aws:asset:path': 'one-lambda-stack-with-dependency-on-sibling-stack-output.nested.template.json',
            },
          },
          NestedSiblingStack: {
            Type: 'AWS::CloudFormation::Stack',
            Properties: {
              TemplateURL: 'https://www.magic-url.com',
            },
            Metadata: {
              'aws:asset:path': 'one-output-stack.nested.template.json',
            },
          },
        },
        Parameters: {
          S3BucketParam: {
            Type: 'String',
            Description: 'S3 bucket for asset',
          },
        },
      },
    });

    const nestedLambdaStack = testStack({
      stackName: 'NestedLambdaStack',
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
        },
        Metadata: {
          'aws:asset:path': 'old-lambda-path',
        },
      },
    });

    const nestedSiblingStack = testStack({
      stackName: 'NestedSiblingStack',
      template: {
        Outputs: {
          NestedOutput: { Value: 's3-key-value-from-output' },
        },
      },
    });

    setup.addTemplateToCloudFormationLookupMock(oldRootStack);
    setup.addTemplateToCloudFormationLookupMock(oldFirstLevelNestedStack);
    setup.addTemplateToCloudFormationLookupMock(nestedLambdaStack);
    setup.addTemplateToCloudFormationLookupMock(nestedSiblingStack);

    setup.pushNestedStackResourceSummaries(oldRootStack.stackName,
      setup.stackSummaryOf(oldFirstLevelNestedStack.stackName, 'AWS::CloudFormation::Stack',
        `arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/${oldFirstLevelNestedStack.stackName}/abcd`,
      ),
    );
    setup.pushNestedStackResourceSummaries(oldFirstLevelNestedStack.stackName,
      setup.stackSummaryOf(nestedLambdaStack.stackName, 'AWS::CloudFormation::Stack',
        `arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/${nestedLambdaStack.stackName}/abcd`,
      ),
      setup.stackSummaryOf(nestedSiblingStack.stackName, 'AWS::CloudFormation::Stack',
        `arn:aws:cloudformation:bermuda-triangle-1337:123456789012:stack/${nestedSiblingStack.stackName}/abcd`,
      ),
    );
    setup.pushNestedStackResourceSummaries(nestedLambdaStack.stackName,
      setup.stackSummaryOf('Func', 'AWS::Lambda::Function', 'nested-lambda-function'),
    );
    setup.pushNestedStackResourceSummaries(nestedSiblingStack.stackName);
    oldRootStack.template.Resources.FirstLevelNestedStack.Properties.TemplateURL = 'https://www.amazon.com';
    oldFirstLevelNestedStack.template.Resources.NestedLambdaStack.Properties.TemplateURL = 'https://www.amazon.com';
    oldFirstLevelNestedStack.template.Resources.NestedSiblingStack.Properties.TemplateURL = 'https://www.amazon.com';
    const newRootStack = testStack({ stackName: oldRootStack.stackName, template: oldRootStack.template });
    testStack({ stackName: oldFirstLevelNestedStack.stackName, template: oldFirstLevelNestedStack.template });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, newRootStack, {
      S3BucketParam: 'new-bucket',
    });

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
      FunctionName: 'my-function',
      S3Bucket: 'new-bucket',
      S3Key: 's3-key-value-from-output',
    });
  });

  test('can hotswap a lambda function in a 1-level nested stack and read default parameters value if not provided', async () => {
    // GIVEN: RootStack has one child stack `NestedStack`. `NestedStack` takes two
    // parameters s3Key and s3Bucket and use them for a Lambda function.
    // RootStack resolves both parameters from root template parameters. Current/old change
    // has hardcoded resolved values and the new change doesn't provide parameters through
    // root stack forcing the evaluation of default parameter values.
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
            Default: 'default-s3-bucket',
          },
          S3KeyParam: {
            Type: 'String',
            Description: 'S3 bucket for asset',
            Default: 'default-s3-key',
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
              'aws:asset:path': 'old-lambda-path',
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

    rootStack.template.Resources.NestedStack.Properties.TemplateURL = 'https://www.amazon.com';

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, rootStack);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockUpdateLambdaCode).toHaveBeenCalledWith({
      FunctionName: 'my-function',
      S3Bucket: 'default-s3-bucket',
      S3Key: 'default-s3-key',
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

    const childStack = testStack({
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
              'aws:asset:path': 'old-lambda-path',
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
    });
    setup.addTemplateToCloudFormationLookupMock(childStack);

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
              'aws:asset:path': 'old-lambda-path',
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

    rootStack.template.Resources.ChildStack.Properties.TemplateURL = 'https://www.amazon.com';
    childStack.template.Resources.GrandChildStack.Properties.TemplateURL = 'https://www.amazon.com';

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, rootStack, {
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
              TemplateURL: 'https://www.amazoff.com',
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

    // WHEN
    rootStack.template.Resources.NestedStack.Properties.TemplateURL = 'https://www.amazon.com';
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, rootStack);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockPublishVersion).toHaveBeenCalledWith({
      FunctionName: 'my-function',
    });
  });
});
