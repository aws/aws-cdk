import type { PolicyStatement } from './policy-statement';

/**
 * Validation mode for Cedar policy definitions.
 *
 */
export class PolicyValidationMode {
  /**
   * Fail policy creation if any validation findings are detected.
   * This is the safer default - catches policy errors early.
   */
  public static readonly FAIL_ON_ANY_FINDINGS = new PolicyValidationMode('FAIL_ON_ANY_FINDINGS');

  /**
   * Ignore all validation findings and create the policy anyway.
   * Use with caution - may result in runtime authorization errors.
   */
  public static readonly IGNORE_ALL_FINDINGS = new PolicyValidationMode('IGNORE_ALL_FINDINGS');

  public constructor(public readonly value: string) {}
}

/**
 * Options for adding a policy via PolicyEngine.addPolicy()
 */
export interface AddPolicyOptions {
  /**
   * Cedar policy statement (35-153,600 characters).
   *
   * You must specify either `definition` or `statement`, but not both.
   *
   * @default - Must provide either definition or statement
   */
  readonly definition?: string;

  /**
   * Type-safe Cedar policy statement built using PolicyStatement builder.
   *
   * Use this for a type-safe, form-like API to build Cedar policies without
   * writing raw Cedar syntax. The builder validates at synthesis time.
   *
   * You must specify either `definition` or `statement`, but not both.
   *
   * @default - Must provide either definition or statement
   */
  readonly statement?: PolicyStatement;

  /**
   * The name of the policy.
   * Valid characters: a-z, A-Z, 0-9, _ (underscore)
   * Must start with a letter, 1-48 characters
   *
   * @default - Auto-generated unique name
   */
  readonly policyName?: string;

  /**
   * Optional description for the policy (max 4,096 characters).
   *
   * @default - No description
   */
  readonly description?: string;

  /**
   * Validation mode for the policy.
   *
   * @default PolicyValidationMode.FAIL_ON_ANY_FINDINGS
   */
  readonly validationMode?: PolicyValidationMode;
}
