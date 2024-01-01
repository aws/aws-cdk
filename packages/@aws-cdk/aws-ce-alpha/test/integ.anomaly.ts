import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { AnomalyMonitor, AnomalySubscriber, AnomalySubscription, MonitorType, ThresholdExpression } from '../lib';
import { Topic } from 'aws-cdk-lib/aws-sns';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const tagsMonitor = new AnomalyMonitor(this, 'TagsMonitor', {
      type: MonitorType.costAllocationTag('Key', ['Value1', 'Value2']),
    });

    const costCategoryMonitor = new AnomalyMonitor(this, 'CostCategoryMonitor', {
      type: MonitorType.costCategory('CostCategoryKey', 'CostCategoryValue'),
    });

    const topic = new Topic(this, 'Topic');

    new AnomalySubscription(this, 'Subscription', {
      anomalyMonitors: [tagsMonitor, costCategoryMonitor],
      subscriber: AnomalySubscriber.sns(topic),
      thresholdExpression: ThresholdExpression.aboveUsdAmount(100),
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'CeAnomalyTest', {
  testCases: [new TestStack(app, 'cdk-integ-ce-anomaly')],
});
