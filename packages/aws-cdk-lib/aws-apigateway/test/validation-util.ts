import type { IConstruct } from 'constructs';
import * as cdk from '../../core';

/**
 * Acknowledge validation rules that fire on aws-apigateway test infrastructure patterns.
 */
export function acknowledgeTestValidationRules(scope: IConstruct) {
  cdk.Validations.of(scope).acknowledge(
    { id: 'CloudFormation-Validate::E2533', reason: 'Placeholder ARNs and values used in tests do not match patterns' },
    { id: 'CloudFormation-Validate::E3019', reason: 'Ref values do not resolve to valid ARNs in test stacks' },
    { id: 'CloudFormation-Validate::E3660', reason: 'Mixing inline API definitions with Body/BodyS3Location is intentional in tests' },
    { id: 'CloudFormation-Validate::E9004', reason: 'Required property intentionally omitted in tests' },
    { id: 'CloudFormation-Validate::F3003', reason: 'Duplicate primary identifiers are intentional in tests' },
    { id: 'CloudFormation-Validate::W2001', reason: 'Unreferenced parameters are expected in test stacks' },
    { id: 'CloudFormation-Validate::W2531', reason: 'Hardcoded ARNs are expected in tests' },
    { id: 'CloudFormation-Validate::W3660', reason: 'Mixing inline API definitions with Body/BodyS3Location is intentional in tests' },
    { id: 'CloudFormation-Validate::W9002', reason: 'Deprecated properties used intentionally in tests' },
    { id: 'CloudFormation-Validate::W9013', reason: 'Duplicate values are intentional in tests' },
  );
}
