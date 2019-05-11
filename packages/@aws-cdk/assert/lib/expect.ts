import cdk = require('@aws-cdk/cdk');
import { ConstructNode, ConstructOrder } from '@aws-cdk/cdk';
import api = require('@aws-cdk/cx-api');
import { StackInspector } from './inspector';
import { SynthUtils } from './synth-utils';

export function expect(stack: api.SynthesizedStack | cdk.Stack, skipValidation = false): StackInspector {
  // Can't use 'instanceof' here, that breaks if we have multiple copies
  // of this library.
  let sstack: api.SynthesizedStack;

  if (cdk.Stack.isStack(stack)) {
    const session = SynthUtils.synthesize(stack, {
      skipValidation
    });

    sstack = {
      name: stack.name,
      template: SynthUtils.templateForStackName(session, stack.name),
      metadata: collectStackMetadata(stack.node),
      environment: {
        name: 'test',
        account: 'test',
        region: 'test'
      }
    };
  } else {
    sstack = stack;
  }

  return new StackInspector(sstack);
}

function collectStackMetadata(root: ConstructNode): api.StackMetadata {
  const result: api.StackMetadata = {};
  for (const construct of root.findAll(ConstructOrder.PreOrder)) {
    const path = `/${root.id}/${construct.node.path}`;
    for (const entry of construct.node.metadata) {
      result[path] = result[path] || [];
      result[path].push(root.resolve(entry));
    }
  }
  return result;
}
