import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDBClusterParameterGroup } from './docdb.generated';

/**
 * A parameter group
 */
export interface IClusterParameterGroup extends IResource {
  /**
   * The name of this parameter group
   */
  readonly parameterGroupName: string;
}

/**
 * A new cluster or instance parameter group
 */
abstract class ClusterParameterGroupBase extends Resource implements IClusterParameterGroup {
  /**
   * Imports a parameter group
   */
  public static fromParameterGroupName(scope: Construct, id: string, parameterGroupName: string): IClusterParameterGroup {
    class Import extends Resource implements IClusterParameterGroup {
      public readonly parameterGroupName = parameterGroupName;
    }
    return new Import(scope, id);
  }

  /**
   * The name of the parameter group
   */
  public abstract readonly parameterGroupName: string;
}

/**
 * Properties for a cluster parameter group
 */
export interface ClusterParameterGroupProps {
  /**
   * Description for this parameter group
   *
   * @default a CDK generated description
   */
  readonly description?: string;

  /**
   * Database family of this parameter group
   */
  readonly family: string;

  /**
   * The name of the cluster parameter group
   *
   * @default A CDK generated name for the cluster parameter group
   */
  readonly dbClusterParameterGroupName?: string;

  /**
   * The parameters in this parameter group
   */
  readonly parameters: { [key: string]: string };
}

/**
 * A cluster parameter group
 *
 * @resource AWS::DocDB::DBClusterParameterGroup
 */
export class ClusterParameterGroup extends ClusterParameterGroupBase implements IClusterParameterGroup {
  /**
   * The name of the parameter group
   */
  public readonly parameterGroupName: string;

  constructor(scope: Construct, id: string, props: ClusterParameterGroupProps) {
    super(scope, id);

    const resource = new CfnDBClusterParameterGroup(this, 'Resource', {
      name: props.dbClusterParameterGroupName,
      description: props.description || `Cluster parameter group for ${props.family}`,
      family: props.family,
      parameters: props.parameters,
    });

    this.parameterGroupName = resource.ref;
  }
}
