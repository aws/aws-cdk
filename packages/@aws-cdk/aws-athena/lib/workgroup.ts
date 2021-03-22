import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '@aws-cdk/custom-resources';
import * as constructs from 'constructs';
import { ResultConfiguration, WorkGroupConfiguration, WorkGroupState } from './interfaces';
import { GENERAL_ACTIONS, MANAGEMENT_ACTIONS, USER_ACTIONS } from './private/permissions';

/**
 * Construction properties for {@link WorkGroup}
 */
export interface WorkGroupProps {
  /**
   * The workgroup name.
   * Must be between 1 and 128 characters,inclusive,
   * and consist of alphanumeric (a-z, A-Z, 0-9) characters and dots, underscores, dashes only
   */
  readonly workGroupName: string;
  /**
   * The workgroup description.
   *
   * @default No description
   */
  readonly description?: string;
  /**
   * Whether the workgroup should be deleted even if the workgroup contains any named queries or query executions.
   *
   * @default - False
   */
  readonly recursiveDeleteOption?: boolean;
  /**
   * The state of the workgroup
   *
   * @default - WorkGroupState.ENABLED
   */
  readonly state?: WorkGroupState;
  /**
   * The configuration of the workgroup
   *
   * @default - None
   */
  readonly configuration?: WorkGroupConfiguration;
  /**
   * An array of key-value pairs to apply to this resource.
   *
   * @default - No tags
   */
  readonly tags?: {[key: string]: string};

}

/**
 * The interface that represents {@link WorkGroup}
 */
export interface IWorkGroup extends cdk.IResource {
  /**
   * The name of the Athena WorkGroup
   * @attribute
   */
  readonly workgroupName: string;
  /**
  * The ARN of the Athena WorkGroup
  * @attribute
  */
  readonly workgroupArn: string;
  /**
   * The date and time the workgroup was created, as a UNIX timestamp in seconds
   * @attribute
   */
  readonly creationTime?: string;
  /**
   * The engine version on which the query runs.
   * @attribute
   */
  readonly effectiveEngineVersion?: string;

}

/**
 * Define a new or imported {@link WorkGroup}
 */
abstract class WorkGroupBase extends cdk.Resource implements IWorkGroup {
  abstract readonly creationTime?: string;
  abstract readonly effectiveEngineVersion?: string;
  abstract readonly workgroupArn: string;
  abstract readonly workgroupName: string;

  /**
   * Grant Full access to a specific workgroup
   * @see https://docs.aws.amazon.com/athena/latest/ug/example-policies-workgroup.html#example2-full-access-this-wkg
   * @param grantee - The principal to grant access to
   */
  public grantFullAccess(grantee: iam.IGrantable): iam.Grant {
    iam.Grant.addToPrincipal({
      grantee,
      actions: GENERAL_ACTIONS,
      resourceArns: ['*'],
      scope: this,
    });
    return this.grant(grantee, [...USER_ACTIONS, ...MANAGEMENT_ACTIONS]);
  }

  /**
   * Grant user access to a specific workgroup
   * @see https://docs.aws.amazon.com/athena/latest/ug/example-policies-workgroup.html#example3-user-access
   * @param grantee - The principal to grant access to
   */
  public grantUserAccess(grantee: iam.IGrantable): iam.Grant {
    iam.Grant.addToPrincipal({
      grantee,
      actions: GENERAL_ACTIONS,
      resourceArns: ['*'],
      scope: this,
    });
    return this.grant(grantee, USER_ACTIONS);
  }

  /**
   * Grant management access to a specific workgroup
   * @see https://docs.aws.amazon.com/athena/latest/ug/example-policies-workgroup.html#example5-manage-wkgs-access
   * @param grantee - The principal to grant access to
   */
  public grantManagementAccess(grantee: iam.IGrantable): iam.Grant {
    iam.Grant.addToPrincipal({
      grantee,
      actions: ['athena:ListEngineVersions'],
      resourceArns: ['*'],
      scope: this,
    });
    return this.grant(grantee, MANAGEMENT_ACTIONS);
  }

  private grant(grantee: iam.IGrantable, actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      resourceArns: [this.workgroupArn],
      actions,
    });
  }
}

/**
 * Attributes for importing {@link WorkGroup}
 */
export interface WorkGroupAttributes {
  /**
   * The name of the workgroup
   */
  readonly workgroupName: string;
  /**
   * The ARN of the workgroup
   */
  readonly workgroupArn: string;
}

/**
 * Athena WorkGroup
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-athena-workgroup.html
 */
export class WorkGroup extends WorkGroupBase {

  /**
   * Import an existing WorkGroup provided an ARN
   * @param scope The parent creating construct
   * @param id The construct's name
   */
  public static fromWorkGroupAttributes(scope: constructs.Construct, id: string, attrs: WorkGroupAttributes): IWorkGroup {
    class Import extends WorkGroupBase {
      public readonly workgroupName = attrs.workgroupName;
      public readonly workgroupArn = attrs.workgroupArn;
      public readonly creationTime = undefined;
      public readonly effectiveEngineVersion = undefined;
    }
    return new Import(scope, id);
  }
  /**
   * The date and time the workgroup was created
   */
  public readonly creationTime?: string;
  /**
   * ARN of the workgroup
   */
  public readonly workgroupArn: string;
  /**
   * Name of the workgroup
   */
  public readonly workgroupName: string;
  /**
   * The engine version on which the query runs.
   */
  public readonly effectiveEngineVersion?: string;

  constructor(scope: constructs.Construct, id: string, props: WorkGroupProps) {
    super(scope, id, {
      physicalName: props.workGroupName,
    });

    if (!/^[a-zA-Z0-9._-]{1,128}$/.test(props.workGroupName)) {
      throw new Error('A WorkGroup must be between 1 and 128 characters, inclusive, and consist of alphanumeric (a-z, A-Z, 0-9) characters and dashes, underscores, dots only.');
    }

    if (props.description && props.description.length >= 1024) {
      throw new Error('A WorkGroup description exceeds allowed maximum of 1024');
    }

    this.workgroupArn = cdk.Stack.of(this).formatArn({
      resource: 'workgroup', resourceName: props.workGroupName, service: 'athena',
    });

    const uniqueId = cdk.Names.uniqueId(this);
    const policy = AwsCustomResourcePolicy.fromStatements(
      [new iam.PolicyStatement({
        actions: ['athena:DeleteWorkGroup', 'athena:UpdateWorkGroup', 'athena:GetWorkGroup', 'athena:CreateWorkGroup'],
        effect: iam.Effect.ALLOW,
        resources: [this.workgroupArn],
      })]);

    const workGroupConfiguration = {
      BytesScannedCutoffPerQuery: props.configuration?.bytesScannedCutoffPerQuery,
      EnforceWorkGroupConfiguration: props.configuration?.enforceWorkGroupConfiguration,
      PublishCloudWatchMetricsEnabled: props.configuration?.publishCloudWatchMetricsEnabled,
      RequesterPaysEnabled: props.configuration?.requesterPaysEnabled,
      ...(props.configuration?.engineVersion) ? {
        EngineVersion: {
          SelectedEngineVersion: props.configuration?.engineVersion,
        },
      } : {},
    };
    const resource = new AwsCustomResource(this, 'Resource', {
      policy,
      resourceType: 'Custom::WorkGroup',
      onCreate: {
        service: 'Athena',
        action: 'createWorkGroup',
        parameters: {
          Name: props.workGroupName,
          Description: props.description,
          Configuration: {
            ...workGroupConfiguration,
            ResultConfiguration: this.resolveResultConfiguration(props.configuration?.resultConfigurations),
          },
          Tags: (props.tags) ? Object.keys(props.tags)
            .map(key => ({ Key: key, Value: props.tags![key] })) : undefined,
        },
        physicalResourceId: PhysicalResourceId.of(uniqueId),
      },
      onUpdate: {
        service: 'Athena',
        action: 'updateWorkGroup',
        parameters: {
          WorkGroup: props.workGroupName,
          State: props.state,
          Description: props.description,
          ConfigurationUpdates: {
            ...workGroupConfiguration,
            RemoveBytesScannedCutoffPerQuery: props.configuration?.bytesScannedCutoffPerQuery === undefined,
            ResultConfigurationUpdates: {
              ...this.resolveResultConfiguration(props.configuration?.resultConfigurations),
              RemoveEncryptionConfiguration: props.configuration?.resultConfigurations?.encryptionConfiguration === undefined,
              RemoveOutputLocation: props.configuration?.resultConfigurations?.outputLocation === undefined,
            },
          },
        },
        physicalResourceId: PhysicalResourceId.of(uniqueId),
      },
      onDelete: {
        service: 'Athena',
        action: 'deleteWorkGroup',
        parameters: {
          WorkGroup: props.workGroupName,
          RecursiveDeleteOption: props.recursiveDeleteOption,
        },
      },
    });
    const workgroupLookup = new AwsCustomResource(this, 'Lookup', {
      policy,
      resourceType: 'Custom::WorkGroupLookup',
      onUpdate: {
        service: 'Athena',
        action: 'getWorkGroup',
        parameters: {
          WorkGroup: props.workGroupName,
        },
        physicalResourceId: PhysicalResourceId.of(uniqueId + 'Lookup'),
      },
    });

    // Ensure WorkGroup is created before getWorkGroup is called
    workgroupLookup.node.addDependency(resource);
    // TODO figure out why 'WorkGroup.CreationTime' is unavailable in response
    this.creationTime = undefined;
    this.workgroupName = workgroupLookup.getResponseField('WorkGroup.Name');
    this.effectiveEngineVersion = workgroupLookup.getResponseField('WorkGroup.Configuration.EngineVersion.EffectiveEngineVersion');
  }

  private resolveResultConfiguration(resultCfg: ResultConfiguration | undefined) {
    if (resultCfg) {
      if (resultCfg.encryptionConfiguration && /KMS/.test(resultCfg.encryptionConfiguration.encryptionOption) && resultCfg.encryptionConfiguration.kmsKey == undefined) {
        throw new Error(`${resultCfg.encryptionConfiguration.encryptionOption} requires providing a kms key`);
      }
      return {
        OutputLocation: resultCfg.outputLocation?.bucket.s3UrlForObject(
          resultCfg.outputLocation?.s3Prefix),
        EncryptionConfiguration: (resultCfg.encryptionConfiguration) ?
          {
            EncryptionOption: resultCfg.encryptionConfiguration.encryptionOption,
            KmsKey: resultCfg.encryptionConfiguration.kmsKey?.keyArn,
          } : undefined,
      };
    } else {
      return undefined;
    }
  }

}