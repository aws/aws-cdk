import { App, Stack, NestedStack, CfnParameter } from '../../lib';
import { CfnUtils } from '../../lib/private/cfn-utils-provider';

describe('CfnUtils', () => {
  describe('stringify with nested stack validation', () => {
    test('returns fallback for invalid nested stack parameter references', () => {
      const app = new App();
      const parentStack = new Stack(app, 'ParentStack');
      const parameter = new CfnParameter(parentStack, 'VpcId', {
        type: 'String',
        default: 'vpc-12345',
      });
      const nestedStack = new NestedStack(parentStack, 'NestedStack');

      // Object with invalid parameter reference (direct parameter name without 'referenceto' prefix)
      const valueWithInvalidRef = {
        Ref: 'VpcId',
      };

      const result = CfnUtils.stringify(nestedStack, 'TestStringify', valueWithInvalidRef);

      expect(result).toBe('[]');
    });

    test('creates custom resource for valid references', () => {
      const app = new App();
      const parentStack = new Stack(app, 'ParentStack');
      const nestedStack = new NestedStack(parentStack, 'NestedStack');

      // Object with valid reference
      const validValue = {
        someProperty: 'someValue',
      };

      const result = CfnUtils.stringify(nestedStack, 'TestStringify', validValue);

      // Should create actual custom resource
      expect(result).not.toBe('[]');
      expect(typeof result).toBe('string');
    });
  });
});
