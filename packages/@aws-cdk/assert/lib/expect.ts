import cdk = require('@aws-cdk/cdk');
import api = require('@aws-cdk/cx-api');
import { StackInspector } from './inspector';

export function expect(stack: api.SynthesizedStack | cdk.Stack, skipValidation = false): StackInspector {
  // Can't use 'instanceof' here, that breaks if we have multiple copies
  // of this library.
  let sstack: api.SynthesizedStack;

  if (isStackClassInstance(stack)) {
    if (!skipValidation) {
      const errors = stack.validateTree();
      if (errors.length > 0) {
        throw new Error(`Stack validation failed:\n${errors.map(e => `${e.message} at: ${e.source.parent}`).join('\n')}`);
      }
    }

    sstack = {
      name: 'test',
      template: stack.toCloudFormation(),
      metadata: {}
    };
  } else {
    sstack = stack;
  }

  return new StackInspector(sstack);
}

function isStackClassInstance(x: api.SynthesizedStack | cdk.Stack): x is cdk.Stack {
  return 'toCloudFormation' in x;
}
