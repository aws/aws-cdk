"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
// eslint-disable-next-line max-len
const lib_1 = require("../lib");
/**
 * A load balancer that can host a VPC Endpoint Service
 */
class DummyEndpointLoadBalacer {
    constructor(arn) {
        this.loadBalancerArn = arn;
    }
}
describe('vpc endpoint service', () => {
    describe('test vpc endpoint service', () => {
        test('create endpoint service with no principals', () => {
            // GIVEN
            const stack = new core_1.Stack();
            new lib_1.Vpc(stack, 'MyVPC');
            // WHEN
            const lb = new DummyEndpointLoadBalacer('arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a');
            new lib_1.VpcEndpointService(stack, 'EndpointService', {
                vpcEndpointServiceLoadBalancers: [lb],
                acceptanceRequired: false,
                allowedPrincipals: [new aws_iam_1.ArnPrincipal('arn:aws:iam::123456789012:root')],
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpointService', {
                NetworkLoadBalancerArns: ['arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a'],
                AcceptanceRequired: false,
            });
            const servicePermissions = assertions_1.Template.fromStack(stack).findResources('AWS::EC2::VPCEndpointServicePermissions', {
                ServiceId: {
                    Ref: 'EndpointServiceED36BE1F',
                },
                AllowedPrincipals: [],
            });
            expect(Object.keys(servicePermissions).length).toBe(0);
        });
        test('create endpoint service with a principal', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            const lb = new DummyEndpointLoadBalacer('arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a');
            new lib_1.VpcEndpointService(stack, 'EndpointService', {
                vpcEndpointServiceLoadBalancers: [lb],
                acceptanceRequired: false,
                allowedPrincipals: [new aws_iam_1.ArnPrincipal('arn:aws:iam::123456789012:root')],
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpointService', {
                NetworkLoadBalancerArns: ['arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a'],
                AcceptanceRequired: false,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpointServicePermissions', {
                ServiceId: {
                    Ref: 'EndpointServiceED36BE1F',
                },
                AllowedPrincipals: ['arn:aws:iam::123456789012:root'],
            });
        });
        test('with acceptance requried', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            const lb = new DummyEndpointLoadBalacer('arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a');
            new lib_1.VpcEndpointService(stack, 'EndpointService', {
                vpcEndpointServiceLoadBalancers: [lb],
                acceptanceRequired: true,
                allowedPrincipals: [new aws_iam_1.ArnPrincipal('arn:aws:iam::123456789012:root')],
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpointService', {
                NetworkLoadBalancerArns: ['arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a'],
                AcceptanceRequired: true,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::VPCEndpointServicePermissions', {
                ServiceId: {
                    Ref: 'EndpointServiceED36BE1F',
                },
                AllowedPrincipals: ['arn:aws:iam::123456789012:root'],
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBjLWVuZHBvaW50LXNlcnZpY2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZwYy1lbmRwb2ludC1zZXJ2aWNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MsOENBQWdEO0FBQ2hELHdDQUFzQztBQUV0QyxtQ0FBbUM7QUFDbkMsZ0NBQWtGO0FBRWxGOztHQUVHO0FBQ0gsTUFBTSx3QkFBd0I7SUFLNUIsWUFBWSxHQUFXO1FBQ3JCLElBQUksQ0FBQyxlQUFlLEdBQUcsR0FBRyxDQUFDO0tBQzVCO0NBQ0Y7QUFFRCxRQUFRLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO0lBQ3BDLFFBQVEsQ0FBQywyQkFBMkIsRUFBRSxHQUFHLEVBQUU7UUFDekMsSUFBSSxDQUFDLDRDQUE0QyxFQUFFLEdBQUcsRUFBRTtZQUN0RCxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUMxQixJQUFJLFNBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFeEIsT0FBTztZQUNQLE1BQU0sRUFBRSxHQUFHLElBQUksd0JBQXdCLENBQUMsNEZBQTRGLENBQUMsQ0FBQztZQUN0SSxJQUFJLHdCQUFrQixDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRTtnQkFDL0MsK0JBQStCLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ3JDLGtCQUFrQixFQUFFLEtBQUs7Z0JBQ3pCLGlCQUFpQixFQUFFLENBQUMsSUFBSSxzQkFBWSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7YUFDeEUsQ0FBQyxDQUFDO1lBQ0gsT0FBTztZQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDhCQUE4QixFQUFFO2dCQUM5RSx1QkFBdUIsRUFBRSxDQUFDLDRGQUE0RixDQUFDO2dCQUN2SCxrQkFBa0IsRUFBRSxLQUFLO2FBQzFCLENBQUMsQ0FBQztZQUVILE1BQU0sa0JBQWtCLEdBQUcscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLHlDQUF5QyxFQUFFO2dCQUM1RyxTQUFTLEVBQUU7b0JBQ1QsR0FBRyxFQUFFLHlCQUF5QjtpQkFDL0I7Z0JBQ0QsaUJBQWlCLEVBQUUsRUFBRTthQUN0QixDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV6RCxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUU7WUFDcEQsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsT0FBTztZQUNQLE1BQU0sRUFBRSxHQUFHLElBQUksd0JBQXdCLENBQUMsNEZBQTRGLENBQUMsQ0FBQztZQUN0SSxJQUFJLHdCQUFrQixDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRTtnQkFDL0MsK0JBQStCLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ3JDLGtCQUFrQixFQUFFLEtBQUs7Z0JBQ3pCLGlCQUFpQixFQUFFLENBQUMsSUFBSSxzQkFBWSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7YUFDeEUsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDhCQUE4QixFQUFFO2dCQUM5RSx1QkFBdUIsRUFBRSxDQUFDLDRGQUE0RixDQUFDO2dCQUN2SCxrQkFBa0IsRUFBRSxLQUFLO2FBQzFCLENBQUMsQ0FBQztZQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHlDQUF5QyxFQUFFO2dCQUN6RixTQUFTLEVBQUU7b0JBQ1QsR0FBRyxFQUFFLHlCQUF5QjtpQkFDL0I7Z0JBQ0QsaUJBQWlCLEVBQUUsQ0FBQyxnQ0FBZ0MsQ0FBQzthQUN0RCxDQUFDLENBQUM7UUFHTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7WUFDcEMsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsT0FBTztZQUNQLE1BQU0sRUFBRSxHQUFHLElBQUksd0JBQXdCLENBQUMsNEZBQTRGLENBQUMsQ0FBQztZQUN0SSxJQUFJLHdCQUFrQixDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRTtnQkFDL0MsK0JBQStCLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ3JDLGtCQUFrQixFQUFFLElBQUk7Z0JBQ3hCLGlCQUFpQixFQUFFLENBQUMsSUFBSSxzQkFBWSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7YUFDeEUsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDhCQUE4QixFQUFFO2dCQUM5RSx1QkFBdUIsRUFBRSxDQUFDLDRGQUE0RixDQUFDO2dCQUN2SCxrQkFBa0IsRUFBRSxJQUFJO2FBQ3pCLENBQUMsQ0FBQztZQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHlDQUF5QyxFQUFFO2dCQUN6RixTQUFTLEVBQUU7b0JBQ1QsR0FBRyxFQUFFLHlCQUF5QjtpQkFDL0I7Z0JBQ0QsaUJBQWlCLEVBQUUsQ0FBQyxnQ0FBZ0MsQ0FBQzthQUN0RCxDQUFDLENBQUM7UUFHTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgQXJuUHJpbmNpcGFsIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuaW1wb3J0IHsgSVZwY0VuZHBvaW50U2VydmljZUxvYWRCYWxhbmNlciwgVnBjLCBWcGNFbmRwb2ludFNlcnZpY2UgfSBmcm9tICcuLi9saWInO1xuXG4vKipcbiAqIEEgbG9hZCBiYWxhbmNlciB0aGF0IGNhbiBob3N0IGEgVlBDIEVuZHBvaW50IFNlcnZpY2VcbiAqL1xuY2xhc3MgRHVtbXlFbmRwb2ludExvYWRCYWxhY2VyIGltcGxlbWVudHMgSVZwY0VuZHBvaW50U2VydmljZUxvYWRCYWxhbmNlciB7XG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBsb2FkIGJhbGFuY2VyIHRoYXQgaG9zdHMgdGhlIFZQQyBFbmRwb2ludCBTZXJ2aWNlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbG9hZEJhbGFuY2VyQXJuOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKGFybjogc3RyaW5nKSB7XG4gICAgdGhpcy5sb2FkQmFsYW5jZXJBcm4gPSBhcm47XG4gIH1cbn1cblxuZGVzY3JpYmUoJ3ZwYyBlbmRwb2ludCBzZXJ2aWNlJywgKCkgPT4ge1xuICBkZXNjcmliZSgndGVzdCB2cGMgZW5kcG9pbnQgc2VydmljZScsICgpID0+IHtcbiAgICB0ZXN0KCdjcmVhdGUgZW5kcG9pbnQgc2VydmljZSB3aXRoIG5vIHByaW5jaXBhbHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIG5ldyBWcGMoc3RhY2ssICdNeVZQQycpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBsYiA9IG5ldyBEdW1teUVuZHBvaW50TG9hZEJhbGFjZXIoJ2Fybjphd3M6ZWxhc3RpY2xvYWRiYWxhbmNpbmc6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpsb2FkYmFsYW5jZXIvbmV0L1Rlc3QvOWJuNnFrZjRlOWpydzc3YScpO1xuICAgICAgbmV3IFZwY0VuZHBvaW50U2VydmljZShzdGFjaywgJ0VuZHBvaW50U2VydmljZScsIHtcbiAgICAgICAgdnBjRW5kcG9pbnRTZXJ2aWNlTG9hZEJhbGFuY2VyczogW2xiXSxcbiAgICAgICAgYWNjZXB0YW5jZVJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgYWxsb3dlZFByaW5jaXBhbHM6IFtuZXcgQXJuUHJpbmNpcGFsKCdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvb3QnKV0sXG4gICAgICB9KTtcbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDRW5kcG9pbnRTZXJ2aWNlJywge1xuICAgICAgICBOZXR3b3JrTG9hZEJhbGFuY2VyQXJuczogWydhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6bG9hZGJhbGFuY2VyL25ldC9UZXN0LzlibjZxa2Y0ZTlqcnc3N2EnXSxcbiAgICAgICAgQWNjZXB0YW5jZVJlcXVpcmVkOiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzZXJ2aWNlUGVybWlzc2lvbnMgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmZpbmRSZXNvdXJjZXMoJ0FXUzo6RUMyOjpWUENFbmRwb2ludFNlcnZpY2VQZXJtaXNzaW9ucycsIHtcbiAgICAgICAgU2VydmljZUlkOiB7XG4gICAgICAgICAgUmVmOiAnRW5kcG9pbnRTZXJ2aWNlRUQzNkJFMUYnLFxuICAgICAgICB9LFxuICAgICAgICBBbGxvd2VkUHJpbmNpcGFsczogW10sXG4gICAgICB9KTtcbiAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhzZXJ2aWNlUGVybWlzc2lvbnMpLmxlbmd0aCkudG9CZSgwKTtcblxuICAgIH0pO1xuICAgIHRlc3QoJ2NyZWF0ZSBlbmRwb2ludCBzZXJ2aWNlIHdpdGggYSBwcmluY2lwYWwnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgbGIgPSBuZXcgRHVtbXlFbmRwb2ludExvYWRCYWxhY2VyKCdhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6bG9hZGJhbGFuY2VyL25ldC9UZXN0LzlibjZxa2Y0ZTlqcnc3N2EnKTtcbiAgICAgIG5ldyBWcGNFbmRwb2ludFNlcnZpY2Uoc3RhY2ssICdFbmRwb2ludFNlcnZpY2UnLCB7XG4gICAgICAgIHZwY0VuZHBvaW50U2VydmljZUxvYWRCYWxhbmNlcnM6IFtsYl0sXG4gICAgICAgIGFjY2VwdGFuY2VSZXF1aXJlZDogZmFsc2UsXG4gICAgICAgIGFsbG93ZWRQcmluY2lwYWxzOiBbbmV3IEFyblByaW5jaXBhbCgnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb290JyldLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDRW5kcG9pbnRTZXJ2aWNlJywge1xuICAgICAgICBOZXR3b3JrTG9hZEJhbGFuY2VyQXJuczogWydhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6bG9hZGJhbGFuY2VyL25ldC9UZXN0LzlibjZxa2Y0ZTlqcnc3N2EnXSxcbiAgICAgICAgQWNjZXB0YW5jZVJlcXVpcmVkOiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlZQQ0VuZHBvaW50U2VydmljZVBlcm1pc3Npb25zJywge1xuICAgICAgICBTZXJ2aWNlSWQ6IHtcbiAgICAgICAgICBSZWY6ICdFbmRwb2ludFNlcnZpY2VFRDM2QkUxRicsXG4gICAgICAgIH0sXG4gICAgICAgIEFsbG93ZWRQcmluY2lwYWxzOiBbJ2Fybjphd3M6aWFtOjoxMjM0NTY3ODkwMTI6cm9vdCddLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnd2l0aCBhY2NlcHRhbmNlIHJlcXVyaWVkJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGxiID0gbmV3IER1bW15RW5kcG9pbnRMb2FkQmFsYWNlcignYXJuOmF3czplbGFzdGljbG9hZGJhbGFuY2luZzp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmxvYWRiYWxhbmNlci9uZXQvVGVzdC85Ym42cWtmNGU5anJ3NzdhJyk7XG4gICAgICBuZXcgVnBjRW5kcG9pbnRTZXJ2aWNlKHN0YWNrLCAnRW5kcG9pbnRTZXJ2aWNlJywge1xuICAgICAgICB2cGNFbmRwb2ludFNlcnZpY2VMb2FkQmFsYW5jZXJzOiBbbGJdLFxuICAgICAgICBhY2NlcHRhbmNlUmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIGFsbG93ZWRQcmluY2lwYWxzOiBbbmV3IEFyblByaW5jaXBhbCgnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb290JyldLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDRW5kcG9pbnRTZXJ2aWNlJywge1xuICAgICAgICBOZXR3b3JrTG9hZEJhbGFuY2VyQXJuczogWydhcm46YXdzOmVsYXN0aWNsb2FkYmFsYW5jaW5nOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6bG9hZGJhbGFuY2VyL25ldC9UZXN0LzlibjZxa2Y0ZTlqcnc3N2EnXSxcbiAgICAgICAgQWNjZXB0YW5jZVJlcXVpcmVkOiB0cnVlLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6VlBDRW5kcG9pbnRTZXJ2aWNlUGVybWlzc2lvbnMnLCB7XG4gICAgICAgIFNlcnZpY2VJZDoge1xuICAgICAgICAgIFJlZjogJ0VuZHBvaW50U2VydmljZUVEMzZCRTFGJyxcbiAgICAgICAgfSxcbiAgICAgICAgQWxsb3dlZFByaW5jaXBhbHM6IFsnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb290J10sXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=