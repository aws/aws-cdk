import { Construct, IResource, Lazy, Resource } from '@aws-cdk/core';
import { CfnDBClusterParameterGroup, CfnDBParameterGroup } from './rds.generated';

/**
 * Options for {@link IParameterGroup.bindToCluster}.
 * Empty for now, but can be extended later.
 */
export interface ParameterGroupClusterBindOptions {
}

/**
 * The type returned from {@link IParameterGroup.bindToCluster}.
 */
export interface ParameterGroupClusterConfig {
  /** The name of this parameter group. */
  readonly parameterGroupName: string;
}

/**
 * Options for {@link IParameterGroup.bindToInstance}.
 * Empty for now, but can be extended later.
 */
export interface ParameterGroupInstanceBindOptions {
}

/**
 * The type returned from {@link IParameterGroup.bindToInstance}.
 */
export interface ParameterGroupInstanceConfig {
  /** The name of this parameter group. */
  readonly parameterGroupName: string;
}

/**
 * A parameter group.
 * Represents both a cluster parameter group,
 * and an instance parameter group.
 */
export interface IParameterGroup extends IResource {
  /**
   * Method called when this Parameter Group is used when defining a database cluster.
   */
  bindToCluster(options: ParameterGroupClusterBindOptions): ParameterGroupClusterConfig;

  /**
   * Method called when this Parameter Group is used when defining a database instance.
   */
  bindToInstance(options: ParameterGroupInstanceBindOptions): ParameterGroupInstanceConfig;

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
 * A parameter group.
 * Represents both a cluster parameter group,
 * and an instance parameter group.
 *
 * @resource AWS::RDS::DBParameterGroup
 */
export class ParameterGroup extends Resource implements IParameterGroup {
  /**
   * Imports a parameter group
   */
  public static fromParameterGroupName(scope: Construct, id: string, parameterGroupName: string): IParameterGroup {
    class Import extends Resource implements IParameterGroup {
      public bindToCluster(_options: ParameterGroupClusterBindOptions): ParameterGroupClusterConfig {
        return { parameterGroupName };
      }

      public bindToInstance(_options: ParameterGroupInstanceBindOptions): ParameterGroupInstanceConfig {
        return { parameterGroupName };
      }

      public addParameter(_key: string, _value: string): boolean {
        return false;
      }
    }

    return new Import(scope, id);
  }

  private readonly parameters: { [key: string]: string };
  private readonly family: string;
  private readonly description?: string;

  private clusterCfnGroup?: CfnDBClusterParameterGroup;
  private instanceCfnGroup?: CfnDBParameterGroup;

  constructor(scope: Construct, id: string, props: ParameterGroupProps) {
    super(scope, id);

    this.family = props.family;
    this.description = props.description;
    this.parameters = props.parameters ?? {};
  }

  public bindToCluster(_options: ParameterGroupClusterBindOptions): ParameterGroupClusterConfig {
    if (!this.clusterCfnGroup) {
      const parentScope = this.instanceCfnGroup ?? this;
      this.clusterCfnGroup = new CfnDBClusterParameterGroup(parentScope, 'Resource', {
        description: this.description || `Cluster parameter group for ${this.family}`,
        family: this.family,
        parameters: Lazy.anyValue({ produce: () => this.parameters }),
      });
    }
    return {
      parameterGroupName: this.clusterCfnGroup.ref,
    };
  }

  public bindToInstance(_options: ParameterGroupInstanceBindOptions): ParameterGroupInstanceConfig {
    if (!this.instanceCfnGroup) {
      const parentScope = this.clusterCfnGroup ?? this;
      this.instanceCfnGroup = new CfnDBParameterGroup(parentScope, 'Resource', {
        description: this.description || `Parameter group for ${this.family}`,
        family: this.family,
        parameters: Lazy.anyValue({ produce: () => this.parameters }),
      });
    }
    return {
      parameterGroupName: this.instanceCfnGroup.ref,
    };
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
