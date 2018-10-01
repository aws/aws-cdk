import { Test } from 'nodeunit';
import { CanonicalUserPrincipal, FnConcat, PolicyDocument, PolicyStatement, resolve } from '../../lib';

export = {
  'the Permission class is a programming model for iam'(test: Test) {
    const p = new PolicyStatement();
    p.addAction('sqs:SendMessage');
    p.addActions('dynamodb:CreateTable', 'dynamodb:DeleteTable');
    p.addResource('myQueue');
    p.addResource('yourQueue');

    p.addAllResources();
    p.addAwsAccountPrincipal(new FnConcat('my', 'account', 'name').toString());
    p.limitToAccount('12221121221');

    test.deepEqual(resolve(p), { Action:
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
            ':iam::',
            { 'Fn::Join': [ '', [ 'my', 'account', 'name' ] ] },
            ':root' ] ] } },
       Condition: { StringEquals: { 'sts:ExternalId': '12221121221' } } });

    test.done();
  },

  'the PolicyDocument class is a dom for iam policy documents'(test: Test) {
    const doc = new PolicyDocument();
    const p1 = new PolicyStatement();
    p1.addAction('sqs:SendMessage');
    p1.addResource('*');

    const p2 = new PolicyStatement();
    p2.deny();
    p2.addActions('cloudformation:CreateStack');

    doc.addStatement(p1);
    doc.addStatement(p2);

    test.deepEqual(resolve(doc), {
      Version: '2012-10-17',
      Statement:
        [ { Effect: 'Allow', Action: 'sqs:SendMessage', Resource: '*' },
          { Effect: 'Deny', Action: 'cloudformation:CreateStack' } ] });

    test.done();
  },

  'A PolicyDocument can be initialized with an existing policy, which is merged upon serialization'(test: Test) {
    const base = {
      Version: 'Foo',
      Something: 123,
      Statement: [
        { Statement1: 1 },
        { Statement2: 2 }
      ]
    };
    const doc = new PolicyDocument(base);
    doc.addStatement(new PolicyStatement().addResource('resource').addAction('action'));

    test.deepEqual(resolve(doc), { Version: 'Foo',
    Something: 123,
    Statement:
     [ { Statement1: 1 },
       { Statement2: 2 },
       { Effect: 'Allow', Action: 'action', Resource: 'resource' } ] });
    test.done();
  },

  'Permission allows specifying multiple actions upon construction'(test: Test) {
    const perm = new PolicyStatement().addResource('MyResource').addActions('Action1', 'Action2', 'Action3');
    test.deepEqual(resolve(perm), {
      Effect: 'Allow',
      Action: [ 'Action1', 'Action2', 'Action3' ],
      Resource: 'MyResource' });
    test.done();
  },

  'PolicyDoc resolves to undefined if there are no permissions'(test: Test) {
    const p = new PolicyDocument();
    test.deepEqual(resolve(p), undefined);
    test.done();
  },

  'canonicalUserPrincipal adds a principal to a policy with the passed canonical user id'(test: Test) {
    const p = new PolicyStatement();
    const canoncialUser = "averysuperduperlongstringfor";
    p.addPrincipal(new CanonicalUserPrincipal(canoncialUser));
    test.deepEqual(resolve(p), {
      Effect: "Allow",
      Principal: {
        CanonicalUser: canoncialUser
      }
    });
    test.done();
  },

  'addAccountRootPrincipal adds a principal with the current account root'(test: Test) {
    const p = new PolicyStatement();
    p.addAccountRootPrincipal();
    test.deepEqual(resolve(p), {
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
    const p = new PolicyStatement();
    p.addFederatedPrincipal("com.amazon.cognito", { StringEquals: { key: 'value' }});
    test.deepEqual(resolve(p), {
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
    p.addStatement(new PolicyStatement());
    test.equal(p.statementCount, 1);
    p.addStatement(new PolicyStatement());
    test.equal(p.statementCount, 2);
    test.done();
  }
};
