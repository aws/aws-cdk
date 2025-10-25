/// !cdk-integ dynamodb-v2-alarm-metrics

/**
 * Integration Test: DynamoDB TableV2 SuccessfulRequestLatency Convenience Methods
 *
 * This test validates the new operation-specific convenience methods for creating
 * SuccessfulRequestLatency metrics on DynamoDB TableV2 instances. These methods
 * solve a cross-language compatibility issue where .NET CDK users couldn't easily
 * provide the required "Operation" dimension for SuccessfulRequestLatency metrics.
 *
 * ┌─────────────────────────────────────────────────────────────────────────────────┐
 * │                    DynamoDB TableV2 Metrics Integration Test                    │
 * └─────────────────────────────────────────────────────────────────────────────────┘
 *
 *                              ┌─────────────────┐
 *                              │   TableV2       │
 *                              │  (DynamoDB)     │
 *                              └─────────┬───────┘
 *                                        │
 *                    ┌───────────────────┼───────────────────┐
 *                    │                   │                   │
 *              ┌─────▼─────┐       ┌─────▼─────┐       ┌─────▼─────┐
 *              │ Existing  │       │    NEW    │       │   Custom  │
 *              │ Methods   │       │ Methods   │       │ Options   │
 *              │ (Control) │       │ (Testing) │       │ (Testing) │
 *              └─────┬─────┘       └─────┬─────┘       └─────┬─────┘
 *                    │                   │                   │
 *        ┌───────────┼───────────┐       │           ┌───────┼───────┐
 *        │           │           │       │           │       │       │
 *   ┌────▼────┐ ┌────▼────┐     │       │      ┌────▼────┐ │  ┌────▼────┐
 *   │Throttle │ │ System  │     │       │      │ GetItem │ │  │ GetItem │
 *   │ Alarm   │ │ Error   │     │       │      │ Custom  │ │  │ Maximum │
 *   │         │ │ Alarm   │     │       │      │ Alarm   │ │  │ Alarm   │
 *   └─────────┘ └─────────┘     │       │      └─────────┘ │  └─────────┘
 *                               │       │                  │
 *                               │   ┌───▼───────────────────▼───┐
 *                               │   │  NEW CONVENIENCE METHODS  │
 *                               │   │                           │
 *                               │   │ ┌─────────────────────┐   │
 *                               │   │ │ GetItem Latency     │   │
 *                               │   │ │ Operation: GetItem  │   │
 *                               │   │ └─────────────────────┘   │
 *                               │   │ ┌─────────────────────┐   │
 *                               │   │ │ PutItem Latency     │   │
 *                               │   │ │ Operation: PutItem  │   │
 *                               │   │ └─────────────────────┘   │
 *                               │   │ ┌─────────────────────┐   │
 *                               │   │ │ Query Latency       │   │
 *                               │   │ │ Operation: Query    │   │
 *                               │   │ └─────────────────────┘   │
 *                               │   │ ┌─────────────────────┐   │
 *                               │   │ │ Scan Latency        │   │
 *                               │   │ │ Operation: Scan     │   │
 *                               │   │ └─────────────────────┘   │
 *                               │   │ ┌─────────────────────┐   │
 *                               │   │ │ Custom Operation    │   │
 *                               │   │ │ Operation: BatchGet │   │
 *                               │   │ └─────────────────────┘   │
 *                               │   └───────────────────────────┘
 *                               │
 *                               └─────────────────────────────────┐
 *                                                                 │
 *                                        ┌────────────────────────▼─────────────────────────┐
 *                                        │           CloudFormation Output                  │
 *                                        │                                                  │
 *                                        │  8 × AWS::CloudWatch::Alarm Resources:          │
 *                                        │  ┌─────────────────────────────────────────────┐ │
 *                                        │  │ • TableThrottleAlarm (Math Expression)     │ │
 *                                        │  │ • TableErrorAlarm (Math Expression)        │ │
 *                                        │  │ • GetItemLatencyAlarm                      │ │
 *                                        │  │   - MetricName: SuccessfulRequestLatency   │ │
 *                                        │  │   - Operation: GetItem                     │ │
 *                                        │  │   - Statistic: Average                     │ │
 *                                        │  │ • PutItemLatencyAlarm                      │ │
 *                                        │  │   - MetricName: SuccessfulRequestLatency   │ │
 *                                        │  │   - Operation: PutItem                     │ │
 *                                        │  │ • QueryLatencyAlarm                        │ │
 *                                        │  │   - MetricName: SuccessfulRequestLatency   │ │
 *                                        │  │   - Operation: Query                       │ │
 *                                        │  │ • ScanLatencyAlarm                         │ │
 *                                        │  │   - MetricName: SuccessfulRequestLatency   │ │
 *                                        │  │   - Operation: Scan                        │ │
 *                                        │  │ • CustomLatencyAlarm                       │ │
 *                                        │  │   - MetricName: SuccessfulRequestLatency   │ │
 *                                        │  │   - Operation: BatchGetItem                │ │
 *                                        │  │ • GetItemCustomAlarm                       │ │
 *                                        │  │   - MetricName: SuccessfulRequestLatency   │ │
 *                                        │  │   - Operation: GetItem                     │ │
 *                                        │  │   - Statistic: Maximum (custom)            │ │
 *                                        │  │   - Period: 300s (custom)                  │ │
 *                                        │  └─────────────────────────────────────────────┘ │
 *                                        └──────────────────────────────────────────────────┘
 *
 * Test Coverage:
 * ═════════════
 *
 * 1. NEW METHODS TESTED:
 *    ✓ metricSuccessfulRequestLatencyForGetItem()
 *    ✓ metricSuccessfulRequestLatencyForPutItem()
 *    ✓ metricSuccessfulRequestLatencyForQuery()
 *    ✓ metricSuccessfulRequestLatencyForScan()
 *    ✓ metricSuccessfulRequestLatencyForOperation(operation: string)
 *
 * 2. VALIDATION POINTS:
 *    ✓ CloudFormation template generation
 *    ✓ Correct AWS::CloudWatch::Alarm resources
 *    ✓ Proper metric dimensions (TableName + Operation)
 *    ✓ Correct namespace (AWS/DynamoDB)
 *    ✓ Default statistic (Average)
 *    ✓ Custom MetricOptions parameter handling
 *    ✓ JSII cross-language compatibility
 *
 * 3. REGRESSION TESTING:
 *    ✓ Existing metricThrottledRequestsForOperations() still works
 *    ✓ Existing metricSystemErrorsForOperations() still works
 *    ✓ No breaking changes to existing functionality
 *
 * Problem Solved:
 * ===============
 * Before: .NET CDK users got "ValidationError: `Operation` dimension must be
 *         passed for the `SuccessfulRequestLatency` metric" because they couldn't
 *         easily provide complex dimension objects through JSII.
 *
 * After:  .NET users can now call simple methods like:
 *         table.MetricSuccessfulRequestLatencyForGetItem()
 *         The Operation dimension is handled internally by the CDK.
 *
 * Related Issue: #34785
 * Related PR: #35527
 */

import { Alarm } from 'aws-cdk-lib/aws-cloudwatch';
import { App, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { AttributeType, Operation, TableV2 } from 'aws-cdk-lib/aws-dynamodb';

export class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new TableV2(this, 'TableV2', {
      partitionKey: { name: 'metric', type: AttributeType.STRING },
    });

    // Test existing TableV2 metric methods for comparison
    const metricTableThrottled = table.metricThrottledRequestsForOperations({
      operations: [Operation.PUT_ITEM, Operation.SCAN],
      period: Duration.minutes(1),
    });
    new Alarm(this, 'TableThrottleAlarm', {
      metric: metricTableThrottled,
      evaluationPeriods: 1,
      threshold: 1,
    });

    const metricTableError = table.metricSystemErrorsForOperations({
      operations: [Operation.PUT_ITEM, Operation.SCAN],
      period: Duration.minutes(1),
    });
    new Alarm(this, 'TableErrorAlarm', {
      metric: metricTableError,
      evaluationPeriods: 1,
      threshold: 1,
    });

    // Test new SuccessfulRequestLatency convenience methods
    const metricGetItemLatency = table.metricSuccessfulRequestLatencyForGetItem({
      period: Duration.minutes(1),
    });
    new Alarm(this, 'GetItemLatencyAlarm', {
      metric: metricGetItemLatency,
      evaluationPeriods: 1,
      threshold: 100, // 100ms threshold
    });

    const metricPutItemLatency = table.metricSuccessfulRequestLatencyForPutItem({
      period: Duration.minutes(1),
    });
    new Alarm(this, 'PutItemLatencyAlarm', {
      metric: metricPutItemLatency,
      evaluationPeriods: 1,
      threshold: 100,
    });

    const metricQueryLatency = table.metricSuccessfulRequestLatencyForQuery({
      period: Duration.minutes(1),
    });
    new Alarm(this, 'QueryLatencyAlarm', {
      metric: metricQueryLatency,
      evaluationPeriods: 1,
      threshold: 100,
    });

    const metricScanLatency = table.metricSuccessfulRequestLatencyForScan({
      period: Duration.minutes(1),
    });
    new Alarm(this, 'ScanLatencyAlarm', {
      metric: metricScanLatency,
      evaluationPeriods: 1,
      threshold: 100,
    });

    const metricCustomLatency = table.metricSuccessfulRequestLatencyForOperation('BatchGetItem', {
      period: Duration.minutes(1),
    });
    new Alarm(this, 'CustomLatencyAlarm', {
      metric: metricCustomLatency,
      evaluationPeriods: 1,
      threshold: 100,
    });

    // Test with custom MetricOptions to validate parameter handling
    const metricGetItemCustom = table.metricSuccessfulRequestLatencyForGetItem({
      period: Duration.minutes(5),
      statistic: 'Maximum',
    });
    new Alarm(this, 'GetItemCustomAlarm', {
      metric: metricGetItemCustom,
      evaluationPeriods: 2,
      threshold: 200,
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'dynamodb-v2-alarm-metrics');

new IntegTest(app, 'dynamodb-v2-alarm-metrics-integ', {
  testCases: [stack],
});

app.synth();
