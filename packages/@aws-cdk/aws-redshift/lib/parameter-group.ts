import { IResource, Names, Resource } from '@aws-cdk/core';
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

  /**
   * The parameters in the parameter group
  */
  readonly parameters: { [name: string]: string };

  /**
   * The underlying CfnClusterParameterGroup
  */
  private readonly resource: CfnClusterParameterGroup;

  constructor(scope: Construct, id: string, props: ClusterParameterGroupProps) {
    super(scope, id);
    this.parameters = props.parameters;
    this.resource = new CfnClusterParameterGroup(this, 'Resource', {
      description: props.description || 'Cluster parameter group for family redshift-1.0',
      parameterGroupFamily: 'redshift-1.0',
      parameters: this.parseParameters(),
    });

    this.clusterParameterGroupName = this.resource.ref;
  }
  private parseParameters(): any {
    return Object.entries(this.parameters).map(([name, value]) => {
      return { parameterName: name, parameterValue: value };
    });
  }

  /**
   * Adds a parameter to the parameter group
   *
   * @param name the parameter name
   * @param value the parameter name
   */
  public addParameter(name: string, value: string): void {
    const existingValue = Object.entries(this.parameters).find(([key, _]) => key === name)?.[1];
    if (existingValue === undefined) {
      this.parameters[name] = value;
      this.resource.parameters = this.parseParameters();
    } else if (existingValue !== value) {
      throw new Error(`The parameter group with id "${Names.uniqueResourceName(this, {})}" already contains the parameter "${name}", but with a different value (Given: ${value}, Existing: ${existingValue}).`);
    }
  }
}
