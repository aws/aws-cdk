import { IResolvable, IResolveContext, captureStackTrace } from 'aws-cdk-lib';

/** Reserved pipe variables
* @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-input-transformation.html#input-transform-reserved
*/
export enum PipeVariable {
  /**
   * The Amazon Resource Name (ARN) of the pipe.
   */
  ARN = '<aws.pipes.pipe-arn>',
  /**
   * The name of the pipe.
   */
  NAME = '<aws.pipes.pipe-name>',
  /**
   * The ARN of the event source of the pipe.
   */
  SOURCE_ARN = '<aws.pipes.source-arn>',
  /**
   * The ARN of the enrichment of the pipe.
   */
  ENRICHMENT_ARN = '<aws.pipes.enrichment-arn>',
  /**
   * The ARN of the target of the pipe.
   */
  TARGET_ARN = '<aws.pipes.target-arn>',
  /**
   * The time at which the event was received by the input transformer. This is an ISO 8601 timestamp. This time is different for the enrichment input transformer and the target input transformer, depending on when the enrichment completed processing the event.
   */
  EVENT_INGESTION_TIME = '<aws.pipes.event.ingestion-time>',
  /**
   * The event as received by the input transformer.
   */
  EVENT = '<aws.pipes.event>',
  /**
   * The same as aws.pipes.event, but the variable only has a value if the original payload, either from the source or returned by the enrichment, is JSON. If the pipe has an encoded field, such as the Amazon SQS body field or the Kinesis data, those fields are decoded and turned into valid JSON. Because it isn't escaped, the variable can only be used as a value for a JSON field. For more information, see Implicit body data parsing.
   */
  EVENT_JSON = '<aws.pipes.event.json>'

}

/**
 * Dynamic variables that can be used in the input transformation.
 */
export class DynamicInput implements IResolvable {
  /**
   * Value from the event payload at jsonPath.
   */
  static fromEventPath(path: string): DynamicInput {
    return new DynamicInput(`<${path}>`);
  }

  /**
   * The Amazon Resource Name (ARN) of the pipe.
   */
  public static get pipeArn (): DynamicInput {
    return this.fromPipeVariable(PipeVariable.ARN);
  }

  /**
   * The name of the pipe.
   */
  public static get pipeName (): DynamicInput {
    return this.fromPipeVariable(PipeVariable.NAME);
  }

  /**
   * The ARN of the event source of the pipe.
   */
  public static get sourceArn (): DynamicInput {
    return this.fromPipeVariable(PipeVariable.SOURCE_ARN);
  }

  /**
   * The ARN of the enrichment of the pipe.
   */
  public static get enrichmentArn (): DynamicInput {
    return this.fromPipeVariable(PipeVariable.ENRICHMENT_ARN);
  }

  /**
   * The ARN of the target of the pipe.
   */
  public static get targetArn (): DynamicInput {
    return this.fromPipeVariable(PipeVariable.TARGET_ARN);
  }

  /**
   * The time at which the event was received by the input transformer. This is an ISO 8601 timestamp. This time is different for the enrichment input transformer and the target input transformer, depending on when the enrichment completed processing the event.
   */
  public static get eventIngestionTime (): DynamicInput {
    return this.fromPipeVariable(PipeVariable.EVENT_INGESTION_TIME);
  }

  /**
   * The event as received by the input transformer.
   */

  public static get event (): DynamicInput {
    return this.fromPipeVariable(PipeVariable.EVENT);
  }

  /**
   * The same as aws.pipes.event, but the variable only has a value if the original payload, either from the source or returned by the enrichment, is JSON. If the pipe has an encoded field, such as the Amazon SQS body field or the Kinesis data, those fields are decoded and turned into valid JSON. Because it isn't escaped, the variable can only be used as a value for a JSON field. For more information, see Implicit body data parsing.
   */
  public static get eventJson (): DynamicInput {
    return this.fromPipeVariable(PipeVariable.EVENT_JSON);
  }

  /**
   * Value from one of the provided Pipe variables.
  */
  private static fromPipeVariable(variable: PipeVariable): DynamicInput {
    return new DynamicInput(variable);
  }

  /**
   * Human readable display hint about the event pattern
   */
  public readonly displayHint: string;
  public readonly creationStack: string[];

  private constructor(private value :string) {
    this.displayHint = value.toString();
    this.creationStack = captureStackTrace();
    this.value = value;
  }

  resolve(_context: IResolveContext): any {
    return this.value;
  }

  /**
   * Return a string representation of a dynamic input.
   */
  toString(): string {
    return this.value.toString();
  }

  /**
   * Return a JSON representation of a dynamic input.
   */
  toJSON(): string {
    return this.value.toString();
  }
}