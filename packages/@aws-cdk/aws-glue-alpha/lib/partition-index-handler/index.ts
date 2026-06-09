// eslint-disable-next-line import/no-extraneous-dependencies
import { GlueClient, CreatePartitionIndexCommand, DeletePartitionIndexCommand, GetPartitionIndexesCommand } from '@aws-sdk/client-glue';

class PartitionIndexError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PartitionIndexError';
  }
}

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
  } else if (event.RequestType === 'Update') {
    const oldKeys = event.OldResourceProperties?.Keys;
    if (JSON.stringify(oldKeys) !== JSON.stringify(Keys)) {
    // For auto-generated index names, this should be unreachable. CDK derives index names from keys, so key changes always produce a new resource
      throw new PartitionIndexError('Partition index keys cannot be updated. Delete and recreate the index instead.');
    }
    return { PhysicalResourceId: IndexName };
  } else if (event.RequestType === 'Delete') {
    try {
      await glue.send(new DeletePartitionIndexCommand({
        DatabaseName,
        TableName,
        IndexName,
      }));
    } catch (e: any) {
      if (e.name === 'EntityNotFoundException') {
        // eslint-disable-next-line no-console
        console.log(`Partition index ${IndexName} not found on ${DatabaseName}.${TableName} - may have been deleted out-of-band`);
      } else {
        throw e;
      }
    }
  }

  return {};
}

export async function isComplete(event: any) {
  const { DatabaseName, TableName, IndexName } = event.ResourceProperties;

  if (event.RequestType === 'Delete') {
    const resp = await glue.send(new GetPartitionIndexesCommand({ DatabaseName, TableName }));
    const index = (resp.PartitionIndexDescriptorList || []).find(
      (i) => i.IndexName!.toLowerCase() === IndexName.toLowerCase(),
    );
    if (!index || index.IndexStatus !== 'DELETING') {
      return { IsComplete: true };
    }
    return { IsComplete: false };
  }

  const resp = await glue.send(new GetPartitionIndexesCommand({ DatabaseName, TableName }));
  // Glue lowercases index names, so compare case-insensitively
  const index = (resp.PartitionIndexDescriptorList || []).find(
    (i) => i.IndexName!.toLowerCase() === IndexName.toLowerCase(),
  );

  if (!index) return { IsComplete: false };
  if (index.IndexStatus === 'ACTIVE') return { IsComplete: true };
  if (index.IndexStatus === 'CREATING') return { IsComplete: false };

  const errorDetails = index.BackfillErrors?.length
    ? ` Backfill errors: ${JSON.stringify(index.BackfillErrors)}`
    : '';
  throw new PartitionIndexError(`Partition index ${IndexName} in unexpected state: ${index.IndexStatus}.${errorDetails}`);
}
