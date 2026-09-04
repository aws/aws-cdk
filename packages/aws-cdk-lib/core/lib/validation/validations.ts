import type { IConstruct } from 'constructs';
import type { IPolicyValidationPlugin } from './validation';
import { Annotations } from '../annotations';
import { UnscopedValidationError } from '../errors';
import { AnnotationPlugin } from '../private/annotation-plugin';
import { STAGE_TYPE, stageOf } from '../private/core-construct-finders';
import { lit } from '../private/literal-string';
import { enhancedStackTrace } from '../private/stack-trace';

/**
 * An acknowledgment of a validation rule, used to suppress it from output.
 */
export interface Acknowledgment {
  /**
   * The rule ID to acknowledge.
   */
  readonly id: string;

  /**
   * The reason for acknowledging this rule.
   */
  readonly reason: string;
}

/**
 * Manages validations for CDK constructs.
 *
 * @example
 * /// fixture=validation-plugin
 * declare const myApp: App;
 * declare const plugin: IPolicyValidationPlugin;
 * Validations.of(myApp).addPlugins(plugin);
 */
export class Validations {
  /**
   * Metadata key used to store acknowledged rules on construct nodes.
   *
   * Plugin authors can read this metadata to build audit trails from
   * acknowledgments recorded via `acknowledge()`.
   */
  public static readonly ACKNOWLEDGED_RULES_METADATA_KEY = 'aws:cdk:acknowledged-rules';

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
    const stage = STAGE_TYPE.isMarked(this.scope) ? this.scope : stageOf(this.scope);
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
   * The ID will be stored with the `annotation` prefix (e.g. `annotation::MyWarning`).
   * Use this prefixed ID when calling `acknowledge()` to suppress the warning.
   *
   * @param id unique identifier for the warning, used for acknowledgement
   * @param message the warning message
   */
  public addWarning(id: string, message: string): void {
    Annotations.of(this.scope).addWarningV2(this.qualifyId(id), message);
  }

  /**
   * Adds an error metadata entry to this construct.
   *
   * Synthesis will be interrupted when errors are reported.
   *
   * Note: Annotation errors are not currently acknowledgeable. The ID is
   * recorded for identification purposes but `acknowledge()` will not
   * suppress errors added via this method.
   *
   * @param id unique identifier for the error
   * @param message the error message
   */
  public addError(id: string, message: string): void {
    Annotations.of(this.scope).addError(`${message} (${this.qualifyId(id)})`);
  }

  /**
   * Acknowledge one or more rules, suppressing them from validation output.
   *
   * Acknowledgments are recorded to construct metadata so that downstream
   * plugins (e.g. CDK Nag) can read them for audit trails.
   *
   * Currently only annotation warnings can be suppressed. Annotation errors
   * are not yet acknowledgeable.
   *
   * If an ID has no well-known prefix, it is assumed to be an annotation rule
   * for backwards compatibility.
   *
   * @param rules the rules to acknowledge
   */
  public acknowledge(...rules: Acknowledgment[]): void {
    for (const rule of rules) {
      const qualifiedId = this.qualifyId(rule.id);
      this.recordAcknowledgment(qualifiedId, rule.reason);

      // There is a mess here, that has been created for historical reasons and we now
      // sort of have to leave in place for backwards compatibility.
      //
      // Annotations can be added via:
      //
      // 1) `Annotations.of().addWarningV2('<id>')`         -- adds an annotation with the given ID
      // 2) `Validations.of().addWarning('<id>')`           -- adds an annotation with ID 'Annotation::<id>'
      // 3) `Validations.of().addWarning('<prefix>::<id>')` -- adds an annotation with ID '<prefix>::<id>'
      //
      // For both cases (2) and (3), we would like to be able to suppress the warning by calling one of:
      //
      // b) `Validations.of().acknowledge('Annotation::<id>')`            -- validation namespace
      // a) `Validations.of().acknowledge('<id>')`                        -- legacy behavior we are committed to
      // c) `Validations.of().acknowledge('Construct-Annotations::<id>')` -- previous name of validation namespace
      //
      // Since we can't know if `Validations.of().acknowledge('<id>')` should
      // suppress the namespaced or unnamespaced version of the warning, we will suppress both.
      Annotations.of(this.scope).acknowledgeWarning(qualifiedId);

      if (qualifiedId.startsWith(`${AnnotationPlugin.RULE_PREFIX}::`) || qualifiedId.startsWith(`${AnnotationPlugin.LEGACY_RULE_PREFIX}::`)) {
        const annotationId = qualifiedId.split('::')[1];

        // Suppress both qualified and unqualified versions of the warning, see the big comment above.
        Annotations.of(this.scope).acknowledgeWarning(annotationId);
        Annotations.of(this.scope).acknowledgeWarning(qualifiedId);
      }
    }
  }

  private recordAcknowledgment(id: string, reason: string): void {
    this.scope.node.addMetadata(
      Validations.ACKNOWLEDGED_RULES_METADATA_KEY,
      { [id]: reason },
      // eslint-disable-next-line @typescript-eslint/unbound-method
      { stackTraceOverride: enhancedStackTrace(this.recordAcknowledgment) },
    );
  }

  private qualifyId(id: string): string {
    const parts = id.split('::');
    if (parts.length > 2 || (parts.length === 2 && parts[0].length === 0)) {
      throw new UnscopedValidationError(lit`InvalidValidationId`, `Invalid validation rule ID '${id}'. The '::' delimiter is reserved for separating the prefix from the rule name (e.g. 'prefix::RuleName').`);
    }

    if (parts.length === 1) {
      return `${AnnotationPlugin.RULE_PREFIX}::${id}`;
    }

    if (parts[0] === 'annotation') {
      // Uppercase this
      return `${AnnotationPlugin.RULE_PREFIX}::${parts[1]}`;
    }

    return id;
  }
}
