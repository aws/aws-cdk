import { expect, haveResource } from "@aws-cdk/assert";
import { CfnDeliveryStream } from "@aws-cdk/aws-kinesisfirehose";
import { Function, InlineCode, Runtime } from "@aws-cdk/aws-lambda";
import { Topic } from "@aws-cdk/aws-sns";
import { Queue } from "@aws-cdk/aws-sqs";
import { Stack, Duration } from "@aws-cdk/core";
import { Test, testCase } from "nodeunit";
import { DetectorModel, Event, State } from "../lib";

export = testCase({
  "forward to firehose"(test: Test) {
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

    test.done();
  },
  "republish into another Event"(test: Test) {
    const { event, model, stack } = setup();

    event.republish(model);

    expectMatchEventAction(stack, {
      IotEvents: {
        InputName: {
          Ref: "DetectorModelB613457D",
        },
      },
    });

    test.done();
  },
  "publish to an IoT Topic"(test: Test) {
    const { event, stack } = setup();

    event.publishToIotTopic("my_topic");

    expectMatchEventAction(stack, {
      IotTopicPublish: {
        MqttTopic: "my_topic",
      },
    });

    test.done();
  },
  "call a lambda"(test: Test) {
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

    test.done();
  },
  "send SNS"(test: Test) {
    const { event, stack } = setup();
    event.addSNS(new Topic(stack, "topic"));

    expectMatchEventAction(stack, {
      Sns: {
        TargetArn: {
          Ref: "topic69831491",
        },
      },
    });

    test.done();
  },
  "publish into SQS"(test: Test) {
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

    test.done();
  },
  "reset timer"(test: Test) {
    const { event, stack } = setup();
    event.resetTimer("timerName");

    expectMatchEventAction(stack, {
      ResetTimer: {
        TimerName: "timerName",
      },
    });

    test.done();
  },
  "clear timer"(test: Test) {
    const { event, stack } = setup();
    event.clearTimer("timerName");

    expectMatchEventAction(stack, {
      ClearTimer: {
        TimerName: "timerName",
      },
    });

    test.done();
  },
  "set timer"(test: Test) {
    const { event, stack } = setup();
    event.setTimer("timerName", Duration.seconds(60));
    expectMatchEventAction(stack, {
      SetTimer: {
        Seconds: 60,
        TimerName: "timerName",
      },
    });

    test.done();
  },
  "set timer minimum duration is 60 seconds"(test: Test) {
    const { event } = setup();

    test.throws(() => {
      event.setTimer("timerName", Duration.seconds(59));
    });

    test.done();
  },
  "set variable"(test: Test) {
    const { event, stack } = setup();
    event.setVariable("variableName", "variableValue");
    expectMatchEventAction(stack, {
      SetVariable: {
        Value: "variableValue",
        VariableName: "variableName",
      },
    });

    test.done();
  },
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
  expect(stack).to(
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
