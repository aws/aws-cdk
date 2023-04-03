"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alias = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const kms_generated_1 = require("./kms.generated");
const REQUIRED_ALIAS_PREFIX = 'alias/';
const DISALLOWED_PREFIX = REQUIRED_ALIAS_PREFIX + 'aws/';
class AliasBase extends core_1.Resource {
    get keyArn() {
        return core_1.Stack.of(this).formatArn({
            service: 'kms',
            // aliasName already contains the '/'
            resource: this.aliasName,
        });
    }
    get keyId() {
        return this.aliasName;
    }
    addAlias(alias) {
        return this.aliasTargetKey.addAlias(alias);
    }
    addToResourcePolicy(statement, allowNoOp) {
        return this.aliasTargetKey.addToResourcePolicy(statement, allowNoOp);
    }
    grant(grantee, ...actions) {
        return this.aliasTargetKey.grant(grantee, ...actions);
    }
    grantDecrypt(grantee) {
        return this.aliasTargetKey.grantDecrypt(grantee);
    }
    grantEncrypt(grantee) {
        return this.aliasTargetKey.grantEncrypt(grantee);
    }
    grantEncryptDecrypt(grantee) {
        return this.aliasTargetKey.grantEncryptDecrypt(grantee);
    }
    grantGenerateMac(grantee) {
        return this.aliasTargetKey.grantGenerateMac(grantee);
    }
    grantVerifyMac(grantee) {
        return this.aliasTargetKey.grantVerifyMac(grantee);
    }
}
/**
 * Defines a display name for a customer master key (CMK) in AWS Key Management
 * Service (AWS KMS). Using an alias to refer to a key can help you simplify key
 * management. For example, when rotating keys, you can just update the alias
 * mapping instead of tracking and changing key IDs. For more information, see
 * Working with Aliases in the AWS Key Management Service Developer Guide.
 *
 * You can also add an alias for a key by calling `key.addAlias(alias)`.
 *
 * @resource AWS::KMS::Alias
 */
class Alias extends AliasBase {
    /**
     * Import an existing KMS Alias defined outside the CDK app.
     *
     * @param scope The parent creating construct (usually `this`).
     * @param id The construct's name.
     * @param attrs the properties of the referenced KMS Alias
     */
    static fromAliasAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_kms_AliasAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromAliasAttributes);
            }
            throw error;
        }
        class _Alias extends AliasBase {
            get aliasName() { return attrs.aliasName; }
            get aliasTargetKey() { return attrs.aliasTargetKey; }
        }
        return new _Alias(scope, id);
    }
    /**
     * Import an existing KMS Alias defined outside the CDK app, by the alias name. This method should be used
     * instead of 'fromAliasAttributes' when the underlying KMS Key ARN is not available.
     * This Alias will not have a direct reference to the KMS Key, so addAlias and grant* methods are not supported.
     *
     * @param scope The parent creating construct (usually `this`).
     * @param id The construct's name.
     * @param aliasName The full name of the KMS Alias (e.g., 'alias/aws/s3', 'alias/myKeyAlias').
     */
    static fromAliasName(scope, id, aliasName) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.keyArn = core_1.Stack.of(this).formatArn({ service: 'kms', resource: aliasName });
                this.keyId = aliasName;
                this.aliasName = aliasName;
            }
            get aliasTargetKey() { throw new Error('Cannot access aliasTargetKey on an Alias imported by Alias.fromAliasName().'); }
            addAlias(_alias) { throw new Error('Cannot call addAlias on an Alias imported by Alias.fromAliasName().'); }
            addToResourcePolicy(_statement, _allowNoOp) {
                return { statementAdded: false };
            }
            grant(grantee, ..._actions) { return iam.Grant.drop(grantee, ''); }
            grantDecrypt(grantee) { return iam.Grant.drop(grantee, ''); }
            grantEncrypt(grantee) { return iam.Grant.drop(grantee, ''); }
            grantEncryptDecrypt(grantee) { return iam.Grant.drop(grantee, ''); }
            grantGenerateMac(grantee) { return iam.Grant.drop(grantee, ''); }
            grantVerifyMac(grantee) { return iam.Grant.drop(grantee, ''); }
        }
        return new Import(scope, id);
    }
    constructor(scope, id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_kms_AliasProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Alias);
            }
            throw error;
        }
        let aliasName = props.aliasName;
        if (!core_1.Token.isUnresolved(aliasName)) {
            if (!aliasName.startsWith(REQUIRED_ALIAS_PREFIX)) {
                aliasName = REQUIRED_ALIAS_PREFIX + aliasName;
            }
            if (aliasName === REQUIRED_ALIAS_PREFIX) {
                throw new Error(`Alias must include a value after "${REQUIRED_ALIAS_PREFIX}": ${aliasName}`);
            }
            if (aliasName.toLocaleLowerCase().startsWith(DISALLOWED_PREFIX)) {
                throw new Error(`Alias cannot start with ${DISALLOWED_PREFIX}: ${aliasName}`);
            }
            if (!aliasName.match(/^[a-zA-Z0-9:/_-]{1,256}$/)) {
                throw new Error('Alias name must be between 1 and 256 characters in a-zA-Z0-9:/_-');
            }
        }
        super(scope, id, {
            physicalName: aliasName,
        });
        this.aliasTargetKey = props.targetKey;
        const resource = new kms_generated_1.CfnAlias(this, 'Resource', {
            aliasName: this.physicalName,
            targetKeyId: this.aliasTargetKey.keyArn,
        });
        this.aliasName = this.getResourceNameAttribute(resource.aliasName);
        if (props.removalPolicy) {
            resource.applyRemovalPolicy(props.removalPolicy);
        }
    }
    generatePhysicalName() {
        return REQUIRED_ALIAS_PREFIX + super.generatePhysicalName();
    }
}
_a = JSII_RTTI_SYMBOL_1;
Alias[_a] = { fqn: "@aws-cdk/aws-kms.Alias", version: "0.0.0" };
exports.Alias = Alias;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxpYXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbGlhcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBd0M7QUFDeEMsd0NBQXNFO0FBR3RFLG1EQUEyQztBQUUzQyxNQUFNLHFCQUFxQixHQUFHLFFBQVEsQ0FBQztBQUN2QyxNQUFNLGlCQUFpQixHQUFHLHFCQUFxQixHQUFHLE1BQU0sQ0FBQztBQWdEekQsTUFBZSxTQUFVLFNBQVEsZUFBUTtJQUt2QyxJQUFXLE1BQU07UUFDZixPQUFPLFlBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQzlCLE9BQU8sRUFBRSxLQUFLO1lBQ2QscUNBQXFDO1lBQ3JDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUztTQUN6QixDQUFDLENBQUM7S0FDSjtJQUVELElBQVcsS0FBSztRQUNkLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztLQUN2QjtJQUVNLFFBQVEsQ0FBQyxLQUFhO1FBQzNCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDNUM7SUFFTSxtQkFBbUIsQ0FBQyxTQUE4QixFQUFFLFNBQW1CO1FBQzVFLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDdEU7SUFFTSxLQUFLLENBQUMsT0FBdUIsRUFBRSxHQUFHLE9BQWlCO1FBQ3hELE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUM7S0FDdkQ7SUFFTSxZQUFZLENBQUMsT0FBdUI7UUFDekMsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNsRDtJQUVNLFlBQVksQ0FBQyxPQUF1QjtRQUN6QyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLE9B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QUMsQ0FBQztRQUVuRSxJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQUU7WUFDdkIsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNsRDtLQUNGO0lBRVMsb0JBQW9CO1FBQzVCLE9BQU8scUJBQXFCLEdBQUcsS0FBSyxDQUFDLG9CQUFvQixFQUFFLENBQUM7S0FDN0Q7Ozs7QUExRlUsc0JBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBSZW1vdmFsUG9saWN5LCBSZXNvdXJjZSwgU3RhY2ssIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElLZXkgfSBmcm9tICcuL2tleSc7XG5pbXBvcnQgeyBDZm5BbGlhcyB9IGZyb20gJy4va21zLmdlbmVyYXRlZCc7XG5cbmNvbnN0IFJFUVVJUkVEX0FMSUFTX1BSRUZJWCA9ICdhbGlhcy8nO1xuY29uc3QgRElTQUxMT1dFRF9QUkVGSVggPSBSRVFVSVJFRF9BTElBU19QUkVGSVggKyAnYXdzLyc7XG5cbi8qKlxuICogQSBLTVMgS2V5IGFsaWFzLlxuICogQW4gYWxpYXMgY2FuIGJlIHVzZWQgaW4gYWxsIHBsYWNlcyB0aGF0IGV4cGVjdCBhIGtleS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJQWxpYXMgZXh0ZW5kcyBJS2V5IHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBhbGlhcy5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgYWxpYXNOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBLZXkgdG8gd2hpY2ggdGhlIEFsaWFzIHJlZmVycy5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgYWxpYXNUYXJnZXRLZXk6IElLZXk7XG59XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgZm9yIGEgS01TIEtleSBBbGlhcyBvYmplY3QuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWxpYXNQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgYWxpYXMuIFRoZSBuYW1lIG11c3Qgc3RhcnQgd2l0aCBhbGlhcyBmb2xsb3dlZCBieSBhXG4gICAqIGZvcndhcmQgc2xhc2gsIHN1Y2ggYXMgYWxpYXMvLiBZb3UgY2FuJ3Qgc3BlY2lmeSBhbGlhc2VzIHRoYXQgYmVnaW4gd2l0aFxuICAgKiBhbGlhcy9BV1MuIFRoZXNlIGFsaWFzZXMgYXJlIHJlc2VydmVkLlxuICAgKi9cbiAgcmVhZG9ubHkgYWxpYXNOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUga2V5IGZvciB3aGljaCB5b3UgYXJlIGNyZWF0aW5nIHRoZSBhbGlhcy4gU3BlY2lmeSB0aGUga2V5J3NcbiAgICogZ2xvYmFsbHkgdW5pcXVlIGlkZW50aWZpZXIgb3IgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikuIFlvdSBjYW4ndFxuICAgKiBzcGVjaWZ5IGFub3RoZXIgYWxpYXMuXG4gICAqL1xuICByZWFkb25seSB0YXJnZXRLZXk6IElLZXk7XG5cbiAgLyoqXG4gICAqIFBvbGljeSB0byBhcHBseSB3aGVuIHRoZSBhbGlhcyBpcyByZW1vdmVkIGZyb20gdGhpcyBzdGFjay5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBUaGUgYWxpYXMgd2lsbCBiZSBkZWxldGVkXG4gICAqL1xuICByZWFkb25seSByZW1vdmFsUG9saWN5PzogUmVtb3ZhbFBvbGljeTtcbn1cblxuYWJzdHJhY3QgY2xhc3MgQWxpYXNCYXNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJQWxpYXMge1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgYWxpYXNOYW1lOiBzdHJpbmc7XG5cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGFsaWFzVGFyZ2V0S2V5OiBJS2V5O1xuXG4gIHB1YmxpYyBnZXQga2V5QXJuKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7XG4gICAgICBzZXJ2aWNlOiAna21zJyxcbiAgICAgIC8vIGFsaWFzTmFtZSBhbHJlYWR5IGNvbnRhaW5zIHRoZSAnLydcbiAgICAgIHJlc291cmNlOiB0aGlzLmFsaWFzTmFtZSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQga2V5SWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5hbGlhc05hbWU7XG4gIH1cblxuICBwdWJsaWMgYWRkQWxpYXMoYWxpYXM6IHN0cmluZyk6IEFsaWFzIHtcbiAgICByZXR1cm4gdGhpcy5hbGlhc1RhcmdldEtleS5hZGRBbGlhcyhhbGlhcyk7XG4gIH1cblxuICBwdWJsaWMgYWRkVG9SZXNvdXJjZVBvbGljeShzdGF0ZW1lbnQ6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQsIGFsbG93Tm9PcD86IGJvb2xlYW4pOiBpYW0uQWRkVG9SZXNvdXJjZVBvbGljeVJlc3VsdCB7XG4gICAgcmV0dXJuIHRoaXMuYWxpYXNUYXJnZXRLZXkuYWRkVG9SZXNvdXJjZVBvbGljeShzdGF0ZW1lbnQsIGFsbG93Tm9PcCk7XG4gIH1cblxuICBwdWJsaWMgZ3JhbnQoZ3JhbnRlZTogaWFtLklHcmFudGFibGUsIC4uLmFjdGlvbnM6IHN0cmluZ1tdKTogaWFtLkdyYW50IHtcbiAgICByZXR1cm4gdGhpcy5hbGlhc1RhcmdldEtleS5ncmFudChncmFudGVlLCAuLi5hY3Rpb25zKTtcbiAgfVxuXG4gIHB1YmxpYyBncmFudERlY3J5cHQoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQge1xuICAgIHJldHVybiB0aGlzLmFsaWFzVGFyZ2V0S2V5LmdyYW50RGVjcnlwdChncmFudGVlKTtcbiAgfVxuXG4gIHB1YmxpYyBncmFudEVuY3J5cHQoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQge1xuICAgIHJldHVybiB0aGlzLmFsaWFzVGFyZ2V0S2V5LmdyYW50RW5jcnlwdChncmFudGVlKTtcbiAgfVxuXG4gIHB1YmxpYyBncmFudEVuY3J5cHREZWNyeXB0KGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50IHtcbiAgICByZXR1cm4gdGhpcy5hbGlhc1RhcmdldEtleS5ncmFudEVuY3J5cHREZWNyeXB0KGdyYW50ZWUpO1xuICB9XG5cbiAgZ3JhbnRHZW5lcmF0ZU1hYyhncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgcmV0dXJuIHRoaXMuYWxpYXNUYXJnZXRLZXkuZ3JhbnRHZW5lcmF0ZU1hYyhncmFudGVlKTtcbiAgfVxuXG4gIGdyYW50VmVyaWZ5TWFjKGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50IHtcbiAgICByZXR1cm4gdGhpcy5hbGlhc1RhcmdldEtleS5ncmFudFZlcmlmeU1hYyhncmFudGVlKTtcbiAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgb2YgYSByZWZlcmVuY2UgdG8gYW4gZXhpc3RpbmcgS01TIEFsaWFzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWxpYXNBdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGUgYWxpYXMgbmFtZS4gVGhpcyB2YWx1ZSBtdXN0IGJlZ2luIHdpdGggYWxpYXMvIGZvbGxvd2VkIGJ5IGEgbmFtZSAoaS5lLiBhbGlhcy9FeGFtcGxlQWxpYXMpXG4gICAqL1xuICByZWFkb25seSBhbGlhc05hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGN1c3RvbWVyIG1hc3RlciBrZXkgKENNSykgdG8gd2hpY2ggdGhlIEFsaWFzIHJlZmVycy5cbiAgICovXG4gIHJlYWRvbmx5IGFsaWFzVGFyZ2V0S2V5OiBJS2V5O1xufVxuXG4vKipcbiAqIERlZmluZXMgYSBkaXNwbGF5IG5hbWUgZm9yIGEgY3VzdG9tZXIgbWFzdGVyIGtleSAoQ01LKSBpbiBBV1MgS2V5IE1hbmFnZW1lbnRcbiAqIFNlcnZpY2UgKEFXUyBLTVMpLiBVc2luZyBhbiBhbGlhcyB0byByZWZlciB0byBhIGtleSBjYW4gaGVscCB5b3Ugc2ltcGxpZnkga2V5XG4gKiBtYW5hZ2VtZW50LiBGb3IgZXhhbXBsZSwgd2hlbiByb3RhdGluZyBrZXlzLCB5b3UgY2FuIGp1c3QgdXBkYXRlIHRoZSBhbGlhc1xuICogbWFwcGluZyBpbnN0ZWFkIG9mIHRyYWNraW5nIGFuZCBjaGFuZ2luZyBrZXkgSURzLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlXG4gKiBXb3JraW5nIHdpdGggQWxpYXNlcyBpbiB0aGUgQVdTIEtleSBNYW5hZ2VtZW50IFNlcnZpY2UgRGV2ZWxvcGVyIEd1aWRlLlxuICpcbiAqIFlvdSBjYW4gYWxzbyBhZGQgYW4gYWxpYXMgZm9yIGEga2V5IGJ5IGNhbGxpbmcgYGtleS5hZGRBbGlhcyhhbGlhcylgLlxuICpcbiAqIEByZXNvdXJjZSBBV1M6OktNUzo6QWxpYXNcbiAqL1xuZXhwb3J0IGNsYXNzIEFsaWFzIGV4dGVuZHMgQWxpYXNCYXNlIHtcbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyBLTVMgQWxpYXMgZGVmaW5lZCBvdXRzaWRlIHRoZSBDREsgYXBwLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIHBhcmVudCBjcmVhdGluZyBjb25zdHJ1Y3QgKHVzdWFsbHkgYHRoaXNgKS5cbiAgICogQHBhcmFtIGlkIFRoZSBjb25zdHJ1Y3QncyBuYW1lLlxuICAgKiBAcGFyYW0gYXR0cnMgdGhlIHByb3BlcnRpZXMgb2YgdGhlIHJlZmVyZW5jZWQgS01TIEFsaWFzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21BbGlhc0F0dHJpYnV0ZXMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IEFsaWFzQXR0cmlidXRlcyk6IElBbGlhcyB7XG4gICAgY2xhc3MgX0FsaWFzIGV4dGVuZHMgQWxpYXNCYXNlIHtcbiAgICAgIHB1YmxpYyBnZXQgYWxpYXNOYW1lKCkgeyByZXR1cm4gYXR0cnMuYWxpYXNOYW1lOyB9XG4gICAgICBwdWJsaWMgZ2V0IGFsaWFzVGFyZ2V0S2V5KCkgeyByZXR1cm4gYXR0cnMuYWxpYXNUYXJnZXRLZXk7IH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBfQWxpYXMoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgS01TIEFsaWFzIGRlZmluZWQgb3V0c2lkZSB0aGUgQ0RLIGFwcCwgYnkgdGhlIGFsaWFzIG5hbWUuIFRoaXMgbWV0aG9kIHNob3VsZCBiZSB1c2VkXG4gICAqIGluc3RlYWQgb2YgJ2Zyb21BbGlhc0F0dHJpYnV0ZXMnIHdoZW4gdGhlIHVuZGVybHlpbmcgS01TIEtleSBBUk4gaXMgbm90IGF2YWlsYWJsZS5cbiAgICogVGhpcyBBbGlhcyB3aWxsIG5vdCBoYXZlIGEgZGlyZWN0IHJlZmVyZW5jZSB0byB0aGUgS01TIEtleSwgc28gYWRkQWxpYXMgYW5kIGdyYW50KiBtZXRob2RzIGFyZSBub3Qgc3VwcG9ydGVkLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIHBhcmVudCBjcmVhdGluZyBjb25zdHJ1Y3QgKHVzdWFsbHkgYHRoaXNgKS5cbiAgICogQHBhcmFtIGlkIFRoZSBjb25zdHJ1Y3QncyBuYW1lLlxuICAgKiBAcGFyYW0gYWxpYXNOYW1lIFRoZSBmdWxsIG5hbWUgb2YgdGhlIEtNUyBBbGlhcyAoZS5nLiwgJ2FsaWFzL2F3cy9zMycsICdhbGlhcy9teUtleUFsaWFzJykuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21BbGlhc05hbWUoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYWxpYXNOYW1lOiBzdHJpbmcpOiBJQWxpYXMge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUFsaWFzIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBrZXlBcm4gPSBTdGFjay5vZih0aGlzKS5mb3JtYXRBcm4oeyBzZXJ2aWNlOiAna21zJywgcmVzb3VyY2U6IGFsaWFzTmFtZSB9KTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBrZXlJZCA9IGFsaWFzTmFtZTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBhbGlhc05hbWUgPSBhbGlhc05hbWU7XG4gICAgICBwdWJsaWMgZ2V0IGFsaWFzVGFyZ2V0S2V5KCk6IElLZXkgeyB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBhY2Nlc3MgYWxpYXNUYXJnZXRLZXkgb24gYW4gQWxpYXMgaW1wb3J0ZWQgYnkgQWxpYXMuZnJvbUFsaWFzTmFtZSgpLicpOyB9XG4gICAgICBwdWJsaWMgYWRkQWxpYXMoX2FsaWFzOiBzdHJpbmcpOiBBbGlhcyB7IHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNhbGwgYWRkQWxpYXMgb24gYW4gQWxpYXMgaW1wb3J0ZWQgYnkgQWxpYXMuZnJvbUFsaWFzTmFtZSgpLicpOyB9XG4gICAgICBwdWJsaWMgYWRkVG9SZXNvdXJjZVBvbGljeShfc3RhdGVtZW50OiBpYW0uUG9saWN5U3RhdGVtZW50LCBfYWxsb3dOb09wPzogYm9vbGVhbik6IGlhbS5BZGRUb1Jlc291cmNlUG9saWN5UmVzdWx0IHtcbiAgICAgICAgcmV0dXJuIHsgc3RhdGVtZW50QWRkZWQ6IGZhbHNlIH07XG4gICAgICB9XG4gICAgICBwdWJsaWMgZ3JhbnQoZ3JhbnRlZTogaWFtLklHcmFudGFibGUsIC4uLl9hY3Rpb25zOiBzdHJpbmdbXSk6IGlhbS5HcmFudCB7IHJldHVybiBpYW0uR3JhbnQuZHJvcChncmFudGVlLCAnJyk7IH1cbiAgICAgIHB1YmxpYyBncmFudERlY3J5cHQoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQgeyByZXR1cm4gaWFtLkdyYW50LmRyb3AoZ3JhbnRlZSwgJycpOyB9XG4gICAgICBwdWJsaWMgZ3JhbnRFbmNyeXB0KGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50IHsgcmV0dXJuIGlhbS5HcmFudC5kcm9wKGdyYW50ZWUsICcnKTsgfVxuICAgICAgcHVibGljIGdyYW50RW5jcnlwdERlY3J5cHQoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQgeyByZXR1cm4gaWFtLkdyYW50LmRyb3AoZ3JhbnRlZSwgJycpOyB9XG4gICAgICBwdWJsaWMgZ3JhbnRHZW5lcmF0ZU1hYyhncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7IHJldHVybiBpYW0uR3JhbnQuZHJvcChncmFudGVlLCAnJyk7IH1cbiAgICAgIHB1YmxpYyBncmFudFZlcmlmeU1hYyhncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7IHJldHVybiBpYW0uR3JhbnQuZHJvcChncmFudGVlLCAnJyk7IH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGFsaWFzTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgYWxpYXNUYXJnZXRLZXk6IElLZXk7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEFsaWFzUHJvcHMpIHtcbiAgICBsZXQgYWxpYXNOYW1lID0gcHJvcHMuYWxpYXNOYW1lO1xuXG4gICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQoYWxpYXNOYW1lKSkge1xuICAgICAgaWYgKCFhbGlhc05hbWUuc3RhcnRzV2l0aChSRVFVSVJFRF9BTElBU19QUkVGSVgpKSB7XG4gICAgICAgIGFsaWFzTmFtZSA9IFJFUVVJUkVEX0FMSUFTX1BSRUZJWCArIGFsaWFzTmFtZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGFsaWFzTmFtZSA9PT0gUkVRVUlSRURfQUxJQVNfUFJFRklYKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxpYXMgbXVzdCBpbmNsdWRlIGEgdmFsdWUgYWZ0ZXIgXCIke1JFUVVJUkVEX0FMSUFTX1BSRUZJWH1cIjogJHthbGlhc05hbWV9YCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChhbGlhc05hbWUudG9Mb2NhbGVMb3dlckNhc2UoKS5zdGFydHNXaXRoKERJU0FMTE9XRURfUFJFRklYKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFsaWFzIGNhbm5vdCBzdGFydCB3aXRoICR7RElTQUxMT1dFRF9QUkVGSVh9OiAke2FsaWFzTmFtZX1gKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFhbGlhc05hbWUubWF0Y2goL15bYS16QS1aMC05Oi9fLV17MSwyNTZ9JC8pKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQWxpYXMgbmFtZSBtdXN0IGJlIGJldHdlZW4gMSBhbmQgMjU2IGNoYXJhY3RlcnMgaW4gYS16QS1aMC05Oi9fLScpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBhbGlhc05hbWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLmFsaWFzVGFyZ2V0S2V5ID0gcHJvcHMudGFyZ2V0S2V5O1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuQWxpYXModGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgYWxpYXNOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIHRhcmdldEtleUlkOiB0aGlzLmFsaWFzVGFyZ2V0S2V5LmtleUFybixcbiAgICB9KTtcblxuICAgIHRoaXMuYWxpYXNOYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUocmVzb3VyY2UuYWxpYXNOYW1lKTtcblxuICAgIGlmIChwcm9wcy5yZW1vdmFsUG9saWN5KSB7XG4gICAgICByZXNvdXJjZS5hcHBseVJlbW92YWxQb2xpY3kocHJvcHMucmVtb3ZhbFBvbGljeSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIGdlbmVyYXRlUGh5c2ljYWxOYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFJFUVVJUkVEX0FMSUFTX1BSRUZJWCArIHN1cGVyLmdlbmVyYXRlUGh5c2ljYWxOYW1lKCk7XG4gIH1cbn1cbiJdfQ==