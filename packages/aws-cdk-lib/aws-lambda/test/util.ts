import type { IConstruct } from 'constructs';
import * as cdk from '../../core';

/**
 * Acknowledge validation rules that fire on aws-lambda test infrastructure patterns.
 * Call on the stack (or any ancestor scope) to suppress known false positives.
 */
export function acknowledgeTestValidationRules(scope: IConstruct) {
  cdk.Validations.of(scope).acknowledge(
    { id: 'CloudFormation-Validate::E2533', reason: 'Placeholder ARNs and values used in tests do not match patterns' },
    { id: 'CloudFormation-Validate::E3071', reason: 'Intentionally testing invalid runtime/code combinations' },
    { id: 'CloudFormation-Validate::F0001', reason: 'Empty resource sections are expected in some tests' },
    { id: 'CloudFormation-Validate::F1020', reason: 'Intentionally testing missing required properties' },
    { id: 'CloudFormation-Validate::F3003', reason: 'Duplicate primary identifiers are intentional in tests' },
    { id: 'CloudFormation-Validate::F3030', reason: 'Intentionally testing invalid enum values' },
    { id: 'CloudFormation-Validate::F3031', reason: 'Intentionally testing invalid pattern values' },
    { id: 'CloudFormation-Validate::F3033', reason: 'Intentionally testing invalid string lengths' },
    { id: 'CloudFormation-Validate::W2001', reason: 'Unreferenced parameters are expected in test stacks' },
    { id: 'CloudFormation-Validate::W2530', reason: 'Hardcoded ARNs are expected in tests' },
    { id: 'CloudFormation-Validate::W2531', reason: 'Hardcoded ARNs are expected in tests' },
    { id: 'CloudFormation-Validate::W2533', reason: 'Placeholder values in Ref do not match resource names in tests' },
    { id: 'CloudFormation-Validate::W9002', reason: 'Deprecated properties used intentionally in tests' },
    { id: 'CloudFormation-Validate::W9013', reason: 'Duplicate subnets are intentional in tests' },
    { id: 'CloudFormation-Validate::E3019', reason: 'Ref values do not resolve to valid ARNs in test stacks' },
    { id: 'CloudFormation-Validate::W1030', reason: 'Duplicate resource identifiers are intentional in tests' },
  );
}
