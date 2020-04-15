import '@aws-cdk/assert/jest';
import { Context, Data, FieldUtils } from '../lib';

describe('Fields', () => {
  test('deep replace correctly handles fields in arrays', () => {
    expect(
      FieldUtils.renderObject({
        unknown: undefined,
        bool: true,
        literal: 'literal',
        field: Data.stringAt('$.stringField'),
        listField: Data.listAt('$.listField'),
        deep: [
          'literal',
          {
            deepField: Data.numberAt('$.numField'),
          },
        ],
      })
    ).toStrictEqual({
      'bool': true,
      'literal': 'literal',
      'field.$': '$.stringField',
      'listField.$': '$.listField',
      'deep': [
        'literal',
        {
          'deepField.$': '$.numField',
        },
      ],
    });
  }),
  test('exercise contextpaths', () => {
    expect(
      FieldUtils.renderObject({
        str: Context.stringAt('$$.Execution.StartTime'),
        count: Context.numberAt('$$.State.RetryCount'),
        token: Context.taskToken,
        entire: Context.entireContext,
      })
    ).toStrictEqual({
      'str.$': '$$.Execution.StartTime',
      'count.$': '$$.State.RetryCount',
      'token.$': '$$.Task.Token',
      'entire.$': '$$',
    });
  }),
  test('find all referenced paths', () => {
    expect(
      FieldUtils.findReferencedPaths({
        bool: false,
        literal: 'literal',
        field: Data.stringAt('$.stringField'),
        listField: Data.listAt('$.listField'),
        deep: [
          'literal',
          {
            field: Data.stringAt('$.stringField'),
            deepField: Data.numberAt('$.numField'),
          },
        ],
      })
    ).toStrictEqual(['$.listField', '$.numField', '$.stringField']);
  }),
  test('cannot have JsonPath fields in arrays', () => {
    expect(() => FieldUtils.renderObject({
      deep: [Data.stringAt('$.hello')],
    })).toThrowError(/Cannot use JsonPath fields in an array/);
  }),
  test('datafield path must be correct', () => {
    expect(Data.stringAt('$')).toBeDefined();

    expect(() => Data.stringAt('$hello')).toThrowError(/exactly equal to '\$' or start with '\$.'/);

    expect(() => Data.stringAt('hello')).toThrowError(/exactly equal to '\$' or start with '\$.'/);
  }),
  test('context path must be correct', () => {
    expect(Context.stringAt('$$')).toBeDefined();

    expect(() => Context.stringAt('$$hello')).toThrowError(/exactly equal to '\$\$' or start with '\$\$.'/);

    expect(() => Context.stringAt('hello')).toThrowError(/exactly equal to '\$\$' or start with '\$\$.'/);
  }),
  test('test contains task token', () => {
    expect(true).toEqual(
      FieldUtils.containsTaskToken({
        field: Context.taskToken,
      })
    );

    expect(true).toEqual(
      FieldUtils.containsTaskToken({
        field: Context.stringAt('$$.Task'),
      })
    );

    expect(true).toEqual(
      FieldUtils.containsTaskToken({
        field: Context.entireContext,
      })
    );

    expect(false).toEqual(
      FieldUtils.containsTaskToken({
        oops: 'not here',
      })
    );

    expect(false).toEqual(
      FieldUtils.containsTaskToken({
        oops: Context.stringAt('$$.Execution.StartTime'),
      })
    );
  }),
  test('arbitrary JSONPath fields are not replaced', () => {
    expect(
      FieldUtils.renderObject({
        field: '$.content',
      })
    ).toStrictEqual({
      field: '$.content',
    });
  }),
  test('fields cannot be used somewhere in a string interpolation', () => {
    expect(() => FieldUtils.renderObject({
      field: `contains ${Data.stringAt('$.hello')}`,
    })).toThrowError(/Field references must be the entire string/);
  });
});
