
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
  EVENT_JSON = '<aws.pipes.event.json>',

}

type StaticString = string;
type KeyValue = Record<string, string | PipeVariable>;
type StaticJsonFlat = Record<string, StaticString | KeyValue>;
type InputTransformJson = Record<string, StaticString | KeyValue | StaticJsonFlat>;

type InputTransformationValue = StaticString | InputTransformJson;

/**
 * Transform or replace the input event payload
 */
export interface IInputTransformation {
  /**
   * Valid JSON text passed to the target.
   */
  readonly inputTemplate: string;
}

/**
 * Transform or replace the input event payload
 */
export class InputTransformation implements IInputTransformation {
  /**
   * Builds an input transformation from a JSON object.
   * @param inputTemplate
   * @returns
   */
  static fromJson(inputTemplate: Record<string, any>): InputTransformation {
    return new InputTransformation(inputTemplate);
  }

  public readonly inputTemplate: string;

  constructor(inputTemplate: InputTransformationValue) {
    this.inputTemplate = this.unquoteKeyPlaceholders(inputTemplate);
  }

  private unquoteKeyPlaceholders(obj: any) {
    const jsonString = JSON.stringify(obj);

    const result = jsonString.replace(/"(<(?:\$\.|aws\.pipes)[^"]*?)"/g, '$1'); // Retain the "<>" and remove the outer quotes for the values that start with either "<$." or "<aws.pipes"

    return result;
  }
}
