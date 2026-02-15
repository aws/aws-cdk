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

  describe('renderEventPattern', () => {
    test('throws on empty source array', () => {
      expect(() => renderEventPattern({ source: [] }))
        .toThrow(/Invalid event pattern field 'source': empty arrays are not allowed/);
    });

    test('throws on empty detailType array and error message uses detail-type', () => {
      expect(() => renderEventPattern({ detailType: [] }))
        .toThrow(/Invalid event pattern field 'detail-type': empty arrays are not allowed/);
    });

    test('does not throw on non-empty arrays', () => {
      expect(renderEventPattern({ source: ['aws.source'] }))
        .toEqual({ source: ['aws.source'] });
    });

    test('returns undefined for empty object', () => {
      expect(renderEventPattern({})).toBeUndefined();
    });

    test('does not throw on detail object with arrays', () => {
      expect(renderEventPattern({ detail: { foo: ['bar'] } }))
        .toEqual({ detail: { foo: ['bar'] } });
    });
  });
});
