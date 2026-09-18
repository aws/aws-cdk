import type { App, StackProps } from 'aws-cdk-lib';
import { Stack, Validations } from 'aws-cdk-lib';

/**
 * Creates a Stack for unit tests that acknowledges the W3010 CloudFormation
 * validation warning, which is emitted whenever a test hardcodes an
 * availability zone (as most of the aws-ec2-alpha tests do).
 *
 * @param scope optional parent App. Omit to get a standalone stack (the common case).
 * @param id optional stack id.
 * @param props optional stack props (e.g. `env`) for tests that need a specific environment.
 */
export function testStack(scope?: App, id?: string, props?: StackProps) {
  const stack = new Stack(scope, id, props);
  Validations.of(stack).acknowledge({
    id: 'CloudFormation-Validate::W3010',
    reason: 'Testing',
  });
  return stack;
}
