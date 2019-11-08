import { expect, haveResource, haveResourceLike, ResourcePart, SynthUtils } from '@aws-cdk/assert';
import { App, CfnElement, CfnResource, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import apigateway = require('../lib');
import { CfnRestApi, JsonSchemaType, JsonSchemaVersion } from '../lib';

// tslint:disable:max-line-length

export = {
  'minimal setup'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new apigateway.RestApi(stack, 'my-api');
    api.root.addMethod('GET'); // must have at least one method

    // THEN
    expect(stack).toMatch({
      Resources: {
        myapi4C7BF186: {
          Type: "AWS::ApiGateway::RestApi",
          Properties: {
            Name: "my-api"
          }
        },
        myapiGETF990CE3C: {
          Type: "AWS::ApiGateway::Method",
          Properties: {
            HttpMethod: "GET",
            ResourceId: { "Fn::GetAtt": [ "myapi4C7BF186", "RootResourceId" ] },
            RestApiId: { Ref: "myapi4C7BF186" },
            AuthorizationType: "NONE",
            Integration: {
              Type: "MOCK"
            }
          }
        },
        myapiDeployment92F2CB49916eaecf87f818f1e175215b8d086029: {
          Type: "AWS::ApiGateway::Deployment",
          Properties: {
            RestApiId: { Ref: "myapi4C7BF186" },
            Description: "Automatically created by the RestApi construct"
          },
          DependsOn: ["myapiGETF990CE3C"]
        },
        myapiDeploymentStageprod298F01AF: {
          Type: "AWS::ApiGateway::Stage",
          Properties: {
            RestApiId: { Ref: "myapi4C7BF186" },
            DeploymentId: { Ref: "myapiDeployment92F2CB49916eaecf87f818f1e175215b8d086029" },
            StageName: "prod"
          }
        },
        myapiCloudWatchRole095452E5: {
          Type: "AWS::IAM::Role",
          Properties: {
            AssumeRolePolicyDocument: {
              Statement: [
                {
                  Action: "sts:AssumeRole",
                  Effect: "Allow",
                  Principal: { Service: "apigateway.amazonaws.com" }
                }
              ],
              Version: "2012-10-17"
            },
            ManagedPolicyArns: [
              { "Fn::Join": [ "", [ "arn:", { Ref: "AWS::Partition" }, ":iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs" ] ] }
            ]
          }
        },
        myapiAccountEC421A0A: {
          Type: "AWS::ApiGateway::Account",
          Properties: {
            CloudWatchRoleArn: { "Fn::GetAtt": [ "myapiCloudWatchRole095452E5", "Arn" ] }
          },
          DependsOn: [ "myapi4C7BF186" ]
        }
      },
      Outputs: {
        myapiEndpoint3628AFE3: {
          Value: {
            "Fn::Join": [ "", [
              "https://",
              { Ref: "myapi4C7BF186" },
              ".execute-api.",
              { Ref: "AWS::Region" },
              ".",
              { Ref: "AWS::URLSuffix" },
              "/",
              { Ref: "myapiDeploymentStageprod298F01AF" },
              "/"
            ]]
          }
        }
      }
    });

    test.done();
  },

  'defaultChild is set correctly'(test: Test) {
    const stack = new Stack();
    const api = new apigateway.RestApi(stack, 'my-api');
    test.ok(api.node.defaultChild instanceof CfnRestApi);
    test.done();
  },

  '"name" is defaulted to resource physical name'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new apigateway.RestApi(stack, 'restapi', {
      deploy: false,
      cloudWatchRole: false,
    });

    api.root.addMethod('GET');

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::RestApi', {
      Name: 'restapi'
    }));

    test.done();
  },

  'fails in synthesis if there are no methods'(test: Test) {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'my-stack');
    const api = new apigateway.RestApi(stack, 'API');

    // WHEN
    api.root.addResource('foo');
    api.root.addResource('bar').addResource('goo');

    // THEN
    test.throws(() => app.synth(), /The REST API doesn't contain any methods/);
    test.done();
  },

  '"addResource" can be used on "IRestApiResource" to form a tree'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigateway.RestApi(stack, 'restapi', {
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
    expect(stack).to(haveResource('AWS::ApiGateway::Resource', {
      PathPart: "foo",
      ParentId: { "Fn::GetAtt": [ "restapiC5611D27", "RootResourceId"] }
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Resource', {
      PathPart: "bar",
      ParentId: { "Fn::GetAtt": [ "restapiC5611D27", "RootResourceId"] }
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::Resource', {
      PathPart: "{hello}",
      ParentId: { Ref: "restapifooF697E056" }
    }));

    test.done();
  },

  '"addResource" allows configuration of proxy paths'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigateway.RestApi(stack, 'restapi', {
      deploy: false,
      cloudWatchRole: false,
      restApiName: 'my-rest-api',
    });

    // WHEN
    const proxy = api.root.addResource('{proxy+}');
    proxy.addMethod('ANY');

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Resource', {
      PathPart: "{proxy+}",
      ParentId: { "Fn::GetAtt": ["restapiC5611D27", "RootResourceId"] }
    }));
    test.done();
  },

  '"addMethod" can be used to add methods to resources'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const api = new apigateway.RestApi(stack, 'restapi', { deploy: false, cloudWatchRole: false });
    const r1 = api.root.addResource('r1');

    // WHEN
    api.root.addMethod('GET');
    r1.addMethod('POST');

    // THEN
    expect(stack).toMatch({
      Resources: {
      restapiC5611D27: {
        Type: "AWS::ApiGateway::RestApi",
        Properties: {
        Name: "restapi"
        }
      },
      restapir1CF2997EA: {
        Type: "AWS::ApiGateway::Resource",
        Properties: {
        ParentId: {
          "Fn::GetAtt": [
          "restapiC5611D27",
          "RootResourceId"
          ]
        },
        PathPart: "r1",
        RestApiId: {
          Ref: "restapiC5611D27"
        }
        }
      },
      restapir1POST766920C4: {
        Type: "AWS::ApiGateway::Method",
        Properties: {
        HttpMethod: "POST",
        ResourceId: {
          Ref: "restapir1CF2997EA"
        },
        RestApiId: {
          Ref: "restapiC5611D27"
        },
        AuthorizationType: "NONE",
        Integration: {
          Type: "MOCK"
        }
        }
      },
      restapiGET6FC1785A: {
        Type: "AWS::ApiGateway::Method",
        Properties: {
        HttpMethod: "GET",
        ResourceId: {
          "Fn::GetAtt": [
          "restapiC5611D27",
          "RootResourceId"
          ]
        },
        RestApiId: {
          Ref: "restapiC5611D27"
        },
        AuthorizationType: "NONE",
        Integration: {
          Type: "MOCK"
        }
        }
      }
      }
    });

    test.done();
  },

  'resourcePath returns the full path of the resource within the API'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigateway.RestApi(stack, 'restapi');

    // WHEN
    const r1 = api.root.addResource('r1');
    const r11 = r1.addResource('r1_1');
    const r12 = r1.addResource('r1_2');
    const r121 = r12.addResource('r1_2_1');
    const r2 = api.root.addResource('r2');

    // THEN
    test.deepEqual(api.root.path, '/');
    test.deepEqual(r1.path, '/r1');
    test.deepEqual(r11.path, '/r1/r1_1');
    test.deepEqual(r12.path, '/r1/r1_2');
    test.deepEqual(r121.path, '/r1/r1_2/r1_2_1');
    test.deepEqual(r2.path, '/r2');
    test.done();
  },

  'resource path part validation'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigateway.RestApi(stack, 'restapi');

    // THEN
    test.throws(() => api.root.addResource('foo/'));
    api.root.addResource('boom-bam');
    test.throws(() => api.root.addResource('illegal()'));
    api.root.addResource('{foo}');
    test.throws(() => api.root.addResource('foo{bar}'));
    test.done();
  },

  'fails if "deployOptions" is set with "deploy" disabled'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // THEN
    test.throws(() => new apigateway.RestApi(stack, 'myapi', {
      deploy: false,
      deployOptions: { cachingEnabled: true }
    }), /Cannot set 'deployOptions' if 'deploy' is disabled/);

    test.done();
  },

  'CloudWatch role is created for API Gateway'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigateway.RestApi(stack, 'myapi');
    api.root.addMethod('GET');

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Role'));
    expect(stack).to(haveResource('AWS::ApiGateway::Account'));
    test.done();
  },

  'fromRestApiId'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const imported = apigateway.RestApi.fromRestApiId(stack, 'imported-api', 'api-rxt4498f');

    // THEN
    test.deepEqual(stack.resolve(imported.restApiId), 'api-rxt4498f');
    test.done();
  },

  '"url" and "urlForPath" return the URL endpoints of the deployed API'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigateway.RestApi(stack, 'api');
    api.root.addMethod('GET');

    // THEN
    test.deepEqual(stack.resolve(api.url), { 'Fn::Join':
    [ '',
      [ 'https://',
      { Ref: 'apiC8550315' },
      '.execute-api.',
      { Ref: 'AWS::Region' },
      ".",
      { Ref: "AWS::URLSuffix" },
      "/",
      { Ref: 'apiDeploymentStageprod896C8101' },
      '/' ] ] });
    test.deepEqual(stack.resolve(api.urlForPath('/foo/bar')), { 'Fn::Join':
    [ '',
      [ 'https://',
      { Ref: 'apiC8550315' },
      '.execute-api.',
      { Ref: 'AWS::Region' },
      ".",
      { Ref: "AWS::URLSuffix" },
      "/",
      { Ref: 'apiDeploymentStageprod896C8101' },
      '/foo/bar' ] ] });
    test.done();
  },

  '"urlForPath" would not work if there is no deployment'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigateway.RestApi(stack, 'api', { deploy: false });
    api.root.addMethod('GET');

    // THEN
    test.throws(() => api.url, /Cannot determine deployment stage for API from "deploymentStage". Use "deploy" or explicitly set "deploymentStage"/);
    test.throws(() => api.urlForPath('/foo'), /Cannot determine deployment stage for API from "deploymentStage". Use "deploy" or explicitly set "deploymentStage"/);
    test.done();
  },

  '"urlForPath" requires that path will begin with "/"'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigateway.RestApi(stack, 'api');
    api.root.addMethod('GET');

    // THEN
    test.throws(() => api.urlForPath('foo'), /Path must begin with \"\/\": foo/);
    test.done();
  },

  '"executeApiArn" returns the execute-api ARN for a resource/method'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigateway.RestApi(stack, 'api');
    api.root.addMethod('GET');

    // WHEN
    const arn = api.arnForExecuteApi('method', '/path', 'stage');

    // THEN
    test.deepEqual(stack.resolve(arn), { 'Fn::Join':
    [ '',
      [ 'arn:',
      { Ref: 'AWS::Partition' },
      ':execute-api:',
      { Ref: 'AWS::Region' },
      ':',
      { Ref: 'AWS::AccountId' },
      ':',
      { Ref: 'apiC8550315' },
      '/stage/method/path' ] ] });
    test.done();
  },

  '"executeApiArn" path must begin with "/"'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigateway.RestApi(stack, 'api');
    api.root.addMethod('GET');

    // THEN
    test.throws(() => api.arnForExecuteApi('method', 'hey-path', 'stage'), /"path" must begin with a "\/": 'hey-path'/);
    test.done();
  },

  '"executeApiArn" will convert ANY to "*"'(test: Test) {
    // GIVEN
    const stack = new Stack();

    const api = new apigateway.RestApi(stack, 'api');
    const method = api.root.addMethod('ANY');

    // THEN
    test.deepEqual(stack.resolve(method.methodArn), { 'Fn::Join':
    [ '',
      [ 'arn:',
      { Ref: 'AWS::Partition' },
      ':execute-api:',
      { Ref: 'AWS::Region' },
      ':',
      { Ref: 'AWS::AccountId' },
      ':',
      { Ref: 'apiC8550315' },
      '/',
      { Ref: 'apiDeploymentStageprod896C8101' },
      '/*/'] ] });
    test.done();
  },

  '"endpointTypes" can be used to specify endpoint configuration for the api'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new apigateway.RestApi(stack, 'api', {
      endpointTypes: [ apigateway.EndpointType.EDGE, apigateway.EndpointType.PRIVATE ]
    });

    api.root.addMethod('GET');

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::RestApi', {
      EndpointConfiguration: {
      Types: [
        "EDGE",
        "PRIVATE"
      ]
      }
    }));
    test.done();
  },

  '"cloneFrom" can be used to clone an existing API'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const cloneFrom = apigateway.RestApi.fromRestApiId(stack, 'RestApi', 'foobar');

    // WHEN
    const api = new apigateway.RestApi(stack, 'api', {
      cloneFrom
    });

    api.root.addMethod('GET');

    expect(stack).to(haveResource('AWS::ApiGateway::RestApi', {
      CloneFrom: "foobar",
      Name: "api"
    }));

    test.done();
  },

  'allow taking a dependency on the rest api (includes deployment and stage)'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigateway.RestApi(stack, 'myapi');
    api.root.addMethod('GET');
    const resource = new CfnResource(stack, 'DependsOnRestApi', { type: 'My::Resource' });

    // WHEN
    resource.node.addDependency(api);

    // THEN
    expect(stack).to(haveResource('My::Resource', {
      DependsOn: [
        "myapiAccountC3A4750C",
        "myapiCloudWatchRoleEB425128",
        "myapiGET9B7CD29E",
        "myapiDeploymentB7EF8EB75c091a668064a3f3a1f6d68a3fb22cf9",
        "myapiDeploymentStageprod329F21FF",
        "myapi162F20B8"
      ]
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'defaultIntegration and defaultMethodOptions can be used at any level'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const rootInteg = new apigateway.AwsIntegration({
      service: 's3',
      action: 'GetObject'
    });

    // WHEN
    const api = new apigateway.RestApi(stack, 'myapi', {
      defaultIntegration: rootInteg,
      defaultMethodOptions: {
        authorizationType: apigateway.AuthorizationType.IAM,
      }
    });

    // CASE #1: should inherit integration and options from root resource
    api.root.addMethod('GET');

    const child = api.root.addResource('child');

    // CASE #2: should inherit integration from root and method options, but
    // "authorizationType" will be overridden to "None" instead of "IAM"
    child.addMethod('POST', undefined, {
      authorizer: { authorizerId: 'AUTHID' },
      authorizationType: apigateway.AuthorizationType.CUSTOM
    });

    const child2 = api.root.addResource('child2', {
      defaultIntegration: new apigateway.MockIntegration(),
      defaultMethodOptions: {
        authorizer: { authorizerId: 'AUTHID2' },
        authorizationType: apigateway.AuthorizationType.CUSTOM
      }
    });

    // CASE #3: integartion and authorizer ID are inherited from child2
    child2.addMethod('DELETE');

    // CASE #4: same as case #3, but integration is customized
    child2.addMethod('PUT', new apigateway.AwsIntegration({ action: 'foo', service: 'bar' }));

    // THEN

    // CASE #1
    expect(stack).to(haveResourceLike('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      ResourceId: { "Fn::GetAtt": [ "myapi162F20B8", "RootResourceId" ] },
      Integration: { Type: 'AWS' },
      AuthorizationType: 'AWS_IAM',
    }));

    // CASE #2
    expect(stack).to(haveResourceLike('AWS::ApiGateway::Method', {
      HttpMethod: 'POST',
      ResourceId: { Ref: "myapichildA0A65412" },
      Integration: { Type: 'AWS' },
      AuthorizerId: 'AUTHID',
      AuthorizationType: 'CUSTOM',
    }));

    // CASE #3
    expect(stack).to(haveResourceLike('AWS::ApiGateway::Method', {
      HttpMethod: 'DELETE',
      Integration: { Type: 'MOCK' },
      AuthorizerId: 'AUTHID2',
      AuthorizationType: 'CUSTOM'
    }));

    // CASE #4
    expect(stack).to(haveResourceLike('AWS::ApiGateway::Method', {
      HttpMethod: 'PUT',
      Integration: { Type: 'AWS' },
      AuthorizerId: 'AUTHID2',
      AuthorizationType: 'CUSTOM'
    }));

    test.done();
  },

  'addModel is supported'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigateway.RestApi(stack, 'myapi');
    api.root.addMethod('OPTIONS');

    // WHEN
    api.addModel('model', {
      schema: {
        schema: JsonSchemaVersion.DRAFT4,
        title: "test",
        type: JsonSchemaType.OBJECT,
        properties: { message: { type: JsonSchemaType.STRING } }
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Model', {
      RestApiId: { Ref: stack.getLogicalId(api.node.findChild('Resource') as CfnElement) },
      Schema: {
        $schema: "http://json-schema.org/draft-04/schema#",
        title: "test",
        type: "object",
        properties: { message: { type: "string" } }
      }
    }));

    test.done();
  },

  'addRequestValidator is supported'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigateway.RestApi(stack, 'myapi');
    api.root.addMethod('OPTIONS');

    // WHEN
    api.addRequestValidator('params-validator', {
      requestValidatorName: 'Parameters',
      validateRequestBody: false,
      validateRequestParameters: true
    });
    api.addRequestValidator('body-validator', {
      requestValidatorName: "Body",
      validateRequestBody: true,
      validateRequestParameters: false
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::RequestValidator', {
      RestApiId: { Ref: stack.getLogicalId(api.node.findChild('Resource') as CfnElement) },
      Name: "Parameters",
      ValidateRequestBody: false,
      ValidateRequestParameters: true
    }));

    expect(stack).to(haveResource('AWS::ApiGateway::RequestValidator', {
      RestApiId: { Ref: stack.getLogicalId(api.node.findChild('Resource') as CfnElement) },
      Name: "Body",
      ValidateRequestBody: true,
      ValidateRequestParameters: false
    }));

    test.done();
  },
  'creates output with given "exportName"'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new apigateway.RestApi(stack, 'myapi', { endpointExportName: 'my-given-export-name' });
    api.root.addMethod('GET');

    // THEN
    test.deepEqual(SynthUtils.toCloudFormation(stack).Outputs, {
      myapiEndpoint8EB17201: {
        Value: {
          'Fn::Join': [
            '',
            [
              'https://',
              {Ref: 'myapi162F20B8'},
              '.execute-api.',
              {Ref: 'AWS::Region'},
              '.',
              {Ref: 'AWS::URLSuffix'},
              '/',
              {Ref: 'myapiDeploymentStageprod329F21FF'},
              '/'
            ]
          ]
        },
        Export: {Name: 'my-given-export-name'}
      }
    });

    test.done();
  },

  'creates output when "exportName" is not specified'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const api = new apigateway.RestApi(stack, 'myapi');
    api.root.addMethod('GET');

    // THEN
    test.deepEqual(SynthUtils.toCloudFormation(stack).Outputs, {
      myapiEndpoint8EB17201: {
        Value: {
          'Fn::Join': [
            '',
            [
              'https://',
              {Ref: 'myapi162F20B8'},
              '.execute-api.',
              {Ref: 'AWS::Region'},
              '.',
              {Ref: 'AWS::URLSuffix'},
              '/',
              {Ref: 'myapiDeploymentStageprod329F21FF'},
              '/'
            ]
          ]
        }
      }
    });

    test.done();
  }
};
