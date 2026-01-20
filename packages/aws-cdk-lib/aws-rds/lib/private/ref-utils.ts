import { UnscopedValidationError } from '../../../core';
import { IDBSubnetGroupRef } from '../rds.generated';
import { ISubnetGroup } from '../subnet-group';

/**
 * Convert an IBackupVaultRef to IBackupVault, throwing an error if the instance
 * doesn't implement the full IBackupVault interface.
 */
export function toISubnetGroup(group: IDBSubnetGroupRef): ISubnetGroup {
  if (!('subnetGroupName' in group)) {
    throw new UnscopedValidationError(`'group' instance should implement ISubnetGroup, but doesn't: ${group.constructor.name}`);
  }
  return group as ISubnetGroup;
}
