import { Event } from '../lib';
import { handler } from '../lib/eval-nodejs10.x-handler';

test('with numbers', async () => {
  // GIVEN
  const event: Event = {
    expression: '$.a + $.b',
    expressionAttributeValues: {
      '$.a': 4,
      '$.b': 5
    }
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
      '$.b': 'world!'
    }
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
    }
  };

  // THEN
  const evaluated = await handler(event);
  expect(evaluated).toEqual([2, 4, 6]);
});
