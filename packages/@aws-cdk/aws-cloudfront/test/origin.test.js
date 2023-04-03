"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const test_origin_1 = require("./test-origin");
let app;
let stack;
beforeEach(() => {
    app = new core_1.App();
    stack = new core_1.Stack(app, 'Stack', {
        env: { account: '1234', region: 'testregion' },
    });
});
test.each([
    core_1.Duration.seconds(0),
    core_1.Duration.seconds(11),
    core_1.Duration.minutes(5),
])('validates connectionTimeout is an int between 1 and 10 seconds - out of bounds', (connectionTimeout) => {
    expect(() => {
        new test_origin_1.TestOrigin('www.example.com', {
            connectionTimeout,
        });
    }).toThrow(`connectionTimeout: Must be an int between 1 and 10 seconds (inclusive); received ${connectionTimeout.toSeconds()}.`);
});
test.each([
    core_1.Duration.seconds(0.5),
    core_1.Duration.seconds(10.5),
])('validates connectionTimeout is an int between 1 and 10 seconds - not an int', (connectionTimeout) => {
    expect(() => {
        new test_origin_1.TestOrigin('www.example.com', {
            connectionTimeout,
        });
    }).toThrow(/must be a whole number of/);
});
test.each([-0.5, 0.5, 1.5, 4])('validates connectionAttempts is an int between 1 and 3', (connectionAttempts) => {
    expect(() => {
        new test_origin_1.TestOrigin('www.example.com', {
            connectionAttempts,
        });
    }).toThrow(`connectionAttempts: Must be an int between 1 and 3 (inclusive); received ${connectionAttempts}.`);
});
test.each(['api', '/api', '/api/', 'api/'])('enforces that originPath starts but does not end, with a /', (originPath) => {
    const origin = new test_origin_1.TestOrigin('www.example.com', {
        originPath,
    });
    const originBindConfig = origin.bind(stack, { originId: '0' });
    expect(originBindConfig.originProperty?.originPath).toEqual('/api');
});
test.each(['us-east-1', 'ap-southeast-2', 'eu-west-3', 'me-south-1'])('ensures that originShieldRegion is a valid aws region', (originShieldRegion) => {
    const origin = new test_origin_1.TestOrigin('www.example.com', {
        originShieldRegion,
    });
    const originBindConfig = origin.bind(stack, { originId: '0' });
    expect(originBindConfig.originProperty?.originShield).toEqual({
        enabled: true,
        originShieldRegion,
    });
});
test('ensures originShield doesnt return false if undefined', () => {
    const origin = new test_origin_1.TestOrigin('www.example.com', {});
    const originBindConfig = origin.bind(stack, { originId: '0' });
    expect(originBindConfig.originProperty?.originShield).toBeUndefined();
});
test('ensures originShield is disabled if originShieldEnabled equals false', () => {
    const origin = new test_origin_1.TestOrigin('www.example.com', {
        originShieldEnabled: false,
    });
    const originBindConfig = origin.bind(stack, { originId: '0' });
    expect(originBindConfig.originProperty?.originShield).toEqual({
        enabled: false,
    });
});
test('throw an error if Custom Headers keys are not permitted', () => {
    // case sensitive
    expect(() => {
        new test_origin_1.TestOrigin('example.com', {
            customHeaders: {
                Host: 'bad',
                Cookie: 'bad',
                Connection: 'bad',
                TS: 'bad',
            },
        });
    }).toThrow(/The following headers cannot be configured as custom origin headers: (.*?)/);
    // case insensitive
    expect(() => {
        new test_origin_1.TestOrigin('example.com', {
            customHeaders: {
                hOst: 'bad',
                cOOkIe: 'bad',
                Connection: 'bad',
                Ts: 'bad',
            },
        });
    }).toThrow(/The following headers cannot be configured as custom origin headers: (.*?)/);
});
test('throw an error if Custom Headers are pre-fixed with non-permitted keys', () => {
    // case sensitive
    expect(() => {
        new test_origin_1.TestOrigin('example.com', {
            customHeaders: {
                'X-Amz-dummy': 'bad',
                'X-Edge-dummy': 'bad',
            },
        });
    }).toThrow(/The following headers cannot be used as prefixes for custom origin headers: (.*?)/);
    // case insensitive
    expect(() => {
        new test_origin_1.TestOrigin('example.com', {
            customHeaders: {
                'x-amZ-dummy': 'bad',
                'x-eDgE-dummy': 'bad',
            },
        });
    }).toThrow(/The following headers cannot be used as prefixes for custom origin headers: (.*?)/);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JpZ2luLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJvcmlnaW4udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUFxRDtBQUNyRCwrQ0FBMkM7QUFFM0MsSUFBSSxHQUFRLENBQUM7QUFDYixJQUFJLEtBQVksQ0FBQztBQUVqQixVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7SUFDaEIsS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUU7UUFDOUIsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFO0tBQy9DLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNSLGVBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ25CLGVBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO0lBQ3BCLGVBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0NBQ3BCLENBQUMsQ0FBQyxnRkFBZ0YsRUFBRSxDQUFDLGlCQUFpQixFQUFFLEVBQUU7SUFDekcsTUFBTSxDQUFDLEdBQUcsRUFBRTtRQUNWLElBQUksd0JBQVUsQ0FBQyxpQkFBaUIsRUFBRTtZQUNoQyxpQkFBaUI7U0FDbEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG9GQUFvRixpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDbkksQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ1IsZUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7SUFDckIsZUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7Q0FDdkIsQ0FBQyxDQUFDLDZFQUE2RSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsRUFBRTtJQUN0RyxNQUFNLENBQUMsR0FBRyxFQUFFO1FBQ1YsSUFBSSx3QkFBVSxDQUFDLGlCQUFpQixFQUFFO1lBQ2hDLGlCQUFpQjtTQUNsQixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUMxQyxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQzdCLHdEQUF3RCxFQUFFLENBQUMsa0JBQWtCLEVBQUUsRUFBRTtJQUNoRixNQUFNLENBQUMsR0FBRyxFQUFFO1FBQ1YsSUFBSSx3QkFBVSxDQUFDLGlCQUFpQixFQUFFO1lBQ2hDLGtCQUFrQjtTQUNuQixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsNEVBQTRFLGtCQUFrQixHQUFHLENBQUMsQ0FBQztBQUNoSCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUMxQyw0REFBNEQsRUFBRSxDQUFDLFVBQVUsRUFBRSxFQUFFO0lBQzVFLE1BQU0sTUFBTSxHQUFHLElBQUksd0JBQVUsQ0FBQyxpQkFBaUIsRUFBRTtRQUMvQyxVQUFVO0tBQ1gsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBRS9ELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RFLENBQUMsQ0FBQyxDQUFDO0FBR0gsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FDcEUsdURBQXVELEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO0lBQy9FLE1BQU0sTUFBTSxHQUFHLElBQUksd0JBQVUsQ0FBQyxpQkFBaUIsRUFBRTtRQUMvQyxrQkFBa0I7S0FDbkIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBRS9ELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQzVELE9BQU8sRUFBRSxJQUFJO1FBQ2Isa0JBQWtCO0tBQ25CLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBR0gsSUFBSSxDQUFDLHVEQUF1RCxFQUFFLEdBQUcsRUFBRTtJQUNqRSxNQUFNLE1BQU0sR0FBRyxJQUFJLHdCQUFVLENBQUMsaUJBQWlCLEVBQUUsRUFFaEQsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBRS9ELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsWUFBWSxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDeEUsQ0FBQyxDQUFDLENBQUM7QUFHSCxJQUFJLENBQUMsc0VBQXNFLEVBQUUsR0FBRyxFQUFFO0lBQ2hGLE1BQU0sTUFBTSxHQUFHLElBQUksd0JBQVUsQ0FBQyxpQkFBaUIsRUFBRTtRQUMvQyxtQkFBbUIsRUFBRSxLQUFLO0tBQzNCLENBQUMsQ0FBQztJQUNILE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUUvRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUM1RCxPQUFPLEVBQUUsS0FBSztLQUNmLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBR0gsSUFBSSxDQUFDLHlEQUF5RCxFQUFFLEdBQUcsRUFBRTtJQUNuRSxpQkFBaUI7SUFDakIsTUFBTSxDQUFDLEdBQUcsRUFBRTtRQUNWLElBQUksd0JBQVUsQ0FBQyxhQUFhLEVBQUU7WUFDNUIsYUFBYSxFQUFFO2dCQUNiLElBQUksRUFBRSxLQUFLO2dCQUNYLE1BQU0sRUFBRSxLQUFLO2dCQUNiLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixFQUFFLEVBQUUsS0FBSzthQUNWO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDRFQUE0RSxDQUFDLENBQUM7SUFFekYsbUJBQW1CO0lBQ25CLE1BQU0sQ0FBQyxHQUFHLEVBQUU7UUFDVixJQUFJLHdCQUFVLENBQUMsYUFBYSxFQUFFO1lBQzVCLGFBQWEsRUFBRTtnQkFDYixJQUFJLEVBQUUsS0FBSztnQkFDWCxNQUFNLEVBQUUsS0FBSztnQkFDYixVQUFVLEVBQUUsS0FBSztnQkFDakIsRUFBRSxFQUFFLEtBQUs7YUFDVjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw0RUFBNEUsQ0FBQyxDQUFDO0FBQzNGLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLHdFQUF3RSxFQUFFLEdBQUcsRUFBRTtJQUNsRixpQkFBaUI7SUFDakIsTUFBTSxDQUFDLEdBQUcsRUFBRTtRQUNWLElBQUksd0JBQVUsQ0FBQyxhQUFhLEVBQUU7WUFDNUIsYUFBYSxFQUFFO2dCQUNiLGFBQWEsRUFBRSxLQUFLO2dCQUNwQixjQUFjLEVBQUUsS0FBSzthQUN0QjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtRkFBbUYsQ0FBQyxDQUFDO0lBRWhHLG1CQUFtQjtJQUNuQixNQUFNLENBQUMsR0FBRyxFQUFFO1FBQ1YsSUFBSSx3QkFBVSxDQUFDLGFBQWEsRUFBRTtZQUM1QixhQUFhLEVBQUU7Z0JBQ2IsYUFBYSxFQUFFLEtBQUs7Z0JBQ3BCLGNBQWMsRUFBRSxLQUFLO2FBQ3RCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG1GQUFtRixDQUFDLENBQUM7QUFDbEcsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIFN0YWNrLCBEdXJhdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgVGVzdE9yaWdpbiB9IGZyb20gJy4vdGVzdC1vcmlnaW4nO1xuXG5sZXQgYXBwOiBBcHA7XG5sZXQgc3RhY2s6IFN0YWNrO1xuXG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgYXBwID0gbmV3IEFwcCgpO1xuICBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjaycsIHtcbiAgICBlbnY6IHsgYWNjb3VudDogJzEyMzQnLCByZWdpb246ICd0ZXN0cmVnaW9uJyB9LFxuICB9KTtcbn0pO1xuXG50ZXN0LmVhY2goW1xuICBEdXJhdGlvbi5zZWNvbmRzKDApLFxuICBEdXJhdGlvbi5zZWNvbmRzKDExKSxcbiAgRHVyYXRpb24ubWludXRlcyg1KSxcbl0pKCd2YWxpZGF0ZXMgY29ubmVjdGlvblRpbWVvdXQgaXMgYW4gaW50IGJldHdlZW4gMSBhbmQgMTAgc2Vjb25kcyAtIG91dCBvZiBib3VuZHMnLCAoY29ubmVjdGlvblRpbWVvdXQpID0+IHtcbiAgZXhwZWN0KCgpID0+IHtcbiAgICBuZXcgVGVzdE9yaWdpbignd3d3LmV4YW1wbGUuY29tJywge1xuICAgICAgY29ubmVjdGlvblRpbWVvdXQsXG4gICAgfSk7XG4gIH0pLnRvVGhyb3coYGNvbm5lY3Rpb25UaW1lb3V0OiBNdXN0IGJlIGFuIGludCBiZXR3ZWVuIDEgYW5kIDEwIHNlY29uZHMgKGluY2x1c2l2ZSk7IHJlY2VpdmVkICR7Y29ubmVjdGlvblRpbWVvdXQudG9TZWNvbmRzKCl9LmApO1xufSk7XG5cbnRlc3QuZWFjaChbXG4gIER1cmF0aW9uLnNlY29uZHMoMC41KSxcbiAgRHVyYXRpb24uc2Vjb25kcygxMC41KSxcbl0pKCd2YWxpZGF0ZXMgY29ubmVjdGlvblRpbWVvdXQgaXMgYW4gaW50IGJldHdlZW4gMSBhbmQgMTAgc2Vjb25kcyAtIG5vdCBhbiBpbnQnLCAoY29ubmVjdGlvblRpbWVvdXQpID0+IHtcbiAgZXhwZWN0KCgpID0+IHtcbiAgICBuZXcgVGVzdE9yaWdpbignd3d3LmV4YW1wbGUuY29tJywge1xuICAgICAgY29ubmVjdGlvblRpbWVvdXQsXG4gICAgfSk7XG4gIH0pLnRvVGhyb3coL211c3QgYmUgYSB3aG9sZSBudW1iZXIgb2YvKTtcbn0pO1xuXG50ZXN0LmVhY2goWy0wLjUsIDAuNSwgMS41LCA0XSlcbigndmFsaWRhdGVzIGNvbm5lY3Rpb25BdHRlbXB0cyBpcyBhbiBpbnQgYmV0d2VlbiAxIGFuZCAzJywgKGNvbm5lY3Rpb25BdHRlbXB0cykgPT4ge1xuICBleHBlY3QoKCkgPT4ge1xuICAgIG5ldyBUZXN0T3JpZ2luKCd3d3cuZXhhbXBsZS5jb20nLCB7XG4gICAgICBjb25uZWN0aW9uQXR0ZW1wdHMsXG4gICAgfSk7XG4gIH0pLnRvVGhyb3coYGNvbm5lY3Rpb25BdHRlbXB0czogTXVzdCBiZSBhbiBpbnQgYmV0d2VlbiAxIGFuZCAzIChpbmNsdXNpdmUpOyByZWNlaXZlZCAke2Nvbm5lY3Rpb25BdHRlbXB0c30uYCk7XG59KTtcblxudGVzdC5lYWNoKFsnYXBpJywgJy9hcGknLCAnL2FwaS8nLCAnYXBpLyddKVxuKCdlbmZvcmNlcyB0aGF0IG9yaWdpblBhdGggc3RhcnRzIGJ1dCBkb2VzIG5vdCBlbmQsIHdpdGggYSAvJywgKG9yaWdpblBhdGgpID0+IHtcbiAgY29uc3Qgb3JpZ2luID0gbmV3IFRlc3RPcmlnaW4oJ3d3dy5leGFtcGxlLmNvbScsIHtcbiAgICBvcmlnaW5QYXRoLFxuICB9KTtcbiAgY29uc3Qgb3JpZ2luQmluZENvbmZpZyA9IG9yaWdpbi5iaW5kKHN0YWNrLCB7IG9yaWdpbklkOiAnMCcgfSk7XG5cbiAgZXhwZWN0KG9yaWdpbkJpbmRDb25maWcub3JpZ2luUHJvcGVydHk/Lm9yaWdpblBhdGgpLnRvRXF1YWwoJy9hcGknKTtcbn0pO1xuXG5cbnRlc3QuZWFjaChbJ3VzLWVhc3QtMScsICdhcC1zb3V0aGVhc3QtMicsICdldS13ZXN0LTMnLCAnbWUtc291dGgtMSddKVxuKCdlbnN1cmVzIHRoYXQgb3JpZ2luU2hpZWxkUmVnaW9uIGlzIGEgdmFsaWQgYXdzIHJlZ2lvbicsIChvcmlnaW5TaGllbGRSZWdpb24pID0+IHtcbiAgY29uc3Qgb3JpZ2luID0gbmV3IFRlc3RPcmlnaW4oJ3d3dy5leGFtcGxlLmNvbScsIHtcbiAgICBvcmlnaW5TaGllbGRSZWdpb24sXG4gIH0pO1xuICBjb25zdCBvcmlnaW5CaW5kQ29uZmlnID0gb3JpZ2luLmJpbmQoc3RhY2ssIHsgb3JpZ2luSWQ6ICcwJyB9KTtcblxuICBleHBlY3Qob3JpZ2luQmluZENvbmZpZy5vcmlnaW5Qcm9wZXJ0eT8ub3JpZ2luU2hpZWxkKS50b0VxdWFsKHtcbiAgICBlbmFibGVkOiB0cnVlLFxuICAgIG9yaWdpblNoaWVsZFJlZ2lvbixcbiAgfSk7XG59KTtcblxuXG50ZXN0KCdlbnN1cmVzIG9yaWdpblNoaWVsZCBkb2VzbnQgcmV0dXJuIGZhbHNlIGlmIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgY29uc3Qgb3JpZ2luID0gbmV3IFRlc3RPcmlnaW4oJ3d3dy5leGFtcGxlLmNvbScsIHtcblxuICB9KTtcbiAgY29uc3Qgb3JpZ2luQmluZENvbmZpZyA9IG9yaWdpbi5iaW5kKHN0YWNrLCB7IG9yaWdpbklkOiAnMCcgfSk7XG5cbiAgZXhwZWN0KG9yaWdpbkJpbmRDb25maWcub3JpZ2luUHJvcGVydHk/Lm9yaWdpblNoaWVsZCkudG9CZVVuZGVmaW5lZCgpO1xufSk7XG5cblxudGVzdCgnZW5zdXJlcyBvcmlnaW5TaGllbGQgaXMgZGlzYWJsZWQgaWYgb3JpZ2luU2hpZWxkRW5hYmxlZCBlcXVhbHMgZmFsc2UnLCAoKSA9PiB7XG4gIGNvbnN0IG9yaWdpbiA9IG5ldyBUZXN0T3JpZ2luKCd3d3cuZXhhbXBsZS5jb20nLCB7XG4gICAgb3JpZ2luU2hpZWxkRW5hYmxlZDogZmFsc2UsXG4gIH0pO1xuICBjb25zdCBvcmlnaW5CaW5kQ29uZmlnID0gb3JpZ2luLmJpbmQoc3RhY2ssIHsgb3JpZ2luSWQ6ICcwJyB9KTtcblxuICBleHBlY3Qob3JpZ2luQmluZENvbmZpZy5vcmlnaW5Qcm9wZXJ0eT8ub3JpZ2luU2hpZWxkKS50b0VxdWFsKHtcbiAgICBlbmFibGVkOiBmYWxzZSxcbiAgfSk7XG59KTtcblxuXG50ZXN0KCd0aHJvdyBhbiBlcnJvciBpZiBDdXN0b20gSGVhZGVycyBrZXlzIGFyZSBub3QgcGVybWl0dGVkJywgKCkgPT4ge1xuICAvLyBjYXNlIHNlbnNpdGl2ZVxuICBleHBlY3QoKCkgPT4ge1xuICAgIG5ldyBUZXN0T3JpZ2luKCdleGFtcGxlLmNvbScsIHtcbiAgICAgIGN1c3RvbUhlYWRlcnM6IHtcbiAgICAgICAgSG9zdDogJ2JhZCcsXG4gICAgICAgIENvb2tpZTogJ2JhZCcsXG4gICAgICAgIENvbm5lY3Rpb246ICdiYWQnLFxuICAgICAgICBUUzogJ2JhZCcsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KS50b1Rocm93KC9UaGUgZm9sbG93aW5nIGhlYWRlcnMgY2Fubm90IGJlIGNvbmZpZ3VyZWQgYXMgY3VzdG9tIG9yaWdpbiBoZWFkZXJzOiAoLio/KS8pO1xuXG4gIC8vIGNhc2UgaW5zZW5zaXRpdmVcbiAgZXhwZWN0KCgpID0+IHtcbiAgICBuZXcgVGVzdE9yaWdpbignZXhhbXBsZS5jb20nLCB7XG4gICAgICBjdXN0b21IZWFkZXJzOiB7XG4gICAgICAgIGhPc3Q6ICdiYWQnLFxuICAgICAgICBjT09rSWU6ICdiYWQnLFxuICAgICAgICBDb25uZWN0aW9uOiAnYmFkJyxcbiAgICAgICAgVHM6ICdiYWQnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSkudG9UaHJvdygvVGhlIGZvbGxvd2luZyBoZWFkZXJzIGNhbm5vdCBiZSBjb25maWd1cmVkIGFzIGN1c3RvbSBvcmlnaW4gaGVhZGVyczogKC4qPykvKTtcbn0pO1xuXG50ZXN0KCd0aHJvdyBhbiBlcnJvciBpZiBDdXN0b20gSGVhZGVycyBhcmUgcHJlLWZpeGVkIHdpdGggbm9uLXBlcm1pdHRlZCBrZXlzJywgKCkgPT4ge1xuICAvLyBjYXNlIHNlbnNpdGl2ZVxuICBleHBlY3QoKCkgPT4ge1xuICAgIG5ldyBUZXN0T3JpZ2luKCdleGFtcGxlLmNvbScsIHtcbiAgICAgIGN1c3RvbUhlYWRlcnM6IHtcbiAgICAgICAgJ1gtQW16LWR1bW15JzogJ2JhZCcsXG4gICAgICAgICdYLUVkZ2UtZHVtbXknOiAnYmFkJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pLnRvVGhyb3coL1RoZSBmb2xsb3dpbmcgaGVhZGVycyBjYW5ub3QgYmUgdXNlZCBhcyBwcmVmaXhlcyBmb3IgY3VzdG9tIG9yaWdpbiBoZWFkZXJzOiAoLio/KS8pO1xuXG4gIC8vIGNhc2UgaW5zZW5zaXRpdmVcbiAgZXhwZWN0KCgpID0+IHtcbiAgICBuZXcgVGVzdE9yaWdpbignZXhhbXBsZS5jb20nLCB7XG4gICAgICBjdXN0b21IZWFkZXJzOiB7XG4gICAgICAgICd4LWFtWi1kdW1teSc6ICdiYWQnLFxuICAgICAgICAneC1lRGdFLWR1bW15JzogJ2JhZCcsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KS50b1Rocm93KC9UaGUgZm9sbG93aW5nIGhlYWRlcnMgY2Fubm90IGJlIHVzZWQgYXMgcHJlZml4ZXMgZm9yIGN1c3RvbSBvcmlnaW4gaGVhZGVyczogKC4qPykvKTtcbn0pO1xuIl19