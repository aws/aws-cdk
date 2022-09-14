// eslint-disable-next-line import/no-extraneous-dependencies
import { Redshift } from 'aws-sdk';

const redshift = new Redshift();

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  if (event.RequestType !== 'Delete') {
    return rebootClusterIfRequired(event);
  } else {
    return;
  }
}

async function rebootClusterIfRequired(event: AWSLambda.CloudFormationCustomResourceEvent) {
  const clusterId = event.ResourceProperties?.ClusterId;
  const parameterGroupName = event.ResourceProperties?.ParameterGroupName;
  const clusterDetails = await redshift.describeClusters({ ClusterIdentifier: clusterId }).promise();
  let found = false;
  if (clusterDetails.Clusters?.[0].ClusterParameterGroups === undefined) {
    throw new Error(`Unable to find any Parameter Groups associated with ClusterId "${clusterId}".`);
  }
  for (const group of clusterDetails.Clusters?.[0].ClusterParameterGroups) {
    if (group.ParameterGroupName === parameterGroupName) {
      found = true;
      if (group.ParameterApplyStatus === 'pending-reboot') {
        await redshift.rebootCluster({ ClusterIdentifier: clusterId }).promise();
      } else if (group.ParameterApplyStatus === 'applying') {
        await sleep(60000);
        await rebootClusterIfRequired(event);
      }
      break;
    }
  }
  if (!found) {
    throw new Error(`Unable to find Parameter Group named "${parameterGroupName}" associated with ClusterId "${clusterId}".`);
  }
  return;
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}