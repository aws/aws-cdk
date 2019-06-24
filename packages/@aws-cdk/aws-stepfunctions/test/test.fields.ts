import { Test } from 'nodeunit';
import { Context, Data, FieldUtils } from "../lib";

export = {
  'deep replace correctly handles fields in arrays'(test: Test) {
    test.deepEqual(FieldUtils.renderObject({
      unknown: undefined,
      bool: true,
      literal: 'literal',
      field: Data.stringAt('$.stringField'),
      listField: Data.listAt('$.listField'),
      deep: [
        'literal',
        {
          deepField: Data.numberAt('$.numField'),
        }
      ]
    }), {
      'bool': true,
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
      str: Context.stringAt('$$.Execution.StartTime'),
      count: Context.numberAt('$$.State.RetryCount'),
      token: Context.taskToken,
      entire: Context.entireContext
    }), {
      'str.$': '$$.Execution.StartTime',
      'count.$': '$$.State.RetryCount',
      'token.$': '$$.Task.Token',
      'entire.$': '$$'
    });

    test.done();
  },

  'find all referenced paths'(test: Test) {
    test.deepEqual(FieldUtils.findReferencedPaths({
      bool: false,
      literal: 'literal',
      field: Data.stringAt('$.stringField'),
      listField: Data.listAt('$.listField'),
      deep: [
        'literal',
        {
          field: Data.stringAt('$.stringField'),
          deepField: Data.numberAt('$.numField'),
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
        deep: [Data.stringAt('$.hello')]
      });
    }, /Cannot use JsonPath fields in an array/);

    test.done();
  },

  'datafield path must be correct'(test: Test) {
    test.throws(() => {
      Data.stringAt('hello');
    }, /must start with '\$.'/);

    test.done();
  },

  'context path must be correct'(test: Test) {
    test.throws(() => {
      Context.stringAt('hello');
    }, /must start with '\$\$.'/);

    test.done();
  },

  'test contains task token'(test: Test) {
    test.equal(true, FieldUtils.containsTaskToken({
      field: Context.taskToken
    }));

    test.equal(true, FieldUtils.containsTaskToken({
      field: Context.stringAt('$$.Task'),
    }));

    test.equal(true, FieldUtils.containsTaskToken({
      field: Context.entireContext
    }));

    test.equal(false, FieldUtils.containsTaskToken({
      oops: 'not here'
    }));

    test.equal(false, FieldUtils.containsTaskToken({
      oops: Context.stringAt('$$.Execution.StartTime')
    }));

    test.done();
  },

  'arbitrary JSONPath fields are not replaced'(test: Test) {
    test.deepEqual(FieldUtils.renderObject({
      field: '$.content',
    }), {
      field: '$.content'
    });

    test.done();
  },

  'fields cannot be used somewhere in a string interpolation'(test: Test) {
    test.throws(() => {
      FieldUtils.renderObject({
        field: `contains ${Data.stringAt('$.hello')}`
      });
    }, /Field references must be the entire string/);

    test.done();
  }
};