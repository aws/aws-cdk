import * as cxapi from '@aws-cdk/cx-api';
import { Stack, Construct, StackProps, App } from '../lib';
import { synthesize } from '../lib/private/synthesis';

export class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope ?? new App({
      context: { [cxapi.DISABLE_VERSION_REPORTING]: true },
    }), id, props);
  }
}

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
