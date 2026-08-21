// Side-effect import to make sure that the default traits are registered before any of the constructs are used.
import './private/default-traits';

export * from './cross-account-destination';
export * from './log-group';
export * from './log-stream';
export * from './metric-filter';
export * from './pattern';
export * from './subscription-filter';
export * from './log-retention';
export * from './policy';
export * from './query-definition';
export * from './data-protection-policy';
export * from './field-index-policy';
export * from './transformer';
export * from './account-policy';
export * from './account-policy-subscription-filter';
export * from './account-policy-data-protection';
export * from './account-policy-field-index';
export * from './account-policy-transformer';

// AWS::Logs CloudFormation Resources:
export * from './logs.generated';
export * from './logs-grants.generated';
