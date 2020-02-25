import '@aws-cdk/assert/jest';
import { NumberAttr, StringAttr } from '../lib';

describe('User Pool Attributes', () => {
  describe('StringAttr', () => {
    test('default', () => {
      // GIVEN
      const attr = new StringAttr();

      // WHEN
      const bound = attr.bind();

      // THEN
      expect(bound.attrDataType).toEqual('String');
      expect(bound.constraints).toBeUndefined();
    });

    test('specified constraints are recognized', () => {
      // GIVEN
      const attr = new StringAttr({ minLen: 10, maxLen: 60 });

      // WHEN
      const bound = attr.bind();

      // THEN
      expect(bound.constraints).toEqual({
        stringAttributeConstraints: {
          minLength: '10',
          maxLength: '60',
        }
      });
    });

    test('throws error when crossing limits', () => {
      expect(() => new StringAttr({ minLen: -10 }))
        .toThrow(/minLen cannot be less than/);
      expect(() => new StringAttr({ maxLen: 5000 }))
        .toThrow(/maxLen cannot be greater than/);
    });
  });

  describe('NumberAttr', () => {
    test('default', () => {
      // GIVEN
      const attr = new NumberAttr();

      // WHEN
      const bound = attr.bind();

      // THEN
      expect(bound.attrDataType).toEqual('Number');
      expect(bound.constraints).toBeUndefined();
    });

    test('specified constraints are recognized', () => {
      // GIVEN
      const attr = new NumberAttr({ min: 5, max: 600 });

      // WHEN
      const bound = attr.bind();

      // THEN
      expect(bound.constraints).toEqual({
        numberAttributeConstraints: {
          minValue: '5',
          maxValue: '600',
        }
      });
    });
  });
});