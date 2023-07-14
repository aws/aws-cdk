"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
test('format', () => {
    expect(lib_1.EnvironmentUtils.format('my-account', 'my-region')).toBe('aws://my-account/my-region');
});
test('parse', () => {
    expect(lib_1.EnvironmentUtils.parse('aws://123456789/us-east-1')).toStrictEqual({
        name: 'aws://123456789/us-east-1',
        account: '123456789',
        region: 'us-east-1',
    });
    // parser is not super strict to allow users to do some magical things if they want
    expect(lib_1.EnvironmentUtils.parse('aws://boom@voom.com/ok-x-x-123')).toStrictEqual({
        name: 'aws://boom@voom.com/ok-x-x-123',
        account: 'boom@voom.com',
        region: 'ok-x-x-123',
    });
});
test('parse failures', () => {
    expect(() => lib_1.EnvironmentUtils.parse('boom')).toThrow('Unable to parse environment specification');
    expect(() => lib_1.EnvironmentUtils.parse('boom://boom/boom')).toThrow('Unable to parse environment specification');
    expect(() => lib_1.EnvironmentUtils.parse('boom://xx//xz/x/boom')).toThrow('Unable to parse environment specification');
    expect(() => lib_1.EnvironmentUtils.parse('aws:://998988383/fu-x-x')).toThrow('Unable to parse environment specification');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52aXJvbm1lbnQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVudmlyb25tZW50LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnQ0FBMEM7QUFFMUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDbEIsTUFBTSxDQUFDLHNCQUFnQixDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUNoRyxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ2pCLE1BQU0sQ0FBQyxzQkFBZ0IsQ0FBQyxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQztRQUN4RSxJQUFJLEVBQUUsMkJBQTJCO1FBQ2pDLE9BQU8sRUFBRSxXQUFXO1FBQ3BCLE1BQU0sRUFBRSxXQUFXO0tBQ3BCLENBQUMsQ0FBQztJQUVILG1GQUFtRjtJQUNuRixNQUFNLENBQUMsc0JBQWdCLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUM7UUFDN0UsSUFBSSxFQUFFLGdDQUFnQztRQUN0QyxPQUFPLEVBQUUsZUFBZTtRQUN4QixNQUFNLEVBQUUsWUFBWTtLQUNyQixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7SUFDMUIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLHNCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0lBQ2xHLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxzQkFBZ0IsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0lBQzlHLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxzQkFBZ0IsQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0lBQ2xILE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxzQkFBZ0IsQ0FBQyxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0FBQ3ZILENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW52aXJvbm1lbnRVdGlscyB9IGZyb20gJy4uL2xpYic7XG5cbnRlc3QoJ2Zvcm1hdCcsICgpID0+IHtcbiAgZXhwZWN0KEVudmlyb25tZW50VXRpbHMuZm9ybWF0KCdteS1hY2NvdW50JywgJ215LXJlZ2lvbicpKS50b0JlKCdhd3M6Ly9teS1hY2NvdW50L215LXJlZ2lvbicpO1xufSk7XG5cbnRlc3QoJ3BhcnNlJywgKCkgPT4ge1xuICBleHBlY3QoRW52aXJvbm1lbnRVdGlscy5wYXJzZSgnYXdzOi8vMTIzNDU2Nzg5L3VzLWVhc3QtMScpKS50b1N0cmljdEVxdWFsKHtcbiAgICBuYW1lOiAnYXdzOi8vMTIzNDU2Nzg5L3VzLWVhc3QtMScsXG4gICAgYWNjb3VudDogJzEyMzQ1Njc4OScsXG4gICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgfSk7XG5cbiAgLy8gcGFyc2VyIGlzIG5vdCBzdXBlciBzdHJpY3QgdG8gYWxsb3cgdXNlcnMgdG8gZG8gc29tZSBtYWdpY2FsIHRoaW5ncyBpZiB0aGV5IHdhbnRcbiAgZXhwZWN0KEVudmlyb25tZW50VXRpbHMucGFyc2UoJ2F3czovL2Jvb21Adm9vbS5jb20vb2steC14LTEyMycpKS50b1N0cmljdEVxdWFsKHtcbiAgICBuYW1lOiAnYXdzOi8vYm9vbUB2b29tLmNvbS9vay14LXgtMTIzJyxcbiAgICBhY2NvdW50OiAnYm9vbUB2b29tLmNvbScsXG4gICAgcmVnaW9uOiAnb2steC14LTEyMycsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3BhcnNlIGZhaWx1cmVzJywgKCkgPT4ge1xuICBleHBlY3QoKCkgPT4gRW52aXJvbm1lbnRVdGlscy5wYXJzZSgnYm9vbScpKS50b1Rocm93KCdVbmFibGUgdG8gcGFyc2UgZW52aXJvbm1lbnQgc3BlY2lmaWNhdGlvbicpO1xuICBleHBlY3QoKCkgPT4gRW52aXJvbm1lbnRVdGlscy5wYXJzZSgnYm9vbTovL2Jvb20vYm9vbScpKS50b1Rocm93KCdVbmFibGUgdG8gcGFyc2UgZW52aXJvbm1lbnQgc3BlY2lmaWNhdGlvbicpO1xuICBleHBlY3QoKCkgPT4gRW52aXJvbm1lbnRVdGlscy5wYXJzZSgnYm9vbTovL3h4Ly94ei94L2Jvb20nKSkudG9UaHJvdygnVW5hYmxlIHRvIHBhcnNlIGVudmlyb25tZW50IHNwZWNpZmljYXRpb24nKTtcbiAgZXhwZWN0KCgpID0+IEVudmlyb25tZW50VXRpbHMucGFyc2UoJ2F3czo6Ly85OTg5ODgzODMvZnUteC14JykpLnRvVGhyb3coJ1VuYWJsZSB0byBwYXJzZSBlbnZpcm9ubWVudCBzcGVjaWZpY2F0aW9uJyk7XG59KTsiXX0=