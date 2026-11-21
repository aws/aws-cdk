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

// The sample app answers on /, so a 200 through the distribution proves
// traffic reaches the service through CloudFront.
integTest.assertions.httpApiCall(`https://${distribution.distributionDomainName}/`)
  .expect(integ.ExpectedResult.objectLike({ status: 200 }));
