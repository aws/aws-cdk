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
import { PolicyEngine, PolicyEnforcementMode, PolicyStatement } from 'aws-cdk-lib/aws-bedrockagentcore';

/**
 * Integration test for the Policy enforcement mode and the `policy` definition member.
 *
 * Creates one policy from Cedar in LOG_ONLY, and one policy in the `policy` member
 * through `PolicyStatement.fromPolicy()`, also in LOG_ONLY. The assertions read both
 * policies back from the service.
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'PolicyEnforcementModeIntegTestStack');

const policyEngine = new PolicyEngine(stack, 'TestPolicyEngine');

const logOnlyPolicy = policyEngine.addPolicy('LogOnlyPolicy', {
  statement: PolicyStatement.fromCedar([
    'permit(',
    '  principal == AgentCore::IamEntity::"arn:aws:iam::123456789012:role/TestAgentRole",',
    '  action,',
    '  resource is AgentCore::Gateway',
    ');',
  ].join('\n')),
  enforcementMode: PolicyEnforcementMode.LOG_ONLY,
});

// A guardrail condition is validated against the output schema of a Gateway tool, so
// this stack, which has no Gateway, uses a plain statement in the `policy` member.
const policyMemberPolicy = policyEngine.addPolicy('PolicyMemberPolicy', {
  statement: PolicyStatement.fromPolicy([
    'forbid(',
    '  principal == AgentCore::IamEntity::"arn:aws:iam::123456789012:role/TestAgentRole",',
    '  action,',
    '  resource is AgentCore::Gateway',
    ');',
  ].join('\n')),
  enforcementMode: PolicyEnforcementMode.LOG_ONLY,
});

const integTest = new integ.IntegTest(app, 'PolicyEnforcementModeIntegTest', {
  testCases: [stack],
  regions: ['us-east-1'],
});

// Read both policies back, so a dropped enforcement mode or a statement written to
// the wrong definition member fails the test instead of passing unnoticed.
const logOnlyCall = integTest.assertions.awsApiCall('bedrock-agentcore-control', 'getPolicy', {
  policyEngineId: policyEngine.policyEngineId,
  policyId: logOnlyPolicy.policyId,
}).expect(integ.ExpectedResult.objectLike({
  enforcementMode: 'LOG_ONLY',
  status: 'ACTIVE',
}));

const policyMemberCall = integTest.assertions.awsApiCall('bedrock-agentcore-control', 'getPolicy', {
  policyEngineId: policyEngine.policyEngineId,
  policyId: policyMemberPolicy.policyId,
}).expect(integ.ExpectedResult.objectLike({
  enforcementMode: 'LOG_ONLY',
  status: 'ACTIVE',
  definition: { policy: { statement: integ.Match.stringLikeRegexp('forbid') } },
}));

// The IAM action prefix (bedrock-agentcore) differs from the SDK client name
// (bedrock-agentcore-control), so grant the assertion provider explicitly.
for (const call of [logOnlyCall, policyMemberCall]) {
  call.provider.addToRolePolicy({
    Effect: 'Allow',
    Action: ['bedrock-agentcore:GetPolicy'],
    Resource: ['*'],
  });
}
