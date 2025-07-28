import { Resource } from 'aws-cdk-lib';
import { Grant, IGrantable } from 'aws-cdk-lib/aws-iam';

/**
 * These are the values used by the API when using aws bedrock get-inference-profile --inference-profile-identifier XXXXXXX
 */
export enum InferenceProfileType {
  /**
   * An inference profile that is created by AWS. These are profiles such as cross-region
   * which help you distribute traffic across a geographic region.
   */
  SYSTEM_DEFINED = 'SYSTEM_DEFINED',
  /**
   * An inference profile that is user-created. These are profiles that help
   * you track costs or metrics.
   */
  APPLICATION = 'APPLICATION',
}

/******************************************************************************
 *                              COMMON
 *****************************************************************************/
/**
 * Represents an Inference Profile, either created with CDK or imported.
 */
export interface IInferenceProfile {
  /**
   * The ARN of the inference profile.
   * @attribute
   */
  readonly inferenceProfileArn: string;
  /**
   * The unique identifier of the inference profile.
   * @attribute
   */
  readonly inferenceProfileId: string;
  /**
   * The type of inference profile.
   */
  readonly type: InferenceProfileType;

  /**
   * Grants appropriate permissions to use the inference profile.
   * Each profile type requires different permissions based on its usage pattern.
   *
   * @param grantee - The IAM principal to grant permissions to
   * @returns An IAM Grant object representing the granted permissions
   */
  grantProfileUsage(grantee: IGrantable): Grant;
}

/**
 * Abstract base class for an Inference Profile.
 * Contains methods and attributes valid for Inference Profiles either created with CDK or imported.
 */
export abstract class InferenceProfileBase extends Resource implements IInferenceProfile {
  /**
   * The ARN of the inference profile.
   * @attribute
   */
  public abstract readonly inferenceProfileArn: string;
  /**
   * The unique identifier of the inference profile.
   * @attribute
   */
  public abstract readonly inferenceProfileId: string;
  /**
   * The type of inference profile (SYSTEM_DEFINED or APPLICATION).
   */
  public abstract readonly type: InferenceProfileType;

  /**
   * Grants appropriate permissions to use the inference profile.
   * Each profile type requires different permissions based on its usage pattern:
   * - Application profiles need bedrock:InvokeModel for direct invocation
   * - Cross-region profiles need bedrock:InvokeModel* for routing capabilities
   *
   * Note: This does not grant permissions to use the underlying model in the profile.
   * For comprehensive model invocation permissions, use the grantInvoke method instead.
   *
   * @param grantee - The IAM principal to grant permissions to
   * @returns An IAM Grant object representing the granted permissions
   */
  public abstract grantProfileUsage(grantee: IGrantable): Grant;
}
