import type { IConstruct } from 'constructs';
import type { IPolicyValidationPlugin } from './validation';
import { UnscopedValidationError } from '../errors';
import { lit } from '../private/literal-string';
import { Stage } from '../stage';

/**
 * Manages validations for CDK constructs.
 *
 * @example
 * declare const app: App;
 * declare const plugin: IPolicyValidationPlugin;
 * Validations.of(app).addPlugins(plugin);
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
}
