## AWS::IoTEvents Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module. Releases might lack important features and might have
> future breaking changes.**
>
> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

---
<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

AWS IoT Events is a fully managed service that makes it easy to detect and respond to events from IoT sensors and applications. Events are patterns of data identifying more complicated circumstances than expected, such as changes in equipment when a belt is stuck or motion detectors using movement signals to activate lights and security cameras. Before IoT Events, you had to build costly, custom applications to collect data, apply decision logic to detect an event, and then trigger another application to react to the event. Using IoT Events, it’s simple to detect events across thousands of IoT sensors sending different telemetry data, such as temperature from a freezer, humidity from respiratory equipment, and belt speed on a motor. You simply select the relevant data sources to ingest, define the logic for each event using simple ‘if-then-else’ statements, and select the alert or custom action to trigger when an event occurs. IoT Events continuously monitors data from multiple IoT sensors and applications, and it integrates with other services, such as AWS IoT Core and AWS IoT Analytics, to enable early detection and unique insights into events. IoT Events automatically triggers alerts and actions in response to events based on the logic you define to resolve issues quickly, reduce maintenance costs, and increase operational efficiency.

### Installation

```ts
import {
  DetectorModel,
  Event,
  Input,
  State,
  TransitionEvent,
} from "@aws-cdk/aws-iotevents";
```

### Basic usage

A detector model needs at least one state as entry point;
A basic detector model which doesn't do anything is shown here:

```ts
import {
  DetectorModel,
  Event,
  Input,
  State,
  TransitionEvent,
} from "@aws-cdk/aws-iotevents";

const detector_model = new DetectorModel(this, "DetectorModel", {
  modelName: "MyDetector",
  description: "Detecting things",
});

const entry_state = new State("EntryState");

detector_model.entryPoint(entry_state);
```

### Inputs

Inputs are needed to communicate data into the detector model:

```ts
const input = new Input(this, "DetectorInput", {
  description: "Sensor data from detectors",
  name: "Detector",
});
input.addAttributes("sensorId", "someValue");
```

### States

States are created with a unique name and have `onEnter()`, `onInput()`, and `onExit()` member functions
which takes an arbitary list of `Event`s as parameter. The entry state is to be connected to the model using
the `DetectorModel.entryPoint(state)` method.

```ts
const state = new State("StateName");
state
  .onEnter(/*...events*/)
  .onInput(/*...events*/)
  .onExit(/*...events*/);
```

### Events

There ar both internal, and external events that can be triggered.
There are normal events and transition events, where the latter changes state.
Each event can have multiple different actions.
Internal events actions are setVariable, setTimer, resetTimer, and clearTimer
External events actions are addFirehose, republish, publishToIotTopic, addLambda, addSNS, addSQS
These events are the arguments to `State.on(Enter|Input|Exit)` methods.

```ts
const state = new State("StateName");
state.onInput(
  new Event("set variables and send SNS")
    .setVariable("sensorId", `$input.${input.inputName}.sensorId`)
    .setVariable("someValue", `$input.${input.inputName}.someValue`),
    .addSNS(new Topic(this, "SNSTopic", {
      displayName: "myTopic",
    }))
  new Event("reset timer").resetTimer("timerName"),
  new TransitionEvent(
    "some_value_detected",
    another_state,
    `$input.${input.inputName}.someValue >= $variable.threshold`
  )
);
```

### Complete example

This detector detects `someValue` from a `Input` and if it goes above `100` it will send out an _alarm SNS_.
After `60` seconds, it will send out an _escalated alarm SNS_ if we are still in _alarm state_.
If in _normal state_, and no data has been recieved in `5` minutes; it will go into a _offline state_
which it will leave and go back to _normal state_ if a signal is recieved.

```ts
import { Duration } from "@aws-cdk/core";
import {
  DetectorModel,
  Event,
  Input,
  State,
  TransitionEvent,
} from "@aws-cdk/aws-iotevents";
import { Topic } from "@aws-cdk/aws-sns";

const alarmNotification = new Topic(this, "AlarmNotification", {
  displayName: "Alarm notification",
});
const escalatedAlarmNotification = new Topic(
  this,
  "EscalatedAlarmNotification",
  {
    displayName: "Alarm! Alarm!",
  }
);
const offlineNotification = new Topic(this, "OfflineNotification", {
  displayName: "Sensor offline",
});

const detector_model = new DetectorModel(this, "DetectorModel", {
  modelName: "MyDetector",
  description: "Detecting things",
});
const input = new Input(this, "DetectorInput", {
  description: "Sensor data from detectors",
  name: "Detector",
});
input.addAttributes("sensorId", "someValue");
const normal_state = new State("Normal");
const alarming_state = new State("Alarming State");
const offline_state = new State("Offline");

normal_state
  .onEnter(
    new Event(
      "setDefaultThreshold",
      "isUndefined($variable.threshold)"
    ).setVariable("threshold", "100"),
    new Event("createTimer").setTimer("awake", Duration.minutes(5))
  )
  .onInput(
    new Event("setVariables")
      .setVariable("sensorId", `$input.${input.inputName}.sensorId`)
      .setVariable("someValue", `$input.${input.inputName}.someValue`),
    new Event("resetTimer").resetTimer("awake"),
    new TransitionEvent(
      "some_value_detected",
      alarming_state,
      `$input.${input.inputName}.someValue >= $variable.threshold`
    ),
    new TransitionEvent("Go offline", offline_state, 'timeout("awake")').addSNS(
      offlineNotification
    )
  );

offline_state
  .onEnter(new Event("Sensor is offline").addSNS(offlineNotification))
  .onInput(
    new TransitionEvent(
      "Back online",
      normal_state,
      `triggerType("Message") && currentInput("${input.inputName}")`
    )
  );

alarming_state
  .onEnter(
    new Event("Alarm Notification")
      .addSNS(alarmNotification)
      .setTimer("alarmTimer", Duration.seconds(60))
  )
  .onInput(
    new Event("Escalated Alarm Notification", `timeout("alarmTimer")`).addSNS(
      escalatedAlarmNotification
    ),
    new TransitionEvent(
      "Normalize",
      normal_state,
      `$input.${input.inputName}.someValue < $variable.threshold`
    )
  );

detector_model.entryPoint(normal_state);
```
