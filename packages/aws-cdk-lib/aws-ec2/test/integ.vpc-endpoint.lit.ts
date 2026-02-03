import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import * as ec2 from '../lib';

const app = new cdk.App();

class VpcEndpointStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /// !show
    // Add gateway endpoints when creating the VPC
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      gatewayEndpoints: {
        S3: {
          service: ec2.GatewayVpcEndpointAwsService.S3,
        },
      },
    });

    // Alternatively gateway endpoints can be added on the VPC
    const dynamoDbEndpoint = vpc.addGatewayEndpoint('DynamoDbEndpoint', {
      service: ec2.GatewayVpcEndpointAwsService.DYNAMODB,
    });

    // This allows to customize the endpoint policy
    dynamoDbEndpoint.addToPolicy(
      new iam.PolicyStatement({ // Restrict to listing and describing tables
        principals: [new iam.AnyPrincipal()],
        actions: ['dynamodb:DescribeTable', 'dynamodb:ListTables'],
        resources: ['*'],
      }));

    // Add an interface endpoint
    vpc.addInterfaceEndpoint('EcrDockerEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER,

      // Uncomment the following to allow more fine-grained control over
      // who can access the endpoint via the '.connections' object.
      // open: false
    });
    /// !hide
  }
}

new VpcEndpointStack(app, 'aws-cdk-ec2-vpc-endpoint');
app.synth();
