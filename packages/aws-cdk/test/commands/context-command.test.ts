import { realHandler } from '../../lib/commands/context';
import { Configuration } from '../../lib/settings';

test('context reset can remove a context key', async () => {
  // GIVEN
  const configuration = new Configuration();
  configuration.context.set('foo', 'bar');
  configuration.context.set('baz', 'quux');

  expect(configuration.context.all).toEqual({
    foo: 'bar',
    baz: 'quux'
  });

  // WHEN
  await realHandler({
    configuration,
    args: { reset: 'foo' }
  } as any);

  // THEN
  expect(configuration.context.all).toEqual({
    baz: 'quux'
  });
});
