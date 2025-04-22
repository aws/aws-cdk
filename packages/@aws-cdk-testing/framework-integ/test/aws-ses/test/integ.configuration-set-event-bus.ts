import { App, Duration, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as events from 'aws-cdk-lib/aws-events';
import * as ses from 'aws-cdk-lib/aws-ses';

const app = new App();
const stack = new Stack(app, 'ses-configuration-set-event-bus');

const configurationSet = new ses.ConfigurationSet(stack, 'ConfigurationSet', {
  maxDeliveryDuration: Duration.minutes(10),
});

const bus = events.EventBus.fromEventBusName(stack, 'EventBus', 'default');

configurationSet.addEventDestination('EventBridge', {
  destination: ses.EventDestination.eventBus(bus),
});

const integTest = new IntegTest(app, 'ses-configuration-set-event-bus-test', {
  testCases: [stack],
});

integTest.assertions.awsApiCall('sesv2', 'getConfigurationSetEventDestinations', {
  ConfigurationSetName: configurationSet.configurationSetName,
}).expect(ExpectedResult.objectLike({
  EventDestinations: Match.arrayWith([
    Match.objectLike({
      Enabled: true,
      EventBridgeDestination: {
        EventBusArn: bus.eventBusArn,
      },
    }),
  ]),
}));
