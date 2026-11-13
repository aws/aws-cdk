import type { IConstruct } from 'constructs';
import { Token, ValidationError } from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';
import type { SystemField } from '../system-field';

/**
 * Validates the length of a `fieldSelectionCriteria` expression.
 *
 * The expression syntax is not checked. CloudWatch Logs validates it when the filter is created.
 *
 * @internal
 */
export function validateFieldSelectionCriteria(scope: IConstruct, criteria?: string): void {
  if (criteria === undefined || Token.isUnresolved(criteria)) {
    return;
  }
  if (criteria.length > 2000) {
    throw new ValidationError(lit`FieldSelectionCriteriaLength`, `fieldSelectionCriteria must be at most 2000 characters long, got ${criteria.length}`, scope);
  }
}

/**
 * Validates a list of system fields against the values a property accepts, and rejects duplicates.
 *
 * @internal
 */
export function validateSystemFields(scope: IConstruct, propertyName: string, fields: SystemField[] | undefined, allowed: SystemField[]): void {
  if (fields === undefined || Token.isUnresolved(fields)) {
    return;
  }
  const seen = new Set<string>();
  for (const field of fields) {
    if (Token.isUnresolved(field)) {
      continue;
    }
    if (!allowed.includes(field)) {
      throw new ValidationError(lit`SystemFieldNotSupported`, `${propertyName} does not support ${JSON.stringify(field)}, use one of: ${allowed.join(', ')}`, scope);
    }
    if (seen.has(field)) {
      throw new ValidationError(lit`SystemFieldDuplicate`, `${propertyName} contains ${JSON.stringify(field)} more than once`, scope);
    }
    seen.add(field);
  }
}
