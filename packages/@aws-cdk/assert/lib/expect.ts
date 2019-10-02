import cdk = require('@aws-cdk/core');
import api = require('@aws-cdk/cx-api');
import { StackInspector } from './inspector';
import { SynthUtils } from './synth-utils';

export function expect(stack: api.CloudFormationStackArtifact | cdk.Stack, skipValidation = false): StackInspector {
  if (stack instanceof api.CloudFormationStackArtifact) {
    return new StackInspector(stack);
  }
  return new StackInspector(SynthUtils.synthesize(stack, { skipValidation }), stack);
}
