import * as cxapi from '@aws-cdk/cx-api';
import { CloudAssembly } from 'aws-cdk/lib/api/cxapp/cloud-assembly';
import { ICloudAssemblySource } from './types';

/**
 * A single Cloud Assembly wrapped to provide additional stack operations.
 */
export class StackAssembly extends CloudAssembly implements ICloudAssemblySource {
  public async produce(): Promise<cxapi.CloudAssembly> {
    return this.assembly;
  }
}
