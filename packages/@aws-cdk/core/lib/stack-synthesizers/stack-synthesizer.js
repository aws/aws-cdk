"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackSynthesizer = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const path = require("path");
const cxapi = require("@aws-cdk/cx-api");
const _shared_1 = require("./_shared");
const assets_1 = require("../assets");
const cfn_fn_1 = require("../cfn-fn");
const cfn_parameter_1 = require("../cfn-parameter");
const cfn_rule_1 = require("../cfn-rule");
/**
 * Base class for implementing an IStackSynthesizer
 *
 * This class needs to exist to provide public surface area for external
 * implementations of stack synthesizers. The protected methods give
 * access to functions that are otherwise @_internal to the framework
 * and could not be accessed by external implementors.
 */
class StackSynthesizer {
    /**
     * The qualifier used to bootstrap this stack
     */
    get bootstrapQualifier() {
        return undefined;
    }
    /**
     * Bind to the stack this environment is going to be used on
     *
     * Must be called before any of the other methods are called.
     */
    bind(stack) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_Stack(stack);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        if (this._boundStack !== undefined) {
            throw new Error('A StackSynthesizer can only be used for one Stack: create a new instance to use with a different Stack');
        }
        this._boundStack = stack;
    }
    /**
     * Have the stack write out its template
     *
     * @deprecated Use `synthesizeTemplate` instead
     */
    synthesizeStackTemplate(stack, session) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.StackSynthesizer#synthesizeStackTemplate", "Use `synthesizeTemplate` instead");
            jsiiDeprecationWarnings._aws_cdk_core_Stack(stack);
            jsiiDeprecationWarnings._aws_cdk_core_ISynthesisSession(session);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.synthesizeStackTemplate);
            }
            throw error;
        }
        stack._synthesizeTemplate(session);
    }
    /**
     * Write the stack template to the given session
     *
     * Return a descriptor that represents the stack template as a file asset
     * source, for adding to an asset manifest (if desired). This can be used to
     * have the asset manifest system (`cdk-assets`) upload the template to S3
     * using the appropriate role, so that afterwards only a CloudFormation
     * deployment is necessary.
     *
     * If the template is uploaded as an asset, the `stackTemplateAssetObjectUrl`
     * property should be set when calling `emitArtifact.`
     *
     * If the template is *NOT* uploaded as an asset first and the template turns
     * out to be >50KB, it will need to be uploaded to S3 anyway. At that point
     * the credentials will be the same identity that is doing the `UpdateStack`
     * call, which may not have the right permissions to write to S3.
     */
    synthesizeTemplate(session, lookupRoleArn) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ISynthesisSession(session);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.synthesizeTemplate);
            }
            throw error;
        }
        this.boundStack._synthesizeTemplate(session, lookupRoleArn);
        return stackTemplateFileAsset(this.boundStack, session);
    }
    /**
     * Write the stack artifact to the session
     *
     * Use default settings to add a CloudFormationStackArtifact artifact to
     * the given synthesis session.
     *
     * @deprecated Use `emitArtifact` instead
     */
    emitStackArtifact(stack, session, options = {}) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/core.StackSynthesizer#emitStackArtifact", "Use `emitArtifact` instead");
            jsiiDeprecationWarnings._aws_cdk_core_Stack(stack);
            jsiiDeprecationWarnings._aws_cdk_core_ISynthesisSession(session);
            jsiiDeprecationWarnings._aws_cdk_core_SynthesizeStackArtifactOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.emitStackArtifact);
            }
            throw error;
        }
        (0, _shared_1.addStackArtifactToAssembly)(session, stack, options ?? {}, options.additionalDependencies ?? []);
    }
    /**
     * Write the CloudFormation stack artifact to the session
     *
     * Use default settings to add a CloudFormationStackArtifact artifact to
     * the given synthesis session. The Stack artifact will control the settings for the
     * CloudFormation deployment.
     */
    emitArtifact(session, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ISynthesisSession(session);
            jsiiDeprecationWarnings._aws_cdk_core_SynthesizeStackArtifactOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.emitArtifact);
            }
            throw error;
        }
        (0, _shared_1.addStackArtifactToAssembly)(session, this.boundStack, options ?? {}, options.additionalDependencies ?? []);
    }
    /**
     * Add a CfnRule to the bound stack that checks whether an SSM parameter exceeds a given version
     *
     * This will modify the template, so must be called before the stack is synthesized.
     */
    addBootstrapVersionRule(requiredVersion, bootstrapStackVersionSsmParameter) {
        addBootstrapVersionRule(this.boundStack, requiredVersion, bootstrapStackVersionSsmParameter);
    }
    /**
     * Retrieve the bound stack
     *
     * Fails if the stack hasn't been bound yet.
     */
    get boundStack() {
        if (!this._boundStack) {
            throw new Error('The StackSynthesizer must be bound to a Stack first before boundStack() can be called');
        }
        return this._boundStack;
    }
    /**
     * Turn a file asset location into a CloudFormation representation of that location
     *
     * If any of the fields contain placeholders, the result will be wrapped in a `Fn.sub`.
     */
    cloudFormationLocationFromFileAsset(location) {
        const { region, urlSuffix } = stackLocationOrInstrinsics(this.boundStack);
        const httpUrl = cfnify(`https://s3.${region}.${urlSuffix}/${location.bucketName}/${location.objectKey}`);
        const s3ObjectUrlWithPlaceholders = `s3://${location.bucketName}/${location.objectKey}`;
        // Return CFN expression
        //
        // 's3ObjectUrlWithPlaceholders' is intended for the CLI. The CLI ultimately needs a
        // 'https://s3.REGION.amazonaws.com[.cn]/name/hash' URL to give to CloudFormation.
        // However, there's no way for us to actually know the URL_SUFFIX in the framework, so
        // we can't construct that URL. Instead, we record the 's3://.../...' form, and the CLI
        // transforms it to the correct 'https://.../' URL before calling CloudFormation.
        return {
            bucketName: cfnify(location.bucketName),
            objectKey: cfnify(location.objectKey),
            httpUrl,
            s3ObjectUrl: cfnify(s3ObjectUrlWithPlaceholders),
            s3ObjectUrlWithPlaceholders,
            s3Url: httpUrl,
        };
    }
    /**
     * Turn a docker asset location into a CloudFormation representation of that location
     *
     * If any of the fields contain placeholders, the result will be wrapped in a `Fn.sub`.
     */
    cloudFormationLocationFromDockerImageAsset(dest) {
        const { account, region, urlSuffix } = stackLocationOrInstrinsics(this.boundStack);
        // Return CFN expression
        return {
            repositoryName: cfnify(dest.repositoryName),
            imageUri: cfnify(`${account}.dkr.ecr.${region}.${urlSuffix}/${dest.repositoryName}:${dest.imageTag}`),
            imageTag: cfnify(dest.imageTag),
        };
    }
}
_a = JSII_RTTI_SYMBOL_1;
StackSynthesizer[_a] = { fqn: "@aws-cdk/core.StackSynthesizer", version: "0.0.0" };
exports.StackSynthesizer = StackSynthesizer;
function stackTemplateFileAsset(stack, session) {
    const templatePath = path.join(session.assembly.outdir, stack.templateFile);
    if (!fs.existsSync(templatePath)) {
        throw new Error(`Stack template ${stack.stackName} not written yet: ${templatePath}`);
    }
    const template = fs.readFileSync(templatePath, { encoding: 'utf-8' });
    const sourceHash = (0, _shared_1.contentHash)(template);
    return {
        fileName: stack.templateFile,
        packaging: assets_1.FileAssetPackaging.FILE,
        sourceHash,
    };
}
/**
 * Add a CfnRule to the Stack which checks the current version of the bootstrap stack this template is targeting
 *
 * The CLI normally checks this, but in a pipeline the CLI is not involved
 * so we encode this rule into the template in a way that CloudFormation will check it.
 */
function addBootstrapVersionRule(stack, requiredVersion, bootstrapStackVersionSsmParameter) {
    // Because of https://github.com/aws/aws-cdk/blob/main/packages/assert-internal/lib/synth-utils.ts#L74
    // synthesize() may be called more than once on a stack in unit tests, and the below would break
    // if we execute it a second time. Guard against the constructs already existing.
    if (stack.node.tryFindChild('BootstrapVersion')) {
        return;
    }
    const param = new cfn_parameter_1.CfnParameter(stack, 'BootstrapVersion', {
        type: 'AWS::SSM::Parameter::Value<String>',
        description: `Version of the CDK Bootstrap resources in this environment, automatically retrieved from SSM Parameter Store. ${cxapi.SSMPARAM_NO_INVALIDATE}`,
        default: bootstrapStackVersionSsmParameter,
    });
    // There is no >= check in CloudFormation, so we have to check the number
    // is NOT in [1, 2, 3, ... <required> - 1]
    const oldVersions = range(1, requiredVersion).map(n => `${n}`);
    new cfn_rule_1.CfnRule(stack, 'CheckBootstrapVersion', {
        assertions: [
            {
                assert: cfn_fn_1.Fn.conditionNot(cfn_fn_1.Fn.conditionContains(oldVersions, param.valueAsString)),
                assertDescription: `CDK bootstrap stack version ${requiredVersion} required. Please run 'cdk bootstrap' with a recent version of the CDK CLI.`,
            },
        ],
    });
}
function range(startIncl, endExcl) {
    const ret = new Array();
    for (let i = startIncl; i < endExcl; i++) {
        ret.push(i);
    }
    return ret;
}
/**
 * Return the stack locations if they're concrete, or the original CFN intrisics otherwise
 *
 * We need to return these instead of the tokenized versions of the strings,
 * since we must accept those same ${AWS::AccountId}/${AWS::Region} placeholders
 * in bucket names and role names (in order to allow environment-agnostic stacks).
 *
 * We'll wrap a single {Fn::Sub} around the final string in order to replace everything,
 * but we can't have the token system render part of the string to {Fn::Join} because
 * the CFN specification doesn't allow the {Fn::Sub} template string to be an arbitrary
 * expression--it must be a string literal.
 */
function stackLocationOrInstrinsics(stack) {
    return {
        account: (0, _shared_1.resolvedOr)(stack.account, '${AWS::AccountId}'),
        region: (0, _shared_1.resolvedOr)(stack.region, '${AWS::Region}'),
        urlSuffix: (0, _shared_1.resolvedOr)(stack.urlSuffix, '${AWS::URLSuffix}'),
    };
}
/**
 * If the string still contains placeholders, wrap it in a Fn::Sub so they will be substituted at CFN deployment time
 *
 * (This happens to work because the placeholders we picked map directly onto CFN
 * placeholders. If they didn't we'd have to do a transformation here).
 */
function cfnify(s) {
    return s.indexOf('${') > -1 ? cfn_fn_1.Fn.sub(s) : s;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2stc3ludGhlc2l6ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGFjay1zeW50aGVzaXplci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBRTdCLHlDQUF5QztBQUN6Qyx1Q0FBZ0Y7QUFFaEYsc0NBQXFJO0FBQ3JJLHNDQUErQjtBQUMvQixvREFBZ0Q7QUFDaEQsMENBQXNDO0FBR3RDOzs7Ozs7O0dBT0c7QUFDSCxNQUFzQixnQkFBZ0I7SUFFcEM7O09BRUc7SUFDSCxJQUFXLGtCQUFrQjtRQUMzQixPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUlEOzs7O09BSUc7SUFDSSxJQUFJLENBQUMsS0FBWTs7Ozs7Ozs7OztRQUN0QixJQUFJLElBQUksQ0FBQyxXQUFXLEtBQUssU0FBUyxFQUFFO1lBQ2xDLE1BQU0sSUFBSSxLQUFLLENBQUMsd0dBQXdHLENBQUMsQ0FBQztTQUMzSDtRQUVELElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0tBQzFCO0lBaUNEOzs7O09BSUc7SUFDTyx1QkFBdUIsQ0FBQyxLQUFZLEVBQUUsT0FBMEI7Ozs7Ozs7Ozs7OztRQUN4RSxLQUFLLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDcEM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7OztPQWdCRztJQUNPLGtCQUFrQixDQUFDLE9BQTBCLEVBQUUsYUFBc0I7Ozs7Ozs7Ozs7UUFDN0UsSUFBSSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDNUQsT0FBTyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3pEO0lBRUQ7Ozs7Ozs7T0FPRztJQUNPLGlCQUFpQixDQUFDLEtBQVksRUFBRSxPQUEwQixFQUFFLFVBQTBDLEVBQUU7Ozs7Ozs7Ozs7Ozs7UUFDaEgsSUFBQSxvQ0FBMEIsRUFBQyxPQUFPLEVB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O0FBRUQsU0FBUyxLQUFLLENBQUMsU0FBaUIsRUFBRSxPQUFlO0lBQy9DLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxFQUFVLENBQUM7SUFDaEMsS0FBSyxJQUFJLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN4QyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2I7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7R0FXRztBQUNILFNBQVMsMEJBQTBCLENBQUMsS0FBWTtJQUM5QyxPQUFPO1FBQ0wsT0FBTyxFQUFFLElBQUEsb0JBQVUsRUFBQyxLQUFLLENBQUMsT0FBTyxFQUFFLG1CQUFtQixDQUFDO1FBQ3ZELE1BQU0sRUFBRSxJQUFBLG9CQUFVLEVBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQztRQUNsRCxTQUFTLEVBQUUsSUFBQSxvQkFBVSxFQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLENBQUM7S0FDNUQsQ0FBQztBQUNKLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILFNBQVMsTUFBTSxDQUFDLENBQVM7SUFDdkIsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBjeHNjaGVtYSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IGFkZFN0YWNrQXJ0aWZhY3RUb0Fzc2VtYmx5LCBjb250ZW50SGFzaCwgcmVzb2x2ZWRPciB9IGZyb20gJy4vX3NoYXJlZCc7XG5pbXBvcnQgeyBJU3RhY2tTeW50aGVzaXplciwgSVN5bnRoZXNpc1Nlc3Npb24gfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IERvY2tlckltYWdlQXNzZXRMb2NhdGlvbiwgRG9ja2VySW1hZ2VBc3NldFNvdXJjZSwgRmlsZUFzc2V0TG9jYXRpb24sIEZpbGVBc3NldFNvdXJjZSwgRmlsZUFzc2V0UGFja2FnaW5nIH0gZnJvbSAnLi4vYXNzZXRzJztcbmltcG9ydCB7IEZuIH0gZnJvbSAnLi4vY2ZuLWZuJztcbmltcG9ydCB7IENmblBhcmFtZXRlciB9IGZyb20gJy4uL2Nmbi1wYXJhbWV0ZXInO1xuaW1wb3J0IHsgQ2ZuUnVsZSB9IGZyb20gJy4uL2Nmbi1ydWxlJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnLi4vc3RhY2snO1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGltcGxlbWVudGluZyBhbiBJU3RhY2tTeW50aGVzaXplclxuICpcbiAqIFRoaXMgY2xhc3MgbmVlZHMgdG8gZXhpc3QgdG8gcHJvdmlkZSBwdWJsaWMgc3VyZmFjZSBhcmVhIGZvciBleHRlcm5hbFxuICogaW1wbGVtZW50YXRpb25zIG9mIHN0YWNrIHN5bnRoZXNpemVycy4gVGhlIHByb3RlY3RlZCBtZXRob2RzIGdpdmVcbiAqIGFjY2VzcyB0byBmdW5jdGlvbnMgdGhhdCBhcmUgb3RoZXJ3aXNlIEBfaW50ZXJuYWwgdG8gdGhlIGZyYW1ld29ya1xuICogYW5kIGNvdWxkIG5vdCBiZSBhY2Nlc3NlZCBieSBleHRlcm5hbCBpbXBsZW1lbnRvcnMuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTdGFja1N5bnRoZXNpemVyIGltcGxlbWVudHMgSVN0YWNrU3ludGhlc2l6ZXIge1xuXG4gIC8qKlxuICAgKiBUaGUgcXVhbGlmaWVyIHVzZWQgdG8gYm9vdHN0cmFwIHRoaXMgc3RhY2tcbiAgICovXG4gIHB1YmxpYyBnZXQgYm9vdHN0cmFwUXVhbGlmaWVyKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByaXZhdGUgX2JvdW5kU3RhY2s/OiBTdGFjaztcblxuICAvKipcbiAgICogQmluZCB0byB0aGUgc3RhY2sgdGhpcyBlbnZpcm9ubWVudCBpcyBnb2luZyB0byBiZSB1c2VkIG9uXG4gICAqXG4gICAqIE11c3QgYmUgY2FsbGVkIGJlZm9yZSBhbnkgb2YgdGhlIG90aGVyIG1ldGhvZHMgYXJlIGNhbGxlZC5cbiAgICovXG4gIHB1YmxpYyBiaW5kKHN0YWNrOiBTdGFjayk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9ib3VuZFN0YWNrICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQSBTdGFja1N5bnRoZXNpemVyIGNhbiBvbmx5IGJlIHVzZWQgZm9yIG9uZSBTdGFjazogY3JlYXRlIGEgbmV3IGluc3RhbmNlIHRvIHVzZSB3aXRoIGEgZGlmZmVyZW50IFN0YWNrJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fYm91bmRTdGFjayA9IHN0YWNrO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgRmlsZSBBc3NldFxuICAgKlxuICAgKiBSZXR1cm5zIHRoZSBwYXJhbWV0ZXJzIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVmZXIgdG8gdGhlIGFzc2V0IGluc2lkZSB0aGUgdGVtcGxhdGUuXG4gICAqXG4gICAqIFRoZSBzeW50aGVzaXplciBtdXN0IHJlbHkgb24gc29tZSBvdXQtb2YtYmFuZCBtZWNoYW5pc20gdG8gbWFrZSBzdXJlIHRoZSBnaXZlbiBmaWxlc1xuICAgKiBhcmUgYWN0dWFsbHkgcGxhY2VkIGluIHRoZSByZXR1cm5lZCBsb2NhdGlvbiBiZWZvcmUgdGhlIGRlcGxveW1lbnQgaGFwcGVucy4gVGhpcyBjYW5cbiAgICogYmUgYnkgd3JpdGluZyB0aGUgaW50cnVjdGlvbnMgdG8gdGhlIGFzc2V0IG1hbmlmZXN0IChmb3IgdXNlIGJ5IHRoZSBgY2RrLWFzc2V0c2AgdG9vbCksXG4gICAqIGJ5IHJlbHlpbmcgb24gdGhlIENMSSB0byB1cGxvYWQgZmlsZXMgKGxlZ2FjeSBiZWhhdmlvciksIG9yIHNvbWUgb3RoZXIgb3BlcmF0b3IgY29udHJvbGxlZFxuICAgKiBtZWNoYW5pc20uXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgYWRkRmlsZUFzc2V0KGFzc2V0OiBGaWxlQXNzZXRTb3VyY2UpOiBGaWxlQXNzZXRMb2NhdGlvbjtcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBEb2NrZXIgSW1hZ2UgQXNzZXRcbiAgICpcbiAgICogUmV0dXJucyB0aGUgcGFyYW1ldGVycyB0aGF0IGNhbiBiZSB1c2VkIHRvIHJlZmVyIHRvIHRoZSBhc3NldCBpbnNpZGUgdGhlIHRlbXBsYXRlLlxuICAgKlxuICAgKiBUaGUgc3ludGhlc2l6ZXIgbXVzdCByZWx5IG9uIHNvbWUgb3V0LW9mLWJhbmQgbWVjaGFuaXNtIHRvIG1ha2Ugc3VyZSB0aGUgZ2l2ZW4gZmlsZXNcbiAgICogYXJlIGFjdHVhbGx5IHBsYWNlZCBpbiB0aGUgcmV0dXJuZWQgbG9jYXRpb24gYmVmb3JlIHRoZSBkZXBsb3ltZW50IGhhcHBlbnMuIFRoaXMgY2FuXG4gICAqIGJlIGJ5IHdyaXRpbmcgdGhlIGludHJ1Y3Rpb25zIHRvIHRoZSBhc3NldCBtYW5pZmVzdCAoZm9yIHVzZSBieSB0aGUgYGNkay1hc3NldHNgIHRvb2wpLFxuICAgKiBieSByZWx5aW5nIG9uIHRoZSBDTEkgdG8gdXBsb2FkIGZpbGVzIChsZWdhY3kgYmVoYXZpb3IpLCBvciBzb21lIG90aGVyIG9wZXJhdG9yIGNvbnRyb2xsZWRcbiAgICogbWVjaGFuaXNtLlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IGFkZERvY2tlckltYWdlQXNzZXQoYXNzZXQ6IERvY2tlckltYWdlQXNzZXRTb3VyY2UpOiBEb2NrZXJJbWFnZUFzc2V0TG9jYXRpb247XG5cbiAgLyoqXG4gICAqIFN5bnRoZXNpemUgdGhlIGFzc29jaWF0ZWQgc3RhY2sgdG8gdGhlIHNlc3Npb25cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBzeW50aGVzaXplKHNlc3Npb246IElTeW50aGVzaXNTZXNzaW9uKTogdm9pZDtcblxuICAvKipcbiAgICogSGF2ZSB0aGUgc3RhY2sgd3JpdGUgb3V0IGl0cyB0ZW1wbGF0ZVxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYHN5bnRoZXNpemVUZW1wbGF0ZWAgaW5zdGVhZFxuICAgKi9cbiAgcHJvdGVjdGVkIHN5bnRoZXNpemVTdGFja1RlbXBsYXRlKHN0YWNrOiBTdGFjaywgc2Vzc2lvbjogSVN5bnRoZXNpc1Nlc3Npb24pOiB2b2lkIHtcbiAgICBzdGFjay5fc3ludGhlc2l6ZVRlbXBsYXRlKHNlc3Npb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyaXRlIHRoZSBzdGFjayB0ZW1wbGF0ZSB0byB0aGUgZ2l2ZW4gc2Vzc2lvblxuICAgKlxuICAgKiBSZXR1cm4gYSBkZXNjcmlwdG9yIHRoYXQgcmVwcmVzZW50cyB0aGUgc3RhY2sgdGVtcGxhdGUgYXMgYSBmaWxlIGFzc2V0XG4gICAqIHNvdXJjZSwgZm9yIGFkZGluZyB0byBhbiBhc3NldCBtYW5pZmVzdCAoaWYgZGVzaXJlZCkuIFRoaXMgY2FuIGJlIHVzZWQgdG9cbiAgICogaGF2ZSB0aGUgYXNzZXQgbWFuaWZlc3Qgc3lzdGVtIChgY2RrLWFzc2V0c2ApIHVwbG9hZCB0aGUgdGVtcGxhdGUgdG8gUzNcbiAgICogdXNpbmcgdGhlIGFwcHJvcHJpYXRlIHJvbGUsIHNvIHRoYXQgYWZ0ZXJ3YXJkcyBvbmx5IGEgQ2xvdWRGb3JtYXRpb25cbiAgICogZGVwbG95bWVudCBpcyBuZWNlc3NhcnkuXG4gICAqXG4gICAqIElmIHRoZSB0ZW1wbGF0ZSBpcyB1cGxvYWRlZCBhcyBhbiBhc3NldCwgdGhlIGBzdGFja1RlbXBsYXRlQXNzZXRPYmplY3RVcmxgXG4gICAqIHByb3BlcnR5IHNob3VsZCBiZSBzZXQgd2hlbiBjYWxsaW5nIGBlbWl0QXJ0aWZhY3QuYFxuICAgKlxuICAgKiBJZiB0aGUgdGVtcGxhdGUgaXMgKk5PVCogdXBsb2FkZWQgYXMgYW4gYXNzZXQgZmlyc3QgYW5kIHRoZSB0ZW1wbGF0ZSB0dXJuc1xuICAgKiBvdXQgdG8gYmUgPjUwS0IsIGl0IHdpbGwgbmVlZCB0byBiZSB1cGxvYWRlZCB0byBTMyBhbnl3YXkuIEF0IHRoYXQgcG9pbnRcbiAgICogdGhlIGNyZWRlbnRpYWxzIHdpbGwgYmUgdGhlIHNhbWUgaWRlbnRpdHkgdGhhdCBpcyBkb2luZyB0aGUgYFVwZGF0ZVN0YWNrYFxuICAgKiBjYWxsLCB3aGljaCBtYXkgbm90IGhhdmUgdGhlIHJpZ2h0IHBlcm1pc3Npb25zIHRvIHdyaXRlIHRvIFMzLlxuICAgKi9cbiAgcHJvdGVjdGVkIHN5bnRoZXNpemVUZW1wbGF0ZShzZXNzaW9uOiBJU3ludGhlc2lzU2Vzc2lvbiwgbG9va3VwUm9sZUFybj86IHN0cmluZyk6IEZpbGVBc3NldFNvdXJjZSB7XG4gICAgdGhpcy5ib3VuZFN0YWNrLl9zeW50aGVzaXplVGVtcGxhdGUoc2Vzc2lvbiwgbG9va3VwUm9sZUFybik7XG4gICAgcmV0dXJuIHN0YWNrVGVtcGxhdGVGaWxlQXNzZXQodGhpcy5ib3VuZFN0YWNrLCBzZXNzaW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcml0ZSB0aGUgc3RhY2sgYXJ0aWZhY3QgdG8gdGhlIHNlc3Npb25cbiAgICpcbiAgICogVXNlIGRlZmF1bHQgc2V0dGluZ3MgdG8gYWRkIGEgQ2xvdWRGb3JtYXRpb25TdGFja0FydGlmYWN0IGFydGlmYWN0IHRvXG4gICAqIHRoZSBnaXZlbiBzeW50aGVzaXMgc2Vzc2lvbi5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBlbWl0QXJ0aWZhY3RgIGluc3RlYWRcbiAgICovXG4gIHByb3RlY3RlZCBlbWl0U3RhY2tBcnRpZmFjdChzdGFjazogU3RhY2ssIHNlc3Npb246IElTeW50aGVzaXNTZXNzaW9uLCBvcHRpb25zOiBTeW50aGVzaXplU3RhY2tBcnRpZmFjdE9wdGlvbnMgPSB7fSkge1xuICAgIGFkZFN0YWNrQXJ0aWZhY3RUb0Fzc2VtYmx5KHNlc3Npb24sIHN0YWNrLCBvcHRpb25zID8/IHt9LCBvcHRpb25zLmFkZGl0aW9uYWxEZXBlbmRlbmNpZXMgPz8gW10pO1xuICB9XG5cbiAgLyoqXG4gICAqIFdyaXRlIHRoZSBDbG91ZEZvcm1hdGlvbiBzdGFjayBhcnRpZmFjdCB0byB0aGUgc2Vzc2lvblxuICAgKlxuICAgKiBVc2UgZGVmYXVsdCBzZXR0aW5ncyB0byBhZGQgYSBDbG91ZEZvcm1hdGlvblN0YWNrQXJ0aWZhY3QgYXJ0aWZhY3QgdG9cbiAgICogdGhlIGdpdmVuIHN5bnRoZXNpcyBzZXNzaW9uLiBUaGUgU3RhY2sgYXJ0aWZhY3Qgd2lsbCBjb250cm9sIHRoZSBzZXR0aW5ncyBmb3IgdGhlXG4gICAqIENsb3VkRm9ybWF0aW9uIGRlcGxveW1lbnQuXG4gICAqL1xuICBwcm90ZWN0ZWQgZW1pdEFydGlmYWN0KHNlc3Npb246IElTeW50aGVzaXNTZXNzaW9uLCBvcHRpb25zOiBTeW50aGVzaXplU3RhY2tBcnRpZmFjdE9wdGlvbnMgPSB7fSkge1xuICAgIGFkZFN0YWNrQXJ0aWZhY3RUb0Fzc2VtYmx5KHNlc3Npb24sIHRoaXMuYm91bmRTdGFjaywgb3B0aW9ucyA/PyB7fSwgb3B0aW9ucy5hZGRpdGlvbmFsRGVwZW5kZW5jaWVzID8/IFtdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBDZm5SdWxlIHRvIHRoZSBib3VuZCBzdGFjayB0aGF0IGNoZWNrcyB3aGV0aGVyIGFuIFNTTSBwYXJhbWV0ZXIgZXhjZWVkcyBhIGdpdmVuIHZlcnNpb25cbiAgICpcbiAgICogVGhpcyB3aWxsIG1vZGlmeSB0aGUgdGVtcGxhdGUsIHNvIG11c3QgYmUgY2FsbGVkIGJlZm9yZSB0aGUgc3RhY2sgaXMgc3ludGhlc2l6ZWQuXG4gICAqL1xuICBwcm90ZWN0ZWQgYWRkQm9vdHN0cmFwVmVyc2lvblJ1bGUocmVxdWlyZWRWZXJzaW9uOiBudW1iZXIsIGJvb3RzdHJhcFN0YWNrVmVyc2lvblNzbVBhcmFtZXRlcjogc3RyaW5nKSB7XG4gICAgYWRkQm9vdHN0cmFwVmVyc2lvblJ1bGUodGhpcy5ib3VuZFN0YWNrLCByZXF1aXJlZFZlcnNpb24sIGJvb3RzdHJhcFN0YWNrVmVyc2lvblNzbVBhcmFtZXRlcik7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgdGhlIGJvdW5kIHN0YWNrXG4gICAqXG4gICAqIEZhaWxzIGlmIHRoZSBzdGFjayBoYXNuJ3QgYmVlbiBib3VuZCB5ZXQuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0IGJvdW5kU3RhY2soKTogU3RhY2sge1xuICAgIGlmICghdGhpcy5fYm91bmRTdGFjaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgU3RhY2tTeW50aGVzaXplciBtdXN0IGJlIGJvdW5kIHRvIGEgU3RhY2sgZmlyc3QgYmVmb3JlIGJvdW5kU3RhY2soKSBjYW4gYmUgY2FsbGVkJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9ib3VuZFN0YWNrO1xuICB9XG5cbiAgLyoqXG4gICAqIFR1cm4gYSBmaWxlIGFzc2V0IGxvY2F0aW9uIGludG8gYSBDbG91ZEZvcm1hdGlvbiByZXByZXNlbnRhdGlvbiBvZiB0aGF0IGxvY2F0aW9uXG4gICAqXG4gICAqIElmIGFueSBvZiB0aGUgZmllbGRzIGNvbnRhaW4gcGxhY2Vob2xkZXJzLCB0aGUgcmVzdWx0IHdpbGwgYmUgd3JhcHBlZCBpbiBhIGBGbi5zdWJgLlxuICAgKi9cbiAgcHJvdGVjdGVkIGNsb3VkRm9ybWF0aW9uTG9jYXRpb25Gcm9tRmlsZUFzc2V0KGxvY2F0aW9uOiBjeHNjaGVtYS5GaWxlRGVzdGluYXRpb24pOiBGaWxlQXNzZXRMb2NhdGlvbiB7XG4gICAgY29uc3QgeyByZWdpb24sIHVybFN1ZmZpeCB9ID0gc3RhY2tMb2NhdGlvbk9ySW5zdHJpbnNpY3ModGhpcy5ib3VuZFN0YWNrKTtcbiAgICBjb25zdCBodHRwVXJsID0gY2ZuaWZ5KFxuICAgICAgYGh0dHBzOi8vczMuJHtyZWdpb259LiR7dXJsU3VmZml4fS8ke2xvY2F0aW9uLmJ1Y2tldE5hbWV9LyR7bG9jYXRpb24ub2JqZWN0S2V5fWAsXG4gICAgKTtcbiAgICBjb25zdCBzM09iamVjdFVybFdpdGhQbGFjZWhvbGRlcnMgPSBgczM6Ly8ke2xvY2F0aW9uLmJ1Y2tldE5hbWV9LyR7bG9jYXRpb24ub2JqZWN0S2V5fWA7XG5cbiAgICAvLyBSZXR1cm4gQ0ZOIGV4cHJlc3Npb25cbiAgICAvL1xuICAgIC8vICdzM09iamVjdFVybFdpdGhQbGFjZWhvbGRlcnMnIGlzIGludGVuZGVkIGZvciB0aGUgQ0xJLiBUaGUgQ0xJIHVsdGltYXRlbHkgbmVlZHMgYVxuICAgIC8vICdodHRwczovL3MzLlJFR0lPTi5hbWF6b25hd3MuY29tWy5jbl0vbmFtZS9oYXNoJyBVUkwgdG8gZ2l2ZSB0byBDbG91ZEZvcm1hdGlvbi5cbiAgICAvLyBIb3dldmVyLCB0aGVyZSdzIG5vIHdheSBmb3IgdXMgdG8gYWN0dWFsbHkga25vdyB0aGUgVVJMX1NVRkZJWCBpbiB0aGUgZnJhbWV3b3JrLCBzb1xuICAgIC8vIHdlIGNhbid0IGNvbnN0cnVjdCB0aGF0IFVSTC4gSW5zdGVhZCwgd2UgcmVjb3JkIHRoZSAnczM6Ly8uLi4vLi4uJyBmb3JtLCBhbmQgdGhlIENMSVxuICAgIC8vIHRyYW5zZm9ybXMgaXQgdG8gdGhlIGNvcnJlY3QgJ2h0dHBzOi8vLi4uLycgVVJMIGJlZm9yZSBjYWxsaW5nIENsb3VkRm9ybWF0aW9uLlxuICAgIHJldHVybiB7XG4gICAgICBidWNrZXROYW1lOiBjZm5pZnkobG9jYXRpb24uYnVja2V0TmFtZSksXG4gICAgICBvYmplY3RLZXk6IGNmbmlmeShsb2NhdGlvbi5vYmplY3RLZXkpLFxuICAgICAgaHR0cFVybCxcbiAgICAgIHMzT2JqZWN0VXJsOiBjZm5pZnkoczNPYmplY3RVcmxXaXRoUGxhY2Vob2xkZXJzKSxcbiAgICAgIHMzT2JqZWN0VXJsV2l0aFBsYWNlaG9sZGVycyxcbiAgICAgIHMzVXJsOiBodHRwVXJsLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVHVybiBhIGRvY2tlciBhc3NldCBsb2NhdGlvbiBpbnRvIGEgQ2xvdWRGb3JtYXRpb24gcmVwcmVzZW50YXRpb24gb2YgdGhhdCBsb2NhdGlvblxuICAgKlxuICAgKiBJZiBhbnkgb2YgdGhlIGZpZWxkcyBjb250YWluIHBsYWNlaG9sZGVycywgdGhlIHJlc3VsdCB3aWxsIGJlIHdyYXBwZWQgaW4gYSBgRm4uc3ViYC5cbiAgICovXG4gIHByb3RlY3RlZCBjbG91ZEZvcm1hdGlvbkxvY2F0aW9uRnJvbURvY2tlckltYWdlQXNzZXQoZGVzdDogY3hzY2hlbWEuRG9ja2VySW1hZ2VEZXN0aW5hdGlvbik6IERvY2tlckltYWdlQXNzZXRMb2NhdGlvbiB7XG4gICAgY29uc3QgeyBhY2NvdW50LCByZWdpb24sIHVybFN1ZmZpeCB9ID0gc3RhY2tMb2NhdGlvbk9ySW5zdHJpbnNpY3ModGhpcy5ib3VuZFN0YWNrKTtcblxuICAgIC8vIFJldHVybiBDRk4gZXhwcmVzc2lvblxuICAgIHJldHVybiB7XG4gICAgICByZXBvc2l0b3J5TmFtZTogY2ZuaWZ5KGRlc3QucmVwb3NpdG9yeU5hbWUpLFxuICAgICAgaW1hZ2VVcmk6IGNmbmlmeShcbiAgICAgICAgYCR7YWNjb3VudH0uZGtyLmVjci4ke3JlZ2lvbn0uJHt1cmxTdWZmaXh9LyR7ZGVzdC5yZXBvc2l0b3J5TmFtZX06JHtkZXN0LmltYWdlVGFnfWAsXG4gICAgICApLFxuICAgICAgaW1hZ2VUYWc6IGNmbmlmeShkZXN0LmltYWdlVGFnKSxcbiAgICB9O1xuICB9XG5cbn1cblxuLyoqXG4gKiBTdGFjayBhcnRpZmFjdCBvcHRpb25zXG4gKlxuICogQSBzdWJzZXQgb2YgYGN4c2NoZW1hLkF3c0Nsb3VkRm9ybWF0aW9uU3RhY2tQcm9wZXJ0aWVzYCBvZiBvcHRpb25hbCBzZXR0aW5ncyB0aGF0IG5lZWQgdG8gYmVcbiAqIGNvbmZpZ3VyYWJsZSBieSBzeW50aGVzaXplcnMsIHBsdXMgYGFkZGl0aW9uYWxEZXBlbmRlbmNpZXNgLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFN5bnRoZXNpemVTdGFja0FydGlmYWN0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBJZGVudGlmaWVycyBvZiBhZGRpdGlvbmFsIGRlcGVuZGVuY2llc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGFkZGl0aW9uYWwgZGVwZW5kZW5jaWVzXG4gICAqL1xuICByZWFkb25seSBhZGRpdGlvbmFsRGVwZW5kZW5jaWVzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFZhbHVlcyBmb3IgQ2xvdWRGb3JtYXRpb24gc3RhY2sgcGFyYW1ldGVycyB0aGF0IHNob3VsZCBiZSBwYXNzZWQgd2hlbiB0aGUgc3RhY2sgaXMgZGVwbG95ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gcGFyYW1ldGVyc1xuICAgKi9cbiAgcmVhZG9ubHkgcGFyYW1ldGVycz86IHsgW2lkOiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAvKipcbiAgICogVGhlIHJvbGUgdGhhdCBuZWVkcyB0byBiZSBhc3N1bWVkIHRvIGRlcGxveSB0aGUgc3RhY2tcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyByb2xlIGlzIGFzc3VtZWQgKGN1cnJlbnQgY3JlZGVudGlhbHMgYXJlIHVzZWQpXG4gICAqL1xuICByZWFkb25seSBhc3N1bWVSb2xlQXJuPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZXh0ZXJuYWxJRCB0byB1c2Ugd2l0aCB0aGUgYXNzdW1lUm9sZUFyblxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGV4dGVybmFsSUQgaXMgdXNlZFxuICAgKi9cbiAgcmVhZG9ubHkgYXNzdW1lUm9sZUV4dGVybmFsSWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSByb2xlIHRoYXQgaXMgcGFzc2VkIHRvIENsb3VkRm9ybWF0aW9uIHRvIGV4ZWN1dGUgdGhlIGNoYW5nZSBzZXRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyByb2xlIGlzIHBhc3NlZCAoY3VycmVudGx5IGFzc3VtZWQgcm9sZS9jcmVkZW50aWFscyBhcmUgdXNlZClcbiAgICovXG4gIHJlYWRvbmx5IGNsb3VkRm9ybWF0aW9uRXhlY3V0aW9uUm9sZUFybj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHJvbGUgdG8gdXNlIHRvIGxvb2sgdXAgdmFsdWVzIGZyb20gdGhlIHRhcmdldCBBV1MgYWNjb3VudFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGxvb2t1cFJvbGU/OiBjeHNjaGVtYS5Cb290c3RyYXBSb2xlO1xuXG4gIC8qKlxuICAgKiBJZiB0aGUgc3RhY2sgdGVtcGxhdGUgaGFzIGFscmVhZHkgYmVlbiBpbmNsdWRlZCBpbiB0aGUgYXNzZXQgbWFuaWZlc3QsIGl0cyBhc3NldCBVUkxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb3QgdXBsb2FkZWQgeWV0LCB1cGxvYWQganVzdCBiZWZvcmUgZGVwbG95aW5nXG4gICAqL1xuICByZWFkb25seSBzdGFja1RlbXBsYXRlQXNzZXRPYmplY3RVcmw/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFZlcnNpb24gb2YgYm9vdHN0cmFwIHN0YWNrIHJlcXVpcmVkIHRvIGRlcGxveSB0aGlzIHN0YWNrXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gYm9vdHN0cmFwIHN0YWNrIHJlcXVpcmVkXG4gICAqL1xuICByZWFkb25seSByZXF1aXJlc0Jvb3RzdHJhcFN0YWNrVmVyc2lvbj86IG51bWJlcjtcblxuICAvKipcbiAgICogU1NNIHBhcmFtZXRlciB3aGVyZSB0aGUgYm9vdHN0cmFwIHN0YWNrIHZlcnNpb24gbnVtYmVyIGNhbiBiZSBmb3VuZFxuICAgKlxuICAgKiBPbmx5IHVzZWQgaWYgYHJlcXVpcmVzQm9vdHN0cmFwU3RhY2tWZXJzaW9uYCBpcyBzZXQuXG4gICAqXG4gICAqIC0gSWYgdGhpcyB2YWx1ZSBpcyBub3Qgc2V0LCB0aGUgYm9vdHN0cmFwIHN0YWNrIG5hbWUgbXVzdCBiZSBrbm93biBhdFxuICAgKiAgIGRlcGxveW1lbnQgdGltZSBzbyB0aGUgc3RhY2sgdmVyc2lvbiBjYW4gYmUgbG9va2VkIHVwIGZyb20gdGhlIHN0YWNrXG4gICAqICAgb3V0cHV0cy5cbiAgICogLSBJZiB0aGlzIHZhbHVlIGlzIHNldCwgdGhlIGJvb3RzdHJhcCBzdGFjayBjYW4gaGF2ZSBhbnkgbmFtZSBiZWNhdXNlXG4gICAqICAgd2Ugd29uJ3QgbmVlZCB0byBsb29rIGl0IHVwLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEJvb3RzdHJhcCBzdGFjayB2ZXJzaW9uIG51bWJlciBsb29rZWQgdXBcbiAgICovXG4gIHJlYWRvbmx5IGJvb3RzdHJhcFN0YWNrVmVyc2lvblNzbVBhcmFtZXRlcj86IHN0cmluZztcbn1cblxuZnVuY3Rpb24gc3RhY2tUZW1wbGF0ZUZpbGVBc3NldChzdGFjazogU3RhY2ssIHNlc3Npb246IElTeW50aGVzaXNTZXNzaW9uKTogRmlsZUFzc2V0U291cmNlIHtcbiAgY29uc3QgdGVtcGxhdGVQYXRoID0gcGF0aC5qb2luKHNlc3Npb24uYXNzZW1ibHkub3V0ZGlyLCBzdGFjay50ZW1wbGF0ZUZpbGUpO1xuXG4gIGlmICghZnMuZXhpc3RzU3luYyh0ZW1wbGF0ZVBhdGgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBTdGFjayB0ZW1wbGF0ZSAke3N0YWNrLnN0YWNrTmFtZX0gbm90IHdyaXR0ZW4geWV0OiAke3RlbXBsYXRlUGF0aH1gKTtcbiAgfVxuXG4gIGNvbnN0IHRlbXBsYXRlID0gZnMucmVhZEZpbGVTeW5jKHRlbXBsYXRlUGF0aCwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KTtcblxuICBjb25zdCBzb3VyY2VIYXNoID0gY29udGVudEhhc2godGVtcGxhdGUpO1xuXG4gIHJldHVybiB7XG4gICAgZmlsZU5hbWU6IHN0YWNrLnRlbXBsYXRlRmlsZSxcbiAgICBwYWNrYWdpbmc6IEZpbGVBc3NldFBhY2thZ2luZy5GSUxFLFxuICAgIHNvdXJjZUhhc2gsXG4gIH07XG59XG5cbi8qKlxuICogQWRkIGEgQ2ZuUnVsZSB0byB0aGUgU3RhY2sgd2hpY2ggY2hlY2tzIHRoZSBjdXJyZW50IHZlcnNpb24gb2YgdGhlIGJvb3RzdHJhcCBzdGFjayB0aGlzIHRlbXBsYXRlIGlzIHRhcmdldGluZ1xuICpcbiAqIFRoZSBDTEkgbm9ybWFsbHkgY2hlY2tzIHRoaXMsIGJ1dCBpbiBhIHBpcGVsaW5lIHRoZSBDTEkgaXMgbm90IGludm9sdmVkXG4gKiBzbyB3ZSBlbmNvZGUgdGhpcyBydWxlIGludG8gdGhlIHRlbXBsYXRlIGluIGEgd2F5IHRoYXQgQ2xvdWRGb3JtYXRpb24gd2lsbCBjaGVjayBpdC5cbiAqL1xuZnVuY3Rpb24gYWRkQm9vdHN0cmFwVmVyc2lvblJ1bGUoc3RhY2s6IFN0YWNrLCByZXF1aXJlZFZlcnNpb246IG51bWJlciwgYm9vdHN0cmFwU3RhY2tWZXJzaW9uU3NtUGFyYW1ldGVyOiBzdHJpbmcpIHtcbiAgLy8gQmVjYXVzZSBvZiBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1jZGsvYmxvYi9tYWluL3BhY2thZ2VzL2Fzc2VydC1pbnRlcm5hbC9saWIvc3ludGgtdXRpbHMudHMjTDc0XG4gIC8vIHN5bnRoZXNpemUoKSBtYXkgYmUgY2FsbGVkIG1vcmUgdGhhbiBvbmNlIG9uIGEgc3RhY2sgaW4gdW5pdCB0ZXN0cywgYW5kIHRoZSBiZWxvdyB3b3VsZCBicmVha1xuICAvLyBpZiB3ZSBleGVjdXRlIGl0IGEgc2Vjb25kIHRpbWUuIEd1YXJkIGFnYWluc3QgdGhlIGNvbnN0cnVjdHMgYWxyZWFkeSBleGlzdGluZy5cbiAgaWYgKHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKCdCb290c3RyYXBWZXJzaW9uJykpIHsgcmV0dXJuOyB9XG5cbiAgY29uc3QgcGFyYW0gPSBuZXcgQ2ZuUGFyYW1ldGVyKHN0YWNrLCAnQm9vdHN0cmFwVmVyc2lvbicsIHtcbiAgICB0eXBlOiAnQVdTOjpTU006OlBhcmFtZXRlcjo6VmFsdWU8U3RyaW5nPicsXG4gICAgZGVzY3JpcHRpb246IGBWZXJzaW9uIG9mIHRoZSBDREsgQm9vdHN0cmFwIHJlc291cmNlcyBpbiB0aGlzIGVudmlyb25tZW50LCBhdXRvbWF0aWNhbGx5IHJldHJpZXZlZCBmcm9tIFNTTSBQYXJhbWV0ZXIgU3RvcmUuICR7Y3hhcGkuU1NNUEFSQU1fTk9fSU5WQUxJREFURX1gLFxuICAgIGRlZmF1bHQ6IGJvb3RzdHJhcFN0YWNrVmVyc2lvblNzbVBhcmFtZXRlcixcbiAgfSk7XG5cbiAgLy8gVGhlcmUgaXMgbm8gPj0gY2hlY2sgaW4gQ2xvdWRGb3JtYXRpb24sIHNvIHdlIGhhdmUgdG8gY2hlY2sgdGhlIG51bWJlclxuICAvLyBpcyBOT1QgaW4gWzEsIDIsIDMsIC4uLiA8cmVxdWlyZWQ+IC0gMV1cbiAgY29uc3Qgb2xkVmVyc2lvbnMgPSByYW5nZSgxLCByZXF1aXJlZFZlcnNpb24pLm1hcChuID0+IGAke259YCk7XG5cbiAgbmV3IENmblJ1bGUoc3RhY2ssICdDaGVja0Jvb3RzdHJhcFZlcnNpb24nLCB7XG4gICAgYXNzZXJ0aW9uczogW1xuICAgICAge1xuICAgICAgICBhc3NlcnQ6IEZuLmNvbmRpdGlvbk5vdChGbi5jb25kaXRpb25Db250YWlucyhvbGRWZXJzaW9ucywgcGFyYW0udmFsdWVBc1N0cmluZykpLFxuICAgICAgICBhc3NlcnREZXNjcmlwdGlvbjogYENESyBib290c3RyYXAgc3RhY2sgdmVyc2lvbiAke3JlcXVpcmVkVmVyc2lvbn0gcmVxdWlyZWQuIFBsZWFzZSBydW4gJ2NkayBib290c3RyYXAnIHdpdGggYSByZWNlbnQgdmVyc2lvbiBvZiB0aGUgQ0RLIENMSS5gLFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gcmFuZ2Uoc3RhcnRJbmNsOiBudW1iZXIsIGVuZEV4Y2w6IG51bWJlcikge1xuICBjb25zdCByZXQgPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuICBmb3IgKGxldCBpID0gc3RhcnRJbmNsOyBpIDwgZW5kRXhjbDsgaSsrKSB7XG4gICAgcmV0LnB1c2goaSk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuLyoqXG4gKiBSZXR1cm4gdGhlIHN0YWNrIGxvY2F0aW9ucyBpZiB0aGV5J3JlIGNvbmNyZXRlLCBvciB0aGUgb3JpZ2luYWwgQ0ZOIGludHJpc2ljcyBvdGhlcndpc2VcbiAqXG4gKiBXZSBuZWVkIHRvIHJldHVybiB0aGVzZSBpbnN0ZWFkIG9mIHRoZSB0b2tlbml6ZWQgdmVyc2lvbnMgb2YgdGhlIHN0cmluZ3MsXG4gKiBzaW5jZSB3ZSBtdXN0IGFjY2VwdCB0aG9zZSBzYW1lICR7QVdTOjpBY2NvdW50SWR9LyR7QVdTOjpSZWdpb259IHBsYWNlaG9sZGVyc1xuICogaW4gYnVja2V0IG5hbWVzIGFuZCByb2xlIG5hbWVzIChpbiBvcmRlciB0byBhbGxvdyBlbnZpcm9ubWVudC1hZ25vc3RpYyBzdGFja3MpLlxuICpcbiAqIFdlJ2xsIHdyYXAgYSBzaW5nbGUge0ZuOjpTdWJ9IGFyb3VuZCB0aGUgZmluYWwgc3RyaW5nIGluIG9yZGVyIHRvIHJlcGxhY2UgZXZlcnl0aGluZyxcbiAqIGJ1dCB3ZSBjYW4ndCBoYXZlIHRoZSB0b2tlbiBzeXN0ZW0gcmVuZGVyIHBhcnQgb2YgdGhlIHN0cmluZyB0byB7Rm46OkpvaW59IGJlY2F1c2VcbiAqIHRoZSBDRk4gc3BlY2lmaWNhdGlvbiBkb2Vzbid0IGFsbG93IHRoZSB7Rm46OlN1Yn0gdGVtcGxhdGUgc3RyaW5nIHRvIGJlIGFuIGFyYml0cmFyeVxuICogZXhwcmVzc2lvbi0taXQgbXVzdCBiZSBhIHN0cmluZyBsaXRlcmFsLlxuICovXG5mdW5jdGlvbiBzdGFja0xvY2F0aW9uT3JJbnN0cmluc2ljcyhzdGFjazogU3RhY2spIHtcbiAgcmV0dXJuIHtcbiAgICBhY2NvdW50OiByZXNvbHZlZE9yKHN0YWNrLmFjY291bnQsICcke0FXUzo6QWNjb3VudElkfScpLFxuICAgIHJlZ2lvbjogcmVzb2x2ZWRPcihzdGFjay5yZWdpb24sICcke0FXUzo6UmVnaW9ufScpLFxuICAgIHVybFN1ZmZpeDogcmVzb2x2ZWRPcihzdGFjay51cmxTdWZmaXgsICcke0FXUzo6VVJMU3VmZml4fScpLFxuICB9O1xufVxuXG4vKipcbiAqIElmIHRoZSBzdHJpbmcgc3RpbGwgY29udGFpbnMgcGxhY2Vob2xkZXJzLCB3cmFwIGl0IGluIGEgRm46OlN1YiBzbyB0aGV5IHdpbGwgYmUgc3Vic3RpdHV0ZWQgYXQgQ0ZOIGRlcGxveW1lbnQgdGltZVxuICpcbiAqIChUaGlzIGhhcHBlbnMgdG8gd29yayBiZWNhdXNlIHRoZSBwbGFjZWhvbGRlcnMgd2UgcGlja2VkIG1hcCBkaXJlY3RseSBvbnRvIENGTlxuICogcGxhY2Vob2xkZXJzLiBJZiB0aGV5IGRpZG4ndCB3ZSdkIGhhdmUgdG8gZG8gYSB0cmFuc2Zvcm1hdGlvbiBoZXJlKS5cbiAqL1xuZnVuY3Rpb24gY2ZuaWZ5KHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBzLmluZGV4T2YoJyR7JykgPiAtMSA/IEZuLnN1YihzKSA6IHM7XG59XG4iXX0=