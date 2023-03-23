import { Token } from '@aws-cdk/core';
import { RegionInfo } from '@aws-cdk/region-info';

export function EcrPublicAvailable(region: any): boolean {
  if (region && !Token.isUnresolved(region)) {
    return RegionInfo.get(region).ecrPublicAvailable;
  } else {
    return true;
  }
}