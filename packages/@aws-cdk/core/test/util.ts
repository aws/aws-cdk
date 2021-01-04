import { Stack } from '../lib';
import { CDK_DEBUG } from '../lib/debug';
import { synthesize } from '../lib/private/synthesis';

export function toCloudFormation(stack: Stack): any {
  return synthesize(stack, { skipValidation: true }).getStackByName(stack.stackName).template;
}

export function reEnableStackTraceCollection(): string | undefined {
  const previousValue = process.env.CDK_DISABLE_STACK_TRACE;
  process.env.CDK_DISABLE_STACK_TRACE = '';
  process.env[CDK_DEBUG] = 'true';
  return previousValue;
}

export function restoreStackTraceColection(previousValue: string | undefined): void {
  process.env.CDK_DISABLE_STACK_TRACE = previousValue;
  delete process.env[CDK_DEBUG];
}
