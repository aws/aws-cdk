import { expect, haveResource, ResourcePart, SynthUtils } from '@aws-cdk/assert';
import * as lambda from '@aws-cdk/aws-lambda';
import { CfnResource, Lazy, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as path from 'path';
import * as apigateway from '../lib';

export = {
  'minimal setup'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigateway.RestApi(stack, 'api', { deploy: false, cloudWatchRole: false });
    api.root.addMethod('GET');

    // WHEN
    new apigateway.Deployment(stack, 'deployment', { api });

    // THEN
    expect(stack).toMatch({
      Resources: {
        apiGETECF0BD67: {
          Type: 'AWS::ApiGateway::Method',
          Properties: {
            HttpMethod: 'GET',
            ResourceId: {
              'Fn::GetAtt': [
                'apiC8550315',
                'RootResourceId',
              ],
            },
            RestApiId: {
              Ref: 'apiC8550315',
            },
            AuthorizationType: 'NONE',
            Integration: {
              Type: 'MOCK',
            },
          },
        },
        apiC8550315: {
          Type: 'AWS::ApiGateway::RestApi',
          Properties: {
            Name: 'api',
          },
        },
        deployment33381975bba46c5132329b81e7befcbbba5a0e75: {
          Type: 'AWS::ApiGateway::Deployment',
          Properties: {
            RestApiId: {
              Ref: 'apiC8550315',
            },
          },
          DependsOn: [
            'apiGETECF0BD67',
          ],
        },
      },
    });

    test.done();
  },

  '"retainDeployments" can be used to control the deletion policy of the resource'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigateway.RestApi(stack, 'api', { deploy: false, cloudWatchRole: false });
    api.root.addMethod('GET');

    // WHEN
    new apigateway.Deployment(stack, 'deployment', { api, retainDeployments: true });

    // THEN
    expect(stack).toMatch({
      Resources: {
        apiGETECF0BD67: {
          Type: 'AWS::ApiGateway::Method',
          Properties: {
            HttpMethod: 'GET',
            ResourceId: {
              'Fn::GetAtt': [
                'apiC8550315',
                'RootResourceId',
              ],
            },
            RestApiId: {
              Ref: 'apiC8550315',
            },
            AuthorizationType: 'NONE',
            Integration: {
              Type: 'MOCK',
            },
          },
        },
        apiC8550315: {
          Type: 'AWS::ApiGateway::RestApi',
          Properties: {
            Name: 'api',
          },
        },
        deployment33381975bba46c5132329b81e7befcbbba5a0e75: {
          Type: 'AWS::ApiGateway::Deployment',
          Properties: {
            RestApiId: {
              Ref: 'apiC8550315',
            },
          },
          DeletionPolicy: 'Retain',
          UpdateReplacePolicy: 'Retain',
          DependsOn: [
            'apiGETECF0BD67',
          ],
        },
      },
    });

    test.done();
  },

  '"description" can be set on the deployment'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigateway.RestApi(stack, 'api', { deploy: false, cloudWatchRole: false });
    api.root.addMethod('GET');

    // WHEN
    new apigateway.Deployment(stack, 'deployment', { api, description: 'this is my deployment' });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Deployment', {
      Description: 'this is my deployment',
    }));

    test.done();
  },

  'logical ID of the deployment resource is salted'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigateway.RestApi(stack, 'api', { deploy: false, cloudWatchRole: false });
    const deployment = new apigateway.Deployment(stack, 'deployment', { api });
    api.root.addMethod('GET');

    const resources = synthesize().Resources;
    test.ok(resources.deployment33381975bba46c5132329b81e7befcbbba5a0e75,
      `resource deployment33381975bba46c5132329b81e7befcbbba5a0e75 not found, instead found ${Object.keys(resources)}`);

    // adding some salt
    deployment.addToLogicalId({ foo: 123 }); // add some data to the logical ID

    // the logical ID changed
    const template = synthesize();
    test.ok(!template.Resources.deployment33381975bba46c5132329b81e7befcbbba5a0e75, 'old resource id is not deleted');
    test.ok(template.Resources.deployment33381975075f46a4503208d69fcffed2f263c48c,
      `new resource deployment33381975075f46a4503208d69fcffed2f263c48c is not created, instead found ${Object.keys(template.Resources)}`);

    // tokens supported, and are resolved upon synthesis
    const value = 'hello hello';
    deployment.addToLogicalId({ foo: Lazy.stringValue({ produce: () => value }) });

    const template2 = synthesize();
    test.ok(template2.Resources.deployment33381975b6d7672e4c9afd0b741e41d07739786b,
      `resource deployment33381975b6d7672e4c9afd0b741e41d07739786b not found, instead found ${Object.keys(template2.Resources)}`);

    test.done();

    function synthesize() {
      return SynthUtils.synthesize(stack).template;
    }
  },

  '"addDependency" can be used to add a resource as a dependency'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigateway.RestApi(stack, 'api', { deploy: false, cloudWatchRole: false });
    const deployment = new apigateway.Deployment(stack, 'deployment', { api });
    api.root.addMethod('GET');

    const dep = new CfnResource(stack, 'MyResource', { type: 'foo' });

    // WHEN
    deployment.node.addDependency(dep);

    expect(stack).to(haveResource('AWS::ApiGateway::Deployment', {
      DependsOn: [
        'apiGETECF0BD67',
        'MyResource',
      ],
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'integration change invalidates deployment'(test: Test) {
    // GIVEN
    const stack1 = new Stack();
    const stack2 = new Stack();
    const handler1 = new lambda.Function(stack1, 'handler1', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
    });
    const handler2 = new lambda.Function(stack2, 'handler2', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
    });

    // WHEN
    const api1 = new apigateway.RestApi(stack1, 'myapi', {
      defaultIntegration: new apigateway.LambdaIntegration(handler1),
    });
    const api2 = new apigateway.RestApi(stack2, 'myapi', {
      defaultIntegration: new apigateway.LambdaIntegration(handler2),
    });
    api1.root.addMethod('GET');
    api2.root.addMethod('GET');

    // THEN
    expect(stack1).to(haveResource('AWS::ApiGateway::Stage', {
      DeploymentId: { Ref: 'myapiDeploymentB7EF8EB74c5295c27fa87ff13f4d04e13f67662d' },
    }));
    expect(stack2).to(haveResource('AWS::ApiGateway::Stage', {
      DeploymentId: { Ref: 'myapiDeploymentB7EF8EB7b50d305057ba109c118e4aafd4509355' },
    }));
    test.done();
  },

  'deployment resource depends on all restapi methods defined'(test: Test) {
    const stack = new Stack();
    const restapi = new apigateway.RestApi(stack, 'myapi', {
      deploy: false,
    });
    restapi.root.addMethod('GET');

    const deployment = new apigateway.Deployment(stack, 'mydeployment', {
      api: restapi,
    });
    const stage = new apigateway.Stage(stack, 'mystage', {
      deployment,
    });
    restapi.deploymentStage = stage;

    restapi.root.addMethod('POST');
    const resource = restapi.root.addResource('myresource');
    resource.addMethod('GET');

    expect(stack).to(haveResource('AWS::ApiGateway::Deployment', {
      DependsOn: [
        'myapiGET9B7CD29E',
        'myapimyresourceGET732851A5',
        'myapiPOST23417BD2',
      ],
    }, ResourcePart.CompleteDefinition));

    test.done();
  },
};
