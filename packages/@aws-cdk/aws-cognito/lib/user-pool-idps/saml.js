"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPoolIdentityProviderSaml = exports.UserPoolIdentityProviderSamlMetadata = exports.UserPoolIdentityProviderSamlMetadataType = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const user_pool_idp_base_1 = require("./private/user-pool-idp-base");
const cognito_generated_1 = require("../cognito.generated");
/**
 * Metadata types that can be used for a SAML user pool identity provider.
 */
var UserPoolIdentityProviderSamlMetadataType;
(function (UserPoolIdentityProviderSamlMetadataType) {
    /** Metadata provided via a URL. */
    UserPoolIdentityProviderSamlMetadataType["URL"] = "url";
    /** Metadata provided via the contents of a file. */
    UserPoolIdentityProviderSamlMetadataType["FILE"] = "file";
})(UserPoolIdentityProviderSamlMetadataType = exports.UserPoolIdentityProviderSamlMetadataType || (exports.UserPoolIdentityProviderSamlMetadataType = {}));
/**
 * Metadata for a SAML user pool identity provider.
 */
class UserPoolIdentityProviderSamlMetadata {
    /**
     * Construct the metadata for a SAML identity provider.
     *
     * @param metadataContent A URL hosting SAML metadata, or the content of a file containing SAML metadata.
     * @param metadataType The type of metadata, either a URL or file content.
     */
    constructor(metadataContent, metadataType) {
        this.metadataContent = metadataContent;
        this.metadataType = metadataType;
    }
    /**
     * Specify SAML metadata via a URL.
     */
    static url(url) {
        return new UserPoolIdentityProviderSamlMetadata(url, UserPoolIdentityProviderSamlMetadataType.URL);
    }
    /**
     * Specify SAML metadata via the contents of a file.
     */
    static file(fileContent) {
        return new UserPoolIdentityProviderSamlMetadata(fileContent, UserPoolIdentityProviderSamlMetadataType.FILE);
    }
}
exports.UserPoolIdentityProviderSamlMetadata = UserPoolIdentityProviderSamlMetadata;
_a = JSII_RTTI_SYMBOL_1;
UserPoolIdentityProviderSamlMetadata[_a] = { fqn: "@aws-cdk/aws-cognito.UserPoolIdentityProviderSamlMetadata", version: "0.0.0" };
/**
 * Represents a identity provider that integrates with SAML.
 * @resource AWS::Cognito::UserPoolIdentityProvider
 */
class UserPoolIdentityProviderSaml extends user_pool_idp_base_1.UserPoolIdentityProviderBase {
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_UserPoolIdentityProviderSamlProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, UserPoolIdentityProviderSaml);
            }
            throw error;
        }
        this.validateName(props.name);
        const { metadataType, metadataContent } = props.metadata;
        const resource = new cognito_generated_1.CfnUserPoolIdentityProvider(this, 'Resource', {
            userPoolId: props.userPool.userPoolId,
            providerName: this.getProviderName(props.name),
            providerType: 'SAML',
            providerDetails: {
                IDPSignout: props.idpSignout ?? false,
                MetadataURL: metadataType === UserPoolIdentityProviderSamlMetadataType.URL ? metadataContent : undefined,
                MetadataFile: metadataType === UserPoolIdentityProviderSamlMetadataType.FILE ? metadataContent : undefined,
            },
            idpIdentifiers: props.identifiers,
            attributeMapping: super.configureAttributeMapping(),
        });
        this.providerName = super.getResourceNameAttribute(resource.ref);
    }
    getProviderName(name) {
        if (name) {
            this.validateName(name);
            return name;
        }
        const uniqueName = core_1.Names.uniqueResourceName(this, {
            maxLength: 32,
        });
        if (uniqueName.length < 3) {
            return `${uniqueName}saml`;
        }
        return uniqueName;
    }
    validateName(name) {
        if (name && !core_1.Token.isUnresolved(name) && (name.length < 3 || name.length > 32)) {
            throw new Error(`Expected provider name to be between 3 and 32 characters, received ${name} (${name.length} characters)`);
        }
    }
}
exports.UserPoolIdentityProviderSaml = UserPoolIdentityProviderSaml;
_b = JSII_RTTI_SYMBOL_1;
UserPoolIdentityProviderSaml[_b] = { fqn: "@aws-cdk/aws-cognito.UserPoolIdentityProviderSaml", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNhbWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQTZDO0FBRzdDLHFFQUE0RTtBQUM1RSw0REFBbUU7QUFtQ25FOztHQUVHO0FBQ0gsSUFBWSx3Q0FNWDtBQU5ELFdBQVksd0NBQXdDO0lBQ2xELG1DQUFtQztJQUNuQyx1REFBVyxDQUFBO0lBRVgsb0RBQW9EO0lBQ3BELHlEQUFhLENBQUE7QUFDZixDQUFDLEVBTlcsd0NBQXdDLEdBQXhDLGdEQUF3QyxLQUF4QyxnREFBd0MsUUFNbkQ7QUFFRDs7R0FFRztBQUNILE1BQWEsb0NBQW9DO0lBZ0IvQzs7Ozs7T0FLRztJQUNILFlBQW9DLGVBQXVCLEVBQWtCLFlBQXNEO1FBQS9GLG9CQUFlLEdBQWYsZUFBZSxDQUFRO1FBQWtCLGlCQUFZLEdBQVosWUFBWSxDQUEwQztLQUNsSTtJQXJCRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBVztRQUMzQixPQUFPLElBQUksb0NBQW9DLENBQUMsR0FBRyxFQUFFLHdDQUF3QyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3BHO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQW1CO1FBQ3BDLE9BQU8sSUFBSSxvQ0FBb0MsQ0FBQyxXQUFXLEVBQUUsd0NBQXdDLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDN0c7O0FBZEgsb0ZBd0JDOzs7QUFFRDs7O0dBR0c7QUFDSCxNQUFhLDRCQUE2QixTQUFRLGlEQUE0QjtJQUc1RSxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXdDO1FBQ2hGLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDOzs7Ozs7K0NBSmYsNEJBQTRCOzs7O1FBTXJDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTlCLE1BQU0sRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUV6RCxNQUFNLFFBQVEsR0FBRyxJQUFJLCtDQUEyQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDakUsVUFBVSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVTtZQUNyQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQzlDLFlBQVksRUFBRSxNQUFNO1lBQ3BCLGVBQWUsRUFBRTtnQkFDZixVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVUsSUFBSSxLQUFLO2dCQUNyQyxXQUFXLEVBQUUsWUFBWSxLQUFLLHdDQUF3QyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxTQUFTO2dCQUN4RyxZQUFZLEVBQUUsWUFBWSxLQUFLLHdDQUF3QyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxTQUFTO2FBQzNHO1lBQ0QsY0FBYyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQ2pDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyx5QkFBeUIsRUFBRTtTQUNwRCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDbEU7SUFFTyxlQUFlLENBQUMsSUFBYTtRQUNuQyxJQUFJLElBQUksRUFBRTtZQUNSLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE1BQU0sVUFBVSxHQUFHLFlBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUU7WUFDaEQsU0FBUyxFQUFFLEVBQUU7U0FDZCxDQUFDLENBQUM7UUFFSCxJQUFJLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3pCLE9BQU8sR0FBRyxVQUFVLE1BQU0sQ0FBQztTQUM1QjtRQUVELE9BQU8sVUFBVSxDQUFDO0tBQ25CO0lBRU8sWUFBWSxDQUFDLElBQWE7UUFDaEMsSUFBSSxJQUFJLElBQUksQ0FBQyxZQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRTtZQUM5RSxNQUFNLElBQUksS0FBSyxDQUFDLHNFQUFzRSxJQUFJLEtBQUssSUFBSSxDQUFDLE1BQU0sY0FBYyxDQUFDLENBQUM7U0FDM0g7S0FDRjs7QUEvQ0gsb0VBZ0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmFtZXMsIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclByb3BzIH0gZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckJhc2UgfSBmcm9tICcuL3ByaXZhdGUvdXNlci1wb29sLWlkcC1iYXNlJztcbmltcG9ydCB7IENmblVzZXJQb29sSWRlbnRpdHlQcm92aWRlciB9IGZyb20gJy4uL2NvZ25pdG8uZ2VuZXJhdGVkJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIHRvIGluaXRpYWxpemUgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyU2FtbC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJTYW1sUHJvcHMgZXh0ZW5kcyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgcHJvdmlkZXIuIE11c3QgYmUgYmV0d2VlbiAzIGFuZCAzMiBjaGFyYWN0ZXJzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSB1bmlxdWUgSUQgb2YgdGhlIGNvbnN0cnVjdFxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogSWRlbnRpZmllcnNcbiAgICpcbiAgICogSWRlbnRpZmllcnMgY2FuIGJlIHVzZWQgdG8gcmVkaXJlY3QgdXNlcnMgdG8gdGhlIGNvcnJlY3QgSWRQIGluIG11bHRpdGVuYW50IGFwcHMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gaWRlbnRpZmllcnMgdXNlZFxuICAgKi9cbiAgcmVhZG9ubHkgaWRlbnRpZmllcnM/OiBzdHJpbmdbXVxuXG4gIC8qKlxuICAgKiBUaGUgU0FNTCBtZXRhZGF0YS5cbiAgICovXG4gIHJlYWRvbmx5IG1ldGFkYXRhOiBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJTYW1sTWV0YWRhdGE7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZW5hYmxlIHRoZSBcIlNpZ24tb3V0IGZsb3dcIiBmZWF0dXJlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGZhbHNlXG4gICAqL1xuICByZWFkb25seSBpZHBTaWdub3V0PzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBNZXRhZGF0YSB0eXBlcyB0aGF0IGNhbiBiZSB1c2VkIGZvciBhIFNBTUwgdXNlciBwb29sIGlkZW50aXR5IHByb3ZpZGVyLlxuICovXG5leHBvcnQgZW51bSBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJTYW1sTWV0YWRhdGFUeXBlIHtcbiAgLyoqIE1ldGFkYXRhIHByb3ZpZGVkIHZpYSBhIFVSTC4gKi9cbiAgVVJMID0gJ3VybCcsXG5cbiAgLyoqIE1ldGFkYXRhIHByb3ZpZGVkIHZpYSB0aGUgY29udGVudHMgb2YgYSBmaWxlLiAqL1xuICBGSUxFID0gJ2ZpbGUnLFxufVxuXG4vKipcbiAqIE1ldGFkYXRhIGZvciBhIFNBTUwgdXNlciBwb29sIGlkZW50aXR5IHByb3ZpZGVyLlxuICovXG5leHBvcnQgY2xhc3MgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyU2FtbE1ldGFkYXRhIHtcblxuICAvKipcbiAgICogU3BlY2lmeSBTQU1MIG1ldGFkYXRhIHZpYSBhIFVSTC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgdXJsKHVybDogc3RyaW5nKTogVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyU2FtbE1ldGFkYXRhIHtcbiAgICByZXR1cm4gbmV3IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclNhbWxNZXRhZGF0YSh1cmwsIFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclNhbWxNZXRhZGF0YVR5cGUuVVJMKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTcGVjaWZ5IFNBTUwgbWV0YWRhdGEgdmlhIHRoZSBjb250ZW50cyBvZiBhIGZpbGUuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZpbGUoZmlsZUNvbnRlbnQ6IHN0cmluZyk6IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclNhbWxNZXRhZGF0YSB7XG4gICAgcmV0dXJuIG5ldyBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJTYW1sTWV0YWRhdGEoZmlsZUNvbnRlbnQsIFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclNhbWxNZXRhZGF0YVR5cGUuRklMRSk7XG4gIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0IHRoZSBtZXRhZGF0YSBmb3IgYSBTQU1MIGlkZW50aXR5IHByb3ZpZGVyLlxuICAgKlxuICAgKiBAcGFyYW0gbWV0YWRhdGFDb250ZW50IEEgVVJMIGhvc3RpbmcgU0FNTCBtZXRhZGF0YSwgb3IgdGhlIGNvbnRlbnQgb2YgYSBmaWxlIGNvbnRhaW5pbmcgU0FNTCBtZXRhZGF0YS5cbiAgICogQHBhcmFtIG1ldGFkYXRhVHlwZSBUaGUgdHlwZSBvZiBtZXRhZGF0YSwgZWl0aGVyIGEgVVJMIG9yIGZpbGUgY29udGVudC5cbiAgICovXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IG1ldGFkYXRhQ29udGVudDogc3RyaW5nLCBwdWJsaWMgcmVhZG9ubHkgbWV0YWRhdGFUeXBlOiBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXJTYW1sTWV0YWRhdGFUeXBlKSB7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgaWRlbnRpdHkgcHJvdmlkZXIgdGhhdCBpbnRlZ3JhdGVzIHdpdGggU0FNTC5cbiAqIEByZXNvdXJjZSBBV1M6OkNvZ25pdG86OlVzZXJQb29sSWRlbnRpdHlQcm92aWRlclxuICovXG5leHBvcnQgY2xhc3MgVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyU2FtbCBleHRlbmRzIFVzZXJQb29sSWRlbnRpdHlQcm92aWRlckJhc2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgcHJvdmlkZXJOYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclNhbWxQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgdGhpcy52YWxpZGF0ZU5hbWUocHJvcHMubmFtZSk7XG5cbiAgICBjb25zdCB7IG1ldGFkYXRhVHlwZSwgbWV0YWRhdGFDb250ZW50IH0gPSBwcm9wcy5tZXRhZGF0YTtcblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmblVzZXJQb29sSWRlbnRpdHlQcm92aWRlcih0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICB1c2VyUG9vbElkOiBwcm9wcy51c2VyUG9vbC51c2VyUG9vbElkLFxuICAgICAgcHJvdmlkZXJOYW1lOiB0aGlzLmdldFByb3ZpZGVyTmFtZShwcm9wcy5uYW1lKSxcbiAgICAgIHByb3ZpZGVyVHlwZTogJ1NBTUwnLFxuICAgICAgcHJvdmlkZXJEZXRhaWxzOiB7XG4gICAgICAgIElEUFNpZ25vdXQ6IHByb3BzLmlkcFNpZ25vdXQgPz8gZmFsc2UsXG4gICAgICAgIE1ldGFkYXRhVVJMOiBtZXRhZGF0YVR5cGUgPT09IFVzZXJQb29sSWRlbnRpdHlQcm92aWRlclNhbWxNZXRhZGF0YVR5cGUuVVJMID8gbWV0YWRhdGFDb250ZW50IDogdW5kZWZpbmVkLFxuICAgICAgICBNZXRhZGF0YUZpbGU6IG1ldGFkYXRhVHlwZSA9PT0gVXNlclBvb2xJZGVudGl0eVByb3ZpZGVyU2FtbE1ldGFkYXRhVHlwZS5GSUxFID8gbWV0YWRhdGFDb250ZW50IDogdW5kZWZpbmVkLFxuICAgICAgfSxcbiAgICAgIGlkcElkZW50aWZpZXJzOiBwcm9wcy5pZGVudGlmaWVycyxcbiAgICAgIGF0dHJpYnV0ZU1hcHBpbmc6IHN1cGVyLmNvbmZpZ3VyZUF0dHJpYnV0ZU1hcHBpbmcoKSxcbiAgICB9KTtcblxuICAgIHRoaXMucHJvdmlkZXJOYW1lID0gc3VwZXIuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKHJlc291cmNlLnJlZik7XG4gIH1cblxuICBwcml2YXRlIGdldFByb3ZpZGVyTmFtZShuYW1lPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAobmFtZSkge1xuICAgICAgdGhpcy52YWxpZGF0ZU5hbWUobmFtZSk7XG4gICAgICByZXR1cm4gbmFtZTtcbiAgICB9XG5cbiAgICBjb25zdCB1bmlxdWVOYW1lID0gTmFtZXMudW5pcXVlUmVzb3VyY2VOYW1lKHRoaXMsIHtcbiAgICAgIG1heExlbmd0aDogMzIsXG4gICAgfSk7XG5cbiAgICBpZiAodW5pcXVlTmFtZS5sZW5ndGggPCAzKSB7XG4gICAgICByZXR1cm4gYCR7dW5pcXVlTmFtZX1zYW1sYDtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5pcXVlTmFtZTtcbiAgfVxuXG4gIHByaXZhdGUgdmFsaWRhdGVOYW1lKG5hbWU/OiBzdHJpbmcpIHtcbiAgICBpZiAobmFtZSAmJiAhVG9rZW4uaXNVbnJlc29sdmVkKG5hbWUpICYmIChuYW1lLmxlbmd0aCA8IDMgfHwgbmFtZS5sZW5ndGggPiAzMikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgcHJvdmlkZXIgbmFtZSB0byBiZSBiZXR3ZWVuIDMgYW5kIDMyIGNoYXJhY3RlcnMsIHJlY2VpdmVkICR7bmFtZX0gKCR7bmFtZS5sZW5ndGh9IGNoYXJhY3RlcnMpYCk7XG4gICAgfVxuICB9XG59XG4iXX0=