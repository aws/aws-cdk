import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { PublicHostedZone } from 'aws-cdk-lib/aws-route53';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-route53-imported-delegation-integ');

const role = new iam.Role(stack, 'Role', {
  assumedBy: new iam.AccountRootPrincipal(),
});

const publicZone = PublicHostedZone.fromPublicHostedZoneId(stack, 'PublicZone', 'public-zone-id');
publicZone.grantDelegation(role);

new IntegTest(app, 'Integ', {
  testCases: [stack],
});

app.synth();
