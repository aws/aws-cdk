import cxapi = require('@aws-cdk/cx-api');
import { ContextProvider } from '../context';
import { Construct } from '../core/construct';

export interface CloudFormationImportContextProviderProps {
  /**
   * The name of the export to resolve
   */
  exportName: string;
}
/**
 * Context provider that will read values from the SSM parameter store in the indicated account and region
 */
export class CloudFormationImportContextProvider {
  private readonly provider: ContextProvider;
  private readonly exportName: string;

  constructor(scope: Construct, props: CloudFormationImportContextProviderProps) {
    this.provider = new ContextProvider(scope, cxapi.CLOUDFORMATION_IMPORT_PROVIDER, props);
    this.exportName = props.exportName;
  }

  /**
   * Return the SSM parameter string with the indicated key
   */
  public parameterValue(defaultValue = `dummy-imported-value-for-${this.exportName}`): any {
    return this.provider.getStringValue(defaultValue);
  }
}
