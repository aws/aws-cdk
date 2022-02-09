# AWS::IoTEvents Construct Library

<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources]) are always stable and safe to use.
>
> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

AWS IoT Events enables you to monitor your equipment or device fleets for
failures or changes in operation, and to trigger actions when such events
occur. 

## Installation

Install the module:

```console
$ npm i @aws-cdk/aws-iotevents
```

Import it into your code:

```ts nofixture
import * as iotevents from '@aws-cdk/aws-iotevents';
```

## Overview

The following example is a minimal set of an AWS IoT Events detector model.
It has no feature but it maybe help you to understand overview.

```ts
import * as iotevents from '@aws-cdk/aws-iotevents';

// First, define the input of the detector model
const input = new iotevents.Input(this, 'MyInput', {
  attributeJsonPaths: ['payload.deviceId', 'payload.temperature'],
});

// Second, define states of the detector model.
// You can define multiple states and its transitions.
const state = new iotevents.State({
  stateName: 'warm',
  onEnter: [{
    eventName: 'onEnter',
    condition: iotevents.Expression.currentInput(input),
  }],
});

// Finally, define the detector model.
new iotevents.DetectorModel(this, 'MyDetectorModel', {
  initialState: state,
});
```

Each part is explained in detail below.

## `Input`

You can create `Input` as following. You can put messages to the Input with AWS IoT Core Topic Rule, AWS IoT Analytics and more.
For more information, see [the documentation](https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-getting-started.html).

```ts
import * as iotevents from '@aws-cdk/aws-iotevents';

const input = new iotevents.Input(this, 'MyInput', {
  inputName: 'my_input', // optional
  attributeJsonPaths: ['payload.deviceId', 'payload.temperature'],
});
```

To grant permissions to put messages in the input,
you can use the `grantWrite()` method:

```ts
import * as iam from '@aws-cdk/aws-iam';
import * as iotevents from '@aws-cdk/aws-iotevents';

declare const grantable: iam.IGrantable;
const input = iotevents.Input.fromInputName(this, 'MyInput', 'my_input');

input.grantWrite(grantable);
```

## `State`

You can create `State` as following.
If a State is used for a Detector Model's initial state,
it's required that its `onEnter` Event is non-null,
and contains a reference to an Input via the `condition` property.
And if a message is put to the input, the detector instances are created regardless of the evaluation result of `condition`.
You can set the reference to input with `iotevents.Expression.currentInput()` or `iotevents.Expression.inputAttribute()`.
In other states, `onEnter` is optional.

```ts
import * as iotevents from '@aws-cdk/aws-iotevents';

declare const input: iotevents.IInput;

const initialState = new iotevents.State({
  stateName: 'MyState',
  onEnter: [{
    eventName: 'onEnter',
    condition: iotevents.Expression.currentInput(input),
  }],
});
```

You can set actions on the `onEnter` event. They are performed if `condition` evaluates to `true`.
If you omit `condition`, actions is performed on every enter events of the state.
For more information, see [supported actions](https://docs.aws.amazon.com/iotevents/latest/developerguide/iotevents-supported-actions.html).

```ts
import * as iotevents from '@aws-cdk/aws-iotevents';

declare const input: iotevents.IInput;

const setTemperatureAction = {
  bind: () => ({
    configuration: {
      setVariable: { 
        variableName: 'temperature', 
        value: iotevents.Expression.inputAttribute(input, 'payload.temperature').evaluate(),
      },
    },
  }),
};

const state = new iotevents.State({
  stateName: 'MyState',
  onEnter: [{ // optional
    eventName: 'onEnter',
    actions: [setTemperatureAction], // optional
    condition: iotevents.Expression.currentInput(input), // optional
  }],
});
```

Also you can use `onInput` and `onExit`. `onInput` is triggered when messages are put to the input
that is refered from the detector model. `onExit` is triggered when exiting this state.

```ts
import * as iotevents from '@aws-cdk/aws-iotevents';

const state = new iotevents.State({
  stateName: 'warm',
  onEnter: [{ // optional
    eventName: 'onEnter',
  }],
  onInput: [{ // optional
    eventName: 'onInput',
  }],
  onExit: [{ // optional
    eventName: 'onExit',
  }],
});
```

You can set transitions of the states as following:

```ts
import * as iotevents from '@aws-cdk/aws-iotevents';

declare const input: iotevents.IInput;
declare const action: iotevents.IAction;
declare const stateA: iotevents.State;
declare const stateB: iotevents.State;

// transit from stateA to stateB when temperature is 10
stateA.transitionTo(stateB, {
  eventName: 'to_coldState', // optional property, default by combining the names of the States
  actions: [action], // optional,
  when: iotevents.Expression.eq(
    iotevents.Expression.inputAttribute(input, 'payload.temperature'),
    iotevents.Expression.fromString('10'),
  ),
});
```

## `DetectorModel`

You can create `DetectorModel` as following.

```ts
import * as iotevents from '@aws-cdk/aws-iotevents';

declare const state: iotevents.State;

new iotevents.DetectorModel(this, 'MyDetectorModel', {
  detectorModelName: 'test-detector-model', // optional
  description: 'test-detector-model-description', // optional property, default is none
  evaluationMethod: iotevents.EventEvaluation.SERIAL, // optional property, default is iotevents.EventEvaluation.BATCH
  detectorKey: 'payload.deviceId', // optional property, default is none and single detector instance will be created and all inputs will be routed to it
  initialState: state,
});
```

## Examples

The following example creates an AWS IoT Events detector model to your stack.
The State of this detector model transits according to the temperature.

```ts
import * as iotevents from '@aws-cdk/aws-iotevents';

const input = new iotevents.Input(this, 'MyInput', {
  attributeJsonPaths: ['payload.deviceId', 'payload.temperature'],
});

const warmState = new iotevents.State({
  stateName: 'warm',
  onEnter: [{
    eventName: 'onEnter',
    condition: iotevents.Expression.currentInput(input),
  }],
});
const coldState = new iotevents.State({
  stateName: 'cold',
});

const temperatureEqual = (temperature: string) =>
  iotevents.Expression.eq(
    iotevents.Expression.inputAttribute(input, 'payload.temperature'),
    iotevents.Expression.fromString('10'),
  )

warmState.transitionTo(coldState, { when: temperatureEqual('10') });
coldState.transitionTo(warmState, { when: temperatureEqual('20') });

new iotevents.DetectorModel(this, 'MyDetectorModel', {
  detectorKey: 'payload.deviceId',
  initialState: warmState,
});
```
