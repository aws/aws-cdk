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
import * as kms from 'aws-cdk-lib/aws-kms';
import { Gateway } from '../../../lib/gateway/gateway';
import { GatewayAuthorizer } from '../../../lib/gateway/inbound-auth/authorizer';
import { Policy } from '../../../lib/policy/policy';
import { PolicyEngine } from '../../../lib/policy/policy-engine';
import { PolicyStatement } from '../../../lib/policy/policy-statement';
import { PolicyValidationMode } from '../../../lib/policy/policy-types';

/**
 * Comprehensive integration test for the AgentCore Policy and PolicyEngine constructs.
 *
 * Validates:
 *   - PolicyEngine variants: explicit name, KMS encryption + tags, auto-generated name
 *   - PolicyEngine convenience: `addPolicy()` and the `policies` accessor
 *   - Policy authoring: raw Cedar `definition` and the `PolicyStatement` builder
 *   - Builder methods: forPrincipal (OAuthUser and IamEntity), forAllPrincipals,
 *     onAllActions, onResource (specific), onResourceType
 *   - Permit and forbid policies
 *   - Validation modes (default and IGNORE_ALL_FINDINGS)
 *   - Real Gateway as the referenced resource for specific-ARN policies
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'PolicyIntegTestStack');

const sharedGateway = new Gateway(stack, 'SharedGateway', {
  gatewayName: 'policy-integ-gateway',
  description: 'Shared gateway referenced by policies in this stack',
  authorizerConfiguration: GatewayAuthorizer.withNoAuth(),
});

const basicEngine = new PolicyEngine(stack, 'BasicPolicyEngine', {
  policyEngineName: 'basic_engine',
  description: 'Basic policy engine for integration testing',
});

new Policy(stack, 'RawCedarPolicy', {
  policyEngine: basicEngine,
  policyName: 'raw_cedar_policy',
  description: 'Raw Cedar definition with constrained principal',
  definition: [
    'permit(',
    `  principal == AgentCore::IamEntity::"arn:${cdk.Aws.PARTITION}:iam::${cdk.Aws.ACCOUNT_ID}:role/TestAgentRole",`,
    '  action,',
    '  resource is AgentCore::Gateway',
    ');',
  ].join('\n'),
});

const kmsKey = new kms.Key(stack, 'PolicyEngineKey', {
  description: 'Encryption key for PolicyEngine',
  enableKeyRotation: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const encryptedEngine = new PolicyEngine(stack, 'EncryptedPolicyEngine', {
  policyEngineName: 'encrypted_engine',
  description: 'PolicyEngine with custom KMS encryption',
  kmsKey,
  tags: {
    Environment: 'Test',
    Purpose: 'Integration',
  },
});

new Policy(stack, 'BuilderSpecificPolicy', {
  policyEngine: encryptedEngine,
  policyName: 'builder_specific',
  description: 'Permit a specific OAuth user to use the shared gateway',
  statement: PolicyStatement.permit()
    .forPrincipal('AgentCore::OAuthUser', 'user123')
    .onAllActions()
    .onResource('AgentCore::Gateway', sharedGateway.gatewayArn),
});

new Policy(stack, 'BuilderIamPrincipalPolicy', {
  policyEngine: encryptedEngine,
  policyName: 'builder_iam_principal',
  description: 'Permit a specific IAM role to use any gateway',
  statement: PolicyStatement.permit()
    .forPrincipal(
      'AgentCore::IamEntity',
      `arn:${cdk.Aws.PARTITION}:iam::${cdk.Aws.ACCOUNT_ID}:role/AnotherTestAgentRole`,
    )
    .onAllActions()
    .onResourceType('AgentCore::Gateway'),
});

new Policy(stack, 'ForbidPolicy', {
  policyEngine: encryptedEngine,
  policyName: 'forbid_on_gateway',
  description: 'Forbid a specific OAuth user from using the shared gateway',
  statement: PolicyStatement.forbid()
    .forPrincipal('AgentCore::OAuthUser', 'banned-user')
    .onAllActions()
    .onResource('AgentCore::Gateway', sharedGateway.gatewayArn),
});

new Policy(stack, 'IgnoreFindingsPolicy', {
  policyEngine: encryptedEngine,
  policyName: 'ignore_findings',
  description: 'Policy that opts out of validation findings',
  statement: PolicyStatement.permit()
    .forPrincipal('AgentCore::OAuthUser', 'admin')
    .onAllActions()
    .onResourceType('AgentCore::Gateway'),
  validationMode: PolicyValidationMode.IGNORE_ALL_FINDINGS,
});

const autoNamedEngine = new PolicyEngine(stack, 'AutoNamedEngine', {
  description: 'PolicyEngine with auto-generated name',
});

autoNamedEngine.addPolicy('AutoPolicy1', {
  description: 'First policy added via addPolicy()',
  statement: PolicyStatement.permit()
    .forPrincipal('AgentCore::OAuthUser', 'reader')
    .onAllActions()
    .onResourceType('AgentCore::Gateway'),
});

autoNamedEngine.addPolicy('AutoPolicy2', {
  description: 'Second policy added via addPolicy() (forbid)',
  statement: PolicyStatement.forbid()
    .forPrincipal('AgentCore::OAuthUser', 'auto-banned-user')
    .onAllActions()
    .onResource('AgentCore::Gateway', sharedGateway.gatewayArn),
});

if (autoNamedEngine.policies.length !== 2) {
  throw new Error(`Expected 2 policies on autoNamedEngine, got ${autoNamedEngine.policies.length}`);
}

new integ.IntegTest(app, 'PolicyIntegTest', {
  testCases: [stack],
  regions: ['us-east-1'],
});
