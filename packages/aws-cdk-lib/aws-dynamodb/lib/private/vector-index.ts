import type { IConstruct } from 'constructs';
import { Token, ValidationError } from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';
import type { VectorIndexProps } from '../shared';
import { BillingMode, SearchSchemaElementType } from '../shared';

/**
 * Validate a vector index against the table's billing mode and check its
 * dimensions and search schema. `Table` and `TableV2` both call this, so they
 * reject the same input.
 *
 * The search schema check requires unique attribute names, at most one HASH
 * element and at most 18 INLINE_FILTER elements.
 *
 * @param props the properties of the vector index
 * @param billingMode the billing mode of the table
 * @param onDemandSetting the table setting that selects PAY_PER_REQUEST billing, named in the billing mode error
 * @param scope the construct that reports a validation error
 */
export function validateVectorIndexProps(props: VectorIndexProps, billingMode: string, onDemandSetting: string, scope: IConstruct): void {
  const indexName = JSON.stringify(props.indexName);

  // Vector indexes are only supported in on-demand (PAY_PER_REQUEST) billing mode.
  if (billingMode !== BillingMode.PAY_PER_REQUEST) {
    throw new ValidationError(lit`VectorIndexRequiresOnDemand`, `vector index ${indexName} requires ${BillingMode.PAY_PER_REQUEST} billing mode, got ${JSON.stringify(billingMode)} (set ${onDemandSetting} on the table)`, scope);
  }

  if (!Token.isUnresolved(props.dimensions) && (!Number.isInteger(props.dimensions) || props.dimensions < 1 || props.dimensions > 4096)) {
    // String interpolation prints NaN and Infinity, which JSON.stringify() would print as null.
    throw new ValidationError(lit`VectorIndexInvalidDimensions`, `vector index ${indexName} has dimensions ${props.dimensions} (use an integer from 1 to 4096)`, scope);
  }

  if (!props.searchSchema) {
    return;
  }
  if (props.searchSchema.length === 0) {
    throw new ValidationError(lit`VectorIndexEmptySearchSchema`, `vector index ${indexName} has an empty search schema (omit searchSchema or add at least one element)`, scope);
  }
  const seen = new Set<string>();
  let hashCount = 0;
  let inlineFilterCount = 0;
  for (const element of props.searchSchema) {
    if (seen.has(element.attribute.name)) {
      throw new ValidationError(lit`VectorIndexDuplicateSearchSchemaAttribute`, `vector index ${indexName} lists the search schema attribute ${JSON.stringify(element.attribute.name)} more than once (list each attribute once)`, scope);
    }
    seen.add(element.attribute.name);
    if (element.type === SearchSchemaElementType.HASH) {
      hashCount++;
    }
    if (element.type === SearchSchemaElementType.INLINE_FILTER) {
      inlineFilterCount++;
    }
  }
  if (hashCount > 1) {
    throw new ValidationError(lit`VectorIndexMultipleHashElements`, `vector index ${indexName} can have at most one HASH search schema element, got ${hashCount} (keep one HASH element)`, scope);
  }
  // DynamoDB allows at most 18 inline filters per vector index, and the quota is not adjustable.
  if (inlineFilterCount > 18) {
    throw new ValidationError(lit`VectorIndexTooManyInlineFilters`, `vector index ${indexName} can have at most 18 INLINE_FILTER search schema elements, got ${inlineFilterCount} (remove ${inlineFilterCount - 18} of them)`, scope);
  }
}
