import { Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnClusterParameterGroup } from './redshift.generated';

/**
 * Possible Parameter Group Families
 * used for defining {@link ClusterParameterGroupProps.family}.
 * > At this time, redshift-1.0 is the only version of the Amazon Redshift engine.
 * see https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-parameter-groups.html
 */
export enum ParameterGroupFamily {
  REDSHIFT_1_0 = 'redshift-1.0',
  DUMMY = 'dummy', // hack to circumvent known bug see https://github.com/aws/aws-cdk/pull/6948#issuecomment-604015109
}

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
   * The name of the parameter group
   */
  public abstract readonly parameterGroupName: string;
}

/**
 * Properties for a parameter group
 */
export interface ClusterParameterGroupProps {
  /**
   * The version of the Amazon Redshift engine to which the parameters in the parameter group apply.
   * see https://docs.aws.amazon.com/redshift/latest/mgmt/working-with-parameter-groups.html
   *
   * @default ParameterGroupFamily.REDSHIFT_1_0
   */
  readonly family?: ParameterGroupFamily;

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
export class ClusterParameterGroup extends ParameterGroupBase {
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

  constructor(scope: Construct, id: string, props: ClusterParameterGroupProps) {
    super(scope, id);

    const resource = new CfnClusterParameterGroup(this, 'Resource', {
      description: props.description || `Cluster parameter group for ${props.family}`,
      parameterGroupFamily: props.family ? props.family : ParameterGroupFamily.REDSHIFT_1_0,
      parameters: Object.entries(props.parameters).map(([name, value]) => {
        return {parameterName: name, parameterValue: value};
      }),
    });

    this.parameterGroupName = resource.ref;
  }
}