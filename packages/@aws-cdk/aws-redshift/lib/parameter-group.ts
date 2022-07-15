import { IResource, Resource, Lazy } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnClusterParameterGroup } from './redshift.generated';

/**
 * A parameter group
 */
export interface IClusterParameterGroup extends IResource {
  /**
   * The name of this parameter group
   *
   * @attribute
   */
  readonly clusterParameterGroupName: string;

  /**
   * Adds a parameter to the parameter group
   *
   * @param name the parameter name
   * @param value the parameter name
   * @returns metadata about the execution of this method. If the parameter
   * was not added, the value of `parameterAddedResult` will report a failure status. You
   * should always check this value to make sure that the operation was
   * actually carried out. Otherwise, synthesis and deploy will terminate
   * silently, which may be confusing.
   */
  addParameter(name: string, value: string): AddParameterResult;
}

/**
 * A new cluster or instance parameter group
 */
abstract class ClusterParameterGroupBase extends Resource implements IClusterParameterGroup {
  /**
   * The name of the parameter group
   */
  public abstract readonly clusterParameterGroupName: string;

  public addParameter(_name: string, _value: string): AddParameterResult {
    return { parameterAddedResult: AddParameterResultStatus.IMPORTED_RESOURCE_FAILURE };
  }
}

/**
 * Properties for a parameter group
 */
export interface ClusterParameterGroupProps {
  /**
   * Description for this parameter group
   *
   * @default a CDK generated description
   */
  readonly description?: string;

  /**
   * The parameters in this parameter group
   */
  readonly parameters: { [name: string]: string };
}

/**
 * Result of calling addParameter
 */
export interface AddParameterResult {
  /**
   * Whether the parameter was added
   */
  readonly parameterAddedResult: AddParameterResultStatus;
}

/**
 * Success and failure statuses for adding parameters
 */
export enum AddParameterResultStatus {
  /**
   * The named parameter did not already exist and was added.
   */
  SUCCESS,
  /**
   * The named parameter already exists and the provided value matched the existing value.
   */
  SAME_VALUE_FAILURE,
  /**
   * The named parameter already exists and the provided value did not match the existing value.
   */
  CONFLICTING_VALUE_FAILURE,
  /**
   * The operation failed due to one of the following reasons.
   * The parameter group is an imported parameter group.
   * The cluster is an imported cluster.
   */
  IMPORTED_RESOURCE_FAILURE
}

/**
 * A cluster parameter group
 *
 * @resource AWS::Redshift::ClusterParameterGroup
 */
export class ClusterParameterGroup extends ClusterParameterGroupBase {
  /**
   * Imports a parameter group
   */
  public static fromClusterParameterGroupName(scope: Construct, id: string, clusterParameterGroupName: string): IClusterParameterGroup {
    class Import extends ClusterParameterGroupBase {
      public readonly clusterParameterGroupName = clusterParameterGroupName;
    }
    return new Import(scope, id);
  }

  /**
   * The name of the parameter group
   */
  public readonly clusterParameterGroupName: string;

  /**
   * The parameters in the parameter group
  */
  readonly parameters: { [name: string]: string };

  constructor(scope: Construct, id: string, props: ClusterParameterGroupProps) {
    super(scope, id);
    this.parameters = props.parameters;
    const resource = new CfnClusterParameterGroup(this, 'Resource', {
      description: props.description || 'Cluster parameter group for family redshift-1.0',
      parameterGroupFamily: 'redshift-1.0',
      parameters: Lazy.any({ produce: () => this.parseParameters() }),
    });

    this.clusterParameterGroupName = resource.ref;
  }
  private parseParameters(): any {
    return Object.entries(this.parameters).map(([name, value]) => {
      return { parameterName: name, parameterValue: value };
    });
  }

  public addParameter(name: string, value: string): AddParameterResult {
    const existingValue = Object.entries(this.parameters).find(([key, _]) => key === name)?.[1];
    if (existingValue === undefined) {
      this.parameters[name] = value;
      return { parameterAddedResult: AddParameterResultStatus.SUCCESS };
    } else if (existingValue === value) {
      return { parameterAddedResult: AddParameterResultStatus.SAME_VALUE_FAILURE };
    } else {
      return { parameterAddedResult: AddParameterResultStatus.CONFLICTING_VALUE_FAILURE };
    }
  }
}
