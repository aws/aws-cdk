import { Test } from 'nodeunit';
declare const _default: {
    'When Application Load Balancer': {
        'test Fargate loadbalanced construct with default settings'(test: Test): void;
        'test Fargate loadbalanced construct with all settings'(test: Test): void;
        'errors if no essential container in pre-defined task definition'(test: Test): void;
        'errors when setting both taskDefinition and taskImageOptions'(test: Test): void;
        'errors when setting neither taskDefinition nor taskImageOptions'(test: Test): void;
    };
    'When Network Load Balancer': {
        'test Fargate loadbalanced construct with default settings'(test: Test): void;
        'test Fargate loadbalanced construct with all settings'(test: Test): void;
        'errors if no essential container in pre-defined task definition'(test: Test): void;
        'errors when setting both taskDefinition and taskImageOptions'(test: Test): void;
        'errors when setting neither taskDefinition nor taskImageOptions'(test: Test): void;
    };
};
export = _default;
