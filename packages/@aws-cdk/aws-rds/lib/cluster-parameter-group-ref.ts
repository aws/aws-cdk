import cdk = require('@aws-cdk/cdk');

/**
 * A cluster parameter group
 */
export abstract class ClusterParameterGroupRef extends cdk.Construct {
  /**
   * Import a parameter group
   */
  public static import(parent: cdk.Construct, id: string, props: ClusterParameterGroupRefProps): ClusterParameterGroupRef {
    return new ImportedClusterParameterGroup(parent, id, props);
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
      parameterGroupName: new cdk.Output(this, 'ParameterGroupName', { value: this.parameterGroupName }).makeImportValue().toString()
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

  constructor(parent: cdk.Construct, id: string, props: ClusterParameterGroupRefProps) {
    super(parent, id);
    this.parameterGroupName = props.parameterGroupName;
  }
}
