import { App, Stack } from '@aws-cdk/core';
import * as iam from '../lib';

const PRINCIPAL_ARN = 'arn:aws:iam::111111111:user/user-name';
const principal = new iam.ArnPrincipal(PRINCIPAL_ARN);

const PRINCIPAL_ARN2 = 'arn:aws:iam::111111111:role/role-name';
const principal2 = new iam.ArnPrincipal(PRINCIPAL_ARN2);

test("don't merge Deny statements", () => {
  assertNoMerge([
    new iam.PolicyStatement({
      effect: iam.Effect.DENY,
      resources: ['a'],
      actions: ['service:Action'],
      principals: [principal],
    }),
    new iam.PolicyStatement({
      effect: iam.Effect.DENY,
      resources: ['b'],
      actions: ['service:Action'],
      principals: [principal],
    }),
  ]);
});

test.each([
  ['resources', true],
  ['notResources', false],
] as Array<['resources' | 'notResources', boolean]>)
('merge %p statements: %p', (key, doMerge) => {
  assertMergedP(doMerge, [
    new iam.PolicyStatement({
      [key]: ['a'],
      actions: ['service:Action'],
      principals: [principal],
    }),
    new iam.PolicyStatement({
      [key]: ['b'],
      actions: ['service:Action'],
      principals: [principal],
    }),
  ], [
    {
      Effect: 'Allow',
      Resource: ['a', 'b'],
      Action: 'service:Action',
      Principal: { AWS: PRINCIPAL_ARN },
    },
  ]);
});

test.each([
  ['actions', true],
  ['notActions', false],
] as Array<['actions' | 'notActions', boolean]>)
('merge %p statements: %p', (key, doMerge) => {
  assertMergedP(doMerge, [
    new iam.PolicyStatement({
      resources: ['a'],
      [key]: ['service:Action1'],
      principals: [principal],
    }),
    new iam.PolicyStatement({
      resources: ['a'],
      [key]: ['service:Action2'],
      principals: [principal],
    }),
  ], [
    {
      Effect: 'Allow',
      Resource: 'a',
      Action: ['service:Action1', 'service:Action2'],
      Principal: { AWS: PRINCIPAL_ARN },
    },
  ]);
});

test.each([
  ['principals', true],
  ['notPrincipals', false],
] as Array<['principals' | 'notPrincipals', boolean]>)
('merge %p statements: %p', (key, doMerge) => {
  assertMergedP(doMerge, [
    new iam.PolicyStatement({
      resources: ['a'],
      actions: ['service:Action'],
      [key]: [principal],
    }),
    new iam.PolicyStatement({
      resources: ['a'],
      actions: ['service:Action'],
      [key]: [principal2],
    }),
  ], [
    {
      Effect: 'Allow',
      Resource: 'a',
      Action: 'service:Action',
      Principal: { AWS: [PRINCIPAL_ARN, PRINCIPAL_ARN2].sort() },
    },
  ]);
});

test('merge multiple types of principals', () => {
  assertMerged([
    new iam.PolicyStatement({
      resources: ['a'],
      actions: ['service:Action'],
      principals: [principal],
    }),
    new iam.PolicyStatement({
      resources: ['a'],
      actions: ['service:Action'],
      principals: [new iam.ServicePrincipal('service.amazonaws.com')],
    }),
  ], [
    {
      Effect: 'Allow',
      Resource: 'a',
      Action: 'service:Action',
      Principal: {
        AWS: PRINCIPAL_ARN,
        Service: 'service.amazonaws.com',
      },
    },
  ]);
});

test('multiple mergeable keys are not merged', () => {
  assertNoMerge([
    new iam.PolicyStatement({
      resources: ['a'],
      actions: ['service:Action1'],
      principals: [principal],
    }),
    new iam.PolicyStatement({
      resources: ['b'],
      actions: ['service:Action2'],
      principals: [principal],
    }),
  ]);
});

test('if conditions are different statements are not merged', () => {
  assertNoMerge([
    new iam.PolicyStatement({
      resources: ['a'],
      actions: ['service:Action'],
      principals: [principal],
      conditions: {
        StringLike: {
          something: 'value',
        },
      },
    }),
    new iam.PolicyStatement({
      resources: ['b'],
      actions: ['service:Action'],
      principals: [principal],
    }),
  ]);
});

test('merges 3 statements in multiple steps', () => {
  assertMerged([
    new iam.PolicyStatement({
      resources: ['a'],
      actions: ['service:Action'],
      principals: [principal],
    }),
    new iam.PolicyStatement({
      resources: ['b'],
      actions: ['service:Action'],
      principals: [principal],
    }),
    // This can combine with the previous two once they have been merged
    new iam.PolicyStatement({
      resources: ['a', 'b'],
      actions: ['service:Action2'],
      principals: [principal],
    }),
  ], [
    {
      Effect: 'Allow',
      Resource: ['a', 'b'],
      Action: ['service:Action', 'service:Action2'],
      Principal: { AWS: PRINCIPAL_ARN },
    },
  ]);
});

function assertNoMerge(statements: iam.PolicyStatement[]) {
  const app = new App();
  const stack = new Stack(app, 'Stack');

  const regularResult = stack.resolve(new iam.PolicyDocument({ minimize: false, statements }));
  const minResult = stack.resolve(new iam.PolicyDocument({ minimize: true, statements }));

  expect(minResult).toEqual(regularResult);
}

function assertMerged(statements: iam.PolicyStatement[], expected: any[]) {
  const app = new App();
  const stack = new Stack(app, 'Stack');

  const minResult = stack.resolve(new iam.PolicyDocument({ minimize: true, statements }));

  expect(minResult.Statement).toEqual(expected);
}

function assertMergedP(doMerge: boolean, statements: iam.PolicyStatement[], expected: any[]) {
  return doMerge ? assertMerged(statements, expected) : assertNoMerge(statements);
}