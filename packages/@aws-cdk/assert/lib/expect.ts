import cdk = require('@aws-cdk/cdk');
import api = require('@aws-cdk/cx-api');
import { StackInspector } from './inspector';

export function expect(stack: api.SynthesizedStack | cdk.Stack, skipValidation = false): StackInspector {
  // Can't use 'instanceof' here, that breaks if we have multiple copies
  // of this library.
  let sstack: api.SynthesizedStack;

  if (isStackClassInstance(stack)) {
    if (!skipValidation) {
      // Do a prepare-and-validate run over the given stack
      stack.node.prepareTree();

      const errors = stack.node.validateTree();
      if (errors.length > 0) {
        throw new Error(`Stack validation failed:\n${errors.map(e => `${e.message} at: ${e.source.node.scope}`).join('\n')}`);
      }
    }

    sstack = {
      name: stack.name,
      template: stack._toCloudFormation(),
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

function isStackClassInstance(x: api.SynthesizedStack | cdk.Stack): x is cdk.Stack {
  return '_toCloudFormation' in x;
}

function collectStackMetadata(root: cdk.ConstructNode): api.StackMetadata {
  const result: api.StackMetadata = {};
  for (const construct of root.findAll(cdk.ConstructOrder.PreOrder)) {
    const path = `/${root.id}/${construct.node.path}`;
    for (const entry of construct.node.metadata) {
      result[path] = result[path] || [];
      result[path].push(root.resolve(entry));
    }
  }
  return result;
}
