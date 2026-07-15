/* eslint-disable import/no-extraneous-dependencies */
import { GlueClient, CreatePartitionIndexCommand, DeletePartitionIndexCommand, GetPartitionIndexesCommand } from '@aws-sdk/client-glue';

class PartitionIndexError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PartitionIndexError';
  }
}

const glue = new GlueClient({});

async function findPartitionIndex(DatabaseName: string, TableName: string, IndexName: string) {
  // Glue caps partition indexes at 3/table, so results always fit in one page
  const resp = await glue.send(new GetPartitionIndexesCommand({ DatabaseName, TableName }));
  // Glue lowercases index names, so compare case-insensitively
  return (resp.PartitionIndexDescriptorList || []).find(
    (i) => i.IndexName!.toLowerCase() === IndexName.toLowerCase(),
  );
}

export async function onEvent(event: any) {
  const { DatabaseName, TableName, IndexName, Keys } = event.ResourceProperties;

  if (event.RequestType === 'Create') {
    try {
      await glue.send(new CreatePartitionIndexCommand({
        DatabaseName,
        TableName,
        PartitionIndex: { IndexName, Keys },
      }));
    } catch (e: any) {
      // The index may already exist if it was created out-of-band or by a previous
      // resource being replaced (CloudFormation creates the replacement before deleting
      // the old resource). Treat this as success and let isComplete verify its state.
      if (e.name === 'AlreadyExistsException') {
        const existing = await findPartitionIndex(DatabaseName, TableName, IndexName);
        const existingKeys = existing?.Keys?.map((k: any) => k.Name);
        if (!existing || JSON.stringify(existingKeys) !== JSON.stringify(Keys)) {
          throw new PartitionIndexError(
            `Partition index ${IndexName} already exists on ${DatabaseName}.${TableName} with different or reordered keys ` +
              `(existing: ${JSON.stringify(existingKeys)}, requested: ${JSON.stringify(Keys)}). Delete the existing index first.`,
          );
        }
        // eslint-disable-next-line no-console
        console.log(`Partition index ${IndexName} already exists with matching keys - reusing`);
      } else {
        throw e;
      }
    }
    return { PhysicalResourceId: IndexName };
  } else if (event.RequestType === 'Update') {
    // The service API offers no update operation on partition indexes,
    // so here we either throw an error or do nothing, depending on
    // whether there was any change in resource properties.

    const oldKeys = event.OldResourceProperties?.Keys;
    if (JSON.stringify(oldKeys) !== JSON.stringify(Keys)) {
      // For auto-generated index names, this should be unreachable. CDK derives index names from keys, so key changes always produce a new resource
      throw new PartitionIndexError('Partition index keys cannot be updated. Delete and recreate the index instead.');
    }
    return { PhysicalResourceId: IndexName };
  } else if (event.RequestType === 'Delete') {
    try {
      '';
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
    const index = await findPartitionIndex(DatabaseName, TableName, IndexName);
    if (!index) {
      return { IsComplete: true };
    }
    return { IsComplete: false };
  }

  const index = await findPartitionIndex(DatabaseName, TableName, IndexName);

  if (!index) return { IsComplete: false };
  if (index.IndexStatus === 'ACTIVE') return { IsComplete: true };
  if (index.IndexStatus === 'CREATING') return { IsComplete: false };
  if (index.IndexStatus === 'DELETING') return { IsComplete: false };

  const errorDetails = index.BackfillErrors?.length
    ? ` Backfill errors: ${JSON.stringify(index.BackfillErrors)}`
    : '';
  throw new PartitionIndexError(`Partition index ${IndexName} in unexpected state: ${index.IndexStatus}.${errorDetails}`);
}
