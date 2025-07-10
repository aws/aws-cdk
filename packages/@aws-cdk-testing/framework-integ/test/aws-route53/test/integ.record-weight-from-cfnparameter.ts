import { App, CfnParameter, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hostedZone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: 'cdk.dev',
    });

    const weightParameterProps = {
      type: 'Number',
      default: 0,
      minValue: 0,
      maxValue: 255,
    };

    [
      { target: '1.2.3.4', weight: new CfnParameter(this, 'RecordWeight0', weightParameterProps) },
      { target: '2.3.4.5', weight: new CfnParameter(this, 'RecordWeight1', weightParameterProps) },
      { target: '3.4.5.6', weight: new CfnParameter(this, 'RecordWeight2', weightParameterProps) },
      { target: '4.5.6.7', weight: new CfnParameter(this, 'RecordWeight3', weightParameterProps) },
    ].forEach((data, index) => {
      new route53.ARecord(this, `RecordWithParamWeight${index}`, {
        zone: hostedZone,
        recordName: 'www',
        weight: data.weight.valueAsNumber,
        ttl: Duration.seconds(10),
        target: route53.RecordTarget.fromIpAddresses(data.target),
      });
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'record-weight-from-cfnparameter');

new IntegTest(app, 'Route53RecordWeightFromCfnParameterInteg', {
  testCases: [stack],
});
app.synth();
