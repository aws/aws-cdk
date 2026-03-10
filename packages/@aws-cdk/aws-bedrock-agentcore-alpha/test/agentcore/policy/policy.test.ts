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

import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Policy } from '../../../lib/policy/policy';
import { PolicyEngine, PolicyValidationMode } from '../../../lib/policy/policy-engine';

describe('Policy default tests', () => {
  let template: Template;
  let app: cdk.App;
  let stack: cdk.Stack;
  let policyEngine: PolicyEngine;
  let policy: Policy;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    policyEngine = new PolicyEngine(stack, 'test-engine', {
      policyEngineName: 'test_engine',
    });

    policy = new Policy(stack, 'test-policy', {
      policyEngine,
      policyName: 'test_policy',
      definition: 'permit(principal, action, resource);',
      description: 'A test policy for authorization',
    });

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should have the correct resources', () => {
    template.resourceCountIs('AWS::BedrockAgentCore::PolicyEngine', 1);
    template.resourceCountIs('AWS::BedrockAgentCore::Policy', 1);
  });

  test('Should have Policy resource with expected properties', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::Policy', {
      Name: 'test_policy',
      Description: 'A test policy for authorization',
      Definition: {
        Cedar: {
          Statement: 'permit(principal, action, resource);',
        },
      },
      ValidationMode: 'FAIL_ON_ANY_FINDINGS',
    });
  });

  test('Should expose correct attributes', () => {
    expect(policy.policyName).toBe('test_policy');
    expect(policy.description).toBe('A test policy for authorization');
    expect(policy.definition).toBe('permit(principal, action, resource);');
    expect(policy.validationMode).toBe(PolicyValidationMode.FAIL_ON_ANY_FINDINGS);
    expect(policy.policyArn).toBeDefined();
    expect(policy.policyId).toBeDefined();
    expect(policy.policyEngine).toBe(policyEngine);
  });

  test('Policy should depend on PolicyEngine', () => {
    const policyResource = template.findResources('AWS::BedrockAgentCore::Policy');
    const policyResourceKey = Object.keys(policyResource)[0];
    const resource = policyResource[policyResourceKey];

    // Check that DependsOn is present
    expect(resource.DependsOn).toBeDefined();
  });
});

describe('Policy with auto-generated name', () => {
  let template: Template;
  let app: cdk.App;
  let stack: cdk.Stack;
  let policy: Policy;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    const policyEngine = new PolicyEngine(stack, 'auto-engine', {
      policyEngineName: 'auto_engine',
    });

    policy = new Policy(stack, 'auto-name-policy', {
      policyEngine,
      definition: 'permit(principal, action, resource);',
    });

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should generate a unique name automatically', () => {
    expect(policy.policyName).toBeDefined();
    expect(policy.policyName.length).toBeGreaterThan(0);
    expect(policy.policyName.length).toBeLessThanOrEqual(48);
  });

  test('Should have Policy resource', () => {
    template.resourceCountIs('AWS::BedrockAgentCore::Policy', 1);
  });
});

describe('Policy with different validation modes', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let policyEngine: PolicyEngine;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    policyEngine = new PolicyEngine(stack, 'validation-engine', {
      policyEngineName: 'validation_engine',
    });
  });

  test('Should use FAIL_ON_ANY_FINDINGS by default', () => {
    const policy = new Policy(stack, 'default-validation-policy', {
      policyEngine,
      policyName: 'default_validation',
      definition: 'permit(principal, action, resource);',
    });

    expect(policy.validationMode).toBe(PolicyValidationMode.FAIL_ON_ANY_FINDINGS);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Policy', {
      Name: 'default_validation',
      ValidationMode: 'FAIL_ON_ANY_FINDINGS',
    });
  });

  test('Should accept IGNORE_ALL_FINDINGS validation mode', () => {
    const newApp = new cdk.App();
    const newStack = new cdk.Stack(newApp, 'ignore-stack');
    const newEngine = new PolicyEngine(newStack, 'ignore-engine', {
      policyEngineName: 'ignore_engine',
    });

    const policy = new Policy(newStack, 'ignore-validation-policy', {
      policyEngine: newEngine,
      policyName: 'ignore_validation',
      definition: 'permit(principal, action, resource);',
      validationMode: PolicyValidationMode.IGNORE_ALL_FINDINGS,
    });

    expect(policy.validationMode).toBe(PolicyValidationMode.IGNORE_ALL_FINDINGS);

    const template = Template.fromStack(newStack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Policy', {
      Name: 'ignore_validation',
      ValidationMode: 'IGNORE_ALL_FINDINGS',
    });
  });
});

describe('Policy validation tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let policyEngine: PolicyEngine;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack');
    policyEngine = new PolicyEngine(stack, 'test-engine', {
      policyEngineName: 'test_engine',
    });
  });

  test('Should throw error for invalid name - starts with number', () => {
    expect(() => {
      new Policy(stack, 'invalid-policy-1', {
        policyEngine,
        policyName: '1invalid',
        definition: 'permit(principal, action, resource);',
      });
    }).toThrow();
  });

  test('Should throw error for invalid name - contains special characters', () => {
    expect(() => {
      new Policy(stack, 'invalid-policy-2', {
        policyEngine,
        policyName: 'invalid-name!',
        definition: 'permit(principal, action, resource);',
      });
    }).toThrow();
  });

  test('Should throw error for name too long', () => {
    expect(() => {
      new Policy(stack, 'invalid-policy-3', {
        policyEngine,
        policyName: 'a'.repeat(49),
        definition: 'permit(principal, action, resource);',
      });
    }).toThrow();
  });

  test('Should accept valid names', () => {
    expect(() => {
      new Policy(stack, 'valid-policy-1', {
        policyEngine,
        policyName: 'ValidName',
        definition: 'permit(principal, action, resource);',
      });
      new Policy(stack, 'valid-policy-2', {
        policyEngine,
        policyName: 'Valid_Name_123',
        definition: 'permit(principal, action, resource);',
      });
      new Policy(stack, 'valid-policy-3', {
        policyEngine,
        policyName: 'a',
        definition: 'permit(principal, action, resource);',
      });
    }).not.toThrow();
  });

  test('Should throw error for definition too short', () => {
    expect(() => {
      new Policy(stack, 'invalid-def-short', {
        policyEngine,
        policyName: 'test_policy',
        definition: 'short',
      });
    }).toThrow();
  });

  test('Should throw error for definition too long', () => {
    expect(() => {
      new Policy(stack, 'invalid-def-long', {
        policyEngine,
        policyName: 'test_policy',
        definition: 'a'.repeat(153601),
      });
    }).toThrow();
  });

  test('Should accept valid definition lengths', () => {
    expect(() => {
      new Policy(stack, 'valid-def-1', {
        policyEngine,
        policyName: 'test_policy_1',
        definition: 'a'.repeat(35),
      });
      new Policy(stack, 'valid-def-2', {
        policyEngine,
        policyName: 'test_policy_2',
        definition: 'permit(principal, action, resource);',
      });
      new Policy(stack, 'valid-def-3', {
        policyEngine,
        policyName: 'test_policy_3',
        definition: 'a'.repeat(1000),
      });
    }).not.toThrow();
  });

  test('Should throw error for description too long', () => {
    expect(() => {
      new Policy(stack, 'invalid-desc-policy', {
        policyEngine,
        policyName: 'test_policy',
        definition: 'permit(principal, action, resource);',
        description: 'a'.repeat(4097),
      });
    }).toThrow();
  });

  test('Should throw error for null or undefined definition', () => {
    expect(() => {
      new Policy(stack, 'invalid-def-null', {
        policyEngine,
        policyName: 'test_policy',
        definition: null as any,
      });
    }).toThrow();
  });
});

describe('Policy static methods tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });
  });

  test('fromPolicyAttributes should create a Policy reference', () => {
    const policy = Policy.fromPolicyAttributes(stack, 'imported-policy', {
      policyArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:policy/test-policy-id',
      policyEngineId: 'test-engine-id',
    });

    expect(policy.policyArn).toBe('arn:aws:bedrock-agentcore:us-east-1:123456789012:policy/test-policy-id');
    expect(policy.policyId).toBe('test-policy-id');
    expect(policy.policyEngine).toBeDefined();
  });

  test('fromPolicyAttributes without optional attributes', () => {
    const policy = Policy.fromPolicyAttributes(stack, 'imported-policy-minimal', {
      policyArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:policy/test-policy-id',
      policyEngineId: 'test-engine-id',
    });

    expect(policy.policyArn).toBe('arn:aws:bedrock-agentcore:us-east-1:123456789012:policy/test-policy-id');
    expect(policy.policyId).toBe('test-policy-id');
    expect(policy.policyEngine).toBeDefined();
  });
});

describe('Policy grant methods tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let policyEngine: PolicyEngine;
  let policy: Policy;
  let role: iam.Role;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    policyEngine = new PolicyEngine(stack, 'grant-engine', {
      policyEngineName: 'grant_engine',
    });

    policy = new Policy(stack, 'grant-policy', {
      policyEngine,
      policyName: 'grant_policy',
      definition: 'permit(principal, action, resource);',
    });

    role = new iam.Role(stack, 'test-role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
  });

  test('grantRead should grant read permissions', () => {
    policy.grantRead(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:GetPolicy',
            Effect: 'Allow',
          }),
        ]),
      },
    });
  });
});

describe('Policy metrics tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let policy: Policy;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    const policyEngine = new PolicyEngine(stack, 'metrics-engine-2', {
      policyEngineName: 'metrics_engine_2',
    });

    policy = new Policy(stack, 'metrics-policy', {
      policyEngine,
      policyName: 'metrics_policy',
      definition: 'permit(principal, action, resource);',
    });
  });

  test('metricEvaluations should return a metric', () => {
    const metric = policy.metricEvaluations();
    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.metricName).toBe('PolicyEvaluations');
  });

  test('metricEvaluationLatency should return a metric', () => {
    const metric = policy.metricEvaluationLatency();
    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.metricName).toBe('PolicyEvaluationLatency');
  });

  test('metric with custom dimensions', () => {
    const metric = policy.metric('CustomMetric', { CustomDimension: 'value' });
    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.metricName).toBe('CustomMetric');
  });
});

describe('Policy with complex Cedar definitions', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let policyEngine: PolicyEngine;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    policyEngine = new PolicyEngine(stack, 'cedar-engine', {
      policyEngineName: 'cedar_engine',
    });
  });

  test('Should accept permit rules with conditions', () => {
    const cedarDefinition = `
      permit(
        principal in Group::"Admins",
        action == Action::"InvokeModel",
        resource
      ) when {
        context.environment == "production"
      };
    `;

    expect(() => {
      new Policy(stack, 'permit-policy', {
        policyEngine,
        policyName: 'permit_policy',
        definition: cedarDefinition,
      });
    }).not.toThrow();
  });

  test('Should accept forbid rules', () => {
    const cedarDefinition = `
      forbid(
        principal,
        action == Action::"DeleteModel",
        resource
      );
    `;

    expect(() => {
      new Policy(stack, 'forbid-policy', {
        policyEngine,
        policyName: 'forbid_policy',
        definition: cedarDefinition,
      });
    }).not.toThrow();
  });

  test('Should accept multiple statements', () => {
    const cedarDefinition = `
      permit(
        principal in Group::"Users",
        action == Action::"ReadModel",
        resource
      );

      forbid(
        principal in Group::"Users",
        action == Action::"DeleteModel",
        resource
      );
    `;

    expect(() => {
      new Policy(stack, 'multi-statement-policy', {
        policyEngine,
        policyName: 'multi_statement_policy',
        definition: cedarDefinition,
      });
    }).not.toThrow();
  });
});

describe('Cross-stack Policy tests', () => {
  let app: cdk.App;
  let engineStack: cdk.Stack;
  let policyStack: cdk.Stack;

  beforeAll(() => {
    app = new cdk.App();
    engineStack = new cdk.Stack(app, 'engine-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });
    policyStack = new cdk.Stack(app, 'policy-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });
  });

  test('Should allow Policy in different stack than PolicyEngine', () => {
    const policyEngine = new PolicyEngine(engineStack, 'cross-stack-engine', {
      policyEngineName: 'cross_stack_engine',
    });

    expect(() => {
      new Policy(policyStack, 'cross-stack-policy', {
        policyEngine,
        policyName: 'cross_stack_policy',
        definition: 'permit(principal, action, resource);',
      });
    }).not.toThrow();

    app.synth();

    const policyTemplate = Template.fromStack(policyStack);
    policyTemplate.resourceCountIs('AWS::BedrockAgentCore::Policy', 1);

    const engineTemplate = Template.fromStack(engineStack);
    engineTemplate.resourceCountIs('AWS::BedrockAgentCore::PolicyEngine', 1);
  });
});
