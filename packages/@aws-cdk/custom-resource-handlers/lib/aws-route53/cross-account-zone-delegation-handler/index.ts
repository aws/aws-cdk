// eslint-disable-next-line import/no-extraneous-dependencies
import { Route53 } from '@aws-sdk/client-route-53';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fromTemporaryCredentials } from '@aws-sdk/credential-providers';
// eslint-disable-next-line import/no-extraneous-dependencies
import { route53Region } from '../sts-util';

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
  AssumeRoleRegion?: string,
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
  const { AssumeRoleArn, ParentZoneId, ParentZoneName, DelegatedZoneName, DelegatedZoneNameServers, TTL, AssumeRoleRegion } = props;

  if (!ParentZoneId && !ParentZoneName) {
    throw Error('One of ParentZoneId or ParentZoneName must be specified');
  }

  const timestamp = (new Date()).getTime();
  const route53 = new Route53({
    credentials: fromTemporaryCredentials({
      clientConfig: {
        region: AssumeRoleRegion ?? route53Region(process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? ''),
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
  const matchedZones = zones.HostedZones?.filter(zone => {
    const matchZoneName = zone.Name === `${name}.`;
    const isPublic = zone.Config?.PrivateZone !== true;

    return matchZoneName && isPublic;
  }) ?? [];

  if (matchedZones && matchedZones.length !== 1) {
    throw Error(`Expected one hosted zone to match the given name but found ${matchedZones.length}`);
  }

  // will always be defined because we throw if length !==1
  return matchedZones[0].Id!;
}
