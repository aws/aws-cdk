import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

class TestStack extends cdk.Stack {
  public testFunctions: lambda.IFunction[];
  public api: apigateway.RestApi;

  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const vpc1 = new ec2.Vpc(this, 'Vpc1', {
      restrictDefaultSecurityGroup: false,
      natGateways: 0,
    });
    const vpcEndpoint1 = vpc1.addInterfaceEndpoint('VpcEndpoint1', {
      service: ec2.InterfaceVpcEndpointAwsService.APIGATEWAY,
      privateDnsEnabled: true,
    });
    const vpc2 = new ec2.Vpc(this, 'Vpc2', {
      restrictDefaultSecurityGroup: false,
      natGateways: 0,
    });
    const vpcEndpoint2 = vpc2.addInterfaceEndpoint('VpcEndpoint2', {
      service: ec2.InterfaceVpcEndpointAwsService.APIGATEWAY,
      privateDnsEnabled: true,
    });

    this.api = new apigateway.RestApi(this, 'Api', {
      cloudWatchRole: true,
      endpointConfiguration: {
        types: [apigateway.EndpointType.PRIVATE],
        vpcEndpoints: [vpcEndpoint1, vpcEndpoint2],
      },
    });
    this.api.root.addMethod(
      'GET',
      new apigateway.MockIntegration({
        requestTemplates: {
          'application/json': JSON.stringify({
            statusCode: 200,
          }),
        },
        integrationResponses: [
          {
            statusCode: '200',
            responseTemplates: {
              'application/json': JSON.stringify({ message: 'OK' }),
            },
          },
        ],
      }),
      {
        methodResponses: [
          {
            statusCode: '200',
          },
        ],
      },
    );
    this.api.grantInvokeFromVpcEndpointsOnly([vpcEndpoint1, vpcEndpoint2]);

    this.testFunctions = [{ endpoint: vpcEndpoint1, vpc: vpc1 }, { endpoint: vpcEndpoint2, vpc: vpc2 }].map((config, index) => {
      const testFunction = new lambda.Function(this, `TestFunction${index}`, {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'index.handler',
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
        vpc: config.vpc,
        environment: {
          API_ENDPOINT: this.api.url,
        },
      });
      testFunction.addToRolePolicy(
        new iam.PolicyStatement({
          actions: ['execute-api:Invoke'],
          resources: [this.api.arnForExecuteApi()],
        }),
      );
      testFunction.connections.allowTo(config.endpoint, ec2.Port.tcp(443));
      return testFunction;
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

const testCase = new TestStack(app, 'ApiGatewayVpcEndpointTestStack');
const integ = new IntegTest(app, 'ApiGatewayVpcEndpointInteg', {
  testCases: [testCase],
});

testCase.testFunctions.forEach((testFunction) => {
  const assertion = integ.assertions.awsApiCall('Lambda', 'invoke', {
    FunctionName: testFunction.functionName,
    InvocationType: 'RequestResponse',
  });
  assertion.provider.addToRolePolicy({
    Effect: 'Allow',
    Action: ['lambda:InvokeFunction'],
    Resource: [testFunction.functionArn],
  });
  assertion.expect(
    ExpectedResult.objectLike({
      StatusCode: 200,
      Payload: JSON.stringify({
        statusCode: 200,
        body: JSON.stringify({
          message: 'Success',
          data: JSON.stringify({
            message: 'OK',
          }),
        }),
      }),
    }),
  );
});
