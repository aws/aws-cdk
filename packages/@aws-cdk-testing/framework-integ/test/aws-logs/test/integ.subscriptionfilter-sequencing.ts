import type { StackProps } from 'aws-cdk-lib';
import { App, Aspects, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Stream } from 'aws-cdk-lib/aws-kinesis';
import type { SubscriptionFilterSequencingAspectProps } from 'aws-cdk-lib/aws-logs';
import { FilterPattern, LogGroup, SubscriptionFilter, SubscriptionFilterSequencingAspect } from 'aws-cdk-lib/aws-logs';
import { KinesisDestination } from 'aws-cdk-lib/aws-logs-destinations';

interface TestStackProps extends StackProps {
  readonly filterCount: number;
  readonly aspectProps?: SubscriptionFilterSequencingAspectProps;
}

class SubscriptionFilterSequencingIntegStack extends Stack {
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

    Aspects.of(this).add(new SubscriptionFilterSequencingAspect(props.aspectProps));
  }
}

const app = new App();
// Default concurrency (5): 7 filters produce two dependency edges.
const defaultCase = new SubscriptionFilterSequencingIntegStack(app, 'aws-cdk-subscriptionfilter-sequencing-integ', {
  filterCount: 7,
});
// Explicit concurrency: 4 filters over 2 chains.
const boundedConcurrencyCase = new SubscriptionFilterSequencingIntegStack(app, 'aws-cdk-subscriptionfilter-sequencing-concurrency-integ', {
  filterCount: 4,
  aspectProps: { maxConcurrency: 2 },
});

new IntegTest(app, 'integ-test', {
  testCases: [defaultCase, boundedConcurrencyCase],
});
