"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('subscription filter', () => {
    test('trivial instantiation', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const logGroup = new lib_1.LogGroup(stack, 'LogGroup');
        // WHEN
        new lib_1.SubscriptionFilter(stack, 'Subscription', {
            logGroup,
            destination: new FakeDestination(),
            filterPattern: lib_1.FilterPattern.literal('some pattern'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::SubscriptionFilter', {
            DestinationArn: 'arn:bogus',
            FilterPattern: 'some pattern',
            LogGroupName: { Ref: 'LogGroupF5B46931' },
        });
    });
});
class FakeDestination {
    bind(_scope, _sourceLogGroup) {
        return {
            arn: 'arn:bogus',
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaXB0aW9uZmlsdGVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdWJzY3JpcHRpb25maWx0ZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBc0M7QUFFdEMsZ0NBQTZHO0FBRTdHLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7SUFDbkMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRTtRQUNqQyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLFFBQVEsR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFakQsT0FBTztRQUNQLElBQUksd0JBQWtCLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRTtZQUM1QyxRQUFRO1lBQ1IsV0FBVyxFQUFFLElBQUksZUFBZSxFQUFFO1lBQ2xDLGFBQWEsRUFBRSxtQkFBYSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7U0FDckQsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLCtCQUErQixFQUFFO1lBQy9FLGNBQWMsRUFBRSxXQUFXO1lBQzNCLGFBQWEsRUFBRSxjQUFjO1lBQzdCLFlBQVksRUFBRSxFQUFFLEdBQUcsRUFBRSxrQkFBa0IsRUFBRTtTQUMxQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxlQUFlO0lBQ1osSUFBSSxDQUFDLE1BQWlCLEVBQUUsZUFBMEI7UUFDdkQsT0FBTztZQUNMLEdBQUcsRUFBRSxXQUFXO1NBQ2pCLENBQUM7S0FDSDtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEZpbHRlclBhdHRlcm4sIElMb2dHcm91cCwgSUxvZ1N1YnNjcmlwdGlvbkRlc3RpbmF0aW9uLCBMb2dHcm91cCwgU3Vic2NyaXB0aW9uRmlsdGVyIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ3N1YnNjcmlwdGlvbiBmaWx0ZXInLCAoKSA9PiB7XG4gIHRlc3QoJ3RyaXZpYWwgaW5zdGFudGlhdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgbG9nR3JvdXAgPSBuZXcgTG9nR3JvdXAoc3RhY2ssICdMb2dHcm91cCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBTdWJzY3JpcHRpb25GaWx0ZXIoc3RhY2ssICdTdWJzY3JpcHRpb24nLCB7XG4gICAgICBsb2dHcm91cCxcbiAgICAgIGRlc3RpbmF0aW9uOiBuZXcgRmFrZURlc3RpbmF0aW9uKCksXG4gICAgICBmaWx0ZXJQYXR0ZXJuOiBGaWx0ZXJQYXR0ZXJuLmxpdGVyYWwoJ3NvbWUgcGF0dGVybicpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxvZ3M6OlN1YnNjcmlwdGlvbkZpbHRlcicsIHtcbiAgICAgIERlc3RpbmF0aW9uQXJuOiAnYXJuOmJvZ3VzJyxcbiAgICAgIEZpbHRlclBhdHRlcm46ICdzb21lIHBhdHRlcm4nLFxuICAgICAgTG9nR3JvdXBOYW1lOiB7IFJlZjogJ0xvZ0dyb3VwRjVCNDY5MzEnIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmNsYXNzIEZha2VEZXN0aW5hdGlvbiBpbXBsZW1lbnRzIElMb2dTdWJzY3JpcHRpb25EZXN0aW5hdGlvbiB7XG4gIHB1YmxpYyBiaW5kKF9zY29wZTogQ29uc3RydWN0LCBfc291cmNlTG9nR3JvdXA6IElMb2dHcm91cCkge1xuICAgIHJldHVybiB7XG4gICAgICBhcm46ICdhcm46Ym9ndXMnLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==