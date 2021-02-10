import * as ka from '@aws-cdk/aws-kinesisanalytics';
import { PropertyGroups } from '../types';

export function environmentProperties(propertyGroups?: PropertyGroups): ka.CfnApplicationV2.EnvironmentPropertiesProperty | undefined {
  const entries = Object.entries(propertyGroups ?? {});
  if (entries.length === 0) {
    return;
  }

  return {
    propertyGroups: entries.map(([id, map]) => ({
      propertyGroupId: id,
      propertyMap: map,
    })),
  };
}
