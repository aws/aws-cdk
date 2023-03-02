import { AppSync } from 'aws-sdk';
import * as setup from './hotswap-test-setup';
import { HotswapMode } from '../../../lib/api/hotswap/common';

let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;
let mockUpdateResolver: (params: AppSync.UpdateResolverRequest) => AppSync.UpdateResolverResponse;
let mockUpdateFunction: (params: AppSync.UpdateFunctionRequest) => AppSync.UpdateFunctionResponse;

beforeEach(() => {
  hotswapMockSdkProvider = setup.setupHotswapTests();
  mockUpdateResolver = jest.fn();
  mockUpdateFunction = jest.fn();
  hotswapMockSdkProvider.stubAppSync({ updateResolver: mockUpdateResolver, updateFunction: mockUpdateFunction });
});

describe.each([HotswapMode.FALL_BACK, HotswapMode.HOTSWAP_ONLY])('%p mode', (hotswapMode) => {
  test(`A new Resolver being added to the Stack returns undefined in CLASSIC mode and
        returns a noOp in HOTSWAP_ONLY mode`,
  async () => {
    // GIVEN
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          AppSyncResolver: {
            Type: 'AWS::AppSync::Resolver',
          },
        },
      },
    });

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateFunction).not.toHaveBeenCalled();
      expect(mockUpdateResolver).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(deployStackResult?.noOp).toEqual(true);
      expect(mockUpdateFunction).not.toHaveBeenCalled();
      expect(mockUpdateResolver).not.toHaveBeenCalled();
    }
  });

  test('calls the updateResolver() API when it receives only a mapping template difference in a Unit Resolver', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        AppSyncResolver: {
          Type: 'AWS::AppSync::Resolver',
          Properties: {
            ApiId: 'apiId',
            FieldName: 'myField',
            TypeName: 'Query',
            DataSourceName: 'my-datasource',
            Kind: 'UNIT',
            RequestMappingTemplate: '## original request template',
            ResponseMappingTemplate: '## original response template',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    });
    setup.pushStackResourceSummaries(
      setup.stackSummaryOf(
        'AppSyncResolver',
        'AWS::AppSync::Resolver',
        'arn:aws:appsync:us-east-1:111111111111:apis/apiId/types/Query/resolvers/myField',
      ),
    );
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          AppSyncResolver: {
            Type: 'AWS::AppSync::Resolver',
            Properties: {
              ApiId: 'apiId',
              FieldName: 'myField',
              TypeName: 'Query',
              DataSourceName: 'my-datasource',
              Kind: 'UNIT',
              RequestMappingTemplate: '## new request template',
              ResponseMappingTemplate: '## original response template',
            },
            Metadata: {
              'aws:asset:path': 'new-path',
            },
          },
        },
      },
    });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockUpdateResolver).toHaveBeenCalledWith({
      apiId: 'apiId',
      dataSourceName: 'my-datasource',
      typeName: 'Query',
      fieldName: 'myField',
      kind: 'UNIT',
      requestMappingTemplate: '## new request template',
      responseMappingTemplate: '## original response template',
    });
  });

  test('does not call the updateResolver() API when it receives only a mapping template difference in a Pipeline Resolver', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        AppSyncResolver: {
          Type: 'AWS::AppSync::Resolver',
          Properties: {
            ApiId: 'apiId',
            FieldName: 'myField',
            TypeName: 'Query',
            DataSourceName: 'my-datasource',
            Kind: 'PIPELINE',
            PipelineConfig: ['function1'],
            RequestMappingTemplate: '## original request template',
            ResponseMappingTemplate: '## original response template',
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
          AppSyncResolver: {
            Type: 'AWS::AppSync::Resolver',
            Properties: {
              ApiId: 'apiId',
              FieldName: 'myField',
              TypeName: 'Query',
              DataSourceName: 'my-datasource',
              Kind: 'PIPELINE',
              PipelineConfig: ['function1'],
              RequestMappingTemplate: '## new request template',
              ResponseMappingTemplate: '## original response template',
            },
            Metadata: {
              'aws:asset:path': 'new-path',
            },
          },
        },
      },
    });

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateFunction).not.toHaveBeenCalled();
      expect(mockUpdateResolver).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(deployStackResult?.noOp).toEqual(true);
      expect(mockUpdateFunction).not.toHaveBeenCalled();
      expect(mockUpdateResolver).not.toHaveBeenCalled();
    }
  });

  test(`when it receives a change that is not a mapping template difference in a Resolver, it does not call the updateResolver() API in CLASSIC mode
        but does call the updateResolver() API in HOTSWAP_ONLY mode`,
  async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        AppSyncResolver: {
          Type: 'AWS::AppSync::Resolver',
          Properties: {
            ResponseMappingTemplate: '## original response template',
            RequestMappingTemplate: '## original request template',
            FieldName: 'oldField',
            ApiId: 'apiId',
            TypeName: 'Query',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    });
    setup.pushStackResourceSummaries(
      setup.stackSummaryOf(
        'AppSyncResolver',
        'AWS::AppSync::Resolver',
        'arn:aws:appsync:us-east-1:111111111111:apis/apiId/types/Query/resolvers/myField',
      ),
    );
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          AppSyncResolver: {
            Type: 'AWS::AppSync::Resolver',
            Properties: {
              ResponseMappingTemplate: '## original response template',
              RequestMappingTemplate: '## new request template',
              FieldName: 'newField',
              ApiId: 'apiId',
              TypeName: 'Query',
            },
          },
        },
      },
    });

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateFunction).not.toHaveBeenCalled();
      expect(mockUpdateResolver).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(mockUpdateFunction).not.toHaveBeenCalled();
      expect(mockUpdateResolver).toHaveBeenCalledWith({
        apiId: 'apiId',
        typeName: 'Query',
        fieldName: 'oldField',
        requestMappingTemplate: '## new request template',
        responseMappingTemplate: '## original response template',
      });
    }
  });

  test('does not call the updateResolver() API when a resource with type that is not AWS::AppSync::Resolver but has the same properties is changed', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        AppSyncResolver: {
          Type: 'AWS::AppSync::NotAResolver',
          Properties: {
            RequestMappingTemplate: '## original template',
            FieldName: 'oldField',
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
          AppSyncResolver: {
            Type: 'AWS::AppSync::NotAResolver',
            Properties: {
              RequestMappingTemplate: '## new template',
              FieldName: 'newField',
            },
          },
        },
      },
    });

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateFunction).not.toHaveBeenCalled();
      expect(mockUpdateResolver).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(deployStackResult?.noOp).toEqual(true);
      expect(mockUpdateFunction).not.toHaveBeenCalled();
      expect(mockUpdateResolver).not.toHaveBeenCalled();
    }
  });

  test('calls the updateFunction() API when it receives only a mapping template difference in a Function', async () => {
    // GIVEN
    const mockListFunctions = jest.fn().mockReturnValue({ functions: [{ name: 'my-function', functionId: 'functionId' }] });
    hotswapMockSdkProvider.stubAppSync({ listFunctions: mockListFunctions, updateFunction: mockUpdateFunction });

    setup.setCurrentCfnStackTemplate({
      Resources: {
        AppSyncFunction: {
          Type: 'AWS::AppSync::FunctionConfiguration',
          Properties: {
            Name: 'my-function',
            ApiId: 'apiId',
            DataSourceName: 'my-datasource',
            FunctionVersion: '2018-05-29',
            RequestMappingTemplate: '## original request template',
            ResponseMappingTemplate: '## original response template',
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
          AppSyncFunction: {
            Type: 'AWS::AppSync::FunctionConfiguration',
            Properties: {
              Name: 'my-function',
              ApiId: 'apiId',
              DataSourceName: 'my-datasource',
              FunctionVersion: '2018-05-29',
              RequestMappingTemplate: '## original request template',
              ResponseMappingTemplate: '## new response template',
            },
            Metadata: {
              'aws:asset:path': 'new-path',
            },
          },
        },
      },
    });

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockUpdateFunction).toHaveBeenCalledWith({
      apiId: 'apiId',
      dataSourceName: 'my-datasource',
      functionId: 'functionId',
      functionVersion: '2018-05-29',
      name: 'my-function',
      requestMappingTemplate: '## original request template',
      responseMappingTemplate: '## new response template',
    });
  });

  test(`when it receives a change that is not a mapping template difference in a Function, it does not call the updateFunction() API in CLASSIC mode
        but does in HOTSWAP_ONLY mode`,
  async () => {
    // GIVEN
    const mockListFunctions = jest.fn().mockReturnValue({ functions: [{ name: 'my-function', functionId: 'functionId' }] });
    hotswapMockSdkProvider.stubAppSync({ listFunctions: mockListFunctions, updateFunction: mockUpdateFunction });

    setup.setCurrentCfnStackTemplate({
      Resources: {
        AppSyncFunction: {
          Type: 'AWS::AppSync::FunctionConfiguration',
          Properties: {
            RequestMappingTemplate: '## original request template',
            ResponseMappingTemplate: '## original response template',
            Name: 'my-function',
            ApiId: 'apiId',
            DataSourceName: 'my-datasource',
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
          AppSyncFunction: {
            Type: 'AWS::AppSync::FunctionConfiguration',
            Properties: {
              RequestMappingTemplate: '## new request template',
              ResponseMappingTemplate: '## original response template',
              ApiId: 'apiId',
              Name: 'my-function',
              DataSourceName: 'new-datasource',
            },
          },
        },
      },
    });

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateFunction).not.toHaveBeenCalled();
      expect(mockUpdateResolver).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(mockUpdateFunction).toHaveBeenCalledWith({
        apiId: 'apiId',
        dataSourceName: 'my-datasource',
        functionId: 'functionId',
        name: 'my-function',
        requestMappingTemplate: '## new request template',
        responseMappingTemplate: '## original response template',
      });
      expect(mockUpdateResolver).not.toHaveBeenCalled();
    }
  });

  test('does not call the updateFunction() API when a resource with type that is not AWS::AppSync::FunctionConfiguration but has the same properties is changed', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        AppSyncFunction: {
          Type: 'AWS::AppSync::NotAFunctionConfiguration',
          Properties: {
            RequestMappingTemplate: '## original template',
            Name: 'my-function',
            DataSourceName: 'my-datasource',
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
          AppSyncFunction: {
            Type: 'AWS::AppSync::NotAFunctionConfiguration',
            Properties: {
              RequestMappingTemplate: '## new template',
              Name: 'my-resolver',
              DataSourceName: 'my-datasource',
            },
          },
        },
      },
    });

    if (hotswapMode === HotswapMode.FALL_BACK) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateFunction).not.toHaveBeenCalled();
      expect(mockUpdateResolver).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      // WHEN
      const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

      // THEN
      expect(deployStackResult).not.toBeUndefined();
      expect(deployStackResult?.noOp).toEqual(true);
      expect(mockUpdateFunction).not.toHaveBeenCalled();
      expect(mockUpdateResolver).not.toHaveBeenCalled();
    }
  });
});
