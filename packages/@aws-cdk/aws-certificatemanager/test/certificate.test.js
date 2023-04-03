"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const route53 = require("@aws-cdk/aws-route53");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
test('apex domain selection by default', () => {
    const stack = new core_1.Stack();
    new lib_1.Certificate(stack, 'Certificate', {
        domainName: 'test.example.com',
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
        DomainName: 'test.example.com',
        DomainValidationOptions: [{
                DomainName: 'test.example.com',
                ValidationDomain: 'example.com',
            }],
    });
});
test('metricDaysToExpiry', () => {
    const stack = new core_1.Stack();
    const certificate = new lib_1.Certificate(stack, 'Certificate', {
        domainName: 'test.example.com',
    });
    expect(stack.resolve(certificate.metricDaysToExpiry().toMetricConfig())).toEqual({
        metricStat: {
            dimensions: [{ name: 'CertificateArn', value: stack.resolve(certificate.certificateArn) }],
            metricName: 'DaysToExpiry',
            namespace: 'AWS/CertificateManager',
            period: core_1.Duration.days(1),
            statistic: 'Minimum',
        },
        renderingProperties: expect.anything(),
    });
});
test('validation domain can be overridden', () => {
    const stack = new core_1.Stack();
    new lib_1.Certificate(stack, 'Certificate', {
        domainName: 'test.example.com',
        validation: lib_1.CertificateValidation.fromEmail({
            'test.example.com': 'test.example.com',
        }),
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
        DomainValidationOptions: [{
                DomainName: 'test.example.com',
                ValidationDomain: 'test.example.com',
            }],
    });
});
test('export and import', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    const c = lib_1.Certificate.fromCertificateArn(stack, 'Imported', 'cert-arn');
    // THEN
    expect(c.certificateArn).toBe('cert-arn');
});
test('can configure validation method', () => {
    const stack = new core_1.Stack();
    new lib_1.Certificate(stack, 'Certificate', {
        domainName: 'test.example.com',
        validation: lib_1.CertificateValidation.fromDns(),
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
        DomainName: 'test.example.com',
        ValidationMethod: 'DNS',
    });
});
test('throws when domain name is longer than 64 characters', () => {
    const stack = new core_1.Stack();
    expect(() => {
        new lib_1.Certificate(stack, 'Certificate', {
            domainName: 'example.com'.repeat(7),
        });
    }).toThrow(/Domain name must be 64 characters or less/);
});
test('does not throw when domain name is longer than 64 characters with tokens', () => {
    const stack = new core_1.Stack();
    const embededToken = core_1.Aws.REGION;
    const baseDomain = 'a'.repeat(65 - embededToken.length);
    const domainName = `${embededToken}${baseDomain}`;
    new lib_1.Certificate(stack, 'Certificate', {
        domainName,
        validation: lib_1.CertificateValidation.fromEmail({
            [domainName]: 'example.com',
        }),
    });
    const domainNameJoin = {
        'Fn::Join': [
            '',
            [
                {
                    Ref: 'AWS::Region',
                },
                baseDomain,
            ],
        ],
    };
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
        DomainName: domainNameJoin,
        DomainValidationOptions: [{
                DomainName: domainNameJoin,
                ValidationDomain: 'example.com',
            }],
    });
});
test('needs validation domain supplied if domain contains a token', () => {
    const stack = new core_1.Stack();
    expect(() => {
        const domainName = core_1.Lazy.string({ produce: () => 'example.com' });
        new lib_1.Certificate(stack, 'Certificate', {
            domainName,
        });
    }).toThrow(/'validationDomains' needs to be supplied/);
});
test('validationdomains can be given for a Token', () => {
    const stack = new core_1.Stack();
    const domainName = core_1.Lazy.string({ produce: () => 'my.example.com' });
    new lib_1.Certificate(stack, 'Certificate', {
        domainName,
        validation: lib_1.CertificateValidation.fromEmail({
            [domainName]: 'example.com',
        }),
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
        DomainName: 'my.example.com',
        DomainValidationOptions: [{
                DomainName: 'my.example.com',
                ValidationDomain: 'example.com',
            }],
    });
});
test('CertificateValidation.fromEmail', () => {
    const stack = new core_1.Stack();
    new lib_1.Certificate(stack, 'Certificate', {
        domainName: 'test.example.com',
        subjectAlternativeNames: ['extra.example.com'],
        validation: lib_1.CertificateValidation.fromEmail({
            'test.example.com': 'example.com',
        }),
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
        DomainName: 'test.example.com',
        SubjectAlternativeNames: ['extra.example.com'],
        DomainValidationOptions: [
            {
                DomainName: 'test.example.com',
                ValidationDomain: 'example.com',
            },
            {
                DomainName: 'extra.example.com',
                ValidationDomain: 'example.com',
            },
        ],
        ValidationMethod: 'EMAIL',
    });
});
describe('CertificateValidation.fromDns', () => {
    test('without a hosted zone', () => {
        const stack = new core_1.Stack();
        new lib_1.Certificate(stack, 'Certificate', {
            domainName: 'test.example.com',
            subjectAlternativeNames: ['extra.example.com'],
            validation: lib_1.CertificateValidation.fromDns(),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
            DomainName: 'test.example.com',
            SubjectAlternativeNames: ['extra.example.com'],
            ValidationMethod: 'DNS',
        });
    });
    test('with a hosted zone', () => {
        const stack = new core_1.Stack();
        const exampleCom = new route53.HostedZone(stack, 'ExampleCom', {
            zoneName: 'example.com',
        });
        new lib_1.Certificate(stack, 'Certificate', {
            domainName: 'test.example.com',
            validation: lib_1.CertificateValidation.fromDns(exampleCom),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
            DomainName: 'test.example.com',
            DomainValidationOptions: [
                {
                    DomainName: 'test.example.com',
                    HostedZoneId: {
                        Ref: 'ExampleCom20E1324B',
                    },
                },
            ],
            ValidationMethod: 'DNS',
        });
    });
    test('with an imported hosted zone', () => {
        const stack = new core_1.Stack();
        const exampleCom = route53.PublicHostedZone.fromHostedZoneId(stack, 'ExampleCom', 'sampleid');
        new lib_1.Certificate(stack, 'Certificate', {
            domainName: 'test.example.com',
            validation: lib_1.CertificateValidation.fromDns(exampleCom),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
            DomainName: 'test.example.com',
            DomainValidationOptions: [
                {
                    DomainName: 'test.example.com',
                    HostedZoneId: 'sampleid',
                },
            ],
            ValidationMethod: 'DNS',
        });
    });
    test('with hosted zone and a wildcard name', () => {
        const stack = new core_1.Stack();
        const exampleCom = new route53.HostedZone(stack, 'ExampleCom', {
            zoneName: 'example.com',
        });
        new lib_1.Certificate(stack, 'Certificate', {
            domainName: 'test.example.com',
            validation: lib_1.CertificateValidation.fromDns(exampleCom),
            subjectAlternativeNames: ['*.test.example.com'],
        });
        //Wildcard domain names are de-duped.
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
            DomainName: 'test.example.com',
            DomainValidationOptions: [
                {
                    DomainName: 'test.example.com',
                    HostedZoneId: {
                        Ref: 'ExampleCom20E1324B',
                    },
                },
            ],
            ValidationMethod: 'DNS',
        });
    });
    test('with hosted zone and multiple wildcard names', () => {
        const stack = new core_1.Stack();
        const exampleCom = new route53.HostedZone(stack, 'ExampleCom', {
            zoneName: 'example.com',
        });
        new lib_1.Certificate(stack, 'Certificate', {
            domainName: 'test.example.com',
            validation: lib_1.CertificateValidation.fromDns(exampleCom),
            subjectAlternativeNames: ['*.test.example.com', '*.foo.test.example.com', 'bar.test.example.com'],
        });
        //Wildcard domain names are de-duped.
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
            DomainName: 'test.example.com',
            DomainValidationOptions: [
                {
                    DomainName: 'test.example.com',
                    HostedZoneId: {
                        Ref: 'ExampleCom20E1324B',
                    },
                },
                {
                    DomainName: '*.foo.test.example.com',
                    HostedZoneId: {
                        Ref: 'ExampleCom20E1324B',
                    },
                },
                {
                    DomainName: 'bar.test.example.com',
                    HostedZoneId: {
                        Ref: 'ExampleCom20E1324B',
                    },
                },
            ],
            ValidationMethod: 'DNS',
        });
    });
});
test('CertificateValidation.fromDnsMultiZone', () => {
    const stack = new core_1.Stack();
    const exampleCom = new route53.HostedZone(stack, 'ExampleCom', {
        zoneName: 'example.com',
    });
    const exampleNet = new route53.HostedZone(stack, 'ExampleNet', {
        zoneName: 'example.com',
    });
    new lib_1.Certificate(stack, 'Certificate', {
        domainName: 'test.example.com',
        subjectAlternativeNames: ['cool.example.com', 'test.example.net'],
        validation: lib_1.CertificateValidation.fromDnsMultiZone({
            'test.example.com': exampleCom,
            'cool.example.com': exampleCom,
            'test.example.net': exampleNet,
        }),
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
        DomainName: 'test.example.com',
        DomainValidationOptions: [
            {
                DomainName: 'test.example.com',
                HostedZoneId: {
                    Ref: 'ExampleCom20E1324B',
                },
            },
            {
                DomainName: 'cool.example.com',
                HostedZoneId: {
                    Ref: 'ExampleCom20E1324B',
                },
            },
            {
                DomainName: 'test.example.net',
                HostedZoneId: {
                    Ref: 'ExampleNetF7CA40C9',
                },
            },
        ],
        ValidationMethod: 'DNS',
    });
});
describe('Transparency logging settings', () => {
    test('leaves transparency logging untouched by default', () => {
        const stack = new core_1.Stack();
        new lib_1.Certificate(stack, 'Certificate', {
            domainName: 'test.example.com',
        });
        const certificateNodes = assertions_1.Template.fromStack(stack).findResources('AWS::CertificateManager::Certificate');
        expect(certificateNodes.Certificate4E7ABB08).toBeDefined();
        expect(certificateNodes.Certificate4E7ABB08.CertificateTransparencyLoggingPreference).toBeUndefined();
    });
    test('can enable transparency logging', () => {
        const stack = new core_1.Stack();
        new lib_1.Certificate(stack, 'Certificate', {
            domainName: 'test.example.com',
            transparencyLoggingEnabled: true,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
            DomainName: 'test.example.com',
            CertificateTransparencyLoggingPreference: 'ENABLED',
        });
    });
    test('can disable transparency logging', () => {
        const stack = new core_1.Stack();
        new lib_1.Certificate(stack, 'Certificate', {
            domainName: 'test.example.com',
            transparencyLoggingEnabled: false,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CertificateManager::Certificate', {
            DomainName: 'test.example.com',
            CertificateTransparencyLoggingPreference: 'DISABLED',
        });
    });
});
describe('Certifcate Name setting', () => {
    test('the Name tag is defaulted to path', () => {
        const stack = new core_1.Stack(undefined, 'TestStack');
        new lib_1.Certificate(stack, 'TheCertificate', {
            domainName: 'test.example.com',
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::CertificateManager::Certificate', hasTags([{ Key: 'Name', Value: 'TestStack/TheCertificate' }]));
    });
    test('Can provide a custom certificate name', () => {
        const stack = new core_1.Stack(undefined, 'TestStack');
        new lib_1.Certificate(stack, 'TheCertificate', {
            domainName: 'test.example.com',
            certificateName: 'Custom Certificate Name',
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::CertificateManager::Certificate', hasTags([{ Key: 'Name', Value: 'Custom Certificate Name' }]));
    });
});
function hasTags(expectedTags) {
    return {
        Properties: {
            Tags: assertions_1.Match.arrayWith(expectedTags),
        },
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VydGlmaWNhdGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNlcnRpZmljYXRlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQsZ0RBQWdEO0FBQ2hELHdDQUEyRDtBQUMzRCxnQ0FBNEQ7QUFFNUQsSUFBSSxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsRUFBRTtJQUM1QyxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBRTFCLElBQUksaUJBQVcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFO1FBQ3BDLFVBQVUsRUFBRSxrQkFBa0I7S0FDL0IsQ0FBQyxDQUFDO0lBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsc0NBQXNDLEVBQUU7UUFDdEYsVUFBVSxFQUFFLGtCQUFrQjtRQUM5Qix1QkFBdUIsRUFBRSxDQUFDO2dCQUN4QixVQUFVLEVBQUUsa0JBQWtCO2dCQUM5QixnQkFBZ0IsRUFBRSxhQUFhO2FBQ2hDLENBQUM7S0FDSCxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7SUFDOUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUUxQixNQUFNLFdBQVcsR0FBRyxJQUFJLGlCQUFXLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtRQUN4RCxVQUFVLEVBQUUsa0JBQWtCO0tBQy9CLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDL0UsVUFBVSxFQUFFO1lBQ1YsVUFBVSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FB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QUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsMEJBQTBCLEVBQUUsQ0FBQyxDQUFDLENBQzlELENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7UUFDakQsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRWhELElBQUksaUJBQVcsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7WUFDdkMsVUFBVSxFQUFFLGtCQUFrQjtZQUM5QixlQUFlLEVBQUUseUJBQXlCO1NBQzNDLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxzQ0FBc0MsRUFDMUUsT0FBTyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSx5QkFBeUIsRUFBRSxDQUFDLENBQUMsQ0FDN0QsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxTQUFTLE9BQU8sQ0FBQyxZQUFpRDtJQUNoRSxPQUFPO1FBQ0wsVUFBVSxFQUFFO1lBQ1YsSUFBSSxFQUFFLGtCQUFLLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztTQUNwQztLQUNGLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUsIE1hdGNoIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyByb3V0ZTUzIGZyb20gJ0Bhd3MtY2RrL2F3cy1yb3V0ZTUzJztcbmltcG9ydCB7IEF3cywgRHVyYXRpb24sIExhenksIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDZXJ0aWZpY2F0ZSwgQ2VydGlmaWNhdGVWYWxpZGF0aW9uIH0gZnJvbSAnLi4vbGliJztcblxudGVzdCgnYXBleCBkb21haW4gc2VsZWN0aW9uIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgbmV3IENlcnRpZmljYXRlKHN0YWNrLCAnQ2VydGlmaWNhdGUnLCB7XG4gICAgZG9tYWluTmFtZTogJ3Rlc3QuZXhhbXBsZS5jb20nLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDZXJ0aWZpY2F0ZU1hbmFnZXI6OkNlcnRpZmljYXRlJywge1xuICAgIERvbWFpbk5hbWU6ICd0ZXN0LmV4YW1wbGUuY29tJyxcbiAgICBEb21haW5WYWxpZGF0aW9uT3B0aW9uczogW3tcbiAgICAgIERvbWFpbk5hbWU6ICd0ZXN0LmV4YW1wbGUuY29tJyxcbiAgICAgIFZhbGlkYXRpb25Eb21haW46ICdleGFtcGxlLmNvbScsXG4gICAgfV0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ21ldHJpY0RheXNUb0V4cGlyeScsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICBjb25zdCBjZXJ0aWZpY2F0ZSA9IG5ldyBDZXJ0aWZpY2F0ZShzdGFjaywgJ0NlcnRpZmljYXRlJywge1xuICAgIGRvbWFpbk5hbWU6ICd0ZXN0LmV4YW1wbGUuY29tJyxcbiAgfSk7XG5cbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUoY2VydGlmaWNhdGUubWV0cmljRGF5c1RvRXhwaXJ5KCkudG9NZXRyaWNDb25maWcoKSkpLnRvRXF1YWwoe1xuICAgIG1ldHJpY1N0YXQ6IHtcbiAgICAgIGRpbWVuc2lvbnM6IFt7IG5hbWU6ICdDZXJ0aWZpY2F0ZUFybicsIHZhbHVlOiBzdGFjay5yZXNvbHZlKGNlcnRpZmljYXRlLmNlcnRpZmljYXRlQXJuKSB9XSxcbiAgICAgIG1ldHJpY05hbWU6ICdEYXlzVG9FeHBpcnknLFxuICAgICAgbmFtZXNwYWNlOiAnQVdTL0NlcnRpZmljYXRlTWFuYWdlcicsXG4gICAgICBwZXJpb2Q6IER1cmF0aW9uLmRheXMoMSksXG4gICAgICBzdGF0aXN0aWM6ICdNaW5pbXVtJyxcbiAgICB9LFxuICAgIHJlbmRlcmluZ1Byb3BlcnRpZXM6IGV4cGVjdC5hbnl0aGluZygpLFxuICB9KTtcbn0pO1xuXG50ZXN0KCd2YWxpZGF0aW9uIGRvbWFpbiBjYW4gYmUgb3ZlcnJpZGRlbicsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICBuZXcgQ2VydGlmaWNhdGUoc3RhY2ssICdDZXJ0aWZpY2F0ZScsIHtcbiAgICBkb21haW5OYW1lOiAndGVzdC5leGFtcGxlLmNvbScsXG4gICAgdmFsaWRhdGlvbjogQ2VydGlmaWNhdGVWYWxpZGF0aW9uLmZyb21FbWFpbCh7XG4gICAgICAndGVzdC5leGFtcGxlLmNvbSc6ICd0ZXN0LmV4YW1wbGUuY29tJyxcbiAgICB9KSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2VydGlmaWNhdGVNYW5hZ2VyOjpDZXJ0aWZpY2F0ZScsIHtcbiAgICBEb21haW5WYWxpZGF0aW9uT3B0aW9uczogW3tcbiAgICAgIERvbWFpbk5hbWU6ICd0ZXN0LmV4YW1wbGUuY29tJyxcbiAgICAgIFZhbGlkYXRpb25Eb21haW46ICd0ZXN0LmV4YW1wbGUuY29tJyxcbiAgICB9XSxcbiAgfSk7XG59KTtcblxudGVzdCgnZXhwb3J0IGFuZCBpbXBvcnQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBjID0gQ2VydGlmaWNhdGUuZnJvbUNlcnRpZmljYXRlQXJuKHN0YWNrLCAnSW1wb3J0ZWQnLCAnY2VydC1hcm4nKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChjLmNlcnRpZmljYXRlQXJuKS50b0JlKCdjZXJ0LWFybicpO1xufSk7XG5cbnRlc3QoJ2NhbiBjb25maWd1cmUgdmFsaWRhdGlvbiBtZXRob2QnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgbmV3IENlcnRpZmljYXRlKHN0YWNrLCAnQ2VydGlmaWNhdGUnLCB7XG4gICAgZG9tYWluTmFtZTogJ3Rlc3QuZXhhbXBsZS5jb20nLFxuICAgIHZhbGlkYXRpb246IENlcnRpZmljYXRlVmFsaWRhdGlvbi5mcm9tRG5zKCksXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNlcnRpZmljYXRlTWFuYWdlcjo6Q2VydGlmaWNhdGUnLCB7XG4gICAgRG9tYWluTmFtZTogJ3Rlc3QuZXhhbXBsZS5jb20nLFxuICAgIFZhbGlkYXRpb25NZXRob2Q6ICdETlMnLFxuICB9KTtcbn0pO1xuXG50ZXN0KCd0aHJvd3Mgd2hlbiBkb21haW4gbmFtZSBpcyBsb25nZXIgdGhhbiA2NCBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgbmV3IENlcnRpZmljYXRlKHN0YWNrLCAnQ2VydGlmaWNhdGUnLCB7XG4gICAgICBkb21haW5OYW1lOiAnZXhhbXBsZS5jb20nLnJlcGVhdCg3KSxcbiAgICB9KTtcbiAgfSkudG9UaHJvdygvRG9tYWluIG5hbWUgbXVzdCBiZSA2NCBjaGFyYWN0ZXJzIG9yIGxlc3MvKTtcbn0pO1xuXG50ZXN0KCdkb2VzIG5vdCB0aHJvdyB3aGVuIGRvbWFpbiBuYW1lIGlzIGxvbmdlciB0aGFuIDY0IGNoYXJhY3RlcnMgd2l0aCB0b2tlbnMnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGNvbnN0IGVtYmVkZWRUb2tlbiA9IEF3cy5SRUdJT047XG4gIGNvbnN0IGJhc2VEb21haW4gPSAnYScucmVwZWF0KDY1LWVtYmVkZWRUb2tlbi5sZW5ndGgpO1xuICBjb25zdCBkb21haW5OYW1lID0gYCR7ZW1iZWRlZFRva2VufSR7YmFzZURvbWFpbn1gO1xuICBuZXcgQ2VydGlmaWNhdGUoc3RhY2ssICdDZXJ0aWZpY2F0ZScsIHtcbiAgICBkb21haW5OYW1lLFxuICAgIHZhbGlkYXRpb246IENlcnRpZmljYXRlVmFsaWRhdGlvbi5mcm9tRW1haWwoe1xuICAgICAgW2RvbWFpbk5hbWVdOiAnZXhhbXBsZS5jb20nLFxuICAgIH0pLFxuICB9KTtcblxuICBjb25zdCBkb21haW5OYW1lSm9pbiA9IHtcbiAgICAnRm46OkpvaW4nOiBbXG4gICAgICAnJyxcbiAgICAgIFtcbiAgICAgICAge1xuICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgfSxcbiAgICAgICAgYmFzZURvbWFpbixcbiAgICAgIF0sXG4gICAgXSxcbiAgfTtcbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2VydGlmaWNhdGVNYW5hZ2VyOjpDZXJ0aWZpY2F0ZScsIHtcbiAgICBEb21haW5OYW1lOiBkb21haW5OYW1lSm9pbixcbiAgICBEb21haW5WYWxpZGF0aW9uT3B0aW9uczogW3tcbiAgICAgIERvbWFpbk5hbWU6IGRvbWFpbk5hbWVKb2luLFxuICAgICAgVmFsaWRhdGlvbkRvbWFpbjogJ2V4YW1wbGUuY29tJyxcbiAgICB9XSxcbiAgfSk7XG59KTtcblxudGVzdCgnbmVlZHMgdmFsaWRhdGlvbiBkb21haW4gc3VwcGxpZWQgaWYgZG9tYWluIGNvbnRhaW5zIGEgdG9rZW4nLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgZXhwZWN0KCgpID0+IHtcbiAgICBjb25zdCBkb21haW5OYW1lID0gTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiAnZXhhbXBsZS5jb20nIH0pO1xuICAgIG5ldyBDZXJ0aWZpY2F0ZShzdGFjaywgJ0NlcnRpZmljYXRlJywge1xuICAgICAgZG9tYWluTmFtZSxcbiAgICB9KTtcbiAgfSkudG9UaHJvdygvJ3ZhbGlkYXRpb25Eb21haW5zJyBuZWVkcyB0byBiZSBzdXBwbGllZC8pO1xufSk7XG5cbnRlc3QoJ3ZhbGlkYXRpb25kb21haW5zIGNhbiBiZSBnaXZlbiBmb3IgYSBUb2tlbicsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICBjb25zdCBkb21haW5OYW1lID0gTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiAnbXkuZXhhbXBsZS5jb20nIH0pO1xuICBuZXcgQ2VydGlmaWNhdGUoc3RhY2ssICdDZXJ0aWZpY2F0ZScsIHtcbiAgICBkb21haW5OYW1lLFxuICAgIHZhbGlkYXRpb246IENlcnRpZmljYXRlVmFsaWRhdGlvbi5mcm9tRW1haWwoe1xuICAgICAgW2RvbWFpbk5hbWVdOiAnZXhhbXBsZS5jb20nLFxuICAgIH0pLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDZXJ0aWZpY2F0ZU1hbmFnZXI6OkNlcnRpZmljYXRlJywge1xuICAgIERvbWFpbk5hbWU6ICdteS5leGFtcGxlLmNvbScsXG4gICAgRG9tYWluVmFsaWRhdGlvbk9wdGlvbnM6IFt7XG4gICAgICBEb21haW5OYW1lOiAnbXkuZXhhbXBsZS5jb20nLFxuICAgICAgVmFsaWRhdGlvbkRvbWFpbjogJ2V4YW1wbGUuY29tJyxcbiAgICB9XSxcbiAgfSk7XG59KTtcblxudGVzdCgnQ2VydGlmaWNhdGVWYWxpZGF0aW9uLmZyb21FbWFpbCcsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICBuZXcgQ2VydGlmaWNhdGUoc3RhY2ssICdDZXJ0aWZpY2F0ZScsIHtcbiAgICBkb21haW5OYW1lOiAndGVzdC5leGFtcGxlLmNvbScsXG4gICAgc3ViamVjdEFsdGVybmF0aXZlTmFtZXM6IFsnZXh0cmEuZXhhbXBsZS5jb20nXSxcbiAgICB2YWxpZGF0aW9uOiBDZXJ0aWZpY2F0ZVZhbGlkYXRpb24uZnJvbUVtYWlsKHtcbiAgICAgICd0ZXN0LmV4YW1wbGUuY29tJzogJ2V4YW1wbGUuY29tJyxcbiAgICB9KSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2VydGlmaWNhdGVNYW5hZ2VyOjpDZXJ0aWZpY2F0ZScsIHtcbiAgICBEb21haW5OYW1lOiAndGVzdC5leGFtcGxlLmNvbScsXG4gICAgU3ViamVjdEFsdGVybmF0aXZlTmFtZXM6IFsnZXh0cmEuZXhhbXBsZS5jb20nXSxcbiAgICBEb21haW5WYWxpZGF0aW9uT3B0aW9uczogW1xuICAgICAge1xuICAgICAgICBEb21haW5OYW1lOiAndGVzdC5leGFtcGxlLmNvbScsXG4gICAgICAgIFZhbGlkYXRpb25Eb21haW46ICdleGFtcGxlLmNvbScsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBEb21haW5OYW1lOiAnZXh0cmEuZXhhbXBsZS5jb20nLFxuICAgICAgICBWYWxpZGF0aW9uRG9tYWluOiAnZXhhbXBsZS5jb20nLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFZhbGlkYXRpb25NZXRob2Q6ICdFTUFJTCcsXG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdDZXJ0aWZpY2F0ZVZhbGlkYXRpb24uZnJvbURucycsICgpID0+IHtcblxuICB0ZXN0KCd3aXRob3V0IGEgaG9zdGVkIHpvbmUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIG5ldyBDZXJ0aWZpY2F0ZShzdGFjaywgJ0NlcnRpZmljYXRlJywge1xuICAgICAgZG9tYWluTmFtZTogJ3Rlc3QuZXhhbXBsZS5jb20nLFxuICAgICAgc3ViamVjdEFsdGVybmF0aXZlTmFtZXM6IFsnZXh0cmEuZXhhbXBsZS5jb20nXSxcbiAgICAgIHZhbGlkYXRpb246IENlcnRpZmljYXRlVmFsaWRhdGlvbi5mcm9tRG5zKCksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDZXJ0aWZpY2F0ZU1hbmFnZXI6OkNlcnRpZmljYXRlJywge1xuICAgICAgRG9tYWluTmFtZTogJ3Rlc3QuZXhhbXBsZS5jb20nLFxuICAgICAgU3ViamVjdEFsdGVybmF0aXZlTmFtZXM6IFsnZXh0cmEuZXhhbXBsZS5jb20nXSxcbiAgICAgIFZhbGlkYXRpb25NZXRob2Q6ICdETlMnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd3aXRoIGEgaG9zdGVkIHpvbmUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGV4YW1wbGVDb20gPSBuZXcgcm91dGU1My5Ib3N0ZWRab25lKHN0YWNrLCAnRXhhbXBsZUNvbScsIHtcbiAgICAgIHpvbmVOYW1lOiAnZXhhbXBsZS5jb20nLFxuICAgIH0pO1xuXG4gICAgbmV3IENlcnRpZmljYXRlKHN0YWNrLCAnQ2VydGlmaWNhdGUnLCB7XG4gICAgICBkb21haW5OYW1lOiAndGVzdC5leGFtcGxlLmNvbScsXG4gICAgICB2YWxpZGF0aW9uOiBDZXJ0aWZpY2F0ZVZhbGlkYXRpb24uZnJvbURucyhleGFtcGxlQ29tKSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNlcnRpZmljYXRlTWFuYWdlcjo6Q2VydGlmaWNhdGUnLCB7XG4gICAgICBEb21haW5OYW1lOiAndGVzdC5leGFtcGxlLmNvbScsXG4gICAgICBEb21haW5WYWxpZGF0aW9uT3B0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgRG9tYWluTmFtZTogJ3Rlc3QuZXhhbXBsZS5jb20nLFxuICAgICAgICAgIEhvc3RlZFpvbmVJZDoge1xuICAgICAgICAgICAgUmVmOiAnRXhhbXBsZUNvbTIwRTEzMjRCJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFZhbGlkYXRpb25NZXRob2Q6ICdETlMnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd3aXRoIGFuIGltcG9ydGVkIGhvc3RlZCB6b25lJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBleGFtcGxlQ29tID0gcm91dGU1My5QdWJsaWNIb3N0ZWRab25lLmZyb21Ib3N0ZWRab25lSWQoc3RhY2ssICdFeGFtcGxlQ29tJywgJ3NhbXBsZWlkJyk7XG5cbiAgICBuZXcgQ2VydGlmaWNhdGUoc3RhY2ssICdDZXJ0aWZpY2F0ZScsIHtcbiAgICAgIGRvbWFpbk5hbWU6ICd0ZXN0LmV4YW1wbGUuY29tJyxcbiAgICAgIHZhbGlkYXRpb246IENlcnRpZmljYXRlVmFsaWRhdGlvbi5mcm9tRG5zKGV4YW1wbGVDb20pLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q2VydGlmaWNhdGVNYW5hZ2VyOjpDZXJ0aWZpY2F0ZScsIHtcbiAgICAgIERvbWFpbk5hbWU6ICd0ZXN0LmV4YW1wbGUuY29tJyxcbiAgICAgIERvbWFpblZhbGlkYXRpb25PcHRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBEb21haW5OYW1lOiAndGVzdC5leGFtcGxlLmNvbScsXG4gICAgICAgICAgSG9zdGVkWm9uZUlkOiAnc2FtcGxlaWQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFZhbGlkYXRpb25NZXRob2Q6ICdETlMnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd3aXRoIGhvc3RlZCB6b25lIGFuZCBhIHdpbGRjYXJkIG5hbWUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGV4YW1wbGVDb20gPSBuZXcgcm91dGU1My5Ib3N0ZWRab25lKHN0YWNrLCAnRXhhbXBsZUNvbScsIHtcbiAgICAgIHpvbmVOYW1lOiAnZXhhbXBsZS5jb20nLFxuICAgIH0pO1xuXG4gICAgbmV3IENlcnRpZmljYXRlKHN0YWNrLCAnQ2VydGlmaWNhdGUnLCB7XG4gICAgICBkb21haW5OYW1lOiAndGVzdC5leGFtcGxlLmNvbScsXG4gICAgICB2YWxpZGF0aW9uOiBDZXJ0aWZpY2F0ZVZhbGlkYXRpb24uZnJvbURucyhleGFtcGxlQ29tKSxcbiAgICAgIHN1YmplY3RBbHRlcm5hdGl2ZU5hbWVzOiBbJyoudGVzdC5leGFtcGxlLmNvbSddLFxuICAgIH0pO1xuXG4gICAgLy9XaWxkY2FyZCBkb21haW4gbmFtZXMgYXJlIGRlLWR1cGVkLlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNlcnRpZmljYXRlTWFuYWdlcjo6Q2VydGlmaWNhdGUnLCB7XG4gICAgICBEb21haW5OYW1lOiAndGVzdC5leGFtcGxlLmNvbScsXG4gICAgICBEb21haW5WYWxpZGF0aW9uT3B0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgRG9tYWluTmFtZTogJ3Rlc3QuZXhhbXBsZS5jb20nLFxuICAgICAgICAgIEhvc3RlZFpvbmVJZDoge1xuICAgICAgICAgICAgUmVmOiAnRXhhbXBsZUNvbTIwRTEzMjRCJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFZhbGlkYXRpb25NZXRob2Q6ICdETlMnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd3aXRoIGhvc3RlZCB6b25lIGFuZCBtdWx0aXBsZSB3aWxkY2FyZCBuYW1lcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgZXhhbXBsZUNvbSA9IG5ldyByb3V0ZTUzLkhvc3RlZFpvbmUoc3RhY2ssICdFeGFtcGxlQ29tJywge1xuICAgICAgem9uZU5hbWU6ICdleGFtcGxlLmNvbScsXG4gICAgfSk7XG5cbiAgICBuZXcgQ2VydGlmaWNhdGUoc3RhY2ssICdDZXJ0aWZpY2F0ZScsIHtcbiAgICAgIGRvbWFpbk5hbWU6ICd0ZXN0LmV4YW1wbGUuY29tJyxcbiAgICAgIHZhbGlkYXRpb246IENlcnRpZmljYXRlVmFsaWRhdGlvbi5mcm9tRG5zKGV4YW1wbGVDb20pLFxuICAgICAgc3ViamVjdEFsdGVybmF0aXZlTmFtZXM6IFsnKi50ZXN0LmV4YW1wbGUuY29tJywgJyouZm9vLnRlc3QuZXhhbXBsZS5jb20nLCAnYmFyLnRlc3QuZXhhbXBsZS5jb20nXSxcbiAgICB9KTtcblxuICAgIC8vV2lsZGNhcmQgZG9tYWluIG5hbWVzIGFyZSBkZS1kdXBlZC5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDZXJ0aWZpY2F0ZU1hbmFnZXI6OkNlcnRpZmljYXRlJywge1xuICAgICAgRG9tYWluTmFtZTogJ3Rlc3QuZXhhbXBsZS5jb20nLFxuICAgICAgRG9tYWluVmFsaWRhdGlvbk9wdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIERvbWFpbk5hbWU6ICd0ZXN0LmV4YW1wbGUuY29tJyxcbiAgICAgICAgICBIb3N0ZWRab25lSWQ6IHtcbiAgICAgICAgICAgIFJlZjogJ0V4YW1wbGVDb20yMEUxMzI0QicsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIERvbWFpbk5hbWU6ICcqLmZvby50ZXN0LmV4YW1wbGUuY29tJyxcbiAgICAgICAgICBIb3N0ZWRab25lSWQ6IHtcbiAgICAgICAgICAgIFJlZjogJ0V4YW1wbGVDb20yMEUxMzI0QicsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIERvbWFpbk5hbWU6ICdiYXIudGVzdC5leGFtcGxlLmNvbScsXG4gICAgICAgICAgSG9zdGVkWm9uZUlkOiB7XG4gICAgICAgICAgICBSZWY6ICdFeGFtcGxlQ29tMjBFMTMyNEInLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgVmFsaWRhdGlvbk1ldGhvZDogJ0ROUycsXG4gICAgfSk7XG4gIH0pO1xuXG59KTtcblxudGVzdCgnQ2VydGlmaWNhdGVWYWxpZGF0aW9uLmZyb21EbnNNdWx0aVpvbmUnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgY29uc3QgZXhhbXBsZUNvbSA9IG5ldyByb3V0ZTUzLkhvc3RlZFpvbmUoc3RhY2ssICdFeGFtcGxlQ29tJywge1xuICAgIHpvbmVOYW1lOiAnZXhhbXBsZS5jb20nLFxuICB9KTtcblxuICBjb25zdCBleGFtcGxlTmV0ID0gbmV3IHJvdXRlNTMuSG9zdGVkWm9uZShzdGFjaywgJ0V4YW1wbGVOZXQnLCB7XG4gICAgem9uZU5hbWU6ICdleGFtcGxlLmNvbScsXG4gIH0pO1xuXG4gIG5ldyBDZXJ0aWZpY2F0ZShzdGFjaywgJ0NlcnRpZmljYXRlJywge1xuICAgIGRvbWFpbk5hbWU6ICd0ZXN0LmV4YW1wbGUuY29tJyxcbiAgICBzdWJqZWN0QWx0ZXJuYXRpdmVOYW1lczogWydjb29sLmV4YW1wbGUuY29tJywgJ3Rlc3QuZXhhbXBsZS5uZXQnXSxcbiAgICB2YWxpZGF0aW9uOiBDZXJ0aWZpY2F0ZVZhbGlkYXRpb24uZnJvbURuc011bHRpWm9uZSh7XG4gICAgICAndGVzdC5leGFtcGxlLmNvbSc6IGV4YW1wbGVDb20sXG4gICAgICAnY29vbC5leGFtcGxlLmNvbSc6IGV4YW1wbGVDb20sXG4gICAgICAndGVzdC5leGFtcGxlLm5ldCc6IGV4YW1wbGVOZXQsXG4gICAgfSksXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNlcnRpZmljYXRlTWFuYWdlcjo6Q2VydGlmaWNhdGUnLCB7XG4gICAgRG9tYWluTmFtZTogJ3Rlc3QuZXhhbXBsZS5jb20nLFxuICAgIERvbWFpblZhbGlkYXRpb25PcHRpb25zOiBbXG4gICAgICB7XG4gICAgICAgIERvbWFpbk5hbWU6ICd0ZXN0LmV4YW1wbGUuY29tJyxcbiAgICAgICAgSG9zdGVkWm9uZUlkOiB7XG4gICAgICAgICAgUmVmOiAnRXhhbXBsZUNvbTIwRTEzMjRCJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIERvbWFpbk5hbWU6ICdjb29sLmV4YW1wbGUuY29tJyxcbiAgICAgICAgSG9zdGVkWm9uZUlkOiB7XG4gICAgICAgICAgUmVmOiAnRXhhbXBsZUNvbTIwRTEzMjRCJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIERvbWFpbk5hbWU6ICd0ZXN0LmV4YW1wbGUubmV0JyxcbiAgICAgICAgSG9zdGVkWm9uZUlkOiB7XG4gICAgICAgICAgUmVmOiAnRXhhbXBsZU5ldEY3Q0E0MEM5JyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBWYWxpZGF0aW9uTWV0aG9kOiAnRE5TJyxcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ1RyYW5zcGFyZW5jeSBsb2dnaW5nIHNldHRpbmdzJywgKCkgPT4ge1xuICB0ZXN0KCdsZWF2ZXMgdHJhbnNwYXJlbmN5IGxvZ2dpbmcgdW50b3VjaGVkIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIG5ldyBDZXJ0aWZpY2F0ZShzdGFjaywgJ0NlcnRpZmljYXRlJywge1xuICAgICAgZG9tYWluTmFtZTogJ3Rlc3QuZXhhbXBsZS5jb20nLFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2VydGlmaWNhdGVOb2RlcyA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuZmluZFJlc291cmNlcygnQVdTOjpDZXJ0aWZpY2F0ZU1hbmFnZXI6OkNlcnRpZmljYXRlJyk7XG4gICAgZXhwZWN0KGNlcnRpZmljYXRlTm9kZXMuQ2VydGlmaWNhdGU0RTdBQkIwOCkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QoY2VydGlmaWNhdGVOb2Rlcy5DZXJ0aWZpY2F0ZTRFN0FCQjA4LkNlcnRpZmljYXRlVHJhbnNwYXJlbmN5TG9nZ2luZ1ByZWZlcmVuY2UpLnRvQmVVbmRlZmluZWQoKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGVuYWJsZSB0cmFuc3BhcmVuY3kgbG9nZ2luZycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgbmV3IENlcnRpZmljYXRlKHN0YWNrLCAnQ2VydGlmaWNhdGUnLCB7XG4gICAgICBkb21haW5OYW1lOiAndGVzdC5leGFtcGxlLmNvbScsXG4gICAgICB0cmFuc3BhcmVuY3lMb2dnaW5nRW5hYmxlZDogdHJ1ZSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNlcnRpZmljYXRlTWFuYWdlcjo6Q2VydGlmaWNhdGUnLCB7XG4gICAgICBEb21haW5OYW1lOiAndGVzdC5leGFtcGxlLmNvbScsXG4gICAgICBDZXJ0aWZpY2F0ZVRyYW5zcGFyZW5jeUxvZ2dpbmdQcmVmZXJlbmNlOiAnRU5BQkxFRCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBkaXNhYmxlIHRyYW5zcGFyZW5jeSBsb2dnaW5nJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBuZXcgQ2VydGlmaWNhdGUoc3RhY2ssICdDZXJ0aWZpY2F0ZScsIHtcbiAgICAgIGRvbWFpbk5hbWU6ICd0ZXN0LmV4YW1wbGUuY29tJyxcbiAgICAgIHRyYW5zcGFyZW5jeUxvZ2dpbmdFbmFibGVkOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNlcnRpZmljYXRlTWFuYWdlcjo6Q2VydGlmaWNhdGUnLCB7XG4gICAgICBEb21haW5OYW1lOiAndGVzdC5leGFtcGxlLmNvbScsXG4gICAgICBDZXJ0aWZpY2F0ZVRyYW5zcGFyZW5jeUxvZ2dpbmdQcmVmZXJlbmNlOiAnRElTQUJMRUQnLFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5cbmRlc2NyaWJlKCdDZXJ0aWZjYXRlIE5hbWUgc2V0dGluZycsICgpID0+IHtcbiAgdGVzdCgndGhlIE5hbWUgdGFnIGlzIGRlZmF1bHRlZCB0byBwYXRoJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ1Rlc3RTdGFjaycpO1xuXG4gICAgbmV3IENlcnRpZmljYXRlKHN0YWNrLCAnVGhlQ2VydGlmaWNhdGUnLCB7XG4gICAgICBkb21haW5OYW1lOiAndGVzdC5leGFtcGxlLmNvbScsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkNlcnRpZmljYXRlTWFuYWdlcjo6Q2VydGlmaWNhdGUnLFxuICAgICAgaGFzVGFncyhbeyBLZXk6ICdOYW1lJywgVmFsdWU6ICdUZXN0U3RhY2svVGhlQ2VydGlmaWNhdGUnIH1dKSxcbiAgICApO1xuICB9KTtcblxuICB0ZXN0KCdDYW4gcHJvdmlkZSBhIGN1c3RvbSBjZXJ0aWZpY2F0ZSBuYW1lJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ1Rlc3RTdGFjaycpO1xuXG4gICAgbmV3IENlcnRpZmljYXRlKHN0YWNrLCAnVGhlQ2VydGlmaWNhdGUnLCB7XG4gICAgICBkb21haW5OYW1lOiAndGVzdC5leGFtcGxlLmNvbScsXG4gICAgICBjZXJ0aWZpY2F0ZU5hbWU6ICdDdXN0b20gQ2VydGlmaWNhdGUgTmFtZScsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkNlcnRpZmljYXRlTWFuYWdlcjo6Q2VydGlmaWNhdGUnLFxuICAgICAgaGFzVGFncyhbeyBLZXk6ICdOYW1lJywgVmFsdWU6ICdDdXN0b20gQ2VydGlmaWNhdGUgTmFtZScgfV0pLFxuICAgICk7XG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIGhhc1RhZ3MoZXhwZWN0ZWRUYWdzOiBBcnJheTx7S2V5OiBzdHJpbmcsIFZhbHVlOiBzdHJpbmd9Pikge1xuICByZXR1cm4ge1xuICAgIFByb3BlcnRpZXM6IHtcbiAgICAgIFRhZ3M6IE1hdGNoLmFycmF5V2l0aChleHBlY3RlZFRhZ3MpLFxuICAgIH0sXG4gIH07XG59XG4iXX0=