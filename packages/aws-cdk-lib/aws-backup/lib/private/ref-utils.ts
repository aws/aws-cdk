import { UnscopedValidationError } from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';
import type { IBackupVaultRef } from '../../../interfaces/generated/aws-backup-interfaces.generated';
import type { IBackupVault } from '../vault';

/**
 * Convert an IBackupVaultRef to IBackupVault, throwing an error if the instance
 * doesn't implement the full IBackupVault interface.
 */
export function toIBackupVault(vault: IBackupVaultRef): IBackupVault {
  if (!('backupVaultName' in vault) || !('backupVaultArn' in vault) || !('grant' in vault)) {
    throw new UnscopedValidationError(lit`VaultInstanceShouldImplement`, `'vault' instance should implement IBackupVault, but doesn't: ${vault.constructor.name}`);
  }
  return vault as IBackupVault;
}
