import cdk = require('@aws-cdk/cdk');
import { ClusterParameterGroupRef } from './cluster-parameter-group-ref';
import { Parameters } from './props';
import { cloudformation } from './rds.generated';

/**
 * Properties for a cluster parameter group
 */
export interface ClusterParameterGroupProps {
  /**
   * Database family of this parameter group
   */
  family: string;

  /**
   * Description for this parameter group
   */
  description: string;

  /**
   * The parameters in this parameter group
   */
  parameters?: Parameters;
}

/**
 * Defina a cluster parameter group
 */
export class ClusterParameterGroup extends ClusterParameterGroupRef {
  public readonly parameterGroupName: string;
  private readonly parameters: Parameters = {};

  constructor(parent: cdk.Construct, id: string, props: ClusterParameterGroupProps) {
    super(parent, id);

    const resource = new cloudformation.DBClusterParameterGroupResource(this, 'Resource', {
      description: props.description,
      family: props.family,
      parameters: new cdk.Token(() => this.parameters),
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
  public validate(): string[] {
    if (Object.keys(this.parameters).length === 0) {
      return ['At least one parameter required, call setParameter().'];
    }
    return [];
  }
}
