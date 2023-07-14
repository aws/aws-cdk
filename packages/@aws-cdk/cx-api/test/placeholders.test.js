"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
test('complex placeholder substitution', async () => {
    const replacer = {
        accountId: () => Promise.resolve('current_account'),
        region: () => Promise.resolve('current_region'),
        partition: () => Promise.resolve('current_partition'),
    };
    expect(await lib_1.EnvironmentPlaceholders.replaceAsync({
        destinations: {
            theDestination: {
                assumeRoleArn: 'arn:${AWS::Partition}:role-${AWS::AccountId}',
                bucketName: 'some_bucket-${AWS::AccountId}-${AWS::Region}',
                objectKey: 'some_key-${AWS::AccountId}-${AWS::Region}',
            },
        },
    }, replacer)).toEqual({
        destinations: {
            theDestination: {
                assumeRoleArn: 'arn:current_partition:role-current_account',
                bucketName: 'some_bucket-current_account-current_region',
                objectKey: 'some_key-current_account-current_region',
            },
        },
    });
});
test('sync placeholder substitution', () => {
    const replacer = {
        accountId: 'current_account',
        region: 'current_region',
        partition: 'current_partition',
    };
    expect(lib_1.EnvironmentPlaceholders.replace({
        destinations: {
            theDestination: {
                assumeRoleArn: 'arn:${AWS::Partition}:role-${AWS::AccountId}',
                bucketName: 'some_bucket-${AWS::AccountId}-${AWS::Region}',
                objectKey: 'some_key-${AWS::AccountId}-${AWS::Region}',
            },
        },
    }, replacer)).toEqual({
        destinations: {
            theDestination: {
                assumeRoleArn: 'arn:current_partition:role-current_account',
                bucketName: 'some_bucket-current_account-current_region',
                objectKey: 'some_key-current_account-current_region',
            },
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGxhY2Vob2xkZXJzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwbGFjZWhvbGRlcnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdDQUFnSDtBQUVoSCxJQUFJLENBQUMsa0NBQWtDLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDbEQsTUFBTSxRQUFRLEdBQW9DO1FBQ2hELFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDO1FBQ25ELE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDO1FBQy9DLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDO0tBQ3RELENBQUM7SUFFRixNQUFNLENBQUMsTUFBTSw2QkFBdUIsQ0FBQyxZQUFZLENBQUM7UUFDaEQsWUFBWSxFQUFFO1lBQ1osY0FBYyxFQUFFO2dCQUNkLGFBQWEsRUFBRSw4Q0FBOEM7Z0JBQzdELFVBQVUsRUFBRSw4Q0FBOEM7Z0JBQzFELFNBQVMsRUFBRSwyQ0FBMkM7YUFDdkQ7U0FDRjtLQUNGLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDcEIsWUFBWSxFQUFFO1lBQ1osY0FBYyxFQUFFO2dCQUNkLGFBQWEsRUFBRSw0Q0FBNEM7Z0JBQzNELFVBQVUsRUFBRSw0Q0FBNEM7Z0JBQ3hELFNBQVMsRUFBRSx5Q0FBeUM7YUFDckQ7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtJQUN6QyxNQUFNLFFBQVEsR0FBaUM7UUFDN0MsU0FBUyxFQUFFLGlCQUFpQjtRQUM1QixNQUFNLEVBQUUsZ0JBQWdCO1FBQ3hCLFNBQVMsRUFBRSxtQkFBbUI7S0FDL0IsQ0FBQztJQUVGLE1BQU0sQ0FBQyw2QkFBdUIsQ0FBQyxPQUFPLENBQUM7UUFDckMsWUFBWSxFQUFFO1lBQ1osY0FBYyxFQUFFO2dCQUNkLGFBQWEsRUFBRSw4Q0FBOEM7Z0JBQzdELFVBQVUsRUFBRSw4Q0FBOEM7Z0JBQzFELFNBQVMsRUFBRSwyQ0FBMkM7YUFDdkQ7U0FDRjtLQUNGLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDcEIsWUFBWSxFQUFFO1lBQ1osY0FBYyxFQUFFO2dCQUNkLGFBQWEsRUFBRSw0Q0FBNEM7Z0JBQzNELFVBQVUsRUFBRSw0Q0FBNEM7Z0JBQ3hELFNBQVMsRUFBRSx5Q0FBeUM7YUFDckQ7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW52aXJvbm1lbnRQbGFjZWhvbGRlcnMsIEVudmlyb25tZW50UGxhY2Vob2xkZXJWYWx1ZXMsIElFbnZpcm9ubWVudFBsYWNlaG9sZGVyUHJvdmlkZXIgfSBmcm9tICcuLi9saWInO1xuXG50ZXN0KCdjb21wbGV4IHBsYWNlaG9sZGVyIHN1YnN0aXR1dGlvbicsIGFzeW5jICgpID0+IHtcbiAgY29uc3QgcmVwbGFjZXI6IElFbnZpcm9ubWVudFBsYWNlaG9sZGVyUHJvdmlkZXIgPSB7XG4gICAgYWNjb3VudElkOiAoKSA9PiBQcm9taXNlLnJlc29sdmUoJ2N1cnJlbnRfYWNjb3VudCcpLFxuICAgIHJlZ2lvbjogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCdjdXJyZW50X3JlZ2lvbicpLFxuICAgIHBhcnRpdGlvbjogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCdjdXJyZW50X3BhcnRpdGlvbicpLFxuICB9O1xuXG4gIGV4cGVjdChhd2FpdCBFbnZpcm9ubWVudFBsYWNlaG9sZGVycy5yZXBsYWNlQXN5bmMoe1xuICAgIGRlc3RpbmF0aW9uczoge1xuICAgICAgdGhlRGVzdGluYXRpb246IHtcbiAgICAgICAgYXNzdW1lUm9sZUFybjogJ2Fybjoke0FXUzo6UGFydGl0aW9ufTpyb2xlLSR7QVdTOjpBY2NvdW50SWR9JyxcbiAgICAgICAgYnVja2V0TmFtZTogJ3NvbWVfYnVja2V0LSR7QVdTOjpBY2NvdW50SWR9LSR7QVdTOjpSZWdpb259JyxcbiAgICAgICAgb2JqZWN0S2V5OiAnc29tZV9rZXktJHtBV1M6OkFjY291bnRJZH0tJHtBV1M6OlJlZ2lvbn0nLFxuICAgICAgfSxcbiAgICB9LFxuICB9LCByZXBsYWNlcikpLnRvRXF1YWwoe1xuICAgIGRlc3RpbmF0aW9uczoge1xuICAgICAgdGhlRGVzdGluYXRpb246IHtcbiAgICAgICAgYXNzdW1lUm9sZUFybjogJ2FybjpjdXJyZW50X3BhcnRpdGlvbjpyb2xlLWN1cnJlbnRfYWNjb3VudCcsXG4gICAgICAgIGJ1Y2tldE5hbWU6ICdzb21lX2J1Y2tldC1jdXJyZW50X2FjY291bnQtY3VycmVudF9yZWdpb24nLFxuICAgICAgICBvYmplY3RLZXk6ICdzb21lX2tleS1jdXJyZW50X2FjY291bnQtY3VycmVudF9yZWdpb24nLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdzeW5jIHBsYWNlaG9sZGVyIHN1YnN0aXR1dGlvbicsICgpID0+IHtcbiAgY29uc3QgcmVwbGFjZXI6IEVudmlyb25tZW50UGxhY2Vob2xkZXJWYWx1ZXMgPSB7XG4gICAgYWNjb3VudElkOiAnY3VycmVudF9hY2NvdW50JyxcbiAgICByZWdpb246ICdjdXJyZW50X3JlZ2lvbicsXG4gICAgcGFydGl0aW9uOiAnY3VycmVudF9wYXJ0aXRpb24nLFxuICB9O1xuXG4gIGV4cGVjdChFbnZpcm9ubWVudFBsYWNlaG9sZGVycy5yZXBsYWNlKHtcbiAgICBkZXN0aW5hdGlvbnM6IHtcbiAgICAgIHRoZURlc3RpbmF0aW9uOiB7XG4gICAgICAgIGFzc3VtZVJvbGVBcm46ICdhcm46JHtBV1M6OlBhcnRpdGlvbn06cm9sZS0ke0FXUzo6QWNjb3VudElkfScsXG4gICAgICAgIGJ1Y2tldE5hbWU6ICdzb21lX2J1Y2tldC0ke0FXUzo6QWNjb3VudElkfS0ke0FXUzo6UmVnaW9ufScsXG4gICAgICAgIG9iamVjdEtleTogJ3NvbWVfa2V5LSR7QVdTOjpBY2NvdW50SWR9LSR7QVdTOjpSZWdpb259JyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSwgcmVwbGFjZXIpKS50b0VxdWFsKHtcbiAgICBkZXN0aW5hdGlvbnM6IHtcbiAgICAgIHRoZURlc3RpbmF0aW9uOiB7XG4gICAgICAgIGFzc3VtZVJvbGVBcm46ICdhcm46Y3VycmVudF9wYXJ0aXRpb246cm9sZS1jdXJyZW50X2FjY291bnQnLFxuICAgICAgICBidWNrZXROYW1lOiAnc29tZV9idWNrZXQtY3VycmVudF9hY2NvdW50LWN1cnJlbnRfcmVnaW9uJyxcbiAgICAgICAgb2JqZWN0S2V5OiAnc29tZV9rZXktY3VycmVudF9hY2NvdW50LWN1cnJlbnRfcmVnaW9uJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG5cbn0pO1xuIl19