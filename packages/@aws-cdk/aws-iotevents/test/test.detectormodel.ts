import { expect, haveResource } from "@aws-cdk/assert";
import { PolicyStatement } from "@aws-cdk/aws-iam";
import { CfnDeliveryStream } from "@aws-cdk/aws-kinesisfirehose";
import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import { Topic } from "@aws-cdk/aws-sns";
import { Queue } from "@aws-cdk/aws-sqs";
import { Construct, Duration, Stack } from "@aws-cdk/core";
import { Test, testCase } from "nodeunit";
import { DetectorModel, Event, Input, State, TransitionEvent } from "../lib";

export = testCase({
  "simple model"(test: Test) {
    const stack = new Stack();
    newTestModel(stack);

    expect(stack).to(
      haveResource("AWS::IoTEvents::Input", {
        InputDefinition: {
          Attributes: [],
        },
        InputName: "MyInput",
      })
    );
    expect(stack).to(
      haveResource("AWS::IAM::Role", {
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: "sts:AssumeRole",
              Effect: "Allow",
              Principal: {
                Service: "iotevents.amazonaws.com",
              },
            },
          ],
          Version: "2012-10-17",
        },
      })
    );
    expect(stack).to(
      haveResource("AWS::IoTEvents::DetectorModel", {
        DetectorModelDefinition: {
          InitialStateName: "State 1",
          States: [
            {
              OnEnter: {
                Events: [
                  {
                    Actions: [
                      {
                        SetTimer: {
                          Seconds: 120,
                          TimerName: "Timer 1",
                        },
                      },
                      {
                        SetVariable: {
                          Value: "$input.MyInput.my_value",
                          VariableName: "Variable 1",
                        },
                      },
                    ],
                    EventName: "Event 1",
                  },
                ],
              },
              OnExit: {
                Events: [],
              },
              OnInput: {
                Events: [],
                TransitionEvents: [
                  {
                    Actions: [],
                    Condition: 'timeout("Timer 1")',
                    EventName: "Transition Event 1",
                    NextState: "State 2",
                  },
                ],
              },
              StateName: "State 1",
            },
            {
              OnEnter: {
                Events: [],
              },
              OnExit: {
                Events: [],
              },
              OnInput: {
                Events: [],
                TransitionEvents: [],
              },
              StateName: "State 2",
            },
          ],
        },
        Key: "id",
        RoleArn: {
          "Fn::GetAtt": ["DetectorModelRoleBC2BE789", "Arn"],
        },
      })
    );

    test.done();
  },
  "add to role policy"(test: Test) {
    const stack = new Stack();
    const { model } = newTestModel(stack);
    model.addToRolePolicy(new PolicyStatement({ actions: ["my:action"] }));
    expect(stack).to(
      haveResource("AWS::IAM::Policy", {
        PolicyDocument: {
          Version: "2012-10-17",
          Statement: [{ Action: "my:action", Effect: "Allow" }],
        },
      })
    );
    test.done();
  },
  "add event actions"(test: Test) {
    const stack = new Stack();
    const model = new DetectorModel(stack, "DetectorModel");
    const state = new State("State");
    model.entryPoint(state);

    state.onEnter(
      new Event("Event 1")
        .addFirehose(
          new CfnDeliveryStream(stack, "Firehose", {
            deliveryStreamName: "MyFirehose",
          })
        )
        .addLambda(
          new Function(stack, "Function", {
            code: Code.fromInline("xxx"),
            handler: "index.handler",
            runtime: Runtime.NODEJS_8_10,
          })
        )
        .addSNS(new Topic(stack, "SNS"))
        .addSQS(new Queue(stack, "SQS"))
        .clearTimer("timerName")
        .resetTimer("timerName")
        .setTimer("timerName", Duration.seconds(60))
        .republish(model)
        .publishToIotTopic("http://example.com")
    );

    expect(stack).to(
      haveResource("AWS::IoTEvents::DetectorModel", {
        DetectorModelDefinition: {
          InitialStateName: "State",
          States: [
            {
              OnEnter: {
                Events: [
                  {
                    Actions: [
                      {
                        Firehose: {
                          DeliveryStreamName: "MyFirehose",
                        },
                      },
                      {
                        Lambda: {
                          FunctionArn: {
                            "Fn::GetAtt": ["Function76856677", "Arn"],
                          },
                        },
                      },
                      {
                        Sns: {
                          TargetArn: {
                            Ref: "SNS03120D65",
                          },
                        },
                      },
                      {
                        Sqs: {
                          QueueUrl: {
                            Ref: "SQSC7E1FD76",
                          },
                        },
                      },
                      {
                        ClearTimer: {
                          TimerName: "timerName",
                        },
                      },
                      {
                        ResetTimer: {
                          TimerName: "timerName",
                        },
                      },
                      {
                        SetTimer: {
                          Seconds: 60,
                          TimerName: "timerName",
                        },
                      },
                      {
                        IotEvents: {
                          InputName: {
                            Ref: "DetectorModelB613457D",
                          },
                        },
                      },
                      {
                        IotTopicPublish: {
                          MqttTopic: "http://example.com",
                        },
                      },
                    ],
                    EventName: "Event 1",
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
              StateName: "State",
            },
          ],
        },
        Key: "id",
        RoleArn: {
          "Fn::GetAtt": ["DetectorModelRoleBC2BE789", "Arn"],
        },
      })
    );
    test.done();
  },
});

function newTestModel(
  scope: Construct
): { model: DetectorModel; input: Input; states: State[] } {
  const input = new Input(scope, "Input", { inputName: "MyInput" });
  const model = new DetectorModel(scope, "DetectorModel");
  const state1 = new State("State 1");
  const state2 = new State("State 2");

  state1
    .onEnter(
      new Event("Event 1")
        .setTimer("Timer 1", Duration.minutes(2))
        .setVariable("Variable 1", `$input.${input.inputName}.my_value`)
    )
    .onInput(
      new TransitionEvent("Transition Event 1", state2, 'timeout("Timer 1")')
    );
  model.entryPoint(state1);
  return { model, input, states: [state1, state2] };
}
