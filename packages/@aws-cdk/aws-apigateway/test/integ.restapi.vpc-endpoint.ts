import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as apigateway from '../lib';

/*
 * Stack verification steps:
 * * curl https://<api-id>-<vpce-id>.execute-api.us-east-1.amazonaws.com/prod/
 * The above command must be executed in the vpc
 */
class Test extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'MyVpc', {});

    const vpcEndpoint = vpc.addInterfaceEndpoint('MyVpcEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.APIGATEWAY,
    });

    const api = new apigateway.RestApi(this, 'MyApi', {
      cloudWatchRole: true,
      endpointConfiguration: {
        types: [apigateway.EndpointType.PRIVATE],
        vpcEndpoints: [vpcEndpoint],
      },
      policy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            principals: [new iam.AnyPrincipal()],
            actions: ['execute-api:Invoke'],
            effect: iam.Effect.ALLOW,
          }),
        ],
      }),
    });
    api.root.addMethod('GET');
  }
}

const app = new cdk.App();

const testCase = new Test(app, 'test-apigateway-vpcendpoint');
new IntegTest(app, 'apigateway-vpcendpoint', {
  testCases: [testCase],
});

app.synth();
