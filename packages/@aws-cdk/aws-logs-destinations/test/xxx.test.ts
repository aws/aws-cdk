import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/cdk';
import xxx = require('../lib');

test('xxx can be used', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  // ...


  // THEN
  expect(stack).toHaveResource('AWS::XXX::YYY:', {
    Some: 'Property'
  });
});
