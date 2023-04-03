"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const s3 = require("@aws-cdk/aws-s3");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('origin group', () => {
    cdk_build_tools_1.testDeprecated('Distribution with custom origin failover', () => {
        const stack = new cdk.Stack();
        new lib_1.CloudFrontWebDistribution(stack, 'ADistribution', {
            originConfigs: [
                {
                    originHeaders: {
                        'X-Custom-Header': 'somevalue',
                    },
                    customOriginSource: {
                        domainName: 'myorigin.com',
                    },
                    failoverCustomOriginSource: {
                        domainName: 'myoriginfallback.com',
                    },
                    behaviors: [
                        {
                            isDefaultBehavior: true,
                        },
                    ],
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                OriginGroups: {
                    Items: [
                        {
                            FailoverCriteria: {
                                StatusCodes: {
                                    Items: [
                                        500,
                                        502,
                                        503,
                                        504,
                                    ],
                                    Quantity: 4,
                                },
                            },
                            Id: 'OriginGroup1',
                            Members: {
                                Items: [
                                    {
                                        OriginId: 'origin1',
                                    },
                                    {
                                        OriginId: 'originSecondary1',
                                    },
                                ],
                                Quantity: 2,
                            },
                        },
                    ],
                    Quantity: 1,
                },
                Origins: [
                    assertions_1.Match.objectLike({
                        CustomOriginConfig: {
                            HTTPPort: 80,
                            HTTPSPort: 443,
                            OriginKeepaliveTimeout: 5,
                            OriginProtocolPolicy: 'https-only',
                            OriginReadTimeout: 30,
                            OriginSSLProtocols: [
                                'TLSv1.2',
                            ],
                        },
                        DomainName: 'myoriginfallback.com',
                        Id: 'originSecondary1',
                        OriginCustomHeaders: [
                            {
                                HeaderName: 'X-Custom-Header',
                                HeaderValue: 'somevalue',
                            },
                        ],
                    }),
                    assertions_1.Match.objectLike({
                        CustomOriginConfig: {
                            HTTPPort: 80,
                            HTTPSPort: 443,
                            OriginKeepaliveTimeout: 5,
                            OriginProtocolPolicy: 'https-only',
                            OriginReadTimeout: 30,
                            OriginSSLProtocols: [
                                'TLSv1.2',
                            ],
                        },
                        DomainName: 'myorigin.com',
                        Id: 'origin1',
                        OriginCustomHeaders: [
                            {
                                HeaderName: 'X-Custom-Header',
                                HeaderValue: 'somevalue',
                            },
                        ],
                    }),
                ],
            },
        });
    });
    test('Distribution with s3 origin failover', () => {
        const stack = new cdk.Stack();
        new lib_1.CloudFrontWebDistribution(stack, 'ADistribution', {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: s3.Bucket.fromBucketName(stack, 'aBucket', 'myoriginbucket'),
                        originPath: '/',
                        originHeaders: {
                            myHeader: '42',
                        },
                    },
                    failoverS3OriginSource: {
                        s3BucketSource: s3.Bucket.fromBucketName(stack, 'aBucketFallback', 'myoriginbucketfallback'),
                        originPath: '/somwhere',
                        originHeaders: {
                            myHeader2: '21',
                        },
                    },
                    failoverCriteriaStatusCodes: [lib_1.FailoverStatusCode.INTERNAL_SERVER_ERROR],
                    behaviors: [
                        {
                            isDefaultBehavior: true,
                        },
                    ],
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
            DistributionConfig: {
                OriginGroups: {
                    Items: [
                        {
                            FailoverCriteria: {
                                StatusCodes: {
                                    Items: [
                                        500,
                                    ],
                                    Quantity: 1,
                                },
                            },
                            Id: 'OriginGroup1',
                            Members: {
                                Items: [
                                    {
                                        OriginId: 'origin1',
                                    },
                                    {
                                        OriginId: 'originSecondary1',
                                    },
                                ],
                                Quantity: 2,
                            },
                        },
                    ],
                    Quantity: 1,
                },
                Origins: [
                    assertions_1.Match.objectLike({
                        DomainName: {
                            'Fn::Join': [
                                '',
                                [
                                    'myoriginbucketfallback.s3.',
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    '.',
                                    {
                                        Ref: 'AWS::URLSuffix',
                                    },
                                ],
                            ],
                        },
                        Id: 'originSecondary1',
                        OriginCustomHeaders: [
                            {
                                HeaderName: 'myHeader2',
                                HeaderValue: '21',
                            },
                        ],
                        OriginPath: '/somwhere',
                        S3OriginConfig: {},
                    }),
                    assertions_1.Match.objectLike({
                        DomainName: {
                            'Fn::Join': [
                                '',
                                [
                                    'myoriginbucket.s3.',
                                    {
                                        Ref: 'AWS::Region',
                                    },
                                    '.',
                                    {
                                        Ref: 'AWS::URLSuffix',
                                    },
                                ],
                            ],
                        },
                        Id: 'origin1',
                        OriginCustomHeaders: [
                            {
                                HeaderName: 'myHeader',
                                HeaderValue: '42',
                            },
                        ],
                        OriginPath: '/',
                        S3OriginConfig: {},
                    }),
                ],
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JpZ2luLWdyb3Vwcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib3JpZ2luLWdyb3Vwcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELHNDQUFzQztBQUN0Qyw4REFBMEQ7QUFDMUQscUNBQXFDO0FBQ3JDLGdDQUF1RTtBQUV2RSxRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtJQUM1QixnQ0FBYyxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsRUFBRTtRQUM5RCxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QixJQUFJLCtCQUF5QixDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUU7WUFDcEQsYUFBYSxFQUFFO2dCQUNiO29CQUNFLGFBQWEsRUFBRTt3QkFDYixpQkFBaUIsRUFBRSxXQUFXO3FCQUMvQjtvQkFDRCxrQkFBa0IsRUFBRTt3QkFDbEIsVUFBVSxFQUFFLGNBQWM7cUJBQzNCO29CQUNELDBCQUEwQixFQUFFO3dCQUMxQixVQUFVLEVBQUUsc0JBQXNCO3FCQUNuQztvQkFDRCxTQUFTLEVBQUU7d0JBQ1Q7NEJBQ0UsaUJBQWlCLEVBQUUsSUFBSTt5QkFDeEI7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLCtCQUErQixFQUFFO1lBQy9FLGtCQUFrQixFQUFFO2dCQUNsQixZQUFZLEVBQUU7b0JBQ1osS0FBSyxFQUFFO3dCQUNMOzRCQUNFLGdCQUFnQixFQUFFO2dDQUNoQixXQUFXLEVBQUU7b0NBQ1gsS0FBSyxFQUFFO3dDQUNMLEdBQUc7d0NBQ0gsR0FBRzt3Q0FDSCxHQUFHO3dDQUNILEdBQUc7cUNBQ0o7b0NBQ0QsUUFBUSxFQUFFLENBQUM7aUNBQ1o7NkJBQ0Y7NEJBQ0QsRUFBRSxFQUFFLGNBQWM7NEJBQ2xCLE9BQU8sRUFBRTtnQ0FD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LENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0IHsgdGVzdERlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbiwgRmFpbG92ZXJTdGF0dXNDb2RlIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ29yaWdpbiBncm91cCcsICgpID0+IHtcbiAgdGVzdERlcHJlY2F0ZWQoJ0Rpc3RyaWJ1dGlvbiB3aXRoIGN1c3RvbSBvcmlnaW4gZmFpbG92ZXInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBuZXcgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0FEaXN0cmlidXRpb24nLCB7XG4gICAgICBvcmlnaW5Db25maWdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBvcmlnaW5IZWFkZXJzOiB7XG4gICAgICAgICAgICAnWC1DdXN0b20tSGVhZGVyJzogJ3NvbWV2YWx1ZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjdXN0b21PcmlnaW5Tb3VyY2U6IHtcbiAgICAgICAgICAgIGRvbWFpbk5hbWU6ICdteW9yaWdpbi5jb20nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZmFpbG92ZXJDdXN0b21PcmlnaW5Tb3VyY2U6IHtcbiAgICAgICAgICAgIGRvbWFpbk5hbWU6ICdteW9yaWdpbmZhbGxiYWNrLmNvbScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBiZWhhdmlvcnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRGcm9udDo6RGlzdHJpYnV0aW9uJywge1xuICAgICAgRGlzdHJpYnV0aW9uQ29uZmlnOiB7XG4gICAgICAgIE9yaWdpbkdyb3Vwczoge1xuICAgICAgICAgIEl0ZW1zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEZhaWxvdmVyQ3JpdGVyaWE6IHtcbiAgICAgICAgICAgICAgICBTdGF0dXNDb2Rlczoge1xuICAgICAgICAgICAgICAgICAgSXRlbXM6IFtcbiAgICAgICAgICAgICAgICAgICAgNTAwLFxuICAgICAgICAgICAgICAgICAgICA1MDIsXG4gICAgICAgICAgICAgICAgICAgIDUwMyxcbiAgICAgICAgICAgICAgICAgICAgNTA0LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIFF1YW50aXR5OiA0LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIElkOiAnT3JpZ2luR3JvdXAxJyxcbiAgICAgICAgICAgICAgTWVtYmVyczoge1xuICAgICAgICAgICAgICAgIEl0ZW1zOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIE9yaWdpbklkOiAnb3JpZ2luMScsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBPcmlnaW5JZDogJ29yaWdpblNlY29uZGFyeTEnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFF1YW50aXR5OiAyLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFF1YW50aXR5OiAxLFxuICAgICAgICB9LFxuICAgICAgICBPcmlnaW5zOiBbXG4gICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICBDdXN0b21PcmlnaW5Db25maWc6IHtcbiAgICAgICAgICAgICAgSFRUUFBvcnQ6IDgwLFxuICAgICAgICAgICAgICBIVFRQU1BvcnQ6IDQ0MyxcbiAgICAgICAgICAgICAgT3JpZ2luS2VlcGFsaXZlVGltZW91dDogNSxcbiAgICAgICAgICAgICAgT3JpZ2luUHJvdG9jb2xQb2xpY3k6ICdodHRwcy1vbmx5JyxcbiAgICAgICAgICAgICAgT3JpZ2luUmVhZFRpbWVvdXQ6IDMwLFxuICAgICAgICAgICAgICBPcmlnaW5TU0xQcm90b2NvbHM6IFtcbiAgICAgICAgICAgICAgICAnVExTdjEuMicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRG9tYWluTmFtZTogJ215b3JpZ2luZmFsbGJhY2suY29tJyxcbiAgICAgICAgICAgIElkOiAnb3JpZ2luU2Vjb25kYXJ5MScsXG4gICAgICAgICAgICBPcmlnaW5DdXN0b21IZWFkZXJzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBIZWFkZXJOYW1lOiAnWC1DdXN0b20tSGVhZGVyJyxcbiAgICAgICAgICAgICAgICBIZWFkZXJWYWx1ZTogJ3NvbWV2YWx1ZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgQ3VzdG9tT3JpZ2luQ29uZmlnOiB7XG4gICAgICAgICAgICAgIEhUVFBQb3J0OiA4MCxcbiAgICAgICAgICAgICAgSFRUUFNQb3J0OiA0NDMsXG4gICAgICAgICAgICAgIE9yaWdpbktlZXBhbGl2ZVRpbWVvdXQ6IDUsXG4gICAgICAgICAgICAgIE9yaWdpblByb3RvY29sUG9saWN5OiAnaHR0cHMtb25seScsXG4gICAgICAgICAgICAgIE9yaWdpblJlYWRUaW1lb3V0OiAzMCxcbiAgICAgICAgICAgICAgT3JpZ2luU1NMUHJvdG9jb2xzOiBbXG4gICAgICAgICAgICAgICAgJ1RMU3YxLjInLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIERvbWFpbk5hbWU6ICdteW9yaWdpbi5jb20nLFxuICAgICAgICAgICAgSWQ6ICdvcmlnaW4xJyxcbiAgICAgICAgICAgIE9yaWdpbkN1c3RvbUhlYWRlcnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEhlYWRlck5hbWU6ICdYLUN1c3RvbS1IZWFkZXInLFxuICAgICAgICAgICAgICAgIEhlYWRlclZhbHVlOiAnc29tZXZhbHVlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdEaXN0cmlidXRpb24gd2l0aCBzMyBvcmlnaW4gZmFpbG92ZXInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBuZXcgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0FEaXN0cmlidXRpb24nLCB7XG4gICAgICBvcmlnaW5Db25maWdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzM09yaWdpblNvdXJjZToge1xuICAgICAgICAgICAgczNCdWNrZXRTb3VyY2U6IHMzLkJ1Y2tldC5mcm9tQnVja2V0TmFtZShzdGFjaywgJ2FCdWNrZXQnLCAnbXlvcmlnaW5idWNrZXQnKSxcbiAgICAgICAgICAgIG9yaWdpblBhdGg6ICcvJyxcbiAgICAgICAgICAgIG9yaWdpbkhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgbXlIZWFkZXI6ICc0MicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZmFpbG92ZXJTM09yaWdpblNvdXJjZToge1xuICAgICAgICAgICAgczNCdWNrZXRTb3VyY2U6IHMzLkJ1Y2tldC5mcm9tQnVja2V0TmFtZShzdGFjaywgJ2FCdWNrZXRGYWxsYmFjaycsICdteW9yaWdpbmJ1Y2tldGZhbGxiYWNrJyksXG4gICAgICAgICAgICBvcmlnaW5QYXRoOiAnL3NvbXdoZXJlJyxcbiAgICAgICAgICAgIG9yaWdpbkhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgbXlIZWFkZXIyOiAnMjEnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZhaWxvdmVyQ3JpdGVyaWFTdGF0dXNDb2RlczogW0ZhaWxvdmVyU3RhdHVzQ29kZS5JTlRFUk5BTF9TRVJWRVJfRVJST1JdLFxuICAgICAgICAgIGJlaGF2aW9yczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZEZyb250OjpEaXN0cmlidXRpb24nLCB7XG4gICAgICBEaXN0cmlidXRpb25Db25maWc6IHtcbiAgICAgICAgT3JpZ2luR3JvdXBzOiB7XG4gICAgICAgICAgSXRlbXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgRmFpbG92ZXJDcml0ZXJpYToge1xuICAgICAgICAgICAgICAgIFN0YXR1c0NvZGVzOiB7XG4gICAgICAgICAgICAgICAgICBJdGVtczogW1xuICAgICAgICAgICAgICAgICAgICA1MDAsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgUXVhbnRpdHk6IDEsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgSWQ6ICdPcmlnaW5Hcm91cDEnLFxuICAgICAgICAgICAgICBNZW1iZXJzOiB7XG4gICAgICAgICAgICAgICAgSXRlbXM6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgT3JpZ2luSWQ6ICdvcmlnaW4xJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIE9yaWdpbklkOiAnb3JpZ2luU2Vjb25kYXJ5MScsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgUXVhbnRpdHk6IDIsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgUXVhbnRpdHk6IDEsXG4gICAgICAgIH0sXG4gICAgICAgIE9yaWdpbnM6IFtcbiAgICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgIERvbWFpbk5hbWU6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICdteW9yaWdpbmJ1Y2tldGZhbGxiYWNrLnMzLicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnLicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6VVJMU3VmZml4JyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBJZDogJ29yaWdpblNlY29uZGFyeTEnLFxuICAgICAgICAgICAgT3JpZ2luQ3VzdG9tSGVhZGVyczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgSGVhZGVyTmFtZTogJ215SGVhZGVyMicsXG4gICAgICAgICAgICAgICAgSGVhZGVyVmFsdWU6ICcyMScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgT3JpZ2luUGF0aDogJy9zb213aGVyZScsXG4gICAgICAgICAgICBTM09yaWdpbkNvbmZpZzoge30sXG4gICAgICAgICAgfSksXG4gICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICBEb21haW5OYW1lOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnbXlvcmlnaW5idWNrZXQuczMuJyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICcuJyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpVUkxTdWZmaXgnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIElkOiAnb3JpZ2luMScsXG4gICAgICAgICAgICBPcmlnaW5DdXN0b21IZWFkZXJzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBIZWFkZXJOYW1lOiAnbXlIZWFkZXInLFxuICAgICAgICAgICAgICAgIEhlYWRlclZhbHVlOiAnNDInLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIE9yaWdpblBhdGg6ICcvJyxcbiAgICAgICAgICAgIFMzT3JpZ2luQ29uZmlnOiB7fSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cblxuICB9KTtcbn0pO1xuIl19