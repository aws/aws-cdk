import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

class EuscVpcEndpointStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

    const vpc = new ec2.Vpc(this, 'EuscVpc');

    // Test VPC endpoints for eusc-de-east-1 region services
    vpc.addInterfaceEndpoint('EcrDkrEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,
    });

    vpc.addInterfaceEndpoint('EcrApiEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.ECR,
    });

    vpc.addInterfaceEndpoint('ApiGatewayEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.APIGATEWAY,
    });

    vpc.addInterfaceEndpoint('SecurityHubEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.SECURITYHUB,
    });
  }
}

const app = new cdk.App();

const testCase = new EuscVpcEndpointStack(app, 'aws-cdk-ec2-vpc-endpoint-eusc', {
  env: { region: 'eusc-de-east-1' },
});

new IntegTest(app, 'vpc-endpoint-eusc', {
  testCases: [testCase],
});

app.synth();
