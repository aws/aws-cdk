import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as sns from 'aws-cdk-lib/aws-sns';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const configurationSet = new ses.ConfigurationSet(this, 'ConfigurationSet');

    const topic = new sns.Topic(this, 'Topic');

    configurationSet.addEventDestination('Sns', {
      destination: ses.EventDestination.snsTopic(topic),
    });

    configurationSet.addEventDestination('CloudWatch', {
      destination: ses.EventDestination.cloudWatchDimensions([{
        source: ses.CloudWatchDimensionSource.MESSAGE_TAG,
        name: 'ses:from-domain',
        defaultValue: 'no_domain',
      }]),
    });

  }
}

const app = new App();

new integ.IntegTest(app, 'ConfigurationSetInteg', {
  testCases: [new TestStack(app, 'cdk-ses-configuration-set-integ')],
});

app.synth();
