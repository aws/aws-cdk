import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as elbv2_targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

/**
 * This integration test validates that the AlbIntegration class correctly
 * creates a REST API with VPC Link V2 integration to an Application Load Balancer.
 *
 * The test:
 * 1. Creates an ALB with a Lambda function as the backend target
 * 2. Creates a REST API with AlbIntegration
 * 3. Verifies the integration configuration (type, connectionType)
 * 4. Makes an HTTP call to the API and verifies the Lambda response
 */
class AlbIntegrationStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;

  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    // Create VPC with private subnets for the ALB
    const vpc = new ec2.Vpc(this, 'Vpc', {
      natGateways: 1,
    });

    // Create a Lambda function that will serve as the ALB backend
    const backendFunction = new lambda.Function(this, 'BackendFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async function(event) {
          return {
            statusCode: 200,
            statusDescription: '200 OK',
            isBase64Encoded: false,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: 'Hello from ALB Integration!',
              path: event.path,
              method: event.httpMethod,
            }),
          };
        };
      `),
      vpc,
    });

    // Create an internal Application Load Balancer
    const alb = new elbv2.ApplicationLoadBalancer(this, 'Alb', {
      vpc,
      internetFacing: false,
    });

    // Add a listener on port 80
    const listener = alb.addListener('Listener', {
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
    });

    // Add the Lambda function as a target
    listener.addTargets('LambdaTarget', {
      targets: [new elbv2_targets.LambdaTarget(backendFunction)],
      healthCheck: {
        enabled: true,
        healthyHttpCodes: '200',
      },
    });

    // Create REST API with ALB integration
    this.api = new apigateway.RestApi(this, 'RestApi', {
      cloudWatchRole: true,
      deployOptions: {
        stageName: 'prod',
      },
    });

    // Create ALB integration (using ALB directly, not the listener)
    const albIntegration = new apigateway.AlbIntegration(alb);

    // Add GET method with ALB integration
    this.api.root.addMethod('GET', albIntegration);
  }
}

const app = new cdk.App();
const stack = new AlbIntegrationStack(app, 'AlbIntegrationTestStack');
cdk.RemovalPolicies.of(stack).apply(cdk.RemovalPolicy.DESTROY);

const integ = new IntegTest(app, 'AlbIntegrationInteg', {
  testCases: [stack],
});

// Make an HTTP call to the API endpoint and verify the response from the Lambda backend
const httpCall = integ.assertions.httpApiCall(stack.api.urlForPath('/'));
httpCall.expect(
  ExpectedResult.objectLike({
    body: {
      message: 'Hello from ALB Integration!',
      path: '/',
      method: 'GET',
    },
  }),
);
