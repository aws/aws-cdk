import { Inspector2Client, EnableCommand, BatchGetAccountStatusCommand, type ResourceScanType } from '@aws-sdk/client-inspector2';

const client = new Inspector2Client();
const POLL_INTERVAL_MS = 5_000;
const MAX_POLLS = 50;

const RESOURCE_KEY: Record<string, string> = {
  EC2: 'ec2',
  ECR: 'ecr',
  LAMBDA: 'lambda',
  LAMBDA_CODE: 'lambdaCode',
};

export async function handler(event: any) {
  const resourceTypes = event.ResourceProperties.resourceTypes as ResourceScanType[];

  if (event.RequestType === 'Delete') {
    return { PhysicalResourceId: event.PhysicalResourceId };
  }

  await client.send(new EnableCommand({ resourceTypes }));

  for (let i = 0; i < MAX_POLLS; i++) {
    const { accounts } = await client.send(new BatchGetAccountStatusCommand({}));
    const account = accounts?.[0];
    if (account) {
      const allEnabled = resourceTypes.every((rt) => {
        const key = RESOURCE_KEY[rt];
        return key && (account.resourceState as any)?.[key]?.status === 'ENABLED';
      });
      if (allEnabled) {
        return { PhysicalResourceId: `EnableInspector-${resourceTypes.join('-')}` };
      }
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }

  throw new Error(`Inspector did not reach ENABLED for [${resourceTypes}] within timeout`);
}
