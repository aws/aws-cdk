import { CfnOutput, Construct } from "@aws-cdk/cdk";

/**
 * A instance parameter group
 */
export abstract class InstanceParameterGroupRef extends Construct {
  /**
   * Import a parameter group
   */
  public static import(scope: Construct, id: string, props: InstanceParameterGroupRefProps): InstanceParameterGroupRef {
    return new ImportedInstanceParameterGroup(scope, id, props);
  }

  /**
   * Name of this parameter group
   */
  public abstract readonly parameterGroupName: string;

  /**
   * Export this parameter group
   */
  public export(): InstanceParameterGroupRefProps {
    return {
      parameterGroupName: new CfnOutput(this, 'ParameterGroupName', { value: this.parameterGroupName}).makeImportValue().toString(),
    };
  }
}

/**
 * Properties to reference a instance parameter group
 */
export interface InstanceParameterGroupRefProps {
  parameterGroupName: string
}

class ImportedInstanceParameterGroup extends InstanceParameterGroupRef {
  public readonly parameterGroupName: string;

  constructor(scope: Construct, id: string, props: InstanceParameterGroupRefProps) {
    super(scope, id);

    this.parameterGroupName = props.parameterGroupName;
  }
}
