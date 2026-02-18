// Side-effect import to make sure that the default traits are registered before any of the constructs are used.
import './private/default-traits';

export * from './policy';
export * from './topic';
export * from './topic-base';
export * from './subscription';
export * from './subscriber';
export * from './subscription-filter';
export * from './delivery-policy';

// AWS::SNS CloudFormation Resources:
export * from './sns.generated';
export * from './sns-grants.generated';

import './sns-augmentations.generated';
