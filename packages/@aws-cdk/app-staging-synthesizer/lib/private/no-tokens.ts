import { StringSpecializer } from 'aws-cdk-lib/core/lib/helpers-internal';

export function validateNoTokens<A extends object>(props: A, context: string) {
  for (const [key, value] of Object.entries(props)) {
    if (typeof value === 'string') {
      StringSpecializer.validateNoTokens(value, `${context} property '${key}'`);
    }
  }
}
