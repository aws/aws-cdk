/* eslint-disable import/order */
import { AppSync, S3 } from 'aws-sdk';
import * as setup from './hotswap-test-setup';
import { HotswapMode } from '../../../lib/api/hotswap/common';

let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;
let mockUpdateResolver: (params: AppSync.UpdateResolverRequest) => AppSync.UpdateResolverResponse;
let mockUpdateFunction: (params: AppSync.UpdateFunctionRequest) => AppSync.UpdateFunctionResponse;
let mockUpdateApiKey: (params: AppSync.UpdateApiKeyRequest) => AppSync.UpdateApiKeyResponse;
let mockStartSchemaCreation: (params: AppSync.StartSchemaCreationRequest) => AppSync.StartSchemaCreationResponse;
let mockS3GetObject: (params: S3.GetObjectRequest) => S3.GetObjectOutput;

beforeEach(() => {
  hotswapMockSdkProvider = setup.setupHotswapTests();
  mockUpdateResolver = jest.fn();
  mockUpdateFunction = jest.fn();
  mockUpdateApiKey = jest.fn();
  mockStartSchemaCreation = jest.fn();
  hotswapMockSdkProvider.stubAppSync({
    updateResolver: mockUpdateResolver,
    updateFunction: mockUpdateFunction,
    updateApiKey: mockUpdateApiKey,
    startSchemaCreation: mockStartSchemaCreation,
  });

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

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    if (hotswapMode === HotswapMode.FALL_BACK) {
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateFunction).not.toHaveBeenCalled();
      expect(mockUpdateResolver).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
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

  test('calls the updateResolver() API when it receives only a mapping template difference s3 location in a Unit Resolver', async () => {
    // GIVEN
    mockS3GetObject = jest.fn().mockImplementation(async () => {
      return { Body: 'template defined in s3' };
    });
    hotswapMockSdkProvider.stubS3({ getObject: mockS3GetObject });
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
            RequestMappingTemplateS3Location: 's3://test-bucket/old_location',
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
              RequestMappingTemplateS3Location: 's3://test-bucket/path/to/key',
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
      requestMappingTemplate: 'template defined in s3',
      responseMappingTemplate: '## original response template',
    });
    expect(mockS3GetObject).toHaveBeenCalledWith({
      Bucket: 'test-bucket',
      Key: 'path/to/key',
    });
  });

  test('calls the updateResolver() API when it receives only a code s3 location in a Pipeline Resolver', async () => {
    // GIVEN
    mockS3GetObject = jest.fn().mockImplementation(async () => {
      return { Body: 'code defined in s3' };
    });
    hotswapMockSdkProvider.stubS3({ getObject: mockS3GetObject });
    setup.setCurrentCfnStackTemplate({
      Resources: {
        AppSyncResolver: {
          Type: 'AWS::AppSync::Resolver',
          Properties: {
            ApiId: 'apiId',
            FieldName: 'myField',
            TypeName: 'Query',
            DataSourceName: 'my-datasource',
            PipelineConfig: ['function1'],
            CodeS3Location: 's3://test-bucket/old_location',
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
              PipelineConfig: ['function1'],
              CodeS3Location: 's3://test-bucket/path/to/key',
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
      pipelineConfig: ['function1'],
      code: 'code defined in s3',
    });
    expect(mockS3GetObject).toHaveBeenCalledWith({
      Bucket: 'test-bucket',
      Key: 'path/to/key',
    });
  });

  test('calls the updateResolver() API when it receives only a code difference in a Pipeline Resolver', async () => {
    // GIVEN
    hotswapMockSdkProvider.stubS3({ getObject: mockS3GetObject });
    setup.setCurrentCfnStackTemplate({
      Resources: {
        AppSyncResolver: {
          Type: 'AWS::AppSync::Resolver',
          Properties: {
            ApiId: 'apiId',
            FieldName: 'myField',
            TypeName: 'Query',
            DataSourceName: 'my-datasource',
            PipelineConfig: ['function1'],
            Code: 'old code',
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
              PipelineConfig: ['function1'],
              Code: 'new code',
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
      pipelineConfig: ['function1'],
      code: 'new code',
    });
  });

  test('calls the updateResolver() API when it receives only a mapping template difference in a Pipeline Resolver', async () => {
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

    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    expect(deployStackResult).not.toBeUndefined();
    expect(mockUpdateResolver).toHaveBeenCalledWith({
      apiId: 'apiId',
      dataSourceName: 'my-datasource',
      typeName: 'Query',
      fieldName: 'myField',
      kind: 'PIPELINE',
      pipelineConfig: ['function1'],
      requestMappingTemplate: '## new request template',
      responseMappingTemplate: '## original response template',
    });
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

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    if (hotswapMode === HotswapMode.FALL_BACK) {
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateFunction).not.toHaveBeenCalled();
      expect(mockUpdateResolver).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
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

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    if (hotswapMode === HotswapMode.FALL_BACK) {
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateFunction).not.toHaveBeenCalled();
      expect(mockUpdateResolver).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
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

  test('calls the updateFunction() API with function version when it receives both function version and runtime with a mapping template in a Function', async () => {
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
            Runtime: 'APPSYNC_JS',
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
              Runtime: 'APPSYNC_JS',
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

  test('calls the updateFunction() API with runtime when it receives both function version and runtime with code in a Function', async () => {
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
            Runtime: 'APPSYNC_JS',
            Code: 'old test code',
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
              Runtime: 'APPSYNC_JS',
              Code: 'new test code',
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
      runtime: 'APPSYNC_JS',
      name: 'my-function',
      code: 'new test code',
    });
  });

  test('calls the updateFunction() API when it receives only a mapping template s3 location difference in a Function', async () => {
    // GIVEN
    mockS3GetObject = jest.fn().mockImplementation(async () => {
      return { Body: 'template defined in s3' };
    });
    hotswapMockSdkProvider.stubS3({ getObject: mockS3GetObject });
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
            ResponseMappingTemplateS3Location: 's3://test-bucket/old_location',
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
              ResponseMappingTemplateS3Location: 's3://test-bucket/path/to/key',
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
      responseMappingTemplate: 'template defined in s3',
    });
    expect(mockS3GetObject).toHaveBeenCalledWith({
      Bucket: 'test-bucket',
      Key: 'path/to/key',
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

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    if (hotswapMode === HotswapMode.FALL_BACK) {
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateFunction).not.toHaveBeenCalled();
      expect(mockUpdateResolver).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
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

    // WHEN
    const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact);

    // THEN
    if (hotswapMode === HotswapMode.FALL_BACK) {
      expect(deployStackResult).toBeUndefined();
      expect(mockUpdateFunction).not.toHaveBeenCalled();
      expect(mockUpdateResolver).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      expect(deployStackResult).not.toBeUndefined();
      expect(deployStackResult?.noOp).toEqual(true);
      expect(mockUpdateFunction).not.toHaveBeenCalled();
      expect(mockUpdateResolver).not.toHaveBeenCalled();
    }
  });

  test('calls the startSchemaCreation() API when it receives only a definition difference in a graphql schema', async () => {
    // GIVEN
    mockStartSchemaCreation = jest.fn().mockReturnValueOnce({ status: 'SUCCESS' });
    hotswapMockSdkProvider.stubAppSync({ startSchemaCreation: mockStartSchemaCreation });

    setup.setCurrentCfnStackTemplate({
      Resources: {
        AppSyncGraphQLSchema: {
          Type: 'AWS::AppSync::GraphQLSchema',
          Properties: {
            ApiId: 'apiId',
            Definition: 'original graphqlSchema',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    });
    setup.pushStackResourceSummaries(
      setup.stackSummaryOf(
        'AppSyncGraphQLSchema',
        'AWS::AppSync::GraphQLSchema',
        'arn:aws:appsync:us-east-1:111111111111:apis/apiId/schema/my-schema',
      ),
    );
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          AppSyncGraphQLSchema: {
            Type: 'AWS::AppSync::GraphQLSchema',
            Properties: {
              ApiId: 'apiId',
              Definition: 'new graphqlSchema',
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
    expect(mockStartSchemaCreation).toHaveBeenCalledWith({
      apiId: 'apiId',
      definition: 'new graphqlSchema',
    });
  });

  test('calls the startSchemaCreation() API when it receives only a definition s3 location difference in a graphql schema', async () => {
    // GIVEN
    mockS3GetObject = jest.fn().mockImplementation(async () => {
      return { Body: 'schema defined in s3' };
    });
    hotswapMockSdkProvider.stubS3({ getObject: mockS3GetObject });
    mockStartSchemaCreation = jest.fn().mockReturnValueOnce({ status: 'SUCCESS' });
    hotswapMockSdkProvider.stubAppSync({ startSchemaCreation: mockStartSchemaCreation });

    setup.setCurrentCfnStackTemplate({
      Resources: {
        AppSyncGraphQLSchema: {
          Type: 'AWS::AppSync::GraphQLSchema',
          Properties: {
            ApiId: 'apiId',
            DefinitionS3Location: 's3://test-bucket/old_location',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    });
    setup.pushStackResourceSummaries(
      setup.stackSummaryOf(
        'AppSyncGraphQLSchema',
        'AWS::AppSync::GraphQLSchema',
        'arn:aws:appsync:us-east-1:111111111111:apis/apiId/schema/my-schema',
      ),
    );
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          AppSyncGraphQLSchema: {
            Type: 'AWS::AppSync::GraphQLSchema',
            Properties: {
              ApiId: 'apiId',
              DefinitionS3Location: 's3://test-bucket/path/to/key',
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
    expect(mockStartSchemaCreation).toHaveBeenCalledWith({
      apiId: 'apiId',
      definition: 'schema defined in s3',
    });

    expect(mockS3GetObject).toHaveBeenCalledWith({
      Bucket: 'test-bucket',
      Key: 'path/to/key',
    });
  });

  test('does not call startSchemaCreation() API when a resource with type that is not AWS::AppSync::GraphQLSchema but has the same properties is change', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        AppSyncGraphQLSchema: {
          Type: 'AWS::AppSync::NotGraphQLSchema',
          Properties: {
            ApiId: 'apiId',
            Definition: 'original graphqlSchema',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    });
    setup.pushStackResourceSummaries(
      setup.stackSummaryOf(
        'AppSyncGraphQLSchema',
        'AWS::AppSync::GraphQLSchema',
        'arn:aws:appsync:us-east-1:111111111111:apis/apiId/schema/my-schema',
      ),
    );
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          AppSyncGraphQLSchema: {
            Type: 'AWS::AppSync::NotGraphQLSchema',
            Properties: {
              ApiId: 'apiId',
              Definition: 'new graphqlSchema',
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
    if (hotswapMode === HotswapMode.FALL_BACK) {
      expect(deployStackResult).toBeUndefined();
      expect(mockStartSchemaCreation).not.toHaveBeenCalled();
    } else if (hotswapMode === HotswapMode.HOTSWAP_ONLY) {
      expect(deployStackResult).not.toBeUndefined();
      expect(deployStackResult?.noOp).toEqual(true);
      expect(mockStartSchemaCreation).not.toHaveBeenCalled();
    }
  });

  test('calls the startSchemaCreation() and waits for schema creation to stabilize before finishing', async () => {
    // GIVEN
    mockStartSchemaCreation = jest.fn().mockReturnValueOnce({ status: 'PROCESSING' });
    const mockGetSchemaCreation = jest.fn().mockReturnValueOnce({ status: 'SUCCESS' });
    hotswapMockSdkProvider.stubAppSync({ startSchemaCreation: mockStartSchemaCreation, getSchemaCreationStatus: mockGetSchemaCreation });

    setup.setCurrentCfnStackTemplate({
      Resources: {
        AppSyncGraphQLSchema: {
          Type: 'AWS::AppSync::GraphQLSchema',
          Properties: {
            ApiId: 'apiId',
            Definition: 'original graphqlSchema',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    });
    setup.pushStackResourceSummaries(
      setup.stackSummaryOf(
        'AppSyncGraphQLSchema',
        'AWS::AppSync::GraphQLSchema',
        'arn:aws:appsync:us-east-1:111111111111:apis/apiId/schema/my-schema',
      ),
    );
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          AppSyncGraphQLSchema: {
            Type: 'AWS::AppSync::GraphQLSchema',
            Properties: {
              ApiId: 'apiId',
              Definition: 'new graphqlSchema',
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
    expect(mockStartSchemaCreation).toHaveBeenCalledWith({
      apiId: 'apiId',
      definition: 'new graphqlSchema',
    });
    expect(mockGetSchemaCreation).toHaveBeenCalledWith({
      apiId: 'apiId',
    });
  });

  test('calls the startSchemaCreation() and throws if schema creation fails', async () => {
    // GIVEN
    mockStartSchemaCreation = jest.fn().mockReturnValueOnce({ status: 'PROCESSING' });
    const mockGetSchemaCreation = jest.fn().mockReturnValueOnce({ status: 'FAILED', details: 'invalid schema' });
    hotswapMockSdkProvider.stubAppSync({ startSchemaCreation: mockStartSchemaCreation, getSchemaCreationStatus: mockGetSchemaCreation });

    setup.setCurrentCfnStackTemplate({
      Resources: {
        AppSyncGraphQLSchema: {
          Type: 'AWS::AppSync::GraphQLSchema',
          Properties: {
            ApiId: 'apiId',
            Definition: 'original graphqlSchema',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    });
    setup.pushStackResourceSummaries(
      setup.stackSummaryOf(
        'AppSyncGraphQLSchema',
        'AWS::AppSync::GraphQLSchema',
        'arn:aws:appsync:us-east-1:111111111111:apis/apiId/schema/my-schema',
      ),
    );
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          AppSyncGraphQLSchema: {
            Type: 'AWS::AppSync::GraphQLSchema',
            Properties: {
              ApiId: 'apiId',
              Definition: 'new graphqlSchema',
            },
            Metadata: {
              'aws:asset:path': 'new-path',
            },
          },
        },
      },
    });

    // WHEN
    await expect(() => hotswapMockSdkProvider.tryHotswapDeployment(hotswapMode, cdkStackArtifact)).rejects.toThrow('invalid schema');

    // THEN
    expect(mockStartSchemaCreation).toHaveBeenCalledWith({
      apiId: 'apiId',
      definition: 'new graphqlSchema',
    });
    expect(mockGetSchemaCreation).toHaveBeenCalledWith({
      apiId: 'apiId',
    });
  });

  test('calls the updateApiKey() API when it receives only a expires property difference in an AppSync ApiKey', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        AppSyncApiKey: {
          Type: 'AWS::AppSync::ApiKey',
          Properties: {
            ApiId: 'apiId',
            Expires: 1000,
            Id: 'key-id',
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    });
    setup.pushStackResourceSummaries(
      setup.stackSummaryOf(
        'AppSyncApiKey',
        'AWS::AppSync::ApiKey',
        'arn:aws:appsync:us-east-1:111111111111:apis/apiId/apikeys/api-key-id',
      ),
    );
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          AppSyncApiKey: {
            Type: 'AWS::AppSync::ApiKey',
            Properties: {
              ApiId: 'apiId',
              Expires: 1001,
              Id: 'key-id',
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
    expect(mockUpdateApiKey).toHaveBeenCalledWith({
      apiId: 'apiId',
      expires: 1001,
      id: 'key-id',
    });
  });

  test('calls the updateApiKey() API when it receives only a expires property difference and no api-key-id in an AppSync ApiKey', async () => {
    // GIVEN
    setup.setCurrentCfnStackTemplate({
      Resources: {
        AppSyncApiKey: {
          Type: 'AWS::AppSync::ApiKey',
          Properties: {
            ApiId: 'apiId',
            Expires: 1000,
          },
          Metadata: {
            'aws:asset:path': 'old-path',
          },
        },
      },
    });
    setup.pushStackResourceSummaries(
      setup.stackSummaryOf(
        'AppSyncApiKey',
        'AWS::AppSync::ApiKey',
        'arn:aws:appsync:us-east-1:111111111111:apis/apiId/apikeys/api-key-id',
      ),
    );
    const cdkStackArtifact = setup.cdkStackArtifactOf({
      template: {
        Resources: {
          AppSyncApiKey: {
            Type: 'AWS::AppSync::ApiKey',
            Properties: {
              ApiId: 'apiId',
              Expires: 1001,
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
    expect(mockUpdateApiKey).toHaveBeenCalledWith({
      apiId: 'apiId',
      expires: 1001,
      id: 'api-key-id',
    });
  });
});
