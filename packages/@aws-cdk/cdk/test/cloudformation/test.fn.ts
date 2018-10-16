import fc = require('fast-check');
import _ = require('lodash');
import nodeunit = require('nodeunit');
import fn = require('../../lib/cloudformation/fn');

function asyncTest(cb: (test: nodeunit.Test) => Promise<void>): (test: nodeunit.Test) => void {
  return async (test: nodeunit.Test) => {
    let error: Error;
    try {
      await cb(test);
    } catch (e) {
      error = e;
    } finally {
      test.doesNotThrow(() => {
        if (error) { throw error; }
      });
      test.done();
    }
  };
}

export = nodeunit.testCase({
  FnJoin: {
    'rejects empty list of arguments to join'(test: nodeunit.Test) {
      test.throws(() => new fn.FnJoin('.', []));
      test.done();
    },
    'resolves to the value if only one value is joined': asyncTest(async () => {
      await fc.assert(
        fc.property(
          fc.string(), fc.oneof(fc.string(), fc.object()),
          (delimiter, value) => new fn.FnJoin(delimiter, [value]).resolve() === value
        ),
        { verbose: true }
      );
    }),
    'pre-concatenates string literals': asyncTest(async () => {
      await fc.assert(
        fc.property(
          fc.string(), fc.array(fc.string(), 1, 15),
          (delimiter, values) => new fn.FnJoin(delimiter, values).resolve() === values.join(delimiter)
        ),
        { verbose: true }
      );
    }),
    'pre-concatenates around tokens': asyncTest(async () => {
      await fc.assert(
        fc.property(
          fc.string(), fc.array(fc.string(), 1, 3), fc.object(), fc.array(fc.string(), 1, 3),
          (delimiter, prefix, obj, suffix) =>
            _.isEqual(new fn.FnJoin(delimiter, [...prefix, obj, ...suffix]).resolve(),
                      { 'Fn::Join': [delimiter, [prefix.join(delimiter), obj, suffix.join(delimiter)]] })
        ),
        { verbose: true }
      );
    }),
    'flattens joins nested under joins with same delimiter': asyncTest(async () => {
      await fc.assert(
        fc.property(
          fc.string(), fc.array(fc.oneof(fc.string(), fc.object())),
                      fc.array(fc.oneof(fc.string(), fc.object()), 1, 3),
                      fc.array(fc.oneof(fc.string(), fc.object())),
          (delimiter, prefix, nested, suffix) =>
            _.isEqual(new fn.FnJoin(delimiter, [...prefix, new fn.FnJoin(delimiter, nested), ...suffix]).resolve(),
                      new fn.FnJoin(delimiter, [...prefix, ...nested, ...suffix]).resolve())
        ),
        { verbose: true }
      );
    }),
    'does not flatten joins nested under joins with different delimiter': asyncTest(async () => {
      await fc.assert(
        fc.property(
          fc.string(), fc.string(),
          fc.array(fc.oneof(fc.string(), fc.object()), 1, 3),
          fc.array(fc.object(), 2, 3),
          fc.array(fc.oneof(fc.string(), fc.object()), 3),
          (delimiter1, delimiter2, prefix, nested, suffix) => {
            fc.pre(delimiter1 !== delimiter2);
            const join = new fn.FnJoin(delimiter1, [...prefix, new fn.FnJoin(delimiter2, nested), ...suffix]);
            const resolved = join.resolve();
            return resolved['Fn::Join'][1].find((e: any) => typeof e === 'object'
                                                        && (e instanceof fn.FnJoin)
                                                        && e.resolve()['Fn::Join'][0] === delimiter2) != null;
          }
        ),
        { verbose: true }
      );
    }),
  },
});
