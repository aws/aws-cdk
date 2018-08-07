"use strict";
const assert_1 = require("@aws-cdk/assert");
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/cdk");
const lib_1 = require("../lib");
module.exports = {
    'can add same singleton Lambda multiple times, only instantiated once in template'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        for (let i = 0; i < 5; i++) {
            new lib_1.SingletonLambda(stack, `Singleton${i}`, {
                uuid: '84c0de93-353f-4217-9b0b-45b6c993251a',
                code: new lambda.LambdaInlineCode('def hello(): pass'),
                runtime: lambda.LambdaRuntime.Python27,
                handler: 'index.hello',
                timeout: 300,
            });
        }
        // THEN
        assert_1.expect(stack).to(assert_1.matchTemplate({
            Resources: {
                SingletonLambda84c0de93353f42179b0b45b6c993251aServiceRole26D59235: {
                    Type: "AWS::IAM::Role",
                    Properties: {
                        AssumeRolePolicyDocument: {
                            Statement: [
                                {
                                    Action: "sts:AssumeRole",
                                    Effect: "Allow",
                                    Principal: { Service: "lambda.amazonaws.com" }
                                }
                            ],
                            Version: "2012-10-17"
                        },
                        ManagedPolicyArns: [
                            {
                                "Fn::Join": ["", ["arn", ":", { Ref: "AWS::Partition" }, ":", "iam", ":", "",
                                        ":", "aws", ":", "policy", "/", "service-role/AWSLambdaBasicExecutionRole"]]
                            }
                        ]
                    }
                },
                SingletonLambda84c0de93353f42179b0b45b6c993251a840BCC38: {
                    Type: "AWS::Lambda::Function",
                    Properties: {
                        Code: {
                            ZipFile: "def hello(): pass"
                        },
                        Handler: "index.hello",
                        Role: { "Fn::GetAtt": ["SingletonLambda84c0de93353f42179b0b45b6c993251aServiceRole26D59235", "Arn"] },
                        Runtime: "python2.7",
                        Timeout: 300
                    },
                    DependsOn: ["SingletonLambda84c0de93353f42179b0b45b6c993251aServiceRole26D59235"]
                }
            }
        }));
        test.done();
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5zaW5nbGV0b25sYW1iZGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZXN0LnNpbmdsZXRvbmxhbWJkYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNENBQXdEO0FBQ3hELDhDQUErQztBQUMvQyxvQ0FBcUM7QUFFckMsZ0NBQXlDO0FBRXpDLGlCQUFTO0lBQ1Asa0ZBQWtGLENBQUMsSUFBVTtRQUMzRixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsT0FBTztRQUNQLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDMUIsSUFBSSxxQkFBZSxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsRUFBRSxFQUFFO2dCQUMxQyxJQUFJLEVBQUUsc0NBQXNDO2dCQUM1QyxJQUFJLEVBQUUsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsbUJBQW1CLENBQUM7Z0JBQ3RELE9BQU8sRUFBRSxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVE7Z0JBQ3RDLE9BQU8sRUFBRSxhQUFhO2dCQUN0QixPQUFPLEVBQUUsR0FBRzthQUNiLENBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTztRQUNQLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsc0JBQWEsQ0FBQztZQUM3QixTQUFTLEVBQUU7Z0JBQ1Qsa0VBQWtFLEVBQUU7b0JBQ2xFLElBQUksRUFBRSxnQkFBZ0I7b0JBQ3RCLFVBQVUsRUFBRTt3QkFDVix3QkFBd0IsRUFBRTs0QkFDeEIsU0FBUyxFQUFFO2dDQUNUO29DQUNFLE1BQU0sRUFBRSxnQkFBZ0I7b0NBQ3hCLE1BQU0sRUFBRSxPQUFPO29DQUNmLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRTtpQ0FDL0M7NkJBQ0Y7NEJBQ0QsT0FBTyxFQUFFLFlBQVk7eUJBQ3RCO3dCQUNELGlCQUFpQixFQUFFOzRCQUNqQjtnQ0FDRSxVQUFVLEVBQUUsQ0FBRSxFQUFFLEVBQUUsQ0FBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRTt3Q0FDMUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSwwQ0FBMEMsQ0FBRSxDQUFFOzZCQUNuRjt5QkFDRjtxQkFDRjtpQkFDRjtnQkFDRCx1REFBdUQsRUFBRTtvQkFDdkQsSUFBSSxFQUFFLHVCQUF1QjtvQkFDN0IsVUFBVSxFQUFFO3dCQUNWLElBQUksRUFBRTs0QkFDSixPQUFPLEVBQUUsbUJBQW1CO3lCQUM3Qjt3QkFDRCxPQUFPLEVBQUUsYUFBYTt3QkFDdEIsSUFBSSxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUUsb0VBQW9FLEVBQUUsS0FBSyxDQUFFLEVBQUU7d0JBQ3ZHLE9BQU8sRUFBRSxXQUFXO3dCQUNwQixPQUFPLEVBQUUsR0FBRztxQkFDYjtvQkFDRCxTQUFTLEVBQUUsQ0FBRSxvRUFBb0UsQ0FBRTtpQkFDcEY7YUFDRjtTQUNGLENBQUMsQ0FBQyxDQUFDO1FBRUosSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2QsQ0FBQztDQUNGLENBQUMifQ==