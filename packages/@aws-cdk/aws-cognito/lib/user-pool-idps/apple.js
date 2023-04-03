"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPoolIdentityProviderApple = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const user_pool_idp_base_1 = require("./private/user-pool-idp-base");
const cognito_generated_1 = require("../cognito.generated");
/**
 * Represents a identity provider that integrates with 'Apple'
 * @resource AWS::Cognito::UserPoolIdentityProvider
 */
class UserPoolIdentityProviderApple extends user_pool_idp_base_1.UserPoolIdentityProviderBase {
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_UserPoolIdentityProviderAppleProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, UserPoolIdentityProviderApple);
            }
            throw error;
        }
        const scopes = props.scopes ?? ['name'];
        const resource = new cognito_generated_1.CfnUserPoolIdentityProvider(this, 'Resource', {
            userPoolId: props.userPool.userPoolId,
            providerName: 'SignInWithApple',
            providerType: 'SignInWithApple',
            providerDetails: {
                client_id: props.clientId,
                team_id: props.teamId,
                key_id: props.keyId,
                private_key: props.privateKey,
                authorize_scopes: scopes.join(' '),
            },
            attributeMapping: super.configureAttributeMapping(),
        });
        this.providerName = super.getResourceNameAttribute(resource.ref);
    }
}
exports.UserPoolIdentityProviderApple = UserPoolIdentityProviderApple;
_a = JSII_RTTI_SYMBOL_1;
UserPoolIdentityProviderApple[_a] = { fqn: "@aws-cdk/aws-cognito.UserPoolIdentityProviderApple", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHBsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxxRUFBNEU7QUFDNUUsNERBQW1FO0FBK0JuRTs7O0dBR0c7QUFDSCxNQUFhLDZCQUE4QixTQUFRLGlEQUE0QjtJQUc3RSxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXlDO1FBQ2pGLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDOzs7Ozs7K0NBSmYsNkJBQTZCOzs7O1FBTXRDLE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV4QyxNQUFNLFFBQVEsR0FBRyxJQUFJLCtDQUEyQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDakUsVUFBVSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVTtZQUNyQyxZQUFZLEVBQUUsaUJBQWlCO1lBQy9CLFlBQVksRUFBRSxpQkFBaUI7WUFDL0IsZUFBZSxFQUFFO2dCQUNmLFNBQVMsRUFBRSxLQUFLLENBQUMsUUFBUTtnQkFDekIsT0FBTyxFQUFFLEtBQUssQ0FBQyxNQUFNO2dCQUNyQixNQUFNLEVBQUUsS0FBSyxDQUFDLEtBQUs7Z0JBQ25CLFdBQVcsRUFBRSxLQUFLLENBQUMsVUFBVTtnQkFDN0IsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7YUFDbkM7WUFDRCxnQkFBZ0IsRUFBRSxLQUFLLENBQUMseUJBQXlCLEVBQUU7U0FDcEQsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsd0JBQXdCLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2xFOztBQXZCSCxzRUF3QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclByb3BzIH0gZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckJhc2UgfSBmcm9tICcuL3ByaXZhdGUvdXNlci1wb29sLWlkcC1iYXNlJztcbmltcG9ydCB7IENmblVzZXJQb29sSWRlbnRpdHlQcm92aWRlciB9IGZyb20gJy4uL2NvZ25pdG8uZ2VuZXJhdGVkJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIHRvIGluaXRpYWxpemUgVXNlclBvb2xBcHBsZUlkZW50aXR5UHJvdmlkZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJBcHBsZVByb3BzIGV4dGVuZHMgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyUHJvcHMge1xuICAvKipcbiAgICogVGhlIGNsaWVudCBpZCByZWNvZ25pemVkIGJ5IEFwcGxlIEFQSXMuXG4gICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuYXBwbGUuY29tL2RvY3VtZW50YXRpb24vc2lnbl9pbl93aXRoX2FwcGxlL2NsaWVudGNvbmZpZ2kvMzIzMDk0OC1jbGllbnRpZFxuICAgKi9cbiAgcmVhZG9ubHkgY2xpZW50SWQ6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSB0ZWFtSWQgZm9yIEFwcGxlIEFQSXMgdG8gYXV0aGVudGljYXRlIHRoZSBjbGllbnQuXG4gICAqL1xuICByZWFkb25seSB0ZWFtSWQ6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBrZXlJZCAob2YgdGhlIHNhbWUga2V5LCB3aGljaCBjb250ZW50IGhhcyB0byBiZSBsYXRlciBzdXBwbGllZCBhcyBgcHJpdmF0ZUtleWApIGZvciBBcHBsZSBBUElzIHRvIGF1dGhlbnRpY2F0ZSB0aGUgY2xpZW50LlxuICAgKi9cbiAgcmVhZG9ubHkga2V5SWQ6IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBwcml2YXRlS2V5IGNvbnRlbnQgZm9yIEFwcGxlIEFQSXMgdG8gYXV0aGVudGljYXRlIHRoZSBjbGllbnQuXG4gICAqL1xuICByZWFkb25seSBwcml2YXRlS2V5OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgbGlzdCBvZiBhcHBsZSBwZXJtaXNzaW9ucyB0byBvYnRhaW4gZm9yIGdldHRpbmcgYWNjZXNzIHRvIHRoZSBhcHBsZSBwcm9maWxlXG4gICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIuYXBwbGUuY29tL2RvY3VtZW50YXRpb24vc2lnbl9pbl93aXRoX2FwcGxlL2NsaWVudGNvbmZpZ2kvMzIzMDk1NS1zY29wZVxuICAgKiBAZGVmYXVsdCBbIG5hbWUgXVxuICAgKi9cbiAgcmVhZG9ubHkgc2NvcGVzPzogc3RyaW5nW107XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIGlkZW50aXR5IHByb3ZpZGVyIHRoYXQgaW50ZWdyYXRlcyB3aXRoICdBcHBsZSdcbiAqIEByZXNvdXJjZSBBV1M6OkNvZ25pdG86OlVzZXJQb29sSWRlbnRpdHlQcm92aWRlclxuICovXG5leHBvcnQgY2xhc3MgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyQXBwbGUgZXh0ZW5kcyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJCYXNlIHtcbiAgcHVibGljIHJlYWRvbmx5IHByb3ZpZGVyTmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJBcHBsZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBzY29wZXMgPSBwcm9wcy5zY29wZXMgPz8gWyduYW1lJ107XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5Vc2VyUG9vbElkZW50aXR5UHJvdmlkZXIodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgdXNlclBvb2xJZDogcHJvcHMudXNlclBvb2wudXNlclBvb2xJZCxcbiAgICAgIHByb3ZpZGVyTmFtZTogJ1NpZ25JbldpdGhBcHBsZScsIC8vIG11c3QgYmUgJ1NpZ25JbldpdGhBcHBsZScgd2hlbiB0aGUgdHlwZSBpcyAnU2lnbkluV2l0aEFwcGxlJ1xuICAgICAgcHJvdmlkZXJUeXBlOiAnU2lnbkluV2l0aEFwcGxlJyxcbiAgICAgIHByb3ZpZGVyRGV0YWlsczoge1xuICAgICAgICBjbGllbnRfaWQ6IHByb3BzLmNsaWVudElkLFxuICAgICAgICB0ZWFtX2lkOiBwcm9wcy50ZWFtSWQsXG4gICAgICAgIGtleV9pZDogcHJvcHMua2V5SWQsXG4gICAgICAgIHByaXZhdGVfa2V5OiBwcm9wcy5wcml2YXRlS2V5LFxuICAgICAgICBhdXRob3JpemVfc2NvcGVzOiBzY29wZXMuam9pbignICcpLFxuICAgICAgfSxcbiAgICAgIGF0dHJpYnV0ZU1hcHBpbmc6IHN1cGVyLmNvbmZpZ3VyZUF0dHJpYnV0ZU1hcHBpbmcoKSxcbiAgICB9KTtcblxuICAgIHRoaXMucHJvdmlkZXJOYW1lID0gc3VwZXIuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKHJlc291cmNlLnJlZik7XG4gIH1cbn0iXX0=