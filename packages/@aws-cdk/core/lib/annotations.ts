import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { IConstruct } from './construct-compat';

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

  private constructor(private readonly scope: IConstruct) {

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
   * The toolkit will fail synthesis when errors are reported.
   * @param message The error message.
   */
  public addError(message: string) {
    this.addMessage(cxschema.ArtifactMetadataEntryType.ERROR, message);
  }

  /**
   * Adds a message metadata entry to the construct node, to be displayed by the CDK CLI.
   * @param level The message level
   * @param message The message itself
   */
  private addMessage(level: string, message: string) {
    this.scope.construct.addMetadata(level, message);
  }
}