"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const aws_certificatemanager_1 = require("@aws-cdk/aws-certificatemanager");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('User Pool Client', () => {
    test('custom domain name', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        const certificate = aws_certificatemanager_1.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:eu-west-1:0123456789:certificate/7ec3e4ac-808a-4649-b805-66ae02346ad8');
        new lib_1.UserPoolDomain(stack, 'Domain', {
            userPool: pool,
            customDomain: {
                domainName: 'test-domain.example.com',
                certificate,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolDomain', {
            UserPoolId: stack.resolve(pool.userPoolId),
            Domain: 'test-domain.example.com',
            CustomDomainConfig: {
                CertificateArn: 'arn:aws:acm:eu-west-1:0123456789:certificate/7ec3e4ac-808a-4649-b805-66ae02346ad8',
            },
        });
    });
    test('cognito domain prefix', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        new lib_1.UserPoolDomain(stack, 'Domain', {
            userPool: pool,
            cognitoDomain: {
                domainPrefix: 'cognito-domain-prefix',
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolDomain', {
            UserPoolId: stack.resolve(pool.userPoolId),
            Domain: 'cognito-domain-prefix',
        });
    });
    test('fails when neither cognitoDomain nor customDomain are specified', () => {
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        const certificate = aws_certificatemanager_1.Certificate.fromCertificateArn(stack, 'cert', 'arn:aws:acm:eu-west-1:0123456789:certificate/7ec3e4ac-808a-4649-b805-66ae02346ad8');
        expect(() => new lib_1.UserPoolDomain(stack, 'Domain', {
            userPool: pool,
            cognitoDomain: {
                domainPrefix: 'cognito-domain-prefix',
            },
            customDomain: {
                domainName: 'mydomain.com',
                certificate,
            },
        })).toThrow(/cognitoDomain or customDomain must be specified/);
    });
    test('fails when both cognitoDomain and customDomain are specified', () => {
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        expect(() => new lib_1.UserPoolDomain(stack, 'Domain', {
            userPool: pool,
        })).toThrow(/cognitoDomain or customDomain must be specified/);
    });
    test('fails when domainPrefix has characters outside the allowed charset', () => {
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        expect(() => pool.addDomain('Domain1', {
            cognitoDomain: { domainPrefix: 'domain.prefix' },
        })).toThrow(/lowercase alphabets, numbers and hyphens/);
        expect(() => pool.addDomain('Domain2', {
            cognitoDomain: { domainPrefix: 'Domain-Prefix' },
        })).toThrow(/lowercase alphabets, numbers and hyphens/);
        expect(() => pool.addDomain('Domain3', {
            cognitoDomain: { domainPrefix: 'dómäin-prefix' },
        })).toThrow(/lowercase alphabets, numbers and hyphens/);
    });
    test('does not fail when domainPrefix is a token', () => {
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        const parameter = new core_1.CfnParameter(stack, 'Paraeter');
        expect(() => pool.addDomain('Domain', {
            cognitoDomain: { domainPrefix: parameter.valueAsString },
        })).not.toThrow();
    });
    test('custom resource is added when cloudFrontDomainName property is used', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        const domain = pool.addDomain('Domain', {
            cognitoDomain: {
                domainPrefix: 'cognito-domain-prefix',
            },
        });
        // WHEN
        const cfDomainName = domain.cloudFrontDomainName;
        // THEN
        expect(stack.resolve(cfDomainName)).toEqual({
            'Fn::GetAtt': [
                'PoolDomainCloudFrontDomainName340BF87E',
                'DomainDescription.CloudFrontDistribution',
            ],
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('Custom::UserPoolCloudFrontDomainName', 1);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [{
                        Action: 'cognito-idp:DescribeUserPoolDomain',
                        Effect: 'Allow',
                        Resource: '*',
                    }],
                Version: '2012-10-17',
            },
        });
    });
    test('cloudFrontDomainName property can be called multiple times', () => {
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        const domain = pool.addDomain('Domain', {
            cognitoDomain: {
                domainPrefix: 'cognito-domain-prefix',
            },
        });
        const cfDomainNameFirst = domain.cloudFrontDomainName;
        const cfDomainNameSecond = domain.cloudFrontDomainName;
        expect(cfDomainNameSecond).toEqual(cfDomainNameFirst);
    });
    test('import', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const client = lib_1.UserPoolDomain.fromDomainName(stack, 'Domain', 'domain-name-1');
        // THEN
        expect(client.domainName).toEqual('domain-name-1');
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Cognito::UserPoolDomain', 0);
    });
    describe('baseUrl', () => {
        test('returns the expected standard URL', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            const domain = pool.addDomain('Domain', {
                cognitoDomain: {
                    domainPrefix: 'cognito-domain-prefix',
                },
            });
            // WHEN
            const baseUrl = domain.baseUrl();
            // THEN
            expect(stack.resolve(baseUrl)).toEqual({
                'Fn::Join': [
                    '', [
                        'https://',
                        { Ref: 'PoolDomainCFC71F56' },
                        '.auth.',
                        { Ref: 'AWS::Region' },
                        '.amazoncognito.com',
                    ],
                ],
            });
        });
        test('returns the expected FIPS-compliant endpoint URL', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            const domain = pool.addDomain('Domain', {
                cognitoDomain: {
                    domainPrefix: 'cognito-domain-prefix',
                },
            });
            // WHEN
            const baseUrl = domain.baseUrl({ fips: true });
            // THEN
            expect(stack.resolve(baseUrl)).toEqual({
                'Fn::Join': [
                    '', [
                        'https://',
                        { Ref: 'PoolDomainCFC71F56' },
                        '.auth-fips.',
                        { Ref: 'AWS::Region' },
                        '.amazoncognito.com',
                    ],
                ],
            });
        });
    });
    describe('signInUrl', () => {
        test('returns the expected URL', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            const domain = pool.addDomain('Domain', {
                cognitoDomain: {
                    domainPrefix: 'cognito-domain-prefix',
                },
            });
            const client = pool.addClient('Client', {
                oAuth: {
                    callbackUrls: ['https://example.com'],
                },
            });
            // WHEN
            const signInUrl = domain.signInUrl(client, {
                redirectUri: 'https://example.com',
            });
            // THEN
            expect(stack.resolve(signInUrl)).toEqual({
                'Fn::Join': [
                    '', [
                        'https://',
                        { Ref: 'PoolDomainCFC71F56' },
                        '.auth.',
                        { Ref: 'AWS::Region' },
                        '.amazoncognito.com/login?client_id=',
                        { Ref: 'PoolClient8A3E5EB7' },
                        '&response_type=code&redirect_uri=https://example.com',
                    ],
                ],
            });
        });
        test('correctly uses the signInPath', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            const domain = pool.addDomain('Domain', {
                cognitoDomain: {
                    domainPrefix: 'cognito-domain-prefix',
                },
            });
            const client = pool.addClient('Client', {
                oAuth: {
                    callbackUrls: ['https://example.com'],
                },
            });
            // WHEN
            const signInUrl = domain.signInUrl(client, {
                redirectUri: 'https://example.com',
                signInPath: '/testsignin',
            });
            // THEN
            expect(signInUrl).toMatch(/amazoncognito\.com\/testsignin\?/);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wb29sLWRvbWFpbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci1wb29sLWRvbWFpbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLDRFQUE4RDtBQUM5RCx3Q0FBb0Q7QUFDcEQsZ0NBQWtEO0FBRWxELFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDaEMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRTtRQUM5QixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFekMsT0FBTztRQUNQLE1BQU0sV0FBVyxHQUFHLG9DQUFXLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFDOUQsbUZBQW1GLENBQUMsQ0FBQztRQUN2RixJQUFJLG9CQUFjLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtZQUNsQyxRQUFRLEVBQUUsSUFBSTtZQUNkLFlBQVksRUFBRTtnQkFDWixVQUFVLEVBQUUseUJBQXlCO2dCQUNyQyxXQUFXO2FBQ1o7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsOEJBQThCLEVBQUU7WUFDOUUsVUFBVSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUMxQyxNQUFNLEVBQUUseUJBQXlCO1lBQ2pDLGtCQUFrQixFQUFFO2dCQUNsQixjQUFjLEVBQUUsbUZBQW1GO2FBQ3BHO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO1FBQ2pDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJ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LENBQUMsT0FBTyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7UUFDaEUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IENlcnRpZmljYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWNlcnRpZmljYXRlbWFuYWdlcic7XG5pbXBvcnQgeyBDZm5QYXJhbWV0ZXIsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBVc2VyUG9vbCwgVXNlclBvb2xEb21haW4gfSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnVXNlciBQb29sIENsaWVudCcsICgpID0+IHtcbiAgdGVzdCgnY3VzdG9tIGRvbWFpbiBuYW1lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNlcnRpZmljYXRlID0gQ2VydGlmaWNhdGUuZnJvbUNlcnRpZmljYXRlQXJuKHN0YWNrLCAnY2VydCcsXG4gICAgICAnYXJuOmF3czphY206ZXUtd2VzdC0xOjAxMjM0NTY3ODk6Y2VydGlmaWNhdGUvN2VjM2U0YWMtODA4YS00NjQ5LWI4MDUtNjZhZTAyMzQ2YWQ4Jyk7XG4gICAgbmV3IFVzZXJQb29sRG9tYWluKHN0YWNrLCAnRG9tYWluJywge1xuICAgICAgdXNlclBvb2w6IHBvb2wsXG4gICAgICBjdXN0b21Eb21haW46IHtcbiAgICAgICAgZG9tYWluTmFtZTogJ3Rlc3QtZG9tYWluLmV4YW1wbGUuY29tJyxcbiAgICAgICAgY2VydGlmaWNhdGUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sRG9tYWluJywge1xuICAgICAgVXNlclBvb2xJZDogc3RhY2sucmVzb2x2ZShwb29sLnVzZXJQb29sSWQpLFxuICAgICAgRG9tYWluOiAndGVzdC1kb21haW4uZXhhbXBsZS5jb20nLFxuICAgICAgQ3VzdG9tRG9tYWluQ29uZmlnOiB7XG4gICAgICAgIENlcnRpZmljYXRlQXJuOiAnYXJuOmF3czphY206ZXUtd2VzdC0xOjAxMjM0NTY3ODk6Y2VydGlmaWNhdGUvN2VjM2U0YWMtODA4YS00NjQ5LWI4MDUtNjZhZTAyMzQ2YWQ4JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvZ25pdG8gZG9tYWluIHByZWZpeCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgVXNlclBvb2xEb21haW4oc3RhY2ssICdEb21haW4nLCB7XG4gICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICAgIGNvZ25pdG9Eb21haW46IHtcbiAgICAgICAgZG9tYWluUHJlZml4OiAnY29nbml0by1kb21haW4tcHJlZml4JyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xEb21haW4nLCB7XG4gICAgICBVc2VyUG9vbElkOiBzdGFjay5yZXNvbHZlKHBvb2wudXNlclBvb2xJZCksXG4gICAgICBEb21haW46ICdjb2duaXRvLWRvbWFpbi1wcmVmaXgnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyB3aGVuIG5laXRoZXIgY29nbml0b0RvbWFpbiBub3IgY3VzdG9tRG9tYWluIGFyZSBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuICAgIGNvbnN0IGNlcnRpZmljYXRlID0gQ2VydGlmaWNhdGUuZnJvbUNlcnRpZmljYXRlQXJuKHN0YWNrLCAnY2VydCcsXG4gICAgICAnYXJuOmF3czphY206ZXUtd2VzdC0xOjAxMjM0NTY3ODk6Y2VydGlmaWNhdGUvN2VjM2U0YWMtODA4YS00NjQ5LWI4MDUtNjZhZTAyMzQ2YWQ4Jyk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IFVzZXJQb29sRG9tYWluKHN0YWNrLCAnRG9tYWluJywge1xuICAgICAgdXNlclBvb2w6IHBvb2wsXG4gICAgICBjb2duaXRvRG9tYWluOiB7XG4gICAgICAgIGRvbWFpblByZWZpeDogJ2NvZ25pdG8tZG9tYWluLXByZWZpeCcsXG4gICAgICB9LFxuICAgICAgY3VzdG9tRG9tYWluOiB7XG4gICAgICAgIGRvbWFpbk5hbWU6ICdteWRvbWFpbi5jb20nLFxuICAgICAgICBjZXJ0aWZpY2F0ZSxcbiAgICAgIH0sXG4gICAgfSkpLnRvVGhyb3coL2NvZ25pdG9Eb21haW4gb3IgY3VzdG9tRG9tYWluIG11c3QgYmUgc3BlY2lmaWVkLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIHdoZW4gYm90aCBjb2duaXRvRG9tYWluIGFuZCBjdXN0b21Eb21haW4gYXJlIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IFVzZXJQb29sRG9tYWluKHN0YWNrLCAnRG9tYWluJywge1xuICAgICAgdXNlclBvb2w6IHBvb2wsXG4gICAgfSkpLnRvVGhyb3coL2NvZ25pdG9Eb21haW4gb3IgY3VzdG9tRG9tYWluIG11c3QgYmUgc3BlY2lmaWVkLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIHdoZW4gZG9tYWluUHJlZml4IGhhcyBjaGFyYWN0ZXJzIG91dHNpZGUgdGhlIGFsbG93ZWQgY2hhcnNldCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG5cbiAgICBleHBlY3QoKCkgPT4gcG9vbC5hZGREb21haW4oJ0RvbWFpbjEnLCB7XG4gICAgICBjb2duaXRvRG9tYWluOiB7IGRvbWFpblByZWZpeDogJ2RvbWFpbi5wcmVmaXgnIH0sXG4gICAgfSkpLnRvVGhyb3coL2xvd2VyY2FzZSBhbHBoYWJldHMsIG51bWJlcnMgYW5kIGh5cGhlbnMvKTtcbiAgICBleHBlY3QoKCkgPT4gcG9vbC5hZGREb21haW4oJ0RvbWFpbjInLCB7XG4gICAgICBjb2duaXRvRG9tYWluOiB7IGRvbWFpblByZWZpeDogJ0RvbWFpbi1QcmVmaXgnIH0sXG4gICAgfSkpLnRvVGhyb3coL2xvd2VyY2FzZSBhbHBoYWJldHMsIG51bWJlcnMgYW5kIGh5cGhlbnMvKTtcbiAgICBleHBlY3QoKCkgPT4gcG9vbC5hZGREb21haW4oJ0RvbWFpbjMnLCB7XG4gICAgICBjb2duaXRvRG9tYWluOiB7IGRvbWFpblByZWZpeDogJ2TDs23DpGluLXByZWZpeCcgfSxcbiAgICB9KSkudG9UaHJvdygvbG93ZXJjYXNlIGFscGhhYmV0cywgbnVtYmVycyBhbmQgaHlwaGVucy8pO1xuICB9KTtcblxuICB0ZXN0KCdkb2VzIG5vdCBmYWlsIHdoZW4gZG9tYWluUHJlZml4IGlzIGEgdG9rZW4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuXG4gICAgY29uc3QgcGFyYW1ldGVyID0gbmV3IENmblBhcmFtZXRlcihzdGFjaywgJ1BhcmFldGVyJyk7XG5cbiAgICBleHBlY3QoKCkgPT4gcG9vbC5hZGREb21haW4oJ0RvbWFpbicsIHtcbiAgICAgIGNvZ25pdG9Eb21haW46IHsgZG9tYWluUHJlZml4OiBwYXJhbWV0ZXIudmFsdWVBc1N0cmluZyB9LFxuICAgIH0pKS5ub3QudG9UaHJvdygpO1xuICB9KTtcblxuICB0ZXN0KCdjdXN0b20gcmVzb3VyY2UgaXMgYWRkZWQgd2hlbiBjbG91ZEZyb250RG9tYWluTmFtZSBwcm9wZXJ0eSBpcyB1c2VkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuICAgIGNvbnN0IGRvbWFpbiA9IHBvb2wuYWRkRG9tYWluKCdEb21haW4nLCB7XG4gICAgICBjb2duaXRvRG9tYWluOiB7XG4gICAgICAgIGRvbWFpblByZWZpeDogJ2NvZ25pdG8tZG9tYWluLXByZWZpeCcsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNmRG9tYWluTmFtZSA9IGRvbWFpbi5jbG91ZEZyb250RG9tYWluTmFtZTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShjZkRvbWFpbk5hbWUpKS50b0VxdWFsKHtcbiAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAnUG9vbERvbWFpbkNsb3VkRnJvbnREb21haW5OYW1lMzQwQkY4N0UnLFxuICAgICAgICAnRG9tYWluRGVzY3JpcHRpb24uQ2xvdWRGcm9udERpc3RyaWJ1dGlvbicsXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0N1c3RvbTo6VXNlclBvb2xDbG91ZEZyb250RG9tYWluTmFtZScsIDEpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbe1xuICAgICAgICAgIEFjdGlvbjogJ2NvZ25pdG8taWRwOkRlc2NyaWJlVXNlclBvb2xEb21haW4nLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICB9XSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2xvdWRGcm9udERvbWFpbk5hbWUgcHJvcGVydHkgY2FuIGJlIGNhbGxlZCBtdWx0aXBsZSB0aW1lcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG4gICAgY29uc3QgZG9tYWluID0gcG9vbC5hZGREb21haW4oJ0RvbWFpbicsIHtcbiAgICAgIGNvZ25pdG9Eb21haW46IHtcbiAgICAgICAgZG9tYWluUHJlZml4OiAnY29nbml0by1kb21haW4tcHJlZml4JyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBjZkRvbWFpbk5hbWVGaXJzdCA9IGRvbWFpbi5jbG91ZEZyb250RG9tYWluTmFtZTtcbiAgICBjb25zdCBjZkRvbWFpbk5hbWVTZWNvbmQgPSBkb21haW4uY2xvdWRGcm9udERvbWFpbk5hbWU7XG5cbiAgICBleHBlY3QoY2ZEb21haW5OYW1lU2Vjb25kKS50b0VxdWFsKGNmRG9tYWluTmFtZUZpcnN0KTtcbiAgfSk7XG5cbiAgdGVzdCgnaW1wb3J0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBjbGllbnQgPSBVc2VyUG9vbERvbWFpbi5mcm9tRG9tYWluTmFtZShzdGFjaywgJ0RvbWFpbicsICdkb21haW4tbmFtZS0xJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGNsaWVudC5kb21haW5OYW1lKS50b0VxdWFsKCdkb21haW4tbmFtZS0xJyk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xEb21haW4nLCAwKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2Jhc2VVcmwnLCAoKSA9PiB7XG4gICAgdGVzdCgncmV0dXJucyB0aGUgZXhwZWN0ZWQgc3RhbmRhcmQgVVJMJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuICAgICAgY29uc3QgZG9tYWluID0gcG9vbC5hZGREb21haW4oJ0RvbWFpbicsIHtcbiAgICAgICAgY29nbml0b0RvbWFpbjoge1xuICAgICAgICAgIGRvbWFpblByZWZpeDogJ2NvZ25pdG8tZG9tYWluLXByZWZpeCcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgYmFzZVVybCA9IGRvbWFpbi5iYXNlVXJsKCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGJhc2VVcmwpKS50b0VxdWFsKHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLCBbXG4gICAgICAgICAgICAnaHR0cHM6Ly8nLFxuICAgICAgICAgICAgeyBSZWY6ICdQb29sRG9tYWluQ0ZDNzFGNTYnIH0sXG4gICAgICAgICAgICAnLmF1dGguJyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICAnLmFtYXpvbmNvZ25pdG8uY29tJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdyZXR1cm5zIHRoZSBleHBlY3RlZCBGSVBTLWNvbXBsaWFudCBlbmRwb2ludCBVUkwnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG4gICAgICBjb25zdCBkb21haW4gPSBwb29sLmFkZERvbWFpbignRG9tYWluJywge1xuICAgICAgICBjb2duaXRvRG9tYWluOiB7XG4gICAgICAgICAgZG9tYWluUHJlZml4OiAnY29nbml0by1kb21haW4tcHJlZml4JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBiYXNlVXJsID0gZG9tYWluLmJhc2VVcmwoeyBmaXBzOiB0cnVlIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShiYXNlVXJsKSkudG9FcXVhbCh7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJywgW1xuICAgICAgICAgICAgJ2h0dHBzOi8vJyxcbiAgICAgICAgICAgIHsgUmVmOiAnUG9vbERvbWFpbkNGQzcxRjU2JyB9LFxuICAgICAgICAgICAgJy5hdXRoLWZpcHMuJyxcbiAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICAnLmFtYXpvbmNvZ25pdG8uY29tJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzaWduSW5VcmwnLCAoKSA9PiB7XG4gICAgdGVzdCgncmV0dXJucyB0aGUgZXhwZWN0ZWQgVVJMJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuICAgICAgY29uc3QgZG9tYWluID0gcG9vbC5hZGREb21haW4oJ0RvbWFpbicsIHtcbiAgICAgICAgY29nbml0b0RvbWFpbjoge1xuICAgICAgICAgIGRvbWFpblByZWZpeDogJ2NvZ25pdG8tZG9tYWluLXByZWZpeCcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGNsaWVudCA9IHBvb2wuYWRkQ2xpZW50KCdDbGllbnQnLCB7XG4gICAgICAgIG9BdXRoOiB7XG4gICAgICAgICAgY2FsbGJhY2tVcmxzOiBbJ2h0dHBzOi8vZXhhbXBsZS5jb20nXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBzaWduSW5VcmwgPSBkb21haW4uc2lnbkluVXJsKGNsaWVudCwge1xuICAgICAgICByZWRpcmVjdFVyaTogJ2h0dHBzOi8vZXhhbXBsZS5jb20nLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHNpZ25JblVybCkpLnRvRXF1YWwoe1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsIFtcbiAgICAgICAgICAgICdodHRwczovLycsXG4gICAgICAgICAgICB7IFJlZjogJ1Bvb2xEb21haW5DRkM3MUY1NicgfSxcbiAgICAgICAgICAgICcuYXV0aC4nLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICcuYW1hem9uY29nbml0by5jb20vbG9naW4/Y2xpZW50X2lkPScsXG4gICAgICAgICAgICB7IFJlZjogJ1Bvb2xDbGllbnQ4QTNFNUVCNycgfSxcbiAgICAgICAgICAgICcmcmVzcG9uc2VfdHlwZT1jb2RlJnJlZGlyZWN0X3VyaT1odHRwczovL2V4YW1wbGUuY29tJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjb3JyZWN0bHkgdXNlcyB0aGUgc2lnbkluUGF0aCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnKTtcbiAgICAgIGNvbnN0IGRvbWFpbiA9IHBvb2wuYWRkRG9tYWluKCdEb21haW4nLCB7XG4gICAgICAgIGNvZ25pdG9Eb21haW46IHtcbiAgICAgICAgICBkb21haW5QcmVmaXg6ICdjb2duaXRvLWRvbWFpbi1wcmVmaXgnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCBjbGllbnQgPSBwb29sLmFkZENsaWVudCgnQ2xpZW50Jywge1xuICAgICAgICBvQXV0aDoge1xuICAgICAgICAgIGNhbGxiYWNrVXJsczogWydodHRwczovL2V4YW1wbGUuY29tJ10sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3Qgc2lnbkluVXJsID0gZG9tYWluLnNpZ25JblVybChjbGllbnQsIHtcbiAgICAgICAgcmVkaXJlY3RVcmk6ICdodHRwczovL2V4YW1wbGUuY29tJyxcbiAgICAgICAgc2lnbkluUGF0aDogJy90ZXN0c2lnbmluJyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc2lnbkluVXJsKS50b01hdGNoKC9hbWF6b25jb2duaXRvXFwuY29tXFwvdGVzdHNpZ25pblxcPy8pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19