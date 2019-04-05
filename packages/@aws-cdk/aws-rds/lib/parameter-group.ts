import cdk = require('@aws-cdk/cdk');
import { CfnDBClusterParameterGroup, CfnDBParameterGroup } from './rds.generated';

/**
 * A parameter group
 */
export interface IParameterGroup extends cdk.IConstruct {
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
 * A new cluster or instance parameter group
 */
export abstract class ParameterGroupBase extends cdk.Construct implements IParameterGroup {
  /**
   * Imports a parameter group
   */
  public static import(scope: cdk.Construct, id: string, props: ParameterGroupImportProps): IParameterGroup {
    return new ImportedParameterGroup(scope, id, props);
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
      parameterGroupName: new cdk.CfnOutput(this, 'ParameterGroupName', { value: this.parameterGroupName }).makeImportValue().toString()
    };
  }
}

/**
 * A parameter group
 */
export class ParameterGroup extends ParameterGroupBase {
  /**
   * The name of the parameter group
   */
  public readonly parameterGroupName: string;

  constructor(scope: cdk.Construct, id: string, props: ParameterGroupProps) {
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
 * A cluster parameter group
 */
export class ClusterParameterGroup extends ParameterGroupBase {
  /**
   * The name of the parameter group
   */
  public readonly parameterGroupName: string;

  constructor(scope: cdk.Construct, id: string, props: ParameterGroupProps) {
    super(scope, id);

    const resource = new CfnDBClusterParameterGroup(this, 'Resource', {
      description: props.description || `Cluster parameter group for ${props.family}`,
      family: props.family,
      parameters: props.parameters,
    });

    this.parameterGroupName = resource.dbClusterParameterGroupName;
  }
}

/**
 * Construction properties for an ImportedParameterGroup
 */
export interface ParameterGroupImportProps {
  /**
   * The name of the parameter group
   */
  readonly parameterGroupName: string;
}

/**
 * An imported cluster or instance parameter group
 */
class ImportedParameterGroup extends cdk.Construct implements IParameterGroup {
  /**
   * The name of the parameter group
   */
  public readonly parameterGroupName: string;

  constructor(scope: cdk.Construct, id: string, private readonly props: ParameterGroupImportProps) {
    super(scope, id);

    this.parameterGroupName = props.parameterGroupName;
  }

  /**
   * Exports this parameter group from the stack
   */
  public export(): ParameterGroupImportProps {
    return this.props;
  }
}
