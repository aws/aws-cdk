import { Lazy, Stack, Token } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { Anyone, AnyPrincipal, CanonicalUserPrincipal, IPrincipal, PolicyDocument, PolicyStatement } from '../lib';
import { ArnPrincipal, CompositePrincipal, FederatedPrincipal, PrincipalPolicyFragment, ServicePrincipal } from '../lib';

export = {
  'the Permission class is a programming model for iam'(test: Test) {
    const stack = new Stack();

    const p = new PolicyStatement();
    p.addAction('sqs:SendMessage');
    p.addActions('dynamodb:CreateTable', 'dynamodb:DeleteTable');
    p.addResource('myQueue');
    p.addResource('yourQueue');

    p.addAllResources();
    p.addAwsAccountPrincipal(`my${Token.asString({ account: 'account' })}name`);
    p.limitToAccount('12221121221');

    test.deepEqual(stack.resolve(p), { Action:
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

    test.done();
  },

  'the PolicyDocument class is a dom for iam policy documents'(test: Test) {
    const stack = new Stack();
    const doc = new PolicyDocument();
    const p1 = new PolicyStatement();
    p1.addAction('sqs:SendMessage');
    p1.addResource('*');

    const p2 = new PolicyStatement();
    p2.deny();
    p2.addActions('cloudformation:CreateStack');

    doc.addStatements(p1);
    doc.addStatements(p2);

    test.deepEqual(stack.resolve(doc), {
      Version: '2012-10-17',
      Statement:
        [ { Effect: 'Allow', Action: 'sqs:SendMessage', Resource: '*' },
          { Effect: 'Deny', Action: 'cloudformation:CreateStack' } ] });

    test.done();
  },

  'Permission allows specifying multiple actions upon construction'(test: Test) {
    const stack = new Stack();
    const perm = new PolicyStatement().addResource('MyResource').addActions('Action1', 'Action2', 'Action3');
    test.deepEqual(stack.resolve(perm), {
      Effect: 'Allow',
      Action: [ 'Action1', 'Action2', 'Action3' ],
      Resource: 'MyResource' });
    test.done();
  },

  'PolicyDoc resolves to undefined if there are no permissions'(test: Test) {
    const stack = new Stack();
    const p = new PolicyDocument();
    test.deepEqual(stack.resolve(p), undefined);
    test.done();
  },

  'canonicalUserPrincipal adds a principal to a policy with the passed canonical user id'(test: Test) {
    const stack = new Stack();
    const p = new PolicyStatement();
    const canoncialUser = "averysuperduperlongstringfor";
    p.addPrincipal(new CanonicalUserPrincipal(canoncialUser));
    test.deepEqual(stack.resolve(p), {
      Effect: "Allow",
      Principal: {
        CanonicalUser: canoncialUser
      }
    });
    test.done();
  },

  'addAccountRootPrincipal adds a principal with the current account root'(test: Test) {
    const stack = new Stack();

    const p = new PolicyStatement();
    p.addAccountRootPrincipal();
    test.deepEqual(stack.resolve(p), {
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
    test.done();
  },

  'addFederatedPrincipal adds a Federated principal with the passed value'(test: Test) {
    const stack = new Stack();
    const p = new PolicyStatement();
    p.addFederatedPrincipal("com.amazon.cognito", { StringEquals: { key: 'value' }});
    test.deepEqual(stack.resolve(p), {
      Effect: "Allow",
      Principal: {
        Federated: "com.amazon.cognito"
      },
      Condition: {
        StringEquals: { key: 'value' }
      }
    });
    test.done();
  },

  'addAwsAccountPrincipal can be used multiple times'(test: Test) {
    const stack = new Stack();

    const p = new PolicyStatement();
    p.addAwsAccountPrincipal('1234');
    p.addAwsAccountPrincipal('5678');
    test.deepEqual(stack.resolve(p), {
      Effect: 'Allow',
      Principal: {
        AWS: [
          { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::1234:root']] },
          { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::5678:root']] }
        ]
      }
    });
    test.done();
  },

  'hasResource': {
    'false if there are no resources'(test: Test) {
      test.equal(new PolicyStatement().hasResource, false, 'hasResource should be false for an empty permission');
      test.done();
    },

    'true if there is one resource'(test: Test) {
      test.equal(
        new PolicyStatement().addResource('one-resource').hasResource,
        true,
        'hasResource is true when there is one resource');
      test.done();
    },

    'true for multiple resources'(test: Test) {
      const p = new PolicyStatement();
      p.addResource('r1');
      p.addResource('r2');
      test.equal(p.hasResource, true, 'hasResource is true when there are multiple resource');
      test.done();
    },
  },

  'hasPrincipal': {
    'false if there is no principal'(test: Test) {
      test.equal(new PolicyStatement().hasPrincipal, false);
      test.done();
    },

    'true if there is a principal'(test: Test) {
      const p = new PolicyStatement();
      p.addAwsPrincipal('bla');
      test.equal(p.hasPrincipal, true);
      test.done();
    }
  },

  'statementCount returns the number of statement in the policy document'(test: Test) {
    const p = new PolicyDocument();
    test.equal(p.statementCount, 0);
    p.addStatements(new PolicyStatement().addAction('action1'));
    test.equal(p.statementCount, 1);
    p.addStatements(new PolicyStatement().addAction('action2'));
    test.equal(p.statementCount, 2);
    test.done();
  },

  '{ AWS: "*" } principal': {
    'is represented as `Anyone`'(test: Test) {
      const stack = new Stack();
      const p = new PolicyDocument();

      p.addStatements(new PolicyStatement().addPrincipal(new Anyone()));

      test.deepEqual(stack.resolve(p), {
        Statement: [
          { Effect: 'Allow', Principal: '*' }
        ],
        Version: '2012-10-17'
      });
      test.done();
    },

    'is represented as `AnyPrincipal`'(test: Test) {
      const stack = new Stack();
      const p = new PolicyDocument();

      p.addStatements(new PolicyStatement().addPrincipal(new AnyPrincipal()));

      test.deepEqual(stack.resolve(p), {
        Statement: [
          { Effect: 'Allow', Principal: '*' }
        ],
        Version: '2012-10-17'
      });
      test.done();
    },

    'is represented as `addAnyPrincipal`'(test: Test) {
      const stack = new Stack();
      const p = new PolicyDocument();

      p.addStatements(new PolicyStatement().addAnyPrincipal());

      test.deepEqual(stack.resolve(p), {
        Statement: [
          { Effect: 'Allow', Principal: '*' }
        ],
        Version: '2012-10-17'
      });
      test.done();
    }
  },

  'addAwsPrincipal/addArnPrincipal are the aliases'(test: Test) {
    const stack = new Stack();
    const p = new PolicyDocument();

    p.addStatements(new PolicyStatement().addAwsPrincipal('111222-A'));
    p.addStatements(new PolicyStatement().addArnPrincipal('111222-B'));
    p.addStatements(new PolicyStatement().addPrincipal(new ArnPrincipal('111222-C')));

    test.deepEqual(stack.resolve(p), {
      Statement: [ {
        Effect: 'Allow', Principal: { AWS: '111222-A' } },
        { Effect: 'Allow', Principal: { AWS: '111222-B' } },
        { Effect: 'Allow', Principal: { AWS: '111222-C' } }
      ],
      Version: '2012-10-17'
    });

    test.done();
  },

  'addResources() will not break a list-encoded Token'(test: Test) {
    const stack = new Stack();

    const statement = new PolicyStatement()
      .addActions(...Lazy.listValue({ produce: () => ['a', 'b', 'c'] }))
      .addResources(...Lazy.listValue({ produce: () => ['x', 'y', 'z'] }));

    test.deepEqual(stack.resolve(statement), {
      Effect: 'Allow',
      Action: ['a', 'b', 'c'],
      Resource: ['x', 'y', 'z'],
    });

    test.done();
  },

  'addCanonicalUserPrincipal can be used to add cannonical user principals'(test: Test) {
    const stack = new Stack();
    const p = new PolicyDocument();

    p.addStatements(new PolicyStatement().addCanonicalUserPrincipal('cannonical-user-1'));
    p.addStatements(new PolicyStatement().addPrincipal(new CanonicalUserPrincipal('cannonical-user-2')));

    test.deepEqual(stack.resolve(p), {
      Statement: [
        { Effect: 'Allow', Principal: { CanonicalUser: 'cannonical-user-1' } },
        { Effect: 'Allow', Principal: { CanonicalUser: 'cannonical-user-2' } }
      ],
      Version: '2012-10-17'
    });

    test.done();
  },

  'addPrincipal correctly merges array in'(test: Test) {
    const stack = new Stack();
    const arrayPrincipal: IPrincipal = {
      get grantPrincipal() { return this; },
      assumeRoleAction: 'sts:AssumeRole',
      policyFragment: new PrincipalPolicyFragment({ AWS: ['foo', 'bar'] }),
      addToPolicy() { return false; }
    };
    const s = new PolicyStatement().addAccountRootPrincipal()
                                   .addPrincipal(arrayPrincipal);
    test.deepEqual(stack.resolve(s), {
      Effect: 'Allow',
      Principal: {
        AWS: [
          { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
          'foo', 'bar'
        ]
      }
    });
    test.done();
  },

  // https://github.com/awslabs/aws-cdk/issues/1201
  'policy statements with multiple principal types can be created using multiple addPrincipal calls'(test: Test) {
    const stack = new Stack();
    const s = new PolicyStatement()
      .addAwsPrincipal('349494949494')
      .addServicePrincipal('test.service')
      .addResource('resource')
      .addAction('action');

    test.deepEqual(stack.resolve(s), {
      Action: 'action',
      Effect: 'Allow',
      Principal: { AWS: '349494949494', Service: 'test.service' },
      Resource: 'resource'
    });

    test.done();
  },

  'Service principals': {
    'regional service principals resolve appropriately'(test: Test) {
      const stack = new Stack(undefined, undefined, { env: { region: 'cn-north-1' } });
      const s = new PolicyStatement()
        .addAction('test:Action')
        .addServicePrincipal('codedeploy.amazonaws.com');

      test.deepEqual(stack.resolve(s), {
        Effect: 'Allow',
        Action: 'test:Action',
        Principal: { Service: 'codedeploy.cn-north-1.amazonaws.com.cn' }
      });

      test.done();
    },

    'regional service principals resolve appropriately (with user-set region)'(test: Test) {
      const stack = new Stack(undefined, undefined, { env: { region: 'cn-northeast-1' } });
      const s = new PolicyStatement()
        .addAction('test:Action')
        .addServicePrincipal('codedeploy.amazonaws.com', { region: 'cn-north-1' });

      test.deepEqual(stack.resolve(s), {
        Effect: 'Allow',
        Action: 'test:Action',
        Principal: { Service: 'codedeploy.cn-north-1.amazonaws.com.cn' }
      });

      test.done();
    },

    'obscure service principals resolve to the user-provided value'(test: Test) {
      const stack = new Stack(undefined, undefined, { env: { region: 'cn-north-1' } });
      const s = new PolicyStatement()
        .addAction('test:Action')
        .addServicePrincipal('test.service-principal.dev');

      test.deepEqual(stack.resolve(s), {
        Effect: 'Allow',
        Action: 'test:Action',
        Principal: { Service: 'test.service-principal.dev' }
      });

      test.done();
    },
  },

  'CompositePrincipal can be used to represent a principal that has multiple types': {

    'with a single principal'(test: Test) {
      const stack = new Stack();
      const p = new CompositePrincipal(new ArnPrincipal('i:am:an:arn'));
      const statement = new PolicyStatement().addPrincipal(p);
      test.deepEqual(stack.resolve(statement), { Effect: 'Allow', Principal: { AWS: 'i:am:an:arn' } });
      test.done();
    },

    'conditions are not allowed on individual principals of a composite'(test: Test) {
      const p = new CompositePrincipal(new ArnPrincipal('i:am'));
      test.throws(() => p.addPrincipals(new FederatedPrincipal('federated', { condition: 1 })),
        /Components of a CompositePrincipal must not have conditions/);

      test.done();
    },

    'principals and conditions are a big nice merge'(test: Test) {
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

      const statement = new PolicyStatement().addPrincipal(p);

      // add via policy statement
      statement.addAwsPrincipal('aws-principal-3');
      statement.addCondition('cond2', { boom: 123 });

      test.deepEqual(stack.resolve(statement), {
        Condition: {
          cond2: { boom: 123 }
        },
        Effect: 'Allow',
        Principal: {
          AWS: [ 'i:am:an:arn', '*', 'aws-principal-3' ],
          Service: [ 'amazon.com', 'another.service' ],
        }
      });
      test.done();
    },

    'cannot mix types of assumeRoleAction in a single composite'(test: Test) {
      // GIVEN
      const p = new CompositePrincipal(new ArnPrincipal('arn')); // assumeRoleAction is "sts:AssumeRule"

      // THEN
      test.throws(() => p.addPrincipals(new FederatedPrincipal('fed', {}, 'sts:Boom')),
        /Cannot add multiple principals with different "assumeRoleAction". Expecting "sts:AssumeRole", got "sts:Boom"/);

      test.done();
    }
  },

  'duplicate statements': {

    'without tokens'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const p = new PolicyDocument();

      const statement = new PolicyStatement()
        .addResources('resource1', 'resource2')
        .addActions('action1', 'action2')
        .addServicePrincipal('service')
        .addConditions({
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
      test.equal(stack.resolve(p).Statement.length, 1);
      test.done();
    },

    'with tokens'(test: Test) {
      // GIVEN
      const stack = new Stack();
      const p = new PolicyDocument();

      const statement1 = new PolicyStatement()
        .addResource(Lazy.stringValue({ produce: () => 'resource' }))
        .addAction(Lazy.stringValue({ produce: () => 'action' }));
      const statement2 = new PolicyStatement()
        .addResource(Lazy.stringValue({ produce: () => 'resource' }))
        .addAction(Lazy.stringValue({ produce: () => 'action' }));

      // WHEN
      p.addStatements(statement1);
      p.addStatements(statement2);

      // THEN
      test.equal(stack.resolve(p).Statement.length, 1);
      test.done();
    },

  },

  'autoAssignSids enables auto-assignment of a unique SID for each statement'(test: Test) {
    // GIVEN
    const doc = new PolicyDocument({
      assignSids: true
    });

    // WHEN
    doc.addStatements(new PolicyStatement().addAction('action1').addResource('resource1'));
    doc.addStatements(new PolicyStatement().addAction('action1').addResource('resource1'));
    doc.addStatements(new PolicyStatement().addAction('action1').addResource('resource1'));
    doc.addStatements(new PolicyStatement().addAction('action1').addResource('resource1'));
    doc.addStatements(new PolicyStatement().addAction('action2').addResource('resource2'));

    // THEN
    const stack = new Stack();
    test.deepEqual(stack.resolve(doc), {
      Version: '2012-10-17',
      Statement: [
        { Action: 'action1', Effect: 'Allow', Resource: 'resource1', Sid: '0' },
        { Action: 'action2', Effect: 'Allow', Resource: 'resource2', Sid: '1' }
      ],
    });
    test.done();
  }
};
