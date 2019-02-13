import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import apigateway = require('../lib');
import { ConnectionType, EmptyModel, ErrorModel } from '../lib';

export = {
  'default setup'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });

    // WHEN
    new apigateway.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: "POST",
      AuthorizationType: "NONE",
      Integration: {
        Type: "MOCK"
      }
    }));

    test.done();
  },

  'method options can be specified'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });

    // WHEN
    new apigateway.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
      options: {
        apiKeyRequired: true,
        operationName: 'MyOperation',
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      ApiKeyRequired: true,
      OperationName: "MyOperation"
    }));

    test.done();
  },

  'integration can be set via a property'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });

    // WHEN
    new apigateway.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
      integration: new apigateway.AwsIntegration({ service: 's3', path: 'bucket/key' })
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      Integration: {
        IntegrationHttpMethod: "POST",
        Type: "AWS",
        Uri: {
          "Fn::Join": [
          "",
          [
            "arn:", { Ref: "AWS::Partition" }, ":apigateway:",
            { Ref: "AWS::Region" }, ":s3:path/bucket/key"
          ]
          ]
        }
      }
    }));

    test.done();
  },

  'use default integration from api'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const defaultIntegration = new apigateway.Integration({ type: apigateway.IntegrationType.HttpProxy, uri: 'https://amazon.com' });
    const api = new apigateway.RestApi(stack, 'test-api', {
      cloudWatchRole: false,
      deploy: false,
      defaultIntegration
    });

    // WHEN
    new apigateway.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      Integration: {
        Type: "HTTP_PROXY",
        Uri: 'https://amazon.com'
      }
    }));

    test.done();
  },

  '"methodArn" returns the ARN execute-api ARN for this method in the current stage'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api');

    // WHEN
    const method = new apigateway.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
    });

    // THEN
    test.deepEqual(method.node.resolve(method.methodArn), {
      "Fn::Join": [
        "",
        [
        "arn:",
        { Ref: "AWS::Partition" },
        ":execute-api:",
        { Ref: "AWS::Region" },
        ":",
        { Ref: "AWS::AccountId" },
        ":",
        { Ref: "testapiD6451F70" },
        "/",
        { Ref: "testapiDeploymentStageprod5C9E92A4" },
        "/POST/"
        ]
      ]
    });

    test.done();
  },

  '"testMethodArn" returns the ARN of the "test-invoke-stage" stage (console UI)'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api');

    // WHEN
    const method = new apigateway.Method(stack, 'my-method', {
      httpMethod: 'POST',
      resource: api.root,
    });

    // THEN
    test.deepEqual(method.node.resolve(method.testMethodArn), {
      "Fn::Join": [
        "",
        [
        "arn:",
        { Ref: "AWS::Partition" },
        ":execute-api:",
        { Ref: "AWS::Region" },
        ":",
        { Ref: "AWS::AccountId" },
        ":",
        { Ref: "testapiD6451F70" },
        "/test-invoke-stage/POST/"
        ]
      ]
    });

    test.done();
  },

  '"methodArn" fails if the API does not have a deployment stage'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { deploy: false });
    const method = new apigateway.Method(stack, 'my-method', { httpMethod: 'POST', resource: api.root });

    // WHEN + THEN
    test.throws(() => method.methodArn,
      /Unable to determine ARN for method "my-method" since there is no stage associated with this API./);

    test.done();
  },

  'integration "credentialsRole" can be used to assume a role when calling backend'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { deploy: false });
    const role = new iam.Role(stack, 'MyRole', { assumedBy: new iam.ServicePrincipal('foo') });

    // WHEN
    api.root.addMethod('GET', new apigateway.Integration({
      type: apigateway.IntegrationType.AwsProxy,
      options: {
        credentialsRole: role
      }
    }));

    // THEN
    expect(stack).to(haveResourceLike('AWS::ApiGateway::Method', {
      Integration: {
        Credentials: { "Fn::GetAtt": [ "MyRoleF48FFE04", "Arn" ] }
      }
    }));
    test.done();
  },

  'integration "credentialsPassthrough" can be used to passthrough user credentials to backend'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { deploy: false });

    // WHEN
    api.root.addMethod('GET', new apigateway.Integration({
      type: apigateway.IntegrationType.AwsProxy,
      options: {
        credentialsPassthrough: true
      }
    }));

    // THEN
    expect(stack).to(haveResourceLike('AWS::ApiGateway::Method', {
      Integration: {
        Credentials: { "Fn::Join": [ "", [ "arn:", { Ref: "AWS::Partition" }, ":iam::*:user/*" ] ] }
      }
    }));
    test.done();
  },

  'integration "credentialsRole" and "credentialsPassthrough" are mutually exclusive'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { deploy: false });
    const role = new iam.Role(stack, 'MyRole', { assumedBy: new iam.ServicePrincipal('foo') });

    // WHEN
    const integration = new apigateway.Integration({
      type: apigateway.IntegrationType.AwsProxy,
      options: {
        credentialsPassthrough: true,
        credentialsRole: role
      }
    });

    // THEN
    test.throws(() => api.root.addMethod('GET', integration), /'credentialsPassthrough' and 'credentialsRole' are mutually exclusive/);
    test.done();
  },

  'integration connectionType VpcLink requires vpcLink to be set'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { deploy: false });

    // WHEN
    const integration = new apigateway.Integration({
      type: apigateway.IntegrationType.HttpProxy,
      integrationHttpMethod: 'ANY',
      options: {
        connectionType: ConnectionType.VpcLink,
      }
    });

    // THEN
    test.throws(() => api.root.addMethod('GET', integration), /'connectionType' of VPC_LINK requires 'vpcLink' prop to be set/);
    test.done();
  },

  'connectionType of INTERNET and vpcLink are mutually exclusive'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { deploy: false });
    const vpc = new ec2.VpcNetwork(stack, 'VPC');
    const nlb = new elbv2.NetworkLoadBalancer(stack, 'NLB', {
      vpc
    });
    const link = new apigateway.VpcLink(stack, 'link', {
      targets: [nlb]
    });

    // WHEN
    const integration = new apigateway.Integration({
      type: apigateway.IntegrationType.HttpProxy,
      integrationHttpMethod: 'ANY',
      options: {
        connectionType: ConnectionType.Internet,
        vpcLink: link
      }
    });

    // THEN
    test.throws(() => api.root.addMethod('GET', integration), /cannot set 'vpcLink' where 'connectionType' is INTERNET/);
    test.done();
  },

  'methodResponse set one or more method responses via options'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { deploy: false });

    // WHEN
    new apigateway.Method(stack, 'method-man', {
      httpMethod: 'GET',
      resource: api.root,
      options: {
        methodResponses: [{
            statusCode: '200'
          }, {
            statusCode: "400",
            responseParameters: {
              'method.response.header.killerbees': false
            }
          }, {
            statusCode: "500",
            responseParameters: {
              'method.response.header.errthing': true
            },
            responseModels: {
              'application/json': new EmptyModel(),
              'text/plain': new ErrorModel()
            }
          }
        ]
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      HttpMethod: 'GET',
      MethodResponses: [{
          StatusCode: "200"
        }, {
          StatusCode: "400",
          ResponseParameters: {
            'method.response.header.killerbees': false
          }
        }, {
          StatusCode: "500",
          ResponseParameters: {
            'method.response.header.errthing': true
          },
          ResponseModels: {
            'application/json': 'Empty',
            'text/plain': 'Error'
          }
        }
      ]
    }));

    test.done();
  },

  'multiple integration responses can be used'(test: Test) { // @see https://github.com/awslabs/aws-cdk/issues/1608
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { deploy: false });

    // WHEN
    api.root.addMethod('GET', new apigateway.AwsIntegration({
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
          }
        ],
      }
    }));

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
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
          }
        ],
        Type: 'AWS',
        Uri: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':apigateway:', { Ref: 'AWS::Region' }, ':foo-service:action/BarAction']]}
      }
    }));
    test.done();
  },

  'method is always set as uppercase'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'api');

    // WHEN
    api.root.addMethod('get');
    api.root.addMethod('PoSt');
    api.root.addMethod('PUT');

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', { HttpMethod: "POST" }));
    expect(stack).to(haveResource('AWS::ApiGateway::Method', { HttpMethod: "GET" }));
    expect(stack).to(haveResource('AWS::ApiGateway::Method', { HttpMethod: "PUT" }));
    test.done();
  }
};
