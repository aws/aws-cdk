import { IConstruct } from 'constructs';
import * as cxschema from '../../cloud-assembly-schema';
import * as cxapi from '../../cx-api';

/**
 * Includes API for attaching annotations such as warning messages to constructs.
 */
export class Annotations {
  /**
   * Returns the annotations API for a construct scope.
   * @param scope The scope
   */
  public static of(scope: IConstruct) {
    return new Annotations(scope);
  }

  private readonly stackTraces: boolean;

  private constructor(private readonly scope: IConstruct) {
    const disableTrace =
      scope.node.tryGetContext(cxapi.DISABLE_METADATA_STACK_TRACE) ||
      process.env.CDK_DISABLE_STACK_TRACE;

    this.stackTraces = !disableTrace;
  }

  /**
   * Acknowledge a warning. When a warning is acknowledged for a scope
   * all warnings that match the id will be ignored.
   *
   * The acknowledgement will apply to all child scopes
   *
   * @example
   * declare const stack: Stack;
   * Annotations.of(stack).acknowledgeWarning('SomeWarningId');
   *
   * @param id - the id of the warning message to acknowledge
   */
  public acknowledgeWarning(id: string, message?: string): void {
    const scopes = this.scope.node.findAll().map(child => child.node.path);
    this.addMessage(cxschema.ArtifactMetadataEntryType.ACKNOWLEDGE, {
      id,
      message,
      scopes,
    });
  }

  /**
   * Adds a warning metadata entry to this construct.
   *
   * The CLI will display the warning when an app is synthesized, or fail if run
   * in --strict mode.
   *
   * @param id the unique identifier for the warning. This can be used to acknowledge the warning
   * @param message The warning message.
   */
  public addWarningV2(id: string, message: string) {
    const warning = {
      id: id,
      scope: this.scope.node.path,
      message,
    };
    this.addMessage(cxschema.ArtifactMetadataEntryType.WARN, warning);
  }

  /**
   * Adds a warning metadata entry to this construct.
   *
   * The CLI will display the warning when an app is synthesized, or fail if run
   * in --strict mode.
   *
   * @param message The warning message.
   */
  public addWarning(message: string) {
    this.addMessage(cxschema.ArtifactMetadataEntryType.WARN, message);
  }

  /**
   * Adds an info metadata entry to this construct.
   *
   * The CLI will display the info message when apps are synthesized.
   *
   * @param message The info message.
   */
  public addInfo(message: string): void {
    this.addMessage(cxschema.ArtifactMetadataEntryType.INFO, message);
  }

  /**
   * Adds an { "error": <message> } metadata entry to this construct.
   * The toolkit will fail deployment of any stack that has errors reported against it.
   * @param message The error message.
   */
  public addError(message: string) {
    this.addMessage(cxschema.ArtifactMetadataEntryType.ERROR, message);
  }

  /**
   * Adds a deprecation warning for a specific API.
   *
   * Deprecations will be added only once per construct as a warning and will be
   * deduplicated based on the `api`.
   *
   * If the environment variable `CDK_BLOCK_DEPRECATIONS` is set, this method
   * will throw an error instead with the deprecation message.
   *
   * @param api The API being deprecated in the format `module.Class.property`
   * (e.g. `@aws-cdk/core.Construct.node`).
   * @param message The deprecation message to display, with information about
   * alternatives.
   */
  public addDeprecation(api: string, message: string) {
    const text = `The API ${api} is deprecated: ${message}. This API will be removed in the next major release`;

    // throw if CDK_BLOCK_DEPRECATIONS is set
    if (process.env.CDK_BLOCK_DEPRECATIONS) {
      throw new Error(`${this.scope.node.path}: ${text}`);
    }

    this.addWarning(text);
  }

  /**
   * Adds a message metadata entry to the construct node, to be displayed by the CDK CLI.
   *
   * Records the message once per construct.
   * @param level The message level
   * @param message The message itself
   */
  private addMessage(
    level: string,
    message: cxschema.LogMessageMetadataEntry | cxschema.LogMessageObjectMetadataEntry | cxschema.AcknowledgementMetadataEntry,
  ) {
    const isNew = !this.scope.node.metadata.find((x) => x.data === message);
    if (isNew) {
      this.scope.node.addMetadata(level, message, { stackTrace: this.stackTraces });
    }
  }
}
