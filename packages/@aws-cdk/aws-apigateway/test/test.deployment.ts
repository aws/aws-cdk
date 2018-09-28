import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import apigateway = require('../lib');

export = {
  'minimal setup'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
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
    const stack = new cdk.Stack();
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
        DeletionPolicy: "Retain"
        }
      }
    });

    test.done();
  },

  '"description" can be set on the deployment'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
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
    const stack = new cdk.Stack();
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
    deployment.addToLogicalId({ foo: new cdk.Token(() => value) });

    const template2 = synthesize();
    test.ok(template2.Resources.deployment33381975a12dfe81474913364dc31c06e37f9449);

    test.done();

    function synthesize() {
      stack.validateTree();
      return stack.toCloudFormation();
    }
  },

  '"addDependency" can be used to add a resource as a dependency'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'api', { deploy: false, cloudWatchRole: false });
    const deployment = new apigateway.Deployment(stack, 'deployment', { api });
    api.root.addMethod('GET');

    const dep = new cdk.Resource(stack, 'MyResource', { type: 'foo' });

    // WHEN
    deployment.addDependency(dep);

    expect(stack).to(haveResource('AWS::ApiGateway::Deployment', {
      DependsOn: [ "MyResource" ],
    }, ResourcePart.CompleteDefinition));

    test.done();
  },
};
