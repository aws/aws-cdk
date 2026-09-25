/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import type { IConstruct } from 'constructs';
import type * as bedrockagentcore from '../../../../aws-bedrockagentcore';
import { Token } from '../../../../core';
import { validateFieldPattern, validateStringFieldLength } from '../../common/validation-helpers';
import { MemoryStrategyType } from '../memory-strategy';

/******************************************************************************
 *                              CONSTANTS
 *****************************************************************************/
/**
 * Minimum length for a metadata schema entry key.
 * @internal
 */
const METADATA_KEY_MIN_LENGTH = 1;
/**
 * Maximum length for a metadata schema entry key.
 * @internal
 */
const METADATA_KEY_MAX_LENGTH = 128;
/**
 * Pattern allowed for a metadata schema entry key.
 * @internal
 */
const METADATA_KEY_PATTERN = /^[a-zA-Z0-9\s._:/=+@-]*$/;
/**
 * Minimum number of entries in a metadata schema.
 * @internal
 */
const METADATA_SCHEMA_MIN_ITEMS = 1;
/**
 * Maximum number of entries in a metadata schema.
 * @internal
 */
const METADATA_SCHEMA_MAX_ITEMS = 20;

/******************************************************************************
 *                                 Types
 *****************************************************************************/
/**
 * Supported data types for metadata values.
 */
export enum MetadataValueType {
  /**
   * String value.
   */
  STRING = 'STRING',
  /**
   * List of strings.
   */
  STRING_LIST = 'STRINGLIST',
  /**
   * Numeric value.
   */
  NUMBER = 'NUMBER',
}

/**
 * How a metadata value is populated on memory records.
 */
export enum MetadataExtractionType {
  /**
   * The LLM extracts the value from conversational content.
   */
  LLM_INFERRED = 'LLM_INFERRED',
  /**
   * The value is copied from event metadata without LLM inference.
   *
   * Events with different values are extracted and consolidated separately.
   * The key must be indexed and have type `STRING`.
   */
  STRICTLY_CONSISTENT = 'STRICTLY_CONSISTENT',
}

/**
 * A metadata key indexed for filtering memory records.
 */
export interface IndexedKey {
  /**
   * The metadata key name to index.
   *
   * Must be 1-128 characters and match the pattern `^[a-zA-Z0-9\s._:/=+@-]*$`.
   */
  readonly key: string;
  /**
   * The data type of the indexed key.
   */
  readonly type: MetadataValueType;
}

/**
 * Validation rules for an extracted metadata value.
 *
 * Only one validation type should be set per entry, matching the entry's `type`.
 */
export interface MetadataValidation {
  /**
   * Validation rules for `STRING` values.
   * @default - No string validation
   */
  readonly stringValidation?: StringValidation;
  /**
   * Validation rules for `STRINGLIST` values.
   * @default - No string list validation
   */
  readonly stringListValidation?: StringListValidation;
  /**
   * Validation rules for `NUMBER` values.
   * @default - No number validation
   */
  readonly numberValidation?: NumberValidation;
}

/**
 * Validation rules for string metadata values.
 */
export interface StringValidation {
  /**
   * Allowed string values for this metadata field.
   */
  readonly allowedValues: string[];
}

/**
 * Validation rules for string-list metadata values.
 */
export interface StringListValidation {
  /**
   * Allowed string values that may appear in the list.
   * @default - Any value is allowed
   */
  readonly allowedValues?: string[];
  /**
   * Maximum number of items allowed in the list.
   * @default - No upper bound enforced by validation
   */
  readonly maxItems?: number;
}

/**
 * Validation rules for numeric metadata values.
 */
export interface NumberValidation {
  /**
   * Minimum allowed value (inclusive).
   * @default - No minimum
   */
  readonly minValue?: number;
  /**
   * Maximum allowed value (inclusive).
   * @default - No maximum
   */
  readonly maxValue?: number;
}

/**
 * Configuration for model-based extraction of a metadata value.
 */
export interface LlmExtractionConfig {
  /**
   * Definition for the metadata schema entry.
   *
   * Describes what the metadata field represents so the LLM knows when and how to populate it.
   */
  readonly definition: string;
  /**
   * Instruction passed to the LLM for extraction.
   * @default - Service default instruction
   */
  readonly llmExtractionInstruction?: string;
  /**
   * Validation rules applied to the extracted value.
   * @default - No validation
   */
  readonly validation?: MetadataValidation;
}

/**
 * Configuration for extracting a metadata value from conversational content.
 */
export interface MetadataExtractionConfig {
  /**
   * Model-based extraction using a definition and instructions.
   * @default - No LLM extraction config (service default)
   */
  readonly llmExtractionConfig?: LlmExtractionConfig;
}

/**
 * A metadata field definition within a strategy's schema.
 *
 * The `key` is the metadata field name. To be queryable via metadata filters at search
 * time, the key must match a key in the memory's `indexedKeys`.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-properties-bedrockagentcore-memory-metadataschemaentry.html
 */
export interface MetadataSchemaEntry {
  /**
   * The metadata field name.
   *
   * Must be 1-128 characters and match the pattern `^[a-zA-Z0-9\s._:/=+@-]*$`.
   */
  readonly key: string;
  /**
   * The data type of this metadata value.
   * @default - The service determines the value type
   */
  readonly type?: MetadataValueType;
  /**
   * Whether the value is inferred by the LLM or copied from event metadata.
   *
   * `STRICTLY_CONSISTENT` requires an indexed `STRING` key and cannot be combined
   * with `extractionConfig`. A strategy supports at most three such keys.
   * Supported by semantic, user preference, and episodic strategies, including
   * custom overrides, but not summarization strategies.
   *
   * @default - The service uses LLM_INFERRED
   */
  readonly extractionType?: MetadataExtractionType;
  /**
   * Configuration controlling how this metadata value is extracted.
   *
   * Applicable only to LLM-inferred metadata.
   * @default - Service default extraction
   */
  readonly extractionConfig?: MetadataExtractionConfig;
}

/******************************************************************************
 *                                 Helpers
 *****************************************************************************/
/**
 * Renders an array of metadata schema entries to its CloudFormation representation.
 *
 * Returns `undefined` when no entries are provided so that the property is omitted from
 * the resulting template.
 *
 * @internal
 */
export function renderMemoryRecordSchema(
  entries?: MetadataSchemaEntry[],
): bedrockagentcore.CfnMemory.MemoryRecordSchemaProperty | undefined {
  if (!entries) {
    return undefined;
  }
  // A token-encoded list cannot be mapped entry-by-entry; the L2 entry shape is
  // field-compatible with the L1 shape, so pass the token through for resolution.
  if (Token.isUnresolved(entries)) {
    return { metadataSchema: entries };
  }
  if (entries.length === 0) {
    return undefined;
  }
  return {
    metadataSchema: entries.map(renderMetadataSchemaEntry),
  };
}

function renderMetadataSchemaEntry(
  entry: MetadataSchemaEntry,
): bedrockagentcore.CfnMemory.MetadataSchemaEntryProperty {
  if (Token.isUnresolved(entry)) {
    return entry;
  }
  return {
    key: entry.key,
    type: entry.type,
    extractionType: entry.extractionType,
    extractionConfig: entry.extractionConfig
      ? renderExtractionConfig(entry.extractionConfig)
      : undefined,
  };
}

function renderExtractionConfig(
  config: MetadataExtractionConfig,
): bedrockagentcore.CfnMemory.ExtractionConfigProperty | undefined {
  if (Token.isUnresolved(config)) {
    return config;
  }
  if (!config.llmExtractionConfig) {
    return undefined;
  }
  return {
    llmExtractionConfig: {
      definition: config.llmExtractionConfig.definition,
      llmExtractionInstruction: config.llmExtractionConfig.llmExtractionInstruction,
      validation: config.llmExtractionConfig.validation,
    },
  };
}

/**
 * Validates a metadata schema array.
 *
 * @internal
 */
export function validateMetadataSchema(
  entries?: MetadataSchemaEntry[],
  scope?: IConstruct,
  strategyType?: MemoryStrategyType,
): string[] {
  const errors: string[] = [];
  if (!entries) {
    return errors;
  }
  if (Token.isUnresolved(entries)) {
    return errors;
  }
  if (entries.length < METADATA_SCHEMA_MIN_ITEMS || entries.length > METADATA_SCHEMA_MAX_ITEMS) {
    errors.push(
      `Metadata schema must contain between ${METADATA_SCHEMA_MIN_ITEMS} and ${METADATA_SCHEMA_MAX_ITEMS} entries, got ${entries.length}`,
    );
  }
  const seenKeys = new Set<string>();
  let deterministicKeys = 0;
  for (const entry of entries) {
    if (Token.isUnresolved(entry)) {
      continue;
    }
    errors.push(...validateMetadataSchemaEntry(entry, scope));
    if (entry.extractionType === MetadataExtractionType.STRICTLY_CONSISTENT) {
      deterministicKeys++;
    }
    if (entry.key != null && !Token.isUnresolved(entry.key)) {
      if (seenKeys.has(entry.key)) {
        errors.push(`Metadata schema contains duplicate key "${entry.key}"`);
      }
      seenKeys.add(entry.key);
    }
  }
  if (deterministicKeys > 3) {
    errors.push(`metadata schema supports at most 3 STRICTLY_CONSISTENT keys, got ${deterministicKeys}`);
  }
  if (deterministicKeys > 0 && strategyType === MemoryStrategyType.SUMMARIZATION) {
    errors.push('STRICTLY_CONSISTENT metadata is not supported by summarization strategies');
  }
  return errors;
}

/**
 * Validates the metadata keys indexed by a memory.
 * @internal
 */
export function validateIndexedKeys(keys?: IndexedKey[], scope?: IConstruct): string[] {
  if (keys === undefined || Token.isUnresolved(keys)) {
    return [];
  }
  const errors: string[] = [];
  if (keys.length < 1 || keys.length > 10) {
    errors.push(`indexedKeys must contain between 1 and 10 keys, got ${keys.length}`);
  }
  const seenKeys = new Set<string>();
  for (const entry of keys) {
    if (Token.isUnresolved(entry)) {
      continue;
    }
    errors.push(...validateStringFieldLength({
      value: entry.key,
      fieldName: 'Indexed metadata key',
      minLength: METADATA_KEY_MIN_LENGTH,
      maxLength: METADATA_KEY_MAX_LENGTH,
    }, scope));
    errors.push(...validateFieldPattern(entry.key, 'Indexed metadata key', METADATA_KEY_PATTERN, undefined, scope));
    if (entry.key !== undefined && !Token.isUnresolved(entry.key)) {
      if (seenKeys.has(entry.key)) {
        errors.push(`indexedKeys contains duplicate key ${JSON.stringify(entry.key)}`);
      }
      seenKeys.add(entry.key);
    }
  }
  return errors;
}

function validateMetadataSchemaEntry(entry: MetadataSchemaEntry, scope?: IConstruct): string[] {
  const errors: string[] = [];
  errors.push(...validateStringFieldLength({
    value: entry.key,
    fieldName: 'Metadata schema entry key',
    minLength: METADATA_KEY_MIN_LENGTH,
    maxLength: METADATA_KEY_MAX_LENGTH,
  }, scope));
  errors.push(...validateFieldPattern(entry.key, 'Metadata schema entry key', METADATA_KEY_PATTERN, undefined, scope));
  if (entry.extractionType === MetadataExtractionType.STRICTLY_CONSISTENT) {
    if (entry.type !== undefined && !Token.isUnresolved(entry.type) && entry.type !== MetadataValueType.STRING) {
      errors.push(`STRICTLY_CONSISTENT metadata must use type STRING, got ${JSON.stringify(entry.type)}`);
    }
    if (entry.extractionConfig !== undefined && !Token.isUnresolved(entry.extractionConfig)) {
      errors.push('STRICTLY_CONSISTENT metadata cannot specify extractionConfig');
    }
  }
  if (entry.extractionConfig?.llmExtractionConfig) {
    errors.push(...validateLlmExtractionConfig(entry.extractionConfig.llmExtractionConfig, entry.type, scope));
  }
  return errors;
}

const EXPECTED_VALIDATION_FIELD: Record<MetadataValueType, string> = {
  [MetadataValueType.STRING]: 'stringValidation',
  [MetadataValueType.STRING_LIST]: 'stringListValidation',
  [MetadataValueType.NUMBER]: 'numberValidation',
};

function validateLlmExtractionConfig(config: LlmExtractionConfig, entryType?: MetadataValueType, _scope?: IConstruct): string[] {
  const errors: string[] = [];
  if (config.definition == null || (!Token.isUnresolved(config.definition) && config.definition.length === 0)) {
    errors.push('LLM extraction config definition must not be empty');
  }
  if (config.validation !== undefined && !Token.isUnresolved(config.validation)) {
    const setFields: Array<{ field: string; matchesType: MetadataValueType }> = [];
    if (config.validation.stringValidation !== undefined) {
      setFields.push({ field: 'stringValidation', matchesType: MetadataValueType.STRING });
    }
    if (config.validation.stringListValidation !== undefined) {
      setFields.push({ field: 'stringListValidation', matchesType: MetadataValueType.STRING_LIST });
    }
    if (config.validation.numberValidation !== undefined) {
      setFields.push({ field: 'numberValidation', matchesType: MetadataValueType.NUMBER });
    }
    if (setFields.length === 0) {
      errors.push('validation must set exactly one of stringValidation, stringListValidation or numberValidation, got none');
    } else if (setFields.length > 1) {
      errors.push(`validation must set exactly one of stringValidation, stringListValidation or numberValidation, got ${setFields.map(f => f.field).join(', ')}`);
    } else if (entryType !== undefined && !Token.isUnresolved(entryType) && setFields[0].matchesType !== entryType) {
      errors.push(`validation must use ${EXPECTED_VALIDATION_FIELD[entryType]} to match the entry type ${entryType}, got ${setFields[0].field}`);
    }
  }
  if (config.validation?.numberValidation) {
    const { minValue, maxValue } = config.validation.numberValidation;
    if (
      minValue !== undefined && maxValue !== undefined
      && !Token.isUnresolved(minValue) && !Token.isUnresolved(maxValue)
      && minValue > maxValue
    ) {
      errors.push(`Number validation minValue (${minValue}) must be less than or equal to maxValue (${maxValue})`);
    }
  }
  if (config.validation?.stringListValidation?.maxItems !== undefined) {
    const maxItems = config.validation.stringListValidation.maxItems;
    if (!Token.isUnresolved(maxItems) && maxItems < 0) {
      errors.push(`String list validation maxItems must be non-negative, got ${maxItems}`);
    }
  }
  return errors;
}
