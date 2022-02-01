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

## `DetectorModel`

The following example creates an AWS IoT Events detector model to your stack.
The detector model need a reference to at least one AWS IoT Events input.
AWS IoT Events inputs enable the detector to get MQTT payload values from IoT Core rules.

```ts
import * as iotevents from '@aws-cdk/aws-iotevents';

const input = new iotevents.Input(this, 'MyInput', {
  inputName: 'my_input', // optional
  attributeJsonPaths: ['payload.deviceId', 'payload.temperature'],
});

const normalState = new iotevents.State({
  stateName: 'normal',
  onEnter: [{
    eventName: 'test-event',
    condition: iotevents.Expression.currentInput(input),
  }],
});
const coldState = new iotevents.State({
  stateName: 'cold',
});

// transit to coldState when temperature is 10
normalState.transitionTo({
  eventName: 'to_coldState',
  nextState: coldState,
  condition: iotevents.Expression.eq(
    iotevents.Expression.inputAttribute(input, 'payload.temperature'),
    iotevents.Expression.fromString('10'),
  ),
});
// transit to normalState when temperature is 20
coldState.transitionTo({
  eventName: 'to_normalState',
  nextState: normalState,
  condition: iotevents.Expression.eq(
    iotevents.Expression.inputAttribute(input, 'payload.temperature'),
    iotevents.Expression.fromString('20'),
  ),
});

new iotevents.DetectorModel(this, 'MyDetectorModel', {
  detectorModelName: 'test-detector-model', // optional
  description: 'test-detector-model-description', // optional property, default is none
  evaluationMethod: iotevents.EventEvaluation.SERIAL, // optional property, default is iotevents.EventEvaluation.BATCH
  detectorKey: 'payload.deviceId', // optional property, default is none and single detector instance will be created and all inputs will be routed to it
  initialState: onlineState,
});
```
