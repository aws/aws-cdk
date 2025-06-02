import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'integ-cloudfront-vpc-origin');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
  natGateways: 1,
  // VPC origin requires an internet gateway in VPC
  subnetConfiguration: [
    {
      name: 'public',
      subnetType: ec2.SubnetType.PUBLIC,
    },
    {
      name: 'egress',
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    },
    {
      name: 'isolated',
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    },
  ],
});

const userData = ec2.UserData.forLinux();
userData.addCommands(
  'dnf install httpd -y',
  'systemctl start httpd',
  'mkdir -p /var/www/html/alb /var/www/html/nlb',
  'touch /var/www/html/index.html /var/www/html/alb/index.html /var/www/html/nlb/index.html',
);
const instance = new ec2.Instance(stack, 'Instance', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
  machineImage: ec2.MachineImage.latestAmazonLinux2023(),
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
  userData,
});

const albTg = new elbv2.ApplicationTargetGroup(stack, 'ALB-TG', {
  vpc,
  protocol: elbv2.ApplicationProtocol.HTTP,
  deregistrationDelay: cdk.Duration.seconds(0),
});
const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', {
  vpc,
  internetFacing: false,
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
});
alb.addListener('HTTP', {
  protocol: elbv2.ApplicationProtocol.HTTP,
  defaultTargetGroups: [albTg],
  open: false,
});
albTg.addTarget(new targets.InstanceTarget(instance));
instance.connections.allowFrom(alb, ec2.Port.HTTP);

const nlbSg = new ec2.SecurityGroup(stack, 'NLB-SG', { vpc });
const nlbTg = new elbv2.NetworkTargetGroup(stack, 'NLB-TG', {
  vpc,
  port: 80,
  deregistrationDelay: cdk.Duration.seconds(0),
});
const nlb = new elbv2.NetworkLoadBalancer(stack, 'NLB', {
  vpc,
  internetFacing: false,
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
  securityGroups: [nlbSg],
});
nlb.addListener('HTTP', {
  port: 80,
  defaultTargetGroups: [nlbTg],
});
nlbTg.addTarget(new targets.InstanceTarget(instance));
instance.connections.allowFrom(nlbSg, ec2.Port.HTTP);

const distribution = new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin: origins.VpcOrigin.withEc2Instance(instance, {
      protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
    }),
    cachePolicy: cloudfront.CachePolicy.USE_ORIGIN_CACHE_CONTROL_HEADERS,
    originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
  },
  additionalBehaviors: {
    '/alb/*': {
      origin: origins.VpcOrigin.withApplicationLoadBalancer(alb, {
        protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
      }),
      cachePolicy: cloudfront.CachePolicy.USE_ORIGIN_CACHE_CONTROL_HEADERS,
      originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
    },
    '/nlb/*': {
      origin: origins.VpcOrigin.withNetworkLoadBalancer(nlb, {
        protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
      }),
      cachePolicy: cloudfront.CachePolicy.USE_ORIGIN_CACHE_CONTROL_HEADERS,
      originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
    },
  },
});

const getSg = new cr.AwsCustomResource(stack, 'GetSecurityGroup', {
  onCreate: {
    service: 'ec2',
    action: 'describeSecurityGroups',
    parameters: {
      Filters: [
        { Name: 'vpc-id', Values: [vpc.vpcId] },
        { Name: 'group-name', Values: ['CloudFront-VPCOrigins-Service-SG'] },
      ],
    },
    physicalResourceId: cr.PhysicalResourceId.of('CloudFront-VPCOrigins-Service-SG'),
  },
  policy: cr.AwsCustomResourcePolicy.fromSdkCalls({ resources: ['*'] }),
});
getSg.node.addDependency(distribution);
const sgVpcOrigins = ec2.SecurityGroup.fromSecurityGroupId(
  stack,
  'VpcOriginsSecurityGroup',
  getSg.getResponseField('SecurityGroups.0.GroupId'),
);

instance.connections.allowFrom(sgVpcOrigins, ec2.Port.HTTP);
alb.connections.allowFrom(sgVpcOrigins, ec2.Port.HTTP);
nlb.connections.allowFrom(sgVpcOrigins, ec2.Port.HTTP);

const integ = new IntegTest(stack, 'cloudfront-vpc-origin-test', {
  testCases: [stack],
});

const instanceCall = integ.assertions.httpApiCall(`https://${distribution.distributionDomainName}/index.html`);
instanceCall.expect(ExpectedResult.objectLike({ status: 200 }));

const albCall = integ.assertions.httpApiCall(`https://${distribution.distributionDomainName}/alb/index.html`);
albCall.expect(ExpectedResult.objectLike({ status: 200 }));

const nlbCall = integ.assertions.httpApiCall(`https://${distribution.distributionDomainName}/nlb/index.html`);
nlbCall.expect(ExpectedResult.objectLike({ status: 200 }));
