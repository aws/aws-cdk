import { CfnOutput, Construct, IResource, Resource } from '@aws-cdk/cdk';
import { CfnDBClusterParameterGroup, CfnDBParameterGroup } from './rds.generated';

/**
 * A parameter group
 */
export interface IParameterGroup extends IResource {
  /**
   * The name of this parameter group
   */
  readonly parameterGroupName: string;

  /**
   * Exports this parameter group from the stack
   */
  export(): ParameterGroupImportProps;
}

/**
 * Construction properties for an imported parameter group
 */
export interface ParameterGroupImportProps {
  /**
   * The name of the parameter group
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
  public static import(scope: Construct, id: string, props: ParameterGroupImportProps): IParameterGroup {
    class Import extends Construct implements IParameterGroup {
      public readonly parameterGroupName = props.parameterGroupName;

      public export() { return props; }
    }

    return new Import(scope, id);
  }

  /**
   * The name of the parameter group
   */
  public abstract readonly parameterGroupName: string;

  /**
   * Exports this parameter group from the stack
   */
  public export(): ParameterGroupImportProps {
    return {
      parameterGroupName: new CfnOutput(this, 'ParameterGroupName', { value: this.parameterGroupName }).makeImportValue().toString()
    };
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
   */
  readonly parameters: { [key: string]: string };
}

/**
 * A parameter group
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

    this.parameterGroupName = resource.dbParameterGroupName;
  }
}

/**
 * Construction properties for a ClusterParameterGroup
 */
// tslint:disable-next-line:no-empty-interface
export interface ClusterParameterGroupProps extends ParameterGroupProps {

}
/**
 * A cluster parameter group
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

    this.parameterGroupName = resource.dbClusterParameterGroupName;
  }
}
