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
import { Gateway, GatewayAuthorizer, Policy, PolicyAction, PolicyEffect, PolicyEngine, PolicyEngineMode, PolicyPrincipal, PolicyResource, PolicyStatement, PolicyValidationMode } from 'aws-cdk-lib/aws-bedrockagentcore';
import * as kms from 'aws-cdk-lib/aws-kms';

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
  statement: new PolicyStatement({
    effect: PolicyEffect.PERMIT,
    principal: PolicyPrincipal.entity('AgentCore::OAuthUser', 'user123'),
    action: PolicyAction.any(),
    resource: PolicyResource.instance('AgentCore::Gateway', sharedGateway.gatewayArn),
  }),
});

new Policy(stack, 'BuilderIamPrincipalPolicy', {
  policyEngine: encryptedEngine,
  policyName: 'builder_iam_principal',
  description: 'Permit a specific IAM role to use any gateway',
  statement: new PolicyStatement({
    effect: PolicyEffect.PERMIT,
    principal: PolicyPrincipal.entity(
      'AgentCore::IamEntity',
      `arn:${cdk.Aws.PARTITION}:iam::${cdk.Aws.ACCOUNT_ID}:role/AnotherTestAgentRole`,
    ),
    action: PolicyAction.any(),
    resource: PolicyResource.anyOfType('AgentCore::Gateway'),
  }),
});

new Policy(stack, 'ForbidPolicy', {
  policyEngine: encryptedEngine,
  policyName: 'forbid_on_gateway',
  description: 'Forbid a specific OAuth user from using the shared gateway',
  statement: new PolicyStatement({
    effect: PolicyEffect.FORBID,
    principal: PolicyPrincipal.entity('AgentCore::OAuthUser', 'banned-user'),
    action: PolicyAction.any(),
    resource: PolicyResource.instance('AgentCore::Gateway', sharedGateway.gatewayArn),
  }),
});

new Policy(stack, 'IgnoreFindingsPolicy', {
  policyEngine: encryptedEngine,
  policyName: 'ignore_findings',
  description: 'Policy that opts out of validation findings',
  statement: new PolicyStatement({
    effect: PolicyEffect.PERMIT,
    principal: PolicyPrincipal.entity('AgentCore::OAuthUser', 'admin'),
    action: PolicyAction.any(),
    resource: PolicyResource.anyOfType('AgentCore::Gateway'),
  }),
  validationMode: PolicyValidationMode.IGNORE_ALL_FINDINGS,
});

// A specific OAuth user identified by a realistic Cognito-style subject id
// (`<region>:<uuid>`, which contains a colon and hyphens). This confirms the real
// AgentCore service accepts the string-literal encoding this module produces for a
// realistic principal id. Conditions (ipInRange/setContains/stringIn/stringEquals) are
// covered by the unit tests and the cedar-policy-cli parse+validate sweep; they are
// not exercised here because they need attributes the AgentCore Cedar schema does not
// define, which the service rejects regardless of validationMode.
new Policy(stack, 'BuilderRealisticUserPolicy', {
  policyEngine: encryptedEngine,
  policyName: 'builder_realistic_user',
  description: 'Permit a specific OAuth user (Cognito-style subject id) on the shared gateway',
  statement: new PolicyStatement({
    effect: PolicyEffect.PERMIT,
    principal: PolicyPrincipal.entity('AgentCore::OAuthUser', 'us-east-1:9f8e7d6c-5b4a-3210-fedc-ba9876543210'),
    action: PolicyAction.any(),
    resource: PolicyResource.instance('AgentCore::Gateway', sharedGateway.gatewayArn),
  }),
  validationMode: PolicyValidationMode.IGNORE_ALL_FINDINGS,
});

const autoNamedEngine = new PolicyEngine(stack, 'AutoNamedEngine', {
  description: 'PolicyEngine with auto-generated name',
});

autoNamedEngine.addPolicy('AutoPolicy1', {
  description: 'First policy added via addPolicy()',
  statement: new PolicyStatement({
    effect: PolicyEffect.PERMIT,
    principal: PolicyPrincipal.entity('AgentCore::OAuthUser', 'reader'),
    action: PolicyAction.any(),
    resource: PolicyResource.anyOfType('AgentCore::Gateway'),
  }),
});

autoNamedEngine.addPolicy('AutoPolicy2', {
  description: 'Second policy added via addPolicy() (forbid)',
  statement: new PolicyStatement({
    effect: PolicyEffect.FORBID,
    principal: PolicyPrincipal.entity('AgentCore::OAuthUser', 'auto-banned-user'),
    action: PolicyAction.any(),
    resource: PolicyResource.instance('AgentCore::Gateway', sharedGateway.gatewayArn),
  }),
});

if (autoNamedEngine.policies.length !== 2) {
  throw new Error(`Expected 2 policies on autoNamedEngine, got ${autoNamedEngine.policies.length}`);
}

// Gateway <-> PolicyEngine association. This is the path that auto-grants the gateway role
// evaluate permissions on the engine, and the grant scope depends on how the gateway name is
// known at synthesis, so all three name flavours are deployed:
//
//   1. auto-generated name  - a Lazy that resolves during synthesis, and mixed case, so it
//      proves both that the scope narrows to a single gateway and that lowercasing the name is
//      required for the ARN to match.
//   2. explicit mixed-case name - the caller-supplied equivalent of the same two questions.
//   3. name from a CfnParameter - a genuine deploy-time value that nothing at synthesis can
//      narrow, so the grant falls back to a wildcard. Deploying it proves the fallback path is
//      still usable rather than merely synthesizable.
//
// All three deploy against the same engine. BedrockAgentCore runs a preflight check during
// gateway creation that calls GetPolicyEngine and AuthorizeAction with the gateway role, so a
// successful deploy is direct evidence that each grant scope actually matches the real ARN.
const associatedEngine = new PolicyEngine(stack, 'AssociatedPolicyEngine', {
  description: 'PolicyEngine associated with gateways via policyEngineConfiguration',
});

associatedEngine.addPolicy('AssociatedGatewayPolicy', {
  description: 'Permit a specific OAuth user on any gateway, evaluated by the associated engine',
  statement: new PolicyStatement({
    effect: PolicyEffect.PERMIT,
    principal: PolicyPrincipal.entity('AgentCore::OAuthUser', 'associated-user'),
    action: PolicyAction.any(),
    resource: PolicyResource.anyOfType('AgentCore::Gateway'),
  }),
});

// 1. Auto-generated name: a synthesis-time Lazy, rendered mixed case.
new Gateway(stack, 'AutoNamedPolicyEngineGateway', {
  description: 'Auto-named gateway with an associated policy engine',
  authorizerConfiguration: GatewayAuthorizer.withNoAuth(),
  policyEngineConfiguration: {
    policyEngine: associatedEngine,
    mode: PolicyEngineMode.ENFORCE,
  },
});

// 2. Explicit name containing uppercase, to confirm the service lowercases a caller-supplied
//    name in the ARN the same way it does an auto-generated one.
new Gateway(stack, 'MixedCasePolicyEngineGateway', {
  gatewayName: 'PolicyIntegMixedCase',
  description: 'Explicitly mixed-case named gateway with an associated policy engine',
  authorizerConfiguration: GatewayAuthorizer.withNoAuth(),
  policyEngineConfiguration: {
    policyEngine: associatedEngine,
    mode: PolicyEngineMode.ENFORCE,
  },
});

// 3. Name from a CfnParameter: unresolvable at synthesis, so the grant is wildcard scoped.
const gatewayNameParam = new cdk.CfnParameter(stack, 'TokenGatewayName', {
  type: 'String',
  default: 'policy-integ-token-named',
  description: 'Supplies the gateway name as a deploy-time token',
});

new Gateway(stack, 'TokenNamedPolicyEngineGateway', {
  gatewayName: gatewayNameParam.valueAsString,
  description: 'Gateway whose name is a deploy-time token, with an associated policy engine',
  authorizerConfiguration: GatewayAuthorizer.withNoAuth(),
  policyEngineConfiguration: {
    policyEngine: associatedEngine,
    mode: PolicyEngineMode.ENFORCE,
  },
});

new integ.IntegTest(app, 'PolicyIntegTest', {
  testCases: [stack],
  regions: ['us-east-1'],
});
