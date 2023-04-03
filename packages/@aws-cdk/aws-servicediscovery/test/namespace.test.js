"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const servicediscovery = require("../lib");
describe('namespace', () => {
    test('HTTP namespace', () => {
        const stack = new cdk.Stack();
        new servicediscovery.HttpNamespace(stack, 'MyNamespace', {
            name: 'foobar.com',
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyNamespaceD0BB8558: {
                    Type: 'AWS::ServiceDiscovery::HttpNamespace',
                    Properties: {
                        Name: 'foobar.com',
                    },
                },
            },
        });
    });
    test('Public DNS namespace', () => {
        const stack = new cdk.Stack();
        new servicediscovery.PublicDnsNamespace(stack, 'MyNamespace', {
            name: 'foobar.com',
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyNamespaceD0BB8558: {
                    Type: 'AWS::ServiceDiscovery::PublicDnsNamespace',
                    Properties: {
                        Name: 'foobar.com',
                    },
                },
            },
        });
    });
    test('Private DNS namespace', () => {
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc');
        new servicediscovery.PrivateDnsNamespace(stack, 'MyNamespace', {
            name: 'foobar.com',
            vpc,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ServiceDiscovery::PrivateDnsNamespace', {
            Name: 'foobar.com',
            Vpc: {
                Ref: 'MyVpcF9F0CA6F',
            },
        });
    });
    test('CloudFormation attributes', () => {
        const stack = new cdk.Stack();
        const vpc = new ec2.Vpc(stack, 'MyVpc');
        const privateNs = new servicediscovery.PrivateDnsNamespace(stack, 'MyPrivateNamespace', {
            name: 'foobar.com',
            vpc,
        });
        const publicNs = new servicediscovery.PrivateDnsNamespace(stack, 'MyPublicNamespace', {
            name: 'foobar.com',
            vpc,
        });
        new core_1.CfnOutput(stack, 'PrivateNsId', { value: privateNs.namespaceId });
        new core_1.CfnOutput(stack, 'PrivateNsArn', { value: privateNs.namespaceArn });
        new core_1.CfnOutput(stack, 'PrivateHostedZoneId', { value: privateNs.namespaceHostedZoneId });
        new core_1.CfnOutput(stack, 'PublicNsId', { value: publicNs.namespaceId });
        new core_1.CfnOutput(stack, 'PublicNsArn', { value: publicNs.namespaceArn });
        new core_1.CfnOutput(stack, 'PublicHostedZoneId', { value: publicNs.namespaceHostedZoneId });
        assertions_1.Template.fromStack(stack).hasOutput('PrivateNsId', {
            Value: {
                'Fn::GetAtt': [
                    'MyPrivateNamespace8CB3AE39',
                    'Id',
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasOutput('PrivateNsArn', {
            Value: {
                'Fn::GetAtt': [
                    'MyPrivateNamespace8CB3AE39',
                    'Arn',
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasOutput('PrivateHostedZoneId', {
            Value: {
                'Fn::GetAtt': [
                    'MyPrivateNamespace8CB3AE39',
                    'HostedZoneId',
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasOutput('PublicNsId', {
            Value: {
                'Fn::GetAtt': [
                    'MyPublicNamespaceAB66AFAC',
                    'Id',
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasOutput('PublicNsArn', {
            Value: {
                'Fn::GetAtt': [
                    'MyPublicNamespaceAB66AFAC',
                    'Arn',
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasOutput('PublicHostedZoneId', {
            Value: {
                'Fn::GetAtt': [
                    'MyPublicNamespaceAB66AFAC',
                    'HostedZoneId',
                ],
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmFtZXNwYWNlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJuYW1lc3BhY2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLHdDQUEwQztBQUMxQywyQ0FBMkM7QUFFM0MsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7SUFDekIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRTtRQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QixJQUFJLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQ3ZELElBQUksRUFBRSxZQUFZO1NBQ25CLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQztZQUN4QyxTQUFTLEVBQUU7Z0JBQ1QsbUJBQW1CLEVBQUU7b0JBQ25CLElBQUksRUFBRSxzQ0FBc0M7b0JBQzVDLFVBQVUsRUFBRTt3QkFDVixJQUFJLEVBQUUsWUFBWTtxQkFDbkI7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUdMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtRQUNoQyxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QixJQUFJLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7WUFDNUQsSUFBSSxFQUFFLFlBQVk7U0FDbkIsQ0FBQyxDQUFDO1FBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDO1lBQ3hDLFNBQVMsRUFBRTtnQkFDVCxtQkFBbUIsRUFBRTtvQkFDbkIsSUFBSSxFQUFFLDJDQUEyQztvQkFDakQsVUFBVSxFQUFFO3dCQUNWLElBQUksRUFBRSxZQUFZO3FCQUNuQjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBR0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO1FBQ2pDLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFeEMsSUFBSSxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1lBQzdELElBQUksRUFBRSxZQUFZO1lBQ2xCLEdBQUc7U0FDSixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw0Q0FBNEMsRUFBRTtZQUM1RixJQUFJLEVBQUUsWUFBWTtZQUNsQixHQUFHLEVBQUU7Z0JBQ0gsR0FBRyxFQUFFLGVBQWU7YUFDckI7U0FDRixDQUFDLENBQUM7SUFHTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywyQkFBMkIsRUFBRSxHQUFHLEVBQUU7UUFDckMsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUV4QyxNQUFNLFNBQVMsR0FBRyxJQUFJLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxvQkFBb0IsRUFBRTtZQUN0RixJQUFJLEVBQUUsWUFBWTtZQUNsQixHQUFHO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsTUFBTSxRQUFRLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLEVBQUU7WUFDcEYsSUFBSSxFQUFFLFlBQVk7WUFDbEIsR0FBRztTQUNKLENBQUMsQ0FBQztRQUNILElBQUksZ0JBQVMsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQ3RFLElBQUksZ0JBQVMsQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBQ3hFLElBQUksZ0JBQVMsQ0FBQyxLQUFLLEVBQUUscUJBQXFCLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQztRQUN4RixJQUFJLGdCQUFTLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUNwRSxJQUFJLGdCQUFTLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztRQUN0RSxJQUFJLGdCQUFTLENBQUMsS0FBSyxFQUFFLG9CQUFvQixFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUM7UUFFdEYscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRTtZQUNqRCxLQUFLLEVBQUU7Z0JBQ0wsWUFBWSxFQUFFO29CQUNaLDRCQUE0QjtvQkFDNUIsSUFBSTtpQkFDTDthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRTtZQUNsRCxLQUFLLEVBQUU7Z0JBQ0wsWUFBWSxFQUFFO29CQUNaLDRCQUE0QjtvQkFDNUIsS0FBSztpQkFDTjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLHFCQUFxQixFQUFFO1lBQ3pELEtBQUssRUFBRTtnQkFDTCxZQUFZLEVBQUU7b0JBQ1osNEJBQTRCO29CQUM1QixjQUFjO2lCQUNmO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFDSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFO1lBQ2hELEtBQUssRUFBRTtnQkFDTCxZQUFZLEVBQUU7b0JBQ1osMkJBQTJCO29CQUMzQixJQUFJO2lCQUNMO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFDSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFO1lBQ2pELEtBQUssRUFBRTtnQkFDTCxZQUFZLEVBQUU7b0JBQ1osMkJBQTJCO29CQUMzQixLQUFLO2lCQUNOO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFDSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsb0JBQW9CLEVBQUU7WUFDeEQsS0FBSyxFQUFFO2dCQUNMLFlBQVksRUFBRTtvQkFDWiwyQkFBMkI7b0JBQzNCLGNBQWM7aUJBQ2Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ2ZuT3V0cHV0IH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBzZXJ2aWNlZGlzY292ZXJ5IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCduYW1lc3BhY2UnLCAoKSA9PiB7XG4gIHRlc3QoJ0hUVFAgbmFtZXNwYWNlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgbmV3IHNlcnZpY2VkaXNjb3ZlcnkuSHR0cE5hbWVzcGFjZShzdGFjaywgJ015TmFtZXNwYWNlJywge1xuICAgICAgbmFtZTogJ2Zvb2Jhci5jb20nLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15TmFtZXNwYWNlRDBCQjg1NTg6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTZXJ2aWNlRGlzY292ZXJ5OjpIdHRwTmFtZXNwYWNlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBOYW1lOiAnZm9vYmFyLmNvbScsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdQdWJsaWMgRE5TIG5hbWVzcGFjZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIG5ldyBzZXJ2aWNlZGlzY292ZXJ5LlB1YmxpY0Ruc05hbWVzcGFjZShzdGFjaywgJ015TmFtZXNwYWNlJywge1xuICAgICAgbmFtZTogJ2Zvb2Jhci5jb20nLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15TmFtZXNwYWNlRDBCQjg1NTg6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpTZXJ2aWNlRGlzY292ZXJ5OjpQdWJsaWNEbnNOYW1lc3BhY2UnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIE5hbWU6ICdmb29iYXIuY29tJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ1ByaXZhdGUgRE5TIG5hbWVzcGFjZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VnBjJyk7XG5cbiAgICBuZXcgc2VydmljZWRpc2NvdmVyeS5Qcml2YXRlRG5zTmFtZXNwYWNlKHN0YWNrLCAnTXlOYW1lc3BhY2UnLCB7XG4gICAgICBuYW1lOiAnZm9vYmFyLmNvbScsXG4gICAgICB2cGMsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTZXJ2aWNlRGlzY292ZXJ5OjpQcml2YXRlRG5zTmFtZXNwYWNlJywge1xuICAgICAgTmFtZTogJ2Zvb2Jhci5jb20nLFxuICAgICAgVnBjOiB7XG4gICAgICAgIFJlZjogJ015VnBjRjlGMENBNkYnLFxuICAgICAgfSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ0Nsb3VkRm9ybWF0aW9uIGF0dHJpYnV0ZXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdNeVZwYycpO1xuXG4gICAgY29uc3QgcHJpdmF0ZU5zID0gbmV3IHNlcnZpY2VkaXNjb3ZlcnkuUHJpdmF0ZURuc05hbWVzcGFjZShzdGFjaywgJ015UHJpdmF0ZU5hbWVzcGFjZScsIHtcbiAgICAgIG5hbWU6ICdmb29iYXIuY29tJyxcbiAgICAgIHZwYyxcbiAgICB9KTtcbiAgICBjb25zdCBwdWJsaWNOcyA9IG5ldyBzZXJ2aWNlZGlzY292ZXJ5LlByaXZhdGVEbnNOYW1lc3BhY2Uoc3RhY2ssICdNeVB1YmxpY05hbWVzcGFjZScsIHtcbiAgICAgIG5hbWU6ICdmb29iYXIuY29tJyxcbiAgICAgIHZwYyxcbiAgICB9KTtcbiAgICBuZXcgQ2ZuT3V0cHV0KHN0YWNrLCAnUHJpdmF0ZU5zSWQnLCB7IHZhbHVlOiBwcml2YXRlTnMubmFtZXNwYWNlSWQgfSk7XG4gICAgbmV3IENmbk91dHB1dChzdGFjaywgJ1ByaXZhdGVOc0FybicsIHsgdmFsdWU6IHByaXZhdGVOcy5uYW1lc3BhY2VBcm4gfSk7XG4gICAgbmV3IENmbk91dHB1dChzdGFjaywgJ1ByaXZhdGVIb3N0ZWRab25lSWQnLCB7IHZhbHVlOiBwcml2YXRlTnMubmFtZXNwYWNlSG9zdGVkWm9uZUlkIH0pO1xuICAgIG5ldyBDZm5PdXRwdXQoc3RhY2ssICdQdWJsaWNOc0lkJywgeyB2YWx1ZTogcHVibGljTnMubmFtZXNwYWNlSWQgfSk7XG4gICAgbmV3IENmbk91dHB1dChzdGFjaywgJ1B1YmxpY05zQXJuJywgeyB2YWx1ZTogcHVibGljTnMubmFtZXNwYWNlQXJuIH0pO1xuICAgIG5ldyBDZm5PdXRwdXQoc3RhY2ssICdQdWJsaWNIb3N0ZWRab25lSWQnLCB7IHZhbHVlOiBwdWJsaWNOcy5uYW1lc3BhY2VIb3N0ZWRab25lSWQgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc091dHB1dCgnUHJpdmF0ZU5zSWQnLCB7XG4gICAgICBWYWx1ZToge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnTXlQcml2YXRlTmFtZXNwYWNlOENCM0FFMzknLFxuICAgICAgICAgICdJZCcsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzT3V0cHV0KCdQcml2YXRlTnNBcm4nLCB7XG4gICAgICBWYWx1ZToge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnTXlQcml2YXRlTmFtZXNwYWNlOENCM0FFMzknLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc091dHB1dCgnUHJpdmF0ZUhvc3RlZFpvbmVJZCcsIHtcbiAgICAgIFZhbHVlOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdNeVByaXZhdGVOYW1lc3BhY2U4Q0IzQUUzOScsXG4gICAgICAgICAgJ0hvc3RlZFpvbmVJZCcsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzT3V0cHV0KCdQdWJsaWNOc0lkJywge1xuICAgICAgVmFsdWU6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ015UHVibGljTmFtZXNwYWNlQUI2NkFGQUMnLFxuICAgICAgICAgICdJZCcsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzT3V0cHV0KCdQdWJsaWNOc0FybicsIHtcbiAgICAgIFZhbHVlOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdNeVB1YmxpY05hbWVzcGFjZUFCNjZBRkFDJyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNPdXRwdXQoJ1B1YmxpY0hvc3RlZFpvbmVJZCcsIHtcbiAgICAgIFZhbHVlOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdNeVB1YmxpY05hbWVzcGFjZUFCNjZBRkFDJyxcbiAgICAgICAgICAnSG9zdGVkWm9uZUlkJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=