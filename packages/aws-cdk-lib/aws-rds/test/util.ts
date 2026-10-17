import type { IConstruct } from 'constructs';
import { Validations } from '../../core';

/**
 * Acknowledge validation rules that fire on aws-rds test infrastructure patterns.
 */
export function acknowledgeTestValidationRules(scope: IConstruct) {
  Validations.of(scope).acknowledge(
    { id: 'CloudFormation-Validate::E9006', reason: 'Tests may have outdated values for component versions' },
  );
}
