#!/usr/bin/env node

/**
 * Integration test for Application Load Balancer Listener Rule Auto-Priority Assignment
 * 
 * This test validates the automatic priority assignment behavior for ALB listener rules
 * when the priority property is omitted from the rule configuration.
 * 
 * Test Scenario:
 * 1. Creates an ALB with a default listener on port 80
 * 2. Adds a default target group that catches unmatched requests
 * 3. Creates multiple listener rules with different priority configurations:
 *    - AutoPriorityRule1: No priority specified → should auto-assign priority 1
 *    - ManualPriorityRule: Explicit priority 5 → should use priority 5
 *    - AutoPriorityRule2: No priority specified → should auto-assign priority 2
 * 
 * Expected Behavior:
 * - Rules without explicit priority should automatically receive the lowest available priority
 * - Auto-assigned priorities should not conflict with manually specified priorities
 * - The final priority assignment should be:
 *   * AutoPriorityRule1: priority 1 (first auto-assigned)
 *   * AutoPriorityRule2: priority 2 (second auto-assigned)
 *   * ManualPriorityRule: priority 5 (explicitly set)
 *   * Default action: priority 50000 (ALB default)
 * 
 * This ensures that CDK's auto-priority feature works correctly in mixed scenarios
 * where some rules have explicit priorities and others rely on auto-assignment.
 * 
 * Request Flow Diagram:
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                    Application Load Balancer                    │
 * │                         (Port 80)                               │
 * └─────────────────────────┬───────────────────────────────────────┘
 *                           │
 *                           ▼
 *                    ┌─────────────┐
 *                    │  Listener   │
 *                    │   Rules     │
 *                    │ (Priority)  │
 *                    └─────────────┘
 *                           │
 *           ┌───────────────┼───────────────┐
 *           │               │               │
 *           ▼               ▼               ▼
 *    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
 *    │/auto1/* → 1 │ │/auto2/* → 2 │ │/manual/* →5 │
 *    │(auto-assign)│ │(auto-assign)│ │ (explicit)  │
 *    └─────────────┘ └─────────────┘ └─────────────┘
 *           │               │               │
 *           ▼               ▼               ▼
 *    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
 *    │Target Group │ │Target Group │ │Target Group │
 *    │10.0.128.11  │ │10.0.128.13  │ │10.0.128.12  │
 *    └─────────────┘ └─────────────┘ └─────────────┘
 *                           │
 *                           ▼
 *                  ┌─────────────────┐
 *                  │ Default Action  │
 *                  │ (Priority 50000)│
 *                  │  10.0.128.10    │
 *                  └─────────────────┘
 */

import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elbv2-auto-priority-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
    restrictDefaultSecurityGroup: false,
    natGateways: 1,
    maxAzs: 3,
});

const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', {
    vpc,
    internetFacing: true,
});

const listener = lb.addListener('Listener', {
    port: 80,
});

// Default target group that catches all requests not matched by higher-priority rules
listener.addTargets('DefaultTarget', {
    port: 80,
    targets: [new targets.IpTarget('10.0.128.10')],
});

// Create the first target group for auto-priority testing
const autoPriorityGroup1 = new elbv2.ApplicationTargetGroup(stack, 'AutoPriorityGroup1', {
    vpc,
    port: 80,
    targets: [new targets.IpTarget('10.0.128.11')],
});

// Create the first listener rule without specifying priority
// This should automatically assign priority 1 (lowest available priority)
new elbv2.ApplicationListenerRule(stack, 'AutoPriorityRule1', {
    listener,
    // priority: intentionally omitted to test auto-assignment behavior
    conditions: [elbv2.ListenerCondition.pathPatterns(['/auto1/*'])],
    action: elbv2.ListenerAction.forward([autoPriorityGroup1]),
});

// Manual priority rule (priority 5)
const manualPriorityGroup = new elbv2.ApplicationTargetGroup(stack, 'ManualPriorityGroup', {
    vpc,
    port: 80,
    targets: [new targets.IpTarget('10.0.128.12')],
});

new elbv2.ApplicationListenerRule(stack, 'ManualPriorityRule', {
    listener,
    priority: 5,
    conditions: [elbv2.ListenerCondition.pathPatterns(['/manual/*'])],
    action: elbv2.ListenerAction.forward([manualPriorityGroup]),
});

// Another auto-priority rule (should get priority 2, the next lowest available priority)
const autoPriorityGroup2 = new elbv2.ApplicationTargetGroup(stack, 'AutoPriorityGroup2', {
    vpc,
    port: 80,
    targets: [new targets.IpTarget('10.0.128.13')],
});

new elbv2.ApplicationListenerRule(stack, 'AutoPriorityRule2', {
    listener,
    // priority: omitted - should auto-assign to 2 (next lowest available)
    conditions: [elbv2.ListenerCondition.pathPatterns(['/auto2/*'])],
    action: elbv2.ListenerAction.forward([autoPriorityGroup2]),
});

new IntegTest(app, 'alb-auto-priority-test', {
    testCases: [stack],
});

app.synth();
