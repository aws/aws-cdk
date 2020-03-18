import '@aws-cdk/assert/jest';
import { BooleanAttribute, DateTimeAttribute, NumberAttribute, StringAttribute } from '../lib';

describe('User Pool Attributes', () => {
  describe('StringAttribute', () => {
    test('default', () => {
      // GIVEN
      const attr = new StringAttribute();

      // WHEN
      const bound = attr.bind();

      // THEN
      expect(bound.dataType).toEqual('String');
      expect(bound.stringConstraints).toBeUndefined();
      expect(bound.numberConstraints).toBeUndefined();
    });

    test('specified constraints are recognized', () => {
      // GIVEN
      const attr = new StringAttribute({ minLen: 10, maxLen: 60 });

      // WHEN
      const bound = attr.bind();

      // THEN
      expect(bound.stringConstraints).toEqual({
        minLen: 10,
        maxLen: 60,
      });
      expect(bound.numberConstraints).toBeUndefined();
    });

    test('throws error when crossing limits', () => {
      expect(() => new StringAttribute({ minLen: -10 }))
        .toThrow(/minLen cannot be less than/);
      expect(() => new StringAttribute({ maxLen: 5000 }))
        .toThrow(/maxLen cannot be greater than/);
    });
  });

  describe('NumberAttribute', () => {
    test('default', () => {
      // GIVEN
      const attr = new NumberAttribute();

      // WHEN
      const bound = attr.bind();

      // THEN
      expect(bound.dataType).toEqual('Number');
      expect(bound.stringConstraints).toBeUndefined();
      expect(bound.numberConstraints).toBeUndefined();
    });

    test('specified constraints are recognized', () => {
      // GIVEN
      const attr = new NumberAttribute({ min: 5, max: 600 });

      // WHEN
      const bound = attr.bind();

      // THEN
      expect(bound.numberConstraints).toEqual({
        min: 5,
        max: 600,
      });
      expect(bound.stringConstraints).toBeUndefined();
    });
  });

  describe('BooleanAttribute', () => {
    test('default', () => {
      // GIVEN
      const attr = new BooleanAttribute();

      // WHEN
      const bound = attr.bind();

      // THEN
      expect(bound.dataType).toEqual('Boolean');
      expect(bound.stringConstraints).toBeUndefined();
      expect(bound.numberConstraints).toBeUndefined();
    });
  });

  describe('DateTimeAttribute', () => {
    test('default', () => {
      // GIVEN
      const attr = new DateTimeAttribute();

      // WHEN
      const bound = attr.bind();

      // THEN
      expect(bound.dataType).toEqual('DateTime');
      expect(bound.stringConstraints).toBeUndefined();
      expect(bound.numberConstraints).toBeUndefined();
    });
  });
});