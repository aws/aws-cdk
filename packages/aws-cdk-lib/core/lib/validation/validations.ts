import type { IConstruct } from 'constructs';
import type { IPolicyValidationPlugin } from './validation';
import { UnscopedValidationError } from '../errors';
import { lit } from '../private/literal-string';
import { Stage } from '../stage';

/**
 * Manages validation plugins for a Stage.
 *
 * @example
 * import { CfnGuardValidator } from '@cdklabs/cdk-validator-cfnguard';
 *
 * declare const app: App;
 * Validations.of(app).addPlugin(new CfnGuardValidator());
 */
export class Validations {
  /**
   * Returns the Validations for the Stage that encloses the given construct.
   *
   * @param scope any construct within a Stage
   */
  public static of(scope: IConstruct): Validations {
    const stage = Stage.isStage(scope) ? scope : Stage.of(scope);
    if (!stage) {
      throw new UnscopedValidationError(lit`NoStageForValidations`, 'Cannot add validation plugins on a construct without an enclosing Stage');
    }
    return new Validations(stage);
  }

  private constructor(private readonly stage: Stage) {}

  /**
   * Register a validation plugin that will be executed during synthesis.
   *
   * If any plugin reports a violation, synthesis will be interrupted and the
   * report displayed to the user.
   *
   * @param plugin the validation plugin to add
   */
  public addPlugin(plugin: IPolicyValidationPlugin): void {
    this.stage.policyValidationBeta1.push(plugin);
  }
}
