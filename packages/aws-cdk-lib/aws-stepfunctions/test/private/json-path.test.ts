import { Token, Tokenization, UnscopedValidationError } from '../../../core';
import { JsonPath } from '../../lib';
import { jsonPathFromAny, jsonPathString, JsonPathToken, renderInExpression } from '../../lib/private/json-path';

describe('JsonPathToken', () => {
  describe('constructor', () => {
    test('should create instance with path', () => {
      const token = new JsonPathToken('$.foo.bar');
      expect(token.path).toBe('$.foo.bar');
    });
    test('should set displayHint correctly', () => {
      const token = new JsonPathToken('$.foo.bar');
      expect(token.displayHint).toBe('foo.bar');
    });
    test('should remove leading non-alphabetic characters', () => {
      const token = new JsonPathToken('$.123foo.bar');
      expect(token.displayHint).toBe('foo.bar');
    });
    test('should handle path with only special characters', () => {
      const token = new JsonPathToken('$.');
      expect(token.displayHint).toBe('');
    });
  });

  describe('isJsonPathToken', () => {
    test('should return true for JsonPathToken instances', () => {
      const token = new JsonPathToken('$.foo.bar');
      expect(JsonPathToken.isJsonPathToken(token)).toBe(true);
    });

    test('should return false for non-JsonPathToken objects', () => {
      const notToken = {} as IResolvable;
      expect(JsonPathToken.isJsonPathToken(notToken)).toBe(false);
    });
  });

  describe('resolve', () => {
    test('should return the path', () => {
      const token = new JsonPathToken('$.foo.bar');
      const mockContext = {} as IResolveContext;
      expect(token.resolve(mockContext)).toBe('$.foo.bar');
    });
  });

  describe('toString', () => {
    test('should return the path', () => {
      const token = new JsonPathToken('$.foo.bar');
      expect(token.toString()).toMatch(/^\${Token\[foo\.bar\.\d+\]}$/);
    });
  });

  describe('toJSON', () => {
    test('should return formatted string', () => {
      const token = new JsonPathToken('$.foo.bar');
      expect(token.toJSON()).toBe('<path:$.foo.bar>');
    });
  });
});

describe('jsonPathString', () => {
  test('should return path for jsonPathToken instances', () => {
    const token = new JsonPathToken('$.foo.bar');
    expect(jsonPathString(token.toString())).toBe('$.foo.bar');
  });
  test('sholud return undefined for non-jsonPathToken objects', () => {
    const notToken = '$.foo.bar';
    expect(jsonPathString(notToken)).toBeUndefined();
  });
  test('should return path for for concatenated jsonPathToken tokens', () => {
    const token = `${Token.asString(new JsonPathToken('$.foo'))}-${new JsonPathToken('$.bar')}`;
    expect(() => jsonPathString(token)).toThrow(UnscopedValidationError);
  });
});

describe('jsonPathFromAny', () => {
  test('should return path for jsonPathToken', () => {
    const token = new JsonPathToken('$.foo.bar');
    expect(jsonPathFromAny(token)).toBe('$.foo.bar');
  });
  test('should return undefined for non-jsonPathToken objects', () => {
    const notToken = {};
    expect(jsonPathFromAny(notToken)).toBeUndefined();
  });
  test('should return path for falsy objects', () => {
    expect(jsonPathFromAny('')).toBeUndefined();
  });
  test('should return path for jsonPathToken instances', () => {
    const token = new JsonPathToken('$.foo.bar');
    expect(jsonPathFromAny(token.toString())).toBe('$.foo.bar');
  });
});

describe('RenderInExpression', () => {
  test('simple number', () => {
    expect(renderInExpression(1)).toBe('1');
  });
  test('simple string', () => {
    expect(renderInExpression('a')).toBe("'a'");
  });
  test('string with backslash', () => {
    expect(renderInExpression('a\\b')).toBe("'a\\\\b'");
  });
  test('string with single quote', () => {
    expect(renderInExpression("a'b")).toBe("'a\\'b'");
  });
  test('string with curly braces', () => {
    expect(renderInExpression('\\{a\\}\\')).toBe("'\\{a\\}\\\\'");
  });
  test('jsonpath stringAt', () => {
    expect(renderInExpression(JsonPath.stringAt('$.Field'))).toBe('$.Field');
  });
  test('jsonpath numberAt', () => {
    expect(renderInExpression(JsonPath.numberAt('$.Field'))).toBe('$.Field');
  });
  test('jsonpath listAt', () => {
    expect(renderInExpression(JsonPath.listAt('$.Field'))).toBe('$.Field');
  });
  test('jsonpath objectAt', () => {
    expect(renderInExpression(JsonPath.objectAt('$.Field'))).toBe('$.Field');
  });
  test('raw array', () => {
    expect(() => renderInExpression([1, 2])).toThrow();
  });
});
