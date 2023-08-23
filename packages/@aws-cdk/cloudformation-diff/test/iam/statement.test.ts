import * as fc from 'fast-check';
import { parseLambdaPermission, renderCondition, Statement } from '../../lib/iam/statement';
import { arbitraryStatement, twoArbitraryStatements } from '../test-arbitraries';

test('can parse all positive fields', () => {
  const statement = new Statement({
    Sid: 'Sid',
    Effect: 'Allow',
    Resource: ['resource'],
    Action: ['action'],
    Principal: [{ AWS: 'arn' }],
    Condition: { StringEquals: { 'Amzn-This': 'That' } },
  });

  expect(statement.sid).toEqual('Sid');
  expect(statement.effect).toEqual('Allow');
  expect(statement.resources.values).toEqual(['resource']);
  expect(statement.actions.values).toEqual(['action']);
  expect(statement.principals.values).toEqual(['AWS:arn']);
  expect(statement.condition).toEqual({ StringEquals: { 'Amzn-This': 'That' } });

  expect(statement.resources.not).toBe(false);
  expect(statement.actions.not).toBe(false);
  expect(statement.principals.not).toBe(false);
});

test('parses strings as singleton lists', () => {
  const statement = new Statement({
    Resource: 'resource',
  });

  expect(statement.resources.values).toEqual(['resource']);
});

test('correctly parses NotFields', () => {
  const statement = new Statement({
    NotResource: ['resource'],
    NotAction: ['action'],
    NotPrincipal: [{ AWS: 'arn' }],
  });

  expect(statement.resources.not).toBe(true);
  expect(statement.actions.not).toBe(true);
  expect(statement.principals.not).toBe(true);
});

test('parse all LambdaPermission fields', () => {
  const statement = parseLambdaPermission({
    Action: 'lambda:CallMeMaybe',
    FunctionName: 'Function',
    Principal: '*',
    SourceAccount: '123456789012',
    SourceArn: 'arn',
  });

  expect(statement.actions.values).toEqual(['lambda:CallMeMaybe']);
  expect(statement.resources.values).toEqual(['Function']);
  expect(statement.principals.values).toEqual(['*']);
  expect(statement.condition).toEqual({
    ArnLike: { 'AWS:SourceArn': 'arn' },
    StringEquals: { 'AWS:SourceAccount': '123456789012' },
  });
});

test('parse lambda eventsourcetoken', () => {
  const statement = parseLambdaPermission({
    Action: 'lambda:CallMeMaybe',
    FunctionName: 'Function',
    EventSourceToken: 'token',
    Principal: '*',
  });

  expect(statement.condition).toEqual({
    StringEquals: { 'lambda:EventSourceToken': 'token' },
  });
});

test('stringify complex condition', () => {
  // WHEN
  const stringified = renderCondition({
    StringEquals: { 'AWS:SourceAccount': '${AWS::AccountId}' },
    ArnLike: { 'AWS:SourceArn': '${MyBucket.Arn}' },
  }).split('\n');

  // THEN
  expect(stringified).toEqual([
    '"StringEquals": {',
    '  "AWS:SourceAccount": "${AWS::AccountId}"',
    '},',
    '"ArnLike": {',
    '  "AWS:SourceArn": "${MyBucket.Arn}"',
    '}',
  ]);
});

test('an Allow statement with a NotPrincipal is negative', () => {
  // WHEN
  const statement = new Statement({
    Effect: 'Allow',
    Resource: 'resource',
    NotPrincipal: { AWS: 'me' },
  });

  // THEN
  expect(statement.isNegativeStatement).toBe(true);
});

test('a Deny statement with a NotPrincipal is positive', () => {
  // In effect, this is a roundabout way of saying only the given Principal
  // should be allowed ("everyone who's not me can't do this").

  // WHEN
  const statement = new Statement({
    Effect: 'Deny',
    Resource: 'resource',
    NotPrincipal: { AWS: 'me' },
  });

  // THEN
  expect(statement.isNegativeStatement).toBe(false);
});

test('equality is reflexive', () => {
  fc.assert(fc.property(
    arbitraryStatement, (statement) => {
      return new Statement(statement).equal(new Statement(statement));
    },
  ));
});

test('equality is symmetric', () => {
  fc.assert(fc.property(
    twoArbitraryStatements, (s) => {
      const a = new Statement(s.statement1);
      const b = new Statement(s.statement2);

      fc.pre(a.equal(b));
      return b.equal(a);
    },
  ));
});
