import { Test } from 'nodeunit';
import { ContextField, DataField, FieldUtils } from "../lib";

export = {
  'deep replace correctly handles fields in arrays'(test: Test) {
    test.deepEqual(FieldUtils.renderObject({
      literal: 'literal',
      field: DataField.fromStringAt('$.stringField'),
      listField: DataField.fromListAt('$.listField'),
      deep: [
        'literal',
        {
          deepField: DataField.fromNumberAt('$.numField'),
        }
      ]
    }), {
      'literal': 'literal',
      'field.$': '$.stringField',
      'listField.$': '$.listField',
      'deep': [
        'literal',
        {
          'deepField.$': '$.numField'
        }
      ],
    });

    test.done();
  },

  'exercise contextpaths'(test: Test) {
    test.deepEqual(FieldUtils.renderObject({
      str: ContextField.fromStringAt('$$.Execution.StartTime'),
      count: ContextField.fromNumberAt('$$.State.RetryCount'),
      token: ContextField.taskToken,
    }), {
      'str.$': '$$.Execution.StartTime',
      'count.$': '$$.State.RetryCount',
      'token.$': '$$.Task.Token'
    });

    test.done();
  },

  'find all referenced paths'(test: Test) {
    test.deepEqual(FieldUtils.findReferencedPaths({
      literal: 'literal',
      field: DataField.fromStringAt('$.stringField'),
      listField: DataField.fromListAt('$.listField'),
      deep: [
        'literal',
        {
          field: DataField.fromStringAt('$.stringField'),
          deepField: DataField.fromNumberAt('$.numField'),
        }
      ]
    }), [
      '$.listField',
      '$.numField',
      '$.stringField',
    ]);

    test.done();
  },

  'cannot have JsonPath fields in arrays'(test: Test) {
    test.throws(() => {
      FieldUtils.renderObject({
        deep: [DataField.fromStringAt('$.hello')]
      });
    }, /Cannot use JsonPath fields in an array/);

    test.done();
  },

  'datafield path must be correct'(test: Test) {
    test.throws(() => {
      DataField.fromStringAt('hello');
    }, /must start with '\$.'/);

    test.done();
  },

  'context path must be correct'(test: Test) {
    test.throws(() => {
      ContextField.fromStringAt('hello');
    }, /must start with '\$\$.'/);

    test.done();
  },

  'test contains task token'(test: Test) {
    test.equal(true, FieldUtils.containsTaskToken({
      field: ContextField.taskToken
    }));

    test.equal(true, FieldUtils.containsTaskToken({
      field: ContextField.fromStringAt('$$.Task'),
    }));

    test.equal(true, FieldUtils.containsTaskToken({
      field: ContextField.entireContext
    }));

    test.equal(false, FieldUtils.containsTaskToken({
      oops: 'not here'
    }));

    test.equal(false, FieldUtils.containsTaskToken({
      oops: ContextField.fromStringAt('$$.Execution.StartTime')
    }));

    test.done();
  },
};