import { Construct } from 'constructs';
import { QueueProps } from './index';
import { Token } from '../../core';
import { ValidationError } from '../../core/lib/errors';

export function validateProps(scope: Construct, props: QueueProps) {
  validateRange(scope, 'delivery delay', props.deliveryDelay && props.deliveryDelay.toSeconds(), 0, 900, 'seconds');
  validateRange(scope, 'maximum message size', props.maxMessageSizeBytes, 1_024, 262_144, 'bytes');
  validateRange(scope, 'message retention period', props.retentionPeriod && props.retentionPeriod.toSeconds(), 60, 1_209_600, 'seconds');
  validateRange(scope, 'receive wait time', props.receiveMessageWaitTime && props.receiveMessageWaitTime.toSeconds(), 0, 20, 'seconds');
  validateRange(scope, 'visibility timeout', props.visibilityTimeout && props.visibilityTimeout.toSeconds(), 0, 43_200, 'seconds');
  validateRange(scope, 'dead letter target maximum receive count', props.deadLetterQueue && props.deadLetterQueue.maxReceiveCount, 1, +Infinity);
}

function validateRange(scope: Construct, label: string, value: number | undefined, minValue: number, maxValue: number, unit?: string) {
  if (value === undefined || Token.isUnresolved(value)) { return; }
  const unitSuffix = unit ? ` ${unit}` : '';
  if (value < minValue) { throw new ValidationError(`${label} must be ${minValue}${unitSuffix} or more, but ${value} was provided`, scope); }
  if (value > maxValue) { throw new ValidationError(`${label} must be ${maxValue}${unitSuffix} or less, but ${value} was provided`, scope); }
}
