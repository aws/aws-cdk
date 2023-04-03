"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const aws_route53_1 = require("@aws-cdk/aws-route53");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const core_1 = require("@aws-cdk/core");
const dns_validated_certificate_1 = require("../lib/dns-validated-certificate");
cdk_build_tools_1.testDeprecated('creates CloudFormation Custom Resource', () => {
    const stack = new core_1.Stack();
    const exampleDotComZone = new aws_route53_1.PublicHostedZone(stack, 'ExampleDotCom', {
        zoneName: 'example.com',
    });
    new dns_validated_certificate_1.DnsValidatedCertificate(stack, 'Certificate', {
        domainName: 'test.example.com',
        hostedZone: exampleDotComZone,
        subjectAlternativeNames: ['test2.example.com'],
        cleanupRoute53Records: true,
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::CustomResource', {
        DomainName: 'test.example.com',
        SubjectAlternativeNames: ['test2.example.com'],
        ServiceToken: {
            'Fn::GetAtt': [
                'CertificateCertificateRequestorFunction5E845413',
                'Arn',
            ],
        },
        HostedZoneId: {
            Ref: 'ExampleDotCom4D1B83AA',
        },
        CleanupRecords: 'true',
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Handler: 'index.certificateRequestHandler',
        Runtime: 'nodejs14.x',
        Timeout: 900,
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyName: 'CertificateCertificateRequestorFunctionServiceRoleDefaultPolicy3C8845BC',
        Roles: [
            {
                Ref: 'CertificateCertificateRequestorFunctionServiceRoleC04C13DA',
            },
        ],
        PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: [
                        'acm:RequestCertificate',
                        'acm:DescribeCertificate',
                        'acm:DeleteCertificate',
                        'acm:AddTagsToCertificate',
                    ],
                    Effect: 'Allow',
                    Resource: '*',
                },
                {
                    Action: 'route53:GetChange',
                    Effect: 'Allow',
                    Resource: '*',
                },
                {
                    Action: 'route53:changeResourceRecordSets',
                    Effect: 'Allow',
                    Resource: {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                { Ref: 'AWS::Partition' },
                                ':route53:::hostedzone/',
                                { Ref: 'ExampleDotCom4D1B83AA' },
                            ],
                        ],
                    },
                    Condition: {
                        'ForAllValues:StringEquals': {
                            'route53:ChangeResourceRecordSetsRecordTypes': ['CNAME'],
                            'route53:ChangeResourceRecordSetsActions': ['UPSERT', 'DELETE'],
                        },
                        'ForAllValues:StringLike': {
                            'route53:ChangeResourceRecordSetsNormalizedRecordNames': [
                                '*.test.example.com',
                                '*.test2.example.com',
                            ],
                        },
                    },
                },
            ],
        },
    });
});
cdk_build_tools_1.testDeprecated('adds validation error on domain mismatch', () => {
    const stack = new core_1.Stack();
    const helloDotComZone = new aws_route53_1.PublicHostedZone(stack, 'HelloDotCom', {
        zoneName: 'hello.com',
    });
    new dns_validated_certificate_1.DnsValidatedCertificate(stack, 'Cert', {
        domainName: 'example.com',
        hostedZone: helloDotComZone,
    });
    expect(() => {
        assertions_1.Template.fromStack(stack);
    }).toThrow(/DNS zone hello.com is not authoritative for certificate domain name example.com/);
});
cdk_build_tools_1.testDeprecated('does not try to validate unresolved tokens', () => {
    const stack = new core_1.Stack();
    const helloDotComZone = new aws_route53_1.PublicHostedZone(stack, 'HelloDotCom', {
        zoneName: core_1.Token.asString('hello.com'),
    });
    new dns_validated_certificate_1.DnsValidatedCertificate(stack, 'Cert', {
        domainName: 'hello.com',
        hostedZone: helloDotComZone,
    });
    assertions_1.Template.fromStack(stack); // does not throw
});
cdk_build_tools_1.testDeprecated('test root certificate', () => {
    const stack = new core_1.Stack();
    const exampleDotComZone = new aws_route53_1.PublicHostedZone(stack, 'ExampleDotCom', {
        zoneName: 'example.com',
    });
    new dns_validated_certificate_1.DnsValidatedCertificate(stack, 'Cert', {
        domainName: 'example.com',
        hostedZone: exampleDotComZone,
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::CustomResource', {
        ServiceToken: {
            'Fn::GetAtt': [
                'CertCertificateRequestorFunction98FDF273',
                'Arn',
            ],
        },
        DomainName: 'example.com',
        HostedZoneId: {
            Ref: 'ExampleDotCom4D1B83AA',
        },
    });
});
cdk_build_tools_1.testDeprecated('test tags are passed to customresource', () => {
    const stack = new core_1.Stack();
    core_1.Tags.of(stack).add('Key1', 'Value1');
    const exampleDotComZone = new aws_route53_1.PublicHostedZone(stack, 'ExampleDotCom', {
        zoneName: 'example.com',
    });
    new dns_validated_certificate_1.DnsValidatedCertificate(stack, 'Cert', {
        domainName: 'example.com',
        hostedZone: exampleDotComZone,
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::CustomResource', {
        ServiceToken: {
            'Fn::GetAtt': [
                'CertCertificateRequestorFunction98FDF273',
                'Arn',
            ],
        },
        DomainName: 'example.com',
        HostedZoneId: {
            Ref: 'ExampleDotCom4D1B83AA',
        },
        Tags: {
            Key1: 'Value1',
        },
    });
});
cdk_build_tools_1.testDeprecated('works with imported zone', () => {
    // GIVEN
    const app = new core_1.App();
    const stack = new core_1.Stack(app, 'Stack', {
        env: { account: '12345678', region: 'us-blue-5' },
    });
    const imported = aws_route53_1.HostedZone.fromLookup(stack, 'ExampleDotCom', {
        domainName: 'mydomain.com',
    });
    // WHEN
    new dns_validated_certificate_1.DnsValidatedCertificate(stack, 'Cert', {
        domainName: 'mydomain.com',
        hostedZone: imported,
        route53Endpoint: 'https://api.route53.xxx.com',
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::CustomResource', {
        ServiceToken: {
            'Fn::GetAtt': [
                'CertCertificateRequestorFunction98FDF273',
                'Arn',
            ],
        },
        DomainName: 'mydomain.com',
        HostedZoneId: 'DUMMY',
        Route53Endpoint: 'https://api.route53.xxx.com',
    });
});
cdk_build_tools_1.testDeprecated('works with imported role', () => {
    // GIVEN
    const app = new core_1.App();
    const stack = new core_1.Stack(app, 'Stack', {
        env: { account: '12345678', region: 'us-blue-5' },
    });
    const helloDotComZone = new aws_route53_1.PublicHostedZone(stack, 'HelloDotCom', {
        zoneName: 'hello.com',
    });
    const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::account-id:role/role-name');
    // WHEN
    new dns_validated_certificate_1.DnsValidatedCertificate(stack, 'Cert', {
        domainName: 'hello.com',
        hostedZone: helloDotComZone,
        customResourceRole: role,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Role: 'arn:aws:iam::account-id:role/role-name',
    });
});
cdk_build_tools_1.testDeprecated('throws when domain name is longer than 64 characters', () => {
    const stack = new core_1.Stack();
    const exampleDotComZone = new aws_route53_1.PublicHostedZone(stack, 'ExampleDotCom', {
        zoneName: 'example.com',
    });
    expect(() => {
        new dns_validated_certificate_1.DnsValidatedCertificate(stack, 'Cert', {
            domainName: 'example.com'.repeat(7),
            hostedZone: exampleDotComZone,
        });
    }).toThrow(/Domain name must be 64 characters or less/);
}),
    cdk_build_tools_1.testDeprecated('does not throw when domain name is longer than 64 characters with tokens', () => {
        const stack = new core_1.Stack();
        const zoneName = 'example.com';
        const exampleDotComZone = new aws_route53_1.PublicHostedZone(stack, 'ExampleDotCom', {
            zoneName,
        });
        const embededToken = core_1.Aws.REGION;
        const baseSubDomain = 'a'.repeat(65 - embededToken.length - 1 - zoneName.length);
        const domainName = `${embededToken}${baseSubDomain}.${zoneName}`;
        new dns_validated_certificate_1.DnsValidatedCertificate(stack, 'Cert', {
            domainName,
            hostedZone: exampleDotComZone,
            transparencyLoggingEnabled: false,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::CustomResource', {
            ServiceToken: {
                'Fn::GetAtt': [
                    'CertCertificateRequestorFunction98FDF273',
                    'Arn',
                ],
            },
            DomainName: {
                'Fn::Join': [
                    '',
                    [
                        {
                            Ref: 'AWS::Region',
                        },
                        `${baseSubDomain}.${zoneName}`,
                    ],
                ],
            },
            HostedZoneId: {
                Ref: 'ExampleDotCom4D1B83AA',
            },
            CertificateTransparencyLoggingPreference: 'DISABLED',
        });
    });
cdk_build_tools_1.testDeprecated('test transparency logging settings is passed to the custom resource', () => {
    const stack = new core_1.Stack();
    const exampleDotComZone = new aws_route53_1.PublicHostedZone(stack, 'ExampleDotCom', {
        zoneName: 'example.com',
    });
    new dns_validated_certificate_1.DnsValidatedCertificate(stack, 'Cert', {
        domainName: 'example.com',
        hostedZone: exampleDotComZone,
        transparencyLoggingEnabled: false,
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::CustomResource', {
        ServiceToken: {
            'Fn::GetAtt': [
                'CertCertificateRequestorFunction98FDF273',
                'Arn',
            ],
        },
        DomainName: 'example.com',
        HostedZoneId: {
            Ref: 'ExampleDotCom4D1B83AA',
        },
        CertificateTransparencyLoggingPreference: 'DISABLED',
    });
});
cdk_build_tools_1.testDeprecated('can set removal policy', () => {
    const stack = new core_1.Stack();
    const exampleDotComZone = new aws_route53_1.PublicHostedZone(stack, 'ExampleDotCom', {
        zoneName: 'example.com',
    });
    const cert = new dns_validated_certificate_1.DnsValidatedCertificate(stack, 'Certificate', {
        domainName: 'test.example.com',
        hostedZone: exampleDotComZone,
        subjectAlternativeNames: ['test2.example.com'],
        cleanupRoute53Records: true,
    });
    cert.applyRemovalPolicy(core_1.RemovalPolicy.RETAIN);
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CloudFormation::CustomResource', {
        DomainName: 'test.example.com',
        SubjectAlternativeNames: ['test2.example.com'],
        RemovalPolicy: 'retain',
        ServiceToken: {
            'Fn::GetAtt': [
                'CertificateCertificateRequestorFunction5E845413',
                'Arn',
            ],
        },
        HostedZoneId: {
            Ref: 'ExampleDotCom4D1B83AA',
        },
        CleanupRecords: 'true',
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG5zLXZhbGlkYXRlZC1jZXJ0aWZpY2F0ZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZG5zLXZhbGlkYXRlZC1jZXJ0aWZpY2F0ZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUF3QztBQUN4QyxzREFBb0U7QUFDcEUsOERBQTBEO0FBQzFELHdDQUE0RTtBQUM1RSxnRkFBMkU7QUFFM0UsZ0NBQWMsQ0FBQyx3Q0FBd0MsRUFBRSxHQUFHLEVBQUU7SUFDNUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUUxQixNQUFNLGlCQUFpQixHQUFHLElBQUksOEJBQWdCLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRTtRQUNyRSxRQUFRLEVBQUUsYUFBYTtLQUN4QixDQUFDLENBQUM7SUFFSCxJQUFJLG1EQUF1QixDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUU7UUFDaEQsVUFBVSxFQUFFLGtCQUFrQjtRQUM5QixVQUFVLEVBQUUsaUJBQWlCO1FBQzdCLHVCQUF1QixFQUFFLENBQUMsbUJBQW1CLENBQUM7UUFDOUMscUJBQXFCLEVBQUUsSUFBSTtLQUM1QixDQUFDLENBQUM7SUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxxQ0FBcUMsRUFBRTtRQUNyRixVQUFVLEVBQUUsa0JBQWtCO1FBQzlCLHVCQUF1QixFQUFFLENBQUMsbUJBQW1CLENBQUM7UUFDOUMsWUFBWSxFQUFFO1lBQ1osWUFBWSxFQUFFO2dCQUNaLGlEQUFpRDtnQkFDakQsS0FBSzthQUNOO1NBQ0Y7UUFDRCxZQUFZLEVBQUU7WUFDWixHQUFHLEVBQUUsdUJBQXVCO1NBQzdCO1FBQ0QsY0FBYyxFQUFFLE1BQU07S0FDdkIsQ0FBQyxDQUFDO0lBQ0gscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUJBQXVCLEVBQUU7UUFDdkUs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a0JBQWtCO1FBQzlCLFVBQVUsRUFBRSxpQkFBaUI7UUFDN0IsdUJBQXVCLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztRQUM5QyxxQkFBcUIsRUFBRSxJQUFJO0tBQzVCLENBQUMsQ0FBQztJQUNILElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRTlDLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHFDQUFxQyxFQUFFO1FBQ3JGLFVBQVUsRUFBRSxrQkFBa0I7UUFDOUIsdUJBQXVCLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztRQUM5QyxhQUFhLEVBQUUsUUFBUTtRQUN2QixZQUFZLEVBQUU7WUFDWixZQUFZLEVBQUU7Z0JBQ1osaURBQWlEO2dCQUNqRCxLQUFLO2FBQ047U0FDRjtRQUNELFlBQVksRUFBRTtZQUNaLEdBQUcsRUFBRSx1QkFBdUI7U0FDN0I7UUFDRCxjQUFjLEVBQUUsTUFBTTtLQUN2QixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBIb3N0ZWRab25lLCBQdWJsaWNIb3N0ZWRab25lIH0gZnJvbSAnQGF3cy1jZGsvYXdzLXJvdXRlNTMnO1xuaW1wb3J0IHsgdGVzdERlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0IHsgQXBwLCBTdGFjaywgVG9rZW4sIFRhZ3MsIFJlbW92YWxQb2xpY3ksIEF3cyB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgRG5zVmFsaWRhdGVkQ2VydGlmaWNhdGUgfSBmcm9tICcuLi9saWIvZG5zLXZhbGlkYXRlZC1jZXJ0aWZpY2F0ZSc7XG5cbnRlc3REZXByZWNhdGVkKCdjcmVhdGVzIENsb3VkRm9ybWF0aW9uIEN1c3RvbSBSZXNvdXJjZScsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICBjb25zdCBleGFtcGxlRG90Q29tWm9uZSA9IG5ldyBQdWJsaWNIb3N0ZWRab25lKHN0YWNrLCAnRXhhbXBsZURvdENvbScsIHtcbiAgICB6b25lTmFtZTogJ2V4YW1wbGUuY29tJyxcbiAgfSk7XG5cbiAgbmV3IERuc1ZhbGlkYXRlZENlcnRpZmljYXRlKHN0YWNrLCAnQ2VydGlmaWNhdGUnLCB7XG4gICAgZG9tYWluTmFtZTogJ3Rlc3QuZXhhbXBsZS5jb20nLFxuICAgIGhvc3RlZFpvbmU6IGV4YW1wbGVEb3RDb21ab25lLFxuICAgIHN1YmplY3RBbHRlcm5hdGl2ZU5hbWVzOiBbJ3Rlc3QyLmV4YW1wbGUuY29tJ10sXG4gICAgY2xlYW51cFJvdXRlNTNSZWNvcmRzOiB0cnVlLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZEZvcm1hdGlvbjo6Q3VzdG9tUmVzb3VyY2UnLCB7XG4gICAgRG9tYWluTmFtZTogJ3Rlc3QuZXhhbXBsZS5jb20nLFxuICAgIFN1YmplY3RBbHRlcm5hdGl2ZU5hbWVzOiBbJ3Rlc3QyLmV4YW1wbGUuY29tJ10sXG4gICAgU2VydmljZVRva2VuOiB7XG4gICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgJ0NlcnRpZmljYXRlQ2VydGlmaWNhdGVSZXF1ZXN0b3JGdW5jdGlvbjVFODQ1NDEzJyxcbiAgICAgICAgJ0FybicsXG4gICAgICBdLFxuICAgIH0sXG4gICAgSG9zdGVkWm9uZUlkOiB7XG4gICAgICBSZWY6ICdFeGFtcGxlRG90Q29tNEQxQjgzQUEnLFxuICAgIH0sXG4gICAgQ2xlYW51cFJlY29yZHM6ICd0cnVlJyxcbiAgfSk7XG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgSGFuZGxlcjogJ2luZGV4LmNlcnRpZmljYXRlUmVxdWVzdEhhbmRsZXInLFxuICAgIFJ1bnRpbWU6ICdub2RlanMxNC54JyxcbiAgICBUaW1lb3V0OiA5MDAsXG4gIH0pO1xuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICBQb2xpY3lOYW1lOiAnQ2VydGlmaWNhdGVDZXJ0aWZpY2F0ZVJlcXVlc3RvckZ1bmN0aW9uU2VydmljZVJvbGVEZWZhdWx0UG9saWN5M0M4ODQ1QkMnLFxuICAgIFJvbGVzOiBbXG4gICAgICB7XG4gICAgICAgIFJlZjogJ0NlcnRpZmljYXRlQ2VydGlmaWNhdGVSZXF1ZXN0b3JGdW5jdGlvblNlcnZpY2VSb2xlQzA0QzEzREEnLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgJ2FjbTpSZXF1ZXN0Q2VydGlmaWNhdGUnLFxuICAgICAgICAgICAgJ2FjbTpEZXNjcmliZUNlcnRpZmljYXRlJyxcbiAgICAgICAgICAgICdhY206RGVsZXRlQ2VydGlmaWNhdGUnLFxuICAgICAgICAgICAgJ2FjbTpBZGRUYWdzVG9DZXJ0aWZpY2F0ZScsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEFjdGlvbjogJ3JvdXRlNTM6R2V0Q2hhbmdlJyxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEFjdGlvbjogJ3JvdXRlNTM6Y2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzJyxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAnOnJvdXRlNTM6Ojpob3N0ZWR6b25lLycsXG4gICAgICAgICAgICAgICAgeyBSZWY6ICdFeGFtcGxlRG90Q29tNEQxQjgzQUEnIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICAnRm9yQWxsVmFsdWVzOlN0cmluZ0VxdWFscyc6IHtcbiAgICAgICAgICAgICAgJ3JvdXRlNTM6Q2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzUmVjb3JkVHlwZXMnOiBbJ0NOQU1FJ10sXG4gICAgICAgICAgICAgICdyb3V0ZTUzOkNoYW5nZVJlc291cmNlUmVjb3JkU2V0c0FjdGlvbnMnOiBbJ1VQU0VSVCcsICdERUxFVEUnXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnRm9yQWxsVmFsdWVzOlN0cmluZ0xpa2UnOiB7XG4gICAgICAgICAgICAgICdyb3V0ZTUzOkNoYW5nZVJlc291cmNlUmVjb3JkU2V0c05vcm1hbGl6ZWRSZWNvcmROYW1lcyc6IFtcbiAgICAgICAgICAgICAgICAnKi50ZXN0LmV4YW1wbGUuY29tJyxcbiAgICAgICAgICAgICAgICAnKi50ZXN0Mi5leGFtcGxlLmNvbScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3REZXByZWNhdGVkKCdhZGRzIHZhbGlkYXRpb24gZXJyb3Igb24gZG9tYWluIG1pc21hdGNoJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIGNvbnN0IGhlbGxvRG90Q29tWm9uZSA9IG5ldyBQdWJsaWNIb3N0ZWRab25lKHN0YWNrLCAnSGVsbG9Eb3RDb20nLCB7XG4gICAgem9uZU5hbWU6ICdoZWxsby5jb20nLFxuICB9KTtcblxuICBuZXcgRG5zVmFsaWRhdGVkQ2VydGlmaWNhdGUoc3RhY2ssICdDZXJ0Jywge1xuICAgIGRvbWFpbk5hbWU6ICdleGFtcGxlLmNvbScsXG4gICAgaG9zdGVkWm9uZTogaGVsbG9Eb3RDb21ab25lLFxuICB9KTtcblxuICBleHBlY3QoKCkgPT4ge1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gIH0pLnRvVGhyb3coL0ROUyB6b25lIGhlbGxvLmNvbSBpcyBub3QgYXV0aG9yaXRhdGl2ZSBmb3IgY2VydGlmaWNhdGUgZG9tYWluIG5hbWUgZXhhbXBsZS5jb20vKTtcbn0pO1xuXG50ZXN0RGVwcmVjYXRlZCgnZG9lcyBub3QgdHJ5IHRvIHZhbGlkYXRlIHVucmVzb2x2ZWQgdG9rZW5zJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIGNvbnN0IGhlbGxvRG90Q29tWm9uZSA9IG5ldyBQdWJsaWNIb3N0ZWRab25lKHN0YWNrLCAnSGVsbG9Eb3RDb20nLCB7XG4gICAgem9uZU5hbWU6IFRva2VuLmFzU3RyaW5nKCdoZWxsby5jb20nKSxcbiAgfSk7XG5cbiAgbmV3IERuc1ZhbGlkYXRlZENlcnRpZmljYXRlKHN0YWNrLCAnQ2VydCcsIHtcbiAgICBkb21haW5OYW1lOiAnaGVsbG8uY29tJyxcbiAgICBob3N0ZWRab25lOiBoZWxsb0RvdENvbVpvbmUsXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7IC8vIGRvZXMgbm90IHRocm93XG59KTtcblxudGVzdERlcHJlY2F0ZWQoJ3Rlc3Qgcm9vdCBjZXJ0aWZpY2F0ZScsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICBjb25zdCBleGFtcGxlRG90Q29tWm9uZSA9IG5ldyBQdWJsaWNIb3N0ZWRab25lKHN0YWNrLCAnRXhhbXBsZURvdENvbScsIHtcbiAgICB6b25lTmFtZTogJ2V4YW1wbGUuY29tJyxcbiAgfSk7XG5cbiAgbmV3IERuc1ZhbGlkYXRlZENlcnRpZmljYXRlKHN0YWNrLCAnQ2VydCcsIHtcbiAgICBkb21haW5OYW1lOiAnZXhhbXBsZS5jb20nLFxuICAgIGhvc3RlZFpvbmU6IGV4YW1wbGVEb3RDb21ab25lLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZEZvcm1hdGlvbjo6Q3VzdG9tUmVzb3VyY2UnLCB7XG4gICAgU2VydmljZVRva2VuOiB7XG4gICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgJ0NlcnRDZXJ0aWZpY2F0ZVJlcXVlc3RvckZ1bmN0aW9uOThGREYyNzMnLFxuICAgICAgICAnQXJuJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBEb21haW5OYW1lOiAnZXhhbXBsZS5jb20nLFxuICAgIEhvc3RlZFpvbmVJZDoge1xuICAgICAgUmVmOiAnRXhhbXBsZURvdENvbTREMUI4M0FBJyxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0RGVwcmVjYXRlZCgndGVzdCB0YWdzIGFyZSBwYXNzZWQgdG8gY3VzdG9tcmVzb3VyY2UnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIFRhZ3Mub2Yoc3RhY2spLmFkZCgnS2V5MScsICdWYWx1ZTEnKTtcblxuICBjb25zdCBleGFtcGxlRG90Q29tWm9uZSA9IG5ldyBQdWJsaWNIb3N0ZWRab25lKHN0YWNrLCAnRXhhbXBsZURvdENvbScsIHtcbiAgICB6b25lTmFtZTogJ2V4YW1wbGUuY29tJyxcbiAgfSk7XG5cbiAgbmV3IERuc1ZhbGlkYXRlZENlcnRpZmljYXRlKHN0YWNrLCAnQ2VydCcsIHtcbiAgICBkb21haW5OYW1lOiAnZXhhbXBsZS5jb20nLFxuICAgIGhvc3RlZFpvbmU6IGV4YW1wbGVEb3RDb21ab25lLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZEZvcm1hdGlvbjo6Q3VzdG9tUmVzb3VyY2UnLCB7XG4gICAgU2VydmljZVRva2VuOiB7XG4gICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgJ0NlcnRDZXJ0aWZpY2F0ZVJlcXVlc3RvckZ1bmN0aW9uOThGREYyNzMnLFxuICAgICAgICAnQXJuJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBEb21haW5OYW1lOiAnZXhhbXBsZS5jb20nLFxuICAgIEhvc3RlZFpvbmVJZDoge1xuICAgICAgUmVmOiAnRXhhbXBsZURvdENvbTREMUI4M0FBJyxcbiAgICB9LFxuICAgIFRhZ3M6IHtcbiAgICAgIEtleTE6ICdWYWx1ZTEnLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3REZXByZWNhdGVkKCd3b3JrcyB3aXRoIGltcG9ydGVkIHpvbmUnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snLCB7XG4gICAgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3OCcsIHJlZ2lvbjogJ3VzLWJsdWUtNScgfSxcbiAgfSk7XG4gIGNvbnN0IGltcG9ydGVkID0gSG9zdGVkWm9uZS5mcm9tTG9va3VwKHN0YWNrLCAnRXhhbXBsZURvdENvbScsIHtcbiAgICBkb21haW5OYW1lOiAnbXlkb21haW4uY29tJyxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBuZXcgRG5zVmFsaWRhdGVkQ2VydGlmaWNhdGUoc3RhY2ssICdDZXJ0Jywge1xuICAgIGRvbWFpbk5hbWU6ICdteWRvbWFpbi5jb20nLFxuICAgIGhvc3RlZFpvbmU6IGltcG9ydGVkLFxuICAgIHJvdXRlNTNFbmRwb2ludDogJ2h0dHBzOi8vYXBpLnJvdXRlNTMueHh4LmNvbScsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2xvdWRGb3JtYXRpb246OkN1c3RvbVJlc291cmNlJywge1xuICAgIFNlcnZpY2VUb2tlbjoge1xuICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICdDZXJ0Q2VydGlmaWNhdGVSZXF1ZXN0b3JGdW5jdGlvbjk4RkRGMjczJyxcbiAgICAgICAgJ0FybicsXG4gICAgICBdLFxuICAgIH0sXG4gICAgRG9tYWluTmFtZTogJ215ZG9tYWluLmNvbScsXG4gICAgSG9zdGVkWm9uZUlkOiAnRFVNTVknLFxuICAgIFJvdXRlNTNFbmRwb2ludDogJ2h0dHBzOi8vYXBpLnJvdXRlNTMueHh4LmNvbScsXG4gIH0pO1xufSk7XG5cbnRlc3REZXByZWNhdGVkKCd3b3JrcyB3aXRoIGltcG9ydGVkIHJvbGUnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snLCB7XG4gICAgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3OCcsIHJlZ2lvbjogJ3VzLWJsdWUtNScgfSxcbiAgfSk7XG4gIGNvbnN0IGhlbGxvRG90Q29tWm9uZSA9IG5ldyBQdWJsaWNIb3N0ZWRab25lKHN0YWNrLCAnSGVsbG9Eb3RDb20nLCB7XG4gICAgem9uZU5hbWU6ICdoZWxsby5jb20nLFxuICB9KTtcbiAgY29uc3Qgcm9sZSA9IGlhbS5Sb2xlLmZyb21Sb2xlQXJuKHN0YWNrLCAnUm9sZScsICdhcm46YXdzOmlhbTo6YWNjb3VudC1pZDpyb2xlL3JvbGUtbmFtZScpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IERuc1ZhbGlkYXRlZENlcnRpZmljYXRlKHN0YWNrLCAnQ2VydCcsIHtcbiAgICBkb21haW5OYW1lOiAnaGVsbG8uY29tJyxcbiAgICBob3N0ZWRab25lOiBoZWxsb0RvdENvbVpvbmUsXG4gICAgY3VzdG9tUmVzb3VyY2VSb2xlOiByb2xlLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgUm9sZTogJ2Fybjphd3M6aWFtOjphY2NvdW50LWlkOnJvbGUvcm9sZS1uYW1lJyxcbiAgfSk7XG59KTtcblxuXG50ZXN0RGVwcmVjYXRlZCgndGhyb3dzIHdoZW4gZG9tYWluIG5hbWUgaXMgbG9uZ2VyIHRoYW4gNjQgY2hhcmFjdGVycycsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICBjb25zdCBleGFtcGxlRG90Q29tWm9uZSA9IG5ldyBQdWJsaWNIb3N0ZWRab25lKHN0YWNrLCAnRXhhbXBsZURvdENvbScsIHtcbiAgICB6b25lTmFtZTogJ2V4YW1wbGUuY29tJyxcbiAgfSk7XG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgbmV3IERuc1ZhbGlkYXRlZENlcnRpZmljYXRlKHN0YWNrLCAnQ2VydCcsIHtcbiAgICAgIGRvbWFpbk5hbWU6ICdleGFtcGxlLmNvbScucmVwZWF0KDcpLFxuICAgICAgaG9zdGVkWm9uZTogZXhhbXBsZURvdENvbVpvbmUsXG4gICAgfSk7XG4gIH0pLnRvVGhyb3coL0RvbWFpbiBuYW1lIG11c3QgYmUgNjQgY2hhcmFjdGVycyBvciBsZXNzLyk7XG59KSxcblxudGVzdERlcHJlY2F0ZWQoJ2RvZXMgbm90IHRocm93IHdoZW4gZG9tYWluIG5hbWUgaXMgbG9uZ2VyIHRoYW4gNjQgY2hhcmFjdGVycyB3aXRoIHRva2VucycsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgY29uc3Qgem9uZU5hbWUgPSAnZXhhbXBsZS5jb20nO1xuICBjb25zdCBleGFtcGxlRG90Q29tWm9uZSA9IG5ldyBQdWJsaWNIb3N0ZWRab25lKHN0YWNrLCAnRXhhbXBsZURvdENvbScsIHtcbiAgICB6b25lTmFtZSxcbiAgfSk7XG4gIGNvbnN0IGVtYmVkZWRUb2tlbiA9IEF3cy5SRUdJT047XG4gIGNvbnN0IGJhc2VTdWJEb21haW4gPSAnYScucmVwZWF0KDY1IC0gZW1iZWRlZFRva2VuLmxlbmd0aCAtMSAtem9uZU5hbWUubGVuZ3RoKTtcbiAgY29uc3QgZG9tYWluTmFtZSA9IGAke2VtYmVkZWRUb2tlbn0ke2Jhc2VTdWJEb21haW59LiR7em9uZU5hbWV9YDtcblxuICBuZXcgRG5zVmFsaWRhdGVkQ2VydGlmaWNhdGUoc3RhY2ssICdDZXJ0Jywge1xuICAgIGRvbWFpbk5hbWUsXG4gICAgaG9zdGVkWm9uZTogZXhhbXBsZURvdENvbVpvbmUsXG4gICAgdHJhbnNwYXJlbmN5TG9nZ2luZ0VuYWJsZWQ6IGZhbHNlLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZEZvcm1hdGlvbjo6Q3VzdG9tUmVzb3VyY2UnLCB7XG4gICAgU2VydmljZVRva2VuOiB7XG4gICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgJ0NlcnRDZXJ0aWZpY2F0ZVJlcXVlc3RvckZ1bmN0aW9uOThGREYyNzMnLFxuICAgICAgICAnQXJuJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBEb21haW5OYW1lOiB7XG4gICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICcnLFxuICAgICAgICBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYCR7YmFzZVN1YkRvbWFpbn0uJHt6b25lTmFtZX1gLFxuICAgICAgICBdLFxuICAgICAgXSxcbiAgICB9LFxuICAgIEhvc3RlZFpvbmVJZDoge1xuICAgICAgUmVmOiAnRXhhbXBsZURvdENvbTREMUI4M0FBJyxcbiAgICB9LFxuICAgIENlcnRpZmljYXRlVHJhbnNwYXJlbmN5TG9nZ2luZ1ByZWZlcmVuY2U6ICdESVNBQkxFRCcsXG4gIH0pO1xufSk7XG5cbnRlc3REZXByZWNhdGVkKCd0ZXN0IHRyYW5zcGFyZW5jeSBsb2dnaW5nIHNldHRpbmdzIGlzIHBhc3NlZCB0byB0aGUgY3VzdG9tIHJlc291cmNlJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIGNvbnN0IGV4YW1wbGVEb3RDb21ab25lID0gbmV3IFB1YmxpY0hvc3RlZFpvbmUoc3RhY2ssICdFeGFtcGxlRG90Q29tJywge1xuICAgIHpvbmVOYW1lOiAnZXhhbXBsZS5jb20nLFxuICB9KTtcblxuICBuZXcgRG5zVmFsaWRhdGVkQ2VydGlmaWNhdGUoc3RhY2ssICdDZXJ0Jywge1xuICAgIGRvbWFpbk5hbWU6ICdleGFtcGxlLmNvbScsXG4gICAgaG9zdGVkWm9uZTogZXhhbXBsZURvdENvbVpvbmUsXG4gICAgdHJhbnNwYXJlbmN5TG9nZ2luZ0VuYWJsZWQ6IGZhbHNlLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDbG91ZEZvcm1hdGlvbjo6Q3VzdG9tUmVzb3VyY2UnLCB7XG4gICAgU2VydmljZVRva2VuOiB7XG4gICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgJ0NlcnRDZXJ0aWZpY2F0ZVJlcXVlc3RvckZ1bmN0aW9uOThGREYyNzMnLFxuICAgICAgICAnQXJuJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBEb21haW5OYW1lOiAnZXhhbXBsZS5jb20nLFxuICAgIEhvc3RlZFpvbmVJZDoge1xuICAgICAgUmVmOiAnRXhhbXBsZURvdENvbTREMUI4M0FBJyxcbiAgICB9LFxuICAgIENlcnRpZmljYXRlVHJhbnNwYXJlbmN5TG9nZ2luZ1ByZWZlcmVuY2U6ICdESVNBQkxFRCcsXG4gIH0pO1xufSk7XG5cbnRlc3REZXByZWNhdGVkKCdjYW4gc2V0IHJlbW92YWwgcG9saWN5JywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIGNvbnN0IGV4YW1wbGVEb3RDb21ab25lID0gbmV3IFB1YmxpY0hvc3RlZFpvbmUoc3RhY2ssICdFeGFtcGxlRG90Q29tJywge1xuICAgIHpvbmVOYW1lOiAnZXhhbXBsZS5jb20nLFxuICB9KTtcblxuICBjb25zdCBjZXJ0ID0gbmV3IERuc1ZhbGlkYXRlZENlcnRpZmljYXRlKHN0YWNrLCAnQ2VydGlmaWNhdGUnLCB7XG4gICAgZG9tYWluTmFtZTogJ3Rlc3QuZXhhbXBsZS5jb20nLFxuICAgIGhvc3RlZFpvbmU6IGV4YW1wbGVEb3RDb21ab25lLFxuICAgIHN1YmplY3RBbHRlcm5hdGl2ZU5hbWVzOiBbJ3Rlc3QyLmV4YW1wbGUuY29tJ10sXG4gICAgY2xlYW51cFJvdXRlNTNSZWNvcmRzOiB0cnVlLFxuICB9KTtcbiAgY2VydC5hcHBseVJlbW92YWxQb2xpY3koUmVtb3ZhbFBvbGljeS5SRVRBSU4pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNsb3VkRm9ybWF0aW9uOjpDdXN0b21SZXNvdXJjZScsIHtcbiAgICBEb21haW5OYW1lOiAndGVzdC5leGFtcGxlLmNvbScsXG4gICAgU3ViamVjdEFsdGVybmF0aXZlTmFtZXM6IFsndGVzdDIuZXhhbXBsZS5jb20nXSxcbiAgICBSZW1vdmFsUG9saWN5OiAncmV0YWluJyxcbiAgICBTZXJ2aWNlVG9rZW46IHtcbiAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAnQ2VydGlmaWNhdGVDZXJ0aWZpY2F0ZVJlcXVlc3RvckZ1bmN0aW9uNUU4NDU0MTMnLFxuICAgICAgICAnQXJuJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBIb3N0ZWRab25lSWQ6IHtcbiAgICAgIFJlZjogJ0V4YW1wbGVEb3RDb200RDFCODNBQScsXG4gICAgfSxcbiAgICBDbGVhbnVwUmVjb3JkczogJ3RydWUnLFxuICB9KTtcbn0pO1xuIl19