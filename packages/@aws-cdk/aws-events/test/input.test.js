"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const lib_1 = require("../lib");
const rule_1 = require("../lib/rule");
describe('input', () => {
    describe('json template', () => {
        test('can just be a JSON object', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const rule = new rule_1.Rule(stack, 'Rule', {
                schedule: lib_1.Schedule.rate(cdk.Duration.minutes(1)),
            });
            // WHEN
            rule.addTarget(new SomeTarget(lib_1.RuleTargetInput.fromObject({ SomeObject: 'withAValue' })));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                Targets: [
                    {
                        Input: '{"SomeObject":"withAValue"}',
                    },
                ],
            });
        });
        test('can use joined JSON containing refs in JSON object', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const rule = new rule_1.Rule(stack, 'Rule', {
                schedule: lib_1.Schedule.rate(cdk.Duration.minutes(1)),
            });
            // WHEN
            rule.addTarget(new SomeTarget(lib_1.RuleTargetInput.fromObject({
                data: lib_1.EventField.fromPath('$'),
                stackName: cdk.Aws.STACK_NAME,
            })));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                Targets: [
                    {
                        InputTransformer: {
                            InputPathsMap: {
                                f1: '$',
                            },
                            InputTemplate: {
                                'Fn::Join': [
                                    '',
                                    [
                                        '{"data":<f1>,"stackName":"',
                                        { Ref: 'AWS::StackName' },
                                        '"}',
                                    ],
                                ],
                            },
                        },
                    },
                ],
            });
        });
        test('can use joined JSON containing refs in JSON object with tricky inputs', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const rule = new rule_1.Rule(stack, 'Rule', {
                schedule: lib_1.Schedule.rate(cdk.Duration.minutes(1)),
            });
            // WHEN
            rule.addTarget(new SomeTarget(lib_1.RuleTargetInput.fromObject({
                data: `they said \"hello\"${lib_1.EventField.fromPath('$')}`,
                stackName: cdk.Aws.STACK_NAME,
            })));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                Targets: [
                    {
                        InputTransformer: {
                            InputPathsMap: {
                                f1: '$',
                            },
                            InputTemplate: {
                                'Fn::Join': [
                                    '',
                                    [
                                        '{"data":"they said \\\"hello\\\"<f1>","stackName":"',
                                        { Ref: 'AWS::StackName' },
                                        '"}',
                                    ],
                                ],
                            },
                        },
                    },
                ],
            });
        });
        test('can use joined JSON containing refs in JSON object and concat', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const rule = new rule_1.Rule(stack, 'Rule', {
                schedule: lib_1.Schedule.rate(cdk.Duration.minutes(1)),
            });
            // WHEN
            rule.addTarget(new SomeTarget(lib_1.RuleTargetInput.fromObject({
                data: `more text ${lib_1.EventField.fromPath('$')}`,
                stackName: cdk.Aws.STACK_NAME,
            })));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                Targets: [
                    {
                        InputTransformer: {
                            InputPathsMap: {
                                f1: '$',
                            },
                            InputTemplate: {
                                'Fn::Join': [
                                    '',
                                    [
                                        '{"data":"more text <f1>","stackName":"',
                                        { Ref: 'AWS::StackName' },
                                        '"}',
                                    ],
                                ],
                            },
                        },
                    },
                ],
            });
        });
        test('can use joined JSON containing refs in JSON object and quotes', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const rule = new rule_1.Rule(stack, 'Rule', {
                schedule: lib_1.Schedule.rate(cdk.Duration.minutes(1)),
            });
            // WHEN
            rule.addTarget(new SomeTarget(lib_1.RuleTargetInput.fromObject({
                data: `more text "${lib_1.EventField.fromPath('$')}"`,
                stackName: cdk.Aws.STACK_NAME,
            })));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                Targets: [
                    {
                        InputTransformer: {
                            InputPathsMap: {
                                f1: '$',
                            },
                            InputTemplate: {
                                'Fn::Join': [
                                    '',
                                    [
                                        '{"data":"more text \\\"<f1>\\\"","stackName":"',
                                        { Ref: 'AWS::StackName' },
                                        '"}',
                                    ],
                                ],
                            },
                        },
                    },
                ],
            });
        });
        test('can use joined JSON containing refs in JSON object and multiple keys', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const rule = new rule_1.Rule(stack, 'Rule', {
                schedule: lib_1.Schedule.rate(cdk.Duration.minutes(1)),
            });
            // WHEN
            rule.addTarget(new SomeTarget(lib_1.RuleTargetInput.fromObject({
                data: `${lib_1.EventField.fromPath('$')}${lib_1.EventField.fromPath('$.other')}`,
                stackName: cdk.Aws.STACK_NAME,
            })));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                Targets: [
                    {
                        InputTransformer: {
                            InputPathsMap: {
                                f1: '$',
                            },
                            InputTemplate: {
                                'Fn::Join': [
                                    '',
                                    [
                                        '{"data":"<f1><other>","stackName":"',
                                        { Ref: 'AWS::StackName' },
                                        '"}',
                                    ],
                                ],
                            },
                        },
                    },
                ],
            });
        });
        test('can use token', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const rule = new rule_1.Rule(stack, 'Rule', {
                schedule: lib_1.Schedule.rate(cdk.Duration.minutes(1)),
            });
            const user = new aws_iam_1.User(stack, 'User');
            // WHEN
            rule.addTarget(new SomeTarget(lib_1.RuleTargetInput.fromObject({ userArn: user.userArn })));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                Targets: [
                    {
                        Input: {
                            'Fn::Join': [
                                '',
                                [
                                    '{\"userArn\":\"',
                                    {
                                        'Fn::GetAtt': [
                                            'User00B015A1',
                                            'Arn',
                                        ],
                                    },
                                    '\"}',
                                ],
                            ],
                        },
                    },
                ],
            });
        });
    });
    describe('text templates', () => {
        test('strings with newlines are serialized to a newline-delimited list of JSON strings', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const rule = new rule_1.Rule(stack, 'Rule', {
                schedule: lib_1.Schedule.rate(cdk.Duration.minutes(1)),
            });
            // WHEN
            rule.addTarget(new SomeTarget(lib_1.RuleTargetInput.fromMultilineText('I have\nmultiple lines')));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                Targets: [
                    {
                        Input: '"I have"\n"multiple lines"',
                    },
                ],
            });
        });
        test('escaped newlines are not interpreted as newlines', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const rule = new rule_1.Rule(stack, 'Rule', {
                schedule: lib_1.Schedule.rate(cdk.Duration.minutes(1)),
            });
            // WHEN
            rule.addTarget(new SomeTarget(lib_1.RuleTargetInput.fromMultilineText('this is not\\na real newline')));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                Targets: [
                    {
                        Input: '"this is not\\\\na real newline"',
                    },
                ],
            });
        });
        test('can use Tokens in text templates', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const rule = new rule_1.Rule(stack, 'Rule', {
                schedule: lib_1.Schedule.rate(cdk.Duration.minutes(1)),
            });
            const world = cdk.Lazy.string({ produce: () => 'world' });
            // WHEN
            rule.addTarget(new SomeTarget(lib_1.RuleTargetInput.fromText(`hello ${world}`)));
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                Targets: [
                    {
                        Input: '"hello world"',
                    },
                ],
            });
        });
    });
});
class SomeTarget {
    constructor(input) {
        this.input = input;
    }
    bind() {
        return { id: 'T1', arn: 'ARN1', input: this.input };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImlucHV0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MsOENBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQyxnQ0FBNEU7QUFDNUUsc0NBQW1DO0FBRW5DLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ3JCLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1FBQzdCLElBQUksQ0FBQywyQkFBMkIsRUFBRSxHQUFHLEVBQUU7WUFDckMsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlCLE1BQU0sSUFBSSxHQUFHLElBQUksV0FBSSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7Z0JBQ25DLFFBQVEsRUFBRSxjQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2pELENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksVUFBVSxDQUFDLHFCQUFlLENBQUMsVUFBVSxDQUFDLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXpGLE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBbUIsRUFBRTtnQkFDbkUsT0FBTyxFQUFFO29CQUNQO3dCQUNFLEtBQUssRUFBRSw2QkFBNkI7cUJBQ3JDO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsb0RBQW9ELEVBQUUsR0FBRyxFQUFFO1lBQzlELFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixNQUFNLElBQUksR0FBRyxJ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QUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLFVBQVU7SUFDZCxZQUFvQyxLQUFzQjtRQUF0QixVQUFLLEdBQUwsS0FBSyxDQUFpQjtLQUN6RDtJQUVNLElBQUk7UUFDVCxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDckQ7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBFdmVudEZpZWxkLCBJUnVsZVRhcmdldCwgUnVsZVRhcmdldElucHV0LCBTY2hlZHVsZSB9IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBSdWxlIH0gZnJvbSAnLi4vbGliL3J1bGUnO1xuXG5kZXNjcmliZSgnaW5wdXQnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdqc29uIHRlbXBsYXRlJywgKCkgPT4ge1xuICAgIHRlc3QoJ2NhbiBqdXN0IGJlIGEgSlNPTiBvYmplY3QnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBydWxlID0gbmV3IFJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgICAgICBzY2hlZHVsZTogU2NoZWR1bGUucmF0ZShjZGsuRHVyYXRpb24ubWludXRlcygxKSksXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgcnVsZS5hZGRUYXJnZXQobmV3IFNvbWVUYXJnZXQoUnVsZVRhcmdldElucHV0LmZyb21PYmplY3QoeyBTb21lT2JqZWN0OiAnd2l0aEFWYWx1ZScgfSkpKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgICBUYXJnZXRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgSW5wdXQ6ICd7XCJTb21lT2JqZWN0XCI6XCJ3aXRoQVZhbHVlXCJ9JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gdXNlIGpvaW5lZCBKU09OIGNvbnRhaW5pbmcgcmVmcyBpbiBKU09OIG9iamVjdCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHJ1bGUgPSBuZXcgUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgICAgIHNjaGVkdWxlOiBTY2hlZHVsZS5yYXRlKGNkay5EdXJhdGlvbi5taW51dGVzKDEpKSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBydWxlLmFkZFRhcmdldChuZXcgU29tZVRhcmdldChSdWxlVGFyZ2V0SW5wdXQuZnJvbU9iamVjdCh7XG4gICAgICAgIGRhdGE6IEV2ZW50RmllbGQuZnJvbVBhdGgoJyQnKSxcbiAgICAgICAgc3RhY2tOYW1lOiBjZGsuQXdzLlNUQUNLX05BTUUsXG4gICAgICB9KSkpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICAgIFRhcmdldHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBJbnB1dFRyYW5zZm9ybWVyOiB7XG4gICAgICAgICAgICAgIElucHV0UGF0aHNNYXA6IHtcbiAgICAgICAgICAgICAgICBmMTogJyQnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBJbnB1dFRlbXBsYXRlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICd7XCJkYXRhXCI6PGYxPixcInN0YWNrTmFtZVwiOlwiJyxcbiAgICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlN0YWNrTmFtZScgfSxcbiAgICAgICAgICAgICAgICAgICAgJ1wifScsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiB1c2Ugam9pbmVkIEpTT04gY29udGFpbmluZyByZWZzIGluIEpTT04gb2JqZWN0IHdpdGggdHJpY2t5IGlucHV0cycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHJ1bGUgPSBuZXcgUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgICAgIHNjaGVkdWxlOiBTY2hlZHVsZS5yYXRlKGNkay5EdXJhdGlvbi5taW51dGVzKDEpKSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBydWxlLmFkZFRhcmdldChuZXcgU29tZVRhcmdldChSdWxlVGFyZ2V0SW5wdXQuZnJvbU9iamVjdCh7XG4gICAgICAgIGRhdGE6IGB0aGV5IHNhaWQgXFxcImhlbGxvXFxcIiR7RXZlbnRGaWVsZC5mcm9tUGF0aCgnJCcpfWAsXG4gICAgICAgIHN0YWNrTmFtZTogY2RrLkF3cy5TVEFDS19OQU1FLFxuICAgICAgfSkpKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgICBUYXJnZXRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgSW5wdXRUcmFuc2Zvcm1lcjoge1xuICAgICAgICAgICAgICBJbnB1dFBhdGhzTWFwOiB7XG4gICAgICAgICAgICAgICAgZjE6ICckJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgSW5wdXRUZW1wbGF0ZToge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAne1wiZGF0YVwiOlwidGhleSBzYWlkIFxcXFxcXFwiaGVsbG9cXFxcXFxcIjxmMT5cIixcInN0YWNrTmFtZVwiOlwiJyxcbiAgICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlN0YWNrTmFtZScgfSxcbiAgICAgICAgICAgICAgICAgICAgJ1wifScsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiB1c2Ugam9pbmVkIEpTT04gY29udGFpbmluZyByZWZzIGluIEpTT04gb2JqZWN0IGFuZCBjb25jYXQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBydWxlID0gbmV3IFJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgICAgICBzY2hlZHVsZTogU2NoZWR1bGUucmF0ZShjZGsuRHVyYXRpb24ubWludXRlcygxKSksXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgcnVsZS5hZGRUYXJnZXQobmV3IFNvbWVUYXJnZXQoUnVsZVRhcmdldElucHV0LmZyb21PYmplY3Qoe1xuICAgICAgICBkYXRhOiBgbW9yZSB0ZXh0ICR7RXZlbnRGaWVsZC5mcm9tUGF0aCgnJCcpfWAsXG4gICAgICAgIHN0YWNrTmFtZTogY2RrLkF3cy5TVEFDS19OQU1FLFxuICAgICAgfSkpKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgICBUYXJnZXRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgSW5wdXRUcmFuc2Zvcm1lcjoge1xuICAgICAgICAgICAgICBJbnB1dFBhdGhzTWFwOiB7XG4gICAgICAgICAgICAgICAgZjE6ICckJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgSW5wdXRUZW1wbGF0ZToge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAne1wiZGF0YVwiOlwibW9yZSB0ZXh0IDxmMT5cIixcInN0YWNrTmFtZVwiOlwiJyxcbiAgICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlN0YWNrTmFtZScgfSxcbiAgICAgICAgICAgICAgICAgICAgJ1wifScsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiB1c2Ugam9pbmVkIEpTT04gY29udGFpbmluZyByZWZzIGluIEpTT04gb2JqZWN0IGFuZCBxdW90ZXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBydWxlID0gbmV3IFJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgICAgICBzY2hlZHVsZTogU2NoZWR1bGUucmF0ZShjZGsuRHVyYXRpb24ubWludXRlcygxKSksXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgcnVsZS5hZGRUYXJnZXQobmV3IFNvbWVUYXJnZXQoUnVsZVRhcmdldElucHV0LmZyb21PYmplY3Qoe1xuICAgICAgICBkYXRhOiBgbW9yZSB0ZXh0IFwiJHtFdmVudEZpZWxkLmZyb21QYXRoKCckJyl9XCJgLFxuICAgICAgICBzdGFja05hbWU6IGNkay5Bd3MuU1RBQ0tfTkFNRSxcbiAgICAgIH0pKSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgICAgVGFyZ2V0czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIElucHV0VHJhbnNmb3JtZXI6IHtcbiAgICAgICAgICAgICAgSW5wdXRQYXRoc01hcDoge1xuICAgICAgICAgICAgICAgIGYxOiAnJCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIElucHV0VGVtcGxhdGU6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ3tcImRhdGFcIjpcIm1vcmUgdGV4dCBcXFxcXFxcIjxmMT5cXFxcXFxcIlwiLFwic3RhY2tOYW1lXCI6XCInLFxuICAgICAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6U3RhY2tOYW1lJyB9LFxuICAgICAgICAgICAgICAgICAgICAnXCJ9JyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIHVzZSBqb2luZWQgSlNPTiBjb250YWluaW5nIHJlZnMgaW4gSlNPTiBvYmplY3QgYW5kIG11bHRpcGxlIGtleXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBydWxlID0gbmV3IFJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgICAgICBzY2hlZHVsZTogU2NoZWR1bGUucmF0ZShjZGsuRHVyYXRpb24ubWludXRlcygxKSksXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgcnVsZS5hZGRUYXJnZXQobmV3IFNvbWVUYXJnZXQoUnVsZVRhcmdldElucHV0LmZyb21PYmplY3Qoe1xuICAgICAgICBkYXRhOiBgJHtFdmVudEZpZWxkLmZyb21QYXRoKCckJyl9JHtFdmVudEZpZWxkLmZyb21QYXRoKCckLm90aGVyJyl9YCxcbiAgICAgICAgc3RhY2tOYW1lOiBjZGsuQXdzLlNUQUNLX05BTUUsXG4gICAgICB9KSkpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICAgIFRhcmdldHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBJbnB1dFRyYW5zZm9ybWVyOiB7XG4gICAgICAgICAgICAgIElucHV0UGF0aHNNYXA6IHtcbiAgICAgICAgICAgICAgICBmMTogJyQnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBJbnB1dFRlbXBsYXRlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICd7XCJkYXRhXCI6XCI8ZjE+PG90aGVyPlwiLFwic3RhY2tOYW1lXCI6XCInLFxuICAgICAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6U3RhY2tOYW1lJyB9LFxuICAgICAgICAgICAgICAgICAgICAnXCJ9JyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIHVzZSB0b2tlbicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHJ1bGUgPSBuZXcgUnVsZShzdGFjaywgJ1J1bGUnLCB7XG4gICAgICAgIHNjaGVkdWxlOiBTY2hlZHVsZS5yYXRlKGNkay5EdXJhdGlvbi5taW51dGVzKDEpKSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgdXNlciA9IG5ldyBVc2VyKHN0YWNrLCAnVXNlcicpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBydWxlLmFkZFRhcmdldChuZXcgU29tZVRhcmdldChSdWxlVGFyZ2V0SW5wdXQuZnJvbU9iamVjdCh7IHVzZXJBcm46IHVzZXIudXNlckFybiB9KSkpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICAgIFRhcmdldHM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBJbnB1dDoge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgJ3tcXFwidXNlckFyblxcXCI6XFxcIicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICdVc2VyMDBCMDE1QTEnLFxuICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICdcXFwifScsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgndGV4dCB0ZW1wbGF0ZXMnLCAoKSA9PiB7XG4gICAgdGVzdCgnc3RyaW5ncyB3aXRoIG5ld2xpbmVzIGFyZSBzZXJpYWxpemVkIHRvIGEgbmV3bGluZS1kZWxpbWl0ZWQgbGlzdCBvZiBKU09OIHN0cmluZ3MnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBydWxlID0gbmV3IFJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgICAgICBzY2hlZHVsZTogU2NoZWR1bGUucmF0ZShjZGsuRHVyYXRpb24ubWludXRlcygxKSksXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgcnVsZS5hZGRUYXJnZXQobmV3IFNvbWVUYXJnZXQoUnVsZVRhcmdldElucHV0LmZyb21NdWx0aWxpbmVUZXh0KCdJIGhhdmVcXG5tdWx0aXBsZSBsaW5lcycpKSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgICAgVGFyZ2V0czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIElucHV0OiAnXCJJIGhhdmVcIlxcblwibXVsdGlwbGUgbGluZXNcIicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZXNjYXBlZCBuZXdsaW5lcyBhcmUgbm90IGludGVycHJldGVkIGFzIG5ld2xpbmVzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgcnVsZSA9IG5ldyBSdWxlKHN0YWNrLCAnUnVsZScsIHtcbiAgICAgICAgc2NoZWR1bGU6IFNjaGVkdWxlLnJhdGUoY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMSkpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHJ1bGUuYWRkVGFyZ2V0KG5ldyBTb21lVGFyZ2V0KFJ1bGVUYXJnZXRJbnB1dC5mcm9tTXVsdGlsaW5lVGV4dCgndGhpcyBpcyBub3RcXFxcbmEgcmVhbCBuZXdsaW5lJykpKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgICBUYXJnZXRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgSW5wdXQ6ICdcInRoaXMgaXMgbm90XFxcXFxcXFxuYSByZWFsIG5ld2xpbmVcIicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIHVzZSBUb2tlbnMgaW4gdGV4dCB0ZW1wbGF0ZXMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBydWxlID0gbmV3IFJ1bGUoc3RhY2ssICdSdWxlJywge1xuICAgICAgICBzY2hlZHVsZTogU2NoZWR1bGUucmF0ZShjZGsuRHVyYXRpb24ubWludXRlcygxKSksXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgd29ybGQgPSBjZGsuTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiAnd29ybGQnIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBydWxlLmFkZFRhcmdldChuZXcgU29tZVRhcmdldChSdWxlVGFyZ2V0SW5wdXQuZnJvbVRleHQoYGhlbGxvICR7d29ybGR9YCkpKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgICBUYXJnZXRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgSW5wdXQ6ICdcImhlbGxvIHdvcmxkXCInLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuY2xhc3MgU29tZVRhcmdldCBpbXBsZW1lbnRzIElSdWxlVGFyZ2V0IHtcbiAgcHVibGljIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgaW5wdXQ6IFJ1bGVUYXJnZXRJbnB1dCkge1xuICB9XG5cbiAgcHVibGljIGJpbmQoKSB7XG4gICAgcmV0dXJuIHsgaWQ6ICdUMScsIGFybjogJ0FSTjEnLCBpbnB1dDogdGhpcy5pbnB1dCB9O1xuICB9XG59XG4iXX0=