import { findJsonataExpressions, isValidJsonataExpression } from '../../lib/private/jsonata';

describe('jsonata', () => {
  describe('isValidJsonataExpression', () => {
    test('should return true for valid expressions', () => {
      expect(isValidJsonataExpression('{% $value %}')).toBe(true);
      expect(isValidJsonataExpression('{%$.some.field%}')).toBe(true);
      expect(isValidJsonataExpression(`{%
        $someFunction();
      %}`)).toBe(true);
    });

    test('should return false for invalid expressions', () => {
      expect(isValidJsonataExpression('$value')).toBe(false);
      expect(isValidJsonataExpression('{$value%}')).toBe(false);
      expect(isValidJsonataExpression('{% $value }')).toBe(false);
      expect(isValidJsonataExpression('some random string')).toBe(false);
    });

    describe('findJsonataExpressions', () => {
      test('finds all valid JSONata expressions and ignores invalid/other types', () => {
        const input = [
          '{% $expr1 %}',
          'not an expr',
          null,
          123,
          { a: '{% $expr2 %}', b: ['{% $expr3 %}', { c: '{% $expr4 %}' }] },
          `{%
            $expr5
          %}`,
          { d: '{$invalid%}' },
        ];

        const result = findJsonataExpressions(input);
        expect(Array.from(result)).toEqual([
          '{% $expr1 %}',
          '{% $expr2 %}',
          '{% $expr3 %}',
          '{% $expr4 %}',
          `{%
            $expr5
          %}`,
        ]);
      });
    });
  });
});
