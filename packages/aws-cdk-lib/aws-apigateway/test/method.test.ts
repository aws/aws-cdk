import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';
import * as cdk from '../../core';
import * as apigw from '../lib';

const DUMMY_AUTHORIZER: apigw.IAuthorizer = {
  authorizerId: 'dummyauthorizer',
  authorizationType: apigw.AuthorizationType.CUSTOM,
};

describe('method', () => {
  test('default setup', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });

    // WHEN
    new apigw.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      AuthorizationType: 'NONE',
      Integration: {
        Type: 'MOCK',
      },
    });

  });

  test('method options can be specified', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });

    // WHEN
    new apigw.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
      options: {
        apiKeyRequired: true,
        operationName: 'MyOperation',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      ApiKeyRequired: true,
      OperationName: 'MyOperation',
    });

  });

  test('integration can be set via a property', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });

    // WHEN
    new apigw.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
      integration: new apigw.AwsIntegration({ service: 's3', path: 'bucket/key' }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        IntegrationHttpMethod: 'POST',
        Type: 'AWS',
        Uri: {
          'Fn::Join': [
            '',
            [
              'arn:', { Ref: 'AWS::Partition' }, ':apigateway:',
              { Ref: 'AWS::Region' }, ':s3:path/bucket/key',
            ],
          ],
        },
      },
    });

  });

  test('integration can be set for a service in the provided region', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });

    // WHEN
    new apigw.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
      integration: new apigw.AwsIntegration({ service: 'sqs', path: 'queueName', region: 'eu-west-1' }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        IntegrationHttpMethod: 'POST',
        Type: 'AWS',
        Uri: {
          'Fn::Join': [
            '',
            [
              'arn:', { Ref: 'AWS::Partition' }, ':apigateway:eu-west-1:sqs:path/queueName',
            ],
          ],
        },
      },
    });
  });

  test('integration with a custom http method can be set via a property', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });

    // WHEN
    new apigw.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
      integration: new apigw.AwsIntegration({ service: 's3', path: 'bucket/key', integrationHttpMethod: 'GET' }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        IntegrationHttpMethod: 'GET',
      },
    });

  });

  test('use default integration from api', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const defaultIntegration = new apigw.Integration({
      type: apigw.IntegrationType.HTTP_PROXY,
      integrationHttpMethod: 'POST',
      uri: 'https://amazon.com',
    });
    const api = new apigw.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      deploy: false,
      defaultIntegration,
    });

    // WHEN
    new apigw.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        Type: 'HTTP_PROXY',
        Uri: 'https://amazon.com',
      },
    });

  });

  test('"methodArn" returns the ARN execute-api ARN for this method in the current stage', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api');

    // WHEN
    const method = new apigw.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
    });

    // THEN
    expect(stack.resolve(method.methodArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':execute-api:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':',
          { Ref: 'testapiD6451F70' },
          '/',
          { Ref: 'testapiDeploymentStageprod5C9E92A4' },
          '/POST/',
        ],
      ],
    });

  });

  test('"testMethodArn" returns the ARN of the "test-invoke-stage" stage (console UI)', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api');

    // WHEN
    const method = new apigw.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
    });

    // THEN
    expect(stack.resolve(method.testMethodArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':execute-api:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':',
          { Ref: 'testapiD6451F70' },
          '/test-invoke-stage/POST/',
        ],
      ],
    });

  });

  test('"methodArn" returns an arn with "*" as its stage when deploymentStage is not set', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });

    // WHEN
    const method = new apigw.Method(stack, 'my-method', { httpMethod: 'POST', resource: api.root });

    // THEN
    expect(stack.resolve(method.methodArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':execute-api:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':',
          { Ref: 'testapiD6451F70' },
          '/*/POST/',
        ],
      ],
    });

  });

  test('"methodArn" and "testMethodArn" replace path parameters with asterisks', () => {
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api');
    const petId = api.root.addResource('pets').addResource('{petId}');
    const commentId = petId.addResource('comments').addResource('{commentId}');
    const method = commentId.addMethod('GET');

    expect(stack.resolve(method.methodArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':execute-api:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':',
          { Ref: 'testapiD6451F70' },
          '/',
          { Ref: 'testapiDeploymentStageprod5C9E92A4' },
          '/GET/pets/*/comments/*',
        ],
      ],
    });

    expect(stack.resolve(method.testMethodArn)).toEqual({
      'Fn::Join': [
        '',
        [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':execute-api:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':',
          { Ref: 'testapiD6451F70' },
          '/test-invoke-stage/GET/pets/*/comments/*',
        ],
      ],
    });

  });

  test('integration "credentialsRole" can be used to assume a role when calling backend', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
    const role = new iam.Role(stack, 'MyRole', { assumedBy: new iam.ServicePrincipal('foo') });

    // WHEN
    api.root.addMethod('GET', new apigw.Integration({
      type: apigw.IntegrationType.AWS_PROXY,
      integrationHttpMethod: 'GET',
      options: {
        credentialsRole: role,
      },
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        Credentials: { 'Fn::GetAtt': ['MyRoleF48FFE04', 'Arn'] },
      },
    });

  });

  test('integration "credentialsPassthrough" can be used to passthrough user credentials to backend', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });

    // WHEN
    api.root.addMethod('GET', new apigw.Integration({
      type: apigw.IntegrationType.AWS_PROXY,
      integrationHttpMethod: 'GET',
      options: {
        credentialsPassthrough: true,
      },
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        Credentials: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::*:user/*']] },
      },
    });

  });

  test('methodResponse set one or more method responses via options', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });

    // WHEN
    new apigw.Method(stack, 'method-man', {
      httpMethod: 'GET',
      resource: api.root,
      options: {
        methodResponses: [{
          statusCode: '200',
        }, {
          statusCode: '400',
          responseParameters: {
            'method.response.header.killerbees': false,
          },
        }, {
          statusCode: '500',
          responseParameters: {
            'method.response.header.errthing': true,
          },
          responseModels: {
            'application/json': apigw.Model.EMPTY_MODEL,
            'text/plain': apigw.Model.ERROR_MODEL,
          },
        }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      MethodResponses: [{
        StatusCode: '200',
      }, {
        StatusCode: '400',
        ResponseParameters: {
          'method.response.header.killerbees': false,
        },
      }, {
        StatusCode: '500',
        ResponseParameters: {
          'method.response.header.errthing': true,
        },
        ResponseModels: {
          'application/json': 'Empty',
          'text/plain': 'Error',
        },
      }],
    });

  });

  test('multiple integration responses can be used', () => { // @see https://github.com/aws/aws-cdk/issues/1608
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });

    // WHEN
    api.root.addMethod('GET', new apigw.AwsIntegration({
      service: 'foo-service',
      action: 'BarAction',
      options: {
        integrationResponses: [
          {
            statusCode: '200',
            responseTemplates: { 'application/json': JSON.stringify({ success: true }) },
          },
          {
            selectionPattern: 'Invalid',
            statusCode: '503',
            responseTemplates: { 'application/json': JSON.stringify({ success: false, message: 'Invalid Request' }) },
          },
        ],
      },
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      Integration: {
        IntegrationHttpMethod: 'POST',
        IntegrationResponses: [
          {
            ResponseTemplates: { 'application/json': '{"success":true}' },
            StatusCode: '200',
          },
          {
            ResponseTemplates: { 'application/json': '{"success":false,"message":"Invalid Request"}' },
            SelectionPattern: 'Invalid',
            StatusCode: '503',
          },
        ],
        Type: 'AWS',
        Uri: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':apigateway:', { Ref: 'AWS::Region' }, ':foo-service:action/BarAction']] },
      },
    });

  });

  test('method is always set as uppercase', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'api');

    // WHEN
    api.root.addMethod('get');
    api.root.addMethod('PoSt');
    api.root.addMethod('PUT');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', { HttpMethod: 'POST' });
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', { HttpMethod: 'GET' });
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', { HttpMethod: 'PUT' });

  });

  test('requestModel can be set', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
    const model = api.addModel('test-model', {
      contentType: 'application/json',
      modelName: 'test-model',
      schema: {
        title: 'test',
        type: apigw.JsonSchemaType.OBJECT,
        properties: { message: { type: apigw.JsonSchemaType.STRING } },
      },
    });

    // WHEN
    new apigw.Method(stack, 'method-man', {
      httpMethod: 'GET',
      resource: api.root,
      options: {
        requestModels: {
          'application/json': model,
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      RequestModels: {
        'application/json': { Ref: stack.getLogicalId(model.node.findChild('Resource') as cdk.CfnElement) },
      },
    });

  });

  test('methodResponse has a mix of response modes', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
    const htmlModel = api.addModel('my-model', {
      schema: {
        schema: apigw.JsonSchemaVersion.DRAFT4,
        title: 'test',
        type: apigw.JsonSchemaType.OBJECT,
        properties: { message: { type: apigw.JsonSchemaType.STRING } },
      },
    });

    // WHEN
    new apigw.Method(stack, 'method-man', {
      httpMethod: 'GET',
      resource: api.root,
      options: {
        methodResponses: [{
          statusCode: '200',
        }, {
          statusCode: '400',
          responseParameters: {
            'method.response.header.killerbees': false,
          },
        }, {
          statusCode: '500',
          responseParameters: {
            'method.response.header.errthing': true,
          },
          responseModels: {
            'application/json': apigw.Model.EMPTY_MODEL,
            'text/plain': apigw.Model.ERROR_MODEL,
            'text/html': htmlModel,
          },
        }],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      MethodResponses: [{
        StatusCode: '200',
      }, {
        StatusCode: '400',
        ResponseParameters: {
          'method.response.header.killerbees': false,
        },
      }, {
        StatusCode: '500',
        ResponseParameters: {
          'method.response.header.errthing': true,
        },
        ResponseModels: {
          'application/json': 'Empty',
          'text/plain': 'Error',
          'text/html': { Ref: stack.getLogicalId(htmlModel.node.findChild('Resource') as cdk.CfnElement) },
        },
      }],
    });

  });

  test('method has a request validator', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
    const validator = api.addRequestValidator('validator', {
      validateRequestBody: true,
      validateRequestParameters: false,
    });

    // WHEN
    new apigw.Method(stack, 'method-man', {
      httpMethod: 'GET',
      resource: api.root,
      options: {
        requestValidator: validator,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      RequestValidatorId: { Ref: stack.getLogicalId(validator.node.findChild('Resource') as cdk.CfnElement) },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RequestValidator', {
      RestApiId: { Ref: stack.getLogicalId(api.node.findChild('Resource') as cdk.CfnElement) },
      ValidateRequestBody: true,
      ValidateRequestParameters: false,
    });

  });

  test('use default requestParameters', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      deploy: false,
      defaultMethodOptions: {
        requestParameters: { 'method.request.path.proxy': true },
      },
    });

    // WHEN
    new apigw.Method(stack, 'defaultRequestParameters', {
      httpMethod: 'POST',
      resource: api.root,
      options: {
        operationName: 'defaultRequestParameters',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      OperationName: 'defaultRequestParameters',
      RequestParameters: {
        'method.request.path.proxy': true,
      },
    });

  });

  test('authorizer is bound correctly', () => {
    const stack = new cdk.Stack();

    const restApi = new apigw.RestApi(stack, 'myrestapi');
    restApi.root.addMethod('ANY', undefined, {
      authorizer: DUMMY_AUTHORIZER,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'ANY',
      AuthorizationType: 'CUSTOM',
      AuthorizerId: DUMMY_AUTHORIZER.authorizerId,
    });

  });

  test('authorizer via default method options', () => {
    const stack = new cdk.Stack();

    const func = new lambda.Function(stack, 'myfunction', {
      handler: 'handler',
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    const auth = new apigw.TokenAuthorizer(stack, 'myauthorizer1', {
      authorizerName: 'myauthorizer1',
      handler: func,
    });

    const restApi = new apigw.RestApi(stack, 'myrestapi', {
      defaultMethodOptions: {
        authorizer: auth,
      },
    });
    restApi.root.addMethod('ANY');

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Authorizer', {
      Name: 'myauthorizer1',
      Type: 'TOKEN',
      RestApiId: stack.resolve(restApi.restApiId),
    });

  });

  test('fails when authorization type does not match the authorizer', () => {
    const stack = new cdk.Stack();

    const restApi = new apigw.RestApi(stack, 'myrestapi');

    expect(() => {
      restApi.root.addMethod('ANY', undefined, {
        authorizationType: apigw.AuthorizationType.IAM,
        authorizer: DUMMY_AUTHORIZER,
      });
    }).toThrow(/Authorization type is set to AWS_IAM which is different from what is required by the authorizer/);

  });

  test('fails when authorization type does not match the authorizer in default method options', () => {
    const stack = new cdk.Stack();

    const restApi = new apigw.RestApi(stack, 'myrestapi', {
      defaultMethodOptions: {
        authorizer: DUMMY_AUTHORIZER,
      },
    });

    expect(() => {
      restApi.root.addMethod('ANY', undefined, {
        authorizationType: apigw.AuthorizationType.NONE,
      });
    }).toThrow(/Authorization type is set to NONE which is different from what is required by the authorizer/);

  });

  test('method has Auth Scopes', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });

    // WHEN
    new apigw.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
      options: {
        apiKeyRequired: true,
        authorizationScopes: ['AuthScope1', 'AuthScope2'],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      ApiKeyRequired: true,
      AuthorizationScopes: ['AuthScope1', 'AuthScope2'],
    });

  });

  test('use default Auth Scopes', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      deploy: false,
      defaultMethodOptions: {
        authorizationScopes: ['DefaultAuth'],
      },
    });

    // WHEN
    new apigw.Method(stack, 'defaultAuthScopes', {
      httpMethod: 'POST',
      resource: api.root,
      options: {
        operationName: 'defaultAuthScopes',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      OperationName: 'defaultAuthScopes',
      AuthorizationScopes: ['DefaultAuth'],
    });

  });

  test('Method options Auth Scopes is picked up', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      deploy: false,
      defaultMethodOptions: {
        authorizationScopes: ['DefaultAuth'],
      },
    });

    // WHEN
    new apigw.Method(stack, 'MethodAuthScopeUsed', {
      httpMethod: 'POST',
      resource: api.root,
      options: {
        apiKeyRequired: true,
        authorizationScopes: ['MethodAuthScope'],
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      ApiKeyRequired: true,
      AuthorizationScopes: ['MethodAuthScope'],
    });

  });

  test('Auth Scopes absent', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      deploy: false,
    });

    // WHEN
    new apigw.Method(stack, 'authScopesAbsent', {
      httpMethod: 'POST',
      resource: api.root,
      options: {
        operationName: 'authScopesAbsent',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      OperationName: 'authScopesAbsent',
      AuthorizationScopes: Match.absent(),
    });

  });

  test('method has a request validator with provided properties', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });

    // WHEN
    new apigw.Method(stack, 'method-man', {
      httpMethod: 'GET',
      resource: api.root,
      options: {
        requestValidatorOptions: {
          requestValidatorName: 'test-validator',
          validateRequestBody: true,
          validateRequestParameters: false,
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RequestValidator', {
      RestApiId: stack.resolve(api.restApiId),
      ValidateRequestBody: true,
      ValidateRequestParameters: false,
      Name: 'test-validator',
    });

  });

  test('method does not have a request validator', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });

    // WHEN
    new apigw.Method(stack, 'method-man', {
      httpMethod: 'GET',
      resource: api.root,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      RequestValidatorId: Match.absent(),
    });

  });

  test('method does not support both request validator and request validator options', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
    const validator = api.addRequestValidator('test-validator1', {
      validateRequestBody: true,
      validateRequestParameters: false,
    });

    // WHEN
    const methodProps = {
      httpMethod: 'GET',
      resource: api.root,
      options: {
        requestValidatorOptions: {
          requestValidatorName: 'test-validator2',
          validateRequestBody: true,
          validateRequestParameters: false,
        },
        requestValidator: validator,
      },
    };

    // THEN
    expect(() => new apigw.Method(stack, 'method', methodProps))
      .toThrow(/Only one of 'requestValidator' or 'requestValidatorOptions' must be specified./);

  });

  testDeprecated('"restApi" and "api" properties return the RestApi correctly', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const api = new apigw.RestApi(stack, 'test-api');
    const method = api.root.addResource('pets').addMethod('GET');

    // THEN
    expect(method.restApi).toBeDefined();
    expect(method.api).toBeDefined();
    expect(stack.resolve(method.api.restApiId)).toEqual(stack.resolve(method.restApi.restApiId));

  });

  testDeprecated('"restApi" throws an error on imported while "api" returns correctly', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const api = apigw.RestApi.fromRestApiAttributes(stack, 'test-api', {
      restApiId: 'test-rest-api-id',
      rootResourceId: 'test-root-resource-id',
    });
    const method = api.root.addResource('pets').addMethod('GET');

    // THEN
    expect(() => method.restApi).toThrow(/not available on Resource not connected to an instance of RestApi/);
    expect(method.api).toBeDefined();

  });

  test('methodResponse should be passed from defaultMethodOptions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigw.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      deploy: false,
      defaultMethodOptions: {
        requestParameters: { 'method.request.path.proxy': true },
        methodResponses: [
          {
            statusCode: '200',
          },
        ],
      },
    });

    // WHEN
    new apigw.Method(stack, 'method-man', {
      httpMethod: 'GET',
      resource: api.root,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      MethodResponses: [{
        StatusCode: '200',
      }],
    });

  });

  describe('Metrics', () => {
    test('metric', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const api = new apigw.RestApi(stack, 'test-api');
      const method = api.root.addResource('pets').addMethod('GET');
      const metricName = '4XXError';
      const statistic = 'Sum';
      const metric = method.metric(metricName, api.deploymentStage, { statistic });

      // THEN
      expect(metric.namespace).toEqual('AWS/ApiGateway');
      expect(metric.metricName).toEqual(metricName);
      expect(metric.statistic).toEqual(statistic);
      expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
    });

    test('metricClientError', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const api = new apigw.RestApi(stack, 'test-api');
      const method = api.root.addResource('pets').addMethod('GET');
      const color = '#00ff00';
      const metric = method.metricClientError(api.deploymentStage, { color });

      // THEN
      expect(metric.metricName).toEqual('4XXError');
      expect(metric.statistic).toEqual('Sum');
      expect(metric.color).toEqual(color);
      expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
    });

    test('metricServerError', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const api = new apigw.RestApi(stack, 'test-api');
      const method = api.root.addResource('pets').addMethod('GET');
      const color = '#00ff00';
      const metric = method.metricServerError(api.deploymentStage, { color });

      // THEN
      expect(metric.metricName).toEqual('5XXError');
      expect(metric.statistic).toEqual('Sum');
      expect(metric.color).toEqual(color);
      expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
    });

    test('metricCacheHitCount', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const api = new apigw.RestApi(stack, 'test-api');
      const method = api.root.addResource('pets').addMethod('GET');
      const color = '#00ff00';
      const metric = method.metricCacheHitCount(api.deploymentStage, { color });

      // THEN
      expect(metric.metricName).toEqual('CacheHitCount');
      expect(metric.statistic).toEqual('Sum');
      expect(metric.color).toEqual(color);
      expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
    });

    test('metricCacheMissCount', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const api = new apigw.RestApi(stack, 'test-api');
      const method = api.root.addResource('pets').addMethod('GET');
      const color = '#00ff00';
      const metric = method.metricCacheMissCount(api.deploymentStage, { color });

      // THEN
      expect(metric.metricName).toEqual('CacheMissCount');
      expect(metric.statistic).toEqual('Sum');
      expect(metric.color).toEqual(color);
      expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
    });

    test('metricCount', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const api = new apigw.RestApi(stack, 'test-api');
      const method = api.root.addResource('pets').addMethod('GET');
      const color = '#00ff00';
      const metric = method.metricCount(api.deploymentStage, { color });

      // THEN
      expect(metric.metricName).toEqual('Count');
      expect(metric.statistic).toEqual('SampleCount');
      expect(metric.color).toEqual(color);
      expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
    });

    test('metricIntegrationLatency', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const api = new apigw.RestApi(stack, 'test-api');
      const method = api.root.addResource('pets').addMethod('GET');
      const color = '#00ff00';
      const metric = method.metricIntegrationLatency(api.deploymentStage, { color });

      // THEN
      expect(metric.metricName).toEqual('IntegrationLatency');
      expect(metric.statistic).toEqual('Average');
      expect(metric.color).toEqual(color);
      expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
    });

    test('metricLatency', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const api = new apigw.RestApi(stack, 'test-api');
      const method = api.root.addResource('pets').addMethod('GET');
      const color = '#00ff00';
      const metric = method.metricLatency(api.deploymentStage, { color });

      // THEN
      expect(metric.metricName).toEqual('Latency');
      expect(metric.statistic).toEqual('Average');
      expect(metric.color).toEqual(color);
      expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
    });

    test('grantExecute', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const user = new iam.User(stack, 'user');

      // WHEN
      const api = new apigw.RestApi(stack, 'test-api');
      const method = api.root.addResource('pets').addMethod('GET');
      method.grantExecute(user);

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
          Statement: [
            {
              Action: 'execute-api:Invoke',
              Effect: 'Allow',
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    {
                      Ref: 'AWS::Partition',
                    },
                    ':execute-api:',
                    {
                      Ref: 'AWS::Region',
                    },
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':',
                    { Ref: 'testapiD6451F70' },
                    '/',
                    { Ref: 'testapiDeploymentStageprod5C9E92A4' },
                    '/GET/pets',
                  ],
                ],
              },
            },
          ],
        },
        Users: [{
          Ref: 'user2C2B57AE',
        }],
      });
    });
  });
});
