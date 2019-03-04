import { Test } from 'nodeunit';
import { realHandler } from '../../lib/commands/context';
import { Configuration } from '../../lib/settings';

export = {
  async 'context reset can remove a context key'(test: Test) {
    // GIVEN
    const configuration = new Configuration();
    configuration.context.set('foo', 'bar');
    configuration.context.set('baz', 'quux');

    test.deepEqual(configuration.context.all, {
      foo: 'bar',
      baz: 'quux'
    });

    // WHEN
    await realHandler({
      configuration,
      args: { reset: 'foo' }
    } as any);

    // THEN
    test.deepEqual(configuration.context.all, {
      baz: 'quux'
    });

    test.done();
  },
};