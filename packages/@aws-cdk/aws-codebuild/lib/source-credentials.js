"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitBucketSourceCredentials = exports.GitHubEnterpriseSourceCredentials = exports.GitHubSourceCredentials = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const codebuild_generated_1 = require("./codebuild.generated");
/**
 * The source credentials used when contacting the GitHub API.
 *
 * **Note**: CodeBuild only allows a single credential for GitHub
 * to be saved in a given AWS account in a given region -
 * any attempt to add more than one will result in an error.
 *
 * @resource AWS::CodeBuild::SourceCredential
 */
class GitHubSourceCredentials extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_GitHubSourceCredentialsProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, GitHubSourceCredentials);
            }
            throw error;
        }
        new codebuild_generated_1.CfnSourceCredential(this, 'Resource', {
            serverType: 'GITHUB',
            authType: 'PERSONAL_ACCESS_TOKEN',
            token: props.accessToken.unsafeUnwrap(),
        });
    }
}
exports.GitHubSourceCredentials = GitHubSourceCredentials;
_a = JSII_RTTI_SYMBOL_1;
GitHubSourceCredentials[_a] = { fqn: "@aws-cdk/aws-codebuild.GitHubSourceCredentials", version: "0.0.0" };
/**
 * The source credentials used when contacting the GitHub Enterprise API.
 *
 * **Note**: CodeBuild only allows a single credential for GitHub Enterprise
 * to be saved in a given AWS account in a given region -
 * any attempt to add more than one will result in an error.
 *
 * @resource AWS::CodeBuild::SourceCredential
 */
class GitHubEnterpriseSourceCredentials extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_GitHubEnterpriseSourceCredentialsProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, GitHubEnterpriseSourceCredentials);
            }
            throw error;
        }
        new codebuild_generated_1.CfnSourceCredential(this, 'Resource', {
            serverType: 'GITHUB_ENTERPRISE',
            authType: 'PERSONAL_ACCESS_TOKEN',
            token: props.accessToken.unsafeUnwrap(),
        });
    }
}
exports.GitHubEnterpriseSourceCredentials = GitHubEnterpriseSourceCredentials;
_b = JSII_RTTI_SYMBOL_1;
GitHubEnterpriseSourceCredentials[_b] = { fqn: "@aws-cdk/aws-codebuild.GitHubEnterpriseSourceCredentials", version: "0.0.0" };
/**
 * The source credentials used when contacting the BitBucket API.
 *
 * **Note**: CodeBuild only allows a single credential for BitBucket
 * to be saved in a given AWS account in a given region -
 * any attempt to add more than one will result in an error.
 *
 * @resource AWS::CodeBuild::SourceCredential
 */
class BitBucketSourceCredentials extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_BitBucketSourceCredentialsProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, BitBucketSourceCredentials);
            }
            throw error;
        }
        new codebuild_generated_1.CfnSourceCredential(this, 'Resource', {
            serverType: 'BITBUCKET',
            authType: 'BASIC_AUTH',
            username: props.username.unsafeUnwrap(),
            token: props.password.unsafeUnwrap(),
        });
    }
}
exports.BitBucketSourceCredentials = BitBucketSourceCredentials;
_c = JSII_RTTI_SYMBOL_1;
BitBucketSourceCredentials[_c] = { fqn: "@aws-cdk/aws-codebuild.BitBucketSourceCredentials", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlLWNyZWRlbnRpYWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic291cmNlLWNyZWRlbnRpYWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUFzRDtBQUV0RCwrREFBNEQ7QUFZNUQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFhLHVCQUF3QixTQUFRLGVBQVE7SUFDbkQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFtQztRQUMzRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBRlIsdUJBQXVCOzs7O1FBSWhDLElBQUkseUNBQW1CLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUN4QyxVQUFVLEVBQUUsUUFBUTtZQUNwQixRQUFRLEVBQUUsdUJBQXVCO1lBQ2pDLEtBQUssRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRTtTQUN4QyxDQUFDLENBQUM7S0FDSjs7QUFUSCwwREFVQzs7O0FBYUQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFhLGlDQUFrQyxTQUFRLGVBQVE7SUFDN0QsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE2QztRQUNyRixLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBRlIsaUNBQWlDOzs7O1FBSTFDLElBQUkseUNBQW1CLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUN4QyxVQUFVLEVBQUUsbUJBQW1CO1lBQy9CLFFBQVEsRUFBRSx1QkFBdUI7WUFDakMsS0FBSyxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFFO1NBQ3hDLENBQUMsQ0FBQztLQUNKOztBQVRILDhFQVVDOzs7QUFhRDs7Ozs7Ozs7R0FRRztBQUNILE1BQWEsMEJBQTJCLFNBQVEsZUFBUTtJQUN0RCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNDO1FBQzlFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0FGUiwwQkFBMEI7Ozs7UUFJbkMsSUFBSSx5Q0FBbUIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3hDLFVBQVUsRUFBRSxXQUFXO1lBQ3ZCLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRTtZQUN2QyxLQUFLLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUU7U0FDckMsQ0FBQyxDQUFDO0tBQ0o7O0FBVkgsZ0VBV0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXNvdXJjZSwgU2VjcmV0VmFsdWUgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuU291cmNlQ3JlZGVudGlhbCB9IGZyb20gJy4vY29kZWJ1aWxkLmdlbmVyYXRlZCc7XG5cbi8qKlxuICogQ3JlYXRpb24gcHJvcGVydGllcyBmb3IgYEdpdEh1YlNvdXJjZUNyZWRlbnRpYWxzYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBHaXRIdWJTb3VyY2VDcmVkZW50aWFsc1Byb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBwZXJzb25hbCBhY2Nlc3MgdG9rZW4gdG8gdXNlIHdoZW4gY29udGFjdGluZyB0aGUgR2l0SHViIEFQSS5cbiAgICovXG4gIHJlYWRvbmx5IGFjY2Vzc1Rva2VuOiBTZWNyZXRWYWx1ZTtcbn1cblxuLyoqXG4gKiBUaGUgc291cmNlIGNyZWRlbnRpYWxzIHVzZWQgd2hlbiBjb250YWN0aW5nIHRoZSBHaXRIdWIgQVBJLlxuICpcbiAqICoqTm90ZSoqOiBDb2RlQnVpbGQgb25seSBhbGxvd3MgYSBzaW5nbGUgY3JlZGVudGlhbCBmb3IgR2l0SHViXG4gKiB0byBiZSBzYXZlZCBpbiBhIGdpdmVuIEFXUyBhY2NvdW50IGluIGEgZ2l2ZW4gcmVnaW9uIC1cbiAqIGFueSBhdHRlbXB0IHRvIGFkZCBtb3JlIHRoYW4gb25lIHdpbGwgcmVzdWx0IGluIGFuIGVycm9yLlxuICpcbiAqIEByZXNvdXJjZSBBV1M6OkNvZGVCdWlsZDo6U291cmNlQ3JlZGVudGlhbFxuICovXG5leHBvcnQgY2xhc3MgR2l0SHViU291cmNlQ3JlZGVudGlhbHMgZXh0ZW5kcyBSZXNvdXJjZSB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBHaXRIdWJTb3VyY2VDcmVkZW50aWFsc1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIG5ldyBDZm5Tb3VyY2VDcmVkZW50aWFsKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHNlcnZlclR5cGU6ICdHSVRIVUInLFxuICAgICAgYXV0aFR5cGU6ICdQRVJTT05BTF9BQ0NFU1NfVE9LRU4nLFxuICAgICAgdG9rZW46IHByb3BzLmFjY2Vzc1Rva2VuLnVuc2FmZVVud3JhcCgpLCAvLyBTYWZlIHVzYWdlXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGlvbiBwcm9wZXJ0aWVzIGZvciBgR2l0SHViRW50ZXJwcmlzZVNvdXJjZUNyZWRlbnRpYWxzYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBHaXRIdWJFbnRlcnByaXNlU291cmNlQ3JlZGVudGlhbHNQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgcGVyc29uYWwgYWNjZXNzIHRva2VuIHRvIHVzZSB3aGVuIGNvbnRhY3RpbmcgdGhlXG4gICAqIGluc3RhbmNlIG9mIHRoZSBHaXRIdWIgRW50ZXJwcmlzZSBBUEkuXG4gICAqL1xuICByZWFkb25seSBhY2Nlc3NUb2tlbjogU2VjcmV0VmFsdWU7XG59XG5cbi8qKlxuICogVGhlIHNvdXJjZSBjcmVkZW50aWFscyB1c2VkIHdoZW4gY29udGFjdGluZyB0aGUgR2l0SHViIEVudGVycHJpc2UgQVBJLlxuICpcbiAqICoqTm90ZSoqOiBDb2RlQnVpbGQgb25seSBhbGxvd3MgYSBzaW5nbGUgY3JlZGVudGlhbCBmb3IgR2l0SHViIEVudGVycHJpc2VcbiAqIHRvIGJlIHNhdmVkIGluIGEgZ2l2ZW4gQVdTIGFjY291bnQgaW4gYSBnaXZlbiByZWdpb24gLVxuICogYW55IGF0dGVtcHQgdG8gYWRkIG1vcmUgdGhhbiBvbmUgd2lsbCByZXN1bHQgaW4gYW4gZXJyb3IuXG4gKlxuICogQHJlc291cmNlIEFXUzo6Q29kZUJ1aWxkOjpTb3VyY2VDcmVkZW50aWFsXG4gKi9cbmV4cG9ydCBjbGFzcyBHaXRIdWJFbnRlcnByaXNlU291cmNlQ3JlZGVudGlhbHMgZXh0ZW5kcyBSZXNvdXJjZSB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBHaXRIdWJFbnRlcnByaXNlU291cmNlQ3JlZGVudGlhbHNQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBuZXcgQ2ZuU291cmNlQ3JlZGVudGlhbCh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBzZXJ2ZXJUeXBlOiAnR0lUSFVCX0VOVEVSUFJJU0UnLFxuICAgICAgYXV0aFR5cGU6ICdQRVJTT05BTF9BQ0NFU1NfVE9LRU4nLFxuICAgICAgdG9rZW46IHByb3BzLmFjY2Vzc1Rva2VuLnVuc2FmZVVud3JhcCgpLCAvLyBTYWZlIHVzYWdlXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBvZiBgQml0QnVja2V0U291cmNlQ3JlZGVudGlhbHNgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJpdEJ1Y2tldFNvdXJjZUNyZWRlbnRpYWxzUHJvcHMge1xuICAvKiogWW91ciBCaXRCdWNrZXQgdXNlcm5hbWUuICovXG4gIHJlYWRvbmx5IHVzZXJuYW1lOiBTZWNyZXRWYWx1ZTtcblxuICAvKiogWW91ciBCaXRCdWNrZXQgYXBwbGljYXRpb24gcGFzc3dvcmQuICovXG4gIHJlYWRvbmx5IHBhc3N3b3JkOiBTZWNyZXRWYWx1ZTtcbn1cblxuLyoqXG4gKiBUaGUgc291cmNlIGNyZWRlbnRpYWxzIHVzZWQgd2hlbiBjb250YWN0aW5nIHRoZSBCaXRCdWNrZXQgQVBJLlxuICpcbiAqICoqTm90ZSoqOiBDb2RlQnVpbGQgb25seSBhbGxvd3MgYSBzaW5nbGUgY3JlZGVudGlhbCBmb3IgQml0QnVja2V0XG4gKiB0byBiZSBzYXZlZCBpbiBhIGdpdmVuIEFXUyBhY2NvdW50IGluIGEgZ2l2ZW4gcmVnaW9uIC1cbiAqIGFueSBhdHRlbXB0IHRvIGFkZCBtb3JlIHRoYW4gb25lIHdpbGwgcmVzdWx0IGluIGFuIGVycm9yLlxuICpcbiAqIEByZXNvdXJjZSBBV1M6OkNvZGVCdWlsZDo6U291cmNlQ3JlZGVudGlhbFxuICovXG5leHBvcnQgY2xhc3MgQml0QnVja2V0U291cmNlQ3JlZGVudGlhbHMgZXh0ZW5kcyBSZXNvdXJjZSB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBCaXRCdWNrZXRTb3VyY2VDcmVkZW50aWFsc1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIG5ldyBDZm5Tb3VyY2VDcmVkZW50aWFsKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHNlcnZlclR5cGU6ICdCSVRCVUNLRVQnLFxuICAgICAgYXV0aFR5cGU6ICdCQVNJQ19BVVRIJyxcbiAgICAgIHVzZXJuYW1lOiBwcm9wcy51c2VybmFtZS51bnNhZmVVbndyYXAoKSwgLy8gU2FmZSB1c2FnZVxuICAgICAgdG9rZW46IHByb3BzLnBhc3N3b3JkLnVuc2FmZVVud3JhcCgpLCAvLyBTYWZlIHVzYWdlXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==