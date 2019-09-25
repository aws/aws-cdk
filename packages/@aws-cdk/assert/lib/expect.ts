import cdk = require('@aws-cdk/core');
import api = require('@aws-cdk/cx-api');
import { StackInspector } from './inspector';
import { SynthUtils } from './synth-utils';

export function expect(stack: api.CloudFormationStackArtifact | cdk.Stack, skipValidation = false): StackInspector {
  // if this is already a synthesized stack, then just inspect it.
  const artifact = stack instanceof api.CloudFormationStackArtifact ? stack : SynthUtils._synthesizeWithNested(stack, { skipValidation });
  return new StackInspector(artifact);
}
