"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
let stack;
let nlb;
let vpces;
let zone;
/**
 * A load balancer that can host a VPC Endpoint Service
 */
class DummyEndpointLoadBalancer {
    constructor(arn) {
        this.loadBalancerArn = arn;
    }
}
beforeEach(() => {
    stack = new core_1.Stack();
    nlb = new DummyEndpointLoadBalancer('arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a');
    vpces = new aws_ec2_1.VpcEndpointService(stack, 'VPCES', {
        vpcEndpointServiceLoadBalancers: [nlb],
    });
    zone = new lib_1.PublicHostedZone(stack, 'PHZ', {
        zoneName: 'aws-cdk.dev',
    });
});
test('create domain name resource', () => {
    // GIVEN
    // WHEN
    new lib_1.VpcEndpointServiceDomainName(stack, 'EndpointDomain', {
        endpointService: vpces,
        domainName: 'my-stuff.aws-cdk.dev',
        publicHostedZone: zone,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResource('Custom::AWS', {
        Properties: {
            Create: {
                'Fn::Join': [
                    '',
                    [
                        '{"service":"EC2","action":"modifyVpcEndpointServiceConfiguration","parameters":{"ServiceId":"',
                        {
                            Ref: 'VPCES3AE7D565',
                        },
                        '","PrivateDnsName":"my-stuff.aws-cdk.dev"},"physicalResourceId":{"id":"VPCES"}}',
                    ],
                ],
            },
            Update: {
                'Fn::Join': [
                    '',
                    [
                        '{"service":"EC2","action":"modifyVpcEndpointServiceConfiguration","parameters":{"ServiceId":"',
                        {
                            Ref: 'VPCES3AE7D565',
                        },
                        '","PrivateDnsName":"my-stuff.aws-cdk.dev"},"physicalResourceId":{"id":"VPCES"}}',
                    ],
                ],
            },
            Delete: {
                'Fn::Join': [
                    '',
                    [
                        '{"service":"EC2","action":"modifyVpcEndpointServiceConfiguration","parameters":{"ServiceId":"',
                        {
                            Ref: 'VPCES3AE7D565',
                        },
                        '","RemovePrivateDnsName":true}}',
                    ],
                ],
            },
        },
        DependsOn: [
            'EndpointDomainEnableDnsCustomResourcePolicy5E6DE7EB',
            'VPCES3AE7D565',
        ],
    });
    // Have to use `haveResourceLike` because there is a property that, by design, changes on every build
    assertions_1.Template.fromStack(stack).hasResource('Custom::AWS', {
        Properties: {
            Create: {
                'Fn::Join': [
                    '',
                    [
                        '{"service":"EC2","action":"describeVpcEndpointServiceConfigurations","parameters":{"ServiceIds":["',
                        {
                            Ref: 'VPCES3AE7D565',
                        },
                        '"]},"physicalResourceId":{"id":"fcd2563479244a851a9a59af60831b01"}}',
                    ],
                ],
            },
            Update: {
                'Fn::Join': [
                    '',
                    [
                        '{"service":"EC2","action":"describeVpcEndpointServiceConfigurations","parameters":{"ServiceIds":["',
                        {
                            Ref: 'VPCES3AE7D565',
                        },
                        '"]},"physicalResourceId":{"id":"fcd2563479244a851a9a59af60831b01"}}',
                    ],
                ],
            },
        },
        DependsOn: [
            'EndpointDomainEnableDnsCustomResourcePolicy5E6DE7EB',
            'EndpointDomainEnableDnsDACBF5A6',
            'EndpointDomainGetNamesCustomResourcePolicy141775B1',
            'VPCES3AE7D565',
        ],
    });
    assertions_1.Template.fromStack(stack).hasResource('AWS::Route53::RecordSet', {
        Properties: {
            Name: {
                'Fn::Join': [
                    '',
                    [
                        {
                            'Fn::GetAtt': [
                                'EndpointDomainGetNames9E697ED2',
                                'ServiceConfigurations.0.PrivateDnsNameConfiguration.Name',
                            ],
                        },
                        '.aws-cdk.dev.',
                    ],
                ],
            },
            Type: 'TXT',
            HostedZoneId: {
                Ref: 'PHZ45BE903D',
            },
            ResourceRecords: [
                {
                    'Fn::Join': [
                        '',
                        [
                            '\"',
                            {
                                'Fn::GetAtt': [
                                    'EndpointDomainGetNames9E697ED2',
                                    'ServiceConfigurations.0.PrivateDnsNameConfiguration.Value',
                                ],
                            },
                            '\"',
                        ],
                    ],
                },
            ],
            TTL: '1800',
        },
        DependsOn: [
            'VPCES3AE7D565',
        ],
    });
    assertions_1.Template.fromStack(stack).hasResource('Custom::AWS', {
        Properties: {
            Create: {
                'Fn::Join': [
                    '',
                    [
                        '{"service":"EC2","action":"startVpcEndpointServicePrivateDnsVerification","parameters":{"ServiceId":"',
                        {
                            Ref: 'VPCES3AE7D565',
                        },
                        '"},"physicalResourceId":{"id":"',
                        {
                            'Fn::Join': [
                                ':',
                                [
                                    {
                                        'Fn::GetAtt': [
                                            'EndpointDomainGetNames9E697ED2',
                                            'ServiceConfigurations.0.PrivateDnsNameConfiguration.Name',
                                        ],
                                    },
                                    {
                                        'Fn::GetAtt': [
                                            'EndpointDomainGetNames9E697ED2',
                                            'ServiceConfigurations.0.PrivateDnsNameConfiguration.Value',
                                        ],
                                    },
                                ],
                            ],
                        },
                        '"}}',
                    ],
                ],
            },
            Update: {
                'Fn::Join': [
                    '',
                    [
                        '{"service":"EC2","action":"startVpcEndpointServicePrivateDnsVerification","parameters":{"ServiceId":"',
                        {
                            Ref: 'VPCES3AE7D565',
                        },
                        '"},"physicalResourceId":{"id":"',
                        {
                            'Fn::Join': [
                                ':',
                                [
                                    {
                                        'Fn::GetAtt': [
                                            'EndpointDomainGetNames9E697ED2',
                                            'ServiceConfigurations.0.PrivateDnsNameConfiguration.Name',
                                        ],
                                    },
                                    {
                                        'Fn::GetAtt': [
                                            'EndpointDomainGetNames9E697ED2',
                                            'ServiceConfigurations.0.PrivateDnsNameConfiguration.Value',
                                        ],
                                    },
                                ],
                            ],
                        },
                        '"}}',
                    ],
                ],
            },
        },
        DependsOn: [
            'EndpointDomainDnsVerificationRecord66623BDA',
            'EndpointDomainStartVerificationCustomResourcePolicyD2BAC9A6',
            'VPCES3AE7D565',
        ],
    });
});
test('throws if creating multiple domains for a single service', () => {
    // GIVEN
    vpces = new aws_ec2_1.VpcEndpointService(stack, 'VPCES-2', {
        vpcEndpointServiceLoadBalancers: [nlb],
    });
    new lib_1.VpcEndpointServiceDomainName(stack, 'EndpointDomain', {
        endpointService: vpces,
        domainName: 'my-stuff-1.aws-cdk.dev',
        publicHostedZone: zone,
    });
    // WHEN / THEN
    expect(() => {
        new lib_1.VpcEndpointServiceDomainName(stack, 'EndpointDomain2', {
            endpointService: vpces,
            domainName: 'my-stuff-2.aws-cdk.dev',
            publicHostedZone: zone,
        });
    }).toThrow(/Cannot create a VpcEndpointServiceDomainName for service/);
});
test('endpoint domain name property equals input domain name', () => {
    // GIVEN
    vpces = new aws_ec2_1.VpcEndpointService(stack, 'NameTest', {
        vpcEndpointServiceLoadBalancers: [nlb],
    });
    const dn = new lib_1.VpcEndpointServiceDomainName(stack, 'EndpointDomain', {
        endpointService: vpces,
        domainName: 'name-test.aws-cdk.dev',
        publicHostedZone: zone,
    });
    expect(dn.domainName).toEqual('name-test.aws-cdk.dev');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBjLWVuZHBvaW50LXNlcnZpY2UtZG9tYWluLW5hbWUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZwYy1lbmRwb2ludC1zZXJ2aWNlLWRvbWFpbi1uYW1lLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MsOENBQXVGO0FBQ3ZGLHdDQUFzQztBQUN0QyxnQ0FBd0U7QUFFeEUsSUFBSSxLQUFZLENBQUM7QUFDakIsSUFBSSxHQUFvQyxDQUFDO0FBQ3pDLElBQUksS0FBeUIsQ0FBQztBQUM5QixJQUFJLElBQXNCLENBQUM7QUFFM0I7O0dBRUc7QUFDSCxNQUFNLHlCQUF5QjtJQUs3QixZQUFZLEdBQVc7UUFDckIsSUFBSSxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUM7S0FDNUI7Q0FDRjtBQUVELFVBQVUsQ0FBQyxHQUFHLEVBQUU7SUFDZCxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUNwQixHQUFHLEdBQUcsSUFBSSx5QkFBeUIsQ0FBQyw0RkFBNEYsQ0FBQyxDQUFDO0lBQ2xJLEtBQUssR0FBRyxJQUFJLDRCQUFrQixDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7UUFDN0MsK0JBQStCLEVBQUUsQ0FBQyxHQUFHLENBQUM7S0FDdkMsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxHQUFHLElBQUksc0JBQWdCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtRQUN4QyxRQUFRLEVBQUUsYUFBYTtLQUN4QixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUU7SUFDdkMsUUFBUTtJQUVSLE9BQU87SUFDUCxJQUFJLGtDQUE0QixDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtRQUN4RCxlQUFlLEVBQUUsS0FBSztRQUN0QixVQUFVLEVBQUUsc0JBQXNCO1FBQ2xDLGdCQUFnQixFQUFFLElBQUk7S0FDdkIsQ0FBQyxDQUFDO0lBRUgs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RSxJQUFJO1NBQ3ZCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywwREFBMEQsQ0FBQyxDQUFDO0FBQ3pFLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLHdEQUF3RCxFQUFFLEdBQUcsRUFBRTtJQUNsRSxRQUFRO0lBQ1IsS0FBSyxHQUFHLElBQUksNEJBQWtCLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtRQUNoRCwrQkFBK0IsRUFBRSxDQUFDLEdBQUcsQ0FBQztLQUN2QyxDQUFDLENBQUM7SUFFSCxNQUFNLEVBQUUsR0FBRyxJQUFJLGtDQUE0QixDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtRQUNuRSxlQUFlLEVBQUUsS0FBSztRQUN0QixVQUFVLEVBQUUsdUJBQXVCO1FBQ25DLGdCQUFnQixFQUFFLElBQUk7S0FDdkIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUN6RCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBJVnBjRW5kcG9pbnRTZXJ2aWNlTG9hZEJhbGFuY2VyLCBWcGNFbmRwb2ludFNlcnZpY2UgfSBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBQdWJsaWNIb3N0ZWRab25lLCBWcGNFbmRwb2ludFNlcnZpY2VEb21haW5OYW1lIH0gZnJvbSAnLi4vbGliJztcblxubGV0IHN0YWNrOiBTdGFjaztcbmxldCBubGI6IElWcGNFbmRwb2ludFNlcnZpY2VMb2FkQmFsYW5jZXI7XG5sZXQgdnBjZXM6IFZwY0VuZHBvaW50U2VydmljZTtcbmxldCB6b25lOiBQdWJsaWNIb3N0ZWRab25lO1xuXG4vKipcbiAqIEEgbG9hZCBiYWxhbmNlciB0aGF0IGNhbiBob3N0IGEgVlBDIEVuZHBvaW50IFNlcnZpY2VcbiAqL1xuY2xhc3MgRHVtbXlFbmRwb2ludExvYWRCYWxhbmNlciBpbXBsZW1lbnRzIElWcGNFbmRwb2ludFNlcnZpY2VMb2FkQmFsYW5jZXIge1xuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgbG9hZCBiYWxhbmNlciB0aGF0IGhvc3RzIHRoZSBWUEMgRW5kcG9pbnQgU2VydmljZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGxvYWRCYWxhbmNlckFybjogc3RyaW5nO1xuICBjb25zdHJ1Y3Rvcihhcm46IHN0cmluZykge1xuICAgIHRoaXMubG9hZEJhbGFuY2VyQXJuID0gYXJuO1xuICB9XG59XG5cbmJlZm9yZUVhY2goKCkgPT4ge1xuICBzdGFjayA9IG5ldyBTdGFjaygpO1xuICBubGIgPSBuZXcgRHVtbXlFbmRwb2ludExvYWRCYWxhbmNlcignYXJuOmF3czplbGFzdGljbG9hZGJhbGFuY2luZzp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmxvYWRiYWxhbmNlci9uZXQvVGVzdC85Ym42cWtmNGU5anJ3NzdhJyk7XG4gIHZwY2VzID0gbmV3IFZwY0VuZHBvaW50U2VydmljZShzdGFjaywgJ1ZQQ0VTJywge1xuICAgIHZwY0VuZHBvaW50U2VydmljZUxvYWRCYWxhbmNlcnM6IFtubGJdLFxuICB9KTtcbiAgem9uZSA9IG5ldyBQdWJsaWNIb3N0ZWRab25lKHN0YWNrLCAnUEhaJywge1xuICAgIHpvbmVOYW1lOiAnYXdzLWNkay5kZXYnLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdjcmVhdGUgZG9tYWluIG5hbWUgcmVzb3VyY2UnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG5cbiAgLy8gV0hFTlxuICBuZXcgVnBjRW5kcG9pbnRTZXJ2aWNlRG9tYWluTmFtZShzdGFjaywgJ0VuZHBvaW50RG9tYWluJywge1xuICAgIGVuZHBvaW50U2VydmljZTogdnBjZXMsXG4gICAgZG9tYWluTmFtZTogJ215LXN0dWZmLmF3cy1jZGsuZGV2JyxcbiAgICBwdWJsaWNIb3N0ZWRab25lOiB6b25lLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0N1c3RvbTo6QVdTJywge1xuICAgIFByb3BlcnRpZXM6IHtcbiAgICAgIENyZWF0ZToge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ3tcInNlcnZpY2VcIjpcIkVDMlwiLFwiYWN0aW9uXCI6XCJtb2RpZnlWcGNFbmRwb2ludFNlcnZpY2VDb25maWd1cmF0aW9uXCIsXCJwYXJhbWV0ZXJzXCI6e1wiU2VydmljZUlkXCI6XCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdWUENFUzNBRTdENTY1JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnXCIsXCJQcml2YXRlRG5zTmFtZVwiOlwibXktc3R1ZmYuYXdzLWNkay5kZXZcIn0sXCJwaHlzaWNhbFJlc291cmNlSWRcIjp7XCJpZFwiOlwiVlBDRVNcIn19JyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIFVwZGF0ZToge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ3tcInNlcnZpY2VcIjpcIkVDMlwiLFwiYWN0aW9uXCI6XCJtb2RpZnlWcGNFbmRwb2ludFNlcnZpY2VDb25maWd1cmF0aW9uXCIsXCJwYXJhbWV0ZXJzXCI6e1wiU2VydmljZUlkXCI6XCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdWUENFUzNBRTdENTY1JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnXCIsXCJQcml2YXRlRG5zTmFtZVwiOlwibXktc3R1ZmYuYXdzLWNkay5kZXZcIn0sXCJwaHlzaWNhbFJlc291cmNlSWRcIjp7XCJpZFwiOlwiVlBDRVNcIn19JyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIERlbGV0ZToge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ3tcInNlcnZpY2VcIjpcIkVDMlwiLFwiYWN0aW9uXCI6XCJtb2RpZnlWcGNFbmRwb2ludFNlcnZpY2VDb25maWd1cmF0aW9uXCIsXCJwYXJhbWV0ZXJzXCI6e1wiU2VydmljZUlkXCI6XCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdWUENFUzNBRTdENTY1JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnXCIsXCJSZW1vdmVQcml2YXRlRG5zTmFtZVwiOnRydWV9fScsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBEZXBlbmRzT246IFtcbiAgICAgICdFbmRwb2ludERvbWFpbkVuYWJsZURuc0N1c3RvbVJlc291cmNlUG9saWN5NUU2REU3RUInLFxuICAgICAgJ1ZQQ0VTM0FFN0Q1NjUnLFxuICAgIF0sXG4gIH0pO1xuXG4gIC8vIEhhdmUgdG8gdXNlIGBoYXZlUmVzb3VyY2VMaWtlYCBiZWNhdXNlIHRoZXJlIGlzIGEgcHJvcGVydHkgdGhhdCwgYnkgZGVzaWduLCBjaGFuZ2VzIG9uIGV2ZXJ5IGJ1aWxkXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0N1c3RvbTo6QVdTJywge1xuICAgIFByb3BlcnRpZXM6IHtcbiAgICAgIENyZWF0ZToge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ3tcInNlcnZpY2VcIjpcIkVDMlwiLFwiYWN0aW9uXCI6XCJkZXNjcmliZVZwY0VuZHBvaW50U2VydmljZUNvbmZpZ3VyYXRpb25zXCIsXCJwYXJhbWV0ZXJzXCI6e1wiU2VydmljZUlkc1wiOltcIicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ1ZQQ0VTM0FFN0Q1NjUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdcIl19LFwicGh5c2ljYWxSZXNvdXJjZUlkXCI6e1wiaWRcIjpcImZjZDI1NjM0NzkyNDRhODUxYTlhNTlhZjYwODMxYjAxXCJ9fScsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBVcGRhdGU6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICd7XCJzZXJ2aWNlXCI6XCJFQzJcIixcImFjdGlvblwiOlwiZGVzY3JpYmVWcGNFbmRwb2ludFNlcnZpY2VDb25maWd1cmF0aW9uc1wiLFwicGFyYW1ldGVyc1wiOntcIlNlcnZpY2VJZHNcIjpbXCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdWUENFUzNBRTdENTY1JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnXCJdfSxcInBoeXNpY2FsUmVzb3VyY2VJZFwiOntcImlkXCI6XCJmY2QyNTYzNDc5MjQ0YTg1MWE5YTU5YWY2MDgzMWIwMVwifX0nLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgRGVwZW5kc09uOiBbXG4gICAgICAnRW5kcG9pbnREb21haW5FbmFibGVEbnNDdXN0b21SZXNvdXJjZVBvbGljeTVFNkRFN0VCJyxcbiAgICAgICdFbmRwb2ludERvbWFpbkVuYWJsZURuc0RBQ0JGNUE2JyxcbiAgICAgICdFbmRwb2ludERvbWFpbkdldE5hbWVzQ3VzdG9tUmVzb3VyY2VQb2xpY3kxNDE3NzVCMScsXG4gICAgICAnVlBDRVMzQUU3RDU2NScsXG4gICAgXSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpSb3V0ZTUzOjpSZWNvcmRTZXQnLCB7XG4gICAgUHJvcGVydGllczoge1xuICAgICAgTmFtZToge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnRW5kcG9pbnREb21haW5HZXROYW1lczlFNjk3RUQyJyxcbiAgICAgICAgICAgICAgICAnU2VydmljZUNvbmZpZ3VyYXRpb25zLjAuUHJpdmF0ZURuc05hbWVDb25maWd1cmF0aW9uLk5hbWUnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICcuYXdzLWNkay5kZXYuJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIFR5cGU6ICdUWFQnLFxuICAgICAgSG9zdGVkWm9uZUlkOiB7XG4gICAgICAgIFJlZjogJ1BIWjQ1QkU5MDNEJyxcbiAgICAgIH0sXG4gICAgICBSZXNvdXJjZVJlY29yZHM6IFtcbiAgICAgICAge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnXFxcIicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdFbmRwb2ludERvbWFpbkdldE5hbWVzOUU2OTdFRDInLFxuICAgICAgICAgICAgICAgICAgJ1NlcnZpY2VDb25maWd1cmF0aW9ucy4wLlByaXZhdGVEbnNOYW1lQ29uZmlndXJhdGlvbi5WYWx1ZScsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ1xcXCInLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFRUTDogJzE4MDAnLFxuICAgIH0sXG4gICAgRGVwZW5kc09uOiBbXG4gICAgICAnVlBDRVMzQUU3RDU2NScsXG4gICAgXSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQ3VzdG9tOjpBV1MnLCB7XG4gICAgUHJvcGVydGllczoge1xuICAgICAgQ3JlYXRlOiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAne1wic2VydmljZVwiOlwiRUMyXCIsXCJhY3Rpb25cIjpcInN0YXJ0VnBjRW5kcG9pbnRTZXJ2aWNlUHJpdmF0ZURuc1ZlcmlmaWNhdGlvblwiLFwicGFyYW1ldGVyc1wiOntcIlNlcnZpY2VJZFwiOlwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnVlBDRVMzQUU3RDU2NScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1wifSxcInBoeXNpY2FsUmVzb3VyY2VJZFwiOntcImlkXCI6XCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJ0VuZHBvaW50RG9tYWluR2V0TmFtZXM5RTY5N0VEMicsXG4gICAgICAgICAgICAgICAgICAgICAgJ1NlcnZpY2VDb25maWd1cmF0aW9ucy4wLlByaXZhdGVEbnNOYW1lQ29uZmlndXJhdGlvbi5OYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICdFbmRwb2ludERvbWFpbkdldE5hbWVzOUU2OTdFRDInLFxuICAgICAgICAgICAgICAgICAgICAgICdTZXJ2aWNlQ29uZmlndXJhdGlvbnMuMC5Qcml2YXRlRG5zTmFtZUNvbmZpZ3VyYXRpb24uVmFsdWUnLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdcIn19JyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIFVwZGF0ZToge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ3tcInNlcnZpY2VcIjpcIkVDMlwiLFwiYWN0aW9uXCI6XCJzdGFydFZwY0VuZHBvaW50U2VydmljZVByaXZhdGVEbnNWZXJpZmljYXRpb25cIixcInBhcmFtZXRlcnNcIjp7XCJTZXJ2aWNlSWRcIjpcIicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ1ZQQ0VTM0FFN0Q1NjUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdcIn0sXCJwaHlzaWNhbFJlc291cmNlSWRcIjp7XCJpZFwiOlwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICdFbmRwb2ludERvbWFpbkdldE5hbWVzOUU2OTdFRDInLFxuICAgICAgICAgICAgICAgICAgICAgICdTZXJ2aWNlQ29uZmlndXJhdGlvbnMuMC5Qcml2YXRlRG5zTmFtZUNvbmZpZ3VyYXRpb24uTmFtZScsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAnRW5kcG9pbnREb21haW5HZXROYW1lczlFNjk3RUQyJyxcbiAgICAgICAgICAgICAgICAgICAgICAnU2VydmljZUNvbmZpZ3VyYXRpb25zLjAuUHJpdmF0ZURuc05hbWVDb25maWd1cmF0aW9uLlZhbHVlJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnXCJ9fScsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBEZXBlbmRzT246IFtcbiAgICAgICdFbmRwb2ludERvbWFpbkRuc1ZlcmlmaWNhdGlvblJlY29yZDY2NjIzQkRBJyxcbiAgICAgICdFbmRwb2ludERvbWFpblN0YXJ0VmVyaWZpY2F0aW9uQ3VzdG9tUmVzb3VyY2VQb2xpY3lEMkJBQzlBNicsXG4gICAgICAnVlBDRVMzQUU3RDU2NScsXG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdCgndGhyb3dzIGlmIGNyZWF0aW5nIG11bHRpcGxlIGRvbWFpbnMgZm9yIGEgc2luZ2xlIHNlcnZpY2UnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIHZwY2VzID0gbmV3IFZwY0VuZHBvaW50U2VydmljZShzdGFjaywgJ1ZQQ0VTLTInLCB7XG4gICAgdnBjRW5kcG9pbnRTZXJ2aWNlTG9hZEJhbGFuY2VyczogW25sYl0sXG4gIH0pO1xuXG4gIG5ldyBWcGNFbmRwb2ludFNlcnZpY2VEb21haW5OYW1lKHN0YWNrLCAnRW5kcG9pbnREb21haW4nLCB7XG4gICAgZW5kcG9pbnRTZXJ2aWNlOiB2cGNlcyxcbiAgICBkb21haW5OYW1lOiAnbXktc3R1ZmYtMS5hd3MtY2RrLmRldicsXG4gICAgcHVibGljSG9zdGVkWm9uZTogem9uZSxcbiAgfSk7XG5cbiAgLy8gV0hFTiAvIFRIRU5cbiAgZXhwZWN0KCgpID0+IHtcbiAgICBuZXcgVnBjRW5kcG9pbnRTZXJ2aWNlRG9tYWluTmFtZShzdGFjaywgJ0VuZHBvaW50RG9tYWluMicsIHtcbiAgICAgIGVuZHBvaW50U2VydmljZTogdnBjZXMsXG4gICAgICBkb21haW5OYW1lOiAnbXktc3R1ZmYtMi5hd3MtY2RrLmRldicsXG4gICAgICBwdWJsaWNIb3N0ZWRab25lOiB6b25lLFxuICAgIH0pO1xuICB9KS50b1Rocm93KC9DYW5ub3QgY3JlYXRlIGEgVnBjRW5kcG9pbnRTZXJ2aWNlRG9tYWluTmFtZSBmb3Igc2VydmljZS8pO1xufSk7XG5cbnRlc3QoJ2VuZHBvaW50IGRvbWFpbiBuYW1lIHByb3BlcnR5IGVxdWFscyBpbnB1dCBkb21haW4gbmFtZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgdnBjZXMgPSBuZXcgVnBjRW5kcG9pbnRTZXJ2aWNlKHN0YWNrLCAnTmFtZVRlc3QnLCB7XG4gICAgdnBjRW5kcG9pbnRTZXJ2aWNlTG9hZEJhbGFuY2VyczogW25sYl0sXG4gIH0pO1xuXG4gIGNvbnN0IGRuID0gbmV3IFZwY0VuZHBvaW50U2VydmljZURvbWFpbk5hbWUoc3RhY2ssICdFbmRwb2ludERvbWFpbicsIHtcbiAgICBlbmRwb2ludFNlcnZpY2U6IHZwY2VzLFxuICAgIGRvbWFpbk5hbWU6ICduYW1lLXRlc3QuYXdzLWNkay5kZXYnLFxuICAgIHB1YmxpY0hvc3RlZFpvbmU6IHpvbmUsXG4gIH0pO1xuICBleHBlY3QoZG4uZG9tYWluTmFtZSkudG9FcXVhbCgnbmFtZS10ZXN0LmF3cy1jZGsuZGV2Jyk7XG59KTsiXX0=