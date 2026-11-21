import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-alb-fg-cloudfront');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

// A distribution with a placeholder default behavior. The service below adds
// its load balancer as an origin with a /* cache behavior, so the service is
// served through CloudFront and the placeholder origin never receives traffic.
const distribution = new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: { origin: new origins.HttpOrigin('example.com') },
});

// NOTE: the listener is left open (the pattern default) even though this load
// balancer is only meant to be reached through CloudFront. Closing it with
// openListener: false and allowing ingress only from CloudFront's origin-facing
// managed prefix list (com.amazonaws.global.cloudfront.origin-facing) would be
// tighter, but the prefix list id is only obtainable with
// ec2.PrefixList.fromLookup, a context lookup: the integ runner's deploy synth
// cannot resolve it without a committed, region-specific cdk.context.json
// (verified locally — even the repo's own integ.prefix-list-lookup test fails
// the same way on a forced run), and this repo commits no cdk.context.json
// anywhere, since CI deploys integ tests across many regions and a single
// region's context file would not help there. The test stack is deployed,
// asserted against and destroyed by the runner, so the open listener only
// exists for the duration of the test.
new ApplicationLoadBalancedFargateService(stack, 'CloudFrontService', {
  cluster,
  memoryLimitMiB: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  cloudFrontDistribution: distribution,
});

const integTest = new integ.IntegTest(app, 'Integ', {
  testCases: [stack],
});

// The sample app answers on / with a page only it returns, so a 200 carrying
// that text through the distribution proves traffic reaches the service
// through CloudFront — a 200 from the example.com placeholder origin behind
// the default behavior would not contain it.
integTest.assertions.httpApiCall(`https://${distribution.distributionDomainName}/`)
  .expect(integ.ExpectedResult.objectLike({
    status: 200,
    body: integ.Match.stringLikeRegexp('Your PHP application is now running on a container in Amazon ECS'),
  }));
