import type { CfnMemory, CfnMemoryProps } from '../../../../aws-bedrockagentcore';
import { Token } from '../../../../core';
import type { IResolvable } from '../../../../core';
import { MetadataExtractionType, MetadataValueType } from '../strategies/metadata-schema';

/**
 * Checks deterministic metadata against the memory's indexed keys after all
 * strategies and L1 property overrides have been configured.
 */
export function validateStrategyIndexedKeys(
  strategy: CfnMemory.MemoryStrategyProperty,
  indexedKeys: CfnMemoryProps['indexedKeys'],
): string[] {
  if (Token.isUnresolved(strategy) || Token.isUnresolved(indexedKeys)) {
    return [];
  }
  const errors: string[] = [];
  for (const config of Object.values(strategy)) {
    if (!config || Token.isUnresolved(config)) {
      continue;
    }
    if ('memoryRecordSchema' in config) {
      errors.push(...validateSchemaIndexedKeys(config.memoryRecordSchema, indexedKeys));
    }
    if ('reflectionConfiguration' in config && config.reflectionConfiguration
      && !Token.isUnresolved(config.reflectionConfiguration)
      && 'memoryRecordSchema' in config.reflectionConfiguration) {
      errors.push(...validateSchemaIndexedKeys(config.reflectionConfiguration.memoryRecordSchema, indexedKeys));
    }
  }
  return errors;
}

function validateSchemaIndexedKeys(
  schema: CfnMemory.MemoryRecordSchemaProperty | IResolvable | undefined,
  indexedKeys: CfnMemoryProps['indexedKeys'],
): string[] {
  if (!schema || Token.isUnresolved(schema) || !('metadataSchema' in schema)
    || Token.isUnresolved(schema.metadataSchema) || !Array.isArray(schema.metadataSchema)) {
    return [];
  }
  if (indexedKeys !== undefined && !Array.isArray(indexedKeys)) {
    return [];
  }
  const keys = indexedKeys ?? [];
  const hasUnresolvedKeys = keys.some(key => Token.isUnresolved(key) || ('key' in key && Token.isUnresolved(key.key)));
  const errors: string[] = [];
  for (const entry of schema.metadataSchema) {
    if (Token.isUnresolved(entry) || !('extractionType' in entry)
      || entry.extractionType !== MetadataExtractionType.STRICTLY_CONSISTENT
      || Token.isUnresolved(entry.key)) {
      continue;
    }
    const indexedKey = keys.find(key => !Token.isUnresolved(key) && 'key' in key && key.key === entry.key);
    if (indexedKey === undefined) {
      if (!hasUnresolvedKeys) {
        errors.push(`STRICTLY_CONSISTENT metadata key ${JSON.stringify(entry.key)} must be included in indexedKeys`);
      }
    } else if ('type' in indexedKey && !Token.isUnresolved(indexedKey.type) && indexedKey.type !== MetadataValueType.STRING) {
      errors.push(`STRICTLY_CONSISTENT metadata key ${JSON.stringify(entry.key)} must be indexed with type STRING, got ${JSON.stringify(indexedKey.type)}`);
    }
  }
  return errors;
}
