import { Stack } from '@aws-cdk/core';
import { AnyPrincipal, Group, PolicyDocument, PolicyStatement, Effect } from '../lib';

describe('IAM policy statement', () => {

  describe('from JSON', () => {
    test('parses with no principal', () => {
      // given
      const stack = new Stack();

      const s = new PolicyStatement();
      s.addActions('service:action1', 'service:action2');
      s.addAllResources();
      s.addCondition('key', { equals: 'value' });

      const doc1 = new PolicyDocument();
      doc1.addStatements(s);

      // when
      const doc2 = PolicyDocument.fromJson(doc1.toJSON());

      // then
      expect(stack.resolve(doc2)).toEqual(stack.resolve(doc1));
    });

    test('parses a given Principal', () => {
      const stack = new Stack();

      const s = new PolicyStatement();
      s.addActions('service:action1', 'service:action2');
      s.addAllResources();
      s.addArnPrincipal('somearn');
      s.addCondition('key', { equals: 'value' });

      const doc1 = new PolicyDocument();
      doc1.addStatements(s);

      const doc2 = PolicyDocument.fromJson(doc1.toJSON());

      expect(stack.resolve(doc2)).toEqual(stack.resolve(doc1));
    });

    test('should not convert `Principal: *` to `Principal: { AWS: * }`', () => {
      const stack = new Stack();
      const s = PolicyStatement.fromJson({
        Action: ['service:action1'],
        Principal: '*',
        Resource: '*',
      });

      const doc1 = new PolicyDocument();
      doc1.addStatements(s);

      const rendered = stack.resolve(doc1);

      expect(rendered).toEqual({
        Statement: [
          {
            Action: 'service:action1',
            Effect: 'Allow',
            Principal: '*',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      });
    });

    test('parses a given notPrincipal', () => {
      const stack = new Stack();

      const s = new PolicyStatement();
      s.addActions('service:action1', 'service:action2');
      s.addAllResources();
      s.addNotPrincipals(new AnyPrincipal());
      s.addCondition('key', { equals: 'value' });

      const doc1 = new PolicyDocument();
      doc1.addStatements(s);

      const doc2 = PolicyDocument.fromJson(doc1.toJSON());

      expect(stack.resolve(doc2)).toEqual(stack.resolve(doc1));

    });

    test('parses with notAction', () => {
      const stack = new Stack();

      const s = new PolicyStatement();
      s.addNotActions('service:action3');
      s.addAllResources();

      const doc1 = new PolicyDocument();
      doc1.addStatements(s);

      const doc2 = PolicyDocument.fromJson(doc1.toJSON());

      expect(stack.resolve(doc2)).toEqual(stack.resolve(doc1));

    });

    test('parses with notActions', () => {
      const stack = new Stack();

      const s = new PolicyStatement();
      s.addNotActions('service:action3', 'service:action4');
      s.addAllResources();

      const doc1 = new PolicyDocument();
      doc1.addStatements(s);

      const doc2 = PolicyDocument.fromJson(doc1.toJSON());

      expect(stack.resolve(doc2)).toEqual(stack.resolve(doc1));

    });

    test('parses with notResource', () => {
      const stack = new Stack();

      const s = new PolicyStatement();
      s.addActions('service:action3', 'service:action4');
      s.addNotResources('resource1');

      const doc1 = new PolicyDocument();
      doc1.addStatements(s);

      const doc2 = PolicyDocument.fromJson(doc1.toJSON());

      expect(stack.resolve(doc2)).toEqual(stack.resolve(doc1));

    });

    test('parses with notResources', () => {
      const stack = new Stack();

      const s = new PolicyStatement();
      s.addActions('service:action3', 'service:action4');
      s.addNotResources('resource1', 'resource2');

      const doc1 = new PolicyDocument();
      doc1.addStatements(s);

      const doc2 = PolicyDocument.fromJson(doc1.toJSON());

      expect(stack.resolve(doc2)).toEqual(stack.resolve(doc1));

    });

    test('the kitchen sink', () => {
      const stack = new Stack();

      const policyDocument = {
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'FirstStatement',
            Effect: 'Allow',
            Action: 'iam:ChangePassword',
            Resource: '*',
          },
          {
            Sid: 'SecondStatement',
            Effect: 'Allow',
            Action: 's3:ListAllMyBuckets',
            Resource: '*',
          },
          {
            Sid: 'ThirdStatement',
            Effect: 'Allow',
            Action: [
              's3:List*',
              's3:Get*',
            ],
            Resource: [
              'arn:aws:s3:::confidential-data',
              'arn:aws:s3:::confidential-data/*',
            ],
            Condition: { Bool: { 'aws:MultiFactorAuthPresent': 'true' } },
          },
        ],
      };

      const doc = PolicyDocument.fromJson(policyDocument);

      expect(stack.resolve(doc)).toEqual(policyDocument);
    });

    test('throws error with field data being object', () => {
      expect(() => {
        PolicyStatement.fromJson({
          Action: {},
        });
      }).toThrow(/Fields must be either a string or an array of strings/);
    });

    test('throws error with field data being array of non-strings', () => {
      expect(() => {
        PolicyStatement.fromJson({
          Action: [{}],
        });
      }).toThrow(/Fields must be either a string or an array of strings/);
    });
  });

  test('throws error when group is specified for \'Principal\' or \'NotPrincipal\'', () => {
    const stack = new Stack();
    const group = new Group(stack, 'groupId');
    const policyStatement = new PolicyStatement();

    expect(() => policyStatement.addPrincipals(group))
      .toThrow(/Cannot use an IAM Group as the 'Principal' or 'NotPrincipal' in an IAM Policy/);
    expect(() => policyStatement.addNotPrincipals(group))
      .toThrow(/Cannot use an IAM Group as the 'Principal' or 'NotPrincipal' in an IAM Policy/);
  });

  test('throws error when an invalid \'Action\' or \'NotAction\' is added', () => {
    const policyStatement = new PolicyStatement();
    const invalidAction = 'xyz';
    expect(() => policyStatement.addActions(invalidAction))
      .toThrow(`Action '${invalidAction}' is invalid. An action string consists of a service namespace, a colon, and the name of an action. Action names can include wildcards.`);
    expect(() => policyStatement.addNotActions(invalidAction))
      .toThrow(`Action '${invalidAction}' is invalid. An action string consists of a service namespace, a colon, and the name of an action. Action names can include wildcards.`);
  });

  test('multiple identical entries render to a scalar (instead of a singleton list)', () => {
    const stack = new Stack();
    const policyStatement = new PolicyStatement({
      actions: ['aws:Action'],
    });

    policyStatement.addResources('asdf');
    policyStatement.addResources('asdf');
    policyStatement.addResources('asdf');

    expect(stack.resolve(policyStatement.toStatementJson())).toEqual({
      Effect: 'Allow',
      Action: 'aws:Action',
      Resource: 'asdf',
    });
  });

  test('a frozen policy statement cannot be modified any more', () => {
    // GIVEN
    const statement = new PolicyStatement({
      actions: ['action:a'],
      resources: ['*'],
    });
    statement.freeze();

    // WHEN
    const modifications = [
      () => statement.sid = 'asdf',
      () => statement.effect = Effect.DENY,
      () => statement.addActions('abc:def'),
      () => statement.addNotActions('abc:def'),
      () => statement.addResources('*'),
      () => statement.addNotResources('*'),
      () => statement.addPrincipals(new AnyPrincipal()),
      () => statement.addNotPrincipals(new AnyPrincipal()),
      () => statement.addCondition('key', 'value'),
    ];

    for (const mod of modifications) {
      expect(mod).toThrow(/can no longer be modified/);
    }
  });
});
