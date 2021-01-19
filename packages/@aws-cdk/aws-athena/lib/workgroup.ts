import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';
import { CfnWorkGroup } from './athena.generated';
import { ResultConfiguration, WorkGroupConfiguration, WorkGroupConfigurationUpdates, WorkGroupState } from './interfaces';
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
   * The configuration information that will be updated for this workgroup
   *
   * @default - Not specified
   */
  readonly configurationUpdates?: WorkGroupConfigurationUpdates;
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

}

/**
 * Define a new or imported {@link WorkGroup}
 */
abstract class WorkGroupBase extends cdk.Resource implements IWorkGroup {
  abstract readonly creationTime?: string;
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
    const resource = new CfnWorkGroup(this, 'Resource', {
      name: props.workGroupName,
      description: props.description,
      recursiveDeleteOption: props.recursiveDeleteOption,
      state: props.state,
      workGroupConfiguration: (props.configuration) ?
        {
          bytesScannedCutoffPerQuery: props.configuration.bytesScannedCutoffPerQuery,
          enforceWorkGroupConfiguration: props.configuration.enforceWorkGroupConfiguration,
          publishCloudWatchMetricsEnabled: props.configuration.publishCloudWatchMetricsEnabled,
          requesterPaysEnabled: props.configuration.requesterPaysEnabled,
          resultConfiguration: this.resolveResultConfiguration(props.configuration.resultConfigurations),
        } : undefined,
      workGroupConfigurationUpdates: (props.configurationUpdates) ? {
        bytesScannedCutoffPerQuery: props.configurationUpdates.bytesScannedCutoffPerQuery,
        enforceWorkGroupConfiguration: props.configurationUpdates.enforceWorkGroupConfiguration,
        publishCloudWatchMetricsEnabled: props.configurationUpdates.publishCloudWatchMetricsEnabled,
        requesterPaysEnabled: props.configurationUpdates.requesterPaysEnabled,
        removeBytesScannedCutoffPerQuery: props.configurationUpdates.removeBytesScannedCutoffPerQuery,
        resultConfigurationUpdates: {
          ...this.resolveResultConfiguration(props.configurationUpdates.resultConfigurationUpdates),
          removeEncryptionConfiguration: props.configurationUpdates.resultConfigurationUpdates?.removeEncryptionConfiguration,
          removeOutputLocation: props.configurationUpdates.resultConfigurationUpdates?.removeOutputLocation,
        },
      } : undefined,
      tags: (props.tags) ? Object.keys(props.tags).map(key => new cdk.Tag(key, props.tags![key])) : undefined,

    });
    this.creationTime = resource.attrCreationTime;
    this.workgroupName = resource.name;
    this.workgroupArn = cdk.Stack.of(this).formatArn({
      resource: 'workgroup', resourceName: resource.name, service: 'athena',
    });
  }

  private resolveResultConfiguration(resultCfg: ResultConfiguration | undefined) {
    if (resultCfg) {
      if (resultCfg.encryptionConfiguration && /KMS/.test(resultCfg.encryptionConfiguration.encryptionOption) && resultCfg.encryptionConfiguration.kmsKey == undefined) {
        throw new Error(`${resultCfg.encryptionConfiguration.encryptionOption} requires providing a kms key`);
      }
      return {
        outputLocation: resultCfg.outputLocation?.bucket.s3UrlForObject(
          resultCfg.outputLocation?.s3Prefix),
        encryptionConfiguration: (resultCfg.encryptionConfiguration) ?
          {
            encryptionOption: resultCfg.encryptionConfiguration.encryptionOption,
            kmsKey: resultCfg.encryptionConfiguration.kmsKey?.keyArn,
          } : undefined,
      };
    } else {
      return undefined;
    }
  }

}