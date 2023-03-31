import { Route53 } from 'aws-sdk'; // eslint-disable-line import/no-extraneous-dependencies

interface ResourceProperties {
  HostedZoneId: string;
  RecordName: string;
  RecordType: string;
}

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const resourceProps = event.ResourceProperties as unknown as ResourceProperties;

  // Only delete the existing record when the new one gets created
  if (event.RequestType !== 'Create') {
    return;
  }

  const route53 = new Route53({ apiVersion: '2013-04-01' });

  const listResourceRecordSets = await route53.listResourceRecordSets({
    HostedZoneId: resourceProps.HostedZoneId,
    StartRecordName: resourceProps.RecordName,
    StartRecordType: resourceProps.RecordType,
  }).promise();

  const existingRecord = listResourceRecordSets.ResourceRecordSets
    .find(r => r.Name === resourceProps.RecordName && r.Type === resourceProps.RecordType);

  if (!existingRecord) {
    // There is no existing record, we can safely return
    return;
  }

  const changeResourceRecordSets = await route53.changeResourceRecordSets({
    HostedZoneId: resourceProps.HostedZoneId,
    ChangeBatch: {
      Changes: [{
        Action: 'DELETE',
        ResourceRecordSet: removeUndefinedAndEmpty({
          Name: existingRecord.Name,
          Type: existingRecord.Type,
          TTL: existingRecord.TTL,
          AliasTarget: existingRecord.AliasTarget,
          ResourceRecords: existingRecord.ResourceRecords,
        }),
      }],
    },
  }).promise();

  await route53.waitFor('resourceRecordSetsChanged', { Id: changeResourceRecordSets.ChangeInfo.Id }).promise();

  return {
    PhysicalResourceId: `${existingRecord.Name}-${existingRecord.Type}`,
  };
}

// https://github.com/aws/aws-sdk-js/issues/3411
// https://github.com/aws/aws-sdk-js/issues/3506
function removeUndefinedAndEmpty<T extends { [key: string]: unknown }>(obj: T): T {
  const ret: { [key: string]: any } = {};

  for (const [k, v] of Object.entries(obj)) {
    if (v && (!Array.isArray(v) || v.length !== 0)) {
      ret[k] = v;
    }
  }

  return ret as T;
}
