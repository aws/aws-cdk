import { App, Stack } from '@aws-cdk/core';
import { SynthUtils } from '../lib';

test('SynthUtils.synthesize() is always executed against the root of the tree', () => {
  // GIVEN
  const root = new App();
  const stack1 = new Stack(root, 'stack1');
  const stack2 = new Stack(root, 'stack2');
  stack2.addDependency(stack1);

  // THEN
  // this would have failed if we didn't synthesize at the root because 'stack1' would not be emitted
  expect(() => SynthUtils.synthesize(stack2)).not.toThrowError();
});
