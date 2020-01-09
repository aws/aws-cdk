import { Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnClusterParameterGroup } from './redshift.generated';

/**
 * A parameter group
 */
export interface IParameterGroup extends IResource {
  /**
   * The name of this parameter group
   *
   * @attribute
   */
  readonly parameterGroupName: string;
}

/**
 * A new cluster or instance parameter group
 */
abstract class ParameterGroupBase extends Resource implements IParameterGroup {
  /**
   * Imports a parameter group
   */
  public static fromParameterGroupName(scope: Construct, id: string, parameterGroupName: string): IParameterGroup {
    class Import extends Resource implements IParameterGroup {
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
 * Properties for a parameter group
 */
export interface ClusterParameterGroupProps {
  /**
   * Database family of this parameter group
   */
  readonly family: string;

  /**
   * Description for this parameter group
   *
   * @default a CDK generated description
   */
  readonly description?: string;

  /**
   * The parameters in this parameter group
   */
  readonly parameters: ParameterGroupParameters[];
}

/**
 * Construction properties for a ClusterParameterGroup
 */
// tslint:disable-next-line:no-empty-interface
export interface ParameterGroupParameters {
    readonly parameterName: string
    readonly parameterValue: string
}
/**
 * A cluster parameter group
 *
 * @resource AWS::Redshift::ClusterParameterGroup
 */
export class ClusterParameterGroup extends ParameterGroupBase {
  /**
   * The name of the parameter group
   */
  public readonly parameterGroupName: string;

  constructor(scope: Construct, id: string, props: ClusterParameterGroupProps) {
    super(scope, id);

    const resource = new CfnClusterParameterGroup(this, 'Resource', {
      description: props.description || `Cluster parameter group for ${props.family}`,
      parameterGroupFamily: props.family,
      parameters: props.parameters,
    });

    this.parameterGroupName = resource.ref;
  }
}