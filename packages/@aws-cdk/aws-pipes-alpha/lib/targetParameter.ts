/** Reserved pipe variables
* @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-input-transformation.html#input-transform-reserved
*/
export enum PipeVariables {
  /**
   * The Amazon Resource Name (ARN) of the pipe.
   */
  'PIPE_ARN' = '<aws.pipes.pipe-arn>',
  /**
  * The name of the pipe.
  */
  'PIPE_NAME' = '<aws.pipes.pipe-name>',
  /**
  * The ARN of the event source of the pipe.
  */
  'PIPE_SOURCE_ARN' = '<aws.pipes.source-arn>',
  /**
   * The ARN of the enrichment of the pipe.
  */
  'PIPE_ENRICHMENT_ARN' = '<aws.pipes.enrichment-arn>',
  /**
   * The ARN of the target of the pipe.
  */
  'PIPE_TARGET_ARN' = '<aws.pipes.target-arn>',
  /**
   * The time at which the event was received by the input transformer. This is an ISO 8601 timestamp. This time is different for the enrichment input transformer and the target input transformer, depending on when the enrichment completed processing the event.
  */
  'PIPE_EVENT_INGESTION_TIME' = '<aws.pipes.event.ingestion-time>',
  /**
   * The event as received by the input transformer.
  */
  'PIPE_EVENT' = '<aws.pipes.event>',
  /**
   * The same as aws.pipes.event, but the variable only has a value if the original payload, either from the source or returned by the enrichment, is JSON. If the pipe has an encoded field, such as the Amazon SQS body field or the Kinesis data, those fields are decoded and turned into valid JSON. Because it isn't escaped, the variable can only be used as a value for a JSON field. For more information, see Implicit body data parsing.
  */
  'PIPE_EVENT_JSON' = '<aws.pipes.event.json>',

}

/**
 * Helper class to generate dynamic target parameters.
 */
export class PipeTargetParameter {

  /**
   * Target parameter based on a jsonPath expression from the incoming event.
   */
  static fromJsonPath(jsonPath: string): string {
    if (!jsonPath.startsWith('$.')) {
      throw new Error('JsonPath must start with "$."');
    }
    return `<${jsonPath}>`;
  }

  /**
   * Target parameter based on a reserved pipe variable.
   */
  static fromPipeVariable(pipeVariable: PipeVariables): string {
    return pipeVariable;
  }

}