"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPoolClient = exports.UserPoolClientIdentityProvider = exports.OAuthScope = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const custom_resources_1 = require("@aws-cdk/custom-resources");
const cognito_generated_1 = require("./cognito.generated");
/**
 * OAuth scopes that are allowed with this client.
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-app-idp-settings.html
 */
class OAuthScope {
    constructor(scopeName) {
        this.scopeName = scopeName;
    }
    /**
     * Custom scope is one that you define for your own resource server in the Resource Servers.
     * The format is 'resource-server-identifier/scope'.
     * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-define-resource-servers.html
     */
    static custom(name) {
        return new OAuthScope(name);
    }
    /**
     * Adds a custom scope that's tied to a resource server in your stack
     */
    static resourceServer(server, scope) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_IUserPoolResourceServer(server);
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_ResourceServerScope(scope);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.resourceServer);
            }
            throw error;
        }
        return new OAuthScope(`${server.userPoolResourceServerId}/${scope.scopeName}`);
    }
}
exports.OAuthScope = OAuthScope;
_a = JSII_RTTI_SYMBOL_1;
OAuthScope[_a] = { fqn: "@aws-cdk/aws-cognito.OAuthScope", version: "0.0.0" };
/**
 * Grants access to the 'phone_number' and 'phone_number_verified' claims.
 * Automatically includes access to `OAuthScope.OPENID`.
 */
OAuthScope.PHONE = new OAuthScope('phone');
/**
 * Grants access to the 'email' and 'email_verified' claims.
 * Automatically includes access to `OAuthScope.OPENID`.
 */
OAuthScope.EMAIL = new OAuthScope('email');
/**
 * Returns all user attributes in the ID token that are readable by the client
 */
OAuthScope.OPENID = new OAuthScope('openid');
/**
 * Grants access to all user attributes that are readable by the client
 * Automatically includes access to `OAuthScope.OPENID`.
 */
OAuthScope.PROFILE = new OAuthScope('profile');
/**
 * Grants access to Amazon Cognito User Pool API operations that require access tokens,
 * such as UpdateUserAttributes and VerifyUserAttribute.
 */
OAuthScope.COGNITO_ADMIN = new OAuthScope('aws.cognito.signin.user.admin');
/**
 * Identity providers supported by the UserPoolClient
 */
class UserPoolClientIdentityProvider {
    constructor(name) {
        this.name = name;
    }
    /**
     * Specify a provider not yet supported by the CDK.
     * @param name name of the identity provider as recognized by CloudFormation property `SupportedIdentityProviders`
     */
    static custom(name) {
        return new UserPoolClientIdentityProvider(name);
    }
}
exports.UserPoolClientIdentityProvider = UserPoolClientIdentityProvider;
_b = JSII_RTTI_SYMBOL_1;
UserPoolClientIdentityProvider[_b] = { fqn: "@aws-cdk/aws-cognito.UserPoolClientIdentityProvider", version: "0.0.0" };
/**
 * Allow users to sign in using 'Sign In With Apple'.
 * A `UserPoolIdentityProviderApple` must be attached to the user pool.
 */
UserPoolClientIdentityProvider.APPLE = new UserPoolClientIdentityProvider('SignInWithApple');
/**
 * Allow users to sign in using 'Facebook Login'.
 * A `UserPoolIdentityProviderFacebook` must be attached to the user pool.
 */
UserPoolClientIdentityProvider.FACEBOOK = new UserPoolClientIdentityProvider('Facebook');
/**
 * Allow users to sign in using 'Google Login'.
 * A `UserPoolIdentityProviderGoogle` must be attached to the user pool.
 */
UserPoolClientIdentityProvider.GOOGLE = new UserPoolClientIdentityProvider('Google');
/**
 * Allow users to sign in using 'Login With Amazon'.
 * A `UserPoolIdentityProviderAmazon` must be attached to the user pool.
 */
UserPoolClientIdentityProvider.AMAZON = new UserPoolClientIdentityProvider('LoginWithAmazon');
/**
 * Allow users to sign in directly as a user of the User Pool
 */
UserPoolClientIdentityProvider.COGNITO = new UserPoolClientIdentityProvider('COGNITO');
/**
 * Define a UserPool App Client
 */
class UserPoolClient extends core_1.Resource {
    /*
     * Note to implementers: Two CloudFormation return values Name and ClientSecret are part of the spec.
     * However, they have been explicity not implemented here. They are not documented in CloudFormation, and
     * CloudFormation returns the following the string when these two attributes are 'GetAtt' - "attribute not supported
     * at this time, please use the CLI or Console to retrieve this value".
     * Awaiting updates from CloudFormation.
     */
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_UserPoolClientProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, UserPoolClient);
            }
            throw error;
        }
        if (props.disableOAuth && props.oAuth) {
            throw new Error('OAuth settings cannot be specified when disableOAuth is set.');
        }
        this.oAuthFlows = props.oAuth?.flows ?? {
            implicitCodeGrant: true,
            authorizationCodeGrant: true,
        };
        let callbackUrls = props.oAuth?.callbackUrls;
        if (this.oAuthFlows.authorizationCodeGrant || this.oAuthFlows.implicitCodeGrant) {
            if (callbackUrls === undefined) {
                callbackUrls = ['https://example.com'];
            }
            else if (callbackUrls.length === 0) {
                throw new Error('callbackUrl must not be empty when codeGrant or implicitGrant OAuth flows are enabled.');
            }
        }
        this._generateSecret = props.generateSecret;
        this.userPool = props.userPool;
        const resource = new cognito_generated_1.CfnUserPoolClient(this, 'Resource', {
            clientName: props.userPoolClientName,
            generateSecret: props.generateSecret,
            userPoolId: props.userPool.userPoolId,
            explicitAuthFlows: this.configureAuthFlows(props),
            allowedOAuthFlows: props.disableOAuth ? undefined : this.configureOAuthFlows(),
            allowedOAuthScopes: props.disableOAuth ? undefined : this.configureOAuthScopes(props.oAuth),
            callbackUrLs: callbackUrls && callbackUrls.length > 0 && !props.disableOAuth ? callbackUrls : undefined,
            logoutUrLs: props.oAuth?.logoutUrls,
            allowedOAuthFlowsUserPoolClient: !props.disableOAuth,
            preventUserExistenceErrors: this.configurePreventUserExistenceErrors(props.preventUserExistenceErrors),
            supportedIdentityProviders: this.configureIdentityProviders(props),
            readAttributes: props.readAttributes?.attributes(),
            writeAttributes: props.writeAttributes?.attributes(),
            enableTokenRevocation: props.enableTokenRevocation,
        });
        this.configureAuthSessionValidity(resource, props);
        this.configureTokenValidity(resource, props);
        this.userPoolClientId = resource.ref;
        this._userPoolClientName = props.userPoolClientName;
    }
    /**
     * Import a user pool client given its id.
     */
    static fromUserPoolClientId(scope, id, userPoolClientId) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.userPoolClientId = userPoolClientId;
            }
            get userPoolClientSecret() {
                throw new Error('UserPool Client Secret is not available for imported Clients');
            }
        }
        return new Import(scope, id);
    }
    /**
     * The client name that was specified via the `userPoolClientName` property during initialization,
     * throws an error otherwise.
     */
    get userPoolClientName() {
        if (this._userPoolClientName === undefined) {
            throw new Error('userPoolClientName is available only if specified on the UserPoolClient during initialization');
        }
        return this._userPoolClientName;
    }
    get userPoolClientSecret() {
        if (!this._generateSecret) {
            throw new Error('userPoolClientSecret is available only if generateSecret is set to true.');
        }
        // Create the Custom Resource that assists in resolving the User Pool Client secret
        // just once, no matter how many times this method is called
        if (!this._userPoolClientSecret) {
            this._userPoolClientSecret = core_1.SecretValue.resourceAttribute(new custom_resources_1.AwsCustomResource(this, 'DescribeCognitoUserPoolClient', {
                resourceType: 'Custom::DescribeCognitoUserPoolClient',
                onUpdate: {
                    region: core_1.Stack.of(this).region,
                    service: 'CognitoIdentityServiceProvider',
                    action: 'describeUserPoolClient',
                    parameters: {
                        UserPoolId: this.userPool.userPoolId,
                        ClientId: this.userPoolClientId,
                    },
                    physicalResourceId: custom_resources_1.PhysicalResourceId.of(this.userPoolClientId),
                },
                policy: custom_resources_1.AwsCustomResourcePolicy.fromSdkCalls({
                    resources: [this.userPool.userPoolArn],
                }),
                // APIs are available in 2.1055.0
                installLatestAwsSdk: false,
            }).getResponseField('UserPoolClient.ClientSecret'));
        }
        return this._userPoolClientSecret;
    }
    configureAuthFlows(props) {
        if (!props.authFlows || Object.keys(props.authFlows).length === 0)
            return undefined;
        const authFlows = [];
        if (props.authFlows.userPassword) {
            authFlows.push('ALLOW_USER_PASSWORD_AUTH');
        }
        if (props.authFlows.adminUserPassword) {
            authFlows.push('ALLOW_ADMIN_USER_PASSWORD_AUTH');
        }
        if (props.authFlows.custom) {
            authFlows.push('ALLOW_CUSTOM_AUTH');
        }
        if (props.authFlows.userSrp) {
            authFlows.push('ALLOW_USER_SRP_AUTH');
        }
        // refreshToken should always be allowed if authFlows are present
        authFlows.push('ALLOW_REFRESH_TOKEN_AUTH');
        return authFlows;
    }
    configureOAuthFlows() {
        if ((this.oAuthFlows.authorizationCodeGrant || this.oAuthFlows.implicitCodeGrant) && this.oAuthFlows.clientCredentials) {
            throw new Error('clientCredentials OAuth flow cannot be selected along with codeGrant or implicitGrant.');
        }
        const oAuthFlows = [];
        if (this.oAuthFlows.clientCredentials) {
            oAuthFlows.push('client_credentials');
        }
        if (this.oAuthFlows.implicitCodeGrant) {
            oAuthFlows.push('implicit');
        }
        if (this.oAuthFlows.authorizationCodeGrant) {
            oAuthFlows.push('code');
        }
        if (oAuthFlows.length === 0) {
            return undefined;
        }
        return oAuthFlows;
    }
    configureOAuthScopes(oAuth) {
        const scopes = oAuth?.scopes ?? [OAuthScope.PROFILE, OAuthScope.PHONE, OAuthScope.EMAIL, OAuthScope.OPENID,
            OAuthScope.COGNITO_ADMIN];
        const scopeNames = new Set(scopes.map((x) => x.scopeName));
        const autoOpenIdScopes = [OAuthScope.PHONE, OAuthScope.EMAIL, OAuthScope.PROFILE];
        if (autoOpenIdScopes.reduce((agg, s) => agg || scopeNames.has(s.scopeName), false)) {
            scopeNames.add(OAuthScope.OPENID.scopeName);
        }
        return Array.from(scopeNames);
    }
    configurePreventUserExistenceErrors(prevent) {
        if (prevent === undefined) {
            return undefined;
        }
        return prevent ? 'ENABLED' : 'LEGACY';
    }
    configureIdentityProviders(props) {
        let providers;
        if (!props.supportedIdentityProviders) {
            const providerSet = new Set(props.userPool.identityProviders.map((p) => p.providerName));
            providerSet.add('COGNITO');
            providers = Array.from(providerSet);
        }
        else {
            providers = props.supportedIdentityProviders.map((p) => p.name);
        }
        if (providers.length === 0) {
            return undefined;
        }
        return Array.from(providers);
    }
    configureAuthSessionValidity(resource, props) {
        this.validateDuration('authSessionValidity', core_1.Duration.minutes(3), core_1.Duration.minutes(15), props.authSessionValidity);
        resource.authSessionValidity = props.authSessionValidity ? props.authSessionValidity.toMinutes() : undefined;
    }
    configureTokenValidity(resource, props) {
        this.validateDuration('idTokenValidity', core_1.Duration.minutes(5), core_1.Duration.days(1), props.idTokenValidity);
        this.validateDuration('accessTokenValidity', core_1.Duration.minutes(5), core_1.Duration.days(1), props.accessTokenValidity);
        this.validateDuration('refreshTokenValidity', core_1.Duration.minutes(60), core_1.Duration.days(10 * 365), props.refreshTokenValidity);
        if (props.refreshTokenValidity) {
            this.validateDuration('idTokenValidity', core_1.Duration.minutes(5), props.refreshTokenValidity, props.idTokenValidity);
            this.validateDuration('accessTokenValidity', core_1.Duration.minutes(5), props.refreshTokenValidity, props.accessTokenValidity);
        }
        if (props.accessTokenValidity || props.idTokenValidity || props.refreshTokenValidity) {
            resource.tokenValidityUnits = {
                idToken: props.idTokenValidity ? 'minutes' : undefined,
                accessToken: props.accessTokenValidity ? 'minutes' : undefined,
                refreshToken: props.refreshTokenValidity ? 'minutes' : undefined,
            };
        }
        ;
        resource.idTokenValidity = props.idTokenValidity ? props.idTokenValidity.toMinutes() : undefined;
        resource.refreshTokenValidity = props.refreshTokenValidity ? props.refreshTokenValidity.toMinutes() : undefined;
        resource.accessTokenValidity = props.accessTokenValidity ? props.accessTokenValidity.toMinutes() : undefined;
    }
    validateDuration(name, min, max, value) {
        if (value === undefined) {
            return;
        }
        if (value.toMilliseconds() < min.toMilliseconds() || value.toMilliseconds() > max.toMilliseconds()) {
            throw new Error(`${name}: Must be a duration between ${min.toHumanString()} and ${max.toHumanString()} (inclusive); received ${value.toHumanString()}.`);
        }
    }
}
exports.UserPoolClient = UserPoolClient;
_c = JSII_RTTI_SYMBOL_1;
UserPoolClient[_c] = { fqn: "@aws-cdk/aws-cognito.UserPoolClient", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wb29sLWNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZXItcG9vbC1jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQWtGO0FBQ2xGLGdFQUEyRztBQUUzRywyREFBd0Q7QUE0RnhEOzs7R0FHRztBQUNILE1BQWEsVUFBVTtJQW9EckIsWUFBb0IsU0FBaUI7UUFDbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7S0FDNUI7SUF4QkQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBWTtRQUMvQixPQUFPLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzdCO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQStCLEVBQUUsS0FBMEI7Ozs7Ozs7Ozs7O1FBQ3RGLE9BQU8sSUFBSSxVQUFVLENBQUMsR0FBRyxNQUFNLENBQUMsd0JBQXdCLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7S0FDaEY7O0FBNUNILGdDQXVEQzs7O0FBdERDOzs7R0FHRztBQUNvQixnQkFBSyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRXZEOzs7R0FHRztBQUNvQixnQkFBSyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRXZEOztHQUVHO0FBQ29CLGlCQUFNLEdBQUcsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFekQ7OztHQUdHO0FBQ29CLGtCQUFPLEdBQUcsSUFBSSxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7QUFFM0Q7OztHQUdHO0FBQ29CLHdCQUFhLEdBQUcsSUFBSSxVQUFVLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQTZCekY7O0dBRUc7QUFDSCxNQUFhLDhCQUE4QjtJQXlDekMsWUFBb0IsSUFBWTtRQUM5QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztLQUNsQjtJ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IHsgSVJlc291cmNlLCBSZXNvdXJjZSwgRHVyYXRpb24sIFN0YWNrLCBTZWNyZXRWYWx1ZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQXdzQ3VzdG9tUmVzb3VyY2UsIEF3c0N1c3RvbVJlc291cmNlUG9saWN5LCBQaHlzaWNhbFJlc291cmNlSWQgfSBmcm9tICdAYXdzLWNkay9jdXN0b20tcmVzb3VyY2VzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuVXNlclBvb2xDbGllbnQgfSBmcm9tICcuL2NvZ25pdG8uZ2VuZXJhdGVkJztcbmltcG9ydCB7IElVc2VyUG9vbCB9IGZyb20gJy4vdXNlci1wb29sJztcbmltcG9ydCB7IENsaWVudEF0dHJpYnV0ZXMgfSBmcm9tICcuL3VzZXItcG9vbC1hdHRyJztcbmltcG9ydCB7IElVc2VyUG9vbFJlc291cmNlU2VydmVyLCBSZXNvdXJjZVNlcnZlclNjb3BlIH0gZnJvbSAnLi91c2VyLXBvb2wtcmVzb3VyY2Utc2VydmVyJztcblxuLyoqXG4gKiBUeXBlcyBvZiBhdXRoZW50aWNhdGlvbiBmbG93XG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2duaXRvL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9hbWF6b24tY29nbml0by11c2VyLXBvb2xzLWF1dGhlbnRpY2F0aW9uLWZsb3cuaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEF1dGhGbG93IHtcbiAgLyoqXG4gICAqIEVuYWJsZSBhZG1pbiBiYXNlZCB1c2VyIHBhc3N3b3JkIGF1dGhlbnRpY2F0aW9uIGZsb3dcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGFkbWluVXNlclBhc3N3b3JkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogRW5hYmxlIGN1c3RvbSBhdXRoZW50aWNhdGlvbiBmbG93XG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBjdXN0b20/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBFbmFibGUgYXV0aCB1c2luZyB1c2VybmFtZSAmIHBhc3N3b3JkXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSB1c2VyUGFzc3dvcmQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBFbmFibGUgU1JQIGJhc2VkIGF1dGhlbnRpY2F0aW9uXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSB1c2VyU3JwPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBPQXV0aCBzZXR0aW5ncyB0byBjb25maWd1cmUgdGhlIGludGVyYWN0aW9uIGJldHdlZW4gdGhlIGFwcCBhbmQgdGhpcyBjbGllbnQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgT0F1dGhTZXR0aW5ncyB7XG5cbiAgLyoqXG4gICAqIE9BdXRoIGZsb3dzIHRoYXQgYXJlIGFsbG93ZWQgd2l0aCB0aGlzIGNsaWVudC5cbiAgICogQHNlZSAtIHRoZSAnQWxsb3dlZCBPQXV0aCBGbG93cycgc2VjdGlvbiBhdCBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvY29nbml0by11c2VyLXBvb2xzLWFwcC1pZHAtc2V0dGluZ3MuaHRtbFxuICAgKiBAZGVmYXVsdCB7YXV0aG9yaXphdGlvbkNvZGVHcmFudDp0cnVlLGltcGxpY2l0Q29kZUdyYW50OnRydWV9XG4gICAqL1xuICByZWFkb25seSBmbG93cz86IE9BdXRoRmxvd3M7XG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgYWxsb3dlZCByZWRpcmVjdCBVUkxzIGZvciB0aGUgaWRlbnRpdHkgcHJvdmlkZXJzLlxuICAgKiBAZGVmYXVsdCAtIFsnaHR0cHM6Ly9leGFtcGxlLmNvbSddIGlmIGVpdGhlciBhdXRob3JpemF0aW9uQ29kZUdyYW50IG9yIGltcGxpY2l0Q29kZUdyYW50IGZsb3dzIGFyZSBlbmFibGVkLCBubyBjYWxsYmFjayBVUkxzIG90aGVyd2lzZS5cbiAgICovXG4gIHJlYWRvbmx5IGNhbGxiYWNrVXJscz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBMaXN0IG9mIGFsbG93ZWQgbG9nb3V0IFVSTHMgZm9yIHRoZSBpZGVudGl0eSBwcm92aWRlcnMuXG4gICAqIEBkZWZhdWx0IC0gbm8gbG9nb3V0IFVSTHNcbiAgICovXG4gIHJlYWRvbmx5IGxvZ291dFVybHM/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogT0F1dGggc2NvcGVzIHRoYXQgYXJlIGFsbG93ZWQgd2l0aCB0aGlzIGNsaWVudC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvY29nbml0by11c2VyLXBvb2xzLWFwcC1pZHAtc2V0dGluZ3MuaHRtbFxuICAgKiBAZGVmYXVsdCBbT0F1dGhTY29wZS5QSE9ORSxPQXV0aFNjb3BlLkVNQUlMLE9BdXRoU2NvcGUuT1BFTklELE9BdXRoU2NvcGUuUFJPRklMRSxPQXV0aFNjb3BlLkNPR05JVE9fQURNSU5dXG4gICAqL1xuICByZWFkb25seSBzY29wZXM/OiBPQXV0aFNjb3BlW107XG59XG5cbi8qKlxuICogVHlwZXMgb2YgT0F1dGggZ3JhbnQgZmxvd3NcbiAqIEBzZWUgLSB0aGUgJ0FsbG93ZWQgT0F1dGggRmxvd3MnIHNlY3Rpb24gYXQgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2NvZ25pdG8tdXNlci1wb29scy1hcHAtaWRwLXNldHRpbmdzLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBPQXV0aEZsb3dzIHtcbiAgLyoqXG4gICAqIEluaXRpYXRlIGFuIGF1dGhvcml6YXRpb24gY29kZSBncmFudCBmbG93LCB3aGljaCBwcm92aWRlcyBhbiBhdXRob3JpemF0aW9uIGNvZGUgYXMgdGhlIHJlc3BvbnNlLlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgYXV0aG9yaXphdGlvbkNvZGVHcmFudD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBjbGllbnQgc2hvdWxkIGdldCB0aGUgYWNjZXNzIHRva2VuIGFuZCBJRCB0b2tlbiBkaXJlY3RseS5cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGltcGxpY2l0Q29kZUdyYW50PzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQ2xpZW50IHNob3VsZCBnZXQgdGhlIGFjY2VzcyB0b2tlbiBhbmQgSUQgdG9rZW4gZnJvbSB0aGUgdG9rZW4gZW5kcG9pbnRcbiAgICogdXNpbmcgYSBjb21iaW5hdGlvbiBvZiBjbGllbnQgYW5kIGNsaWVudF9zZWNyZXQuXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBjbGllbnRDcmVkZW50aWFscz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogT0F1dGggc2NvcGVzIHRoYXQgYXJlIGFsbG93ZWQgd2l0aCB0aGlzIGNsaWVudC5cbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2NvZ25pdG8tdXNlci1wb29scy1hcHAtaWRwLXNldHRpbmdzLmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIE9BdXRoU2NvcGUge1xuICAvKipcbiAgICogR3JhbnRzIGFjY2VzcyB0byB0aGUgJ3Bob25lX251bWJlcicgYW5kICdwaG9uZV9udW1iZXJfdmVyaWZpZWQnIGNsYWltcy5cbiAgICogQXV0b21hdGljYWxseSBpbmNsdWRlcyBhY2Nlc3MgdG8gYE9BdXRoU2NvcGUuT1BFTklEYC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUEhPTkUgPSBuZXcgT0F1dGhTY29wZSgncGhvbmUnKTtcblxuICAvKipcbiAgICogR3JhbnRzIGFjY2VzcyB0byB0aGUgJ2VtYWlsJyBhbmQgJ2VtYWlsX3ZlcmlmaWVkJyBjbGFpbXMuXG4gICAqIEF1dG9tYXRpY2FsbHkgaW5jbHVkZXMgYWNjZXNzIHRvIGBPQXV0aFNjb3BlLk9QRU5JRGAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEVNQUlMID0gbmV3IE9BdXRoU2NvcGUoJ2VtYWlsJyk7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYWxsIHVzZXIgYXR0cmlidXRlcyBpbiB0aGUgSUQgdG9rZW4gdGhhdCBhcmUgcmVhZGFibGUgYnkgdGhlIGNsaWVudFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBPUEVOSUQgPSBuZXcgT0F1dGhTY29wZSgnb3BlbmlkJyk7XG5cbiAgLyoqXG4gICAqIEdyYW50cyBhY2Nlc3MgdG8gYWxsIHVzZXIgYXR0cmlidXRlcyB0aGF0IGFyZSByZWFkYWJsZSBieSB0aGUgY2xpZW50XG4gICAqIEF1dG9tYXRpY2FsbHkgaW5jbHVkZXMgYWNjZXNzIHRvIGBPQXV0aFNjb3BlLk9QRU5JRGAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFBST0ZJTEUgPSBuZXcgT0F1dGhTY29wZSgncHJvZmlsZScpO1xuXG4gIC8qKlxuICAgKiBHcmFudHMgYWNjZXNzIHRvIEFtYXpvbiBDb2duaXRvIFVzZXIgUG9vbCBBUEkgb3BlcmF0aW9ucyB0aGF0IHJlcXVpcmUgYWNjZXNzIHRva2VucyxcbiAgICogc3VjaCBhcyBVcGRhdGVVc2VyQXR0cmlidXRlcyBhbmQgVmVyaWZ5VXNlckF0dHJpYnV0ZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ09HTklUT19BRE1JTiA9IG5ldyBPQXV0aFNjb3BlKCdhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbicpO1xuXG4gIC8qKlxuICAgKiBDdXN0b20gc2NvcGUgaXMgb25lIHRoYXQgeW91IGRlZmluZSBmb3IgeW91ciBvd24gcmVzb3VyY2Ugc2VydmVyIGluIHRoZSBSZXNvdXJjZSBTZXJ2ZXJzLlxuICAgKiBUaGUgZm9ybWF0IGlzICdyZXNvdXJjZS1zZXJ2ZXItaWRlbnRpZmllci9zY29wZScuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2NvZ25pdG8tdXNlci1wb29scy1kZWZpbmUtcmVzb3VyY2Utc2VydmVycy5odG1sXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGN1c3RvbShuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gbmV3IE9BdXRoU2NvcGUobmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGN1c3RvbSBzY29wZSB0aGF0J3MgdGllZCB0byBhIHJlc291cmNlIHNlcnZlciBpbiB5b3VyIHN0YWNrXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlc291cmNlU2VydmVyKHNlcnZlcjogSVVzZXJQb29sUmVzb3VyY2VTZXJ2ZXIsIHNjb3BlOiBSZXNvdXJjZVNlcnZlclNjb3BlKSB7XG4gICAgcmV0dXJuIG5ldyBPQXV0aFNjb3BlKGAke3NlcnZlci51c2VyUG9vbFJlc291cmNlU2VydmVySWR9LyR7c2NvcGUuc2NvcGVOYW1lfWApO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoaXMgc2NvcGUgYXMgcmVjb2duaXplZCBieSBDbG91ZEZvcm1hdGlvbi5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtY29nbml0by11c2VycG9vbGNsaWVudC5odG1sI2Nmbi1jb2duaXRvLXVzZXJwb29sY2xpZW50LWFsbG93ZWRvYXV0aHNjb3Blc1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHNjb3BlTmFtZTogc3RyaW5nO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3Ioc2NvcGVOYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLnNjb3BlTmFtZSA9IHNjb3BlTmFtZTtcbiAgfVxufVxuXG4vKipcbiAqIElkZW50aXR5IHByb3ZpZGVycyBzdXBwb3J0ZWQgYnkgdGhlIFVzZXJQb29sQ2xpZW50XG4gKi9cbmV4cG9ydCBjbGFzcyBVc2VyUG9vbENsaWVudElkZW50aXR5UHJvdmlkZXIge1xuICAvKipcbiAgICogQWxsb3cgdXNlcnMgdG8gc2lnbiBpbiB1c2luZyAnU2lnbiBJbiBXaXRoIEFwcGxlJy5cbiAgICogQSBgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyQXBwbGVgIG11c3QgYmUgYXR0YWNoZWQgdG8gdGhlIHVzZXIgcG9vbC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQVBQTEUgPSBuZXcgVXNlclBvb2xDbGllbnRJZGVudGl0eVByb3ZpZGVyKCdTaWduSW5XaXRoQXBwbGUnKTtcblxuICAvKipcbiAgICogQWxsb3cgdXNlcnMgdG8gc2lnbiBpbiB1c2luZyAnRmFjZWJvb2sgTG9naW4nLlxuICAgKiBBIGBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJGYWNlYm9va2AgbXVzdCBiZSBhdHRhY2hlZCB0byB0aGUgdXNlciBwb29sLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBGQUNFQk9PSyA9IG5ldyBVc2VyUG9vbENsaWVudElkZW50aXR5UHJvdmlkZXIoJ0ZhY2Vib29rJyk7XG5cbiAgLyoqXG4gICAqIEFsbG93IHVzZXJzIHRvIHNpZ24gaW4gdXNpbmcgJ0dvb2dsZSBMb2dpbicuXG4gICAqIEEgYFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckdvb2dsZWAgbXVzdCBiZSBhdHRhY2hlZCB0byB0aGUgdXNlciBwb29sLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBHT09HTEUgPSBuZXcgVXNlclBvb2xDbGllbnRJZGVudGl0eVByb3ZpZGVyKCdHb29nbGUnKTtcblxuICAvKipcbiAgICogQWxsb3cgdXNlcnMgdG8gc2lnbiBpbiB1c2luZyAnTG9naW4gV2l0aCBBbWF6b24nLlxuICAgKiBBIGBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJBbWF6b25gIG11c3QgYmUgYXR0YWNoZWQgdG8gdGhlIHVzZXIgcG9vbC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQU1BWk9OID0gbmV3IFVzZXJQb29sQ2xpZW50SWRlbnRpdHlQcm92aWRlcignTG9naW5XaXRoQW1hem9uJyk7XG5cbiAgLyoqXG4gICAqIEFsbG93IHVzZXJzIHRvIHNpZ24gaW4gZGlyZWN0bHkgYXMgYSB1c2VyIG9mIHRoZSBVc2VyIFBvb2xcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ09HTklUTyA9IG5ldyBVc2VyUG9vbENsaWVudElkZW50aXR5UHJvdmlkZXIoJ0NPR05JVE8nKTtcblxuICAvKipcbiAgICogU3BlY2lmeSBhIHByb3ZpZGVyIG5vdCB5ZXQgc3VwcG9ydGVkIGJ5IHRoZSBDREsuXG4gICAqIEBwYXJhbSBuYW1lIG5hbWUgb2YgdGhlIGlkZW50aXR5IHByb3ZpZGVyIGFzIHJlY29nbml6ZWQgYnkgQ2xvdWRGb3JtYXRpb24gcHJvcGVydHkgYFN1cHBvcnRlZElkZW50aXR5UHJvdmlkZXJzYFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjdXN0b20obmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG5ldyBVc2VyUG9vbENsaWVudElkZW50aXR5UHJvdmlkZXIobmFtZSk7XG4gIH1cblxuICAvKiogVGhlIG5hbWUgb2YgdGhlIGlkZW50aXR5IHByb3ZpZGVyIGFzIHJlY29nbml6ZWQgYnkgQ2xvdWRGb3JtYXRpb24gcHJvcGVydHkgYFN1cHBvcnRlZElkZW50aXR5UHJvdmlkZXJzYCAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgdG8gY3JlYXRlIGEgVXNlclBvb2xDbGllbnRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVc2VyUG9vbENsaWVudE9wdGlvbnMge1xuICAvKipcbiAgICogTmFtZSBvZiB0aGUgYXBwbGljYXRpb24gY2xpZW50XG4gICAqIEBkZWZhdWx0IC0gY2xvdWRmb3JtYXRpb24gZ2VuZXJhdGVkIG5hbWVcbiAgICovXG4gIHJlYWRvbmx5IHVzZXJQb29sQ2xpZW50TmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciB0byBnZW5lcmF0ZSBhIGNsaWVudCBzZWNyZXRcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGdlbmVyYXRlU2VjcmV0PzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIHNldCBvZiBPQXV0aCBhdXRoZW50aWNhdGlvbiBmbG93cyB0byBlbmFibGUgb24gdGhlIGNsaWVudFxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2duaXRvL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9hbWF6b24tY29nbml0by11c2VyLXBvb2xzLWF1dGhlbnRpY2F0aW9uLWZsb3cuaHRtbFxuICAgKiBAZGVmYXVsdCAtIGFsbCBhdXRoIGZsb3dzIGRpc2FibGVkXG4gICAqL1xuICByZWFkb25seSBhdXRoRmxvd3M/OiBBdXRoRmxvdztcblxuICAvKipcbiAgICogVHVybnMgb2ZmIGFsbCBPQXV0aCBpbnRlcmFjdGlvbnMgZm9yIHRoaXMgY2xpZW50LlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgZGlzYWJsZU9BdXRoPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogT0F1dGggc2V0dGluZ3MgZm9yIHRoaXMgY2xpZW50IHRvIGludGVyYWN0IHdpdGggdGhlIGFwcC5cbiAgICogQW4gZXJyb3IgaXMgdGhyb3duIHdoZW4gdGhpcyBpcyBzcGVjaWZpZWQgYW5kIGBkaXNhYmxlT0F1dGhgIGlzIHNldC5cbiAgICogQGRlZmF1bHQgLSBzZWUgZGVmYXVsdHMgaW4gYE9BdXRoU2V0dGluZ3NgLiBtZWFuaW5nbGVzcyBpZiBgZGlzYWJsZU9BdXRoYCBpcyBzZXQuXG4gICAqL1xuICByZWFkb25seSBvQXV0aD86IE9BdXRoU2V0dGluZ3M7XG5cbiAgLyoqXG4gICAqIENvZ25pdG8gY3JlYXRlcyBhIHNlc3Npb24gdG9rZW4gZm9yIGVhY2ggQVBJIHJlcXVlc3QgaW4gYW4gYXV0aGVudGljYXRpb24gZmxvdy5cbiAgICogQXV0aFNlc3Npb25WYWxpZGl0eSBpcyB0aGUgZHVyYXRpb24sIGluIG1pbnV0ZXMsIG9mIHRoYXQgc2Vzc2lvbiB0b2tlbi5cbiAgICogc2VlIGRlZmF1bHRzIGluIGBBdXRoU2Vzc2lvblZhbGlkaXR5YC4gVmFsaWQgZHVyYXRpb24gaXMgZnJvbSAzIHRvIDE1IG1pbnV0ZXMuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWNvZ25pdG8tdXNlcnBvb2xjbGllbnQuaHRtbCNjZm4tY29nbml0by11c2VycG9vbGNsaWVudC1hdXRoc2Vzc2lvbnZhbGlkaXR5XG4gICAqIEBkZWZhdWx0IC0gRHVyYXRpb24ubWludXRlcygzKVxuICAgKi9cbiAgcmVhZG9ubHkgYXV0aFNlc3Npb25WYWxpZGl0eT86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIENvZ25pdG8gcmV0dXJucyBhIFVzZXJOb3RGb3VuZEV4Y2VwdGlvbiBleGNlcHRpb24gd2hlbiB0aGVcbiAgICogdXNlciBkb2VzIG5vdCBleGlzdCBpbiB0aGUgdXNlciBwb29sIChmYWxzZSksIG9yIHdoZXRoZXIgaXQgcmV0dXJuc1xuICAgKiBhbm90aGVyIHR5cGUgb2YgZXJyb3IgdGhhdCBkb2Vzbid0IHJldmVhbCB0aGUgdXNlcidzIGFic2VuY2UuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2NvZ25pdG8tdXNlci1wb29sLW1hbmFnaW5nLWVycm9ycy5odG1sXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBwcmV2ZW50VXNlckV4aXN0ZW5jZUVycm9ycz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBsaXN0IG9mIGlkZW50aXR5IHByb3ZpZGVycyB0aGF0IHVzZXJzIHNob3VsZCBiZSBhYmxlIHRvIHVzZSB0byBzaWduIGluIHVzaW5nIHRoaXMgY2xpZW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHN1cHBvcnRzIGFsbCBpZGVudGl0eSBwcm92aWRlcnMgdGhhdCBhcmUgcmVnaXN0ZXJlZCB3aXRoIHRoZSB1c2VyIHBvb2wuIElmIHRoZSB1c2VyIHBvb2wgYW5kL29yXG4gICAqIGlkZW50aXR5IHByb3ZpZGVycyBhcmUgaW1wb3J0ZWQsIGVpdGhlciBzcGVjaWZ5IHRoaXMgb3B0aW9uIGV4cGxpY2l0bHkgb3IgZW5zdXJlIHRoYXQgdGhlIGlkZW50aXR5IHByb3ZpZGVycyBhcmVcbiAgICogcmVnaXN0ZXJlZCB3aXRoIHRoZSB1c2VyIHBvb2wgdXNpbmcgdGhlIGBVc2VyUG9vbC5yZWdpc3RlcklkZW50aXR5UHJvdmlkZXIoKWAgQVBJLlxuICAgKi9cbiAgcmVhZG9ubHkgc3VwcG9ydGVkSWRlbnRpdHlQcm92aWRlcnM/OiBVc2VyUG9vbENsaWVudElkZW50aXR5UHJvdmlkZXJbXTtcblxuICAvKipcbiAgICogVmFsaWRpdHkgb2YgdGhlIElEIHRva2VuLlxuICAgKiBWYWx1ZXMgYmV0d2VlbiA1IG1pbnV0ZXMgYW5kIDEgZGF5IGFyZSB2YWxpZC4gVGhlIGR1cmF0aW9uIGNhbiBub3QgYmUgbG9uZ2VyIHRoYW4gdGhlIHJlZnJlc2ggdG9rZW4gdmFsaWRpdHkuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2VuX3VzL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2FtYXpvbi1jb2duaXRvLXVzZXItcG9vbHMtdXNpbmctdG9rZW5zLXdpdGgtaWRlbnRpdHktcHJvdmlkZXJzLmh0bWwjYW1hem9uLWNvZ25pdG8tdXNlci1wb29scy11c2luZy10aGUtaWQtdG9rZW5cbiAgICogQGRlZmF1bHQgRHVyYXRpb24ubWludXRlcyg2MClcbiAgICovXG4gIHJlYWRvbmx5IGlkVG9rZW5WYWxpZGl0eT86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBWYWxpZGl0eSBvZiB0aGUgcmVmcmVzaCB0b2tlbi5cbiAgICogVmFsdWVzIGJldHdlZW4gNjAgbWludXRlcyBhbmQgMTAgeWVhcnMgYXJlIHZhbGlkLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9lbl91cy9jb2duaXRvL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9hbWF6b24tY29nbml0by11c2VyLXBvb2xzLXVzaW5nLXRva2Vucy13aXRoLWlkZW50aXR5LXByb3ZpZGVycy5odG1sI2FtYXpvbi1jb2duaXRvLXVzZXItcG9vbHMtdXNpbmctdGhlLXJlZnJlc2gtdG9rZW5cbiAgICogQGRlZmF1bHQgRHVyYXRpb24uZGF5cygzMClcbiAgICovXG4gIHJlYWRvbmx5IHJlZnJlc2hUb2tlblZhbGlkaXR5PzogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFZhbGlkaXR5IG9mIHRoZSBhY2Nlc3MgdG9rZW4uXG4gICAqIFZhbHVlcyBiZXR3ZWVuIDUgbWludXRlcyBhbmQgMSBkYXkgYXJlIHZhbGlkLiBUaGUgZHVyYXRpb24gY2FuIG5vdCBiZSBsb25nZXIgdGhhbiB0aGUgcmVmcmVzaCB0b2tlbiB2YWxpZGl0eS5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZW5fdXMvY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvYW1hem9uLWNvZ25pdG8tdXNlci1wb29scy11c2luZy10b2tlbnMtd2l0aC1pZGVudGl0eS1wcm92aWRlcnMuaHRtbCNhbWF6b24tY29nbml0by11c2VyLXBvb2xzLXVzaW5nLXRoZS1hY2Nlc3MtdG9rZW5cbiAgICogQGRlZmF1bHQgRHVyYXRpb24ubWludXRlcyg2MClcbiAgICovXG4gIHJlYWRvbmx5IGFjY2Vzc1Rva2VuVmFsaWRpdHk/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogVGhlIHNldCBvZiBhdHRyaWJ1dGVzIHRoaXMgY2xpZW50IHdpbGwgYmUgYWJsZSB0byByZWFkLlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2duaXRvL2xhdGVzdC9kZXZlbG9wZXJndWlkZS91c2VyLXBvb2wtc2V0dGluZ3MtYXR0cmlidXRlcy5odG1sI3VzZXItcG9vbC1zZXR0aW5ncy1hdHRyaWJ1dGUtcGVybWlzc2lvbnMtYW5kLXNjb3Blc1xuICAgKiBAZGVmYXVsdCAtIGFsbCBzdGFuZGFyZCBhbmQgY3VzdG9tIGF0dHJpYnV0ZXNcbiAgICovXG4gIHJlYWRvbmx5IHJlYWRBdHRyaWJ1dGVzPzogQ2xpZW50QXR0cmlidXRlcztcblxuICAvKipcbiAgICogVGhlIHNldCBvZiBhdHRyaWJ1dGVzIHRoaXMgY2xpZW50IHdpbGwgYmUgYWJsZSB0byB3cml0ZS5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdXNlci1wb29sLXNldHRpbmdzLWF0dHJpYnV0ZXMuaHRtbCN1c2VyLXBvb2wtc2V0dGluZ3MtYXR0cmlidXRlLXBlcm1pc3Npb25zLWFuZC1zY29wZXNcbiAgICogQGRlZmF1bHQgLSBhbGwgc3RhbmRhcmQgYW5kIGN1c3RvbSBhdHRyaWJ1dGVzXG4gICAqL1xuICByZWFkb25seSB3cml0ZUF0dHJpYnV0ZXM/OiBDbGllbnRBdHRyaWJ1dGVzO1xuXG4gIC8qKlxuICAgKiBFbmFibGUgdG9rZW4gcmV2b2NhdGlvbiBmb3IgdGhpcyBjbGllbnQuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3Rva2VuLXJldm9jYXRpb24uaHRtbCNlbmFibGUtdG9rZW4tcmV2b2NhdGlvblxuICAgKiBAZGVmYXVsdCB0cnVlIGZvciBuZXcgdXNlciBwb29sIGNsaWVudHNcbiAgICovXG4gIHJlYWRvbmx5IGVuYWJsZVRva2VuUmV2b2NhdGlvbj86IGJvb2xlYW47XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgdGhlIFVzZXJQb29sQ2xpZW50IGNvbnN0cnVjdFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVzZXJQb29sQ2xpZW50UHJvcHMgZXh0ZW5kcyBVc2VyUG9vbENsaWVudE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIFVzZXJQb29sIHJlc291cmNlIHRoaXMgY2xpZW50IHdpbGwgaGF2ZSBhY2Nlc3MgdG9cbiAgICovXG4gIHJlYWRvbmx5IHVzZXJQb29sOiBJVXNlclBvb2w7XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIENvZ25pdG8gdXNlciBwb29sIGNsaWVudC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJVXNlclBvb2xDbGllbnQgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogTmFtZSBvZiB0aGUgYXBwbGljYXRpb24gY2xpZW50XG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHVzZXJQb29sQ2xpZW50SWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGdlbmVyYXRlZCBjbGllbnQgc2VjcmV0LiBPbmx5IGF2YWlsYWJsZSBpZiB0aGUgXCJnZW5lcmF0ZVNlY3JldFwiIHByb3BzIGlzIHNldCB0byB0cnVlXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IHVzZXJQb29sQ2xpZW50U2VjcmV0OiBTZWNyZXRWYWx1ZTtcbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBVc2VyUG9vbCBBcHAgQ2xpZW50XG4gKi9cbmV4cG9ydCBjbGFzcyBVc2VyUG9vbENsaWVudCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVVzZXJQb29sQ2xpZW50IHtcblxuICAvKipcbiAgICogSW1wb3J0IGEgdXNlciBwb29sIGNsaWVudCBnaXZlbiBpdHMgaWQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Vc2VyUG9vbENsaWVudElkKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHVzZXJQb29sQ2xpZW50SWQ6IHN0cmluZyk6IElVc2VyUG9vbENsaWVudCB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJVXNlclBvb2xDbGllbnQge1xuICAgICAgcHVibGljIHJlYWRvbmx5IHVzZXJQb29sQ2xpZW50SWQgPSB1c2VyUG9vbENsaWVudElkO1xuICAgICAgZ2V0IHVzZXJQb29sQ2xpZW50U2VjcmV0KCk6IFNlY3JldFZhbHVlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVc2VyUG9vbCBDbGllbnQgU2VjcmV0IGlzIG5vdCBhdmFpbGFibGUgZm9yIGltcG9ydGVkIENsaWVudHMnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IHVzZXJQb29sQ2xpZW50SWQ6IHN0cmluZztcblxuICBwcml2YXRlIF9nZW5lcmF0ZVNlY3JldD86IGJvb2xlYW47XG4gIHByaXZhdGUgcmVhZG9ubHkgdXNlclBvb2w6IElVc2VyUG9vbDtcbiAgcHJpdmF0ZSBfdXNlclBvb2xDbGllbnRTZWNyZXQ/OiBTZWNyZXRWYWx1ZTtcblxuICAvKipcbiAgICogVGhlIE9BdXRoIGZsb3dzIGVuYWJsZWQgZm9yIHRoaXMgY2xpZW50LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG9BdXRoRmxvd3M6IE9BdXRoRmxvd3M7XG4gIHByaXZhdGUgcmVhZG9ubHkgX3VzZXJQb29sQ2xpZW50TmFtZT86IHN0cmluZztcblxuICAvKlxuICAgKiBOb3RlIHRvIGltcGxlbWVudGVyczogVHdvIENsb3VkRm9ybWF0aW9uIHJldHVybiB2YWx1ZXMgTmFtZSBhbmQgQ2xpZW50U2VjcmV0IGFyZSBwYXJ0IG9mIHRoZSBzcGVjLlxuICAgKiBIb3dldmVyLCB0aGV5IGhhdmUgYmVlbiBleHBsaWNpdHkgbm90IGltcGxlbWVudGVkIGhlcmUuIFRoZXkgYXJlIG5vdCBkb2N1bWVudGVkIGluIENsb3VkRm9ybWF0aW9uLCBhbmRcbiAgICogQ2xvdWRGb3JtYXRpb24gcmV0dXJucyB0aGUgZm9sbG93aW5nIHRoZSBzdHJpbmcgd2hlbiB0aGVzZSB0d28gYXR0cmlidXRlcyBhcmUgJ0dldEF0dCcgLSBcImF0dHJpYnV0ZSBub3Qgc3VwcG9ydGVkXG4gICAqIGF0IHRoaXMgdGltZSwgcGxlYXNlIHVzZSB0aGUgQ0xJIG9yIENvbnNvbGUgdG8gcmV0cmlldmUgdGhpcyB2YWx1ZVwiLlxuICAgKiBBd2FpdGluZyB1cGRhdGVzIGZyb20gQ2xvdWRGb3JtYXRpb24uXG4gICAqL1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBVc2VyUG9vbENsaWVudFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGlmIChwcm9wcy5kaXNhYmxlT0F1dGggJiYgcHJvcHMub0F1dGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignT0F1dGggc2V0dGluZ3MgY2Fubm90IGJlIHNwZWNpZmllZCB3aGVuIGRpc2FibGVPQXV0aCBpcyBzZXQuJyk7XG4gICAgfVxuXG4gICAgdGhpcy5vQXV0aEZsb3dzID0gcHJvcHMub0F1dGg/LmZsb3dzID8/IHtcbiAgICAgIGltcGxpY2l0Q29kZUdyYW50OiB0cnVlLFxuICAgICAgYXV0aG9yaXphdGlvbkNvZGVHcmFudDogdHJ1ZSxcbiAgICB9O1xuXG4gICAgbGV0IGNhbGxiYWNrVXJsczogc3RyaW5nW10gfCB1bmRlZmluZWQgPSBwcm9wcy5vQXV0aD8uY2FsbGJhY2tVcmxzO1xuICAgIGlmICh0aGlzLm9BdXRoRmxvd3MuYXV0aG9yaXphdGlvbkNvZGVHcmFudCB8fCB0aGlzLm9BdXRoRmxvd3MuaW1wbGljaXRDb2RlR3JhbnQpIHtcbiAgICAgIGlmIChjYWxsYmFja1VybHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjYWxsYmFja1VybHMgPSBbJ2h0dHBzOi8vZXhhbXBsZS5jb20nXTtcbiAgICAgIH0gZWxzZSBpZiAoY2FsbGJhY2tVcmxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NhbGxiYWNrVXJsIG11c3Qgbm90IGJlIGVtcHR5IHdoZW4gY29kZUdyYW50IG9yIGltcGxpY2l0R3JhbnQgT0F1dGggZmxvd3MgYXJlIGVuYWJsZWQuJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fZ2VuZXJhdGVTZWNyZXQgPSBwcm9wcy5nZW5lcmF0ZVNlY3JldDtcbiAgICB0aGlzLnVzZXJQb29sID0gcHJvcHMudXNlclBvb2w7XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5Vc2VyUG9vbENsaWVudCh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBjbGllbnROYW1lOiBwcm9wcy51c2VyUG9vbENsaWVudE5hbWUsXG4gICAgICBnZW5lcmF0ZVNlY3JldDogcHJvcHMuZ2VuZXJhdGVTZWNyZXQsXG4gICAgICB1c2VyUG9vbElkOiBwcm9wcy51c2VyUG9vbC51c2VyUG9vbElkLFxuICAgICAgZXhwbGljaXRBdXRoRmxvd3M6IHRoaXMuY29uZmlndXJlQXV0aEZsb3dzKHByb3BzKSxcbiAgICAgIGFsbG93ZWRPQXV0aEZsb3dzOiBwcm9wcy5kaXNhYmxlT0F1dGggPyB1bmRlZmluZWQgOiB0aGlzLmNvbmZpZ3VyZU9BdXRoRmxvd3MoKSxcbiAgICAgIGFsbG93ZWRPQXV0aFNjb3BlczogcHJvcHMuZGlzYWJsZU9BdXRoID8gdW5kZWZpbmVkIDogdGhpcy5jb25maWd1cmVPQXV0aFNjb3Blcyhwcm9wcy5vQXV0aCksXG4gICAgICBjYWxsYmFja1VyTHM6IGNhbGxiYWNrVXJscyAmJiBjYWxsYmFja1VybHMubGVuZ3RoID4gMCAmJiAhcHJvcHMuZGlzYWJsZU9BdXRoID8gY2FsbGJhY2tVcmxzIDogdW5kZWZpbmVkLFxuICAgICAgbG9nb3V0VXJMczogcHJvcHMub0F1dGg/LmxvZ291dFVybHMsXG4gICAgICBhbGxvd2VkT0F1dGhGbG93c1VzZXJQb29sQ2xpZW50OiAhcHJvcHMuZGlzYWJsZU9BdXRoLFxuICAgICAgcHJldmVudFVzZXJFeGlzdGVuY2VFcnJvcnM6IHRoaXMuY29uZmlndXJlUHJldmVudFVzZXJFeGlzdGVuY2VFcnJvcnMocHJvcHMucHJldmVudFVzZXJFeGlzdGVuY2VFcnJvcnMpLFxuICAgICAgc3VwcG9ydGVkSWRlbnRpdHlQcm92aWRlcnM6IHRoaXMuY29uZmlndXJlSWRlbnRpdHlQcm92aWRlcnMocHJvcHMpLFxuICAgICAgcmVhZEF0dHJpYnV0ZXM6IHByb3BzLnJlYWRBdHRyaWJ1dGVzPy5hdHRyaWJ1dGVzKCksXG4gICAgICB3cml0ZUF0dHJpYnV0ZXM6IHByb3BzLndyaXRlQXR0cmlidXRlcz8uYXR0cmlidXRlcygpLFxuICAgICAgZW5hYmxlVG9rZW5SZXZvY2F0aW9uOiBwcm9wcy5lbmFibGVUb2tlblJldm9jYXRpb24sXG4gICAgfSk7XG4gICAgdGhpcy5jb25maWd1cmVBdXRoU2Vzc2lvblZhbGlkaXR5KHJlc291cmNlLCBwcm9wcyk7XG4gICAgdGhpcy5jb25maWd1cmVUb2tlblZhbGlkaXR5KHJlc291cmNlLCBwcm9wcyk7XG5cbiAgICB0aGlzLnVzZXJQb29sQ2xpZW50SWQgPSByZXNvdXJjZS5yZWY7XG4gICAgdGhpcy5fdXNlclBvb2xDbGllbnROYW1lID0gcHJvcHMudXNlclBvb2xDbGllbnROYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjbGllbnQgbmFtZSB0aGF0IHdhcyBzcGVjaWZpZWQgdmlhIHRoZSBgdXNlclBvb2xDbGllbnROYW1lYCBwcm9wZXJ0eSBkdXJpbmcgaW5pdGlhbGl6YXRpb24sXG4gICAqIHRocm93cyBhbiBlcnJvciBvdGhlcndpc2UuXG4gICAqL1xuICBwdWJsaWMgZ2V0IHVzZXJQb29sQ2xpZW50TmFtZSgpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLl91c2VyUG9vbENsaWVudE5hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd1c2VyUG9vbENsaWVudE5hbWUgaXMgYXZhaWxhYmxlIG9ubHkgaWYgc3BlY2lmaWVkIG9uIHRoZSBVc2VyUG9vbENsaWVudCBkdXJpbmcgaW5pdGlhbGl6YXRpb24nKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3VzZXJQb29sQ2xpZW50TmFtZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgdXNlclBvb2xDbGllbnRTZWNyZXQoKTogU2VjcmV0VmFsdWUge1xuICAgIGlmICghdGhpcy5fZ2VuZXJhdGVTZWNyZXQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ3VzZXJQb29sQ2xpZW50U2VjcmV0IGlzIGF2YWlsYWJsZSBvbmx5IGlmIGdlbmVyYXRlU2VjcmV0IGlzIHNldCB0byB0cnVlLicsXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSB0aGUgQ3VzdG9tIFJlc291cmNlIHRoYXQgYXNzaXN0cyBpbiByZXNvbHZpbmcgdGhlIFVzZXIgUG9vbCBDbGllbnQgc2VjcmV0XG4gICAgLy8ganVzdCBvbmNlLCBubyBtYXR0ZXIgaG93IG1hbnkgdGltZXMgdGhpcyBtZXRob2QgaXMgY2FsbGVkXG4gICAgaWYgKCF0aGlzLl91c2VyUG9vbENsaWVudFNlY3JldCkge1xuICAgICAgdGhpcy5fdXNlclBvb2xDbGllbnRTZWNyZXQgPSBTZWNyZXRWYWx1ZS5yZXNvdXJjZUF0dHJpYnV0ZShuZXcgQXdzQ3VzdG9tUmVzb3VyY2UoXG4gICAgICAgIHRoaXMsXG4gICAgICAgICdEZXNjcmliZUNvZ25pdG9Vc2VyUG9vbENsaWVudCcsXG4gICAgICAgIHtcbiAgICAgICAgICByZXNvdXJjZVR5cGU6ICdDdXN0b206OkRlc2NyaWJlQ29nbml0b1VzZXJQb29sQ2xpZW50JyxcbiAgICAgICAgICBvblVwZGF0ZToge1xuICAgICAgICAgICAgcmVnaW9uOiBTdGFjay5vZih0aGlzKS5yZWdpb24sXG4gICAgICAgICAgICBzZXJ2aWNlOiAnQ29nbml0b0lkZW50aXR5U2VydmljZVByb3ZpZGVyJyxcbiAgICAgICAgICAgIGFjdGlvbjogJ2Rlc2NyaWJlVXNlclBvb2xDbGllbnQnLFxuICAgICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICBVc2VyUG9vbElkOiB0aGlzLnVzZXJQb29sLnVzZXJQb29sSWQsXG4gICAgICAgICAgICAgIENsaWVudElkOiB0aGlzLnVzZXJQb29sQ2xpZW50SWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQub2YodGhpcy51c2VyUG9vbENsaWVudElkKSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHtcbiAgICAgICAgICAgIHJlc291cmNlczogW3RoaXMudXNlclBvb2wudXNlclBvb2xBcm5dLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIC8vIEFQSXMgYXJlIGF2YWlsYWJsZSBpbiAyLjEwNTUuMFxuICAgICAgICAgIGluc3RhbGxMYXRlc3RBd3NTZGs6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgKS5nZXRSZXNwb25zZUZpZWxkKCdVc2VyUG9vbENsaWVudC5DbGllbnRTZWNyZXQnKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3VzZXJQb29sQ2xpZW50U2VjcmV0O1xuICB9XG5cbiAgcHJpdmF0ZSBjb25maWd1cmVBdXRoRmxvd3MocHJvcHM6IFVzZXJQb29sQ2xpZW50UHJvcHMpOiBzdHJpbmdbXSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCFwcm9wcy5hdXRoRmxvd3MgfHwgT2JqZWN0LmtleXMocHJvcHMuYXV0aEZsb3dzKS5sZW5ndGggPT09IDApIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBhdXRoRmxvd3M6IHN0cmluZ1tdID0gW107XG4gICAgaWYgKHByb3BzLmF1dGhGbG93cy51c2VyUGFzc3dvcmQpIHsgYXV0aEZsb3dzLnB1c2goJ0FMTE9XX1VTRVJfUEFTU1dPUkRfQVVUSCcpOyB9XG4gICAgaWYgKHByb3BzLmF1dGhGbG93cy5hZG1pblVzZXJQYXNzd29yZCkgeyBhdXRoRmxvd3MucHVzaCgnQUxMT1dfQURNSU5fVVNFUl9QQVNTV09SRF9BVVRIJyk7IH1cbiAgICBpZiAocHJvcHMuYXV0aEZsb3dzLmN1c3RvbSkgeyBhdXRoRmxvd3MucHVzaCgnQUxMT1dfQ1VTVE9NX0FVVEgnKTsgfVxuICAgIGlmIChwcm9wcy5hdXRoRmxvd3MudXNlclNycCkgeyBhdXRoRmxvd3MucHVzaCgnQUxMT1dfVVNFUl9TUlBfQVVUSCcpOyB9XG5cbiAgICAvLyByZWZyZXNoVG9rZW4gc2hvdWxkIGFsd2F5cyBiZSBhbGxvd2VkIGlmIGF1dGhGbG93cyBhcmUgcHJlc2VudFxuICAgIGF1dGhGbG93cy5wdXNoKCdBTExPV19SRUZSRVNIX1RPS0VOX0FVVEgnKTtcblxuICAgIHJldHVybiBhdXRoRmxvd3M7XG4gIH1cblxuICBwcml2YXRlIGNvbmZpZ3VyZU9BdXRoRmxvd3MoKTogc3RyaW5nW10gfCB1bmRlZmluZWQge1xuICAgIGlmICgodGhpcy5vQXV0aEZsb3dzLmF1dGhvcml6YXRpb25Db2RlR3JhbnQgfHwgdGhpcy5vQXV0aEZsb3dzLmltcGxpY2l0Q29kZUdyYW50KSAmJiB0aGlzLm9BdXRoRmxvd3MuY2xpZW50Q3JlZGVudGlhbHMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY2xpZW50Q3JlZGVudGlhbHMgT0F1dGggZmxvdyBjYW5ub3QgYmUgc2VsZWN0ZWQgYWxvbmcgd2l0aCBjb2RlR3JhbnQgb3IgaW1wbGljaXRHcmFudC4nKTtcbiAgICB9XG4gICAgY29uc3Qgb0F1dGhGbG93czogc3RyaW5nW10gPSBbXTtcbiAgICBpZiAodGhpcy5vQXV0aEZsb3dzLmNsaWVudENyZWRlbnRpYWxzKSB7IG9BdXRoRmxvd3MucHVzaCgnY2xpZW50X2NyZWRlbnRpYWxzJyk7IH1cbiAgICBpZiAodGhpcy5vQXV0aEZsb3dzLmltcGxpY2l0Q29kZUdyYW50KSB7IG9BdXRoRmxvd3MucHVzaCgnaW1wbGljaXQnKTsgfVxuICAgIGlmICh0aGlzLm9BdXRoRmxvd3MuYXV0aG9yaXphdGlvbkNvZGVHcmFudCkgeyBvQXV0aEZsb3dzLnB1c2goJ2NvZGUnKTsgfVxuXG4gICAgaWYgKG9BdXRoRmxvd3MubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gb0F1dGhGbG93cztcbiAgfVxuXG4gIHByaXZhdGUgY29uZmlndXJlT0F1dGhTY29wZXMob0F1dGg/OiBPQXV0aFNldHRpbmdzKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IHNjb3BlcyA9IG9BdXRoPy5zY29wZXMgPz8gW09BdXRoU2NvcGUuUFJPRklMRSwgT0F1dGhTY29wZS5QSE9ORSwgT0F1dGhTY29wZS5FTUFJTCwgT0F1dGhTY29wZS5PUEVOSUQsXG4gICAgICBPQXV0aFNjb3BlLkNPR05JVE9fQURNSU5dO1xuICAgIGNvbnN0IHNjb3BlTmFtZXMgPSBuZXcgU2V0KHNjb3Blcy5tYXAoKHgpID0+IHguc2NvcGVOYW1lKSk7XG4gICAgY29uc3QgYXV0b09wZW5JZFNjb3BlcyA9IFtPQXV0aFNjb3BlLlBIT05FLCBPQXV0aFNjb3BlLkVNQUlMLCBPQXV0aFNjb3BlLlBST0ZJTEVdO1xuICAgIGlmIChhdXRvT3BlbklkU2NvcGVzLnJlZHVjZSgoYWdnLCBzKSA9PiBhZ2cgfHwgc2NvcGVOYW1lcy5oYXMocy5zY29wZU5hbWUpLCBmYWxzZSkpIHtcbiAgICAgIHNjb3BlTmFtZXMuYWRkKE9BdXRoU2NvcGUuT1BFTklELnNjb3BlTmFtZSk7XG4gICAgfVxuICAgIHJldHVybiBBcnJheS5mcm9tKHNjb3BlTmFtZXMpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25maWd1cmVQcmV2ZW50VXNlckV4aXN0ZW5jZUVycm9ycyhwcmV2ZW50PzogYm9vbGVhbik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHByZXZlbnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIHByZXZlbnQgPyAnRU5BQkxFRCcgOiAnTEVHQUNZJztcbiAgfVxuXG4gIHByaXZhdGUgY29uZmlndXJlSWRlbnRpdHlQcm92aWRlcnMocHJvcHM6IFVzZXJQb29sQ2xpZW50UHJvcHMpOiBzdHJpbmdbXSB8IHVuZGVmaW5lZCB7XG4gICAgbGV0IHByb3ZpZGVyczogc3RyaW5nW107XG4gICAgaWYgKCFwcm9wcy5zdXBwb3J0ZWRJZGVudGl0eVByb3ZpZGVycykge1xuICAgICAgY29uc3QgcHJvdmlkZXJTZXQgPSBuZXcgU2V0KHByb3BzLnVzZXJQb29sLmlkZW50aXR5UHJvdmlkZXJzLm1hcCgocCkgPT4gcC5wcm92aWRlck5hbWUpKTtcbiAgICAgIHByb3ZpZGVyU2V0LmFkZCgnQ09HTklUTycpO1xuICAgICAgcHJvdmlkZXJzID0gQXJyYXkuZnJvbShwcm92aWRlclNldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb3ZpZGVycyA9IHByb3BzLnN1cHBvcnRlZElkZW50aXR5UHJvdmlkZXJzLm1hcCgocCkgPT4gcC5uYW1lKTtcbiAgICB9XG4gICAgaWYgKHByb3ZpZGVycy5sZW5ndGggPT09IDApIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICAgIHJldHVybiBBcnJheS5mcm9tKHByb3ZpZGVycyk7XG4gIH1cblxuICBwcml2YXRlIGNvbmZpZ3VyZUF1dGhTZXNzaW9uVmFsaWRpdHkocmVzb3VyY2U6IENmblVzZXJQb29sQ2xpZW50LCBwcm9wczogVXNlclBvb2xDbGllbnRQcm9wcykge1xuICAgIHRoaXMudmFsaWRhdGVEdXJhdGlvbignYXV0aFNlc3Npb25WYWxpZGl0eScsIER1cmF0aW9uLm1pbnV0ZXMoMyksIER1cmF0aW9uLm1pbnV0ZXMoMTUpLCBwcm9wcy5hdXRoU2Vzc2lvblZhbGlkaXR5KTtcbiAgICByZXNvdXJjZS5hdXRoU2Vzc2lvblZhbGlkaXR5ID0gcHJvcHMuYXV0aFNlc3Npb25WYWxpZGl0eSA/IHByb3BzLmF1dGhTZXNzaW9uVmFsaWRpdHkudG9NaW51dGVzKCkgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBwcml2YXRlIGNvbmZpZ3VyZVRva2VuVmFsaWRpdHkocmVzb3VyY2U6IENmblVzZXJQb29sQ2xpZW50LCBwcm9wczogVXNlclBvb2xDbGllbnRQcm9wcykge1xuICAgIHRoaXMudmFsaWRhdGVEdXJhdGlvbignaWRUb2tlblZhbGlkaXR5JywgRHVyYXRpb24ubWludXRlcyg1KSwgRHVyYXRpb24uZGF5cygxKSwgcHJvcHMuaWRUb2tlblZhbGlkaXR5KTtcbiAgICB0aGlzLnZhbGlkYXRlRHVyYXRpb24oJ2FjY2Vzc1Rva2VuVmFsaWRpdHknLCBEdXJhdGlvbi5taW51dGVzKDUpLCBEdXJhdGlvbi5kYXlzKDEpLCBwcm9wcy5hY2Nlc3NUb2tlblZhbGlkaXR5KTtcbiAgICB0aGlzLnZhbGlkYXRlRHVyYXRpb24oJ3JlZnJlc2hUb2tlblZhbGlkaXR5JywgRHVyYXRpb24ubWludXRlcyg2MCksIER1cmF0aW9uLmRheXMoMTAgKiAzNjUpLCBwcm9wcy5yZWZyZXNoVG9rZW5WYWxpZGl0eSk7XG4gICAgaWYgKHByb3BzLnJlZnJlc2hUb2tlblZhbGlkaXR5KSB7XG4gICAgICB0aGlzLnZhbGlkYXRlRHVyYXRpb24oJ2lkVG9rZW5WYWxpZGl0eScsIER1cmF0aW9uLm1pbnV0ZXMoNSksIHByb3BzLnJlZnJlc2hUb2tlblZhbGlkaXR5LCBwcm9wcy5pZFRva2VuVmFsaWRpdHkpO1xuICAgICAgdGhpcy52YWxpZGF0ZUR1cmF0aW9uKCdhY2Nlc3NUb2tlblZhbGlkaXR5JywgRHVyYXRpb24ubWludXRlcyg1KSwgcHJvcHMucmVmcmVzaFRva2VuVmFsaWRpdHksIHByb3BzLmFjY2Vzc1Rva2VuVmFsaWRpdHkpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5hY2Nlc3NUb2tlblZhbGlkaXR5IHx8IHByb3BzLmlkVG9rZW5WYWxpZGl0eSB8fCBwcm9wcy5yZWZyZXNoVG9rZW5WYWxpZGl0eSkge1xuICAgICAgcmVzb3VyY2UudG9rZW5WYWxpZGl0eVVuaXRzID0ge1xuICAgICAgICBpZFRva2VuOiBwcm9wcy5pZFRva2VuVmFsaWRpdHkgPyAnbWludXRlcycgOiB1bmRlZmluZWQsXG4gICAgICAgIGFjY2Vzc1Rva2VuOiBwcm9wcy5hY2Nlc3NUb2tlblZhbGlkaXR5ID8gJ21pbnV0ZXMnIDogdW5kZWZpbmVkLFxuICAgICAgICByZWZyZXNoVG9rZW46IHByb3BzLnJlZnJlc2hUb2tlblZhbGlkaXR5ID8gJ21pbnV0ZXMnIDogdW5kZWZpbmVkLFxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgcmVzb3VyY2UuaWRUb2tlblZhbGlkaXR5ID0gcHJvcHMuaWRUb2tlblZhbGlkaXR5ID8gcHJvcHMuaWRUb2tlblZhbGlkaXR5LnRvTWludXRlcygpIDogdW5kZWZpbmVkO1xuICAgIHJlc291cmNlLnJlZnJlc2hUb2tlblZhbGlkaXR5ID0gcHJvcHMucmVmcmVzaFRva2VuVmFsaWRpdHkgPyBwcm9wcy5yZWZyZXNoVG9rZW5WYWxpZGl0eS50b01pbnV0ZXMoKSA6IHVuZGVmaW5lZDtcbiAgICByZXNvdXJjZS5hY2Nlc3NUb2tlblZhbGlkaXR5ID0gcHJvcHMuYWNjZXNzVG9rZW5WYWxpZGl0eSA/IHByb3BzLmFjY2Vzc1Rva2VuVmFsaWRpdHkudG9NaW51dGVzKCkgOiB1bmRlZmluZWQ7XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlRHVyYXRpb24obmFtZTogc3RyaW5nLCBtaW46IER1cmF0aW9uLCBtYXg6IER1cmF0aW9uLCB2YWx1ZT86IER1cmF0aW9uKSB7XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHsgcmV0dXJuOyB9XG4gICAgaWYgKHZhbHVlLnRvTWlsbGlzZWNvbmRzKCkgPCBtaW4udG9NaWxsaXNlY29uZHMoKSB8fCB2YWx1ZS50b01pbGxpc2Vjb25kcygpID4gbWF4LnRvTWlsbGlzZWNvbmRzKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHtuYW1lfTogTXVzdCBiZSBhIGR1cmF0aW9uIGJldHdlZW4gJHttaW4udG9IdW1hblN0cmluZygpfSBhbmQgJHttYXgudG9IdW1hblN0cmluZygpfSAoaW5jbHVzaXZlKTsgcmVjZWl2ZWQgJHt2YWx1ZS50b0h1bWFuU3RyaW5nKCl9LmApO1xuICAgIH1cbiAgfVxufVxuIl19