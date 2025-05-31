import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PublicHostedZone, VpcEndpointServiceDomainName } from 'aws-cdk-lib/aws-route53';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';

/**
 * A load balancer that can host a VPC Endpoint Service.
 *
 * Why do this instead of using the NetworkLoadBalancer construct? aws-route53
 * cannot depend on aws-elasticloadbalancingv2 because aws-elasticloadbalancingv2
 * already takes a dependency on aws-route53.
 */
class DummyEndpointLoadBalancer implements ec2.IVpcEndpointServiceLoadBalancer {
  /**
   * The ARN of the load balancer that hosts the VPC Endpoint Service
   */
  public readonly loadBalancerArn: string;
  constructor(scope: Construct, id: string, vpc: ec2.Vpc) {
    const lb = new cdk.CfnResource(scope, id, {
      type: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
      properties: {
        Type: 'network',
        Name: 'mylb',
        Scheme: 'internal',
        Subnets: [vpc.privateSubnets[0].subnetId],
      },
    });
    this.loadBalancerArn = lb.ref;
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'aws-cdk-vpc-endpoint-dns-integ');
const vpc = new ec2.Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false });
const nlb = new DummyEndpointLoadBalancer(stack, 'mylb', vpc);
const vpces = new ec2.VpcEndpointService(stack, 'VPCES', {
  vpcEndpointServiceLoadBalancers: [nlb],
});
const zone = new PublicHostedZone(stack, 'PHZ', {
  zoneName: 'aws-cdk.dev',
});
const endpointDomain = new VpcEndpointServiceDomainName(stack, 'EndpointDomain', {
  endpointService: vpces,
  domainName: 'my-stuff.aws-cdk.dev',
  publicHostedZone: zone,
});

const integTest = new IntegTest(app, 'AwsCdkVpcEndpointDnsIntegTest', {
  testCases: [stack],
  diffAssets: true,
});
const endpointServices = integTest.assertions.awsApiCall('EC2', 'describeVpcEndpointServices', {
  ServiceNames: [vpces.vpcEndpointServiceName],
});
endpointServices.expect(ExpectedResult.objectLike({
  ServiceDetails: Match.arrayWith([
    Match.objectLike({
      PrivateDnsName: endpointDomain.domainName,
    }),
  ]),
}));

app.synth();
