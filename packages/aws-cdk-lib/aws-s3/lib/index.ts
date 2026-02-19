// Side-effect import to make sure that the default traits are registered before any of the constructs are used.
import './private/default-traits';

export * from './bucket';
export * from './bucket-grants';
export * from './bucket-policy';
export * from './destination';
export * from './location';
export * from './rule';

// AWS::S3 CloudFormation Resources:
export * from './s3.generated';
