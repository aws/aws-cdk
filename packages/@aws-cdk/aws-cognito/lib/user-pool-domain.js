"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPoolDomain = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const custom_resources_1 = require("@aws-cdk/custom-resources");
const cognito_generated_1 = require("./cognito.generated");
/**
 * Define a user pool domain
 */
class UserPoolDomain extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_UserPoolDomainProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, UserPoolDomain);
            }
            throw error;
        }
        if (!!props.customDomain === !!props.cognitoDomain) {
            throw new Error('One of, and only one of, cognitoDomain or customDomain must be specified');
        }
        if (props.cognitoDomain?.domainPrefix &&
            !core_1.Token.isUnresolved(props.cognitoDomain?.domainPrefix) &&
            !/^[a-z0-9-]+$/.test(props.cognitoDomain.domainPrefix)) {
            throw new Error('domainPrefix for cognitoDomain can contain only lowercase alphabets, numbers and hyphens');
        }
        this.isCognitoDomain = !!props.cognitoDomain;
        const domainName = props.cognitoDomain?.domainPrefix || props.customDomain?.domainName;
        const resource = new cognito_generated_1.CfnUserPoolDomain(this, 'Resource', {
            userPoolId: props.userPool.userPoolId,
            domain: domainName,
            customDomainConfig: props.customDomain ? { certificateArn: props.customDomain.certificate.certificateArn } : undefined,
        });
        this.domainName = resource.ref;
    }
    /**
     * Import a UserPoolDomain given its domain name
     */
    static fromDomainName(scope, id, userPoolDomainName) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.domainName = userPoolDomainName;
            }
        }
        return new Import(scope, id);
    }
    /**
     * The domain name of the CloudFront distribution associated with the user pool domain.
     */
    get cloudFrontDomainName() {
        if (!this.cloudFrontCustomResource) {
            const sdkCall = {
                service: 'CognitoIdentityServiceProvider',
                action: 'describeUserPoolDomain',
                parameters: {
                    Domain: this.domainName,
                },
                physicalResourceId: custom_resources_1.PhysicalResourceId.of(this.domainName),
            };
            this.cloudFrontCustomResource = new custom_resources_1.AwsCustomResource(this, 'CloudFrontDomainName', {
                resourceType: 'Custom::UserPoolCloudFrontDomainName',
                onCreate: sdkCall,
                onUpdate: sdkCall,
                policy: custom_resources_1.AwsCustomResourcePolicy.fromSdkCalls({
                    // DescribeUserPoolDomain only supports access level '*'
                    // https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazoncognitouserpools.html#amazoncognitouserpools-actions-as-permissions
                    resources: ['*'],
                }),
                // APIs are available in 2.1055.0
                installLatestAwsSdk: false,
            });
        }
        return this.cloudFrontCustomResource.getResponseField('DomainDescription.CloudFrontDistribution');
    }
    /**
     * The URL to the hosted UI associated with this domain
     *
     * @param options options to customize baseUrl
     */
    baseUrl(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_BaseUrlOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.baseUrl);
            }
            throw error;
        }
        if (this.isCognitoDomain) {
            const authDomain = 'auth' + (options?.fips ? '-fips' : '');
            return `https://${this.domainName}.${authDomain}.${core_1.Stack.of(this).region}.amazoncognito.com`;
        }
        return `https://${this.domainName}`;
    }
    /**
     * The URL to the sign in page in this domain using a specific UserPoolClient
     * @param client [disable-awslint:ref-via-interface] the user pool client that the UI will use to interact with the UserPool
     * @param options options to customize signInUrl.
     */
    signInUrl(client, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_UserPoolClient(client);
            jsiiDeprecationWarnings._aws_cdk_aws_cognito_SignInUrlOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.signInUrl);
            }
            throw error;
        }
        let responseType;
        if (client.oAuthFlows.authorizationCodeGrant) {
            responseType = 'code';
        }
        else if (client.oAuthFlows.implicitCodeGrant) {
            responseType = 'token';
        }
        else {
            throw new Error('signInUrl is not supported for clients without authorizationCodeGrant or implicitCodeGrant flow enabled');
        }
        const path = options.signInPath ?? '/login';
        return `${this.baseUrl(options)}${path}?client_id=${client.userPoolClientId}&response_type=${responseType}&redirect_uri=${options.redirectUri}`;
    }
}
exports.UserPoolDomain = UserPoolDomain;
_a = JSII_RTTI_SYMBOL_1;
UserPoolDomain[_a] = { fqn: "@aws-cdk/aws-cognito.UserPoolDomain", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wb29sLWRvbWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZXItcG9vbC1kb21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esd0NBQWtFO0FBQ2xFLGdFQUF1SDtBQUV2SCwyREFBd0Q7QUEyRXhEOztHQUVHO0FBQ0gsTUFBYSxjQUFlLFNBQVEsZUFBUTtJQWlCMUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEwQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBbEJSLGNBQWM7Ozs7UUFvQnZCLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxZQUFZLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUU7WUFDbEQsTUFBTSxJQUFJLEtBQUssQ0FBQywwRUFBMEUsQ0FBQyxDQUFDO1NBQzdGO1FBRUQsSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFLFlBQVk7WUFDbkMsQ0FBQyxZQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDO1lBQ3RELENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBRXhELE1BQU0sSUFBSSxLQUFLLENBQUMsMEZBQTBGLENBQUMsQ0FBQztTQUM3RztRQUVELElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUM7UUFFN0MsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLGFBQWEsRUFBRSxZQUFZLElBQUksS0FBSyxDQUFDLFlBQVksRUFBRSxVQUFXLENBQUM7UUFDeEYsTUFBTSxRQUFRLEdBQUcsSUFBSSxxQ0FBaUIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3ZELFVBQVUsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVU7WUFDckMsTUFBTSxFQUFFLFVBQVU7WUFDbEIsa0JBQWtCLEVB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QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElDZXJ0aWZpY2F0ZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1jZXJ0aWZpY2F0ZW1hbmFnZXInO1xuaW1wb3J0IHsgSVJlc291cmNlLCBSZXNvdXJjZSwgU3RhY2ssIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBBd3NDdXN0b21SZXNvdXJjZSwgQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3ksIEF3c1Nka0NhbGwsIFBoeXNpY2FsUmVzb3VyY2VJZCB9IGZyb20gJ0Bhd3MtY2RrL2N1c3RvbS1yZXNvdXJjZXMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5Vc2VyUG9vbERvbWFpbiB9IGZyb20gJy4vY29nbml0by5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSVVzZXJQb29sIH0gZnJvbSAnLi91c2VyLXBvb2wnO1xuaW1wb3J0IHsgVXNlclBvb2xDbGllbnQgfSBmcm9tICcuL3VzZXItcG9vbC1jbGllbnQnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSB1c2VyIHBvb2wgZG9tYWluLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElVc2VyUG9vbERvbWFpbiBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBUaGUgZG9tYWluIHRoYXQgd2FzIHNwZWNpZmllZCB0byBiZSBjcmVhdGVkLlxuICAgKiBJZiBgY3VzdG9tRG9tYWluYCB3YXMgc2VsZWN0ZWQsIHRoaXMgaG9sZHMgdGhlIGZ1bGwgZG9tYWluIG5hbWUgdGhhdCB3YXMgc3BlY2lmaWVkLlxuICAgKiBJZiB0aGUgYGNvZ25pdG9Eb21haW5gIHdhcyB1c2VkLCBpdCBjb250YWlucyB0aGUgcHJlZml4IHRvIHRoZSBDb2duaXRvIGhvc3RlZCBkb21haW4uXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGRvbWFpbk5hbWU6IHN0cmluZztcbn1cblxuLyoqXG4gKiBPcHRpb25zIHdoaWxlIHNwZWNpZnlpbmcgY3VzdG9tIGRvbWFpblxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29nbml0by9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvY29nbml0by11c2VyLXBvb2xzLWFkZC1jdXN0b20tZG9tYWluLmh0bWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDdXN0b21Eb21haW5PcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBjdXN0b20gZG9tYWluIG5hbWUgdGhhdCB5b3Ugd291bGQgbGlrZSB0byBhc3NvY2lhdGUgd2l0aCB0aGlzIFVzZXIgUG9vbC5cbiAgICovXG4gIHJlYWRvbmx5IGRvbWFpbk5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNlcnRpZmljYXRlIHRvIGFzc29jaWF0ZSB3aXRoIHRoaXMgZG9tYWluLlxuICAgKi9cbiAgcmVhZG9ubHkgY2VydGlmaWNhdGU6IElDZXJ0aWZpY2F0ZTtcbn1cblxuLyoqXG4gKiBPcHRpb25zIHdoaWxlIHNwZWNpZnlpbmcgYSBjb2duaXRvIHByZWZpeCBkb21haW4uXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2duaXRvL2xhdGVzdC9kZXZlbG9wZXJndWlkZS9jb2duaXRvLXVzZXItcG9vbHMtYXNzaWduLWRvbWFpbi1wcmVmaXguaHRtbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvZ25pdG9Eb21haW5PcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBwcmVmaXggdG8gdGhlIENvZ25pdG8gaG9zdGVkIGRvbWFpbiBuYW1lIHRoYXQgd2lsbCBiZSBhc3NvY2lhdGVkIHdpdGggdGhlIHVzZXIgcG9vbC5cbiAgICovXG4gIHJlYWRvbmx5IGRvbWFpblByZWZpeDogc3RyaW5nO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgdG8gY3JlYXRlIGEgVXNlclBvb2xEb21haW5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVc2VyUG9vbERvbWFpbk9wdGlvbnMge1xuICAvKipcbiAgICogQXNzb2NpYXRlIGEgY3VzdG9tIGRvbWFpbiB3aXRoIHlvdXIgdXNlciBwb29sXG4gICAqIEVpdGhlciBgY3VzdG9tRG9tYWluYCBvciBgY29nbml0b0RvbWFpbmAgbXVzdCBiZSBzcGVjaWZpZWQuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2NvZ25pdG8tdXNlci1wb29scy1hZGQtY3VzdG9tLWRvbWFpbi5odG1sXG4gICAqIEBkZWZhdWx0IC0gbm90IHNldCBpZiBgY29nbml0b0RvbWFpbmAgaXMgc3BlY2lmaWVkLCBvdGhlcndpc2UsIHRocm93cyBhbiBlcnJvci5cbiAgICovXG4gIHJlYWRvbmx5IGN1c3RvbURvbWFpbj86IEN1c3RvbURvbWFpbk9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIEFzc29jaWF0ZSBhIGNvZ25pdG8gcHJlZml4IGRvbWFpbiB3aXRoIHlvdXIgdXNlciBwb29sXG4gICAqIEVpdGhlciBgY3VzdG9tRG9tYWluYCBvciBgY29nbml0b0RvbWFpbmAgbXVzdCBiZSBzcGVjaWZpZWQuXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZ25pdG8vbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2NvZ25pdG8tdXNlci1wb29scy1hc3NpZ24tZG9tYWluLXByZWZpeC5odG1sXG4gICAqIEBkZWZhdWx0IC0gbm90IHNldCBpZiBgY3VzdG9tRG9tYWluYCBpcyBzcGVjaWZpZWQsIG90aGVyd2lzZSwgdGhyb3dzIGFuIGVycm9yLlxuICAgKi9cbiAgcmVhZG9ubHkgY29nbml0b0RvbWFpbj86IENvZ25pdG9Eb21haW5PcHRpb25zO1xufVxuXG4vKipcbiAqIFByb3BzIGZvciBVc2VyUG9vbERvbWFpbiBjb25zdHJ1Y3RcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVc2VyUG9vbERvbWFpblByb3BzIGV4dGVuZHMgVXNlclBvb2xEb21haW5PcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSB1c2VyIHBvb2wgdG8gd2hpY2ggdGhpcyBkb21haW4gc2hvdWxkIGJlIGFzc29jaWF0ZWQuXG4gICAqL1xuICByZWFkb25seSB1c2VyUG9vbDogSVVzZXJQb29sO1xufVxuXG4vKipcbiAqIERlZmluZSBhIHVzZXIgcG9vbCBkb21haW5cbiAqL1xuZXhwb3J0IGNsYXNzIFVzZXJQb29sRG9tYWluIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJVXNlclBvb2xEb21haW4ge1xuICAvKipcbiAgICogSW1wb3J0IGEgVXNlclBvb2xEb21haW4gZ2l2ZW4gaXRzIGRvbWFpbiBuYW1lXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Eb21haW5OYW1lKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHVzZXJQb29sRG9tYWluTmFtZTogc3RyaW5nKTogSVVzZXJQb29sRG9tYWluIHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElVc2VyUG9vbERvbWFpbiB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZG9tYWluTmFtZSA9IHVzZXJQb29sRG9tYWluTmFtZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGRvbWFpbk5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSBpc0NvZ25pdG9Eb21haW46IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSBjbG91ZEZyb250Q3VzdG9tUmVzb3VyY2U/OiBBd3NDdXN0b21SZXNvdXJjZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogVXNlclBvb2xEb21haW5Qcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBpZiAoISFwcm9wcy5jdXN0b21Eb21haW4gPT09ICEhcHJvcHMuY29nbml0b0RvbWFpbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmUgb2YsIGFuZCBvbmx5IG9uZSBvZiwgY29nbml0b0RvbWFpbiBvciBjdXN0b21Eb21haW4gbXVzdCBiZSBzcGVjaWZpZWQnKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuY29nbml0b0RvbWFpbj8uZG9tYWluUHJlZml4ICYmXG4gICAgICAhVG9rZW4uaXNVbnJlc29sdmVkKHByb3BzLmNvZ25pdG9Eb21haW4/LmRvbWFpblByZWZpeCkgJiZcbiAgICAgICEvXlthLXowLTktXSskLy50ZXN0KHByb3BzLmNvZ25pdG9Eb21haW4uZG9tYWluUHJlZml4KSkge1xuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2RvbWFpblByZWZpeCBmb3IgY29nbml0b0RvbWFpbiBjYW4gY29udGFpbiBvbmx5IGxvd2VyY2FzZSBhbHBoYWJldHMsIG51bWJlcnMgYW5kIGh5cGhlbnMnKTtcbiAgICB9XG5cbiAgICB0aGlzLmlzQ29nbml0b0RvbWFpbiA9ICEhcHJvcHMuY29nbml0b0RvbWFpbjtcblxuICAgIGNvbnN0IGRvbWFpbk5hbWUgPSBwcm9wcy5jb2duaXRvRG9tYWluPy5kb21haW5QcmVmaXggfHwgcHJvcHMuY3VzdG9tRG9tYWluPy5kb21haW5OYW1lITtcbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5Vc2VyUG9vbERvbWFpbih0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICB1c2VyUG9vbElkOiBwcm9wcy51c2VyUG9vbC51c2VyUG9vbElkLFxuICAgICAgZG9tYWluOiBkb21haW5OYW1lLFxuICAgICAgY3VzdG9tRG9tYWluQ29uZmlnOiBwcm9wcy5jdXN0b21Eb21haW4gPyB7IGNlcnRpZmljYXRlQXJuOiBwcm9wcy5jdXN0b21Eb21haW4uY2VydGlmaWNhdGUuY2VydGlmaWNhdGVBcm4gfSA6IHVuZGVmaW5lZCxcbiAgICB9KTtcblxuICAgIHRoaXMuZG9tYWluTmFtZSA9IHJlc291cmNlLnJlZjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZG9tYWluIG5hbWUgb2YgdGhlIENsb3VkRnJvbnQgZGlzdHJpYnV0aW9uIGFzc29jaWF0ZWQgd2l0aCB0aGUgdXNlciBwb29sIGRvbWFpbi5cbiAgICovXG4gIHB1YmxpYyBnZXQgY2xvdWRGcm9udERvbWFpbk5hbWUoKTogc3RyaW5nIHtcbiAgICBpZiAoIXRoaXMuY2xvdWRGcm9udEN1c3RvbVJlc291cmNlKSB7XG4gICAgICBjb25zdCBzZGtDYWxsOiBBd3NTZGtDYWxsID0ge1xuICAgICAgICBzZXJ2aWNlOiAnQ29nbml0b0lkZW50aXR5U2VydmljZVByb3ZpZGVyJyxcbiAgICAgICAgYWN0aW9uOiAnZGVzY3JpYmVVc2VyUG9vbERvbWFpbicsXG4gICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICBEb21haW46IHRoaXMuZG9tYWluTmFtZSxcbiAgICAgICAgfSxcbiAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQub2YodGhpcy5kb21haW5OYW1lKSxcbiAgICAgIH07XG4gICAgICB0aGlzLmNsb3VkRnJvbnRDdXN0b21SZXNvdXJjZSA9IG5ldyBBd3NDdXN0b21SZXNvdXJjZSh0aGlzLCAnQ2xvdWRGcm9udERvbWFpbk5hbWUnLCB7XG4gICAgICAgIHJlc291cmNlVHlwZTogJ0N1c3RvbTo6VXNlclBvb2xDbG91ZEZyb250RG9tYWluTmFtZScsXG4gICAgICAgIG9uQ3JlYXRlOiBzZGtDYWxsLFxuICAgICAgICBvblVwZGF0ZTogc2RrQ2FsbCxcbiAgICAgICAgcG9saWN5OiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU2RrQ2FsbHMoe1xuICAgICAgICAgIC8vIERlc2NyaWJlVXNlclBvb2xEb21haW4gb25seSBzdXBwb3J0cyBhY2Nlc3MgbGV2ZWwgJyonXG4gICAgICAgICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0lBTS9sYXRlc3QvVXNlckd1aWRlL2xpc3RfYW1hem9uY29nbml0b3VzZXJwb29scy5odG1sI2FtYXpvbmNvZ25pdG91c2VycG9vbHMtYWN0aW9ucy1hcy1wZXJtaXNzaW9uc1xuICAgICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgIH0pLFxuICAgICAgICAvLyBBUElzIGFyZSBhdmFpbGFibGUgaW4gMi4xMDU1LjBcbiAgICAgICAgaW5zdGFsbExhdGVzdEF3c1NkazogZmFsc2UsXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY2xvdWRGcm9udEN1c3RvbVJlc291cmNlLmdldFJlc3BvbnNlRmllbGQoJ0RvbWFpbkRlc2NyaXB0aW9uLkNsb3VkRnJvbnREaXN0cmlidXRpb24nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgVVJMIHRvIHRoZSBob3N0ZWQgVUkgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZG9tYWluXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIG9wdGlvbnMgdG8gY3VzdG9taXplIGJhc2VVcmxcbiAgICovXG4gIHB1YmxpYyBiYXNlVXJsKG9wdGlvbnM/OiBCYXNlVXJsT3B0aW9ucyk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuaXNDb2duaXRvRG9tYWluKSB7XG4gICAgICBjb25zdCBhdXRoRG9tYWluID0gJ2F1dGgnICsgKG9wdGlvbnM/LmZpcHMgPyAnLWZpcHMnIDogJycpO1xuICAgICAgcmV0dXJuIGBodHRwczovLyR7dGhpcy5kb21haW5OYW1lfS4ke2F1dGhEb21haW59LiR7U3RhY2sub2YodGhpcykucmVnaW9ufS5hbWF6b25jb2duaXRvLmNvbWA7XG4gICAgfVxuICAgIHJldHVybiBgaHR0cHM6Ly8ke3RoaXMuZG9tYWluTmFtZX1gO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBVUkwgdG8gdGhlIHNpZ24gaW4gcGFnZSBpbiB0aGlzIGRvbWFpbiB1c2luZyBhIHNwZWNpZmljIFVzZXJQb29sQ2xpZW50XG4gICAqIEBwYXJhbSBjbGllbnQgW2Rpc2FibGUtYXdzbGludDpyZWYtdmlhLWludGVyZmFjZV0gdGhlIHVzZXIgcG9vbCBjbGllbnQgdGhhdCB0aGUgVUkgd2lsbCB1c2UgdG8gaW50ZXJhY3Qgd2l0aCB0aGUgVXNlclBvb2xcbiAgICogQHBhcmFtIG9wdGlvbnMgb3B0aW9ucyB0byBjdXN0b21pemUgc2lnbkluVXJsLlxuICAgKi9cbiAgcHVibGljIHNpZ25JblVybChjbGllbnQ6IFVzZXJQb29sQ2xpZW50LCBvcHRpb25zOiBTaWduSW5VcmxPcHRpb25zKTogc3RyaW5nIHtcbiAgICBsZXQgcmVzcG9uc2VUeXBlOiBzdHJpbmc7XG4gICAgaWYgKGNsaWVudC5vQXV0aEZsb3dzLmF1dGhvcml6YXRpb25Db2RlR3JhbnQpIHtcbiAgICAgIHJlc3BvbnNlVHlwZSA9ICdjb2RlJztcbiAgICB9IGVsc2UgaWYgKGNsaWVudC5vQXV0aEZsb3dzLmltcGxpY2l0Q29kZUdyYW50KSB7XG4gICAgICByZXNwb25zZVR5cGUgPSAndG9rZW4nO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NpZ25JblVybCBpcyBub3Qgc3VwcG9ydGVkIGZvciBjbGllbnRzIHdpdGhvdXQgYXV0aG9yaXphdGlvbkNvZGVHcmFudCBvciBpbXBsaWNpdENvZGVHcmFudCBmbG93IGVuYWJsZWQnKTtcbiAgICB9XG4gICAgY29uc3QgcGF0aCA9IG9wdGlvbnMuc2lnbkluUGF0aCA/PyAnL2xvZ2luJztcbiAgICByZXR1cm4gYCR7dGhpcy5iYXNlVXJsKG9wdGlvbnMpfSR7cGF0aH0/Y2xpZW50X2lkPSR7Y2xpZW50LnVzZXJQb29sQ2xpZW50SWR9JnJlc3BvbnNlX3R5cGU9JHtyZXNwb25zZVR5cGV9JnJlZGlyZWN0X3VyaT0ke29wdGlvbnMucmVkaXJlY3RVcml9YDtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgdG8gY3VzdG9taXplIHRoZSBiZWhhdmlvdXIgb2YgYGJhc2VVcmwoKWBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBCYXNlVXJsT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIHJldHVybiB0aGUgRklQUy1jb21wbGlhbnQgZW5kcG9pbnRcbiAgICpcbiAgICogQGRlZmF1bHQgcmV0dXJuIHRoZSBzdGFuZGFyZCBVUkxcbiAgICovXG4gIHJlYWRvbmx5IGZpcHM/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgdG8gY3VzdG9taXplIHRoZSBiZWhhdmlvdXIgb2YgYHNpZ25JblVybCgpYFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNpZ25JblVybE9wdGlvbnMgZXh0ZW5kcyBCYXNlVXJsT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBXaGVyZSB0byByZWRpcmVjdCB0byBhZnRlciBzaWduIGluXG4gICAqL1xuICByZWFkb25seSByZWRpcmVjdFVyaTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcGF0aCBpbiB0aGUgVVJJIHdoZXJlIHRoZSBzaWduLWluIHBhZ2UgaXMgbG9jYXRlZFxuICAgKiBAZGVmYXVsdCAnL2xvZ2luJ1xuICAgKi9cbiAgcmVhZG9ubHkgc2lnbkluUGF0aD86IHN0cmluZztcbn1cbiJdfQ==