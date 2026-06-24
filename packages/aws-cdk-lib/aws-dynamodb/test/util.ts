import type { IConstruct } from 'constructs';
import * as cdk from '../../core';

/**
 * Acknowledge validation rules that fire on aws-dynamodb test infrastructure patterns.
 */
export function acknowledgeTestValidationRules(scope: IConstruct) {
  cdk.Validations.of(scope).acknowledge(
    { id: 'CloudFormation-Validate::W9002', reason: 'Deprecated properties used intentionally in tests' },
    { id: 'CloudFormation-Validate::W9013', reason: 'Duplicate values are intentional in tests' },
  );
}
