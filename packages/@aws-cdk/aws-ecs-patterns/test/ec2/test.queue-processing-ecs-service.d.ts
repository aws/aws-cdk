import { Test } from 'nodeunit';
declare const _default: {
    'test ECS queue worker service construct - with only required props'(test: Test): void;
    'test ECS queue worker service construct - with optional props for queues'(test: Test): void;
    'test ECS queue worker service construct - with optional props'(test: Test): void;
    'can set desiredTaskCount to 0'(test: Test): void;
    'throws if desiredTaskCount and maxScalingCapacity are 0'(test: Test): void;
};
export = _default;
