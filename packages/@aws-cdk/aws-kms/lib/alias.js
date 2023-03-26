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
        }
        return new Import(scope, id);
    }
    generatePhysicalName() {
        return REQUIRED_ALIAS_PREFIX + super.generatePhysicalName();
    }
}
exports.Alias = Alias;
_a = JSII_RTTI_SYMBOL_1;
Alias[_a] = { fqn: "@aws-cdk/aws-kms.Alias", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxpYXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbGlhcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBd0M7QUFDeEMsd0NBQXNFO0FBR3RFLG1EQUEyQztBQUUzQyxNQUFNLHFCQUFxQixHQUFHLFFBQVEsQ0FBQztBQUN2QyxNQUFNLGlCQUFpQixHQUFHLHFCQUFxQixHQUFHLE1BQU0sQ0FBQztBQWdEekQsTUFBZSxTQUFVLFNBQVEsZUFBUTtJQUt2QyxJQUFXLE1BQU07UUFDZixPQUFPLFlBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQzlCLE9BQU8sRUFBRSxLQUFLO1lBQ2QscUNBQXFDO1lBQ3JDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUztTQUN6QixDQUFDLENBQUM7S0FDSjtJQUVELElBQVcsS0FBSztRQUNkLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztLQUN2QjtJQUVNLFFBQVEsQ0FBQyxLQUFhO1FBQzNCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDNUM7SUFFTSxtQkFBbUIsQ0FBQyxTQUE4QixFQUFFLFNBQW1CO1FBQzVFLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDdEU7SUFFTSxLQUFLLENBQUMsT0FBdUIsRUFBRSxHQUFHLE9BQWlCO1FBQ3hELE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsT0FBTyxDQUFDLENBQUM7S0FDdkQ7SUFFTSxZQUFZLENBQUMsT0FBdUI7UUFDekMsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNsRDtJQUVNLFlBQVksQ0FBQyxPQUF1QjtRQUN6QyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLE9B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LENBQUMsQ0FBQztZQUM5SCxRQUFRLENBQUMsTUFBYyxJQUFXLE1BQU0sSUFBSSxLQUFLLENBQUMscUVBQXFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0gsbUJBQW1CLENBQUMsVUFBK0IsRUFBRSxVQUFvQjtnQkFDOUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsQ0FBQztZQUNuQyxDQUFDO1lBQ00sS0FBSyxDQUFDLE9BQXVCLEVBQUUsR0FBRyxRQUFrQixJQUFlLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4RyxZQUFZLENBQUMsT0FBdUIsSUFBZSxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEYsWUFBWSxDQUFDLE9BQXVCLElBQWUsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hGLG1CQUFtQixDQUFDLE9BQXVCLElBQWUsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZHO1FBRUQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDOUI7SUE0Q1Msb0JBQW9CO1FBQzVCLE9BQU8scUJBQXFCLEdBQUcsS0FBSyxDQUFDLG9CQUFvQixFQUFFLENBQUM7S0FDN0Q7O0FBeEZILHNCQXlGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IFJlbW92YWxQb2xpY3ksIFJlc291cmNlLCBTdGFjaywgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgSUtleSB9IGZyb20gJy4va2V5JztcbmltcG9ydCB7IENmbkFsaWFzIH0gZnJvbSAnLi9rbXMuZ2VuZXJhdGVkJztcblxuY29uc3QgUkVRVUlSRURfQUxJQVNfUFJFRklYID0gJ2FsaWFzLyc7XG5jb25zdCBESVNBTExPV0VEX1BSRUZJWCA9IFJFUVVJUkVEX0FMSUFTX1BSRUZJWCArICdhd3MvJztcblxuLyoqXG4gKiBBIEtNUyBLZXkgYWxpYXMuXG4gKiBBbiBhbGlhcyBjYW4gYmUgdXNlZCBpbiBhbGwgcGxhY2VzIHRoYXQgZXhwZWN0IGEga2V5LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElBbGlhcyBleHRlbmRzIElLZXkge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGFsaWFzLlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBhbGlhc05hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEtleSB0byB3aGljaCB0aGUgQWxpYXMgcmVmZXJzLlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBhbGlhc1RhcmdldEtleTogSUtleTtcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBmb3IgYSBLTVMgS2V5IEFsaWFzIG9iamVjdC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBbGlhc1Byb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBhbGlhcy4gVGhlIG5hbWUgbXVzdCBzdGFydCB3aXRoIGFsaWFzIGZvbGxvd2VkIGJ5IGFcbiAgICogZm9yd2FyZCBzbGFzaCwgc3VjaCBhcyBhbGlhcy8uIFlvdSBjYW4ndCBzcGVjaWZ5IGFsaWFzZXMgdGhhdCBiZWdpbiB3aXRoXG4gICAqIGFsaWFzL0FXUy4gVGhlc2UgYWxpYXNlcyBhcmUgcmVzZXJ2ZWQuXG4gICAqL1xuICByZWFkb25seSBhbGlhc05hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSBrZXkgZm9yIHdoaWNoIHlvdSBhcmUgY3JlYXRpbmcgdGhlIGFsaWFzLiBTcGVjaWZ5IHRoZSBrZXknc1xuICAgKiBnbG9iYWxseSB1bmlxdWUgaWRlbnRpZmllciBvciBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKS4gWW91IGNhbid0XG4gICAqIHNwZWNpZnkgYW5vdGhlciBhbGlhcy5cbiAgICovXG4gIHJlYWRvbmx5IHRhcmdldEtleTogSUtleTtcblxuICAvKipcbiAgICogUG9saWN5IHRvIGFwcGx5IHdoZW4gdGhlIGFsaWFzIGlzIHJlbW92ZWQgZnJvbSB0aGlzIHN0YWNrLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBhbGlhcyB3aWxsIGJlIGRlbGV0ZWRcbiAgICovXG4gIHJlYWRvbmx5IHJlbW92YWxQb2xpY3k/OiBSZW1vdmFsUG9saWN5O1xufVxuXG5hYnN0cmFjdCBjbGFzcyBBbGlhc0Jhc2UgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElBbGlhcyB7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBhbGlhc05hbWU6IHN0cmluZztcblxuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgYWxpYXNUYXJnZXRLZXk6IElLZXk7XG5cbiAgcHVibGljIGdldCBrZXlBcm4oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gU3RhY2sub2YodGhpcykuZm9ybWF0QXJuKHtcbiAgICAgIHNlcnZpY2U6ICdrbXMnLFxuICAgICAgLy8gYWxpYXNOYW1lIGFscmVhZHkgY29udGFpbnMgdGhlICcvJ1xuICAgICAgcmVzb3VyY2U6IHRoaXMuYWxpYXNOYW1lLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdldCBrZXlJZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmFsaWFzTmFtZTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRBbGlhcyhhbGlhczogc3RyaW5nKTogQWxpYXMge1xuICAgIHJldHVybiB0aGlzLmFsaWFzVGFyZ2V0S2V5LmFkZEFsaWFzKGFsaWFzKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRUb1Jlc291cmNlUG9saWN5KHN0YXRlbWVudDogaWFtLlBvbGljeVN0YXRlbWVudCwgYWxsb3dOb09wPzogYm9vbGVhbik6IGlhbS5BZGRUb1Jlc291cmNlUG9saWN5UmVzdWx0IHtcbiAgICByZXR1cm4gdGhpcy5hbGlhc1RhcmdldEtleS5hZGRUb1Jlc291cmNlUG9saWN5KHN0YXRlbWVudCwgYWxsb3dOb09wKTtcbiAgfVxuXG4gIHB1YmxpYyBncmFudChncmFudGVlOiBpYW0uSUdyYW50YWJsZSwgLi4uYWN0aW9uczogc3RyaW5nW10pOiBpYW0uR3JhbnQge1xuICAgIHJldHVybiB0aGlzLmFsaWFzVGFyZ2V0S2V5LmdyYW50KGdyYW50ZWUsIC4uLmFjdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIGdyYW50RGVjcnlwdChncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgcmV0dXJuIHRoaXMuYWxpYXNUYXJnZXRLZXkuZ3JhbnREZWNyeXB0KGdyYW50ZWUpO1xuICB9XG5cbiAgcHVibGljIGdyYW50RW5jcnlwdChncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgcmV0dXJuIHRoaXMuYWxpYXNUYXJnZXRLZXkuZ3JhbnRFbmNyeXB0KGdyYW50ZWUpO1xuICB9XG5cbiAgcHVibGljIGdyYW50RW5jcnlwdERlY3J5cHQoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQge1xuICAgIHJldHVybiB0aGlzLmFsaWFzVGFyZ2V0S2V5LmdyYW50RW5jcnlwdERlY3J5cHQoZ3JhbnRlZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIG9mIGEgcmVmZXJlbmNlIHRvIGFuIGV4aXN0aW5nIEtNUyBBbGlhc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEFsaWFzQXR0cmlidXRlcyB7XG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgdGhlIGFsaWFzIG5hbWUuIFRoaXMgdmFsdWUgbXVzdCBiZWdpbiB3aXRoIGFsaWFzLyBmb2xsb3dlZCBieSBhIG5hbWUgKGkuZS4gYWxpYXMvRXhhbXBsZUFsaWFzKVxuICAgKi9cbiAgcmVhZG9ubHkgYWxpYXNOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBjdXN0b21lciBtYXN0ZXIga2V5IChDTUspIHRvIHdoaWNoIHRoZSBBbGlhcyByZWZlcnMuXG4gICAqL1xuICByZWFkb25seSBhbGlhc1RhcmdldEtleTogSUtleTtcbn1cblxuLyoqXG4gKiBEZWZpbmVzIGEgZGlzcGxheSBuYW1lIGZvciBhIGN1c3RvbWVyIG1hc3RlciBrZXkgKENNSykgaW4gQVdTIEtleSBNYW5hZ2VtZW50XG4gKiBTZXJ2aWNlIChBV1MgS01TKS4gVXNpbmcgYW4gYWxpYXMgdG8gcmVmZXIgdG8gYSBrZXkgY2FuIGhlbHAgeW91IHNpbXBsaWZ5IGtleVxuICogbWFuYWdlbWVudC4gRm9yIGV4YW1wbGUsIHdoZW4gcm90YXRpbmcga2V5cywgeW91IGNhbiBqdXN0IHVwZGF0ZSB0aGUgYWxpYXNcbiAqIG1hcHBpbmcgaW5zdGVhZCBvZiB0cmFja2luZyBhbmQgY2hhbmdpbmcga2V5IElEcy4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZVxuICogV29ya2luZyB3aXRoIEFsaWFzZXMgaW4gdGhlIEFXUyBLZXkgTWFuYWdlbWVudCBTZXJ2aWNlIERldmVsb3BlciBHdWlkZS5cbiAqXG4gKiBZb3UgY2FuIGFsc28gYWRkIGFuIGFsaWFzIGZvciBhIGtleSBieSBjYWxsaW5nIGBrZXkuYWRkQWxpYXMoYWxpYXMpYC5cbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpLTVM6OkFsaWFzXG4gKi9cbmV4cG9ydCBjbGFzcyBBbGlhcyBleHRlbmRzIEFsaWFzQmFzZSB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgS01TIEFsaWFzIGRlZmluZWQgb3V0c2lkZSB0aGUgQ0RLIGFwcC5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIFRoZSBwYXJlbnQgY3JlYXRpbmcgY29uc3RydWN0ICh1c3VhbGx5IGB0aGlzYCkuXG4gICAqIEBwYXJhbSBpZCBUaGUgY29uc3RydWN0J3MgbmFtZS5cbiAgICogQHBhcmFtIGF0dHJzIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSByZWZlcmVuY2VkIEtNUyBBbGlhc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQWxpYXNBdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBBbGlhc0F0dHJpYnV0ZXMpOiBJQWxpYXMge1xuICAgIGNsYXNzIF9BbGlhcyBleHRlbmRzIEFsaWFzQmFzZSB7XG4gICAgICBwdWJsaWMgZ2V0IGFsaWFzTmFtZSgpIHsgcmV0dXJuIGF0dHJzLmFsaWFzTmFtZTsgfVxuICAgICAgcHVibGljIGdldCBhbGlhc1RhcmdldEtleSgpIHsgcmV0dXJuIGF0dHJzLmFsaWFzVGFyZ2V0S2V5OyB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgX0FsaWFzKHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIEtNUyBBbGlhcyBkZWZpbmVkIG91dHNpZGUgdGhlIENESyBhcHAsIGJ5IHRoZSBhbGlhcyBuYW1lLiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgdXNlZFxuICAgKiBpbnN0ZWFkIG9mICdmcm9tQWxpYXNBdHRyaWJ1dGVzJyB3aGVuIHRoZSB1bmRlcmx5aW5nIEtNUyBLZXkgQVJOIGlzIG5vdCBhdmFpbGFibGUuXG4gICAqIFRoaXMgQWxpYXMgd2lsbCBub3QgaGF2ZSBhIGRpcmVjdCByZWZlcmVuY2UgdG8gdGhlIEtNUyBLZXksIHNvIGFkZEFsaWFzIGFuZCBncmFudCogbWV0aG9kcyBhcmUgbm90IHN1cHBvcnRlZC5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIFRoZSBwYXJlbnQgY3JlYXRpbmcgY29uc3RydWN0ICh1c3VhbGx5IGB0aGlzYCkuXG4gICAqIEBwYXJhbSBpZCBUaGUgY29uc3RydWN0J3MgbmFtZS5cbiAgICogQHBhcmFtIGFsaWFzTmFtZSBUaGUgZnVsbCBuYW1lIG9mIHRoZSBLTVMgQWxpYXMgKGUuZy4sICdhbGlhcy9hd3MvczMnLCAnYWxpYXMvbXlLZXlBbGlhcycpLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQWxpYXNOYW1lKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGFsaWFzTmFtZTogc3RyaW5nKTogSUFsaWFzIHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElBbGlhcyB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkga2V5QXJuID0gU3RhY2sub2YodGhpcykuZm9ybWF0QXJuKHsgc2VydmljZTogJ2ttcycsIHJlc291cmNlOiBhbGlhc05hbWUgfSk7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkga2V5SWQgPSBhbGlhc05hbWU7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYWxpYXNOYW1lID0gYWxpYXNOYW1lO1xuICAgICAgcHVibGljIGdldCBhbGlhc1RhcmdldEtleSgpOiBJS2V5IHsgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYWNjZXNzIGFsaWFzVGFyZ2V0S2V5IG9uIGFuIEFsaWFzIGltcG9ydGVkIGJ5IEFsaWFzLmZyb21BbGlhc05hbWUoKS4nKTsgfVxuICAgICAgcHVibGljIGFkZEFsaWFzKF9hbGlhczogc3RyaW5nKTogQWxpYXMgeyB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjYWxsIGFkZEFsaWFzIG9uIGFuIEFsaWFzIGltcG9ydGVkIGJ5IEFsaWFzLmZyb21BbGlhc05hbWUoKS4nKTsgfVxuICAgICAgcHVibGljIGFkZFRvUmVzb3VyY2VQb2xpY3koX3N0YXRlbWVudDogaWFtLlBvbGljeVN0YXRlbWVudCwgX2FsbG93Tm9PcD86IGJvb2xlYW4pOiBpYW0uQWRkVG9SZXNvdXJjZVBvbGljeVJlc3VsdCB7XG4gICAgICAgIHJldHVybiB7IHN0YXRlbWVudEFkZGVkOiBmYWxzZSB9O1xuICAgICAgfVxuICAgICAgcHVibGljIGdyYW50KGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlLCAuLi5fYWN0aW9uczogc3RyaW5nW10pOiBpYW0uR3JhbnQgeyByZXR1cm4gaWFtLkdyYW50LmRyb3AoZ3JhbnRlZSwgJycpOyB9XG4gICAgICBwdWJsaWMgZ3JhbnREZWNyeXB0KGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50IHsgcmV0dXJuIGlhbS5HcmFudC5kcm9wKGdyYW50ZWUsICcnKTsgfVxuICAgICAgcHVibGljIGdyYW50RW5jcnlwdChncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7IHJldHVybiBpYW0uR3JhbnQuZHJvcChncmFudGVlLCAnJyk7IH1cbiAgICAgIHB1YmxpYyBncmFudEVuY3J5cHREZWNyeXB0KGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50IHsgcmV0dXJuIGlhbS5HcmFudC5kcm9wKGdyYW50ZWUsICcnKTsgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICBwdWJsaWMgcmVhZG9ubHkgYWxpYXNOYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBhbGlhc1RhcmdldEtleTogSUtleTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQWxpYXNQcm9wcykge1xuICAgIGxldCBhbGlhc05hbWUgPSBwcm9wcy5hbGlhc05hbWU7XG5cbiAgICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChhbGlhc05hbWUpKSB7XG4gICAgICBpZiAoIWFsaWFzTmFtZS5zdGFydHNXaXRoKFJFUVVJUkVEX0FMSUFTX1BSRUZJWCkpIHtcbiAgICAgICAgYWxpYXNOYW1lID0gUkVRVUlSRURfQUxJQVNfUFJFRklYICsgYWxpYXNOYW1lO1xuICAgICAgfVxuXG4gICAgICBpZiAoYWxpYXNOYW1lID09PSBSRVFVSVJFRF9BTElBU19QUkVGSVgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbGlhcyBtdXN0IGluY2x1ZGUgYSB2YWx1ZSBhZnRlciBcIiR7UkVRVUlSRURfQUxJQVNfUFJFRklYfVwiOiAke2FsaWFzTmFtZX1gKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGFsaWFzTmFtZS50b0xvY2FsZUxvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoRElTQUxMT1dFRF9QUkVGSVgpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWxpYXMgY2Fubm90IHN0YXJ0IHdpdGggJHtESVNBTExPV0VEX1BSRUZJWH06ICR7YWxpYXNOYW1lfWApO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWFsaWFzTmFtZS5tYXRjaCgvXlthLXpBLVowLTk6L18tXXsxLDI1Nn0kLykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbGlhcyBuYW1lIG11c3QgYmUgYmV0d2VlbiAxIGFuZCAyNTYgY2hhcmFjdGVycyBpbiBhLXpBLVowLTk6L18tJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IGFsaWFzTmFtZSxcbiAgICB9KTtcblxuICAgIHRoaXMuYWxpYXNUYXJnZXRLZXkgPSBwcm9wcy50YXJnZXRLZXk7XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5BbGlhcyh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBhbGlhc05hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgdGFyZ2V0S2V5SWQ6IHRoaXMuYWxpYXNUYXJnZXRLZXkua2V5QXJuLFxuICAgIH0pO1xuXG4gICAgdGhpcy5hbGlhc05hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZShyZXNvdXJjZS5hbGlhc05hbWUpO1xuXG4gICAgaWYgKHByb3BzLnJlbW92YWxQb2xpY3kpIHtcbiAgICAgIHJlc291cmNlLmFwcGx5UmVtb3ZhbFBvbGljeShwcm9wcy5yZW1vdmFsUG9saWN5KTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2VuZXJhdGVQaHlzaWNhbE5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gUkVRVUlSRURfQUxJQVNfUFJFRklYICsgc3VwZXIuZ2VuZXJhdGVQaHlzaWNhbE5hbWUoKTtcbiAgfVxufVxuIl19