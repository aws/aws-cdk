import * as cdk from '@aws-cdk/core';
import * as api from '@aws-cdk/cx-api';
import { StackInspector } from './inspector';
import { SynthUtils } from './synth-utils';

export function expect(stack: api.CloudFormationStackArtifact | cdk.Stack | Record<string, any>, skipValidation = false): StackInspector {
  // if this is already a synthesized stack, then just inspect it.
  const artifact = stack instanceof api.CloudFormationStackArtifact ? stack
    : cdk.Stack.isStack(stack) ? SynthUtils._synthesizeWithNested(stack, { skipValidation })
      : stack; // This is a template already
  return new StackInspector(artifact);
}
