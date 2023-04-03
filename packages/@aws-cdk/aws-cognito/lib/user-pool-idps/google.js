"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPoolIdentityProviderGoogle = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const user_pool_idp_base_1 = require("./private/user-pool-idp-base");
const cognito_generated_1 = require("../cognito.generated");
/**
 * Represents a identity provider that integrates with 'Google'
 * @resource AWS::Cognito::UserPoolIdentityProvider
 */
class UserPoolIdentityProviderGoogle extends user_pool_idp_base_1.UserPoolIdentityProviderBase {
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_UserPoolIdentityProviderGoogleProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, UserPoolIdentityProviderGoogle);
            }
            throw error;
        }
        const scopes = props.scopes ?? ['profile'];
        //at least one of the properties must be configured
        if ((!props.clientSecret && !props.clientSecretValue) ||
            (props.clientSecret && props.clientSecretValue)) {
            throw new Error('Exactly one of "clientSecret" or "clientSecretValue" must be configured.');
        }
        const resource = new cognito_generated_1.CfnUserPoolIdentityProvider(this, 'Resource', {
            userPoolId: props.userPool.userPoolId,
            providerName: 'Google',
            providerType: 'Google',
            providerDetails: {
                client_id: props.clientId,
                client_secret: props.clientSecretValue ? props.clientSecretValue.unsafeUnwrap() : props.clientSecret,
                authorize_scopes: scopes.join(' '),
            },
            attributeMapping: super.configureAttributeMapping(),
        });
        this.providerName = super.getResourceNameAttribute(resource.ref);
    }
}
exports.UserPoolIdentityProviderGoogle = UserPoolIdentityProviderGoogle;
_a = JSII_RTTI_SYMBOL_1;
UserPoolIdentityProviderGoogle[_a] = { fqn: "@aws-cdk/aws-cognito.UserPoolIdentityProviderGoogle", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ29vZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBLHFFQUE0RTtBQUM1RSw0REFBbUU7QUFnQ25FOzs7R0FHRztBQUNILE1BQWEsOEJBQStCLFNBQVEsaURBQTRCO0lBRzlFLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBMEM7UUFDbEYsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7Ozs7OzsrQ0FKZiw4QkFBOEI7Ozs7UUFNdkMsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTNDLG1EQUFtRDtRQUNuRCxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDO1lBQ25ELENBQUMsS0FBSyxDQUFDLFlBQVksSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFBRTtZQUNqRCxNQUFNLElBQUksS0FBSyxDQUFDLDBFQUEwRSxDQUFDLENBQUM7U0FDN0Y7UUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLCtDQUEyQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDakUsVUFBVSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVTtZQUNyQyxZQUFZLEVBQUUsUUFBUTtZQUN0QixZQUFZLEVBQUUsUUFBUTtZQUN0QixlQUFlLEVBQUU7Z0JBQ2YsU0FBUyxFQUFFLEtBQUssQ0FBQyxRQUFRO2dCQUN6QixhQUFhLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZO2dCQUNwRyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQzthQUNuQztZQUNELGdCQUFnQixFQUFFLEtBQUssQ0FBQyx5QkFBeUIsRUFBRTtTQUNwRCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDbEU7O0FBM0JILHdFQTRCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNlY3JldFZhbHVlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclByb3BzIH0gZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckJhc2UgfSBmcm9tICcuL3ByaXZhdGUvdXNlci1wb29sLWlkcC1iYXNlJztcbmltcG9ydCB7IENmblVzZXJQb29sSWRlbnRpdHlQcm92aWRlciB9IGZyb20gJy4uL2NvZ25pdG8uZ2VuZXJhdGVkJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIHRvIGluaXRpYWxpemUgVXNlclBvb2xHb29nbGVJZGVudGl0eVByb3ZpZGVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyR29vZ2xlUHJvcHMgZXh0ZW5kcyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgY2xpZW50IGlkIHJlY29nbml6ZWQgYnkgR29vZ2xlIEFQSXMuXG4gICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vaWRlbnRpdHkvc2lnbi1pbi93ZWIvc2lnbi1pbiNzcGVjaWZ5X3lvdXJfYXBwc19jbGllbnRfaWRcbiAgICovXG4gIHJlYWRvbmx5IGNsaWVudElkOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBUaGUgY2xpZW50IHNlY3JldCB0byBiZSBhY2NvbXBhbmllZCB3aXRoIGNsaWVudElkIGZvciBHb29nbGUgQVBJcyB0byBhdXRoZW50aWNhdGUgdGhlIGNsaWVudC5cbiAgICogQHNlZSBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9pZGVudGl0eS9zaWduLWluL3dlYi9zaWduLWluXG4gICAqIEBkZWZhdWx0IG5vbmVcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGNsaWVudFNlY3JldFZhbHVlIGluc3RlYWRcbiAgICovXG4gIHJlYWRvbmx5IGNsaWVudFNlY3JldD86IHN0cmluZztcbiAgLyoqXG4gICAqIFRoZSBjbGllbnQgc2VjcmV0IHRvIGJlIGFjY29tcGFuaWVkIHdpdGggY2xpZW50SWQgZm9yIEdvb2dsZSBBUElzIHRvIGF1dGhlbnRpY2F0ZSB0aGUgY2xpZW50IGFzIFNlY3JldFZhbHVlXG4gICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vaWRlbnRpdHkvc2lnbi1pbi93ZWIvc2lnbi1pblxuICAgKiBAZGVmYXVsdCBub25lXG4gICAqL1xuICByZWFkb25seSBjbGllbnRTZWNyZXRWYWx1ZT86IFNlY3JldFZhbHVlO1xuICAvKipcbiAgICogVGhlIGxpc3Qgb2YgZ29vZ2xlIHBlcm1pc3Npb25zIHRvIG9idGFpbiBmb3IgZ2V0dGluZyBhY2Nlc3MgdG8gdGhlIGdvb2dsZSBwcm9maWxlXG4gICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vaWRlbnRpdHkvc2lnbi1pbi93ZWIvc2lnbi1pblxuICAgKiBAZGVmYXVsdCBbIHByb2ZpbGUgXVxuICAgKi9cbiAgcmVhZG9ubHkgc2NvcGVzPzogc3RyaW5nW107XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIGlkZW50aXR5IHByb3ZpZGVyIHRoYXQgaW50ZWdyYXRlcyB3aXRoICdHb29nbGUnXG4gKiBAcmVzb3VyY2UgQVdTOjpDb2duaXRvOjpVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckdvb2dsZSBleHRlbmRzIFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckJhc2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgcHJvdmlkZXJOYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckdvb2dsZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBzY29wZXMgPSBwcm9wcy5zY29wZXMgPz8gWydwcm9maWxlJ107XG5cbiAgICAvL2F0IGxlYXN0IG9uZSBvZiB0aGUgcHJvcGVydGllcyBtdXN0IGJlIGNvbmZpZ3VyZWRcbiAgICBpZiAoKCFwcm9wcy5jbGllbnRTZWNyZXQgJiYgIXByb3BzLmNsaWVudFNlY3JldFZhbHVlKSB8fFxuICAgICAgKHByb3BzLmNsaWVudFNlY3JldCAmJiBwcm9wcy5jbGllbnRTZWNyZXRWYWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXhhY3RseSBvbmUgb2YgXCJjbGllbnRTZWNyZXRcIiBvciBcImNsaWVudFNlY3JldFZhbHVlXCIgbXVzdCBiZSBjb25maWd1cmVkLicpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmblVzZXJQb29sSWRlbnRpdHlQcm92aWRlcih0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICB1c2VyUG9vbElkOiBwcm9wcy51c2VyUG9vbC51c2VyUG9vbElkLFxuICAgICAgcHJvdmlkZXJOYW1lOiAnR29vZ2xlJywgLy8gbXVzdCBiZSAnR29vZ2xlJyB3aGVuIHRoZSB0eXBlIGlzICdHb29nbGUnXG4gICAgICBwcm92aWRlclR5cGU6ICdHb29nbGUnLFxuICAgICAgcHJvdmlkZXJEZXRhaWxzOiB7XG4gICAgICAgIGNsaWVudF9pZDogcHJvcHMuY2xpZW50SWQsXG4gICAgICAgIGNsaWVudF9zZWNyZXQ6IHByb3BzLmNsaWVudFNlY3JldFZhbHVlID8gcHJvcHMuY2xpZW50U2VjcmV0VmFsdWUudW5zYWZlVW53cmFwKCkgOiBwcm9wcy5jbGllbnRTZWNyZXQsXG4gICAgICAgIGF1dGhvcml6ZV9zY29wZXM6IHNjb3Blcy5qb2luKCcgJyksXG4gICAgICB9LFxuICAgICAgYXR0cmlidXRlTWFwcGluZzogc3VwZXIuY29uZmlndXJlQXR0cmlidXRlTWFwcGluZygpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wcm92aWRlck5hbWUgPSBzdXBlci5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUocmVzb3VyY2UucmVmKTtcbiAgfVxufSJdfQ==