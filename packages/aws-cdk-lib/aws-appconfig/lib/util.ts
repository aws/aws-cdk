/**
 * The deletion protection check options.
 */
export enum DeletionProtectionCheck {
  /**
   * The default setting,
   * which uses account-level deletion protection. To configure account-level deletion protection, use the UpdateAccountSettings API.
   */
  ACCOUNT_DEFAULT = 'ACCOUNT_DEFAULT',

  /**
   * Instructs the deletion protection check to run,
   * even if deletion protection is disabled at the account level.
   *
   * APPLY also forces the deletion protection check to run against resources created in the past hour,
   * which are normally excluded from deletion protection checks.
   */
  APPLY = 'APPLY',

  /**
   * Instructs AWS AppConfig to bypass the deletion protection check and delete an environment or a configuration profile
   * even if deletion protection would have otherwise prevented it.
   */
  BYPASS = 'BYPASS',
}
