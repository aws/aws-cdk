/*
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

import { Template, Match } from '../../../../assertions';
import * as cdk from '../../../../core';
import { Policy } from '../../../lib/policy/policy';
import { PolicyEngine } from '../../../lib/policy/policy-engine';
import {
  PolicyAction,
  PolicyAttribute,
  PolicyCondition,
  PolicyEffect,
  PolicyPrincipal,
  PolicyResource,
  PolicyStatement,
} from '../../../lib/policy/policy-statement';

/**
 * Most cases only vary one part of the statement, so this fills in the rest with the
 * widest values and keeps each test to the part it is actually about.
 */
function statement(overrides: {
  effect?: PolicyEffect;
  principal?: PolicyPrincipal;
  action?: PolicyAction;
  resource?: PolicyResource;
  when?: PolicyCondition[];
  unless?: PolicyCondition[];
} = {}): PolicyStatement {
  return new PolicyStatement({
    effect: overrides.effect ?? PolicyEffect.PERMIT,
    principal: overrides.principal ?? PolicyPrincipal.any(),
    action: overrides.action ?? PolicyAction.any(),
    resource: overrides.resource ?? PolicyResource.anyOfType('AgentCore::Gateway'),
    when: overrides.when,
    unless: overrides.unless,
  });
}

describe('PolicyStatement', () => {
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

  describe('Basic policy statements', () => {
    test('Should create simple permit statement', () => {
      const cedar = statement().toCedar();
      expect(cedar).toContain('permit(');
      expect(cedar).toContain('principal,');
      expect(cedar).toContain('action,');
      expect(cedar).toContain('resource is AgentCore::Gateway');
      expect(cedar.endsWith(';')).toBe(true);
    });

    test('Should create simple forbid statement', () => {
      expect(statement({ effect: PolicyEffect.FORBID }).toCedar()).toContain('forbid(');
    });

    test('Should create from raw Cedar string', () => {
      const raw = 'permit(principal, action, resource) when { context.custom > 10 };';
      expect(PolicyStatement.fromCedar(raw).toCedar()).toEqual(raw);
    });

    test('Should trim raw Cedar source', () => {
      expect(PolicyStatement.fromCedar('  permit(principal, action, resource);  ').toCedar())
        .toEqual('permit(principal, action, resource);');
    });
  });

  describe('Principal specifications', () => {
    test('Should create statement for specific principal', () => {
      const cedar = statement({
        principal: PolicyPrincipal.entity('AgentCore::OAuthUser', 'user123'),
      }).toCedar();
      expect(cedar).toContain('principal == AgentCore::OAuthUser::"user123"');
    });

    test('Should create statement for principal type without ID', () => {
      const cedar = statement({
        principal: PolicyPrincipal.entityType('AgentCore::OAuthUser'),
      }).toCedar();
      expect(cedar).toContain('principal is AgentCore::OAuthUser');
    });

    test('Should create statement for principal in group', () => {
      const cedar = statement({
        principal: PolicyPrincipal.inGroup('AgentCore::OAuthGroup', 'admins'),
      }).toCedar();
      expect(cedar).toContain('principal in AgentCore::OAuthGroup::"admins"');
    });

    test('Should create statement for any principal', () => {
      expect(statement({ principal: PolicyPrincipal.any() }).toCedar()).toContain('principal,');
    });
  });

  describe('Action specifications', () => {
    test('Should create statement for single action', () => {
      const cedar = statement({
        action: PolicyAction.one('AgentCore::Action::GetGateway'),
      }).toCedar();
      expect(cedar).toContain('action == AgentCore::Action::"GetGateway"');
    });

    test('Should create statement for multiple actions', () => {
      const cedar = statement({
        action: PolicyAction.anyOf([
          'AgentCore::Action::GetGateway',
          'AgentCore::Action::ListGateways',
        ]),
      }).toCedar();
      expect(cedar).toContain('action in [AgentCore::Action::"GetGateway", AgentCore::Action::"ListGateways"]');
    });

    test('Should render a single-element action list as an equality', () => {
      expect(statement({ action: PolicyAction.anyOf(['AgentCore::Action::GetGateway']) }).toCedar())
        .toContain('action == AgentCore::Action::"GetGateway"');
    });

    test('Should reject empty action array', () => {
      expect(() => PolicyAction.anyOf([])).toThrow(/at least one action/i);
    });
  });

  describe('Resource specifications', () => {
    test('Should create statement for specific resource', () => {
      const cedar = statement({
        resource: PolicyResource.instance('AgentCore::Gateway', 'arn:aws:bedrock:us-east-1:123:gateway/gw-1'),
      }).toCedar();
      expect(cedar).toContain('resource == AgentCore::Gateway::"arn:aws:bedrock:us-east-1:123:gateway/gw-1"');
    });

    test('Should create statement for a resource type', () => {
      expect(statement({ resource: PolicyResource.anyOfType('AgentCore::Runtime') }).toCedar())
        .toContain('resource is AgentCore::Runtime');
    });
  });

  describe('When conditions', () => {
    test('Should add simple when condition', () => {
      const cedar = statement({
        when: [PolicyCondition.stringEquals(PolicyAttribute.principal('department'), 'Engineering')],
      }).toCedar();
      expect(cedar).toContain('when {');
      expect(cedar).toContain('principal.department == "Engineering"');
    });

    test('Should join clause members with AND', () => {
      const cedar = statement({
        when: [
          PolicyCondition.stringEquals(PolicyAttribute.principal('department'), 'Engineering'),
          PolicyCondition.booleanEquals(PolicyAttribute.resource('confidential'), false),
        ],
      }).toCedar();
      expect(cedar).toContain('principal.department == "Engineering" && resource.confidential == false');
    });

    test('Should group alternatives with anyOf', () => {
      const cedar = statement({
        when: [
          PolicyCondition.anyOf([
            PolicyCondition.stringEquals(PolicyAttribute.principal('department'), 'Engineering'),
            PolicyCondition.stringEquals(PolicyAttribute.principal('department'), 'Support'),
          ]),
        ],
      }).toCedar();
      expect(cedar).toContain('(principal.department == "Engineering" || principal.department == "Support")');
    });

    test('Should parenthesise a nested group so precedence is explicit', () => {
      const cedar = statement({
        when: [
          PolicyCondition.anyOf([
            PolicyCondition.allOf([
              PolicyCondition.stringEquals(PolicyAttribute.principal('department'), 'Engineering'),
              PolicyCondition.booleanEquals(PolicyAttribute.principal('onCall'), true),
            ]),
            PolicyCondition.stringEquals(PolicyAttribute.principal('role'), 'admin'),
          ]),
        ],
      }).toCedar();
      expect(cedar).toContain(
        '((principal.department == "Engineering" && principal.onCall == true) || principal.role == "admin")',
      );
    });

    test('Should not parenthesise a single-member group', () => {
      const cedar = statement({
        when: [
          PolicyCondition.anyOf([
            PolicyCondition.stringEquals(PolicyAttribute.principal('department'), 'Engineering'),
          ]),
        ],
      }).toCedar();
      expect(cedar).toContain('principal.department == "Engineering"');
      expect(cedar).not.toContain('(principal.department');
    });

    test('Should omit the clause entirely when the condition list is empty', () => {
      expect(statement({ when: [] }).toCedar()).not.toContain('when {');
    });

    test('Should reject an empty group', () => {
      expect(() => PolicyCondition.allOf([])).toThrow(/at least one condition/i);
      expect(() => PolicyCondition.anyOf([])).toThrow(/at least one condition/i);
    });

    test('Should support numeric comparisons', () => {
      const cedar = statement({
        when: [PolicyCondition.numberGreaterThan(PolicyAttribute.context('age'), 18)],
      }).toCedar();
      expect(cedar).toContain('context.age > 18');
    });

    test('Should support IP range check', () => {
      const cedar = statement({
        when: [PolicyCondition.ipInRange(PolicyAttribute.context('sourceIp'), '192.168.1.0/24')],
      }).toCedar();
      expect(cedar).toContain('context.sourceIp.isInRange(ip("192.168.1.0/24"))');
    });

    test('Should NOT quote IP range check (ip function)', () => {
      const cedar = statement({
        when: [PolicyCondition.ipInRange(PolicyAttribute.context('sourceIp'), '10.0.0.0/8')],
      }).toCedar();
      expect(cedar).not.toContain('"ip(');
    });

    test('Should still quote regular string values', () => {
      const cedar = statement({
        when: [PolicyCondition.stringEquals(PolicyAttribute.context('environment'), 'production')],
      }).toCedar();
      expect(cedar).toContain('"production"');
    });

    test('Should support stringIn with a set literal (not a string)', () => {
      const cedar = statement({
        when: [PolicyCondition.stringIn(PolicyAttribute.principal('department'), ['Engineering', 'Support'])],
      }).toCedar();
      expect(cedar).toContain('["Engineering", "Support"].contains(principal.department)');
    });

    test('Should support numberIn', () => {
      const cedar = statement({
        when: [PolicyCondition.numberIn(PolicyAttribute.principal('level'), [1, 2, 3])],
      }).toCedar();
      expect(cedar).toContain('[1, 2, 3].contains(principal.level)');
    });

    test('Should reject an empty value list', () => {
      expect(() => PolicyCondition.stringIn(PolicyAttribute.principal('department'), [])).toThrow(/at least one value/i);
      expect(() => PolicyCondition.numberIn(PolicyAttribute.principal('level'), [])).toThrow(/at least one value/i);
    });

    test('Should support setContains for a set-valued attribute', () => {
      const cedar = statement({
        when: [PolicyCondition.setContains(PolicyAttribute.principal('groups'), 'admins')],
      }).toCedar();
      expect(cedar).toContain('principal.groups.contains("admins")');
    });
  });

  describe('Unless conditions', () => {
    test('Should add unless condition', () => {
      const cedar = statement({
        unless: [PolicyCondition.booleanEquals(PolicyAttribute.principal('suspended'), true)],
      }).toCedar();
      expect(cedar).toContain('unless {');
      expect(cedar).toContain('principal.suspended == true');
    });

    test('Should support both when and unless', () => {
      const cedar = statement({
        when: [PolicyCondition.stringEquals(PolicyAttribute.principal('department'), 'Engineering')],
        unless: [PolicyCondition.booleanEquals(PolicyAttribute.principal('suspended'), true)],
      }).toCedar();
      expect(cedar.indexOf('when {')).toBeLessThan(cedar.indexOf('unless {'));
    });
  });

  describe('Comparison operators', () => {
    const cases: Array<[string, PolicyCondition, string]> = [
      ['stringEquals', PolicyCondition.stringEquals(PolicyAttribute.principal('a'), 'x'), 'principal.a == "x"'],
      ['stringNotEquals', PolicyCondition.stringNotEquals(PolicyAttribute.principal('a'), 'x'), 'principal.a != "x"'],
      ['numberEquals', PolicyCondition.numberEquals(PolicyAttribute.principal('a'), 1), 'principal.a == 1'],
      ['numberNotEquals', PolicyCondition.numberNotEquals(PolicyAttribute.principal('a'), 1), 'principal.a != 1'],
      ['numberLessThan', PolicyCondition.numberLessThan(PolicyAttribute.principal('a'), 1), 'principal.a < 1'],
      ['numberLessThanOrEquals', PolicyCondition.numberLessThanOrEquals(PolicyAttribute.principal('a'), 1), 'principal.a <= 1'],
      ['numberGreaterThan', PolicyCondition.numberGreaterThan(PolicyAttribute.principal('a'), 1), 'principal.a > 1'],
      ['numberGreaterThanOrEquals', PolicyCondition.numberGreaterThanOrEquals(PolicyAttribute.principal('a'), 1), 'principal.a >= 1'],
      ['booleanEquals', PolicyCondition.booleanEquals(PolicyAttribute.principal('a'), true), 'principal.a == true'],
    ];

    test.each(cases)('%s renders the expected Cedar operator', (_name, condition, expected) => {
      expect(statement({ when: [condition] }).toCedar()).toContain(expected);
    });

    test('booleanEquals renders false', () => {
      expect(statement({ when: [PolicyCondition.booleanEquals(PolicyAttribute.principal('a'), false)] }).toCedar())
        .toContain('principal.a == false');
    });
  });

  describe('Attribute sources', () => {
    test('principal produces principal.<name>', () => {
      expect(statement({ when: [PolicyCondition.stringEquals(PolicyAttribute.principal('dept'), 'x')] }).toCedar())
        .toContain('principal.dept ==');
    });

    test('resource produces resource.<name>', () => {
      expect(statement({ when: [PolicyCondition.stringEquals(PolicyAttribute.resource('owner'), 'x')] }).toCedar())
        .toContain('resource.owner ==');
    });

    test('context produces context.<name>', () => {
      expect(statement({ when: [PolicyCondition.stringEquals(PolicyAttribute.context('env'), 'x')] }).toCedar())
        .toContain('context.env ==');
    });
  });

  describe('Integration with Policy construct', () => {
    test('Should create Policy with a statement', () => {
      new Policy(stack, 'test-policy', {
        policyEngine,
        policyName: 'test_policy',
        statement: statement({
          principal: PolicyPrincipal.entity('AgentCore::OAuthUser', 'user123'),
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::Policy', {
        Definition: {
          Cedar: {
            Statement: Match.stringLikeRegexp('permit\\(\\n  principal == AgentCore::OAuthUser::"user123"'),
          },
        },
      });
    });

    test('Should create Policy with raw Cedar definition', () => {
      new Policy(stack, 'test-policy', {
        policyEngine,
        policyName: 'test_policy',
        definition: 'permit(principal, action, resource is AgentCore::Gateway);',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::BedrockAgentCore::Policy', {
        Definition: {
          Cedar: {
            Statement: 'permit(principal, action, resource is AgentCore::Gateway);',
          },
        },
      });
    });

    test('Should reject Policy with both definition and statement', () => {
      expect(() => new Policy(stack, 'test-policy', {
        policyEngine,
        policyName: 'test_policy',
        definition: 'permit(principal, action, resource);',
        statement: statement(),
      })).toThrow();
    });

    test('Should reject Policy with neither definition nor statement', () => {
      expect(() => new Policy(stack, 'test-policy', {
        policyEngine,
        policyName: 'test_policy',
      })).toThrow();
    });
  });

  describe('Complex policy examples', () => {
    test('Should create complex policy matching console form', () => {
      const cedar = new PolicyStatement({
        effect: PolicyEffect.PERMIT,
        principal: PolicyPrincipal.inGroup('AgentCore::OAuthGroup', 'Engineers'),
        action: PolicyAction.anyOf([
          'AgentCore::Action::exampleaction1',
          'AgentCore::Action::exampleaction2',
        ]),
        resource: PolicyResource.instance('AgentCore::Gateway', 'arn:aws:bedrock:us-east-1:123:gateway/gw-1'),
        when: [
          PolicyCondition.stringEquals(PolicyAttribute.principal('department'), 'Engineering'),
          PolicyCondition.ipInRange(PolicyAttribute.context('sourceIp'), '192.168.1.0/24'),
        ],
        unless: [
          PolicyCondition.booleanEquals(PolicyAttribute.principal('suspended'), true),
        ],
      }).toCedar();

      expect(cedar).toContain('permit(');
      expect(cedar).toContain('principal in AgentCore::OAuthGroup::"Engineers"');
      expect(cedar).toContain('action in [AgentCore::Action::"exampleaction1", AgentCore::Action::"exampleaction2"]');
      expect(cedar).toContain('resource == AgentCore::Gateway::"arn:aws:bedrock:us-east-1:123:gateway/gw-1"');
      expect(cedar).toContain('principal.department == "Engineering" && context.sourceIp.isInRange(ip("192.168.1.0/24"))');
      expect(cedar).toContain('principal.suspended == true');
    });
  });
});

describe('injection containment and empty id (R5 fix)', () => {
  // Verified exploit: this entity id closes the string literal and appends a policy.
  const INJECTION_ID = 'arn:x") ; permit(principal, action, resource is AgentCore::Gateway //';

  test('rejects an injection payload in a specific principal entity id', () => {
    expect(() => statement({
      principal: PolicyPrincipal.entity('AgentCore::OAuthUser', INJECTION_ID),
    }).toCedar()).toThrow();
  });

  test('rejects an injection payload in a condition value', () => {
    expect(() => statement({
      when: [PolicyCondition.stringEquals(
        PolicyAttribute.principal('department'),
        'Engineering" || true || context has "x',
      )],
    }).toCedar()).toThrow();
  });

  test('rejects an injection payload in a resource ARN', () => {
    expect(() => statement({
      resource: PolicyResource.instance('AgentCore::Gateway', INJECTION_ID),
    }).toCedar()).toThrow();
  });

  test('rejects an injection payload in an entity type (identifier position)', () => {
    expect(() => statement({
      principal: PolicyPrincipal.entity(INJECTION_ID, 'user'),
    }).toCedar()).toThrow();
  });

  test('rejects an injection payload in a group id', () => {
    expect(() => statement({
      principal: PolicyPrincipal.inGroup('AgentCore::OAuthGroup', INJECTION_ID),
    }).toCedar()).toThrow();
  });

  test('renders a namespaced attribute name via the bracket form (does not throw)', () => {
    const cedar = statement({
      when: [PolicyCondition.setContains(PolicyAttribute.principal('cognito:groups'), 'admins')],
    }).toCedar();
    expect(cedar).toContain('principal["cognito:groups"].contains("admins")');
  });

  test('rejects an explicit empty principal entity id, pointing at the type-only form', () => {
    expect(() => statement({
      principal: PolicyPrincipal.entity('AgentCore::OAuthUser', ''),
      action: PolicyAction.one('AgentCore::Action::Get'),
    }).toCedar()).toThrow(/entityType\(\)/i);
  });

  test('rejects an empty action id', () => {
    expect(() => statement({
      action: PolicyAction.one('AgentCore::Action::'),
    }).toCedar()).toThrow(/action id cannot be an empty string/i);
  });

  test('names the field per operand position: set member vs condition value', () => {
    expect(() => statement({
      when: [PolicyCondition.numberIn(PolicyAttribute.principal('level'), [1.5])],
    }).toCedar()).toThrow(/set member must be an integer/i);

    expect(() => statement({
      when: [PolicyCondition.numberEquals(PolicyAttribute.principal('level'), 1.5)],
    }).toCedar()).toThrow(/condition value must be an integer/i);
  });
});
