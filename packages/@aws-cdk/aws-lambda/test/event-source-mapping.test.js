"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const lib_1 = require("../lib");
let stack;
let fn;
beforeEach(() => {
    stack = new cdk.Stack();
    fn = new lib_1.Function(stack, 'fn', {
        handler: 'index.handler',
        code: lib_1.Code.fromInline('exports.handler = ${handler.toString()}'),
        runtime: lib_1.Runtime.NODEJS_14_X,
    });
});
describe('event source mapping', () => {
    test('verify that alias.addEventSourceMapping produces stable ids', () => {
        // GIVEN
        var alias = new lib_1.Alias(stack, 'LiveAlias', {
            aliasName: 'Live',
            version: fn.currentVersion,
        });
        // WHEN
        alias.addEventSourceMapping('MyMapping', {
            eventSourceArn: 'asfd',
        });
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                // Crucially, no ID in there that depends on the state of the Lambda
                LiveAliasMyMapping4E1B698B: { Type: 'AWS::Lambda::EventSourceMapping' },
            },
        });
    });
    test('throws if maxBatchingWindow > 300 seconds', () => {
        expect(() => new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: '',
            maxBatchingWindow: cdk.Duration.seconds(301),
        })).toThrow(/maxBatchingWindow cannot be over 300 seconds/);
    });
    test('throws if maxConcurrency < 2 concurrent instances', () => {
        expect(() => new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: '',
            maxConcurrency: 1,
        })).toThrow(/maxConcurrency must be between 2 and 1000 concurrent instances/);
    });
    test('throws if maxConcurrency > 1000 concurrent instances', () => {
        expect(() => new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: '',
            maxConcurrency: 1001,
        })).toThrow(/maxConcurrency must be between 2 and 1000 concurrent instances/);
    });
    test('maxConcurrency appears in stack', () => {
        new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: '',
            maxConcurrency: 2,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
            ScalingConfig: { MaximumConcurrency: 2 },
        });
    });
    test('throws if maxRecordAge is below 60 seconds', () => {
        expect(() => new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: '',
            maxRecordAge: cdk.Duration.seconds(59),
        })).toThrow(/maxRecordAge must be between 60 seconds and 7 days inclusive/);
    });
    test('throws if maxRecordAge is over 7 days', () => {
        expect(() => new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: '',
            maxRecordAge: cdk.Duration.seconds(604801),
        })).toThrow(/maxRecordAge must be between 60 seconds and 7 days inclusive/);
    });
    test('throws if retryAttempts is negative', () => {
        expect(() => new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: '',
            retryAttempts: -1,
        })).toThrow(/retryAttempts must be between 0 and 10000 inclusive, got -1/);
    });
    test('throws if retryAttempts is over 10000', () => {
        expect(() => new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: '',
            retryAttempts: 10001,
        })).toThrow(/retryAttempts must be between 0 and 10000 inclusive, got 10001/);
    });
    test('accepts if retryAttempts is a token', () => {
        new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: '',
            retryAttempts: cdk.Lazy.number({ produce: () => 100 }),
        });
    });
    test('throws if parallelizationFactor is below 1', () => {
        expect(() => new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: '',
            parallelizationFactor: 0,
        })).toThrow(/parallelizationFactor must be between 1 and 10 inclusive, got 0/);
    });
    test('throws if parallelizationFactor is over 10', () => {
        expect(() => new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: '',
            parallelizationFactor: 11,
        })).toThrow(/parallelizationFactor must be between 1 and 10 inclusive, got 11/);
    });
    test('accepts if parallelizationFactor is a token', () => {
        new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: '',
            parallelizationFactor: cdk.Lazy.number({ produce: () => 20 }),
        });
    });
    test('import event source mapping', () => {
        const stack2 = new cdk.Stack(undefined, undefined, { stackName: 'test-stack' });
        const imported = lib_1.EventSourceMapping.fromEventSourceMappingId(stack2, 'imported', '14e0db71-5d35-4eb5-b481-8945cf9d10c2');
        expect(imported.eventSourceMappingId).toEqual('14e0db71-5d35-4eb5-b481-8945cf9d10c2');
        expect(imported.stack.stackName).toEqual('test-stack');
    });
    test('accepts if kafkaTopic is a parameter', () => {
        const topicNameParam = new cdk.CfnParameter(stack, 'TopicNameParam', {
            type: 'String',
        });
        new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: '',
            kafkaTopic: topicNameParam.valueAsString,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
            Topics: [{
                    Ref: 'TopicNameParam',
                }],
        });
    });
    test('throws if neither eventSourceArn nor kafkaBootstrapServers are set', () => {
        expect(() => new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
        })).toThrow(/Either eventSourceArn or kafkaBootstrapServers must be set/);
    });
    test('throws if both eventSourceArn and kafkaBootstrapServers are set', () => {
        expect(() => new lib_1.EventSourceMapping(stack, 'test', {
            eventSourceArn: '',
            kafkaBootstrapServers: [],
            target: fn,
        })).toThrow(/eventSourceArn and kafkaBootstrapServers are mutually exclusive/);
    });
    test('throws if both kafkaBootstrapServers is set but empty', () => {
        expect(() => new lib_1.EventSourceMapping(stack, 'test', {
            kafkaBootstrapServers: [],
            target: fn,
        })).toThrow(/kafkaBootStrapServers must not be empty if set/);
    });
    test('throws if kafkaConsumerGroupId is invalid', () => {
        expect(() => new lib_1.EventSourceMapping(stack, 'test', {
            eventSourceArn: 'arn:aws:kafka:us-east-1:123456789012:cluster/vpc-2priv-2pub/751d2973-a626-431c-9d4e-d7975eb44dd7-2',
            kafkaConsumerGroupId: 'some invalid',
            target: fn,
        })).toThrow('kafkaConsumerGroupId contains invalid characters. Allowed values are "[a-zA-Z0-9-\/*:_+=.@-]"');
    });
    test('throws if kafkaConsumerGroupId is too long', () => {
        expect(() => new lib_1.EventSourceMapping(stack, 'test', {
            eventSourceArn: 'arn:aws:kafka:us-east-1:123456789012:cluster/vpc-2priv-2pub/751d2973-a626-431c-9d4e-d7975eb44dd7-2',
            kafkaConsumerGroupId: 'x'.repeat(201),
            target: fn,
        })).toThrow('kafkaConsumerGroupId must be a valid string between 1 and 200 characters');
    });
    test('not throws if kafkaConsumerGroupId is empty', () => {
        expect(() => new lib_1.EventSourceMapping(stack, 'test', {
            eventSourceArn: 'arn:aws:kafka:us-east-1:123456789012:cluster/vpc-2priv-2pub/751d2973-a626-431c-9d4e-d7975eb44dd7-2',
            kafkaConsumerGroupId: '',
            target: fn,
        })).not.toThrow();
    });
    test('not throws if kafkaConsumerGroupId is token', () => {
        expect(() => new lib_1.EventSourceMapping(stack, 'test', {
            eventSourceArn: 'arn:aws:kafka:us-east-1:123456789012:cluster/vpc-2priv-2pub/751d2973-a626-431c-9d4e-d7975eb44dd7-2',
            kafkaConsumerGroupId: cdk.Lazy.string({ produce: () => 'test' }),
            target: fn,
        })).not.toThrow();
    });
    test('not throws if kafkaConsumerGroupId is valid for amazon managed kafka', () => {
        expect(() => new lib_1.EventSourceMapping(stack, 'test', {
            eventSourceArn: 'arn:aws:kafka:us-east-1:123456789012:cluster/vpc-2priv-2pub/751d2973-a626-431c-9d4e-d7975eb44dd7-2',
            kafkaConsumerGroupId: 'someValidConsumerGroupId',
            target: fn,
        })).not.toThrow();
    });
    test('not throws if kafkaConsumerGroupId is valid for self managed kafka', () => {
        expect(() => new lib_1.EventSourceMapping(stack, 'test', {
            kafkaBootstrapServers: ['kafka-broker-1:9092', 'kafka-broker-2:9092'],
            kafkaConsumerGroupId: 'someValidConsumerGroupId',
            target: fn,
        })).not.toThrow();
    });
    test('eventSourceArn appears in stack', () => {
        const topicNameParam = new cdk.CfnParameter(stack, 'TopicNameParam', {
            type: 'String',
        });
        let eventSourceArn = 'some-arn';
        new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: eventSourceArn,
            kafkaTopic: topicNameParam.valueAsString,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
            EventSourceArn: eventSourceArn,
        });
    });
    test('filter with one pattern', () => {
        const topicNameParam = new cdk.CfnParameter(stack, 'TopicNameParam', {
            type: 'String',
        });
        let eventSourceArn = 'some-arn';
        new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: eventSourceArn,
            kafkaTopic: topicNameParam.valueAsString,
            filters: [
                lib_1.FilterCriteria.filter({
                    numericEquals: lib_1.FilterRule.isEqual(1),
                }),
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
            FilterCriteria: {
                Filters: [
                    {
                        Pattern: '{"numericEquals":[{"numeric":["=",1]}]}',
                    },
                ],
            },
        });
    });
    test('filter with more than one pattern', () => {
        const topicNameParam = new cdk.CfnParameter(stack, 'TopicNameParam', {
            type: 'String',
        });
        let eventSourceArn = 'some-arn';
        new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: eventSourceArn,
            kafkaTopic: topicNameParam.valueAsString,
            filters: [
                lib_1.FilterCriteria.filter({
                    orFilter: lib_1.FilterRule.or('one', 'two'),
                    stringEquals: lib_1.FilterRule.isEqual('test'),
                }),
                lib_1.FilterCriteria.filter({
                    numericEquals: lib_1.FilterRule.isEqual(1),
                }),
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
            FilterCriteria: {
                Filters: [
                    {
                        Pattern: '{"orFilter":["one","two"],"stringEquals":["test"]}',
                    },
                    {
                        Pattern: '{"numericEquals":[{"numeric":["=",1]}]}',
                    },
                ],
            },
        });
    });
    test('kafkaBootstrapServers appears in stack', () => {
        const topicNameParam = new cdk.CfnParameter(stack, 'TopicNameParam', {
            type: 'String',
        });
        let kafkaBootstrapServers = ['kafka-broker.example.com:9092'];
        new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            kafkaBootstrapServers: kafkaBootstrapServers,
            kafkaTopic: topicNameParam.valueAsString,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
            SelfManagedEventSource: { Endpoints: { KafkaBootstrapServers: kafkaBootstrapServers } },
        });
    });
    test('throws if tumblingWindow > 900 seconds', () => {
        expect(() => new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: '',
            tumblingWindow: cdk.Duration.seconds(901),
        })).toThrow(/tumblingWindow cannot be over 900 seconds/);
    });
    test('accepts if tumblingWindow is a token', () => {
        const lazyDuration = cdk.Duration.seconds(cdk.Lazy.number({ produce: () => 60 }));
        new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: '',
            tumblingWindow: lazyDuration,
        });
    });
    test('transforms reportBatchItemFailures into functionResponseTypes with ReportBatchItemFailures', () => {
        new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: '',
            reportBatchItemFailures: true,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
            FunctionResponseTypes: ['ReportBatchItemFailures'],
        });
    });
    test('transforms missing reportBatchItemFailures into absent FunctionResponseTypes', () => {
        new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: '',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
            FunctionResponseTypes: assertions_1.Match.absent(),
        });
    });
    test('transforms reportBatchItemFailures false into absent FunctionResponseTypes', () => {
        new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: '',
            reportBatchItemFailures: false,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
            FunctionResponseTypes: assertions_1.Match.absent(),
        });
    });
    test('AT_TIMESTAMP starting position', () => {
        new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: '',
            startingPosition: lib_1.StartingPosition.AT_TIMESTAMP,
            startingPositionTimestamp: 1640995200,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
            StartingPosition: 'AT_TIMESTAMP',
            StartingPositionTimestamp: 1640995200,
        });
    });
    test('startingPositionTimestamp missing throws error', () => {
        expect(() => new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: '',
            startingPosition: lib_1.StartingPosition.AT_TIMESTAMP,
        })).toThrow(/startingPositionTimestamp must be provided when startingPosition is AT_TIMESTAMP/);
    });
    test('startingPositionTimestamp without AT_TIMESTAMP throws error', () => {
        expect(() => new lib_1.EventSourceMapping(stack, 'test', {
            target: fn,
            eventSourceArn: '',
            startingPosition: lib_1.StartingPosition.LATEST,
            startingPositionTimestamp: 1640995200,
        })).toThrow(/startingPositionTimestamp can only be used when startingPosition is AT_TIMESTAMP/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtc291cmNlLW1hcHBpbmcudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV2ZW50LXNvdXJjZS1tYXBwaW5nLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQscUNBQXFDO0FBQ3JDLGdDQUEwSDtBQUUxSCxJQUFJLEtBQWdCLENBQUM7QUFDckIsSUFBSSxFQUFZLENBQUM7QUFDakIsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN4QixFQUFFLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtRQUM3QixPQUFPLEVBQUUsZUFBZTtRQUN4QixJQUFJLEVBQUUsVUFBSSxDQUFDLFVBQVUsQ0FBQyx5Q0FBeUMsQ0FBQztRQUNoRSxPQUFPLEVBQUUsYUFBTyxDQUFDLFdBQVc7S0FDN0IsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO0lBQ3BDLElBQUksQ0FBQyw2REFBNkQsRUFBRSxHQUFHLEVBQUU7UUFDdkUsUUFBUTtRQUNSLElBQUksS0FBSyxHQUFHLElBQUksV0FBSyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7WUFDeEMsU0FBUyxFQUFFLE1BQU07WUFDakIsT0FBTyxFQUFFLEVBQUUsQ0FBQyxjQUFjO1NBQzNCLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxLQUFLLENBQUMscUJBQXFCLENBQUMsV0FBVyxFQUFFO1lBQ3ZDLGNBQWMsRUFBRSxNQUFNO1NBQ3ZCLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUM7WUFDeEMsU0FBUyxFQUFFO2dCQUNULG9FQUFvRTtnQkFDcEUsMEJBQTBCLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUNBQWlDLEVB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QUFNLEVBQUU7WUFDcEMsTUFBTSxFQUFFLEVBQUU7WUFDVixjQUFjLEVBQUUsRUFBRTtZQUNsQixnQkFBZ0IsRUFBRSxzQkFBZ0IsQ0FBQyxZQUFZO1lBQy9DLHlCQUF5QixFQUFFLFVBQVU7U0FDdEMsQ0FBQyxDQUFDO1FBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsaUNBQWlDLEVBQUU7WUFDakYsZ0JBQWdCLEVBQUUsY0FBYztZQUNoQyx5QkFBeUIsRUFBRSxVQUFVO1NBQ3RDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsRUFBRTtRQUMxRCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSx3QkFBa0IsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQ2pELE1BQU0sRUFBRSxFQUFFO1lBQ1YsY0FBYyxFQUFFLEVBQUU7WUFDbEIsZ0JBQWdCLEVBQUUsc0JBQWdCLENBQUMsWUFBWTtTQUNoRCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsa0ZBQWtGLENBQUMsQ0FBQztJQUNsRyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw2REFBNkQsRUFBRSxHQUFHLEVBQUU7UUFDdkUsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksd0JBQWtCLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtZQUNqRCxNQUFNLEVBQUUsRUFBRTtZQUNWLGNBQWMsRUFBRSxFQUFFO1lBQ2xCLGdCQUFnQixFQUFFLHNCQUFnQixDQUFDLE1BQU07WUFDekMseUJBQXlCLEVBQUUsVUFBVTtTQUN0QyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsa0ZBQWtGLENBQUMsQ0FBQztJQUNsRyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb2RlLCBFdmVudFNvdXJjZU1hcHBpbmcsIEZ1bmN0aW9uLCBSdW50aW1lLCBBbGlhcywgU3RhcnRpbmdQb3NpdGlvbiwgRmlsdGVyUnVsZSwgRmlsdGVyQ3JpdGVyaWEgfSBmcm9tICcuLi9saWInO1xuXG5sZXQgc3RhY2s6IGNkay5TdGFjaztcbmxldCBmbjogRnVuY3Rpb247XG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGZuID0gbmV3IEZ1bmN0aW9uKHN0YWNrLCAnZm4nLCB7XG4gICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgIGNvZGU6IENvZGUuZnJvbUlubGluZSgnZXhwb3J0cy5oYW5kbGVyID0gJHtoYW5kbGVyLnRvU3RyaW5nKCl9JyksXG4gICAgcnVudGltZTogUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2V2ZW50IHNvdXJjZSBtYXBwaW5nJywgKCkgPT4ge1xuICB0ZXN0KCd2ZXJpZnkgdGhhdCBhbGlhcy5hZGRFdmVudFNvdXJjZU1hcHBpbmcgcHJvZHVjZXMgc3RhYmxlIGlkcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIHZhciBhbGlhcyA9IG5ldyBBbGlhcyhzdGFjaywgJ0xpdmVBbGlhcycsIHtcbiAgICAgIGFsaWFzTmFtZTogJ0xpdmUnLFxuICAgICAgdmVyc2lvbjogZm4uY3VycmVudFZlcnNpb24sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgYWxpYXMuYWRkRXZlbnRTb3VyY2VNYXBwaW5nKCdNeU1hcHBpbmcnLCB7XG4gICAgICBldmVudFNvdXJjZUFybjogJ2FzZmQnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICAvLyBDcnVjaWFsbHksIG5vIElEIGluIHRoZXJlIHRoYXQgZGVwZW5kcyBvbiB0aGUgc3RhdGUgb2YgdGhlIExhbWJkYVxuICAgICAgICBMaXZlQWxpYXNNeU1hcHBpbmc0RTFCNjk4QjogeyBUeXBlOiAnQVdTOjpMYW1iZGE6OkV2ZW50U291cmNlTWFwcGluZycgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBpZiBtYXhCYXRjaGluZ1dpbmRvdyA+IDMwMCBzZWNvbmRzJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgRXZlbnRTb3VyY2VNYXBwaW5nKHN0YWNrLCAndGVzdCcsIHtcbiAgICAgIHRhcmdldDogZm4sXG4gICAgICBldmVudFNvdXJjZUFybjogJycsXG4gICAgICBtYXhCYXRjaGluZ1dpbmRvdzogY2RrLkR1cmF0aW9uLnNlY29uZHMoMzAxKSxcbiAgICB9KSkudG9UaHJvdygvbWF4QmF0Y2hpbmdXaW5kb3cgY2Fubm90IGJlIG92ZXIgMzAwIHNlY29uZHMvKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIGlmIG1heENvbmN1cnJlbmN5IDwgMiBjb25jdXJyZW50IGluc3RhbmNlcycsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gbmV3IEV2ZW50U291cmNlTWFwcGluZyhzdGFjaywgJ3Rlc3QnLCB7XG4gICAgICB0YXJnZXQ6IGZuLFxuICAgICAgZXZlbnRTb3VyY2VBcm46ICcnLFxuICAgICAgbWF4Q29uY3VycmVuY3k6IDEsXG4gICAgfSkpLnRvVGhyb3coL21heENvbmN1cnJlbmN5IG11c3QgYmUgYmV0d2VlbiAyIGFuZCAxMDAwIGNvbmN1cnJlbnQgaW5zdGFuY2VzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBpZiBtYXhDb25jdXJyZW5jeSA+IDEwMDAgY29uY3VycmVudCBpbnN0YW5jZXMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBFdmVudFNvdXJjZU1hcHBpbmcoc3RhY2ssICd0ZXN0Jywge1xuICAgICAgdGFyZ2V0OiBmbixcbiAgICAgIGV2ZW50U291cmNlQXJuOiAnJyxcbiAgICAgIG1heENvbmN1cnJlbmN5OiAxMDAxLFxuICAgIH0pKS50b1Rocm93KC9tYXhDb25jdXJyZW5jeSBtdXN0IGJlIGJldHdlZW4gMiBhbmQgMTAwMCBjb25jdXJyZW50IGluc3RhbmNlcy8pO1xuICB9KTtcblxuICB0ZXN0KCdtYXhDb25jdXJyZW5jeSBhcHBlYXJzIGluIHN0YWNrJywgKCkgPT4ge1xuICAgIG5ldyBFdmVudFNvdXJjZU1hcHBpbmcoc3RhY2ssICd0ZXN0Jywge1xuICAgICAgdGFyZ2V0OiBmbixcbiAgICAgIGV2ZW50U291cmNlQXJuOiAnJyxcbiAgICAgIG1heENvbmN1cnJlbmN5OiAyLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpFdmVudFNvdXJjZU1hcHBpbmcnLCB7XG4gICAgICBTY2FsaW5nQ29uZmlnOiB7IE1heGltdW1Db25jdXJyZW5jeTogMiB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3MgaWYgbWF4UmVjb3JkQWdlIGlzIGJlbG93IDYwIHNlY29uZHMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBFdmVudFNvdXJjZU1hcHBpbmcoc3RhY2ssICd0ZXN0Jywge1xuICAgICAgdGFyZ2V0OiBmbixcbiAgICAgIGV2ZW50U291cmNlQXJuOiAnJyxcbiAgICAgIG1heFJlY29yZEFnZTogY2RrLkR1cmF0aW9uLnNlY29uZHMoNTkpLFxuICAgIH0pKS50b1Rocm93KC9tYXhSZWNvcmRBZ2UgbXVzdCBiZSBiZXR3ZWVuIDYwIHNlY29uZHMgYW5kIDcgZGF5cyBpbmNsdXNpdmUvKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIGlmIG1heFJlY29yZEFnZSBpcyBvdmVyIDcgZGF5cycsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gbmV3IEV2ZW50U291cmNlTWFwcGluZyhzdGFjaywgJ3Rlc3QnLCB7XG4gICAgICB0YXJnZXQ6IGZuLFxuICAgICAgZXZlbnRTb3VyY2VBcm46ICcnLFxuICAgICAgbWF4UmVjb3JkQWdlOiBjZGsuRHVyYXRpb24uc2Vjb25kcyg2MDQ4MDEpLFxuICAgIH0pKS50b1Rocm93KC9tYXhSZWNvcmRBZ2UgbXVzdCBiZSBiZXR3ZWVuIDYwIHNlY29uZHMgYW5kIDcgZGF5cyBpbmNsdXNpdmUvKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIGlmIHJldHJ5QXR0ZW1wdHMgaXMgbmVnYXRpdmUnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBFdmVudFNvdXJjZU1hcHBpbmcoc3RhY2ssICd0ZXN0Jywge1xuICAgICAgdGFyZ2V0OiBmbixcbiAgICAgIGV2ZW50U291cmNlQXJuOiAnJyxcbiAgICAgIHJldHJ5QXR0ZW1wdHM6IC0xLFxuICAgIH0pKS50b1Rocm93KC9yZXRyeUF0dGVtcHRzIG11c3QgYmUgYmV0d2VlbiAwIGFuZCAxMDAwMCBpbmNsdXNpdmUsIGdvdCAtMS8pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3MgaWYgcmV0cnlBdHRlbXB0cyBpcyBvdmVyIDEwMDAwJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgRXZlbnRTb3VyY2VNYXBwaW5nKHN0YWNrLCAndGVzdCcsIHtcbiAgICAgIHRhcmdldDogZm4sXG4gICAgICBldmVudFNvdXJjZUFybjogJycsXG4gICAgICByZXRyeUF0dGVtcHRzOiAxMDAwMSxcbiAgICB9KSkudG9UaHJvdygvcmV0cnlBdHRlbXB0cyBtdXN0IGJlIGJldHdlZW4gMCBhbmQgMTAwMDAgaW5jbHVzaXZlLCBnb3QgMTAwMDEvKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWNjZXB0cyBpZiByZXRyeUF0dGVtcHRzIGlzIGEgdG9rZW4nLCAoKSA9PiB7XG4gICAgbmV3IEV2ZW50U291cmNlTWFwcGluZyhzdGFjaywgJ3Rlc3QnLCB7XG4gICAgICB0YXJnZXQ6IGZuLFxuICAgICAgZXZlbnRTb3VyY2VBcm46ICcnLFxuICAgICAgcmV0cnlBdHRlbXB0czogY2RrLkxhenkubnVtYmVyKHsgcHJvZHVjZTogKCkgPT4gMTAwIH0pLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3MgaWYgcGFyYWxsZWxpemF0aW9uRmFjdG9yIGlzIGJlbG93IDEnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBFdmVudFNvdXJjZU1hcHBpbmcoc3RhY2ssICd0ZXN0Jywge1xuICAgICAgdGFyZ2V0OiBmbixcbiAgICAgIGV2ZW50U291cmNlQXJuOiAnJyxcbiAgICAgIHBhcmFsbGVsaXphdGlvbkZhY3RvcjogMCxcbiAgICB9KSkudG9UaHJvdygvcGFyYWxsZWxpemF0aW9uRmFjdG9yIG11c3QgYmUgYmV0d2VlbiAxIGFuZCAxMCBpbmNsdXNpdmUsIGdvdCAwLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBpZiBwYXJhbGxlbGl6YXRpb25GYWN0b3IgaXMgb3ZlciAxMCcsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gbmV3IEV2ZW50U291cmNlTWFwcGluZyhzdGFjaywgJ3Rlc3QnLCB7XG4gICAgICB0YXJnZXQ6IGZuLFxuICAgICAgZXZlbnRTb3VyY2VBcm46ICcnLFxuICAgICAgcGFyYWxsZWxpemF0aW9uRmFjdG9yOiAxMSxcbiAgICB9KSkudG9UaHJvdygvcGFyYWxsZWxpemF0aW9uRmFjdG9yIG11c3QgYmUgYmV0d2VlbiAxIGFuZCAxMCBpbmNsdXNpdmUsIGdvdCAxMS8pO1xuICB9KTtcblxuICB0ZXN0KCdhY2NlcHRzIGlmIHBhcmFsbGVsaXphdGlvbkZhY3RvciBpcyBhIHRva2VuJywgKCkgPT4ge1xuICAgIG5ldyBFdmVudFNvdXJjZU1hcHBpbmcoc3RhY2ssICd0ZXN0Jywge1xuICAgICAgdGFyZ2V0OiBmbixcbiAgICAgIGV2ZW50U291cmNlQXJuOiAnJyxcbiAgICAgIHBhcmFsbGVsaXphdGlvbkZhY3RvcjogY2RrLkxhenkubnVtYmVyKHsgcHJvZHVjZTogKCkgPT4gMjAgfSksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ltcG9ydCBldmVudCBzb3VyY2UgbWFwcGluZycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7IHN0YWNrTmFtZTogJ3Rlc3Qtc3RhY2snIH0pO1xuICAgIGNvbnN0IGltcG9ydGVkID0gRXZlbnRTb3VyY2VNYXBwaW5nLmZyb21FdmVudFNvdXJjZU1hcHBpbmdJZChzdGFjazIsICdpbXBvcnRlZCcsICcxNGUwZGI3MS01ZDM1LTRlYjUtYjQ4MS04OTQ1Y2Y5ZDEwYzInKTtcblxuICAgIGV4cGVjdChpbXBvcnRlZC5ldmVudFNvdXJjZU1hcHBpbmdJZCkudG9FcXVhbCgnMTRlMGRiNzEtNWQzNS00ZWI1LWI0ODEtODk0NWNmOWQxMGMyJyk7XG4gICAgZXhwZWN0KGltcG9ydGVkLnN0YWNrLnN0YWNrTmFtZSkudG9FcXVhbCgndGVzdC1zdGFjaycpO1xuICB9KTtcblxuICB0ZXN0KCdhY2NlcHRzIGlmIGthZmthVG9waWMgaXMgYSBwYXJhbWV0ZXInLCAoKSA9PiB7XG4gICAgY29uc3QgdG9waWNOYW1lUGFyYW0gPSBuZXcgY2RrLkNmblBhcmFtZXRlcihzdGFjaywgJ1RvcGljTmFtZVBhcmFtJywge1xuICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgfSk7XG5cbiAgICBuZXcgRXZlbnRTb3VyY2VNYXBwaW5nKHN0YWNrLCAndGVzdCcsIHtcbiAgICAgIHRhcmdldDogZm4sXG4gICAgICBldmVudFNvdXJjZUFybjogJycsXG4gICAgICBrYWZrYVRvcGljOiB0b3BpY05hbWVQYXJhbS52YWx1ZUFzU3RyaW5nLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpFdmVudFNvdXJjZU1hcHBpbmcnLCB7XG4gICAgICBUb3BpY3M6IFt7XG4gICAgICAgIFJlZjogJ1RvcGljTmFtZVBhcmFtJyxcbiAgICAgIH1dLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3MgaWYgbmVpdGhlciBldmVudFNvdXJjZUFybiBub3Iga2Fma2FCb290c3RyYXBTZXJ2ZXJzIGFyZSBzZXQnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBFdmVudFNvdXJjZU1hcHBpbmcoc3RhY2ssICd0ZXN0Jywge1xuICAgICAgdGFyZ2V0OiBmbixcbiAgICB9KSkudG9UaHJvdygvRWl0aGVyIGV2ZW50U291cmNlQXJuIG9yIGthZmthQm9vdHN0cmFwU2VydmVycyBtdXN0IGJlIHNldC8pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3MgaWYgYm90aCBldmVudFNvdXJjZUFybiBhbmQga2Fma2FCb290c3RyYXBTZXJ2ZXJzIGFyZSBzZXQnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBFdmVudFNvdXJjZU1hcHBpbmcoc3RhY2ssICd0ZXN0Jywge1xuICAgICAgZXZlbnRTb3VyY2VBcm46ICcnLFxuICAgICAga2Fma2FCb290c3RyYXBTZXJ2ZXJzOiBbXSxcbiAgICAgIHRhcmdldDogZm4sXG4gICAgfSkpLnRvVGhyb3coL2V2ZW50U291cmNlQXJuIGFuZCBrYWZrYUJvb3RzdHJhcFNlcnZlcnMgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZS8pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3MgaWYgYm90aCBrYWZrYUJvb3RzdHJhcFNlcnZlcnMgaXMgc2V0IGJ1dCBlbXB0eScsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gbmV3IEV2ZW50U291cmNlTWFwcGluZyhzdGFjaywgJ3Rlc3QnLCB7XG4gICAgICBrYWZrYUJvb3RzdHJhcFNlcnZlcnM6IFtdLFxuICAgICAgdGFyZ2V0OiBmbixcbiAgICB9KSkudG9UaHJvdygva2Fma2FCb290U3RyYXBTZXJ2ZXJzIG11c3Qgbm90IGJlIGVtcHR5IGlmIHNldC8pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3MgaWYga2Fma2FDb25zdW1lckdyb3VwSWQgaXMgaW52YWxpZCcsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gbmV3IEV2ZW50U291cmNlTWFwcGluZyhzdGFjaywgJ3Rlc3QnLCB7XG4gICAgICBldmVudFNvdXJjZUFybjogJ2Fybjphd3M6a2Fma2E6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpjbHVzdGVyL3ZwYy0ycHJpdi0ycHViLzc1MWQyOTczLWE2MjYtNDMxYy05ZDRlLWQ3OTc1ZWI0NGRkNy0yJyxcbiAgICAgIGthZmthQ29uc3VtZXJHcm91cElkOiAnc29tZSBpbnZhbGlkJyxcbiAgICAgIHRhcmdldDogZm4sXG4gICAgfSkpLnRvVGhyb3coJ2thZmthQ29uc3VtZXJHcm91cElkIGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycy4gQWxsb3dlZCB2YWx1ZXMgYXJlIFwiW2EtekEtWjAtOS1cXC8qOl8rPS5ALV1cIicpO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3MgaWYga2Fma2FDb25zdW1lckdyb3VwSWQgaXMgdG9vIGxvbmcnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBFdmVudFNvdXJjZU1hcHBpbmcoc3RhY2ssICd0ZXN0Jywge1xuICAgICAgZXZlbnRTb3VyY2VBcm46ICdhcm46YXdzOmthZmthOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6Y2x1c3Rlci92cGMtMnByaXYtMnB1Yi83NTFkMjk3My1hNjI2LTQzMWMtOWQ0ZS1kNzk3NWViNDRkZDctMicsXG4gICAgICBrYWZrYUNvbnN1bWVyR3JvdXBJZDogJ3gnLnJlcGVhdCgyMDEpLFxuICAgICAgdGFyZ2V0OiBmbixcbiAgICB9KSkudG9UaHJvdygna2Fma2FDb25zdW1lckdyb3VwSWQgbXVzdCBiZSBhIHZhbGlkIHN0cmluZyBiZXR3ZWVuIDEgYW5kIDIwMCBjaGFyYWN0ZXJzJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ25vdCB0aHJvd3MgaWYga2Fma2FDb25zdW1lckdyb3VwSWQgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBFdmVudFNvdXJjZU1hcHBpbmcoc3RhY2ssICd0ZXN0Jywge1xuICAgICAgZXZlbnRTb3VyY2VBcm46ICdhcm46YXdzOmthZmthOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6Y2x1c3Rlci92cGMtMnByaXYtMnB1Yi83NTFkMjk3My1hNjI2LTQzMWMtOWQ0ZS1kNzk3NWViNDRkZDctMicsXG4gICAgICBrYWZrYUNvbnN1bWVyR3JvdXBJZDogJycsXG4gICAgICB0YXJnZXQ6IGZuLFxuICAgIH0pKS5ub3QudG9UaHJvdygpO1xuICB9KTtcblxuICB0ZXN0KCdub3QgdGhyb3dzIGlmIGthZmthQ29uc3VtZXJHcm91cElkIGlzIHRva2VuJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgRXZlbnRTb3VyY2VNYXBwaW5nKHN0YWNrLCAndGVzdCcsIHtcbiAgICAgIGV2ZW50U291cmNlQXJuOiAnYXJuOmF3czprYWZrYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmNsdXN0ZXIvdnBjLTJwcml2LTJwdWIvNzUxZDI5NzMtYTYyNi00MzFjLTlkNGUtZDc5NzVlYjQ0ZGQ3LTInLFxuICAgICAga2Fma2FDb25zdW1lckdyb3VwSWQ6IGNkay5MYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+ICd0ZXN0JyB9KSxcbiAgICAgIHRhcmdldDogZm4sXG4gICAgfSkpLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ25vdCB0aHJvd3MgaWYga2Fma2FDb25zdW1lckdyb3VwSWQgaXMgdmFsaWQgZm9yIGFtYXpvbiBtYW5hZ2VkIGthZmthJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgRXZlbnRTb3VyY2VNYXBwaW5nKHN0YWNrLCAndGVzdCcsIHtcbiAgICAgIGV2ZW50U291cmNlQXJuOiAnYXJuOmF3czprYWZrYTp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmNsdXN0ZXIvdnBjLTJwcml2LTJwdWIvNzUxZDI5NzMtYTYyNi00MzFjLTlkNGUtZDc5NzVlYjQ0ZGQ3LTInLFxuICAgICAga2Fma2FDb25zdW1lckdyb3VwSWQ6ICdzb21lVmFsaWRDb25zdW1lckdyb3VwSWQnLFxuICAgICAgdGFyZ2V0OiBmbixcbiAgICB9KSkubm90LnRvVGhyb3coKTtcbiAgfSk7XG5cbiAgdGVzdCgnbm90IHRocm93cyBpZiBrYWZrYUNvbnN1bWVyR3JvdXBJZCBpcyB2YWxpZCBmb3Igc2VsZiBtYW5hZ2VkIGthZmthJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgRXZlbnRTb3VyY2VNYXBwaW5nKHN0YWNrLCAndGVzdCcsIHtcbiAgICAgIGthZmthQm9vdHN0cmFwU2VydmVyczogWydrYWZrYS1icm9rZXItMTo5MDkyJywgJ2thZmthLWJyb2tlci0yOjkwOTInXSxcbiAgICAgIGthZmthQ29uc3VtZXJHcm91cElkOiAnc29tZVZhbGlkQ29uc3VtZXJHcm91cElkJyxcbiAgICAgIHRhcmdldDogZm4sXG4gICAgfSkpLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2V2ZW50U291cmNlQXJuIGFwcGVhcnMgaW4gc3RhY2snLCAoKSA9PiB7XG4gICAgY29uc3QgdG9waWNOYW1lUGFyYW0gPSBuZXcgY2RrLkNmblBhcmFtZXRlcihzdGFjaywgJ1RvcGljTmFtZVBhcmFtJywge1xuICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgfSk7XG5cbiAgICBsZXQgZXZlbnRTb3VyY2VBcm4gPSAnc29tZS1hcm4nO1xuXG4gICAgbmV3IEV2ZW50U291cmNlTWFwcGluZyhzdGFjaywgJ3Rlc3QnLCB7XG4gICAgICB0YXJnZXQ6IGZuLFxuICAgICAgZXZlbnRTb3VyY2VBcm46IGV2ZW50U291cmNlQXJuLFxuICAgICAga2Fma2FUb3BpYzogdG9waWNOYW1lUGFyYW0udmFsdWVBc1N0cmluZyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RXZlbnRTb3VyY2VNYXBwaW5nJywge1xuICAgICAgRXZlbnRTb3VyY2VBcm46IGV2ZW50U291cmNlQXJuLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmaWx0ZXIgd2l0aCBvbmUgcGF0dGVybicsICgpID0+IHtcbiAgICBjb25zdCB0b3BpY05hbWVQYXJhbSA9IG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHN0YWNrLCAnVG9waWNOYW1lUGFyYW0nLCB7XG4gICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICB9KTtcblxuICAgIGxldCBldmVudFNvdXJjZUFybiA9ICdzb21lLWFybic7XG5cbiAgICBuZXcgRXZlbnRTb3VyY2VNYXBwaW5nKHN0YWNrLCAndGVzdCcsIHtcbiAgICAgIHRhcmdldDogZm4sXG4gICAgICBldmVudFNvdXJjZUFybjogZXZlbnRTb3VyY2VBcm4sXG4gICAgICBrYWZrYVRvcGljOiB0b3BpY05hbWVQYXJhbS52YWx1ZUFzU3RyaW5nLFxuICAgICAgZmlsdGVyczogW1xuICAgICAgICBGaWx0ZXJDcml0ZXJpYS5maWx0ZXIoe1xuICAgICAgICAgIG51bWVyaWNFcXVhbHM6IEZpbHRlclJ1bGUuaXNFcXVhbCgxKSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpFdmVudFNvdXJjZU1hcHBpbmcnLCB7XG4gICAgICBGaWx0ZXJDcml0ZXJpYToge1xuICAgICAgICBGaWx0ZXJzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUGF0dGVybjogJ3tcIm51bWVyaWNFcXVhbHNcIjpbe1wibnVtZXJpY1wiOltcIj1cIiwxXX1dfScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZpbHRlciB3aXRoIG1vcmUgdGhhbiBvbmUgcGF0dGVybicsICgpID0+IHtcbiAgICBjb25zdCB0b3BpY05hbWVQYXJhbSA9IG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHN0YWNrLCAnVG9waWNOYW1lUGFyYW0nLCB7XG4gICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICB9KTtcblxuICAgIGxldCBldmVudFNvdXJjZUFybiA9ICdzb21lLWFybic7XG5cbiAgICBuZXcgRXZlbnRTb3VyY2VNYXBwaW5nKHN0YWNrLCAndGVzdCcsIHtcbiAgICAgIHRhcmdldDogZm4sXG4gICAgICBldmVudFNvdXJjZUFybjogZXZlbnRTb3VyY2VBcm4sXG4gICAgICBrYWZrYVRvcGljOiB0b3BpY05hbWVQYXJhbS52YWx1ZUFzU3RyaW5nLFxuICAgICAgZmlsdGVyczogW1xuICAgICAgICBGaWx0ZXJDcml0ZXJpYS5maWx0ZXIoe1xuICAgICAgICAgIG9yRmlsdGVyOiBGaWx0ZXJSdWxlLm9yKCdvbmUnLCAndHdvJyksXG4gICAgICAgICAgc3RyaW5nRXF1YWxzOiBGaWx0ZXJSdWxlLmlzRXF1YWwoJ3Rlc3QnKSxcbiAgICAgICAgfSksXG4gICAgICAgIEZpbHRlckNyaXRlcmlhLmZpbHRlcih7XG4gICAgICAgICAgbnVtZXJpY0VxdWFsczogRmlsdGVyUnVsZS5pc0VxdWFsKDEpLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkV2ZW50U291cmNlTWFwcGluZycsIHtcbiAgICAgIEZpbHRlckNyaXRlcmlhOiB7XG4gICAgICAgIEZpbHRlcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBQYXR0ZXJuOiAne1wib3JGaWx0ZXJcIjpbXCJvbmVcIixcInR3b1wiXSxcInN0cmluZ0VxdWFsc1wiOltcInRlc3RcIl19JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFBhdHRlcm46ICd7XCJudW1lcmljRXF1YWxzXCI6W3tcIm51bWVyaWNcIjpbXCI9XCIsMV19XX0nLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdrYWZrYUJvb3RzdHJhcFNlcnZlcnMgYXBwZWFycyBpbiBzdGFjaycsICgpID0+IHtcbiAgICBjb25zdCB0b3BpY05hbWVQYXJhbSA9IG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHN0YWNrLCAnVG9waWNOYW1lUGFyYW0nLCB7XG4gICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICB9KTtcblxuICAgIGxldCBrYWZrYUJvb3RzdHJhcFNlcnZlcnMgPSBbJ2thZmthLWJyb2tlci5leGFtcGxlLmNvbTo5MDkyJ107XG4gICAgbmV3IEV2ZW50U291cmNlTWFwcGluZyhzdGFjaywgJ3Rlc3QnLCB7XG4gICAgICB0YXJnZXQ6IGZuLFxuICAgICAga2Fma2FCb290c3RyYXBTZXJ2ZXJzOiBrYWZrYUJvb3RzdHJhcFNlcnZlcnMsXG4gICAgICBrYWZrYVRvcGljOiB0b3BpY05hbWVQYXJhbS52YWx1ZUFzU3RyaW5nLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpFdmVudFNvdXJjZU1hcHBpbmcnLCB7XG4gICAgICBTZWxmTWFuYWdlZEV2ZW50U291cmNlOiB7IEVuZHBvaW50czogeyBLYWZrYUJvb3RzdHJhcFNlcnZlcnM6IGthZmthQm9vdHN0cmFwU2VydmVycyB9IH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBpZiB0dW1ibGluZ1dpbmRvdyA+IDkwMCBzZWNvbmRzJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgRXZlbnRTb3VyY2VNYXBwaW5nKHN0YWNrLCAndGVzdCcsIHtcbiAgICAgIHRhcmdldDogZm4sXG4gICAgICBldmVudFNvdXJjZUFybjogJycsXG4gICAgICB0dW1ibGluZ1dpbmRvdzogY2RrLkR1cmF0aW9uLnNlY29uZHMoOTAxKSxcbiAgICB9KSkudG9UaHJvdygvdHVtYmxpbmdXaW5kb3cgY2Fubm90IGJlIG92ZXIgOTAwIHNlY29uZHMvKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWNjZXB0cyBpZiB0dW1ibGluZ1dpbmRvdyBpcyBhIHRva2VuJywgKCkgPT4ge1xuICAgIGNvbnN0IGxhenlEdXJhdGlvbiA9IGNkay5EdXJhdGlvbi5zZWNvbmRzKGNkay5MYXp5Lm51bWJlcih7IHByb2R1Y2U6ICgpID0+IDYwIH0pKTtcblxuICAgIG5ldyBFdmVudFNvdXJjZU1hcHBpbmcoc3RhY2ssICd0ZXN0Jywge1xuICAgICAgdGFyZ2V0OiBmbixcbiAgICAgIGV2ZW50U291cmNlQXJuOiAnJyxcbiAgICAgIHR1bWJsaW5nV2luZG93OiBsYXp5RHVyYXRpb24sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3RyYW5zZm9ybXMgcmVwb3J0QmF0Y2hJdGVtRmFpbHVyZXMgaW50byBmdW5jdGlvblJlc3BvbnNlVHlwZXMgd2l0aCBSZXBvcnRCYXRjaEl0ZW1GYWlsdXJlcycsICgpID0+IHtcbiAgICBuZXcgRXZlbnRTb3VyY2VNYXBwaW5nKHN0YWNrLCAndGVzdCcsIHtcbiAgICAgIHRhcmdldDogZm4sXG4gICAgICBldmVudFNvdXJjZUFybjogJycsXG4gICAgICByZXBvcnRCYXRjaEl0ZW1GYWlsdXJlczogdHJ1ZSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RXZlbnRTb3VyY2VNYXBwaW5nJywge1xuICAgICAgRnVuY3Rpb25SZXNwb25zZVR5cGVzOiBbJ1JlcG9ydEJhdGNoSXRlbUZhaWx1cmVzJ10sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3RyYW5zZm9ybXMgbWlzc2luZyByZXBvcnRCYXRjaEl0ZW1GYWlsdXJlcyBpbnRvIGFic2VudCBGdW5jdGlvblJlc3BvbnNlVHlwZXMnLCAoKSA9PiB7XG4gICAgbmV3IEV2ZW50U291cmNlTWFwcGluZyhzdGFjaywgJ3Rlc3QnLCB7XG4gICAgICB0YXJnZXQ6IGZuLFxuICAgICAgZXZlbnRTb3VyY2VBcm46ICcnLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpFdmVudFNvdXJjZU1hcHBpbmcnLCB7XG4gICAgICBGdW5jdGlvblJlc3BvbnNlVHlwZXM6IE1hdGNoLmFic2VudCgpLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0cmFuc2Zvcm1zIHJlcG9ydEJhdGNoSXRlbUZhaWx1cmVzIGZhbHNlIGludG8gYWJzZW50IEZ1bmN0aW9uUmVzcG9uc2VUeXBlcycsICgpID0+IHtcbiAgICBuZXcgRXZlbnRTb3VyY2VNYXBwaW5nKHN0YWNrLCAndGVzdCcsIHtcbiAgICAgIHRhcmdldDogZm4sXG4gICAgICBldmVudFNvdXJjZUFybjogJycsXG4gICAgICByZXBvcnRCYXRjaEl0ZW1GYWlsdXJlczogZmFsc2UsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkV2ZW50U291cmNlTWFwcGluZycsIHtcbiAgICAgIEZ1bmN0aW9uUmVzcG9uc2VUeXBlczogTWF0Y2guYWJzZW50KCksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0FUX1RJTUVTVEFNUCBzdGFydGluZyBwb3NpdGlvbicsICgpID0+IHtcbiAgICBuZXcgRXZlbnRTb3VyY2VNYXBwaW5nKHN0YWNrLCAndGVzdCcsIHtcbiAgICAgIHRhcmdldDogZm4sXG4gICAgICBldmVudFNvdXJjZUFybjogJycsXG4gICAgICBzdGFydGluZ1Bvc2l0aW9uOiBTdGFydGluZ1Bvc2l0aW9uLkFUX1RJTUVTVEFNUCxcbiAgICAgIHN0YXJ0aW5nUG9zaXRpb25UaW1lc3RhbXA6IDE2NDA5OTUyMDAsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkV2ZW50U291cmNlTWFwcGluZycsIHtcbiAgICAgIFN0YXJ0aW5nUG9zaXRpb246ICdBVF9USU1FU1RBTVAnLFxuICAgICAgU3RhcnRpbmdQb3NpdGlvblRpbWVzdGFtcDogMTY0MDk5NTIwMCxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc3RhcnRpbmdQb3NpdGlvblRpbWVzdGFtcCBtaXNzaW5nIHRocm93cyBlcnJvcicsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gbmV3IEV2ZW50U291cmNlTWFwcGluZyhzdGFjaywgJ3Rlc3QnLCB7XG4gICAgICB0YXJnZXQ6IGZuLFxuICAgICAgZXZlbnRTb3VyY2VBcm46ICcnLFxuICAgICAgc3RhcnRpbmdQb3NpdGlvbjogU3RhcnRpbmdQb3NpdGlvbi5BVF9USU1FU1RBTVAsXG4gICAgfSkpLnRvVGhyb3coL3N0YXJ0aW5nUG9zaXRpb25UaW1lc3RhbXAgbXVzdCBiZSBwcm92aWRlZCB3aGVuIHN0YXJ0aW5nUG9zaXRpb24gaXMgQVRfVElNRVNUQU1QLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0YXJ0aW5nUG9zaXRpb25UaW1lc3RhbXAgd2l0aG91dCBBVF9USU1FU1RBTVAgdGhyb3dzIGVycm9yJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgRXZlbnRTb3VyY2VNYXBwaW5nKHN0YWNrLCAndGVzdCcsIHtcbiAgICAgIHRhcmdldDogZm4sXG4gICAgICBldmVudFNvdXJjZUFybjogJycsXG4gICAgICBzdGFydGluZ1Bvc2l0aW9uOiBTdGFydGluZ1Bvc2l0aW9uLkxBVEVTVCxcbiAgICAgIHN0YXJ0aW5nUG9zaXRpb25UaW1lc3RhbXA6IDE2NDA5OTUyMDAsXG4gICAgfSkpLnRvVGhyb3coL3N0YXJ0aW5nUG9zaXRpb25UaW1lc3RhbXAgY2FuIG9ubHkgYmUgdXNlZCB3aGVuIHN0YXJ0aW5nUG9zaXRpb24gaXMgQVRfVElNRVNUQU1QLyk7XG4gIH0pO1xufSk7XG4iXX0=