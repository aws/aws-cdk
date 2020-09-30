import { Stack } from '../lib';
import { synthesize } from '../lib/private/synthesis';

export function toCloudFormation(stack: Stack): any {
  return synthesize(stack, { skipValidation: true }).getStackByName(stack.stackName).template;
}

export function reEnableStackTraceCollection(): any {
  const previousValue = process.env.CDK_DISABLE_STACK_TRACE;
  process.env.CDK_DISABLE_STACK_TRACE = '';
  return previousValue;
}

export function restoreStackTraceColection(previousValue: any): void {
  process.env.CDK_DISABLE_STACK_TRACE = previousValue;
}
