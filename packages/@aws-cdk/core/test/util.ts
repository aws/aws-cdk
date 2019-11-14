import { ConstructNode, Stack } from '../lib';

export function toCloudFormation(stack: Stack): any {
  return ConstructNode.synth(stack.node, { skipValidation: true }).getStackByName(stack.stackName).template;
}
