import * as ka from 'aws-cdk-lib/aws-kinesisanalytics';

export function environmentProperties(
  propertyGroups?: { readonly [propertyId: string]: { [mapKey: string]: string } },
): ka.CfnApplicationV2.EnvironmentPropertiesProperty | undefined {
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
