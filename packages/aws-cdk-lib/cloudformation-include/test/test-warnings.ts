import type { IConstruct } from 'constructs';
import { Validations } from '../../core/lib/validation';

export function acknowledgeTestWarnings(construct: IConstruct) {
  Validations.of(construct).acknowledge(...[
    'E1041',
    'E2001',
    'E3045',
    'F0005',
    'F0013',
    'F0014',
    'F1029',
    'F2002',
    'F2012',
    'F2015',
    'F3002',
    'F3002',
    'F3003',
    'F3004',
    'F3012',
    'F3014',
    'W1020',
    'W1102',
    'W2531',
    'W3011',
    'W3045',
    'W9003',
  ].map(code => ({
    id: `CloudFormation-Validate::${code}`,
    reason: 'These tests validate the ingestion of templates into CDK. Whether the properties are valid or not is irrelevant',
  })));
}
