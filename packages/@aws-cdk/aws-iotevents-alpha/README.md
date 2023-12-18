# AWS::IoTEvents Construct Library

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

AWS IoT Events enables you to monitor your equipment or device fleets for
failures or changes in operation, and to trigger actions when such events
occur. 

## `DetectorModel`

The following example creates an AWS IoT Events detector model to your stack.
The detector model need a reference to at least one AWS IoT Events input.
AWS IoT Events inputs enable the detector to get MQTT payload values from IoT Core rules.

You can define built-in actions to use a timer or set a variable, or send data to other AWS resources.
See also [@aws-cdk/aws-iotevents-actions-alpha](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-iotevents-actions-alpha-readme.html) for other actions.

```ts
import * as iotevents from '@aws-cdk/aws-iotevents-alpha';
import * as actions from '@aws-cdk/aws-iotevents-actions-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';

declare const func: lambda.IFunction;

const input = new iotevents.Input(this, 'MyInput', {
  inputName: 'my_input', // optional
  attributeJsonPaths: ['payload.deviceId', 'payload.temperature'],
});

const warmState = new iotevents.State({
  stateName: 'warm',
  onEnter: [{
    eventName: 'test-enter-event',
    condition: iotevents.Expression.currentInput(input),
    actions: [new actions.LambdaInvokeAction(func)], // optional
  }],
  onInput: [{ // optional
    eventName: 'test-input-event',
    actions: [new actions.LambdaInvokeAction(func)],
  }],
  onExit: [{ // optional
    eventName: 'test-exit-event',
    actions: [new actions.LambdaInvokeAction(func)],
  }],
});
const coldState = new iotevents.State({
  stateName: 'cold',
});

// transit to coldState when temperature is less than 15
warmState.transitionTo(coldState, {
  eventName: 'to_coldState', // optional property, default by combining the names of the States
  when: iotevents.Expression.lt(
    iotevents.Expression.inputAttribute(input, 'payload.temperature'),
    iotevents.Expression.fromString('15'),
  ),
  executing: [new actions.LambdaInvokeAction(func)], // optional
});
// transit to warmState when temperature is greater than or equal to 15
coldState.transitionTo(warmState, {
  when: iotevents.Expression.gte(
    iotevents.Expression.inputAttribute(input, 'payload.temperature'),
    iotevents.Expression.fromString('15'),
  ),
});

new iotevents.DetectorModel(this, 'MyDetectorModel', {
  detectorModelName: 'test-detector-model', // optional
  description: 'test-detector-model-description', // optional property, default is none
  evaluationMethod: iotevents.EventEvaluation.SERIAL, // optional property, default is iotevents.EventEvaluation.BATCH
  detectorKey: 'payload.deviceId', // optional property, default is none and single detector instance will be created and all inputs will be routed to it
  initialState: warmState,
});
```

To grant permissions to put messages in the input,
you can use the `grantWrite()` method:

```ts
import * as iam from 'aws-cdk-lib/aws-iam';
import * as iotevents from '@aws-cdk/aws-iotevents-alpha';

declare const grantable: iam.IGrantable;
const input = iotevents.Input.fromInputName(this, 'MyInput', 'my_input');

input.grantWrite(grantable);
```
