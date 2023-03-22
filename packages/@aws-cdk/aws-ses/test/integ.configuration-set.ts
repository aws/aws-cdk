import * as sns from '@aws-cdk/aws-sns';
import { App, Stack, StackProps } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as ses from '../lib';
import { CloudWatchDimensionSource, EventDestination } from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const configurationSet = new ses.ConfigurationSet(this, 'ConfigurationSet');

    const topic = new sns.Topic(this, 'Topic');

    configurationSet.addEventDestination('Sns', {
      destination: EventDestination.snsTopic(topic),
    });

    configurationSet.addEventDestination('CloudWatch', {
      destination: EventDestination.cloudWatchDimensions([{
        source: CloudWatchDimensionSource.MESSAGE_TAG,
        name: 'ses:from-domain',
        default: 'no_domain',
      }]),
    });

  }
}

const app = new App();

new integ.IntegTest(app, 'ConfigurationSetInteg', {
  testCases: [new TestStack(app, 'cdk-ses-configuration-set-integ')],
});

app.synth();
