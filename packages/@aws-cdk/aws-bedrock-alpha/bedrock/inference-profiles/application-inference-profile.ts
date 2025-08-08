import { Arn, ArnFormat, ValidationError } from 'aws-cdk-lib';
import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import { Grant, IGrantable } from 'aws-cdk-lib/aws-iam';
import { addConstructMetadata, MethodMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import { Construct } from 'constructs';
import { IInferenceProfile, InferenceProfileBase, InferenceProfileType } from './inference-profile';
import { IBedrockInvokable } from '../models';

/******************************************************************************
 *                        PROPS FOR NEW CONSTRUCT
 *****************************************************************************/
/**
 * Properties for creating an Application Inference Profile.
 */
export interface ApplicationInferenceProfileProps {
  /**
   * The name of the application inference profile.
   * This name will be used to identify the inference profile in the AWS console and APIs.
   * - Required:  Yes
   * - Maximum length: 64 characters
   * - Pattern: `^([0-9a-zA-Z:.][ _-]?)+$`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-bedrock-applicationinferenceprofile.html#cfn-bedrock-applicationinferenceprofile-inferenceprofilename
   */
  readonly applicationInferenceProfileName: string;

  /**
   * Description of the inference profile.
   * Provides additional context about the purpose and usage of this inference profile.
   *
   * - Maximum length: 200 characters when provided
   * - Pattern: `^([0-9a-zA-Z:.][ _-]?)+$`
   * @default - No description is provided
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-bedrock-applicationinferenceprofile.html#cfn-bedrock-applicationinferenceprofile-description
   */
  readonly description?: string;

  /**
   * The model source for this inference profile.
   *
   * To create an application inference profile for one Region, specify a foundation model.
   * Usage and costs for requests made to that Region with that model will be tracked.
   *
   * To create an application inference profile for multiple Regions,
   * specify a cross region (system-defined) inference profile.
   * The inference profile will route requests to the Regions defined in
   * the cross region (system-defined) inference profile that you choose.
   * Usage and costs for requests made to the Regions in the inference profile will be tracked.
   *
   */
  readonly modelSource: IBedrockInvokable;
  /**
   * A list of tags associated with the inference profile.
   * Tags help you organize and categorize your AWS resources.
   *
   * @default - No tags are applied
   */
  readonly tags?: { [key: string]: string };
}

/******************************************************************************
 *                      ATTRS FOR IMPORTED CONSTRUCT
 *****************************************************************************/
/**
 * Attributes for specifying an imported Application Inference Profile.
 */
export interface ApplicationInferenceProfileAttributes {
  /**
   * The ARN of the application inference profile.
   * @attribute
   */
  readonly inferenceProfileArn: string;

  /**
   * The ID or Amazon Resource Name (ARN) of the inference profile.
   * This can be either the profile ID or the full ARN.
   * @attribute
   */
  readonly inferenceProfileIdentifier: string;
}

/******************************************************************************
 *                        NEW CONSTRUCT DEFINITION
 *****************************************************************************/
/**
 * Class to create an Application Inference Profile with CDK.
 * These are inference profiles created by users (user defined).
 * This helps to track costs and model usage.
 *
 * Application inference profiles are user-defined profiles that help you track costs and model usage.
 * They can be created for a single region or for multiple regions using a cross-region inference profile.
 *
 * @cloudformationResource AWS::Bedrock::ApplicationInferenceProfile
 * @see https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles-create.html
 */
@propertyInjectable
export class ApplicationInferenceProfile extends InferenceProfileBase implements IBedrockInvokable {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-bedrock-alpha.ApplicationInferenceProfile';

  /**
   * Import an Application Inference Profile given its attributes.
   *
   * @param scope - The construct scope
   * @param id - Identifier of the construct
   * @param attrs - Attributes of the existing application inference profile
   * @returns An IInferenceProfile reference to the existing application inference profile
   */
  public static fromApplicationInferenceProfileAttributes(
    scope: Construct,
    id: string,
    attrs: ApplicationInferenceProfileAttributes,
  ): IInferenceProfile {
    class Import extends InferenceProfileBase {
      public readonly inferenceProfileArn = attrs.inferenceProfileArn;
      public readonly inferenceProfileId = Arn.split(attrs.inferenceProfileArn, ArnFormat.SLASH_RESOURCE_NAME)
        .resourceName!;
      public readonly type = InferenceProfileType.APPLICATION;

      public grantProfileUsage(grantee: IGrantable): Grant {
        return Grant.addToPrincipal({
          grantee: grantee,
          actions: ['bedrock:GetInferenceProfile', 'bedrock:InvokeModel'],
          resourceArns: [this.inferenceProfileArn],
          scope: this,
        });
      }
    }

    return new Import(scope, id);
  }

  /**
   * Import a low-level L1 Cfn Application Inference Profile.
   *
   * @param cfnApplicationInferenceProfile - The L1 CfnApplicationInferenceProfile to import
   * @returns An IInferenceProfile reference to the imported application inference profile
   */
  public static fromCfnApplicationInferenceProfile(
    cfnApplicationInferenceProfile: bedrock.CfnApplicationInferenceProfile,
  ): IInferenceProfile {
    // Singleton pattern that will prevent creating 2 or more Inference Profiles from the same L1
    const id = '@FromCfnApplicationInferenceProfile';
    const existing = cfnApplicationInferenceProfile.node.tryFindChild(id);
    if (existing) {
      return existing as unknown as IInferenceProfile;
    }

    return new (class extends InferenceProfileBase {
      public readonly inferenceProfileArn = cfnApplicationInferenceProfile.attrInferenceProfileArn;
      public readonly inferenceProfileId = cfnApplicationInferenceProfile.attrInferenceProfileId;
      public readonly type = InferenceProfileType.APPLICATION;

      public grantProfileUsage(grantee: IGrantable): Grant {
        return Grant.addToPrincipal({
          grantee: grantee,
          actions: ['bedrock:GetInferenceProfile', 'bedrock:InvokeModel'],
          resourceArns: [this.inferenceProfileArn],
          scope: this,
        });
      }
    })(cfnApplicationInferenceProfile, id);
  }

  // ------------------------------------------------------
  // Base attributes
  // ------------------------------------------------------
  /**
   * The name of the application inference profile.
   */
  public readonly inferenceProfileName: string;

  /**
   * The ARN of the application inference profile.
   * @attribute
   */
  public readonly inferenceProfileArn: string;

  /**
   * The unique identifier of the application inference profile.
   * @attribute
   */
  public readonly inferenceProfileId: string;

  /**
   * The underlying model/cross-region model used by the application inference profile.
   */
  public readonly inferenceProfileModel: IBedrockInvokable;

  /**
   * The status of the application inference profile. ACTIVE means that the inference profile is ready to be used.
   * @attribute
   */
  public readonly status: string;

  /**
   * The type of the inference profile. Always APPLICATION for application inference profiles.
   */
  public readonly type: InferenceProfileType;

  /**
   * Time Stamp for Application Inference Profile creation.
   * @attribute
   */
  public readonly createdAt: string;

  /**
   * Time Stamp for Application Inference Profile update.
   * @attribute
   */
  public readonly updatedAt: string;

  /**
   * The ARN used for invoking this inference profile.
   * This equals to the inferenceProfileArn property, useful for implementing IBedrockInvokable interface.
   */
  public readonly invokableArn: string;

  // ------------------------------------------------------
  // Internal Only
  // ------------------------------------------------------
  /**
   * Instance of CfnApplicationInferenceProfile.
   * @internal
   */
  private readonly __resource: bedrock.CfnApplicationInferenceProfile;

  // ------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------
  constructor(scope: Construct, id: string, props: ApplicationInferenceProfileProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // ------------------------------------------------------
    // Validate props
    // ------------------------------------------------------
    this.validateProps(props);

    // ------------------------------------------------------
    // Set properties
    // ------------------------------------------------------
    this.inferenceProfileModel = props.modelSource;
    this.type = InferenceProfileType.APPLICATION;

    // ------------------------------------------------------
    // L1 instantiation
    // ------------------------------------------------------
    this.__resource = new bedrock.CfnApplicationInferenceProfile(this, 'Resource', {
      description: props.description,
      inferenceProfileName: props.applicationInferenceProfileName,
      modelSource: {
        copyFrom: props.modelSource.invokableArn,
      },
      tags: props.tags ? Object.entries(props.tags).map(([key, value]) => ({ key, value })) : undefined,
    });

    // ------------------------------------------------------
    // Build attributes
    // ------------------------------------------------------
    this.inferenceProfileArn = this.__resource.attrInferenceProfileArn;
    this.inferenceProfileId = this.__resource.attrInferenceProfileId;
    this.inferenceProfileName = this.__resource.inferenceProfileName!;
    this.status = this.__resource.attrStatus;
    this.createdAt = this.__resource.attrCreatedAt;
    this.updatedAt = this.__resource.attrUpdatedAt;
    this.invokableArn = this.inferenceProfileArn;
  }

  // ------------------------------------------------------
  // METHODS
  // ------------------------------------------------------

  /**
   * Validates the properties for creating an Application Inference Profile.
   *
   * @param props - The properties to validate
   * @throws ValidationError if any validation fails
   */
  private validateProps(props: ApplicationInferenceProfileProps): void {
    // Validate applicationInferenceProfileName is provided and not empty
    if (!props.applicationInferenceProfileName || props.applicationInferenceProfileName.trim() === '') {
      throw new ValidationError('applicationInferenceProfileName is required and cannot be empty', this);
    }

    // Validate applicationInferenceProfileName length
    if (props.applicationInferenceProfileName.length > 64) {
      throw new ValidationError('applicationInferenceProfileName cannot exceed 64 characters', this);
    }

    // Validate applicationInferenceProfileName pattern
    const namePattern = /^([0-9a-zA-Z:.][ _-]?)+$/;
    if (!namePattern.test(props.applicationInferenceProfileName)) {
      throw new ValidationError(
        'applicationInferenceProfileName must match pattern ^([0-9a-zA-Z:.][ _-]?)+$',
        this,
      );
    }

    // Validate modelSource is provided
    if (!props.modelSource) {
      throw new ValidationError('modelSource is required', this);
    }

    // Validate description length if provided
    if (props.description !== undefined && props.description.length > 200) {
      throw new ValidationError('description cannot exceed 200 characters', this);
    }

    // Validate description pattern if provided
    if (props.description !== undefined && props.description !== '') {
      const descriptionPattern = /^([0-9a-zA-Z:.][ _-]?)+$/;
      if (!descriptionPattern.test(props.description)) {
        throw new ValidationError(
          'description must match pattern ^([0-9a-zA-Z:.][ _-]?)+$',
          this,
        );
      }
    }
  }

  /**
   * Gives the appropriate policies to invoke and use the application inference profile.
   * This method ensures the appropriate permissions are given to use either the inference profile
   * or the underlying foundation model/cross-region profile.
   *
   * @param grantee - The IAM principal to grant permissions to
   * @returns An IAM Grant object representing the granted permissions
   */
  @MethodMetadata()
  public grantInvoke(grantee: IGrantable): Grant {
    // This method ensures the appropriate permissions are given
    // to use either the inference profile or the vanilla foundation model
    this.inferenceProfileModel.grantInvoke(grantee);

    // Plus we add permissions to now invoke the application inference profile itself
    return this.grantProfileUsage(grantee);
  }

  /**
   * Grants appropriate permissions to use the application inference profile (AIP).
   * This method adds the necessary IAM permissions to allow the grantee to:
   * - Get inference profile details (bedrock:GetInferenceProfile)
   * - Invoke the model through the inference profile (bedrock:InvokeModel)
   *
   * Note: This does not grant permissions to use the underlying model/cross-region profile in the AIP.
   * For comprehensive permissions, use grantInvoke() instead.
   *
   * @param grantee - The IAM principal to grant permissions to
   * @returns An IAM Grant object representing the granted permissions
   */
  @MethodMetadata()
  public grantProfileUsage(grantee: IGrantable): Grant {
    return Grant.addToPrincipal({
      grantee: grantee,
      actions: ['bedrock:GetInferenceProfile', 'bedrock:InvokeModel'],
      resourceArns: [this.inferenceProfileArn],
      scope: this,
    });
  }
}
