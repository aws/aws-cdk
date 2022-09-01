import { arrayDiff } from './diff';
import { external } from './external';

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  if (event.RequestType === 'Create') { return onCreate(event); }
  if (event.RequestType === 'Update') { return onUpdate(event); }
  if (event.RequestType === 'Delete') { return onDelete(event); }
  throw new Error('invalid request type');
}

async function onCreate(event: AWSLambda.CloudFormationCustomResourceCreateEvent) {
  const issuerUrl = event.ResourceProperties.Url;
  const thumbprints: string[] = (event.ResourceProperties.ThumbprintList ?? []).sort(); // keep sorted for UPDATE
  const clients: string[] = (event.ResourceProperties.ClientIDList ?? []).sort();

  if (thumbprints.length === 0) {
    thumbprints.push(await external.downloadThumbprint(issuerUrl));
  }

  const resp = await external.createOpenIDConnectProvider({
    Url: issuerUrl,
    ClientIDList: clients,
    ThumbprintList: thumbprints,
  });

  return {
    PhysicalResourceId: resp.OpenIDConnectProviderArn,
  };
}

async function onUpdate(event: AWSLambda.CloudFormationCustomResourceUpdateEvent) {
  const issuerUrl = event.ResourceProperties.Url;
  const thumbprints: string[] = (event.ResourceProperties.ThumbprintList ?? []).sort(); // keep sorted for UPDATE
  const clients: string[] = (event.ResourceProperties.ClientIDList ?? []).sort();

  // determine which update we are talking about.
  const oldIssuerUrl = event.OldResourceProperties.Url;

  // if this is a URL update, then we basically create a new resource and cfn will delete the old one
  // since the physical resource ID will change.
  if (oldIssuerUrl !== issuerUrl) {
    return onCreate({ ...event, RequestType: 'Create' });
  }

  const providerArn = event.PhysicalResourceId;

  // if thumbprints changed, we can update in-place, but bear in mind that if the new thumbprint list
  // is empty, we will grab it from the server like we do in CREATE
  const oldThumbprints = (event.OldResourceProperties.ThumbprintList || []).sort();
  if (JSON.stringify(oldThumbprints) !== JSON.stringify(thumbprints)) {
    const thumbprintList = thumbprints.length > 0 ? thumbprints : [await external.downloadThumbprint(issuerUrl)];
    external.log('updating thumbprint list from', oldThumbprints, 'to', thumbprints);
    await external.updateOpenIDConnectProviderThumbprint({
      OpenIDConnectProviderArn: providerArn,
      ThumbprintList: thumbprintList,
    });

    // don't return, we might have more updates...
  }

  // if client ID list has changed, determine "diff" because the API is add/remove
  const oldClients: string[] = (event.OldResourceProperties.ClientIDList || []).sort();
  const diff = arrayDiff(oldClients, clients);
  external.log(`client ID diff: ${JSON.stringify(diff)}`);

  for (const addClient of diff.adds) {
    external.log(`adding client id "${addClient}" to provider ${providerArn}`);
    await external.addClientIDToOpenIDConnectProvider({
      OpenIDConnectProviderArn: providerArn,
      ClientID: addClient,
    });
  }

  for (const deleteClient of diff.deletes) {
    external.log(`removing client id "${deleteClient}" from provider ${providerArn}`);
    await external.removeClientIDFromOpenIDConnectProvider({
      OpenIDConnectProviderArn: providerArn,
      ClientID: deleteClient,
    });
  }

  return;
}

async function onDelete(deleteEvent: AWSLambda.CloudFormationCustomResourceDeleteEvent) {
  await external.deleteOpenIDConnectProvider({
    OpenIDConnectProviderArn: deleteEvent.PhysicalResourceId,
  });
}
