import { ComparisonOperator } from '../alarm';

/**
 * Determine whether this operator is an anomaly detection operator.
 *
 * @param operator the comparison operator for the alarm.
 * @returns true if the operator is an anomaly detection operator, false otherwise.
 */
export function isAnomalyDetectionOperator(operator?: ComparisonOperator): boolean {
  const anomalyDetectionOperators: ComparisonOperator[] = [
    ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
    ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD,
    ComparisonOperator.LESS_THAN_LOWER_THRESHOLD,
  ];

  return operator !== undefined && anomalyDetectionOperators.includes(operator);
}
