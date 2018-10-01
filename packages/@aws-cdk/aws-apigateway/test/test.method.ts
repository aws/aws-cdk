import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import apigateway = require('../lib');

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
      Type: "AWS::ApiGateway::Method",
      Properties: {
        ApiKeyRequired: true,
        OperationName: "MyOperation"
      }
    }, ResourcePart.CompleteDefinition));

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
      Type: "AWS::ApiGateway::Method",
      Properties: {
        Integration: {
          IntegrationHttpMethod: "POST",
          Type: "AWS",
          Uri: {
            "Fn::Join": [
            "",
            [
              "arn", ":", { Ref: "AWS::Partition" }, ":", "apigateway", ":",
              { Ref: "AWS::Region" }, ":", "s3", ":", "path", "/", "bucket/key"
            ]
            ]
          }
        }
      }
    }, ResourcePart.CompleteDefinition));

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
    test.deepEqual(cdk.resolve(method.methodArn), {
      "Fn::Join": [
        "",
        [
        "arn",
        ":",
        { Ref: "AWS::Partition" },
        ":",
        "execute-api",
        ":",
        { Ref: "AWS::Region" },
        ":",
        { Ref: "AWS::AccountId" },
        ":",
        { Ref: "testapiD6451F70" },
        "/",
        { "Fn::Join": [ "", [ { Ref: "testapiDeploymentStageprod5C9E92A4" }, "/POST/" ] ] }
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
    test.deepEqual(cdk.resolve(method.testMethodArn), {
      "Fn::Join": [
        "",
        [
        "arn",
        ":",
        { Ref: "AWS::Partition" },
        ":",
        "execute-api",
        ":",
        { Ref: "AWS::Region" },
        ":",
        { Ref: "AWS::AccountId" },
        ":",
        { Ref: "testapiD6451F70" },
        "/",
        "test-invoke-stage/POST/"
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
      /There is no stage associated with this restApi. Either use `autoDeploy` or explicitly assign `deploymentStage`/);

    test.done();
  },

  'integration "credentialsRole" can be used to assume a role when calling backend'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { deploy: false });
    const role = new iam.Role(stack, 'MyRole', { assumedBy: new cdk.ServicePrincipal('foo') });

    // WHEN
    api.root.addMethod('GET', new apigateway.Integration({
      type: apigateway.IntegrationType.AwsProxy,
      options: {
        credentialsRole: role
      }
    }));

    // THEN
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
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
    expect(stack).to(haveResource('AWS::ApiGateway::Method', {
      Integration: {
        Credentials: { "Fn::Join": [ "", [ "arn", ":", { Ref: "AWS::Partition" }, ":", "iam", ":", "", ":", "*", ":", "user", "/", "*" ] ] }
      }
    }));
    test.done();
  },

  'integration "credentialsRole" and "credentialsPassthrough" are mutually exclusive'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const api = new apigateway.RestApi(stack, 'test-api', { deploy: false });
    const role = new iam.Role(stack, 'MyRole', { assumedBy: new cdk.ServicePrincipal('foo') });

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
};
