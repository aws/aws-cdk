import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import ec2 = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-vpc-endpoint');

/// !show
const vpc = new ec2.VpcNetwork(stack, 'MyVpc', {
  gatewayEndpoints: {
    S3: {
      service: ec2.VpcEndpointAwsService.S3
    }
  }
});

const dynamoDbEndpoint = vpc.addGatewayEndpoint('DynamoDbEndpoint', {
  service: ec2.VpcEndpointAwsService.DynamoDb
});

// Restrict to listing and describing tables
dynamoDbEndpoint.addToPolicy(
  new iam.PolicyStatement()
    .addAnyPrincipal()
    .addActions('dynamodb:DescribeTable', 'dynamodb:ListTables')
    .addAllResources()
);

const ecrDockerEndpoint = vpc.addInterfaceEndpoint('EcrDockerEndpoint', {
  service: ec2.VpcEndpointAwsService.EcrDocker
});

ecrDockerEndpoint.connections.allowFromAnyIPv4(new ec2.TcpPort(443));
/// !hide

app.run();
