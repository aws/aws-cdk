import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

/*
 * Stack verification steps:
 * * curl https://<api-id>-<vpce-id>.execute-api.us-east-1.amazonaws.com/prod/
 * The above command must be executed in the vpc
 */
class Test extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'MyVpc', { restrictDefaultSecurityGroup: false });

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
