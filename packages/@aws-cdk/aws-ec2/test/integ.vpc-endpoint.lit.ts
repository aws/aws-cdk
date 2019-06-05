import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import ec2 = require('../lib');

const app = new cdk.App();

class VpcEndpointStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /// !show
    // Add gateway endpoints when creating the VPC
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      gatewayEndpoints: {
        S3: {
          service: ec2.GatewayVpcEndpointAwsService.S3
        }
      }
    });

    // Alternatively gateway endpoints can be added on the VPC
    const dynamoDbEndpoint = vpc.addGatewayEndpoint('DynamoDbEndpoint', {
      service: ec2.GatewayVpcEndpointAwsService.DynamoDb
    });

    // This allows to customize the endpoint policy
    dynamoDbEndpoint.addToPolicy(
      new iam.PolicyStatement() // Restrict to listing and describing tables
        .addAnyPrincipal()
        .addActions('dynamodb:DescribeTable', 'dynamodb:ListTables')
        .addAllResources()
    );

    // Add an interface endpoint
    const ecrDockerEndpoint = vpc.addInterfaceEndpoint('EcrDockerEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.EcrDocker
    });

    // When working with an interface endpoint, use the connections object to
    // allow traffic to flow to the endpoint.
    ecrDockerEndpoint.connections.allowDefaultPortFromAnyIpv4();
    /// !hide
  }
}

new VpcEndpointStack(app, 'aws-cdk-ec2-vpc-endpoint');
app.synth();
