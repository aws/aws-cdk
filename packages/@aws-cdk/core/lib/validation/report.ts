/**
 * Violation produced by the validation plugin.
 */
export interface ValidationViolation {
  /**
   * The name of the rule.
   */
  readonly ruleName: string;

  /**
   * The description of the violation.
   */
  readonly description: string;

  /**
   * How to fix the violation.
   *
   * @default - no fix is provided
   */
  readonly fix?: string;

  /**
   * The severity of the violation, only used for reporting purposes.
   * This is useful for helping the user discriminate between warnings,
   * errors, information, etc.
   *
   * @default - no severity
   */
  readonly severity?: string;
}

/**
 * Resource violating a specific rule.
 */
export interface ValidationViolatingResource {
  /**
   * The logical ID of the resource in the CloudFormation template.
   */
  readonly resourceLogicalId: string;

  /**
   * The locations in the CloudFormation template that pose the violations.
   */
  readonly locations: string[];

  /**
   * The path to the CloudFormation template that contains this resource
   */
  readonly templatePath: string;
}

/**
 * Validation produced by the validation plugin, in CFN resource terms
 */
export interface ValidationViolationResourceAware extends ValidationViolation {
  /**
   * The resources violating this rule.
   */
  readonly violatingResources: ValidationViolatingResource[];
}


/**
 * The final status of the validation report
 */
export enum ValidationReportStatus {
  /**
   * No violations were found
   */
  SUCCESS = 'success',

  /**
   * At least one violation was found
   */
  FAILURE = 'failure',
}


/**
 * How the report should be formatted.
 */
export enum ValidationReportFormat {
  /**
   * JSON format
   */
  JSON = 'json',

  /**
   * Human readable format
   */
  PRETTY_PRINTED = 'pretty_printed',
}

/**
 * The report emitted by the plugin after evaluation.
 */
export interface ValidationPluginReport {
  /**
   * List of violations in the report.
   */
  readonly violations: ValidationViolationResourceAware[];

  /**
   * Whether or not the report was successful.
   */
  readonly success: boolean;

  /**
   * The name of the plugin that created the report
   */
  readonly pluginName: string;

  /**
   * Arbitrary information about the report.
   *
   * @default - no metadata
   */
  readonly metadata?: { readonly [key: string]: string }
}


