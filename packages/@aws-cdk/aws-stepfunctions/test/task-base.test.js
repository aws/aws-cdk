"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iam = require("@aws-cdk/aws-iam");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const fake_task_1 = require("./private/fake-task");
const render_util_1 = require("./private/render-util");
const sfn = require("../lib");
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
            heartbeatTimeout: sfn.Timeout.duration(cdk.Duration.seconds(10)),
            taskTimeout: sfn.Timeout.duration(cdk.Duration.minutes(10)),
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
            heartbeatTimeout: sfn.Timeout.duration(cdk.Duration.seconds(10)),
            taskTimeout: sfn.Timeout.duration(cdk.Duration.minutes(10)),
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
            heartbeatTimeout: sfn.Timeout.duration(cdk.Duration.seconds(10)),
            taskTimeout: sfn.Timeout.duration(cdk.Duration.minutes(10)),
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
    test('taskTimeout and heartbeatTimeout specified with a path', () => {
        // WHEN
        task = new fake_task_1.FakeTask(stack, 'my-exciting-task', {
            heartbeatTimeout: sfn.Timeout.at('$.heartbeat'),
            taskTimeout: sfn.Timeout.at('$.timeout'),
        });
        // THEN
        expect(render_util_1.renderGraph(task)).toEqual(expect.objectContaining({
            States: {
                'my-exciting-task': expect.objectContaining({
                    HeartbeatSecondsPath: '$.heartbeat',
                    TimeoutSecondsPath: '$.timeout',
                }),
            },
        }));
    });
    cdk_build_tools_1.testDeprecated('deprecated props timeout and heartbeat still work', () => {
        // WHEN
        task = new fake_task_1.FakeTask(stack, 'my-exciting-task', {
            heartbeat: cdk.Duration.seconds(10),
            timeout: cdk.Duration.minutes(10),
        });
        // THEN
        expect(render_util_1.renderGraph(task)).toEqual(expect.objectContaining({
            States: {
                'my-exciting-task': expect.objectContaining({
                    HeartbeatSeconds: 10,
                    TimeoutSeconds: 600,
                }),
            },
        }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay1iYXNlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0YXNrLWJhc2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHdDQUF3QztBQUN4Qyw4REFBMEQ7QUFDMUQscUNBQXFDO0FBQ3JDLG1EQUErQztBQUMvQyx1REFBb0Q7QUFDcEQsOEJBQThCO0FBRTlCLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO0lBQ3pCLElBQUksS0FBZ0IsQ0FBQztJQUNyQixJQUFJLElBQXVCLENBQUM7SUFFNUIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLFFBQVE7UUFDUixLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDeEIsSUFBSSxHQUFHLElBQUksb0JBQVEsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ3BDLE9BQU8sRUFBRTtnQkFDUCxrQkFBa0IsRUFBRSxFQUFFO2dCQUN0QixvQkFBb0IsRUFBRSxFQUFFO2FBQ3pCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFJLENBQUMsdURBQXVELEVBQUUsR0FBRyxFQUFFO1FBQ2pFLE9BQU87UUFDUCxJQUFJLEdBQUcsSUFBSSxvQkFBUSxDQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBRTtZQUM3QyxPQUFPLEVBQUUsa0JBQWtCO1lBQzNCLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hFLFdBQVcsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUM1RCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLHlCQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFD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QU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdkIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUNSLDZFQUE2RSxDQUM5RSxDQUFDO1FBRUYsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN6QixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQ1IsNkVBQTZFLENBQzlFLENBQUM7UUFFRixNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1YsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FDUiw2RUFBNkUsQ0FDOUUsQ0FBQztRQUVGLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUNSLDZFQUE2RSxDQUM5RSxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILFNBQVMsWUFBWSxDQUFDLE1BQWMsRUFBRSxVQUFrQixFQUFFLFNBQWlCO0lBQ3pFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDO1FBQzdDLFNBQVMsRUFBRSxZQUFZO1FBQ3ZCLFVBQVU7UUFDVixTQUFTO0tBQ1YsQ0FBQyxDQUFDLENBQUM7QUFDTixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWV0cmljIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgdGVzdERlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgRmFrZVRhc2sgfSBmcm9tICcuL3ByaXZhdGUvZmFrZS10YXNrJztcbmltcG9ydCB7IHJlbmRlckdyYXBoIH0gZnJvbSAnLi9wcml2YXRlL3JlbmRlci11dGlsJztcbmltcG9ydCAqIGFzIHNmbiBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnVGFzayBiYXNlJywgKCkgPT4ge1xuICBsZXQgc3RhY2s6IGNkay5TdGFjaztcbiAgbGV0IHRhc2s6IHNmbi5UYXNrU3RhdGVCYXNlO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgdGFzayA9IG5ldyBGYWtlVGFzayhzdGFjaywgJ215LXRhc2snLCB7XG4gICAgICBtZXRyaWNzOiB7XG4gICAgICAgIG1ldHJpY1ByZWZpeFBsdXJhbDogJycsXG4gICAgICAgIG1ldHJpY1ByZWZpeFNpbmd1bGFyOiAnJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuICB0ZXN0KCdpbnN0YW50aWF0ZSBhIGNvbmNyZXRlIGltcGxlbWVudGF0aW9uIHdpdGggcHJvcGVydGllcycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgdGFzayA9IG5ldyBGYWtlVGFzayhzdGFjaywgJ215LWV4Y2l0aW5nLXRhc2snLCB7XG4gICAgICBjb21tZW50OiAnbXkgZXhjaXRpbmcgdGFzaycsXG4gICAgICBoZWFydGJlYXRUaW1lb3V0OiBzZm4uVGltZW91dC5kdXJhdGlvbihjZGsuRHVyYXRpb24uc2Vjb25kcygxMCkpLFxuICAgICAgdGFza1RpbWVvdXQ6IHNmbi5UaW1lb3V0LmR1cmF0aW9uKGNkay5EdXJhdGlvbi5taW51dGVzKDEwKSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlckdyYXBoKHRhc2spKS50b0VxdWFsKHtcbiAgICAgIFN0YXJ0QXQ6ICdteS1leGNpdGluZy10YXNrJyxcbiAgICAgIFN0YXRlczoge1xuICAgICAgICAnbXktZXhjaXRpbmctdGFzayc6IHtcbiAgICAgICAgICBFbmQ6IHRydWUsXG4gICAgICAgICAgVHlwZTogJ1Rhc2snLFxuICAgICAgICAgIENvbW1lbnQ6ICdteSBleGNpdGluZyB0YXNrJyxcbiAgICAgICAgICBUaW1lb3V0U2Vjb25kczogNjAwLFxuICAgICAgICAgIEhlYXJ0YmVhdFNlY29uZHM6IDEwLFxuICAgICAgICAgIFJlc291cmNlOiAnbXktcmVzb3VyY2UnLFxuICAgICAgICAgIFBhcmFtZXRlcnM6IHsgTXlQYXJhbWV0ZXI6ICdteVBhcmFtZXRlcicgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2luc3RhbnRpYXRlIGEgY29uY3JldGUgaW1wbGVtZW50YXRpb24gd2l0aCBjcmVkZW50aWFscyBvZiBhIHNwZWNpZmllZCByb2xlJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCByb2xlID0gaWFtLlJvbGUuZnJvbVJvbGVBcm4oc3RhY2ssICdSb2xlJywgJ2Fybjphd3M6aWFtOjoxMjM0NTY3ODkwMTI6cm9sZS9leGFtcGxlLXJvbGUnKTtcbiAgICB0YXNrID0gbmV3IEZha2VUYXNrKHN0YWNrLCAnbXktZXhjaXRpbmctdGFzaycsIHtcbiAgICAgIGNvbW1lbnQ6ICdteSBleGNpdGluZyB0YXNrJyxcbiAgICAgIGhlYXJ0YmVhdFRpbWVvdXQ6IHNmbi5UaW1lb3V0LmR1cmF0aW9uKGNkay5EdXJhdGlvbi5zZWNvbmRzKDEwKSksXG4gICAgICB0YXNrVGltZW91dDogc2ZuLlRpbWVvdXQuZHVyYXRpb24oY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMTApKSxcbiAgICAgIGNyZWRlbnRpYWxzOiB7XG4gICAgICAgIHJvbGU6IHNmbi5UYXNrUm9sZS5mcm9tUm9sZShyb2xlKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlckdyYXBoKHRhc2spKS50b0VxdWFsKHtcbiAgICAgIFN0YXJ0QXQ6ICdteS1leGNpdGluZy10YXNrJyxcbiAgICAgIFN0YXRlczoge1xuICAgICAgICAnbXktZXhjaXRpbmctdGFzayc6IHtcbiAgICAgICAgICBFbmQ6IHRydWUsXG4gICAgICAgICAgVHlwZTogJ1Rhc2snLFxuICAgICAgICAgIENvbW1lbnQ6ICdteSBleGNpdGluZyB0YXNrJyxcbiAgICAgICAgICBUaW1lb3V0U2Vjb25kczogNjAwLFxuICAgICAgICAgIEhlYXJ0YmVhdFNlY29uZHM6IDEwLFxuICAgICAgICAgIFJlc291cmNlOiAnbXktcmVzb3VyY2UnLFxuICAgICAgICAgIFBhcmFtZXRlcnM6IHsgTXlQYXJhbWV0ZXI6ICdteVBhcmFtZXRlcicgfSxcbiAgICAgICAgICBDcmVkZW50aWFsczogeyBSb2xlQXJuOiAnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL2V4YW1wbGUtcm9sZScgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2luc3RhbnRpYXRlIGEgY29uY3JldGUgaW1wbGVtZW50YXRpb24gd2l0aCBjcmVkZW50aWFscyBvZiBqc29uIGV4cHJlc3Npb24gcm9sZUFybicsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgdGFzayA9IG5ldyBGYWtlVGFzayhzdGFjaywgJ215LWV4Y2l0aW5nLXRhc2snLCB7XG4gICAgICBjb21tZW50OiAnbXkgZXhjaXRpbmcgdGFzaycsXG4gICAgICBoZWFydGJlYXRUaW1lb3V0OiBzZm4uVGltZW91dC5kdXJhdGlvbihjZGsuRHVyYXRpb24uc2Vjb25kcygxMCkpLFxuICAgICAgdGFza1RpbWVvdXQ6IHNmbi5UaW1lb3V0LmR1cmF0aW9uKGNkay5EdXJhdGlvbi5taW51dGVzKDEwKSksXG4gICAgICBjcmVkZW50aWFsczoge1xuICAgICAgICByb2xlOiBzZm4uVGFza1JvbGUuZnJvbVJvbGVBcm5Kc29uUGF0aCgnJC5JbnB1dC5Sb2xlQXJuJyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZW5kZXJHcmFwaCh0YXNrKSkudG9FcXVhbCh7XG4gICAgICBTdGFydEF0OiAnbXktZXhjaXRpbmctdGFzaycsXG4gICAgICBTdGF0ZXM6IHtcbiAgICAgICAgJ215LWV4Y2l0aW5nLXRhc2snOiB7XG4gICAgICAgICAgRW5kOiB0cnVlLFxuICAgICAgICAgIFR5cGU6ICdUYXNrJyxcbiAgICAgICAgICBDb21tZW50OiAnbXkgZXhjaXRpbmcgdGFzaycsXG4gICAgICAgICAgVGltZW91dFNlY29uZHM6IDYwMCxcbiAgICAgICAgICBIZWFydGJlYXRTZWNvbmRzOiAxMCxcbiAgICAgICAgICBSZXNvdXJjZTogJ215LXJlc291cmNlJyxcbiAgICAgICAgICBQYXJhbWV0ZXJzOiB7IE15UGFyYW1ldGVyOiAnbXlQYXJhbWV0ZXInIH0sXG4gICAgICAgICAgQ3JlZGVudGlhbHM6IHsgJ1JvbGVBcm4uJCc6ICckLklucHV0LlJvbGVBcm4nIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpbnN0YW50aWF0ZSBhIGNvbmNyZXRlIGltcGxlbWVudGF0aW9uIHdpdGggcmVzdWx0U2VsZWN0b3InLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIHRhc2sgPSBuZXcgRmFrZVRhc2soc3RhY2ssICdteS1leGNpdGluZy10YXNrJywge1xuICAgICAgcmVzdWx0U2VsZWN0b3I6IHtcbiAgICAgICAgYnV6OiAnYnV6JyxcbiAgICAgICAgYmF6OiBzZm4uSnNvblBhdGguc3RyaW5nQXQoJyQuYmF6JyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZW5kZXJHcmFwaCh0YXNrKSkudG9FcXVhbCh7XG4gICAgICBTdGFydEF0OiAnbXktZXhjaXRpbmctdGFzaycsXG4gICAgICBTdGF0ZXM6IHtcbiAgICAgICAgJ215LWV4Y2l0aW5nLXRhc2snOiB7XG4gICAgICAgICAgRW5kOiB0cnVlLFxuICAgICAgICAgIFR5cGU6ICdUYXNrJyxcbiAgICAgICAgICBSZXNvdXJjZTogJ215LXJlc291cmNlJyxcbiAgICAgICAgICBQYXJhbWV0ZXJzOiB7IE15UGFyYW1ldGVyOiAnbXlQYXJhbWV0ZXInIH0sXG4gICAgICAgICAgUmVzdWx0U2VsZWN0b3I6IHtcbiAgICAgICAgICAgICdidXonOiAnYnV6JyxcbiAgICAgICAgICAgICdiYXouJCc6ICckLmJheicsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCBjYXRjaCBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgZmFpbHVyZSA9IG5ldyBzZm4uRmFpbChzdGFjaywgJ2ZhaWxlZCcsIHtcbiAgICAgIGVycm9yOiAnRGlkTm90V29yaycsXG4gICAgICBjYXVzZTogJ1dlIGdvdCBzdHVjaycsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgdGFzay5hZGRDYXRjaChmYWlsdXJlKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVuZGVyR3JhcGgodGFzaykpLnRvRXF1YWwoe1xuICAgICAgU3RhcnRBdDogJ215LXRhc2snLFxuICAgICAgU3RhdGVzOiB7XG4gICAgICAgICdteS10YXNrJzoge1xuICAgICAgICAgIEVuZDogdHJ1ZSxcbiAgICAgICAgICBDYXRjaDogW3tcbiAgICAgICAgICAgIEVycm9yRXF1YWxzOiBbJ1N0YXRlcy5BTEwnXSxcbiAgICAgICAgICAgIE5leHQ6ICdmYWlsZWQnLFxuICAgICAgICAgIH1dLFxuICAgICAgICAgIFR5cGU6ICdUYXNrJyxcbiAgICAgICAgICBSZXNvdXJjZTogJ215LXJlc291cmNlJyxcbiAgICAgICAgICBQYXJhbWV0ZXJzOiB7IE15UGFyYW1ldGVyOiAnbXlQYXJhbWV0ZXInIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdmYWlsZWQnOiB7XG4gICAgICAgICAgVHlwZTogJ0ZhaWwnLFxuICAgICAgICAgIEVycm9yOiAnRGlkTm90V29yaycsXG4gICAgICAgICAgQ2F1c2U6ICdXZSBnb3Qgc3R1Y2snLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnU3RhdGVzLkFMTCBjYXRjaCBhcHBlYXJzIGF0IGVuZCBvZiBsaXN0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgaHR0cEZhaWx1cmUgPSBuZXcgc2ZuLkZhaWwoc3RhY2ssICdodHRwJywgeyBlcnJvcjogJ0hUVFAnIH0pO1xuICAgIGNvbnN0IG90aGVyRmFpbHVyZSA9IG5ldyBzZm4uRmFpbChzdGFjaywgJ290aGVyJywgeyBlcnJvcjogJ090aGVyJyB9KTtcbiAgICBjb25zdCBhbGxGYWlsdXJlID0gbmV3IHNmbi5GYWlsKHN0YWNrLCAnYWxsJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgdGFza1xuICAgICAgLmFkZENhdGNoKGh0dHBGYWlsdXJlLCB7IGVycm9yczogWydIVFRQRXJyb3InXSB9KVxuICAgICAgLmFkZENhdGNoKGFsbEZhaWx1cmUpXG4gICAgICAuYWRkQ2F0Y2gob3RoZXJGYWlsdXJlLCB7IGVycm9yczogWydPdGhlckVycm9yJ10gfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlckdyYXBoKHRhc2spKS50b0VxdWFsKHtcbiAgICAgIFN0YXJ0QXQ6ICdteS10YXNrJyxcbiAgICAgIFN0YXRlczoge1xuICAgICAgICAnYWxsJzoge1xuICAgICAgICAgIFR5cGU6ICdGYWlsJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ2h0dHAnOiB7XG4gICAgICAgICAgRXJyb3I6ICdIVFRQJyxcbiAgICAgICAgICBUeXBlOiAnRmFpbCcsXG4gICAgICAgIH0sXG4gICAgICAgICdteS10YXNrJzoge1xuICAgICAgICAgIEVuZDogdHJ1ZSxcbiAgICAgICAgICBDYXRjaDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBFcnJvckVxdWFsczogWydIVFRQRXJyb3InXSxcbiAgICAgICAgICAgICAgTmV4dDogJ2h0dHAnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgRXJyb3JFcXVhbHM6IFsnT3RoZXJFcnJvciddLFxuICAgICAgICAgICAgICBOZXh0OiAnb3RoZXInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgRXJyb3JFcXVhbHM6IFsnU3RhdGVzLkFMTCddLFxuICAgICAgICAgICAgICBOZXh0OiAnYWxsJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBUeXBlOiAnVGFzaycsXG4gICAgICAgICAgUmVzb3VyY2U6ICdteS1yZXNvdXJjZScsXG4gICAgICAgICAgUGFyYW1ldGVyczogeyBNeVBhcmFtZXRlcjogJ215UGFyYW1ldGVyJyB9LFxuICAgICAgICB9LFxuICAgICAgICAnb3RoZXInOiB7XG4gICAgICAgICAgRXJyb3I6ICdPdGhlcicsXG4gICAgICAgICAgVHlwZTogJ0ZhaWwnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkQ2F0Y2ggdGhyb3dzIHdoZW4gZXJyb3JzIGFyZSBjb21iaW5lZCB3aXRoIFN0YXRlcy5BTEwnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBmYWlsdXJlID0gbmV3IHNmbi5GYWlsKHN0YWNrLCAnZmFpbGVkJywge1xuICAgICAgZXJyb3I6ICdEaWROb3RXb3JrJyxcbiAgICAgIGNhdXNlOiAnV2UgZ290IHN0dWNrJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiB0YXNrLmFkZENhdGNoKGZhaWx1cmUsIHtcbiAgICAgIGVycm9yczogWydTdGF0ZXMuQUxMJywgJ0hUVFBFcnJvciddLFxuICAgIH0pKS50b1Rocm93KC9tdXN0IGFwcGVhciBhbG9uZS8pO1xuICB9KTtcblxuICB0ZXN0KCdhZGQgcmV0cnkgY29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgdGFzay5hZGRSZXRyeSh7IGVycm9yczogWydIVFRQRXJyb3InXSwgbWF4QXR0ZW1wdHM6IDIgfSlcbiAgICAgIC5hZGRSZXRyeSgpOyAvLyBhZGRzIGRlZmF1bHQgcmV0cnlcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVuZGVyR3JhcGgodGFzaykpLnRvRXF1YWwoe1xuICAgICAgU3RhcnRBdDogJ215LXRhc2snLFxuICAgICAgU3RhdGVzOiB7XG4gICAgICAgICdteS10YXNrJzoge1xuICAgICAgICAgIEVuZDogdHJ1ZSxcbiAgICAgICAgICBSZXRyeTogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBFcnJvckVxdWFsczogWydIVFRQRXJyb3InXSxcbiAgICAgICAgICAgICAgTWF4QXR0ZW1wdHM6IDIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBFcnJvckVxdWFsczogWydTdGF0ZXMuQUxMJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVHlwZTogJ1Rhc2snLFxuICAgICAgICAgIFJlc291cmNlOiAnbXktcmVzb3VyY2UnLFxuICAgICAgICAgIFBhcmFtZXRlcnM6IHsgTXlQYXJhbWV0ZXI6ICdteVBhcmFtZXRlcicgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ1N0YXRlcy5BTEwgcmV0cnkgYXBwZWFycyBhdCBlbmQgb2YgbGlzdCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgdGFza1xuICAgICAgLmFkZFJldHJ5KHsgZXJyb3JzOiBbJ0hUVFBFcnJvciddIH0pXG4gICAgICAuYWRkUmV0cnkoKVxuICAgICAgLmFkZFJldHJ5KHsgZXJyb3JzOiBbJ090aGVyRXJyb3InXSB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVuZGVyR3JhcGgodGFzaykpLnRvRXF1YWwoe1xuICAgICAgU3RhcnRBdDogJ215LXRhc2snLFxuICAgICAgU3RhdGVzOiB7XG4gICAgICAgICdteS10YXNrJzoge1xuICAgICAgICAgIEVuZDogdHJ1ZSxcbiAgICAgICAgICBSZXRyeTogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBFcnJvckVxdWFsczogWydIVFRQRXJyb3InXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEVycm9yRXF1YWxzOiBbJ090aGVyRXJyb3InXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEVycm9yRXF1YWxzOiBbJ1N0YXRlcy5BTEwnXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBUeXBlOiAnVGFzaycsXG4gICAgICAgICAgUmVzb3VyY2U6ICdteS1yZXNvdXJjZScsXG4gICAgICAgICAgUGFyYW1ldGVyczogeyBNeVBhcmFtZXRlcjogJ215UGFyYW1ldGVyJyB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkUmV0cnkgdGhyb3dzIHdoZW4gZXJyb3JzIGFyZSBjb21iaW5lZCB3aXRoIFN0YXRlcy5BTEwnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHRhc2suYWRkUmV0cnkoe1xuICAgICAgZXJyb3JzOiBbJ1N0YXRlcy5BTEwnLCAnSFRUUEVycm9yJ10sXG4gICAgfSkpLnRvVGhyb3coL211c3QgYXBwZWFyIGFsb25lLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCBhIG5leHQgc3RhdGUgdG8gdGhlIHRhc2sgaW4gdGhlIGNoYWluJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICB0YXNrLm5leHQobmV3IHNmbi5QYXNzKHN0YWNrLCAncGFzc1N0YXRlJykpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZW5kZXJHcmFwaCh0YXNrKSkudG9FcXVhbCh7XG4gICAgICBTdGFydEF0OiAnbXktdGFzaycsXG4gICAgICBTdGF0ZXM6IHtcbiAgICAgICAgJ215LXRhc2snOiB7XG4gICAgICAgICAgTmV4dDogJ3Bhc3NTdGF0ZScsXG4gICAgICAgICAgVHlwZTogJ1Rhc2snLFxuICAgICAgICAgIFJlc291cmNlOiAnbXktcmVzb3VyY2UnLFxuICAgICAgICAgIFBhcmFtZXRlcnM6IHsgTXlQYXJhbWV0ZXI6ICdteVBhcmFtZXRlcicgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ3Bhc3NTdGF0ZSc6IHsgVHlwZTogJ1Bhc3MnLCBFbmQ6IHRydWUgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rhc2tUaW1lb3V0IGFuZCBoZWFydGJlYXRUaW1lb3V0IHNwZWNpZmllZCB3aXRoIGEgcGF0aCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgdGFzayA9IG5ldyBGYWtlVGFzayhzdGFjaywgJ215LWV4Y2l0aW5nLXRhc2snLCB7XG4gICAgICBoZWFydGJlYXRUaW1lb3V0OiBzZm4uVGltZW91dC5hdCgnJC5oZWFydGJlYXQnKSxcbiAgICAgIHRhc2tUaW1lb3V0OiBzZm4uVGltZW91dC5hdCgnJC50aW1lb3V0JyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlckdyYXBoKHRhc2spKS50b0VxdWFsKGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgIFN0YXRlczoge1xuICAgICAgICAnbXktZXhjaXRpbmctdGFzayc6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBIZWFydGJlYXRTZWNvbmRzUGF0aDogJyQuaGVhcnRiZWF0JyxcbiAgICAgICAgICBUaW1lb3V0U2Vjb25kc1BhdGg6ICckLnRpbWVvdXQnLFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgfSkpO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnZGVwcmVjYXRlZCBwcm9wcyB0aW1lb3V0IGFuZCBoZWFydGJlYXQgc3RpbGwgd29yaycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgdGFzayA9IG5ldyBGYWtlVGFzayhzdGFjaywgJ215LWV4Y2l0aW5nLXRhc2snLCB7XG4gICAgICBoZWFydGJlYXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDEwKSxcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5taW51dGVzKDEwKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVuZGVyR3JhcGgodGFzaykpLnRvRXF1YWwoZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgU3RhdGVzOiB7XG4gICAgICAgICdteS1leGNpdGluZy10YXNrJzogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIEhlYXJ0YmVhdFNlY29uZHM6IDEwLFxuICAgICAgICAgIFRpbWVvdXRTZWNvbmRzOiA2MDAsXG4gICAgICAgIH0pLFxuICAgICAgfSxcbiAgICB9KSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dldCBuYW1lZCBtZXRyaWMgZm9yIHRoaXMgdGFzaycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbWV0cmljID0gdGFzay5tZXRyaWMoJ215LW1ldHJpYycpO1xuXG4gICAgLy8gVEhFTlxuICAgIHZlcmlmeU1ldHJpYyhtZXRyaWMsICdteS1tZXRyaWMnLCAnU3VtJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCBtZXRyaWMgZm9yIHRhc2sgc3RhdGUgcnVuIHRpbWUnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IG1ldHJpYyA9IHRhc2subWV0cmljUnVuVGltZSgpO1xuXG4gICAgLy8gVEhFTlxuICAgIHZlcmlmeU1ldHJpYyhtZXRyaWMsICdSdW5UaW1lJywgJ0F2ZXJhZ2UnKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkIG1ldHJpYyBmb3IgdGFzayBzY2hlZHVsZSB0aW1lJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBtZXRyaWMgPSB0YXNrLm1ldHJpY1NjaGVkdWxlVGltZSgpO1xuXG4gICAgLy8gVEhFTlxuICAgIHZlcmlmeU1ldHJpYyhtZXRyaWMsICdTY2hlZHVsZVRpbWUnLCAnQXZlcmFnZScpO1xuICB9KTtcblxuICB0ZXN0KCdhZGQgbWV0cmljIGZvciB0aW1lIGJldHdlZW4gdGFzayBiZWluZyBzY2hlZHVsZWQgdG8gY2xvc2luZycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbWV0cmljID0gdGFzay5tZXRyaWNUaW1lKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgdmVyaWZ5TWV0cmljKG1ldHJpYywgJ1RpbWUnLCAnQXZlcmFnZScpO1xuICB9KTtcblxuICB0ZXN0KCdhZGQgbWV0cmljIGZvciBudW1iZXIgb2YgdGltZXMgdGhlIHRhc2sgaXMgc2NoZWR1bGVkJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBtZXRyaWMgPSB0YXNrLm1ldHJpY1NjaGVkdWxlZCgpO1xuXG4gICAgLy8gVEhFTlxuICAgIHZlcmlmeU1ldHJpYyhtZXRyaWMsICdTY2hlZHVsZWQnLCAnU3VtJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCBtZXRyaWMgZm9yIG51bWJlciBvZiB0aW1lcyB0aGUgdGFzayB0aW1lcyBvdXQnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IG1ldHJpYyA9IHRhc2subWV0cmljVGltZWRPdXQoKTtcblxuICAgIC8vIFRIRU5cbiAgICB2ZXJpZnlNZXRyaWMobWV0cmljLCAnVGltZWRPdXQnLCAnU3VtJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCBtZXRyaWMgZm9yIG51bWJlciBvZiB0aW1lcyB0aGUgdGFzayB3YXMgc3RhcnRlZCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbWV0cmljID0gdGFzay5tZXRyaWNTdGFydGVkKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgdmVyaWZ5TWV0cmljKG1ldHJpYywgJ1N0YXJ0ZWQnLCAnU3VtJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCBtZXRyaWMgZm9yIG51bWJlciBvZiB0aW1lcyB0aGUgdGFzayBzdWNjZWVkZWQnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IG1ldHJpYyA9IHRhc2subWV0cmljU3VjY2VlZGVkKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgdmVyaWZ5TWV0cmljKG1ldHJpYywgJ1N1Y2NlZWRlZCcsICdTdW0nKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkIG1ldHJpYyBmb3IgbnVtYmVyIG9mIHRpbWVzIHRoZSB0YXNrIGZhaWxlZCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbWV0cmljID0gdGFzay5tZXRyaWNGYWlsZWQoKTtcblxuICAgIC8vIFRIRU5cbiAgICB2ZXJpZnlNZXRyaWMobWV0cmljLCAnRmFpbGVkJywgJ1N1bScpO1xuICB9KTtcblxuICB0ZXN0KCdhZGQgbWV0cmljIGZvciBudW1iZXIgb2YgdGltZXMgdGhlIG1ldHJpY3MgaGVhcnRiZWF0IHRpbWVkIG91dCcsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbWV0cmljID0gdGFzay5tZXRyaWNIZWFydGJlYXRUaW1lZE91dCgpO1xuXG4gICAgLy8gVEhFTlxuICAgIHZlcmlmeU1ldHJpYyhtZXRyaWMsICdIZWFydGJlYXRUaW1lZE91dCcsICdTdW0nKTtcbiAgfSk7XG5cbiAgdGVzdCgnbWV0cmljcyBtdXN0IGJlIGNvbmZpZ3VyZWQgdG8gdXNlIG1ldHJpYyogQVBJcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIHRhc2sgPSBuZXcgRmFrZVRhc2soc3RhY2ssICdteXRhc2snLCB7fSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHRhc2subWV0cmljRmFpbGVkKCk7XG4gICAgfSkudG9UaHJvdyhcbiAgICAgICdUYXNrIGRvZXMgbm90IGV4cG9zZSBtZXRyaWNzLiBVc2UgdGhlIFxcJ21ldHJpYygpXFwnIGZ1bmN0aW9uIHRvIGFkZCBtZXRyaWNzLicsXG4gICAgKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICB0YXNrLm1ldHJpY0hlYXJ0YmVhdFRpbWVkT3V0KCk7XG4gICAgfSkudG9UaHJvdyhcbiAgICAgICdUYXNrIGRvZXMgbm90IGV4cG9zZSBtZXRyaWNzLiBVc2UgdGhlIFxcJ21ldHJpYygpXFwnIGZ1bmN0aW9uIHRvIGFkZCBtZXRyaWNzLicsXG4gICAgKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICB0YXNrLm1ldHJpY1J1blRpbWUoKTtcbiAgICB9KS50b1Rocm93KFxuICAgICAgJ1Rhc2sgZG9lcyBub3QgZXhwb3NlIG1ldHJpY3MuIFVzZSB0aGUgXFwnbWV0cmljKClcXCcgZnVuY3Rpb24gdG8gYWRkIG1ldHJpY3MuJyxcbiAgICApO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHRhc2subWV0cmljU2NoZWR1bGVUaW1lKCk7XG4gICAgfSkudG9UaHJvdyhcbiAgICAgICdUYXNrIGRvZXMgbm90IGV4cG9zZSBtZXRyaWNzLiBVc2UgdGhlIFxcJ21ldHJpYygpXFwnIGZ1bmN0aW9uIHRvIGFkZCBtZXRyaWNzLicsXG4gICAgKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICB0YXNrLm1ldHJpY1NjaGVkdWxlZCgpO1xuICAgIH0pLnRvVGhyb3coXG4gICAgICAnVGFzayBkb2VzIG5vdCBleHBvc2UgbWV0cmljcy4gVXNlIHRoZSBcXCdtZXRyaWMoKVxcJyBmdW5jdGlvbiB0byBhZGQgbWV0cmljcy4nLFxuICAgICk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgdGFzay5tZXRyaWNTdGFydGVkKCk7XG4gICAgfSkudG9UaHJvdyhcbiAgICAgICdUYXNrIGRvZXMgbm90IGV4cG9zZSBtZXRyaWNzLiBVc2UgdGhlIFxcJ21ldHJpYygpXFwnIGZ1bmN0aW9uIHRvIGFkZCBtZXRyaWNzLicsXG4gICAgKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICB0YXNrLm1ldHJpY1N1Y2NlZWRlZCgpO1xuICAgIH0pLnRvVGhyb3coXG4gICAgICAnVGFzayBkb2VzIG5vdCBleHBvc2UgbWV0cmljcy4gVXNlIHRoZSBcXCdtZXRyaWMoKVxcJyBmdW5jdGlvbiB0byBhZGQgbWV0cmljcy4nLFxuICAgICk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgdGFzay5tZXRyaWNUaW1lKCk7XG4gICAgfSkudG9UaHJvdyhcbiAgICAgICdUYXNrIGRvZXMgbm90IGV4cG9zZSBtZXRyaWNzLiBVc2UgdGhlIFxcJ21ldHJpYygpXFwnIGZ1bmN0aW9uIHRvIGFkZCBtZXRyaWNzLicsXG4gICAgKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICB0YXNrLm1ldHJpY1RpbWVkT3V0KCk7XG4gICAgfSkudG9UaHJvdyhcbiAgICAgICdUYXNrIGRvZXMgbm90IGV4cG9zZSBtZXRyaWNzLiBVc2UgdGhlIFxcJ21ldHJpYygpXFwnIGZ1bmN0aW9uIHRvIGFkZCBtZXRyaWNzLicsXG4gICAgKTtcbiAgfSk7XG59KTtcblxuZnVuY3Rpb24gdmVyaWZ5TWV0cmljKG1ldHJpYzogTWV0cmljLCBtZXRyaWNOYW1lOiBzdHJpbmcsIHN0YXRpc3RpYzogc3RyaW5nKSB7XG4gIGV4cGVjdChtZXRyaWMpLnRvRXF1YWwoZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgIG5hbWVzcGFjZTogJ0FXUy9TdGF0ZXMnLFxuICAgIG1ldHJpY05hbWUsXG4gICAgc3RhdGlzdGljLFxuICB9KSk7XG59XG4iXX0=