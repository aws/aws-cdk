import { CloudAssembly } from '@aws-cdk/cx-api';
import { Stack } from '../lib';
import { CDK_DEBUG } from '../lib/debug';
import { synthesize } from '../lib/private/synthesis';

export function toCloudFormation(stack: Stack): any {
  const synthesizedTemplate = synthesize(stack, { skipValidation: true }).getStackByName(stack.stackName).template;

  // if new-style synthesis is not explicitly set, remove the extra generated Rule and Parameter from the synthesized template,
  // to avoid changing many tests that rely on the template being exactly what it is
  delete synthesizedTemplate?.Rules?.CheckBootstrapVersion;
  if (Object.keys(synthesizedTemplate?.Rules ?? {}).length === 0) {
    delete synthesizedTemplate?.Rules;
  }
  delete synthesizedTemplate?.Parameters?.BootstrapVersion;
  if (Object.keys(synthesizedTemplate?.Parameters ?? {}).length === 0) {
    delete synthesizedTemplate?.Parameters;
  }

  return synthesizedTemplate;
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

export function getWarnings(casm: CloudAssembly) {
  const result = new Array<{ path: string, message: string }>();
  for (const stack of Object.values(casm.manifest.artifacts ?? {})) {
    for (const [path, md] of Object.entries(stack.metadata ?? {})) {
      for (const x of md) {
        if (x.type === 'aws:cdk:warning') {
          result.push({ path, message: x.data as string });
        }
      }
    }
  }
  return result;
}
