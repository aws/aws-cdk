"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
describe('Fields', () => {
    const jsonPathValidationErrorMsg = /exactly '\$', '\$\$', start with '\$.', start with '\$\$.', start with '\$\[', or start with an intrinsic function: States.Array, States.ArrayPartition, States.ArrayContains, States.ArrayRange, States.ArrayGetItem, States.ArrayLength, States.ArrayUnique, States.Base64Encode, States.Base64Decode, States.Hash, States.JsonMerge, States.StringToJson, States.JsonToString, States.MathRandom, States.MathAdd, States.StringSplit, States.UUID, or States.Format./;
    test('deep replace correctly handles fields in arrays', () => {
        expect(lib_1.FieldUtils.renderObject({
            unknown: undefined,
            bool: true,
            literal: 'literal',
            field: lib_1.JsonPath.stringAt('$.stringField'),
            listField: lib_1.JsonPath.listAt('$.listField'),
            deep: [
                'literal',
                {
                    deepField: lib_1.JsonPath.numberAt('$.numField'),
                },
            ],
        })).toStrictEqual({
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
            expect(lib_1.FieldUtils.renderObject({
                str: lib_1.JsonPath.stringAt('$$.Execution.StartTime'),
                count: lib_1.JsonPath.numberAt('$$.State.RetryCount'),
                token: lib_1.JsonPath.taskToken,
                entire: lib_1.JsonPath.entireContext,
            })).toStrictEqual({
                'str.$': '$$.Execution.StartTime',
                'count.$': '$$.State.RetryCount',
                'token.$': '$$.Task.Token',
                'entire.$': '$$',
            });
        }),
        test('find all referenced paths', () => {
            expect(lib_1.FieldUtils.findReferencedPaths({
                bool: false,
                literal: 'literal',
                field: lib_1.JsonPath.stringAt('$.stringField'),
                listField: lib_1.JsonPath.listAt('$.listField'),
                deep: [
                    'literal',
                    {
                        field: lib_1.JsonPath.stringAt('$.stringField'),
                        deepField: lib_1.JsonPath.numberAt('$.numField'),
                    },
                ],
            })).toStrictEqual(['$.listField', '$.numField', '$.stringField']);
        }),
        test('JsonPath.listAt before Parallel', () => {
            expect(lib_1.FieldUtils.findReferencedPaths({
                listAt: lib_1.JsonPath.listAt('$[0].stringList'),
            })).toStrictEqual(['$[0].stringList']);
        });
    test('cannot have JsonPath fields in arrays', () => {
        expect(() => lib_1.FieldUtils.renderObject({
            deep: [lib_1.JsonPath.stringAt('$.hello')],
        })).toThrowError(/Cannot use JsonPath fields in an array/);
    }),
        test('datafield path must be correct', () => {
            expect(lib_1.JsonPath.stringAt('$')).toBeDefined();
            expect(lib_1.JsonPath.stringAt('States.Format')).toBeDefined();
            expect(lib_1.JsonPath.stringAt('States.StringToJson')).toBeDefined();
            expect(lib_1.JsonPath.stringAt('States.JsonToString')).toBeDefined();
            expect(lib_1.JsonPath.stringAt('States.Array')).toBeDefined();
            expect(lib_1.JsonPath.stringAt('States.ArrayPartition')).toBeDefined();
            expect(lib_1.JsonPath.stringAt('States.ArrayContains')).toBeDefined();
            expect(lib_1.JsonPath.stringAt('States.ArrayRange')).toBeDefined();
            expect(lib_1.JsonPath.stringAt('States.ArrayGetItem')).toBeDefined();
            expect(lib_1.JsonPath.stringAt('States.ArrayLength')).toBeDefined();
            expect(lib_1.JsonPath.stringAt('States.ArrayUnique')).toBeDefined();
            expect(lib_1.JsonPath.stringAt('States.Base64Encode')).toBeDefined();
            expect(lib_1.JsonPath.stringAt('States.Base64Decode')).toBeDefined();
            expect(lib_1.JsonPath.stringAt('States.Hash')).toBeDefined();
            expect(lib_1.JsonPath.stringAt('States.JsonMerge')).toBeDefined();
            expect(lib_1.JsonPath.stringAt('States.MathRandom')).toBeDefined();
            expect(lib_1.JsonPath.stringAt('States.MathAdd')).toBeDefined();
            expect(lib_1.JsonPath.stringAt('States.StringSplit')).toBeDefined();
            expect(lib_1.JsonPath.stringAt('States.UUID')).toBeDefined();
            expect(() => lib_1.JsonPath.stringAt('$hello')).toThrowError(jsonPathValidationErrorMsg);
            expect(() => lib_1.JsonPath.stringAt('hello')).toThrowError(jsonPathValidationErrorMsg);
            expect(() => lib_1.JsonPath.stringAt('States.FooBar')).toThrowError(jsonPathValidationErrorMsg);
        }),
        test('context path must be correct', () => {
            expect(lib_1.JsonPath.stringAt('$$')).toBeDefined();
            expect(() => lib_1.JsonPath.stringAt('$$hello')).toThrowError(jsonPathValidationErrorMsg);
            expect(() => lib_1.JsonPath.stringAt('hello')).toThrowError(jsonPathValidationErrorMsg);
        }),
        test('datafield path with array must be correct', () => {
            expect(lib_1.JsonPath.stringAt('$[0]')).toBeDefined();
            expect(lib_1.JsonPath.stringAt("$['abc']")).toBeDefined();
        }),
        test('test contains task token', () => {
            expect(true).toEqual(lib_1.FieldUtils.containsTaskToken({
                field: lib_1.JsonPath.taskToken,
            }));
            expect(true).toEqual(lib_1.FieldUtils.containsTaskToken({
                field: lib_1.JsonPath.stringAt('$$.Task'),
            }));
            expect(true).toEqual(lib_1.FieldUtils.containsTaskToken({
                field: lib_1.JsonPath.entireContext,
            }));
            expect(false).toEqual(lib_1.FieldUtils.containsTaskToken({
                oops: 'not here',
            }));
            expect(false).toEqual(lib_1.FieldUtils.containsTaskToken({
                oops: lib_1.JsonPath.stringAt('$$.Execution.StartTime'),
            }));
        }),
        test('arbitrary JSONPath fields are not replaced', () => {
            expect(lib_1.FieldUtils.renderObject({
                field: '$.content',
            })).toStrictEqual({
                field: '$.content',
            });
        }),
        test('fields cannot be used somewhere in a string interpolation', () => {
            expect(() => lib_1.FieldUtils.renderObject({
                field: `contains ${lib_1.JsonPath.stringAt('$.hello')}`,
            })).toThrowError(/Field references must be the entire string/);
        });
    test('infinitely recursive object graphs do not break referenced path finding', () => {
        const deepObject = {
            field: lib_1.JsonPath.stringAt('$.stringField'),
            deepField: lib_1.JsonPath.numberAt('$.numField'),
            recursiveField: undefined,
        };
        const paths = {
            bool: false,
            literal: 'literal',
            field: lib_1.JsonPath.stringAt('$.stringField'),
            listField: lib_1.JsonPath.listAt('$.listField'),
            recursiveField: undefined,
            deep: [
                'literal',
                deepObject,
            ],
        };
        paths.recursiveField = paths;
        deepObject.recursiveField = paths;
        expect(lib_1.FieldUtils.findReferencedPaths(paths))
            .toStrictEqual(['$.listField', '$.numField', '$.stringField']);
    });
    test('rendering a non-object value should just return itself', () => {
        expect(lib_1.FieldUtils.renderObject(lib_1.TaskInput.fromText('Hello World').value)).toEqual('Hello World');
        expect(lib_1.FieldUtils.renderObject('Hello World')).toEqual('Hello World');
        expect(lib_1.FieldUtils.renderObject(null)).toEqual(null);
        expect(lib_1.FieldUtils.renderObject(3.14)).toEqual(3.14);
        expect(lib_1.FieldUtils.renderObject(true)).toEqual(true);
        expect(lib_1.FieldUtils.renderObject(undefined)).toEqual(undefined);
    });
    test('repeated object references at different tree paths should not be considered as recursions', () => {
        const repeatedObject = {
            field: lib_1.JsonPath.stringAt('$.stringField'),
            numField: lib_1.JsonPath.numberAt('$.numField'),
        };
        expect(lib_1.FieldUtils.renderObject({
            reference1: repeatedObject,
            reference2: repeatedObject,
        })).toStrictEqual({
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
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.array('asdf', lib_1.JsonPath.stringAt('$.Id')),
        })).toEqual({
            'Field.$': "States.Array('asdf', $.Id)",
        });
    });
    test('arrayPartition', () => {
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.arrayPartition(lib_1.JsonPath.listAt('$.inputArray'), 4),
        })).toEqual({
            'Field.$': 'States.ArrayPartition($.inputArray, 4)',
        });
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.arrayPartition(lib_1.JsonPath.listAt('$.inputArray'), lib_1.JsonPath.numberAt('$.chunkSize')),
        })).toEqual({
            'Field.$': 'States.ArrayPartition($.inputArray, $.chunkSize)',
        });
    });
    test('arrayContains', () => {
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.arrayContains(lib_1.JsonPath.listAt('$.inputArray'), 5),
        })).toEqual({
            'Field.$': 'States.ArrayContains($.inputArray, 5)',
        });
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.arrayContains(lib_1.JsonPath.listAt('$.inputArray'), 'a'),
        })).toEqual({
            'Field.$': "States.ArrayContains($.inputArray, 'a')",
        });
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.arrayContains(lib_1.JsonPath.listAt('$.inputArray'), lib_1.JsonPath.numberAt('$.lookingFor')),
        })).toEqual({
            'Field.$': 'States.ArrayContains($.inputArray, $.lookingFor)',
        });
    });
    test('arrayRange', () => {
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.arrayRange(1, 9, 2),
        })).toEqual({
            'Field.$': 'States.ArrayRange(1, 9, 2)',
        });
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.arrayRange(lib_1.JsonPath.numberAt('$.start'), lib_1.JsonPath.numberAt('$.end'), lib_1.JsonPath.numberAt('$.step')),
        })).toEqual({
            'Field.$': 'States.ArrayRange($.start, $.end, $.step)',
        });
    });
    test('arrayGetItem', () => {
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.arrayGetItem(lib_1.JsonPath.listAt('$.inputArray'), 5),
        })).toEqual({
            'Field.$': 'States.ArrayGetItem($.inputArray, 5)',
        });
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.arrayGetItem(lib_1.JsonPath.numberAt('$.inputArray'), lib_1.JsonPath.numberAt('$.index')),
        })).toEqual({
            'Field.$': 'States.ArrayGetItem($.inputArray, $.index)',
        });
    });
    test('arrayLength', () => {
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.arrayLength(lib_1.JsonPath.listAt('$.inputArray')),
        })).toEqual({
            'Field.$': 'States.ArrayLength($.inputArray)',
        });
    });
    test('arrayUnique', () => {
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.arrayUnique(lib_1.JsonPath.listAt('$.inputArray')),
        })).toEqual({
            'Field.$': 'States.ArrayUnique($.inputArray)',
        });
    });
    test('base64Encode', () => {
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.base64Encode('Data to encode'),
        })).toEqual({
            'Field.$': "States.Base64Encode('Data to encode')",
        });
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.base64Encode(lib_1.JsonPath.stringAt('$.input')),
        })).toEqual({
            'Field.$': 'States.Base64Encode($.input)',
        });
    });
    test('base64Decode', () => {
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.base64Decode('RGF0YSB0byBlbmNvZGU='),
        })).toEqual({
            'Field.$': "States.Base64Decode('RGF0YSB0byBlbmNvZGU=')",
        });
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.base64Decode(lib_1.JsonPath.stringAt('$.base64')),
        })).toEqual({
            'Field.$': 'States.Base64Decode($.base64)',
        });
    });
    test('hash', () => {
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.hash('Input data', 'SHA-1'),
        })).toEqual({
            'Field.$': "States.Hash('Input data', 'SHA-1')",
        });
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.hash(lib_1.JsonPath.objectAt('$.Data'), lib_1.JsonPath.stringAt('$.Algorithm')),
        })).toEqual({
            'Field.$': 'States.Hash($.Data, $.Algorithm)',
        });
    });
    test('jsonMerge', () => {
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.jsonMerge(lib_1.JsonPath.objectAt('$.Obj1'), lib_1.JsonPath.objectAt('$.Obj2')),
        })).toEqual({
            'Field.$': 'States.JsonMerge($.Obj1, $.Obj2, false)',
        });
    });
    test('mathRandom', () => {
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.mathRandom(1, 999),
        })).toEqual({
            'Field.$': 'States.MathRandom(1, 999)',
        });
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.mathRandom(lib_1.JsonPath.numberAt('$.start'), lib_1.JsonPath.numberAt('$.end')),
        })).toEqual({
            'Field.$': 'States.MathRandom($.start, $.end)',
        });
    });
    test('mathAdd', () => {
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.mathAdd(1, 999),
        })).toEqual({
            'Field.$': 'States.MathAdd(1, 999)',
        });
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.mathAdd(lib_1.JsonPath.numberAt('$.value1'), lib_1.JsonPath.numberAt('$.step')),
        })).toEqual({
            'Field.$': 'States.MathAdd($.value1, $.step)',
        });
    });
    test('stringSplit', () => {
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.stringSplit('1,2,3,4,5', ','),
        })).toEqual({
            'Field.$': "States.StringSplit('1,2,3,4,5', ',')",
        });
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.stringSplit(lib_1.JsonPath.stringAt('$.inputString'), lib_1.JsonPath.stringAt('$.splitter')),
        })).toEqual({
            'Field.$': 'States.StringSplit($.inputString, $.splitter)',
        });
    });
    test('uuid', () => {
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.uuid(),
        })).toEqual({
            'Field.$': 'States.UUID()',
        });
    });
    test('format', () => {
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.format('Hi my name is {}.', lib_1.JsonPath.stringAt('$.Name')),
        })).toEqual({
            'Field.$': "States.Format('Hi my name is {}.', $.Name)",
        });
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.format(lib_1.JsonPath.stringAt('$.Format'), lib_1.JsonPath.stringAt('$.Name')),
        })).toEqual({
            'Field.$': 'States.Format($.Format, $.Name)',
        });
    });
    test('stringToJson', () => {
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.stringToJson(lib_1.JsonPath.stringAt('$.Str')),
        })).toEqual({
            'Field.$': 'States.StringToJson($.Str)',
        });
    });
    test('jsonToString', () => {
        expect(lib_1.FieldUtils.renderObject({
            Field: lib_1.JsonPath.jsonToString(lib_1.JsonPath.objectAt('$.Obj')),
        })).toEqual({
            'Field.$': 'States.JsonToString($.Obj)',
        });
    });
});
test('find task token even if nested in intrinsic functions', () => {
    expect(lib_1.FieldUtils.containsTaskToken({ x: lib_1.JsonPath.array(lib_1.JsonPath.taskToken) })).toEqual(true);
    expect(lib_1.FieldUtils.containsTaskToken({ x: lib_1.JsonPath.array('nope') })).toEqual(false);
    // Even if it's a hand-written literal and doesn't use our constructors
    expect(lib_1.FieldUtils.containsTaskToken({ x: lib_1.JsonPath.stringAt('States.Array($$.Task.Token)') })).toEqual(true);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmaWVsZHMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdDQUF5RDtBQUV6RCxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUN0QixNQUFNLDBCQUEwQixHQUFHLHljQUF5YyxDQUFDO0lBRTdlLElBQUksQ0FBQyxpREFBaUQsRUFBRSxHQUFHLEVBQUU7UUFDM0QsTUFBTSxDQUNKLGdCQUFVLENBQUMsWUFBWSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxTQUFTO1lBQ2xCLElBQUksRUFBRSxJQUFJO1lBQ1YsT0FBTyxFQUFFLFNBQVM7WUFDbEIsS0FBSyxFQUFFLGNBQVEsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDO1lBQ3pDLFNBQVMsRUFBRSxjQUFRLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQztZQUN6QyxJQUFJLEVBQUU7Z0JBQ0osU0FBUztnQkFDVDtvQkFDRSxTQUFTLEVBQUUsY0FBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUM7aUJBQzNDO2FBQ0Y7U0FDRixDQUFDLENBQ0gsQ0FBQyxhQUFhLENBQUM7WUFDZCxNQUFNLEVBQUUsSUFBSTtZQUNaLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLFNBQVMsRUFBRSxlQUFlO1lBQzFCLGFBQWEsRUFBRSxhQUFhO1lBQzVCLE1BQU0sRUFBRTtnQkFDTixTQUFTO2dCQUNUO29CQUNFLGFBQWEsRUFBRSxZQUFZO2lCQUM1QjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRTtZQUNqQyxNQUFNLENBQ0osZ0JBQVUsQ0FBQyxZQUFZLENBQUM7Z0JBQ3RCLEdBQUcsRUFBRSxjQUFRLENBQUMsUUFBUSxDQUFDLHdCQUF3QixDQUFDO2dCQUNoRCxLQUFLLEVBQUUsY0FBUSxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQztnQkFDL0MsS0FB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QTRCO1NBQ3hDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsdURBQXVELEVBQUUsR0FBRyxFQUFFO0lBQ2pFLE1BQU0sQ0FBQyxnQkFBVSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxFQUFFLGNBQVEsQ0FBQyxLQUFLLENBQUMsY0FBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUU5RixNQUFNLENBQUMsZ0JBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsRUFBRSxjQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVuRix1RUFBdUU7SUFDdkUsTUFBTSxDQUFDLGdCQUFVLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLEVBQUUsY0FBUSxDQUFDLFFBQVEsQ0FBQyw2QkFBNkIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5RyxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZpZWxkVXRpbHMsIEpzb25QYXRoLCBUYXNrSW5wdXQgfSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnRmllbGRzJywgKCkgPT4ge1xuICBjb25zdCBqc29uUGF0aFZhbGlkYXRpb25FcnJvck1zZyA9IC9leGFjdGx5ICdcXCQnLCAnXFwkXFwkJywgc3RhcnQgd2l0aCAnXFwkLicsIHN0YXJ0IHdpdGggJ1xcJFxcJC4nLCBzdGFydCB3aXRoICdcXCRcXFsnLCBvciBzdGFydCB3aXRoIGFuIGludHJpbnNpYyBmdW5jdGlvbjogU3RhdGVzLkFycmF5LCBTdGF0ZXMuQXJyYXlQYXJ0aXRpb24sIFN0YXRlcy5BcnJheUNvbnRhaW5zLCBTdGF0ZXMuQXJyYXlSYW5nZSwgU3RhdGVzLkFycmF5R2V0SXRlbSwgU3RhdGVzLkFycmF5TGVuZ3RoLCBTdGF0ZXMuQXJyYXlVbmlxdWUsIFN0YXRlcy5CYXNlNjRFbmNvZGUsIFN0YXRlcy5CYXNlNjREZWNvZGUsIFN0YXRlcy5IYXNoLCBTdGF0ZXMuSnNvbk1lcmdlLCBTdGF0ZXMuU3RyaW5nVG9Kc29uLCBTdGF0ZXMuSnNvblRvU3RyaW5nLCBTdGF0ZXMuTWF0aFJhbmRvbSwgU3RhdGVzLk1hdGhBZGQsIFN0YXRlcy5TdHJpbmdTcGxpdCwgU3RhdGVzLlVVSUQsIG9yIFN0YXRlcy5Gb3JtYXQuLztcblxuICB0ZXN0KCdkZWVwIHJlcGxhY2UgY29ycmVjdGx5IGhhbmRsZXMgZmllbGRzIGluIGFycmF5cycsICgpID0+IHtcbiAgICBleHBlY3QoXG4gICAgICBGaWVsZFV0aWxzLnJlbmRlck9iamVjdCh7XG4gICAgICAgIHVua25vd246IHVuZGVmaW5lZCxcbiAgICAgICAgYm9vbDogdHJ1ZSxcbiAgICAgICAgbGl0ZXJhbDogJ2xpdGVyYWwnLFxuICAgICAgICBmaWVsZDogSnNvblBhdGguc3RyaW5nQXQoJyQuc3RyaW5nRmllbGQnKSxcbiAgICAgICAgbGlzdEZpZWxkOiBKc29uUGF0aC5saXN0QXQoJyQubGlzdEZpZWxkJyksXG4gICAgICAgIGRlZXA6IFtcbiAgICAgICAgICAnbGl0ZXJhbCcsXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVlcEZpZWxkOiBKc29uUGF0aC5udW1iZXJBdCgnJC5udW1GaWVsZCcpLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KSxcbiAgICApLnRvU3RyaWN0RXF1YWwoe1xuICAgICAgJ2Jvb2wnOiB0cnVlLFxuICAgICAgJ2xpdGVyYWwnOiAnbGl0ZXJhbCcsXG4gICAgICAnZmllbGQuJCc6ICckLnN0cmluZ0ZpZWxkJyxcbiAgICAgICdsaXN0RmllbGQuJCc6ICckLmxpc3RGaWVsZCcsXG4gICAgICAnZGVlcCc6IFtcbiAgICAgICAgJ2xpdGVyYWwnLFxuICAgICAgICB7XG4gICAgICAgICAgJ2RlZXBGaWVsZC4kJzogJyQubnVtRmllbGQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSksXG4gIHRlc3QoJ2V4ZXJjaXNlIGNvbnRleHRwYXRocycsICgpID0+IHtcbiAgICBleHBlY3QoXG4gICAgICBGaWVsZFV0aWxzLnJlbmRlck9iamVjdCh7XG4gICAgICAgIHN0cjogSnNvblBhdGguc3RyaW5nQXQoJyQkLkV4ZWN1dGlvbi5TdGFydFRpbWUnKSxcbiAgICAgICAgY291bnQ6IEpzb25QYXRoLm51bWJlckF0KCckJC5TdGF0ZS5SZXRyeUNvdW50JyksXG4gICAgICAgIHRva2VuOiBKc29uUGF0aC50YXNrVG9rZW4sXG4gICAgICAgIGVudGlyZTogSnNvblBhdGguZW50aXJlQ29udGV4dCxcbiAgICAgIH0pLFxuICAgICkudG9TdHJpY3RFcXVhbCh7XG4gICAgICAnc3RyLiQnOiAnJCQuRXhlY3V0aW9uLlN0YXJ0VGltZScsXG4gICAgICAnY291bnQuJCc6ICckJC5TdGF0ZS5SZXRyeUNvdW50JyxcbiAgICAgICd0b2tlbi4kJzogJyQkLlRhc2suVG9rZW4nLFxuICAgICAgJ2VudGlyZS4kJzogJyQkJyxcbiAgICB9KTtcbiAgfSksXG4gIHRlc3QoJ2ZpbmQgYWxsIHJlZmVyZW5jZWQgcGF0aHMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KFxuICAgICAgRmllbGRVdGlscy5maW5kUmVmZXJlbmNlZFBhdGhzKHtcbiAgICAgICAgYm9vbDogZmFsc2UsXG4gICAgICAgIGxpdGVyYWw6ICdsaXRlcmFsJyxcbiAgICAgICAgZmllbGQ6IEpzb25QYXRoLnN0cmluZ0F0KCckLnN0cmluZ0ZpZWxkJyksXG4gICAgICAgIGxpc3RGaWVsZDogSnNvblBhdGgubGlzdEF0KCckLmxpc3RGaWVsZCcpLFxuICAgICAgICBkZWVwOiBbXG4gICAgICAgICAgJ2xpdGVyYWwnLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGZpZWxkOiBKc29uUGF0aC5zdHJpbmdBdCgnJC5zdHJpbmdGaWVsZCcpLFxuICAgICAgICAgICAgZGVlcEZpZWxkOiBKc29uUGF0aC5udW1iZXJBdCgnJC5udW1GaWVsZCcpLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KSxcbiAgICApLnRvU3RyaWN0RXF1YWwoWyckLmxpc3RGaWVsZCcsICckLm51bUZpZWxkJywgJyQuc3RyaW5nRmllbGQnXSk7XG4gIH0pLFxuICB0ZXN0KCdKc29uUGF0aC5saXN0QXQgYmVmb3JlIFBhcmFsbGVsJywgKCkgPT4ge1xuICAgIGV4cGVjdChcbiAgICAgIEZpZWxkVXRpbHMuZmluZFJlZmVyZW5jZWRQYXRocyh7XG4gICAgICAgIGxpc3RBdDogSnNvblBhdGgubGlzdEF0KCckWzBdLnN0cmluZ0xpc3QnKSxcbiAgICAgIH0pLFxuICAgICkudG9TdHJpY3RFcXVhbChbJyRbMF0uc3RyaW5nTGlzdCddKTtcbiAgfSk7XG4gIHRlc3QoJ2Nhbm5vdCBoYXZlIEpzb25QYXRoIGZpZWxkcyBpbiBhcnJheXMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IEZpZWxkVXRpbHMucmVuZGVyT2JqZWN0KHtcbiAgICAgIGRlZXA6IFtKc29uUGF0aC5zdHJpbmdBdCgnJC5oZWxsbycpXSxcbiAgICB9KSkudG9UaHJvd0Vycm9yKC9DYW5ub3QgdXNlIEpzb25QYXRoIGZpZWxkcyBpbiBhbiBhcnJheS8pO1xuICB9KSxcbiAgdGVzdCgnZGF0YWZpZWxkIHBhdGggbXVzdCBiZSBjb3JyZWN0JywgKCkgPT4ge1xuICAgIGV4cGVjdChKc29uUGF0aC5zdHJpbmdBdCgnJCcpKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChKc29uUGF0aC5zdHJpbmdBdCgnU3RhdGVzLkZvcm1hdCcpKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChKc29uUGF0aC5zdHJpbmdBdCgnU3RhdGVzLlN0cmluZ1RvSnNvbicpKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChKc29uUGF0aC5zdHJpbmdBdCgnU3RhdGVzLkpzb25Ub1N0cmluZycpKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChKc29uUGF0aC5zdHJpbmdBdCgnU3RhdGVzLkFycmF5JykpLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KEpzb25QYXRoLnN0cmluZ0F0KCdTdGF0ZXMuQXJyYXlQYXJ0aXRpb24nKSkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QoSnNvblBhdGguc3RyaW5nQXQoJ1N0YXRlcy5BcnJheUNvbnRhaW5zJykpLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KEpzb25QYXRoLnN0cmluZ0F0KCdTdGF0ZXMuQXJyYXlSYW5nZScpKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChKc29uUGF0aC5zdHJpbmdBdCgnU3RhdGVzLkFycmF5R2V0SXRlbScpKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChKc29uUGF0aC5zdHJpbmdBdCgnU3RhdGVzLkFycmF5TGVuZ3RoJykpLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KEpzb25QYXRoLnN0cmluZ0F0KCdTdGF0ZXMuQXJyYXlVbmlxdWUnKSkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QoSnNvblBhdGguc3RyaW5nQXQoJ1N0YXRlcy5CYXNlNjRFbmNvZGUnKSkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QoSnNvblBhdGguc3RyaW5nQXQoJ1N0YXRlcy5CYXNlNjREZWNvZGUnKSkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QoSnNvblBhdGguc3RyaW5nQXQoJ1N0YXRlcy5IYXNoJykpLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KEpzb25QYXRoLnN0cmluZ0F0KCdTdGF0ZXMuSnNvbk1lcmdlJykpLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KEpzb25QYXRoLnN0cmluZ0F0KCdTdGF0ZXMuTWF0aFJhbmRvbScpKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChKc29uUGF0aC5zdHJpbmdBdCgnU3RhdGVzLk1hdGhBZGQnKSkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QoSnNvblBhdGguc3RyaW5nQXQoJ1N0YXRlcy5TdHJpbmdTcGxpdCcpKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChKc29uUGF0aC5zdHJpbmdBdCgnU3RhdGVzLlVVSUQnKSkudG9CZURlZmluZWQoKTtcblxuICAgIGV4cGVjdCgoKSA9PiBKc29uUGF0aC5zdHJpbmdBdCgnJGhlbGxvJykpLnRvVGhyb3dFcnJvcihqc29uUGF0aFZhbGlkYXRpb25FcnJvck1zZyk7XG4gICAgZXhwZWN0KCgpID0+IEpzb25QYXRoLnN0cmluZ0F0KCdoZWxsbycpKS50b1Rocm93RXJyb3IoanNvblBhdGhWYWxpZGF0aW9uRXJyb3JNc2cpO1xuICAgIGV4cGVjdCgoKSA9PiBKc29uUGF0aC5zdHJpbmdBdCgnU3RhdGVzLkZvb0JhcicpKS50b1Rocm93RXJyb3IoanNvblBhdGhWYWxpZGF0aW9uRXJyb3JNc2cpO1xuICB9KSxcbiAgdGVzdCgnY29udGV4dCBwYXRoIG11c3QgYmUgY29ycmVjdCcsICgpID0+IHtcbiAgICBleHBlY3QoSnNvblBhdGguc3RyaW5nQXQoJyQkJykpLnRvQmVEZWZpbmVkKCk7XG5cbiAgICBleHBlY3QoKCkgPT4gSnNvblBhdGguc3RyaW5nQXQoJyQkaGVsbG8nKSkudG9UaHJvd0Vycm9yKGpzb25QYXRoVmFsaWRhdGlvbkVycm9yTXNnKTtcbiAgICBleHBlY3QoKCkgPT4gSnNvblBhdGguc3RyaW5nQXQoJ2hlbGxvJykpLnRvVGhyb3dFcnJvcihqc29uUGF0aFZhbGlkYXRpb25FcnJvck1zZyk7XG4gIH0pLFxuICB0ZXN0KCdkYXRhZmllbGQgcGF0aCB3aXRoIGFycmF5IG11c3QgYmUgY29ycmVjdCcsICgpID0+IHtcbiAgICBleHBlY3QoSnNvblBhdGguc3RyaW5nQXQoJyRbMF0nKSkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QoSnNvblBhdGguc3RyaW5nQXQoXCIkWydhYmMnXVwiKSkudG9CZURlZmluZWQoKTtcbiAgfSksXG4gIHRlc3QoJ3Rlc3QgY29udGFpbnMgdGFzayB0b2tlbicsICgpID0+IHtcbiAgICBleHBlY3QodHJ1ZSkudG9FcXVhbChcbiAgICAgIEZpZWxkVXRpbHMuY29udGFpbnNUYXNrVG9rZW4oe1xuICAgICAgICBmaWVsZDogSnNvblBhdGgudGFza1Rva2VuLFxuICAgICAgfSksXG4gICAgKTtcblxuICAgIGV4cGVjdCh0cnVlKS50b0VxdWFsKFxuICAgICAgRmllbGRVdGlscy5jb250YWluc1Rhc2tUb2tlbih7XG4gICAgICAgIGZpZWxkOiBKc29uUGF0aC5zdHJpbmdBdCgnJCQuVGFzaycpLFxuICAgICAgfSksXG4gICAgKTtcblxuICAgIGV4cGVjdCh0cnVlKS50b0VxdWFsKFxuICAgICAgRmllbGRVdGlscy5jb250YWluc1Rhc2tUb2tlbih7XG4gICAgICAgIGZpZWxkOiBKc29uUGF0aC5lbnRpcmVDb250ZXh0LFxuICAgICAgfSksXG4gICAgKTtcblxuICAgIGV4cGVjdChmYWxzZSkudG9FcXVhbChcbiAgICAgIEZpZWxkVXRpbHMuY29udGFpbnNUYXNrVG9rZW4oe1xuICAgICAgICBvb3BzOiAnbm90IGhlcmUnLFxuICAgICAgfSksXG4gICAgKTtcblxuICAgIGV4cGVjdChmYWxzZSkudG9FcXVhbChcbiAgICAgIEZpZWxkVXRpbHMuY29udGFpbnNUYXNrVG9rZW4oe1xuICAgICAgICBvb3BzOiBKc29uUGF0aC5zdHJpbmdBdCgnJCQuRXhlY3V0aW9uLlN0YXJ0VGltZScpLFxuICAgICAgfSksXG4gICAgKTtcbiAgfSksXG4gIHRlc3QoJ2FyYml0cmFyeSBKU09OUGF0aCBmaWVsZHMgYXJlIG5vdCByZXBsYWNlZCcsICgpID0+IHtcbiAgICBleHBlY3QoXG4gICAgICBGaWVsZFV0aWxzLnJlbmRlck9iamVjdCh7XG4gICAgICAgIGZpZWxkOiAnJC5jb250ZW50JyxcbiAgICAgIH0pLFxuICAgICkudG9TdHJpY3RFcXVhbCh7XG4gICAgICBmaWVsZDogJyQuY29udGVudCcsXG4gICAgfSk7XG4gIH0pLFxuICB0ZXN0KCdmaWVsZHMgY2Fubm90IGJlIHVzZWQgc29tZXdoZXJlIGluIGEgc3RyaW5nIGludGVycG9sYXRpb24nLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IEZpZWxkVXRpbHMucmVuZGVyT2JqZWN0KHtcbiAgICAgIGZpZWxkOiBgY29udGFpbnMgJHtKc29uUGF0aC5zdHJpbmdBdCgnJC5oZWxsbycpfWAsXG4gICAgfSkpLnRvVGhyb3dFcnJvcigvRmllbGQgcmVmZXJlbmNlcyBtdXN0IGJlIHRoZSBlbnRpcmUgc3RyaW5nLyk7XG4gIH0pO1xuICB0ZXN0KCdpbmZpbml0ZWx5IHJlY3Vyc2l2ZSBvYmplY3QgZ3JhcGhzIGRvIG5vdCBicmVhayByZWZlcmVuY2VkIHBhdGggZmluZGluZycsICgpID0+IHtcbiAgICBjb25zdCBkZWVwT2JqZWN0ID0ge1xuICAgICAgZmllbGQ6IEpzb25QYXRoLnN0cmluZ0F0KCckLnN0cmluZ0ZpZWxkJyksXG4gICAgICBkZWVwRmllbGQ6IEpzb25QYXRoLm51bWJlckF0KCckLm51bUZpZWxkJyksXG4gICAgICByZWN1cnNpdmVGaWVsZDogdW5kZWZpbmVkIGFzIGFueSxcbiAgICB9O1xuICAgIGNvbnN0IHBhdGhzID0ge1xuICAgICAgYm9vbDogZmFsc2UsXG4gICAgICBsaXRlcmFsOiAnbGl0ZXJhbCcsXG4gICAgICBmaWVsZDogSnNvblBhdGguc3RyaW5nQXQoJyQuc3RyaW5nRmllbGQnKSxcbiAgICAgIGxpc3RGaWVsZDogSnNvblBhdGgubGlzdEF0KCckLmxpc3RGaWVsZCcpLFxuICAgICAgcmVjdXJzaXZlRmllbGQ6IHVuZGVmaW5lZCBhcyBhbnksXG4gICAgICBkZWVwOiBbXG4gICAgICAgICdsaXRlcmFsJyxcbiAgICAgICAgZGVlcE9iamVjdCxcbiAgICAgIF0sXG4gICAgfTtcbiAgICBwYXRocy5yZWN1cnNpdmVGaWVsZCA9IHBhdGhzO1xuICAgIGRlZXBPYmplY3QucmVjdXJzaXZlRmllbGQgPSBwYXRocztcbiAgICBleHBlY3QoRmllbGRVdGlscy5maW5kUmVmZXJlbmNlZFBhdGhzKHBhdGhzKSlcbiAgICAgIC50b1N0cmljdEVxdWFsKFsnJC5saXN0RmllbGQnLCAnJC5udW1GaWVsZCcsICckLnN0cmluZ0ZpZWxkJ10pO1xuICB9KTtcblxuICB0ZXN0KCdyZW5kZXJpbmcgYSBub24tb2JqZWN0IHZhbHVlIHNob3VsZCBqdXN0IHJldHVybiBpdHNlbGYnLCAoKSA9PiB7XG4gICAgZXhwZWN0KFxuICAgICAgRmllbGRVdGlscy5yZW5kZXJPYmplY3QoVGFza0lucHV0LmZyb21UZXh0KCdIZWxsbyBXb3JsZCcpLnZhbHVlKSxcbiAgICApLnRvRXF1YWwoXG4gICAgICAnSGVsbG8gV29ybGQnLFxuICAgICk7XG4gICAgZXhwZWN0KFxuICAgICAgRmllbGRVdGlscy5yZW5kZXJPYmplY3QoJ0hlbGxvIFdvcmxkJyBhcyBhbnkpLFxuICAgICkudG9FcXVhbChcbiAgICAgICdIZWxsbyBXb3JsZCcsXG4gICAgKTtcbiAgICBleHBlY3QoXG4gICAgICBGaWVsZFV0aWxzLnJlbmRlck9iamVjdChudWxsIGFzIGFueSksXG4gICAgKS50b0VxdWFsKFxuICAgICAgbnVsbCxcbiAgICApO1xuICAgIGV4cGVjdChcbiAgICAgIEZpZWxkVXRpbHMucmVuZGVyT2JqZWN0KDMuMTQgYXMgYW55KSxcbiAgICApLnRvRXF1YWwoXG4gICAgICAzLjE0LFxuICAgICk7XG4gICAgZXhwZWN0KFxuICAgICAgRmllbGRVdGlscy5yZW5kZXJPYmplY3QodHJ1ZSBhcyBhbnkpLFxuICAgICkudG9FcXVhbChcbiAgICAgIHRydWUsXG4gICAgKTtcbiAgICBleHBlY3QoXG4gICAgICBGaWVsZFV0aWxzLnJlbmRlck9iamVjdCh1bmRlZmluZWQpLFxuICAgICkudG9FcXVhbChcbiAgICAgIHVuZGVmaW5lZCxcbiAgICApO1xuICB9KTtcblxuICB0ZXN0KCdyZXBlYXRlZCBvYmplY3QgcmVmZXJlbmNlcyBhdCBkaWZmZXJlbnQgdHJlZSBwYXRocyBzaG91bGQgbm90IGJlIGNvbnNpZGVyZWQgYXMgcmVjdXJzaW9ucycsICgpID0+IHtcbiAgICBjb25zdCByZXBlYXRlZE9iamVjdCA9IHtcbiAgICAgIGZpZWxkOiBKc29uUGF0aC5zdHJpbmdBdCgnJC5zdHJpbmdGaWVsZCcpLFxuICAgICAgbnVtRmllbGQ6IEpzb25QYXRoLm51bWJlckF0KCckLm51bUZpZWxkJyksXG4gICAgfTtcbiAgICBleHBlY3QoRmllbGRVdGlscy5yZW5kZXJPYmplY3QoXG4gICAgICB7XG4gICAgICAgIHJlZmVyZW5jZTE6IHJlcGVhdGVkT2JqZWN0LFxuICAgICAgICByZWZlcmVuY2UyOiByZXBlYXRlZE9iamVjdCxcbiAgICAgIH0sXG4gICAgKSkudG9TdHJpY3RFcXVhbCh7XG4gICAgICByZWZlcmVuY2UxOiB7XG4gICAgICAgICdmaWVsZC4kJzogJyQuc3RyaW5nRmllbGQnLFxuICAgICAgICAnbnVtRmllbGQuJCc6ICckLm51bUZpZWxkJyxcbiAgICAgIH0sXG4gICAgICByZWZlcmVuY2UyOiB7XG4gICAgICAgICdmaWVsZC4kJzogJyQuc3RyaW5nRmllbGQnLFxuICAgICAgICAnbnVtRmllbGQuJCc6ICckLm51bUZpZWxkJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdpbnRyaW5zaWNzIGNvbnN0cnVjdG9ycycsICgpID0+IHtcbiAgdGVzdCgnYXJyYXknLCAoKSA9PiB7XG4gICAgZXhwZWN0KEZpZWxkVXRpbHMucmVuZGVyT2JqZWN0KHtcbiAgICAgIEZpZWxkOiBKc29uUGF0aC5hcnJheSgnYXNkZicsIEpzb25QYXRoLnN0cmluZ0F0KCckLklkJykpLFxuICAgIH0pKS50b0VxdWFsKHtcbiAgICAgICdGaWVsZC4kJzogXCJTdGF0ZXMuQXJyYXkoJ2FzZGYnLCAkLklkKVwiLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhcnJheVBhcnRpdGlvbicsICgpID0+IHtcbiAgICBleHBlY3QoRmllbGRVdGlscy5yZW5kZXJPYmplY3Qoe1xuICAgICAgRmllbGQ6IEpzb25QYXRoLmFycmF5UGFydGl0aW9uKEpzb25QYXRoLmxpc3RBdCgnJC5pbnB1dEFycmF5JyksIDQpLFxuICAgIH0pKS50b0VxdWFsKHtcbiAgICAgICdGaWVsZC4kJzogJ1N0YXRlcy5BcnJheVBhcnRpdGlvbigkLmlucHV0QXJyYXksIDQpJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdChGaWVsZFV0aWxzLnJlbmRlck9iamVjdCh7XG4gICAgICBGaWVsZDogSnNvblBhdGguYXJyYXlQYXJ0aXRpb24oSnNvblBhdGgubGlzdEF0KCckLmlucHV0QXJyYXknKSwgSnNvblBhdGgubnVtYmVyQXQoJyQuY2h1bmtTaXplJykpLFxuICAgIH0pKS50b0VxdWFsKHtcbiAgICAgICdGaWVsZC4kJzogJ1N0YXRlcy5BcnJheVBhcnRpdGlvbigkLmlucHV0QXJyYXksICQuY2h1bmtTaXplKScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FycmF5Q29udGFpbnMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KEZpZWxkVXRpbHMucmVuZGVyT2JqZWN0KHtcbiAgICAgIEZpZWxkOiBKc29uUGF0aC5hcnJheUNvbnRhaW5zKEpzb25QYXRoLmxpc3RBdCgnJC5pbnB1dEFycmF5JyksIDUpLFxuICAgIH0pKS50b0VxdWFsKHtcbiAgICAgICdGaWVsZC4kJzogJ1N0YXRlcy5BcnJheUNvbnRhaW5zKCQuaW5wdXRBcnJheSwgNSknLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KEZpZWxkVXRpbHMucmVuZGVyT2JqZWN0KHtcbiAgICAgIEZpZWxkOiBKc29uUGF0aC5hcnJheUNvbnRhaW5zKEpzb25QYXRoLmxpc3RBdCgnJC5pbnB1dEFycmF5JyksICdhJyksXG4gICAgfSkpLnRvRXF1YWwoe1xuICAgICAgJ0ZpZWxkLiQnOiBcIlN0YXRlcy5BcnJheUNvbnRhaW5zKCQuaW5wdXRBcnJheSwgJ2EnKVwiLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KEZpZWxkVXRpbHMucmVuZGVyT2JqZWN0KHtcbiAgICAgIEZpZWxkOiBKc29uUGF0aC5hcnJheUNvbnRhaW5zKEpzb25QYXRoLmxpc3RBdCgnJC5pbnB1dEFycmF5JyksIEpzb25QYXRoLm51bWJlckF0KCckLmxvb2tpbmdGb3InKSksXG4gICAgfSkpLnRvRXF1YWwoe1xuICAgICAgJ0ZpZWxkLiQnOiAnU3RhdGVzLkFycmF5Q29udGFpbnMoJC5pbnB1dEFycmF5LCAkLmxvb2tpbmdGb3IpJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYXJyYXlSYW5nZScsICgpID0+IHtcbiAgICBleHBlY3QoRmllbGRVdGlscy5yZW5kZXJPYmplY3Qoe1xuICAgICAgRmllbGQ6IEpzb25QYXRoLmFycmF5UmFuZ2UoMSwgOSwgMiksXG4gICAgfSkpLnRvRXF1YWwoe1xuICAgICAgJ0ZpZWxkLiQnOiAnU3RhdGVzLkFycmF5UmFuZ2UoMSwgOSwgMiknLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KEZpZWxkVXRpbHMucmVuZGVyT2JqZWN0KHtcbiAgICAgIEZpZWxkOiBKc29uUGF0aC5hcnJheVJhbmdlKEpzb25QYXRoLm51bWJlckF0KCckLnN0YXJ0JyksIEpzb25QYXRoLm51bWJlckF0KCckLmVuZCcpLCBKc29uUGF0aC5udW1iZXJBdCgnJC5zdGVwJykpLFxuICAgIH0pKS50b0VxdWFsKHtcbiAgICAgICdGaWVsZC4kJzogJ1N0YXRlcy5BcnJheVJhbmdlKCQuc3RhcnQsICQuZW5kLCAkLnN0ZXApJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYXJyYXlHZXRJdGVtJywgKCkgPT4ge1xuICAgIGV4cGVjdChGaWVsZFV0aWxzLnJlbmRlck9iamVjdCh7XG4gICAgICBGaWVsZDogSnNvblBhdGguYXJyYXlHZXRJdGVtKEpzb25QYXRoLmxpc3RBdCgnJC5pbnB1dEFycmF5JyksIDUpLFxuICAgIH0pKS50b0VxdWFsKHtcbiAgICAgICdGaWVsZC4kJzogJ1N0YXRlcy5BcnJheUdldEl0ZW0oJC5pbnB1dEFycmF5LCA1KScsXG4gICAgfSk7XG5cbiAgICBleHBlY3QoRmllbGRVdGlscy5yZW5kZXJPYmplY3Qoe1xuICAgICAgRmllbGQ6IEpzb25QYXRoLmFycmF5R2V0SXRlbShKc29uUGF0aC5udW1iZXJBdCgnJC5pbnB1dEFycmF5JyksIEpzb25QYXRoLm51bWJlckF0KCckLmluZGV4JykpLFxuICAgIH0pKS50b0VxdWFsKHtcbiAgICAgICdGaWVsZC4kJzogJ1N0YXRlcy5BcnJheUdldEl0ZW0oJC5pbnB1dEFycmF5LCAkLmluZGV4KScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FycmF5TGVuZ3RoJywgKCkgPT4ge1xuICAgIGV4cGVjdChGaWVsZFV0aWxzLnJlbmRlck9iamVjdCh7XG4gICAgICBGaWVsZDogSnNvblBhdGguYXJyYXlMZW5ndGgoSnNvblBhdGgubGlzdEF0KCckLmlucHV0QXJyYXknKSksXG4gICAgfSkpLnRvRXF1YWwoe1xuICAgICAgJ0ZpZWxkLiQnOiAnU3RhdGVzLkFycmF5TGVuZ3RoKCQuaW5wdXRBcnJheSknLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhcnJheVVuaXF1ZScsICgpID0+IHtcbiAgICBleHBlY3QoRmllbGRVdGlscy5yZW5kZXJPYmplY3Qoe1xuICAgICAgRmllbGQ6IEpzb25QYXRoLmFycmF5VW5pcXVlKEpzb25QYXRoLmxpc3RBdCgnJC5pbnB1dEFycmF5JykpLFxuICAgIH0pKS50b0VxdWFsKHtcbiAgICAgICdGaWVsZC4kJzogJ1N0YXRlcy5BcnJheVVuaXF1ZSgkLmlucHV0QXJyYXkpJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYmFzZTY0RW5jb2RlJywgKCkgPT4ge1xuICAgIGV4cGVjdChGaWVsZFV0aWxzLnJlbmRlck9iamVjdCh7XG4gICAgICBGaWVsZDogSnNvblBhdGguYmFzZTY0RW5jb2RlKCdEYXRhIHRvIGVuY29kZScpLFxuICAgIH0pKS50b0VxdWFsKHtcbiAgICAgICdGaWVsZC4kJzogXCJTdGF0ZXMuQmFzZTY0RW5jb2RlKCdEYXRhIHRvIGVuY29kZScpXCIsXG4gICAgfSk7XG5cbiAgICBleHBlY3QoRmllbGRVdGlscy5yZW5kZXJPYmplY3Qoe1xuICAgICAgRmllbGQ6IEpzb25QYXRoLmJhc2U2NEVuY29kZShKc29uUGF0aC5zdHJpbmdBdCgnJC5pbnB1dCcpKSxcbiAgICB9KSkudG9FcXVhbCh7XG4gICAgICAnRmllbGQuJCc6ICdTdGF0ZXMuQmFzZTY0RW5jb2RlKCQuaW5wdXQpJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYmFzZTY0RGVjb2RlJywgKCkgPT4ge1xuICAgIGV4cGVjdChGaWVsZFV0aWxzLnJlbmRlck9iamVjdCh7XG4gICAgICBGaWVsZDogSnNvblBhdGguYmFzZTY0RGVjb2RlKCdSR0YwWVNCMGJ5QmxibU52WkdVPScpLFxuICAgIH0pKS50b0VxdWFsKHtcbiAgICAgICdGaWVsZC4kJzogXCJTdGF0ZXMuQmFzZTY0RGVjb2RlKCdSR0YwWVNCMGJ5QmxibU52WkdVPScpXCIsXG4gICAgfSk7XG5cbiAgICBleHBlY3QoRmllbGRVdGlscy5yZW5kZXJPYmplY3Qoe1xuICAgICAgRmllbGQ6IEpzb25QYXRoLmJhc2U2NERlY29kZShKc29uUGF0aC5zdHJpbmdBdCgnJC5iYXNlNjQnKSksXG4gICAgfSkpLnRvRXF1YWwoe1xuICAgICAgJ0ZpZWxkLiQnOiAnU3RhdGVzLkJhc2U2NERlY29kZSgkLmJhc2U2NCknLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdoYXNoJywgKCkgPT4ge1xuICAgIGV4cGVjdChGaWVsZFV0aWxzLnJlbmRlck9iamVjdCh7XG4gICAgICBGaWVsZDogSnNvblBhdGguaGFzaCgnSW5wdXQgZGF0YScsICdTSEEtMScpLFxuICAgIH0pKS50b0VxdWFsKHtcbiAgICAgICdGaWVsZC4kJzogXCJTdGF0ZXMuSGFzaCgnSW5wdXQgZGF0YScsICdTSEEtMScpXCIsXG4gICAgfSk7XG5cbiAgICBleHBlY3QoRmllbGRVdGlscy5yZW5kZXJPYmplY3Qoe1xuICAgICAgRmllbGQ6IEpzb25QYXRoLmhhc2goSnNvblBhdGgub2JqZWN0QXQoJyQuRGF0YScpLCBKc29uUGF0aC5zdHJpbmdBdCgnJC5BbGdvcml0aG0nKSksXG4gICAgfSkpLnRvRXF1YWwoe1xuICAgICAgJ0ZpZWxkLiQnOiAnU3RhdGVzLkhhc2goJC5EYXRhLCAkLkFsZ29yaXRobSknLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdqc29uTWVyZ2UnLCAoKSA9PiB7XG4gICAgZXhwZWN0KEZpZWxkVXRpbHMucmVuZGVyT2JqZWN0KHtcbiAgICAgIEZpZWxkOiBKc29uUGF0aC5qc29uTWVyZ2UoSnNvblBhdGgub2JqZWN0QXQoJyQuT2JqMScpLCBKc29uUGF0aC5vYmplY3RBdCgnJC5PYmoyJykpLFxuICAgIH0pKS50b0VxdWFsKHtcbiAgICAgICdGaWVsZC4kJzogJ1N0YXRlcy5Kc29uTWVyZ2UoJC5PYmoxLCAkLk9iajIsIGZhbHNlKScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ21hdGhSYW5kb20nLCAoKSA9PiB7XG4gICAgZXhwZWN0KEZpZWxkVXRpbHMucmVuZGVyT2JqZWN0KHtcbiAgICAgIEZpZWxkOiBKc29uUGF0aC5tYXRoUmFuZG9tKDEsIDk5OSksXG4gICAgfSkpLnRvRXF1YWwoe1xuICAgICAgJ0ZpZWxkLiQnOiAnU3RhdGVzLk1hdGhSYW5kb20oMSwgOTk5KScsXG4gICAgfSk7XG5cbiAgICBleHBlY3QoRmllbGRVdGlscy5yZW5kZXJPYmplY3Qoe1xuICAgICAgRmllbGQ6IEpzb25QYXRoLm1hdGhSYW5kb20oSnNvblBhdGgubnVtYmVyQXQoJyQuc3RhcnQnKSwgSnNvblBhdGgubnVtYmVyQXQoJyQuZW5kJykpLFxuICAgIH0pKS50b0VxdWFsKHtcbiAgICAgICdGaWVsZC4kJzogJ1N0YXRlcy5NYXRoUmFuZG9tKCQuc3RhcnQsICQuZW5kKScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ21hdGhBZGQnLCAoKSA9PiB7XG4gICAgZXhwZWN0KEZpZWxkVXRpbHMucmVuZGVyT2JqZWN0KHtcbiAgICAgIEZpZWxkOiBKc29uUGF0aC5tYXRoQWRkKDEsIDk5OSksXG4gICAgfSkpLnRvRXF1YWwoe1xuICAgICAgJ0ZpZWxkLiQnOiAnU3RhdGVzLk1hdGhBZGQoMSwgOTk5KScsXG4gICAgfSk7XG5cbiAgICBleHBlY3QoRmllbGRVdGlscy5yZW5kZXJPYmplY3Qoe1xuICAgICAgRmllbGQ6IEpzb25QYXRoLm1hdGhBZGQoSnNvblBhdGgubnVtYmVyQXQoJyQudmFsdWUxJyksIEpzb25QYXRoLm51bWJlckF0KCckLnN0ZXAnKSksXG4gICAgfSkpLnRvRXF1YWwoe1xuICAgICAgJ0ZpZWxkLiQnOiAnU3RhdGVzLk1hdGhBZGQoJC52YWx1ZTEsICQuc3RlcCknLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzdHJpbmdTcGxpdCcsICgpID0+IHtcbiAgICBleHBlY3QoRmllbGRVdGlscy5yZW5kZXJPYmplY3Qoe1xuICAgICAgRmllbGQ6IEpzb25QYXRoLnN0cmluZ1NwbGl0KCcxLDIsMyw0LDUnLCAnLCcpLFxuICAgIH0pKS50b0VxdWFsKHtcbiAgICAgICdGaWVsZC4kJzogXCJTdGF0ZXMuU3RyaW5nU3BsaXQoJzEsMiwzLDQsNScsICcsJylcIixcbiAgICB9KTtcblxuICAgIGV4cGVjdChGaWVsZFV0aWxzLnJlbmRlck9iamVjdCh7XG4gICAgICBGaWVsZDogSnNvblBhdGguc3RyaW5nU3BsaXQoSnNvblBhdGguc3RyaW5nQXQoJyQuaW5wdXRTdHJpbmcnKSwgSnNvblBhdGguc3RyaW5nQXQoJyQuc3BsaXR0ZXInKSksXG4gICAgfSkpLnRvRXF1YWwoe1xuICAgICAgJ0ZpZWxkLiQnOiAnU3RhdGVzLlN0cmluZ1NwbGl0KCQuaW5wdXRTdHJpbmcsICQuc3BsaXR0ZXIpJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndXVpZCcsICgpID0+IHtcbiAgICBleHBlY3QoRmllbGRVdGlscy5yZW5kZXJPYmplY3Qoe1xuICAgICAgRmllbGQ6IEpzb25QYXRoLnV1aWQoKSxcbiAgICB9KSkudG9FcXVhbCh7XG4gICAgICAnRmllbGQuJCc6ICdTdGF0ZXMuVVVJRCgpJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZm9ybWF0JywgKCkgPT4ge1xuICAgIGV4cGVjdChGaWVsZFV0aWxzLnJlbmRlck9iamVjdCh7XG4gICAgICBGaWVsZDogSnNvblBhdGguZm9ybWF0KCdIaSBteSBuYW1lIGlzIHt9LicsIEpzb25QYXRoLnN0cmluZ0F0KCckLk5hbWUnKSksXG4gICAgfSkpLnRvRXF1YWwoe1xuICAgICAgJ0ZpZWxkLiQnOiBcIlN0YXRlcy5Gb3JtYXQoJ0hpIG15IG5hbWUgaXMge30uJywgJC5OYW1lKVwiLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KEZpZWxkVXRpbHMucmVuZGVyT2JqZWN0KHtcbiAgICAgIEZpZWxkOiBKc29uUGF0aC5mb3JtYXQoSnNvblBhdGguc3RyaW5nQXQoJyQuRm9ybWF0JyksIEpzb25QYXRoLnN0cmluZ0F0KCckLk5hbWUnKSksXG4gICAgfSkpLnRvRXF1YWwoe1xuICAgICAgJ0ZpZWxkLiQnOiAnU3RhdGVzLkZvcm1hdCgkLkZvcm1hdCwgJC5OYW1lKScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0cmluZ1RvSnNvbicsICgpID0+IHtcbiAgICBleHBlY3QoRmllbGRVdGlscy5yZW5kZXJPYmplY3Qoe1xuICAgICAgRmllbGQ6IEpzb25QYXRoLnN0cmluZ1RvSnNvbihKc29uUGF0aC5zdHJpbmdBdCgnJC5TdHInKSksXG4gICAgfSkpLnRvRXF1YWwoe1xuICAgICAgJ0ZpZWxkLiQnOiAnU3RhdGVzLlN0cmluZ1RvSnNvbigkLlN0ciknLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdqc29uVG9TdHJpbmcnLCAoKSA9PiB7XG4gICAgZXhwZWN0KEZpZWxkVXRpbHMucmVuZGVyT2JqZWN0KHtcbiAgICAgIEZpZWxkOiBKc29uUGF0aC5qc29uVG9TdHJpbmcoSnNvblBhdGgub2JqZWN0QXQoJyQuT2JqJykpLFxuICAgIH0pKS50b0VxdWFsKHtcbiAgICAgICdGaWVsZC4kJzogJ1N0YXRlcy5Kc29uVG9TdHJpbmcoJC5PYmopJyxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxudGVzdCgnZmluZCB0YXNrIHRva2VuIGV2ZW4gaWYgbmVzdGVkIGluIGludHJpbnNpYyBmdW5jdGlvbnMnLCAoKSA9PiB7XG4gIGV4cGVjdChGaWVsZFV0aWxzLmNvbnRhaW5zVGFza1Rva2VuKHsgeDogSnNvblBhdGguYXJyYXkoSnNvblBhdGgudGFza1Rva2VuKSB9KSkudG9FcXVhbCh0cnVlKTtcblxuICBleHBlY3QoRmllbGRVdGlscy5jb250YWluc1Rhc2tUb2tlbih7IHg6IEpzb25QYXRoLmFycmF5KCdub3BlJykgfSkpLnRvRXF1YWwoZmFsc2UpO1xuXG4gIC8vIEV2ZW4gaWYgaXQncyBhIGhhbmQtd3JpdHRlbiBsaXRlcmFsIGFuZCBkb2Vzbid0IHVzZSBvdXIgY29uc3RydWN0b3JzXG4gIGV4cGVjdChGaWVsZFV0aWxzLmNvbnRhaW5zVGFza1Rva2VuKHsgeDogSnNvblBhdGguc3RyaW5nQXQoJ1N0YXRlcy5BcnJheSgkJC5UYXNrLlRva2VuKScpIH0pKS50b0VxdWFsKHRydWUpO1xufSk7XG4iXX0=