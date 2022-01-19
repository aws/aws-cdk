import * as fs from 'fs';
import * as path from 'path';
import { Stack, Stage } from '@aws-cdk/core';

export function toStackArtifact(stack: Stack): any {
  const root = stack.node.root;
  if (!Stage.isStage(root)) {
    throw new Error('unexpected: all stacks must be part of a Stage or an App');
  }
  const assembly = root.synth();
  if (stack.nestedStackParent) {
    // if this is a nested stack (it has a parent), then just read the template as a string
    return JSON.parse(fs.readFileSync(path.join(assembly.directory, stack.templateFile)).toString('utf-8'));
  }
  return assembly.getStackArtifact(stack.artifactId);
}