import '@aws-cdk/assert/jest';
import { Lazy, Stack, Token } from '@aws-cdk/core';
import {
  Anyone, AnyPrincipal, ArnPrincipal, CanonicalUserPrincipal, CompositePrincipal, Effect, FederatedPrincipal,
  IPrincipal, PolicyDocument, PolicyStatement, PrincipalPolicyFragment, ServicePrincipal
} from '../lib';

describe('IAM polocy document', () => {
  test('the Permission class is a programming model for iam', () => {
    const stack = new Stack();

    const p = new PolicyStatement();
    p.addActions('sqs:SendMessage');
    p.addActions('dynamodb:CreateTable', 'dynamodb:DeleteTable');
    p.addResources('myQueue');
    p.addResources('yourQueue');

    p.addAllResources();
    p.addAwsAccountPrincipal(`my${Token.asString({ account: 'account' })}name`);
    p.addAccountCondition('12221121221');

    expect(stack.resolve(p.toStatementJson())).toEqual({ Action:
      [ 'sqs:SendMessage',
        'dynamodb:CreateTable',
        'dynamodb:DeleteTable' ],
       Resource: [ 'myQueue', 'yourQueue', '*' ],
       Effect: 'Allow',
       Principal:
      { AWS:
         { 'Fn::Join':
          [ '',
          [ 'arn:',
            { Ref: 'AWS::Partition' },
            ':iam::my',
            { account: 'account' },
            'name:root' ] ] } },
       Condition: { StringEquals: { 'sts:ExternalId': '12221121221' } } });
  });

  test('the PolicyDocument class is a dom for iam policy documents', () => {
    const stack = new Stack();
    const doc = new PolicyDocument();
    const p1 = new PolicyStatement();
    p1.addActions('sqs:SendMessage');
    p1.addNotResources('arn:aws:sqs:us-east-1:123456789012:forbidden_queue');

    const p2 = new PolicyStatement();
    p2.effect = Effect.DENY;
    p2.addActions('cloudformation:CreateStack');

    const p3 = new PolicyStatement();
    p3.effect = Effect.ALLOW;
    p3.addNotActions('cloudformation:UpdateTerminationProtection');

    const p4 = new PolicyStatement();
    p4.effect = Effect.DENY;
    p4.addNotPrincipals(new CanonicalUserPrincipal('OnlyAuthorizedUser'));

    doc.addStatements(p1);
    doc.addStatements(p2);
    doc.addStatements(p3);
    doc.addStatements(p4);

    expect(stack.resolve(doc)).toEqual({
      Version: '2012-10-17',
      Statement:
        [{ Effect: 'Allow', Action: 'sqs:SendMessage', NotResource: 'arn:aws:sqs:us-east-1:123456789012:forbidden_queue' },
          { Effect: 'Deny', Action: 'cloudformation:CreateStack' },
          { Effect: 'Allow', NotAction: 'cloudformation:UpdateTerminationProtection' },
          { Effect: 'Deny', NotPrincipal: { CanonicalUser: 'OnlyAuthorizedUser' } } ] });
  });

  test('Cannot combine Actions and NotActions', () => {
    expect(() => {
      new PolicyStatement({
        actions: ['abc:def'],
        notActions: ['abc:def'],
      });
    }).toThrow(/Cannot add 'NotActions' to policy statement if 'Actions' have been added/);
  });

  test('Throws with invalid actions', () => {
    expect(() => {
      new PolicyStatement({
        actions: ['service:action', '*', 'service:acti*', 'in:val:id']
      });
    }).toThrow(/Action 'in:val:id' is invalid/);
  });

  test('Throws with invalid not actions', () => {
    expect(() => {
      new PolicyStatement({
        notActions: ['service:action', '*', 'service:acti*', 'in:val:id']
      });
    }).toThrow(/Action 'in:val:id' is invalid/);
  });

  test('Cannot combine Resources and NotResources', () => {
    expect(() => {
      new PolicyStatement({
        resources: ['abc'],
        notResources: ['def'],
      });
    }).toThrow(/Cannot add 'NotResources' to policy statement if 'Resources' have been added/);
  });

  test('Cannot add NotPrincipals when Principals exist', () => {
    const stmt = new PolicyStatement({
      principals: [new CanonicalUserPrincipal('abc')],
    });
    expect(() => {
      stmt.addNotPrincipals(new CanonicalUserPrincipal('def'));
    }).toThrow(/Cannot add 'NotPrincipals' to policy statement if 'Principals' have been added/);
  });

  test('Cannot add Principals when NotPrincipals exist', () => {
    const stmt = new PolicyStatement({
      notPrincipals: [new CanonicalUserPrincipal('abc')],
    });
    expect(() => {
      stmt.addPrincipals(new CanonicalUserPrincipal('def'));
    }).toThrow(/Cannot add 'Principals' to policy statement if 'NotPrincipals' have been added/);
  });

  test('Permission allows specifying multiple actions upon construction', () => {
    const stack = new Stack();
    const perm = new PolicyStatement();
    perm.addResources('MyResource');
    perm.addActions('Action1', 'Action2', 'Action3');

    expect(stack.resolve(perm.toStatementJson())).toEqual({
      Effect: 'Allow',
      Action: [ 'Action1', 'Action2', 'Action3' ],
      Resource: 'MyResource' });
  });

  test('PolicyDoc resolves to undefined if there are no permissions', () => {
    const stack = new Stack();
    const p = new PolicyDocument();
    expect(stack.resolve(p)).toBeUndefined();
  });

  test('canonicalUserPrincipal adds a principal to a policy with the passed canonical user id', () => {
    const stack = new Stack();
    const p = new PolicyStatement();
    const canoncialUser = "averysuperduperlongstringfor";
    p.addPrincipals(new CanonicalUserPrincipal(canoncialUser));
    expect(stack.resolve(p.toStatementJson())).toEqual({
      Effect: "Allow",
      Principal: {
        CanonicalUser: canoncialUser
      }
    });
  });

  test('addAccountRootPrincipal adds a principal with the current account root', () => {
    const stack = new Stack();

    const p = new PolicyStatement();
    p.addAccountRootPrincipal();
    expect(stack.resolve(p.toStatementJson())).toEqual({
      Effect: "Allow",
      Principal: {
        AWS: {
        "Fn::Join": [
          "",
          [
          "arn:",
          { Ref: "AWS::Partition" },
          ":iam::",
          { Ref: "AWS::AccountId" },
          ":root"
          ]
        ]
        }
      }
    });
  });

  test('addFederatedPrincipal adds a Federated principal with the passed value', () => {
    const stack = new Stack();
    const p = new PolicyStatement();
    p.addFederatedPrincipal("com.amazon.cognito", { StringEquals: { key: 'value' }});
    expect(stack.resolve(p.toStatementJson())).toEqual({
      Effect: "Allow",
      Principal: {
        Federated: "com.amazon.cognito"
      },
      Condition: {
        StringEquals: { key: 'value' }
      }
    });
  });

  test('addAwsAccountPrincipal can be used multiple times', () => {
    const stack = new Stack();

    const p = new PolicyStatement();
    p.addAwsAccountPrincipal('1234');
    p.addAwsAccountPrincipal('5678');
    expect(stack.resolve(p.toStatementJson())).toEqual({
      Effect: 'Allow',
      Principal: {
        AWS: [
          { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::1234:root']] },
          { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::5678:root']] }
        ]
      }
    });
  });

  describe('hasResource', () => {
    test('false if there are no resources', () => {
      expect(new PolicyStatement().hasResource).toEqual(false);
    });

    test('true if there is one resource', () => {
      expect(new PolicyStatement({ resources: ['one-resource'] }).hasResource).toEqual(true);
    });

    test('true for multiple resources', () => {
      const p = new PolicyStatement();
      p.addResources('r1');
      p.addResources('r2');
      expect(p.hasResource).toEqual(true);
    });
  });

  describe('hasPrincipal', () => {
    test('false if there is no principal', () => {
      expect(new PolicyStatement().hasPrincipal).toEqual(false);
    });

    test('true if there is a principal', () => {
      const p = new PolicyStatement();
      p.addArnPrincipal('bla');
      expect(p.hasPrincipal).toEqual(true);
    });

    test('true if there is a notPrincipal', () => {
      const p = new PolicyStatement();
      p.addNotPrincipals(new CanonicalUserPrincipal('test'));
      expect(p.hasPrincipal).toEqual(true);
    });
  });

  test('statementCount returns the number of statement in the policy document', () => {
    const p = new PolicyDocument();
    expect(p.statementCount).toEqual(0);
    p.addStatements(new PolicyStatement({ actions: ['service:action1'] }));
    expect(p.statementCount).toEqual(1);
    p.addStatements(new PolicyStatement({ actions: ['service:action2'] }));
    expect(p.statementCount).toEqual(2);
  });

  describe('{ AWS: "*" } principal', () => {
    test('is represented as `Anyone`', () => {
      const stack = new Stack();
      const p = new PolicyDocument();

      p.addStatements(new PolicyStatement({ principals: [new Anyone()] }));

      expect(stack.resolve(p)).toEqual({
        Statement: [
          { Effect: 'Allow', Principal: '*' }
        ],
        Version: '2012-10-17'
      });
    });

    test('is represented as `AnyPrincipal`', () => {
      const stack = new Stack();
      const p = new PolicyDocument();

      p.addStatements(new PolicyStatement({ principals: [new AnyPrincipal()] }));

      expect(stack.resolve(p)).toEqual({
        Statement: [
          { Effect: 'Allow', Principal: '*' }
        ],
        Version: '2012-10-17'
      });
    });

    test('is represented as `addAnyPrincipal`', () => {
      const stack = new Stack();
      const p = new PolicyDocument();

      const s = new PolicyStatement();
      s.addAnyPrincipal();
      p.addStatements(s);

      expect(stack.resolve(p)).toEqual({
        Statement: [
          { Effect: 'Allow', Principal: '*' }
        ],
        Version: '2012-10-17'
      });
    });
  });

  test('addResources() will not break a list-encoded Token', () => {
    const stack = new Stack();

    const statement = new PolicyStatement();
    statement.addActions(...Lazy.listValue({ produce: () => ['a', 'b', 'c'] }));
    statement.addResources(...Lazy.listValue({ produce: () => ['x', 'y', 'z'] }));

    expect(stack.resolve(statement.toStatementJson())).toEqual({
      Effect: 'Allow',
      Action: ['a', 'b', 'c'],
      Resource: ['x', 'y', 'z'],
    });
  });

  test('addCanonicalUserPrincipal can be used to add cannonical user principals', () => {
    const stack = new Stack();
    const p = new PolicyDocument();

    const s1 = new PolicyStatement();
    s1.addCanonicalUserPrincipal('cannonical-user-1');

    const s2 = new PolicyStatement();
    s2.addPrincipals(new CanonicalUserPrincipal('cannonical-user-2'));

    p.addStatements(s1);
    p.addStatements(s2);

    expect(stack.resolve(p)).toEqual({
      Statement: [
        { Effect: 'Allow', Principal: { CanonicalUser: 'cannonical-user-1' } },
        { Effect: 'Allow', Principal: { CanonicalUser: 'cannonical-user-2' } }
      ],
      Version: '2012-10-17'
    });
  });

  test('addPrincipal correctly merges array in', () => {
    const stack = new Stack();
    const arrayPrincipal: IPrincipal = {
      get grantPrincipal() { return this; },
      assumeRoleActions: ['sts:AssumeRole'],
      policyFragment: new PrincipalPolicyFragment({ AWS: ['foo', 'bar'] }),
      addToPolicy() { return false; }
    };
    const s = new PolicyStatement();
    s.addAccountRootPrincipal();
    s.addPrincipals(arrayPrincipal);
    expect(stack.resolve(s.toStatementJson())).toEqual({
      Effect: 'Allow',
      Principal: {
        AWS: [
          { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
          'foo', 'bar'
        ]
      }
    });
  });

  // https://github.com/aws/aws-cdk/issues/1201
  test('policy statements with multiple principal types can be created using multiple addPrincipal calls', () => {
    const stack = new Stack();
    const s = new PolicyStatement();
    s.addArnPrincipal('349494949494');
    s.addServicePrincipal('test.service');
    s.addResources('resource');
    s.addActions('action');

    expect(stack.resolve(s.toStatementJson())).toEqual({
      Action: 'action',
      Effect: 'Allow',
      Principal: { AWS: '349494949494', Service: 'test.service' },
      Resource: 'resource'
    });
  });

  describe('Service principals', () => {
    test('regional service principals resolve appropriately', () => {
      const stack = new Stack(undefined, undefined, { env: { region: 'cn-north-1' } });
      const s = new PolicyStatement();
      s.addActions('test:Action');
      s.addServicePrincipal('codedeploy.amazonaws.com');

      expect(stack.resolve(s.toStatementJson())).toEqual({
        Effect: 'Allow',
        Action: 'test:Action',
        Principal: { Service: 'codedeploy.cn-north-1.amazonaws.com.cn' }
      });
    });

    test('regional service principals resolve appropriately (with user-set region)', () => {
      const stack = new Stack(undefined, undefined, { env: { region: 'cn-northeast-1' } });
      const s = new PolicyStatement();
      s.addActions('test:Action');
      s.addServicePrincipal('codedeploy.amazonaws.com', { region: 'cn-north-1' });

      expect(stack.resolve(s.toStatementJson())).toEqual({
        Effect: 'Allow',
        Action: 'test:Action',
        Principal: { Service: 'codedeploy.cn-north-1.amazonaws.com.cn' }
      });
    });

    test('obscure service principals resolve to the user-provided value', () => {
      const stack = new Stack(undefined, undefined, { env: { region: 'cn-north-1' } });
      const s = new PolicyStatement();
      s.addActions('test:Action');
      s.addServicePrincipal('test.service-principal.dev');

      expect(stack.resolve(s.toStatementJson())).toEqual({
        Effect: 'Allow',
        Action: 'test:Action',
        Principal: { Service: 'test.service-principal.dev' }
      });
    });
  });

  describe('CompositePrincipal can be used to represent a principal that has multiple types', () => {

    test('with a single principal', () => {
      const stack = new Stack();
      const p = new CompositePrincipal(new ArnPrincipal('i:am:an:arn'));
      const statement = new PolicyStatement();
      statement.addPrincipals(p);
      expect(stack.resolve(statement.toStatementJson())).toEqual({ Effect: 'Allow', Principal: { AWS: 'i:am:an:arn' } });
    });

    test('conditions are not allowed on individual principals of a composite', () => {
      const p = new CompositePrincipal(new ArnPrincipal('i:am'));
      expect(() => p.addPrincipals(new FederatedPrincipal('federated', { condition: 1 })))
        .toThrow(/Components of a CompositePrincipal must not have conditions/);
    });

    test('principals and conditions are a big nice merge', () => {
      const stack = new Stack();
      // add via ctor
      const p = new CompositePrincipal(
        new ArnPrincipal('i:am:an:arn'),
        new ServicePrincipal('amazon.com'));

      // add via `addPrincipals` (with condition)
      p.addPrincipals(
        new Anyone(),
        new ServicePrincipal('another.service')
      );

      const statement = new PolicyStatement();
      statement.addPrincipals(p);

      // add via policy statement
      statement.addArnPrincipal('aws-principal-3');
      statement.addCondition('cond2', { boom: 123 });

      expect(stack.resolve(statement.toStatementJson())).toEqual({
        Condition: {
          cond2: { boom: 123 }
        },
        Effect: 'Allow',
        Principal: {
          AWS: [ 'i:am:an:arn', '*', 'aws-principal-3' ],
          Service: [ 'amazon.com', 'another.service' ],
        }
      });
    });

    test('cannot mix types of assumeRoleAction in a single composite', () => {
      // GIVEN
      const p = new CompositePrincipal(new ArnPrincipal('arn')); // assumeRoleAction is "sts:AssumeRule"

      // THEN
      expect(() => p.addPrincipals(new FederatedPrincipal('fed', {}, ['sts:Boom'])))
       .toThrow(/Cannot add multiple principals with different "assumeRoleAction". Expecting "sts:AssumeRole", got "sts:Boom"/);
    });
  });

  describe('duplicate statements', () => {

    test('without tokens', () => {
      // GIVEN
      const stack = new Stack();
      const p = new PolicyDocument();

      const statement = new PolicyStatement();
      statement.addResources('resource1', 'resource2');
      statement.addActions('action1', 'action2');
      statement.addServicePrincipal('service');
      statement.addConditions({
          a: {
            b: 'c'
          },
          d: {
            e: 'f'
          }
        });

      // WHEN
      p.addStatements(statement);
      p.addStatements(statement);
      p.addStatements(statement);

      // THEN
      expect(stack.resolve(p).Statement).toHaveLength(1);
    });

    test('with tokens', () => {
      // GIVEN
      const stack = new Stack();
      const p = new PolicyDocument();

      const statement1 = new PolicyStatement();
      statement1.addResources(Lazy.stringValue({ produce: () => 'resource' }));
      statement1.addActions(Lazy.stringValue({ produce: () => 'action' }));

      const statement2 = new PolicyStatement();
      statement2.addResources(Lazy.stringValue({ produce: () => 'resource' }));
      statement2.addActions(Lazy.stringValue({ produce: () => 'action' }));

      // WHEN
      p.addStatements(statement1);
      p.addStatements(statement2);

      // THEN
      expect(stack.resolve(p).Statement).toHaveLength(1);
    });
  });

  test('autoAssignSids enables auto-assignment of a unique SID for each statement', () => {
    // GIVEN
    const doc = new PolicyDocument({
      assignSids: true
    });

    // WHEN
    doc.addStatements(new PolicyStatement({ actions: ['service:action1'], resources: ['resource1']}));
    doc.addStatements(new PolicyStatement({ actions: ['service:action1'], resources: ['resource1']}));
    doc.addStatements(new PolicyStatement({ actions: ['service:action1'], resources: ['resource1']}));
    doc.addStatements(new PolicyStatement({ actions: ['service:action1'], resources: ['resource1']}));
    doc.addStatements(new PolicyStatement({ actions: ['service:action2'], resources: ['resource2']}));

    // THEN
    const stack = new Stack();
    expect(stack.resolve(doc)).toEqual({
      Version: '2012-10-17',
      Statement: [
        { Action: 'service:action1', Effect: 'Allow', Resource: 'resource1', Sid: '0' },
        { Action: 'service:action2', Effect: 'Allow', Resource: 'resource2', Sid: '1' }
      ],
    });
  });

  test('constructor args are equivalent to mutating in-place', () => {
    const stack = new Stack();

    const s = new PolicyStatement();
    s.addActions('service:action1', 'service:action2');
    s.addAllResources();
    s.addArnPrincipal('arn');
    s.addCondition('key', { equals: 'value' });

    const doc1 = new PolicyDocument();
    doc1.addStatements(s);

    const doc2 = new PolicyDocument();
    doc2.addStatements(new PolicyStatement({
      actions: ['service:action1', 'service:action2'],
      resources: ['*'],
      principals: [new ArnPrincipal('arn')],
      conditions: {
        key: { equals: 'value' }
      }
    }));

    expect(stack.resolve(doc1)).toEqual(stack.resolve(doc2));
  });
});
