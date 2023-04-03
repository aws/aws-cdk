"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPoolIdentityProviderAmazon = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const user_pool_idp_base_1 = require("./private/user-pool-idp-base");
const cognito_generated_1 = require("../cognito.generated");
/**
 * Represents a identity provider that integrates with 'Login with Amazon'
 * @resource AWS::Cognito::UserPoolIdentityProvider
 */
class UserPoolIdentityProviderAmazon extends user_pool_idp_base_1.UserPoolIdentityProviderBase {
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_UserPoolIdentityProviderAmazonProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, UserPoolIdentityProviderAmazon);
            }
            throw error;
        }
        const scopes = props.scopes ?? ['profile'];
        const resource = new cognito_generated_1.CfnUserPoolIdentityProvider(this, 'Resource', {
            userPoolId: props.userPool.userPoolId,
            providerName: 'LoginWithAmazon',
            providerType: 'LoginWithAmazon',
            providerDetails: {
                client_id: props.clientId,
                client_secret: props.clientSecret,
                authorize_scopes: scopes.join(' '),
            },
            attributeMapping: super.configureAttributeMapping(),
        });
        this.providerName = super.getResourceNameAttribute(resource.ref);
    }
}
exports.UserPoolIdentityProviderAmazon = UserPoolIdentityProviderAmazon;
_a = JSII_RTTI_SYMBOL_1;
UserPoolIdentityProviderAmazon[_a] = { fqn: "@aws-cdk/aws-cognito.UserPoolIdentityProviderAmazon", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1hem9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYW1hem9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVBLHFFQUE0RTtBQUM1RSw0REFBbUU7QUF3Qm5FOzs7R0FHRztBQUNILE1BQWEsOEJBQStCLFNBQVEsaURBQTRCO0lBRzlFLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBMEM7UUFDbEYsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7Ozs7OzsrQ0FKZiw4QkFBOEI7Ozs7UUFNdkMsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTNDLE1BQU0sUUFBUSxHQUFHLElBQUksK0NBQTJCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNqRSxVQUFVLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVO1lBQ3JDLFlBQVksRUFBRSxpQkFBaUI7WUFDL0IsWUFBWSxFQUFFLGlCQUFpQjtZQUMvQixlQUFlLEVBQUU7Z0JBQ2YsU0FBUyxFQUFFLEtBQUssQ0FBQyxRQUFRO2dCQUN6QixhQUFhLEVBQUUsS0FBSyxDQUFDLFlBQVk7Z0JBQ2pDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2FBQ25DO1lBQ0QsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLHlCQUF5QixFQUFFO1NBQ3BELENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNsRTs7QUFyQkgsd0VBc0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJQcm9wcyB9IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQgeyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJCYXNlIH0gZnJvbSAnLi9wcml2YXRlL3VzZXItcG9vbC1pZHAtYmFzZSc7XG5pbXBvcnQgeyBDZm5Vc2VyUG9vbElkZW50aXR5UHJvdmlkZXIgfSBmcm9tICcuLi9jb2duaXRvLmdlbmVyYXRlZCc7XG5cbi8qKlxuICogUHJvcGVydGllcyB0byBpbml0aWFsaXplIFVzZXJQb29sQW1hem9uSWRlbnRpdHlQcm92aWRlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckFtYXpvblByb3BzIGV4dGVuZHMgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyUHJvcHMge1xuICAvKipcbiAgICogVGhlIGNsaWVudCBpZCByZWNvZ25pemVkIGJ5ICdMb2dpbiB3aXRoIEFtYXpvbicgQVBJcy5cbiAgICogQHNlZSBodHRwczovL2RldmVsb3Blci5hbWF6b24uY29tL2RvY3MvbG9naW4td2l0aC1hbWF6b24vc2VjdXJpdHktcHJvZmlsZS5odG1sI2NsaWVudC1pZGVudGlmaWVyXG4gICAqL1xuICByZWFkb25seSBjbGllbnRJZDogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIGNsaWVudCBzZWNyZXQgdG8gYmUgYWNjb21wYW5pZWQgd2l0aCBjbGllbnRJZCBmb3IgJ0xvZ2luIHdpdGggQW1hem9uJyBBUElzIHRvIGF1dGhlbnRpY2F0ZSB0aGUgY2xpZW50LlxuICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmFtYXpvbi5jb20vZG9jcy9sb2dpbi13aXRoLWFtYXpvbi9zZWN1cml0eS1wcm9maWxlLmh0bWwjY2xpZW50LWlkZW50aWZpZXJcbiAgICovXG4gIHJlYWRvbmx5IGNsaWVudFNlY3JldDogc3RyaW5nO1xuICAvKipcbiAgICogVGhlIHR5cGVzIG9mIHVzZXIgcHJvZmlsZSBkYXRhIHRvIG9idGFpbiBmb3IgdGhlIEFtYXpvbiBwcm9maWxlLlxuICAgKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLmFtYXpvbi5jb20vZG9jcy9sb2dpbi13aXRoLWFtYXpvbi9jdXN0b21lci1wcm9maWxlLmh0bWxcbiAgICogQGRlZmF1bHQgWyBwcm9maWxlIF1cbiAgICovXG4gIHJlYWRvbmx5IHNjb3Blcz86IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBpZGVudGl0eSBwcm92aWRlciB0aGF0IGludGVncmF0ZXMgd2l0aCAnTG9naW4gd2l0aCBBbWF6b24nXG4gKiBAcmVzb3VyY2UgQVdTOjpDb2duaXRvOjpVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckFtYXpvbiBleHRlbmRzIFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckJhc2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgcHJvdmlkZXJOYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckFtYXpvblByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBzY29wZXMgPSBwcm9wcy5zY29wZXMgPz8gWydwcm9maWxlJ107XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5Vc2VyUG9vbElkZW50aXR5UHJvdmlkZXIodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgdXNlclBvb2xJZDogcHJvcHMudXNlclBvb2wudXNlclBvb2xJZCxcbiAgICAgIHByb3ZpZGVyTmFtZTogJ0xvZ2luV2l0aEFtYXpvbicsIC8vIG11c3QgYmUgJ0xvZ2luV2l0aEFtYXpvbicgd2hlbiB0aGUgdHlwZSBpcyAnTG9naW5XaXRoQW1hem9uJ1xuICAgICAgcHJvdmlkZXJUeXBlOiAnTG9naW5XaXRoQW1hem9uJyxcbiAgICAgIHByb3ZpZGVyRGV0YWlsczoge1xuICAgICAgICBjbGllbnRfaWQ6IHByb3BzLmNsaWVudElkLFxuICAgICAgICBjbGllbnRfc2VjcmV0OiBwcm9wcy5jbGllbnRTZWNyZXQsXG4gICAgICAgIGF1dGhvcml6ZV9zY29wZXM6IHNjb3Blcy5qb2luKCcgJyksXG4gICAgICB9LFxuICAgICAgYXR0cmlidXRlTWFwcGluZzogc3VwZXIuY29uZmlndXJlQXR0cmlidXRlTWFwcGluZygpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wcm92aWRlck5hbWUgPSBzdXBlci5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUocmVzb3VyY2UucmVmKTtcbiAgfVxufSJdfQ==