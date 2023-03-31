#!/usr/bin/env node
import * as route53 from 'aws-cdk-lib/aws-route53';
import { App, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const zone = new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: 'cdk-integ.com',
    });

    const www = new route53.ARecord(this, 'WWW', {
      zone,
      recordName: 'www.cdk-integ.com',
      target: route53.RecordTarget.fromIpAddresses('1.2.3.4'),
    });

    new route53.ARecord(this, 'Alias', {
      zone,
      target: route53.RecordTarget.fromAlias(new targets.Route53RecordTarget(www)),
    });
  }
}

const app = new App();
new TestStack(app, 'aws-cdk-r53-record-alias-target-integ');
app.synth();
