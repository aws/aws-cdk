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

import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Policy } from '../../../lib/policy/policy';
import { PolicyEngine, PolicyValidationMode } from '../../../lib/policy/policy-engine';
import { PolicyStatement } from '../../../lib/policy/policy-statement';

/**
 * Integration test for Policy and PolicyEngine constructs.
 *
 * This test validates:
 * 1. Basic PolicyEngine and Policy creation
 * 2. PolicyEngine with custom KMS encryption
 * 3. Multiple policies added to a single engine
 * 4. Policy with raw Cedar definition
 * 5. Policy with PolicyStatement builder
 * 6. Policy with when/unless conditions
 * 7. Different validation modes
 * 8. PolicyEngine.addPolicy() convenience method
 * 9. Accessing policies list from PolicyEngine
 *
 * Manual verification steps after deployment:
 * 1. Verify PolicyEngine resources are created in AWS Console
 * 2. Verify Policy resources are associated with correct PolicyEngine
 * 3. Verify KMS encryption is applied where specified
 * 4. Verify Cedar policy definitions are correctly stored
 * 5. Check CloudWatch Logs for any policy evaluation errors
 */

const app = new cdk.App();
const stack = new cdk.Stack(app, 'PolicyIntegTestStack');

// Test 1: Basic PolicyEngine with simple Policy
const basicEngine = new PolicyEngine(stack, 'BasicPolicyEngine', {
  policyEngineName: 'basic_engine_integ_test',
  description: 'Basic policy engine for integration testing',
});

new Policy(stack, 'BasicPolicy', {
  policyEngine: basicEngine,
  policyName: 'basic_policy',
  definition: 'permit(principal, action, resource);',
  description: 'Basic permit-all policy for testing',
});

// Test 2: PolicyEngine with KMS encryption
const kmsKey = new kms.Key(stack, 'PolicyEngineKey', {
  description: 'KMS key for PolicyEngine encryption',
  enableKeyRotation: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const encryptedEngine = new PolicyEngine(stack, 'EncryptedPolicyEngine', {
  policyEngineName: 'encrypted_engine_integ',
  description: 'PolicyEngine with custom KMS encryption',
  kmsKey: kmsKey,
  tags: {
    Environment: 'Test',
    Purpose: 'Integration',
  },
});

// Test 3: Policy with raw Cedar definition (multiple actions)
new Policy(stack, 'RawCedarPolicy', {
  policyEngine: encryptedEngine,
  policyName: 'raw_cedar_policy',
  definition: 'permit(principal, action in [AgentCore::Action::"GetData", AgentCore::Action::"PutData"], resource);',
  description: 'Policy with raw Cedar definition',
  validationMode: PolicyValidationMode.FAIL_ON_ANY_FINDINGS,
});

// Test 4: Policy with PolicyStatement builder - simple permit
new Policy(stack, 'BuilderSimplePolicy', {
  policyEngine: encryptedEngine,
  policyName: 'builder_simple_policy',
  statement: PolicyStatement.permit()
    .forAllPrincipals()
    .onAllActions()
    .onAllResources(),
  description: 'Simple policy using builder pattern',
});

// Test 5: Policy with specific principals and actions
new Policy(stack, 'BuilderSpecificPolicy', {
  policyEngine: encryptedEngine,
  policyName: 'builder_specific_policy',
  statement: PolicyStatement.permit()
    .forPrincipal('AgentCore::OAuthUser', 'user123')
    .onActions(['AgentCore::Action::GetData', 'AgentCore::Action::PutData'])
    .onResource('AgentCore::Gateway', 'arn:aws:bedrock:us-east-1:123456789012:gateway/gw-abc'),
  description: 'Policy with specific principal, actions, and resource',
});

// Test 6: Policy with when conditions
new Policy(stack, 'BuilderConditionsPolicy', {
  policyEngine: encryptedEngine,
  policyName: 'builder_conditions_policy',
  statement: PolicyStatement.permit()
    .forAllPrincipals()
    .onAllActions()
    .onAllResources()
    .when()
    .principalAttribute('department').equalTo('Engineering')
    .and()
    .principalAttribute('role').equalTo('Developer')
    .done(),
  description: 'Policy with when conditions',
});

// Test 7: Policy with when and unless conditions
new Policy(stack, 'BuilderComplexPolicy', {
  policyEngine: encryptedEngine,
  policyName: 'builder_complex_policy',
  statement: PolicyStatement.permit()
    .forAllPrincipals()
    .onAllActions()
    .onResource('AgentCore::Gateway', 'arn:aws:bedrock:us-east-1:123:gateway/gw-123')
    .when()
    .principalAttribute('department').equalTo('Engineering')
    .and()
    .contextAttribute('sourceIp').isInRange('192.168.1.0/24')
    .done()
    .unless()
    .principalAttribute('suspended').equalTo(true)
    .or()
    .principalAttribute('accessLevel').lessThan(3)
    .done(),
  description: 'Complex policy with when and unless conditions',
});

// Test 8: Forbid policy
new Policy(stack, 'BuilderForbidPolicy', {
  policyEngine: encryptedEngine,
  policyName: 'builder_forbid_policy',
  statement: PolicyStatement.forbid()
    .forAllPrincipals()
    .onAction('AgentCore::Action::DeleteData')
    .onAllResources()
    .when()
    .principalAttribute('role').equalTo('ReadOnly')
    .done(),
  description: 'Forbid policy to deny delete action',
});

// Test 9: PolicyEngine with addPolicy() convenience method
const engineWithAddedPolicies = new PolicyEngine(stack, 'EngineWithAddedPolicies', {
  policyEngineName: 'engine_with_added_policies',
  description: 'PolicyEngine using addPolicy() method',
});

engineWithAddedPolicies.addPolicy('AddedPolicy1', {
  policyName: 'added_policy_1',
  definition: 'permit(principal, action, resource);',
  description: 'First policy added via addPolicy()',
});

engineWithAddedPolicies.addPolicy('AddedPolicy2', {
  policyName: 'added_policy_2',
  statement: PolicyStatement.permit()
    .forPrincipal('AgentCore::OAuthUser')
    .onAllActions()
    .onAllResources(),
  description: 'Second policy added via addPolicy()',
});

engineWithAddedPolicies.addPolicy('AddedPolicy3', {
  policyName: 'added_policy_3',
  statement: PolicyStatement.forbid()
    .forAllPrincipals()
    .onActions(['AgentCore::Action::DeleteData', 'AgentCore::Action::ModifyData'])
    .onAllResources(),
  description: 'Third policy added via addPolicy()',
  validationMode: PolicyValidationMode.IGNORE_ALL_FINDINGS,
});

// Test 10: Verify policies list can be accessed
const policiesCount = engineWithAddedPolicies.policies.length;
if (policiesCount !== 3) {
  throw new Error(`Expected 3 policies but got ${policiesCount}`);
}

// Test 11: Auto-generated names
const autoNamedEngine = new PolicyEngine(stack, 'AutoNamedEngine', {
  description: 'PolicyEngine with auto-generated name',
});

new Policy(stack, 'AutoNamedPolicy', {
  policyEngine: autoNamedEngine,
  statement: PolicyStatement.permit()
    .forAllPrincipals()
    .onAllActions()
    .onAllResources(),
  description: 'Policy with auto-generated name',
});

// Add outputs for verification
new cdk.CfnOutput(stack, 'BasicEngineArn', {
  value: basicEngine.policyEngineArn,
  description: 'ARN of the basic policy engine',
});

new cdk.CfnOutput(stack, 'EncryptedEngineArn', {
  value: encryptedEngine.policyEngineArn,
  description: 'ARN of the encrypted policy engine',
});

new cdk.CfnOutput(stack, 'EngineWithAddedPoliciesArn', {
  value: engineWithAddedPolicies.policyEngineArn,
  description: 'ARN of the engine with added policies',
});

new cdk.CfnOutput(stack, 'KmsKeyArn', {
  value: kmsKey.keyArn,
  description: 'ARN of the KMS key used for encryption',
});

new cdk.CfnOutput(stack, 'AutoNamedEngineArn', {
  value: autoNamedEngine.policyEngineArn,
  description: 'ARN of the auto-named policy engine',
});

// Create integration test
new IntegTest(app, 'PolicyIntegTest', {
  testCases: [stack],
  regions: ['us-east-1'], // Bedrock AgentCore is available in limited regions
  diffAssets: true,
  stackUpdateWorkflow: true,
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
    destroy: {
      args: {
        force: true,
      },
    },
  },
});

app.synth();
