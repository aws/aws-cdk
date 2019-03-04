import { Test } from 'nodeunit';
import { Context, Settings } from '../lib/settings';

export = {
  'can delete values from Context object'(test: Test) {
    // GIVEN
    const settings1 = new Settings({ foo: 'bar' });
    const settings2 = new Settings({ boo: 'baz' });
    const context = new Context(settings1, settings2);

    // WHEN
    context.unset('foo');

    // THEN
    test.deepEqual(context.all, { boo: 'baz' });
    test.deepEqual(settings1.all, {});
    test.deepEqual(settings2.all, { boo: 'baz' });

    test.done();
  },

  'can set values in Context object'(test: Test) {
    // GIVEN
    const settings1 = new Settings();
    const settings2 = new Settings();
    const context = new Context(settings1, settings2);

    // WHEN
    context.set('foo', 'bar');

    // THEN
    test.deepEqual(context.all, { foo: 'bar' });
    test.deepEqual(settings1.all, { foo: 'bar' });
    test.deepEqual(settings2.all, {});

    test.done();
  },

  'can set values in Context object if first is immutable'(test: Test) {
    // GIVEN
    const settings1 = new Settings();
    const settings2 = new Settings();
    const context = new Context(settings1.makeReadOnly(), settings2);

    // WHEN
    context.set('foo', 'bar');

    // THEN
    test.deepEqual(context.all, { foo: 'bar' });
    test.deepEqual(settings1.all, { });
    test.deepEqual(settings2.all, { foo: 'bar' });

    test.done();
  },

  'can clear all values in all objects'(test: Test) {
    // GIVEN
    const settings1 = new Settings({ foo: 'bar' });
    const settings2 = new Settings({ foo: 'snar', boo: 'gar' });
    const context = new Context(settings1, settings2);

    // WHEN
    context.clear();

    // THEN
    test.deepEqual(context.all, {});
    test.deepEqual(settings1.all, { });
    test.deepEqual(settings2.all, {});

    test.done();
  },
};