import { UnscopedValidationError } from '../../../core';
import type { IConnection } from '../connection';
import type { IConnectionRef } from '../events.generated';

/**
 * Convert an IConnectionRef to IConnection, validating that it implements the full interface
 * @internal
 */
export function toIConnection(connection: IConnectionRef): IConnection {
  if (!('connectionArn' in connection) || !('connectionName' in connection)) {
    throw new UnscopedValidationError(`'connection' instance should implement IConnection, but doesn't: ${connection.constructor.name}`);
  }
  return connection as IConnection;
}
