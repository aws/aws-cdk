import { Test } from 'nodeunit';
import { realHandler } from '../../lib/commands/context';
import { Configuration } from '../../lib/settings';

export = {
  'context reset can remove a context key'(test: Test) {
    // GIVEN
    const configuration = new Configuration();
    configuration.context.set('foo', 'bar');
    configuration.context.set('baz', 'quux');

    // WHEN
    realHandler({
      configuration,
      args: { reset: 'foo' }
    } as any);

    // THEN
    test.deepEqual(configuration.context.everything(), {
      baz: 'quux'
    });

    test.done();
  },
};