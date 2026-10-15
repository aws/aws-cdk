/**
 * Properties of the copy custom resource
 */
export interface CopyAssetProperties {
  readonly SourceBucket: string;
  readonly SourceKey: string;
  readonly DestinationBucket: string;
  readonly DestinationKey: string;
}

/**
 * The custom resource event sent by CloudFormation
 */
export interface CopyAssetEvent {
  readonly RequestType: 'Create' | 'Update' | 'Delete';
  readonly ResourceProperties: CopyAssetProperties;
}

/**
 * The response returned to CloudFormation
 */
export interface CopyAssetResponse {
  readonly PhysicalResourceId: string;
  readonly Data?: { readonly VersionId: string };
}

export declare function handler(event: CopyAssetEvent): Promise<CopyAssetResponse>;
