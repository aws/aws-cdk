/**
 * patch set testing
 */

import { evaluatePatchSet, PatchSet } from '../build-tools/patch-set';

function evaluate(p: PatchSet) {
  return evaluatePatchSet(p, { quiet: true });
}

test('can combine two independent records', () => {
  expect(evaluate({
    '001': {
      type: 'fragment',
      data: { a: 'a' },
    },
    '002': {
      type: 'fragment',
      data: { b: 'b' },
    },
  })).toEqual({
    a: 'a',
    b: 'b',
  });
});

test('can combine two records with same value', () => {
  expect(evaluate({
    '001': {
      type: 'fragment',
      data: { a: 'a', b: 'b' },
    },
    '002': {
      type: 'fragment',
      data: { b: 'b', c: 'c' },
    },
  })).toEqual({
    a: 'a',
    b: 'b',
    c: 'c',
  });
});

test('cannot combine two records with conflicting values', () => {
  expect(() => evaluate({
    '001': {
      type: 'fragment',
      data: { a: 'a' },
    },
    '002': {
      type: 'fragment',
      data: { a: 'x' },
    },
  })).toThrow(/Conflict/);
});

test('can apply json patches to records', () => {
  expect(evaluate({
    '001': {
      type: 'fragment',
      data: { a: 'a' },
    },
    '002': {
      type: 'patch',
      data: {
        patch: {
          operations: [{
            op: 'move',
            from: '/a',
            path: '/b',
          }],
        },
      },
    },
  })).toEqual({
    b: 'a',
  });
});

test('can apply json patches in nested context', () => {
  expect(evaluate({
    '001': {
      type: 'fragment',
      data: { nested: { a: 'a' } },
    },
    '002': {
      type: 'patch',
      data: {
        nested: {
          patch: {
            operations: [{
              op: 'move',
              from: '/a',
              path: '/b',
            }],
          },
        },
      },
    },
  })).toEqual({
    nested: { b: 'a' },
  });
});

test('relative json patch paths can reference from the root', () => {
  expect(evaluate({
    '001': {
      type: 'fragment',
      data: { a: 'a', nested: { b: 'b' } },
    },
    '002': {
      type: 'patch',
      data: {
        nested: {
          patch: {
            operations: [{
              op: 'move',
              from: '$/a',
              path: '/a',
            }],
          },
        },
      },
    },
  })).toEqual({
    nested: { a: 'a', b: 'b' },
  });
});

test('can nest sub-patch sets', () => {
  expect(evaluate({
    '001': {
      type: 'fragment',
      data: { a: 'a' },
    },
    '002': {
      type: 'set',
      sources: {
        '001': {
          type: 'fragment',
          data: { b: 'b' },
        },
        '002': {
          type: 'fragment',
          data: { c: 'c' },
        },
      },
    },
  })).toEqual({
    a: 'a',
    b: 'b',
    c: 'c',
  });
});