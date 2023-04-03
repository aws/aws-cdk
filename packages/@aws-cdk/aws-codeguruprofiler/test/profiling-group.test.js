"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
/* eslint-disable quote-props */
describe('profiling group', () => {
    test('attach read permission to Profiling group via fromProfilingGroupArn', () => {
        const stack = new core_1.Stack();
        // dummy role to test out read permissions on ProfilingGroup
        const readAppRole = new aws_iam_1.Role(stack, 'ReadAppRole', {
            assumedBy: new aws_iam_1.AccountRootPrincipal(),
        });
        const profilingGroup = lib_1.ProfilingGroup.fromProfilingGroupArn(stack, 'MyProfilingGroup', 'arn:aws:codeguru-profiler:us-east-1:1234567890:profilingGroup/MyAwesomeProfilingGroup');
        expect(profilingGroup.profilingGroupName).toBe('MyAwesomeProfilingGroup');
        expect(profilingGroup.profilingGroupArn).toBe('arn:aws:codeguru-profiler:us-east-1:1234567890:profilingGroup/MyAwesomeProfilingGroup');
        expect(profilingGroup.env.region).toBe('us-east-1');
        profilingGroup.grantRead(readAppRole);
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'ReadAppRole52FE6317': {
                    'Type': 'AWS::IAM::Role',
                    'Properties': {
                        'AssumeRolePolicyDocument': {
                            'Statement': [
                                {
                                    'Action': 'sts:AssumeRole',
                                    'Effect': 'Allow',
                                    'Principal': {
                                        'AWS': {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {
                                                        'Ref': 'AWS::Partition',
                                                    },
                                                    ':iam::',
                                                    {
                                                        'Ref': 'AWS::AccountId',
                                                    },
                                                    ':root',
                                                ],
                                            ],
                                        },
                                    },
                                },
                            ],
                            'Version': '2012-10-17',
                        },
                    },
                },
                'ReadAppRoleDefaultPolicy4BB8955C': {
                    'Type': 'AWS::IAM::Policy',
                    'Properties': {
                        'PolicyDocument': {
                            'Statement': [
                                {
                                    'Action': [
                                        'codeguru-profiler:GetProfile',
                                        'codeguru-profiler:DescribeProfilingGroup',
                                    ],
                                    'Effect': 'Allow',
                                    'Resource': 'arn:aws:codeguru-profiler:us-east-1:1234567890:profilingGroup/MyAwesomeProfilingGroup',
                                },
                            ],
                            'Version': '2012-10-17',
                        },
                        'PolicyName': 'ReadAppRoleDefaultPolicy4BB8955C',
                        'Roles': [
                            {
                                'Ref': 'ReadAppRole52FE6317',
                            },
                        ],
                    },
                },
            },
        });
    });
    test('attach publish permission to Profiling group via fromProfilingGroupName', () => {
        const stack = new core_1.Stack();
        // dummy role to test out publish permissions on ProfilingGroup
        const publishAppRole = new aws_iam_1.Role(stack, 'PublishAppRole', {
            assumedBy: new aws_iam_1.AccountRootPrincipal(),
        });
        const profilingGroup = lib_1.ProfilingGroup.fromProfilingGroupName(stack, 'MyProfilingGroup', 'MyAwesomeProfilingGroup');
        profilingGroup.grantPublish(publishAppRole);
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'PublishAppRole9FEBD682': {
                    'Type': 'AWS::IAM::Role',
                    'Properties': {
                        'AssumeRolePolicyDocument': {
                            'Statement': [
                                {
                                    'Action': 'sts:AssumeRole',
                                    'Effect': 'Allow',
                                    'Principal': {
                                        'AWS': {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {
                                                        'Ref': 'AWS::Partition',
                                                    },
                                                    ':iam::',
                                                    {
                                                        'Ref': 'AWS::AccountId',
                                                    },
                                                    ':root',
                                                ],
                                            ],
                                        },
                                    },
                                },
                            ],
                            'Version': '2012-10-17',
                        },
                    },
                },
                'PublishAppRoleDefaultPolicyCA1E15C3': {
                    'Type': 'AWS::IAM::Policy',
                    'Properties': {
                        'PolicyDocument': {
                            'Statement': [
                                {
                                    'Action': [
                                        'codeguru-profiler:ConfigureAgent',
                                        'codeguru-profiler:PostAgentProfile',
                                    ],
                                    'Effect': 'Allow',
                                    'Resource': {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {
                                                    'Ref': 'AWS::Partition',
                                                },
                                                ':codeguru-profiler:',
                                                {
                                                    'Ref': 'AWS::Region',
                                                },
                                                ':',
                                                {
                                                    'Ref': 'AWS::AccountId',
                                                },
                                                ':profilingGroup/MyAwesomeProfilingGroup',
                                            ],
                                        ],
                                    },
                                },
                            ],
                            'Version': '2012-10-17',
                        },
                        'PolicyName': 'PublishAppRoleDefaultPolicyCA1E15C3',
                        'Roles': [
                            {
                                'Ref': 'PublishAppRole9FEBD682',
                            },
                        ],
                    },
                },
            },
        });
    });
    test('use name specified via fromProfilingGroupName', () => {
        const stack = new core_1.Stack();
        const profilingGroup = lib_1.ProfilingGroup.fromProfilingGroupName(stack, 'MyProfilingGroup', 'MyAwesomeProfilingGroup');
        expect(profilingGroup.profilingGroupName).toEqual('MyAwesomeProfilingGroup');
    });
    test('default profiling group', () => {
        const stack = new core_1.Stack();
        new lib_1.ProfilingGroup(stack, 'MyProfilingGroup', {
            profilingGroupName: 'MyAwesomeProfilingGroup',
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'MyProfilingGroup829F0507': {
                    'Type': 'AWS::CodeGuruProfiler::ProfilingGroup',
                    'Properties': {
                        'ProfilingGroupName': 'MyAwesomeProfilingGroup',
                    },
                },
            },
        });
    });
    test('allows setting its ComputePlatform', () => {
        const stack = new core_1.Stack();
        new lib_1.ProfilingGroup(stack, 'MyProfilingGroup', {
            profilingGroupName: 'MyAwesomeProfilingGroup',
            computePlatform: lib_1.ComputePlatform.AWS_LAMBDA,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeGuruProfiler::ProfilingGroup', {
            'ComputePlatform': 'AWSLambda',
        });
    });
    test('default profiling group without name', () => {
        const stack = new core_1.Stack();
        new lib_1.ProfilingGroup(stack, 'MyProfilingGroup', {});
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'MyProfilingGroup829F0507': {
                    'Type': 'AWS::CodeGuruProfiler::ProfilingGroup',
                    'Properties': {
                        'ProfilingGroupName': 'MyProfilingGroup',
                    },
                },
            },
        });
    });
    test('default profiling group without name when name exceeding limit is generated', () => {
        const stack = new core_1.Stack();
        new lib_1.ProfilingGroup(stack, 'MyProfilingGroupWithAReallyLongProfilingGroupNameThatExceedsTheLimitOfProfilingGroupNameSize_InOrderToDoSoTheNameMustBeGreaterThanTwoHundredAndFiftyFiveCharacters_InSuchCasesWePickUpTheFirstOneTwentyCharactersFromTheBeginningAndTheEndAndConcatenateThemToGetTheIdentifier', {});
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'MyProfilingGroupWithAReallyLongProfilingGroupNameThatExceedsTheLimitOfProfilingGroupNameSizeInOrderToDoSoTheNameMustBeGreaterThanTwoHundredAndFiftyFiveCharactersInSuchCasesWePickUpTheFirstOneTwentyCharactersFromTheBeginningAndTheEndAndConca4B39908C': {
                    'Type': 'AWS::CodeGuruProfiler::ProfilingGroup',
                    'Properties': {
                        'ProfilingGroupName': 'MyProfilingGroupWithAReallyLongProfilingGroupNameThatExceedsTheLimitOfProfilingGroupNameSizeInOrderToDoSoTheNameMustBeGrnTwoHundredAndFiftyFiveCharactersInSuchCasesWePickUpTheFirstOneTwentyCharactersFromTheBeginningAndTheEndAndConca2FE009B0',
                    },
                },
            },
        });
    });
    test('grant publish permissions profiling group', () => {
        const stack = new core_1.Stack();
        const profilingGroup = new lib_1.ProfilingGroup(stack, 'MyProfilingGroup', {
            profilingGroupName: 'MyAwesomeProfilingGroup',
        });
        const publishAppRole = new aws_iam_1.Role(stack, 'PublishAppRole', {
            assumedBy: new aws_iam_1.AccountRootPrincipal(),
        });
        profilingGroup.grantPublish(publishAppRole);
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'MyProfilingGroup829F0507': {
                    'Type': 'AWS::CodeGuruProfiler::ProfilingGroup',
                    'Properties': {
                        'ProfilingGroupName': 'MyAwesomeProfilingGroup',
                    },
                },
                'PublishAppRole9FEBD682': {
                    'Type': 'AWS::IAM::Role',
                    'Properties': {
                        'AssumeRolePolicyDocument': {
                            'Statement': [
                                {
                                    'Action': 'sts:AssumeRole',
                                    'Effect': 'Allow',
                                    'Principal': {
                                        'AWS': {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {
                                                        'Ref': 'AWS::Partition',
                                                    },
                                                    ':iam::',
                                                    {
                                                        'Ref': 'AWS::AccountId',
                                                    },
                                                    ':root',
                                                ],
                                            ],
                                        },
                                    },
                                },
                            ],
                            'Version': '2012-10-17',
                        },
                    },
                },
                'PublishAppRoleDefaultPolicyCA1E15C3': {
                    'Type': 'AWS::IAM::Policy',
                    'Properties': {
                        'PolicyDocument': {
                            'Statement': [
                                {
                                    'Action': [
                                        'codeguru-profiler:ConfigureAgent',
                                        'codeguru-profiler:PostAgentProfile',
                                    ],
                                    'Effect': 'Allow',
                                    'Resource': {
                                        'Fn::GetAtt': [
                                            'MyProfilingGroup829F0507',
                                            'Arn',
                                        ],
                                    },
                                },
                            ],
                            'Version': '2012-10-17',
                        },
                        'PolicyName': 'PublishAppRoleDefaultPolicyCA1E15C3',
                        'Roles': [
                            {
                                'Ref': 'PublishAppRole9FEBD682',
                            },
                        ],
                    },
                },
            },
        });
    });
    test('grant read permissions profiling group', () => {
        const stack = new core_1.Stack();
        const profilingGroup = new lib_1.ProfilingGroup(stack, 'MyProfilingGroup', {
            profilingGroupName: 'MyAwesomeProfilingGroup',
        });
        const readAppRole = new aws_iam_1.Role(stack, 'ReadAppRole', {
            assumedBy: new aws_iam_1.AccountRootPrincipal(),
        });
        profilingGroup.grantRead(readAppRole);
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'MyProfilingGroup829F0507': {
                    'Type': 'AWS::CodeGuruProfiler::ProfilingGroup',
                    'Properties': {
                        'ProfilingGroupName': 'MyAwesomeProfilingGroup',
                    },
                },
                'ReadAppRole52FE6317': {
                    'Type': 'AWS::IAM::Role',
                    'Properties': {
                        'AssumeRolePolicyDocument': {
                            'Statement': [
                                {
                                    'Action': 'sts:AssumeRole',
                                    'Effect': 'Allow',
                                    'Principal': {
                                        'AWS': {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {
                                                        'Ref': 'AWS::Partition',
                                                    },
                                                    ':iam::',
                                                    {
                                                        'Ref': 'AWS::AccountId',
                                                    },
                                                    ':root',
                                                ],
                                            ],
                                        },
                                    },
                                },
                            ],
                            'Version': '2012-10-17',
                        },
                    },
                },
                'ReadAppRoleDefaultPolicy4BB8955C': {
                    'Type': 'AWS::IAM::Policy',
                    'Properties': {
                        'PolicyDocument': {
                            'Statement': [
                                {
                                    'Action': [
                                        'codeguru-profiler:GetProfile',
                                        'codeguru-profiler:DescribeProfilingGroup',
                                    ],
                                    'Effect': 'Allow',
                                    'Resource': {
                                        'Fn::GetAtt': [
                                            'MyProfilingGroup829F0507',
                                            'Arn',
                                        ],
                                    },
                                },
                            ],
                            'Version': '2012-10-17',
                        },
                        'PolicyName': 'ReadAppRoleDefaultPolicy4BB8955C',
                        'Roles': [
                            {
                                'Ref': 'ReadAppRole52FE6317',
                            },
                        ],
                    },
                },
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsaW5nLWdyb3VwLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcm9maWxpbmctZ3JvdXAudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyw4Q0FBOEQ7QUFDOUQsd0NBQXNDO0FBQ3RDLGdDQUF5RDtBQUV6RCxnQ0FBZ0M7QUFFaEMsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtJQUMvQixJQUFJLENBQUMscUVBQXFFLEVBQUUsR0FBRyxFQUFFO1FBQy9FLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsNERBQTREO1FBQzVELE1BQU0sV0FBVyxHQUFHLElBQUksY0FBSSxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7WUFDakQsU0FBUyxFQUFFLElBQUksOEJBQW9CLEVBQUU7U0FDdEMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxjQUFjLEdBQUcsb0JBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUUsdUZBQXVGLENBQUMsQ0FBQztRQUNoTCxNQUFNLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDMUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyx1RkFBdUYsQ0FBQyxDQUFDO1FBQ3ZJLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVwRCxjQUFjLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXRDLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQztZQUN4QyxXQUFXLEVBQUU7Z0JBQ1gscUJBQXFCLEVBQUU7b0JBQ3JCLE1BQU0sRUFBRSxnQkFBZ0I7b0JBQ3hCLFlBQVksRUFBRTt3QkFDWiwwQkFB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dCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBBY2NvdW50Um9vdFByaW5jaXBhbCwgUm9sZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFByb2ZpbGluZ0dyb3VwLCBDb21wdXRlUGxhdGZvcm0gfSBmcm9tICcuLi9saWInO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuXG5kZXNjcmliZSgncHJvZmlsaW5nIGdyb3VwJywgKCkgPT4ge1xuICB0ZXN0KCdhdHRhY2ggcmVhZCBwZXJtaXNzaW9uIHRvIFByb2ZpbGluZyBncm91cCB2aWEgZnJvbVByb2ZpbGluZ0dyb3VwQXJuJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgLy8gZHVtbXkgcm9sZSB0byB0ZXN0IG91dCByZWFkIHBlcm1pc3Npb25zIG9uIFByb2ZpbGluZ0dyb3VwXG4gICAgY29uc3QgcmVhZEFwcFJvbGUgPSBuZXcgUm9sZShzdGFjaywgJ1JlYWRBcHBSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgQWNjb3VudFJvb3RQcmluY2lwYWwoKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHByb2ZpbGluZ0dyb3VwID0gUHJvZmlsaW5nR3JvdXAuZnJvbVByb2ZpbGluZ0dyb3VwQXJuKHN0YWNrLCAnTXlQcm9maWxpbmdHcm91cCcsICdhcm46YXdzOmNvZGVndXJ1LXByb2ZpbGVyOnVzLWVhc3QtMToxMjM0NTY3ODkwOnByb2ZpbGluZ0dyb3VwL015QXdlc29tZVByb2ZpbGluZ0dyb3VwJyk7XG4gICAgZXhwZWN0KHByb2ZpbGluZ0dyb3VwLnByb2ZpbGluZ0dyb3VwTmFtZSkudG9CZSgnTXlBd2Vzb21lUHJvZmlsaW5nR3JvdXAnKTtcbiAgICBleHBlY3QocHJvZmlsaW5nR3JvdXAucHJvZmlsaW5nR3JvdXBBcm4pLnRvQmUoJ2Fybjphd3M6Y29kZWd1cnUtcHJvZmlsZXI6dXMtZWFzdC0xOjEyMzQ1Njc4OTA6cHJvZmlsaW5nR3JvdXAvTXlBd2Vzb21lUHJvZmlsaW5nR3JvdXAnKTtcbiAgICBleHBlY3QocHJvZmlsaW5nR3JvdXAuZW52LnJlZ2lvbikudG9CZSgndXMtZWFzdC0xJyk7XG5cbiAgICBwcm9maWxpbmdHcm91cC5ncmFudFJlYWQocmVhZEFwcFJvbGUpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ1JlYWRBcHBSb2xlNTJGRTYzMTcnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpJQU06OlJvbGUnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ0Fzc3VtZVJvbGVQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnQWN0aW9uJzogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0FXUyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc6aWFtOjonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc6cm9vdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnUmVhZEFwcFJvbGVEZWZhdWx0UG9saWN5NEJCODk1NUMnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpJQU06OlBvbGljeScsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAgICAgJ2NvZGVndXJ1LXByb2ZpbGVyOkdldFByb2ZpbGUnLFxuICAgICAgICAgICAgICAgICAgICAnY29kZWd1cnUtcHJvZmlsZXI6RGVzY3JpYmVQcm9maWxpbmdHcm91cCcsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgICAnUmVzb3VyY2UnOiAnYXJuOmF3czpjb2RlZ3VydS1wcm9maWxlcjp1cy1lYXN0LTE6MTIzNDU2Nzg5MDpwcm9maWxpbmdHcm91cC9NeUF3ZXNvbWVQcm9maWxpbmdHcm91cCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1BvbGljeU5hbWUnOiAnUmVhZEFwcFJvbGVEZWZhdWx0UG9saWN5NEJCODk1NUMnLFxuICAgICAgICAgICAgJ1JvbGVzJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ1JlZic6ICdSZWFkQXBwUm9sZTUyRkU2MzE3JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2F0dGFjaCBwdWJsaXNoIHBlcm1pc3Npb24gdG8gUHJvZmlsaW5nIGdyb3VwIHZpYSBmcm9tUHJvZmlsaW5nR3JvdXBOYW1lJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgLy8gZHVtbXkgcm9sZSB0byB0ZXN0IG91dCBwdWJsaXNoIHBlcm1pc3Npb25zIG9uIFByb2ZpbGluZ0dyb3VwXG4gICAgY29uc3QgcHVibGlzaEFwcFJvbGUgPSBuZXcgUm9sZShzdGFjaywgJ1B1Ymxpc2hBcHBSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgQWNjb3VudFJvb3RQcmluY2lwYWwoKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHByb2ZpbGluZ0dyb3VwID0gUHJvZmlsaW5nR3JvdXAuZnJvbVByb2ZpbGluZ0dyb3VwTmFtZShzdGFjaywgJ015UHJvZmlsaW5nR3JvdXAnLCAnTXlBd2Vzb21lUHJvZmlsaW5nR3JvdXAnKTtcbiAgICBwcm9maWxpbmdHcm91cC5ncmFudFB1Ymxpc2gocHVibGlzaEFwcFJvbGUpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ1B1Ymxpc2hBcHBSb2xlOUZFQkQ2ODInOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpJQU06OlJvbGUnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ0Fzc3VtZVJvbGVQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnQWN0aW9uJzogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0FXUyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc6aWFtOjonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc6cm9vdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnUHVibGlzaEFwcFJvbGVEZWZhdWx0UG9saWN5Q0ExRTE1QzMnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpJQU06OlBvbGljeScsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAgICAgJ2NvZGVndXJ1LXByb2ZpbGVyOkNvbmZpZ3VyZUFnZW50JyxcbiAgICAgICAgICAgICAgICAgICAgJ2NvZGVndXJ1LXByb2ZpbGVyOlBvc3RBZ2VudFByb2ZpbGUnLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAnOmNvZGVndXJ1LXByb2ZpbGVyOicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJzpwcm9maWxpbmdHcm91cC9NeUF3ZXNvbWVQcm9maWxpbmdHcm91cCcsXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1BvbGljeU5hbWUnOiAnUHVibGlzaEFwcFJvbGVEZWZhdWx0UG9saWN5Q0ExRTE1QzMnLFxuICAgICAgICAgICAgJ1JvbGVzJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ1JlZic6ICdQdWJsaXNoQXBwUm9sZTlGRUJENjgyJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3VzZSBuYW1lIHNwZWNpZmllZCB2aWEgZnJvbVByb2ZpbGluZ0dyb3VwTmFtZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgcHJvZmlsaW5nR3JvdXAgPSBQcm9maWxpbmdHcm91cC5mcm9tUHJvZmlsaW5nR3JvdXBOYW1lKHN0YWNrLCAnTXlQcm9maWxpbmdHcm91cCcsICdNeUF3ZXNvbWVQcm9maWxpbmdHcm91cCcpO1xuICAgIGV4cGVjdChwcm9maWxpbmdHcm91cC5wcm9maWxpbmdHcm91cE5hbWUpLnRvRXF1YWwoJ015QXdlc29tZVByb2ZpbGluZ0dyb3VwJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RlZmF1bHQgcHJvZmlsaW5nIGdyb3VwJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgbmV3IFByb2ZpbGluZ0dyb3VwKHN0YWNrLCAnTXlQcm9maWxpbmdHcm91cCcsIHtcbiAgICAgIHByb2ZpbGluZ0dyb3VwTmFtZTogJ015QXdlc29tZVByb2ZpbGluZ0dyb3VwJyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdNeVByb2ZpbGluZ0dyb3VwODI5RjA1MDcnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpDb2RlR3VydVByb2ZpbGVyOjpQcm9maWxpbmdHcm91cCcsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnUHJvZmlsaW5nR3JvdXBOYW1lJzogJ015QXdlc29tZVByb2ZpbGluZ0dyb3VwJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWxsb3dzIHNldHRpbmcgaXRzIENvbXB1dGVQbGF0Zm9ybScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIG5ldyBQcm9maWxpbmdHcm91cChzdGFjaywgJ015UHJvZmlsaW5nR3JvdXAnLCB7XG4gICAgICBwcm9maWxpbmdHcm91cE5hbWU6ICdNeUF3ZXNvbWVQcm9maWxpbmdHcm91cCcsXG4gICAgICBjb21wdXRlUGxhdGZvcm06IENvbXB1dGVQbGF0Zm9ybS5BV1NfTEFNQkRBLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUd1cnVQcm9maWxlcjo6UHJvZmlsaW5nR3JvdXAnLCB7XG4gICAgICAnQ29tcHV0ZVBsYXRmb3JtJzogJ0FXU0xhbWJkYScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RlZmF1bHQgcHJvZmlsaW5nIGdyb3VwIHdpdGhvdXQgbmFtZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIG5ldyBQcm9maWxpbmdHcm91cChzdGFjaywgJ015UHJvZmlsaW5nR3JvdXAnLCB7XG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlQcm9maWxpbmdHcm91cDgyOUYwNTA3Jzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6Q29kZUd1cnVQcm9maWxlcjo6UHJvZmlsaW5nR3JvdXAnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ1Byb2ZpbGluZ0dyb3VwTmFtZSc6ICdNeVByb2ZpbGluZ0dyb3VwJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZGVmYXVsdCBwcm9maWxpbmcgZ3JvdXAgd2l0aG91dCBuYW1lIHdoZW4gbmFtZSBleGNlZWRpbmcgbGltaXQgaXMgZ2VuZXJhdGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgbmV3IFByb2ZpbGluZ0dyb3VwKHN0YWNrLCAnTXlQcm9maWxpbmdHcm91cFdpdGhBUmVhbGx5TG9uZ1Byb2ZpbGluZ0dyb3VwTmFtZVRoYXRFeGNlZWRzVGhlTGltaXRPZlByb2ZpbGluZ0dyb3VwTmFtZVNpemVfSW5PcmRlclRvRG9Tb1RoZU5hbWVNdXN0QmVHcmVhdGVyVGhhblR3b0h1bmRyZWRBbmRGaWZ0eUZpdmVDaGFyYWN0ZXJzX0luU3VjaENhc2VzV2VQaWNrVXBUaGVGaXJzdE9uZVR3ZW50eUNoYXJhY3RlcnNGcm9tVGhlQmVnaW5uaW5nQW5kVGhlRW5kQW5kQ29uY2F0ZW5hdGVUaGVtVG9HZXRUaGVJZGVudGlmaWVyJywge1xuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ015UHJvZmlsaW5nR3JvdXBXaXRoQVJlYWxseUxvbmdQcm9maWxpbmdHcm91cE5hbWVUaGF0RXhjZWVkc1RoZUxpbWl0T2ZQcm9maWxpbmdHcm91cE5hbWVTaXplSW5PcmRlclRvRG9Tb1RoZU5hbWVNdXN0QmVHcmVhdGVyVGhhblR3b0h1bmRyZWRBbmRGaWZ0eUZpdmVDaGFyYWN0ZXJzSW5TdWNoQ2FzZXNXZVBpY2tVcFRoZUZpcnN0T25lVHdlbnR5Q2hhcmFjdGVyc0Zyb21UaGVCZWdpbm5pbmdBbmRUaGVFbmRBbmRDb25jYTRCMzk5MDhDJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6Q29kZUd1cnVQcm9maWxlcjo6UHJvZmlsaW5nR3JvdXAnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ1Byb2ZpbGluZ0dyb3VwTmFtZSc6ICdNeVByb2ZpbGluZ0dyb3VwV2l0aEFSZWFsbHlMb25nUHJvZmlsaW5nR3JvdXBOYW1lVGhhdEV4Y2VlZHNUaGVMaW1pdE9mUHJvZmlsaW5nR3JvdXBOYW1lU2l6ZUluT3JkZXJUb0RvU29UaGVOYW1lTXVzdEJlR3JuVHdvSHVuZHJlZEFuZEZpZnR5Rml2ZUNoYXJhY3RlcnNJblN1Y2hDYXNlc1dlUGlja1VwVGhlRmlyc3RPbmVUd2VudHlDaGFyYWN0ZXJzRnJvbVRoZUJlZ2lubmluZ0FuZFRoZUVuZEFuZENvbmNhMkZFMDA5QjAnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdncmFudCBwdWJsaXNoIHBlcm1pc3Npb25zIHByb2ZpbGluZyBncm91cCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHByb2ZpbGluZ0dyb3VwID0gbmV3IFByb2ZpbGluZ0dyb3VwKHN0YWNrLCAnTXlQcm9maWxpbmdHcm91cCcsIHtcbiAgICAgIHByb2ZpbGluZ0dyb3VwTmFtZTogJ015QXdlc29tZVByb2ZpbGluZ0dyb3VwJyxcbiAgICB9KTtcbiAgICBjb25zdCBwdWJsaXNoQXBwUm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnUHVibGlzaEFwcFJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBBY2NvdW50Um9vdFByaW5jaXBhbCgpLFxuICAgIH0pO1xuXG4gICAgcHJvZmlsaW5nR3JvdXAuZ3JhbnRQdWJsaXNoKHB1Ymxpc2hBcHBSb2xlKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdNeVByb2ZpbGluZ0dyb3VwODI5RjA1MDcnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpDb2RlR3VydVByb2ZpbGVyOjpQcm9maWxpbmdHcm91cCcsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnUHJvZmlsaW5nR3JvdXBOYW1lJzogJ015QXdlc29tZVByb2ZpbGluZ0dyb3VwJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnUHVibGlzaEFwcFJvbGU5RkVCRDY4Mic6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OklBTTo6Um9sZScsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnQXNzdW1lUm9sZVBvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdBY3Rpb24nOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgICAnUHJpbmNpcGFsJzoge1xuICAgICAgICAgICAgICAgICAgICAnQVdTJzoge1xuICAgICAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJzppYW06OicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJzpyb290JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdQdWJsaXNoQXBwUm9sZURlZmF1bHRQb2xpY3lDQTFFMTVDMyc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OklBTTo6UG9saWN5JyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAgICAgICAnY29kZWd1cnUtcHJvZmlsZXI6Q29uZmlndXJlQWdlbnQnLFxuICAgICAgICAgICAgICAgICAgICAnY29kZWd1cnUtcHJvZmlsZXI6UG9zdEFnZW50UHJvZmlsZScsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgICAnUmVzb3VyY2UnOiB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICdNeVByb2ZpbGluZ0dyb3VwODI5RjA1MDcnLFxuICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnUG9saWN5TmFtZSc6ICdQdWJsaXNoQXBwUm9sZURlZmF1bHRQb2xpY3lDQTFFMTVDMycsXG4gICAgICAgICAgICAnUm9sZXMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnUmVmJzogJ1B1Ymxpc2hBcHBSb2xlOUZFQkQ2ODInLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZ3JhbnQgcmVhZCBwZXJtaXNzaW9ucyBwcm9maWxpbmcgZ3JvdXAnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwcm9maWxpbmdHcm91cCA9IG5ldyBQcm9maWxpbmdHcm91cChzdGFjaywgJ015UHJvZmlsaW5nR3JvdXAnLCB7XG4gICAgICBwcm9maWxpbmdHcm91cE5hbWU6ICdNeUF3ZXNvbWVQcm9maWxpbmdHcm91cCcsXG4gICAgfSk7XG4gICAgY29uc3QgcmVhZEFwcFJvbGUgPSBuZXcgUm9sZShzdGFjaywgJ1JlYWRBcHBSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgQWNjb3VudFJvb3RQcmluY2lwYWwoKSxcbiAgICB9KTtcblxuICAgIHByb2ZpbGluZ0dyb3VwLmdyYW50UmVhZChyZWFkQXBwUm9sZSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAnUmVzb3VyY2VzJzoge1xuICAgICAgICAnTXlQcm9maWxpbmdHcm91cDgyOUYwNTA3Jzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6Q29kZUd1cnVQcm9maWxlcjo6UHJvZmlsaW5nR3JvdXAnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ1Byb2ZpbGluZ0dyb3VwTmFtZSc6ICdNeUF3ZXNvbWVQcm9maWxpbmdHcm91cCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ1JlYWRBcHBSb2xlNTJGRTYzMTcnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpJQU06OlJvbGUnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ0Fzc3VtZVJvbGVQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnQWN0aW9uJzogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0FXUyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc6aWFtOjonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc6cm9vdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnUmVhZEFwcFJvbGVEZWZhdWx0UG9saWN5NEJCODk1NUMnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpJQU06OlBvbGljeScsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAgICAgJ2NvZGVndXJ1LXByb2ZpbGVyOkdldFByb2ZpbGUnLFxuICAgICAgICAgICAgICAgICAgICAnY29kZWd1cnUtcHJvZmlsZXI6RGVzY3JpYmVQcm9maWxpbmdHcm91cCcsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgICAnUmVzb3VyY2UnOiB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICdNeVByb2ZpbGluZ0dyb3VwODI5RjA1MDcnLFxuICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnUG9saWN5TmFtZSc6ICdSZWFkQXBwUm9sZURlZmF1bHRQb2xpY3k0QkI4OTU1QycsXG4gICAgICAgICAgICAnUm9sZXMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnUmVmJzogJ1JlYWRBcHBSb2xlNTJGRTYzMTcnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==