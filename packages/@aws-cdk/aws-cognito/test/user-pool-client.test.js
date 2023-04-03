"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('User Pool Client', () => {
    test('default setup', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        new lib_1.UserPoolClient(stack, 'Client', {
            userPool: pool,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            UserPoolId: stack.resolve(pool.userPoolId),
            AllowedOAuthFlows: ['implicit', 'code'],
            AllowedOAuthScopes: ['profile', 'phone', 'email', 'openid', 'aws.cognito.signin.user.admin'],
            CallbackURLs: ['https://example.com'],
            SupportedIdentityProviders: ['COGNITO'],
        });
    });
    test('client name', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        const client1 = new lib_1.UserPoolClient(stack, 'Client1', {
            userPool: pool,
            userPoolClientName: 'myclient',
        });
        const client2 = new lib_1.UserPoolClient(stack, 'Client2', {
            userPool: pool,
        });
        // THEN
        expect(client1.userPoolClientName).toEqual('myclient');
        expect(() => client2.userPoolClientName).toThrow(/available only if specified on the UserPoolClient during initialization/);
    });
    describe('Client with secret', () => {
        test('generate secret', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            // WHEN
            const clientWithSecret = new lib_1.UserPoolClient(stack, 'clientWithSecret', {
                userPool: pool,
                generateSecret: true,
            });
            // THEN
            expect(clientWithSecret.userPoolClientSecret).toBeDefined();
            // Make sure getter returns the same secret regardless if it's called one or many times
            expect(clientWithSecret.userPoolClientSecret).toEqual(clientWithSecret.userPoolClientSecret);
            // Make sure the generated template has correct resources
            assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::DescribeCognitoUserPoolClient', {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'AWS679f53fac002430cb0da5b7982bd22872D164C4C',
                        'Arn',
                    ],
                },
                Create: {
                    'Fn::Join': [
                        '',
                        [
                            '{"region":"',
                            {
                                Ref: 'AWS::Region',
                            },
                            '","service":"CognitoIdentityServiceProvider","action":"describeUserPoolClient","parameters":{"UserPoolId":"',
                            {
                                Ref: 'PoolD3F588B8',
                            },
                            '","ClientId":"',
                            {
                                Ref: 'clientWithSecretD25031A8',
                            },
                            '"},"physicalResourceId":{"id":"',
                            {
                                Ref: 'clientWithSecretD25031A8',
                            },
                            '"}}',
                        ],
                    ],
                },
                Update: {
                    'Fn::Join': [
                        '',
                        [
                            '{"region":"',
                            {
                                Ref: 'AWS::Region',
                            },
                            '","service":"CognitoIdentityServiceProvider","action":"describeUserPoolClient","parameters":{"UserPoolId":"',
                            {
                                Ref: 'PoolD3F588B8',
                            },
                            '","ClientId":"',
                            {
                                Ref: 'clientWithSecretD25031A8',
                            },
                            '"},"physicalResourceId":{"id":"',
                            {
                                Ref: 'clientWithSecretD25031A8',
                            },
                            '"}}',
                        ],
                    ],
                },
                InstallLatestAwsSdk: false,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: [{
                            Action: 'cognito-idp:DescribeUserPoolClient',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'PoolD3F588B8',
                                    'Arn',
                                ],
                            },
                        }],
                    Version: '2012-10-17',
                },
                PolicyName: 'clientWithSecretDescribeCognitoUserPoolClientCustomResourcePolicyCDE4AB00',
                Roles: [{ Ref: 'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2' }],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
                AssumeRolePolicyDocument: {
                    Statement: [{
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {
                                Service: 'lambda.amazonaws.com',
                            },
                        }],
                    Version: '2012-10-17',
                },
                ManagedPolicyArns: [{
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {
                                    Ref: 'AWS::Partition',
                                },
                                ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                            ],
                        ],
                    }],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
                Role: {
                    'Fn::GetAtt': [
                        'AWS679f53fac002430cb0da5b7982bd2287ServiceRoleC1EA0FF2',
                        'Arn',
                    ],
                },
                Handler: 'index.handler',
                Timeout: 120,
            });
        });
        test('explicitly disable secret generation', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            // WHEN
            const clientWithoutSecret = new lib_1.UserPoolClient(stack, 'clientWithoutSecret1', {
                userPool: pool,
                generateSecret: false,
            });
            // THEN
            expect(() => clientWithoutSecret.userPoolClientSecret).toThrow(/userPoolClientSecret is available only if generateSecret is set to true./);
            // Make sure the generated template does not create resources
            expect(assertions_1.Template.fromStack(stack).findResources('Custom::DescribeCognitoUserPoolClient')).toEqual({});
            expect(assertions_1.Template.fromStack(stack).findResources('AWS::IAM::Policy')).toEqual({});
            expect(assertions_1.Template.fromStack(stack).findResources('AWS::IAM::Role')).toEqual({});
            expect(assertions_1.Template.fromStack(stack).findResources('AWS::Lambda::Function')).toEqual({});
        });
        test('lacking secret configuration implicitly disables it', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            // WHEN
            const clientWithoutSecret = new lib_1.UserPoolClient(stack, 'clientWithoutSecret2', {
                userPool: pool,
                generateSecret: undefined,
            });
            // THEN
            expect(() => clientWithoutSecret.userPoolClientSecret).toThrow(/userPoolClientSecret is available only if generateSecret is set to true./);
            // Make sure the generated template does not create resources
            expect(assertions_1.Template.fromStack(stack).findResources('Custom::DescribeCognitoUserPoolClient')).toEqual({});
            expect(assertions_1.Template.fromStack(stack).findResources('AWS::IAM::Policy')).toEqual({});
            expect(assertions_1.Template.fromStack(stack).findResources('AWS::IAM::Role')).toEqual({});
            expect(assertions_1.Template.fromStack(stack).findResources('AWS::Lambda::Function')).toEqual({});
        });
    });
    test('import', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const client = lib_1.UserPoolClient.fromUserPoolClientId(stack, 'Client', 'client-id-1');
        // THEN
        expect(client.userPoolClientId).toEqual('client-id-1');
    });
    test('ExplicitAuthFlows is absent by default', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        pool.addClient('Client');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            ExplicitAuthFlows: assertions_1.Match.absent(),
        });
    });
    test('ExplicitAuthFlows are correctly named', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        pool.addClient('Client', {
            authFlows: {
                adminUserPassword: true,
                custom: true,
                userPassword: true,
                userSrp: true,
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            ExplicitAuthFlows: [
                'ALLOW_USER_PASSWORD_AUTH',
                'ALLOW_ADMIN_USER_PASSWORD_AUTH',
                'ALLOW_CUSTOM_AUTH',
                'ALLOW_USER_SRP_AUTH',
                'ALLOW_REFRESH_TOKEN_AUTH',
            ],
        });
    });
    test('ExplicitAuthFlows makes only refreshToken true when all options are false', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        pool.addClient('Client', {
            authFlows: {
                adminUserPassword: false,
                custom: false,
                userPassword: false,
                userSrp: false,
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            ExplicitAuthFlows: [
                'ALLOW_REFRESH_TOKEN_AUTH',
            ],
        });
    });
    test('ExplicitAuthFlows is absent when authFlows is empty', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        pool.addClient('Client', {
            authFlows: {},
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            ExplicitAuthFlows: assertions_1.Match.absent(),
        });
    });
    test('ExplicitAuthFlows makes refreshToken true by default', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        pool.addClient('Client', {
            authFlows: {
                userSrp: true,
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            ExplicitAuthFlows: [
                'ALLOW_USER_SRP_AUTH',
                'ALLOW_REFRESH_TOKEN_AUTH',
            ],
        });
    });
    test('AllowedOAuthFlows are correctly named', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        pool.addClient('Client1', {
            oAuth: {
                flows: {
                    authorizationCodeGrant: true,
                    implicitCodeGrant: true,
                },
                scopes: [lib_1.OAuthScope.PHONE],
            },
        });
        pool.addClient('Client2', {
            oAuth: {
                flows: {
                    clientCredentials: true,
                },
                scopes: [lib_1.OAuthScope.PHONE],
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            AllowedOAuthFlows: ['implicit', 'code'],
            AllowedOAuthFlowsUserPoolClient: true,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            AllowedOAuthFlows: ['client_credentials'],
            AllowedOAuthFlowsUserPoolClient: true,
        });
    });
    test('callbackUrl defaults are correctly chosen', () => {
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        pool.addClient('Client1', {
            oAuth: {
                flows: {
                    clientCredentials: true,
                },
            },
        });
        pool.addClient('Client2', {
            oAuth: {
                flows: {
                    authorizationCodeGrant: true,
                },
            },
        });
        pool.addClient('Client3', {
            oAuth: {
                flows: {
                    implicitCodeGrant: true,
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            AllowedOAuthFlows: ['client_credentials'],
            CallbackURLs: assertions_1.Match.absent(),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            AllowedOAuthFlows: ['implicit'],
            CallbackURLs: ['https://example.com'],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            AllowedOAuthFlows: ['code'],
            CallbackURLs: ['https://example.com'],
        });
    });
    test('callbackUrls are not rendered if OAuth is disabled ', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        new lib_1.UserPoolClient(stack, 'PoolClient', {
            userPool: pool,
            disableOAuth: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            CallbackURLs: assertions_1.Match.absent(),
        });
    });
    test('fails when callbackUrls is empty for codeGrant or implicitGrant', () => {
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        expect(() => pool.addClient('Client1', {
            oAuth: {
                flows: { implicitCodeGrant: true },
                callbackUrls: [],
            },
        })).toThrow(/callbackUrl must not be empty/);
        expect(() => pool.addClient('Client3', {
            oAuth: {
                flows: { authorizationCodeGrant: true },
                callbackUrls: [],
            },
        })).toThrow(/callbackUrl must not be empty/);
        expect(() => pool.addClient('Client4', {
            oAuth: {
                flows: { clientCredentials: true },
                callbackUrls: [],
            },
        })).not.toThrow();
    });
    test('logoutUrls can be set', () => {
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        pool.addClient('Client', {
            oAuth: {
                logoutUrls: ['https://example.com'],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            LogoutURLs: ['https://example.com'],
        });
    });
    test('fails when clientCredentials OAuth flow is selected along with codeGrant or implicitGrant', () => {
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        expect(() => pool.addClient('Client1', {
            oAuth: {
                flows: {
                    authorizationCodeGrant: true,
                    clientCredentials: true,
                },
                scopes: [lib_1.OAuthScope.PHONE],
            },
        })).toThrow(/clientCredentials OAuth flow cannot be selected/);
        expect(() => pool.addClient('Client2', {
            oAuth: {
                flows: {
                    implicitCodeGrant: true,
                    clientCredentials: true,
                },
                scopes: [lib_1.OAuthScope.PHONE],
            },
        })).toThrow(/clientCredentials OAuth flow cannot be selected/);
    });
    test('OAuth scopes', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        pool.addClient('Client', {
            oAuth: {
                flows: { clientCredentials: true },
                scopes: [
                    lib_1.OAuthScope.PHONE,
                    lib_1.OAuthScope.EMAIL,
                    lib_1.OAuthScope.OPENID,
                    lib_1.OAuthScope.PROFILE,
                    lib_1.OAuthScope.COGNITO_ADMIN,
                    lib_1.OAuthScope.custom('my-resource-server/my-own-scope'),
                ],
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            AllowedOAuthScopes: [
                'phone',
                'email',
                'openid',
                'profile',
                'aws.cognito.signin.user.admin',
                'my-resource-server/my-own-scope',
            ],
        });
    });
    test('OAuth scopes - resource server', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        const scope = new lib_1.ResourceServerScope({ scopeName: 'scope-name', scopeDescription: 'scope-desc' });
        const resourceServer = pool.addResourceServer('ResourceServer', {
            identifier: 'resource-server',
            scopes: [scope],
        });
        // WHEN
        pool.addClient('Client', {
            oAuth: {
                flows: { clientCredentials: true },
                scopes: [
                    lib_1.OAuthScope.resourceServer(resourceServer, scope),
                ],
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            AllowedOAuthScopes: [
                {
                    'Fn::Join': [
                        '', [
                            stack.resolve(resourceServer.userPoolResourceServerId),
                            '/scope-name',
                        ],
                    ],
                },
            ],
        });
    });
    test('OAuthScope - openid is included when email or phone is specified', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        pool.addClient('Client1', {
            userPoolClientName: 'Client1',
            oAuth: {
                flows: { clientCredentials: true },
                scopes: [lib_1.OAuthScope.PHONE],
            },
        });
        pool.addClient('Client2', {
            userPoolClientName: 'Client2',
            oAuth: {
                flows: { clientCredentials: true },
                scopes: [lib_1.OAuthScope.EMAIL],
            },
        });
        pool.addClient('Client3', {
            userPoolClientName: 'Client3',
            oAuth: {
                flows: { clientCredentials: true },
                scopes: [lib_1.OAuthScope.PROFILE],
            },
        });
        pool.addClient('Client4', {
            userPoolClientName: 'Client4',
            oAuth: {
                flows: { clientCredentials: true },
                scopes: [lib_1.OAuthScope.COGNITO_ADMIN],
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            ClientName: 'Client1',
            AllowedOAuthScopes: ['phone', 'openid'],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            ClientName: 'Client2',
            AllowedOAuthScopes: ['email', 'openid'],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            ClientName: 'Client3',
            AllowedOAuthScopes: ['profile', 'openid'],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            ClientName: 'Client4',
            AllowedOAuthScopes: ['aws.cognito.signin.user.admin'],
        });
    });
    test('enable user existence errors prevention', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        new lib_1.UserPoolClient(stack, 'Client', {
            userPool: pool,
            preventUserExistenceErrors: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            UserPoolId: stack.resolve(pool.userPoolId),
            PreventUserExistenceErrors: 'ENABLED',
        });
    });
    test('disable user existence errors prevention', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        new lib_1.UserPoolClient(stack, 'Client', {
            userPool: pool,
            preventUserExistenceErrors: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            UserPoolId: stack.resolve(pool.userPoolId),
            PreventUserExistenceErrors: 'LEGACY',
        });
    });
    test('user existence errors prevention is absent by default', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        new lib_1.UserPoolClient(stack, 'Client', {
            userPool: pool,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            UserPoolId: stack.resolve(pool.userPoolId),
            PreventUserExistenceErrors: assertions_1.Match.absent(),
        });
    });
    test('default supportedIdentityProviders', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        const idp = lib_1.UserPoolIdentityProvider.fromProviderName(stack, 'imported', 'userpool-idp');
        pool.registerIdentityProvider(idp);
        // WHEN
        new lib_1.UserPoolClient(stack, 'Client', {
            userPool: pool,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            SupportedIdentityProviders: [
                'userpool-idp',
                'COGNITO',
            ],
        });
    });
    test('supportedIdentityProviders', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        pool.addClient('AllEnabled', {
            userPoolClientName: 'AllEnabled',
            supportedIdentityProviders: [
                lib_1.UserPoolClientIdentityProvider.COGNITO,
                lib_1.UserPoolClientIdentityProvider.FACEBOOK,
                lib_1.UserPoolClientIdentityProvider.AMAZON,
                lib_1.UserPoolClientIdentityProvider.GOOGLE,
                lib_1.UserPoolClientIdentityProvider.APPLE,
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            ClientName: 'AllEnabled',
            SupportedIdentityProviders: ['COGNITO', 'Facebook', 'LoginWithAmazon', 'Google', 'SignInWithApple'],
        });
    });
    test('disableOAuth', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        pool.addClient('OAuthDisabled', {
            userPoolClientName: 'OAuthDisabled',
            disableOAuth: true,
        });
        pool.addClient('OAuthEnabled', {
            userPoolClientName: 'OAuthEnabled',
            disableOAuth: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            ClientName: 'OAuthDisabled',
            AllowedOAuthFlows: assertions_1.Match.absent(),
            AllowedOAuthScopes: assertions_1.Match.absent(),
            AllowedOAuthFlowsUserPoolClient: false,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            ClientName: 'OAuthEnabled',
            AllowedOAuthFlows: ['implicit', 'code'],
            AllowedOAuthScopes: ['profile', 'phone', 'email', 'openid', 'aws.cognito.signin.user.admin'],
            AllowedOAuthFlowsUserPoolClient: true,
        });
    });
    test('fails when oAuth is specified but is disableOAuth is set', () => {
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        expect(() => pool.addClient('Client', {
            disableOAuth: true,
            oAuth: {
                flows: {
                    authorizationCodeGrant: true,
                },
            },
        })).toThrow(/disableOAuth is set/);
    });
    test('EnableTokenRevocation is absent by default', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        pool.addClient('Client');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            EnableTokenRevocation: assertions_1.Match.absent(),
        });
    });
    test('enableTokenRevocation in addClient', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        pool.addClient('Client', {
            enableTokenRevocation: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            EnableTokenRevocation: true,
        });
    });
    test('enableTokenRevocation in UserPoolClient', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const pool = new lib_1.UserPool(stack, 'Pool');
        // WHEN
        new lib_1.UserPoolClient(stack, 'Client1', {
            userPool: pool,
            enableTokenRevocation: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            EnableTokenRevocation: true,
        });
    });
    describe('auth session validity', () => {
        test('default', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            // WHEN
            pool.addClient('Client1', {
                userPoolClientName: 'Client1',
                authSessionValidity: core_1.Duration.minutes(3),
            });
            pool.addClient('Client2', {
                userPoolClientName: 'Client2',
                authSessionValidity: core_1.Duration.minutes(9),
            });
            pool.addClient('Client3', {
                userPoolClientName: 'Client3',
                authSessionValidity: core_1.Duration.minutes(15),
            });
            pool.addClient('Client5', {
                userPoolClientName: 'Client4',
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
                ClientName: 'Client1',
                AuthSessionValidity: 3,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
                ClientName: 'Client2',
                AuthSessionValidity: 9,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
                ClientName: 'Client3',
                AuthSessionValidity: 15,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
                ClientName: 'Client4',
            });
        });
        test.each([
            core_1.Duration.minutes(0),
            core_1.Duration.minutes(1),
            core_1.Duration.minutes(3).minus(core_1.Duration.minutes(1)),
            core_1.Duration.minutes(15).plus(core_1.Duration.minutes(1)),
            core_1.Duration.minutes(100),
        ])('validates authSessionValidity is a duration between 3 and 15 minutes', (validity) => {
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            expect(() => {
                pool.addClient('Client1', {
                    userPoolClientName: 'Client1',
                    authSessionValidity: validity,
                });
            }).toThrow(`authSessionValidity: Must be a duration between 3 minutes and 15 minutes (inclusive); received ${validity.toHumanString()}.`);
        });
        test.each([
            core_1.Duration.minutes(3),
            core_1.Duration.minutes(9),
            core_1.Duration.minutes(15),
        ])('validates authSessionValidity is a duration between 3 and 15 minutes (valid)', (validity) => {
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            // WHEN
            pool.addClient('Client1', {
                userPoolClientName: 'Client1',
                authSessionValidity: validity,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
                ClientName: 'Client1',
                AuthSessionValidity: validity.toMinutes(),
            });
        });
    });
    describe('token validity', () => {
        test('default', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            // WHEN
            pool.addClient('Client1', {
                userPoolClientName: 'Client1',
                accessTokenValidity: core_1.Duration.minutes(60),
                idTokenValidity: core_1.Duration.minutes(60),
                refreshTokenValidity: core_1.Duration.days(30),
            });
            pool.addClient('Client2', {
                userPoolClientName: 'Client2',
                accessTokenValidity: core_1.Duration.minutes(60),
            });
            pool.addClient('Client3', {
                userPoolClientName: 'Client3',
                idTokenValidity: core_1.Duration.minutes(60),
            });
            pool.addClient('Client4', {
                userPoolClientName: 'Client4',
                refreshTokenValidity: core_1.Duration.days(30),
            });
            pool.addClient('Client5', {
                userPoolClientName: 'Client5',
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
                ClientName: 'Client1',
                AccessTokenValidity: 60,
                IdTokenValidity: 60,
                RefreshTokenValidity: 43200,
                TokenValidityUnits: {
                    AccessToken: 'minutes',
                    IdToken: 'minutes',
                    RefreshToken: 'minutes',
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
                ClientName: 'Client2',
                AccessTokenValidity: 60,
                IdTokenValidity: assertions_1.Match.absent(),
                RefreshTokenValidity: assertions_1.Match.absent(),
                TokenValidityUnits: {
                    AccessToken: 'minutes',
                    IdToken: assertions_1.Match.absent(),
                    RefreshToken: assertions_1.Match.absent(),
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
                ClientName: 'Client3',
                AccessTokenValidity: assertions_1.Match.absent(),
                IdTokenValidity: 60,
                RefreshTokenValidity: assertions_1.Match.absent(),
                TokenValidityUnits: {
                    AccessToken: assertions_1.Match.absent(),
                    IdToken: 'minutes',
                    RefreshToken: assertions_1.Match.absent(),
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
                ClientName: 'Client4',
                AccessTokenValidity: assertions_1.Match.absent(),
                IdTokenValidity: assertions_1.Match.absent(),
                RefreshTokenValidity: 43200,
                TokenValidityUnits: {
                    AccessToken: assertions_1.Match.absent(),
                    IdToken: assertions_1.Match.absent(),
                    RefreshToken: 'minutes',
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
                ClientName: 'Client5',
                TokenValidityUnits: assertions_1.Match.absent(),
                IdTokenValidity: assertions_1.Match.absent(),
                RefreshTokenValidity: assertions_1.Match.absent(),
                AccessTokenValidity: assertions_1.Match.absent(),
            });
        });
        test.each([
            core_1.Duration.minutes(0),
            core_1.Duration.minutes(4),
            core_1.Duration.days(1).plus(core_1.Duration.minutes(1)),
            core_1.Duration.days(2),
        ])('validates accessTokenValidity is a duration between 5 minutes and 1 day', (validity) => {
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            expect(() => {
                pool.addClient('Client1', {
                    userPoolClientName: 'Client1',
                    accessTokenValidity: validity,
                });
            }).toThrow(`accessTokenValidity: Must be a duration between 5 minutes and 1 day (inclusive); received ${validity.toHumanString()}.`);
        });
        test.each([
            core_1.Duration.minutes(0),
            core_1.Duration.minutes(4),
            core_1.Duration.days(1).plus(core_1.Duration.minutes(1)),
            core_1.Duration.days(2),
        ])('validates idTokenValidity is a duration between 5 minutes and 1 day', (validity) => {
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            expect(() => {
                pool.addClient('Client1', {
                    userPoolClientName: 'Client1',
                    idTokenValidity: validity,
                });
            }).toThrow(`idTokenValidity: Must be a duration between 5 minutes and 1 day (inclusive); received ${validity.toHumanString()}.`);
        });
        test.each([
            core_1.Duration.hours(1).plus(core_1.Duration.minutes(1)),
            core_1.Duration.hours(12),
            core_1.Duration.days(1),
        ])('validates accessTokenValidity is not greater than refresh token expiration', (validity) => {
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            expect(() => {
                pool.addClient('Client1', {
                    userPoolClientName: 'Client1',
                    accessTokenValidity: validity,
                    refreshTokenValidity: core_1.Duration.hours(1),
                });
            }).toThrow(`accessTokenValidity: Must be a duration between 5 minutes and 1 hour (inclusive); received ${validity.toHumanString()}.`);
        });
        test.each([
            core_1.Duration.hours(1).plus(core_1.Duration.minutes(1)),
            core_1.Duration.hours(12),
            core_1.Duration.days(1),
        ])('validates idTokenValidity is not greater than refresh token expiration', (validity) => {
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            expect(() => {
                pool.addClient('Client1', {
                    userPoolClientName: 'Client1',
                    idTokenValidity: validity,
                    refreshTokenValidity: core_1.Duration.hours(1),
                });
            }).toThrow(`idTokenValidity: Must be a duration between 5 minutes and 1 hour (inclusive); received ${validity.toHumanString()}.`);
        });
        test.each([
            core_1.Duration.minutes(0),
            core_1.Duration.minutes(59),
            core_1.Duration.days(10 * 365).plus(core_1.Duration.minutes(1)),
            core_1.Duration.days(10 * 365 + 1),
        ])('validates refreshTokenValidity is a duration between 1 hour and 10 years', (validity) => {
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            expect(() => {
                pool.addClient('Client1', {
                    userPoolClientName: 'Client1',
                    refreshTokenValidity: validity,
                });
            }).toThrow(`refreshTokenValidity: Must be a duration between 1 hour and 3650 days (inclusive); received ${validity.toHumanString()}.`);
        });
        test.each([
            core_1.Duration.minutes(5),
            core_1.Duration.minutes(60),
            core_1.Duration.days(1),
        ])('validates accessTokenValidity is a duration between 5 minutes and 1 day (valid)', (validity) => {
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            // WHEN
            pool.addClient('Client1', {
                userPoolClientName: 'Client1',
                accessTokenValidity: validity,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
                ClientName: 'Client1',
                AccessTokenValidity: validity.toMinutes(),
                TokenValidityUnits: {
                    AccessToken: 'minutes',
                },
            });
        });
        test.each([
            core_1.Duration.minutes(5),
            core_1.Duration.minutes(60),
            core_1.Duration.days(1),
        ])('validates idTokenValidity is a duration between 5 minutes and 1 day (valid)', (validity) => {
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            // WHEN
            pool.addClient('Client1', {
                userPoolClientName: 'Client1',
                idTokenValidity: validity,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
                ClientName: 'Client1',
                IdTokenValidity: validity.toMinutes(),
                TokenValidityUnits: {
                    IdToken: 'minutes',
                },
            });
        });
        test.each([
            core_1.Duration.minutes(60),
            core_1.Duration.minutes(120),
            core_1.Duration.days(365),
            core_1.Duration.days(10 * 365),
        ])('validates refreshTokenValidity is a duration between 1 hour and 10 years (valid)', (validity) => {
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            // WHEN
            pool.addClient('Client1', {
                userPoolClientName: 'Client1',
                refreshTokenValidity: validity,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
                ClientName: 'Client1',
                RefreshTokenValidity: validity.toMinutes(),
                TokenValidityUnits: {
                    RefreshToken: 'minutes',
                },
            });
        });
        test.each([
            core_1.Duration.minutes(5),
            core_1.Duration.minutes(60),
            core_1.Duration.hours(1),
        ])('validates accessTokenValidity is not greater than refresh token expiration (valid)', (validity) => {
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            // WHEN
            pool.addClient('Client1', {
                userPoolClientName: 'Client1',
                accessTokenValidity: validity,
                refreshTokenValidity: core_1.Duration.hours(1),
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
                ClientName: 'Client1',
                AccessTokenValidity: validity.toMinutes(),
                TokenValidityUnits: {
                    AccessToken: 'minutes',
                },
            });
        });
        test.each([
            core_1.Duration.minutes(5),
            core_1.Duration.minutes(60),
            core_1.Duration.hours(1),
        ])('validates idTokenValidity is not greater than refresh token expiration (valid)', (validity) => {
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            // WHEN
            pool.addClient('Client1', {
                userPoolClientName: 'Client1',
                idTokenValidity: validity,
                refreshTokenValidity: core_1.Duration.hours(1),
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
                ClientName: 'Client1',
                IdTokenValidity: validity.toMinutes(),
                TokenValidityUnits: {
                    IdToken: 'minutes',
                },
            });
        });
    });
    describe('read and write attributes', () => {
        test('undefined by default', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            // WHEN
            pool.addClient('Client', {});
            // EXPECT
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
                ReadAttributes: assertions_1.Match.absent(),
                WriteAttributes: assertions_1.Match.absent(),
            });
        });
        test('set attributes', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const pool = new lib_1.UserPool(stack, 'Pool');
            const writeAttributes = (new lib_1.ClientAttributes()).withCustomAttributes('my_first').withStandardAttributes({ givenName: true, familyName: true });
            const readAttributes = (new lib_1.ClientAttributes()).withStandardAttributes({
                address: true,
                birthdate: true,
                email: true,
                emailVerified: true,
                familyName: true,
                fullname: true,
                gender: true,
                givenName: true,
                lastUpdateTime: true,
                locale: true,
                middleName: true,
                nickname: true,
                phoneNumber: true,
                phoneNumberVerified: true,
                preferredUsername: true,
                profilePage: true,
                profilePicture: true,
                timezone: true,
                website: true,
            });
            // WHEN
            pool.addClient('Client', {
                readAttributes,
                writeAttributes,
            });
            // EXPECT
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
                ReadAttributes: assertions_1.Match.arrayWith(['address', 'birthdate', 'email', 'email_verified', 'family_name', 'gender',
                    'given_name', 'locale', 'middle_name', 'name', 'nickname', 'phone_number', 'phone_number_verified', 'picture',
                    'preferred_username', 'profile', 'updated_at', 'website', 'zoneinfo']),
                WriteAttributes: assertions_1.Match.arrayWith(['custom:my_first', 'family_name', 'given_name']),
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wb29sLWNsaWVudC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci1wb29sLWNsaWVudC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELHdDQUFnRDtBQUNoRCxnQ0FBK0o7QUFFL0osUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUNoQyxJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtRQUN6QixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFekMsT0FBTztRQUNQLElBQUksb0JBQWMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQ2xDLFFBQVEsRUFBRSxJQUFJO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDhCQUE4QixFQUFFO1lBQzlFLFVBQVUsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDMUMsaUJBQWlCLEVBQUUsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDO1lBQ3ZDLGtCQUFrQixFQUFFLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLCtCQUErQixDQUFDO1lBQzVGLFlBQVksRUFBRSxDQUFDLHFCQUFxQixDQUFDO1lBQ3JDLDBCQUEwQixFQUFFLENBQUMsU0FBUyxDQUFDO1NBQ3hDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7UUFDdkIsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFB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QUFDLFFBQVEsRUFBRTtnQkFDdkIsY0FBYztnQkFDZCxlQUFlO2FBQ2hCLENBQUMsQ0FBQztZQUVILFNBQVM7WUFDVCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw4QkFBOEIsRUFBRTtnQkFDOUUsY0FBYyxFQUFFLGtCQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsYUFBYSxFQUFFLFFBQVE7b0JBQ3pHLFlBQVksRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLHVCQUF1QixFQUFFLFNBQVM7b0JBQzdHLG9CQUFvQixFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUN4RSxlQUFlLEVBQUUsa0JBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUM7YUFDbkYsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBTdGFjaywgRHVyYXRpb24gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IE9BdXRoU2NvcGUsIFJlc291cmNlU2VydmVyU2NvcGUsIFVzZXJQb29sLCBVc2VyUG9vbENsaWVudCwgVXNlclBvb2xDbGllbnRJZGVudGl0eVByb3ZpZGVyLCBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXIsIENsaWVudEF0dHJpYnV0ZXMgfSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnVXNlciBQb29sIENsaWVudCcsICgpID0+IHtcbiAgdGVzdCgnZGVmYXVsdCBzZXR1cCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgVXNlclBvb2xDbGllbnQoc3RhY2ssICdDbGllbnQnLCB7XG4gICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudCcsIHtcbiAgICAgIFVzZXJQb29sSWQ6IHN0YWNrLnJlc29sdmUocG9vbC51c2VyUG9vbElkKSxcbiAgICAgIEFsbG93ZWRPQXV0aEZsb3dzOiBbJ2ltcGxpY2l0JywgJ2NvZGUnXSxcbiAgICAgIEFsbG93ZWRPQXV0aFNjb3BlczogWydwcm9maWxlJywgJ3Bob25lJywgJ2VtYWlsJywgJ29wZW5pZCcsICdhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiddLFxuICAgICAgQ2FsbGJhY2tVUkxzOiBbJ2h0dHBzOi8vZXhhbXBsZS5jb20nXSxcbiAgICAgIFN1cHBvcnRlZElkZW50aXR5UHJvdmlkZXJzOiBbJ0NPR05JVE8nXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2xpZW50IG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgY2xpZW50MSA9IG5ldyBVc2VyUG9vbENsaWVudChzdGFjaywgJ0NsaWVudDEnLCB7XG4gICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICAgIHVzZXJQb29sQ2xpZW50TmFtZTogJ215Y2xpZW50JyxcbiAgICB9KTtcbiAgICBjb25zdCBjbGllbnQyID0gbmV3IFVzZXJQb29sQ2xpZW50KHN0YWNrLCAnQ2xpZW50MicsIHtcbiAgICAgIHVzZXJQb29sOiBwb29sLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChjbGllbnQxLnVzZXJQb29sQ2xpZW50TmFtZSkudG9FcXVhbCgnbXljbGllbnQnKTtcbiAgICBleHBlY3QoKCkgPT4gY2xpZW50Mi51c2VyUG9vbENsaWVudE5hbWUpLnRvVGhyb3coL2F2YWlsYWJsZSBvbmx5IGlmIHNwZWNpZmllZCBvbiB0aGUgVXNlclBvb2xDbGllbnQgZHVyaW5nIGluaXRpYWxpemF0aW9uLyk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdDbGllbnQgd2l0aCBzZWNyZXQnLCAoKSA9PiB7XG5cbiAgICB0ZXN0KCdnZW5lcmF0ZSBzZWNyZXQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGNsaWVudFdpdGhTZWNyZXQgPSBuZXcgVXNlclBvb2xDbGllbnQoc3RhY2ssICdjbGllbnRXaXRoU2VjcmV0Jywge1xuICAgICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICAgICAgZ2VuZXJhdGVTZWNyZXQ6IHRydWUsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGNsaWVudFdpdGhTZWNyZXQudXNlclBvb2xDbGllbnRTZWNyZXQpLnRvQmVEZWZpbmVkKCk7XG5cbiAgICAgIC8vIE1ha2Ugc3VyZSBnZXR0ZXIgcmV0dXJucyB0aGUgc2FtZSBzZWNyZXQgcmVnYXJkbGVzcyBpZiBpdCdzIGNhbGxlZCBvbmUgb3IgbWFueSB0aW1lc1xuICAgICAgZXhwZWN0KGNsaWVudFdpdGhTZWNyZXQudXNlclBvb2xDbGllbnRTZWNyZXQpLnRvRXF1YWwoY2xpZW50V2l0aFNlY3JldC51c2VyUG9vbENsaWVudFNlY3JldCk7XG5cbiAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgZ2VuZXJhdGVkIHRlbXBsYXRlIGhhcyBjb3JyZWN0IHJlc291cmNlc1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6RGVzY3JpYmVDb2duaXRvVXNlclBvb2xDbGllbnQnLCB7XG4gICAgICAgIFNlcnZpY2VUb2tlbjoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ0FXUzY3OWY1M2ZhYzAwMjQzMGNiMGRhNWI3OTgyYmQyMjg3MkQxNjRDNEMnLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgQ3JlYXRlOiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICd7XCJyZWdpb25cIjpcIicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdcIixcInNlcnZpY2VcIjpcIkNvZ25pdG9JZGVudGl0eVNlcnZpY2VQcm92aWRlclwiLFwiYWN0aW9uXCI6XCJkZXNjcmliZVVzZXJQb29sQ2xpZW50XCIsXCJwYXJhbWV0ZXJzXCI6e1wiVXNlclBvb2xJZFwiOlwiJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ1Bvb2xEM0Y1ODhCOCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdcIixcIkNsaWVudElkXCI6XCInLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnY2xpZW50V2l0aFNlY3JldEQyNTAzMUE4JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ1wifSxcInBoeXNpY2FsUmVzb3VyY2VJZFwiOntcImlkXCI6XCInLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnY2xpZW50V2l0aFNlY3JldEQyNTAzMUE4JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ1wifX0nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBVcGRhdGU6IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgJ3tcInJlZ2lvblwiOlwiJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ1wiLFwic2VydmljZVwiOlwiQ29nbml0b0lkZW50aXR5U2VydmljZVByb3ZpZGVyXCIsXCJhY3Rpb25cIjpcImRlc2NyaWJlVXNlclBvb2xDbGllbnRcIixcInBhcmFtZXRlcnNcIjp7XCJVc2VyUG9vbElkXCI6XCInLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnUG9vbEQzRjU4OEI4JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ1wiLFwiQ2xpZW50SWRcIjpcIicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdjbGllbnRXaXRoU2VjcmV0RDI1MDMxQTgnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnXCJ9LFwicGh5c2ljYWxSZXNvdXJjZUlkXCI6e1wiaWRcIjpcIicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdjbGllbnRXaXRoU2VjcmV0RDI1MDMxQTgnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnXCJ9fScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIEluc3RhbGxMYXRlc3RBd3NTZGs6IGZhbHNlLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFN0YXRlbWVudDogW3tcbiAgICAgICAgICAgIEFjdGlvbjogJ2NvZ25pdG8taWRwOkRlc2NyaWJlVXNlclBvb2xDbGllbnQnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ1Bvb2xEM0Y1ODhCOCcsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1dLFxuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgICAgUG9saWN5TmFtZTogJ2NsaWVudFdpdGhTZWNyZXREZXNjcmliZUNvZ25pdG9Vc2VyUG9vbENsaWVudEN1c3RvbVJlc291cmNlUG9saWN5Q0RFNEFCMDAnLFxuICAgICAgICBSb2xlczogW3sgUmVmOiAnQVdTNjc5ZjUzZmFjMDAyNDMwY2IwZGE1Yjc5ODJiZDIyODdTZXJ2aWNlUm9sZUMxRUEwRkYyJyB9XSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFN0YXRlbWVudDogW3tcbiAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICBTZXJ2aWNlOiAnbGFtYmRhLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIH0sXG4gICAgICAgIE1hbmFnZWRQb2xpY3lBcm5zOiBbe1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICc6aWFtOjphd3M6cG9saWN5L3NlcnZpY2Utcm9sZS9BV1NMYW1iZGFCYXNpY0V4ZWN1dGlvblJvbGUnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgICAgICBSb2xlOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnQVdTNjc5ZjUzZmFjMDAyNDMwY2IwZGE1Yjc5ODJiZDIyODdTZXJ2aWNlUm9sZUMxRUEwRkYyJyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIEhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgICAgVGltZW91dDogMTIwLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdleHBsaWNpdGx5IGRpc2FibGUgc2VjcmV0IGdlbmVyYXRpb24nLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGNsaWVudFdpdGhvdXRTZWNyZXQgPSBuZXcgVXNlclBvb2xDbGllbnQoc3RhY2ssICdjbGllbnRXaXRob3V0U2VjcmV0MScsIHtcbiAgICAgICAgdXNlclBvb2w6IHBvb2wsXG4gICAgICAgIGdlbmVyYXRlU2VjcmV0OiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4gY2xpZW50V2l0aG91dFNlY3JldC51c2VyUG9vbENsaWVudFNlY3JldCkudG9UaHJvdygvdXNlclBvb2xDbGllbnRTZWNyZXQgaXMgYXZhaWxhYmxlIG9ubHkgaWYgZ2VuZXJhdGVTZWNyZXQgaXMgc2V0IHRvIHRydWUuLyk7XG5cbiAgICAgIC8vIE1ha2Ugc3VyZSB0aGUgZ2VuZXJhdGVkIHRlbXBsYXRlIGRvZXMgbm90IGNyZWF0ZSByZXNvdXJjZXNcbiAgICAgIGV4cGVjdChUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmZpbmRSZXNvdXJjZXMoJ0N1c3RvbTo6RGVzY3JpYmVDb2duaXRvVXNlclBvb2xDbGllbnQnKSkudG9FcXVhbCh7fSk7XG4gICAgICBleHBlY3QoVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5maW5kUmVzb3VyY2VzKCdBV1M6OklBTTo6UG9saWN5JykpLnRvRXF1YWwoe30pO1xuICAgICAgZXhwZWN0KFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuZmluZFJlc291cmNlcygnQVdTOjpJQU06OlJvbGUnKSkudG9FcXVhbCh7fSk7XG4gICAgICBleHBlY3QoVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5maW5kUmVzb3VyY2VzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nKSkudG9FcXVhbCh7fSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdsYWNraW5nIHNlY3JldCBjb25maWd1cmF0aW9uIGltcGxpY2l0bHkgZGlzYWJsZXMgaXQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGNsaWVudFdpdGhvdXRTZWNyZXQgPSBuZXcgVXNlclBvb2xDbGllbnQoc3RhY2ssICdjbGllbnRXaXRob3V0U2VjcmV0MicsIHtcbiAgICAgICAgdXNlclBvb2w6IHBvb2wsXG4gICAgICAgIGdlbmVyYXRlU2VjcmV0OiB1bmRlZmluZWQsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IGNsaWVudFdpdGhvdXRTZWNyZXQudXNlclBvb2xDbGllbnRTZWNyZXQpLnRvVGhyb3coL3VzZXJQb29sQ2xpZW50U2VjcmV0IGlzIGF2YWlsYWJsZSBvbmx5IGlmIGdlbmVyYXRlU2VjcmV0IGlzIHNldCB0byB0cnVlLi8pO1xuXG4gICAgICAvLyBNYWtlIHN1cmUgdGhlIGdlbmVyYXRlZCB0ZW1wbGF0ZSBkb2VzIG5vdCBjcmVhdGUgcmVzb3VyY2VzXG4gICAgICBleHBlY3QoVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5maW5kUmVzb3VyY2VzKCdDdXN0b206OkRlc2NyaWJlQ29nbml0b1VzZXJQb29sQ2xpZW50JykpLnRvRXF1YWwoe30pO1xuICAgICAgZXhwZWN0KFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuZmluZFJlc291cmNlcygnQVdTOjpJQU06OlBvbGljeScpKS50b0VxdWFsKHt9KTtcbiAgICAgIGV4cGVjdChUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmZpbmRSZXNvdXJjZXMoJ0FXUzo6SUFNOjpSb2xlJykpLnRvRXF1YWwoe30pO1xuICAgICAgZXhwZWN0KFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuZmluZFJlc291cmNlcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJykpLnRvRXF1YWwoe30pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpbXBvcnQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGNsaWVudCA9IFVzZXJQb29sQ2xpZW50LmZyb21Vc2VyUG9vbENsaWVudElkKHN0YWNrLCAnQ2xpZW50JywgJ2NsaWVudC1pZC0xJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGNsaWVudC51c2VyUG9vbENsaWVudElkKS50b0VxdWFsKCdjbGllbnQtaWQtMScpO1xuICB9KTtcblxuICB0ZXN0KCdFeHBsaWNpdEF1dGhGbG93cyBpcyBhYnNlbnQgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnKTtcblxuICAgIC8vIFdIRU5cbiAgICBwb29sLmFkZENsaWVudCgnQ2xpZW50Jyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xDbGllbnQnLCB7XG4gICAgICBFeHBsaWNpdEF1dGhGbG93czogTWF0Y2guYWJzZW50KCksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0V4cGxpY2l0QXV0aEZsb3dzIGFyZSBjb3JyZWN0bHkgbmFtZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgcG9vbC5hZGRDbGllbnQoJ0NsaWVudCcsIHtcbiAgICAgIGF1dGhGbG93czoge1xuICAgICAgICBhZG1pblVzZXJQYXNzd29yZDogdHJ1ZSxcbiAgICAgICAgY3VzdG9tOiB0cnVlLFxuICAgICAgICB1c2VyUGFzc3dvcmQ6IHRydWUsXG4gICAgICAgIHVzZXJTcnA6IHRydWUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xDbGllbnQnLCB7XG4gICAgICBFeHBsaWNpdEF1dGhGbG93czogW1xuICAgICAgICAnQUxMT1dfVVNFUl9QQVNTV09SRF9BVVRIJyxcbiAgICAgICAgJ0FMTE9XX0FETUlOX1VTRVJfUEFTU1dPUkRfQVVUSCcsXG4gICAgICAgICdBTExPV19DVVNUT01fQVVUSCcsXG4gICAgICAgICdBTExPV19VU0VSX1NSUF9BVVRIJyxcbiAgICAgICAgJ0FMTE9XX1JFRlJFU0hfVE9LRU5fQVVUSCcsXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdFeHBsaWNpdEF1dGhGbG93cyBtYWtlcyBvbmx5IHJlZnJlc2hUb2tlbiB0cnVlIHdoZW4gYWxsIG9wdGlvbnMgYXJlIGZhbHNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIHBvb2wuYWRkQ2xpZW50KCdDbGllbnQnLCB7XG4gICAgICBhdXRoRmxvd3M6IHtcbiAgICAgICAgYWRtaW5Vc2VyUGFzc3dvcmQ6IGZhbHNlLFxuICAgICAgICBjdXN0b206IGZhbHNlLFxuICAgICAgICB1c2VyUGFzc3dvcmQ6IGZhbHNlLFxuICAgICAgICB1c2VyU3JwOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudCcsIHtcbiAgICAgIEV4cGxpY2l0QXV0aEZsb3dzOiBbXG4gICAgICAgICdBTExPV19SRUZSRVNIX1RPS0VOX0FVVEgnLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnRXhwbGljaXRBdXRoRmxvd3MgaXMgYWJzZW50IHdoZW4gYXV0aEZsb3dzIGlzIGVtcHR5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIHBvb2wuYWRkQ2xpZW50KCdDbGllbnQnLCB7XG4gICAgICBhdXRoRmxvd3M6IHt9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xDbGllbnQnLCB7XG4gICAgICBFeHBsaWNpdEF1dGhGbG93czogTWF0Y2guYWJzZW50KCksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0V4cGxpY2l0QXV0aEZsb3dzIG1ha2VzIHJlZnJlc2hUb2tlbiB0cnVlIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgcG9vbC5hZGRDbGllbnQoJ0NsaWVudCcsIHtcbiAgICAgIGF1dGhGbG93czoge1xuICAgICAgICB1c2VyU3JwOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sQ2xpZW50Jywge1xuICAgICAgRXhwbGljaXRBdXRoRmxvd3M6IFtcbiAgICAgICAgJ0FMTE9XX1VTRVJfU1JQX0FVVEgnLFxuICAgICAgICAnQUxMT1dfUkVGUkVTSF9UT0tFTl9BVVRIJyxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0FsbG93ZWRPQXV0aEZsb3dzIGFyZSBjb3JyZWN0bHkgbmFtZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgcG9vbC5hZGRDbGllbnQoJ0NsaWVudDEnLCB7XG4gICAgICBvQXV0aDoge1xuICAgICAgICBmbG93czoge1xuICAgICAgICAgIGF1dGhvcml6YXRpb25Db2RlR3JhbnQ6IHRydWUsXG4gICAgICAgICAgaW1wbGljaXRDb2RlR3JhbnQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIHNjb3BlczogW09BdXRoU2NvcGUuUEhPTkVdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBwb29sLmFkZENsaWVudCgnQ2xpZW50MicsIHtcbiAgICAgIG9BdXRoOiB7XG4gICAgICAgIGZsb3dzOiB7XG4gICAgICAgICAgY2xpZW50Q3JlZGVudGlhbHM6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIHNjb3BlczogW09BdXRoU2NvcGUuUEhPTkVdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudCcsIHtcbiAgICAgIEFsbG93ZWRPQXV0aEZsb3dzOiBbJ2ltcGxpY2l0JywgJ2NvZGUnXSxcbiAgICAgIEFsbG93ZWRPQXV0aEZsb3dzVXNlclBvb2xDbGllbnQ6IHRydWUsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudCcsIHtcbiAgICAgIEFsbG93ZWRPQXV0aEZsb3dzOiBbJ2NsaWVudF9jcmVkZW50aWFscyddLFxuICAgICAgQWxsb3dlZE9BdXRoRmxvd3NVc2VyUG9vbENsaWVudDogdHJ1ZSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FsbGJhY2tVcmwgZGVmYXVsdHMgYXJlIGNvcnJlY3RseSBjaG9zZW4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuXG4gICAgcG9vbC5hZGRDbGllbnQoJ0NsaWVudDEnLCB7XG4gICAgICBvQXV0aDoge1xuICAgICAgICBmbG93czoge1xuICAgICAgICAgIGNsaWVudENyZWRlbnRpYWxzOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHBvb2wuYWRkQ2xpZW50KCdDbGllbnQyJywge1xuICAgICAgb0F1dGg6IHtcbiAgICAgICAgZmxvd3M6IHtcbiAgICAgICAgICBhdXRob3JpemF0aW9uQ29kZUdyYW50OiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHBvb2wuYWRkQ2xpZW50KCdDbGllbnQzJywge1xuICAgICAgb0F1dGg6IHtcbiAgICAgICAgZmxvd3M6IHtcbiAgICAgICAgICBpbXBsaWNpdENvZGVHcmFudDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudCcsIHtcbiAgICAgIEFsbG93ZWRPQXV0aEZsb3dzOiBbJ2NsaWVudF9jcmVkZW50aWFscyddLFxuICAgICAgQ2FsbGJhY2tVUkxzOiBNYXRjaC5hYnNlbnQoKSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sQ2xpZW50Jywge1xuICAgICAgQWxsb3dlZE9BdXRoRmxvd3M6IFsnaW1wbGljaXQnXSxcbiAgICAgIENhbGxiYWNrVVJMczogWydodHRwczovL2V4YW1wbGUuY29tJ10sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudCcsIHtcbiAgICAgIEFsbG93ZWRPQXV0aEZsb3dzOiBbJ2NvZGUnXSxcbiAgICAgIENhbGxiYWNrVVJMczogWydodHRwczovL2V4YW1wbGUuY29tJ10sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbGxiYWNrVXJscyBhcmUgbm90IHJlbmRlcmVkIGlmIE9BdXRoIGlzIGRpc2FibGVkICcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgVXNlclBvb2xDbGllbnQoc3RhY2ssICdQb29sQ2xpZW50Jywge1xuICAgICAgdXNlclBvb2w6IHBvb2wsXG4gICAgICBkaXNhYmxlT0F1dGg6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xDbGllbnQnLCB7XG4gICAgICBDYWxsYmFja1VSTHM6IE1hdGNoLmFic2VudCgpLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyB3aGVuIGNhbGxiYWNrVXJscyBpcyBlbXB0eSBmb3IgY29kZUdyYW50IG9yIGltcGxpY2l0R3JhbnQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuXG4gICAgZXhwZWN0KCgpID0+IHBvb2wuYWRkQ2xpZW50KCdDbGllbnQxJywge1xuICAgICAgb0F1dGg6IHtcbiAgICAgICAgZmxvd3M6IHsgaW1wbGljaXRDb2RlR3JhbnQ6IHRydWUgfSxcbiAgICAgICAgY2FsbGJhY2tVcmxzOiBbXSxcbiAgICAgIH0sXG4gICAgfSkpLnRvVGhyb3coL2NhbGxiYWNrVXJsIG11c3Qgbm90IGJlIGVtcHR5Lyk7XG5cbiAgICBleHBlY3QoKCkgPT4gcG9vbC5hZGRDbGllbnQoJ0NsaWVudDMnLCB7XG4gICAgICBvQXV0aDoge1xuICAgICAgICBmbG93czogeyBhdXRob3JpemF0aW9uQ29kZUdyYW50OiB0cnVlIH0sXG4gICAgICAgIGNhbGxiYWNrVXJsczogW10sXG4gICAgICB9LFxuICAgIH0pKS50b1Rocm93KC9jYWxsYmFja1VybCBtdXN0IG5vdCBiZSBlbXB0eS8pO1xuXG4gICAgZXhwZWN0KCgpID0+IHBvb2wuYWRkQ2xpZW50KCdDbGllbnQ0Jywge1xuICAgICAgb0F1dGg6IHtcbiAgICAgICAgZmxvd3M6IHsgY2xpZW50Q3JlZGVudGlhbHM6IHRydWUgfSxcbiAgICAgICAgY2FsbGJhY2tVcmxzOiBbXSxcbiAgICAgIH0sXG4gICAgfSkpLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2xvZ291dFVybHMgY2FuIGJlIHNldCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG5cbiAgICBwb29sLmFkZENsaWVudCgnQ2xpZW50Jywge1xuICAgICAgb0F1dGg6IHtcbiAgICAgICAgbG9nb3V0VXJsczogWydodHRwczovL2V4YW1wbGUuY29tJ10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xDbGllbnQnLCB7XG4gICAgICBMb2dvdXRVUkxzOiBbJ2h0dHBzOi8vZXhhbXBsZS5jb20nXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgd2hlbiBjbGllbnRDcmVkZW50aWFscyBPQXV0aCBmbG93IGlzIHNlbGVjdGVkIGFsb25nIHdpdGggY29kZUdyYW50IG9yIGltcGxpY2l0R3JhbnQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuXG4gICAgZXhwZWN0KCgpID0+IHBvb2wuYWRkQ2xpZW50KCdDbGllbnQxJywge1xuICAgICAgb0F1dGg6IHtcbiAgICAgICAgZmxvd3M6IHtcbiAgICAgICAgICBhdXRob3JpemF0aW9uQ29kZUdyYW50OiB0cnVlLFxuICAgICAgICAgIGNsaWVudENyZWRlbnRpYWxzOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBzY29wZXM6IFtPQXV0aFNjb3BlLlBIT05FXSxcbiAgICAgIH0sXG4gICAgfSkpLnRvVGhyb3coL2NsaWVudENyZWRlbnRpYWxzIE9BdXRoIGZsb3cgY2Fubm90IGJlIHNlbGVjdGVkLyk7XG5cbiAgICBleHBlY3QoKCkgPT4gcG9vbC5hZGRDbGllbnQoJ0NsaWVudDInLCB7XG4gICAgICBvQXV0aDoge1xuICAgICAgICBmbG93czoge1xuICAgICAgICAgIGltcGxpY2l0Q29kZUdyYW50OiB0cnVlLFxuICAgICAgICAgIGNsaWVudENyZWRlbnRpYWxzOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBzY29wZXM6IFtPQXV0aFNjb3BlLlBIT05FXSxcbiAgICAgIH0sXG4gICAgfSkpLnRvVGhyb3coL2NsaWVudENyZWRlbnRpYWxzIE9BdXRoIGZsb3cgY2Fubm90IGJlIHNlbGVjdGVkLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ09BdXRoIHNjb3BlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnKTtcblxuICAgIC8vIFdIRU5cbiAgICBwb29sLmFkZENsaWVudCgnQ2xpZW50Jywge1xuICAgICAgb0F1dGg6IHtcbiAgICAgICAgZmxvd3M6IHsgY2xpZW50Q3JlZGVudGlhbHM6IHRydWUgfSxcbiAgICAgICAgc2NvcGVzOiBbXG4gICAgICAgICAgT0F1dGhTY29wZS5QSE9ORSxcbiAgICAgICAgICBPQXV0aFNjb3BlLkVNQUlMLFxuICAgICAgICAgIE9BdXRoU2NvcGUuT1BFTklELFxuICAgICAgICAgIE9BdXRoU2NvcGUuUFJPRklMRSxcbiAgICAgICAgICBPQXV0aFNjb3BlLkNPR05JVE9fQURNSU4sXG4gICAgICAgICAgT0F1dGhTY29wZS5jdXN0b20oJ215LXJlc291cmNlLXNlcnZlci9teS1vd24tc2NvcGUnKSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xDbGllbnQnLCB7XG4gICAgICBBbGxvd2VkT0F1dGhTY29wZXM6IFtcbiAgICAgICAgJ3Bob25lJyxcbiAgICAgICAgJ2VtYWlsJyxcbiAgICAgICAgJ29wZW5pZCcsXG4gICAgICAgICdwcm9maWxlJyxcbiAgICAgICAgJ2F3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluJyxcbiAgICAgICAgJ215LXJlc291cmNlLXNlcnZlci9teS1vd24tc2NvcGUnLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnT0F1dGggc2NvcGVzIC0gcmVzb3VyY2Ugc2VydmVyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuICAgIGNvbnN0IHNjb3BlID0gbmV3IFJlc291cmNlU2VydmVyU2NvcGUoeyBzY29wZU5hbWU6ICdzY29wZS1uYW1lJywgc2NvcGVEZXNjcmlwdGlvbjogJ3Njb3BlLWRlc2MnIH0pO1xuICAgIGNvbnN0IHJlc291cmNlU2VydmVyID0gcG9vbC5hZGRSZXNvdXJjZVNlcnZlcignUmVzb3VyY2VTZXJ2ZXInLCB7XG4gICAgICBpZGVudGlmaWVyOiAncmVzb3VyY2Utc2VydmVyJyxcbiAgICAgIHNjb3BlczogW3Njb3BlXSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBwb29sLmFkZENsaWVudCgnQ2xpZW50Jywge1xuICAgICAgb0F1dGg6IHtcbiAgICAgICAgZmxvd3M6IHsgY2xpZW50Q3JlZGVudGlhbHM6IHRydWUgfSxcbiAgICAgICAgc2NvcGVzOiBbXG4gICAgICAgICAgT0F1dGhTY29wZS5yZXNvdXJjZVNlcnZlcihyZXNvdXJjZVNlcnZlciwgc2NvcGUpLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudCcsIHtcbiAgICAgIEFsbG93ZWRPQXV0aFNjb3BlczogW1xuICAgICAgICB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsIFtcbiAgICAgICAgICAgICAgc3RhY2sucmVzb2x2ZShyZXNvdXJjZVNlcnZlci51c2VyUG9vbFJlc291cmNlU2VydmVySWQpLFxuICAgICAgICAgICAgICAnL3Njb3BlLW5hbWUnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnT0F1dGhTY29wZSAtIG9wZW5pZCBpcyBpbmNsdWRlZCB3aGVuIGVtYWlsIG9yIHBob25lIGlzIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnKTtcblxuICAgIC8vIFdIRU5cbiAgICBwb29sLmFkZENsaWVudCgnQ2xpZW50MScsIHtcbiAgICAgIHVzZXJQb29sQ2xpZW50TmFtZTogJ0NsaWVudDEnLFxuICAgICAgb0F1dGg6IHtcbiAgICAgICAgZmxvd3M6IHsgY2xpZW50Q3JlZGVudGlhbHM6IHRydWUgfSxcbiAgICAgICAgc2NvcGVzOiBbT0F1dGhTY29wZS5QSE9ORV0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHBvb2wuYWRkQ2xpZW50KCdDbGllbnQyJywge1xuICAgICAgdXNlclBvb2xDbGllbnROYW1lOiAnQ2xpZW50MicsXG4gICAgICBvQXV0aDoge1xuICAgICAgICBmbG93czogeyBjbGllbnRDcmVkZW50aWFsczogdHJ1ZSB9LFxuICAgICAgICBzY29wZXM6IFtPQXV0aFNjb3BlLkVNQUlMXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcG9vbC5hZGRDbGllbnQoJ0NsaWVudDMnLCB7XG4gICAgICB1c2VyUG9vbENsaWVudE5hbWU6ICdDbGllbnQzJyxcbiAgICAgIG9BdXRoOiB7XG4gICAgICAgIGZsb3dzOiB7IGNsaWVudENyZWRlbnRpYWxzOiB0cnVlIH0sXG4gICAgICAgIHNjb3BlczogW09BdXRoU2NvcGUuUFJPRklMRV0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHBvb2wuYWRkQ2xpZW50KCdDbGllbnQ0Jywge1xuICAgICAgdXNlclBvb2xDbGllbnROYW1lOiAnQ2xpZW50NCcsXG4gICAgICBvQXV0aDoge1xuICAgICAgICBmbG93czogeyBjbGllbnRDcmVkZW50aWFsczogdHJ1ZSB9LFxuICAgICAgICBzY29wZXM6IFtPQXV0aFNjb3BlLkNPR05JVE9fQURNSU5dLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudCcsIHtcbiAgICAgIENsaWVudE5hbWU6ICdDbGllbnQxJyxcbiAgICAgIEFsbG93ZWRPQXV0aFNjb3BlczogWydwaG9uZScsICdvcGVuaWQnXSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudCcsIHtcbiAgICAgIENsaWVudE5hbWU6ICdDbGllbnQyJyxcbiAgICAgIEFsbG93ZWRPQXV0aFNjb3BlczogWydlbWFpbCcsICdvcGVuaWQnXSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudCcsIHtcbiAgICAgIENsaWVudE5hbWU6ICdDbGllbnQzJyxcbiAgICAgIEFsbG93ZWRPQXV0aFNjb3BlczogWydwcm9maWxlJywgJ29wZW5pZCddLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sQ2xpZW50Jywge1xuICAgICAgQ2xpZW50TmFtZTogJ0NsaWVudDQnLFxuICAgICAgQWxsb3dlZE9BdXRoU2NvcGVzOiBbJ2F3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluJ10sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2VuYWJsZSB1c2VyIGV4aXN0ZW5jZSBlcnJvcnMgcHJldmVudGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgVXNlclBvb2xDbGllbnQoc3RhY2ssICdDbGllbnQnLCB7XG4gICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICAgIHByZXZlbnRVc2VyRXhpc3RlbmNlRXJyb3JzOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sQ2xpZW50Jywge1xuICAgICAgVXNlclBvb2xJZDogc3RhY2sucmVzb2x2ZShwb29sLnVzZXJQb29sSWQpLFxuICAgICAgUHJldmVudFVzZXJFeGlzdGVuY2VFcnJvcnM6ICdFTkFCTEVEJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZGlzYWJsZSB1c2VyIGV4aXN0ZW5jZSBlcnJvcnMgcHJldmVudGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgVXNlclBvb2xDbGllbnQoc3RhY2ssICdDbGllbnQnLCB7XG4gICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICAgIHByZXZlbnRVc2VyRXhpc3RlbmNlRXJyb3JzOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudCcsIHtcbiAgICAgIFVzZXJQb29sSWQ6IHN0YWNrLnJlc29sdmUocG9vbC51c2VyUG9vbElkKSxcbiAgICAgIFByZXZlbnRVc2VyRXhpc3RlbmNlRXJyb3JzOiAnTEVHQUNZJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndXNlciBleGlzdGVuY2UgZXJyb3JzIHByZXZlbnRpb24gaXMgYWJzZW50IGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sQ2xpZW50KHN0YWNrLCAnQ2xpZW50Jywge1xuICAgICAgdXNlclBvb2w6IHBvb2wsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xDbGllbnQnLCB7XG4gICAgICBVc2VyUG9vbElkOiBzdGFjay5yZXNvbHZlKHBvb2wudXNlclBvb2xJZCksXG4gICAgICBQcmV2ZW50VXNlckV4aXN0ZW5jZUVycm9yczogTWF0Y2guYWJzZW50KCksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RlZmF1bHQgc3VwcG9ydGVkSWRlbnRpdHlQcm92aWRlcnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG5cbiAgICBjb25zdCBpZHAgPSBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXIuZnJvbVByb3ZpZGVyTmFtZShzdGFjaywgJ2ltcG9ydGVkJywgJ3VzZXJwb29sLWlkcCcpO1xuICAgIHBvb2wucmVnaXN0ZXJJZGVudGl0eVByb3ZpZGVyKGlkcCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sQ2xpZW50KHN0YWNrLCAnQ2xpZW50Jywge1xuICAgICAgdXNlclBvb2w6IHBvb2wsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xDbGllbnQnLCB7XG4gICAgICBTdXBwb3J0ZWRJZGVudGl0eVByb3ZpZGVyczogW1xuICAgICAgICAndXNlcnBvb2wtaWRwJyxcbiAgICAgICAgJ0NPR05JVE8nLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc3VwcG9ydGVkSWRlbnRpdHlQcm92aWRlcnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgcG9vbC5hZGRDbGllbnQoJ0FsbEVuYWJsZWQnLCB7XG4gICAgICB1c2VyUG9vbENsaWVudE5hbWU6ICdBbGxFbmFibGVkJyxcbiAgICAgIHN1cHBvcnRlZElkZW50aXR5UHJvdmlkZXJzOiBbXG4gICAgICAgIFVzZXJQb29sQ2xpZW50SWRlbnRpdHlQcm92aWRlci5DT0dOSVRPLFxuICAgICAgICBVc2VyUG9vbENsaWVudElkZW50aXR5UHJvdmlkZXIuRkFDRUJPT0ssXG4gICAgICAgIFVzZXJQb29sQ2xpZW50SWRlbnRpdHlQcm92aWRlci5BTUFaT04sXG4gICAgICAgIFVzZXJQb29sQ2xpZW50SWRlbnRpdHlQcm92aWRlci5HT09HTEUsXG4gICAgICAgIFVzZXJQb29sQ2xpZW50SWRlbnRpdHlQcm92aWRlci5BUFBMRSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xDbGllbnQnLCB7XG4gICAgICBDbGllbnROYW1lOiAnQWxsRW5hYmxlZCcsXG4gICAgICBTdXBwb3J0ZWRJZGVudGl0eVByb3ZpZGVyczogWydDT0dOSVRPJywgJ0ZhY2Vib29rJywgJ0xvZ2luV2l0aEFtYXpvbicsICdHb29nbGUnLCAnU2lnbkluV2l0aEFwcGxlJ10sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Rpc2FibGVPQXV0aCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnKTtcblxuICAgIC8vIFdIRU5cbiAgICBwb29sLmFkZENsaWVudCgnT0F1dGhEaXNhYmxlZCcsIHtcbiAgICAgIHVzZXJQb29sQ2xpZW50TmFtZTogJ09BdXRoRGlzYWJsZWQnLFxuICAgICAgZGlzYWJsZU9BdXRoOiB0cnVlLFxuICAgIH0pO1xuICAgIHBvb2wuYWRkQ2xpZW50KCdPQXV0aEVuYWJsZWQnLCB7XG4gICAgICB1c2VyUG9vbENsaWVudE5hbWU6ICdPQXV0aEVuYWJsZWQnLFxuICAgICAgZGlzYWJsZU9BdXRoOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudCcsIHtcbiAgICAgIENsaWVudE5hbWU6ICdPQXV0aERpc2FibGVkJyxcbiAgICAgIEFsbG93ZWRPQXV0aEZsb3dzOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgIEFsbG93ZWRPQXV0aFNjb3BlczogTWF0Y2guYWJzZW50KCksXG4gICAgICBBbGxvd2VkT0F1dGhGbG93c1VzZXJQb29sQ2xpZW50OiBmYWxzZSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudCcsIHtcbiAgICAgIENsaWVudE5hbWU6ICdPQXV0aEVuYWJsZWQnLFxuICAgICAgQWxsb3dlZE9BdXRoRmxvd3M6IFsnaW1wbGljaXQnLCAnY29kZSddLFxuICAgICAgQWxsb3dlZE9BdXRoU2NvcGVzOiBbJ3Byb2ZpbGUnLCAncGhvbmUnLCAnZW1haWwnLCAnb3BlbmlkJywgJ2F3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluJ10sXG4gICAgICBBbGxvd2VkT0F1dGhGbG93c1VzZXJQb29sQ2xpZW50OiB0cnVlLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyB3aGVuIG9BdXRoIGlzIHNwZWNpZmllZCBidXQgaXMgZGlzYWJsZU9BdXRoIGlzIHNldCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG5cbiAgICBleHBlY3QoKCkgPT4gcG9vbC5hZGRDbGllbnQoJ0NsaWVudCcsIHtcbiAgICAgIGRpc2FibGVPQXV0aDogdHJ1ZSxcbiAgICAgIG9BdXRoOiB7XG4gICAgICAgIGZsb3dzOiB7XG4gICAgICAgICAgYXV0aG9yaXphdGlvbkNvZGVHcmFudDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSkpLnRvVGhyb3coL2Rpc2FibGVPQXV0aCBpcyBzZXQvKTtcbiAgfSk7XG5cbiAgdGVzdCgnRW5hYmxlVG9rZW5SZXZvY2F0aW9uIGlzIGFic2VudCBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIHBvb2wuYWRkQ2xpZW50KCdDbGllbnQnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudCcsIHtcbiAgICAgIEVuYWJsZVRva2VuUmV2b2NhdGlvbjogTWF0Y2guYWJzZW50KCksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2VuYWJsZVRva2VuUmV2b2NhdGlvbiBpbiBhZGRDbGllbnQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgcG9vbC5hZGRDbGllbnQoJ0NsaWVudCcsIHtcbiAgICAgIGVuYWJsZVRva2VuUmV2b2NhdGlvbjogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudCcsIHtcbiAgICAgIEVuYWJsZVRva2VuUmV2b2NhdGlvbjogdHJ1ZSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZW5hYmxlVG9rZW5SZXZvY2F0aW9uIGluIFVzZXJQb29sQ2xpZW50JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBVc2VyUG9vbENsaWVudChzdGFjaywgJ0NsaWVudDEnLCB7XG4gICAgICB1c2VyUG9vbDogcG9vbCxcbiAgICAgIGVuYWJsZVRva2VuUmV2b2NhdGlvbjogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudCcsIHtcbiAgICAgIEVuYWJsZVRva2VuUmV2b2NhdGlvbjogdHJ1ZSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2F1dGggc2Vzc2lvbiB2YWxpZGl0eScsICgpID0+IHtcbiAgICB0ZXN0KCdkZWZhdWx0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBwb29sLmFkZENsaWVudCgnQ2xpZW50MScsIHtcbiAgICAgICAgdXNlclBvb2xDbGllbnROYW1lOiAnQ2xpZW50MScsXG4gICAgICAgIGF1dGhTZXNzaW9uVmFsaWRpdHk6IER1cmF0aW9uLm1pbnV0ZXMoMyksXG4gICAgICB9KTtcbiAgICAgIHBvb2wuYWRkQ2xpZW50KCdDbGllbnQyJywge1xuICAgICAgICB1c2VyUG9vbENsaWVudE5hbWU6ICdDbGllbnQyJyxcbiAgICAgICAgYXV0aFNlc3Npb25WYWxpZGl0eTogRHVyYXRpb24ubWludXRlcyg5KSxcbiAgICAgIH0pO1xuICAgICAgcG9vbC5hZGRDbGllbnQoJ0NsaWVudDMnLCB7XG4gICAgICAgIHVzZXJQb29sQ2xpZW50TmFtZTogJ0NsaWVudDMnLFxuICAgICAgICBhdXRoU2Vzc2lvblZhbGlkaXR5OiBEdXJhdGlvbi5taW51dGVzKDE1KSxcbiAgICAgIH0pO1xuICAgICAgcG9vbC5hZGRDbGllbnQoJ0NsaWVudDUnLCB7XG4gICAgICAgIHVzZXJQb29sQ2xpZW50TmFtZTogJ0NsaWVudDQnLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sQ2xpZW50Jywge1xuICAgICAgICBDbGllbnROYW1lOiAnQ2xpZW50MScsXG4gICAgICAgIEF1dGhTZXNzaW9uVmFsaWRpdHk6IDMsXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sQ2xpZW50Jywge1xuICAgICAgICBDbGllbnROYW1lOiAnQ2xpZW50MicsXG4gICAgICAgIEF1dGhTZXNzaW9uVmFsaWRpdHk6IDksXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sQ2xpZW50Jywge1xuICAgICAgICBDbGllbnROYW1lOiAnQ2xpZW50MycsXG4gICAgICAgIEF1dGhTZXNzaW9uVmFsaWRpdHk6IDE1LFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudCcsIHtcbiAgICAgICAgQ2xpZW50TmFtZTogJ0NsaWVudDQnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0LmVhY2goW1xuICAgICAgRHVyYXRpb24ubWludXRlcygwKSxcbiAgICAgIER1cmF0aW9uLm1pbnV0ZXMoMSksXG4gICAgICBEdXJhdGlvbi5taW51dGVzKDMpLm1pbnVzKER1cmF0aW9uLm1pbnV0ZXMoMSkpLFxuICAgICAgRHVyYXRpb24ubWludXRlcygxNSkucGx1cyhEdXJhdGlvbi5taW51dGVzKDEpKSxcbiAgICAgIER1cmF0aW9uLm1pbnV0ZXMoMTAwKSxcbiAgICBdKSgndmFsaWRhdGVzIGF1dGhTZXNzaW9uVmFsaWRpdHkgaXMgYSBkdXJhdGlvbiBiZXR3ZWVuIDMgYW5kIDE1IG1pbnV0ZXMnLCAodmFsaWRpdHkpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgcG9vbC5hZGRDbGllbnQoJ0NsaWVudDEnLCB7XG4gICAgICAgICAgdXNlclBvb2xDbGllbnROYW1lOiAnQ2xpZW50MScsXG4gICAgICAgICAgYXV0aFNlc3Npb25WYWxpZGl0eTogdmFsaWRpdHksXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdyhgYXV0aFNlc3Npb25WYWxpZGl0eTogTXVzdCBiZSBhIGR1cmF0aW9uIGJldHdlZW4gMyBtaW51dGVzIGFuZCAxNSBtaW51dGVzIChpbmNsdXNpdmUpOyByZWNlaXZlZCAke3ZhbGlkaXR5LnRvSHVtYW5TdHJpbmcoKX0uYCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0LmVhY2goW1xuICAgICAgRHVyYXRpb24ubWludXRlcygzKSxcbiAgICAgIER1cmF0aW9uLm1pbnV0ZXMoOSksXG4gICAgICBEdXJhdGlvbi5taW51dGVzKDE1KSxcbiAgICBdKSgndmFsaWRhdGVzIGF1dGhTZXNzaW9uVmFsaWRpdHkgaXMgYSBkdXJhdGlvbiBiZXR3ZWVuIDMgYW5kIDE1IG1pbnV0ZXMgKHZhbGlkKScsICh2YWxpZGl0eSkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHBvb2wuYWRkQ2xpZW50KCdDbGllbnQxJywge1xuICAgICAgICB1c2VyUG9vbENsaWVudE5hbWU6ICdDbGllbnQxJyxcbiAgICAgICAgYXV0aFNlc3Npb25WYWxpZGl0eTogdmFsaWRpdHksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xDbGllbnQnLCB7XG4gICAgICAgIENsaWVudE5hbWU6ICdDbGllbnQxJyxcbiAgICAgICAgQXV0aFNlc3Npb25WYWxpZGl0eTogdmFsaWRpdHkudG9NaW51dGVzKCksXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3Rva2VuIHZhbGlkaXR5JywgKCkgPT4ge1xuICAgIHRlc3QoJ2RlZmF1bHQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHBvb2wuYWRkQ2xpZW50KCdDbGllbnQxJywge1xuICAgICAgICB1c2VyUG9vbENsaWVudE5hbWU6ICdDbGllbnQxJyxcbiAgICAgICAgYWNjZXNzVG9rZW5WYWxpZGl0eTogRHVyYXRpb24ubWludXRlcyg2MCksXG4gICAgICAgIGlkVG9rZW5WYWxpZGl0eTogRHVyYXRpb24ubWludXRlcyg2MCksXG4gICAgICAgIHJlZnJlc2hUb2tlblZhbGlkaXR5OiBEdXJhdGlvbi5kYXlzKDMwKSxcbiAgICAgIH0pO1xuICAgICAgcG9vbC5hZGRDbGllbnQoJ0NsaWVudDInLCB7XG4gICAgICAgIHVzZXJQb29sQ2xpZW50TmFtZTogJ0NsaWVudDInLFxuICAgICAgICBhY2Nlc3NUb2tlblZhbGlkaXR5OiBEdXJhdGlvbi5taW51dGVzKDYwKSxcbiAgICAgIH0pO1xuICAgICAgcG9vbC5hZGRDbGllbnQoJ0NsaWVudDMnLCB7XG4gICAgICAgIHVzZXJQb29sQ2xpZW50TmFtZTogJ0NsaWVudDMnLFxuICAgICAgICBpZFRva2VuVmFsaWRpdHk6IER1cmF0aW9uLm1pbnV0ZXMoNjApLFxuICAgICAgfSk7XG4gICAgICBwb29sLmFkZENsaWVudCgnQ2xpZW50NCcsIHtcbiAgICAgICAgdXNlclBvb2xDbGllbnROYW1lOiAnQ2xpZW50NCcsXG4gICAgICAgIHJlZnJlc2hUb2tlblZhbGlkaXR5OiBEdXJhdGlvbi5kYXlzKDMwKSxcbiAgICAgIH0pO1xuICAgICAgcG9vbC5hZGRDbGllbnQoJ0NsaWVudDUnLCB7XG4gICAgICAgIHVzZXJQb29sQ2xpZW50TmFtZTogJ0NsaWVudDUnLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sQ2xpZW50Jywge1xuICAgICAgICBDbGllbnROYW1lOiAnQ2xpZW50MScsXG4gICAgICAgIEFjY2Vzc1Rva2VuVmFsaWRpdHk6IDYwLFxuICAgICAgICBJZFRva2VuVmFsaWRpdHk6IDYwLFxuICAgICAgICBSZWZyZXNoVG9rZW5WYWxpZGl0eTogNDMyMDAsXG4gICAgICAgIFRva2VuVmFsaWRpdHlVbml0czoge1xuICAgICAgICAgIEFjY2Vzc1Rva2VuOiAnbWludXRlcycsXG4gICAgICAgICAgSWRUb2tlbjogJ21pbnV0ZXMnLFxuICAgICAgICAgIFJlZnJlc2hUb2tlbjogJ21pbnV0ZXMnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudCcsIHtcbiAgICAgICAgQ2xpZW50TmFtZTogJ0NsaWVudDInLFxuICAgICAgICBBY2Nlc3NUb2tlblZhbGlkaXR5OiA2MCxcbiAgICAgICAgSWRUb2tlblZhbGlkaXR5OiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgICAgUmVmcmVzaFRva2VuVmFsaWRpdHk6IE1hdGNoLmFic2VudCgpLFxuICAgICAgICBUb2tlblZhbGlkaXR5VW5pdHM6IHtcbiAgICAgICAgICBBY2Nlc3NUb2tlbjogJ21pbnV0ZXMnLFxuICAgICAgICAgIElkVG9rZW46IE1hdGNoLmFic2VudCgpLFxuICAgICAgICAgIFJlZnJlc2hUb2tlbjogTWF0Y2guYWJzZW50KCksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sQ2xpZW50Jywge1xuICAgICAgICBDbGllbnROYW1lOiAnQ2xpZW50MycsXG4gICAgICAgIEFjY2Vzc1Rva2VuVmFsaWRpdHk6IE1hdGNoLmFic2VudCgpLFxuICAgICAgICBJZFRva2VuVmFsaWRpdHk6IDYwLFxuICAgICAgICBSZWZyZXNoVG9rZW5WYWxpZGl0eTogTWF0Y2guYWJzZW50KCksXG4gICAgICAgIFRva2VuVmFsaWRpdHlVbml0czoge1xuICAgICAgICAgIEFjY2Vzc1Rva2VuOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgICAgICBJZFRva2VuOiAnbWludXRlcycsXG4gICAgICAgICAgUmVmcmVzaFRva2VuOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xDbGllbnQnLCB7XG4gICAgICAgIENsaWVudE5hbWU6ICdDbGllbnQ0JyxcbiAgICAgICAgQWNjZXNzVG9rZW5WYWxpZGl0eTogTWF0Y2guYWJzZW50KCksXG4gICAgICAgIElkVG9rZW5WYWxpZGl0eTogTWF0Y2guYWJzZW50KCksXG4gICAgICAgIFJlZnJlc2hUb2tlblZhbGlkaXR5OiA0MzIwMCxcbiAgICAgICAgVG9rZW5WYWxpZGl0eVVuaXRzOiB7XG4gICAgICAgICAgQWNjZXNzVG9rZW46IE1hdGNoLmFic2VudCgpLFxuICAgICAgICAgIElkVG9rZW46IE1hdGNoLmFic2VudCgpLFxuICAgICAgICAgIFJlZnJlc2hUb2tlbjogJ21pbnV0ZXMnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudCcsIHtcbiAgICAgICAgQ2xpZW50TmFtZTogJ0NsaWVudDUnLFxuICAgICAgICBUb2tlblZhbGlkaXR5VW5pdHM6IE1hdGNoLmFic2VudCgpLFxuICAgICAgICBJZFRva2VuVmFsaWRpdHk6IE1hdGNoLmFic2VudCgpLFxuICAgICAgICBSZWZyZXNoVG9rZW5WYWxpZGl0eTogTWF0Y2guYWJzZW50KCksXG4gICAgICAgIEFjY2Vzc1Rva2VuVmFsaWRpdHk6IE1hdGNoLmFic2VudCgpLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0LmVhY2goW1xuICAgICAgRHVyYXRpb24ubWludXRlcygwKSxcbiAgICAgIER1cmF0aW9uLm1pbnV0ZXMoNCksXG4gICAgICBEdXJhdGlvbi5kYXlzKDEpLnBsdXMoRHVyYXRpb24ubWludXRlcygxKSksXG4gICAgICBEdXJhdGlvbi5kYXlzKDIpLFxuICAgIF0pKCd2YWxpZGF0ZXMgYWNjZXNzVG9rZW5WYWxpZGl0eSBpcyBhIGR1cmF0aW9uIGJldHdlZW4gNSBtaW51dGVzIGFuZCAxIGRheScsICh2YWxpZGl0eSkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBwb29sLmFkZENsaWVudCgnQ2xpZW50MScsIHtcbiAgICAgICAgICB1c2VyUG9vbENsaWVudE5hbWU6ICdDbGllbnQxJyxcbiAgICAgICAgICBhY2Nlc3NUb2tlblZhbGlkaXR5OiB2YWxpZGl0eSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KGBhY2Nlc3NUb2tlblZhbGlkaXR5OiBNdXN0IGJlIGEgZHVyYXRpb24gYmV0d2VlbiA1IG1pbnV0ZXMgYW5kIDEgZGF5IChpbmNsdXNpdmUpOyByZWNlaXZlZCAke3ZhbGlkaXR5LnRvSHVtYW5TdHJpbmcoKX0uYCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0LmVhY2goW1xuICAgICAgRHVyYXRpb24ubWludXRlcygwKSxcbiAgICAgIER1cmF0aW9uLm1pbnV0ZXMoNCksXG4gICAgICBEdXJhdGlvbi5kYXlzKDEpLnBsdXMoRHVyYXRpb24ubWludXRlcygxKSksXG4gICAgICBEdXJhdGlvbi5kYXlzKDIpLFxuICAgIF0pKCd2YWxpZGF0ZXMgaWRUb2tlblZhbGlkaXR5IGlzIGEgZHVyYXRpb24gYmV0d2VlbiA1IG1pbnV0ZXMgYW5kIDEgZGF5JywgKHZhbGlkaXR5KSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnKTtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHBvb2wuYWRkQ2xpZW50KCdDbGllbnQxJywge1xuICAgICAgICAgIHVzZXJQb29sQ2xpZW50TmFtZTogJ0NsaWVudDEnLFxuICAgICAgICAgIGlkVG9rZW5WYWxpZGl0eTogdmFsaWRpdHksXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdyhgaWRUb2tlblZhbGlkaXR5OiBNdXN0IGJlIGEgZHVyYXRpb24gYmV0d2VlbiA1IG1pbnV0ZXMgYW5kIDEgZGF5IChpbmNsdXNpdmUpOyByZWNlaXZlZCAke3ZhbGlkaXR5LnRvSHVtYW5TdHJpbmcoKX0uYCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0LmVhY2goW1xuICAgICAgRHVyYXRpb24uaG91cnMoMSkucGx1cyhEdXJhdGlvbi5taW51dGVzKDEpKSxcbiAgICAgIER1cmF0aW9uLmhvdXJzKDEyKSxcbiAgICAgIER1cmF0aW9uLmRheXMoMSksXG4gICAgXSkoJ3ZhbGlkYXRlcyBhY2Nlc3NUb2tlblZhbGlkaXR5IGlzIG5vdCBncmVhdGVyIHRoYW4gcmVmcmVzaCB0b2tlbiBleHBpcmF0aW9uJywgKHZhbGlkaXR5KSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnKTtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHBvb2wuYWRkQ2xpZW50KCdDbGllbnQxJywge1xuICAgICAgICAgIHVzZXJQb29sQ2xpZW50TmFtZTogJ0NsaWVudDEnLFxuICAgICAgICAgIGFjY2Vzc1Rva2VuVmFsaWRpdHk6IHZhbGlkaXR5LFxuICAgICAgICAgIHJlZnJlc2hUb2tlblZhbGlkaXR5OiBEdXJhdGlvbi5ob3VycygxKSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KGBhY2Nlc3NUb2tlblZhbGlkaXR5OiBNdXN0IGJlIGEgZHVyYXRpb24gYmV0d2VlbiA1IG1pbnV0ZXMgYW5kIDEgaG91ciAoaW5jbHVzaXZlKTsgcmVjZWl2ZWQgJHt2YWxpZGl0eS50b0h1bWFuU3RyaW5nKCl9LmApO1xuICAgIH0pO1xuXG4gICAgdGVzdC5lYWNoKFtcbiAgICAgIER1cmF0aW9uLmhvdXJzKDEpLnBsdXMoRHVyYXRpb24ubWludXRlcygxKSksXG4gICAgICBEdXJhdGlvbi5ob3VycygxMiksXG4gICAgICBEdXJhdGlvbi5kYXlzKDEpLFxuICAgIF0pKCd2YWxpZGF0ZXMgaWRUb2tlblZhbGlkaXR5IGlzIG5vdCBncmVhdGVyIHRoYW4gcmVmcmVzaCB0b2tlbiBleHBpcmF0aW9uJywgKHZhbGlkaXR5KSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnKTtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHBvb2wuYWRkQ2xpZW50KCdDbGllbnQxJywge1xuICAgICAgICAgIHVzZXJQb29sQ2xpZW50TmFtZTogJ0NsaWVudDEnLFxuICAgICAgICAgIGlkVG9rZW5WYWxpZGl0eTogdmFsaWRpdHksXG4gICAgICAgICAgcmVmcmVzaFRva2VuVmFsaWRpdHk6IER1cmF0aW9uLmhvdXJzKDEpLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coYGlkVG9rZW5WYWxpZGl0eTogTXVzdCBiZSBhIGR1cmF0aW9uIGJldHdlZW4gNSBtaW51dGVzIGFuZCAxIGhvdXIgKGluY2x1c2l2ZSk7IHJlY2VpdmVkICR7dmFsaWRpdHkudG9IdW1hblN0cmluZygpfS5gKTtcbiAgICB9KTtcblxuICAgIHRlc3QuZWFjaChbXG4gICAgICBEdXJhdGlvbi5taW51dGVzKDApLFxuICAgICAgRHVyYXRpb24ubWludXRlcyg1OSksXG4gICAgICBEdXJhdGlvbi5kYXlzKDEwICogMzY1KS5wbHVzKER1cmF0aW9uLm1pbnV0ZXMoMSkpLFxuICAgICAgRHVyYXRpb24uZGF5cygxMCAqIDM2NSArIDEpLFxuICAgIF0pKCd2YWxpZGF0ZXMgcmVmcmVzaFRva2VuVmFsaWRpdHkgaXMgYSBkdXJhdGlvbiBiZXR3ZWVuIDEgaG91ciBhbmQgMTAgeWVhcnMnLCAodmFsaWRpdHkpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgcG9vbC5hZGRDbGllbnQoJ0NsaWVudDEnLCB7XG4gICAgICAgICAgdXNlclBvb2xDbGllbnROYW1lOiAnQ2xpZW50MScsXG4gICAgICAgICAgcmVmcmVzaFRva2VuVmFsaWRpdHk6IHZhbGlkaXR5LFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coYHJlZnJlc2hUb2tlblZhbGlkaXR5OiBNdXN0IGJlIGEgZHVyYXRpb24gYmV0d2VlbiAxIGhvdXIgYW5kIDM2NTAgZGF5cyAoaW5jbHVzaXZlKTsgcmVjZWl2ZWQgJHt2YWxpZGl0eS50b0h1bWFuU3RyaW5nKCl9LmApO1xuICAgIH0pO1xuXG4gICAgdGVzdC5lYWNoKFtcbiAgICAgIER1cmF0aW9uLm1pbnV0ZXMoNSksXG4gICAgICBEdXJhdGlvbi5taW51dGVzKDYwKSxcbiAgICAgIER1cmF0aW9uLmRheXMoMSksXG4gICAgXSkoJ3ZhbGlkYXRlcyBhY2Nlc3NUb2tlblZhbGlkaXR5IGlzIGEgZHVyYXRpb24gYmV0d2VlbiA1IG1pbnV0ZXMgYW5kIDEgZGF5ICh2YWxpZCknLCAodmFsaWRpdHkpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBwb29sLmFkZENsaWVudCgnQ2xpZW50MScsIHtcbiAgICAgICAgdXNlclBvb2xDbGllbnROYW1lOiAnQ2xpZW50MScsXG4gICAgICAgIGFjY2Vzc1Rva2VuVmFsaWRpdHk6IHZhbGlkaXR5LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sQ2xpZW50Jywge1xuICAgICAgICBDbGllbnROYW1lOiAnQ2xpZW50MScsXG4gICAgICAgIEFjY2Vzc1Rva2VuVmFsaWRpdHk6IHZhbGlkaXR5LnRvTWludXRlcygpLFxuICAgICAgICBUb2tlblZhbGlkaXR5VW5pdHM6IHtcbiAgICAgICAgICBBY2Nlc3NUb2tlbjogJ21pbnV0ZXMnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0LmVhY2goW1xuICAgICAgRHVyYXRpb24ubWludXRlcyg1KSxcbiAgICAgIER1cmF0aW9uLm1pbnV0ZXMoNjApLFxuICAgICAgRHVyYXRpb24uZGF5cygxKSxcbiAgICBdKSgndmFsaWRhdGVzIGlkVG9rZW5WYWxpZGl0eSBpcyBhIGR1cmF0aW9uIGJldHdlZW4gNSBtaW51dGVzIGFuZCAxIGRheSAodmFsaWQpJywgKHZhbGlkaXR5KSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgcG9vbC5hZGRDbGllbnQoJ0NsaWVudDEnLCB7XG4gICAgICAgIHVzZXJQb29sQ2xpZW50TmFtZTogJ0NsaWVudDEnLFxuICAgICAgICBpZFRva2VuVmFsaWRpdHk6IHZhbGlkaXR5LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sQ2xpZW50Jywge1xuICAgICAgICBDbGllbnROYW1lOiAnQ2xpZW50MScsXG4gICAgICAgIElkVG9rZW5WYWxpZGl0eTogdmFsaWRpdHkudG9NaW51dGVzKCksXG4gICAgICAgIFRva2VuVmFsaWRpdHlVbml0czoge1xuICAgICAgICAgIElkVG9rZW46ICdtaW51dGVzJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdC5lYWNoKFtcbiAgICAgIER1cmF0aW9uLm1pbnV0ZXMoNjApLFxuICAgICAgRHVyYXRpb24ubWludXRlcygxMjApLFxuICAgICAgRHVyYXRpb24uZGF5cygzNjUpLFxuICAgICAgRHVyYXRpb24uZGF5cygxMCAqIDM2NSksXG4gICAgXSkoJ3ZhbGlkYXRlcyByZWZyZXNoVG9rZW5WYWxpZGl0eSBpcyBhIGR1cmF0aW9uIGJldHdlZW4gMSBob3VyIGFuZCAxMCB5ZWFycyAodmFsaWQpJywgKHZhbGlkaXR5KSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgcG9vbC5hZGRDbGllbnQoJ0NsaWVudDEnLCB7XG4gICAgICAgIHVzZXJQb29sQ2xpZW50TmFtZTogJ0NsaWVudDEnLFxuICAgICAgICByZWZyZXNoVG9rZW5WYWxpZGl0eTogdmFsaWRpdHksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xDbGllbnQnLCB7XG4gICAgICAgIENsaWVudE5hbWU6ICdDbGllbnQxJyxcbiAgICAgICAgUmVmcmVzaFRva2VuVmFsaWRpdHk6IHZhbGlkaXR5LnRvTWludXRlcygpLFxuICAgICAgICBUb2tlblZhbGlkaXR5VW5pdHM6IHtcbiAgICAgICAgICBSZWZyZXNoVG9rZW46ICdtaW51dGVzJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdC5lYWNoKFtcbiAgICAgIER1cmF0aW9uLm1pbnV0ZXMoNSksXG4gICAgICBEdXJhdGlvbi5taW51dGVzKDYwKSxcbiAgICAgIER1cmF0aW9uLmhvdXJzKDEpLFxuICAgIF0pKCd2YWxpZGF0ZXMgYWNjZXNzVG9rZW5WYWxpZGl0eSBpcyBub3QgZ3JlYXRlciB0aGFuIHJlZnJlc2ggdG9rZW4gZXhwaXJhdGlvbiAodmFsaWQpJywgKHZhbGlkaXR5KSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgcG9vbC5hZGRDbGllbnQoJ0NsaWVudDEnLCB7XG4gICAgICAgIHVzZXJQb29sQ2xpZW50TmFtZTogJ0NsaWVudDEnLFxuICAgICAgICBhY2Nlc3NUb2tlblZhbGlkaXR5OiB2YWxpZGl0eSxcbiAgICAgICAgcmVmcmVzaFRva2VuVmFsaWRpdHk6IER1cmF0aW9uLmhvdXJzKDEpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sQ2xpZW50Jywge1xuICAgICAgICBDbGllbnROYW1lOiAnQ2xpZW50MScsXG4gICAgICAgIEFjY2Vzc1Rva2VuVmFsaWRpdHk6IHZhbGlkaXR5LnRvTWludXRlcygpLFxuICAgICAgICBUb2tlblZhbGlkaXR5VW5pdHM6IHtcbiAgICAgICAgICBBY2Nlc3NUb2tlbjogJ21pbnV0ZXMnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0LmVhY2goW1xuICAgICAgRHVyYXRpb24ubWludXRlcyg1KSxcbiAgICAgIER1cmF0aW9uLm1pbnV0ZXMoNjApLFxuICAgICAgRHVyYXRpb24uaG91cnMoMSksXG4gICAgXSkoJ3ZhbGlkYXRlcyBpZFRva2VuVmFsaWRpdHkgaXMgbm90IGdyZWF0ZXIgdGhhbiByZWZyZXNoIHRva2VuIGV4cGlyYXRpb24gKHZhbGlkKScsICh2YWxpZGl0eSkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHBvb2wuYWRkQ2xpZW50KCdDbGllbnQxJywge1xuICAgICAgICB1c2VyUG9vbENsaWVudE5hbWU6ICdDbGllbnQxJyxcbiAgICAgICAgaWRUb2tlblZhbGlkaXR5OiB2YWxpZGl0eSxcbiAgICAgICAgcmVmcmVzaFRva2VuVmFsaWRpdHk6IER1cmF0aW9uLmhvdXJzKDEpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sQ2xpZW50Jywge1xuICAgICAgICBDbGllbnROYW1lOiAnQ2xpZW50MScsXG4gICAgICAgIElkVG9rZW5WYWxpZGl0eTogdmFsaWRpdHkudG9NaW51dGVzKCksXG4gICAgICAgIFRva2VuVmFsaWRpdHlVbml0czoge1xuICAgICAgICAgIElkVG9rZW46ICdtaW51dGVzJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncmVhZCBhbmQgd3JpdGUgYXR0cmlidXRlcycsICgpID0+IHtcbiAgICB0ZXN0KCd1bmRlZmluZWQgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgcG9vbC5hZGRDbGllbnQoJ0NsaWVudCcsIHt9KTtcblxuICAgICAgLy8gRVhQRUNUXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudCcsIHtcbiAgICAgICAgUmVhZEF0dHJpYnV0ZXM6IE1hdGNoLmFic2VudCgpLFxuICAgICAgICBXcml0ZUF0dHJpYnV0ZXM6IE1hdGNoLmFic2VudCgpLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdzZXQgYXR0cmlidXRlcycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnKTtcbiAgICAgIGNvbnN0IHdyaXRlQXR0cmlidXRlcyA9IChuZXcgQ2xpZW50QXR0cmlidXRlcygpKS53aXRoQ3VzdG9tQXR0cmlidXRlcygnbXlfZmlyc3QnKS53aXRoU3RhbmRhcmRBdHRyaWJ1dGVzKHsgZ2l2ZW5OYW1lOiB0cnVlLCBmYW1pbHlOYW1lOiB0cnVlIH0pO1xuICAgICAgY29uc3QgcmVhZEF0dHJpYnV0ZXMgPSAobmV3IENsaWVudEF0dHJpYnV0ZXMoKSkud2l0aFN0YW5kYXJkQXR0cmlidXRlcyh7XG4gICAgICAgIGFkZHJlc3M6IHRydWUsXG4gICAgICAgIGJpcnRoZGF0ZTogdHJ1ZSxcbiAgICAgICAgZW1haWw6IHRydWUsXG4gICAgICAgIGVtYWlsVmVyaWZpZWQ6IHRydWUsXG4gICAgICAgIGZhbWlseU5hbWU6IHRydWUsXG4gICAgICAgIGZ1bGxuYW1lOiB0cnVlLFxuICAgICAgICBnZW5kZXI6IHRydWUsXG4gICAgICAgIGdpdmVuTmFtZTogdHJ1ZSxcbiAgICAgICAgbGFzdFVwZGF0ZVRpbWU6IHRydWUsXG4gICAgICAgIGxvY2FsZTogdHJ1ZSxcbiAgICAgICAgbWlkZGxlTmFtZTogdHJ1ZSxcbiAgICAgICAgbmlja25hbWU6IHRydWUsXG4gICAgICAgIHBob25lTnVtYmVyOiB0cnVlLFxuICAgICAgICBwaG9uZU51bWJlclZlcmlmaWVkOiB0cnVlLFxuICAgICAgICBwcmVmZXJyZWRVc2VybmFtZTogdHJ1ZSxcbiAgICAgICAgcHJvZmlsZVBhZ2U6IHRydWUsXG4gICAgICAgIHByb2ZpbGVQaWN0dXJlOiB0cnVlLFxuICAgICAgICB0aW1lem9uZTogdHJ1ZSxcbiAgICAgICAgd2Vic2l0ZTogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBwb29sLmFkZENsaWVudCgnQ2xpZW50Jywge1xuICAgICAgICByZWFkQXR0cmlidXRlcyxcbiAgICAgICAgd3JpdGVBdHRyaWJ1dGVzLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIEVYUEVDVFxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xDbGllbnQnLCB7XG4gICAgICAgIFJlYWRBdHRyaWJ1dGVzOiBNYXRjaC5hcnJheVdpdGgoWydhZGRyZXNzJywgJ2JpcnRoZGF0ZScsICdlbWFpbCcsICdlbWFpbF92ZXJpZmllZCcsICdmYW1pbHlfbmFtZScsICdnZW5kZXInLFxuICAgICAgICAgICdnaXZlbl9uYW1lJywgJ2xvY2FsZScsICdtaWRkbGVfbmFtZScsICduYW1lJywgJ25pY2tuYW1lJywgJ3Bob25lX251bWJlcicsICdwaG9uZV9udW1iZXJfdmVyaWZpZWQnLCAncGljdHVyZScsXG4gICAgICAgICAgJ3ByZWZlcnJlZF91c2VybmFtZScsICdwcm9maWxlJywgJ3VwZGF0ZWRfYXQnLCAnd2Vic2l0ZScsICd6b25laW5mbyddKSxcbiAgICAgICAgV3JpdGVBdHRyaWJ1dGVzOiBNYXRjaC5hcnJheVdpdGgoWydjdXN0b206bXlfZmlyc3QnLCAnZmFtaWx5X25hbWUnLCAnZ2l2ZW5fbmFtZSddKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19