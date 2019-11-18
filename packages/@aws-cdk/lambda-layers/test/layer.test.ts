import '@aws-cdk/assert/jest';
import cdk = require('@aws-cdk/core');
import layers = require('../lib');

test('AWS SDK JS layer', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  layers.Layer.AWS_SDK_JS.getLayerVersion(stack);

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::LayerVersion', {
    CompatibleRuntimes: ['nodejs10.x'],
    Description: 'AWS SDK JS',
  });
});
