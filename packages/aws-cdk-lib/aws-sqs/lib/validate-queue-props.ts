import { Construct } from 'constructs';
import { Queue, QueueProps, RedriveAllowPolicy, RedrivePermission } from './index';
import { Token } from '../../core';
import { validateAllProps, ValidationRule } from '../../core/lib/helpers-internal';

function validateRange(value: number | undefined, minValue: number, maxValue: number): boolean {
  return value !== undefined && !Token.isUnresolved(value) && (value < minValue || value > maxValue);
}

const queueValidationRules: ValidationRule<QueueProps>[] = [
  {
    condition: (props) => validateRange(props.deliveryDelay?.toSeconds(), 0, 900),
    message: (props) => `delivery delay must be between 0 and 900 seconds, but ${props.deliveryDelay?.toSeconds()} was provided`,
  },
  {
    condition: (props) => validateRange(props.maxMessageSizeBytes, 1_024, 1_048_576),
    message: (props) => `maximum message size must be between 1,024 and 1,048,576 bytes, but ${props.maxMessageSizeBytes} was provided`,
  },
  {
    condition: (props) => validateRange(props.retentionPeriod?.toSeconds(), 60, 1_209_600),
    message: (props) => `message retention period must be between 60 and 1,209,600 seconds, but ${props.retentionPeriod?.toSeconds()} was provided`,
  },
  {
    condition: (props) => validateRange(props.receiveMessageWaitTime?.toSeconds(), 0, 20),
    message: (props) => `receive wait time must be between 0 and 20 seconds, but ${props.receiveMessageWaitTime?.toSeconds()} was provided`,
  },
  {
    condition: (props) => validateRange(props.visibilityTimeout?.toSeconds(), 0, 43_200),
    message: (props) => `visibility timeout must be between 0 and 43,200 seconds, but ${props.visibilityTimeout?.toSeconds()} was provided`,
  },
  {
    condition: (props) => validateRange(props.deadLetterQueue?.maxReceiveCount, 1, Number.MAX_SAFE_INTEGER),
    message: (props) => `dead letter target maximum receive count must be 1 or more, but ${props.deadLetterQueue?.maxReceiveCount} was provided`,
  },
];

const redriveValidationRules: ValidationRule<RedriveAllowPolicy>[] = [
  {
    condition: ({ redrivePermission, sourceQueues }) =>
      redrivePermission === RedrivePermission.BY_QUEUE && (!sourceQueues || sourceQueues.length === 0),
    message: () => 'At least one source queue must be specified when RedrivePermission is set to \'byQueue\'',
  },
  {
    condition: ({ redrivePermission, sourceQueues }) =>
      !!(redrivePermission === RedrivePermission.BY_QUEUE && sourceQueues && sourceQueues.length > 10),
    message: () => 'Up to 10 sourceQueues can be specified. Set RedrivePermission to \'allowAll\' to specify more',
  },
  {
    condition: ({ redrivePermission, sourceQueues }) =>
      !!((redrivePermission === RedrivePermission.ALLOW_ALL || redrivePermission === RedrivePermission.DENY_ALL) && sourceQueues),
    message: () => 'sourceQueues cannot be configured when RedrivePermission is set to \'allowAll\' or \'denyAll\'',
  },
];

export function validateQueueProps(scope: Construct, props: QueueProps) {
  validateAllProps(scope, Queue.name, props, queueValidationRules);
}

export function validateRedriveAllowPolicy(scope: Construct, policy: RedriveAllowPolicy) {
  validateAllProps(scope, Queue.name, policy, redriveValidationRules);
}
