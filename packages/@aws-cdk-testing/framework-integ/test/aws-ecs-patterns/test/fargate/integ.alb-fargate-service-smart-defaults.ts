/**
 * Integration test for the conditional openListener behavior in ApplicationLoadBalancedFargateService.
 *
 * This test validates the security feature that automatically sets openListener to false when custom
 * security groups are detected on the load balancer, preventing unintended internet exposure.
 *
 * Test scenarios:
 * 1. DefaultService: No custom security groups provided
 *    - Expected: openListener defaults to true, creates 0.0.0.0/0 ingress rules
 *    - Validates: Default behavior when CDK manages all security groups
 *
 * 2. ExplicitOpenService: Explicit openListener: true
 *    - Expected: Creates 0.0.0.0/0 ingress rules regardless of other settings
 *    - Validates: Explicit override functionality works correctly
 *
 * 3. ExplicitClosedService: Explicit openListener: false
 *    - Expected: Does NOT create 0.0.0.0/0 ingress rules
 *    - Validates: Explicit closed listener prevents internet access
 *
 * 4. ConditionalWithCustomSG: Custom security groups + no explicit openListener
 *    - Expected: Conditional behavior kicks in, openListener defaults to false
 *    - Validates: Core feature - prevents 0.0.0.0/0 rules when custom SGs detected
 *
 * The test uses AWS SDK calls to verify actual security group configurations in deployed resources,
 * ensuring the feature works correctly in real AWS environments.
 */

import { Vpc, SecurityGroup, Port } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { App, Stack, Duration } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';

const app = new App({
  postCliContext: {
    // Enable the feature flag for this test
    '@aws-cdk/aws-ecs-patterns:secGroupsDisablesImplicitOpenListener': true,
  },
});

const stack = new Stack(app, 'aws-ecs-integ-alb-fg-smart-defaults');
const vpc = new Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1, restrictDefaultSecurityGroup: false });
const cluster = new Cluster(stack, 'Cluster', { vpc });

// Test case 1: Service with conditional default (no openListener specified)
// CDK creates load balancer, should default to openListener: true (no custom security groups)
new ApplicationLoadBalancedFargateService(stack, 'SmartDefaultService', {
  cluster,
  memoryLimitMiB: 512,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  // No openListener specified - should default to true since no custom security groups
});

// Test case 2: Service with explicit openListener: true
new ApplicationLoadBalancedFargateService(stack, 'ExplicitOpenService', {
  cluster,
  memoryLimitMiB: 512,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  openListener: true, // Should create 0.0.0.0/0 rules
  listenerPort: 8080,
});

// Test case 3: Service with explicit openListener: false
new ApplicationLoadBalancedFargateService(stack, 'ExplicitClosedService', {
  cluster,
  memoryLimitMiB: 512,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  openListener: false, // Should NOT create 0.0.0.0/0 rules
  listenerPort: 9090,
});

// Test case 4: Service with custom security groups (conditional default should apply)
const customSecurityGroup = new SecurityGroup(stack, 'CustomSecurityGroup', {
  vpc,
  description: 'Custom security group for load balancer',
});

// Add a custom rule to the security group
customSecurityGroup.addIngressRule(
  customSecurityGroup,
  Port.tcp(80),
  'Allow HTTP from custom security group',
);

const customLoadBalancer = new ApplicationLoadBalancer(stack, 'CustomLoadBalancer', {
  vpc,
  internetFacing: true,
  securityGroup: customSecurityGroup,
});

// This should use conditional default (openListener: false) because custom security groups are detected
new ApplicationLoadBalancedFargateService(stack, 'SmartDefaultWithCustomSG', {
  cluster,
  memoryLimitMiB: 512,
  taskImageOptions: {
    image: ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  loadBalancer: customLoadBalancer,
  // No openListener specified - should default to false due to custom security groups
});

const integTest = new integ.IntegTest(app, 'albFargateServiceSmartDefaultsTest', {
  testCases: [stack],
});

// Validate the core conditional behavior by checking the custom security group
// This confirms that when custom security groups are provided, the conditional default prevents
// creating overly permissive 0.0.0.0/0 ingress rules
// Assert that the custom security group only contains self-referencing rules (no 0.0.0.0/0)
// This validates the feature prevents unintended internet exposure
integTest.assertions.awsApiCall('EC2', 'describeSecurityGroups', {
  GroupIds: [customSecurityGroup.securityGroupId],
}).expect(integ.ExpectedResult.objectLike({
  SecurityGroups: [
    {
      IpPermissions: integ.Match.arrayWith([
        integ.Match.objectLike({
          FromPort: 80,
          ToPort: 80,
          // Verify only security group references exist, no public internet access (0.0.0.0/0)
          UserIdGroupPairs: integ.Match.arrayWith([
            integ.Match.objectLike({
              GroupId: customSecurityGroup.securityGroupId,
            }),
          ]),
          // Ensure no IpRanges with 0.0.0.0/0 are present
          IpRanges: [],
        }),
      ]),
    },
  ],
})).waitForAssertions({
  totalTimeout: Duration.minutes(5),
});

app.synth();
