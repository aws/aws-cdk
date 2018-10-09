import { Test } from 'nodeunit';
import { FilterPattern } from '../lib';

export = {
  'text patterns': {
    'simple text pattern'(test: Test) {
      const pattern = FilterPattern.allTerms('foo', 'bar', 'baz');

      test.equal('"foo" "bar" "baz"', pattern.logPatternString);

      test.done();
    },

    'quoted terms'(test: Test) {
      const pattern = FilterPattern.allTerms('"foo" he said');

      test.equal('"\\"foo\\" he said"', pattern.logPatternString);

      test.done();
    },

    'disjunction of conjunctions'(test: Test) {
      const pattern = FilterPattern.anyTermGroup(
        ["foo", "bar"],
        ["baz"]
      );

      test.equal('?"foo" "bar" ?"baz"', pattern.logPatternString);

      test.done();
    },

    'dont prefix with ? if only one disjunction'(test: Test) {
      const pattern = FilterPattern.anyTermGroup(
        ["foo", "bar"]
      );

      test.equal('"foo" "bar"', pattern.logPatternString);

      test.done();
    },

    'empty log pattern is empty string'(test: Test) {
      const pattern = FilterPattern.anyTermGroup();

      test.equal('', pattern.logPatternString);

      test.done();
    }
  },

  'json patterns': {
    'string value'(test: Test) {
      const pattern = FilterPattern.stringValue('$.field', '=', 'value');

      test.equal('{ $.field = "value" }', pattern.logPatternString);

      test.done();
    },

    'also recognize =='(test: Test) {
      const pattern = FilterPattern.stringValue('$.field', '==', 'value');

      test.equal('{ $.field = "value" }', pattern.logPatternString);

      test.done();
    },

    'number patterns'(test: Test) {
      const pattern = FilterPattern.numberValue('$.field', '<=', 300);

      test.equal('{ $.field <= 300 }', pattern.logPatternString);

      test.done();
    },

    'combining with AND or OR'(test: Test) {
      const p1 = FilterPattern.numberValue('$.field', '<=', 300);
      const p2 = FilterPattern.stringValue('$.field', '=', 'value');

      const andPattern = FilterPattern.all(p1, p2);
      test.equal('{ ($.field <= 300) && ($.field = "value") }', andPattern.logPatternString);

      const orPattern = FilterPattern.any(p1, p2);
      test.equal('{ ($.field <= 300) || ($.field = "value") }', orPattern.logPatternString);

      test.done();
    },

    'single AND is not wrapped with parens'(test: Test) {
      const p1 = FilterPattern.stringValue('$.field', '=', 'value');

      const pattern = FilterPattern.all(p1);

      test.equal('{ $.field = "value" }', pattern.logPatternString);

      test.done();
    },

    'empty AND is rejected'(test: Test) {
      test.throws(() => {
        FilterPattern.all();
      });

      test.done();
    },

    'invalid string operators are rejected'(test: Test) {
      test.throws(() => {
        FilterPattern.stringValue('$.field', '<=', 'hello');
      });

      test.done();
    },

    'can test boolean value'(test: Test) {
      const pattern = FilterPattern.booleanValue('$.field', false);

      test.equal('{ $.field IS FALSE }', pattern.logPatternString);

      test.done();
    },
  },

  'table patterns': {
    'simple model'(test: Test) {
      const pattern = FilterPattern.spaceDelimited('...', 'status_code', 'bytes');

      test.equal('[..., status_code, bytes]', pattern.logPatternString);

      test.done();
    },

    'add restrictions'(test: Test) {
      const pattern = FilterPattern.spaceDelimited('...', 'status_code', 'bytes')
        .whereString('status_code', '=', '4*')
        .whereNumber('status_code', '!=', 403);

      test.equal('[..., status_code = "4*" && status_code != 403, bytes]', pattern.logPatternString);

      test.done();
    },

    'cant use more than one ellipsis'(test: Test) {
      test.throws(() => {
        FilterPattern.spaceDelimited('...', 'status_code', '...');
      });

      test.done();
    }
  }
};
