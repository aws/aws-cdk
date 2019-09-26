import cxapi = require('@aws-cdk/cx-api');
import { CloudFormation } from 'aws-sdk';
import { ToolkitInfo } from './toolkit-info';

/**
 * @experimental
 */
export interface AssetTypeHandler {

  /**
   * The name of the asset type this handler processes
   */
  name: string;

  /**
   * Prepares the given asset type for deployment
   * 
   * @param assemblyDir the base directory of the stack.
   * @param asset the metadata describing the asset.
   * @param toolkitInfo the runtime configuration of the cdk.
   * @param reuse wether or not this asset has already been procesed.
   * @param ci wether or not the deployment is running in a CI process.
   */
  prepare(
    assemblyDir: string, 
    asset: cxapi.AssetMetadataEntry, 
    toolkitInfo: ToolkitInfo, 
    reuse: boolean, 
    ci?: boolean
  ): Promise<CloudFormation.Parameter[]>;

}
