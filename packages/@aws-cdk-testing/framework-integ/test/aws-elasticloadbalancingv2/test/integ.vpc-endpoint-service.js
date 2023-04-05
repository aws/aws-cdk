"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("aws-cdk-lib/aws-ec2");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const cdk = require("aws-cdk-lib");
const elbv2 = require("aws-cdk-lib/aws-elasticloadbalancingv2");
const app = new cdk.App();
class VpcEndpointServiceStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new ec2.Vpc(this, 'VPC');
        const nlbNoPrincipals = new elbv2.NetworkLoadBalancer(this, 'NLBNoPrincipals', {
            vpc,
        });
        const service1 = new ec2.VpcEndpointService(this, 'MyVpcEndpointServiceWithNoPrincipals', {
            vpcEndpointServiceLoadBalancers: [nlbNoPrincipals],
            acceptanceRequired: false,
            allowedPrincipals: [],
        });
        const nlbWithPrincipals = new elbv2.NetworkLoadBalancer(this, 'NLBWithPrincipals', {
            vpc,
        });
        const principalArn = new aws_iam_1.ArnPrincipal('arn:aws:iam::123456789012:root');
        const service2 = new ec2.VpcEndpointService(this, 'MyVpcEndpointServiceWithPrincipals', {
            vpcEndpointServiceLoadBalancers: [nlbWithPrincipals],
            acceptanceRequired: false,
            allowedPrincipals: [principalArn],
        });
        new cdk.CfnOutput(this, 'MyVpcEndpointServiceWithNoPrincipalsServiceName', {
            exportName: 'ServiceName',
            value: service1.vpcEndpointServiceName,
            description: 'Give this to service consumers so they can connect via VPC Endpoint',
        });
        new cdk.CfnOutput(this, 'MyVpcEndpointServiceWithPrincipalsEndpointServiceId', {
            exportName: 'EndpointServiceId',
            value: service2.vpcEndpointServiceId,
            description: 'Reference this service from other stacks',
        });
    }
}
new VpcEndpointServiceStack(app, 'aws-cdk-ec2-vpc-endpoint-service');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudnBjLWVuZHBvaW50LXNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy52cGMtZW5kcG9pbnQtc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUEyQztBQUMzQyxpREFBbUQ7QUFDbkQsbUNBQW1DO0FBQ25DLGdFQUFnRTtBQUVoRSxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLHVCQUF3QixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzdDLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sZUFBZSxHQUFHLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUM3RSxHQUFHO1NBQ0osQ0FBQyxDQUFDO1FBRUgsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLHNDQUFzQyxFQUFFO1lBQ3hGLCtCQUErQixFQUFFLENBQUMsZUFBZSxDQUFDO1lBQ2xELGtCQUFrQixFQUFFLEtBQUs7WUFDekIsaUJBQWlCLEVBQUUsRUFBRTtTQUN0QixDQUFDLENBQUM7UUFFSCxNQUFNLGlCQUFpQixHQUFHLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUNqRixHQUFHO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsTUFBTSxZQUFZLEdBQUcsSUFBSSxzQkFBWSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFFeEUsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLG9DQUFvQyxFQUFFO1lBQ3RGLCtCQUErQixFQUFFLENBQUMsaUJBQWlCLENBQUM7WUFDcEQsa0JBQWtCLEVBQUUsS0FBSztZQUN6QixpQkFBaUIsRUFBRSxDQUFDLFlBQVksQ0FBQztTQUNsQyxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGlEQUFpRCxFQUFFO1lBQ3pFLFVBQVUsRUFBRSxhQUFhO1lBQ3pCLEtBQUssRUFBRSxRQUFRLENBQUMsc0JBQXNCO1lBQ3RDLFdBQVcsRUFBRSxxRUFBcUU7U0FDbkYsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxxREFBcUQsRUFBRTtZQUM3RSxVQUFVLEVBQUUsbUJBQW1CO1lBQy9CLEtBQUssRUFBRSxRQUFRLENBQUMsb0JBQW9CO1lBQ3BDLFdBQVcsRUFBRSwwQ0FBMEM7U0FDeEQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsSUFBSSx1QkFBdUIsQ0FBQyxHQUFHLEVBQUUsa0NBQWtDLENBQUMsQ0FBQztBQUNyRSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgeyBBcm5QcmluY2lwYWwgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBlbGJ2MiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mic7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNsYXNzIFZwY0VuZHBvaW50U2VydmljZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWUEMnKTtcbiAgICBjb25zdCBubGJOb1ByaW5jaXBhbHMgPSBuZXcgZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlcih0aGlzLCAnTkxCTm9QcmluY2lwYWxzJywge1xuICAgICAgdnBjLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc2VydmljZTEgPSBuZXcgZWMyLlZwY0VuZHBvaW50U2VydmljZSh0aGlzLCAnTXlWcGNFbmRwb2ludFNlcnZpY2VXaXRoTm9QcmluY2lwYWxzJywge1xuICAgICAgdnBjRW5kcG9pbnRTZXJ2aWNlTG9hZEJhbGFuY2VyczogW25sYk5vUHJpbmNpcGFsc10sXG4gICAgICBhY2NlcHRhbmNlUmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgYWxsb3dlZFByaW5jaXBhbHM6IFtdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgbmxiV2l0aFByaW5jaXBhbHMgPSBuZXcgZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlcih0aGlzLCAnTkxCV2l0aFByaW5jaXBhbHMnLCB7XG4gICAgICB2cGMsXG4gICAgfSk7XG4gICAgY29uc3QgcHJpbmNpcGFsQXJuID0gbmV3IEFyblByaW5jaXBhbCgnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb290Jyk7XG5cbiAgICBjb25zdCBzZXJ2aWNlMiA9IG5ldyBlYzIuVnBjRW5kcG9pbnRTZXJ2aWNlKHRoaXMsICdNeVZwY0VuZHBvaW50U2VydmljZVdpdGhQcmluY2lwYWxzJywge1xuICAgICAgdnBjRW5kcG9pbnRTZXJ2aWNlTG9hZEJhbGFuY2VyczogW25sYldpdGhQcmluY2lwYWxzXSxcbiAgICAgIGFjY2VwdGFuY2VSZXF1aXJlZDogZmFsc2UsXG4gICAgICBhbGxvd2VkUHJpbmNpcGFsczogW3ByaW5jaXBhbEFybl0sXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnTXlWcGNFbmRwb2ludFNlcnZpY2VXaXRoTm9QcmluY2lwYWxzU2VydmljZU5hbWUnLCB7XG4gICAgICBleHBvcnROYW1lOiAnU2VydmljZU5hbWUnLFxuICAgICAgdmFsdWU6IHNlcnZpY2UxLnZwY0VuZHBvaW50U2VydmljZU5hbWUsXG4gICAgICBkZXNjcmlwdGlvbjogJ0dpdmUgdGhpcyB0byBzZXJ2aWNlIGNvbnN1bWVycyBzbyB0aGV5IGNhbiBjb25uZWN0IHZpYSBWUEMgRW5kcG9pbnQnLFxuICAgIH0pO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ015VnBjRW5kcG9pbnRTZXJ2aWNlV2l0aFByaW5jaXBhbHNFbmRwb2ludFNlcnZpY2VJZCcsIHtcbiAgICAgIGV4cG9ydE5hbWU6ICdFbmRwb2ludFNlcnZpY2VJZCcsXG4gICAgICB2YWx1ZTogc2VydmljZTIudnBjRW5kcG9pbnRTZXJ2aWNlSWQsXG4gICAgICBkZXNjcmlwdGlvbjogJ1JlZmVyZW5jZSB0aGlzIHNlcnZpY2UgZnJvbSBvdGhlciBzdGFja3MnLFxuICAgIH0pO1xuICB9XG59XG5cbm5ldyBWcGNFbmRwb2ludFNlcnZpY2VTdGFjayhhcHAsICdhd3MtY2RrLWVjMi12cGMtZW5kcG9pbnQtc2VydmljZScpO1xuYXBwLnN5bnRoKCk7XG4iXX0=