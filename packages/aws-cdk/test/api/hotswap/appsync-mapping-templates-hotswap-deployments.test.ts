import { AppSync } from 'aws-sdk';
import * as setup from './hotswap-test-setup';

let hotswapMockSdkProvider: setup.HotswapMockSdkProvider;
let mockUpdateResolver: (params: AppSync.UpdateResolverRequest) => AppSync.UpdateResolverResponse;
let mockUpdateFunction: (params: AppSync.UpdateFunctionRequest) => AppSync.UpdateFunctionResponse;

beforeEach(() => {
  hotswapMockSdkProvider = setup.setupHotswapTests();
  mockUpdateResolver = jest.fn();
  mockUpdateFunction = jest.fn();
  hotswapMockSdkProvider.stubAppSync({ updateResolver: mockUpdateResolver, updateFunction: mockUpdateFunction });
});

test('returns undefined when a new Resolver is added to the Stack', async () => {
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
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
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
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

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

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateResolver).not.toHaveBeenCalled();
});

test('does not call the updateResolver() API when it receives a change that is not a mapping template difference in a Resolver', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      AppSyncResolver: {
        Type: 'AWS::AppSync::Resolver',
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
          Type: 'AWS::AppSync::Resolver',
          Properties: {
            RequestMappingTemplate: '## new template',
            FieldName: 'newField',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateResolver).not.toHaveBeenCalled();
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
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateResolver).not.toHaveBeenCalled();
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
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

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

test('does not call the updateFunction() API when it receives a change that is not a mapping template difference in a Function', async () => {
  // GIVEN
  setup.setCurrentCfnStackTemplate({
    Resources: {
      AppSyncFunction: {
        Type: 'AWS::AppSync::FunctionConfiguration',
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
          Type: 'AWS::AppSync::FunctionConfiguration',
          Properties: {
            RequestMappingTemplate: '## new template',
            Name: 'my-function',
            DataSourceName: 'new-datasource',
          },
        },
      },
    },
  });

  // WHEN
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateFunction).not.toHaveBeenCalled();
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
  const deployStackResult = await hotswapMockSdkProvider.tryHotswapDeployment(cdkStackArtifact);

  // THEN
  expect(deployStackResult).toBeUndefined();
  expect(mockUpdateFunction).not.toHaveBeenCalled();
});
