import cdk = require('@aws-cdk/cdk');

/**
 * A cluster parameter group
 */
export abstract class ClusterParameterGroupRef extends cdk.Construct {
  /**
   * Import a parameter group
   */
  public static import(scope: cdk.Construct, id: string, props: ClusterParameterGroupRefProps): ClusterParameterGroupRef {
    return new ImportedClusterParameterGroup(scope, id, props);
  }

  /**
   * Name of this parameter group
   */
  public abstract readonly parameterGroupName: string;

  /**
   * Export this parameter group
   */
  public export(): ClusterParameterGroupRefProps {
    return {
      parameterGroupName: new cdk.CfnOutput(this, 'ParameterGroupName', { value: this.parameterGroupName }).makeImportValue().toString()
    };
  }
}

/**
 * Properties to reference a cluster parameter group
 */
export interface ClusterParameterGroupRefProps {
  parameterGroupName: string;
}

/**
 * An imported cluster parameter group
 */
class ImportedClusterParameterGroup extends ClusterParameterGroupRef {
  public readonly parameterGroupName: string;

  constructor(scope: cdk.Construct, id: string, props: ClusterParameterGroupRefProps) {
    super(scope, id);
    this.parameterGroupName = props.parameterGroupName;
  }
}
