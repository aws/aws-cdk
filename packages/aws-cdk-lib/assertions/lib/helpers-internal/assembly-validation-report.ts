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
  /**
   * During testing, create an App() with this as `postCliContext` in order to be able to use `AssemblyValidationReport.fromApp(app)`.
   */
  public static readonly APP_CONTEXT = {
    [cxapi.FAIL_SYNTH_ON_VALIDATION_ERRORS_CONTEXT]: false,
    [cxapi.STRICT_CFN_VALIDATE_ERRORS]: false,
  };

  /**
   * Disable the test suppressions that are automatically applied to all tests via the global App init hook (jest-global-app-testhook.ts).
   *
   * Returns a function that must be called to restore the global App init hook to its previous state.
   */
  public static disableTestSuppressions() {
    const previousAppHook = (globalThis as any)[APP_INIT_HOOK_SYMBOL];
    (globalThis as any)[APP_INIT_HOOK_SYMBOL] = () => {
      // Intentionally empty: this is where the tests normally silence a bunch of default rules.
      // Unset it.
    };

    return () => {
      (globalThis as any)[APP_INIT_HOOK_SYMBOL] = previousAppHook;
    };
  }

  /**
   * Synthesize the given app and return its validation report.
   */
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

  private constructor(public readonly report: PolicyValidationReportJson) {
  }

  public pluginReport(pluginName: string) {
    const report = this.report.pluginReports.find(r => r.pluginName === pluginName);
    if (!report) {
      throw new AssertionError(`No report found for plugin ${pluginName}`);
    }
    return report;
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

const APP_INIT_HOOK_SYMBOL = Symbol.for('@aws-cdk/core.App#initHook');
