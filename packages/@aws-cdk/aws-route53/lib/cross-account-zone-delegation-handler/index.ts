// eslint-disable-next-line import/no-extraneous-dependencies
import { Credentials, Route53, STS } from 'aws-sdk';

interface ResourceProperties {
  AssumeRoleArn: string,
  ParentZoneId: string,
  DelegatedZoneName: string,
  DelegatedZoneNameServers: string[],
  TTL: number,
}

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const resourceProps = event.ResourceProperties as unknown as ResourceProperties;

  switch (event.RequestType) {
    case 'Create':
    case 'Update':
      return cfnEventHandler(resourceProps, false);
    case 'Delete':
      return cfnEventHandler(resourceProps, true);
  }
}

async function cfnEventHandler(props: ResourceProperties, isDeleteEvent: boolean) {
  const { AssumeRoleArn, ParentZoneId, DelegatedZoneName, DelegatedZoneNameServers, TTL } = props;

  const credentials = await getCrossAccountCredentials(AssumeRoleArn);
  const route53 = new Route53({ credentials });

  await route53.changeResourceRecordSets({
    HostedZoneId: ParentZoneId,
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

async function getCrossAccountCredentials(roleArn: string): Promise<Credentials> {
  const sts = new STS();
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
