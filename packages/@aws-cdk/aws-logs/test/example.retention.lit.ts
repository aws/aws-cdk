import { Stack } from '@aws-cdk/cdk';
import { LogGroup, RetentionDays } from '../lib';

const stack = new Stack();

function shortLogGroup() {
  /// !show
  // Configure log group for short retention
  const logGroup = new LogGroup(stack, 'LogGroup', {
    retentionDays: RetentionDays.OneWeek
  });
  /// !hide
  return logGroup;
}

function infiniteLogGroup() {
  /// !show
  // Configure log group for infinite retention
  const logGroup = new LogGroup(stack, 'LogGroup', {
    retentionDays: Infinity
  });
  /// !hide
  return logGroup;
}

//

Array.isArray(shortLogGroup);
Array.isArray(infiniteLogGroup);
