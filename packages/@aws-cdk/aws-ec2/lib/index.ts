/// <reference types="node" />

export * from './connections';
export * from './instance-types';
export * from './machine-image';
export * from './security-group';
export * from './security-group-rule';
export * from './vpc';
export * from './vpc-network-provider';
export * from './vpn';
export * from './vpc-endpoint';

// AWS::EC2 CloudFormation Resources:
export * from './ec2.generated';

import './ec2-augmentations.generated';
