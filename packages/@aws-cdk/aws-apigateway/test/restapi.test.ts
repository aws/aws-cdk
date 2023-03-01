import { Template } from '@aws-cdk/assertions';
import { GatewayVpcEndpoint } from '@aws-cdk/aws-ec2';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { App, CfnElement, CfnResource, Lazy, Size, Stack } from '@aws-cdk/core';
import * as apigw from '../lib';

describe('restapi', () => {
  test('minimal setup', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new apigw.RestApi(stack, 'my-api');
    api.root.addMethod('GET'); // must have at least one method or an API definition

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: {
        myapi4C7BF186: {
          Type: 'AWS::ApiGateway::RestApi',
          Properties: {
            Name: 'my-api',
          },
        },
        myapiGETF990CE3C: {
          Type: 'AWS::ApiGateway::Method',
          Properties: {
            HttpMethod: 'GET',
            ResourceId: { 'Fn::GetAtt': ['myapi4C7BF186', 'RootResourceId'] },
            RestApiId: { Ref: 'myapi4C7BF186' },
            AuthorizationType: 'NONE',
            Integration: {
              Type: 'MOCK',
            },
          },
        },
        myapiDeployment92F2CB4972a890db5063ec679071ba7eefc76f2a: {
          Type: 'AWS::ApiGateway::Deployment',
          Properties: {
            RestApiId: { Ref: 'myapi4C7BF186' },
            Description: 'Automatically created by the RestApi construct',
          },
          DependsOn: ['myapiGETF990CE3C'],
        },
        myapiDeploymentStageprod298F01AF: {
          Type: 'AWS::ApiGateway::Stage',
          Properties: {
            RestApiId: { Ref: 'myapi4C7BF186' },
            DeploymentId: { Ref: 'myapiDeployment92F2CB4972a890db5063ec679071ba7eefc76f2a' },
            StageName: 'prod',
          },
          DependsOn: ['myapiAccountEC421A0A'],
        },
        myapiCloudWatchRole095452E5: {
          Type: 'AWS::IAM::Role',
          DeletionPolicy: 'Retain',
          Properties: {
            AssumeRolePolicyDocument: {
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: { Service: 'apigateway.amazonaws.com' },
                },
              ],
              Version: '2012-10-17',
            },
            ManagedPolicyArns: [
              { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs']] },
            ],
          },
        },
        myapiAccountEC421A0A: {
          Type: 'AWS::ApiGateway::Account',
          DeletionPolicy: 'Retain',
          Properties: {
            CloudWatchRoleArn: { 'Fn::GetAtt': ['myapiCloudWatchRole095452E5', 'Arn'] },
          },
          DependsOn: ['myapi4C7BF186'],
        },
      },
      Outputs: {
        myapiEndpoint3628AFE3: {
          Value: {
            'Fn::Join': ['', [
              'https://',
              { Ref: 'myapi4C7BF186' },
              '.execute-api.',
              { Ref: 'AWS::Region' },
              '.',
              { Ref: 'AWS::URLSuffix' },
              '/',
              { Ref: 'myapiDeploymentStageprod298F01AF' },
              '/',
            ]],
          },
        },
      },
    });
  });

  test('restApiName is set correctly', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const myapi = new apigw.RestApi(stack, 'myapi');
    const yourapi = new apigw.RestApi(stack, 'yourapi', {
      restApiName: 'namedapi',
    });

    // THEN
    expect(myapi.restApiName).toEqual('myapi');
    expect(yourapi.restApiName).toEqual('namedapi');
  });

  test('defaultChild is set correctly', () => {
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'my-api');
    expect(api.node.defaultChild instanceof apigw.CfnRestApi).toBeDefined();
  });

  test('"name" is defaulted to resource physical name', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new apigw.RestApi(stack, 'restapi', {
      deploy: false,
      cloudWatchRole: false,
    });

    api.root.addMethod('GET');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'restapi',
    });
  });

  test('fails in synthesis if there are no methods or definition', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'my-stack');
    const api = new apigw.RestApi(stack, 'API');

    // WHEN
    api.root.addResource('foo');
    api.root.addResource('bar').addResource('goo');

    // THEN
    expect(() => app.synth()).toThrow(/The REST API doesn't contain any methods/);
  });

  test('"addResource" can be used on "IRestApiResource" to form a tree', () => {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'restapi', {
      deploy: false,
      cloudWatchRole: false,
      restApiName: 'my-rest-api',
    });

    api.root.addMethod('GET');

    // WHEN
    const foo = api.root.addResource('foo');
    api.root.addResource('bar');
    foo.addResource('{hello}');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: 'foo',
      ParentId: { 'Fn::GetAtt': ['restapiC5611D27', 'RootResourceId'] },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: 'bar',
      ParentId: { 'Fn::GetAtt': ['restapiC5611D27', 'RootResourceId'] },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: '{hello}',
      ParentId: { Ref: 'restapifooF697E056' },
    });
  });

  test('"addResource" allows configuration of proxy paths', () => {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'restapi', {
      deploy: false,
      cloudWatchRole: false,
      restApiName: 'my-rest-api',
    });

    // WHEN
    const proxy = api.root.addResource('{proxy+}');
    proxy.addMethod('ANY');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: '{proxy+}',
      ParentId: { 'Fn::GetAtt': ['restapiC5611D27', 'RootResourceId'] },
    });
  });

  test('"addMethod" can be used to add methods to resources', () => {
    // GIVEN
    const stack = new Stack();

    const api = new apigw.RestApi(stack, 'restapi', { deploy: false, cloudWatchRole: false });
    const r1 = api.root.addResource('r1');

    // WHEN
    api.root.addMethod('GET');
    r1.addMethod('POST');

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: {
        restapiC5611D27: {
          Type: 'AWS::ApiGateway::RestApi',
          Properties: {
            Name: 'restapi',
          },
        },
        restapir1CF2997EA: {
          Type: 'AWS::ApiGateway::Resource',
          Properties: {
            ParentId: {
              'Fn::GetAtt': [
                'restapiC5611D27',
                'RootResourceId',
              ],
            },
            PathPart: 'r1',
            RestApiId: {
              Ref: 'restapiC5611D27',
            },
          },
        },
        restapir1POST766920C4: {
          Type: 'AWS::ApiGateway::Method',
          Properties: {
            HttpMethod: 'POST',
            ResourceId: {
              Ref: 'restapir1CF2997EA',
            },
            RestApiId: {
              Ref: 'restapiC5611D27',
            },
            AuthorizationType: 'NONE',
            Integration: {
              Type: 'MOCK',
            },
          },
        },
        restapiGET6FC1785A: {
          Type: 'AWS::ApiGateway::Method',
          Properties: {
            HttpMethod: 'GET',
            ResourceId: {
              'Fn::GetAtt': [
                'restapiC5611D27',
                'RootResourceId',
              ],
            },
            RestApiId: {
              Ref: 'restapiC5611D27',
            },
            AuthorizationType: 'NONE',
            Integration: {
              Type: 'MOCK',
            },
          },
        },
      },
    });
  });

  test('resourcePath returns the full path of the resource within the API', () => {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'restapi');

    // WHEN
    const r1 = api.root.addResource('r1');
    const r11 = r1.addResource('r1_1');
    const r12 = r1.addResource('r1_2');
    const r121 = r12.addResource('r1_2_1');
    const r2 = api.root.addResource('r2');

    // THEN
    expect(api.root.path).toEqual('/');
    expect(r1.path).toEqual('/r1');
    expect(r11.path).toEqual('/r1/r1_1');
    expect(r12.path).toEqual('/r1/r1_2');
    expect(r121.path).toEqual('/r1/r1_2/r1_2_1');
    expect(r2.path).toEqual('/r2');
  });

  test('resource path part validation', () => {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'restapi');

    // THEN
    expect(() => api.root.addResource('foo/')).toThrow();
    api.root.addResource('boom-bam');
    expect(() => api.root.addResource('illegal()')).toThrow();
    api.root.addResource('{foo}');
    expect(() => api.root.addResource('foo{bar}')).toThrow();
  });

  test('fails if "deployOptions" is set with "deploy" disabled', () => {
    // GIVEN
    const stack = new Stack();

    // THEN
    expect(() => new apigw.RestApi(stack, 'myapi', {
      deploy: false,
      deployOptions: { cachingEnabled: true },
    })).toThrow(/Cannot set 'deployOptions' if 'deploy' is disabled/);
  });

  test('CloudWatch role is created for API Gateway', () => {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'myapi');
    api.root.addMethod('GET');

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
    Template.fromStack(stack).resourceCountIs('AWS::ApiGateway::Account', 1);
  });

  test('featureFlag @aws-cdk/aws-apigateway:disableCloudWatchRole CloudWatch role is not created created for API Gateway', () => {
    // GIVEN
    const app = new App({
      context: {
        '@aws-cdk/aws-apigateway:disableCloudWatchRole': true,
      },
    });
    const stack = new Stack(app);
    const api = new apigw.RestApi(stack, 'myapi');
    api.root.addMethod('GET');

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
    Template.fromStack(stack).resourceCountIs('AWS::ApiGateway::Account', 0);
  });

  test('"url" and "urlForPath" return the URL endpoints of the deployed API', () => {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');
    api.root.addMethod('GET');

    // THEN
    expect(stack.resolve(api.url)).toEqual({
      'Fn::Join':
    ['',
      ['https://',
        { Ref: 'apiC8550315' },
        '.execute-api.',
        { Ref: 'AWS::Region' },
        '.',
        { Ref: 'AWS::URLSuffix' },
        '/',
        { Ref: 'apiDeploymentStageprod896C8101' },
        '/']],
    });
    expect(stack.resolve(api.urlForPath('/foo/bar'))).toEqual({
      'Fn::Join':
    ['',
      ['https://',
        { Ref: 'apiC8550315' },
        '.execute-api.',
        { Ref: 'AWS::Region' },
        '.',
        { Ref: 'AWS::URLSuffix' },
        '/',
        { Ref: 'apiDeploymentStageprod896C8101' },
        '/foo/bar']],
    });
  });

  test('"urlForPath" would not work if there is no deployment', () => {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api', { deploy: false });
    api.root.addMethod('GET');

    // THEN
    expect(() => api.url).toThrow(/Cannot determine deployment stage for API from "deploymentStage". Use "deploy" or explicitly set "deploymentStage"/);
    expect(() => api.urlForPath('/foo')).toThrow(/Cannot determine deployment stage for API from "deploymentStage". Use "deploy" or explicitly set "deploymentStage"/);
  });

  test('"urlForPath" requires that path will begin with "/"', () => {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');
    api.root.addMethod('GET');

    // THEN
    expect(() => api.urlForPath('foo')).toThrow(/Path must begin with \"\/\": foo/);
  });

  test('"executeApiArn" returns the execute-api ARN for a resource/method', () => {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');
    api.root.addMethod('GET');

    // WHEN
    const arn = api.arnForExecuteApi('method', '/path', 'stage');

    // THEN
    expect(stack.resolve(arn)).toEqual({
      'Fn::Join':
    ['',
      ['arn:',
        { Ref: 'AWS::Partition' },
        ':execute-api:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':',
        { Ref: 'apiC8550315' },
        '/stage/method/path']],
    });
  });

  test('"executeApiArn" path must begin with "/"', () => {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');
    api.root.addMethod('GET');

    // THEN
    expect(() => api.arnForExecuteApi('method', 'hey-path', 'stage')).toThrow(/"path" must begin with a "\/": 'hey-path'/);
  });

  test('"executeApiArn" path can be a token', () => {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'api');
    api.root.addMethod('GET');

    // THEN
    expect(() => api.arnForExecuteApi('method', Lazy.string(({ produce: () => 'path' })), 'stage')).not.toThrow();
  });

  test('"executeApiArn" will convert ANY to "*"', () => {
    // GIVEN
    const stack = new Stack();

    const api = new apigw.RestApi(stack, 'api');
    const method = api.root.addMethod('ANY');

    // THEN
    expect(stack.resolve(method.methodArn)).toEqual({
      'Fn::Join':
    ['',
      ['arn:',
        { Ref: 'AWS::Partition' },
        ':execute-api:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':',
        { Ref: 'apiC8550315' },
        '/',
        { Ref: 'apiDeploymentStageprod896C8101' },
        '/*/']],
    });
  });

  test('"endpointTypes" can be used to specify endpoint configuration for the api', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new apigw.RestApi(stack, 'api', {
      endpointTypes: [apigw.EndpointType.EDGE, apigw.EndpointType.PRIVATE],
    });

    api.root.addMethod('GET');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
      EndpointConfiguration: {
        Types: [
          'EDGE',
          'PRIVATE',
        ],
      },
    });
  });

  test('"endpointConfiguration" can be used to specify endpoint types for the api', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new apigw.RestApi(stack, 'api', {
      endpointConfiguration: {
        types: [apigw.EndpointType.EDGE, apigw.EndpointType.PRIVATE],
      },
    });

    api.root.addMethod('GET');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
      EndpointConfiguration: {
        Types: ['EDGE', 'PRIVATE'],
      },
    });
  });

  test('"endpointConfiguration" can be used to specify vpc endpoints on the API', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new apigw.RestApi(stack, 'api', {
      endpointConfiguration: {
        types: [apigw.EndpointType.EDGE, apigw.EndpointType.PRIVATE],
        vpcEndpoints: [
          GatewayVpcEndpoint.fromGatewayVpcEndpointId(stack, 'ImportedEndpoint', 'vpcEndpoint'),
          GatewayVpcEndpoint.fromGatewayVpcEndpointId(stack, 'ImportedEndpoint2', 'vpcEndpoint2'),
        ],
      },
    });

    api.root.addMethod('GET');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
      EndpointConfiguration: {
        Types: [
          'EDGE',
          'PRIVATE',
        ],
        VpcEndpointIds: [
          'vpcEndpoint',
          'vpcEndpoint2',
        ],
      },
    });
  });

  test('"endpointTypes" and "endpointConfiguration" can NOT both be used to specify endpoint configuration for the api', () => {
    // GIVEN
    const stack = new Stack();

    // THEN
    expect(() => new apigw.RestApi(stack, 'api', {
      endpointConfiguration: {
        types: [apigw.EndpointType.PRIVATE],
        vpcEndpoints: [GatewayVpcEndpoint.fromGatewayVpcEndpointId(stack, 'ImportedEndpoint', 'vpcEndpoint')],
      },
      endpointTypes: [apigw.EndpointType.PRIVATE],
    })).toThrow(/Only one of the RestApi props, endpointTypes or endpointConfiguration, is allowed/);
  });

  test('"cloneFrom" can be used to clone an existing API', () => {
    // GIVEN
    const stack = new Stack();
    const cloneFrom = apigw.RestApi.fromRestApiId(stack, 'RestApi', 'foobar');

    // WHEN
    const api = new apigw.RestApi(stack, 'api', {
      cloneFrom,
    });

    api.root.addMethod('GET');

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
      CloneFrom: 'foobar',
      Name: 'api',
    });
  });

  test('allow taking a dependency on the rest api (includes deployment and stage)', () => {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'myapi');
    api.root.addMethod('GET');
    const resource = new CfnResource(stack, 'DependsOnRestApi', { type: 'My::Resource' });

    // WHEN
    resource.node.addDependency(api);

    // THEN
    Template.fromStack(stack).hasResource('My::Resource', {
      DependsOn: [
        'myapiAccountC3A4750C',
        'myapiCloudWatchRoleEB425128',
        'myapiGET9B7CD29E',
        'myapiDeploymentB7EF8EB7b8edc043bcd33e0d85a3c85151f47e98',
        'myapiDeploymentStageprod329F21FF',
        'myapi162F20B8',
      ],
    });
  });

  test('defaultIntegration and defaultMethodOptions can be used at any level', () => {
    // GIVEN
    const stack = new Stack();
    const rootInteg = new apigw.AwsIntegration({
      service: 's3',
      action: 'GetObject',
    });

    // WHEN
    const api = new apigw.RestApi(stack, 'myapi', {
      defaultIntegration: rootInteg,
      defaultMethodOptions: {
        authorizer: { authorizerId: 'AUTHID' },
        authorizationType: apigw.AuthorizationType.IAM,
      },
    });

    // CASE #1: should inherit integration and options from root resource
    api.root.addMethod('GET');

    const child = api.root.addResource('child');

    // CASE #2: should inherit integration from root and method options, but
    // "authorizationType" will be overridden to "None" instead of "IAM"
    child.addMethod('POST', undefined, {
      authorizationType: apigw.AuthorizationType.COGNITO,
    });

    const child2 = api.root.addResource('child2', {
      defaultIntegration: new apigw.MockIntegration(),
      defaultMethodOptions: {
        authorizer: { authorizerId: 'AUTHID2' },
      },
    });

    // CASE #3: integartion and authorizer ID are inherited from child2
    child2.addMethod('DELETE');

    // CASE #4: same as case #3, but integration is customized
    child2.addMethod('PUT', new apigw.AwsIntegration({ action: 'foo', service: 'bar' }));

    // THEN

    // CASE #1
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      ResourceId: { 'Fn::GetAtt': ['myapi162F20B8', 'RootResourceId'] },
      Integration: { Type: 'AWS' },
      AuthorizerId: 'AUTHID',
      AuthorizationType: 'AWS_IAM',
    });

    // CASE #2
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      ResourceId: { Ref: 'myapichildA0A65412' },
      Integration: { Type: 'AWS' },
      AuthorizerId: 'AUTHID',
      AuthorizationType: 'COGNITO_USER_POOLS',
    });

    // CASE #3
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'DELETE',
      Integration: { Type: 'MOCK' },
      AuthorizerId: 'AUTHID2',
      AuthorizationType: 'AWS_IAM',
    });

    // CASE #4
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'PUT',
      Integration: { Type: 'AWS' },
      AuthorizerId: 'AUTHID2',
      AuthorizationType: 'AWS_IAM',
    });
  });

  test('addApiKey is supported', () => {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'myapi');
    api.root.addMethod('OPTIONS');

    // WHEN
    api.addApiKey('myapikey', {
      apiKeyName: 'myApiKey1',
      value: '01234567890ABCDEFabcdef',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
      Enabled: true,
      Name: 'myApiKey1',
      StageKeys: [
        {
          RestApiId: { Ref: 'myapi162F20B8' },
          StageName: { Ref: 'myapiDeploymentStageprod329F21FF' },
        },
      ],
      Value: '01234567890ABCDEFabcdef',
    });
  });

  test('addModel is supported', () => {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'myapi');
    api.root.addMethod('OPTIONS');

    // WHEN
    api.addModel('model', {
      schema: {
        schema: apigw.JsonSchemaVersion.DRAFT4,
        title: 'test',
        type: apigw.JsonSchemaType.OBJECT,
        properties: { message: { type: apigw.JsonSchemaType.STRING } },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Model', {
      RestApiId: { Ref: stack.getLogicalId(api.node.findChild('Resource') as CfnElement) },
      Schema: {
        $schema: 'http://json-schema.org/draft-04/schema#',
        title: 'test',
        type: 'object',
        properties: { message: { type: 'string' } },
      },
    });
  });

  test('addRequestValidator is supported', () => {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.RestApi(stack, 'myapi');
    api.root.addMethod('OPTIONS');

    // WHEN
    api.addRequestValidator('params-validator', {
      requestValidatorName: 'Parameters',
      validateRequestBody: false,
      validateRequestParameters: true,
    });
    api.addRequestValidator('body-validator', {
      requestValidatorName: 'Body',
      validateRequestBody: true,
      validateRequestParameters: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RequestValidator', {
      RestApiId: { Ref: stack.getLogicalId(api.node.findChild('Resource') as CfnElement) },
      Name: 'Parameters',
      ValidateRequestBody: false,
      ValidateRequestParameters: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RequestValidator', {
      RestApiId: { Ref: stack.getLogicalId(api.node.findChild('Resource') as CfnElement) },
      Name: 'Body',
      ValidateRequestBody: true,
      ValidateRequestParameters: false,
    });
  });

  test('creates output with given "exportName"', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new apigw.RestApi(stack, 'myapi', { endpointExportName: 'my-given-export-name' });
    api.root.addMethod('GET');

    // THEN
    const outputs = Template.fromStack(stack).findOutputs('myapiEndpoint8EB17201');
    expect(outputs).toEqual({
      myapiEndpoint8EB17201: {
        Value: {
          'Fn::Join': [
            '',
            [
              'https://',
              { Ref: 'myapi162F20B8' },
              '.execute-api.',
              { Ref: 'AWS::Region' },
              '.',
              { Ref: 'AWS::URLSuffix' },
              '/',
              { Ref: 'myapiDeploymentStageprod329F21FF' },
              '/',
            ],
          ],
        },
        Export: { Name: 'my-given-export-name' },
      },
    });
  });

  test('creates output when "exportName" is not specified', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new apigw.RestApi(stack, 'myapi');
    api.root.addMethod('GET');

    // THEN
    const outputs = Template.fromStack(stack).findOutputs('myapiEndpoint8EB17201');
    expect(outputs).toEqual({
      myapiEndpoint8EB17201: {
        Value: {
          'Fn::Join': [
            '',
            [
              'https://',
              { Ref: 'myapi162F20B8' },
              '.execute-api.',
              { Ref: 'AWS::Region' },
              '.',
              { Ref: 'AWS::URLSuffix' },
              '/',
              { Ref: 'myapiDeploymentStageprod329F21FF' },
              '/',
            ],
          ],
        },
      },
    });
  });

  testDeprecated('"restApi" and "api" properties return the RestApi correctly', () => {
    // GIVEN
    const stack = new Stack();

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
    const stack = new Stack();

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

  test('RestApi minCompressionSize', () => {
    // GIVEN
    const app = new App({
      context: {
        '@aws-cdk/aws-apigateway:disableCloudWatchRole': true,
      },
    });

    const stack = new Stack(app);
    const api = new apigw.RestApi(stack, 'RestApi', {
      minCompressionSize: Size.bytes(1024),
    });

    // WHEN
    api.root.addMethod('GET');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'RestApi',
      MinimumCompressionSize: 1024,
    });
  });

  testDeprecated('RestApi minimumCompressionSize', () => {
    // GIVEN
    const app = new App({
      context: {
        '@aws-cdk/aws-apigateway:disableCloudWatchRole': true,
      },
    });

    const stack = new Stack(app);
    const api = new apigw.RestApi(stack, 'RestApi', {
      minimumCompressionSize: 1024,
    });

    // WHEN
    api.root.addMethod('GET');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'RestApi',
      MinimumCompressionSize: 1024,
    });
  });

  testDeprecated('throws error when both minimumCompressionSize and minCompressionSize are used', () => {
    // GIVEN
    const app = new App({
      context: {
        '@aws-cdk/aws-apigateway:disableCloudWatchRole': true,
      },
    });

    // WHEN
    const stack = new Stack(app);

    // THEN
    expect(() => new apigw.RestApi(stack, 'RestApi', {
      minCompressionSize: Size.bytes(500),
      minimumCompressionSize: 1024,
    })).toThrow(/both properties minCompressionSize and minimumCompressionSize cannot be set at once./);
  });
});


describe('Import', () => {
  test('fromRestApiId()', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const imported = apigw.RestApi.fromRestApiId(stack, 'imported-api', 'api-rxt4498f');

    // THEN
    expect(stack.resolve(imported.restApiId)).toEqual('api-rxt4498f');
    expect(imported.restApiName).toEqual('imported-api');
  });

  test('fromRestApiAttributes()', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const imported = apigw.RestApi.fromRestApiAttributes(stack, 'imported-api', {
      restApiId: 'test-restapi-id',
      rootResourceId: 'test-root-resource-id',
    });
    const resource = imported.root.addResource('pets');
    resource.addMethod('GET');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: 'pets',
      ParentId: stack.resolve(imported.restApiRootResourceId),
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      ResourceId: stack.resolve(resource.resourceId),
    });
    expect(imported.restApiName).toEqual('imported-api');
  });

  test('fromRestApiAttributes() with restApiName', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const imported = apigw.RestApi.fromRestApiAttributes(stack, 'imported-api', {
      restApiId: 'test-restapi-id',
      rootResourceId: 'test-root-resource-id',
      restApiName: 'test-restapi-name',
    });
    const resource = imported.root.addResource('pets');
    resource.addMethod('GET');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: 'pets',
      ParentId: stack.resolve(imported.restApiRootResourceId),
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      ResourceId: stack.resolve(resource.resourceId),
    });
    expect(imported.restApiName).toEqual('test-restapi-name');
  });
});

describe('SpecRestApi', () => {
  test('add Methods and Resources', () => {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.SpecRestApi(stack, 'SpecRestApi', {
      apiDefinition: apigw.ApiDefinition.fromInline({ foo: 'bar' }),
    });

    // WHEN
    const resource = api.root.addResource('pets');
    resource.addMethod('GET');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
      PathPart: 'pets',
      ParentId: stack.resolve(api.restApiRootResourceId),
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      ResourceId: stack.resolve(resource.resourceId),
    });
  });

  test('"endpointTypes" can be used to specify endpoint configuration for SpecRestApi', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new apigw.SpecRestApi(stack, 'api', {
      apiDefinition: apigw.ApiDefinition.fromInline({ foo: 'bar' }),
      endpointTypes: [apigw.EndpointType.EDGE, apigw.EndpointType.PRIVATE],
    });

    api.root.addMethod('GET');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
      EndpointConfiguration: {
        Types: [
          'EDGE',
          'PRIVATE',
        ],
      },
    });
  });

  testDeprecated('addApiKey is supported', () => {
    // GIVEN
    const stack = new Stack();
    const api = new apigw.SpecRestApi(stack, 'myapi', {
      apiDefinition: apigw.ApiDefinition.fromInline({ foo: 'bar' }),
    });
    api.root.addMethod('OPTIONS');

    // WHEN
    api.addApiKey('myapikey', {
      apiKeyName: 'myApiKey1',
      value: '01234567890ABCDEFabcdef',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
      Enabled: true,
      Name: 'myApiKey1',
      StageKeys: [
        {
          RestApiId: { Ref: 'myapi162F20B8' },
          StageName: { Ref: 'myapiDeploymentStageprod329F21FF' },
        },
      ],
      Value: '01234567890ABCDEFabcdef',
    });
  });

  test('featureFlag @aws-cdk/aws-apigateway:disableCloudWatchRole CloudWatch role is not created created for API Gateway', () => {
    // GIVEN
    const app = new App({
      context: {
        '@aws-cdk/aws-apigateway:disableCloudWatchRole': true,
      },
    });

    const stack = new Stack(app);
    const api = new apigw.SpecRestApi(stack, 'SpecRestApi', {
      apiDefinition: apigw.ApiDefinition.fromInline({ foo: 'bar' }),
    });

    // WHEN
    const resource = api.root.addResource('pets');
    resource.addMethod('GET');

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
    Template.fromStack(stack).resourceCountIs('AWS::ApiGateway::Account', 0);
  });

  test('SpecRestApi minimumCompressionSize', () => {
    // GIVEN
    const app = new App({
      context: {
        '@aws-cdk/aws-apigateway:disableCloudWatchRole': true,
      },
    });

    const stack = new Stack(app);
    const api = new apigw.SpecRestApi(stack, 'SpecRestApi', {
      apiDefinition: apigw.ApiDefinition.fromInline({ foo: 'bar' }),
      minCompressionSize: Size.bytes(1024),
    });

    // WHEN
    api.root.addMethod('GET');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
      Name: 'SpecRestApi',
      MinimumCompressionSize: 1024,
    });
  });

  describe('Metrics', () => {
    test('metric', () => {
      // GIVEN
      const stack = new Stack();
      const api = new apigw.RestApi(stack, 'my-api');
      const metricName = '4XXError';
      const statistic = 'Sum';

      // WHEN
      const countMetric = api.metric(metricName, { statistic });

      // THEN
      expect(countMetric.namespace).toEqual('AWS/ApiGateway');
      expect(countMetric.metricName).toEqual(metricName);
      expect(countMetric.dimensions).toEqual({ ApiName: 'my-api' });
      expect(countMetric.statistic).toEqual(statistic);
    });

    test('metricClientError', () => {
      // GIVEN
      const stack = new Stack();
      const api = new apigw.RestApi(stack, 'my-api');
      const color = '#00ff00';

      // WHEN
      const countMetric = api.metricClientError({ color });

      // THEN
      expect(countMetric.metricName).toEqual('4XXError');
      expect(countMetric.statistic).toEqual('Sum');
      expect(countMetric.color).toEqual(color);
    });

    test('metricServerError', () => {
      // GIVEN
      const stack = new Stack();
      const api = new apigw.RestApi(stack, 'my-api');
      const color = '#00ff00';

      // WHEN
      const countMetric = api.metricServerError({ color });

      // THEN
      expect(countMetric.metricName).toEqual('5XXError');
      expect(countMetric.statistic).toEqual('Sum');
      expect(countMetric.color).toEqual(color);
    });

    test('metricCacheHitCount', () => {
      // GIVEN
      const stack = new Stack();
      const api = new apigw.RestApi(stack, 'my-api');
      const color = '#00ff00';

      // WHEN
      const countMetric = api.metricCacheHitCount({ color });

      // THEN
      expect(countMetric.metricName).toEqual('CacheHitCount');
      expect(countMetric.statistic).toEqual('Sum');
      expect(countMetric.color).toEqual(color);
    });

    test('metricCacheMissCount', () => {
      // GIVEN
      const stack = new Stack();
      const api = new apigw.RestApi(stack, 'my-api');
      const color = '#00ff00';

      // WHEN
      const countMetric = api.metricCacheMissCount({ color });

      // THEN
      expect(countMetric.metricName).toEqual('CacheMissCount');
      expect(countMetric.statistic).toEqual('Sum');
      expect(countMetric.color).toEqual(color);
    });

    test('metricCount', () => {
      // GIVEN
      const stack = new Stack();
      const api = new apigw.RestApi(stack, 'my-api');
      const color = '#00ff00';

      // WHEN
      const countMetric = api.metricCount({ color });

      // THEN
      expect(countMetric.metricName).toEqual('Count');
      expect(countMetric.statistic).toEqual('SampleCount');
      expect(countMetric.color).toEqual(color);
    });

    test('metricIntegrationLatency', () => {
      // GIVEN
      const stack = new Stack();
      const api = new apigw.RestApi(stack, 'my-api');
      const color = '#00ff00';

      // WHEN
      const countMetric = api.metricIntegrationLatency({ color });

      // THEN
      expect(countMetric.metricName).toEqual('IntegrationLatency');
      expect(countMetric.color).toEqual(color);
    });

    test('metricLatency', () => {
      // GIVEN
      const stack = new Stack();
      const api = new apigw.RestApi(stack, 'my-api');
      const color = '#00ff00';

      // WHEN
      const countMetric = api.metricLatency({ color });

      // THEN
      expect(countMetric.metricName).toEqual('Latency');
      expect(countMetric.color).toEqual(color);
    });
  });

  test('disableExecuteApiEndpoint is false when set to false in RestApi', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new apigw.RestApi(stack, 'my-api', { disableExecuteApiEndpoint: false });
    api.root.addMethod('GET');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
      DisableExecuteApiEndpoint: false,
    });
  });

  test('disableExecuteApiEndpoint is true when set to true in RestApi', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new apigw.RestApi(stack, 'my-api', { disableExecuteApiEndpoint: true });
    api.root.addMethod('GET');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
      DisableExecuteApiEndpoint: true,
    });
  });

  test('disableExecuteApiEndpoint is false when set to false in SpecRestApi', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new apigw.SpecRestApi(stack, 'my-api', {
      apiDefinition: apigw.ApiDefinition.fromInline({ foo: 'bar' }),
      disableExecuteApiEndpoint: false,
    });
    api.root.addMethod('GET');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
      DisableExecuteApiEndpoint: false,
    });
  });

  test('disableExecuteApiEndpoint is true when set to true in SpecRestApi', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new apigw.SpecRestApi(stack, 'my-api', {
      apiDefinition: apigw.ApiDefinition.fromInline({ foo: 'bar' }),
      disableExecuteApiEndpoint: true,
    });
    api.root.addMethod('GET');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
      DisableExecuteApiEndpoint: true,
    });
  });

  describe('Description', () => {
    test('description can be set', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const api = new apigw.RestApi(stack, 'my-api', { description: 'My API' });
      api.root.addMethod('GET');

      // THEN
      Template.fromStack(stack).hasResourceProperties(
        'AWS::ApiGateway::RestApi',
        {
          Description: 'My API',
        });
    });

    test('description is not set', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      const api = new apigw.RestApi(stack, 'my-api');
      api.root.addMethod('GET');

      // THEN
      Template.fromStack(stack).hasResourceProperties(
        'AWS::ApiGateway::RestApi', {});
    });
  });
});
