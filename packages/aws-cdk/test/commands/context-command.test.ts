import { realHandler } from '../../lib/commands/context';
import { Configuration } from '../../lib/settings';

test('context list', async() => {
  // GIVEN
  const configuration = new Configuration();
  configuration.context.set('foo', 'bar');

  expect(configuration.context.all).toEqual({
    foo: 'bar',
  });

  // WHEN
  await realHandler({
    configuration,
    args: {},
  } as any);
});

test('context reset can remove a context key', async () => {
  // GIVEN
  const configuration = new Configuration();
  configuration.context.set('foo', 'bar');
  configuration.context.set('baz', 'quux');

  expect(configuration.context.all).toEqual({
    foo: 'bar',
    baz: 'quux',
  });

  // WHEN
  await realHandler({
    configuration,
    args: { reset: 'foo' },
  } as any);

  // THEN
  expect(configuration.context.all).toEqual({
    baz: 'quux',
  });
});

test('context reset can remove a context key using number', async () => {
  // GIVEN
  const configuration = new Configuration();
  configuration.context.set('foo', 'bar');
  configuration.context.set('baz', 'quux');

  expect(configuration.context.all).toEqual({
    foo: 'bar',
    baz: 'quux',
  });

  // WHEN
  await realHandler({
    configuration,
    args: { reset: '1' },
  } as any);

  // THEN
  expect(configuration.context.all).toEqual({
    foo: 'bar',
  });
});
