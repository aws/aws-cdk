/**
 * The tag mutability setting for the repository.
 */
export enum ImageTagMutability {
  /** Mutable repo. */
  MUTABLE = 'MUTABLE',

  /** Immutable repo. */
  IMMUTABLE = 'IMMUTABLE'
}

/**
 * Image scanning configuration for the repository.
 */
export interface ImageScanningConfiguration {
  /**
   * scanOnPush setting for the repository
   */
  readonly scanOnPush: boolean;
}

/**
 * Properties of a discovered repository.
 */
export interface ECRContextResponse {
  /**
   * The Amazon Resource Name (ARN) that identifies the repository.
   */
  readonly repositoryArn: string;

  /**
   * The AWS account ID associated with the registry that contains the repository.
   */
  readonly registryId: string;

  /**
   * The name of the repository.
   */
  readonly repositoryName: string;

  /**
   * The URI for the repository.
   */
  readonly repositoryUri: string;

  /**
   * The date and time, in JavaScript date format, when the repository was created.
   */
  readonly createdAt: Date;

  /**
   * The tag mutability setting for the repository.
   */
  readonly imageTagMutability: ImageTagMutability;

  /**
   * Image scanning configuration for the repository.
   */
  readonly imageScanningConfiguration: ImageScanningConfiguration;
}