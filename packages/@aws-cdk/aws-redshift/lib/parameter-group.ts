import { IResource, Resource } from '@aws-cdk/core';
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
}

/**
 * A new cluster or instance parameter group
 */
abstract class ClusterParameterGroupBase extends Resource implements IClusterParameterGroup {
  /**
   * The name of the parameter group
   */
  public abstract readonly clusterParameterGroupName: string;
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
 * A cluster parameter group
 *
 * @resource AWS::Redshift::ClusterParameterGroup
 */
export class ClusterParameterGroup extends ClusterParameterGroupBase {
  /**
   * Imports a parameter group
   */
  public static fromClusterParameterGroupName(scope: Construct, id: string, clusterParameterGroupName: string): IClusterParameterGroup {
    class Import extends Resource implements IClusterParameterGroup {
      public readonly clusterParameterGroupName = clusterParameterGroupName;
    }
    return new Import(scope, id);
  }

  /**
   * The name of the parameter group
   */
  public readonly clusterParameterGroupName: string;

  constructor(scope: Construct, id: string, props: ClusterParameterGroupProps) {
    super(scope, id);

    const resource = new CfnClusterParameterGroup(this, 'Resource', {
      description: props.description || 'Cluster parameter group for family redshift-1.0',
      parameterGroupFamily: 'redshift-1.0',
      parameters: Object.entries(props.parameters).map(([name, value]) => {
        return { parameterName: name, parameterValue: value };
      }),
    });

    this.clusterParameterGroupName = resource.ref;
  }
}
