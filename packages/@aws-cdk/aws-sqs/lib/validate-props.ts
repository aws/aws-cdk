import { QueueProps } from './index';

export function validateProps(props: QueueProps) {
  validateRange('delivery delay', props.deliveryDelaySec, 0, 900, 'seconds');
  validateRange('maximum message size', props.maxMessageSizeBytes, 1_024, 262_144, 'bytes');
  validateRange('message retention period', props.retentionPeriodSec, 60, 1_209_600, 'seconds');
  validateRange('receive wait time', props.receiveMessageWaitTimeSec, 0, 20, 'seconds');
  validateRange('visibility timeout', props.visibilityTimeoutSec, 0, 43_200, 'seconds');
  validateRange('dead letter target maximum receive count', props.deadLetterQueue && props.deadLetterQueue.maxReceiveCount, 1, +Infinity);
}

function validateRange(label: string, value: number | undefined, minValue: number, maxValue: number, unit?: string) {
  if (value === undefined) { return; }
  const unitSuffix = unit ? ` ${unit}` : '';
  if (value < minValue) { throw new Error(`${label} must be ${minValue}${unitSuffix} or more, but ${value} was provided`); }
  if (value > maxValue) { throw new Error(`${label} must be ${maxValue}${unitSuffix} of less, but ${value} was provided`); }
}
