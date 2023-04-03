"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPoolIdentityProviderOidc = exports.OidcAttributeRequestMethod = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const user_pool_idp_base_1 = require("./private/user-pool-idp-base");
const cognito_generated_1 = require("../cognito.generated");
/**
 * The method to use to request attributes
 */
var OidcAttributeRequestMethod;
(function (OidcAttributeRequestMethod) {
    /** GET */
    OidcAttributeRequestMethod["GET"] = "GET";
    /** POST */
    OidcAttributeRequestMethod["POST"] = "POST";
})(OidcAttributeRequestMethod = exports.OidcAttributeRequestMethod || (exports.OidcAttributeRequestMethod = {}));
/**
 * Represents a identity provider that integrates with OpenID Connect
 * @resource AWS::Cognito::UserPoolIdentityProvider
 */
class UserPoolIdentityProviderOidc extends user_pool_idp_base_1.UserPoolIdentityProviderBase {
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_UserPoolIdentityProviderOidcProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, UserPoolIdentityProviderOidc);
            }
            throw error;
        }
        if (props.name && !core_1.Token.isUnresolved(props.name) && (props.name.length < 3 || props.name.length > 32)) {
            throw new Error(`Expected provider name to be between 3 and 32 characters, received ${props.name} (${props.name.length} characters)`);
        }
        const scopes = props.scopes ?? ['openid'];
        const resource = new cognito_generated_1.CfnUserPoolIdentityProvider(this, 'Resource', {
            userPoolId: props.userPool.userPoolId,
            providerName: this.getProviderName(props.name),
            providerType: 'OIDC',
            providerDetails: {
                client_id: props.clientId,
                client_secret: props.clientSecret,
                authorize_scopes: scopes.join(' '),
                attributes_request_method: props.attributeRequestMethod ?? OidcAttributeRequestMethod.GET,
                oidc_issuer: props.issuerUrl,
                authorize_url: props.endpoints?.authorization,
                token_url: props.endpoints?.token,
                attributes_url: props.endpoints?.userInfo,
                jwks_uri: props.endpoints?.jwksUri,
            },
            idpIdentifiers: props.identifiers,
            attributeMapping: super.configureAttributeMapping(),
        });
        this.providerName = super.getResourceNameAttribute(resource.ref);
    }
    getProviderName(name) {
        if (name) {
            if (!core_1.Token.isUnresolved(name) && (name.length < 3 || name.length > 32)) {
                throw new Error(`Expected provider name to be between 3 and 32 characters, received ${name} (${name.length} characters)`);
            }
            return name;
        }
        const uniqueId = core_1.Names.uniqueId(this);
        if (uniqueId.length < 3) {
            return `${uniqueId}oidc`;
        }
        if (uniqueId.length > 32) {
            return uniqueId.substring(0, 16) + uniqueId.substring(uniqueId.length - 16);
        }
        return uniqueId;
    }
}
exports.UserPoolIdentityProviderOidc = UserPoolIdentityProviderOidc;
_a = JSII_RTTI_SYMBOL_1;
UserPoolIdentityProviderOidc[_a] = { fqn: "@aws-cdk/aws-cognito.UserPoolIdentityProviderOidc", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9pZGMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQTZDO0FBRzdDLHFFQUE0RTtBQUM1RSw0REFBbUU7QUFxRm5FOztHQUVHO0FBQ0gsSUFBWSwwQkFLWDtBQUxELFdBQVksMEJBQTBCO0lBQ3BDLFVBQVU7SUFDVix5Q0FBVyxDQUFBO0lBQ1gsV0FBVztJQUNYLDJDQUFhLENBQUE7QUFDZixDQUFDLEVBTFcsMEJBQTBCLEdBQTFCLGtDQUEwQixLQUExQixrQ0FBMEIsUUFLckM7QUFFRDs7O0dBR0c7QUFDSCxNQUFhLDRCQUE2QixTQUFRLGlEQUE0QjtJQUc1RSxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXdDO1FBQ2hGLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDOzs7Ozs7K0NBSmYsNEJBQTRCOzs7O1FBTXJDLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLFlBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFO1lBQ3RHLE1BQU0sSUFBSSxLQUFLLENBQUMsc0VBQXNFLEtBQUssQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLGNBQWMsQ0FBQyxDQUFDO1NBQ3ZJO1FBRUQsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTFDLE1BQU0sUUFBUSxHQUFHLElBQUksK0NBQTJCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNqRSxVQUFVLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVO1lBQ3JDLFlBQVksRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7WUFDOUMsWUFBWSxFQUFFLE1BQU07WUFDcEIsZUFBZSxFQUFFO2dCQUNmLFNBQVMsRUFBRSxLQUFLLENBQUMsUUFBUTtnQkFDekIsYUFBYSxFQUFFLEtBQUssQ0FBQyxZQUFZO2dCQUNqQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztnQkFDbEMseUJBQXlCLEVBQUUsS0FBSyxDQUFDLHNCQUFzQixJQUFJLDBCQUEwQixDQUFDLEdBQUc7Z0JBQ3pGLFdBQVcsRUFBRSxLQUFLLENBQUMsU0FBUztnQkFDNUIsYUFBYSxFQUFFLEtBQUssQ0FBQyxTQUFTLEVBQUUsYUFBYTtnQkFDN0MsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLEVBQUUsS0FBSztnQkFDakMsY0FBYyxFQUFFLEtBQUssQ0FBQyxTQUFTLEVBQUUsUUFBUTtnQkFDekMsUUFBUSxFQUFFLEtBQUssQ0FBQyxTQUFTLEVBQUUsT0FBTzthQUNuQztZQUNELGNBQWMsRUFBRSxLQUFLLENBQUMsV0FBVztZQUNqQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMseUJBQXlCLEVBQUU7U0FDcEQsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsd0JBQXdCLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2xFO0lBRU8sZUFBZSxDQUFDLElBQWE7UUFDbkMsSUFBSSxJQUFJLEVBQUU7WUFDUixJQUFJLENBQUMsWUFBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUU7Z0JBQ3RFLE1BQU0sSUFBSSxLQUFLLENBQUMsc0VBQXNFLElBQUksS0FBSyxJQUFJLENBQUMsTUFBTSxjQUFjLENBQUMsQ0FBQzthQUMzSDtZQUNELE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxNQUFNLFFBQVEsR0FBRyxZQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXRDLElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDdkIsT0FBTyxHQUFHLFFBQVEsTUFBTSxDQUFDO1NBQzFCO1FBRUQsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRTtZQUN4QixPQUFPLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQztTQUM3RTtRQUNELE9BQU8sUUFBUSxDQUFDO0tBQ2pCOztBQXBESCxvRUFxREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOYW1lcywgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyUHJvcHMgfSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHsgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyQmFzZSB9IGZyb20gJy4vcHJpdmF0ZS91c2VyLXBvb2wtaWRwLWJhc2UnO1xuaW1wb3J0IHsgQ2ZuVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyIH0gZnJvbSAnLi4vY29nbml0by5nZW5lcmF0ZWQnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgdG8gaW5pdGlhbGl6ZSBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJPaWRjXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyT2lkY1Byb3BzIGV4dGVuZHMgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyUHJvcHMge1xuICAvKipcbiAgICogVGhlIGNsaWVudCBpZFxuICAgKi9cbiAgcmVhZG9ubHkgY2xpZW50SWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNsaWVudCBzZWNyZXRcbiAgICovXG4gIHJlYWRvbmx5IGNsaWVudFNlY3JldDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJc3N1ZXIgVVJMXG4gICAqL1xuICByZWFkb25seSBpc3N1ZXJVcmw6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHByb3ZpZGVyXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGhlIHVuaXF1ZSBJRCBvZiB0aGUgY29uc3RydWN0XG4gICAqL1xuICByZWFkb25seSBuYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgT0F1dGggMi4wIHNjb3BlcyB0aGF0IHlvdSB3aWxsIHJlcXVlc3QgZnJvbSBPcGVuSUQgQ29ubmVjdC4gU2NvcGVzIGFyZVxuICAgKiBncm91cHMgb2YgT3BlbklEIENvbm5lY3QgdXNlciBhdHRyaWJ1dGVzIHRvIGV4Y2hhbmdlIHdpdGggeW91ciBhcHAuXG4gICAqXG4gICAqIEBkZWZhdWx0IFsnb3BlbmlkJ11cbiAgICovXG4gIHJlYWRvbmx5IHNjb3Blcz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBJZGVudGlmaWVyc1xuICAgKlxuICAgKiBJZGVudGlmaWVycyBjYW4gYmUgdXNlZCB0byByZWRpcmVjdCB1c2VycyB0byB0aGUgY29ycmVjdCBJZFAgaW4gbXVsdGl0ZW5hbnQgYXBwcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBpZGVudGlmaWVycyB1c2VkXG4gICAqL1xuICByZWFkb25seSBpZGVudGlmaWVycz86IHN0cmluZ1tdXG5cbiAgLyoqXG4gICAqIFRoZSBtZXRob2QgdG8gdXNlIHRvIHJlcXVlc3QgYXR0cmlidXRlc1xuICAgKlxuICAgKiBAZGVmYXVsdCBPaWRjQXR0cmlidXRlUmVxdWVzdE1ldGhvZC5HRVRcbiAgICovXG4gIHJlYWRvbmx5IGF0dHJpYnV0ZVJlcXVlc3RNZXRob2Q/OiBPaWRjQXR0cmlidXRlUmVxdWVzdE1ldGhvZFxuXG4gIC8qKlxuICAgKiBPcGVuSUQgY29ubmVjdCBlbmRwb2ludHNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBhdXRvIGRpc2NvdmVyZWQgd2l0aCBpc3N1ZXIgVVJMXG4gICAqL1xuICByZWFkb25seSBlbmRwb2ludHM/OiBPaWRjRW5kcG9pbnRzO1xufVxuXG4vKipcbiAqIE9wZW5JRCBDb25uZWN0IGVuZHBvaW50c1xuICovXG5leHBvcnQgaW50ZXJmYWNlIE9pZGNFbmRwb2ludHMge1xuICAvKipcbiAgICogQXV0aG9yaXphdGlvbiBlbmRwb2ludFxuICAgKi9cbiAgcmVhZG9ubHkgYXV0aG9yaXphdGlvbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgICogVG9rZW4gZW5kcG9pbnRcbiAgICAqL1xuICByZWFkb25seSB0b2tlbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgICogVXNlckluZm8gZW5kcG9pbnRcbiAgICAqL1xuICByZWFkb25seSB1c2VySW5mbzogc3RyaW5nO1xuXG4gIC8qKlxuICAgICogSndrc191cmkgZW5kcG9pbnRcbiAgICovXG4gIHJlYWRvbmx5IGp3a3NVcmk6IHN0cmluZztcbn1cblxuLyoqXG4gKiBUaGUgbWV0aG9kIHRvIHVzZSB0byByZXF1ZXN0IGF0dHJpYnV0ZXNcbiAqL1xuZXhwb3J0IGVudW0gT2lkY0F0dHJpYnV0ZVJlcXVlc3RNZXRob2Qge1xuICAvKiogR0VUICovXG4gIEdFVCA9ICdHRVQnLFxuICAvKiogUE9TVCAqL1xuICBQT1NUID0gJ1BPU1QnXG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIGlkZW50aXR5IHByb3ZpZGVyIHRoYXQgaW50ZWdyYXRlcyB3aXRoIE9wZW5JRCBDb25uZWN0XG4gKiBAcmVzb3VyY2UgQVdTOjpDb2duaXRvOjpVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFVzZXJQb29sSWRlbnRpdHlQcm92aWRlck9pZGMgZXh0ZW5kcyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJCYXNlIHtcbiAgcHVibGljIHJlYWRvbmx5IHByb3ZpZGVyTmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJPaWRjUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGlmIChwcm9wcy5uYW1lICYmICFUb2tlbi5pc1VucmVzb2x2ZWQocHJvcHMubmFtZSkgJiYgKHByb3BzLm5hbWUubGVuZ3RoIDwgMyB8fCBwcm9wcy5uYW1lLmxlbmd0aCA+IDMyKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBwcm92aWRlciBuYW1lIHRvIGJlIGJldHdlZW4gMyBhbmQgMzIgY2hhcmFjdGVycywgcmVjZWl2ZWQgJHtwcm9wcy5uYW1lfSAoJHtwcm9wcy5uYW1lLmxlbmd0aH0gY2hhcmFjdGVycylgKTtcbiAgICB9XG5cbiAgICBjb25zdCBzY29wZXMgPSBwcm9wcy5zY29wZXMgPz8gWydvcGVuaWQnXTtcblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmblVzZXJQb29sSWRlbnRpdHlQcm92aWRlcih0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICB1c2VyUG9vbElkOiBwcm9wcy51c2VyUG9vbC51c2VyUG9vbElkLFxuICAgICAgcHJvdmlkZXJOYW1lOiB0aGlzLmdldFByb3ZpZGVyTmFtZShwcm9wcy5uYW1lKSxcbiAgICAgIHByb3ZpZGVyVHlwZTogJ09JREMnLFxuICAgICAgcHJvdmlkZXJEZXRhaWxzOiB7XG4gICAgICAgIGNsaWVudF9pZDogcHJvcHMuY2xpZW50SWQsXG4gICAgICAgIGNsaWVudF9zZWNyZXQ6IHByb3BzLmNsaWVudFNlY3JldCxcbiAgICAgICAgYXV0aG9yaXplX3Njb3Blczogc2NvcGVzLmpvaW4oJyAnKSxcbiAgICAgICAgYXR0cmlidXRlc19yZXF1ZXN0X21ldGhvZDogcHJvcHMuYXR0cmlidXRlUmVxdWVzdE1ldGhvZCA/PyBPaWRjQXR0cmlidXRlUmVxdWVzdE1ldGhvZC5HRVQsXG4gICAgICAgIG9pZGNfaXNzdWVyOiBwcm9wcy5pc3N1ZXJVcmwsXG4gICAgICAgIGF1dGhvcml6ZV91cmw6IHByb3BzLmVuZHBvaW50cz8uYXV0aG9yaXphdGlvbixcbiAgICAgICAgdG9rZW5fdXJsOiBwcm9wcy5lbmRwb2ludHM/LnRva2VuLFxuICAgICAgICBhdHRyaWJ1dGVzX3VybDogcHJvcHMuZW5kcG9pbnRzPy51c2VySW5mbyxcbiAgICAgICAgandrc191cmk6IHByb3BzLmVuZHBvaW50cz8uandrc1VyaSxcbiAgICAgIH0sXG4gICAgICBpZHBJZGVudGlmaWVyczogcHJvcHMuaWRlbnRpZmllcnMsXG4gICAgICBhdHRyaWJ1dGVNYXBwaW5nOiBzdXBlci5jb25maWd1cmVBdHRyaWJ1dGVNYXBwaW5nKCksXG4gICAgfSk7XG5cbiAgICB0aGlzLnByb3ZpZGVyTmFtZSA9IHN1cGVyLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZShyZXNvdXJjZS5yZWYpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRQcm92aWRlck5hbWUobmFtZT86IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIGlmICghVG9rZW4uaXNVbnJlc29sdmVkKG5hbWUpICYmIChuYW1lLmxlbmd0aCA8IDMgfHwgbmFtZS5sZW5ndGggPiAzMikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBwcm92aWRlciBuYW1lIHRvIGJlIGJldHdlZW4gMyBhbmQgMzIgY2hhcmFjdGVycywgcmVjZWl2ZWQgJHtuYW1lfSAoJHtuYW1lLmxlbmd0aH0gY2hhcmFjdGVycylgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuYW1lO1xuICAgIH1cblxuICAgIGNvbnN0IHVuaXF1ZUlkID0gTmFtZXMudW5pcXVlSWQodGhpcyk7XG5cbiAgICBpZiAodW5pcXVlSWQubGVuZ3RoIDwgMykge1xuICAgICAgcmV0dXJuIGAke3VuaXF1ZUlkfW9pZGNgO1xuICAgIH1cblxuICAgIGlmICh1bmlxdWVJZC5sZW5ndGggPiAzMikge1xuICAgICAgcmV0dXJuIHVuaXF1ZUlkLnN1YnN0cmluZygwLCAxNikgKyB1bmlxdWVJZC5zdWJzdHJpbmcodW5pcXVlSWQubGVuZ3RoIC0gMTYpO1xuICAgIH1cbiAgICByZXR1cm4gdW5pcXVlSWQ7XG4gIH1cbn1cbiJdfQ==