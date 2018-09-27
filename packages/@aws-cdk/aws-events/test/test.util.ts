import { Test } from 'nodeunit';
import { mergeEventPattern } from '../lib/util';

export = {
  mergeEventPattern: {
    'happy case'(test: Test) {
      test.deepEqual(mergeEventPattern({
        bar: [ 1, 2 ],
        hey: [ 'happy' ],
        hello: {
          world: [ 'hi', 'dude' ],
          case: [ 1 ]
        }
      }, {
        hey: [ 'day', 'today' ],
        hello: {
          world: [ 'you' ]
        }
      }), {
        bar: [ 1, 2 ],
        hey: [ 'happy', 'day', 'today' ],
        hello: {
          world: [ 'hi', 'dude', 'you' ],
          case: [ 1 ]
        }
      });
      test.done();
    },

    'merge into an empty destination'(test: Test) {
      test.deepEqual(mergeEventPattern(undefined, { foo: [ '123' ] }), { foo: [ 123 ] });
      test.deepEqual(mergeEventPattern(undefined, { foo: { bar: [ '123' ] } }), { foo: { bar: [ 123 ] } });
      test.deepEqual(mergeEventPattern({ }, { foo: { bar: [ '123' ] } }), { foo: { bar: [ 123 ] } });
      test.done();
    },

    'fails if a field is not an array'(test: Test) {
      test.throws(() => mergeEventPattern(undefined, 123), /Invalid event pattern '123', expecting an object or an array/);
      test.throws(() => mergeEventPattern(undefined, 'Hello'), /Invalid event pattern '"Hello"', expecting an object or an array/);
      test.throws(() => mergeEventPattern(undefined, { foo: '123' }), /Invalid event pattern field { foo: "123" }. All fields must be arrays/);
      test.done();
    },

    'fails if mismatch between dest and src'(test: Test) {
      test.throws(() => mergeEventPattern({
        obj: {
          array: [ 1 ]
        }
      }, {
        obj: {
          array: {
            value: [ 'hello' ]
          }
        }
      }), /Invalid event pattern field array. Type mismatch between existing pattern \[1\] and added pattern \{"value":\["hello"\]\}/);
      test.done();
    }
  }
};
