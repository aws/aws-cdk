import type { IConstruct } from 'constructs';
import type { IPolicyValidationPlugin } from './validation';
import { Annotations } from '../annotations';
import { UnscopedValidationError } from '../errors';
import { lit } from '../private/literal-string';
import { Stage } from '../stage';

/**
 * Manages validations for CDK constructs.
 *
 * @example
 * import { CfnGuardValidator } from '@cdklabs/cdk-validator-cfnguard';
 *
 * declare const app: App;
 * Validations.of(app).addPlugins(new CfnGuardValidator());
 */
export class Validations {
  /**
   * Returns the Validations for the given construct scope.
   *
   * @param scope any construct
   */
  public static of(scope: IConstruct): Validations {
    return new Validations(scope);
  }

  private constructor(private readonly scope: IConstruct) {}

  /**
   * Register one or more validation plugins that will be executed during synthesis.
   *
   * Plugins can only be registered within a Stage or App scope.
   * If any plugin reports a violation, synthesis will be interrupted and the
   * report displayed to the user.
   *
   * @param plugins the validation plugins to add
   */
  public addPlugins(...plugins: IPolicyValidationPlugin[]): void {
    const stage = Stage.isStage(this.scope) ? this.scope : Stage.of(this.scope);
    if (!stage) {
      throw new UnscopedValidationError(lit`NoStageForValidationPlugins`, 'Cannot add validation plugins on a construct without an enclosing Stage');
    }
    stage._addValidationPlugins(...plugins);
  }

  /**
   * Adds a warning metadata entry to this construct that can be acknowledged.
   *
   * The CLI will display the warning when an app is synthesized, or fail if run
   * in `--strict` mode.
   *
   * @param id unique identifier for the warning, used for acknowledgement
   * @param message the warning message
   */
  public addWarning(id: string, message: string): void {
    Annotations.of(this.scope).addWarningV2(id, message);
  }

  /**
   * Adds an error metadata entry to this construct.
   *
   * Synthesis will be interrupted when errors are reported.
   *
   * @param message the error message
   */
  public addError(message: string): void {
    Annotations.of(this.scope).addError(message);
  }

  /**
   * Acknowledge one or more rule IDs, suppressing them from validation output.
   *
   * @param ruleIds the rule IDs to acknowledge
   */
  public acknowledge(...ruleIds: string[]): void {
    for (const id of ruleIds) {
      if (this.isAnnotationRule(id)) {
        Annotations.of(this.scope).acknowledgeWarning(id.substring('annotation:'.length));
      }
    }
  }

  private isAnnotationRule(id: string): boolean {
    return id.startsWith('annotation:');
  }
}
