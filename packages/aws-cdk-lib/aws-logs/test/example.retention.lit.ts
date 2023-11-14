import { Stack } from '../../core';
import { LogGroup, RetentionDays } from '../lib';

const stack = new Stack();

function shortLogGroup() {
  /// !show
  // Configure log group for short retention
  const logGroup = new LogGroup(stack, 'LogGroup', {
    retention: RetentionDays.ONE_WEEK,
  });
  /// !hide
  return logGroup;
}

function infiniteLogGroup() {
  /// !show
  // Configure log group for infinite retention
  const logGroup = new LogGroup(stack, 'LogGroup', {
    retention: Infinity,
  });
  /// !hide
  return logGroup;
}

//

Array.isArray(shortLogGroup);
Array.isArray(infiniteLogGroup);
