import { mergeEventPattern, renderEventPattern } from '../lib/util';

describe('util', () => {
  describe('mergeEventPattern', () => {
    test('happy case', () => {
      expect(mergeEventPattern({
        bar: [1, 2],
        hey: ['happy'],
        hello: {
          world: ['hi', 'dude'],
          case: [1],
        },
      }, {
        hey: ['day', 'today'],
        hello: {
          world: ['you'],
        },
      })).toEqual({
        bar: [1, 2],
        hey: ['happy', 'day', 'today'],
        hello: {
          world: ['hi', 'dude', 'you'],
          case: [1],
        },
      });
    });

    test('merge into an empty destination', () => {
      expect(mergeEventPattern(undefined, { foo: ['123'] })).toEqual({ foo: ['123'] });
      expect(mergeEventPattern(undefined, { foo: { bar: ['123'] } })).toEqual({ foo: { bar: ['123'] } });
      expect(mergeEventPattern({ }, { foo: { bar: ['123'] } })).toEqual({ foo: { bar: ['123'] } });
    });

    test('fails if a field is not an array', () => {
      expect(() => mergeEventPattern(undefined, 123)).toThrow(/Invalid event pattern '123', expecting an object or an array/);
      expect(() => mergeEventPattern(undefined, 'Hello')).toThrow(/Invalid event pattern '"Hello"', expecting an object or an array/);
      expect(() => mergeEventPattern(undefined, { foo: '123' })).toThrow(/Invalid event pattern field { foo: "123" }. All fields must be arrays/);
    });

    test('fails if mismatch between dest and src', () => {
      expect(() => mergeEventPattern({
        obj: {
          array: [1],
        },
      }, {
        obj: {
          array: {
            value: ['hello'],
          },
        },
      })).toThrow(/Invalid event pattern field array. Type mismatch between existing pattern \[1\] and added pattern \{"value":\["hello"\]\}/);
    });

    test('deduplicate match values in pattern array', () => {
      expect(mergeEventPattern({
        'detail-type': ['AWS API Call via CloudTrail'],
      }, {
        'detail-type': ['AWS API Call via CloudTrail'],
      })).toEqual({
        'detail-type': ['AWS API Call via CloudTrail'],
      });
      expect(mergeEventPattern({
        time: [{ prefix: '2017-10-02' }],
      }, {
        time: [{ prefix: '2017-10-02' }, { prefix: '2017-10-03' }],
      })).toEqual({
        time: [{ prefix: '2017-10-02' }, { prefix: '2017-10-03' }],
      });
      expect(mergeEventPattern({
        'detail-type': ['AWS API Call via CloudTrail'],
        'time': [{ prefix: '2017-10-02' }],
      }, {
        'detail-type': ['AWS API Call via CloudTrail'],
        'time': [{ prefix: '2017-10-02' }, { prefix: '2017-10-03' }],
      })).toEqual({
        'detail-type': ['AWS API Call via CloudTrail'],
        'time': [{ prefix: '2017-10-02' }, { prefix: '2017-10-03' }],
      });
      expect(mergeEventPattern({
        'detail-type': ['AWS API Call via CloudTrail', 'AWS API Call via CloudTrail'],
        'time': [{ prefix: '2017-10-02' }],
      }, {
        'detail-type': ['AWS API Call via CloudTrail', 'AWS API Call via CloudTrail'],
        'time': [{ prefix: '2017-10-02' }, { prefix: '2017-10-03' }, { prefix: '2017-10-02' }],
      })).toEqual({
        'detail-type': ['AWS API Call via CloudTrail'],
        'time': [{ prefix: '2017-10-02' }, { prefix: '2017-10-03' }],
      });
    });
  });

  describe('prototype pollution', () => {
    test('mergeEventPattern rejects __proto__ key', () => {
      const src = Object.create(null);
      src.__proto__ = ['evil'];
      expect(() => mergeEventPattern({}, src)).toThrow(/prototype pollution/i);
    });

    test('mergeEventPattern rejects constructor key', () => {
      const src = Object.create(null);
      src.constructor = ['evil'];
      expect(() => mergeEventPattern({}, src)).toThrow(/prototype pollution/i);
    });

    test('renderEventPattern does not pollute prototype', () => {
      const before = Object.getOwnPropertyNames(Object.prototype).sort().join(',');
      renderEventPattern({ source: ['aws.ec2'] });
      const after = Object.getOwnPropertyNames(Object.prototype).sort().join(',');
      expect(after).toEqual(before);
    });
  });
});
