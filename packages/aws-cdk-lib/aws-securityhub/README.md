# AWS Security Hub Construct Library

This module provides a `Hub` L2 for enabling Security Hub CSPM in a single account
and Region, with EventBridge helpers. Other Security Hub resources are available
as generated L1 constructs.

## Hub

Only one hub can exist per account and Region. To enable Security Hub CSPM without
automatically enabling security standards:

```ts nofixture
import { Stack } from 'aws-cdk-lib';
import * as securityhub from 'aws-cdk-lib/aws-securityhub';

declare const stack: Stack;
new securityhub.Hub(stack, 'Hub', { enableDefaultStandards: false });
```

Omitting `enableDefaultStandards` follows the service default, which enables its
designated default standards. Security checks can require AWS Config recording
and incur additional charges. This construct does not configure AWS Config.

The native hub settings can be configured explicitly:

```ts nofixture
import { Stack } from 'aws-cdk-lib';
import * as securityhub from 'aws-cdk-lib/aws-securityhub';

declare const stack: Stack;
new securityhub.Hub(stack, 'Hub', {
  enableDefaultStandards: false,
  autoEnableControls: false,
  controlFindingGenerator: securityhub.ControlFindingGenerator.SECURITY_CONTROL,
  tags: { team: 'security' },
});
```

Tags can also be applied with `Tags.of(scope).add(...)`. The underlying `CfnHub`
is available as `hub.resource` for escape hatches.

## Existing hubs and lifecycle

Reference an existing hub instead of attempting to enable it a second time:

```ts nofixture
import { Stack } from 'aws-cdk-lib';
import * as securityhub from 'aws-cdk-lib/aws-securityhub';

declare const stack: Stack;
declare const hubArn: string;
const existingHub = securityhub.Hub.fromHubArn(stack, 'ExistingHub', hubArn);
```

Imports do not enable, modify, or own the hub. `hubSubscribedAt` is unknown for
imports. Created hubs are retained on stack removal by default. Explicitly setting
`removalPolicy: RemovalPolicy.DESTROY` disables Security Hub CSPM in that account
and Region when CloudFormation deletes the hub. Review existing integrations
before choosing that behavior.

## Events

Use `hub.events` to create EventBridge rules for imported findings, custom actions,
and insight results. The helpers also accept L1 references through
`HubEvents.fromHub(cfnHub)`.

```ts nofixture
import { Stack } from 'aws-cdk-lib';
import * as securityhub from 'aws-cdk-lib/aws-securityhub';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as targets from 'aws-cdk-lib/aws-events-targets';

declare const stack: Stack;
declare const processor: lambda.IFunction;
const hub = new securityhub.Hub(stack, 'Hub', { enableDefaultStandards: false });
hub.events.onImportedFindings('ImportedFindings', {
  target: new targets.LambdaFunction(processor),
});
```

`onCustomAction` matches findings submitted by a custom action;
`onInsightResults` matches insight results submitted by a custom action. A generic
`onEvent` helper accepts additional event-pattern filters. Rules match the
referenced account and Region. `crossStackScope` can place the rule in a target
stack in the same account and Region; cross-account forwarding is not configured.
Known account or Region mismatches are rejected. For an imported hub, configure
the rule's stack with the hub's account and Region.
The source, account and Region filters, and each typed helper's event type, are
fixed. Supplying these fields in `eventPattern` is rejected; use additional filters
such as `detail` to restrict events. The generic `onEvent` helper accepts a caller
`detailType` filter.
