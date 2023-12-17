
enum reservedVariables {
  PIPES_ARN = '<aws.pipes.pipe-arn>',
  PIPES_NAME = '<aws.pipes.pipe-name>',
  PIPES_TARGET_ARN = '<aws.pipes.target-arn>',
  PIPE_EVENT_INGESTION_TIME = '<aws.pipes.event.ingestion-time>',
  PIPE_EVENT = '<aws.pipes.event>',
  PIPE_EVENT_JSON = '<aws.pipes.event.json>',
}

type StaticString = string;
// type JsonPath = `<$.${string}>`;
type KeyValue = Record<string, string | reservedVariables>;
type StaticJsonFlat = Record<string, StaticString | KeyValue>;
type InputTransformJson = Record<string, StaticString | KeyValue | StaticJsonFlat>;

type PipeInputTransformationValue = StaticString | InputTransformJson;

/**
 * Transform or replace the input event payload
 */
export interface IInputTransformation {
  /**
   * Valid JSON text passed to the target.
   */
  inputTemplate: string;
}

/**
 * Transform or replace the input event payload
 */
export class PipeInputTransformation implements IInputTransformation {
  /**
   * Builds an input transformation from a JSON object.
   * @param inputTemplate
   * @returns
   */
  static fromJson(inputTemplate: Record<string, any>): PipeInputTransformation {
    return new PipeInputTransformation(inputTemplate);
  }

  inputTemplate: string;

  constructor(inputTemplate: PipeInputTransformationValue) {
    this.inputTemplate = this.unquoteKeyPlaceholders(inputTemplate);
  }

  private unquoteKeyPlaceholders(obj: any) {
    const jsonString = JSON.stringify(obj);

    const result = jsonString.replace(/"(<(?:\$\.|aws\.pipes)[^"]*?)"/g, '$1'); // Retain the "<>" and remove the outer quotes for the values that start with either "<$." or "<aws.pipes"

    return result;
  }
}
