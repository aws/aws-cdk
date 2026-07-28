/**
 * Options for configuring permissions in the `<Resource>.actions()` method.
 */
export interface PermissionsOptions {
  /**
   * The ARNs of the resources to grant permissions on.
   *
   * @default - The ARN of the resource associated with the grant is used.
   */
  readonly resourceArns?: Array<string>;
}

/**
 * Options for configuring permissions on encrypted resources.
 */
export interface EncryptedPermissionsOptions extends PermissionsOptions {
  /**
   * The KMS key actions to grant permissions for.
   *
   * @default - No permission is added to the KMS key, even if it exists
   */
  readonly keyActions?: Array<string>;
}
