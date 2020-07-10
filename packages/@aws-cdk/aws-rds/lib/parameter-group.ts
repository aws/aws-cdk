import { Construct, IResource, Lazy, Resource } from '@aws-cdk/core';
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

  /**
   * Adds a parameter to this group.
   * If this is an imported parameter group,
   * this method does nothing.
   *
   * @returns true if the parameter was actually added
   *   (i.e., this ParameterGroup is not imported),
   *   false otherwise
   */
  addParameter(key: string, value: string): boolean;
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

      public addParameter(): boolean { return false; }
    }
    return new Import(scope, id);
  }

  /**
   * The name of the parameter group
   */
  public abstract readonly parameterGroupName: string;

  /**
   * Parameters of the parameter group
   */
  protected readonly parameters: { [key: string]: string };

  constructor(scope: Construct, id: string, parameters: { [key: string]: string } | undefined) {
    super(scope, id);

    this.parameters = parameters ?? {};
  }

  /**
   * Add a parameter to this parameter group
   *
   * @param key The key of the parameter to be added
   * @param value The value of the parameter to be added
   */
  public addParameter(key: string, value: string): boolean {
    this.parameters[key] = value;
    return true;
  }
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
   *
   * @default - None
   */
  readonly parameters?: { [key: string]: string };
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
    super(scope, id, props.parameters);

    const resource = new CfnDBParameterGroup(this, 'Resource', {
      description: props.description || `Parameter group for ${props.family}`,
      family: props.family,
      parameters: Lazy.anyValue({ produce: () => this.parameters }),
    });

    this.parameterGroupName = resource.ref;
  }
}

/**
 * Construction properties for a ClusterParameterGroup
 */
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
    super(scope, id, props.parameters);

    const resource = new CfnDBClusterParameterGroup(this, 'Resource', {
      description: props.description || `Cluster parameter group for ${props.family}`,
      family: props.family,
      parameters: Lazy.anyValue({ produce: () => this.parameters }),
    });

    this.parameterGroupName = resource.ref;
  }
}
