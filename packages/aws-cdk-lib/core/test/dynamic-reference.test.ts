import { CfnDynamicReference, CfnDynamicReferenceService, Stack } from '../lib';

describe('dynamic reference', () => {
  test('can create dynamic references with service and key with colons', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const ref = new CfnDynamicReference(CfnDynamicReferenceService.SSM, 'a:b:c');

    // THEN
    expect(stack.resolve(ref)).toEqual('{{resolve:ssm:a:b:c}}');
  });
});
