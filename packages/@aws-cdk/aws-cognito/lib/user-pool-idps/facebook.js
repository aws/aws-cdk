"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPoolIdentityProviderFacebook = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const user_pool_idp_base_1 = require("./private/user-pool-idp-base");
const cognito_generated_1 = require("../cognito.generated");
/**
 * Represents a identity provider that integrates with 'Facebook Login'
 * @resource AWS::Cognito::UserPoolIdentityProvider
 */
class UserPoolIdentityProviderFacebook extends user_pool_idp_base_1.UserPoolIdentityProviderBase {
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_UserPoolIdentityProviderFacebookProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, UserPoolIdentityProviderFacebook);
            }
            throw error;
        }
        const scopes = props.scopes ?? ['public_profile'];
        const resource = new cognito_generated_1.CfnUserPoolIdentityProvider(this, 'Resource', {
            userPoolId: props.userPool.userPoolId,
            providerName: 'Facebook',
            providerType: 'Facebook',
            providerDetails: {
                client_id: props.clientId,
                client_secret: props.clientSecret,
                authorize_scopes: scopes.join(','),
                api_version: props.apiVersion,
            },
            attributeMapping: super.configureAttributeMapping(),
        });
        this.providerName = super.getResourceNameAttribute(resource.ref);
    }
}
exports.UserPoolIdentityProviderFacebook = UserPoolIdentityProviderFacebook;
_a = JSII_RTTI_SYMBOL_1;
UserPoolIdentityProviderFacebook[_a] = { fqn: "@aws-cdk/aws-cognito.UserPoolIdentityProviderFacebook", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZWJvb2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmYWNlYm9vay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxxRUFBNEU7QUFDNUUsNERBQW1FO0FBNEJuRTs7O0dBR0c7QUFDSCxNQUFhLGdDQUFpQyxTQUFRLGlEQUE0QjtJQUdoRixZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTRDO1FBQ3BGLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDOzs7Ozs7K0NBSmYsZ0NBQWdDOzs7O1FBTXpDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRWxELE1BQU0sUUFBUSxHQUFHLElBQUksK0NBQTJCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNqRSxVQUFVLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVO1lBQ3JDLFlBQVksRUFBRSxVQUFVO1lBQ3hCLFlBQVksRUFBRSxVQUFVO1lBQ3hCLGVBQWUsRUFBRTtnQkFDZixTQUFTLEVBQUUsS0FBSyxDQUFDLFFBQVE7Z0JBQ3pCLGFBQWEsRUFBRSxLQUFLLENBQUMsWUFBWTtnQkFDakMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7Z0JBQ2xDLFdBQVcsRUFBRSxLQUFLLENBQUMsVUFBVTthQUM5QjtZQUNELGdCQUFnQixFQUFFLEtBQUssQ0FBQyx5QkFBeUIsRUFBRTtTQUNwRCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDbEU7O0FBdEJILDRFQXVCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyUHJvcHMgfSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHsgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyQmFzZSB9IGZyb20gJy4vcHJpdmF0ZS91c2VyLXBvb2wtaWRwLWJhc2UnO1xuaW1wb3J0IHsgQ2ZuVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyIH0gZnJvbSAnLi4vY29nbml0by5nZW5lcmF0ZWQnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgdG8gaW5pdGlhbGl6ZSBVc2VyUG9vbEZhY2Vib29rSWRlbnRpdHlQcm92aWRlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckZhY2Vib29rUHJvcHMgZXh0ZW5kcyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgY2xpZW50IGlkIHJlY29nbml6ZWQgYnkgRmFjZWJvb2sgQVBJcy5cbiAgICovXG4gIHJlYWRvbmx5IGNsaWVudElkOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgY2xpZW50IHNlY3JldCB0byBiZSBhY2NvbXBhbmllZCB3aXRoIGNsaWVudFVkIGZvciBGYWNlYm9vayB0byBhdXRoZW50aWNhdGUgdGhlIGNsaWVudC5cbiAgICogQHNlZSBodHRwczovL2RldmVsb3BlcnMuZmFjZWJvb2suY29tL2RvY3MvZmFjZWJvb2stbG9naW4vc2VjdXJpdHkjYXBwc2VjcmV0XG4gICAqL1xuICByZWFkb25seSBjbGllbnRTZWNyZXQ6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBsaXN0IG9mIGZhY2Vib29rIHBlcm1pc3Npb25zIHRvIG9idGFpbiBmb3IgZ2V0dGluZyBhY2Nlc3MgdG8gdGhlIEZhY2Vib29rIHByb2ZpbGUuXG4gICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXJzLmZhY2Vib29rLmNvbS9kb2NzL2ZhY2Vib29rLWxvZ2luL3Blcm1pc3Npb25zXG4gICAqIEBkZWZhdWx0IFsgcHVibGljX3Byb2ZpbGUgXVxuICAgKi9cbiAgcmVhZG9ubHkgc2NvcGVzPzogc3RyaW5nW107XG4gIC8qKlxuICAgKiBUaGUgRmFjZWJvb2sgQVBJIHZlcnNpb24gdG8gdXNlXG4gICAqIEBkZWZhdWx0IC0gdG8gdGhlIG9sZGVzdCB2ZXJzaW9uIHN1cHBvcnRlZCBieSBGYWNlYm9va1xuICAgKi9cbiAgcmVhZG9ubHkgYXBpVmVyc2lvbj86IHN0cmluZztcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgaWRlbnRpdHkgcHJvdmlkZXIgdGhhdCBpbnRlZ3JhdGVzIHdpdGggJ0ZhY2Vib29rIExvZ2luJ1xuICogQHJlc291cmNlIEFXUzo6Q29nbml0bzo6VXNlclBvb2xJZGVudGl0eVByb3ZpZGVyXG4gKi9cbmV4cG9ydCBjbGFzcyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJGYWNlYm9vayBleHRlbmRzIFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckJhc2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgcHJvdmlkZXJOYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckZhY2Vib29rUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHNjb3BlcyA9IHByb3BzLnNjb3BlcyA/PyBbJ3B1YmxpY19wcm9maWxlJ107XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5Vc2VyUG9vbElkZW50aXR5UHJvdmlkZXIodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgdXNlclBvb2xJZDogcHJvcHMudXNlclBvb2wudXNlclBvb2xJZCxcbiAgICAgIHByb3ZpZGVyTmFtZTogJ0ZhY2Vib29rJywgLy8gbXVzdCBiZSAnRmFjZWJvb2snIHdoZW4gdGhlIHR5cGUgaXMgJ0ZhY2Vib29rJ1xuICAgICAgcHJvdmlkZXJUeXBlOiAnRmFjZWJvb2snLFxuICAgICAgcHJvdmlkZXJEZXRhaWxzOiB7XG4gICAgICAgIGNsaWVudF9pZDogcHJvcHMuY2xpZW50SWQsXG4gICAgICAgIGNsaWVudF9zZWNyZXQ6IHByb3BzLmNsaWVudFNlY3JldCxcbiAgICAgICAgYXV0aG9yaXplX3Njb3Blczogc2NvcGVzLmpvaW4oJywnKSxcbiAgICAgICAgYXBpX3ZlcnNpb246IHByb3BzLmFwaVZlcnNpb24sXG4gICAgICB9LFxuICAgICAgYXR0cmlidXRlTWFwcGluZzogc3VwZXIuY29uZmlndXJlQXR0cmlidXRlTWFwcGluZygpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wcm92aWRlck5hbWUgPSBzdXBlci5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUocmVzb3VyY2UucmVmKTtcbiAgfVxufSJdfQ==