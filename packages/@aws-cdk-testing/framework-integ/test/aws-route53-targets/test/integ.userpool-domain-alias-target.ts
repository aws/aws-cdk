#!/usr/bin/env node
import * as route53 from 'aws-cdk-lib/aws-route53';
import { App, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { USER_POOL_DOMAIN_NAME_METHOD_WITHOUT_CUSTOM_RESOURCE } from 'aws-cdk-lib/cx-api';
import { UserPool, UserPoolDomain } from 'aws-cdk-lib/aws-cognito';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const zone = new route53.PublicHostedZone(this, 'HostedZone', { zoneName: 'test.public' });
    const userPool = new UserPool(this, 'UserPool');
    const domain = new UserPoolDomain(this, 'UserPoolDomain', {
      userPool,
      cognitoDomain: { domainPrefix: 'domain-prefix' },
    });

    new route53.ARecord(zone, 'Alias', {
      zone,
      target: route53.RecordTarget.fromAlias(new targets.UserPoolDomainTarget(domain)),
    });
  }
}

const app = new App({
  context: { [USER_POOL_DOMAIN_NAME_METHOD_WITHOUT_CUSTOM_RESOURCE]: true },
});
const stack = new TestStack(app, 'userpool-domain-alias-target');
new IntegTest(app, 'userpool-domain-alias-target-integ', {
  testCases: [stack],
});
app.synth();
