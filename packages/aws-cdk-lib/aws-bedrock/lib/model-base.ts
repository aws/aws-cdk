/**
 * Represents a Bedrock model.
 * The model could be a foundation model, a custom model, or a provisioned model.
 */
export interface IModel {
  /**
   * The ARN of the model
   *
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/api-methods-run.html
   * @see https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonbedrock.html#amazonbedrock-actions-as-permissions
   */
  readonly modelArn: string;
}
