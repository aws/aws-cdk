"use strict";
const assert_1 = require("@aws-cdk/assert");
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/cdk");
const lib_1 = require("../lib");
class TestCustomResource extends cdk.Construct {
    constructor(parent, name) {
        super(parent, name);
        const singletonLambda = new lib_1.SingletonLambda(this, 'Lambda', {
            uuid: 'TestCustomResourceProvider',
            code: new lambda.LambdaInlineCode('def hello(): pass'),
            runtime: lambda.LambdaRuntime.Python27,
            handler: 'index.hello',
            timeout: 300,
        });
        new lib_1.CustomResource(this, 'Resource', {
            lambdaProvider: singletonLambda
        });
    }
}
module.exports = {
    'custom resource is added twice, lambda is added once'(test) {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new TestCustomResource(stack, 'Custom1');
        new TestCustomResource(stack, 'Custom2');
        // THEN
        assert_1.expect(stack).toMatch({
            "Resources": {
                "SingletonLambdaTestCustomResourceProviderServiceRole81FEAB5C": {
                    "Type": "AWS::IAM::Role",
                    "Properties": {
                        "AssumeRolePolicyDocument": {
                            "Statement": [
                                {
                                    "Action": "sts:AssumeRole",
                                    "Effect": "Allow",
                                    "Principal": {
                                        "Service": "lambda.amazonaws.com"
                                    }
                                }
                            ],
                            "Version": "2012-10-17"
                        },
                        "ManagedPolicyArns": [
                            { "Fn::Join": ["", [
                                        "arn", ":", { "Ref": "AWS::Partition" }, ":", "iam", ":", "", ":", "aws", ":", "policy", "/",
                                        "service-role/AWSLambdaBasicExecutionRole"
                                    ]] }
                        ]
                    }
                },
                "SingletonLambdaTestCustomResourceProviderA9255269": {
                    "Type": "AWS::Lambda::Function",
                    "Properties": {
                        "Code": {
                            "ZipFile": "def hello(): pass"
                        },
                        "Handler": "index.hello",
                        "Role": {
                            "Fn::GetAtt": [
                                "SingletonLambdaTestCustomResourceProviderServiceRole81FEAB5C",
                                "Arn"
                            ]
                        },
                        "Runtime": "python2.7",
                        "Timeout": 300
                    },
                    "DependsOn": [
                        "SingletonLambdaTestCustomResourceProviderServiceRole81FEAB5C"
                    ]
                },
                "Custom1D319B237": {
                    "Type": "AWS::CloudFormation::CustomResource",
                    "Properties": {
                        "ServiceToken": {
                            "Fn::GetAtt": [
                                "SingletonLambdaTestCustomResourceProviderA9255269",
                                "Arn"
                            ]
                        }
                    }
                },
                "Custom2DD5FB44D": {
                    "Type": "AWS::CloudFormation::CustomResource",
                    "Properties": {
                        "ServiceToken": {
                            "Fn::GetAtt": [
                                "SingletonLambdaTestCustomResourceProviderA9255269",
                                "Arn"
                            ]
                        }
                    }
                }
            }
        });
        test.done();
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5yZXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QucmVzb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDRDQUF5QztBQUN6Qyw4Q0FBK0M7QUFDL0Msb0NBQXFDO0FBRXJDLGdDQUF5RDtBQXNGekQsd0JBQXlCLFNBQVEsR0FBRyxDQUFDLFNBQVM7SUFDNUMsWUFBWSxNQUFxQixFQUFFLElBQVk7UUFDN0MsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVwQixNQUFNLGVBQWUsR0FBRyxJQUFJLHFCQUFlLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUMxRCxJQUFJLEVBQUUsNEJBQTRCO1lBQ2xDLElBQUksRUFBRSxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQztZQUN0RCxPQUFPLEVBQUUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRO1lBQ3RDLE9BQU8sRUFBRSxhQUFhO1lBQ3RCLE9BQU8sRUFBRSxHQUFHO1NBQ2IsQ0FBQyxDQUFDO1FBRUgsSUFBSSxvQkFBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDbkMsY0FBYyxFQUFFLGVBQWU7U0FDaEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBbEdELGlCQUFTO0lBQ0wsc0RBQXNELENBQUMsSUFBVTtRQUM3RCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsT0FBTztRQUNQLElBQUksa0JBQWtCLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3pDLElBQUksa0JBQWtCLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRXpDLE9BQU87UUFDUCxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ2xCLFdBQVcsRUFBRTtnQkFDWCw4REFBOEQsRUFBRTtvQkFDOUQsTUFBTSxFQUFFLGdCQUFnQjtvQkFDeEIsWUFBWSxFQUFFO3dCQUNaLDBCQUEwQixFQUFFOzRCQUMxQixXQUFXLEVBQUU7Z0NBQ1g7b0NBQ0UsUUFBUSxFQUFFLGdCQUFnQjtvQ0FDMUIsUUFBUSxFQUFFLE9BQU87b0NBQ2pCLFdBQVcsRUFBRTt3Q0FDWCxTQUFTLEVBQUUsc0JBQXNCO3FDQUNsQztpQ0FDRjs2QkFDRjs0QkFDRCxTQUFTLEVBQUUsWUFBWTt5QkFDeEI7d0JBQ0QsbUJBQW1CLEVBQUU7NEJBQ2pCLEVBQUUsVUFBVSxFQUFFLENBQUUsRUFBRSxFQUFFO3dDQUNoQixLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxHQUFHO3dDQUM1RiwwQ0FBMEM7cUNBQUUsQ0FBRSxFQUFDO3lCQUN0RDtxQkFDRjtpQkFDRjtnQkFDRCxtREFBbUQsRUFBRTtvQkFDbkQsTUFBTSxFQUFFLHVCQUF1QjtvQkFDL0IsWUFBWSxFQUFFO3dCQUNaLE1BQU0sRUFBRTs0QkFDTixTQUFTLEVBQUUsbUJBQW1CO3lCQUMvQjt3QkFDRCxTQUFTLEVBQUUsYUFBYTt3QkFDeEIsTUFBTSxFQUFFOzRCQUNOLFlBQVksRUFBRTtnQ0FDWiw4REFBOEQ7Z0NBQzlELEtBQUs7NkJBQ047eUJBQ0Y7d0JBQ0QsU0FBUyxFQUFFLFdBQVc7d0JBQ3RCLFNBQVMsRUFBRSxHQUFHO3FCQUNmO29CQUNELFdBQVcsRUFBRTt3QkFDWCw4REFBOEQ7cUJBQy9EO2lCQUNGO2dCQUNELGlCQUFpQixFQUFFO29CQUNqQixNQUFNLEVBQUUscUNBQXFDO29CQUM3QyxZQUFZLEVBQUU7d0JBQ1osY0FBYyxFQUFFOzRCQUNkLFlBQVksRUFBRTtnQ0FDWixtREFBbUQ7Z0NBQ25ELEtBQUs7NkJBQ047eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7Z0JBQ0QsaUJBQWlCLEVBQUU7b0JBQ2pCLE1BQU0sRUFBRSxxQ0FBcUM7b0JBQzdDLFlBQVksRUFBRTt3QkFDWixjQUFjLEVBQUU7NEJBQ2QsWUFBWSxFQUFFO2dDQUNaLG1EQUFtRDtnQ0FDbkQsS0FBSzs2QkFDTjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hCLENBQUM7Q0FDSixDQUFDIn0=