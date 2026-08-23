import type { StackProps } from 'aws-cdk-lib';
import { App, Aspects, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Stream } from 'aws-cdk-lib/aws-kinesis';
import type { SubscriptionFilterSerializationAspectProps } from 'aws-cdk-lib/aws-logs';
import { FilterPattern, LogGroup, SubscriptionFilter, SubscriptionFilterSerializationAspect } from 'aws-cdk-lib/aws-logs';
import { KinesisDestination } from 'aws-cdk-lib/aws-logs-destinations';

interface TestStackProps extends StackProps {
  readonly filterCount: number;
  readonly aspectProps?: SubscriptionFilterSerializationAspectProps;
}

class SubscriptionFilterSerializationIntegStack extends Stack {
  constructor(scope: App, id: string, props: TestStackProps) {
    super(scope, id, props);

    const stream = new Stream(this, 'Stream');

    for (let i = 0; i < props.filterCount; i++) {
      const logGroup = new LogGroup(this, `LogGroup${i}`, {
        removalPolicy: RemovalPolicy.DESTROY,
      });
      new SubscriptionFilter(this, `Subscription${i}`, {
        logGroup,
        destination: new KinesisDestination(stream),
        filterPattern: FilterPattern.allEvents(),
      });
    }

    Aspects.of(this).add(new SubscriptionFilterSerializationAspect(props.aspectProps));
  }
}

const app = new App();
const serializedCase = new SubscriptionFilterSerializationIntegStack(app, 'aws-cdk-subscriptionfilter-serialization-integ', {
  filterCount: 3,
});
const boundedConcurrencyCase = new SubscriptionFilterSerializationIntegStack(app, 'aws-cdk-subscriptionfilter-serialization-concurrency-integ', {
  filterCount: 4,
  aspectProps: { maxConcurrency: 2 },
});

new IntegTest(app, 'integ-test', {
  testCases: [serializedCase, boundedConcurrencyCase],
});
