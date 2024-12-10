#!/usr/bin/env node
import * as globalaccelerator from 'aws-cdk-lib/aws-globalaccelerator';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as cdk from 'aws-cdk-lib';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-globalaccelerator-integ');

let accelerator = new globalaccelerator.Accelerator(stack, 'Accelerator', {
  acceleratorName: `${stack.stackName}`,
  enabled: true,
});

const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });

new route53.ARecord(stack, 'LocalGlobalAcceleratorAlias', {
  comment: 'Alias to the locally created Global Accelerator',
  target: route53.RecordTarget.fromAlias(new targets.GlobalAcceleratorTarget(accelerator)),
  recordName: 'test-local',
  zone,
});

new route53.ARecord(stack, 'ExistingGlobalAcceleratorAlias', {
  comment: 'Alias to the an existing Global Accelerator',
  target: route53.RecordTarget.fromAlias(new targets.GlobalAcceleratorDomainTarget('someexisting.awsglobalaccelerator.com')),
  recordName: 'test-existing',
  zone,
});

new route53.ARecord(stack, 'LocalGlobalAcceleratorAliasWithHealthCheck', {
  comment: 'Alias to the locally created Global Accelerator with health check',
  target: route53.RecordTarget.fromAlias(
    new targets.GlobalAcceleratorTarget(accelerator, {
      evaluateTargetHealth: true,
    }),
  ),
  recordName: 'test-local-health',
  zone,
});

app.synth();
