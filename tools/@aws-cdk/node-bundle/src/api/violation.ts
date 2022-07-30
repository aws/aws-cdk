/**
 * Violation types.
 */
export enum ViolationType {

  /**
   * Circular import on the package or one of its dependencies.
   */
  CIRCULAR_IMPORT = 'circular-import',

  /**
   * Outdated attributions file.
   */
  OUTDATED_ATTRIBUTIONS = 'outdated-attributions',

  /**
   * Missing notice file.
   */
  MISSING_NOTICE = 'missing-notice',

  /**
   * Invalid license.
   */
  INVALID_LICENSE = 'invalid-license',

  /**
   * No license.
   */
  NO_LICENSE = 'no-license',

  /**
   * Multiple licenses.
   */
  MULTIPLE_LICENSE = 'multiple-license',

  /**
   * Missing resource file.
   */
  MISSING_RESOURCE = 'missing-resource',

}

/**
 * A validation violation.
 */
export interface Violation {
  /**
   * The violation type.
   */
  readonly type: ViolationType;
  /**
   * The violation message.
   */
  readonly message: string;
  /**
   * A fixer function.
   * If undefined, this violation cannot be fixed automatically.
   */
  readonly fix?: () => void;
}

/**
 * Report encapsulating a list of violations.
 */
export class ViolationsReport {

  constructor(private readonly _violations: Violation[]) {}

  /**
   * The list of violations.
   */
  public get violations(): readonly Violation[] {
    return this._violations;
  }

  /**
   * True when no violations exist. False otherwise.
   */
  public get success(): boolean {
    return this.violations.length === 0;
  }

  /**
   * Summary of the violation in the report.
   */
  public get summary(): string {
    const summary = [
      `${this._violations.length} violations detected`,
    ];
    for (const v of this._violations) {
      summary.push(`- ${v.type}: ${v.message}${v.fix ? ' (fixable)' : ''}`);
    }
    return summary.join('\n');
  }

}
