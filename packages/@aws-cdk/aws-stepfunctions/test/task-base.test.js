"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const sfn = require("../lib");
const fake_task_1 = require("./private/fake-task");
const render_util_1 = require("./private/render-util");
describe('Task base', () => {
    let stack;
    let task;
    beforeEach(() => {
        // GIVEN
        stack = new cdk.Stack();
        task = new fake_task_1.FakeTask(stack, 'my-task', {
            metrics: {
                metricPrefixPlural: '',
                metricPrefixSingular: '',
            },
        });
    });
    test('instantiate a concrete implementation with properties', () => {
        // WHEN
        task = new fake_task_1.FakeTask(stack, 'my-exciting-task', {
            comment: 'my exciting task',
            heartbeat: cdk.Duration.seconds(10),
            timeout: cdk.Duration.minutes(10),
        });
        // THEN
        expect(render_util_1.renderGraph(task)).toEqual({
            StartAt: 'my-exciting-task',
            States: {
                'my-exciting-task': {
                    End: true,
                    Type: 'Task',
                    Comment: 'my exciting task',
                    TimeoutSeconds: 600,
                    HeartbeatSeconds: 10,
                    Resource: 'my-resource',
                    Parameters: { MyParameter: 'myParameter' },
                },
            },
        });
    });
    test('instantiate a concrete implementation with credentials of a specified role', () => {
        // WHEN
        const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/example-role');
        task = new fake_task_1.FakeTask(stack, 'my-exciting-task', {
            comment: 'my exciting task',
            heartbeat: cdk.Duration.seconds(10),
            timeout: cdk.Duration.minutes(10),
            credentials: {
                role: sfn.TaskRole.fromRole(role),
            },
        });
        // THEN
        expect(render_util_1.renderGraph(task)).toEqual({
            StartAt: 'my-exciting-task',
            States: {
                'my-exciting-task': {
                    End: true,
                    Type: 'Task',
                    Comment: 'my exciting task',
                    TimeoutSeconds: 600,
                    HeartbeatSeconds: 10,
                    Resource: 'my-resource',
                    Parameters: { MyParameter: 'myParameter' },
                    Credentials: { RoleArn: 'arn:aws:iam::123456789012:role/example-role' },
                },
            },
        });
    });
    test('instantiate a concrete implementation with credentials of json expression roleArn', () => {
        // WHEN
        task = new fake_task_1.FakeTask(stack, 'my-exciting-task', {
            comment: 'my exciting task',
            heartbeat: cdk.Duration.seconds(10),
            timeout: cdk.Duration.minutes(10),
            credentials: {
                role: sfn.TaskRole.fromRoleArnJsonPath('$.Input.RoleArn'),
            },
        });
        // THEN
        expect(render_util_1.renderGraph(task)).toEqual({
            StartAt: 'my-exciting-task',
            States: {
                'my-exciting-task': {
                    End: true,
                    Type: 'Task',
                    Comment: 'my exciting task',
                    TimeoutSeconds: 600,
                    HeartbeatSeconds: 10,
                    Resource: 'my-resource',
                    Parameters: { MyParameter: 'myParameter' },
                    Credentials: { 'RoleArn.$': '$.Input.RoleArn' },
                },
            },
        });
    });
    test('instantiate a concrete implementation with resultSelector', () => {
        // WHEN
        task = new fake_task_1.FakeTask(stack, 'my-exciting-task', {
            resultSelector: {
                buz: 'buz',
                baz: sfn.JsonPath.stringAt('$.baz'),
            },
        });
        // THEN
        expect(render_util_1.renderGraph(task)).toEqual({
            StartAt: 'my-exciting-task',
            States: {
                'my-exciting-task': {
                    End: true,
                    Type: 'Task',
                    Resource: 'my-resource',
                    Parameters: { MyParameter: 'myParameter' },
                    ResultSelector: {
                        'buz': 'buz',
                        'baz.$': '$.baz',
                    },
                },
            },
        });
    });
    test('add catch configuration', () => {
        // GIVEN
        const failure = new sfn.Fail(stack, 'failed', {
            error: 'DidNotWork',
            cause: 'We got stuck',
        });
        // WHEN
        task.addCatch(failure);
        // THEN
        expect(render_util_1.renderGraph(task)).toEqual({
            StartAt: 'my-task',
            States: {
                'my-task': {
                    End: true,
                    Catch: [{
                            ErrorEquals: ['States.ALL'],
                            Next: 'failed',
                        }],
                    Type: 'Task',
                    Resource: 'my-resource',
                    Parameters: { MyParameter: 'myParameter' },
                },
                'failed': {
                    Type: 'Fail',
                    Error: 'DidNotWork',
                    Cause: 'We got stuck',
                },
            },
        });
    });
    test('States.ALL catch appears at end of list', () => {
        // GIVEN
        const httpFailure = new sfn.Fail(stack, 'http', { error: 'HTTP' });
        const otherFailure = new sfn.Fail(stack, 'other', { error: 'Other' });
        const allFailure = new sfn.Fail(stack, 'all');
        // WHEN
        task
            .addCatch(httpFailure, { errors: ['HTTPError'] })
            .addCatch(allFailure)
            .addCatch(otherFailure, { errors: ['OtherError'] });
        // THEN
        expect(render_util_1.renderGraph(task)).toEqual({
            StartAt: 'my-task',
            States: {
                'all': {
                    Type: 'Fail',
                },
                'http': {
                    Error: 'HTTP',
                    Type: 'Fail',
                },
                'my-task': {
                    End: true,
                    Catch: [
                        {
                            ErrorEquals: ['HTTPError'],
                            Next: 'http',
                        },
                        {
                            ErrorEquals: ['OtherError'],
                            Next: 'other',
                        },
                        {
                            ErrorEquals: ['States.ALL'],
                            Next: 'all',
                        },
                    ],
                    Type: 'Task',
                    Resource: 'my-resource',
                    Parameters: { MyParameter: 'myParameter' },
                },
                'other': {
                    Error: 'Other',
                    Type: 'Fail',
                },
            },
        });
    });
    test('addCatch throws when errors are combined with States.ALL', () => {
        // GIVEN
        const failure = new sfn.Fail(stack, 'failed', {
            error: 'DidNotWork',
            cause: 'We got stuck',
        });
        expect(() => task.addCatch(failure, {
            errors: ['States.ALL', 'HTTPError'],
        })).toThrow(/must appear alone/);
    });
    test('add retry configuration', () => {
        // WHEN
        task.addRetry({ errors: ['HTTPError'], maxAttempts: 2 })
            .addRetry(); // adds default retry
        // THEN
        expect(render_util_1.renderGraph(task)).toEqual({
            StartAt: 'my-task',
            States: {
                'my-task': {
                    End: true,
                    Retry: [
                        {
                            ErrorEquals: ['HTTPError'],
                            MaxAttempts: 2,
                        },
                        {
                            ErrorEquals: ['States.ALL'],
                        },
                    ],
                    Type: 'Task',
                    Resource: 'my-resource',
                    Parameters: { MyParameter: 'myParameter' },
                },
            },
        });
    });
    test('States.ALL retry appears at end of list', () => {
        // WHEN
        task
            .addRetry({ errors: ['HTTPError'] })
            .addRetry()
            .addRetry({ errors: ['OtherError'] });
        // THEN
        expect(render_util_1.renderGraph(task)).toEqual({
            StartAt: 'my-task',
            States: {
                'my-task': {
                    End: true,
                    Retry: [
                        {
                            ErrorEquals: ['HTTPError'],
                        },
                        {
                            ErrorEquals: ['OtherError'],
                        },
                        {
                            ErrorEquals: ['States.ALL'],
                        },
                    ],
                    Type: 'Task',
                    Resource: 'my-resource',
                    Parameters: { MyParameter: 'myParameter' },
                },
            },
        });
    });
    test('addRetry throws when errors are combined with States.ALL', () => {
        expect(() => task.addRetry({
            errors: ['States.ALL', 'HTTPError'],
        })).toThrow(/must appear alone/);
    });
    test('add a next state to the task in the chain', () => {
        // WHEN
        task.next(new sfn.Pass(stack, 'passState'));
        // THEN
        expect(render_util_1.renderGraph(task)).toEqual({
            StartAt: 'my-task',
            States: {
                'my-task': {
                    Next: 'passState',
                    Type: 'Task',
                    Resource: 'my-resource',
                    Parameters: { MyParameter: 'myParameter' },
                },
                'passState': { Type: 'Pass', End: true },
            },
        });
    });
    test('get named metric for this task', () => {
        // WHEN
        const metric = task.metric('my-metric');
        // THEN
        verifyMetric(metric, 'my-metric', 'Sum');
    });
    test('add metric for task state run time', () => {
        // WHEN
        const metric = task.metricRunTime();
        // THEN
        verifyMetric(metric, 'RunTime', 'Average');
    });
    test('add metric for task schedule time', () => {
        // WHEN
        const metric = task.metricScheduleTime();
        // THEN
        verifyMetric(metric, 'ScheduleTime', 'Average');
    });
    test('add metric for time between task being scheduled to closing', () => {
        // WHEN
        const metric = task.metricTime();
        // THEN
        verifyMetric(metric, 'Time', 'Average');
    });
    test('add metric for number of times the task is scheduled', () => {
        // WHEN
        const metric = task.metricScheduled();
        // THEN
        verifyMetric(metric, 'Scheduled', 'Sum');
    });
    test('add metric for number of times the task times out', () => {
        // WHEN
        const metric = task.metricTimedOut();
        // THEN
        verifyMetric(metric, 'TimedOut', 'Sum');
    });
    test('add metric for number of times the task was started', () => {
        // WHEN
        const metric = task.metricStarted();
        // THEN
        verifyMetric(metric, 'Started', 'Sum');
    });
    test('add metric for number of times the task succeeded', () => {
        // WHEN
        const metric = task.metricSucceeded();
        // THEN
        verifyMetric(metric, 'Succeeded', 'Sum');
    });
    test('add metric for number of times the task failed', () => {
        // WHEN
        const metric = task.metricFailed();
        // THEN
        verifyMetric(metric, 'Failed', 'Sum');
    });
    test('add metric for number of times the metrics heartbeat timed out', () => {
        // WHEN
        const metric = task.metricHeartbeatTimedOut();
        // THEN
        verifyMetric(metric, 'HeartbeatTimedOut', 'Sum');
    });
    test('metrics must be configured to use metric* APIs', () => {
        // GIVEN
        task = new fake_task_1.FakeTask(stack, 'mytask', {});
        // THEN
        expect(() => {
            task.metricFailed();
        }).toThrow('Task does not expose metrics. Use the \'metric()\' function to add metrics.');
        expect(() => {
            task.metricHeartbeatTimedOut();
        }).toThrow('Task does not expose metrics. Use the \'metric()\' function to add metrics.');
        expect(() => {
            task.metricRunTime();
        }).toThrow('Task does not expose metrics. Use the \'metric()\' function to add metrics.');
        expect(() => {
            task.metricScheduleTime();
        }).toThrow('Task does not expose metrics. Use the \'metric()\' function to add metrics.');
        expect(() => {
            task.metricScheduled();
        }).toThrow('Task does not expose metrics. Use the \'metric()\' function to add metrics.');
        expect(() => {
            task.metricStarted();
        }).toThrow('Task does not expose metrics. Use the \'metric()\' function to add metrics.');
        expect(() => {
            task.metricSucceeded();
        }).toThrow('Task does not expose metrics. Use the \'metric()\' function to add metrics.');
        expect(() => {
            task.metricTime();
        }).toThrow('Task does not expose metrics. Use the \'metric()\' function to add metrics.');
        expect(() => {
            task.metricTimedOut();
        }).toThrow('Task does not expose metrics. Use the \'metric()\' function to add metrics.');
    });
});
function verifyMetric(metric, metricName, statistic) {
    expect(metric).toEqual(expect.objectContaining({
        namespace: 'AWS/States',
        metricName,
        statistic,
    }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay1iYXNlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0YXNrLWJhc2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFDckMsOEJBQThCO0FBQzlCLG1EQUErQztBQUMvQyx1REFBb0Q7QUFFcEQsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7SUFDekIsSUFBSSxLQUFnQixDQUFDO0lBQ3JCLElBQUksSUFBdUIsQ0FBQztJQUU1QixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsUUFBUTtRQUNSLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN4QixJQUFJLEdBQUcsSUFBSSxvQkFBUSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDcEMsT0FBTyxFQUFFO2dCQUNQLGtCQUFrQixFQUFFLEVBQUU7Z0JBQ3RCLG9CQUFvQixFQUFFLEVBQUU7YUFDekI7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUNILElBQUksQ0FBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUU7UUFDakUsT0FBTztRQUNQLElBQUksR0FBRyxJQUFJLG9CQUFRLENBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFFO1lBQzdDLE9BQU8sRUFBRSxrQkFBa0I7WUFDM0IsU0FBUyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUNuQyxPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1NBQ2xDLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxNQUFNLENBQUMseUJBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUNoQyxPQUFPLEVBQUUsa0JBQWtCO1lBQzNCLE1BQU0sRUFBRTtnQkFDTixrQkFBa0IsRUFBRTtvQkFDbEIsR0FBRyxFQUFFLElBQUk7b0JBQ1QsSUFB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LDZFQUE2RSxDQUM5RSxDQUFDO1FBRUYsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQ1IsNkVBQTZFLENBQzlFLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsU0FBUyxZQUFZLENBQUMsTUFBYyxFQUFFLFVBQWtCLEVBQUUsU0FBaUI7SUFDekUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7UUFDN0MsU0FBUyxFQUFFLFlBQVk7UUFDdkIsVUFBVTtRQUNWLFNBQVM7S0FDVixDQUFDLENBQUMsQ0FBQztBQUNOLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNZXRyaWMgfSBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWR3YXRjaCc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBzZm4gZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IEZha2VUYXNrIH0gZnJvbSAnLi9wcml2YXRlL2Zha2UtdGFzayc7XG5pbXBvcnQgeyByZW5kZXJHcmFwaCB9IGZyb20gJy4vcHJpdmF0ZS9yZW5kZXItdXRpbCc7XG5cbmRlc2NyaWJlKCdUYXNrIGJhc2UnLCAoKSA9PiB7XG4gIGxldCBzdGFjazogY2RrLlN0YWNrO1xuICBsZXQgdGFzazogc2ZuLlRhc2tTdGF0ZUJhc2U7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICB0YXNrID0gbmV3IEZha2VUYXNrKHN0YWNrLCAnbXktdGFzaycsIHtcbiAgICAgIG1ldHJpY3M6IHtcbiAgICAgICAgbWV0cmljUHJlZml4UGx1cmFsOiAnJyxcbiAgICAgICAgbWV0cmljUHJlZml4U2luZ3VsYXI6ICcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG4gIHRlc3QoJ2luc3RhbnRpYXRlIGEgY29uY3JldGUgaW1wbGVtZW50YXRpb24gd2l0aCBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICB0YXNrID0gbmV3IEZha2VUYXNrKHN0YWNrLCAnbXktZXhjaXRpbmctdGFzaycsIHtcbiAgICAgIGNvbW1lbnQ6ICdteSBleGNpdGluZyB0YXNrJyxcbiAgICAgIGhlYXJ0YmVhdDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMTApLFxuICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMTApLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZW5kZXJHcmFwaCh0YXNrKSkudG9FcXVhbCh7XG4gICAgICBTdGFydEF0OiAnbXktZXhjaXRpbmctdGFzaycsXG4gICAgICBTdGF0ZXM6IHtcbiAgICAgICAgJ215LWV4Y2l0aW5nLXRhc2snOiB7XG4gICAgICAgICAgRW5kOiB0cnVlLFxuICAgICAgICAgIFR5cGU6ICdUYXNrJyxcbiAgICAgICAgICBDb21tZW50OiAnbXkgZXhjaXRpbmcgdGFzaycsXG4gICAgICAgICAgVGltZW91dFNlY29uZHM6IDYwMCxcbiAgICAgICAgICBIZWFydGJlYXRTZWNvbmRzOiAxMCxcbiAgICAgICAgICBSZXNvdXJjZTogJ215LXJlc291cmNlJyxcbiAgICAgICAgICBQYXJhbWV0ZXJzOiB7IE15UGFyYW1ldGVyOiAnbXlQYXJhbWV0ZXInIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpbnN0YW50aWF0ZSBhIGNvbmNyZXRlIGltcGxlbWVudGF0aW9uIHdpdGggY3JlZGVudGlhbHMgb2YgYSBzcGVjaWZpZWQgcm9sZScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgcm9sZSA9IGlhbS5Sb2xlLmZyb21Sb2xlQXJuKHN0YWNrLCAnUm9sZScsICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvZXhhbXBsZS1yb2xlJyk7XG4gICAgdGFzayA9IG5ldyBGYWtlVGFzayhzdGFjaywgJ215LWV4Y2l0aW5nLXRhc2snLCB7XG4gICAgICBjb21tZW50OiAnbXkgZXhjaXRpbmcgdGFzaycsXG4gICAgICBoZWFydGJlYXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDEwKSxcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5taW51dGVzKDEwKSxcbiAgICAgIGNyZWRlbnRpYWxzOiB7XG4gICAgICAgIHJvbGU6IHNmbi5UYXNrUm9sZS5mcm9tUm9sZShyb2xlKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlckdyYXBoKHRhc2spKS50b0VxdWFsKHtcbiAgICAgIFN0YXJ0QXQ6ICdteS1leGNpdGluZy10YXNrJyxcbiAgICAgIFN0YXRlczoge1xuICAgICAgICAnbXktZXhjaXRpbmctdGFzayc6IHtcbiAgICAgICAgICBFbmQ6IHRydWUsXG4gICAgICAgICAgVHlwZTogJ1Rhc2snLFxuICAgICAgICAgIENvbW1lbnQ6ICdteSBleGNpdGluZyB0YXNrJyxcbiAgICAgICAgICBUaW1lb3V0U2Vjb25kczogNjAwLFxuICAgICAgICAgIEhlYXJ0YmVhdFNlY29uZHM6IDEwLFxuICAgICAgICAgIFJlc291cmNlOiAnbXktcmVzb3VyY2UnLFxuICAgICAgICAgIFBhcmFtZXRlcnM6IHsgTXlQYXJhbWV0ZXI6ICdteVBhcmFtZXRlcicgfSxcbiAgICAgICAgICBDcmVkZW50aWFsczogeyBSb2xlQXJuOiAnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL2V4YW1wbGUtcm9sZScgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2luc3RhbnRpYXRlIGEgY29uY3JldGUgaW1wbGVtZW50YXRpb24gd2l0aCBjcmVkZW50aWFscyBvZiBqc29uIGV4cHJlc3Npb24gcm9sZUFybicsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgdGFzayA9IG5ldyBGYWtlVGFzayhzdGFjaywgJ215LWV4Y2l0aW5nLXRhc2snLCB7XG4gICAgICBjb21tZW50OiAnbXkgZXhjaXRpbmcgdGFzaycsXG4gICAgICBoZWFydGJlYXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDEwKSxcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5taW51dGVzKDEwKSxcbiAgICAgIGNyZWRlbnRpYWxzOiB7XG4gICAgICAgIHJvbGU6IHNmbi5UYXNrUm9sZS5mcm9tUm9sZUFybkpzb25QYXRoKCckLklucHV0LlJvbGVBcm4nKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlckdyYXBoKHRhc2spKS50b0VxdWFsKHtcbiAgICAgIFN0YXJ0QXQ6ICdteS1leGNpdGluZy10YXNrJyxcbiAgICAgIFN0YXRlczoge1xuICAgICAgICAnbXktZXhjaXRpbmctdGFzayc6IHtcbiAgICAgICAgICBFbmQ6IHRydWUsXG4gICAgICAgICAgVHlwZTogJ1Rhc2snLFxuICAgICAgICAgIENvbW1lbnQ6ICdteSBleGNpdGluZyB0YXNrJyxcbiAgICAgICAgICBUaW1lb3V0U2Vjb25kczogNjAwLFxuICAgICAgICAgIEhlYXJ0YmVhdFNlY29uZHM6IDEwLFxuICAgICAgICAgIFJlc291cmNlOiAnbXktcmVzb3VyY2UnLFxuICAgICAgICAgIFBhcmFtZXRlcnM6IHsgTXlQYXJhbWV0ZXI6ICdteVBhcmFtZXRlcicgfSxcbiAgICAgICAgICBDcmVkZW50aWFsczogeyAnUm9sZUFybi4kJzogJyQuSW5wdXQuUm9sZUFybicgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2luc3RhbnRpYXRlIGEgY29uY3JldGUgaW1wbGVtZW50YXRpb24gd2l0aCByZXN1bHRTZWxlY3RvcicsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgdGFzayA9IG5ldyBGYWtlVGFzayhzdGFjaywgJ215LWV4Y2l0aW5nLXRhc2snLCB7XG4gICAgICByZXN1bHRTZWxlY3Rvcjoge1xuICAgICAgICBidXo6ICdidXonLFxuICAgICAgICBiYXo6IHNmbi5Kc29uUGF0aC5zdHJpbmdBdCgnJC5iYXonKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlckdyYXBoKHRhc2spKS50b0VxdWFsKHtcbiAgICAgIFN0YXJ0QXQ6ICdteS1leGNpdGluZy10YXNrJyxcbiAgICAgIFN0YXRlczoge1xuICAgICAgICAnbXktZXhjaXRpbmctdGFzayc6IHtcbiAgICAgICAgICBFbmQ6IHRydWUsXG4gICAgICAgICAgVHlwZTogJ1Rhc2snLFxuICAgICAgICAgIFJlc291cmNlOiAnbXktcmVzb3VyY2UnLFxuICAgICAgICAgIFBhcmFtZXRlcnM6IHsgTXlQYXJhbWV0ZXI6ICdteVBhcmFtZXRlcicgfSxcbiAgICAgICAgICBSZXN1bHRTZWxlY3Rvcjoge1xuICAgICAgICAgICAgJ2J1eic6ICdidXonLFxuICAgICAgICAgICAgJ2Jhei4kJzogJyQuYmF6JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkIGNhdGNoIGNvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBmYWlsdXJlID0gbmV3IHNmbi5GYWlsKHN0YWNrLCAnZmFpbGVkJywge1xuICAgICAgZXJyb3I6ICdEaWROb3RXb3JrJyxcbiAgICAgIGNhdXNlOiAnV2UgZ290IHN0dWNrJyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICB0YXNrLmFkZENhdGNoKGZhaWx1cmUpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZW5kZXJHcmFwaCh0YXNrKSkudG9FcXVhbCh7XG4gICAgICBTdGFydEF0OiAnbXktdGFzaycsXG4gICAgICBTdGF0ZXM6IHtcbiAgICAgICAgJ215LXRhc2snOiB7XG4gICAgICAgICAgRW5kOiB0cnVlLFxuICAgICAgICAgIENhdGNoOiBbe1xuICAgICAgICAgICAgRXJyb3JFcXVhbHM6IFsnU3RhdGVzLkFMTCddLFxuICAgICAgICAgICAgTmV4dDogJ2ZhaWxlZCcsXG4gICAgICAgICAgfV0sXG4gICAgICAgICAgVHlwZTogJ1Rhc2snLFxuICAgICAgICAgIFJlc291cmNlOiAnbXktcmVzb3VyY2UnLFxuICAgICAgICAgIFBhcmFtZXRlcnM6IHsgTXlQYXJhbWV0ZXI6ICdteVBhcmFtZXRlcicgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ2ZhaWxlZCc6IHtcbiAgICAgICAgICBUeXBlOiAnRmFpbCcsXG4gICAgICAgICAgRXJyb3I6ICdEaWROb3RXb3JrJyxcbiAgICAgICAgICBDYXVzZTogJ1dlIGdvdCBzdHVjaycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdTdGF0ZXMuQUxMIGNhdGNoIGFwcGVhcnMgYXQgZW5kIG9mIGxpc3QnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBodHRwRmFpbHVyZSA9IG5ldyBzZm4uRmFpbChzdGFjaywgJ2h0dHAnLCB7IGVycm9yOiAnSFRUUCcgfSk7XG4gICAgY29uc3Qgb3RoZXJGYWlsdXJlID0gbmV3IHNmbi5GYWlsKHN0YWNrLCAnb3RoZXInLCB7IGVycm9yOiAnT3RoZXInIH0pO1xuICAgIGNvbnN0IGFsbEZhaWx1cmUgPSBuZXcgc2ZuLkZhaWwoc3RhY2ssICdhbGwnKTtcblxuICAgIC8vIFdIRU5cbiAgICB0YXNrXG4gICAgICAuYWRkQ2F0Y2goaHR0cEZhaWx1cmUsIHsgZXJyb3JzOiBbJ0hUVFBFcnJvciddIH0pXG4gICAgICAuYWRkQ2F0Y2goYWxsRmFpbHVyZSlcbiAgICAgIC5hZGRDYXRjaChvdGhlckZhaWx1cmUsIHsgZXJyb3JzOiBbJ090aGVyRXJyb3InXSB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVuZGVyR3JhcGgodGFzaykpLnRvRXF1YWwoe1xuICAgICAgU3RhcnRBdDogJ215LXRhc2snLFxuICAgICAgU3RhdGVzOiB7XG4gICAgICAgICdhbGwnOiB7XG4gICAgICAgICAgVHlwZTogJ0ZhaWwnLFxuICAgICAgICB9LFxuICAgICAgICAnaHR0cCc6IHtcbiAgICAgICAgICBFcnJvcjogJ0hUVFAnLFxuICAgICAgICAgIFR5cGU6ICdGYWlsJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ215LXRhc2snOiB7XG4gICAgICAgICAgRW5kOiB0cnVlLFxuICAgICAgICAgIENhdGNoOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEVycm9yRXF1YWxzOiBbJ0hUVFBFcnJvciddLFxuICAgICAgICAgICAgICBOZXh0OiAnaHR0cCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBFcnJvckVxdWFsczogWydPdGhlckVycm9yJ10sXG4gICAgICAgICAgICAgIE5leHQ6ICdvdGhlcicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBFcnJvckVxdWFsczogWydTdGF0ZXMuQUxMJ10sXG4gICAgICAgICAgICAgIE5leHQ6ICdhbGwnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFR5cGU6ICdUYXNrJyxcbiAgICAgICAgICBSZXNvdXJjZTogJ215LXJlc291cmNlJyxcbiAgICAgICAgICBQYXJhbWV0ZXJzOiB7IE15UGFyYW1ldGVyOiAnbXlQYXJhbWV0ZXInIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdvdGhlcic6IHtcbiAgICAgICAgICBFcnJvcjogJ090aGVyJyxcbiAgICAgICAgICBUeXBlOiAnRmFpbCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhZGRDYXRjaCB0aHJvd3Mgd2hlbiBlcnJvcnMgYXJlIGNvbWJpbmVkIHdpdGggU3RhdGVzLkFMTCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGZhaWx1cmUgPSBuZXcgc2ZuLkZhaWwoc3RhY2ssICdmYWlsZWQnLCB7XG4gICAgICBlcnJvcjogJ0RpZE5vdFdvcmsnLFxuICAgICAgY2F1c2U6ICdXZSBnb3Qgc3R1Y2snLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IHRhc2suYWRkQ2F0Y2goZmFpbHVyZSwge1xuICAgICAgZXJyb3JzOiBbJ1N0YXRlcy5BTEwnLCAnSFRUUEVycm9yJ10sXG4gICAgfSkpLnRvVGhyb3coL211c3QgYXBwZWFyIGFsb25lLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCByZXRyeSBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICB0YXNrLmFkZFJldHJ5KHsgZXJyb3JzOiBbJ0hUVFBFcnJvciddLCBtYXhBdHRlbXB0czogMiB9KVxuICAgICAgLmFkZFJldHJ5KCk7IC8vIGFkZHMgZGVmYXVsdCByZXRyeVxuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZW5kZXJHcmFwaCh0YXNrKSkudG9FcXVhbCh7XG4gICAgICBTdGFydEF0OiAnbXktdGFzaycsXG4gICAgICBTdGF0ZXM6IHtcbiAgICAgICAgJ215LXRhc2snOiB7XG4gICAgICAgICAgRW5kOiB0cnVlLFxuICAgICAgICAgIFJldHJ5OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEVycm9yRXF1YWxzOiBbJ0hUVFBFcnJvciddLFxuICAgICAgICAgICAgICBNYXhBdHRlbXB0czogMixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEVycm9yRXF1YWxzOiBbJ1N0YXRlcy5BTEwnXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBUeXBlOiAnVGFzaycsXG4gICAgICAgICAgUmVzb3VyY2U6ICdteS1yZXNvdXJjZScsXG4gICAgICAgICAgUGFyYW1ldGVyczogeyBNeVBhcmFtZXRlcjogJ215UGFyYW1ldGVyJyB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnU3RhdGVzLkFMTCByZXRyeSBhcHBlYXJzIGF0IGVuZCBvZiBsaXN0JywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICB0YXNrXG4gICAgICAuYWRkUmV0cnkoeyBlcnJvcnM6IFsnSFRUUEVycm9yJ10gfSlcbiAgICAgIC5hZGRSZXRyeSgpXG4gICAgICAuYWRkUmV0cnkoeyBlcnJvcnM6IFsnT3RoZXJFcnJvciddIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZW5kZXJHcmFwaCh0YXNrKSkudG9FcXVhbCh7XG4gICAgICBTdGFydEF0OiAnbXktdGFzaycsXG4gICAgICBTdGF0ZXM6IHtcbiAgICAgICAgJ215LXRhc2snOiB7XG4gICAgICAgICAgRW5kOiB0cnVlLFxuICAgICAgICAgIFJldHJ5OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEVycm9yRXF1YWxzOiBbJ0hUVFBFcnJvciddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgRXJyb3JFcXVhbHM6IFsnT3RoZXJFcnJvciddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgRXJyb3JFcXVhbHM6IFsnU3RhdGVzLkFMTCddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFR5cGU6ICdUYXNrJyxcbiAgICAgICAgICBSZXNvdXJjZTogJ215LXJlc291cmNlJyxcbiAgICAgICAgICBQYXJhbWV0ZXJzOiB7IE15UGFyYW1ldGVyOiAnbXlQYXJhbWV0ZXInIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhZGRSZXRyeSB0aHJvd3Mgd2hlbiBlcnJvcnMgYXJlIGNvbWJpbmVkIHdpdGggU3RhdGVzLkFMTCcsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4gdGFzay5hZGRSZXRyeSh7XG4gICAgICBlcnJvcnM6IFsnU3RhdGVzLkFMTCcsICdIVFRQRXJyb3InXSxcbiAgICB9KSkudG9UaHJvdygvbXVzdCBhcHBlYXIgYWxvbmUvKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkIGEgbmV4dCBzdGF0ZSB0byB0aGUgdGFzayBpbiB0aGUgY2hhaW4nLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIHRhc2submV4dChuZXcgc2ZuLlBhc3Moc3RhY2ssICdwYXNzU3RhdGUnKSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlckdyYXBoKHRhc2spKS50b0VxdWFsKHtcbiAgICAgIFN0YXJ0QXQ6ICdteS10YXNrJyxcbiAgICAgIFN0YXRlczoge1xuICAgICAgICAnbXktdGFzayc6IHtcbiAgICAgICAgICBOZXh0OiAncGFzc1N0YXRlJyxcbiAgICAgICAgICBUeXBlOiAnVGFzaycsXG4gICAgICAgICAgUmVzb3VyY2U6ICdteS1yZXNvdXJjZScsXG4gICAgICAgICAgUGFyYW1ldGVyczogeyBNeVBhcmFtZXRlcjogJ215UGFyYW1ldGVyJyB9LFxuICAgICAgICB9LFxuICAgICAgICAncGFzc1N0YXRlJzogeyBUeXBlOiAnUGFzcycsIEVuZDogdHJ1ZSB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZ2V0IG5hbWVkIG1ldHJpYyBmb3IgdGhpcyB0YXNrJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBtZXRyaWMgPSB0YXNrLm1ldHJpYygnbXktbWV0cmljJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgdmVyaWZ5TWV0cmljKG1ldHJpYywgJ215LW1ldHJpYycsICdTdW0nKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkIG1ldHJpYyBmb3IgdGFzayBzdGF0ZSBydW4gdGltZScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbWV0cmljID0gdGFzay5tZXRyaWNSdW5UaW1lKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgdmVyaWZ5TWV0cmljKG1ldHJpYywgJ1J1blRpbWUnLCAnQXZlcmFnZScpO1xuICB9KTtcblxuICB0ZXN0KCdhZGQgbWV0cmljIGZvciB0YXNrIHNjaGVkdWxlIHRpbWUnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IG1ldHJpYyA9IHRhc2subWV0cmljU2NoZWR1bGVUaW1lKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgdmVyaWZ5TWV0cmljKG1ldHJpYywgJ1NjaGVkdWxlVGltZScsICdBdmVyYWdlJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCBtZXRyaWMgZm9yIHRpbWUgYmV0d2VlbiB0YXNrIGJlaW5nIHNjaGVkdWxlZCB0byBjbG9zaW5nJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBtZXRyaWMgPSB0YXNrLm1ldHJpY1RpbWUoKTtcblxuICAgIC8vIFRIRU5cbiAgICB2ZXJpZnlNZXRyaWMobWV0cmljLCAnVGltZScsICdBdmVyYWdlJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCBtZXRyaWMgZm9yIG51bWJlciBvZiB0aW1lcyB0aGUgdGFzayBpcyBzY2hlZHVsZWQnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IG1ldHJpYyA9IHRhc2subWV0cmljU2NoZWR1bGVkKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgdmVyaWZ5TWV0cmljKG1ldHJpYywgJ1NjaGVkdWxlZCcsICdTdW0nKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkIG1ldHJpYyBmb3IgbnVtYmVyIG9mIHRpbWVzIHRoZSB0YXNrIHRpbWVzIG91dCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbWV0cmljID0gdGFzay5tZXRyaWNUaW1lZE91dCgpO1xuXG4gICAgLy8gVEhFTlxuICAgIHZlcmlmeU1ldHJpYyhtZXRyaWMsICdUaW1lZE91dCcsICdTdW0nKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkIG1ldHJpYyBmb3IgbnVtYmVyIG9mIHRpbWVzIHRoZSB0YXNrIHdhcyBzdGFydGVkJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBtZXRyaWMgPSB0YXNrLm1ldHJpY1N0YXJ0ZWQoKTtcblxuICAgIC8vIFRIRU5cbiAgICB2ZXJpZnlNZXRyaWMobWV0cmljLCAnU3RhcnRlZCcsICdTdW0nKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkIG1ldHJpYyBmb3IgbnVtYmVyIG9mIHRpbWVzIHRoZSB0YXNrIHN1Y2NlZWRlZCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbWV0cmljID0gdGFzay5tZXRyaWNTdWNjZWVkZWQoKTtcblxuICAgIC8vIFRIRU5cbiAgICB2ZXJpZnlNZXRyaWMobWV0cmljLCAnU3VjY2VlZGVkJywgJ1N1bScpO1xuICB9KTtcblxuICB0ZXN0KCdhZGQgbWV0cmljIGZvciBudW1iZXIgb2YgdGltZXMgdGhlIHRhc2sgZmFpbGVkJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBtZXRyaWMgPSB0YXNrLm1ldHJpY0ZhaWxlZCgpO1xuXG4gICAgLy8gVEhFTlxuICAgIHZlcmlmeU1ldHJpYyhtZXRyaWMsICdGYWlsZWQnLCAnU3VtJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCBtZXRyaWMgZm9yIG51bWJlciBvZiB0aW1lcyB0aGUgbWV0cmljcyBoZWFydGJlYXQgdGltZWQgb3V0JywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBtZXRyaWMgPSB0YXNrLm1ldHJpY0hlYXJ0YmVhdFRpbWVkT3V0KCk7XG5cbiAgICAvLyBUSEVOXG4gICAgdmVyaWZ5TWV0cmljKG1ldHJpYywgJ0hlYXJ0YmVhdFRpbWVkT3V0JywgJ1N1bScpO1xuICB9KTtcblxuICB0ZXN0KCdtZXRyaWNzIG11c3QgYmUgY29uZmlndXJlZCB0byB1c2UgbWV0cmljKiBBUElzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgdGFzayA9IG5ldyBGYWtlVGFzayhzdGFjaywgJ215dGFzaycsIHt9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgdGFzay5tZXRyaWNGYWlsZWQoKTtcbiAgICB9KS50b1Rocm93KFxuICAgICAgJ1Rhc2sgZG9lcyBub3QgZXhwb3NlIG1ldHJpY3MuIFVzZSB0aGUgXFwnbWV0cmljKClcXCcgZnVuY3Rpb24gdG8gYWRkIG1ldHJpY3MuJyxcbiAgICApO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHRhc2subWV0cmljSGVhcnRiZWF0VGltZWRPdXQoKTtcbiAgICB9KS50b1Rocm93KFxuICAgICAgJ1Rhc2sgZG9lcyBub3QgZXhwb3NlIG1ldHJpY3MuIFVzZSB0aGUgXFwnbWV0cmljKClcXCcgZnVuY3Rpb24gdG8gYWRkIG1ldHJpY3MuJyxcbiAgICApO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHRhc2subWV0cmljUnVuVGltZSgpO1xuICAgIH0pLnRvVGhyb3coXG4gICAgICAnVGFzayBkb2VzIG5vdCBleHBvc2UgbWV0cmljcy4gVXNlIHRoZSBcXCdtZXRyaWMoKVxcJyBmdW5jdGlvbiB0byBhZGQgbWV0cmljcy4nLFxuICAgICk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgdGFzay5tZXRyaWNTY2hlZHVsZVRpbWUoKTtcbiAgICB9KS50b1Rocm93KFxuICAgICAgJ1Rhc2sgZG9lcyBub3QgZXhwb3NlIG1ldHJpY3MuIFVzZSB0aGUgXFwnbWV0cmljKClcXCcgZnVuY3Rpb24gdG8gYWRkIG1ldHJpY3MuJyxcbiAgICApO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHRhc2subWV0cmljU2NoZWR1bGVkKCk7XG4gICAgfSkudG9UaHJvdyhcbiAgICAgICdUYXNrIGRvZXMgbm90IGV4cG9zZSBtZXRyaWNzLiBVc2UgdGhlIFxcJ21ldHJpYygpXFwnIGZ1bmN0aW9uIHRvIGFkZCBtZXRyaWNzLicsXG4gICAgKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICB0YXNrLm1ldHJpY1N0YXJ0ZWQoKTtcbiAgICB9KS50b1Rocm93KFxuICAgICAgJ1Rhc2sgZG9lcyBub3QgZXhwb3NlIG1ldHJpY3MuIFVzZSB0aGUgXFwnbWV0cmljKClcXCcgZnVuY3Rpb24gdG8gYWRkIG1ldHJpY3MuJyxcbiAgICApO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHRhc2subWV0cmljU3VjY2VlZGVkKCk7XG4gICAgfSkudG9UaHJvdyhcbiAgICAgICdUYXNrIGRvZXMgbm90IGV4cG9zZSBtZXRyaWNzLiBVc2UgdGhlIFxcJ21ldHJpYygpXFwnIGZ1bmN0aW9uIHRvIGFkZCBtZXRyaWNzLicsXG4gICAgKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICB0YXNrLm1ldHJpY1RpbWUoKTtcbiAgICB9KS50b1Rocm93KFxuICAgICAgJ1Rhc2sgZG9lcyBub3QgZXhwb3NlIG1ldHJpY3MuIFVzZSB0aGUgXFwnbWV0cmljKClcXCcgZnVuY3Rpb24gdG8gYWRkIG1ldHJpY3MuJyxcbiAgICApO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHRhc2subWV0cmljVGltZWRPdXQoKTtcbiAgICB9KS50b1Rocm93KFxuICAgICAgJ1Rhc2sgZG9lcyBub3QgZXhwb3NlIG1ldHJpY3MuIFVzZSB0aGUgXFwnbWV0cmljKClcXCcgZnVuY3Rpb24gdG8gYWRkIG1ldHJpY3MuJyxcbiAgICApO1xuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiB2ZXJpZnlNZXRyaWMobWV0cmljOiBNZXRyaWMsIG1ldHJpY05hbWU6IHN0cmluZywgc3RhdGlzdGljOiBzdHJpbmcpIHtcbiAgZXhwZWN0KG1ldHJpYykudG9FcXVhbChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgbmFtZXNwYWNlOiAnQVdTL1N0YXRlcycsXG4gICAgbWV0cmljTmFtZSxcbiAgICBzdGF0aXN0aWMsXG4gIH0pKTtcbn1cbiJdfQ==