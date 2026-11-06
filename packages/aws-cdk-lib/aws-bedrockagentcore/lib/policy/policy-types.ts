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

  /**
   * A validation mode that this version of the CDK does not model.
   *
   * Prefer the static members above. Use this when the service has added a mode
   * that the CDK has no member for yet: the CloudFormation registry schemas that
   * validate the synthesized template ship with `aws-cdk-lib` and refresh on
   * release, while the members above are added by hand, so a released CDK can
   * accept a mode before it models one.
   *
   * @param value the raw validation mode value to pass to CloudFormation
   */
  public static of(value: string): PolicyValidationMode {
    return new PolicyValidationMode(value);
  }

  /**
   * The string value of the validation mode.
   */
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }
}

/**
 * Enforcement mode for a policy.
 *
 * Determines whether the policy's decision is enforced by the policy engine or
 * only evaluated and logged.
 */
export class PolicyEnforcementMode {
  /**
   * The policy is evaluated and its decision is enforced by the policy engine.
   */
  public static readonly ACTIVE = new PolicyEnforcementMode('ACTIVE');

  /**
   * The policy is evaluated but its decision is only logged, not enforced.
   * Use this to validate a policy against real traffic before switching it to `ACTIVE`.
   */
  public static readonly LOG_ONLY = new PolicyEnforcementMode('LOG_ONLY');

  /**
   * An enforcement mode that this version of the CDK does not model.
   *
   * Prefer the static members above. Use this when the service has added a mode
   * that the CDK has no member for yet.
   *
   * @param value the raw enforcement mode value to pass to CloudFormation
   */
  public static of(value: string): PolicyEnforcementMode {
    return new PolicyEnforcementMode(value);
  }

  /**
   * The string value of the enforcement mode.
   */
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }
}

/**
 * Options for adding a policy via PolicyEngine.addPolicy()
 */
export interface AddPolicyOptions {
  /**
   * The Cedar policy statement for this policy.
   *
   * Build a type-safe statement with the `PolicyStatement` factories, or use
   * `PolicyStatement.fromCedar('...')` for raw Cedar. Raw Cedar is treated as trusted
   * input: the module does not escape, quote, or validate it.
   */
  readonly statement: PolicyStatement;

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

  /**
   * Enforcement mode for the policy.
   *
   * @default - No enforcement mode is set, and the service uses `ACTIVE`
   */
  readonly enforcementMode?: PolicyEnforcementMode;
}
