import { Test } from 'nodeunit';
import { capitalizePropertyNames, ignoreEmpty } from '../../lib/core/util';

export = {
  'capitalizeResourceProperties capitalizes all keys of an object (recursively) from camelCase to PascalCase'(test: Test) {

    test.equal(capitalizePropertyNames(undefined), undefined);
    test.equal(capitalizePropertyNames(12), 12);
    test.equal(capitalizePropertyNames('hello'), 'hello');
    test.deepEqual(capitalizePropertyNames([ 'hello', 88 ]), [ 'hello', 88 ]);
    test.deepEqual(capitalizePropertyNames(
      { Hello: 'world', hey: 'dude' }),
      { Hello: 'world', Hey: 'dude' });
    test.deepEqual(capitalizePropertyNames(
      [ 1, 2, { three: 3 }]),
      [ 1, 2, { Three: 3 }]);
    test.deepEqual(capitalizePropertyNames(
      { Hello: 'world', recursive: { foo: 123, there: { another: [ 'hello', { world: 123 } ]} } }),
      { Hello: 'world', Recursive: { Foo: 123, There: { Another: [ 'hello', { World: 123 } ]} } });

    // make sure tokens are resolved and result is also capitalized
    test.deepEqual(capitalizePropertyNames(
      { hello: { resolve: () => ({ foo: 'bar' }) }, world: new SomeToken() }),
      { Hello: { Foo: 'bar' }, World: 100 });

    test.done();
  },

  'ignoreEmpty': {

    '[]'(test: Test) {
      test.strictEqual(ignoreEmpty([]), undefined);
      test.done();
    },

    '{}'(test: Test) {
      test.strictEqual(ignoreEmpty({}), undefined);
      test.done();
    },

    'undefined/null'(test: Test) {
      test.strictEqual(ignoreEmpty(undefined), undefined);
      test.strictEqual(ignoreEmpty(null), null);
      test.done();
    },

    'primitives'(test: Test) {
      test.strictEqual(ignoreEmpty(12), 12);
      test.strictEqual(ignoreEmpty("12"), "12");
      test.done();
    },

    'non-empty arrays/objects'(test: Test) {
      test.deepEqual(ignoreEmpty([ 1, 2, 3, undefined ]), [ 1, 2, 3 ]); // undefined array values is cleaned up by "resolve"
      test.deepEqual(ignoreEmpty({ o: 1, b: 2, j: 3 }), { o: 1, b: 2, j: 3 });
      test.done();
    },

    'resolve first'(test: Test) {
      test.deepEqual(ignoreEmpty({ xoo: { resolve: () => 123 }}), { xoo: 123 });
      test.strictEqual(ignoreEmpty({ xoo: { resolve: () => undefined }}), undefined);
      test.deepEqual(ignoreEmpty({ xoo: { resolve: () => [ ] }}), { xoo: [] });
      test.deepEqual(ignoreEmpty({ xoo: { resolve: () => [ undefined, undefined ] }}), { xoo: [] });
      test.done();
    }
  }
};

class SomeToken {
  public foo = 60;
  public goo = 40;
  public resolve() {
    return this.foo + this.goo;
  }
}
