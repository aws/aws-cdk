"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('event bus', () => {
    test('default event bus', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.EventBus(stack, 'Bus');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::EventBus', {
            Name: 'Bus',
        });
    });
    test('default event bus with empty props object', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.EventBus(stack, 'Bus', {});
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::EventBus', {
            Name: 'Bus',
        });
    });
    test('named event bus', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.EventBus(stack, 'Bus', {
            eventBusName: 'myEventBus',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::EventBus', {
            Name: 'myEventBus',
        });
    });
    test('partner event bus', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.EventBus(stack, 'Bus', {
            eventSourceName: 'aws.partner/PartnerName/acct1/repo1',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::EventBus', {
            Name: 'aws.partner/PartnerName/acct1/repo1',
            EventSourceName: 'aws.partner/PartnerName/acct1/repo1',
        });
    });
    test('imported event bus', () => {
        const stack = new core_1.Stack();
        const eventBus = new lib_1.EventBus(stack, 'Bus');
        const importEB = lib_1.EventBus.fromEventBusArn(stack, 'ImportBus', eventBus.eventBusArn);
        // WHEN
        new core_1.CfnResource(stack, 'Res', {
            type: 'Test::Resource',
            properties: {
                EventBusArn1: eventBus.eventBusArn,
                EventBusArn2: importEB.eventBusArn,
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('Test::Resource', {
            EventBusArn1: { 'Fn::GetAtt': ['BusEA82B648', 'Arn'] },
            EventBusArn2: { 'Fn::GetAtt': ['BusEA82B648', 'Arn'] },
        });
    });
    test('imported event bus from name', () => {
        const stack = new core_1.Stack();
        const eventBus = new lib_1.EventBus(stack, 'Bus', { eventBusName: 'test-bus-to-import-by-name' });
        const importEB = lib_1.EventBus.fromEventBusName(stack, 'ImportBus', eventBus.eventBusName);
        // WHEN
        expect(stack.resolve(eventBus.eventBusName)).toEqual(stack.resolve(importEB.eventBusName));
    });
    test('same account imported event bus has right resource env', () => {
        const stack = new core_1.Stack();
        const eventBus = new lib_1.EventBus(stack, 'Bus');
        const importEB = lib_1.EventBus.fromEventBusArn(stack, 'ImportBus', eventBus.eventBusArn);
        // WHEN
        expect(stack.resolve(importEB.env.account)).toEqual({ 'Fn::Select': [4, { 'Fn::Split': [':', { 'Fn::GetAtt': ['BusEA82B648', 'Arn'] }] }] });
        expect(stack.resolve(importEB.env.region)).toEqual({ 'Fn::Select': [3, { 'Fn::Split': [':', { 'Fn::GetAtt': ['BusEA82B648', 'Arn'] }] }] });
    });
    test('cross account imported event bus has right resource env', () => {
        const stack = new core_1.Stack();
        const arnParts = {
            resource: 'bus',
            service: 'events',
            account: 'myAccount',
            region: 'us-west-1',
        };
        const arn = core_1.Arn.format(arnParts, stack);
        const importEB = lib_1.EventBus.fromEventBusArn(stack, 'ImportBus', arn);
        // WHEN
        expect(importEB.env.account).toEqual(arnParts.account);
        expect(importEB.env.region).toEqual(arnParts.region);
    });
    test('can get bus name', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const bus = new lib_1.EventBus(stack, 'Bus', {
            eventBusName: 'myEventBus',
        });
        // WHEN
        new core_1.CfnResource(stack, 'Res', {
            type: 'Test::Resource',
            properties: {
                EventBusName: bus.eventBusName,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Test::Resource', {
            EventBusName: { Ref: 'BusEA82B648' },
        });
    });
    test('can get bus arn', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const bus = new lib_1.EventBus(stack, 'Bus', {
            eventBusName: 'myEventBus',
        });
        // WHEN
        new core_1.CfnResource(stack, 'Res', {
            type: 'Test::Resource',
            properties: {
                EventBusArn: bus.eventBusArn,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Test::Resource', {
            EventBusArn: { 'Fn::GetAtt': ['BusEA82B648', 'Arn'] },
        });
    });
    test('event bus name cannot be default', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const createInvalidBus = () => new lib_1.EventBus(stack, 'Bus', {
            eventBusName: 'default',
        });
        // THEN
        expect(() => {
            createInvalidBus();
        }).toThrow(/'eventBusName' must not be 'default'/);
    });
    test('event bus name cannot contain slash', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const createInvalidBus = () => new lib_1.EventBus(stack, 'Bus', {
            eventBusName: 'my/bus',
        });
        // THEN
        expect(() => {
            createInvalidBus();
        }).toThrow(/'eventBusName' must not contain '\/'/);
    });
    test('event bus cannot have name and source name', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const createInvalidBus = () => new lib_1.EventBus(stack, 'Bus', {
            eventBusName: 'myBus',
            eventSourceName: 'myBus',
        });
        // THEN
        expect(() => {
            createInvalidBus();
        }).toThrow(/'eventBusName' and 'eventSourceName' cannot both be provided/);
    });
    test('event bus name cannot be empty string', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const createInvalidBus = () => new lib_1.EventBus(stack, 'Bus', {
            eventBusName: '',
        });
        // THEN
        expect(() => {
            createInvalidBus();
        }).toThrow(/'eventBusName' must satisfy: /);
    });
    test('does not throw if eventBusName is a token', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN / THEN
        expect(() => new lib_1.EventBus(stack, 'EventBus', {
            eventBusName: core_1.Aws.STACK_NAME,
        })).not.toThrow();
    });
    test('event bus source name must follow pattern', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const createInvalidBus = () => new lib_1.EventBus(stack, 'Bus', {
            eventSourceName: 'invalid-partner',
        });
        // THEN
        expect(() => {
            createInvalidBus();
        }).toThrow(/'eventSourceName' must satisfy: \/\^aws/);
    });
    test('does not throw if eventSourceName is a token', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN / THEN
        expect(() => new lib_1.EventBus(stack, 'EventBus', {
            eventSourceName: core_1.Aws.STACK_NAME,
        })).not.toThrow();
    });
    test('event bus source name cannot be empty string', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const createInvalidBus = () => new lib_1.EventBus(stack, 'Bus', {
            eventSourceName: '',
        });
        // THEN
        expect(() => {
            createInvalidBus();
        }).toThrow(/'eventSourceName' must satisfy: /);
    });
    (0, cdk_build_tools_1.testDeprecated)('can grant PutEvents', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const role = new iam.Role(stack, 'Role', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });
        // WHEN
        lib_1.EventBus.grantPutEvents(role);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'events:PutEvents',
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
            Roles: [
                {
                    Ref: 'Role1ABCC5F0',
                },
            ],
        });
    });
    test('can grant PutEvents using grantAllPutEvents', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const role = new iam.Role(stack, 'Role', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });
        // WHEN
        lib_1.EventBus.grantAllPutEvents(role);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'events:PutEvents',
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
            Roles: [
                {
                    Ref: 'Role1ABCC5F0',
                },
            ],
        });
    });
    test('can grant PutEvents to a specific event bus', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const role = new iam.Role(stack, 'Role', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });
        const eventBus = new lib_1.EventBus(stack, 'EventBus');
        // WHEN
        eventBus.grantPutEventsTo(role);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'events:PutEvents',
                        Effect: 'Allow',
                        Resource: {
                            'Fn::GetAtt': [
                                'EventBus7B8748AA',
                                'Arn',
                            ],
                        },
                    },
                ],
                Version: '2012-10-17',
            },
            Roles: [
                {
                    Ref: 'Role1ABCC5F0',
                },
            ],
        });
    });
    test('can archive events', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const event = new lib_1.EventBus(stack, 'Bus');
        event.archive('MyArchive', {
            eventPattern: {
                account: [stack.account],
            },
            archiveName: 'MyArchive',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::EventBus', {
            Name: 'Bus',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Archive', {
            SourceArn: {
                'Fn::GetAtt': [
                    'BusEA82B648',
                    'Arn',
                ],
            },
            Description: {
                'Fn::Join': [
                    '',
                    [
                        'Event Archive for ',
                        {
                            Ref: 'BusEA82B648',
                        },
                        ' Event Bus',
                    ],
                ],
            },
            EventPattern: {
                account: [
                    {
                        Ref: 'AWS::AccountId',
                    },
                ],
            },
            RetentionDays: 0,
            ArchiveName: 'MyArchive',
        });
    });
    test('can archive events from an imported EventBus', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const bus = new lib_1.EventBus(stack, 'Bus');
        const importedBus = lib_1.EventBus.fromEventBusArn(stack, 'ImportedBus', bus.eventBusArn);
        importedBus.archive('MyArchive', {
            eventPattern: {
                account: [stack.account],
            },
            archiveName: 'MyArchive',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::EventBus', {
            Name: 'Bus',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Archive', {
            SourceArn: {
                'Fn::GetAtt': [
                    'BusEA82B648',
                    'Arn',
                ],
            },
            Description: {
                'Fn::Join': [
                    '',
                    [
                        'Event Archive for ',
                        {
                            'Fn::Select': [
                                1,
                                {
                                    'Fn::Split': [
                                        '/',
                                        {
                                            'Fn::Select': [
                                                5,
                                                {
                                                    'Fn::Split': [
                                                        ':',
                                                        {
                                                            'Fn::GetAtt': [
                                                                'BusEA82B648',
                                                                'Arn',
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        ' Event Bus',
                    ],
                ],
            },
            EventPattern: {
                account: [
                    {
                        Ref: 'AWS::AccountId',
                    },
                ],
            },
            RetentionDays: 0,
            ArchiveName: 'MyArchive',
        });
    });
    test('cross account event bus uses generated physical name', () => {
        // GIVEN
        const app = new core_1.App();
        const stack1 = new core_1.Stack(app, 'Stack1', {
            env: {
                account: '11111111111',
                region: 'us-east-1',
            },
        });
        const stack2 = new core_1.Stack(app, 'Stack2', {
            env: {
                account: '22222222222',
                region: 'us-east-1',
            },
        });
        // WHEN
        const bus1 = new lib_1.EventBus(stack1, 'Bus', {
            eventBusName: core_1.PhysicalName.GENERATE_IF_NEEDED,
        });
        new core_1.CfnOutput(stack2, 'BusName', { value: bus1.eventBusName });
        // THEN
        assertions_1.Template.fromStack(stack1).hasResourceProperties('AWS::Events::EventBus', {
            Name: 'stack1stack1busca19bdf8ab2e51b62a5a',
        });
    });
    test('can add one event bus policy', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'Stack');
        const bus = new lib_1.EventBus(stack, 'Bus');
        // WHEN
        bus.addToResourcePolicy(new iam.PolicyStatement({
            effect: aws_iam_1.Effect.ALLOW,
            principals: [new iam.AccountPrincipal('111111111111111')],
            actions: ['events:PutEvents'],
            sid: '123',
            resources: [bus.eventBusArn],
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::EventBusPolicy', {
            StatementId: '123',
            EventBusName: {
                Ref: 'BusEA82B648',
            },
            Statement: {
                Action: 'events:PutEvents',
                Effect: 'Allow',
                Principal: {
                    AWS: {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {
                                    Ref: 'AWS::Partition',
                                },
                                ':iam::111111111111111:root',
                            ],
                        ],
                    },
                },
                Sid: '123',
                Resource: {
                    'Fn::GetAtt': [
                        'BusEA82B648',
                        'Arn',
                    ],
                },
            },
        });
    });
    test('cannot add more than one event bus policy', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'Stack');
        const bus = new lib_1.EventBus(stack, 'Bus');
        const statement = new iam.PolicyStatement({
            effect: aws_iam_1.Effect.ALLOW,
            principals: [new iam.ArnPrincipal('arn')],
            actions: ['events:PutEvents'],
            sid: '123',
            resources: [bus.eventBusArn],
        });
        // WHEN
        const add1 = bus.addToResourcePolicy(statement);
        const add2 = bus.addToResourcePolicy(statement);
        // THEN
        expect(add1.statementAdded).toBe(true);
        expect(add2.statementAdded).toBe(false);
    });
    test('Event Bus policy statements must have a sid', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'Stack');
        const bus = new lib_1.EventBus(stack, 'Bus');
        // THEN
        expect(() => bus.addToResourcePolicy(new iam.PolicyStatement({
            effect: aws_iam_1.Effect.ALLOW,
            principals: [new iam.ArnPrincipal('arn')],
            actions: ['events:PutEvents'],
        }))).toThrow('Event Bus policy statements must have a sid');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtYnVzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJldmVudC1idXMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBd0M7QUFDeEMsOENBQTBDO0FBQzFDLDhEQUEwRDtBQUMxRCx3Q0FBMkY7QUFDM0YsZ0NBQWtDO0FBRWxDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO0lBQ3pCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7UUFDN0IsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUzQixPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7WUFDdkUsSUFBSSxFQUFFLEtBQUs7U0FDWixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywyQ0FBMkMsRUFBRSxHQUFHLEVBQUU7UUFDckQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFL0IsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHVCQUF1QixFQUFFO1lBQ3ZFLElBQUksRUFBRSxLQUFLO1NBQ1osQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO1FBQzNCLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLGNB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O1FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN0QyxNQUFNLEdBQUcsR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFdkMsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQzNELE1BQU0sRUFBRSxnQkFBTSxDQUFDLEtBQUs7WUFDcEIsVUFBVSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pDLE9BQU8sRUFBRSxDQUFDLGtCQUFrQixDQUFDO1NBQzlCLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBFZmZlY3QgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IHRlc3REZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCB7IEF3cywgQ2ZuUmVzb3VyY2UsIFN0YWNrLCBBcm4sIEFwcCwgUGh5c2ljYWxOYW1lLCBDZm5PdXRwdXQgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEV2ZW50QnVzIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ2V2ZW50IGJ1cycsICgpID0+IHtcbiAgdGVzdCgnZGVmYXVsdCBldmVudCBidXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBFdmVudEJ1cyhzdGFjaywgJ0J1cycpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6RXZlbnRCdXMnLCB7XG4gICAgICBOYW1lOiAnQnVzJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZGVmYXVsdCBldmVudCBidXMgd2l0aCBlbXB0eSBwcm9wcyBvYmplY3QnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBFdmVudEJ1cyhzdGFjaywgJ0J1cycsIHt9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OkV2ZW50QnVzJywge1xuICAgICAgTmFtZTogJ0J1cycsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ25hbWVkIGV2ZW50IGJ1cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IEV2ZW50QnVzKHN0YWNrLCAnQnVzJywge1xuICAgICAgZXZlbnRCdXNOYW1lOiAnbXlFdmVudEJ1cycsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpFdmVudEJ1cycsIHtcbiAgICAgIE5hbWU6ICdteUV2ZW50QnVzJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncGFydG5lciBldmVudCBidXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBFdmVudEJ1cyhzdGFjaywgJ0J1cycsIHtcbiAgICAgIGV2ZW50U291cmNlTmFtZTogJ2F3cy5wYXJ0bmVyL1BhcnRuZXJOYW1lL2FjY3QxL3JlcG8xJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OkV2ZW50QnVzJywge1xuICAgICAgTmFtZTogJ2F3cy5wYXJ0bmVyL1BhcnRuZXJOYW1lL2FjY3QxL3JlcG8xJyxcbiAgICAgIEV2ZW50U291cmNlTmFtZTogJ2F3cy5wYXJ0bmVyL1BhcnRuZXJOYW1lL2FjY3QxL3JlcG8xJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaW1wb3J0ZWQgZXZlbnQgYnVzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBldmVudEJ1cyA9IG5ldyBFdmVudEJ1cyhzdGFjaywgJ0J1cycpO1xuXG4gICAgY29uc3QgaW1wb3J0RUIgPSBFdmVudEJ1cy5mcm9tRXZlbnRCdXNBcm4oc3RhY2ssICdJbXBvcnRCdXMnLCBldmVudEJ1cy5ldmVudEJ1c0Fybik7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnUmVzJywge1xuICAgICAgdHlwZTogJ1Rlc3Q6OlJlc291cmNlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgRXZlbnRCdXNBcm4xOiBldmVudEJ1cy5ldmVudEJ1c0FybixcbiAgICAgICAgRXZlbnRCdXNBcm4yOiBpbXBvcnRFQi5ldmVudEJ1c0FybixcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnVGVzdDo6UmVzb3VyY2UnLCB7XG4gICAgICBFdmVudEJ1c0FybjE6IHsgJ0ZuOjpHZXRBdHQnOiBbJ0J1c0VBODJCNjQ4JywgJ0FybiddIH0sXG4gICAgICBFdmVudEJ1c0FybjI6IHsgJ0ZuOjpHZXRBdHQnOiBbJ0J1c0VBODJCNjQ4JywgJ0FybiddIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ltcG9ydGVkIGV2ZW50IGJ1cyBmcm9tIG5hbWUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGV2ZW50QnVzID0gbmV3IEV2ZW50QnVzKHN0YWNrLCAnQnVzJywgeyBldmVudEJ1c05hbWU6ICd0ZXN0LWJ1cy10by1pbXBvcnQtYnktbmFtZScgfSk7XG5cbiAgICBjb25zdCBpbXBvcnRFQiA9IEV2ZW50QnVzLmZyb21FdmVudEJ1c05hbWUoc3RhY2ssICdJbXBvcnRCdXMnLCBldmVudEJ1cy5ldmVudEJ1c05hbWUpO1xuXG4gICAgLy8gV0hFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGV2ZW50QnVzLmV2ZW50QnVzTmFtZSkpLnRvRXF1YWwoc3RhY2sucmVzb2x2ZShpbXBvcnRFQi5ldmVudEJ1c05hbWUpKTtcbiAgfSk7XG5cbiAgdGVzdCgnc2FtZSBhY2NvdW50IGltcG9ydGVkIGV2ZW50IGJ1cyBoYXMgcmlnaHQgcmVzb3VyY2UgZW52JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBldmVudEJ1cyA9IG5ldyBFdmVudEJ1cyhzdGFjaywgJ0J1cycpO1xuXG4gICAgY29uc3QgaW1wb3J0RUIgPSBFdmVudEJ1cy5mcm9tRXZlbnRCdXNBcm4oc3RhY2ssICdJbXBvcnRCdXMnLCBldmVudEJ1cy5ldmVudEJ1c0Fybik7XG5cbiAgICAvLyBXSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoaW1wb3J0RUIuZW52LmFjY291bnQpKS50b0VxdWFsKHsgJ0ZuOjpTZWxlY3QnOiBbNCwgeyAnRm46OlNwbGl0JzogWyc6JywgeyAnRm46OkdldEF0dCc6IFsnQnVzRUE4MkI2NDgnLCAnQXJuJ10gfV0gfV0gfSk7XG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoaW1wb3J0RUIuZW52LnJlZ2lvbikpLnRvRXF1YWwoeyAnRm46OlNlbGVjdCc6IFszLCB7ICdGbjo6U3BsaXQnOiBbJzonLCB7ICdGbjo6R2V0QXR0JzogWydCdXNFQTgyQjY0OCcsICdBcm4nXSB9XSB9XSB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3Jvc3MgYWNjb3VudCBpbXBvcnRlZCBldmVudCBidXMgaGFzIHJpZ2h0IHJlc291cmNlIGVudicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgYXJuUGFydHMgPSB7XG4gICAgICByZXNvdXJjZTogJ2J1cycsXG4gICAgICBzZXJ2aWNlOiAnZXZlbnRzJyxcbiAgICAgIGFjY291bnQ6ICdteUFjY291bnQnLFxuICAgICAgcmVnaW9uOiAndXMtd2VzdC0xJyxcbiAgICB9O1xuXG4gICAgY29uc3QgYXJuID0gQXJuLmZvcm1hdChhcm5QYXJ0cywgc3RhY2spO1xuXG4gICAgY29uc3QgaW1wb3J0RUIgPSBFdmVudEJ1cy5mcm9tRXZlbnRCdXNBcm4oc3RhY2ssICdJbXBvcnRCdXMnLCBhcm4pO1xuXG4gICAgLy8gV0hFTlxuICAgIGV4cGVjdChpbXBvcnRFQi5lbnYuYWNjb3VudCkudG9FcXVhbChhcm5QYXJ0cy5hY2NvdW50KTtcbiAgICBleHBlY3QoaW1wb3J0RUIuZW52LnJlZ2lvbikudG9FcXVhbChhcm5QYXJ0cy5yZWdpb24pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gZ2V0IGJ1cyBuYW1lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBidXMgPSBuZXcgRXZlbnRCdXMoc3RhY2ssICdCdXMnLCB7XG4gICAgICBldmVudEJ1c05hbWU6ICdteUV2ZW50QnVzJyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXMnLCB7XG4gICAgICB0eXBlOiAnVGVzdDo6UmVzb3VyY2UnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBFdmVudEJ1c05hbWU6IGJ1cy5ldmVudEJ1c05hbWUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdUZXN0OjpSZXNvdXJjZScsIHtcbiAgICAgIEV2ZW50QnVzTmFtZTogeyBSZWY6ICdCdXNFQTgyQjY0OCcgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGdldCBidXMgYXJuJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBidXMgPSBuZXcgRXZlbnRCdXMoc3RhY2ssICdCdXMnLCB7XG4gICAgICBldmVudEJ1c05hbWU6ICdteUV2ZW50QnVzJyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXMnLCB7XG4gICAgICB0eXBlOiAnVGVzdDo6UmVzb3VyY2UnLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBFdmVudEJ1c0FybjogYnVzLmV2ZW50QnVzQXJuLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnVGVzdDo6UmVzb3VyY2UnLCB7XG4gICAgICBFdmVudEJ1c0FybjogeyAnRm46OkdldEF0dCc6IFsnQnVzRUE4MkI2NDgnLCAnQXJuJ10gfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZXZlbnQgYnVzIG5hbWUgY2Fubm90IGJlIGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNyZWF0ZUludmFsaWRCdXMgPSAoKSA9PiBuZXcgRXZlbnRCdXMoc3RhY2ssICdCdXMnLCB7XG4gICAgICBldmVudEJ1c05hbWU6ICdkZWZhdWx0JyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgY3JlYXRlSW52YWxpZEJ1cygpO1xuICAgIH0pLnRvVGhyb3coLydldmVudEJ1c05hbWUnIG11c3Qgbm90IGJlICdkZWZhdWx0Jy8pO1xuICB9KTtcblxuICB0ZXN0KCdldmVudCBidXMgbmFtZSBjYW5ub3QgY29udGFpbiBzbGFzaCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY3JlYXRlSW52YWxpZEJ1cyA9ICgpID0+IG5ldyBFdmVudEJ1cyhzdGFjaywgJ0J1cycsIHtcbiAgICAgIGV2ZW50QnVzTmFtZTogJ215L2J1cycsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGNyZWF0ZUludmFsaWRCdXMoKTtcbiAgICB9KS50b1Rocm93KC8nZXZlbnRCdXNOYW1lJyBtdXN0IG5vdCBjb250YWluICdcXC8nLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2V2ZW50IGJ1cyBjYW5ub3QgaGF2ZSBuYW1lIGFuZCBzb3VyY2UgbmFtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY3JlYXRlSW52YWxpZEJ1cyA9ICgpID0+IG5ldyBFdmVudEJ1cyhzdGFjaywgJ0J1cycsIHtcbiAgICAgIGV2ZW50QnVzTmFtZTogJ215QnVzJyxcbiAgICAgIGV2ZW50U291cmNlTmFtZTogJ215QnVzJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgY3JlYXRlSW52YWxpZEJ1cygpO1xuICAgIH0pLnRvVGhyb3coLydldmVudEJ1c05hbWUnIGFuZCAnZXZlbnRTb3VyY2VOYW1lJyBjYW5ub3QgYm90aCBiZSBwcm92aWRlZC8pO1xuICB9KTtcblxuICB0ZXN0KCdldmVudCBidXMgbmFtZSBjYW5ub3QgYmUgZW1wdHkgc3RyaW5nJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjcmVhdGVJbnZhbGlkQnVzID0gKCkgPT4gbmV3IEV2ZW50QnVzKHN0YWNrLCAnQnVzJywge1xuICAgICAgZXZlbnRCdXNOYW1lOiAnJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgY3JlYXRlSW52YWxpZEJ1cygpO1xuICAgIH0pLnRvVGhyb3coLydldmVudEJ1c05hbWUnIG11c3Qgc2F0aXNmeTogLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RvZXMgbm90IHRocm93IGlmIGV2ZW50QnVzTmFtZSBpcyBhIHRva2VuJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU4gLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBFdmVudEJ1cyhzdGFjaywgJ0V2ZW50QnVzJywge1xuICAgICAgZXZlbnRCdXNOYW1lOiBBd3MuU1RBQ0tfTkFNRSxcbiAgICB9KSkubm90LnRvVGhyb3coKTtcbiAgfSk7XG5cbiAgdGVzdCgnZXZlbnQgYnVzIHNvdXJjZSBuYW1lIG11c3QgZm9sbG93IHBhdHRlcm4nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNyZWF0ZUludmFsaWRCdXMgPSAoKSA9PiBuZXcgRXZlbnRCdXMoc3RhY2ssICdCdXMnLCB7XG4gICAgICBldmVudFNvdXJjZU5hbWU6ICdpbnZhbGlkLXBhcnRuZXInLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBjcmVhdGVJbnZhbGlkQnVzKCk7XG4gICAgfSkudG9UaHJvdygvJ2V2ZW50U291cmNlTmFtZScgbXVzdCBzYXRpc2Z5OiBcXC9cXF5hd3MvKTtcbiAgfSk7XG5cbiAgdGVzdCgnZG9lcyBub3QgdGhyb3cgaWYgZXZlbnRTb3VyY2VOYW1lIGlzIGEgdG9rZW4nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTiAvIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gbmV3IEV2ZW50QnVzKHN0YWNrLCAnRXZlbnRCdXMnLCB7XG4gICAgICBldmVudFNvdXJjZU5hbWU6IEF3cy5TVEFDS19OQU1FLFxuICAgIH0pKS5ub3QudG9UaHJvdygpO1xuICB9KTtcblxuICB0ZXN0KCdldmVudCBidXMgc291cmNlIG5hbWUgY2Fubm90IGJlIGVtcHR5IHN0cmluZycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY3JlYXRlSW52YWxpZEJ1cyA9ICgpID0+IG5ldyBFdmVudEJ1cyhzdGFjaywgJ0J1cycsIHtcbiAgICAgIGV2ZW50U291cmNlTmFtZTogJycsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGNyZWF0ZUludmFsaWRCdXMoKTtcbiAgICB9KS50b1Rocm93KC8nZXZlbnRTb3VyY2VOYW1lJyBtdXN0IHNhdGlzZnk6IC8pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnY2FuIGdyYW50IFB1dEV2ZW50cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbGFtYmRhLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBFdmVudEJ1cy5ncmFudFB1dEV2ZW50cyhyb2xlKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ2V2ZW50czpQdXRFdmVudHMnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgUm9sZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlZjogJ1JvbGUxQUJDQzVGMCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gZ3JhbnQgUHV0RXZlbnRzIHVzaW5nIGdyYW50QWxsUHV0RXZlbnRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsYW1iZGEuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIEV2ZW50QnVzLmdyYW50QWxsUHV0RXZlbnRzKHJvbGUpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnZXZlbnRzOlB1dEV2ZW50cycsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgICBSb2xlczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnUm9sZTFBQkNDNUYwJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBncmFudCBQdXRFdmVudHMgdG8gYSBzcGVjaWZpYyBldmVudCBidXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICBjb25zdCBldmVudEJ1cyA9IG5ldyBFdmVudEJ1cyhzdGFjaywgJ0V2ZW50QnVzJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgZXZlbnRCdXMuZ3JhbnRQdXRFdmVudHNUbyhyb2xlKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ2V2ZW50czpQdXRFdmVudHMnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0V2ZW50QnVzN0I4NzQ4QUEnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgUm9sZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlZjogJ1JvbGUxQUJDQzVGMCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYXJjaGl2ZSBldmVudHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGV2ZW50ID0gbmV3IEV2ZW50QnVzKHN0YWNrLCAnQnVzJyk7XG5cbiAgICBldmVudC5hcmNoaXZlKCdNeUFyY2hpdmUnLCB7XG4gICAgICBldmVudFBhdHRlcm46IHtcbiAgICAgICAgYWNjb3VudDogW3N0YWNrLmFjY291bnRdLFxuICAgICAgfSxcbiAgICAgIGFyY2hpdmVOYW1lOiAnTXlBcmNoaXZlJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OkV2ZW50QnVzJywge1xuICAgICAgTmFtZTogJ0J1cycsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OkFyY2hpdmUnLCB7XG4gICAgICBTb3VyY2VBcm46IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ0J1c0VBODJCNjQ4JyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBEZXNjcmlwdGlvbjoge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ0V2ZW50IEFyY2hpdmUgZm9yICcsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ0J1c0VBODJCNjQ4JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnIEV2ZW50IEJ1cycsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBFdmVudFBhdHRlcm46IHtcbiAgICAgICAgYWNjb3VudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIFJldGVudGlvbkRheXM6IDAsXG4gICAgICBBcmNoaXZlTmFtZTogJ015QXJjaGl2ZScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBhcmNoaXZlIGV2ZW50cyBmcm9tIGFuIGltcG9ydGVkIEV2ZW50QnVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBidXMgPSBuZXcgRXZlbnRCdXMoc3RhY2ssICdCdXMnKTtcblxuICAgIGNvbnN0IGltcG9ydGVkQnVzID0gRXZlbnRCdXMuZnJvbUV2ZW50QnVzQXJuKHN0YWNrLCAnSW1wb3J0ZWRCdXMnLCBidXMuZXZlbnRCdXNBcm4pO1xuXG4gICAgaW1wb3J0ZWRCdXMuYXJjaGl2ZSgnTXlBcmNoaXZlJywge1xuICAgICAgZXZlbnRQYXR0ZXJuOiB7XG4gICAgICAgIGFjY291bnQ6IFtzdGFjay5hY2NvdW50XSxcbiAgICAgIH0sXG4gICAgICBhcmNoaXZlTmFtZTogJ015QXJjaGl2ZScsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpFdmVudEJ1cycsIHtcbiAgICAgIE5hbWU6ICdCdXMnLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpBcmNoaXZlJywge1xuICAgICAgU291cmNlQXJuOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdCdXNFQTgyQjY0OCcsXG4gICAgICAgICAgJ0FybicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgRGVzY3JpcHRpb246IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdFdmVudCBBcmNoaXZlIGZvciAnLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAxLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICcvJyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgNSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdCdXNFQTgyQjY0OCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICcgRXZlbnQgQnVzJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIEV2ZW50UGF0dGVybjoge1xuICAgICAgICBhY2NvdW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgUmV0ZW50aW9uRGF5czogMCxcbiAgICAgIEFyY2hpdmVOYW1lOiAnTXlBcmNoaXZlJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3Jvc3MgYWNjb3VudCBldmVudCBidXMgdXNlcyBnZW5lcmF0ZWQgcGh5c2ljYWwgbmFtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJywge1xuICAgICAgZW52OiB7XG4gICAgICAgIGFjY291bnQ6ICcxMTExMTExMTExMScsXG4gICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInLCB7XG4gICAgICBlbnY6IHtcbiAgICAgICAgYWNjb3VudDogJzIyMjIyMjIyMjIyJyxcbiAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYnVzMSA9IG5ldyBFdmVudEJ1cyhzdGFjazEsICdCdXMnLCB7XG4gICAgICBldmVudEJ1c05hbWU6IFBoeXNpY2FsTmFtZS5HRU5FUkFURV9JRl9ORUVERUQsXG4gICAgfSk7XG5cbiAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrMiwgJ0J1c05hbWUnLCB7IHZhbHVlOiBidXMxLmV2ZW50QnVzTmFtZSB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2sxKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpFdmVudEJ1cycsIHtcbiAgICAgIE5hbWU6ICdzdGFjazFzdGFjazFidXNjYTE5YmRmOGFiMmU1MWI2MmE1YScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBhZGQgb25lIGV2ZW50IGJ1cyBwb2xpY3knLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snKTtcbiAgICBjb25zdCBidXMgPSBuZXcgRXZlbnRCdXMoc3RhY2ssICdCdXMnKTtcblxuICAgIC8vIFdIRU5cbiAgICBidXMuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBlZmZlY3Q6IEVmZmVjdC5BTExPVyxcbiAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFjY291bnRQcmluY2lwYWwoJzExMTExMTExMTExMTExMScpXSxcbiAgICAgIGFjdGlvbnM6IFsnZXZlbnRzOlB1dEV2ZW50cyddLFxuICAgICAgc2lkOiAnMTIzJyxcbiAgICAgIHJlc291cmNlczogW2J1cy5ldmVudEJ1c0Fybl0sXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6RXZlbnRCdXNQb2xpY3knLCB7XG4gICAgICBTdGF0ZW1lbnRJZDogJzEyMycsXG4gICAgICBFdmVudEJ1c05hbWU6IHtcbiAgICAgICAgUmVmOiAnQnVzRUE4MkI2NDgnLFxuICAgICAgfSxcbiAgICAgIFN0YXRlbWVudDoge1xuICAgICAgICBBY3Rpb246ICdldmVudHM6UHV0RXZlbnRzJyxcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICBBV1M6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzppYW06OjExMTExMTExMTExMTExMTpyb290JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgU2lkOiAnMTIzJyxcbiAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdCdXNFQTgyQjY0OCcsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2Fubm90IGFkZCBtb3JlIHRoYW4gb25lIGV2ZW50IGJ1cyBwb2xpY3knLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snKTtcbiAgICBjb25zdCBidXMgPSBuZXcgRXZlbnRCdXMoc3RhY2ssICdCdXMnKTtcblxuXG4gICAgY29uc3Qgc3RhdGVtZW50ID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgZWZmZWN0OiBFZmZlY3QuQUxMT1csXG4gICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5Bcm5QcmluY2lwYWwoJ2FybicpXSxcbiAgICAgIGFjdGlvbnM6IFsnZXZlbnRzOlB1dEV2ZW50cyddLFxuICAgICAgc2lkOiAnMTIzJyxcbiAgICAgIHJlc291cmNlczogW2J1cy5ldmVudEJ1c0Fybl0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYWRkMSA9IGJ1cy5hZGRUb1Jlc291cmNlUG9saWN5KHN0YXRlbWVudCk7XG4gICAgY29uc3QgYWRkMiA9IGJ1cy5hZGRUb1Jlc291cmNlUG9saWN5KHN0YXRlbWVudCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGFkZDEuc3RhdGVtZW50QWRkZWQpLnRvQmUodHJ1ZSk7XG4gICAgZXhwZWN0KGFkZDIuc3RhdGVtZW50QWRkZWQpLnRvQmUoZmFsc2UpO1xuICB9KTtcblxuICB0ZXN0KCdFdmVudCBCdXMgcG9saWN5IHN0YXRlbWVudHMgbXVzdCBoYXZlIGEgc2lkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJyk7XG4gICAgY29uc3QgYnVzID0gbmV3IEV2ZW50QnVzKHN0YWNrLCAnQnVzJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGJ1cy5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uQXJuUHJpbmNpcGFsKCdhcm4nKV0sXG4gICAgICBhY3Rpb25zOiBbJ2V2ZW50czpQdXRFdmVudHMnXSxcbiAgICB9KSkpLnRvVGhyb3coJ0V2ZW50IEJ1cyBwb2xpY3kgc3RhdGVtZW50cyBtdXN0IGhhdmUgYSBzaWQnKTtcbiAgfSk7XG59KTtcbiJdfQ==