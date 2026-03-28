import { Stack, Tokenization } from '../../../core';
import { findJsonataExpressions, isValidJsonataExpression, JsonataToken, validateJsonataExpression } from '../../lib/private/jsonata';

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

  describe('JsonataToken', () => {
    test('resolve wraps expression in {% %} delimiters', () => {
      const token = new JsonataToken('$states.input.count');
      const stack = new Stack();
      const resolved = stack.resolve(token);
      expect(resolved).toBe('{% $states.input.count %}');
    });

    test('toString returns a string token', () => {
      const token = new JsonataToken('$states.input.name');
      const str = token.toString();
      expect(typeof str).toBe('string');
      // The string should be a token that can be resolved
      expect(Tokenization.isResolvable(token)).toBe(true);
    });

    test('toJSON returns a descriptive string', () => {
      const token = new JsonataToken('$states.input.data');
      expect(token.toJSON()).toBe('<jsonata:$states.input.data>');
    });

    test('isJsonataToken returns true for JsonataToken instances', () => {
      const token = new JsonataToken('$states.input.value');
      expect(JsonataToken.isJsonataToken(token)).toBe(true);
    });

    test('isJsonataToken returns false for non-JsonataToken objects', () => {
      const notAToken = { resolve: () => 'test', creationStack: [] };
      expect(JsonataToken.isJsonataToken(notAToken as any)).toBe(false);
    });

    test('displayHint strips leading non-alphabetic characters', () => {
      const token = new JsonataToken('$states.input.value');
      expect(token.displayHint).toBe('states.input.value');
    });

    test('creationStack is captured', () => {
      const token = new JsonataToken('$states.input.value');
      expect(Array.isArray(token.creationStack)).toBe(true);
    });
  });

  describe('validateJsonataExpression', () => {
    test('accepts valid expressions', () => {
      expect(() => validateJsonataExpression('$states.input.count')).not.toThrow();
      expect(() => validateJsonataExpression('$count($states.input.items)')).not.toThrow();
      expect(() => validateJsonataExpression('$states.input.price * $states.input.quantity')).not.toThrow();
    });

    test('throws on empty expression', () => {
      expect(() => validateJsonataExpression('')).toThrow(/cannot be empty/);
    });

    test('throws on whitespace-only expression', () => {
      expect(() => validateJsonataExpression('   ')).toThrow(/cannot be empty/);
    });

    test('throws if expression includes opening delimiter', () => {
      expect(() => validateJsonataExpression('{% $states.input.count')).toThrow(/should not include/);
    });

    test('throws if expression includes closing delimiter', () => {
      expect(() => validateJsonataExpression('$states.input.count %}')).toThrow(/should not include/);
    });

    test('throws if expression includes both delimiters', () => {
      expect(() => validateJsonataExpression('{% $states.input.count %}')).toThrow(/should not include/);
    });
  });
});
