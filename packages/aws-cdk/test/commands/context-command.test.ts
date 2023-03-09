import { realHandler } from '../../lib/commands/context';
import { Configuration, Settings, Context } from '../../lib/settings';

describe('context --list', () => {
  test('runs', async() => {
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
});

describe('context --reset', () => {
  test('can remove a context key', async () => {
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

  test('can remove a context key using number', async () => {
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


  test('can reset matched pattern', async () => {
    // GIVEN
    const configuration = new Configuration();
    configuration.context.set('foo', 'bar');
    configuration.context.set('match-a', 'baz');
    configuration.context.set('match-b', 'qux');

    expect(configuration.context.all).toEqual({
      'foo': 'bar',
      'match-a': 'baz',
      'match-b': 'qux',
    });

    // WHEN
    await realHandler({
      configuration,
      args: { reset: 'match-*' },
    } as any);

    // THEN
    expect(configuration.context.all).toEqual({
      foo: 'bar',
    });
  });


  test('prefers an exact match', async () => {
    // GIVEN
    const configuration = new Configuration();
    configuration.context.set('foo', 'bar');
    configuration.context.set('fo*', 'baz');

    expect(configuration.context.all).toEqual({
      'foo': 'bar',
      'fo*': 'baz',
    });

    // WHEN
    await realHandler({
      configuration,
      args: { reset: 'fo*' },
    } as any);

    // THEN
    expect(configuration.context.all).toEqual({
      foo: 'bar',
    });
  });


  test('doesn\'t throw when at least one match is reset', async () => {
    // GIVEN
    const configuration = new Configuration();
    const readOnlySettings = new Settings({
      'foo': 'bar',
      'match-a': 'baz',
    }, true);
    configuration.context = new Context(readOnlySettings, new Settings());
    configuration.context.set('match-b', 'quux');

    // When
    await expect(realHandler({
      configuration,
      args: { reset: 'match-*' },
    } as any));

    // Then
    expect(configuration.context.all).toEqual({
      'foo': 'bar',
      'match-a': 'baz',
    });
  });

  test('throws when key not found', async () => {
    // GIVEN
    const configuration = new Configuration();
    configuration.context.set('foo', 'bar');

    expect(configuration.context.all).toEqual({
      foo: 'bar',
    });

    // THEN
    await expect(realHandler({
      configuration,
      args: { reset: 'baz' },
    } as any)).rejects.toThrow(/No context value matching key/);
  });

  test('Doesn\'t throw when key not found and --force is set', async () => {
    // GIVEN
    const configuration = new Configuration();
    configuration.context.set('foo', 'bar');

    expect(configuration.context.all).toEqual({
      foo: 'bar',
    });

    // THEN
    await expect(realHandler({
      configuration,
      args: { reset: 'baz', force: true },
    } as any));
  });


  test('throws when no key of index found', async () => {
    // GIVEN
    const configuration = new Configuration();
    configuration.context.set('foo', 'bar');

    expect(configuration.context.all).toEqual({
      foo: 'bar',
    });

    // THEN
    await expect(realHandler({
      configuration,
      args: { reset: '2' },
    } as any)).rejects.toThrow(/No context key with number/);
  });


  test('throws when resetting read-only values', async () => {
    // GIVEN
    const configuration = new Configuration();
    const readOnlySettings = new Settings({
      foo: 'bar',
    }, true);
    configuration.context = new Context(readOnlySettings);

    expect(configuration.context.all).toEqual({
      foo: 'bar',
    });

    // THEN
    await expect(realHandler({
      configuration,
      args: { reset: 'foo' },
    } as any)).rejects.toThrow(/Cannot reset readonly context value with key/);
  });


  test('throws when no matches could be reset', async () => {
    // GIVEN
    const configuration = new Configuration();
    const readOnlySettings = new Settings({
      'foo': 'bar',
      'match-a': 'baz',
      'match-b': 'quux',
    }, true);
    configuration.context = new Context(readOnlySettings);

    expect(configuration.context.all).toEqual({
      'foo': 'bar',
      'match-a': 'baz',
      'match-b': 'quux',
    });

    // THEN
    await expect(realHandler({
      configuration,
      args: { reset: 'match-*' },
    } as any)).rejects.toThrow(/None of the matched context values could be reset/);
  });

});

