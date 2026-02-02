import { UnscopedValidationError } from '../../../core';
import type { ILogGroupRef } from '../../../interfaces/generated/aws-logs-interfaces.generated';
import type { ILogGroup } from '../log-group';

/**
 * Convert an ILogGroupRef to ILogGroup, validating that it implements the full interface
 * @internal
 */
export function toILogGroup(logGroup: ILogGroupRef): ILogGroup {
  // Check for key methods that distinguish ILogGroup from ILogGroupRef
  if (
    typeof (logGroup as any).addStream !== 'function' ||
    typeof (logGroup as any).grant !== 'function'
  ) {
    throw new UnscopedValidationError(`'logGroup' instance should implement ILogGroup, but doesn't: ${logGroup.constructor.name}`);
  }
  return logGroup as ILogGroup;
}
