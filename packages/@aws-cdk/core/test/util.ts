import { ConstructNode, Stack } from '../lib';

export function toCloudFormation(stack: Stack): any {
  return ConstructNode.synth(stack.node, { skipValidation: true }).getStackByName(stack.stackName).template;
}

export function reEnableStackTraceCollection(): any {
  const previousValue = process.env.CDK_DISABLE_STACK_TRACE;
  process.env.CDK_DISABLE_STACK_TRACE = '';
  return previousValue;
}

export function restoreStackTraceColection(previousValue: any): void {
  process.env.CDK_DISABLE_STACK_TRACE = previousValue;
}
