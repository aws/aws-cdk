import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDBClusterParameterGroup } from './neptune.generated';

/**
 * Properties for a parameter group
 */
interface ParameterGroupPropsBase {
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
 * Marker class for cluster parameter group
 */
export interface ClusterParameterGroupProps extends ParameterGroupPropsBase {
  /**
   * The name of the parameter group
   *
   * @default A CDK generated name for the parameter group
   */
  readonly clusterParameterGroupName?: string;
}

/**
 * Marker class for cluster parameter group
 */
export interface ParameterGroupProps extends ParameterGroupPropsBase {
  /**
   * The name of the parameter group
   *
   * @default A CDK generated name for the parameter group
   */
  readonly parameterGroupName?: string;
}

/**
 * A parameter group
 */
export interface IClusterParameterGroup extends IResource {
  /**
   * The name of this parameter group
   */
  readonly clusterParameterGroupName: string;
}


/**
 * A cluster parameter group
 *
 * @resource AWS::Neptune::DBClusterParameterGroup
 */
export class ClusterParameterGroup extends Resource implements IClusterParameterGroup {
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

    const resource = new CfnDBClusterParameterGroup(this, 'Resource', {
      name: props.clusterParameterGroupName,
      description: props.description || 'Cluster parameter group for neptune db cluster',
      family: 'neptune1',
      parameters: props.parameters,
    });

    this.clusterParameterGroupName = resource.ref;
  }
}

/**
 * A parameter group
 */
export interface IParameterGroup extends IResource {
  /**
   * The name of this parameter group
   */
  readonly parameterGroupName: string;
}

/**
 * DB parameter group
 *
 * @resource AWS::Neptune::DBParameterGroup
 */
export class ParameterGroup extends Resource implements IParameterGroup {
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
  public readonly parameterGroupName: string;

  constructor(scope: Construct, id: string, props: ParameterGroupProps) {
    super(scope, id);

    const resource = new CfnDBClusterParameterGroup(this, 'Resource', {
      name: props.parameterGroupName,
      description: props.description || 'Instance parameter group for neptune db instances',
      family: 'neptune1',
      parameters: props.parameters,
    });

    this.parameterGroupName = resource.ref;
  }
}
