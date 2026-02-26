import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as events from 'aws-cdk-lib/aws-events';
import { CfnEventBusErrorLogsOutputFormat as outputFormat, CfnEventBusErrorLogsRecordFields as recordFields, CfnEventBusLogsMixin } from '../../../lib/services/aws-events/mixins';
import '../../../lib/with';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'VendedLogsMixinTest');

// Source Resource
const eventBus = new events.EventBus(stack, 'EventBus', {
  eventBusName: 'vended-logs-mixin-event-bus',
  logConfig: {
    includeDetail: events.IncludeDetail.NONE,
    level: events.Level.ERROR,
  },
});

// Destination
const logGroup = new logs.LogGroup(stack, 'DeliveryLogGroup', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// Setup delivery
eventBus.with(CfnEventBusLogsMixin.ERROR_LOGS.toLogGroup(logGroup, {
  outputFormat: outputFormat.LogGroup.JSON,
  recordFields: [
    recordFields.EVENT_BUS_NAME,
    recordFields.LOG_LEVEL,
    recordFields.DETAILS,
    recordFields.RESOURCE_ARN,
  ],
}));

new integ.IntegTest(app, 'DeliveryTest', {
  testCases: [stack],
});
