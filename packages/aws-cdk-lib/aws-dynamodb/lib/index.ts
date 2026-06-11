// Side-effect import to make sure that the default traits are registered before any of the constructs are used.
import './private/default-traits';

export * from './dynamodb.generated';
export * from './table';
export * from './scalable-attribute-api';
export * from './table-v2';
export * from './table-v2-base';
export * from './shared';
export * from './capacity';
export * from './billing';
export * from './encryption';
export * from './table-grants';
export * from './stream-grants';
