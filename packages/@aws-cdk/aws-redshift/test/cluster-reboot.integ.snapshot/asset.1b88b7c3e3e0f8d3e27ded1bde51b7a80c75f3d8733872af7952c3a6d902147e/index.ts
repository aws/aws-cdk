// eslint-disable-next-line import/no-extraneous-dependencies
import { Redshift } from 'aws-sdk';

const redshift = new Redshift();

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent): Promise<void> {
  if (event.RequestType !== 'Delete') {
    return rebootClusterIfRequired(event.ResourceProperties?.ClusterId, event.ResourceProperties?.ParameterGroupName);
  } else {
    return;
  }
}

async function rebootClusterIfRequired(clusterId: string, parameterGroupName: string): Promise<void> {
  return executeActionForStatus(await getApplyStatus());

  // https://docs.aws.amazon.com/redshift/latest/APIReference/API_ClusterParameterStatus.html
  async function executeActionForStatus(status: string, retryDurationMs?: number): Promise<void> {
    await sleep(retryDurationMs ?? 0);
    if (['pending-reboot', 'apply-deferred', 'apply-error', 'unknown-error'].includes(status)) {
      try {
        await redshift.rebootCluster({ ClusterIdentifier: clusterId }).promise();
      } catch (err: any) {
        if (err.code === 'InvalidClusterState') {
          return await executeActionForStatus(status, 30000);
        } else {
          throw err;
        }
      }
      return;
    } else if (['applying', 'retry'].includes(status)) {
      return executeActionForStatus(await getApplyStatus(), 30000);
    }
    return;
  }

  async function getApplyStatus(): Promise<string> {
    const clusterDetails = await redshift.describeClusters({ ClusterIdentifier: clusterId }).promise();
    if (clusterDetails.Clusters?.[0].ClusterParameterGroups === undefined) {
      throw new Error(`Unable to find any Parameter Groups associated with ClusterId "${clusterId}".`);
    }
    for (const group of clusterDetails.Clusters?.[0].ClusterParameterGroups) {
      if (group.ParameterGroupName === parameterGroupName) {
        return group.ParameterApplyStatus ?? 'retry';
      }
    }
    throw new Error(`Unable to find Parameter Group named "${parameterGroupName}" associated with ClusterId "${clusterId}".`);
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
