import { expect, haveResource } from "@aws-cdk/assert";
import { AnyPrincipal, Role } from "@aws-cdk/aws-iam";
import { Stack } from "@aws-cdk/core";
import { Test, testCase } from "nodeunit";
import { Input } from "../lib";

export = testCase({
  "basic input"(test: Test) {
    const stack = new Stack();
    new Input(stack, "Input", { inputName: "MyInput" });
    expect(stack).to(
      haveResource("AWS::IoTEvents::Input", {
        InputDefinition: {
          Attributes: [],
        },
        InputName: "MyInput",
      })
    );
    test.done();
  },
  "with description"(test: Test) {
    const stack = new Stack();
    new Input(stack, "Input", {
      inputName: "MyInput",
      description: "My description",
    });
    expect(stack).to(
      haveResource("AWS::IoTEvents::Input", {
        InputDefinition: {
          Attributes: [],
        },
        InputDescription: "My description",
        InputName: "MyInput",
      })
    );
    test.done();
  },
  "adding attributes"(test: Test) {
    const stack = new Stack();
    const input = new Input(stack, "Input", { inputName: "MyInput" });
    input.addAttributes("attribute 1", "attribute 2");
    expect(stack).to(
      haveResource("AWS::IoTEvents::Input", {
        InputDefinition: {
          Attributes: [
            {
              JsonPath: "attribute 1",
            },
            {
              JsonPath: "attribute 2",
            },
          ],
        },
        InputName: "MyInput",
      })
    );
    test.done();
  },
  "grant push"(test: Test) {
    const stack = new Stack();
    const input = new Input(stack, "Input", { inputName: "MyInput" });
    const role = new Role(stack, "Role", {
      assumedBy: new AnyPrincipal(),
    });
    input.grantPush(role);

    expect(stack).to(
      haveResource("AWS::IAM::Policy", {
        PolicyDocument: {
          Statement: [
            {
              Action: [
                "iotevents:BatchPutMessage",
                "iotevents:BatchUpdateDetector",
                "iotevents:DescribeDetector",
                "iotevents:ListDetectors",
              ],
              Effect: "Allow",
              Resource: {
                "Fn::Join": [
                  "",
                  [
                    "arn:",
                    {
                      Ref: "AWS::Partition",
                    },
                    ":iotevents:",
                    {
                      Ref: "AWS::Region",
                    },
                    ":",
                    {
                      Ref: "AWS::AccountId",
                    },
                    ":input/MyInput",
                  ],
                ],
              },
            },
          ],
          Version: "2012-10-17",
        },
        PolicyName: "RoleDefaultPolicy5FFB7DAB",
        Roles: [
          {
            Ref: "Role1ABCC5F0",
          },
        ],
      })
    );
    test.done();
  },
});
