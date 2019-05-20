import { Construct, IResource, Resource, Token } from '@aws-cdk/cdk';
import { Parameters } from './props';
import { CfnDBClusterParameterGroup } from './rds.generated';

/**
 * A cluster parameter group
 */
export interface IClusterParameterGroup extends IResource {
  /**
   * Name of this parameter group
   */
  readonly parameterGroupName: string;
}

/**
 * Properties to reference a cluster parameter group
 */
export interface ClusterParameterGroupImportProps {
  readonly parameterGroupName: string;
}

/**
 * Properties for a cluster parameter group
 */
export interface ClusterParameterGroupProps {
  /**
   * Database family of this parameter group
   */
  readonly family: string;

  /**
   * Description for this parameter group
   */
  readonly description: string;

  /**
   * The parameters in this parameter group
   */
  readonly parameters?: Parameters;
}

/**
 * Defina a cluster parameter group
 *
 * @resource AWS::RDS::DBClusterParameterGroup
 */
export class ClusterParameterGroup extends Resource implements IClusterParameterGroup {
  /**
   * Import a parameter group
   */
  public static fromParameterGroupName(scope: Construct, id: string, parameterGroupName: string): IClusterParameterGroup {
    class Import extends Resource implements IClusterParameterGroup {
      public parameterGroupName = parameterGroupName;
    }
    return new Import(scope, id);
  }

  public readonly parameterGroupName: string;
  private readonly parameters: Parameters = {};

  constructor(scope: Construct, id: string, props: ClusterParameterGroupProps) {
    super(scope, id);

    const resource = new CfnDBClusterParameterGroup(this, 'Resource', {
      description: props.description,
      family: props.family,
      parameters: new Token(() => this.parameters),
    });

    for (const [key, value] of Object.entries(props.parameters || {})) {
      this.setParameter(key, value);
    }

    this.parameterGroupName = resource.ref;
  }

  /**
   * Set a single parameter in this parameter group
   */
  public setParameter(key: string, value: string | undefined) {
    if (value === undefined && key in this.parameters) {
      delete this.parameters[key];
    }
    if (value !== undefined) {
      this.parameters[key] = value;
    }
  }

  /**
   * Remove a previously-set parameter from this parameter group
   */
  public removeParameter(key: string) {
    this.setParameter(key, undefined);
  }

  /**
   * Validate this construct
   */
  protected validate(): string[] {
    if (Object.keys(this.parameters).length === 0) {
      return ['At least one parameter required, call setParameter().'];
    }
    return [];
  }
}
