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
import { Policy } from '../../../lib/policy/policy';
import { PolicyEngine } from '../../../lib/policy/policy-engine';
import {
  AttributeAccessor,
  ConditionBuilder,
  PolicyStatement,
} from '../../../lib/policy/policy-statement';

describe('PolicyStatement Builder', () => {
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
      const statement = PolicyStatement.permit()
        .forAllPrincipals()
        .onAllActions()
        .onAllResources();

      const cedar = statement.toCedar();
      expect(cedar).toContain('permit(');
      expect(cedar).toContain('principal,');
      expect(cedar).toContain('action,');
      expect(cedar).toContain('resource');
      expect(cedar).toMatch(/;\s*$/);
    });

    test('Should create simple forbid statement', () => {
      const statement = PolicyStatement.forbid()
        .forAllPrincipals()
        .onAllActions()
        .onAllResources();

      const cedar = statement.toCedar();
      expect(cedar).toContain('forbid(');
    });

    test('Should create from raw Cedar string', () => {
      const rawCedar = 'permit(principal, action, resource);';
      const statement = PolicyStatement.fromCedar(rawCedar);

      expect(statement.toCedar()).toBe(rawCedar);
    });
  });

  describe('Principal specifications', () => {
    test('Should create statement for specific principal', () => {
      const statement = PolicyStatement.permit()
        .forPrincipal('AgentCore::OAuthUser', 'user123')
        .onAllActions()
        .onAllResources();

      const cedar = statement.toCedar();
      expect(cedar).toContain('principal == AgentCore::OAuthUser::"user123"');
    });

    test('Should create statement for principal type without ID', () => {
      const statement = PolicyStatement.permit()
        .forPrincipal('AgentCore::OAuthUser')
        .onAllActions()
        .onAllResources();

      const cedar = statement.toCedar();
      expect(cedar).toContain('principal is AgentCore::OAuthUser');
    });

    test('Should create statement for principal in group', () => {
      const statement = PolicyStatement.permit()
        .forPrincipalInGroup('Group', 'Admins')
        .onAllActions()
        .onAllResources();

      const cedar = statement.toCedar();
      expect(cedar).toContain('principal in Group::"Admins"');
    });
  });

  describe('Action specifications', () => {
    test('Should create statement for single action', () => {
      const statement = PolicyStatement.permit()
        .forAllPrincipals()
        .onAction('AgentCore::Action::GetData')
        .onAllResources();

      const cedar = statement.toCedar();
      expect(cedar).toContain('action == AgentCore::Action::"GetData"');
    });

    test('Should create statement for multiple actions', () => {
      const statement = PolicyStatement.permit()
        .forAllPrincipals()
        .onActions(['AgentCore::Action::GetData', 'AgentCore::Action::PutData'])
        .onAllResources();

      const cedar = statement.toCedar();
      expect(cedar).toContain('action in [AgentCore::Action::"GetData", AgentCore::Action::"PutData"]');
    });

    test('Should reject empty action array', () => {
      expect(() => {
        PolicyStatement.permit()
          .forAllPrincipals()
          .onActions([])
          .onAllResources();
      }).toThrow(/At least one action must be specified/);
    });
  });

  describe('Resource specifications', () => {
    test('Should create statement for specific resource', () => {
      const statement = PolicyStatement.permit()
        .forAllPrincipals()
        .onAllActions()
        .onResource('AgentCore::Gateway', 'arn:aws:bedrock:us-east-1:123456789012:gateway/gw-abc');

      const cedar = statement.toCedar();
      expect(cedar).toContain('resource == AgentCore::Gateway::"arn:aws:bedrock:us-east-1:123456789012:gateway/gw-abc"');
    });
  });

  describe('When conditions', () => {
    test('Should add simple when condition', () => {
      const statement = PolicyStatement.permit()
        .forAllPrincipals()
        .onAllActions()
        .onAllResources()
        .when()
        .principalAttribute('department').equalTo('Engineering')
        .done();

      const cedar = statement.toCedar();
      expect(cedar).toContain('when {');
      expect(cedar).toContain('principal.department == "Engineering"');
      expect(cedar).toContain('}');
    });

    test('Should add multiple AND conditions', () => {
      const statement = PolicyStatement.permit()
        .forAllPrincipals()
        .onAllActions()
        .onAllResources()
        .when()
        .principalAttribute('department').equalTo('Engineering')
        .and()
        .principalAttribute('role').equalTo('Developer')
        .done();

      const cedar = statement.toCedar();
      expect(cedar).toContain('principal.department == "Engineering" && principal.role == "Developer"');
    });

    test('Should add multiple OR conditions', () => {
      const statement = PolicyStatement.permit()
        .forAllPrincipals()
        .onAllActions()
        .onAllResources()
        .when()
        .principalAttribute('role').equalTo('Admin')
        .or()
        .principalAttribute('role').equalTo('Owner')
        .done();

      const cedar = statement.toCedar();
      expect(cedar).toContain('principal.role == "Admin" || principal.role == "Owner"');
    });

    test('Should support numeric comparisons', () => {
      const statement = PolicyStatement.permit()
        .forAllPrincipals()
        .onAllActions()
        .onAllResources()
        .when()
        .principalAttribute('accessLevel').greaterThan(5)
        .done();

      const cedar = statement.toCedar();
      expect(cedar).toContain('principal.accessLevel > 5');
    });

    test('Should support IP range check', () => {
      const statement = PolicyStatement.permit()
        .forAllPrincipals()
        .onAllActions()
        .onAllResources()
        .when()
        .contextAttribute('sourceIp').isInRange('192.168.1.0/24')
        .done();

      const cedar = statement.toCedar();
      expect(cedar).toContain('context.sourceIp isInRange ip("192.168.1.0/24")');
    });

    test('Should support isIn() with set literal (not string)', () => {
      const statement = PolicyStatement.permit()
        .forAllPrincipals()
        .onAllActions()
        .onAllResources()
        .when()
        .principalAttribute('role').isIn(['admin', 'engineer', 'manager'])
        .done();

      const cedar = statement.toCedar();
      // Should NOT wrap the set in quotes - it should be a Cedar set literal
      expect(cedar).toContain('principal.role in ["admin", "engineer", "manager"]');
      // Should NOT be a string literal
      expect(cedar).not.toContain('principal.role in "["admin", "engineer", "manager"]"');
    });

    test('Should support isIn() with numeric values', () => {
      const statement = PolicyStatement.permit()
        .forAllPrincipals()
        .onAllActions()
        .onAllResources()
        .when()
        .principalAttribute('accessLevel').isIn([1, 2, 3, 5, 8])
        .done();

      const cedar = statement.toCedar();
      expect(cedar).toContain('principal.accessLevel in [1, 2, 3, 5, 8]');
      expect(cedar).not.toContain('"[1, 2, 3, 5, 8]"');
    });

    test('Should support isIn() with mixed string and numeric values', () => {
      const statement = PolicyStatement.permit()
        .forAllPrincipals()
        .onAllActions()
        .onAllResources()
        .when()
        .resourceAttribute('tags').isIn(['production', 'staging', 1, 2])
        .done();

      const cedar = statement.toCedar();
      expect(cedar).toContain('resource.tags in ["production", "staging", 1, 2]');
      expect(cedar).not.toContain('"["production", "staging", 1, 2]"');
    });

    test('Should NOT quote IP range check (ip function)', () => {
      const statement = PolicyStatement.permit()
        .forAllPrincipals()
        .onAllActions()
        .onAllResources()
        .when()
        .contextAttribute('sourceIp').isInRange('10.0.0.0/8')
        .done();

      const cedar = statement.toCedar();
      // Should use ip() function syntax
      expect(cedar).toContain('context.sourceIp isInRange ip("10.0.0.0/8")');
      // Should NOT wrap the entire ip() call in quotes
      expect(cedar).not.toContain('"ip("10.0.0.0/8")"');
    });

    test('Should still quote regular string values', () => {
      const statement = PolicyStatement.permit()
        .forAllPrincipals()
        .onAllActions()
        .onAllResources()
        .when()
        .principalAttribute('name').equalTo('Alice')
        .done();

      const cedar = statement.toCedar();
      // Regular strings SHOULD be quoted
      expect(cedar).toContain('principal.name == "Alice"');
    });
  });

  describe('Unless conditions', () => {
    test('Should add unless condition', () => {
      const statement = PolicyStatement.permit()
        .forAllPrincipals()
        .onAllActions()
        .onAllResources()
        .unless()
        .principalAttribute('suspended').equalTo(true)
        .done();

      const cedar = statement.toCedar();
      expect(cedar).toContain('unless {');
      expect(cedar).toContain('principal.suspended == true');
    });

    test('Should support both when and unless', () => {
      const statement = PolicyStatement.permit()
        .forAllPrincipals()
        .onAllActions()
        .onAllResources()
        .when()
        .principalAttribute('department').equalTo('Engineering')
        .done()
        .unless()
        .principalAttribute('suspended').equalTo(true)
        .done();

      const cedar = statement.toCedar();
      expect(cedar).toContain('when {');
      expect(cedar).toContain('principal.department == "Engineering"');
      expect(cedar).toContain('unless {');
      expect(cedar).toContain('principal.suspended == true');
    });
  });

  describe('Integration with Policy construct', () => {
    test('Should create Policy with statement builder', () => {
      new Policy(stack, 'test-policy', {
        policyEngine: policyEngine,
        statement: PolicyStatement.permit()
          .forAllPrincipals()
          .onAllActions()
          .onAllResources(),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::Policy', {
        Definition: {
          Cedar: {
            Statement: 'permit(\n  principal,\n  action,\n  resource is AgentCore::Gateway\n);',
          },
        },
      });
    });

    test('Should create Policy with raw Cedar definition', () => {
      new Policy(stack, 'test-policy', {
        policyEngine: policyEngine,
        definition: 'permit(principal, action, resource);',
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::Policy', {
        Definition: {
          Cedar: {
            Statement: 'permit(principal, action, resource);',
          },
        },
      });
    });

    test('Should reject Policy with both definition and statement', () => {
      expect(() => {
        new Policy(stack, 'test-policy', {
          policyEngine: policyEngine,
          definition: 'permit(principal, action, resource);',
          statement: PolicyStatement.permit().forAllPrincipals().onAllActions().onAllResources(),
        });
      }).toThrow(/must specify either 'definition' OR 'statement', but not both/);
    });

    test('Should reject Policy with neither definition nor statement', () => {
      expect(() => {
        new Policy(stack, 'test-policy', {
          policyEngine: policyEngine,
        } as any);
      }).toThrow(/must specify either 'definition'.*or 'statement'.*but neither was provided/);
    });
  });

  describe('Complex policy examples', () => {
    test('Should create complex policy matching console form', () => {
      const policy = new Policy(stack, 'engineers-policy', {
        policyEngine: policyEngine,
        policyName: 'allow_engineers',
        statement: PolicyStatement.permit()
          .forAllPrincipals()
          .onAllActions()
          .onResource('AgentCore::Gateway', 'arn:aws:bedrock:us-east-1:123:gateway/gw-123')
          .when()
          .principalAttribute('department').equalTo('Engineering')
          .and()
          .principalAttribute('role').equalTo('Developer')
          .and()
          .contextAttribute('sourceIp').isInRange('192.168.1.0/24')
          .done()
          .unless()
          .principalAttribute('suspended').equalTo(true)
          .or()
          .principalAttribute('accessLevel').lessThan(3)
          .or()
          .resourceAttribute('confidential').equalTo(true)
          .done(),
      });

      const template = Template.fromStack(stack);
      template.hasResourceProperties('AWS::BedrockAgentCore::Policy', {
        Name: 'allow_engineers',
        Definition: {
          Cedar: {
            Statement: Match.stringLikeRegexp('permit\\('),
          },
        },
      });

      const cedar = (policy as any).definition;
      expect(cedar).toContain('principal.department == "Engineering"');
      expect(cedar).toContain('principal.role == "Developer"');
      expect(cedar).toContain('context.sourceIp isInRange ip("192.168.1.0/24")');
      expect(cedar).toContain('principal.suspended == true');
      expect(cedar).toContain('principal.accessLevel < 3');
      expect(cedar).toContain('resource.confidential == true');
    });
  });

  describe('Validation', () => {
    test('Should reject incomplete statement (missing principal)', () => {
      expect(() => {
        PolicyStatement.permit()
          .onAllActions()
          .onAllResources()
          .toCedar();
      }).toThrow(/Principal must be specified/);
    });

    test('Should reject incomplete statement (missing action)', () => {
      expect(() => {
        PolicyStatement.permit()
          .forAllPrincipals()
          .onAllResources()
          .toCedar();
      }).toThrow(/Action must be specified/);
    });

    test('Should reject incomplete statement (missing resource)', () => {
      expect(() => {
        PolicyStatement.permit()
          .forAllPrincipals()
          .onAllActions()
          .toCedar();
      }).toThrow(/Resource must be specified/);
    });

    test('Should reject mixing raw Cedar with builder methods', () => {
      expect(() => {
        PolicyStatement.fromCedar('permit(principal, action, resource);')
          .forAllPrincipals();
      }).toThrow(/Cannot use builder methods with raw Cedar/);
    });
  });
});

describe('ConditionBuilder accessors', () => {
  let builder: ConditionBuilder;

  beforeEach(() => {
    builder = new ConditionBuilder();
  });

  test('principalAttribute should produce principal.<name> Cedar path', () => {
    builder.principalAttribute('department').equalTo('Engineering');

    expect(builder._toCedar()).toBe('principal.department == "Engineering"');
  });

  test('resourceAttribute should produce resource.<name> Cedar path', () => {
    builder.resourceAttribute('confidential').equalTo(true);

    expect(builder._toCedar()).toBe('resource.confidential == true');
  });

  test('contextAttribute should produce context.<name> Cedar path', () => {
    builder.contextAttribute('environment').equalTo('prod');

    expect(builder._toCedar()).toBe('context.environment == "prod"');
  });

  test('principalAttribute should return an AttributeAccessor instance', () => {
    const accessor = builder.principalAttribute('role');
    expect(accessor).toBeInstanceOf(AttributeAccessor);
  });

  test('resourceAttribute should return an AttributeAccessor instance', () => {
    const accessor = builder.resourceAttribute('owner');
    expect(accessor).toBeInstanceOf(AttributeAccessor);
  });

  test('contextAttribute should return an AttributeAccessor instance', () => {
    const accessor = builder.contextAttribute('sourceIp');
    expect(accessor).toBeInstanceOf(AttributeAccessor);
  });

  test('Should combine multiple attribute accessors with AND', () => {
    builder
      .principalAttribute('department').equalTo('Engineering')
      .and()
      .resourceAttribute('confidential').equalTo(false)
      .and()
      .contextAttribute('environment').equalTo('prod');

    expect(builder._toCedar()).toBe(
      'principal.department == "Engineering" && resource.confidential == false && context.environment == "prod"',
    );
  });

  test('_toCedar should return empty string when no conditions have been added', () => {
    expect(builder._toCedar()).toBe('');
  });
});

describe('Comparison operators on ConditionalPolicyStatement (via .when())', () => {
  const makeStatement = () =>
    PolicyStatement.permit()
      .forAllPrincipals()
      .onAllActions()
      .onAllResources();

  test('notEqualTo should produce != Cedar operator', () => {
    const cedar = makeStatement()
      .when()
      .principalAttribute('role').notEqualTo('Guest')
      .done()
      .toCedar();

    expect(cedar).toContain('principal.role != "Guest"');
  });

  test('lessThanOrEqualTo should produce <= Cedar operator', () => {
    const cedar = makeStatement()
      .when()
      .principalAttribute('accessLevel').lessThanOrEqualTo(3)
      .done()
      .toCedar();

    expect(cedar).toContain('principal.accessLevel <= 3');
  });

  test('greaterThanOrEqualTo should produce >= Cedar operator', () => {
    const cedar = makeStatement()
      .when()
      .principalAttribute('accessLevel').greaterThanOrEqualTo(5)
      .done()
      .toCedar();

    expect(cedar).toContain('principal.accessLevel >= 5');
  });

  test('contains should produce Cedar contains operator', () => {
    const cedar = makeStatement()
      .when()
      .principalAttribute('groups').contains('admins')
      .done()
      .toCedar();

    expect(cedar).toContain('principal.groups contains "admins"');
  });
});

describe('Comparison operators on AttributeAccessor (direct ConditionBuilder usage)', () => {
  let builder: ConditionBuilder;

  beforeEach(() => {
    builder = new ConditionBuilder();
  });

  test('notEqualTo should produce != Cedar operator', () => {
    builder.principalAttribute('role').notEqualTo('Guest');

    expect(builder._toCedar()).toBe('principal.role != "Guest"');
  });

  test('lessThanOrEqualTo should produce <= Cedar operator', () => {
    builder.principalAttribute('accessLevel').lessThanOrEqualTo(3);

    expect(builder._toCedar()).toBe('principal.accessLevel <= 3');
  });

  test('greaterThanOrEqualTo should produce >= Cedar operator', () => {
    builder.principalAttribute('accessLevel').greaterThanOrEqualTo(5);

    expect(builder._toCedar()).toBe('principal.accessLevel >= 5');
  });

  test('contains should produce Cedar contains operator', () => {
    builder.resourceAttribute('tags').contains('public');

    expect(builder._toCedar()).toBe('resource.tags contains "public"');
  });

  test('All comparison operators should chain with AND into a single Cedar expression', () => {
    builder
      .principalAttribute('role').notEqualTo('Guest')
      .and()
      .principalAttribute('accessLevel').lessThanOrEqualTo(10)
      .and()
      .principalAttribute('accessLevel').greaterThanOrEqualTo(1)
      .and()
      .principalAttribute('groups').contains('devs');

    expect(builder._toCedar()).toBe(
      'principal.role != "Guest" && principal.accessLevel <= 10 && principal.accessLevel >= 1 && principal.groups contains "devs"',
    );
  });
});
