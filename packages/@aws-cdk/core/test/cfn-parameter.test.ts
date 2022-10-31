import { CfnParameter, Stack } from '../lib';

describe('cfn parameter', () => {
  test('valueAsString supports both string and number types', () => {
    // GIVEN
    const stack = new Stack();
    const numberParam = new CfnParameter(stack, 'numberParam', { type: 'Number', default: 10 });
    const stringParam = new CfnParameter(stack, 'stringParam', { type: 'String', default: 'a-default' });

    // WHEN
    const numVal = numberParam.valueAsString;
    const strVal = stringParam.valueAsString;

    // THEN
    expect(stack.resolve(numVal)).toEqual({ Ref: 'numberParam' });
    expect(stack.resolve(strVal)).toEqual({ Ref: 'stringParam' });
  });

  test('valueAsString fails for unsupported types', () => {
    // GIVEN
    const stack = new Stack();
    const listParam = new CfnParameter(stack, 'listParam', { type: 'List', default: 10 });

    // WHEN - THEN
    expect(() => listParam.valueAsList).toThrow(/Parameter type \(List\)/);
  });
});
