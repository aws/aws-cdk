import * as cdk from 'aws-cdk-lib/core';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as integ from '@aws-cdk/integ-tests-alpha';
import {
  NetworkConnector,
  NetworkConnectorComputeType,
  NetworkConnectorConfiguration,
  NetworkConnectorElasticIpType,
} from 'aws-cdk-lib/aws-lambda';

const app = new cdk.App({ analyticsReporting: false });
const stack = new cdk.Stack(app, 'NetworkConnectorElasticIpStack');

// Public subnets only: the connector's Elastic IP addresses carry internet traffic only in
// subnets that route 0.0.0.0/0 to an internet gateway, so this test needs no NAT gateway.
const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 2,
  natGateways: 0,
  subnetConfiguration: [
    { name: 'public', subnetType: ec2.SubnetType.PUBLIC },
  ],
});

const securityGroup = new ec2.SecurityGroup(stack, 'ConnectorSecurityGroup', {
  vpc,
  allowAllOutbound: true,
});

// No vpcSubnets: the VPC only has public subnets, so its default selection is them. No
// operatorRole is passed, so the construct creates one and adds the Elastic IP permissions to
// it. A fixed name lets the assertion find the connector's addresses by their name tag.
const connector = new NetworkConnector(stack, 'Connector', {
  networkConnectorName: 'integ-eip-connector',
  configuration: NetworkConnectorConfiguration.vpcEgress({
    computeType: NetworkConnectorComputeType.WEB_FUNCTION,
    vpc,
    securityGroups: [securityGroup],
    elasticIpConfiguration: { type: NetworkConnectorElasticIpType.SERVICE_MANAGED },
  }),
});

new cdk.CfnOutput(stack, 'ConnectorArn', { value: connector.networkConnectorArn });

const test = new integ.IntegTest(app, 'NetworkConnectorElasticIpTest', {
  testCases: [stack],
  diffAssets: false,
});

// One service-managed Elastic IP address per connector network interface (two subnets), each
// associated with an interface. The addresses exist only if the operator role can allocate them,
// and carry an association only if it can associate them, so this covers both Elastic IP
// permissions. Uses EC2 rather than GetNetworkConnector, whose SDK client may not be in the
// assertion handler's runtime yet.
test.assertions.awsApiCall('EC2', 'describeAddresses', {
  Filters: [{ Name: 'tag:aws:lambda:networkConnectorName', Values: ['integ-eip-connector'] }],
}).expect(integ.ExpectedResult.objectLike({
  Addresses: [
    integ.Match.objectLike({
      ServiceManaged: 'lambda-network-connector',
      AssociationId: integ.Match.stringLikeRegexp('^eipassoc-'),
      NetworkInterfaceId: integ.Match.stringLikeRegexp('^eni-'),
    }),
    integ.Match.objectLike({
      ServiceManaged: 'lambda-network-connector',
      AssociationId: integ.Match.stringLikeRegexp('^eipassoc-'),
      NetworkInterfaceId: integ.Match.stringLikeRegexp('^eni-'),
    }),
  ],
})).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(10),
  interval: cdk.Duration.seconds(30),
});
