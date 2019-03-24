import { CfnOutput, Construct, IConstruct, Token } from '@aws-cdk/cdk';
import { Parameters } from './props';
import { CfnDBParameterGroup } from './rds.generated';

/**
 * A instance parameter group
 */
export interface IInstanceParameterGroup extends IConstruct {
  /**
   * Name of this parameter group
   */
  readonly parameterGroupName: string;

  /**
   * Export this parameter group
   */
  export(): InstanceParameterGroupImportProps;
}

/**
 * Properties to reference a instance parameter group
 */
export interface InstanceParameterGroupImportProps {
  readonly parameterGroupName: string;
}

/**
 * Properties for a instance parameter group
 */
export interface InstanceParameterGroupProps {
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
  parameters: Parameters;
}

/**
 * Defina a instance parameter group
 */
export class InstanceParameterGroup extends Construct implements IInstanceParameterGroup {
  /**
   * Import a parameter group
   */
  public static import(scope: Construct, id: string, props: InstanceParameterGroupImportProps): IInstanceParameterGroup {
    return new ImportedInstanceParameterGroup(scope, id, props);
  }

  public readonly parameterGroupName: string;
  private readonly parameters: Parameters = {};

  constructor(scope: Construct, id: string, props: InstanceParameterGroupProps) {
    super(scope, id);

    const { description, family, parameters } = props;

    const resource = new CfnDBParameterGroup(this, 'Resource', {
      description,
      family,
      parameters: new Token(() => this.parameters)
    });

    for (const [key, value] of Object.entries(parameters || {})) {
      this.setParameter(key, value);
    }

    this.parameterGroupName = resource.ref;
  }

  /**
   * Export this parameter group
   */
  public export(): InstanceParameterGroupImportProps {
    return {
      parameterGroupName: new CfnOutput(this, 'ParameterGroupName', { value: this.parameterGroupName }).makeImportValue().toString(),
    };
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

class ImportedInstanceParameterGroup extends Construct implements IInstanceParameterGroup {
  public readonly parameterGroupName: string;

  constructor(scope: Construct, id: string, private readonly props: InstanceParameterGroupImportProps) {
    super(scope, id);

    this.parameterGroupName = props.parameterGroupName;
  }

  public export() {
    return this.props;
  }
}
