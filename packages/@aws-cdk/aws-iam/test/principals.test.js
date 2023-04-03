"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const iam = require("../lib");
const lib_1 = require("../lib");
test('use of cross-stack role reference does not lead to URLSuffix being exported', () => {
    // GIVEN
    const app = new core_1.App();
    const first = new core_1.Stack(app, 'First');
    const second = new core_1.Stack(app, 'Second');
    // WHEN
    const role = new iam.Role(first, 'Role', {
        assumedBy: new iam.ServicePrincipal('s3.amazonaws.com'),
    });
    new core_1.CfnOutput(second, 'Output', {
        value: role.roleArn,
    });
    // THEN
    app.synth();
    assertions_1.Template.fromStack(first).templateMatches({
        Resources: {
            Role1ABCC5F0: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [
                            {
                                Action: 'sts:AssumeRole',
                                Effect: 'Allow',
                                Principal: { Service: 's3.amazonaws.com' },
                            },
                        ],
                        Version: '2012-10-17',
                    },
                },
            },
        },
        Outputs: {
            ExportsOutputFnGetAttRole1ABCC5F0ArnB4C0B73E: {
                Value: { 'Fn::GetAtt': ['Role1ABCC5F0', 'Arn'] },
                Export: {
                    Name: 'First:ExportsOutputFnGetAttRole1ABCC5F0ArnB4C0B73E',
                },
            },
        },
    });
});
test('cannot have multiple principals with different conditions in the same statement', () => {
    const stack = new core_1.Stack(undefined, 'First');
    const user = new iam.User(stack, 'User');
    expect(() => {
        user.addToPolicy(new iam.PolicyStatement({
            principals: [
                new iam.ServicePrincipal('myService.amazon.com', {
                    conditions: {
                        StringEquals: {
                            hairColor: 'blond',
                        },
                    },
                }),
                new iam.ServicePrincipal('yourservice.amazon.com', {
                    conditions: {
                        StringEquals: {
                            hairColor: 'black',
                        },
                    },
                }),
            ],
        }));
    }).toThrow(/All principals in a PolicyStatement must have the same Conditions/);
});
test('can have multiple principals the same conditions in the same statement', () => {
    const stack = new core_1.Stack(undefined, 'First');
    const user = new iam.User(stack, 'User');
    user.addToPolicy(new iam.PolicyStatement({
        principals: [
            new iam.ServicePrincipal('myService.amazon.com'),
            new iam.ServicePrincipal('yourservice.amazon.com'),
        ],
    }));
    user.addToPolicy(new iam.PolicyStatement({
        principals: [
            new iam.ServicePrincipal('myService.amazon.com', {
                conditions: {
                    StringEquals: { hairColor: 'blond' },
                },
            }),
            new iam.ServicePrincipal('yourservice.amazon.com', {
                conditions: {
                    StringEquals: { hairColor: 'blond' },
                },
            }),
        ],
    }));
});
test('use federated principal', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    const principal = new iam.FederatedPrincipal('federated');
    // THEN
    expect(stack.resolve(principal.federated)).toStrictEqual('federated');
    expect(stack.resolve(principal.assumeRoleAction)).toStrictEqual('sts:AssumeRole');
    expect(stack.resolve(principal.conditions)).toStrictEqual({});
});
test('use Web Identity principal', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    const principal = new iam.WebIdentityPrincipal('cognito-identity.amazonaws.com');
    // THEN
    expect(stack.resolve(principal.federated)).toStrictEqual('cognito-identity.amazonaws.com');
    expect(stack.resolve(principal.assumeRoleAction)).toStrictEqual('sts:AssumeRoleWithWebIdentity');
});
test('use OpenID Connect principal from provider', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const provider = new iam.OpenIdConnectProvider(stack, 'MyProvider', {
        url: 'https://openid-endpoint',
    });
    // WHEN
    const principal = new iam.OpenIdConnectPrincipal(provider);
    // THEN
    expect(stack.resolve(principal.federated)).toStrictEqual({ Ref: 'MyProvider730BA1C8' });
});
test('SAML principal', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const provider = new iam.SamlProvider(stack, 'MyProvider', {
        metadataDocument: iam.SamlMetadataDocument.fromXml('document'),
    });
    // WHEN
    const principal = new iam.SamlConsolePrincipal(provider);
    new iam.Role(stack, 'Role', {
        assumedBy: principal,
    });
    // THEN
    expect(stack.resolve(principal.federated)).toStrictEqual({ Ref: 'MyProvider730BA1C8' });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
            Statement: [
                {
                    Action: 'sts:AssumeRoleWithSAML',
                    Condition: {
                        StringEquals: {
                            'SAML:aud': 'https://signin.aws.amazon.com/saml',
                        },
                    },
                    Effect: 'Allow',
                    Principal: {
                        Federated: {
                            Ref: 'MyProvider730BA1C8',
                        },
                    },
                },
            ],
            Version: '2012-10-17',
        },
    });
});
test('StarPrincipal', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    const pol = new iam.PolicyDocument({
        statements: [
            new iam.PolicyStatement({
                actions: ['service:action'],
                resources: ['*'],
                principals: [new iam.StarPrincipal()],
            }),
        ],
    });
    // THEN
    expect(stack.resolve(pol)).toEqual({
        Statement: [
            {
                Action: 'service:action',
                Effect: 'Allow',
                Principal: '*',
                Resource: '*',
            },
        ],
        Version: '2012-10-17',
    });
});
test('PrincipalWithConditions.addCondition should work', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const basePrincipal = new iam.ServicePrincipal('service.amazonaws.com');
    const principalWithConditions = new iam.PrincipalWithConditions(basePrincipal, {
        StringEquals: {
            'aws:PrincipalOrgID': ['o-xxxxxxxxxxx'],
        },
    });
    // WHEN
    principalWithConditions.addCondition('StringEquals', { 'aws:PrincipalTag/critical': 'true' });
    new iam.Role(stack, 'Role', {
        assumedBy: principalWithConditions,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
            Statement: [
                {
                    Action: 'sts:AssumeRole',
                    Condition: {
                        StringEquals: {
                            'aws:PrincipalOrgID': ['o-xxxxxxxxxxx'],
                            'aws:PrincipalTag/critical': 'true',
                        },
                    },
                    Effect: 'Allow',
                    Principal: {
                        Service: 'service.amazonaws.com',
                    },
                },
            ],
            Version: '2012-10-17',
        },
    });
});
test('PrincipalWithConditions.addCondition with a new condition operator should work', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const basePrincipal = new iam.ServicePrincipal('service.amazonaws.com');
    const principalWithConditions = new iam.PrincipalWithConditions(basePrincipal, {});
    // WHEN
    principalWithConditions.addCondition('StringEquals', { 'aws:PrincipalTag/critical': 'true' });
    principalWithConditions.addCondition('IpAddress', { 'aws:SourceIp': '0.0.0.0/0' });
    new iam.Role(stack, 'Role', {
        assumedBy: principalWithConditions,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
            Statement: [
                {
                    Action: 'sts:AssumeRole',
                    Condition: {
                        StringEquals: {
                            'aws:PrincipalTag/critical': 'true',
                        },
                        IpAddress: {
                            'aws:SourceIp': '0.0.0.0/0',
                        },
                    },
                    Effect: 'Allow',
                    Principal: {
                        Service: 'service.amazonaws.com',
                    },
                },
            ],
            Version: '2012-10-17',
        },
    });
});
test('PrincipalWithConditions inherits principalAccount from AccountPrincipal ', () => {
    // GIVEN
    const accountPrincipal = new iam.AccountPrincipal('123456789012');
    const principalWithConditions = accountPrincipal.withConditions({ StringEquals: { hairColor: 'blond' } });
    // THEN
    expect(accountPrincipal.principalAccount).toStrictEqual('123456789012');
    expect(principalWithConditions.principalAccount).toStrictEqual('123456789012');
});
test('AccountPrincipal can specify an organization', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    const pol = new iam.PolicyDocument({
        statements: [
            new iam.PolicyStatement({
                actions: ['service:action'],
                resources: ['*'],
                principals: [
                    new iam.AccountPrincipal('123456789012').inOrganization('o-xxxxxxxxxx'),
                ],
            }),
        ],
    });
    // THEN
    expect(stack.resolve(pol)).toEqual({
        Statement: [
            {
                Action: 'service:action',
                Effect: 'Allow',
                Principal: {
                    AWS: {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {
                                    Ref: 'AWS::Partition',
                                },
                                ':iam::123456789012:root',
                            ],
                        ],
                    },
                },
                Condition: {
                    StringEquals: {
                        'aws:PrincipalOrgID': 'o-xxxxxxxxxx',
                    },
                },
                Resource: '*',
            },
        ],
        Version: '2012-10-17',
    });
});
describe('deprecated ServicePrincipal behavior', () => {
    // This behavior makes use of deprecated region-info lookup tables
    test('ServicePrincipalName returns just a string representing the principal', () => {
        // GIVEN
        const usEastStack = new core_1.Stack(undefined, undefined, { env: { region: 'us-east-1' } });
        const afSouthStack = new core_1.Stack(undefined, undefined, { env: { region: 'af-south-1' } });
        const principalName = iam.ServicePrincipal.servicePrincipalName('states.amazonaws.com');
        expect(usEastStack.resolve(principalName)).toEqual('states.us-east-1.amazonaws.com');
        expect(afSouthStack.resolve(principalName)).toEqual('states.af-south-1.amazonaws.com');
    });
    test('Passing non-string as accountId parameter in AccountPrincipal constructor should throw error', () => {
        expect(() => new iam.AccountPrincipal(1234)).toThrowError('accountId should be of type string');
    });
    test('ServicePrincipal in agnostic stack generates lookup table', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new iam.Role(stack, 'Role', {
            assumedBy: new iam.ServicePrincipal('states.amazonaws.com'),
        });
        // THEN
        const template = assertions_1.Template.fromStack(stack);
        const mappings = template.findMappings('ServiceprincipalMap');
        expect(mappings.ServiceprincipalMap['af-south-1']?.states).toEqual('states.af-south-1.amazonaws.com');
        expect(mappings.ServiceprincipalMap['us-east-1']?.states).toEqual('states.us-east-1.amazonaws.com');
    });
});
describe('standardized Service Principal behavior', () => {
    const agnosticStatesPrincipal = new lib_1.ServicePrincipal('states.amazonaws.com');
    const afSouth1StatesPrincipal = new lib_1.ServicePrincipal('states.amazonaws.com', { region: 'af-south-1' });
    // af-south-1 is an opt-in region
    let app;
    beforeEach(() => {
        app = new core_1.App({
            postCliContext: { [cxapi.IAM_STANDARDIZED_SERVICE_PRINCIPALS]: true },
        });
    });
    test('no more regional service principals by default', () => {
        const stack = new core_1.Stack(app, 'Stack', { env: { region: 'us-east-1' } });
        expect(stack.resolve(agnosticStatesPrincipal.policyFragment).principalJson).toEqual({ Service: ['states.amazonaws.com'] });
    });
    test('regional service principal is added for cross-region reference to opt-in region', () => {
        const stack = new core_1.Stack(app, 'Stack', { env: { region: 'us-east-1' } });
        expect(stack.resolve(afSouth1StatesPrincipal.policyFragment).principalJson).toEqual({ Service: ['states.af-south-1.amazonaws.com'] });
    });
    test('regional service principal is not added for same-region reference in opt-in region', () => {
        const stack = new core_1.Stack(app, 'Stack', { env: { region: 'af-south-1' } });
        expect(stack.resolve(afSouth1StatesPrincipal.policyFragment).principalJson).toEqual({ Service: ['states.amazonaws.com'] });
    });
});
test('Can enable session tags', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    new iam.Role(stack, 'Role', {
        assumedBy: new iam.WebIdentityPrincipal('cognito-identity.amazonaws.com', {
            'StringEquals': { 'cognito-identity.amazonaws.com:aud': 'asdf' },
            'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'authenticated' },
        }).withSessionTags(),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
            Statement: [
                {
                    Action: ['sts:AssumeRoleWithWebIdentity', 'sts:TagSession'],
                    Condition: {
                        'StringEquals': { 'cognito-identity.amazonaws.com:aud': 'asdf' },
                        'ForAnyValue:StringLike': { 'cognito-identity.amazonaws.com:amr': 'authenticated' },
                    },
                    Effect: 'Allow',
                    Principal: { Federated: 'cognito-identity.amazonaws.com' },
                },
            ],
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbmNpcGFscy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJpbmNpcGFscy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUFzRDtBQUN0RCx5Q0FBeUM7QUFDekMsOEJBQThCO0FBQzlCLGdDQUEwQztBQUUxQyxJQUFJLENBQUMsNkVBQTZFLEVBQUUsR0FBRyxFQUFFO0lBQ3ZGLFFBQVE7SUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO0lBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN0QyxNQUFNLE1BQU0sR0FBRyxJQUFJLFlBQUssQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFFeEMsT0FBTztJQUNQLE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1FBQ3ZDLFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQztLQUN4RCxDQUFDLENBQUM7SUFFSCxJQUFJLGdCQUFTLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtRQUM5QixLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU87S0FDcEIsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUVaLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQztRQUN4QyxTQUFTLEVBQUU7WUFDVCxZQUFZLEVBQUU7Z0JBQ1osSUFBSSxFQUFFLGdCQUFnQjtnQkFDdEIsVUFBVSxFQUFFO29CQUNWLHdCQUF3QixFQUFFO3dCQUN4QixTQUFTLEVBQUU7NEJBQ1Q7Z0NBQ0UsTUFBTSxFQUFFLGdCQUFnQjtnQ0FDeEIsTUFBTSxFQUFFLE9BQU87Z0NBQ2YsU0FBUyxFQUFFLEVBQUUsT0FBTyxF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QU87SUFDUCxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtRQUMxQixTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsb0JBQW9CLENBQ3JDLGdDQUFnQyxFQUNoQztZQUNFLGNBQWMsRUFBRSxFQUFFLG9DQUFvQyxFQUFFLE1BQU0sRUFBRTtZQUNoRSx3QkFBd0IsRUFBRSxFQUFFLG9DQUFvQyxFQUFFLGVBQWUsRUFBRTtTQUNwRixDQUFDLENBQUMsZUFBZSxFQUFFO0tBQ3ZCLENBQUMsQ0FBQztJQUVILE9BQU87SUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBZ0IsRUFBRTtRQUNoRSx3QkFBd0IsRUFBRTtZQUN4QixTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsTUFBTSxFQUFFLENBQUMsK0JBQStCLEVBQUUsZ0JBQWdCLENBQUM7b0JBQzNELFNBQVMsRUFBRTt3QkFDVCxjQUFjLEVBQUUsRUFBRSxvQ0FBb0MsRUFBRSxNQUFNLEVBQUU7d0JBQ2hFLHdCQUF3QixFQUFFLEVBQUUsb0NBQW9DLEVBQUUsZUFBZSxFQUFFO3FCQUNwRjtvQkFDRCxNQUFNLEVBQUUsT0FBTztvQkFDZixTQUFTLEVBQUUsRUFBRSxTQUFTLEVBQUUsZ0NBQWdDLEVBQUU7aUJBQzNEO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IEFwcCwgQ2ZuT3V0cHV0LCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgU2VydmljZVByaW5jaXBhbCB9IGZyb20gJy4uL2xpYic7XG5cbnRlc3QoJ3VzZSBvZiBjcm9zcy1zdGFjayByb2xlIHJlZmVyZW5jZSBkb2VzIG5vdCBsZWFkIHRvIFVSTFN1ZmZpeCBiZWluZyBleHBvcnRlZCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICBjb25zdCBmaXJzdCA9IG5ldyBTdGFjayhhcHAsICdGaXJzdCcpO1xuICBjb25zdCBzZWNvbmQgPSBuZXcgU3RhY2soYXBwLCAnU2Vjb25kJyk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKGZpcnN0LCAnUm9sZScsIHtcbiAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnczMuYW1hem9uYXdzLmNvbScpLFxuICB9KTtcblxuICBuZXcgQ2ZuT3V0cHV0KHNlY29uZCwgJ091dHB1dCcsIHtcbiAgICB2YWx1ZTogcm9sZS5yb2xlQXJuLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIGFwcC5zeW50aCgpO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhmaXJzdCkudGVtcGxhdGVNYXRjaGVzKHtcbiAgICBSZXNvdXJjZXM6IHtcbiAgICAgIFJvbGUxQUJDQzVGMDoge1xuICAgICAgICBUeXBlOiAnQVdTOjpJQU06OlJvbGUnLFxuICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICdzMy5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIE91dHB1dHM6IHtcbiAgICAgIEV4cG9ydHNPdXRwdXRGbkdldEF0dFJvbGUxQUJDQzVGMEFybkI0QzBCNzNFOiB7XG4gICAgICAgIFZhbHVlOiB7ICdGbjo6R2V0QXR0JzogWydSb2xlMUFCQ0M1RjAnLCAnQXJuJ10gfSxcbiAgICAgICAgRXhwb3J0OiB7XG4gICAgICAgICAgTmFtZTogJ0ZpcnN0OkV4cG9ydHNPdXRwdXRGbkdldEF0dFJvbGUxQUJDQzVGMEFybkI0QzBCNzNFJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgKTtcbn0pO1xuXG50ZXN0KCdjYW5ub3QgaGF2ZSBtdWx0aXBsZSBwcmluY2lwYWxzIHdpdGggZGlmZmVyZW50IGNvbmRpdGlvbnMgaW4gdGhlIHNhbWUgc3RhdGVtZW50JywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsICdGaXJzdCcpO1xuICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnVXNlcicpO1xuXG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgdXNlci5hZGRUb1BvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBwcmluY2lwYWxzOiBbXG4gICAgICAgIG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbXlTZXJ2aWNlLmFtYXpvbi5jb20nLCB7XG4gICAgICAgICAgY29uZGl0aW9uczoge1xuICAgICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAgIGhhaXJDb2xvcjogJ2Jsb25kJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgneW91cnNlcnZpY2UuYW1hem9uLmNvbScsIHtcbiAgICAgICAgICBjb25kaXRpb25zOiB7XG4gICAgICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAgICAgaGFpckNvbG9yOiAnYmxhY2snLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSkpO1xuICB9KS50b1Rocm93KC9BbGwgcHJpbmNpcGFscyBpbiBhIFBvbGljeVN0YXRlbWVudCBtdXN0IGhhdmUgdGhlIHNhbWUgQ29uZGl0aW9ucy8pO1xufSk7XG5cbnRlc3QoJ2NhbiBoYXZlIG11bHRpcGxlIHByaW5jaXBhbHMgdGhlIHNhbWUgY29uZGl0aW9ucyBpbiB0aGUgc2FtZSBzdGF0ZW1lbnQnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ0ZpcnN0Jyk7XG4gIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdVc2VyJyk7XG5cbiAgdXNlci5hZGRUb1BvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgcHJpbmNpcGFsczogW1xuICAgICAgbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdteVNlcnZpY2UuYW1hem9uLmNvbScpLFxuICAgICAgbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCd5b3Vyc2VydmljZS5hbWF6b24uY29tJyksXG4gICAgXSxcbiAgfSkpO1xuXG4gIHVzZXIuYWRkVG9Qb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgIHByaW5jaXBhbHM6IFtcbiAgICAgIG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbXlTZXJ2aWNlLmFtYXpvbi5jb20nLCB7XG4gICAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgICBTdHJpbmdFcXVhbHM6IHsgaGFpckNvbG9yOiAnYmxvbmQnIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgneW91cnNlcnZpY2UuYW1hem9uLmNvbScsIHtcbiAgICAgICAgY29uZGl0aW9uczoge1xuICAgICAgICAgIFN0cmluZ0VxdWFsczogeyBoYWlyQ29sb3I6ICdibG9uZCcgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIF0sXG4gIH0pKTtcbn0pO1xuXG50ZXN0KCd1c2UgZmVkZXJhdGVkIHByaW5jaXBhbCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIGNvbnN0IHByaW5jaXBhbCA9IG5ldyBpYW0uRmVkZXJhdGVkUHJpbmNpcGFsKCdmZWRlcmF0ZWQnKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHByaW5jaXBhbC5mZWRlcmF0ZWQpKS50b1N0cmljdEVxdWFsKCdmZWRlcmF0ZWQnKTtcbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocHJpbmNpcGFsLmFzc3VtZVJvbGVBY3Rpb24pKS50b1N0cmljdEVxdWFsKCdzdHM6QXNzdW1lUm9sZScpO1xuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwcmluY2lwYWwuY29uZGl0aW9ucykpLnRvU3RyaWN0RXF1YWwoe30pO1xufSk7XG5cbnRlc3QoJ3VzZSBXZWIgSWRlbnRpdHkgcHJpbmNpcGFsJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgY29uc3QgcHJpbmNpcGFsID0gbmV3IGlhbS5XZWJJZGVudGl0eVByaW5jaXBhbCgnY29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tJyk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwcmluY2lwYWwuZmVkZXJhdGVkKSkudG9TdHJpY3RFcXVhbCgnY29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tJyk7XG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHByaW5jaXBhbC5hc3N1bWVSb2xlQWN0aW9uKSkudG9TdHJpY3RFcXVhbCgnc3RzOkFzc3VtZVJvbGVXaXRoV2ViSWRlbnRpdHknKTtcbn0pO1xuXG50ZXN0KCd1c2UgT3BlbklEIENvbm5lY3QgcHJpbmNpcGFsIGZyb20gcHJvdmlkZXInLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGNvbnN0IHByb3ZpZGVyID0gbmV3IGlhbS5PcGVuSWRDb25uZWN0UHJvdmlkZXIoc3RhY2ssICdNeVByb3ZpZGVyJywge1xuICAgIHVybDogJ2h0dHBzOi8vb3BlbmlkLWVuZHBvaW50JyxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBwcmluY2lwYWwgPSBuZXcgaWFtLk9wZW5JZENvbm5lY3RQcmluY2lwYWwocHJvdmlkZXIpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocHJpbmNpcGFsLmZlZGVyYXRlZCkpLnRvU3RyaWN0RXF1YWwoeyBSZWY6ICdNeVByb3ZpZGVyNzMwQkExQzgnIH0pO1xufSk7XG5cbnRlc3QoJ1NBTUwgcHJpbmNpcGFsJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICBjb25zdCBwcm92aWRlciA9IG5ldyBpYW0uU2FtbFByb3ZpZGVyKHN0YWNrLCAnTXlQcm92aWRlcicsIHtcbiAgICBtZXRhZGF0YURvY3VtZW50OiBpYW0uU2FtbE1ldGFkYXRhRG9jdW1lbnQuZnJvbVhtbCgnZG9jdW1lbnQnKSxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBwcmluY2lwYWwgPSBuZXcgaWFtLlNhbWxDb25zb2xlUHJpbmNpcGFsKHByb3ZpZGVyKTtcbiAgbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICBhc3N1bWVkQnk6IHByaW5jaXBhbCxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwcmluY2lwYWwuZmVkZXJhdGVkKSkudG9TdHJpY3RFcXVhbCh7IFJlZjogJ015UHJvdmlkZXI3MzBCQTFDOCcgfSk7XG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICB7XG4gICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGVXaXRoU0FNTCcsXG4gICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAgICAgJ1NBTUw6YXVkJzogJ2h0dHBzOi8vc2lnbmluLmF3cy5hbWF6b24uY29tL3NhbWwnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgIEZlZGVyYXRlZDoge1xuICAgICAgICAgICAgICBSZWY6ICdNeVByb3ZpZGVyNzMwQkExQzgnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdTdGFyUHJpbmNpcGFsJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgY29uc3QgcG9sID0gbmV3IGlhbS5Qb2xpY3lEb2N1bWVudCh7XG4gICAgc3RhdGVtZW50czogW1xuICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zOiBbJ3NlcnZpY2U6YWN0aW9uJ10sXG4gICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLlN0YXJQcmluY2lwYWwoKV0sXG4gICAgICB9KSxcbiAgICBdLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHBvbCkpLnRvRXF1YWwoe1xuICAgIFN0YXRlbWVudDogW1xuICAgICAge1xuICAgICAgICBBY3Rpb246ICdzZXJ2aWNlOmFjdGlvbicsXG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgUHJpbmNpcGFsOiAnKicsXG4gICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICB9LFxuICAgIF0sXG4gICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdQcmluY2lwYWxXaXRoQ29uZGl0aW9ucy5hZGRDb25kaXRpb24gc2hvdWxkIHdvcmsnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGNvbnN0IGJhc2VQcmluY2lwYWwgPSBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ3NlcnZpY2UuYW1hem9uYXdzLmNvbScpO1xuICBjb25zdCBwcmluY2lwYWxXaXRoQ29uZGl0aW9ucyA9IG5ldyBpYW0uUHJpbmNpcGFsV2l0aENvbmRpdGlvbnMoYmFzZVByaW5jaXBhbCwge1xuICAgIFN0cmluZ0VxdWFsczoge1xuICAgICAgJ2F3czpQcmluY2lwYWxPcmdJRCc6IFsnby14eHh4eHh4eHh4eCddLFxuICAgIH0sXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgcHJpbmNpcGFsV2l0aENvbmRpdGlvbnMuYWRkQ29uZGl0aW9uKCdTdHJpbmdFcXVhbHMnLCB7ICdhd3M6UHJpbmNpcGFsVGFnL2NyaXRpY2FsJzogJ3RydWUnIH0pO1xuICBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgIGFzc3VtZWRCeTogcHJpbmNpcGFsV2l0aENvbmRpdGlvbnMsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAgICAgJ2F3czpQcmluY2lwYWxPcmdJRCc6IFsnby14eHh4eHh4eHh4eCddLFxuICAgICAgICAgICAgICAnYXdzOlByaW5jaXBhbFRhZy9jcml0aWNhbCc6ICd0cnVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICBTZXJ2aWNlOiAnc2VydmljZS5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdQcmluY2lwYWxXaXRoQ29uZGl0aW9ucy5hZGRDb25kaXRpb24gd2l0aCBhIG5ldyBjb25kaXRpb24gb3BlcmF0b3Igc2hvdWxkIHdvcmsnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGNvbnN0IGJhc2VQcmluY2lwYWwgPSBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ3NlcnZpY2UuYW1hem9uYXdzLmNvbScpO1xuICBjb25zdCBwcmluY2lwYWxXaXRoQ29uZGl0aW9ucyA9IG5ldyBpYW0uUHJpbmNpcGFsV2l0aENvbmRpdGlvbnMoYmFzZVByaW5jaXBhbCwgeyB9KTtcblxuICAvLyBXSEVOXG4gIHByaW5jaXBhbFdpdGhDb25kaXRpb25zLmFkZENvbmRpdGlvbignU3RyaW5nRXF1YWxzJywgeyAnYXdzOlByaW5jaXBhbFRhZy9jcml0aWNhbCc6ICd0cnVlJyB9KTtcbiAgcHJpbmNpcGFsV2l0aENvbmRpdGlvbnMuYWRkQ29uZGl0aW9uKCdJcEFkZHJlc3MnLCB7ICdhd3M6U291cmNlSXAnOiAnMC4wLjAuMC8wJyB9KTtcblxuICBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgIGFzc3VtZWRCeTogcHJpbmNpcGFsV2l0aENvbmRpdGlvbnMsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAgICAgJ2F3czpQcmluY2lwYWxUYWcvY3JpdGljYWwnOiAndHJ1ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgSXBBZGRyZXNzOiB7XG4gICAgICAgICAgICAgICdhd3M6U291cmNlSXAnOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICBTZXJ2aWNlOiAnc2VydmljZS5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdQcmluY2lwYWxXaXRoQ29uZGl0aW9ucyBpbmhlcml0cyBwcmluY2lwYWxBY2NvdW50IGZyb20gQWNjb3VudFByaW5jaXBhbCAnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IGFjY291bnRQcmluY2lwYWwgPSBuZXcgaWFtLkFjY291bnRQcmluY2lwYWwoJzEyMzQ1Njc4OTAxMicpO1xuICBjb25zdCBwcmluY2lwYWxXaXRoQ29uZGl0aW9ucyA9IGFjY291bnRQcmluY2lwYWwud2l0aENvbmRpdGlvbnMoeyBTdHJpbmdFcXVhbHM6IHsgaGFpckNvbG9yOiAnYmxvbmQnIH0gfSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoYWNjb3VudFByaW5jaXBhbC5wcmluY2lwYWxBY2NvdW50KS50b1N0cmljdEVxdWFsKCcxMjM0NTY3ODkwMTInKTtcbiAgZXhwZWN0KHByaW5jaXBhbFdpdGhDb25kaXRpb25zLnByaW5jaXBhbEFjY291bnQpLnRvU3RyaWN0RXF1YWwoJzEyMzQ1Njc4OTAxMicpO1xufSk7XG5cbnRlc3QoJ0FjY291bnRQcmluY2lwYWwgY2FuIHNwZWNpZnkgYW4gb3JnYW5pemF0aW9uJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgY29uc3QgcG9sID0gbmV3IGlhbS5Qb2xpY3lEb2N1bWVudCh7XG4gICAgc3RhdGVtZW50czogW1xuICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zOiBbJ3NlcnZpY2U6YWN0aW9uJ10sXG4gICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgIHByaW5jaXBhbHM6IFtcbiAgICAgICAgICBuZXcgaWFtLkFjY291bnRQcmluY2lwYWwoJzEyMzQ1Njc4OTAxMicpLmluT3JnYW5pemF0aW9uKCdvLXh4eHh4eHh4eHgnKSxcbiAgICAgICAgXSxcbiAgICAgIH0pLFxuICAgIF0sXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KHN0YWNrLnJlc29sdmUocG9sKSkudG9FcXVhbCh7XG4gICAgU3RhdGVtZW50OiBbXG4gICAgICB7XG4gICAgICAgIEFjdGlvbjogJ3NlcnZpY2U6YWN0aW9uJyxcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICBBV1M6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzppYW06OjEyMzQ1Njc4OTAxMjpyb290JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAnYXdzOlByaW5jaXBhbE9yZ0lEJzogJ28teHh4eHh4eHh4eCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdkZXByZWNhdGVkIFNlcnZpY2VQcmluY2lwYWwgYmVoYXZpb3InLCAoKSA9PiB7XG4gIC8vIFRoaXMgYmVoYXZpb3IgbWFrZXMgdXNlIG9mIGRlcHJlY2F0ZWQgcmVnaW9uLWluZm8gbG9va3VwIHRhYmxlc1xuXG4gIHRlc3QoJ1NlcnZpY2VQcmluY2lwYWxOYW1lIHJldHVybnMganVzdCBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHByaW5jaXBhbCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHVzRWFzdFN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7IGVudjogeyByZWdpb246ICd1cy1lYXN0LTEnIH0gfSk7XG4gICAgY29uc3QgYWZTb3V0aFN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7IGVudjogeyByZWdpb246ICdhZi1zb3V0aC0xJyB9IH0pO1xuICAgIGNvbnN0IHByaW5jaXBhbE5hbWUgPSBpYW0uU2VydmljZVByaW5jaXBhbC5zZXJ2aWNlUHJpbmNpcGFsTmFtZSgnc3RhdGVzLmFtYXpvbmF3cy5jb20nKTtcblxuICAgIGV4cGVjdCh1c0Vhc3RTdGFjay5yZXNvbHZlKHByaW5jaXBhbE5hbWUpKS50b0VxdWFsKCdzdGF0ZXMudXMtZWFzdC0xLmFtYXpvbmF3cy5jb20nKTtcbiAgICBleHBlY3QoYWZTb3V0aFN0YWNrLnJlc29sdmUocHJpbmNpcGFsTmFtZSkpLnRvRXF1YWwoJ3N0YXRlcy5hZi1zb3V0aC0xLmFtYXpvbmF3cy5jb20nKTtcbiAgfSk7XG5cbiAgdGVzdCgnUGFzc2luZyBub24tc3RyaW5nIGFzIGFjY291bnRJZCBwYXJhbWV0ZXIgaW4gQWNjb3VudFByaW5jaXBhbCBjb25zdHJ1Y3RvciBzaG91bGQgdGhyb3cgZXJyb3InLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBpYW0uQWNjb3VudFByaW5jaXBhbCgxMjM0KSkudG9UaHJvd0Vycm9yKCdhY2NvdW50SWQgc2hvdWxkIGJlIG9mIHR5cGUgc3RyaW5nJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ1NlcnZpY2VQcmluY2lwYWwgaW4gYWdub3N0aWMgc3RhY2sgZ2VuZXJhdGVzIGxvb2t1cCB0YWJsZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdzdGF0ZXMuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICBjb25zdCBtYXBwaW5ncyA9IHRlbXBsYXRlLmZpbmRNYXBwaW5ncygnU2VydmljZXByaW5jaXBhbE1hcCcpO1xuICAgIGV4cGVjdChtYXBwaW5ncy5TZXJ2aWNlcHJpbmNpcGFsTWFwWydhZi1zb3V0aC0xJ10/LnN0YXRlcykudG9FcXVhbCgnc3RhdGVzLmFmLXNvdXRoLTEuYW1hem9uYXdzLmNvbScpO1xuICAgIGV4cGVjdChtYXBwaW5ncy5TZXJ2aWNlcHJpbmNpcGFsTWFwWyd1cy1lYXN0LTEnXT8uc3RhdGVzKS50b0VxdWFsKCdzdGF0ZXMudXMtZWFzdC0xLmFtYXpvbmF3cy5jb20nKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ3N0YW5kYXJkaXplZCBTZXJ2aWNlIFByaW5jaXBhbCBiZWhhdmlvcicsICgpID0+IHtcbiAgY29uc3QgYWdub3N0aWNTdGF0ZXNQcmluY2lwYWwgPSBuZXcgU2VydmljZVByaW5jaXBhbCgnc3RhdGVzLmFtYXpvbmF3cy5jb20nKTtcbiAgY29uc3QgYWZTb3V0aDFTdGF0ZXNQcmluY2lwYWwgPSBuZXcgU2VydmljZVByaW5jaXBhbCgnc3RhdGVzLmFtYXpvbmF3cy5jb20nLCB7IHJlZ2lvbjogJ2FmLXNvdXRoLTEnIH0pO1xuICAvLyBhZi1zb3V0aC0xIGlzIGFuIG9wdC1pbiByZWdpb25cblxuICBsZXQgYXBwOiBBcHA7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGFwcCA9IG5ldyBBcHAoe1xuICAgICAgcG9zdENsaUNvbnRleHQ6IHsgW2N4YXBpLklBTV9TVEFOREFSRElaRURfU0VSVklDRV9QUklOQ0lQQUxTXTogdHJ1ZSB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdubyBtb3JlIHJlZ2lvbmFsIHNlcnZpY2UgcHJpbmNpcGFscyBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJywgeyBlbnY6IHsgcmVnaW9uOiAndXMtZWFzdC0xJyB9IH0pO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGFnbm9zdGljU3RhdGVzUHJpbmNpcGFsLnBvbGljeUZyYWdtZW50KS5wcmluY2lwYWxKc29uKS50b0VxdWFsKHsgU2VydmljZTogWydzdGF0ZXMuYW1hem9uYXdzLmNvbSddIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZWdpb25hbCBzZXJ2aWNlIHByaW5jaXBhbCBpcyBhZGRlZCBmb3IgY3Jvc3MtcmVnaW9uIHJlZmVyZW5jZSB0byBvcHQtaW4gcmVnaW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJywgeyBlbnY6IHsgcmVnaW9uOiAndXMtZWFzdC0xJyB9IH0pO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGFmU291dGgxU3RhdGVzUHJpbmNpcGFsLnBvbGljeUZyYWdtZW50KS5wcmluY2lwYWxKc29uKS50b0VxdWFsKHsgU2VydmljZTogWydzdGF0ZXMuYWYtc291dGgtMS5hbWF6b25hd3MuY29tJ10gfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JlZ2lvbmFsIHNlcnZpY2UgcHJpbmNpcGFsIGlzIG5vdCBhZGRlZCBmb3Igc2FtZS1yZWdpb24gcmVmZXJlbmNlIGluIG9wdC1pbiByZWdpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snLCB7IGVudjogeyByZWdpb246ICdhZi1zb3V0aC0xJyB9IH0pO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGFmU291dGgxU3RhdGVzUHJpbmNpcGFsLnBvbGljeUZyYWdtZW50KS5wcmluY2lwYWxKc29uKS50b0VxdWFsKHsgU2VydmljZTogWydzdGF0ZXMuYW1hem9uYXdzLmNvbSddIH0pO1xuICB9KTtcblxufSk7XG5cbnRlc3QoJ0NhbiBlbmFibGUgc2Vzc2lvbiB0YWdzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICBhc3N1bWVkQnk6IG5ldyBpYW0uV2ViSWRlbnRpdHlQcmluY2lwYWwoXG4gICAgICAnY29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tJyxcbiAgICAgIHtcbiAgICAgICAgJ1N0cmluZ0VxdWFscyc6IHsgJ2NvZ25pdG8taWRlbnRpdHkuYW1hem9uYXdzLmNvbTphdWQnOiAnYXNkZicgfSxcbiAgICAgICAgJ0ZvckFueVZhbHVlOlN0cmluZ0xpa2UnOiB7ICdjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb206YW1yJzogJ2F1dGhlbnRpY2F0ZWQnIH0sXG4gICAgICB9KS53aXRoU2Vzc2lvblRhZ3MoKSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFjdGlvbjogWydzdHM6QXNzdW1lUm9sZVdpdGhXZWJJZGVudGl0eScsICdzdHM6VGFnU2Vzc2lvbiddLFxuICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgJ1N0cmluZ0VxdWFscyc6IHsgJ2NvZ25pdG8taWRlbnRpdHkuYW1hem9uYXdzLmNvbTphdWQnOiAnYXNkZicgfSxcbiAgICAgICAgICAgICdGb3JBbnlWYWx1ZTpTdHJpbmdMaWtlJzogeyAnY29nbml0by1pZGVudGl0eS5hbWF6b25hd3MuY29tOmFtcic6ICdhdXRoZW50aWNhdGVkJyB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFByaW5jaXBhbDogeyBGZWRlcmF0ZWQ6ICdjb2duaXRvLWlkZW50aXR5LmFtYXpvbmF3cy5jb20nIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xufSk7Il19