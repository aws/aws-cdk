import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import { Construct } from 'constructs';
import * as yaml from 'yaml';

/**
 * Helper class for referencing and uploading ImageBuilder data (components, workflows, etc.)
 *
 * @internal
 */
export abstract class ImageBuilderData {
  /**
   * Protected method to create an S3 asset for use by derived classes
   */
  protected static createAsset(
    scope: Construct,
    id: string,
    path: string,
    options: s3assets.AssetOptions = {},
  ): s3assets.Asset {
    return new s3assets.Asset(scope, id, { ...options, path });
  }

  /**
   * Protected method to create inline YAML data for use by derived classes
   */
  protected static createInlineYaml(data: { [key: string]: any }): string {
    return yaml.stringify(data, { indent: 2 });
  }

  /**
   * Indicates that the provided data is an S3 reference
   */
  abstract readonly isS3Reference: boolean;

  /**
   * The resulting inline string or S3 URL which references the data
   */
  public readonly value: string;

  protected constructor(value: string) {
    this.value = value;
  }
}
