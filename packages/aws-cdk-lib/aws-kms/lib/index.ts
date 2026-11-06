// Side-effect import to make sure that the default traits are registered before any of the constructs are used.
import './private/default-traits';

export * from './key';
export * from './key-grants';
export * from './key-lookup';
export * from './alias';
export * from './via-service-principal';

// AWS::KMS CloudFormation Resources:
export * from './kms.generated';
