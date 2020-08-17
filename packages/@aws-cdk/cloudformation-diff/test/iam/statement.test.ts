import * as fc from 'fast-check';
import { parseLambdaPermission, renderCondition, Statement } from '../../lib/iam/statement';

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

// We should be testing transitivity as well but it's too much code to generate
// arbitraries that satisfy the precondition enough times to be useful.

const arbitraryResource = fc.oneof(fc.constantFrom('*', 'arn:resource'));
const arbitraryAction = fc.constantFrom('*', 's3:*', 's3:GetObject', 's3:PutObject');
const arbitraryPrincipal = fc.oneof<any>(
  fc.constant(undefined),
  fc.constant('*'),
  fc.record({ AWS: fc.oneof(fc.string(), fc.constant('*')) }),
  fc.record({ Service: fc.string() }),
  fc.record({ Federated: fc.string() }),
);
const arbitraryCondition = fc.oneof(
  fc.constant(undefined),
  fc.constant({ StringEquals: { Key: 'Value' } }),
  fc.constant({ StringEquals: { Key: 'Value' }, NumberEquals: { Key: 5 } }),
);

const arbitraryStatement = fc.record({
  Sid: fc.oneof(fc.string(), fc.constant(undefined)),
  Effect: fc.constantFrom('Allow', 'Deny'),
  Resource: fc.array(arbitraryResource, 0, 2),
  NotResource: fc.boolean(),
  Action: fc.array(arbitraryAction, 1, 2),
  NotAction: fc.boolean(),
  Principal: fc.array(arbitraryPrincipal, 0, 2),
  NotPrincipal: fc.boolean(),
  Condition: arbitraryCondition,
}).map(record => {
  // This map() that shuffles keys is the easiest way to create variation between Action/NotAction etc.
  makeNot(record, 'Resource', 'NotResource');
  makeNot(record, 'Action', 'NotAction');
  makeNot(record, 'Principal', 'NotPrincipal');
  return record;
});

function makeNot(obj: any, key: string, notKey: string) {
  if (obj[notKey]) {
    obj[notKey] = obj[key];
    delete obj[key];
  } else {
    delete obj[notKey];
  }
}

/**
 * Two statements where one is a modification of the other
 *
 * This is to generate two statements that have a higher chance of being similar
 * than generating two arbitrary statements independently.
 */
const twoArbitraryStatements = fc.record({
  statement1: arbitraryStatement,
  statement2: arbitraryStatement,
  copySid: fc.boolean(),
  copyEffect: fc.boolean(),
  copyResource: fc.boolean(),
  copyAction: fc.boolean(),
  copyPrincipal: fc.boolean(),
  copyCondition: fc.boolean(),
}).map(op => {
  const original = op.statement1;
  const modified = Object.create(original, {});

  if (op.copySid) { modified.Sid = op.statement2.Sid; }
  if (op.copyEffect) { modified.Effect = op.statement2.Effect; }
  if (op.copyResource) { modified.Resource = op.statement2.Resource; modified.NotResource = op.statement2.NotResource; }
  if (op.copyAction) { modified.Action = op.statement2.Action; modified.NotAction = op.statement2.NotAction; }
  if (op.copyPrincipal) { modified.Principal = op.statement2.Principal; modified.NotPrincipal = op.statement2.NotPrincipal; }
  if (op.copyCondition) { modified.Condition = op.statement2.Condition; }

  return { statement1: original, statement2: modified };
});
