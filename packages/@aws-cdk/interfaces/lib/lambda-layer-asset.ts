import { IConstruct } from 'constructs';

/**
 * A Construct that can be used as the asset for defining a Lambda Layer
 */
export interface ILambdaLayerAsset extends IConstruct {
  /**
   * The ARN of the bucket containing the asset
   */
  readonly bucketArn: string;

  /**
   * The object key
   */
  readonly key: string;
}