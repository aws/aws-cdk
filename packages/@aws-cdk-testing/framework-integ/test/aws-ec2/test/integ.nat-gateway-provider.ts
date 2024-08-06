import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class NatGatewayStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Explicitly declare the NAT provider, so we can later reference the created gateways
    const natGatewayProvider = new ec2.NatGatewayProvider();

    const vpc = new ec2.Vpc(this, 'MyVpc', {
      natGatewayProvider,
      natGateways: 1,
    });

    // Change one of the created public subnets to have a route to the NAT Gateway
    new ec2.CfnRoute(this, 'NewRoute', {
      routeTableId: vpc.publicSubnets[0].routeTable.routeTableId,
      destinationCidrBlock: '1.2.3.4/32',
      natGatewayId: natGatewayProvider.configuredGateways.find(x => (x.az === vpc.publicSubnets[0].availabilityZone))!.gatewayId,
    });

    Array.isArray(natGatewayProvider.configuredGateways);
  }
}

const app = new cdk.App();
const testCase = new NatGatewayStack(app, 'aws-cdk-vpc-nat-gateway-provider');

new IntegTest(app, 'integ-test', {
  testCases: [testCase],
});
