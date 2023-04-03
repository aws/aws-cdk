"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('log group', () => {
    test('set kms key when provided', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const encryptionKey = new kms.Key(stack, 'Key');
        // WHEN
        new lib_1.LogGroup(stack, 'LogGroup', {
            encryptionKey,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
            KmsKeyId: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
        });
    });
    test('fixed retention', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.LogGroup(stack, 'LogGroup', {
            retention: lib_1.RetentionDays.ONE_WEEK,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
            RetentionInDays: 7,
        });
    });
    test('default retention', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.LogGroup(stack, 'LogGroup');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
            RetentionInDays: 731,
        });
    });
    test('infinite retention/dont delete log group by default', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.LogGroup(stack, 'LogGroup', {
            retention: lib_1.RetentionDays.INFINITE,
        });
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                LogGroupF5B46931: {
                    Type: 'AWS::Logs::LogGroup',
                    DeletionPolicy: 'Retain',
                    UpdateReplacePolicy: 'Retain',
                },
            },
        });
    });
    test('infinite retention via legacy method', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.LogGroup(stack, 'LogGroup', {
            // Don't know why TypeScript doesn't complain about passing Infinity to
            // something where an enum is expected, but better keep this behavior for
            // existing clients.
            retention: Infinity,
        });
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                LogGroupF5B46931: {
                    Type: 'AWS::Logs::LogGroup',
                    DeletionPolicy: 'Retain',
                    UpdateReplacePolicy: 'Retain',
                },
            },
        });
    });
    test('unresolved retention', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const parameter = new core_1.CfnParameter(stack, 'RetentionInDays', { default: 30, type: 'Number' });
        // WHEN
        new lib_1.LogGroup(stack, 'LogGroup', {
            retention: parameter.valueAsNumber,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
            RetentionInDays: {
                Ref: 'RetentionInDays',
            },
        });
    });
    test('will delete log group if asked to', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.LogGroup(stack, 'LogGroup', {
            retention: Infinity,
            removalPolicy: core_1.RemovalPolicy.DESTROY,
        });
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                LogGroupF5B46931: {
                    Type: 'AWS::Logs::LogGroup',
                    DeletionPolicy: 'Delete',
                    UpdateReplacePolicy: 'Delete',
                },
            },
        });
    });
    test('import from ARN, same region', () => {
        // GIVEN
        const stack2 = new core_1.Stack();
        // WHEN
        const imported = lib_1.LogGroup.fromLogGroupArn(stack2, 'lg', 'arn:aws:logs:us-east-1:123456789012:log-group:my-log-group');
        imported.addStream('MakeMeAStream');
        // THEN
        expect(imported.logGroupName).toEqual('my-log-group');
        expect(imported.logGroupArn).toEqual('arn:aws:logs:us-east-1:123456789012:log-group:my-log-group:*');
        assertions_1.Template.fromStack(stack2).hasResourceProperties('AWS::Logs::LogStream', {
            LogGroupName: 'my-log-group',
        });
    });
    test('import from ARN, different region', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const importRegion = 'asgard-1';
        // WHEN
        const imported = lib_1.LogGroup.fromLogGroupArn(stack, 'lg', `arn:aws:logs:${importRegion}:123456789012:log-group:my-log-group`);
        imported.addStream('MakeMeAStream');
        // THEN
        expect(imported.logGroupName).toEqual('my-log-group');
        expect(imported.logGroupArn).toEqual(`arn:aws:logs:${importRegion}:123456789012:log-group:my-log-group:*`);
        expect(imported.env.region).not.toEqual(stack.region);
        expect(imported.env.region).toEqual(importRegion);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogStream', {
            LogGroupName: 'my-log-group',
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
    });
    test('import from name', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const imported = lib_1.LogGroup.fromLogGroupName(stack, 'lg', 'my-log-group');
        imported.addStream('MakeMeAStream');
        // THEN
        expect(imported.logGroupName).toEqual('my-log-group');
        expect(imported.logGroupArn).toMatch(/^arn:.+:logs:.+:.+:log-group:my-log-group:\*$/);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogStream', {
            LogGroupName: 'my-log-group',
        });
    });
    describe('loggroups imported by name have stream wildcard appended to grant ARN', () => void dataDrivenTests([
        // Regardless of whether the user put :* there already because of this bug, we
        // don't want to append it twice.
        '',
        ':*',
    ], (suffix) => {
        // GIVEN
        const stack = new core_1.Stack();
        const user = new iam.User(stack, 'Role');
        const imported = lib_1.LogGroup.fromLogGroupName(stack, 'lg', `my-log-group${suffix}`);
        // WHEN
        imported.grantWrite(user);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                        Effect: 'Allow',
                        Resource: {
                            'Fn::Join': ['', [
                                    'arn:',
                                    { Ref: 'AWS::Partition' },
                                    ':logs:',
                                    { Ref: 'AWS::Region' },
                                    ':',
                                    { Ref: 'AWS::AccountId' },
                                    ':log-group:my-log-group:*',
                                ]],
                        },
                    },
                ],
            },
        });
        expect(imported.logGroupName).toEqual('my-log-group');
    }));
    describe('loggroups imported by ARN have stream wildcard appended to grant ARN', () => void dataDrivenTests([
        // Regardless of whether the user put :* there already because of this bug, we
        // don't want to append it twice.
        '',
        ':*',
    ], (suffix) => {
        // GIVEN
        const stack = new core_1.Stack();
        const user = new iam.User(stack, 'Role');
        const imported = lib_1.LogGroup.fromLogGroupArn(stack, 'lg', `arn:aws:logs:us-west-1:123456789012:log-group:my-log-group${suffix}`);
        // WHEN
        imported.grantWrite(user);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                        Effect: 'Allow',
                        Resource: 'arn:aws:logs:us-west-1:123456789012:log-group:my-log-group:*',
                    },
                ],
            },
        });
        expect(imported.logGroupName).toEqual('my-log-group');
    }));
    test('extractMetric', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const lg = new lib_1.LogGroup(stack, 'LogGroup');
        // WHEN
        const metric = lg.extractMetric('$.myField', 'MyService', 'Field');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::MetricFilter', {
            FilterPattern: '{ $.myField = "*" }',
            LogGroupName: { Ref: 'LogGroupF5B46931' },
            MetricTransformations: [
                {
                    MetricName: 'Field',
                    MetricNamespace: 'MyService',
                    MetricValue: '$.myField',
                },
            ],
        });
        expect(metric.namespace).toEqual('MyService');
        expect(metric.metricName).toEqual('Field');
    });
    test('extractMetric allows passing in namespaces with "/"', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const lg = new lib_1.LogGroup(stack, 'LogGroup');
        // WHEN
        const metric = lg.extractMetric('$.myField', 'MyNamespace/MyService', 'Field');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::MetricFilter', {
            FilterPattern: '{ $.myField = "*" }',
            MetricTransformations: [
                {
                    MetricName: 'Field',
                    MetricNamespace: 'MyNamespace/MyService',
                    MetricValue: '$.myField',
                },
            ],
        });
        expect(metric.namespace).toEqual('MyNamespace/MyService');
        expect(metric.metricName).toEqual('Field');
    });
    test('grant write', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const lg = new lib_1.LogGroup(stack, 'LogGroup');
        const user = new iam.User(stack, 'User');
        // WHEN
        lg.grantWrite(user);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
                        Effect: 'Allow',
                        Resource: { 'Fn::GetAtt': ['LogGroupF5B46931', 'Arn'] },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('grant read', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const lg = new lib_1.LogGroup(stack, 'LogGroup');
        const user = new iam.User(stack, 'User');
        // WHEN
        lg.grantRead(user);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: ['logs:FilterLogEvents', 'logs:GetLogEvents', 'logs:GetLogGroupFields', 'logs:DescribeLogGroups', 'logs:DescribeLogStreams'],
                        Effect: 'Allow',
                        Resource: { 'Fn::GetAtt': ['LogGroupF5B46931', 'Arn'] },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('grant to service principal', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const lg = new lib_1.LogGroup(stack, 'LogGroup');
        const sp = new iam.ServicePrincipal('es.amazonaws.com');
        // WHEN
        lg.grantWrite(sp);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::ResourcePolicy', {
            PolicyDocument: {
                'Fn::Join': [
                    '',
                    [
                        '{"Statement":[{"Action":["logs:CreateLogStream","logs:PutLogEvents"],"Effect":"Allow","Principal":{"Service":"es.amazonaws.com"},"Resource":"',
                        {
                            'Fn::GetAtt': [
                                'LogGroupF5B46931',
                                'Arn',
                            ],
                        },
                        '"}],"Version":"2012-10-17"}',
                    ],
                ],
            },
            PolicyName: 'LogGroupPolicy643B329C',
        });
    });
    test('when added to log groups, IAM users are converted into account IDs in the resource policy', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const lg = new lib_1.LogGroup(stack, 'LogGroup');
        // WHEN
        lg.addToResourcePolicy(new iam.PolicyStatement({
            resources: ['*'],
            actions: ['logs:PutLogEvents'],
            principals: [new iam.ArnPrincipal('arn:aws:iam::123456789012:user/user-name')],
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::ResourcePolicy', {
            PolicyDocument: '{"Statement":[{"Action":"logs:PutLogEvents","Effect":"Allow","Principal":{"AWS":"123456789012"},"Resource":"*"}],"Version":"2012-10-17"}',
            PolicyName: 'LogGroupPolicy643B329C',
        });
    });
    test('imported values are treated as if they are ARNs and converted to account IDs via CFN pseudo parameters', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const lg = new lib_1.LogGroup(stack, 'LogGroup');
        // WHEN
        lg.addToResourcePolicy(new iam.PolicyStatement({
            resources: ['*'],
            actions: ['logs:PutLogEvents'],
            principals: [iam.Role.fromRoleArn(stack, 'Role', core_1.Fn.importValue('SomeRole'))],
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::ResourcePolicy', {
            PolicyDocument: {
                'Fn::Join': [
                    '',
                    [
                        '{\"Statement\":[{\"Action\":\"logs:PutLogEvents\",\"Effect\":\"Allow\",\"Principal\":{\"AWS\":\"',
                        {
                            'Fn::Select': [
                                4,
                                { 'Fn::Split': [':', { 'Fn::ImportValue': 'SomeRole' }] },
                            ],
                        },
                        '\"},\"Resource\":\"*\"}],\"Version\":\"2012-10-17\"}',
                    ],
                ],
            },
        });
    });
    test('correctly returns physical name of the log group', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const logGroup = new lib_1.LogGroup(stack, 'LogGroup', {
            logGroupName: 'my-log-group',
        });
        // THEN
        expect(logGroup.logGroupPhysicalName()).toEqual('my-log-group');
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
            LogGroupName: 'my-log-group',
        });
    });
});
function dataDrivenTests(cases, body) {
    for (let i = 0; i < cases.length; i++) {
        const args = cases[i]; // Need to capture inside loop for safe use inside closure.
        test(`case ${i + 1}`, () => {
            body(args);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ3JvdXAudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvZ2dyb3VwLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyx3Q0FBdUU7QUFDdkUsZ0NBQWlEO0FBRWpELFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO0lBQ3pCLElBQUksQ0FBQywyQkFBMkIsRUFBRSxHQUFHLEVBQUU7UUFDckMsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVoRCxPQUFPO1FBQ1AsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtZQUM5QixhQUFhO1NBQ2QsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHFCQUFxQixFQUFFO1lBQ3JFLFFBQVEsRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsRUFBRTtTQUNuRCxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7UUFDM0IsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDOUIsU0FBUyxFQUFFLG1CQUFhLENBQUMsUUFBUTtTQUNsQyxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMscUJBQXFCLEVBQUU7WUFDckUsZUFBZSxFQUFFLENB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QUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2hFLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHFCQUFxQixFQUFFO1lBQ3JFLFlBQVksRUFBRSxjQUFjO1NBQzdCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxTQUFTLGVBQWUsQ0FBQyxLQUFlLEVBQUUsSUFBOEI7SUFDdEUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDckMsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsMkRBQTJEO1FBQ2xGLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUU7WUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7S0FDSjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMga21zIGZyb20gJ0Bhd3MtY2RrL2F3cy1rbXMnO1xuaW1wb3J0IHsgQ2ZuUGFyYW1ldGVyLCBGbiwgUmVtb3ZhbFBvbGljeSwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IExvZ0dyb3VwLCBSZXRlbnRpb25EYXlzIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ2xvZyBncm91cCcsICgpID0+IHtcbiAgdGVzdCgnc2V0IGttcyBrZXkgd2hlbiBwcm92aWRlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgZW5jcnlwdGlvbktleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnS2V5Jyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IExvZ0dyb3VwKHN0YWNrLCAnTG9nR3JvdXAnLCB7XG4gICAgICBlbmNyeXB0aW9uS2V5LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxvZ3M6OkxvZ0dyb3VwJywge1xuICAgICAgS21zS2V5SWQ6IHsgJ0ZuOjpHZXRBdHQnOiBbJ0tleTk2MUI3M0ZEJywgJ0FybiddIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZpeGVkIHJldGVudGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IExvZ0dyb3VwKHN0YWNrLCAnTG9nR3JvdXAnLCB7XG4gICAgICByZXRlbnRpb246IFJldGVudGlvbkRheXMuT05FX1dFRUssXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TG9nczo6TG9nR3JvdXAnLCB7XG4gICAgICBSZXRlbnRpb25JbkRheXM6IDcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RlZmF1bHQgcmV0ZW50aW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgTG9nR3JvdXAoc3RhY2ssICdMb2dHcm91cCcpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxvZ3M6OkxvZ0dyb3VwJywge1xuICAgICAgUmV0ZW50aW9uSW5EYXlzOiA3MzEsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2luZmluaXRlIHJldGVudGlvbi9kb250IGRlbGV0ZSBsb2cgZ3JvdXAgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IExvZ0dyb3VwKHN0YWNrLCAnTG9nR3JvdXAnLCB7XG4gICAgICByZXRlbnRpb246IFJldGVudGlvbkRheXMuSU5GSU5JVEUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIExvZ0dyb3VwRjVCNDY5MzE6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpMb2dzOjpMb2dHcm91cCcsXG4gICAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdSZXRhaW4nLFxuICAgICAgICAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdSZXRhaW4nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaW5maW5pdGUgcmV0ZW50aW9uIHZpYSBsZWdhY3kgbWV0aG9kJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgTG9nR3JvdXAoc3RhY2ssICdMb2dHcm91cCcsIHtcbiAgICAgIC8vIERvbid0IGtub3cgd2h5IFR5cGVTY3JpcHQgZG9lc24ndCBjb21wbGFpbiBhYm91dCBwYXNzaW5nIEluZmluaXR5IHRvXG4gICAgICAvLyBzb21ldGhpbmcgd2hlcmUgYW4gZW51bSBpcyBleHBlY3RlZCwgYnV0IGJldHRlciBrZWVwIHRoaXMgYmVoYXZpb3IgZm9yXG4gICAgICAvLyBleGlzdGluZyBjbGllbnRzLlxuICAgICAgcmV0ZW50aW9uOiBJbmZpbml0eSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTG9nR3JvdXBGNUI0NjkzMToge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OkxvZ3M6OkxvZ0dyb3VwJyxcbiAgICAgICAgICBEZWxldGlvblBvbGljeTogJ1JldGFpbicsXG4gICAgICAgICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ1JldGFpbicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd1bnJlc29sdmVkIHJldGVudGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcGFyYW1ldGVyID0gbmV3IENmblBhcmFtZXRlcihzdGFjaywgJ1JldGVudGlvbkluRGF5cycsIHsgZGVmYXVsdDogMzAsIHR5cGU6ICdOdW1iZXInIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBMb2dHcm91cChzdGFjaywgJ0xvZ0dyb3VwJywge1xuICAgICAgcmV0ZW50aW9uOiBwYXJhbWV0ZXIudmFsdWVBc051bWJlcixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMb2dzOjpMb2dHcm91cCcsIHtcbiAgICAgIFJldGVudGlvbkluRGF5czoge1xuICAgICAgICBSZWY6ICdSZXRlbnRpb25JbkRheXMnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnd2lsbCBkZWxldGUgbG9nIGdyb3VwIGlmIGFza2VkIHRvJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgTG9nR3JvdXAoc3RhY2ssICdMb2dHcm91cCcsIHtcbiAgICAgIHJldGVudGlvbjogSW5maW5pdHksXG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIExvZ0dyb3VwRjVCNDY5MzE6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpMb2dzOjpMb2dHcm91cCcsXG4gICAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaW1wb3J0IGZyb20gQVJOLCBzYW1lIHJlZ2lvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGltcG9ydGVkID0gTG9nR3JvdXAuZnJvbUxvZ0dyb3VwQXJuKHN0YWNrMiwgJ2xnJywgJ2Fybjphd3M6bG9nczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmxvZy1ncm91cDpteS1sb2ctZ3JvdXAnKTtcbiAgICBpbXBvcnRlZC5hZGRTdHJlYW0oJ01ha2VNZUFTdHJlYW0nKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoaW1wb3J0ZWQubG9nR3JvdXBOYW1lKS50b0VxdWFsKCdteS1sb2ctZ3JvdXAnKTtcbiAgICBleHBlY3QoaW1wb3J0ZWQubG9nR3JvdXBBcm4pLnRvRXF1YWwoJ2Fybjphd3M6bG9nczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmxvZy1ncm91cDpteS1sb2ctZ3JvdXA6KicpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjazIpLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMb2dzOjpMb2dTdHJlYW0nLCB7XG4gICAgICBMb2dHcm91cE5hbWU6ICdteS1sb2ctZ3JvdXAnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpbXBvcnQgZnJvbSBBUk4sIGRpZmZlcmVudCByZWdpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGltcG9ydFJlZ2lvbiA9ICdhc2dhcmQtMSc7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgaW1wb3J0ZWQgPSBMb2dHcm91cC5mcm9tTG9nR3JvdXBBcm4oc3RhY2ssICdsZycsXG4gICAgICBgYXJuOmF3czpsb2dzOiR7aW1wb3J0UmVnaW9ufToxMjM0NTY3ODkwMTI6bG9nLWdyb3VwOm15LWxvZy1ncm91cGApO1xuICAgIGltcG9ydGVkLmFkZFN0cmVhbSgnTWFrZU1lQVN0cmVhbScpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChpbXBvcnRlZC5sb2dHcm91cE5hbWUpLnRvRXF1YWwoJ215LWxvZy1ncm91cCcpO1xuICAgIGV4cGVjdChpbXBvcnRlZC5sb2dHcm91cEFybikudG9FcXVhbChgYXJuOmF3czpsb2dzOiR7aW1wb3J0UmVnaW9ufToxMjM0NTY3ODkwMTI6bG9nLWdyb3VwOm15LWxvZy1ncm91cDoqYCk7XG4gICAgZXhwZWN0KGltcG9ydGVkLmVudi5yZWdpb24pLm5vdC50b0VxdWFsKHN0YWNrLnJlZ2lvbik7XG4gICAgZXhwZWN0KGltcG9ydGVkLmVudi5yZWdpb24pLnRvRXF1YWwoaW1wb3J0UmVnaW9uKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxvZ3M6OkxvZ1N0cmVhbScsIHtcbiAgICAgIExvZ0dyb3VwTmFtZTogJ215LWxvZy1ncm91cCcsXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6TG9nczo6TG9nR3JvdXAnLCAwKTtcbiAgfSk7XG5cbiAgdGVzdCgnaW1wb3J0IGZyb20gbmFtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgaW1wb3J0ZWQgPSBMb2dHcm91cC5mcm9tTG9nR3JvdXBOYW1lKHN0YWNrLCAnbGcnLCAnbXktbG9nLWdyb3VwJyk7XG4gICAgaW1wb3J0ZWQuYWRkU3RyZWFtKCdNYWtlTWVBU3RyZWFtJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGltcG9ydGVkLmxvZ0dyb3VwTmFtZSkudG9FcXVhbCgnbXktbG9nLWdyb3VwJyk7XG4gICAgZXhwZWN0KGltcG9ydGVkLmxvZ0dyb3VwQXJuKS50b01hdGNoKC9eYXJuOi4rOmxvZ3M6Lis6Lis6bG9nLWdyb3VwOm15LWxvZy1ncm91cDpcXCokLyk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMb2dzOjpMb2dTdHJlYW0nLCB7XG4gICAgICBMb2dHcm91cE5hbWU6ICdteS1sb2ctZ3JvdXAnLFxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnbG9nZ3JvdXBzIGltcG9ydGVkIGJ5IG5hbWUgaGF2ZSBzdHJlYW0gd2lsZGNhcmQgYXBwZW5kZWQgdG8gZ3JhbnQgQVJOJywgKCkgPT4gdm9pZCBkYXRhRHJpdmVuVGVzdHMoW1xuICAgIC8vIFJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGUgdXNlciBwdXQgOiogdGhlcmUgYWxyZWFkeSBiZWNhdXNlIG9mIHRoaXMgYnVnLCB3ZVxuICAgIC8vIGRvbid0IHdhbnQgdG8gYXBwZW5kIGl0IHR3aWNlLlxuICAgICcnLFxuICAgICc6KicsXG4gIF0sIChzdWZmaXg6IHN0cmluZykgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnUm9sZScpO1xuICAgIGNvbnN0IGltcG9ydGVkID0gTG9nR3JvdXAuZnJvbUxvZ0dyb3VwTmFtZShzdGFjaywgJ2xnJywgYG15LWxvZy1ncm91cCR7c3VmZml4fWApO1xuXG4gICAgLy8gV0hFTlxuICAgIGltcG9ydGVkLmdyYW50V3JpdGUodXNlcik7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogWydsb2dzOkNyZWF0ZUxvZ1N0cmVhbScsICdsb2dzOlB1dExvZ0V2ZW50cyddLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgJzpsb2dzOicsXG4gICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgICAgICAnOmxvZy1ncm91cDpteS1sb2ctZ3JvdXA6KicsXG4gICAgICAgICAgICAgIF1dLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdChpbXBvcnRlZC5sb2dHcm91cE5hbWUpLnRvRXF1YWwoJ215LWxvZy1ncm91cCcpO1xuICB9KSk7XG5cbiAgZGVzY3JpYmUoJ2xvZ2dyb3VwcyBpbXBvcnRlZCBieSBBUk4gaGF2ZSBzdHJlYW0gd2lsZGNhcmQgYXBwZW5kZWQgdG8gZ3JhbnQgQVJOJywgKCkgPT4gdm9pZCBkYXRhRHJpdmVuVGVzdHMoW1xuICAgIC8vIFJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGUgdXNlciBwdXQgOiogdGhlcmUgYWxyZWFkeSBiZWNhdXNlIG9mIHRoaXMgYnVnLCB3ZVxuICAgIC8vIGRvbid0IHdhbnQgdG8gYXBwZW5kIGl0IHR3aWNlLlxuICAgICcnLFxuICAgICc6KicsXG4gIF0sIChzdWZmaXg6IHN0cmluZykgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnUm9sZScpO1xuICAgIGNvbnN0IGltcG9ydGVkID0gTG9nR3JvdXAuZnJvbUxvZ0dyb3VwQXJuKHN0YWNrLCAnbGcnLCBgYXJuOmF3czpsb2dzOnVzLXdlc3QtMToxMjM0NTY3ODkwMTI6bG9nLWdyb3VwOm15LWxvZy1ncm91cCR7c3VmZml4fWApO1xuXG4gICAgLy8gV0hFTlxuICAgIGltcG9ydGVkLmdyYW50V3JpdGUodXNlcik7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogWydsb2dzOkNyZWF0ZUxvZ1N0cmVhbScsICdsb2dzOlB1dExvZ0V2ZW50cyddLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6ICdhcm46YXdzOmxvZ3M6dXMtd2VzdC0xOjEyMzQ1Njc4OTAxMjpsb2ctZ3JvdXA6bXktbG9nLWdyb3VwOionLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KGltcG9ydGVkLmxvZ0dyb3VwTmFtZSkudG9FcXVhbCgnbXktbG9nLWdyb3VwJyk7XG4gIH0pKTtcblxuICB0ZXN0KCdleHRyYWN0TWV0cmljJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBsZyA9IG5ldyBMb2dHcm91cChzdGFjaywgJ0xvZ0dyb3VwJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbWV0cmljID0gbGcuZXh0cmFjdE1ldHJpYygnJC5teUZpZWxkJywgJ015U2VydmljZScsICdGaWVsZCcpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxvZ3M6Ok1ldHJpY0ZpbHRlcicsIHtcbiAgICAgIEZpbHRlclBhdHRlcm46ICd7ICQubXlGaWVsZCA9IFwiKlwiIH0nLFxuICAgICAgTG9nR3JvdXBOYW1lOiB7IFJlZjogJ0xvZ0dyb3VwRjVCNDY5MzEnIH0sXG4gICAgICBNZXRyaWNUcmFuc2Zvcm1hdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIE1ldHJpY05hbWU6ICdGaWVsZCcsXG4gICAgICAgICAgTWV0cmljTmFtZXNwYWNlOiAnTXlTZXJ2aWNlJyxcbiAgICAgICAgICBNZXRyaWNWYWx1ZTogJyQubXlGaWVsZCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KG1ldHJpYy5uYW1lc3BhY2UpLnRvRXF1YWwoJ015U2VydmljZScpO1xuICAgIGV4cGVjdChtZXRyaWMubWV0cmljTmFtZSkudG9FcXVhbCgnRmllbGQnKTtcbiAgfSk7XG5cbiAgdGVzdCgnZXh0cmFjdE1ldHJpYyBhbGxvd3MgcGFzc2luZyBpbiBuYW1lc3BhY2VzIHdpdGggXCIvXCInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGxnID0gbmV3IExvZ0dyb3VwKHN0YWNrLCAnTG9nR3JvdXAnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBtZXRyaWMgPSBsZy5leHRyYWN0TWV0cmljKCckLm15RmllbGQnLCAnTXlOYW1lc3BhY2UvTXlTZXJ2aWNlJywgJ0ZpZWxkJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TG9nczo6TWV0cmljRmlsdGVyJywge1xuICAgICAgRmlsdGVyUGF0dGVybjogJ3sgJC5teUZpZWxkID0gXCIqXCIgfScsXG4gICAgICBNZXRyaWNUcmFuc2Zvcm1hdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIE1ldHJpY05hbWU6ICdGaWVsZCcsXG4gICAgICAgICAgTWV0cmljTmFtZXNwYWNlOiAnTXlOYW1lc3BhY2UvTXlTZXJ2aWNlJyxcbiAgICAgICAgICBNZXRyaWNWYWx1ZTogJyQubXlGaWVsZCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KG1ldHJpYy5uYW1lc3BhY2UpLnRvRXF1YWwoJ015TmFtZXNwYWNlL015U2VydmljZScpO1xuICAgIGV4cGVjdChtZXRyaWMubWV0cmljTmFtZSkudG9FcXVhbCgnRmllbGQnKTtcbiAgfSk7XG5cbiAgdGVzdCgnZ3JhbnQgd3JpdGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGxnID0gbmV3IExvZ0dyb3VwKHN0YWNrLCAnTG9nR3JvdXAnKTtcbiAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnVXNlcicpO1xuXG4gICAgLy8gV0hFTlxuICAgIGxnLmdyYW50V3JpdGUodXNlcik7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFsnbG9nczpDcmVhdGVMb2dTdHJlYW0nLCAnbG9nczpQdXRMb2dFdmVudHMnXSxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiB7ICdGbjo6R2V0QXR0JzogWydMb2dHcm91cEY1QjQ2OTMxJywgJ0FybiddIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZ3JhbnQgcmVhZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgbGcgPSBuZXcgTG9nR3JvdXAoc3RhY2ssICdMb2dHcm91cCcpO1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdVc2VyJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbGcuZ3JhbnRSZWFkKHVzZXIpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiBbJ2xvZ3M6RmlsdGVyTG9nRXZlbnRzJywgJ2xvZ3M6R2V0TG9nRXZlbnRzJywgJ2xvZ3M6R2V0TG9nR3JvdXBGaWVsZHMnLCAnbG9nczpEZXNjcmliZUxvZ0dyb3VwcycsICdsb2dzOkRlc2NyaWJlTG9nU3RyZWFtcyddLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHsgJ0ZuOjpHZXRBdHQnOiBbJ0xvZ0dyb3VwRjVCNDY5MzEnLCAnQXJuJ10gfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdncmFudCB0byBzZXJ2aWNlIHByaW5jaXBhbCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgbGcgPSBuZXcgTG9nR3JvdXAoc3RhY2ssICdMb2dHcm91cCcpO1xuICAgIGNvbnN0IHNwID0gbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlcy5hbWF6b25hd3MuY29tJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbGcuZ3JhbnRXcml0ZShzcCk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TG9nczo6UmVzb3VyY2VQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ3tcIlN0YXRlbWVudFwiOlt7XCJBY3Rpb25cIjpbXCJsb2dzOkNyZWF0ZUxvZ1N0cmVhbVwiLFwibG9nczpQdXRMb2dFdmVudHNcIl0sXCJFZmZlY3RcIjpcIkFsbG93XCIsXCJQcmluY2lwYWxcIjp7XCJTZXJ2aWNlXCI6XCJlcy5hbWF6b25hd3MuY29tXCJ9LFwiUmVzb3VyY2VcIjpcIicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdMb2dHcm91cEY1QjQ2OTMxJyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnXCJ9XSxcIlZlcnNpb25cIjpcIjIwMTItMTAtMTdcIn0nLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgUG9saWN5TmFtZTogJ0xvZ0dyb3VwUG9saWN5NjQzQjMyOUMnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd3aGVuIGFkZGVkIHRvIGxvZyBncm91cHMsIElBTSB1c2VycyBhcmUgY29udmVydGVkIGludG8gYWNjb3VudCBJRHMgaW4gdGhlIHJlc291cmNlIHBvbGljeScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgbGcgPSBuZXcgTG9nR3JvdXAoc3RhY2ssICdMb2dHcm91cCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIGxnLmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgIGFjdGlvbnM6IFsnbG9nczpQdXRMb2dFdmVudHMnXSxcbiAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFyblByaW5jaXBhbCgnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjp1c2VyL3VzZXItbmFtZScpXSxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TG9nczo6UmVzb3VyY2VQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDogJ3tcIlN0YXRlbWVudFwiOlt7XCJBY3Rpb25cIjpcImxvZ3M6UHV0TG9nRXZlbnRzXCIsXCJFZmZlY3RcIjpcIkFsbG93XCIsXCJQcmluY2lwYWxcIjp7XCJBV1NcIjpcIjEyMzQ1Njc4OTAxMlwifSxcIlJlc291cmNlXCI6XCIqXCJ9XSxcIlZlcnNpb25cIjpcIjIwMTItMTAtMTdcIn0nLFxuICAgICAgUG9saWN5TmFtZTogJ0xvZ0dyb3VwUG9saWN5NjQzQjMyOUMnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpbXBvcnRlZCB2YWx1ZXMgYXJlIHRyZWF0ZWQgYXMgaWYgdGhleSBhcmUgQVJOcyBhbmQgY29udmVydGVkIHRvIGFjY291bnQgSURzIHZpYSBDRk4gcHNldWRvIHBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGxnID0gbmV3IExvZ0dyb3VwKHN0YWNrLCAnTG9nR3JvdXAnKTtcblxuICAgIC8vIFdIRU5cbiAgICBsZy5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICBhY3Rpb25zOiBbJ2xvZ3M6UHV0TG9nRXZlbnRzJ10sXG4gICAgICBwcmluY2lwYWxzOiBbaWFtLlJvbGUuZnJvbVJvbGVBcm4oc3RhY2ssICdSb2xlJywgRm4uaW1wb3J0VmFsdWUoJ1NvbWVSb2xlJykpXSxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TG9nczo6UmVzb3VyY2VQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ3tcXFwiU3RhdGVtZW50XFxcIjpbe1xcXCJBY3Rpb25cXFwiOlxcXCJsb2dzOlB1dExvZ0V2ZW50c1xcXCIsXFxcIkVmZmVjdFxcXCI6XFxcIkFsbG93XFxcIixcXFwiUHJpbmNpcGFsXFxcIjp7XFxcIkFXU1xcXCI6XFxcIicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICAgIDQsXG4gICAgICAgICAgICAgICAgeyAnRm46OlNwbGl0JzogWyc6JywgeyAnRm46OkltcG9ydFZhbHVlJzogJ1NvbWVSb2xlJyB9XSB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdcXFwifSxcXFwiUmVzb3VyY2VcXFwiOlxcXCIqXFxcIn1dLFxcXCJWZXJzaW9uXFxcIjpcXFwiMjAxMi0xMC0xN1xcXCJ9JyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY29ycmVjdGx5IHJldHVybnMgcGh5c2ljYWwgbmFtZSBvZiB0aGUgbG9nIGdyb3VwJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBsb2dHcm91cCA9IG5ldyBMb2dHcm91cChzdGFjaywgJ0xvZ0dyb3VwJywge1xuICAgICAgbG9nR3JvdXBOYW1lOiAnbXktbG9nLWdyb3VwJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QobG9nR3JvdXAubG9nR3JvdXBQaHlzaWNhbE5hbWUoKSkudG9FcXVhbCgnbXktbG9nLWdyb3VwJyk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TG9nczo6TG9nR3JvdXAnLCB7XG4gICAgICBMb2dHcm91cE5hbWU6ICdteS1sb2ctZ3JvdXAnLFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBkYXRhRHJpdmVuVGVzdHMoY2FzZXM6IHN0cmluZ1tdLCBib2R5OiAoc3VmZml4OiBzdHJpbmcpID0+IHZvaWQpOiB2b2lkIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYXNlcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGFyZ3MgPSBjYXNlc1tpXTsgLy8gTmVlZCB0byBjYXB0dXJlIGluc2lkZSBsb29wIGZvciBzYWZlIHVzZSBpbnNpZGUgY2xvc3VyZS5cbiAgICB0ZXN0KGBjYXNlICR7aSArIDF9YCwgKCkgPT4ge1xuICAgICAgYm9keShhcmdzKTtcbiAgICB9KTtcbiAgfVxufVxuIl19