import { Runtime, RuntimeFamily } from '@aws-cdk/aws-lambda';
import { Token } from '@aws-cdk/core';
import { RegionInfo } from '@aws-cdk/region-info';

export function lambdaLatestRuntime(region?: string): Runtime {
  const defaultRuntime = Runtime.NODEJS_18_X;
  if (!region || Token.isUnresolved(region)) {
    return defaultRuntime;
  }
  const runtime = RegionInfo.get(region).lambdaLatestRuntime(RuntimeFamily[RuntimeFamily.NODEJS]);
  if (!runtime) {
    return defaultRuntime;
  }
  return new Runtime(runtime, RuntimeFamily.NODEJS, { supportsInlineCode: true });
}