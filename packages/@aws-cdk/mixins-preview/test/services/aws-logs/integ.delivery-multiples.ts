import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as events from 'aws-cdk-lib/aws-events';
import { LogGroupLogsDelivery } from '../../../lib/services/aws-logs/logs-delivery';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'VendedLogsMultiplesTest');

// Source Resource
const eventBus = new events.CfnEventBus(stack, 'EventBus', {
  name: 'vended-logs-mixin-event-bus',
  logConfig: {
    includeDetail: 'NONE',
    level: 'ERROR',
  },
});

const logType = 'ERROR_LOGS';

// Destinations
const destinationLogGroupA = new logs.LogGroup(stack, 'DeliveryLogGroupA', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const destinationLogGroupB = new logs.LogGroup(stack, 'DeliveryLogGroupB', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// Setup deliveries
const first = new LogGroupLogsDelivery(destinationLogGroupA).bind(stack, logType, eventBus.attrArn);
const second = new LogGroupLogsDelivery(destinationLogGroupB).bind(stack, logType, eventBus.attrArn);

second.delivery.node.addDependency(first.delivery);

new integ.IntegTest(app, 'DeliveryTest', {
  testCases: [stack],
});
