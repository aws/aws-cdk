import { Arn, ArnFormat, Stack, Token } from '../../../core';
import type { ILogGroupRef } from '../logs.generated';

/**
 * The ARN of a log group without the ':*' log stream suffix.
 *
 * Works for any `ILogGroupRef`, including L1 constructs and imported log groups.
 *
 * @internal
 */
export function logGroupArnWithoutStreamSuffix(logGroup: ILogGroupRef): string {
  const logGroupArn = logGroup.logGroupRef.logGroupArn;
  if (!Token.isUnresolved(logGroupArn)) {
    return logGroupArn.replace(/:\*$/, '');
  }

  // An unresolved token may or may not carry ':*', so rebuild the ARN from the name instead.
  return Arn.format({
    service: 'logs',
    resource: 'log-group',
    resourceName: logGroup.logGroupRef.logGroupName,
    arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    account: logGroup.env.account,
    region: logGroup.env.region,
  }, Stack.of(logGroup));
}
