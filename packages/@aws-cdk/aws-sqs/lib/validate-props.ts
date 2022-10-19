import { Token } from '@aws-cdk/core';
import { QueueProps } from './index';

export function validateProps(props: QueueProps) {
  validateRange('delivery delay', props.deliveryDelay && props.deliveryDelay.toSeconds(), 0, 900, 'seconds');
  validateRange('maximum message size', props.maxMessageSizeBytes, 1_024, 262_144, 'bytes');
  validateRange('message retention period', props.retentionPeriod && props.retentionPeriod.toSeconds(), 60, 1_209_600, 'seconds');
  validateRange('receive wait time', props.receiveMessageWaitTime && props.receiveMessageWaitTime.toSeconds(), 0, 20, 'seconds');
  validateRange('visibility timeout', props.visibilityTimeout && props.visibilityTimeout.toSeconds(), 0, 43_200, 'seconds');
  validateRange('dead letter target maximum receive count', props.deadLetterQueue && props.deadLetterQueue.maxReceiveCount, 1, +Infinity);
}

function validateRange(label: string, value: number | undefined, minValue: number, maxValue: number, unit?: string) {
  if (value === undefined || Token.isUnresolved(value)) { return; }
  const unitSuffix = unit ? ` ${unit}` : '';
  if (value < minValue) { throw new Error(`${label} must be ${minValue}${unitSuffix} or more, but ${value} was provided`); }
  if (value > maxValue) { throw new Error(`${label} must be ${maxValue}${unitSuffix} or less, but ${value} was provided`); }
}
