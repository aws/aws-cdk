import { Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnDBClusterParameterGroup, CfnDBParameterGroup } from './rds.generated';

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
export interface ParameterGroupProps {
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
  readonly parameters: { [key: string]: string };
}

/**
 * A parameter group
 *
 * @resource AWS::RDS::DBParameterGroup
 */
export class ParameterGroup extends ParameterGroupBase {
  /**
   * The name of the parameter group
   */
  public readonly parameterGroupName: string;

  constructor(scope: Construct, id: string, props: ParameterGroupProps) {
    super(scope, id);

    const resource = new CfnDBParameterGroup(this, 'Resource', {
      description: props.description || `Parameter group for ${props.family}`,
      family: props.family,
      parameters: props.parameters,
    });

    this.parameterGroupName = resource.ref;
  }
}

/**
 * Construction properties for a ClusterParameterGroup
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ClusterParameterGroupProps extends ParameterGroupProps {

}
/**
 * A cluster parameter group
 *
 * @resource AWS::RDS::DBClusterParameterGroup
 */
export class ClusterParameterGroup extends ParameterGroupBase {
  /**
   * The name of the parameter group
   */
  public readonly parameterGroupName: string;

  constructor(scope: Construct, id: string, props: ClusterParameterGroupProps) {
    super(scope, id);

    const resource = new CfnDBClusterParameterGroup(this, 'Resource', {
      description: props.description || `Cluster parameter group for ${props.family}`,
      family: props.family,
      parameters: props.parameters,
    });

    this.parameterGroupName = resource.ref;
  }
}
