import { env } from 'process';

export const CDK_DEBUG = 'CDK_DEBUG';

export function debugModeEnabled(): boolean {
  return isTruthy(env[CDK_DEBUG]);
}

const TRUTHY_VALUES = new Set(['1', 'on', 'true']);

function isTruthy(value: string | undefined): boolean {
  if (!value) {
    return false;
  }
  return TRUTHY_VALUES.has(value.toLowerCase());
}
