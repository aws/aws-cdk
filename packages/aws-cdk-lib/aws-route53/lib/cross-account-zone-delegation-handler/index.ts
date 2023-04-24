// eslint-disable-next-line import/no-extraneous-dependencies
import { Credentials, Route53, STS } from 'aws-sdk';

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
  UseRegionalStsEndpoint?: string,
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
  const { AssumeRoleArn, ParentZoneId, ParentZoneName, DelegatedZoneName, DelegatedZoneNameServers, TTL, UseRegionalStsEndpoint } = props;

  if (!ParentZoneId && !ParentZoneName) {
    throw Error('One of ParentZoneId or ParentZoneName must be specified');
  }

  const credentials = await getCrossAccountCredentials(AssumeRoleArn, !!UseRegionalStsEndpoint);
  const route53 = new Route53({ credentials });

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
  }).promise();
}

async function getCrossAccountCredentials(roleArn: string, regionalEndpoint: boolean): Promise<Credentials> {
  const sts = new STS(regionalEndpoint ? { stsRegionalEndpoints: 'regional' } : {});
  const timestamp = (new Date()).getTime();

  const { Credentials: assumedCredentials } = await sts
    .assumeRole({
      RoleArn: roleArn,
      RoleSessionName: `cross-account-zone-delegation-${timestamp}`,
    })
    .promise();

  if (!assumedCredentials) {
    throw Error('Error getting assume role credentials');
  }

  return new Credentials({
    accessKeyId: assumedCredentials.AccessKeyId,
    secretAccessKey: assumedCredentials.SecretAccessKey,
    sessionToken: assumedCredentials.SessionToken,
  });
}

async function getHostedZoneIdByName(name: string, route53: Route53): Promise<string> {
  const zones = await route53.listHostedZonesByName({ DNSName: name }).promise();
  const matchedZones = zones.HostedZones.filter(zone => zone.Name === `${name}.`);

  if (matchedZones.length !== 1) {
    throw Error(`Expected one hosted zone to match the given name but found ${matchedZones.length}`);
  }

  return matchedZones[0].Id;
}
