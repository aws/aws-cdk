import '@aws-cdk/assert/jest';
import { CfnParameter, Stack } from '@aws-cdk/core';
import { BooleanAttribute, CustomAttributeConfig, DateTimeAttribute, ICustomAttribute, NumberAttribute, StringAttribute } from '../lib';

describe('User Pool Attributes', () => {

  describe('mutable', () => {
    test('default', () => {
      // GIVEN
      const allAttributes: ICustomAttribute[] = [
        new StringAttribute(),
        new NumberAttribute(),
        new BooleanAttribute(),
        new DateTimeAttribute(),
      ];

      // WHEN
      const bounds: CustomAttributeConfig[] = allAttributes.map((attr) => attr.bind() );

      // THEN
      bounds.forEach((bound) => {
        expect(bound.mutable).toBeUndefined();
      });
    });

    describe('mutable is set to true when specified', () => {
      // GIVEN
      const allTrueProps = {
        mutable: true,
      };
      const allAttributeTypes: ICustomAttribute[] = [
        new StringAttribute(allTrueProps),
        new NumberAttribute(allTrueProps),
        new BooleanAttribute(allTrueProps),
        new DateTimeAttribute(allTrueProps),
      ];

      // WHEN
      const bounds: CustomAttributeConfig[] = allAttributeTypes.map((attr) => attr.bind() );

      // THEN
      bounds.forEach((bound) => {
        test(`in attribute of type ${bound.dataType}:`, () => {
          expect(bound.mutable).toEqual(true);
        });
      });
    });

    describe('mutable is set to false', () => {
      // GIVEN
      const allFalseProps = {
        mutable: false,
      };
      const allAttributeTypes: ICustomAttribute[] = [
        new StringAttribute(allFalseProps),
        new NumberAttribute(allFalseProps),
        new BooleanAttribute(allFalseProps),
        new DateTimeAttribute(allFalseProps),
      ];

      // WHEN
      const bounds: CustomAttributeConfig[] = allAttributeTypes.map((attr) => attr.bind() );

      // THEN
      bounds.forEach((bound) => {
        test(`in attribute of type ${bound.dataType}`, () => {
          expect(bound.mutable).toEqual(false);
        });
      });
    });
  });

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

    test('validation is skipped when minLen or maxLen are tokens', () => {
      const stack = new Stack();
      const parameter = new CfnParameter(stack, 'Parameter', {
        type: 'Number',
      });

      expect(() => new StringAttribute({ minLen: parameter.valueAsNumber }))
        .not.toThrow();
      expect(() => new StringAttribute({ maxLen: parameter.valueAsNumber }))
        .not.toThrow();
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
