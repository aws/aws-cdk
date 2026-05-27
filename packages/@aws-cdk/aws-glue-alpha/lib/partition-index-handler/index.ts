import { GlueClient, CreatePartitionIndexCommand, DeletePartitionIndexCommand, GetPartitionIndexesCommand } from '@aws-sdk/client-glue';

const glue = new GlueClient({});

export async function onEvent(event: any) {
  const { DatabaseName, TableName, IndexName, Keys } = event.ResourceProperties;

  if (event.RequestType === 'Create') {
    await glue.send(new CreatePartitionIndexCommand({
      DatabaseName,
      TableName,
      PartitionIndex: { IndexName, Keys },
    }));
    return { PhysicalResourceId: IndexName };
  } else if (event.RequestType === 'Delete') {
    try {
      await glue.send(new DeletePartitionIndexCommand({
        DatabaseName,
        TableName,
        IndexName,
      }));
    } catch (e: any) {
      if (e.name !== 'EntityNotFoundException') throw e;
    }
  }

  return {};
}

export async function isComplete(event: any) {
  if (event.RequestType === 'Delete') {
    return { IsComplete: true };
  }

  const { DatabaseName, TableName, IndexName } = event.ResourceProperties;
  const resp = await glue.send(new GetPartitionIndexesCommand({ DatabaseName, TableName }));
  // Glue lowercases index names, so compare case-insensitively
  const index = (resp.PartitionIndexDescriptorList || []).find(
    (i: any) => i.IndexName.toLowerCase() === IndexName.toLowerCase(),
  );

  if (!index) return { IsComplete: false };
  if (index.IndexStatus === 'ACTIVE') return { IsComplete: true };
  if (index.IndexStatus === 'CREATING') return { IsComplete: false };

  throw new Error(`Partition index ${IndexName} in unexpected state: ${index.IndexStatus}`);
}
