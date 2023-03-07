/**
 * Violation produced by the validation plugin.
 */
export interface ValidationViolation {
  /**
   * The name of the rule.
   */
  readonly ruleName: string;

  /**
   * The recommendation to resolve the violation.
   */
  readonly recommendation: string;

  /**
   * How to fix the recommendation.
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
   * The resource name.
   */
  readonly resourceName: string;

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
 * Construct violating a specific rule.
 */
export interface ValidationViolatingConstruct extends ValidationViolatingResource {
  /**
   * The construct path as defined in the application.
   */
  readonly constructPath: string;

  /**
   * A stack of constructs that lead to the violation.
   *
   * @default - stack will be empty if the cli is not run with `--debug`
   */
  readonly constructStack?: string;
}

/**
 * Validation produced by the validation plugin, in construct terms.
 */
export interface ValidationViolationConstructAware extends ValidationViolation {
  /**
   * The constructs violating this rule.
   */
  readonly violatingConstructs: ValidationViolatingConstruct[];
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
 * Summary of the report.
 */
export interface ValidationReportSummary {
  /**
   * The final status of the validation (pass/fail)
   */
  readonly status: ValidationReportStatus;

  /**
   * The name of the plugin that created the report
   */
  readonly pluginName: string;

  /**
   * Additional metadata about the report. This property is intended
   * to be used by plugins to add additional information.
   *
   * @default - no metadata
   */
  readonly metadata?: { readonly [key: string]: string };
}

/**
 * JSON representation of the report.
 */
export interface ValidationReportJson {
  /**
   * Report title.
   */
  readonly title: string;

  /**
   * Reports for all of the validation plugins registered
   * in the app
   */
  readonly pluginReports: PluginReportJson[];
}

/**
 * A report from a single plugin
 */
export interface PluginReportJson {
  /**
   * List of violations in the report.
   */
  readonly violations: ValidationViolationConstructAware[];

  /**
   * Report summary.
   */
  readonly summary: ValidationReportSummary;
}

/**
 * The report emitted by the plugin after evaluation.
 */
export interface ValidationReport {
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


