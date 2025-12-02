import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * Integration test for issue #35446: ECS service should automatically clean up
 * orphaned load balancer references when target groups are removed from CDK code.
 *
 * Test Scenario Diagram:
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                           BEFORE (Bug Condition)                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │  ECS Service                                                                │
 * │  ├── LoadBalancer[0]: Valid Target Group (port 80) ✓                       │
 * │  └── LoadBalancer[1]: Orphaned Target Group (port 8080) ✗                  │
 * │                       ^                                                     │
 * │                       └── This reference points to a removed target group  │
 * │                           that no longer exists in CDK code                │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                           AFTER (Fixed Condition)                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │  ECS Service                                                                │
 * │  └── LoadBalancer[0]: Valid Target Group (port 80) ✓                       │
 * │                                                                             │
 * │  Cleanup Logic Removes:                                                     │
 * │  ✗ Orphaned Target Group reference (port 8080)                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * This test reproduces the exact scenario:
 * 1. Create ECS service with ALB target group (legitimate reference)
 * 2. Manually inject orphaned target group reference (simulates bug condition)
 * 3. Verify cleanup logic removes orphaned reference during synthesis
 * 4. Assert only legitimate target group remains in CloudFormation template
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'OrphanedLoadBalancerCleanupStack');

// Create VPC and cluster
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

// Create task definition
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
taskDefinition.addContainer('Container', {
  image: ecs.ContainerImage.fromRegistry('nginx'),
  portMappings: [{ containerPort: 80 }],
});

// Create ECS service
const service = new ecs.FargateService(stack, 'Service', {
  cluster,
  taskDefinition,
});

// Create load balancer and target group
const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
const listener = lb.addListener('Listener', { port: 80 });

// Register service with target group
listener.addTargets('Targets', {
  port: 80,
  targets: [service],
});

// Simulate the scenario where user removes target group from CDK code
// by manually adding an orphaned reference (this simulates the bug condition)
// Our validation logic should clean this up during synthesis
(service as any).loadBalancers.push({
  targetGroupArn: 'arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/removed-target-group/1234567890123456',
  containerName: 'Container',
  containerPort: 8080,
});

// Synthesize the stack to trigger cleanup logic
const template = Template.fromStack(stack);

// Assert that only the valid target group is present (not the orphaned one)
template.hasResourceProperties('AWS::ECS::Service', {
  LoadBalancers: [
    {
      // Should only contain the legitimate target group, not the orphaned one
      TargetGroupArn: { Ref: Match.anyValue() }, // The real target group
      ContainerName: 'Container',
      ContainerPort: 80, // Not 8080 from the orphaned reference
    },
  ],
});

// Verify the orphaned target group ARN is NOT in the template
template.hasResourceProperties('AWS::ECS::Service', {
  LoadBalancers: Match.not(Match.arrayWith([
    Match.objectLike({
      TargetGroupArn: 'arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/removed-target-group/1234567890123456',
    }),
  ])),
});

new IntegTest(app, 'OrphanedLoadBalancerCleanupTest', {
  testCases: [stack],
});
