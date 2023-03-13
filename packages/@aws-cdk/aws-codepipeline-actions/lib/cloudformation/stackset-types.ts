import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';

/**
 * Options in common between both StackSet actions
 */
export interface CommonCloudFormationStackSetOptions {

  /**
   * The percentage of accounts per Region for which this stack operation can fail before AWS CloudFormation stops the operation in that Region. If
   * the operation is stopped in a Region, AWS CloudFormation doesn't attempt the operation in subsequent Regions. When calculating the number
   * of accounts based on the specified percentage, AWS CloudFormation rounds down to the next whole number.
   *
   * @default 0%
   */
  readonly failureTolerancePercentage?: number;

  /**
   * The maximum percentage of accounts in which to perform this operation at one time. When calculating the number of accounts based on the specified
   * percentage, AWS CloudFormation rounds down to the next whole number. If rounding down would result in zero, AWS CloudFormation sets the number as
   * one instead. Although you use this setting to specify the maximum, for large deployments the actual number of accounts acted upon concurrently
   * may be lower due to service throttling.
   *
   * @default 1%
   */
  readonly maxAccountConcurrencyPercentage?: number;

  /**
   * The AWS Region the StackSet is in.
   *
   * Note that a cross-region Pipeline requires replication buckets to function correctly.
   * You can provide their names with the `PipelineProps.crossRegionReplicationBuckets` property.
   * If you don't, the CodePipeline Construct will create new Stacks in your CDK app containing those buckets,
   * that you will need to `cdk deploy` before deploying the main, Pipeline-containing Stack.
   *
   * @default - same region as the Pipeline
   */
  readonly stackSetRegion?: string;
}

/**
 * The source of a StackSet template
 */
export abstract class StackSetTemplate {
  /**
   * Use a file in an artifact as Stack Template.
   */
  public static fromArtifactPath(artifactPath: codepipeline.ArtifactPath): StackSetTemplate {
    return new class extends StackSetTemplate {
      public readonly _artifactsReferenced?: codepipeline.Artifact[] | undefined = [artifactPath.artifact];

      public _render() {
        return artifactPath.location;
      }
    }();
  }

  /**
   * Which artifacts are referenced by this template
   *
   * Does not need to be called by app builders.
   *
   * @internal
   */
  public abstract readonly _artifactsReferenced?: codepipeline.Artifact[] | undefined;

  /**
   * Render the template to the pipeline
   *
   * Does not need to be called by app builders.
   *
   * @internal
   */
  public abstract _render(): any;
}

/**
 * Where Stack Instances will be created from the StackSet
 */
export abstract class StackInstances {
  /**
   * Create stack instances in a set of accounts and regions passed as literal lists
   *
   * Stack Instances will be created in every combination of region and account.
   *
   * > NOTE: `StackInstances.inAccounts()` and `StackInstances.inOrganizationalUnits()`
   * > have exactly the same behavior, and you can use them interchangeably if you want.
   * > The only difference between them is that your code clearly indicates what entity
   * > it's working with.
   */
  public static inAccounts(accounts: string[], regions: string[]): StackInstances {
    return StackInstances.fromList(accounts, regions);
  }

  /**
   * Create stack instances in all accounts in a set of Organizational Units (OUs) and regions passed as literal lists
   *
   * If you want to deploy to Organization Units, you must choose have created the StackSet
   * with `deploymentModel: DeploymentModel.organizations()`.
   *
   * Stack Instances will be created in every combination of region and account.
   *
   * > NOTE: `StackInstances.inAccounts()` and `StackInstances.inOrganizationalUnits()`
   * > have exactly the same behavior, and you can use them interchangeably if you want.
   * > The only difference between them is that your code clearly indicates what entity
   * > it's working with.
   */
  public static inOrganizationalUnits(ous: string[], regions: string[]): StackInstances {
    return StackInstances.fromList(ous, regions);
  }

  /**
   * Create stack instances in a set of accounts or organizational units taken from the pipeline artifacts, and a set of regions
   *
   * The file must be a JSON file containing a list of strings. For example:
   *
   * ```json
   * [
   *   "111111111111",
   *   "222222222222",
   *   "333333333333"
   * ]
   * ```
   *
   * Stack Instances will be created in every combination of region and account, or region and
   * Organizational Units (OUs).
   *
   * If this is set of Organizational Units, you must have selected `StackSetDeploymentModel.organizations()`
   * as deployment model.
   */
  public static fromArtifactPath(artifactPath: codepipeline.ArtifactPath, regions: string[]): StackInstances {
    if (regions.length === 0) {
      throw new Error("'regions' may not be an empty list");
    }

    return new class extends StackInstances {
      public readonly _artifactsReferenced?: codepipeline.Artifact[] | undefined = [artifactPath.artifact];
      public _bind(_scope: Construct): StackInstancesBindResult {
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
   * Create stack instances in a literal set of accounts or organizational units, and a set of regions
   *
   * Stack Instances will be created in every combination of region and account, or region and
   * Organizational Units (OUs).
   *
   * If this is set of Organizational Units, you must have selected `StackSetDeploymentModel.organizations()`
   * as deployment model.
   */
  private static fromList(targets: string[], regions: string[]): StackInstances {
    if (targets.length === 0) {
      throw new Error("'targets' may not be an empty list");
    }

    if (regions.length === 0) {
      throw new Error("'regions' may not be an empty list");
    }

    return new class extends StackInstances {
      public _bind(_scope: Construct): StackInstancesBindResult {
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
   * The artifacts referenced by the properties of this deployment target
   *
   * Does not need to be called by app builders.
   *
   * @internal
   */
  readonly _artifactsReferenced?: codepipeline.Artifact[];

  /**
   * Called to attach the stack set instances to a stackset action
   *
   * Does not need to be called by app builders.
   *
   * @internal
   */
  public abstract _bind(scope: Construct): StackInstancesBindResult;
}

/**
 * Returned by the StackInstances.bind() function
 *
 * Does not need to be used by app builders.
 *
 * @internal
 */
export interface StackInstancesBindResult {
  /**
   * Properties to mix into the Action configuration
   */
  readonly stackSetConfiguration: any;
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
   * const parameters = codepipeline_actions.StackSetParameters.fromLiteral({
   *  BucketName: 'my-bucket',
   *  Asset1: 'true',
   * });
   */
  public static fromLiteral(parameters: Record<string, string>, usePreviousValues?: string[]): StackSetParameters {
    return new class extends StackSetParameters {
      public readonly _artifactsReferenced: codepipeline.Artifact[] = [];

      _render(): string {
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
      public _artifactsReferenced: codepipeline.Artifact[] = [artifactPath.artifact];

      public _render(): string {
        return artifactPath.location;
      }
    }();
  }

  /**
   * Artifacts referenced by this parameter set
   *
   * @internal
   */
  public abstract readonly _artifactsReferenced: codepipeline.Artifact[];

  /**
   * Converts Parameters to a string.
   *
   * @internal
   */
  public abstract _render(): string;
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
      _bind() {
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
   * const deploymentModel = codepipeline_actions.StackSetDeploymentModel.selfManaged({
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
      _bind(scope: Construct) {
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
   *
   * @internal
   */
  public abstract _bind(scope: Construct): StackSetDeploymentModelBindResult;
}

/**
 * Returned by the StackSetDeploymentModel.bind() function
 *
 * Does not need to be used by app builders.
 *
 * @internal
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
