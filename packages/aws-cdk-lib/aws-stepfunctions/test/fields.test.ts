import { FieldUtils, JsonPath, TaskInput } from '../lib';

describe('Fields', () => {
  const jsonPathValidationErrorMsg = /exactly '\$', '\$\$', start with '\$.', start with '\$\$.', start with '\$\[', or start with an intrinsic function: States.Array, States.ArrayPartition, States.ArrayContains, States.ArrayRange, States.ArrayGetItem, States.ArrayLength, States.ArrayUnique, States.Base64Encode, States.Base64Decode, States.Hash, States.JsonMerge, States.StringToJson, States.JsonToString, States.MathRandom, States.MathAdd, States.StringSplit, States.UUID, or States.Format./;

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
        execId: JsonPath.executionId,
        input: JsonPath.executionInput,
        execName: JsonPath.executionName,
        roleArn: JsonPath.executionRoleArn,
        startTime: JsonPath.executionStartTime,
        enteredTime: JsonPath.stateEnteredTime,
        stateName: JsonPath.stateName,
        retryCount: JsonPath.stateRetryCount,
        stateMachineId: JsonPath.stateMachineId,
        stateMachineName: JsonPath.stateMachineName,
      }),
    ).toStrictEqual({
      'str.$': '$$.Execution.StartTime',
      'count.$': '$$.State.RetryCount',
      'token.$': '$$.Task.Token',
      'entire.$': '$$',
      'execId.$': '$$.Execution.Id',
      'input.$': '$$.Execution.Input',
      'execName.$': '$$.Execution.Name',
      'roleArn.$': '$$.Execution.RoleArn',
      'startTime.$': '$$.Execution.StartTime',
      'enteredTime.$': '$$.State.EnteredTime',
      'stateName.$': '$$.State.Name',
      'retryCount.$': '$$.State.RetryCount',
      'stateMachineId.$': '$$.StateMachine.Id',
      'stateMachineName.$': '$$.StateMachine.Name',
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
  test('JsonPath.listAt before Parallel', () => {
    expect(
      FieldUtils.findReferencedPaths({
        listAt: JsonPath.listAt('$[0].stringList'),
      }),
    ).toStrictEqual(['$[0].stringList']);
  });
  test('cannot have JsonPath fields in arrays', () => {
    expect(() => FieldUtils.renderObject({
      deep: [JsonPath.stringAt('$.hello')],
    })).toThrow(/Cannot use JsonPath fields in an array/);
  }),
  test('datafield path must be correct', () => {
    expect(JsonPath.stringAt('$')).toBeDefined();
    expect(JsonPath.stringAt('States.Format')).toBeDefined();
    expect(JsonPath.stringAt('States.StringToJson')).toBeDefined();
    expect(JsonPath.stringAt('States.JsonToString')).toBeDefined();
    expect(JsonPath.stringAt('States.Array')).toBeDefined();
    expect(JsonPath.stringAt('States.ArrayPartition')).toBeDefined();
    expect(JsonPath.stringAt('States.ArrayContains')).toBeDefined();
    expect(JsonPath.stringAt('States.ArrayRange')).toBeDefined();
    expect(JsonPath.stringAt('States.ArrayGetItem')).toBeDefined();
    expect(JsonPath.stringAt('States.ArrayLength')).toBeDefined();
    expect(JsonPath.stringAt('States.ArrayUnique')).toBeDefined();
    expect(JsonPath.stringAt('States.Base64Encode')).toBeDefined();
    expect(JsonPath.stringAt('States.Base64Decode')).toBeDefined();
    expect(JsonPath.stringAt('States.Hash')).toBeDefined();
    expect(JsonPath.stringAt('States.JsonMerge')).toBeDefined();
    expect(JsonPath.stringAt('States.MathRandom')).toBeDefined();
    expect(JsonPath.stringAt('States.MathAdd')).toBeDefined();
    expect(JsonPath.stringAt('States.StringSplit')).toBeDefined();
    expect(JsonPath.stringAt('States.UUID')).toBeDefined();

    expect(() => JsonPath.stringAt('$hello')).toThrow(jsonPathValidationErrorMsg);
    expect(() => JsonPath.stringAt('hello')).toThrow(jsonPathValidationErrorMsg);
    expect(() => JsonPath.stringAt('States.FooBar')).toThrow(jsonPathValidationErrorMsg);
  }),
  test('context path must be correct', () => {
    expect(JsonPath.stringAt('$$')).toBeDefined();

    expect(() => JsonPath.stringAt('$$hello')).toThrow(jsonPathValidationErrorMsg);
    expect(() => JsonPath.stringAt('hello')).toThrow(jsonPathValidationErrorMsg);
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
    })).toThrow(/Field references must be the entire string/);
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

  test('arrayPartition', () => {
    expect(FieldUtils.renderObject({
      Field: JsonPath.arrayPartition(JsonPath.listAt('$.inputArray'), 4),
    })).toEqual({
      'Field.$': 'States.ArrayPartition($.inputArray, 4)',
    });

    expect(FieldUtils.renderObject({
      Field: JsonPath.arrayPartition(JsonPath.listAt('$.inputArray'), JsonPath.numberAt('$.chunkSize')),
    })).toEqual({
      'Field.$': 'States.ArrayPartition($.inputArray, $.chunkSize)',
    });
  });

  test('arrayContains', () => {
    expect(FieldUtils.renderObject({
      Field: JsonPath.arrayContains(JsonPath.listAt('$.inputArray'), 5),
    })).toEqual({
      'Field.$': 'States.ArrayContains($.inputArray, 5)',
    });

    expect(FieldUtils.renderObject({
      Field: JsonPath.arrayContains(JsonPath.listAt('$.inputArray'), 'a'),
    })).toEqual({
      'Field.$': "States.ArrayContains($.inputArray, 'a')",
    });

    expect(FieldUtils.renderObject({
      Field: JsonPath.arrayContains(JsonPath.listAt('$.inputArray'), JsonPath.numberAt('$.lookingFor')),
    })).toEqual({
      'Field.$': 'States.ArrayContains($.inputArray, $.lookingFor)',
    });
  });

  test('arrayRange', () => {
    expect(FieldUtils.renderObject({
      Field: JsonPath.arrayRange(1, 9, 2),
    })).toEqual({
      'Field.$': 'States.ArrayRange(1, 9, 2)',
    });

    expect(FieldUtils.renderObject({
      Field: JsonPath.arrayRange(JsonPath.numberAt('$.start'), JsonPath.numberAt('$.end'), JsonPath.numberAt('$.step')),
    })).toEqual({
      'Field.$': 'States.ArrayRange($.start, $.end, $.step)',
    });
  });

  test('arrayGetItem', () => {
    expect(FieldUtils.renderObject({
      Field: JsonPath.arrayGetItem(JsonPath.listAt('$.inputArray'), 5),
    })).toEqual({
      'Field.$': 'States.ArrayGetItem($.inputArray, 5)',
    });

    expect(FieldUtils.renderObject({
      Field: JsonPath.arrayGetItem(JsonPath.numberAt('$.inputArray'), JsonPath.numberAt('$.index')),
    })).toEqual({
      'Field.$': 'States.ArrayGetItem($.inputArray, $.index)',
    });
  });

  test('arrayLength', () => {
    expect(FieldUtils.renderObject({
      Field: JsonPath.arrayLength(JsonPath.listAt('$.inputArray')),
    })).toEqual({
      'Field.$': 'States.ArrayLength($.inputArray)',
    });
  });

  test('arrayUnique', () => {
    expect(FieldUtils.renderObject({
      Field: JsonPath.arrayUnique(JsonPath.listAt('$.inputArray')),
    })).toEqual({
      'Field.$': 'States.ArrayUnique($.inputArray)',
    });
  });

  test('base64Encode', () => {
    expect(FieldUtils.renderObject({
      Field: JsonPath.base64Encode('Data to encode'),
    })).toEqual({
      'Field.$': "States.Base64Encode('Data to encode')",
    });

    expect(FieldUtils.renderObject({
      Field: JsonPath.base64Encode(JsonPath.stringAt('$.input')),
    })).toEqual({
      'Field.$': 'States.Base64Encode($.input)',
    });
  });

  test('base64Decode', () => {
    expect(FieldUtils.renderObject({
      Field: JsonPath.base64Decode('RGF0YSB0byBlbmNvZGU='),
    })).toEqual({
      'Field.$': "States.Base64Decode('RGF0YSB0byBlbmNvZGU=')",
    });

    expect(FieldUtils.renderObject({
      Field: JsonPath.base64Decode(JsonPath.stringAt('$.base64')),
    })).toEqual({
      'Field.$': 'States.Base64Decode($.base64)',
    });
  });

  test('hash', () => {
    expect(FieldUtils.renderObject({
      Field: JsonPath.hash('Input data', 'SHA-1'),
    })).toEqual({
      'Field.$': "States.Hash('Input data', 'SHA-1')",
    });

    expect(FieldUtils.renderObject({
      Field: JsonPath.hash(JsonPath.objectAt('$.Data'), JsonPath.stringAt('$.Algorithm')),
    })).toEqual({
      'Field.$': 'States.Hash($.Data, $.Algorithm)',
    });
  });

  test('jsonMerge', () => {
    expect(FieldUtils.renderObject({
      Field: JsonPath.jsonMerge(JsonPath.objectAt('$.Obj1'), JsonPath.objectAt('$.Obj2')),
    })).toEqual({
      'Field.$': 'States.JsonMerge($.Obj1, $.Obj2, false)',
    });
  });

  test('mathRandom', () => {
    expect(FieldUtils.renderObject({
      Field: JsonPath.mathRandom(1, 999),
    })).toEqual({
      'Field.$': 'States.MathRandom(1, 999)',
    });

    expect(FieldUtils.renderObject({
      Field: JsonPath.mathRandom(JsonPath.numberAt('$.start'), JsonPath.numberAt('$.end')),
    })).toEqual({
      'Field.$': 'States.MathRandom($.start, $.end)',
    });
  });

  test('mathAdd', () => {
    expect(FieldUtils.renderObject({
      Field: JsonPath.mathAdd(1, 999),
    })).toEqual({
      'Field.$': 'States.MathAdd(1, 999)',
    });

    expect(FieldUtils.renderObject({
      Field: JsonPath.mathAdd(JsonPath.numberAt('$.value1'), JsonPath.numberAt('$.step')),
    })).toEqual({
      'Field.$': 'States.MathAdd($.value1, $.step)',
    });
  });

  test('stringSplit', () => {
    expect(FieldUtils.renderObject({
      Field: JsonPath.stringSplit('1,2,3,4,5', ','),
    })).toEqual({
      'Field.$': "States.StringSplit('1,2,3,4,5', ',')",
    });

    expect(FieldUtils.renderObject({
      Field: JsonPath.stringSplit(JsonPath.stringAt('$.inputString'), JsonPath.stringAt('$.splitter')),
    })).toEqual({
      'Field.$': 'States.StringSplit($.inputString, $.splitter)',
    });
  });

  test('uuid', () => {
    expect(FieldUtils.renderObject({
      Field: JsonPath.uuid(),
    })).toEqual({
      'Field.$': 'States.UUID()',
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

  test('correctly serialize a nested array', () => {
    expect(
      FieldUtils.renderObject({
        nestedArray: [
          [
            [123, 123],
            [456, 456],
          ],
        ],
      }),
    ).toStrictEqual({
      nestedArray: [
        [
          [123, 123],
          [456, 456],
        ],
      ],
    });
  });

  test('deep replace correctly handles fields in nested arrays', () => {
    expect(
      FieldUtils.renderObject({
        deep: [
          [
            {
              deepField: JsonPath.numberAt('$.numField'),
            },
          ],
        ],
      }),
    ).toStrictEqual({
      deep: [
        [
          {
            'deepField.$': '$.numField',
          },
        ],
      ],
    });
  });
});

test('find task token even if nested in intrinsic functions', () => {
  expect(FieldUtils.containsTaskToken({ x: JsonPath.array(JsonPath.taskToken) })).toEqual(true);

  expect(FieldUtils.containsTaskToken({ x: JsonPath.array('nope') })).toEqual(false);

  // Even if it's a hand-written literal and doesn't use our constructors
  expect(FieldUtils.containsTaskToken({ x: JsonPath.stringAt('States.Array($$.Task.Token)') })).toEqual(true);
});
