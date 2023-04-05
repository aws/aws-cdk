import { JsonPath } from '../../lib';
import { renderInExpression } from '../../lib/private/json-path';

describe('RenderInExpression', () => {
  test('simple number', () => {
    expect(renderInExpression(1)).toBe('1');
  });
  test('simple string', () => {
    expect(renderInExpression('a')).toBe("'a'");
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
