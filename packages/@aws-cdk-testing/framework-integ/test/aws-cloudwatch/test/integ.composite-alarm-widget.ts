import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import {
  Alarm,
  AlarmRule,
  AlarmState,
  AlarmWidget,
  CompositeAlarm,
  Metric,
} from 'aws-cdk-lib/aws-cloudwatch';

/**
 * Integration test for composite alarm widget support
 *
 * This test verifies that:
 * 1. A regular alarm renders as a 'metric' type widget
 * 2. A composite alarm renders as an 'alarm' type widget
 * 3. An imported composite alarm renders as an 'alarm' type widget
 */
class CompositeAlarmWidgetIntegrationTest extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create a test metric
    const testMetric = new Metric({
      namespace: 'CDK/Test',
      metricName: 'Metric',
    });

    // Create a regular alarm
    const regularAlarm = new Alarm(this, 'RegularAlarm', {
      metric: testMetric,
      threshold: 100,
      evaluationPeriods: 3,
    });

    // Create a composite alarm that depends on the regular alarm
    const compositeAlarm = new CompositeAlarm(this, 'CompositeAlarm', {
      alarmRule: AlarmRule.anyOf(
        AlarmRule.fromAlarm(regularAlarm, AlarmState.ALARM),
      ),
    });

    // Import a composite alarm by ARN
    const importedCompositeAlarm = CompositeAlarm.fromCompositeAlarmArn(
      this,
      'ImportedCompositeAlarm',
      compositeAlarm.alarmArn,
    );

    // Create widgets for testing
    const regularAlarmWidget = new AlarmWidget({
      title: 'Regular Alarm Widget',
      alarm: regularAlarm,
    });

    const compositeAlarmWidget = new AlarmWidget({
      title: 'Composite Alarm Widget',
      alarm: compositeAlarm,
    });

    const importedCompositeAlarmWidget = new AlarmWidget({
      title: 'Imported Composite Alarm Widget',
      alarm: importedCompositeAlarm,
    });

    // The widgets will be serialized to CloudFormation template
    // and we can verify the widget types in the snapshot
    this.node.addMetadata('regularAlarmWidgetType', regularAlarmWidget.toJson()[0].type);
    this.node.addMetadata('compositeAlarmWidgetType', compositeAlarmWidget.toJson()[0].type);
    this.node.addMetadata('importedCompositeAlarmWidgetType', importedCompositeAlarmWidget.toJson()[0].type);
  }
}

const app = new App();

new IntegTest(app, 'cdk-integ-composite-alarm-widget', {
  testCases: [
    new CompositeAlarmWidgetIntegrationTest(app, 'CompositeAlarmWidgetIntegrationTest'),
  ],
});
