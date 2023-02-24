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
   * @default - TODO
   */
  readonly fix?: string;
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
 * TODO docs
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
   * TODO docs
   * @default - TODO
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
   * TODO: docs
   */
  readonly pluginReports: PluginReportJson[];
}

export interface PluginReportJson {
  /**
   * List of violations in the rerpot.
   */
  readonly violations: ValidationViolationConstructAware[];

  /**
   * Report summary.
   */
  readonly summary: ValidationReportSummary;
}

export interface IValidationReport {
  /**
   * Whether or not the report was successfull.
   */
  readonly success: boolean;

  /**
   * Add a violation to the report.
   */
  addViolation(pluginName: string, violation: ValidationViolationResourceAware): void;

  /**
   * Submit the report with a status and additional metadata.
   */
  submit(pluginName: string, status: ValidationReportStatus, metadata?: { readonly [key: string]: string }): void;

  /**
   * Transform the report to a well formatted table string.
   */
  toString(): string;

  /**
   * Transform the report into a JSON object.
   */
  toJson(): ValidationReportJson;
}

