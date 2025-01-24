import type * as cxapi from '@aws-cdk/cx-api';

export interface ICloudAssemblySource {
  /**
   * Produce a CloudAssembly from the current source
   */
  produce(): Promise<cxapi.CloudAssembly>;
}
