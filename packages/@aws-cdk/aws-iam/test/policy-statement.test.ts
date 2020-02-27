import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import { PolicyDocument, PolicyStatement } from '../lib';

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

    test('parses a given arnPrincipal', () => {
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

    test('parses a given anyPrincipal', () => {
      const stack = new Stack();

      const s = new PolicyStatement();
      s.addActions('service:action1', 'service:action2');
      s.addAllResources();
      s.addAnyPrincipal();
      s.addCondition('key', { equals: 'value' });

      const doc1 = new PolicyDocument();
      doc1.addStatements(s);

      const doc2 = PolicyDocument.fromJson(doc1.toJSON());

      expect(stack.resolve(doc2)).toEqual(stack.resolve(doc1));

    });

    test('parses an awsAccountPrincipal', () => {
      const stack = new Stack();

      const s = new PolicyStatement();
      s.addActions('service:action1', 'service:action2');
      s.addAllResources();
      s.addAwsAccountPrincipal('someaccountid');
      s.addCondition('key', { equals: 'value' });

      const doc1 = new PolicyDocument();
      doc1.addStatements(s);

      const doc2 = PolicyDocument.fromJson(doc1.toJSON());

      expect(stack.resolve(doc2)).toEqual(stack.resolve(doc1));

    });

    test('parses a given canonicalUserPrincipal', () => {
      const stack = new Stack();

      const s = new PolicyStatement();
      s.addActions('service:action1', 'service:action2');
      s.addAllResources();
      s.addCanonicalUserPrincipal('someconnonicaluser');
      s.addCondition('key', { equals: 'value' });

      const doc1 = new PolicyDocument();
      doc1.addStatements(s);

      const doc2 = PolicyDocument.fromJson(doc1.toJSON());

      expect(stack.resolve(doc2)).toEqual(stack.resolve(doc1));

    });

    test('parses a given federatedPrincipal', () => {
      const stack = new Stack();

      const s = new PolicyStatement();
      s.addActions('service:action1', 'service:action2');
      s.addAllResources();
      s.addFederatedPrincipal('federated', {});
      s.addCondition('key', { equals: 'value' });

      const doc1 = new PolicyDocument();
      doc1.addStatements(s);

      const doc2 = PolicyDocument.fromJson(doc1.toJSON());

      expect(stack.resolve(doc2)).toEqual(stack.resolve(doc1));

    });

    test('parses a given servicePrincipal', () => {
      const stack = new Stack();

      const s = new PolicyStatement();
      s.addActions('service:action1', 'service:action2');
      s.addAllResources();
      s.addServicePrincipal('serviceprincipal', { conditions: { one: "two" }, region: 'us-west-2' });
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

  });

});
