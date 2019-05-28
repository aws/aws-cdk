import cdk = require('@aws-cdk/cdk');
import api = require('@aws-cdk/cx-api');
import { StackInspector } from './inspector';
import { SynthUtils } from './synth-utils';

export function expect(stack: api.CloudFormationStackArtifact | cdk.Stack, skipValidation = false): StackInspector {
  if (stack instanceof api.CloudFormationStackArtifact) {
    return new StackInspector(stack);
  } else {
    const synthesizedStack = SynthUtils.synthesize(stack, { skipValidation }).getStack(stack.name);
    return new StackInspector(synthesizedStack);
  }
}
