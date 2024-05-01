import { FilterPattern } from '../lib';

describe('pattern', () => {
  describe('text patterns', () => {
    test('simple text pattern', () => {
      const pattern = FilterPattern.allTerms('foo', 'bar', 'baz');

      expect('"foo" "bar" "baz"').toEqual(pattern.logPatternString);
    });

    test('quoted terms', () => {
      const pattern = FilterPattern.allTerms('"foo" he said');

      expect('"\\"foo\\" he said"').toEqual(pattern.logPatternString);
    });

    test('disjunction of conjunctions', () => {
      const pattern = FilterPattern.anyTermGroup(
        ['foo', 'bar'],
        ['baz'],
      );

      expect('?"foo" "bar" ?"baz"').toEqual(pattern.logPatternString);
    });

    test('dont prefix with ? if only one disjunction', () => {
      const pattern = FilterPattern.anyTermGroup(
        ['foo', 'bar'],
      );

      expect('"foo" "bar"').toEqual(pattern.logPatternString);
    });

    test('empty log pattern is empty string', () => {
      const pattern = FilterPattern.anyTermGroup();

      expect('').toEqual(pattern.logPatternString);
    });
  });

  describe('json patterns', () => {
    test('string value', () => {
      const pattern = FilterPattern.stringValue('$.field', '=', 'value');

      expect('{ $.field = "value" }').toEqual(pattern.logPatternString);
    });

    test('also recognize ==', () => {
      const pattern = FilterPattern.stringValue('$.field', '==', 'value');

      expect('{ $.field = "value" }').toEqual(pattern.logPatternString);
    });

    test('number patterns', () => {
      const pattern = FilterPattern.numberValue('$.field', '<=', 300);

      expect('{ $.field <= 300 }').toEqual(pattern.logPatternString);
    });

    test('combining with AND or OR', () => {
      const p1 = FilterPattern.numberValue('$.field', '<=', 300);
      const p2 = FilterPattern.stringValue('$.field', '=', 'value');

      const andPattern = FilterPattern.all(p1, p2);
      expect('{ ($.field <= 300) && ($.field = "value") }').toEqual(andPattern.logPatternString);

      const orPattern = FilterPattern.any(p1, p2);
      expect('{ ($.field <= 300) || ($.field = "value") }').toEqual(orPattern.logPatternString);
    });

    test('single AND is not wrapped with parens', () => {
      const p1 = FilterPattern.stringValue('$.field', '=', 'value');

      const pattern = FilterPattern.all(p1);

      expect('{ $.field = "value" }').toEqual(pattern.logPatternString);
    });

    test('empty AND is rejected', () => {
      expect(() => {
        FilterPattern.all();
      }).toThrow();
    });

    test('invalid string operators are rejected', () => {
      expect(() => {
        FilterPattern.stringValue('$.field', '<=', 'hello');
      }).toThrow();
    });

    test('can test boolean value', () => {
      const pattern = FilterPattern.booleanValue('$.field', false);

      expect('{ $.field IS FALSE }').toEqual(pattern.logPatternString);
    });
  });

  describe('table patterns', () => {
    test('simple model', () => {
      const pattern = FilterPattern.spaceDelimited('...', 'status_code', 'bytes');

      expect(pattern.logPatternString).toEqual('[..., status_code, bytes]');
    });

    test('add restrictions', () => {
      const pattern = FilterPattern.spaceDelimited('...', 'status_code', 'bytes')
        .whereString('status_code', '=', '4*')
        .whereNumber('status_code', '!=', 403);

      expect(pattern.logPatternString).toEqual('[..., status_code = "4*" && status_code != 403, bytes]');
    });

    test('cant use more than one ellipsis', () => {
      expect(() => {
        FilterPattern.spaceDelimited('...', 'status_code', '...');
      }).toThrow();
    });
  });
});
