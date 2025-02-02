import type * as cxapi from '@aws-cdk/cx-api';
import { ICloudAssemblySource } from './types';

/**
 * A CloudAssemblySource that is representing a already existing and produced CloudAssembly.
 */
export class IdentityCloudAssemblySource implements ICloudAssemblySource {
  public constructor(private readonly cloudAssembly: cxapi.CloudAssembly) {}

  public async produce(): Promise<cxapi.CloudAssembly> {
    return this.cloudAssembly;
  }
}
