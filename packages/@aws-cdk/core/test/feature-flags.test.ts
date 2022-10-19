import * as cxapi from '@aws-cdk/cx-api';
import { FeatureFlags, Stack } from '../lib';

describe('feature flags', () => {
  describe('isEnabled', () => {
    test('returns true when the flag is enabled', () => {
      const stack = new Stack();
      stack.node.setContext(cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT, true);

      const actual = FeatureFlags.of(stack).isEnabled(cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT);
      expect(actual).toEqual(true);
    });

    test('falls back to the default', () => {
      const stack = new Stack();

      expect(FeatureFlags.of(stack).isEnabled(cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT)).toEqual(
        cxapi.futureFlagDefault(cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT));
    });

    test('invalid flag', () => {
      const stack = new Stack();

      expect(FeatureFlags.of(stack).isEnabled('non-existent-flag')).toEqual(false);
    });

    test('strings are evaluated as boolean', () => {
      const stack = new Stack();
      stack.node.setContext(cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT, 'true');

      const actual = FeatureFlags.of(stack).isEnabled(cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT);
      expect(actual).toEqual(true);
    });
  });
});
