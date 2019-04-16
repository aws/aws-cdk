import cxapi = require('@aws-cdk/cx-api');
import { Construct } from './construct';
import { ContextProvider } from './context';

export interface CloudFormationImportContextProviderProps {
  /**
   * The name of the export to resolve
   */
  exportName: string;

  /**
   * Indicates if we allow this value not to be defined, in which case, you can
   * use `optionalValue` to retrieve it. Otherwise, the toolkit will fail when
   * trying to retrieve a non-exported value.
   *
   * This must be used when deserializating values that may be undefined.
   */
  optional?: boolean;
}

/**
 * Context provider that reads values exported by a CloudFormation stack within
 * the same account/region.
 *
 * @internal
 */
export class CloudFormationImportContextProvider {
  private readonly provider: ContextProvider;

  constructor(scope: Construct, props: CloudFormationImportContextProviderProps) {
    this.provider = new ContextProvider(scope, cxapi.CLOUDFORMATION_IMPORT_PROVIDER, props);
  }

  /**
   * @returns
   */
  public value(): string | undefined {
    return this.provider.getOptionalValue();
  }
}