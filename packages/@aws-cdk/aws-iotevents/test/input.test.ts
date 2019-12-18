import { expect as cdkExpect, haveResource } from "@aws-cdk/assert";
import "@aws-cdk/assert/jest";
import { AnyPrincipal, Role } from "@aws-cdk/aws-iam";
import { Stack } from "@aws-cdk/core";
import { Input } from "../lib";

test("basic input", () => {
  const stack = new Stack();
  new Input(stack, "Input", { inputName: "MyInput" });
  cdkExpect(stack).to(
    haveResource("AWS::IoTEvents::Input", {
      InputDefinition: {
        Attributes: [],
      },
      InputName: "MyInput",
    })
  );
});
test("with description", () => {
  const stack = new Stack();
  new Input(stack, "Input", {
    inputName: "MyInput",
    description: "My description",
  });
  cdkExpect(stack).to(
    haveResource("AWS::IoTEvents::Input", {
      InputDefinition: {
        Attributes: [],
      },
      InputDescription: "My description",
      InputName: "MyInput",
    })
  );
});
test("adding attributes", () => {
  const stack = new Stack();
  const input = new Input(stack, "Input", { inputName: "MyInput" });
  input.addAttributes("attribute 1", "attribute 2");
  cdkExpect(stack).to(
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
});
test("grant push", () => {
  const stack = new Stack();
  const input = new Input(stack, "Input", { inputName: "MyInput" });
  const role = new Role(stack, "Role", {
    assumedBy: new AnyPrincipal(),
  });
  input.grantPush(role);

  cdkExpect(stack).to(
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
});
