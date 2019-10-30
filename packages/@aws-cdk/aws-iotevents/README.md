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

This construct library allows you to define AWS IoT Events.

```ts
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
    new Event("createTimer").setTimer("awake", 300)
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
      .sns(alarmNotification)
      .setTimer("alarmTimer", 60)
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
