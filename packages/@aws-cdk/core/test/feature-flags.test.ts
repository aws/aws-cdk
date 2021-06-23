import * as cxapi from '@aws-cdk/cx-api';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { FeatureFlags, Stack } from '../lib';

nodeunitShim({
  isEnabled: {
    'returns true when the flag is enabled'(test: Test) {
      const stack = new Stack();
      stack.node.setContext(cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT, true);

      const actual = FeatureFlags.of(stack).isEnabled(cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT);
      test.equals(actual, true);
      test.done();
    },

    'falls back to the default'(test: Test) {
      const stack = new Stack();

      test.equals(FeatureFlags.of(stack).isEnabled(cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT),
        cxapi.futureFlagDefault(cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT));
      test.done();
    },

    'invalid flag'(test: Test) {
      const stack = new Stack();

      test.equals(FeatureFlags.of(stack).isEnabled('non-existent-flag'), undefined);
      test.done();
    },
  },
});
