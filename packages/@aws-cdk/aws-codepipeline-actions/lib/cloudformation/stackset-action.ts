import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Action } from '../action';
import { parseCapabilities, SingletonPolicy } from './_singleton-policy';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * Properties for the CloudFormationStackSetAction
 */
export interface CloudFormationStackSetActionProps extends codepipeline.CommonAwsActionProps {
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
  readonly templatePath: codepipeline.ArtifactPath;

  /**
   * A description of the stack set. You can use this to describe the stack set’s purpose or other relevant information.
   *
   * @default - No description
   */
  readonly description?: string;

  /**
   * Specify where to create or update Stack Instances
   *
   * You can specify either AWS Accounts Ids or AWS Organizations Organizational Units.
   *
   * @default - Don't create or update any Stack Instances
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
   * @default - No parameters will be used.
   */
  readonly parameters?: StackSetParameters;

  /**
   * Indicates that the template can create and update resources, depending on the types of resources in the template.
   *
   * You must use this property if you have IAM resources in your stack template or you create a stack directly from a template containing macros.
   *
   * @default - The StackSet will have no IAM capabilities.
   */
  readonly cfnCapabilities?: cdk.CfnCapabilities[];

  /**
   * The percentage of accounts per Region for which this stack operation can fail before AWS CloudFormation stops the operation in that Region. If
   * the operation is stopped in a Region, AWS CloudFormation doesn't attempt the operation in subsequent Regions. When calculating the number
   * of accounts based on the specified percentage, AWS CloudFormation rounds down to the next whole number.
   *
   * @default 0
   */
  readonly failureTolerancePercentage?: number;

  /**
   * The maximum percentage of accounts in which to perform this operation at one time. When calculating the number of accounts based on the specified
   * percentage, AWS CloudFormation rounds down to the next whole number. If rounding down would result in zero, AWS CloudFormation sets the number as
   * one instead. Although you use this setting to specify the maximum, for large deployments the actual number of accounts acted upon concurrently
   * may be lower due to service throttling.
   *
   * @default 1
   */
  readonly maxConcurrentPercentage?: number;

  /**
   * The AWS region the given Action resides in.
   * Note that a cross-region Pipeline requires replication buckets to function correctly.
   * You can provide their names with the {@link PipelineProps#crossRegionReplicationBuckets} property.
   * If you don't, the CodePipeline Construct will create new Stacks in your CDK app containing those buckets,
   * that you will need to `cdk deploy` before deploying the main, Pipeline-containing Stack.
   *
   * @default - the Action resides in the same region as the Pipeline
   */
  readonly region?: string;
}

/**
 * Where Stack Instances will be created from the StackSet
 */
export abstract class StackInstances {
  /**
   * Create stack instances in a literal set of accounts or organizational units, and a set of regions
   *
   * Stack Instances will be created in every combination of region and account, or region and
   * Organizational Units (OUs).
   *
   * If this is set of Organizational Units, you must have selected `StackSetDeploymentModel.organizations()`
   * as deployment model.
   */
  public static fromList(targets: string[], regions: string[]): StackInstances {
    if (targets.length === 0) {
      throw new Error("'targets' may not be an empty list");
    }

    if (regions.length === 0) {
      throw new Error("'regions' may not be an empty list");
    }

    return new class extends StackInstances {
      public bind(_scope: Construct): StackInstancesBindResult {
        return {
          stackSetConfiguration: {
            DeploymentTargets: targets.join(','),
            Regions: regions.join(','),
          },
        };
      }
    }();
  }

  /**
   * Create stack instances in a set of accounts or organizational units taken from the pipeline artifacts, and a set of regions
   *
   * Stack Instances will be created in every combination of region and account, or region and
   * Organizational Units (OUs).
   *
   * If this is set of Organizational Units, you must have selected `StackSetDeploymentModel.organizations()`
   * as deployment model.
   */
  public static fromArtifact(artifactPath: codepipeline.ArtifactPath, regions: string[]): StackInstances {
    if (regions.length === 0) {
      throw new Error("'regions' may not be an empty list");
    }

    return new class extends StackInstances {
      public readonly artifactsReferenced?: codepipeline.Artifact[] | undefined = [artifactPath.artifact];
      public bind(_scope: Construct): StackInstancesBindResult {
        return {
          stackSetConfiguration: {
            DeploymentTargets: artifactPath.location,
            Regions: regions.join(','),
          },
        };
      }
    }();
  }

  /**
   * The artifacts referenced by the properties of this deployment target
   *
   * Does not need to be called by app builders.
   */
  readonly artifactsReferenced?: codepipeline.Artifact[];

  /**
   * Called to attach the stack set instances to a stackset action
   *
   * Does not need to be called by app builders.
   */
  public abstract bind(scope: Construct): StackInstancesBindResult;
}

/**
 * Returned by the StackInstances.bind() function
 *
 * Does not need to be used by app builders.
 */
export interface StackInstancesBindResult {
  /**
   * Properties to mix into the Action configuration
   */
  readonly stackSetConfiguration: any;
}

/**
 * Properties for deploying to all accounts in a set of OUs
 */
export interface OrganizationTargetsProps {
  /**
   * A list of organizational unit IDs selecting accounts where stack set instances should be created/updated.
   *
   * StackSets will be created in all accounts that are in any of the OUs in this list.
   *
   * If you specify a list of OUs (using either `organizationalUnits` or `organizationalUnitsFromArtifact`)
   * you must also specify at least one region using `regions`.
   *
   * @default - At most one of `organizationalUnits` and `organizationalUnitsFromArtifact` should be specified
   */
  readonly organizationalUnits?: string[];

  /**
   * A JSON artifact with a list of organizational unit IDs selecting accounts where stack set instances should be created/updated.
   *
   * StackSets will be created in all accounts that are in any of the OUs in this list.
   *
   * If you specify a list of OUs (using either `organizationalUnits` or `organizationalUnitsFromArtifact`)
   * you must also specify at least one region using `regions`.
   *
   * @default - At most one of `organizationalUnits` and `organizationalUnitsFromArtifact` should be specified
   */
  readonly organizationalUnitsFromArtifact?: codepipeline.ArtifactPath;

  /**
   * A list of AWS Regions where stack set instances are created or updated.
   *
   * Stack instances will be created or updated in all regions in all accounts.
   *
   * Regions are updated in the order in which they are entered.
   */
  readonly regions?: string[];

}

/**
 * Properties for deploying to a set of accounts
 */
export interface AccountTargetsProps {
  /**
   * A list of AWS accounts where stack set instances should be created/updated.
   *
   * If you specify a list of accounts (using either `accounts` or `accountsFromArtifact`)
   * you must also specify at least one region using `regions`.
   *
   * @default - At most one of `accounts` and `accountsFromArtifact` should be specified
   */
  readonly accounts?: string[];

  /**
   * A JSON artifact with a list of AWS accounts where stack set instances should be created/updated.
   *
   * If you specify a list of accounts (using either `accounts` or `accountsFromArtifact`)
   * you must also specify at least one region using `regions`.
   *
   * @default - At most one of `accounts` and `accountsFromArtifact` should be specified
   */
  readonly accountsFromArtifact?: codepipeline.ArtifactPath;

  /**
   * A list of AWS Regions where stack set instances are created or updated.
   *
   * Stack instances will be created or updated in all regions in all accounts.
   *
   * Regions are updated in the order in which they are entered.
   */
  readonly regions?: string[];
}

/**
 * Describes whether AWS CloudFormation StackSets automatically deploys to AWS Organizations accounts that are added to a target organization or
 * organizational unit (OU).
 */
export enum StackSetOrganizationsAutoDeployment {
  /**
   * StackSets automatically deploys additional stack instances to AWS Organizations accounts that are added to a target organization or
   * organizational unit (OU) in the specified Regions. If an account is removed from a target organization or OU, AWS CloudFormation StackSets
   * deletes stack instances from the account in the specified Regions.
   */
  ENABLED = 'Enabled',

  /**
   * StackSets does not automatically deploy additional stack instances to AWS Organizations accounts that are added to a target organization or
   * organizational unit (OU) in the specified Regions.
   */
  DISABLED = 'Disabled',

  /**
   * Stack resources are retained when an account is removed from a target organization or OU.
   */
  ENABLED_WITH_STACK_RETENTION = 'EnabledWithStackRetention'
}

/**
 * Base parameters for the StackSet
 */
export abstract class StackSetParameters {
  /**
   * A list of template parameters for your stack set.
   *
   * You must specify all template parameters. Parameters you don't specify will revert
   * to their `Default` values as specified in the template.
   *
   * Specify the names of parameters you want to retain their existing values,
   * without specifying what those values are, in an array in the second
   * argument to this function. Use of this feature is discouraged. CDK is for
   * specifying desired-state infrastructure, and use of this feature makes the
   * parameter values unmanaged.
   *
   * @example
   *
   * const parameters = cpactions.StackSetParameters.fromLiteral({
   *  BucketName: 'my-bucket',
   *  Asset1: 'true',
   * });
   */
  public static fromLiteral(parameters: Record<string, string>, usePreviousValues?: string[]): StackSetParameters {
    return new class extends StackSetParameters {
      public readonly artifactsReferenced: codepipeline.Artifact[] = [];

      render(): string {
        return [
          ...Object.entries(parameters).map(([key, value]) =>
            `ParameterKey=${key},ParameterValue=${value}`),
          ...(usePreviousValues ?? []).map((key) =>
            `ParameterKey=${key},UsePreviousValue=true`),
        ].join(' ');
      }
    }();
  }

  /**
   * Read the parameters from a JSON file from one of the pipeline's artifacts
   *
   * The file needs to contain a list of `{ ParameterKey, ParameterValue, UsePreviousValue }` objects, like
   * this:
   *
   * ```
   * [
   *     {
   *         "ParameterKey": "BucketName",
   *         "ParameterValue": "my-bucket"
   *     },
   *     {
   *         "ParameterKey": "Asset1",
   *         "ParameterValue": "true"
   *     },
   *     {
   *         "ParameterKey": "Asset2",
   *         "UsePreviousValue": true
   *     }
   * ]
   * ```
   *
   * You must specify all template parameters. Parameters you don't specify will revert
   * to their `Default` values as specified in the template.
   *
   * For of parameters you want to retain their existing values
   * without specifying what those values are, set `UsePreviousValue: true`.
   * Use of this feature is discouraged. CDK is for
   * specifying desired-state infrastructure, and use of this feature makes the
   * parameter values unmanaged.
   */
  public static fromArtifactPath(artifactPath: codepipeline.ArtifactPath): StackSetParameters {
    return new class extends StackSetParameters {
      public artifactsReferenced: codepipeline.Artifact[] = [artifactPath.artifact];

      public render(): string {
        return artifactPath.location;
      }
    }();
  }

  /**
   * Artifacts referenced by this parameter set
   */
  public abstract readonly artifactsReferenced: codepipeline.Artifact[];

  /**
   * Converts Parameters to a string.
   */
  public abstract render(): string;
}

/**
 * Determines how IAM roles are created and managed.
 */
export abstract class StackSetDeploymentModel {
  /**
   * Deploy to AWS Organizations accounts.
   *
   * AWS CloudFormation StackSets automatically creates the IAM roles required
   * to deploy to accounts managed by AWS Organizations. This requires an
   * account to be a member of an Organization.
   *
   * Using this deployment model, you can specify either AWS Account Ids or
   * Organization Unit Ids in the `stackInstances` parameter.
   */
  public static organizations(props: OrganizationsDeploymentProps = {}): StackSetDeploymentModel {
    return new class extends StackSetDeploymentModel {
      bind() {
        return {
          stackSetConfiguration: {
            PermissionModel: 'SERVICE_MANAGED',
            OrganizationsAutoDeployment: props.autoDeployment,
          },
        };
      }
    }();
  }

  /**
   * Deploy to AWS Accounts not managed by AWS Organizations
   *
   * You are responsible for creating Execution Roles in every account you will
   * be deploying to in advance to create the actual stack instances. Unless you
   * specify overrides, StackSets expects the execution roles you create to have
   * the default name `AWSCloudFormationStackSetExecutionRole`. See the [Grant
   * self-managed
   * permissions](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs-self-managed.html)
   * section of the CloudFormation documentation.
   *
   * The CDK will automatically create the central Administration Role in the
   * Pipeline account which will be used to assume the Execution Role in each of
   * the target accounts.
   *
   * If you wish to use a pre-created Administration Role, use `Role.fromRoleName()`
   * or `Role.fromRoleArn()` to import it, and pass it to this function:
   *
   * ```ts
   * const existingAdminRole = iam.Role.fromRoleName(this, 'AdminRole', 'AWSCloudFormationStackSetAdministrationRole');
   *
   * const deploymentModel = cpactions.StackSetDeploymentModel.selfManaged({
   *   // Use an existing Role. Leave this out to create a new Role.
   *   administrationRole: existingAdminRole,
   * });
   * ```
   *
   * Using this deployment model, you can only specify AWS Account Ids in the
   * `stackInstances` parameter.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs-self-managed.html
   */
  public static selfManaged(props: SelfManagedDeploymentProps = {}): StackSetDeploymentModel {
    return new class extends StackSetDeploymentModel {
      bind(scope: Construct) {
        let administrationRole = props.administrationRole;
        if (!administrationRole) {
          administrationRole = new iam.Role(scope, 'StackSetAdministrationRole', {
            assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com', {
              conditions: {
                // Confused deputy protection
                StringLike: {
                  'aws:SourceArn': `arn:${cdk.Aws.PARTITION}:cloudformation:*:${cdk.Aws.ACCOUNT_ID}:stackset/*`,
                },
              },
            }),
          });
          administrationRole.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['sts:AssumeRole'],
            resources: [`arn:${cdk.Aws.PARTITION}:iam::*:role/${props.executionRoleName ?? 'AWSCloudFormationStackSetExecutionRole'}`],
          }));
        }

        return {
          stackSetConfiguration: {
            PermissionModel: 'SELF_MANAGED',
            AdministrationRoleArn: administrationRole.roleArn,
            ExecutionRoleName: props.executionRoleName,
          },
          passedRoles: [administrationRole],
        } as StackSetDeploymentModelBindResult;
      }
    }();
  }

  /**
   * Bind to the Stack Set action and return the Action configuration
   *
   * Does not need to be called by app builders.
   */
  public abstract bind(scope: Construct): StackSetDeploymentModelBindResult;
}

/**
 * Returned by the StackSetDeploymentModel.bind() function
 *
 * Does not need to be used by app builders.
 */
export interface StackSetDeploymentModelBindResult {
  /**
   * Properties to mix into the Action configuration
   */
  readonly stackSetConfiguration: any;

  /**
   * Roles that need to be passed by the pipeline action
   *
   * @default - No roles
   */
  readonly passedRoles?: iam.IRole[];
}

/**
 * Properties for configuring service-managed (Organizations) permissions
 */
export interface OrganizationsDeploymentProps {
  /**
   * Automatically deploy to new accounts added to Organizational Units
   *
   * Whether AWS CloudFormation StackSets automatically deploys to AWS
   * Organizations accounts that are added to a target organization or
   * organizational unit (OU).
   *
   * @default Disabled
   */
  readonly autoDeployment?: StackSetOrganizationsAutoDeployment;
}

/**
 * Properties for configuring self-managed permissions
 */
export interface SelfManagedDeploymentProps {
  /**
   * The IAM role in the administrator account used to assume execution roles in the target accounts
   *
   * You must create this role before using the StackSet action.
   *
   * The role needs to be assumable by CloudFormation, and it needs to be able
   * to `sts:AssumeRole` each of the execution roles (whose names are specified
   * in the `executionRoleName` parameter) in each of the target accounts.
   *
   * If you do not specify the role, we assume you have created a role named
   * `AWSCloudFormationStackSetAdministrationRole`.
   *
   * @default - Assume an existing role named `AWSCloudFormationStackSetAdministrationRole` in the same account as the pipeline.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs-self-managed.html
   */
  readonly administrationRole?: iam.IRole;

  /**
   * The name of the IAM role in the target accounts used to perform stack set operations.
   *
   * You must create these roles in each of the target accounts before using the
   * StackSet action.
   *
   * The roles need to be assumable by by the `administrationRole`, and need to
   * have the permissions necessary to successfully create and modify the
   * resources that the subsequent CloudFormation deployments need.
   * Administrator permissions would be commonly granted to these, but if you can
   * scope the permissions down frome there you would be safer.
   *
   * @default AWSCloudFormationStackSetExecutionRole
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacksets-prereqs-self-managed.html
   */
  readonly executionRoleName?: string;
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
export class CloudFormationStackSetAction extends Action {
  private readonly props: CloudFormationStackSetActionProps;
  private readonly deploymentModel: StackSetDeploymentModel;

  constructor(props: CloudFormationStackSetActionProps) {
    super({
      ...props,
      provider: 'CloudFormationStackSet',
      category: codepipeline.ActionCategory.DEPLOY,
      artifactBounds: {
        minInputs: 1,
        maxInputs: 3,
        minOutputs: 0,
        maxOutputs: 0,
      },
      inputs: [
        props.templatePath.artifact,
        ...props.parameters?.artifactsReferenced ?? [],
        ...props.stackInstances?.artifactsReferenced ?? [],
      ],
    });

    this.props = props;
    this.deploymentModel = props.deploymentModel ?? StackSetDeploymentModel.selfManaged();
  }

  protected bound(scope: CoreConstruct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig {
    const singletonPolicy = SingletonPolicy.forRole(options.role);
    singletonPolicy.grantCreateUpdateStackSet(this.props);

    const instancesResult = this.props.stackInstances?.bind(scope);
    const permissionModelBind = this.deploymentModel?.bind(scope);

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
        TemplatePath: this.props.templatePath.location,
        Parameters: this.props.parameters?.render(),
        Capabilities: parseCapabilities(this.props.cfnCapabilities),
        FailureTolerancePercentage: this.props.failureTolerancePercentage,
        MaxConcurrentPercentage: this.props.maxConcurrentPercentage,
        ...instancesResult?.stackSetConfiguration,
        ...permissionModelBind?.stackSetConfiguration,
      },
    };
  }
}

/**
 * Properties for the CloudFormationStackInstancesAction
 */
export interface CloudFormationStackInstancesActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * The AWS region the given Action resides in.
   * Note that a cross-region Pipeline requires replication buckets to function correctly.
   * You can provide their names with the {@link PipelineProps#crossRegionReplicationBuckets} property.
   * If you don't, the CodePipeline Construct will create new Stacks in your CDK app containing those buckets,
   * that you will need to `cdk deploy` before deploying the main, Pipeline-containing Stack.
   *
   * @default - the Action resides in the same region as the Pipeline
   */
  readonly region?: string;

  /**
   * The name of the StackSet we are adding instances to
   */
  readonly stackSetName: string;

  /**
   * Specify where to create or update Stack Instances
   *
   * You can specify either AWS Accounts Ids or AWS Organizations Organizational Units.
   */
  readonly stackInstances: StackInstances;

  /**
   * Parameter values that only apply to the current Stack Instances
   *
   * These parameters are shared between all instances added by this action.
   *
   * @default - No parameters will be overridden.
   */
  readonly parameterOverrides?: StackSetParameters;

  /**
   * The percentage of accounts per Region for which this stack operation can fail before AWS CloudFormation stops the operation in that Region. If
   * the operation is stopped in a Region, AWS CloudFormation doesn't attempt the operation in subsequent Regions. When calculating the number
   * of accounts based on the specified percentage, AWS CloudFormation rounds down to the next whole number.
   *
   * @default 0
   */
  readonly failureTolerancePercentage?: number;

  /**
   * The maximum percentage of accounts in which to perform this operation at one time. When calculating the number of accounts based on the specified
   * percentage, AWS CloudFormation rounds down to the next whole number. If rounding down would result in zero, AWS CloudFormation sets the number as
   * one instead. Although you use this setting to specify the maximum, for large deployments the actual number of accounts acted upon concurrently
   * may be lower due to service throttling.
   *
   * @default 1
   */
  readonly maxConcurrentPercentage?: number;
}

/**
 * CodePipeline action to create/update Stack Instances of a StackSet
 *
 * After the initial creation of a stack set, you can add new stack instances by
 * using CloudFormationStackInstances. Template parameter values can be
 * overridden at the stack instance level during create or update stack set
 * instance operations.
 *
 * Each stack set has one template and set of template parameters. When you
 * update the template or template parameters, you update them for the entire
 * set. Then all instance statuses are set to OUTDATED until the changes are
 * deployed to that instance.
 */
export class CloudFormationStackInstancesAction extends Action {
  private readonly props: CloudFormationStackInstancesActionProps;

  constructor(props: CloudFormationStackInstancesActionProps) {
    super({
      ...props,
      provider: 'CloudFormationStackInstances',
      category: codepipeline.ActionCategory.DEPLOY,
      artifactBounds: {
        minInputs: 0,
        maxInputs: 3,
        minOutputs: 0,
        maxOutputs: 0,
      },
      inputs: [
        ...props.parameterOverrides?.artifactsReferenced ?? [],
        ...props.stackInstances?.artifactsReferenced ?? [],
      ],
    });

    this.props = props;
  }

  protected bound(scope: CoreConstruct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig {
    const singletonPolicy = SingletonPolicy.forRole(options.role);
    singletonPolicy.grantCreateUpdateStackSet(this.props);

    const instancesResult = this.props.stackInstances?.bind(scope);

    if ((this.actionProperties.inputs || []).length > 0) {
      options.bucket.grantRead(singletonPolicy);
    }

    return {
      configuration: {
        StackSetName: this.props.stackSetName,
        ParameterOverrides: this.props.parameterOverrides?.render(),
        FailureTolerancePercentage: this.props.failureTolerancePercentage,
        MaxConcurrentPercentage: this.props.maxConcurrentPercentage,
        ...instancesResult?.stackSetConfiguration,
      },
    };
  }
}