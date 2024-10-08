import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cdk from "aws-cdk-lib";
import { ExpectedResult, IntegTest } from "@aws-cdk/integ-tests-alpha";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

class TestStack extends cdk.Stack {
  public testFunction: lambda.IFunction;
  public api: apigateway.RestApi;

  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, "Vpc", {
      restrictDefaultSecurityGroup: false,
      natGateways: 0,
    });

    const vpcEndpoint = vpc.addInterfaceEndpoint("VpcEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.APIGATEWAY,
      privateDnsEnabled: true,
    });

    this.api = new apigateway.RestApi(this, "Api", {
      cloudWatchRole: true,
      endpointConfiguration: {
        types: [apigateway.EndpointType.PRIVATE],
        vpcEndpoints: [vpcEndpoint],
      },
    });
    this.api.root.addMethod(
      "GET",
      new apigateway.MockIntegration({
        requestTemplates: {
          "application/json": JSON.stringify({
            statusCode: 200,
          }),
        },
        integrationResponses: [
          {
            statusCode: "200",
            responseTemplates: {
              "application/json": JSON.stringify({ message: "OK" }),
            },
          },
        ],
      }),
      {
        methodResponses: [
          {
            statusCode: "200",
          },
        ],
      }
    );
    this.api.grantInvoke(vpcEndpoint);

    this.testFunction = new lambda.Function(this, "TestFunction", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromInline(`
        const https = require('https');

        const httpsGet = (url) => {
          return new Promise((resolve, reject) => {
            https.get(url, (res) => {
              let data = '';

              res.on('data', (chunk) => {
                data += chunk;
              });

              res.on('end', () => {
                resolve(data);
              });

              res.on('error', (e) => {
                reject(e);
              });
            });
          });
        };

        exports.handler = async function(event) {
          const apiEndpoint = process.env.API_ENDPOINT;

          try {
            const data = await httpsGet(apiEndpoint);
            return {
              statusCode: 200,
              body: JSON.stringify({ message: 'Success', data }),
            };
          } catch (error) {
            return {
              statusCode: 500,
              body: JSON.stringify({ message: 'Error', error: error.message }),
            };
          }
        };
      `),
      vpc,
      environment: {
        API_ENDPOINT: this.api.url,
      },
    });
    this.testFunction.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["execute-api:Invoke"],
        resources: [this.api.arnForExecuteApi()],
      })
    );
    this.testFunction.connections.allowTo(vpcEndpoint, ec2.Port.tcp(443));
  }
}

const app = new cdk.App();

const testCase = new TestStack(app, "ApiGatewayVpcEndpointTestStack");
const integ = new IntegTest(app, "ApiGatewayVpcEndpointInteg", {
  testCases: [testCase],
});

const assertion = integ.assertions.awsApiCall("Lambda", "invoke", {
  FunctionName: testCase.testFunction.functionName,
  InvocationType: "RequestResponse",
});
assertion.provider.addToRolePolicy({
  Effect: "Allow",
  Action: ["lambda:InvokeFunction"],
  Resource: [testCase.testFunction.functionArn],
});
assertion.expect(
  ExpectedResult.objectLike({
    StatusCode: 200,
    Payload: "{\"statusCode\":200,\"body\":\"{\\\"message\\\":\\\"Success\\\",\\\"data\\\":\\\"{\\\\\\\"message\\\\\\\":\\\\\\\"OK\\\\\\\"}\\\"}\"}",
  })
);
