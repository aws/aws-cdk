// eslint-disable-next-line import/no-extraneous-dependencies
import { Route53 } from '@aws-sdk/client-route-53';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fromTemporaryCredentials } from '@aws-sdk/credential-providers';

export type CrossAccountZoneDelegationEvent = AWSLambda.CloudFormationCustomResourceEvent & {
  ResourceProperties: ResourceProperties;
  OldResourceProperties?: ResourceProperties;
}

interface ResourceProperties {
  AssumeRoleArn: string,
  ParentZoneName?: string,
  ParentZoneId?: string,
  DelegatedZoneName: string,
  DelegatedZoneNameServers: string[],
  TTL: number,
}

export async function handler(event: CrossAccountZoneDelegationEvent) {
  const resourceProps = event.ResourceProperties;
  switch (event.RequestType) {
    case 'Create':
      return cfnEventHandler(resourceProps, false);
    case 'Update':
      return cfnUpdateEventHandler(resourceProps, event.OldResourceProperties);
    case 'Delete':
      return cfnEventHandler(resourceProps, true);
  }
}

async function cfnUpdateEventHandler(props: ResourceProperties, oldProps: ResourceProperties | undefined) {
  if (oldProps && props.DelegatedZoneName !== oldProps.DelegatedZoneName) {
    await cfnEventHandler(oldProps, true);
  }
  await cfnEventHandler(props, false);
}

async function cfnEventHandler(props: ResourceProperties, isDeleteEvent: boolean) {
  const { AssumeRoleArn, ParentZoneId, ParentZoneName, DelegatedZoneName, DelegatedZoneNameServers, TTL } = props;

  if (!ParentZoneId && !ParentZoneName) {
    throw Error('One of ParentZoneId or ParentZoneName must be specified');
  }

  const timestamp = (new Date()).getTime();
  const route53 = new Route53({
    credentials: fromTemporaryCredentials({
      clientConfig: {
        region: route53Region(process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? ''),
      },
      params: {
        RoleArn: AssumeRoleArn,
        RoleSessionName: `cross-account-zone-delegation-${timestamp}`,
      },
    }),
  });

  const parentZoneId = ParentZoneId ?? await getHostedZoneIdByName(ParentZoneName!, route53);

  await route53.changeResourceRecordSets({
    HostedZoneId: parentZoneId,
    ChangeBatch: {
      Changes: [{
        Action: isDeleteEvent ? 'DELETE' : 'UPSERT',
        ResourceRecordSet: {
          Name: DelegatedZoneName,
          Type: 'NS',
          TTL,
          ResourceRecords: DelegatedZoneNameServers.map(ns => ({ Value: ns })),
        },
      }],
    },
  });
}

async function getHostedZoneIdByName(name: string, route53: Route53): Promise<string> {
  const zones = await route53.listHostedZonesByName({ DNSName: name });
  const matchedZones = zones.HostedZones?.filter(zone => zone.Name === `${name}.`) ?? [];

  if (matchedZones && matchedZones.length !== 1) {
    throw Error(`Expected one hosted zone to match the given name but found ${matchedZones.length}`);
  }

  // will always be defined because we throw if length !==1
  return matchedZones[0].Id!;
}

/**
 * Return the region that hosts the Route53 endpoint
 *
 * Route53 is a partitional service: the control plane lives in one particular region,
 * which is different for every partition.
 *
 * The SDK knows how to convert a "target region" to a "route53 endpoint", which
 * equates to a (potentially different) region. However, when we use STS
 * AssumeRole credentials, we must grab credentials that will work in that
 * region.
 *
 * By default, STS AssumeRole will call the STS endpoint for the same region
 * as the Lambda runs in. Normally, this is all good. However, when the AssumeRole
 * is used to assume a role in a different account A, the AssumeRole will fail if the
 * Lambda is executing in an an opt-in region R to which account A has not been opted in.
 *
 * To solve this, we will always AssumeRole in the same region as the Route53 call will
 * resolve to.
 */
function route53Region(region: string) {
  const partitions = {
    'cn': 'cn-northwest-1',
    'us-gov': 'us-gov-west-1',
    'us-iso': 'us-iso-east-1',
    'us-isob': 'us-isob-east-1',
  };

  for (const [prefix, mainRegion] of Object.entries(partitions)) {
    if (region.startsWith(`${prefix}-`)) {
      return mainRegion;
    }
  }

  // Default for commercial partition
  return 'us-east-1';
}