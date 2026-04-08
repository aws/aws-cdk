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
import * as kms from 'aws-cdk-lib/aws-kms';
import { Gateway } from '../../../lib/gateway/gateway';
import { PolicyEngine } from '../../../lib/policy/policy-engine';

describe('PolicyEngine default tests', () => {
  let template: Template;
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

    policyEngine = new PolicyEngine(stack, 'test-policy-engine', {
      policyEngineName: 'test_engine',
      description: 'A test policy engine for authorization',
    });

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should have the correct resources', () => {
    template.resourceCountIs('AWS::BedrockAgentCore::PolicyEngine', 1);
  });

  test('Should have PolicyEngine resource with expected properties', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::PolicyEngine', {
      Name: 'test_engine',
      Description: 'A test policy engine for authorization',
    });
  });

  test('Should expose correct attributes', () => {
    expect(policyEngine.policyEngineName).toBe('test_engine');
    expect(policyEngine.description).toBe('A test policy engine for authorization');
    expect(policyEngine.policyEngineArn).toBeDefined();
    expect(policyEngine.policyEngineId).toBeDefined();
  });
});

describe('PolicyEngine with auto-generated name', () => {
  let template: Template;
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

    policyEngine = new PolicyEngine(stack, 'auto-name-engine');

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should generate a unique name automatically', () => {
    expect(policyEngine.policyEngineName).toBeDefined();
    expect(policyEngine.policyEngineName.length).toBeGreaterThan(0);
    expect(policyEngine.policyEngineName.length).toBeLessThanOrEqual(48);
  });

  test('Should have PolicyEngine resource', () => {
    template.resourceCountIs('AWS::BedrockAgentCore::PolicyEngine', 1);
  });
});

describe('PolicyEngine with KMS encryption', () => {
  let template: Template;
  let app: cdk.App;
  let stack: cdk.Stack;
  let policyEngine: PolicyEngine;
  let kmsKey: kms.Key;

  beforeAll(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack', {
      env: {
        account: '123456789012',
        region: 'us-east-1',
      },
    });

    kmsKey = new kms.Key(stack, 'test-key', {
      description: 'Test KMS key for policy engine encryption',
    });

    policyEngine = new PolicyEngine(stack, 'encrypted-engine', {
      policyEngineName: 'encrypted_engine',
      kmsKey,
    });

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should have PolicyEngine with KMS key', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::PolicyEngine', {
      Name: 'encrypted_engine',
      EncryptionKeyArn: Match.objectLike({
        'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('testkey.*'), 'Arn']),
      }),
    });
  });

  test('Should expose KMS key', () => {
    expect(policyEngine.kmsKey).toBeDefined();
    expect(policyEngine.kmsKey?.keyArn).toBeDefined();
  });
});

describe('PolicyEngine with tags', () => {
  let template: Template;
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

    new PolicyEngine(stack, 'tagged-engine', {
      policyEngineName: 'tagged_engine',
      tags: {
        Environment: 'Test',
        Project: 'CDK',
      },
    });

    app.synth();
    template = Template.fromStack(stack);
  });

  test('Should have PolicyEngine with tags', () => {
    template.hasResourceProperties('AWS::BedrockAgentCore::PolicyEngine', {
      Name: 'tagged_engine',
      Tags: [
        { Key: 'Environment', Value: 'Test' },
        { Key: 'Project', Value: 'CDK' },
      ],
    });
  });
});

describe('PolicyEngine validation tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'test-stack');
  });

  test('Should throw error for invalid name - starts with number', () => {
    expect(() => {
      new PolicyEngine(stack, 'invalid-engine-1', {
        policyEngineName: '1invalid',
      });
    }).toThrow();
  });

  test('Should throw error for invalid name - contains special characters', () => {
    expect(() => {
      new PolicyEngine(stack, 'invalid-engine-2', {
        policyEngineName: 'invalid-name!',
      });
    }).toThrow();
  });

  test('Should throw error for name too long', () => {
    expect(() => {
      new PolicyEngine(stack, 'invalid-engine-3', {
        policyEngineName: 'a'.repeat(49),
      });
    }).toThrow();
  });

  test('Should accept valid names', () => {
    expect(() => {
      new PolicyEngine(stack, 'valid-engine-1', {
        policyEngineName: 'ValidName',
      });
      new PolicyEngine(stack, 'valid-engine-2', {
        policyEngineName: 'Valid_Name_123',
      });
      new PolicyEngine(stack, 'valid-engine-3', {
        policyEngineName: 'a',
      });
    }).not.toThrow();
  });

  test('Should throw error for description too long', () => {
    expect(() => {
      new PolicyEngine(stack, 'invalid-desc-engine', {
        policyEngineName: 'test_engine',
        description: 'a'.repeat(4097),
      });
    }).toThrow();
  });

  test('Should throw error for more than 50 tags', () => {
    const tags: { [key: string]: string } = {};
    for (let i = 0; i < 51; i++) {
      tags[`key${i}`] = `value${i}`;
    }

    expect(() => {
      new PolicyEngine(stack, 'too-many-tags', {
        policyEngineName: 'test_engine',
        tags,
      });
    }).toThrow(/cannot have more than 50 tags/);
  });

  test('Should throw error for tag key too long', () => {
    expect(() => {
      new PolicyEngine(stack, 'long-tag-key', {
        policyEngineName: 'test_engine',
        tags: {
          [('a'.repeat(129))]: 'value',
        },
      });
    }).toThrow(/tag key length must be between 1 and 128 characters/);
  });

  test('Should throw error for tag value too long', () => {
    expect(() => {
      new PolicyEngine(stack, 'long-tag-value', {
        policyEngineName: 'test_engine',
        tags: {
          key: 'a'.repeat(257),
        },
      });
    }).toThrow(/tag value length cannot exceed 256 characters/);
  });

  test('Should throw error for tag key with invalid characters', () => {
    expect(() => {
      new PolicyEngine(stack, 'invalid-tag-key', {
        policyEngineName: 'test_engine',
        tags: {
          'invalid!key': 'value',
        },
      });
    }).toThrow(/tag key contains invalid characters/);
  });

  test('Should accept valid tags', () => {
    expect(() => {
      new PolicyEngine(stack, 'valid-tags', {
        policyEngineName: 'test_engine',
        tags: {
          'Environment': 'Production',
          'Project:Name': 'My Project',
          'Team/Owner': 'Engineering',
          'Cost_Center': '12345',
        },
      });
    }).not.toThrow();
  });
});

describe('PolicyEngine static methods tests', () => {
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

  test('fromPolicyEngineAttributes should create a PolicyEngine reference', () => {
    const policyEngine = PolicyEngine.fromPolicyEngineAttributes(stack, 'imported-engine', {
      policyEngineArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:policy-engine/test-engine-id',
    });

    expect(policyEngine.policyEngineArn).toBe(
      'arn:aws:bedrock-agentcore:us-east-1:123456789012:policy-engine/test-engine-id',
    );
    expect(policyEngine.policyEngineId).toBe('test-engine-id');
  });

  test('fromPolicyEngineAttributes with KMS key', () => {
    const policyEngine = PolicyEngine.fromPolicyEngineAttributes(stack, 'imported-engine-kms', {
      policyEngineArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:policy-engine/test-engine-id',
      kmsKeyArn: 'arn:aws:kms:us-east-1:123456789012:key/test-key-id',
    });

    expect(policyEngine.kmsKey).toBeDefined();
    expect(policyEngine.kmsKey?.keyArn).toBe('arn:aws:kms:us-east-1:123456789012:key/test-key-id');
  });

  test('fromPolicyEngineAttributes without optional attributes', () => {
    const policyEngine = PolicyEngine.fromPolicyEngineAttributes(stack, 'imported-engine-minimal', {
      policyEngineArn: 'arn:aws:bedrock-agentcore:us-east-1:123456789012:policy-engine/test-engine-id',
    });

    expect(policyEngine.policyEngineArn).toBe(
      'arn:aws:bedrock-agentcore:us-east-1:123456789012:policy-engine/test-engine-id',
    );
    expect(policyEngine.policyEngineId).toBe('test-engine-id');
    expect(policyEngine.kmsKey).toBeUndefined();
  });
});

describe('PolicyEngine grant methods tests', () => {
  let app: cdk.App;
  let stack: cdk.Stack;
  let policyEngine: PolicyEngine;
  let role: iam.Role;

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

    role = new iam.Role(stack, 'test-role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
  });

  test('grantRead should grant read permissions', () => {
    policyEngine.grantRead(role);

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:GetPolicyEngine',
            Effect: 'Allow',
          }),
        ]),
      },
    });
  });

  test('grantEvaluate should grant evaluation permissions', () => {
    const newApp = new cdk.App();
    const newStack = new cdk.Stack(newApp, 'evaluate-stack');
    const newEngine = new PolicyEngine(newStack, 'evaluate-engine', {
      policyEngineName: 'evaluate_engine',
    });
    const newRole = new iam.Role(newStack, 'evaluate-role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    newEngine.grantEvaluate(newRole);

    const template = Template.fromStack(newStack);
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith([
              'bedrock-agentcore:GetPolicyEngine',
              'bedrock-agentcore:AuthorizeAction',
              'bedrock-agentcore:PartiallyAuthorizeActions',
            ]),
            Effect: 'Allow',
          }),
        ]),
      },
    });
  });

  test('grantEvaluateForGateway should scope GetPolicyEngine to policy engine ARN only', () => {
    const newApp = new cdk.App();
    const newStack = new cdk.Stack(newApp, 'gateway-eval-stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    const newEngine = new PolicyEngine(newStack, 'gateway-eval-engine', {
      policyEngineName: 'gateway_eval_engine',
    });
    const newRole = new iam.Role(newStack, 'gateway-eval-role', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
    });
    const gateway = new Gateway(newStack, 'gateway-eval-gateway', {
      gatewayName: 'eval-gateway',
      role: newRole,
    });

    newEngine.grantEvaluateForGateway(newRole, gateway);

    const template = Template.fromStack(newStack);
    // GetPolicyEngine scoped to policy engine ARN only
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'bedrock-agentcore:GetPolicyEngine',
            Effect: 'Allow',
            Resource: Match.objectLike({
              'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('gatewayevalengine.*'), 'PolicyEngineArn']),
            }),
          }),
        ]),
      },
    });
  });

  test('grantEvaluateForGateway should scope AuthorizeAction and PartiallyAuthorizeActions to both ARNs', () => {
    const newApp = new cdk.App();
    const newStack = new cdk.Stack(newApp, 'gateway-auth-stack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    const newEngine = new PolicyEngine(newStack, 'gateway-auth-engine', {
      policyEngineName: 'gateway_auth_engine',
    });
    const newRole = new iam.Role(newStack, 'gateway-auth-role', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
    });
    const gateway = new Gateway(newStack, 'gateway-auth-gateway', {
      gatewayName: 'auth-gateway',
      role: newRole,
    });

    newEngine.grantEvaluateForGateway(newRole, gateway);

    const template = Template.fromStack(newStack);
    // AuthorizeAction + PartiallyAuthorizeActions scoped to BOTH policy engine and gateway ARNs
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: Match.arrayWith([
              'bedrock-agentcore:AuthorizeAction',
              'bedrock-agentcore:PartiallyAuthorizeActions',
            ]),
            Effect: 'Allow',
            Resource: Match.arrayWith([
              Match.objectLike({
                'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('gatewayauthengine.*'), 'PolicyEngineArn']),
              }),
              Match.objectLike({
                'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('gatewayauthgateway.*'), 'GatewayArn']),
              }),
            ]),
          }),
        ]),
      },
    });
  });
});

describe('PolicyEngine metrics tests', () => {
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

    policyEngine = new PolicyEngine(stack, 'metrics-engine', {
      policyEngineName: 'metrics_engine',
    });
  });

  test('metricAuthorizations should return a metric', () => {
    const metric = policyEngine.metricAuthorizations();
    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.metricName).toBe('Authorizations');
  });

  test('metricAuthorizationLatency should return a metric', () => {
    const metric = policyEngine.metricAuthorizationLatency();
    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.metricName).toBe('AuthorizationLatency');
  });

  test('metricDeniedRequests should return a metric', () => {
    const metric = policyEngine.metricDeniedRequests();
    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.metricName).toBe('DeniedRequests');
  });

  test('metricErrors should return a metric', () => {
    const metric = policyEngine.metricErrors();
    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.metricName).toBe('Errors');
  });

  test('metric with custom dimensions', () => {
    const metric = policyEngine.metric('CustomMetric', { CustomDimension: 'value' });
    expect(metric.namespace).toBe('AWS/Bedrock-AgentCore');
    expect(metric.metricName).toBe('CustomMetric');
  });
});

describe('PolicyEngine addPolicy tests', () => {
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

    policyEngine = new PolicyEngine(stack, 'engine-with-policy', {
      policyEngineName: 'engine_with_policy',
    });

    policyEngine.addPolicy('test-policy', {
      definition: 'permit(principal, action, resource);',
      policyName: 'test_policy',
      description: 'Test policy',
    });

    app.synth();
  });

  test('Should create both PolicyEngine and Policy resources', () => {
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::BedrockAgentCore::PolicyEngine', 1);
    template.resourceCountIs('AWS::BedrockAgentCore::Policy', 1);
  });

  test('Policy should reference the PolicyEngine', () => {
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::BedrockAgentCore::Policy', {
      Name: 'test_policy',
      Description: 'Test policy',
      PolicyEngineId: Match.objectLike({
        'Fn::GetAtt': Match.arrayWith([Match.stringLikeRegexp('enginewithpolicy.*'), 'PolicyEngineId']),
      }),
    });
  });
});
