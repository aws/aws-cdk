import { Event } from '../lib';
import { handler } from '../lib/eval-nodejs-handler';

test('with numbers', async () => {
  // GIVEN
  const event: Event = {
    expression: '$.a + $.b',
    expressionAttributeValues: {
      '$.a': 4,
      '$.b': 5,
    },
  };

  // THEN
  const evaluated = await handler(event);
  expect(evaluated).toBe(9);
});

test('with strings', async () => {
  // GIVEN
  const event: Event = {
    expression: '`${$.a} ${$.b}`',
    expressionAttributeValues: {
      '$.a': 'Hello',
      '$.b': 'world!',
    },
  };

  // THEN
  const evaluated = await handler(event);
  expect(evaluated).toBe('Hello world!');
});

test('with lists', async () => {
  // GIVEN
  const event: Event = {
    expression: '$.a.map(x => x * 2)',
    expressionAttributeValues: {
      '$.a': [1, 2, 3],
    },
  };

  // THEN
  const evaluated = await handler(event);
  expect(evaluated).toEqual([2, 4, 6]);
});

test('with objects', async () => {
  // GIVEN
  const event: Event = {
    expression: '`${($.a).a} ${($.a).b}`',
    expressionAttributeValues: {
      '$.a': { a: 'Hello', b: 'world!' },
    },
  };

  // THEN
  const evaluated = await handler(event);
  expect(evaluated).toEqual('Hello world!');
});

test('with duplicated entries', async () => {
  // GIVEN
  const event: Event = {
    expression: '$.a + $.a',
    expressionAttributeValues: {
      '$.a': 1,
    },
  };

  // THEN
  const evaluated = await handler(event);
  expect(evaluated).toBe(2);
});

test('with dash and underscore in path', async () => {
  // GIVEN
  const event: Event = {
    expression: '$.a_b + $.c-d + $[_e]',
    expressionAttributeValues: {
      '$.a_b': 1,
      '$.c-d': 2,
      '$[_e]': 3,
    },
  };

  // THEN
  const evaluated = await handler(event);
  expect(evaluated).toBe(6);
});

test('with whole State or Context', async () => {
  // GIVEN
  const event: Event = {
    expression: '`${($).optional?.parameter ?? "Default"} ${($$).Task?.Token ?? "No token"}`',
    expressionAttributeValues: {
      $: { optional: { parameter: 'Value' } },
      $$: { Execution: { Id: 'id' } },
    },
  };

  // THEN
  const evaluated = await handler(event);
  expect(evaluated).toEqual('Value No token');
});
