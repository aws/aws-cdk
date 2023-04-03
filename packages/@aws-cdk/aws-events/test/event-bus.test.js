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
    cdk_build_tools_1.testDeprecated('can grant PutEvents', () => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtYnVzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJldmVudC1idXMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBd0M7QUFDeEMsOENBQTBDO0FBQzFDLDhEQUEwRDtBQUMxRCx3Q0FBMkY7QUFDM0YsZ0NBQWtDO0FBRWxDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO0lBQ3pCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7UUFDN0IsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUzQixPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7WUFDdkUsSUFBSSxFQUFFLEtBQUs7U0FDWixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywyQ0FBMkMsRUFBRSxHQUFHLEVBQUU7UUFDckQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFL0IsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHVCQUF1QixFQUFFO1lBQ3ZFLElBQUksRUFBRSxLQUFLO1NBQ1osQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO1FBQzNCLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLGNB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QixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXZDLE9BQU87UUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUMzRCxNQUFNLEVBQUUsZ0JBQU0sQ0FBQyxLQUFLO1lBQ3BCLFVBQVUsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN6QyxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztTQUM5QixDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0lBQzlELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgRWZmZWN0IH0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyB0ZXN0RGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgeyBBd3MsIENmblJlc291cmNlLCBTdGFjaywgQXJuLCBBcHAsIFBoeXNpY2FsTmFtZSwgQ2ZuT3V0cHV0IH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBFdmVudEJ1cyB9IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdldmVudCBidXMnLCAoKSA9PiB7XG4gIHRlc3QoJ2RlZmF1bHQgZXZlbnQgYnVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgRXZlbnRCdXMoc3RhY2ssICdCdXMnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OkV2ZW50QnVzJywge1xuICAgICAgTmFtZTogJ0J1cycsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RlZmF1bHQgZXZlbnQgYnVzIHdpdGggZW1wdHkgcHJvcHMgb2JqZWN0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgRXZlbnRCdXMoc3RhY2ssICdCdXMnLCB7fSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpFdmVudEJ1cycsIHtcbiAgICAgIE5hbWU6ICdCdXMnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCduYW1lZCBldmVudCBidXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBFdmVudEJ1cyhzdGFjaywgJ0J1cycsIHtcbiAgICAgIGV2ZW50QnVzTmFtZTogJ215RXZlbnRCdXMnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6RXZlbnRCdXMnLCB7XG4gICAgICBOYW1lOiAnbXlFdmVudEJ1cycsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3BhcnRuZXIgZXZlbnQgYnVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgRXZlbnRCdXMoc3RhY2ssICdCdXMnLCB7XG4gICAgICBldmVudFNvdXJjZU5hbWU6ICdhd3MucGFydG5lci9QYXJ0bmVyTmFtZS9hY2N0MS9yZXBvMScsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpFdmVudEJ1cycsIHtcbiAgICAgIE5hbWU6ICdhd3MucGFydG5lci9QYXJ0bmVyTmFtZS9hY2N0MS9yZXBvMScsXG4gICAgICBFdmVudFNvdXJjZU5hbWU6ICdhd3MucGFydG5lci9QYXJ0bmVyTmFtZS9hY2N0MS9yZXBvMScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ltcG9ydGVkIGV2ZW50IGJ1cycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgZXZlbnRCdXMgPSBuZXcgRXZlbnRCdXMoc3RhY2ssICdCdXMnKTtcblxuICAgIGNvbnN0IGltcG9ydEVCID0gRXZlbnRCdXMuZnJvbUV2ZW50QnVzQXJuKHN0YWNrLCAnSW1wb3J0QnVzJywgZXZlbnRCdXMuZXZlbnRCdXNBcm4pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1JlcycsIHtcbiAgICAgIHR5cGU6ICdUZXN0OjpSZXNvdXJjZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIEV2ZW50QnVzQXJuMTogZXZlbnRCdXMuZXZlbnRCdXNBcm4sXG4gICAgICAgIEV2ZW50QnVzQXJuMjogaW1wb3J0RUIuZXZlbnRCdXNBcm4sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ1Rlc3Q6OlJlc291cmNlJywge1xuICAgICAgRXZlbnRCdXNBcm4xOiB7ICdGbjo6R2V0QXR0JzogWydCdXNFQTgyQjY0OCcsICdBcm4nXSB9LFxuICAgICAgRXZlbnRCdXNBcm4yOiB7ICdGbjo6R2V0QXR0JzogWydCdXNFQTgyQjY0OCcsICdBcm4nXSB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpbXBvcnRlZCBldmVudCBidXMgZnJvbSBuYW1lJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBldmVudEJ1cyA9IG5ldyBFdmVudEJ1cyhzdGFjaywgJ0J1cycsIHsgZXZlbnRCdXNOYW1lOiAndGVzdC1idXMtdG8taW1wb3J0LWJ5LW5hbWUnIH0pO1xuXG4gICAgY29uc3QgaW1wb3J0RUIgPSBFdmVudEJ1cy5mcm9tRXZlbnRCdXNOYW1lKHN0YWNrLCAnSW1wb3J0QnVzJywgZXZlbnRCdXMuZXZlbnRCdXNOYW1lKTtcblxuICAgIC8vIFdIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShldmVudEJ1cy5ldmVudEJ1c05hbWUpKS50b0VxdWFsKHN0YWNrLnJlc29sdmUoaW1wb3J0RUIuZXZlbnRCdXNOYW1lKSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NhbWUgYWNjb3VudCBpbXBvcnRlZCBldmVudCBidXMgaGFzIHJpZ2h0IHJlc291cmNlIGVudicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgZXZlbnRCdXMgPSBuZXcgRXZlbnRCdXMoc3RhY2ssICdCdXMnKTtcblxuICAgIGNvbnN0IGltcG9ydEVCID0gRXZlbnRCdXMuZnJvbUV2ZW50QnVzQXJuKHN0YWNrLCAnSW1wb3J0QnVzJywgZXZlbnRCdXMuZXZlbnRCdXNBcm4pO1xuXG4gICAgLy8gV0hFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGltcG9ydEVCLmVudi5hY2NvdW50KSkudG9FcXVhbCh7ICdGbjo6U2VsZWN0JzogWzQsIHsgJ0ZuOjpTcGxpdCc6IFsnOicsIHsgJ0ZuOjpHZXRBdHQnOiBbJ0J1c0VBODJCNjQ4JywgJ0FybiddIH1dIH1dIH0pO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGltcG9ydEVCLmVudi5yZWdpb24pKS50b0VxdWFsKHsgJ0ZuOjpTZWxlY3QnOiBbMywgeyAnRm46OlNwbGl0JzogWyc6JywgeyAnRm46OkdldEF0dCc6IFsnQnVzRUE4MkI2NDgnLCAnQXJuJ10gfV0gfV0gfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Nyb3NzIGFjY291bnQgaW1wb3J0ZWQgZXZlbnQgYnVzIGhhcyByaWdodCByZXNvdXJjZSBlbnYnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGFyblBhcnRzID0ge1xuICAgICAgcmVzb3VyY2U6ICdidXMnLFxuICAgICAgc2VydmljZTogJ2V2ZW50cycsXG4gICAgICBhY2NvdW50OiAnbXlBY2NvdW50JyxcbiAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMScsXG4gICAgfTtcblxuICAgIGNvbnN0IGFybiA9IEFybi5mb3JtYXQoYXJuUGFydHMsIHN0YWNrKTtcblxuICAgIGNvbnN0IGltcG9ydEVCID0gRXZlbnRCdXMuZnJvbUV2ZW50QnVzQXJuKHN0YWNrLCAnSW1wb3J0QnVzJywgYXJuKTtcblxuICAgIC8vIFdIRU5cbiAgICBleHBlY3QoaW1wb3J0RUIuZW52LmFjY291bnQpLnRvRXF1YWwoYXJuUGFydHMuYWNjb3VudCk7XG4gICAgZXhwZWN0KGltcG9ydEVCLmVudi5yZWdpb24pLnRvRXF1YWwoYXJuUGFydHMucmVnaW9uKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGdldCBidXMgbmFtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgYnVzID0gbmV3IEV2ZW50QnVzKHN0YWNrLCAnQnVzJywge1xuICAgICAgZXZlbnRCdXNOYW1lOiAnbXlFdmVudEJ1cycsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnUmVzJywge1xuICAgICAgdHlwZTogJ1Rlc3Q6OlJlc291cmNlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgRXZlbnRCdXNOYW1lOiBidXMuZXZlbnRCdXNOYW1lLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnVGVzdDo6UmVzb3VyY2UnLCB7XG4gICAgICBFdmVudEJ1c05hbWU6IHsgUmVmOiAnQnVzRUE4MkI2NDgnIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBnZXQgYnVzIGFybicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgYnVzID0gbmV3IEV2ZW50QnVzKHN0YWNrLCAnQnVzJywge1xuICAgICAgZXZlbnRCdXNOYW1lOiAnbXlFdmVudEJ1cycsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnUmVzJywge1xuICAgICAgdHlwZTogJ1Rlc3Q6OlJlc291cmNlJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgRXZlbnRCdXNBcm46IGJ1cy5ldmVudEJ1c0FybixcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ1Rlc3Q6OlJlc291cmNlJywge1xuICAgICAgRXZlbnRCdXNBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ0J1c0VBODJCNjQ4JywgJ0FybiddIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2V2ZW50IGJ1cyBuYW1lIGNhbm5vdCBiZSBkZWZhdWx0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjcmVhdGVJbnZhbGlkQnVzID0gKCkgPT4gbmV3IEV2ZW50QnVzKHN0YWNrLCAnQnVzJywge1xuICAgICAgZXZlbnRCdXNOYW1lOiAnZGVmYXVsdCcsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGNyZWF0ZUludmFsaWRCdXMoKTtcbiAgICB9KS50b1Rocm93KC8nZXZlbnRCdXNOYW1lJyBtdXN0IG5vdCBiZSAnZGVmYXVsdCcvKTtcbiAgfSk7XG5cbiAgdGVzdCgnZXZlbnQgYnVzIG5hbWUgY2Fubm90IGNvbnRhaW4gc2xhc2gnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNyZWF0ZUludmFsaWRCdXMgPSAoKSA9PiBuZXcgRXZlbnRCdXMoc3RhY2ssICdCdXMnLCB7XG4gICAgICBldmVudEJ1c05hbWU6ICdteS9idXMnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBjcmVhdGVJbnZhbGlkQnVzKCk7XG4gICAgfSkudG9UaHJvdygvJ2V2ZW50QnVzTmFtZScgbXVzdCBub3QgY29udGFpbiAnXFwvJy8pO1xuICB9KTtcblxuICB0ZXN0KCdldmVudCBidXMgY2Fubm90IGhhdmUgbmFtZSBhbmQgc291cmNlIG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNyZWF0ZUludmFsaWRCdXMgPSAoKSA9PiBuZXcgRXZlbnRCdXMoc3RhY2ssICdCdXMnLCB7XG4gICAgICBldmVudEJ1c05hbWU6ICdteUJ1cycsXG4gICAgICBldmVudFNvdXJjZU5hbWU6ICdteUJ1cycsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGNyZWF0ZUludmFsaWRCdXMoKTtcbiAgICB9KS50b1Rocm93KC8nZXZlbnRCdXNOYW1lJyBhbmQgJ2V2ZW50U291cmNlTmFtZScgY2Fubm90IGJvdGggYmUgcHJvdmlkZWQvKTtcbiAgfSk7XG5cbiAgdGVzdCgnZXZlbnQgYnVzIG5hbWUgY2Fubm90IGJlIGVtcHR5IHN0cmluZycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY3JlYXRlSW52YWxpZEJ1cyA9ICgpID0+IG5ldyBFdmVudEJ1cyhzdGFjaywgJ0J1cycsIHtcbiAgICAgIGV2ZW50QnVzTmFtZTogJycsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGNyZWF0ZUludmFsaWRCdXMoKTtcbiAgICB9KS50b1Rocm93KC8nZXZlbnRCdXNOYW1lJyBtdXN0IHNhdGlzZnk6IC8pO1xuICB9KTtcblxuICB0ZXN0KCdkb2VzIG5vdCB0aHJvdyBpZiBldmVudEJ1c05hbWUgaXMgYSB0b2tlbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOIC8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBuZXcgRXZlbnRCdXMoc3RhY2ssICdFdmVudEJ1cycsIHtcbiAgICAgIGV2ZW50QnVzTmFtZTogQXdzLlNUQUNLX05BTUUsXG4gICAgfSkpLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2V2ZW50IGJ1cyBzb3VyY2UgbmFtZSBtdXN0IGZvbGxvdyBwYXR0ZXJuJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjcmVhdGVJbnZhbGlkQnVzID0gKCkgPT4gbmV3IEV2ZW50QnVzKHN0YWNrLCAnQnVzJywge1xuICAgICAgZXZlbnRTb3VyY2VOYW1lOiAnaW52YWxpZC1wYXJ0bmVyJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgY3JlYXRlSW52YWxpZEJ1cygpO1xuICAgIH0pLnRvVGhyb3coLydldmVudFNvdXJjZU5hbWUnIG11c3Qgc2F0aXNmeTogXFwvXFxeYXdzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RvZXMgbm90IHRocm93IGlmIGV2ZW50U291cmNlTmFtZSBpcyBhIHRva2VuJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU4gLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBFdmVudEJ1cyhzdGFjaywgJ0V2ZW50QnVzJywge1xuICAgICAgZXZlbnRTb3VyY2VOYW1lOiBBd3MuU1RBQ0tfTkFNRSxcbiAgICB9KSkubm90LnRvVGhyb3coKTtcbiAgfSk7XG5cbiAgdGVzdCgnZXZlbnQgYnVzIHNvdXJjZSBuYW1lIGNhbm5vdCBiZSBlbXB0eSBzdHJpbmcnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNyZWF0ZUludmFsaWRCdXMgPSAoKSA9PiBuZXcgRXZlbnRCdXMoc3RhY2ssICdCdXMnLCB7XG4gICAgICBldmVudFNvdXJjZU5hbWU6ICcnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBjcmVhdGVJbnZhbGlkQnVzKCk7XG4gICAgfSkudG9UaHJvdygvJ2V2ZW50U291cmNlTmFtZScgbXVzdCBzYXRpc2Z5OiAvKTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ2NhbiBncmFudCBQdXRFdmVudHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgRXZlbnRCdXMuZ3JhbnRQdXRFdmVudHMocm9sZSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdldmVudHM6UHV0RXZlbnRzJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICAgIFJvbGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdSb2xlMUFCQ0M1RjAnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGdyYW50IFB1dEV2ZW50cyB1c2luZyBncmFudEFsbFB1dEV2ZW50cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbGFtYmRhLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBFdmVudEJ1cy5ncmFudEFsbFB1dEV2ZW50cyhyb2xlKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ2V2ZW50czpQdXRFdmVudHMnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgUm9sZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlZjogJ1JvbGUxQUJDQzVGMCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gZ3JhbnQgUHV0RXZlbnRzIHRvIGEgc3BlY2lmaWMgZXZlbnQgYnVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsYW1iZGEuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZXZlbnRCdXMgPSBuZXcgRXZlbnRCdXMoc3RhY2ssICdFdmVudEJ1cycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGV2ZW50QnVzLmdyYW50UHV0RXZlbnRzVG8ocm9sZSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdldmVudHM6UHV0RXZlbnRzJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdFdmVudEJ1czdCODc0OEFBJyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICAgIFJvbGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdSb2xlMUFCQ0M1RjAnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGFyY2hpdmUgZXZlbnRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBldmVudCA9IG5ldyBFdmVudEJ1cyhzdGFjaywgJ0J1cycpO1xuXG4gICAgZXZlbnQuYXJjaGl2ZSgnTXlBcmNoaXZlJywge1xuICAgICAgZXZlbnRQYXR0ZXJuOiB7XG4gICAgICAgIGFjY291bnQ6IFtzdGFjay5hY2NvdW50XSxcbiAgICAgIH0sXG4gICAgICBhcmNoaXZlTmFtZTogJ015QXJjaGl2ZScsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpFdmVudEJ1cycsIHtcbiAgICAgIE5hbWU6ICdCdXMnLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpBcmNoaXZlJywge1xuICAgICAgU291cmNlQXJuOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdCdXNFQTgyQjY0OCcsXG4gICAgICAgICAgJ0FybicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgRGVzY3JpcHRpb246IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdFdmVudCBBcmNoaXZlIGZvciAnLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdCdXNFQTgyQjY0OCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJyBFdmVudCBCdXMnLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgRXZlbnRQYXR0ZXJuOiB7XG4gICAgICAgIGFjY291bnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBSZXRlbnRpb25EYXlzOiAwLFxuICAgICAgQXJjaGl2ZU5hbWU6ICdNeUFyY2hpdmUnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYXJjaGl2ZSBldmVudHMgZnJvbSBhbiBpbXBvcnRlZCBFdmVudEJ1cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYnVzID0gbmV3IEV2ZW50QnVzKHN0YWNrLCAnQnVzJyk7XG5cbiAgICBjb25zdCBpbXBvcnRlZEJ1cyA9IEV2ZW50QnVzLmZyb21FdmVudEJ1c0FybihzdGFjaywgJ0ltcG9ydGVkQnVzJywgYnVzLmV2ZW50QnVzQXJuKTtcblxuICAgIGltcG9ydGVkQnVzLmFyY2hpdmUoJ015QXJjaGl2ZScsIHtcbiAgICAgIGV2ZW50UGF0dGVybjoge1xuICAgICAgICBhY2NvdW50OiBbc3RhY2suYWNjb3VudF0sXG4gICAgICB9LFxuICAgICAgYXJjaGl2ZU5hbWU6ICdNeUFyY2hpdmUnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6RXZlbnRCdXMnLCB7XG4gICAgICBOYW1lOiAnQnVzJyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6QXJjaGl2ZScsIHtcbiAgICAgIFNvdXJjZUFybjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnQnVzRUE4MkI2NDgnLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIERlc2NyaXB0aW9uOiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnRXZlbnQgQXJjaGl2ZSBmb3IgJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgICAgMSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIDUsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQnVzRUE4MkI2NDgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnIEV2ZW50IEJ1cycsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBFdmVudFBhdHRlcm46IHtcbiAgICAgICAgYWNjb3VudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIFJldGVudGlvbkRheXM6IDAsXG4gICAgICBBcmNoaXZlTmFtZTogJ015QXJjaGl2ZScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Nyb3NzIGFjY291bnQgZXZlbnQgYnVzIHVzZXMgZ2VuZXJhdGVkIHBoeXNpY2FsIG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScsIHtcbiAgICAgIGVudjoge1xuICAgICAgICBhY2NvdW50OiAnMTExMTExMTExMTEnLFxuICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJywge1xuICAgICAgZW52OiB7XG4gICAgICAgIGFjY291bnQ6ICcyMjIyMjIyMjIyMicsXG4gICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGJ1czEgPSBuZXcgRXZlbnRCdXMoc3RhY2sxLCAnQnVzJywge1xuICAgICAgZXZlbnRCdXNOYW1lOiBQaHlzaWNhbE5hbWUuR0VORVJBVEVfSUZfTkVFREVELFxuICAgIH0pO1xuXG4gICAgbmV3IENmbk91dHB1dChzdGFjazIsICdCdXNOYW1lJywgeyB2YWx1ZTogYnVzMS5ldmVudEJ1c05hbWUgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrMSkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6RXZlbnRCdXMnLCB7XG4gICAgICBOYW1lOiAnc3RhY2sxc3RhY2sxYnVzY2ExOWJkZjhhYjJlNTFiNjJhNWEnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYWRkIG9uZSBldmVudCBidXMgcG9saWN5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJyk7XG4gICAgY29uc3QgYnVzID0gbmV3IEV2ZW50QnVzKHN0YWNrLCAnQnVzJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgYnVzLmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgZWZmZWN0OiBFZmZlY3QuQUxMT1csXG4gICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5BY2NvdW50UHJpbmNpcGFsKCcxMTExMTExMTExMTExMTEnKV0sXG4gICAgICBhY3Rpb25zOiBbJ2V2ZW50czpQdXRFdmVudHMnXSxcbiAgICAgIHNpZDogJzEyMycsXG4gICAgICByZXNvdXJjZXM6IFtidXMuZXZlbnRCdXNBcm5dLFxuICAgIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OkV2ZW50QnVzUG9saWN5Jywge1xuICAgICAgU3RhdGVtZW50SWQ6ICcxMjMnLFxuICAgICAgRXZlbnRCdXNOYW1lOiB7XG4gICAgICAgIFJlZjogJ0J1c0VBODJCNjQ4JyxcbiAgICAgIH0sXG4gICAgICBTdGF0ZW1lbnQ6IHtcbiAgICAgICAgQWN0aW9uOiAnZXZlbnRzOlB1dEV2ZW50cycsXG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgQVdTOiB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6aWFtOjoxMTExMTExMTExMTExMTE6cm9vdCcsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIFNpZDogJzEyMycsXG4gICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnQnVzRUE4MkI2NDgnLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Nhbm5vdCBhZGQgbW9yZSB0aGFuIG9uZSBldmVudCBidXMgcG9saWN5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJyk7XG4gICAgY29uc3QgYnVzID0gbmV3IEV2ZW50QnVzKHN0YWNrLCAnQnVzJyk7XG5cblxuICAgIGNvbnN0IHN0YXRlbWVudCA9IG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgcHJpbmNpcGFsczogW25ldyBpYW0uQXJuUHJpbmNpcGFsKCdhcm4nKV0sXG4gICAgICBhY3Rpb25zOiBbJ2V2ZW50czpQdXRFdmVudHMnXSxcbiAgICAgIHNpZDogJzEyMycsXG4gICAgICByZXNvdXJjZXM6IFtidXMuZXZlbnRCdXNBcm5dLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFkZDEgPSBidXMuYWRkVG9SZXNvdXJjZVBvbGljeShzdGF0ZW1lbnQpO1xuICAgIGNvbnN0IGFkZDIgPSBidXMuYWRkVG9SZXNvdXJjZVBvbGljeShzdGF0ZW1lbnQpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChhZGQxLnN0YXRlbWVudEFkZGVkKS50b0JlKHRydWUpO1xuICAgIGV4cGVjdChhZGQyLnN0YXRlbWVudEFkZGVkKS50b0JlKGZhbHNlKTtcbiAgfSk7XG5cbiAgdGVzdCgnRXZlbnQgQnVzIHBvbGljeSBzdGF0ZW1lbnRzIG11c3QgaGF2ZSBhIHNpZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjaycpO1xuICAgIGNvbnN0IGJ1cyA9IG5ldyBFdmVudEJ1cyhzdGFjaywgJ0J1cycpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBidXMuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBlZmZlY3Q6IEVmZmVjdC5BTExPVyxcbiAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFyblByaW5jaXBhbCgnYXJuJyldLFxuICAgICAgYWN0aW9uczogWydldmVudHM6UHV0RXZlbnRzJ10sXG4gICAgfSkpKS50b1Rocm93KCdFdmVudCBCdXMgcG9saWN5IHN0YXRlbWVudHMgbXVzdCBoYXZlIGEgc2lkJyk7XG4gIH0pO1xufSk7XG4iXX0=