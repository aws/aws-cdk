import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { IConstruct } from 'constructs';

/**
 * Logging methods for AWS CDK constructs.
 */
export class Logging {
  /**
   * Returns logging facilities associated with a construct.
   * @param construct The construct
   *
   * @example
   *
   * Logging.of(c).addWarning('this is a warning');
   *
   */
  public static of(construct: IConstruct): Logging {
    return new Logging(construct);
  }

  private constructor(private readonly construct: IConstruct) { }

  /**
   * Adds a { "aws:cdk:warning": <message> } metadata entry to this construct.
   * The toolkit will display the warning when an app is synthesized, or fail if
   * run in --strict mode. Stack trace will be included unless stack traces are
   * disabled for this scope.
   * @param message The warning message.
   */
  public addWarning(message: string) {
    this.addMessage(cxschema.ArtifactMetadataEntryType.WARN, message);
  }

  /**
   * Adds a { "aws:cdk:info": <message> } metadata entry to this construct.
   * The toolkit will display the info message when apps are synthesized.
   * Stack trace will be included unless stack traces are disabled for this scope.
   * @param message The info message.
   */
  public addInfo(message: string) {
    this.addMessage(cxschema.ArtifactMetadataEntryType.INFO, message);
  }

  /**
   * Adds an { "aws:cdk:error": <message> } metadata entry to this construct.
   * The toolkit will fail synthesis when errors are reported.
   * Stack trace will be included unless stack traces are disabled for this scope.
   * @param message The error message.
   */
  public addError(message: string) {
    this.addMessage(cxschema.ArtifactMetadataEntryType.ERROR, message);
  }

  private addMessage(key: string, message: string) {
    const stackTrace = this.construct.node.tryGetContext(cxapi.DISABLE_METADATA_STACK_TRACE) ? false : true;
    this.construct.node.addMetadata(key, message, { stackTrace });
  }
}