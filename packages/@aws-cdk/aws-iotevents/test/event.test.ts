import { expect as cdkExpect, haveResource } from "@aws-cdk/assert";
import "@aws-cdk/assert/jest";
import { CfnDeliveryStream } from "@aws-cdk/aws-kinesisfirehose";
import { Function, InlineCode, Runtime } from "@aws-cdk/aws-lambda";
import { Topic } from "@aws-cdk/aws-sns";
import { Queue } from "@aws-cdk/aws-sqs";
import { Duration, Stack } from "@aws-cdk/core";
import { DetectorModel, Event, State } from "../lib";

test("forward to firehose", () => {
  const { event, stack } = setup();

  event.addFirehose(
    new CfnDeliveryStream(stack, "DeliveryStream", {
      deliveryStreamName: "myStream",
    })
  );

  expectMatchEventAction(stack, {
    Firehose: {
      DeliveryStreamName: "myStream",
    },
  });
});

test("republish into another Event", () => {
  const { event, model, stack } = setup();

  event.republish(model);

  expectMatchEventAction(stack, {
    IotEvents: {
      InputName: {
        Ref: "DetectorModelB613457D",
      },
    },
  });
});

test("publish to an IoT Topic", () => {
  const { event, stack } = setup();

  event.publishToIotTopic("my_topic");

  expectMatchEventAction(stack, {
    IotTopicPublish: {
      MqttTopic: "my_topic",
    },
  });
});
test("call a lambda", () => {
  const { event, stack } = setup();

  event.addLambda(
    new Function(stack, "function", {
      code: new InlineCode("return null;"),
      handler: "index.handler",
      runtime: Runtime.NODEJS,
    })
  );

  expectMatchEventAction(stack, {
    Lambda: {
      FunctionArn: {
        "Fn::GetAtt": ["functionF19B1A04", "Arn"],
      },
    },
  });
});
test("send SNS", () => {
  const { event, stack } = setup();
  event.addSNS(new Topic(stack, "topic"));

  expectMatchEventAction(stack, {
    Sns: {
      TargetArn: {
        Ref: "topic69831491",
      },
    },
  });
});
test("publish into SQS", () => {
  const { event, stack } = setup();
  event
    .addSQS(new Queue(stack, "queue1"))
    .addSQS(new Queue(stack, "queue2"), true);

  expectMatchEventAction(
    stack,
    {
      Sqs: {
        QueueUrl: {
          Ref: "queue1A6429D98",
        },
      },
    },
    {
      Sqs: {
        QueueUrl: {
          Ref: "queue20D18E0EC",
        },
        UseBase64: true,
      },
    }
  );
});
test("reset timer", () => {
  const { event, stack } = setup();
  event.resetTimer("timerName");

  expectMatchEventAction(stack, {
    ResetTimer: {
      TimerName: "timerName",
    },
  });
});
test("clear timer", () => {
  const { event, stack } = setup();
  event.clearTimer("timerName");

  expectMatchEventAction(stack, {
    ClearTimer: {
      TimerName: "timerName",
    },
  });
});
test("set timer", () => {
  const { event, stack } = setup();
  event.setTimer("timerName", Duration.seconds(60));
  expectMatchEventAction(stack, {
    SetTimer: {
      Seconds: 60,
      TimerName: "timerName",
    },
  });
});
test("set timer minimum duration is 60 seconds", () => {
  const { event } = setup();

  expect(() => {
    event.setTimer("timerName", Duration.seconds(59));
  }).toThrow();
});
test("set variable", () => {
  const { event, stack } = setup();
  event.setVariable("variableName", "variableValue");
  expectMatchEventAction(stack, {
    SetVariable: {
      Value: "variableValue",
      VariableName: "variableName",
    },
  });
});

function setup() {
  const stack = new Stack();
  const model = new DetectorModel(stack, "DetectorModel");
  const state = new State("state");
  model.entryPoint(state);
  const event = new Event("event");
  state.onEnter(event);
  return { event, model, stack };
}

function expectMatchEventAction(stack: Stack, ...actions: any) {
  cdkExpect(stack).to(
    haveResource("AWS::IoTEvents::DetectorModel", {
      DetectorModelDefinition: {
        InitialStateName: "state",
        States: [
          {
            OnEnter: {
              Events: [
                {
                  Actions: actions,
                  EventName: "event",
                },
              ],
            },
            OnExit: {
              Events: [],
            },
            OnInput: {
              Events: [],
              TransitionEvents: [],
            },
            StateName: "state",
          },
        ],
      },
    })
  );
}
