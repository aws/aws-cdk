"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const aws_cloudwatch_1 = require("@aws-cdk/aws-cloudwatch");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('metric filter', () => {
    test('trivial instantiation', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const logGroup = new lib_1.LogGroup(stack, 'LogGroup');
        // WHEN
        new lib_1.MetricFilter(stack, 'Subscription', {
            logGroup,
            metricNamespace: 'AWS/Test',
            metricName: 'Latency',
            metricValue: '$.latency',
            filterPattern: lib_1.FilterPattern.exists('$.latency'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::MetricFilter', {
            MetricTransformations: [{
                    MetricNamespace: 'AWS/Test',
                    MetricName: 'Latency',
                    MetricValue: '$.latency',
                }],
            FilterPattern: '{ $.latency = "*" }',
            LogGroupName: { Ref: 'LogGroupF5B46931' },
        });
    });
    test('with dimensions', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const logGroup = new lib_1.LogGroup(stack, 'LogGroup');
        // WHEN
        new lib_1.MetricFilter(stack, 'Subscription', {
            logGroup,
            metricNamespace: 'AWS/Test',
            metricName: 'Latency',
            metricValue: '$.latency',
            filterPattern: lib_1.FilterPattern.exists('$.latency'),
            dimensions: {
                Foo: 'Bar',
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::MetricFilter', {
            MetricTransformations: [{
                    MetricNamespace: 'AWS/Test',
                    MetricName: 'Latency',
                    MetricValue: '$.latency',
                    Dimensions: [
                        {
                            Key: 'Foo',
                            Value: 'Bar',
                        },
                    ],
                }],
            FilterPattern: '{ $.latency = "*" }',
            LogGroupName: { Ref: 'LogGroupF5B46931' },
        });
    });
    test('should throw with more than 3 dimensions', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const logGroup = new lib_1.LogGroup(stack, 'LogGroup');
        // WHEN
        expect(() => new lib_1.MetricFilter(stack, 'Subscription', {
            logGroup,
            metricNamespace: 'AWS/Test',
            metricName: 'Latency',
            metricValue: '$.latency',
            filterPattern: lib_1.FilterPattern.exists('$.latency'),
            dimensions: {
                Foo: 'Bar',
                Bar: 'Baz',
                Baz: 'Qux',
                Qux: 'Quux',
            },
        })).toThrow(/MetricFilter only supports a maximum of 3 Dimensions/);
    });
    test('metric filter exposes metric', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const logGroup = new lib_1.LogGroup(stack, 'LogGroup');
        // WHEN
        const mf = new lib_1.MetricFilter(stack, 'Subscription', {
            logGroup,
            metricNamespace: 'AWS/Test',
            metricName: 'Latency',
            metricValue: '$.latency',
            filterPattern: lib_1.FilterPattern.exists('$.latency'),
        });
        const metric = mf.metric();
        // THEN
        expect(metric).toEqual(new aws_cloudwatch_1.Metric({
            metricName: 'Latency',
            namespace: 'AWS/Test',
            statistic: 'avg',
        }));
    });
    test('metric filter exposes metric with custom statistic', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const logGroup = new lib_1.LogGroup(stack, 'LogGroup');
        // WHEN
        const mf = new lib_1.MetricFilter(stack, 'Subscription', {
            logGroup,
            metricNamespace: 'AWS/Test',
            metricName: 'Latency',
            metricValue: '$.latency',
            filterPattern: lib_1.FilterPattern.exists('$.latency'),
        });
        const metric = mf.metric({ statistic: 'maximum' });
        // THEN
        expect(metric).toEqual(new aws_cloudwatch_1.Metric({
            metricName: 'Latency',
            namespace: 'AWS/Test',
            statistic: 'maximum',
        }));
    });
    test('with unit', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const logGroup = new lib_1.LogGroup(stack, 'LogGroup');
        // WHEN
        new lib_1.MetricFilter(stack, 'Subscription', {
            logGroup,
            metricNamespace: 'AWS/Test',
            metricName: 'Latency',
            metricValue: '$.latency',
            filterPattern: lib_1.FilterPattern.exists('$.latency'),
            dimensions: {
                Foo: 'Bar',
            },
            unit: aws_cloudwatch_1.Unit.MILLISECONDS,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::MetricFilter', {
            MetricTransformations: [{
                    MetricNamespace: 'AWS/Test',
                    MetricName: 'Latency',
                    MetricValue: '$.latency',
                    Dimensions: [
                        {
                            Key: 'Foo',
                            Value: 'Bar',
                        },
                    ],
                    Unit: 'Milliseconds',
                }],
            FilterPattern: '{ $.latency = "*" }',
            LogGroupName: { Ref: 'LogGroupF5B46931' },
        });
    });
    test('with no unit', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const logGroup = new lib_1.LogGroup(stack, 'LogGroup');
        // WHEN
        new lib_1.MetricFilter(stack, 'Subscription', {
            logGroup,
            metricNamespace: 'AWS/Test',
            metricName: 'Latency',
            metricValue: '$.latency',
            filterPattern: lib_1.FilterPattern.exists('$.latency'),
            dimensions: {
                Foo: 'Bar',
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::MetricFilter', {
            MetricTransformations: [{
                    MetricNamespace: 'AWS/Test',
                    MetricName: 'Latency',
                    MetricValue: '$.latency',
                    Dimensions: [
                        {
                            Key: 'Foo',
                            Value: 'Bar',
                        },
                    ],
                }],
            FilterPattern: '{ $.latency = "*" }',
            LogGroupName: { Ref: 'LogGroupF5B46931' },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljZmlsdGVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtZXRyaWNmaWx0ZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyw0REFBdUQ7QUFDdkQsd0NBQXNDO0FBQ3RDLGdDQUErRDtBQUUvRCxRQUFRLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtJQUM3QixJQUFJLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO1FBQ2pDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBQzFCLE1BQU0sUUFBUSxHQUFHLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztRQUVqRCxPQUFPO1FBQ1AsSUFBSSxrQkFBWSxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7WUFDdEMsUUFBUTtZQUNSLGVBQWUsRUFBRSxVQUFVO1lBQzNCLFVBQVUsRUFBRSxTQUFTO1lBQ3JCLFdBQVcsRUFBRSxXQUFXO1lBQ3hCLGFBQWEsRUFBRSxtQkFBYSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7U0FDakQsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHlCQUF5QixFQUFFO1lBQ3pFLHFCQUFxQixFQUFFLENBQUM7b0JBQ3RCLGVBQWUsRUFBRSxVQUFVO29CQUMzQixVQUFVLEVBQUUsU0FBUztvQkFDckIsV0FBVyxFQUFFLFdBQVc7aUJBQ3pCLENBQUM7WUFDRixhQUFhLEVBQUUscUJBQXFCO1lBQ3BDLFlBQVksRUFBRSxFQUFFLEdBQUcsRUFBRSxrQkFBa0IsRUFBRTtTQUMxQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7UUFDM0IsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxF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LGVBQWUsRUFBRSxVQUFVO29CQUMzQixVQUFVLEVBQUUsU0FBUztvQkFDckIsV0FBVyxFQUFFLFdBQVc7b0JBQ3hCLFVBQVUsRUFBRTt3QkFDVjs0QkFDRSxHQUFHLEVBQUUsS0FBSzs0QkFDVixLQUFLLEVBQUUsS0FBSzt5QkFDYjtxQkFDRjtpQkFDRixDQUFDO1lBQ0YsYUFBYSxFQUFFLHFCQUFxQjtZQUNwQyxZQUFZLEVBQUUsRUFBRSxHQUFHLEVBQUUsa0JBQWtCLEVBQUU7U0FDMUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBNZXRyaWMsIFVuaXQgfSBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWR3YXRjaCc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgRmlsdGVyUGF0dGVybiwgTG9nR3JvdXAsIE1ldHJpY0ZpbHRlciB9IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdtZXRyaWMgZmlsdGVyJywgKCkgPT4ge1xuICB0ZXN0KCd0cml2aWFsIGluc3RhbnRpYXRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGxvZ0dyb3VwID0gbmV3IExvZ0dyb3VwKHN0YWNrLCAnTG9nR3JvdXAnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgTWV0cmljRmlsdGVyKHN0YWNrLCAnU3Vic2NyaXB0aW9uJywge1xuICAgICAgbG9nR3JvdXAsXG4gICAgICBtZXRyaWNOYW1lc3BhY2U6ICdBV1MvVGVzdCcsXG4gICAgICBtZXRyaWNOYW1lOiAnTGF0ZW5jeScsXG4gICAgICBtZXRyaWNWYWx1ZTogJyQubGF0ZW5jeScsXG4gICAgICBmaWx0ZXJQYXR0ZXJuOiBGaWx0ZXJQYXR0ZXJuLmV4aXN0cygnJC5sYXRlbmN5JyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TG9nczo6TWV0cmljRmlsdGVyJywge1xuICAgICAgTWV0cmljVHJhbnNmb3JtYXRpb25zOiBbe1xuICAgICAgICBNZXRyaWNOYW1lc3BhY2U6ICdBV1MvVGVzdCcsXG4gICAgICAgIE1ldHJpY05hbWU6ICdMYXRlbmN5JyxcbiAgICAgICAgTWV0cmljVmFsdWU6ICckLmxhdGVuY3knLFxuICAgICAgfV0sXG4gICAgICBGaWx0ZXJQYXR0ZXJuOiAneyAkLmxhdGVuY3kgPSBcIipcIiB9JyxcbiAgICAgIExvZ0dyb3VwTmFtZTogeyBSZWY6ICdMb2dHcm91cEY1QjQ2OTMxJyB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd3aXRoIGRpbWVuc2lvbnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGxvZ0dyb3VwID0gbmV3IExvZ0dyb3VwKHN0YWNrLCAnTG9nR3JvdXAnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgTWV0cmljRmlsdGVyKHN0YWNrLCAnU3Vic2NyaXB0aW9uJywge1xuICAgICAgbG9nR3JvdXAsXG4gICAgICBtZXRyaWNOYW1lc3BhY2U6ICdBV1MvVGVzdCcsXG4gICAgICBtZXRyaWNOYW1lOiAnTGF0ZW5jeScsXG4gICAgICBtZXRyaWNWYWx1ZTogJyQubGF0ZW5jeScsXG4gICAgICBmaWx0ZXJQYXR0ZXJuOiBGaWx0ZXJQYXR0ZXJuLmV4aXN0cygnJC5sYXRlbmN5JyksXG4gICAgICBkaW1lbnNpb25zOiB7XG4gICAgICAgIEZvbzogJ0JhcicsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxvZ3M6Ok1ldHJpY0ZpbHRlcicsIHtcbiAgICAgIE1ldHJpY1RyYW5zZm9ybWF0aW9uczogW3tcbiAgICAgICAgTWV0cmljTmFtZXNwYWNlOiAnQVdTL1Rlc3QnLFxuICAgICAgICBNZXRyaWNOYW1lOiAnTGF0ZW5jeScsXG4gICAgICAgIE1ldHJpY1ZhbHVlOiAnJC5sYXRlbmN5JyxcbiAgICAgICAgRGltZW5zaW9uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEtleTogJ0ZvbycsXG4gICAgICAgICAgICBWYWx1ZTogJ0JhcicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH1dLFxuICAgICAgRmlsdGVyUGF0dGVybjogJ3sgJC5sYXRlbmN5ID0gXCIqXCIgfScsXG4gICAgICBMb2dHcm91cE5hbWU6IHsgUmVmOiAnTG9nR3JvdXBGNUI0NjkzMScgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc2hvdWxkIHRocm93IHdpdGggbW9yZSB0aGFuIDMgZGltZW5zaW9ucycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgbG9nR3JvdXAgPSBuZXcgTG9nR3JvdXAoc3RhY2ssICdMb2dHcm91cCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIGV4cGVjdCgoKSA9PiBuZXcgTWV0cmljRmlsdGVyKHN0YWNrLCAnU3Vic2NyaXB0aW9uJywge1xuICAgICAgbG9nR3JvdXAsXG4gICAgICBtZXRyaWNOYW1lc3BhY2U6ICdBV1MvVGVzdCcsXG4gICAgICBtZXRyaWNOYW1lOiAnTGF0ZW5jeScsXG4gICAgICBtZXRyaWNWYWx1ZTogJyQubGF0ZW5jeScsXG4gICAgICBmaWx0ZXJQYXR0ZXJuOiBGaWx0ZXJQYXR0ZXJuLmV4aXN0cygnJC5sYXRlbmN5JyksXG4gICAgICBkaW1lbnNpb25zOiB7XG4gICAgICAgIEZvbzogJ0JhcicsXG4gICAgICAgIEJhcjogJ0JheicsXG4gICAgICAgIEJhejogJ1F1eCcsXG4gICAgICAgIFF1eDogJ1F1dXgnLFxuICAgICAgfSxcbiAgICB9KSkudG9UaHJvdygvTWV0cmljRmlsdGVyIG9ubHkgc3VwcG9ydHMgYSBtYXhpbXVtIG9mIDMgRGltZW5zaW9ucy8pO1xuICB9KTtcblxuICB0ZXN0KCdtZXRyaWMgZmlsdGVyIGV4cG9zZXMgbWV0cmljJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBsb2dHcm91cCA9IG5ldyBMb2dHcm91cChzdGFjaywgJ0xvZ0dyb3VwJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbWYgPSBuZXcgTWV0cmljRmlsdGVyKHN0YWNrLCAnU3Vic2NyaXB0aW9uJywge1xuICAgICAgbG9nR3JvdXAsXG4gICAgICBtZXRyaWNOYW1lc3BhY2U6ICdBV1MvVGVzdCcsXG4gICAgICBtZXRyaWNOYW1lOiAnTGF0ZW5jeScsXG4gICAgICBtZXRyaWNWYWx1ZTogJyQubGF0ZW5jeScsXG4gICAgICBmaWx0ZXJQYXR0ZXJuOiBGaWx0ZXJQYXR0ZXJuLmV4aXN0cygnJC5sYXRlbmN5JyksXG4gICAgfSk7XG5cbiAgICBjb25zdCBtZXRyaWMgPSBtZi5tZXRyaWMoKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QobWV0cmljKS50b0VxdWFsKG5ldyBNZXRyaWMoe1xuICAgICAgbWV0cmljTmFtZTogJ0xhdGVuY3knLFxuICAgICAgbmFtZXNwYWNlOiAnQVdTL1Rlc3QnLFxuICAgICAgc3RhdGlzdGljOiAnYXZnJyxcbiAgICB9KSk7XG4gIH0pO1xuXG4gIHRlc3QoJ21ldHJpYyBmaWx0ZXIgZXhwb3NlcyBtZXRyaWMgd2l0aCBjdXN0b20gc3RhdGlzdGljJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBsb2dHcm91cCA9IG5ldyBMb2dHcm91cChzdGFjaywgJ0xvZ0dyb3VwJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbWYgPSBuZXcgTWV0cmljRmlsdGVyKHN0YWNrLCAnU3Vic2NyaXB0aW9uJywge1xuICAgICAgbG9nR3JvdXAsXG4gICAgICBtZXRyaWNOYW1lc3BhY2U6ICdBV1MvVGVzdCcsXG4gICAgICBtZXRyaWNOYW1lOiAnTGF0ZW5jeScsXG4gICAgICBtZXRyaWNWYWx1ZTogJyQubGF0ZW5jeScsXG4gICAgICBmaWx0ZXJQYXR0ZXJuOiBGaWx0ZXJQYXR0ZXJuLmV4aXN0cygnJC5sYXRlbmN5JyksXG4gICAgfSk7XG5cbiAgICBjb25zdCBtZXRyaWMgPSBtZi5tZXRyaWMoeyBzdGF0aXN0aWM6ICdtYXhpbXVtJyB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QobWV0cmljKS50b0VxdWFsKG5ldyBNZXRyaWMoe1xuICAgICAgbWV0cmljTmFtZTogJ0xhdGVuY3knLFxuICAgICAgbmFtZXNwYWNlOiAnQVdTL1Rlc3QnLFxuICAgICAgc3RhdGlzdGljOiAnbWF4aW11bScsXG4gICAgfSkpO1xuICB9KTtcblxuICB0ZXN0KCd3aXRoIHVuaXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGxvZ0dyb3VwID0gbmV3IExvZ0dyb3VwKHN0YWNrLCAnTG9nR3JvdXAnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgTWV0cmljRmlsdGVyKHN0YWNrLCAnU3Vic2NyaXB0aW9uJywge1xuICAgICAgbG9nR3JvdXAsXG4gICAgICBtZXRyaWNOYW1lc3BhY2U6ICdBV1MvVGVzdCcsXG4gICAgICBtZXRyaWNOYW1lOiAnTGF0ZW5jeScsXG4gICAgICBtZXRyaWNWYWx1ZTogJyQubGF0ZW5jeScsXG4gICAgICBmaWx0ZXJQYXR0ZXJuOiBGaWx0ZXJQYXR0ZXJuLmV4aXN0cygnJC5sYXRlbmN5JyksXG4gICAgICBkaW1lbnNpb25zOiB7XG4gICAgICAgIEZvbzogJ0JhcicsXG4gICAgICB9LFxuICAgICAgdW5pdDogVW5pdC5NSUxMSVNFQ09ORFMsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TG9nczo6TWV0cmljRmlsdGVyJywge1xuICAgICAgTWV0cmljVHJhbnNmb3JtYXRpb25zOiBbe1xuICAgICAgICBNZXRyaWNOYW1lc3BhY2U6ICdBV1MvVGVzdCcsXG4gICAgICAgIE1ldHJpY05hbWU6ICdMYXRlbmN5JyxcbiAgICAgICAgTWV0cmljVmFsdWU6ICckLmxhdGVuY3knLFxuICAgICAgICBEaW1lbnNpb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgS2V5OiAnRm9vJyxcbiAgICAgICAgICAgIFZhbHVlOiAnQmFyJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBVbml0OiAnTWlsbGlzZWNvbmRzJyxcbiAgICAgIH1dLFxuICAgICAgRmlsdGVyUGF0dGVybjogJ3sgJC5sYXRlbmN5ID0gXCIqXCIgfScsXG4gICAgICBMb2dHcm91cE5hbWU6IHsgUmVmOiAnTG9nR3JvdXBGNUI0NjkzMScgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnd2l0aCBubyB1bml0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBsb2dHcm91cCA9IG5ldyBMb2dHcm91cChzdGFjaywgJ0xvZ0dyb3VwJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IE1ldHJpY0ZpbHRlcihzdGFjaywgJ1N1YnNjcmlwdGlvbicsIHtcbiAgICAgIGxvZ0dyb3VwLFxuICAgICAgbWV0cmljTmFtZXNwYWNlOiAnQVdTL1Rlc3QnLFxuICAgICAgbWV0cmljTmFtZTogJ0xhdGVuY3knLFxuICAgICAgbWV0cmljVmFsdWU6ICckLmxhdGVuY3knLFxuICAgICAgZmlsdGVyUGF0dGVybjogRmlsdGVyUGF0dGVybi5leGlzdHMoJyQubGF0ZW5jeScpLFxuICAgICAgZGltZW5zaW9uczoge1xuICAgICAgICBGb286ICdCYXInLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMb2dzOjpNZXRyaWNGaWx0ZXInLCB7XG4gICAgICBNZXRyaWNUcmFuc2Zvcm1hdGlvbnM6IFt7XG4gICAgICAgIE1ldHJpY05hbWVzcGFjZTogJ0FXUy9UZXN0JyxcbiAgICAgICAgTWV0cmljTmFtZTogJ0xhdGVuY3knLFxuICAgICAgICBNZXRyaWNWYWx1ZTogJyQubGF0ZW5jeScsXG4gICAgICAgIERpbWVuc2lvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBLZXk6ICdGb28nLFxuICAgICAgICAgICAgVmFsdWU6ICdCYXInLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9XSxcbiAgICAgIEZpbHRlclBhdHRlcm46ICd7ICQubGF0ZW5jeSA9IFwiKlwiIH0nLFxuICAgICAgTG9nR3JvdXBOYW1lOiB7IFJlZjogJ0xvZ0dyb3VwRjVCNDY5MzEnIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=