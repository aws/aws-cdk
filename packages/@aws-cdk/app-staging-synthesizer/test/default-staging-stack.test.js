"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
describe('default staging stack', () => {
    describe('appId fails', () => {
        test('when appId > 20 characters', () => {
            const app = new aws_cdk_lib_1.App();
            expect(() => new lib_1.DefaultStagingStack(app, 'stack', {
                appId: 'a'.repeat(21),
                qualifier: 'qualifier',
            })).toThrowError(/appId expected no more than 20 characters but got 21 characters./);
        });
        test('when uppercase characters are used', () => {
            const app = new aws_cdk_lib_1.App();
            expect(() => new lib_1.DefaultStagingStack(app, 'stack', {
                appId: 'ABCDEF',
                qualifier: 'qualifier',
            })).toThrowError(/appId only accepts lowercase characters./);
        });
        test('when symbols are used', () => {
            const app = new aws_cdk_lib_1.App();
            expect(() => new lib_1.DefaultStagingStack(app, 'stack', {
                appId: 'ca$h',
                qualifier: 'qualifier',
            })).toThrowError(/appId expects only letters, numbers, and dashes \('-'\)/);
        });
        test('when multiple rules broken at once', () => {
            const app = new aws_cdk_lib_1.App();
            const appId = 'AB&C'.repeat(10);
            expect(() => new lib_1.DefaultStagingStack(app, 'stack', {
                appId,
                qualifier: 'qualifier',
            })).toThrowError([
                `appId ${appId} has errors:`,
                'appId expected no more than 20 characters but got 40 characters.',
                'appId only accepts lowercase characters.',
                'appId expects only letters, numbers, and dashes (\'-\')',
            ].join('\n'));
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1zdGFnaW5nLXN0YWNrLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkZWZhdWx0LXN0YWdpbmctc3RhY2sudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdDQUE2QztBQUM3Qyw2Q0FBa0M7QUFFbEMsUUFBUSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRTtJQUNyQyxRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtRQUMzQixJQUFJLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFO1lBQ3RDLE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLHlCQUFtQixDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUU7Z0JBQ2pELEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztnQkFDckIsU0FBUyxFQUFFLFdBQVc7YUFDdkIsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLGtFQUFrRSxDQUFDLENBQUM7UUFDdkYsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO1lBQzlDLE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLHlCQUFtQixDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUU7Z0JBQ2pELEtBQUssRUFBRSxRQUFRO2dCQUNmLFNBQVMsRUFBRSxXQUFXO2FBQ3ZCLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO1FBQy9ELENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRTtZQUNqQyxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztZQUN0QixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSx5QkFBbUIsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFO2dCQUNqRCxLQUFLLEVBQUUsTUFBTTtnQkFDYixTQUFTLEVBQUUsV0FBVzthQUN2QixDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMseURBQXlELENBQUMsQ0FBQztRQUM5RSxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUU7WUFDOUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7WUFDdEIsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSx5QkFBbUIsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFO2dCQUNqRCxLQUFLO2dCQUNMLFNBQVMsRUFBRSxXQUFXO2FBQ3ZCLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQztnQkFDZixTQUFTLEtBQUssY0FBYztnQkFDNUIsa0VBQWtFO2dCQUNsRSwwQ0FBMEM7Z0JBQzFDLHlEQUF5RDthQUMxRCxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERlZmF1bHRTdGFnaW5nU3RhY2sgfSBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgQXBwIH0gZnJvbSAnYXdzLWNkay1saWInO1xuXG5kZXNjcmliZSgnZGVmYXVsdCBzdGFnaW5nIHN0YWNrJywgKCkgPT4ge1xuICBkZXNjcmliZSgnYXBwSWQgZmFpbHMnLCAoKSA9PiB7XG4gICAgdGVzdCgnd2hlbiBhcHBJZCA+IDIwIGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgICBleHBlY3QoKCkgPT4gbmV3IERlZmF1bHRTdGFnaW5nU3RhY2soYXBwLCAnc3RhY2snLCB7XG4gICAgICAgIGFwcElkOiAnYScucmVwZWF0KDIxKSxcbiAgICAgICAgcXVhbGlmaWVyOiAncXVhbGlmaWVyJyxcbiAgICAgIH0pKS50b1Rocm93RXJyb3IoL2FwcElkIGV4cGVjdGVkIG5vIG1vcmUgdGhhbiAyMCBjaGFyYWN0ZXJzIGJ1dCBnb3QgMjEgY2hhcmFjdGVycy4vKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3doZW4gdXBwZXJjYXNlIGNoYXJhY3RlcnMgYXJlIHVzZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgICBleHBlY3QoKCkgPT4gbmV3IERlZmF1bHRTdGFnaW5nU3RhY2soYXBwLCAnc3RhY2snLCB7XG4gICAgICAgIGFwcElkOiAnQUJDREVGJyxcbiAgICAgICAgcXVhbGlmaWVyOiAncXVhbGlmaWVyJyxcbiAgICAgIH0pKS50b1Rocm93RXJyb3IoL2FwcElkIG9ubHkgYWNjZXB0cyBsb3dlcmNhc2UgY2hhcmFjdGVycy4vKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3doZW4gc3ltYm9scyBhcmUgdXNlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICAgIGV4cGVjdCgoKSA9PiBuZXcgRGVmYXVsdFN0YWdpbmdTdGFjayhhcHAsICdzdGFjaycsIHtcbiAgICAgICAgYXBwSWQ6ICdjYSRoJyxcbiAgICAgICAgcXVhbGlmaWVyOiAncXVhbGlmaWVyJyxcbiAgICAgIH0pKS50b1Rocm93RXJyb3IoL2FwcElkIGV4cGVjdHMgb25seSBsZXR0ZXJzLCBudW1iZXJzLCBhbmQgZGFzaGVzIFxcKCctJ1xcKS8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnd2hlbiBtdWx0aXBsZSBydWxlcyBicm9rZW4gYXQgb25jZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICAgIGNvbnN0IGFwcElkID0gJ0FCJkMnLnJlcGVhdCgxMCk7XG4gICAgICBleHBlY3QoKCkgPT4gbmV3IERlZmF1bHRTdGFnaW5nU3RhY2soYXBwLCAnc3RhY2snLCB7XG4gICAgICAgIGFwcElkLFxuICAgICAgICBxdWFsaWZpZXI6ICdxdWFsaWZpZXInLFxuICAgICAgfSkpLnRvVGhyb3dFcnJvcihbXG4gICAgICAgIGBhcHBJZCAke2FwcElkfSBoYXMgZXJyb3JzOmAsXG4gICAgICAgICdhcHBJZCBleHBlY3RlZCBubyBtb3JlIHRoYW4gMjAgY2hhcmFjdGVycyBidXQgZ290IDQwIGNoYXJhY3RlcnMuJyxcbiAgICAgICAgJ2FwcElkIG9ubHkgYWNjZXB0cyBsb3dlcmNhc2UgY2hhcmFjdGVycy4nLFxuICAgICAgICAnYXBwSWQgZXhwZWN0cyBvbmx5IGxldHRlcnMsIG51bWJlcnMsIGFuZCBkYXNoZXMgKFxcJy1cXCcpJyxcbiAgICAgIF0uam9pbignXFxuJykpO1xuICAgIH0pO1xuICB9KTtcbn0pOyJdfQ==