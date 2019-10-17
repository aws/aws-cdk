import { expect, haveResource, ResourcePart, SynthUtils } from '@aws-cdk/assert';
import lambda = require('@aws-cdk/aws-lambda');
import { CfnResource, Lazy, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import path = require('path');
import apigateway = require('../lib');

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
        Type: "AWS::ApiGateway::Method",
        Properties: {
          HttpMethod: "GET",
          ResourceId: {
          "Fn::GetAtt": [
            "apiC8550315",
            "RootResourceId"
          ]
          },
          RestApiId: {
          Ref: "apiC8550315"
          },
          AuthorizationType: "NONE",
          Integration: {
          Type: "MOCK"
          }
        }
        },
        apiC8550315: {
        Type: "AWS::ApiGateway::RestApi",
        Properties: {
          Name: "api"
        }
        },
        deployment33381975: {
        Type: "AWS::ApiGateway::Deployment",
        Properties: {
          RestApiId: {
          Ref: "apiC8550315"
          }
        }
        }
      }
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
        Type: "AWS::ApiGateway::Method",
        Properties: {
          HttpMethod: "GET",
          ResourceId: {
          "Fn::GetAtt": [
            "apiC8550315",
            "RootResourceId"
          ]
          },
          RestApiId: {
          Ref: "apiC8550315"
          },
          AuthorizationType: "NONE",
          Integration: {
          Type: "MOCK"
          }
        }
        },
        apiC8550315: {
        Type: "AWS::ApiGateway::RestApi",
        Properties: {
          Name: "api"
        }
        },
        deployment33381975: {
        Type: "AWS::ApiGateway::Deployment",
        Properties: {
          RestApiId: {
          Ref: "apiC8550315"
          }
        },
        DeletionPolicy: "Retain",
        UpdateReplacePolicy: "Retain"
        }
      }
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
      Description: 'this is my deployment'
    }));

    test.done();
  },

  '"addToLogicalId" will "salt" the logical ID of the deployment resource'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const api = new apigateway.RestApi(stack, 'api', { deploy: false, cloudWatchRole: false });
    const deployment = new apigateway.Deployment(stack, 'deployment', { api });
    api.root.addMethod('GET');

    // default logical ID (with no "salt")
    test.ok(synthesize().Resources.deployment33381975);

    // adding some salt
    deployment.addToLogicalId({ foo: 123 }); // add some data to the logical ID

    // the logical ID changed
    const template = synthesize();
    test.ok(!template.Resources.deployment33381975, 'old resource id deleted');
    test.ok(template.Resources.deployment33381975427670fa9e4148dc851927485bdf36a5, 'new resource is created');

    // tokens supported, and are resolved upon synthesis
    const value = 'hello hello';
    deployment.addToLogicalId({ foo: Lazy.stringValue({ produce: () => value }) });

    const template2 = synthesize();
    test.ok(template2.Resources.deployment33381975a12dfe81474913364dc31c06e37f9449);

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
      DependsOn: [ "MyResource" ],
    }, ResourcePart.CompleteDefinition));

    test.done();
  },

  'integration change invalidates deployment'(test: Test) {
    // GIVEN
    const stack1 = new Stack();
    const stack2 = new Stack();
    const handler1 = new lambda.Function(stack1, 'handler1', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'integ.cors.handler')),
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler'
    });
    const handler2 = new lambda.Function(stack2, 'handler2', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'integ.cors.handler')),
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler'
    });

    // WHEN
    const api1 = new apigateway.RestApi(stack1, 'myapi', {
      defaultIntegration: new apigateway.LambdaIntegration(handler1)
    });
    const api2 = new apigateway.RestApi(stack2, 'myapi', {
      defaultIntegration: new apigateway.LambdaIntegration(handler2)
    });
    api1.root.addMethod('GET');
    api2.root.addMethod('GET');

    // THEN
    expect(stack1).to(haveResource('AWS::ApiGateway::Stage', {
      DeploymentId: { Ref: 'myapiDeploymentB7EF8EB7e0b8372768854261d2d1218739e0a307' }
    }));
    expect(stack2).to(haveResource('AWS::ApiGateway::Stage', {
      DeploymentId: { Ref: 'myapiDeploymentB7EF8EB77c517352b0f7ab73c333e36585c8f1f3' }
    }));
    test.done();
  }
};
