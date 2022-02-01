import { FieldUtils, JsonPath, TaskInput } from '../lib';

describe('Fields', () => {
  const jsonPathValidationErrorMsg = /exactly '\$', '\$\$', start with '\$.', start with '\$\$.', start with '\$\[', or start with an intrinsic function: States.Format, States.StringToJson, States.JsonToString, or States.Array./;

  test('deep replace correctly handles fields in arrays', () => {
    expect(
      FieldUtils.renderObject({
        unknown: undefined,
        bool: true,
        literal: 'literal',
        field: JsonPath.stringAt('$.stringField'),
        listField: JsonPath.listAt('$.listField'),
        deep: [
          'literal',
          {
            deepField: JsonPath.numberAt('$.numField'),
          },
        ],
      }),
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
        str: JsonPath.stringAt('$$.Execution.StartTime'),
        count: JsonPath.numberAt('$$.State.RetryCount'),
        token: JsonPath.taskToken,
        entire: JsonPath.entireContext,
      }),
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
        field: JsonPath.stringAt('$.stringField'),
        listField: JsonPath.listAt('$.listField'),
        deep: [
          'literal',
          {
            field: JsonPath.stringAt('$.stringField'),
            deepField: JsonPath.numberAt('$.numField'),
          },
        ],
      }),
    ).toStrictEqual(['$.listField', '$.numField', '$.stringField']);
  }),
  test('cannot have JsonPath fields in arrays', () => {
    expect(() => FieldUtils.renderObject({
      deep: [JsonPath.stringAt('$.hello')],
    })).toThrowError(/Cannot use JsonPath fields in an array/);
  }),
  test('datafield path must be correct', () => {
    expect(JsonPath.stringAt('$')).toBeDefined();
    expect(JsonPath.stringAt('States.Format')).toBeDefined();
    expect(JsonPath.stringAt('States.StringToJson')).toBeDefined();
    expect(JsonPath.stringAt('States.JsonToString')).toBeDefined();
    expect(JsonPath.stringAt('States.Array')).toBeDefined();

    expect(() => JsonPath.stringAt('$hello')).toThrowError(jsonPathValidationErrorMsg);
    expect(() => JsonPath.stringAt('hello')).toThrowError(jsonPathValidationErrorMsg);
    expect(() => JsonPath.stringAt('States.FooBar')).toThrowError(jsonPathValidationErrorMsg);
  }),
  test('context path must be correct', () => {
    expect(JsonPath.stringAt('$$')).toBeDefined();

    expect(() => JsonPath.stringAt('$$hello')).toThrowError(jsonPathValidationErrorMsg);
    expect(() => JsonPath.stringAt('hello')).toThrowError(jsonPathValidationErrorMsg);
  }),
  test('datafield path with array must be correct', () => {
    expect(JsonPath.stringAt('$[0]')).toBeDefined();
    expect(JsonPath.stringAt("$['abc']")).toBeDefined();
  }),
  test('test contains task token', () => {
    expect(true).toEqual(
      FieldUtils.containsTaskToken({
        field: JsonPath.taskToken,
      }),
    );

    expect(true).toEqual(
      FieldUtils.containsTaskToken({
        field: JsonPath.stringAt('$$.Task'),
      }),
    );

    expect(true).toEqual(
      FieldUtils.containsTaskToken({
        field: JsonPath.entireContext,
      }),
    );

    expect(false).toEqual(
      FieldUtils.containsTaskToken({
        oops: 'not here',
      }),
    );

    expect(false).toEqual(
      FieldUtils.containsTaskToken({
        oops: JsonPath.stringAt('$$.Execution.StartTime'),
      }),
    );
  }),
  test('arbitrary JSONPath fields are not replaced', () => {
    expect(
      FieldUtils.renderObject({
        field: '$.content',
      }),
    ).toStrictEqual({
      field: '$.content',
    });
  }),
  test('fields cannot be used somewhere in a string interpolation', () => {
    expect(() => FieldUtils.renderObject({
      field: `contains ${JsonPath.stringAt('$.hello')}`,
    })).toThrowError(/Field references must be the entire string/);
  });
  test('infinitely recursive object graphs do not break referenced path finding', () => {
    const deepObject = {
      field: JsonPath.stringAt('$.stringField'),
      deepField: JsonPath.numberAt('$.numField'),
      recursiveField: undefined as any,
    };
    const paths = {
      bool: false,
      literal: 'literal',
      field: JsonPath.stringAt('$.stringField'),
      listField: JsonPath.listAt('$.listField'),
      recursiveField: undefined as any,
      deep: [
        'literal',
        deepObject,
      ],
    };
    paths.recursiveField = paths;
    deepObject.recursiveField = paths;
    expect(FieldUtils.findReferencedPaths(paths))
      .toStrictEqual(['$.listField', '$.numField', '$.stringField']);
  });

  test('rendering a non-object value should just return itself', () => {
    expect(
      FieldUtils.renderObject(TaskInput.fromText('Hello World').value),
    ).toEqual(
      'Hello World',
    );
    expect(
      FieldUtils.renderObject('Hello World' as any),
    ).toEqual(
      'Hello World',
    );
    expect(
      FieldUtils.renderObject(null as any),
    ).toEqual(
      null,
    );
    expect(
      FieldUtils.renderObject(3.14 as any),
    ).toEqual(
      3.14,
    );
    expect(
      FieldUtils.renderObject(true as any),
    ).toEqual(
      true,
    );
    expect(
      FieldUtils.renderObject(undefined),
    ).toEqual(
      undefined,
    );
  });

  test('repeated object references at different tree paths should not be considered as recursions', () => {
    const repeatedObject = {
      field: JsonPath.stringAt('$.stringField'),
      numField: JsonPath.numberAt('$.numField'),
    };
    expect(FieldUtils.renderObject(
      {
        reference1: repeatedObject,
        reference2: repeatedObject,
      },
    )).toStrictEqual({
      reference1: {
        'field.$': '$.stringField',
        'numField.$': '$.numField',
      },
      reference2: {
        'field.$': '$.stringField',
        'numField.$': '$.numField',
      },
    });
  });
});

describe('intrinsics constructors', () => {
  test('array', () => {
    expect(FieldUtils.renderObject({
      Field: JsonPath.array('asdf', JsonPath.stringAt('$.Id')),
    })).toEqual({
      'Field.$': "States.Array('asdf', $.Id)",
    });
  });

  test('format', () => {
    expect(FieldUtils.renderObject({
      Field: JsonPath.format('Hi my name is {}.', JsonPath.stringAt('$.Name')),
    })).toEqual({
      'Field.$': "States.Format('Hi my name is {}.', $.Name)",
    });

    expect(FieldUtils.renderObject({
      Field: JsonPath.format(JsonPath.stringAt('$.Format'), JsonPath.stringAt('$.Name')),
    })).toEqual({
      'Field.$': 'States.Format($.Format, $.Name)',
    });
  });

  test('stringToJson', () => {
    expect(FieldUtils.renderObject({
      Field: JsonPath.stringToJson(JsonPath.stringAt('$.Str')),
    })).toEqual({
      'Field.$': 'States.StringToJson($.Str)',
    });
  });

  test('jsonToString', () => {
    expect(FieldUtils.renderObject({
      Field: JsonPath.jsonToString(JsonPath.objectAt('$.Obj')),
    })).toEqual({
      'Field.$': 'States.JsonToString($.Obj)',
    });
  });
});

test('find task token even if nested in intrinsic functions', () => {
  expect(FieldUtils.containsTaskToken({ x: JsonPath.array(JsonPath.taskToken) })).toEqual(true);

  expect(FieldUtils.containsTaskToken({ x: JsonPath.array('nope') })).toEqual(false);

  // Even if it's a hand-written literal and doesn't use our constructors
  expect(FieldUtils.containsTaskToken({ x: JsonPath.stringAt('States.Array($$.Task.Token)') })).toEqual(true);
});