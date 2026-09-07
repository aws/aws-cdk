import * as fs from 'fs';
import * as path from 'path';
import type { PolicyValidationReportJson, PolicyViolationSeverity } from '@aws-cdk/cloud-assembly-schema';
import type { IConstruct } from 'constructs';
import { AssumptionError } from '../../../core';
import type { App } from '../../../core/lib/app';
import { lit } from '../../../core/lib/private/literal-string';
import * as cxapi from '../../../cx-api';
import { Match } from '../match';
import { AssertionError } from '../private/error';

/**
 * An API to access and assert on the validation report of an application
 *
 * Currently still a helper API because I want to centralize the loading and asserting
 * in this codebase without necessarily committing to any public API yet.
 */
export class AssemblyValidationReport {
  public static readonly APP_CONTEXT = {
    [cxapi.FAIL_SYNTH_ON_VALIDATION_ERRORS_CONTEXT]: false,
    [cxapi.STRICT_CFN_VALIDATE_ERRORS]: false,
  };

  public static fromApp(app: App) {
    if (getBooleanContext(app, cxapi.FAIL_SYNTH_ON_VALIDATION_ERRORS_CONTEXT, true)
      || getBooleanContext(app, cxapi.STRICT_CFN_VALIDATE_ERRORS, false)) {
      throw new AssumptionError(lit`MissingAppContext`, 'In order to assert on validations with AssemblyValidationReport, create your App with { postCliContext: AssemblyValidationReport.APP_CONTEXT }');
    }

    const asm = app.synth();

    const newFile = path.join(asm.directory, 'validation-report.json');
    const newReport = JSON.parse(fs.readFileSync(newFile, 'utf-8'));

    return new AssemblyValidationReport(newReport);
  }

  private constructor(private readonly report: PolicyValidationReportJson) {
  }

  /**
   * All violations in all reports
   */
  public allViolations() {
    return this.report.pluginReports.flatMap(r => r.violations);
  }

  public hasViolation(pattern?: PartialViolation) {
    const matcher = Match.arrayWith([Match.objectLike(pattern ?? {})]);
    const r = matcher.test(this.allViolations());
    r.finished();

    if (r.hasFailed()) {
      throw new AssertionError('Expected policy violation not found:\n' + r.renderMismatch());
    }
  }

  public hasNoViolation(pattern?: PartialViolation) {
    const matcher = Match.arrayWith([Match.objectLike(pattern ?? {})]);
    const r = matcher.test(this.allViolations());
    r.finished();

    if (!r.hasFailed()) {
      throw new AssertionError('Expected no policy violations, but found:\n' + JSON.stringify(this.allViolations(), undefined, 2));
    }
  }
}

export interface PartialViolation {
  readonly ruleName?: any;
  readonly description?: any;
  readonly severity?: PolicyViolationSeverity | any;
}

function getBooleanContext(root: IConstruct, key: string, defaultValue: boolean): boolean {
  const raw = root.node.tryGetContext(key);
  if (raw === undefined) return defaultValue;
  return raw !== false && raw !== 'false';
}
