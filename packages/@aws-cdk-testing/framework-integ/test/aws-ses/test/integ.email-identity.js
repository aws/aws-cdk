"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_route53_1 = require("aws-cdk-lib/aws-route53");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const ses = require("aws-cdk-lib/aws-ses");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const hostedZone = new aws_route53_1.PublicHostedZone(this, 'HostedZone', {
            zoneName: 'cdk.dev',
        });
        new ses.EmailIdentity(this, 'EmailIdentity', {
            identity: ses.Identity.publicHostedZone(hostedZone),
            mailFromDomain: 'mail.cdk.dev',
        });
    }
}
const app = new aws_cdk_lib_1.App();
new integ.IntegTest(app, 'EmailIdentityInteg', {
    testCases: [new TestStack(app, 'cdk-ses-email-identity-integ')],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZW1haWwtaWRlbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5lbWFpbC1pZGVudGl0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlEQUEyRDtBQUMzRCw2Q0FBcUQ7QUFDckQsb0RBQW9EO0FBRXBELDJDQUEyQztBQUUzQyxNQUFNLFNBQVUsU0FBUSxtQkFBSztJQUMzQixZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sVUFBVSxHQUFHLElBQUksOEJBQWdCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUMxRCxRQUFRLEVBQUUsU0FBUztTQUNwQixDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUMzQyxRQUFRLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUM7WUFDbkQsY0FBYyxFQUFFLGNBQWM7U0FDL0IsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFFdEIsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxvQkFBb0IsRUFBRTtJQUM3QyxTQUFTLEVBQUUsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsOEJBQThCLENBQUMsQ0FBQztDQUNoRSxDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQdWJsaWNIb3N0ZWRab25lIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLXJvdXRlNTMnO1xuaW1wb3J0IHsgQXBwLCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgc2VzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zZXMnO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgaG9zdGVkWm9uZSA9IG5ldyBQdWJsaWNIb3N0ZWRab25lKHRoaXMsICdIb3N0ZWRab25lJywge1xuICAgICAgem9uZU5hbWU6ICdjZGsuZGV2JyxcbiAgICB9KTtcblxuICAgIG5ldyBzZXMuRW1haWxJZGVudGl0eSh0aGlzLCAnRW1haWxJZGVudGl0eScsIHtcbiAgICAgIGlkZW50aXR5OiBzZXMuSWRlbnRpdHkucHVibGljSG9zdGVkWm9uZShob3N0ZWRab25lKSxcbiAgICAgIG1haWxGcm9tRG9tYWluOiAnbWFpbC5jZGsuZGV2JyxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnRW1haWxJZGVudGl0eUludGVnJywge1xuICB0ZXN0Q2FzZXM6IFtuZXcgVGVzdFN0YWNrKGFwcCwgJ2Nkay1zZXMtZW1haWwtaWRlbnRpdHktaW50ZWcnKV0sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=