# Actions for AWS::IoTEvents Detector Model
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This library contains integration classes to specify actions of state events of Detector Model in `@aws-cdk/aws-iotevents-alpha`.
Instances of these classes should be passed to `State` defined in `@aws-cdk/aws-iotevents-alpha`
You can define built-in actions to use a timer or set a variable, or send data to other AWS resources.

This library contains integration classes to use a timer or set a variable, or send data to other AWS resources.
AWS IoT Events can trigger actions when it detects a specified event or transition event.

Currently supported are:

- Use timer
- Set variable to detector instance
- Invoke a Lambda function

## Use timer

The code snippet below creates an Action that creates the timer with duration in seconds.

```ts
import * as iotevents from '@aws-cdk/aws-iotevents-alpha';
import * as actions from '@aws-cdk/aws-iotevents-actions-alpha';

declare const input: iotevents.IInput;

const state = new iotevents.State({
  stateName: 'MyState',
  onEnter: [{
    eventName: 'test-event',
    condition: iotevents.Expression.currentInput(input),
    actions: [
      new actions.SetTimerAction('MyTimer', {
        duration: cdk.Duration.seconds(60),
      }),
    ],
  }],
});
```

Setting duration by [IoT Events Expression](https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-expressions.html):

```ts
new actions.SetTimerAction('MyTimer', {
  durationExpression: iotevents.Expression.inputAttribute(input, 'payload.durationSeconds'),
})
```

And the timer can be reset and cleared. Below is an example of general
[Device HeartBeat](https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-examples-dhb.html)
Detector Model:

```ts
const online = new iotevents.State({
  stateName: 'Online',
  onEnter: [{
    eventName: 'enter-event',
    condition: iotevents.Expression.currentInput(input),
    actions: [
      new actions.SetTimerAction('MyTimer', {
        duration: cdk.Duration.seconds(60),
      }),
    ],
  }],
  onInput: [{
    eventName: 'input-event',
    condition: iotevents.Expression.currentInput(input),
    actions: [
      new actions.ResetTimerAction('MyTimer'),
    ],
  }],
  onExit: [{
    eventName: 'exit-event',
    actions: [
      new actions.ClearTimerAction('MyTimer'),
    ],
  }],
});
const offline = new iotevents.State({ stateName: 'Offline' });

online.transitionTo(offline, { when: iotevents.Expression.timeout('MyTimer') });
offline.transitionTo(online, { when: iotevents.Expression.currentInput(input) });
```

## Set variable to detector instance

The code snippet below creates an Action that set variable to detector instance
when it is triggered.

```ts
import * as iotevents from '@aws-cdk/aws-iotevents-alpha';
import * as actions from '@aws-cdk/aws-iotevents-actions-alpha';

declare const input: iotevents.IInput;

const state = new iotevents.State({
  stateName: 'MyState',
  onEnter: [{
    eventName: 'test-event',
    condition: iotevents.Expression.currentInput(input),
    actions: [
      new actions.SetVariableAction(
        'MyVariable',
        iotevents.Expression.inputAttribute(input, 'payload.temperature'),
      ),
    ],
  }],
});
```

## Invoke a Lambda function

The code snippet below creates an Action that invoke a Lambda function
when it is triggered.

```ts
import * as iotevents from '@aws-cdk/aws-iotevents-alpha';
import * as actions from '@aws-cdk/aws-iotevents-actions-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';

declare const input: iotevents.IInput;
declare const func: lambda.IFunction;

const state = new iotevents.State({
  stateName: 'MyState',
  onEnter: [{
    eventName: 'test-event',
    condition: iotevents.Expression.currentInput(input),
    actions: [new actions.LambdaInvokeAction(func)],
  }],
});
```
