/* eslint-disable import/order */
import { contextHandler } from '../../lib/commands/context';
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
    await contextHandler({
      context: configuration.context,
    });
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
    await contextHandler({
      context: configuration.context,
      reset: 'foo',
    });

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
    await contextHandler({
      context: configuration.context,
      reset: '1',
    });

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
    await contextHandler({
      context: configuration.context,
      reset: 'match-*',
    });

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
    await contextHandler({
      context: configuration.context,
      reset: 'fo*',
    });

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
    configuration.context = new Context({ bag: readOnlySettings }, { bag: new Settings() });
    configuration.context.set('match-b', 'quux');

    // When
    await expect(contextHandler({
      context: configuration.context,
      reset: 'match-*',
    }));

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
    await expect(contextHandler({
      context: configuration.context,
      reset: 'baz',
    })).rejects.toThrow(/No context value matching key/);
  });

  test('Doesn\'t throw when key not found and --force is set', async () => {
    // GIVEN
    const configuration = new Configuration();
    configuration.context.set('foo', 'bar');

    expect(configuration.context.all).toEqual({
      foo: 'bar',
    });

    // THEN
    await expect(contextHandler({
      context: configuration.context,
      reset: 'baz',
      force: true,
    }));
  });

  test('throws when no key of index found', async () => {
    // GIVEN
    const configuration = new Configuration();
    configuration.context.set('foo', 'bar');

    expect(configuration.context.all).toEqual({
      foo: 'bar',
    });

    // THEN
    await expect(contextHandler({
      context: configuration.context,
      reset: '2',
    })).rejects.toThrow(/No context key with number/);
  });

  test('throws when resetting read-only values', async () => {
    // GIVEN
    const configuration = new Configuration();
    const readOnlySettings = new Settings({
      foo: 'bar',
    }, true);
    configuration.context = new Context({ bag: readOnlySettings });

    expect(configuration.context.all).toEqual({
      foo: 'bar',
    });

    // THEN
    await expect(contextHandler({
      context: configuration.context,
      reset: 'foo',
    })).rejects.toThrow(/Cannot reset readonly context value with key/);
  });

  test('throws when no matches could be reset', async () => {
    // GIVEN
    const configuration = new Configuration();
    const readOnlySettings = new Settings({
      'foo': 'bar',
      'match-a': 'baz',
      'match-b': 'quux',
    }, true);
    configuration.context = new Context({ bag: readOnlySettings });

    expect(configuration.context.all).toEqual({
      'foo': 'bar',
      'match-a': 'baz',
      'match-b': 'quux',
    });

    // THEN
    await expect(contextHandler({
      context: configuration.context,
      reset: 'match-*',
    })).rejects.toThrow(/None of the matched context values could be reset/);
  });
});

describe('context --clear', () => {
  test('can clear all context keys', async () => {
    // GIVEN
    const configuration = new Configuration();
    configuration.context.set('foo', 'bar');
    configuration.context.set('baz', 'quux');

    expect(configuration.context.all).toEqual({
      foo: 'bar',
      baz: 'quux',
    });

    // WHEN
    await contextHandler({
      context: configuration.context,
      clear: true,
    });

    // THEN
    expect(configuration.context.all).toEqual({});
  });
});
