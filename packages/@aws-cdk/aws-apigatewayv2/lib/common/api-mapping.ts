import { IResource } from '@aws-cdk/core';

/**
 * Represents an ApiGatewayV2 ApiMapping resource
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html
 */
export interface IApiMapping extends IResource {
  /**
   * ID of the api mapping
   * @attribute
   */
  readonly apiMappingId: string;
}
