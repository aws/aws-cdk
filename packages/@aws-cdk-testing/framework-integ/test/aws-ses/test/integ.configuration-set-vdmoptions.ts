import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as ses from 'aws-cdk-lib/aws-ses';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new ses.ConfigurationSet(this, 'ConfigurationSetVdmOptions', {
      vdmOptions: {
        engagementMetrics: true,
        optimizedSharedDelivery: true,
      },
    });

    new ses.ConfigurationSet(this, 'EngagementMetricsOnly', {
      vdmOptions: {
        engagementMetrics: true,
      },
    });

    new ses.ConfigurationSet(this, 'OptimizedSharedDeliberyOnly', {
      vdmOptions: {
        optimizedSharedDelivery: true,
      },
    });
  }
}

const app = new App();

new integ.IntegTest(app, 'ConfigurationSetVdmOptionsInteg', {
  testCases: [new TestStack(app, 'cdk-ses-configuration-set-vdmoptions-integ')],
});

app.synth();
