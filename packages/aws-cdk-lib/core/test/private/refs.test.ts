import { App, Stack, NestedStack, CfnParameter, CfnResource } from '../../lib';
import { CfnReference } from '../../lib/private/cfn-reference';
import { isInvalidNestedStackReference } from '../../lib/private/refs';

describe('refs', () => {
  describe('isInvalidNestedStackReference', () => {
    test('returns true for invalid nested stack parameter references', () => {
      const app = new App();
      const parentStack = new Stack(app, 'ParentStack');
      const parameter = new CfnParameter(parentStack, 'VpcId', {
        type: 'String',
        default: 'vpc-12345',
      });
      const nestedStack = new NestedStack(parentStack, 'NestedStack');
      const resource = new CfnResource(nestedStack, 'TestResource', {
        type: 'AWS::Test::Resource',
      });

      const reference = new CfnReference(parameter.ref, 'Ref', parameter);
      jest.spyOn(reference, 'toString').mockReturnValue(
        `{"Ref":"${parameter.logicalId}"}`,
      );

      const result = isInvalidNestedStackReference(resource, reference);

      expect(result).toBe(true);
    });

    test('returns false for valid nested stack parameter references', () => {
      const app = new App();
      const parentStack = new Stack(app, 'ParentStack');
      const parameter = new CfnParameter(parentStack, 'VpcId', {
        type: 'String',
        default: 'vpc-12345',
      });
      const nestedStack = new NestedStack(parentStack, 'NestedStack');
      const resource = new CfnResource(nestedStack, 'TestResource', {
        type: 'AWS::Test::Resource',
      });

      const reference = new CfnReference(parameter.ref, 'Ref', parameter);
      jest.spyOn(reference, 'toString').mockReturnValue(
        '{"Ref":"referencetoParentStackVpcIdABC123Ref"}',
      );

      const result = isInvalidNestedStackReference(resource, reference);

      expect(result).toBe(false);
    });
  });
});
