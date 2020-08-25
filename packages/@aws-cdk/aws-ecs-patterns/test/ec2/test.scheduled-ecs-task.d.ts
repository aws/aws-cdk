import { Test } from 'nodeunit';
declare const _default: {
    'Can create a scheduled Ec2 Task - with only required props'(test: Test): void;
    'Can create a scheduled Ec2 Task - with optional props'(test: Test): void;
    'Scheduled Ec2 Task - with MemoryReservation defined'(test: Test): void;
    'Scheduled Ec2 Task - with Command defined'(test: Test): void;
    'throws if desiredTaskCount is 0'(test: Test): void;
};
export = _default;
