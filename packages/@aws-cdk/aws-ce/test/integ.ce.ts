import * as sns from '@aws-cdk/aws-sns';
import { App, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as ce from '../lib/';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: {}) {
    super(scope, id, props);

    const defaultMonitor = new ce.AnomalyMonitor(this, 'anomaly-monitor', {});

    const customMonitor = new ce.AnomalyMonitor(this, 'custom-anomaly-monitor', {
      type: ce.MonitorType.CUSTOM,
      specification: JSON.stringify({
        Dimensions: {
          Key: 'LINKED_ACCOUNT',
          Values: ['123456789012'],
        },
      }),
    });

    const costCategory = new ce.CostCategory(this, 'cost-category', {
      rules: JSON.stringify([{
        Type: 'REGULAR',
        Value: 'ServiceIsAmazonEC2',
        // DefaultValue: 'ThisIsNotSupportedViaCloudFormation',
        Rule: {
          Dimensions: {
            Key: 'SERVICE_CODE',
            Values: ['AmazonEC2'],
            MatchOptions: ['EQUALS'],
          },
        },
      }]),
    });

    const customMonitorWithCostCategory = new ce.AnomalyMonitor(this, 'custom-anomaly-monitor-with-cost-category', {
      specification: JSON.stringify({
        CostCategories: {
          Key: costCategory.costCategoryName,
          Values: ['ServiceIsAmazonEC2'],
        },
      }),
    });

    new ce.AnomalySubscription(this, 'subscription', {
      frequency: ce.Frequency.IMMEDIATE,
      monitors: [defaultMonitor, customMonitor, customMonitorWithCostCategory],
      subscribers: [
        new ce.SnsTopic(new sns.Topic(this, 'Topic')),
      ],
      threshold: 5,
    });

  }
}

const app = new App();

new TestStack(app, 'aws-cost-explorer');

// Note that you can have only *one* dimensional monitor per account (at least with default quotas).
app.synth();
