import type { CfnMemory } from '../../../../aws-bedrockagentcore';
import { Lazy } from '../../../../core';
import { validateStrategyIndexedKeys } from '../../../lib/memory/private/metadata';

const strategy: CfnMemory.MemoryStrategyProperty = {
  semanticMemoryStrategy: {
    name: 'semantic',
    namespaces: ['/n'],
    memoryRecordSchema: {
      metadataSchema: [{ key: 'department', type: 'STRING', extractionType: 'STRICTLY_CONSISTENT' }],
    },
  },
};

test('defers membership checks when an indexed key entry is unresolved', () => {
  expect(validateStrategyIndexedKeys(strategy, [
    Lazy.any({ produce: () => ({ key: 'department', type: 'STRING' }) }),
  ])).toEqual([]);
});

test('reports a known type mismatch even when another index entry is unresolved', () => {
  expect(validateStrategyIndexedKeys(strategy, [
    Lazy.any({ produce: () => ({ key: 'topic', type: 'STRING' }) }),
    { key: 'department', type: 'NUMBER' },
  ])).toEqual([
    'STRICTLY_CONSISTENT metadata key "department" must be indexed with type STRING, got "NUMBER"',
  ]);
});

test('defers validation of an unresolved strategy', () => {
  expect(validateStrategyIndexedKeys(
    Lazy.any({ produce: () => strategy }) as unknown as CfnMemory.MemoryStrategyProperty,
    undefined,
  )).toEqual([]);
});

test('defers validation of an unresolved metadata schema', () => {
  expect(validateStrategyIndexedKeys({
    semanticMemoryStrategy: {
      name: 'semantic',
      namespaces: ['/n'],
      memoryRecordSchema: Lazy.any({ produce: () => ({ metadataSchema: [] }) }),
    },
  }, undefined)).toEqual([]);
});
