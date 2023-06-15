# Actions for AWS::IoTEvents Detector Model
<!--BEGIN STABILITY BANNER-->

---

![End-of-Support](https://img.shields.io/badge/End--of--Support-critical.svg?style=for-the-badge)

> AWS CDK v1 has reached End-of-Support on 2023-06-01.
> This package is no longer being updated, and users should migrate to AWS CDK v2.
>
> For more information on how to migrate, see the [_Migrating to AWS CDK v2_ guide][doc].
>
> [doc]: https://docs.aws.amazon.com/cdk/v2/guide/migrating-v2.html

---

<!--END STABILITY BANNER-->

This library contains integration classes to specify actions of state events of Detector Model in `@aws-cdk/aws-iotevents`.
Instances of these classes should be passed to `State` defined in `@aws-cdk/aws-iotevents`
You can define built-in actions to use a timer or set a variable, or send data to other AWS resources.

This library contains integration classes to use a timer or set a variable, or send data to other AWS resources.
AWS IoT Events can trigger actions when it detects a specified event or transition event.

Currently supported are:

- Set variable to detector instanse
- Invoke a Lambda function

## Set variable to detector instanse

The code snippet below creates an Action that set variable to detector instanse
when it is triggered.

```ts
import * as iotevents from '@aws-cdk/aws-iotevents';
import * as actions from '@aws-cdk/aws-iotevents-actions';

declare const input: iotevents.IInput;

const state = new iotevents.State({
  stateName: 'MyState',
  onEnter: [{
    eventName: 'test-event',
    condition: iotevents.Expression.currentInput(input),
    actions: [
      actions: [
        new actions.SetVariableAction(
          'MyVariable',
          iotevents.Expression.inputAttribute(input, 'payload.temperature'),
        ),
      ],
    ],
  }],
});
```

## Invoke a Lambda function

The code snippet below creates an Action that invoke a Lambda function
when it is triggered.

```ts
import * as iotevents from '@aws-cdk/aws-iotevents';
import * as actions from '@aws-cdk/aws-iotevents-actions';
import * as lambda from '@aws-cdk/aws-lambda';

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
