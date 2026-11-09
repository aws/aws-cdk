/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Policy } from '../../../lib/policy/policy';
import { PolicyEngine } from '../../../lib/policy/policy-engine';

/**
 * Minimal integration test for the AgentCore Policy + PolicyEngine flow.
 *
 * Uses a Cedar policy that constrains the principal to a specific IAM entity
 * so the AgentCore service does not flag the policy as overly-permissive
 * during the create handler's stabilization phase. Validates the basic
 * Create/Read/Delete lifecycle of both constructs end to end.
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'PolicyMinimalIntegTestStack');

// Single PolicyEngine with all defaults (auto-generated name, AWS owned key).
const policyEngine = new PolicyEngine(stack, 'TestPolicyEngine');

// Single Policy with a constrained Cedar statement.
new Policy(stack, 'TestPolicy', {
  policyEngine,
  definition: [
    'permit(',
    '  principal == AgentCore::IamEntity::"arn:aws:iam::123456789012:role/TestAgentRole",',
    '  action,',
    '  resource is AgentCore::Gateway',
    ');',
  ].join('\n'),
});

new integ.IntegTest(app, 'PolicyMinimalIntegTest', {
  testCases: [stack],
  regions: ['us-east-1'],
});
