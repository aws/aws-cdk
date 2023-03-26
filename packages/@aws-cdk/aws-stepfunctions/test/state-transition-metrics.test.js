"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
describe('State Transition Metrics', () => {
    test('add a named state transition metric', () => {
        // WHEN
        const metric = lib_1.StateTransitionMetric.metric('my-metric');
        // THEN
        verifyTransitionMetric(metric, 'my-metric', 'Average');
    });
    test('metric for available state transitions.', () => {
        // WHEN
        const metric = lib_1.StateTransitionMetric.metricProvisionedBucketSize();
        // THEN
        verifyTransitionMetric(metric, 'ProvisionedBucketSize', 'Average');
    });
    test('metric for provisioned steady-state execution rate', () => {
        // WHEN
        const metric = lib_1.StateTransitionMetric.metricProvisionedRefillRate();
        // THEN
        verifyTransitionMetric(metric, 'ProvisionedRefillRate', 'Average');
    });
    test('metric for state-transitions per second', () => {
        // WHEN
        const metric = lib_1.StateTransitionMetric.metricConsumedCapacity();
        // THEN
        verifyTransitionMetric(metric, 'ConsumedCapacity', 'Average');
    });
    test('metric for the number of throttled state transitions', () => {
        // WHEN
        const metric = lib_1.StateTransitionMetric.metricThrottledEvents();
        // THEN
        verifyTransitionMetric(metric, 'ThrottledEvents', 'Sum');
    });
});
function verifyTransitionMetric(metric, metricName, statistic) {
    expect(metric).toEqual(expect.objectContaining({
        dimensions: { ServiceMetric: 'StateTransition' },
        namespace: 'AWS/States',
        metricName,
        statistic,
    }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUtdHJhbnNpdGlvbi1tZXRyaWNzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0ZS10cmFuc2l0aW9uLW1ldHJpY3MudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGdDQUErQztBQUUvQyxRQUFRLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLElBQUksQ0FBQyxxQ0FBcUMsRUFBRSxHQUFHLEVBQUU7UUFDL0MsT0FBTztRQUNQLE1BQU0sTUFBTSxHQUFHLDJCQUFxQixDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUV6RCxPQUFPO1FBQ1Asc0JBQXNCLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN6RCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx5Q0FBeUMsRUFBRSxHQUFHLEVBQUU7UUFDbkQsT0FBTztRQUNQLE1BQU0sTUFBTSxHQUFHLDJCQUFxQixDQUFDLDJCQUEyQixFQUFFLENBQUM7UUFFbkUsT0FBTztRQUNQLHNCQUFzQixDQUFDLE1BQU0sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNyRSxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxvREFBb0QsRUFBRSxHQUFHLEVBQUU7UUFDOUQsT0FBTztRQUNQLE1BQU0sTUFBTSxHQUFHLDJCQUFxQixDQUFDLDJCQUEyQixFQUFFLENBQUM7UUFFbkUsT0FBTztRQUNQLHNCQUFzQixDQUFDLE1BQU0sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNyRSxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx5Q0FBeUMsRUFBRSxHQUFHLEVBQUU7UUFDbkQsT0FBTztRQUNQLE1BQU0sTUFBTSxHQUFHLDJCQUFxQixDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFFOUQsT0FBTztRQUNQLHNCQUFzQixDQUFDLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNoRSxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxzREFBc0QsRUFBRSxHQUFHLEVBQUU7UUFDaEUsT0FBTztRQUNQLE1BQU0sTUFBTSxHQUFHLDJCQUFxQixDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFFN0QsT0FBTztRQUNQLHNCQUFzQixDQUFDLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMzRCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsU0FBUyxzQkFBc0IsQ0FBQyxNQUFjLEVBQUUsVUFBa0IsRUFBRSxTQUFpQjtJQUNuRixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztRQUM3QyxVQUFVLEVBQUUsRUFBRSxhQUFhLEVBQUUsaUJBQWlCLEVBQUU7UUFDaEQsU0FBUyxFQUFFLFlBQVk7UUFDdkIsVUFBVTtRQUNWLFNBQVM7S0FDVixDQUFDLENBQUMsQ0FBQztBQUNOLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNZXRyaWMgfSBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWR3YXRjaCc7XG5pbXBvcnQgeyBTdGF0ZVRyYW5zaXRpb25NZXRyaWMgfSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnU3RhdGUgVHJhbnNpdGlvbiBNZXRyaWNzJywgKCkgPT4ge1xuICB0ZXN0KCdhZGQgYSBuYW1lZCBzdGF0ZSB0cmFuc2l0aW9uIG1ldHJpYycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbWV0cmljID0gU3RhdGVUcmFuc2l0aW9uTWV0cmljLm1ldHJpYygnbXktbWV0cmljJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgdmVyaWZ5VHJhbnNpdGlvbk1ldHJpYyhtZXRyaWMsICdteS1tZXRyaWMnLCAnQXZlcmFnZScpO1xuICB9KTtcblxuICB0ZXN0KCdtZXRyaWMgZm9yIGF2YWlsYWJsZSBzdGF0ZSB0cmFuc2l0aW9ucy4nLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IG1ldHJpYyA9IFN0YXRlVHJhbnNpdGlvbk1ldHJpYy5tZXRyaWNQcm92aXNpb25lZEJ1Y2tldFNpemUoKTtcblxuICAgIC8vIFRIRU5cbiAgICB2ZXJpZnlUcmFuc2l0aW9uTWV0cmljKG1ldHJpYywgJ1Byb3Zpc2lvbmVkQnVja2V0U2l6ZScsICdBdmVyYWdlJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ21ldHJpYyBmb3IgcHJvdmlzaW9uZWQgc3RlYWR5LXN0YXRlIGV4ZWN1dGlvbiByYXRlJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBtZXRyaWMgPSBTdGF0ZVRyYW5zaXRpb25NZXRyaWMubWV0cmljUHJvdmlzaW9uZWRSZWZpbGxSYXRlKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgdmVyaWZ5VHJhbnNpdGlvbk1ldHJpYyhtZXRyaWMsICdQcm92aXNpb25lZFJlZmlsbFJhdGUnLCAnQXZlcmFnZScpO1xuICB9KTtcblxuICB0ZXN0KCdtZXRyaWMgZm9yIHN0YXRlLXRyYW5zaXRpb25zIHBlciBzZWNvbmQnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IG1ldHJpYyA9IFN0YXRlVHJhbnNpdGlvbk1ldHJpYy5tZXRyaWNDb25zdW1lZENhcGFjaXR5KCk7XG5cbiAgICAvLyBUSEVOXG4gICAgdmVyaWZ5VHJhbnNpdGlvbk1ldHJpYyhtZXRyaWMsICdDb25zdW1lZENhcGFjaXR5JywgJ0F2ZXJhZ2UnKTtcbiAgfSk7XG5cbiAgdGVzdCgnbWV0cmljIGZvciB0aGUgbnVtYmVyIG9mIHRocm90dGxlZCBzdGF0ZSB0cmFuc2l0aW9ucycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbWV0cmljID0gU3RhdGVUcmFuc2l0aW9uTWV0cmljLm1ldHJpY1Rocm90dGxlZEV2ZW50cygpO1xuXG4gICAgLy8gVEhFTlxuICAgIHZlcmlmeVRyYW5zaXRpb25NZXRyaWMobWV0cmljLCAnVGhyb3R0bGVkRXZlbnRzJywgJ1N1bScpO1xuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiB2ZXJpZnlUcmFuc2l0aW9uTWV0cmljKG1ldHJpYzogTWV0cmljLCBtZXRyaWNOYW1lOiBzdHJpbmcsIHN0YXRpc3RpYzogc3RyaW5nKSB7XG4gIGV4cGVjdChtZXRyaWMpLnRvRXF1YWwoZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgIGRpbWVuc2lvbnM6IHsgU2VydmljZU1ldHJpYzogJ1N0YXRlVHJhbnNpdGlvbicgfSxcbiAgICBuYW1lc3BhY2U6ICdBV1MvU3RhdGVzJyxcbiAgICBtZXRyaWNOYW1lLFxuICAgIHN0YXRpc3RpYyxcbiAgfSkpO1xufVxuIl19