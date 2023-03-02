import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { parseCapabilities, SingletonPolicy } from './private/singleton-policy';
import { CommonCloudFormationStackSetOptions, StackInstances, StackSetDeploymentModel, StackSetParameters, StackSetTemplate } from './stackset-types';
import { Action } from '../action';
import { validatePercentage } from '../common';

/**
 * Properties for the CloudFormationDeployStackSetAction
 */
export interface CloudFormationDeployStackSetActionProps extends codepipeline.CommonAwsActionProps, CommonCloudFormationStackSetOptions {
  /**
   * The name to associate with the stack set. This name must be unique in the Region where it is created.
   *
   * The name may only contain alphanumeric and hyphen characters. It must begin with an alphabetic character and be 128 characters or fewer.
   */
  readonly stackSetName: string;

  /**
   * The location of the template that defines the resources in the stack set.
   * This must point to a template with a maximum size of 460,800 bytes.
   *
   * Enter the path to the source artifact name and template file.
   */
  readonly template: StackSetTemplate;

  /**
   * A description of the stack set. You can use this to describe the stack set’s purpose or other relevant information.
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * Specify where to create or update Stack Instances
   *
   * You can specify either AWS Accounts Ids or AWS Organizations Organizational Units.
   *
   * @default - don't create or update any Stack Instances
   */
  readonly stackInstances?: StackInstances;

  /**
   * Determines how IAM roles are created and managed.
   *
   * The choices are:
   *
   * - Self Managed: you create IAM roles with the required permissions
   *   in the administration account and all target accounts.
   * - Service Managed: only available if the account and target accounts
   *   are part of an AWS Organization. The necessary roles will be created
   *   for you.
   *
   * If you want to deploy to all accounts that are a member of AWS
   * Organizations Organizational Units (OUs), you must select Service Managed
   * permissions.
   *
   * Note: This parameter can only be changed when no stack instances exist in
   * the stack set.
   *
   * @default StackSetDeploymentModel.selfManaged()
   */
  readonly deploymentModel?: StackSetDeploymentModel;

  /**
   * The template parameters for your stack set
   *
   * These parameters are shared between all instances of the stack set.
   *
   * @default - no parameters will be used
   */
  readonly parameters?: StackSetParameters;

  /**
   * Indicates that the template can create and update resources, depending on the types of resources in the template.
   *
   * You must use this property if you have IAM resources in your stack template or you create a stack directly from a template containing macros.
   *
   * @default - the StackSet will have no IAM capabilities
   */
  readonly cfnCapabilities?: cdk.CfnCapabilities[];
}

/**
 * CodePipeline action to deploy a stackset.
 *
 * CodePipeline offers the ability to perform AWS CloudFormation StackSets
 * operations as part of your CI/CD process. You use a stack set to create
 * stacks in AWS accounts across AWS Regions by using a single AWS
 * CloudFormation template. All the resources included in each stack are defined
 * by the stack set’s AWS CloudFormation template. When you create the stack
 * set, you specify the template to use, as well as any parameters and
 * capabilities that the template requires.
 *
 * For more information about concepts for AWS CloudFormation StackSets, see
 * [StackSets
 * concepts](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-concepts.html)
 * in the AWS CloudFormation User Guide.
 *
 * If you use this action to make an update that includes adding stack
 * instances, the new instances are deployed first and the update is completed
 * last. The new instances first receive the old version, and then the update is
 * applied to all instances.
 *
 * As a best practice, you should construct your pipeline so that the stack set
 * is created and initially deploys to a subset or a single instance. After you
 * test your deployment and view the generated stack set, then add the
 * CloudFormationStackInstances action so that the remaining instances are
 * created and updated.
 */
export class CloudFormationDeployStackSetAction extends Action {
  private readonly props: CloudFormationDeployStackSetActionProps;
  private readonly deploymentModel: StackSetDeploymentModel;

  constructor(props: CloudFormationDeployStackSetActionProps) {
    super({
      ...props,
      region: props.stackSetRegion,
      provider: 'CloudFormationStackSet',
      category: codepipeline.ActionCategory.DEPLOY,
      artifactBounds: {
        minInputs: 1,
        maxInputs: 3,
        minOutputs: 0,
        maxOutputs: 0,
      },
      inputs: [
        ...props.template._artifactsReferenced ?? [],
        ...props.parameters?._artifactsReferenced ?? [],
        ...props.stackInstances?._artifactsReferenced ?? [],
      ],
    });

    this.props = props;
    this.deploymentModel = props.deploymentModel ?? StackSetDeploymentModel.selfManaged();

    validatePercentage('failureTolerancePercentage', props.failureTolerancePercentage);
    validatePercentage('maxAccountConcurrencyPercentage', props.maxAccountConcurrencyPercentage);
  }

  protected bound(scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig {
    const singletonPolicy = SingletonPolicy.forRole(options.role);
    singletonPolicy.grantCreateUpdateStackSet(this.props);

    const instancesResult = this.props.stackInstances?._bind(scope);
    const permissionModelBind = this.deploymentModel?._bind(scope);

    for (const role of permissionModelBind?.passedRoles ?? []) {
      singletonPolicy.grantPassRole(role);
    }

    if ((this.actionProperties.inputs || []).length > 0) {
      options.bucket.grantRead(singletonPolicy);
    }

    return {
      configuration: {
        StackSetName: this.props.stackSetName,
        Description: this.props.description,
        TemplatePath: this.props.template._render(),
        Parameters: this.props.parameters?._render(),
        Capabilities: parseCapabilities(this.props.cfnCapabilities),
        FailureTolerancePercentage: this.props.failureTolerancePercentage,
        MaxConcurrentPercentage: this.props.maxAccountConcurrencyPercentage,
        ...instancesResult?.stackSetConfiguration,
        ...permissionModelBind?.stackSetConfiguration,
      },
    };
  }
}
