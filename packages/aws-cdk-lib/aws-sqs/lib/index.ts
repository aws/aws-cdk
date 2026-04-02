// Side-effect import to make sure that the default traits are registered before any of the constructs are used.
import './private/grants';

export * from './policy';
export * from './queue';
export * from './queue-base';

// AWS::SQS CloudFormation Resources:
export * from './sqs.generated';
export * from './sqs-grants.generated';

import './sqs-augmentations.generated';
