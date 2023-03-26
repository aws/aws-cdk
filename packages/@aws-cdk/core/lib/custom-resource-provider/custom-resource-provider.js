"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomResourceProvider = exports.CustomResourceProviderRuntime = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const path = require("path");
const cxapi = require("@aws-cdk/cx-api");
const constructs_1 = require("constructs");
const fse = require("fs-extra");
const asset_staging_1 = require("../asset-staging");
const assets_1 = require("../assets");
const cfn_resource_1 = require("../cfn-resource");
const duration_1 = require("../duration");
const fs_1 = require("../fs");
const helpers_internal_1 = require("../helpers-internal");
const lazy_1 = require("../lazy");
const size_1 = require("../size");
const stack_1 = require("../stack");
const token_1 = require("../token");
const ENTRYPOINT_FILENAME = '__entrypoint__';
const ENTRYPOINT_NODEJS_SOURCE = path.join(__dirname, 'nodejs-entrypoint.js');
/**
 * The lambda runtime to use for the resource provider. This also indicates
 * which language is used for the handler.
 */
var CustomResourceProviderRuntime;
(function (CustomResourceProviderRuntime) {
    /**
     * Node.js 12.x
     */
    CustomResourceProviderRuntime["NODEJS_12_X"] = "nodejs12.x";
    /**
     * Node.js 12.x
     *
     * @deprecated Use `NODEJS_14_X`
     */
    CustomResourceProviderRuntime["NODEJS_12"] = "deprecated_nodejs12.x";
    /**
     * Node.js 14.x
     */
    CustomResourceProviderRuntime["NODEJS_14_X"] = "nodejs14.x";
    /**
     * Node.js 16.x
     */
    CustomResourceProviderRuntime["NODEJS_16_X"] = "nodejs16.x";
})(CustomResourceProviderRuntime = exports.CustomResourceProviderRuntime || (exports.CustomResourceProviderRuntime = {}));
/**
 * An AWS-Lambda backed custom resource provider, for CDK Construct Library constructs
 *
 * This is a provider for `CustomResource` constructs, backed by an AWS Lambda
 * Function. It only supports NodeJS runtimes.
 *
 * > **Application builders do not need to use this provider type**. This is not
 * > a generic custom resource provider class. It is specifically
 * > intended to be used only by constructs in the AWS CDK Construct Library, and
 * > only exists here because of reverse dependency issues (for example, it cannot
 * > use `iam.PolicyStatement` objects, since the `iam` library already depends on
 * > the CDK `core` library and we cannot have cyclic dependencies).
 *
 * If you are not writing constructs for the AWS Construct Library, you should
 * use the `Provider` class in the `custom-resources` module instead, which has
 * a better API and supports all Lambda runtimes, not just Node.
 *
 * N.B.: When you are writing Custom Resource Providers, there are a number of
 * lifecycle events you have to pay attention to. These are documented in the
 * README of the `custom-resources` module. Be sure to give the documentation
 * in that module a read, regardless of whether you end up using the Provider
 * class in there or this one.
 */
class CustomResourceProvider extends constructs_1.Construct {
    /**
     * Returns a stack-level singleton ARN (service token) for the custom resource
     * provider.
     *
     * @param scope Construct scope
     * @param uniqueid A globally unique id that will be used for the stack-level
     * construct.
     * @param props Provider properties which will only be applied when the
     * provider is first created.
     * @returns the service token of the custom resource provider, which should be
     * used when defining a `CustomResource`.
     */
    static getOrCreate(scope, uniqueid, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CustomResourceProviderProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.getOrCreate);
            }
            throw error;
        }
        return this.getOrCreateProvider(scope, uniqueid, props).serviceToken;
    }
    /**
     * Returns a stack-level singleton for the custom resource provider.
     *
     * @param scope Construct scope
     * @param uniqueid A globally unique id that will be used for the stack-level
     * construct.
     * @param props Provider properties which will only be applied when the
     * provider is first created.
     * @returns the service token of the custom resource provider, which should be
     * used when defining a `CustomResource`.
     */
    static getOrCreateProvider(scope, uniqueid, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CustomResourceProviderProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.getOrCreateProvider);
            }
            throw error;
        }
        const id = `${uniqueid}CustomResourceProvider`;
        const stack = stack_1.Stack.of(scope);
        const provider = stack.node.tryFindChild(id)
            ?? new CustomResourceProvider(stack, id, props);
        return provider;
    }
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CustomResourceProviderProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CustomResourceProvider);
            }
            throw error;
        }
        const stack = stack_1.Stack.of(scope);
        // verify we have an index file there
        if (!fs.existsSync(path.join(props.codeDirectory, 'index.js'))) {
            throw new Error(`cannot find ${props.codeDirectory}/index.js`);
        }
        const stagingDirectory = fs_1.FileSystem.mkdtemp('cdk-custom-resource');
        fse.copySync(props.codeDirectory, stagingDirectory, { filter: (src, _dest) => !src.endsWith('.ts') });
        fs.copyFileSync(ENTRYPOINT_NODEJS_SOURCE, path.join(stagingDirectory, `${ENTRYPOINT_FILENAME}.js`));
        const staging = new asset_staging_1.AssetStaging(this, 'Staging', {
            sourcePath: stagingDirectory,
        });
        const assetFileName = staging.relativeStagedPath(stack);
        const asset = stack.synthesizer.addFileAsset({
            fileName: assetFileName,
            sourceHash: staging.assetHash,
            packaging: assets_1.FileAssetPackaging.ZIP_DIRECTORY,
        });
        if (props.policyStatements) {
            for (const statement of props.policyStatements) {
                this.addToRolePolicy(statement);
            }
        }
        const config = (0, helpers_internal_1.getPrecreatedRoleConfig)(this, `${this.node.path}/Role`);
        const assumeRolePolicyDoc = [{ Action: 'sts:AssumeRole', Effect: 'Allow', Principal: { Service: 'lambda.amazonaws.com' } }];
        const managedPolicyArn = 'arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole';
        // need to initialize this attribute, but there should never be an instance
        // where config.enabled=true && config.preventSynthesis=true
        this.roleArn = '';
        if (config.enabled) {
            // gives policyStatements a chance to resolve
            this.node.addValidation({
                validate: () => {
                    helpers_internal_1.PolicySynthesizer.getOrCreate(this).addRole(`${this.node.path}/Role`, {
                        missing: !config.precreatedRoleName,
                        roleName: config.precreatedRoleName ?? id + 'Role',
                        managedPolicies: [{ managedPolicyArn: managedPolicyArn }],
                        policyStatements: this.policyStatements ?? [],
                        assumeRolePolicy: assumeRolePolicyDoc,
                    });
                    return [];
                },
            });
            this.roleArn = stack_1.Stack.of(this).formatArn({
                region: '',
                service: 'iam',
                resource: 'role',
                resourceName: config.precreatedRoleName,
            });
        }
        if (!config.preventSynthesis) {
            this._role = new cfn_resource_1.CfnResource(this, 'Role', {
                type: 'AWS::IAM::Role',
                properties: {
                    AssumeRolePolicyDocument: {
                        Version: '2012-10-17',
                        Statement: assumeRolePolicyDoc,
                    },
                    ManagedPolicyArns: [
                        { 'Fn::Sub': managedPolicyArn },
                    ],
                    Policies: lazy_1.Lazy.any({ produce: () => this.renderPolicies() }),
                },
            });
            this.roleArn = token_1.Token.asString(this._role.getAtt('Arn'));
        }
        const timeout = props.timeout ?? duration_1.Duration.minutes(15);
        const memory = props.memorySize ?? size_1.Size.mebibytes(128);
        const handler = new cfn_resource_1.CfnResource(this, 'Handler', {
            type: 'AWS::Lambda::Function',
            properties: {
                Code: {
                    S3Bucket: asset.bucketName,
                    S3Key: asset.objectKey,
                },
                Timeout: timeout.toSeconds(),
                MemorySize: memory.toMebibytes(),
                Handler: `${ENTRYPOINT_FILENAME}.handler`,
                Role: this.roleArn,
                Runtime: customResourceProviderRuntimeToString(props.runtime),
                Environment: this.renderEnvironmentVariables(props.environment),
                Description: props.description ?? undefined,
            },
        });
        if (this._role) {
            handler.addDependency(this._role);
        }
        if (this.node.tryGetContext(cxapi.ASSET_RESOURCE_METADATA_ENABLED_CONTEXT)) {
            handler.addMetadata(cxapi.ASSET_RESOURCE_METADATA_PATH_KEY, assetFileName);
            handler.addMetadata(cxapi.ASSET_RESOURCE_METADATA_PROPERTY_KEY, 'Code');
        }
        this.serviceToken = token_1.Token.asString(handler.getAtt('Arn'));
        this.codeHash = staging.assetHash;
    }
    /**
     * Add an IAM policy statement to the inline policy of the
     * provider's lambda function's role.
     *
     * **Please note**: this is a direct IAM JSON policy blob, *not* a `iam.PolicyStatement`
     * object like you will see in the rest of the CDK.
     *
     *
     * @example
     * declare const myProvider: CustomResourceProvider;
     *
     * myProvider.addToRolePolicy({
     *   Effect: 'Allow',
     *   Action: 's3:GetObject',
     *   Resource: '*',
     * });
     */
    addToRolePolicy(statement) {
        if (!this.policyStatements) {
            this.policyStatements = [];
        }
        this.policyStatements.push(statement);
    }
    renderPolicies() {
        if (!this.policyStatements) {
            return undefined;
        }
        const policies = [{
                PolicyName: 'Inline',
                PolicyDocument: {
                    Version: '2012-10-17',
                    Statement: this.policyStatements,
                },
            }];
        return policies;
    }
    renderEnvironmentVariables(env) {
        if (!env || Object.keys(env).length === 0) {
            return undefined;
        }
        env = { ...env }; // Copy
        // Always use regional endpoints
        env.AWS_STS_REGIONAL_ENDPOINTS = 'regional';
        // Sort environment so the hash of the function used to create
        // `currentVersion` is not affected by key order (this is how lambda does
        // it)
        const variables = {};
        const keys = Object.keys(env).sort();
        for (const key of keys) {
            variables[key] = env[key];
        }
        return { Variables: variables };
    }
}
_a = JSII_RTTI_SYMBOL_1;
CustomResourceProvider[_a] = { fqn: "@aws-cdk/core.CustomResourceProvider", version: "0.0.0" };
exports.CustomResourceProvider = CustomResourceProvider;
function customResourceProviderRuntimeToString(x) {
    switch (x) {
        case CustomResourceProviderRuntime.NODEJS_12:
        case CustomResourceProviderRuntime.NODEJS_12_X:
            return 'nodejs12.x';
        case CustomResourceProviderRuntime.NODEJS_14_X:
            return 'nodejs14.x';
        case CustomResourceProviderRuntime.NODEJS_16_X:
            return 'nodejs16.x';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLXJlc291cmNlLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3VzdG9tLXJlc291cmNlLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IseUNBQXlDO0FBQ3pDLDJDQUF1QztBQUN2QyxnQ0FBZ0M7QUFDaEMsb0RBQWdEO0FBQ2hELHNDQUErQztBQUMvQyxrREFBOEM7QUFDOUMsMENBQXVDO0FBQ3ZDLDhCQUFtQztBQUNuQywwREFBaUY7QUFDakYsa0NBQStCO0FBQy9CLGtDQUErQjtBQUMvQixvQ0FBaUM7QUFDakMsb0NBQWlDO0FBRWpDLE1BQU0sbUJBQW1CLEdBQUcsZ0JBQWdCLENBQUM7QUFDN0MsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0FBd0U5RTs7O0dBR0c7QUFDSCxJQUFZLDZCQXNCWDtBQXRCRCxXQUFZLDZCQUE2QjtJQUN2Qzs7T0FFRztJQUNILDJEQUEwQixDQUFBO0lBRTFCOzs7O09BSUc7SUFDSCxvRUFBbUMsQ0FBQTtJQUVuQzs7T0FFRztJQUNILDJEQUEwQixDQUFBO0lBRTFCOztPQUVHO0lBQ0gsMkRBQTBCLENBQUE7QUFDNUIsQ0FBQyxFQXRCVyw2QkFBNkIsR0FBN0IscUNBQTZCLEtBQTdCLHFDQUE2QixRQXNCeEM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCRztBQUNILE1BQWEsc0JBQXVCLFNBQVEsc0JBQVM7SUFDbkQ7Ozs7Ozs7Ozs7O09BV0c7SUFDSSxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQWdCLEVBQUUsUUFBZ0IsRUFBRSxLQUFrQzs7Ozs7Ozs7OztRQUM5RixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLFlBQVksQ0FBQztLQUN0RTtJQUVEOzs7Ozs7Ozs7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LENBQUM7U0FDbEI7UUFFRCxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsT0FBTztRQUV6QixnQ0FBZ0M7UUFDaEMsR0FBRyxDQUFDLDBCQUEwQixHQUFHLFVBQVUsQ0FBQztRQUU1Qyw4REFBOEQ7UUFDOUQseUVBQXlFO1FBQ3pFLE1BQU07UUFDTixNQUFNLFNBQVMsR0FBOEIsRUFBRSxDQUFDO1FBQ2hELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFckMsS0FBSyxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFDdEIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMzQjtRQUVELE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLENBQUM7S0FDakM7Ozs7QUFoUFUsd0RBQXNCO0FBbVBuQyxTQUFTLHFDQUFxQyxDQUFDLENBQWdDO0lBQzdFLFFBQVEsQ0FBQyxFQUFFO1FBQ1QsS0FBSyw2QkFBNkIsQ0FBQyxTQUFTLENBQUM7UUFDN0MsS0FBSyw2QkFBNkIsQ0FBQyxXQUFXO1lBQzVDLE9BQU8sWUFBWSxDQUFDO1FBQ3RCLEtBQUssNkJBQTZCLENBQUMsV0FBVztZQUM1QyxPQUFPLFlBQVksQ0FBQztRQUN0QixLQUFLLDZCQUE2QixDQUFDLFdBQVc7WUFDNUMsT0FBTyxZQUFZLENBQUM7S0FDdkI7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGZzZSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBBc3NldFN0YWdpbmcgfSBmcm9tICcuLi9hc3NldC1zdGFnaW5nJztcbmltcG9ydCB7IEZpbGVBc3NldFBhY2thZ2luZyB9IGZyb20gJy4uL2Fzc2V0cyc7XG5pbXBvcnQgeyBDZm5SZXNvdXJjZSB9IGZyb20gJy4uL2Nmbi1yZXNvdXJjZSc7XG5pbXBvcnQgeyBEdXJhdGlvbiB9IGZyb20gJy4uL2R1cmF0aW9uJztcbmltcG9ydCB7IEZpbGVTeXN0ZW0gfSBmcm9tICcuLi9mcyc7XG5pbXBvcnQgeyBQb2xpY3lTeW50aGVzaXplciwgZ2V0UHJlY3JlYXRlZFJvbGVDb25maWcgfSBmcm9tICcuLi9oZWxwZXJzLWludGVybmFsJztcbmltcG9ydCB7IExhenkgfSBmcm9tICcuLi9sYXp5JztcbmltcG9ydCB7IFNpemUgfSBmcm9tICcuLi9zaXplJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnLi4vc3RhY2snO1xuaW1wb3J0IHsgVG9rZW4gfSBmcm9tICcuLi90b2tlbic7XG5cbmNvbnN0IEVOVFJZUE9JTlRfRklMRU5BTUUgPSAnX19lbnRyeXBvaW50X18nO1xuY29uc3QgRU5UUllQT0lOVF9OT0RFSlNfU09VUkNFID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ25vZGVqcy1lbnRyeXBvaW50LmpzJyk7XG5cbi8qKlxuICogSW5pdGlhbGl6YXRpb24gcHJvcGVydGllcyBmb3IgYEN1c3RvbVJlc291cmNlUHJvdmlkZXJgLlxuICpcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUHJvcHMge1xuICAvKipcbiAgICogQSBsb2NhbCBmaWxlIHN5c3RlbSBkaXJlY3Rvcnkgd2l0aCB0aGUgcHJvdmlkZXIncyBjb2RlLiBUaGUgY29kZSB3aWxsIGJlXG4gICAqIGJ1bmRsZWQgaW50byBhIHppcCBhc3NldCBhbmQgd2lyZWQgdG8gdGhlIHByb3ZpZGVyJ3MgQVdTIExhbWJkYSBmdW5jdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGNvZGVEaXJlY3Rvcnk6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFXUyBMYW1iZGEgcnVudGltZSBhbmQgdmVyc2lvbiB0byB1c2UgZm9yIHRoZSBwcm92aWRlci5cbiAgICovXG4gIHJlYWRvbmx5IHJ1bnRpbWU6IEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lO1xuXG4gIC8qKlxuICAgKiBBIHNldCBvZiBJQU0gcG9saWN5IHN0YXRlbWVudHMgdG8gaW5jbHVkZSBpbiB0aGUgaW5saW5lIHBvbGljeSBvZiB0aGVcbiAgICogcHJvdmlkZXIncyBsYW1iZGEgZnVuY3Rpb24uXG4gICAqXG4gICAqICoqUGxlYXNlIG5vdGUqKjogdGhlc2UgYXJlIGRpcmVjdCBJQU0gSlNPTiBwb2xpY3kgYmxvYnMsICpub3QqIGBpYW0uUG9saWN5U3RhdGVtZW50YFxuICAgKiBvYmplY3RzIGxpa2UgeW91IHdpbGwgc2VlIGluIHRoZSByZXN0IG9mIHRoZSBDREsuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gYWRkaXRpb25hbCBpbmxpbmUgcG9saWN5XG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNvbnN0IHByb3ZpZGVyID0gQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5nZXRPckNyZWF0ZVByb3ZpZGVyKHRoaXMsICdDdXN0b206Ok15Q3VzdG9tUmVzb3VyY2VUeXBlJywge1xuICAgKiAgIGNvZGVEaXJlY3Rvcnk6IGAke19fZGlybmFtZX0vbXktaGFuZGxlcmAsXG4gICAqICAgcnVudGltZTogQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAqICAgcG9saWN5U3RhdGVtZW50czogW1xuICAgKiAgICAge1xuICAgKiAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAqICAgICAgIEFjdGlvbjogJ3MzOlB1dE9iamVjdConLFxuICAgKiAgICAgICBSZXNvdXJjZTogJyonLFxuICAgKiAgICAgfVxuICAgKiAgIF0sXG4gICAqIH0pO1xuICAgKi9cbiAgcmVhZG9ubHkgcG9saWN5U3RhdGVtZW50cz86IGFueVtdO1xuXG4gIC8qKlxuICAgKiBBV1MgTGFtYmRhIHRpbWVvdXQgZm9yIHRoZSBwcm92aWRlci5cbiAgICpcbiAgICogQGRlZmF1bHQgRHVyYXRpb24ubWludXRlcygxNSlcbiAgICovXG4gIHJlYWRvbmx5IHRpbWVvdXQ/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogVGhlIGFtb3VudCBvZiBtZW1vcnkgdGhhdCB5b3VyIGZ1bmN0aW9uIGhhcyBhY2Nlc3MgdG8uIEluY3JlYXNpbmcgdGhlXG4gICAqIGZ1bmN0aW9uJ3MgbWVtb3J5IGFsc28gaW5jcmVhc2VzIGl0cyBDUFUgYWxsb2NhdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgU2l6ZS5tZWJpYnl0ZXMoMTI4KVxuICAgKi9cbiAgcmVhZG9ubHkgbWVtb3J5U2l6ZT86IFNpemU7XG5cbiAgLyoqXG4gICAqIEtleS12YWx1ZSBwYWlycyB0aGF0IGFyZSBwYXNzZWQgdG8gTGFtYmRhIGFzIEVudmlyb25tZW50XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZW52aXJvbm1lbnQgdmFyaWFibGVzLlxuICAgKi9cbiAgcmVhZG9ubHkgZW52aXJvbm1lbnQ/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gIC8qKlxuICAgKiBBIGRlc2NyaXB0aW9uIG9mIHRoZSBmdW5jdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBkZXNjcmlwdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRoZSBsYW1iZGEgcnVudGltZSB0byB1c2UgZm9yIHRoZSByZXNvdXJjZSBwcm92aWRlci4gVGhpcyBhbHNvIGluZGljYXRlc1xuICogd2hpY2ggbGFuZ3VhZ2UgaXMgdXNlZCBmb3IgdGhlIGhhbmRsZXIuXG4gKi9cbmV4cG9ydCBlbnVtIEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lIHtcbiAgLyoqXG4gICAqIE5vZGUuanMgMTIueFxuICAgKi9cbiAgTk9ERUpTXzEyX1ggPSAnbm9kZWpzMTIueCcsXG5cbiAgLyoqXG4gICAqIE5vZGUuanMgMTIueFxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgYE5PREVKU18xNF9YYFxuICAgKi9cbiAgTk9ERUpTXzEyID0gJ2RlcHJlY2F0ZWRfbm9kZWpzMTIueCcsXG5cbiAgLyoqXG4gICAqIE5vZGUuanMgMTQueFxuICAgKi9cbiAgTk9ERUpTXzE0X1ggPSAnbm9kZWpzMTQueCcsXG5cbiAgLyoqXG4gICAqIE5vZGUuanMgMTYueFxuICAgKi9cbiAgTk9ERUpTXzE2X1ggPSAnbm9kZWpzMTYueCcsXG59XG5cbi8qKlxuICogQW4gQVdTLUxhbWJkYSBiYWNrZWQgY3VzdG9tIHJlc291cmNlIHByb3ZpZGVyLCBmb3IgQ0RLIENvbnN0cnVjdCBMaWJyYXJ5IGNvbnN0cnVjdHNcbiAqXG4gKiBUaGlzIGlzIGEgcHJvdmlkZXIgZm9yIGBDdXN0b21SZXNvdXJjZWAgY29uc3RydWN0cywgYmFja2VkIGJ5IGFuIEFXUyBMYW1iZGFcbiAqIEZ1bmN0aW9uLiBJdCBvbmx5IHN1cHBvcnRzIE5vZGVKUyBydW50aW1lcy5cbiAqXG4gKiA+ICoqQXBwbGljYXRpb24gYnVpbGRlcnMgZG8gbm90IG5lZWQgdG8gdXNlIHRoaXMgcHJvdmlkZXIgdHlwZSoqLiBUaGlzIGlzIG5vdFxuICogPiBhIGdlbmVyaWMgY3VzdG9tIHJlc291cmNlIHByb3ZpZGVyIGNsYXNzLiBJdCBpcyBzcGVjaWZpY2FsbHlcbiAqID4gaW50ZW5kZWQgdG8gYmUgdXNlZCBvbmx5IGJ5IGNvbnN0cnVjdHMgaW4gdGhlIEFXUyBDREsgQ29uc3RydWN0IExpYnJhcnksIGFuZFxuICogPiBvbmx5IGV4aXN0cyBoZXJlIGJlY2F1c2Ugb2YgcmV2ZXJzZSBkZXBlbmRlbmN5IGlzc3VlcyAoZm9yIGV4YW1wbGUsIGl0IGNhbm5vdFxuICogPiB1c2UgYGlhbS5Qb2xpY3lTdGF0ZW1lbnRgIG9iamVjdHMsIHNpbmNlIHRoZSBgaWFtYCBsaWJyYXJ5IGFscmVhZHkgZGVwZW5kcyBvblxuICogPiB0aGUgQ0RLIGBjb3JlYCBsaWJyYXJ5IGFuZCB3ZSBjYW5ub3QgaGF2ZSBjeWNsaWMgZGVwZW5kZW5jaWVzKS5cbiAqXG4gKiBJZiB5b3UgYXJlIG5vdCB3cml0aW5nIGNvbnN0cnVjdHMgZm9yIHRoZSBBV1MgQ29uc3RydWN0IExpYnJhcnksIHlvdSBzaG91bGRcbiAqIHVzZSB0aGUgYFByb3ZpZGVyYCBjbGFzcyBpbiB0aGUgYGN1c3RvbS1yZXNvdXJjZXNgIG1vZHVsZSBpbnN0ZWFkLCB3aGljaCBoYXNcbiAqIGEgYmV0dGVyIEFQSSBhbmQgc3VwcG9ydHMgYWxsIExhbWJkYSBydW50aW1lcywgbm90IGp1c3QgTm9kZS5cbiAqXG4gKiBOLkIuOiBXaGVuIHlvdSBhcmUgd3JpdGluZyBDdXN0b20gUmVzb3VyY2UgUHJvdmlkZXJzLCB0aGVyZSBhcmUgYSBudW1iZXIgb2ZcbiAqIGxpZmVjeWNsZSBldmVudHMgeW91IGhhdmUgdG8gcGF5IGF0dGVudGlvbiB0by4gVGhlc2UgYXJlIGRvY3VtZW50ZWQgaW4gdGhlXG4gKiBSRUFETUUgb2YgdGhlIGBjdXN0b20tcmVzb3VyY2VzYCBtb2R1bGUuIEJlIHN1cmUgdG8gZ2l2ZSB0aGUgZG9jdW1lbnRhdGlvblxuICogaW4gdGhhdCBtb2R1bGUgYSByZWFkLCByZWdhcmRsZXNzIG9mIHdoZXRoZXIgeW91IGVuZCB1cCB1c2luZyB0aGUgUHJvdmlkZXJcbiAqIGNsYXNzIGluIHRoZXJlIG9yIHRoaXMgb25lLlxuICovXG5leHBvcnQgY2xhc3MgQ3VzdG9tUmVzb3VyY2VQcm92aWRlciBleHRlbmRzIENvbnN0cnVjdCB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3RhY2stbGV2ZWwgc2luZ2xldG9uIEFSTiAoc2VydmljZSB0b2tlbikgZm9yIHRoZSBjdXN0b20gcmVzb3VyY2VcbiAgICogcHJvdmlkZXIuXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSBDb25zdHJ1Y3Qgc2NvcGVcbiAgICogQHBhcmFtIHVuaXF1ZWlkIEEgZ2xvYmFsbHkgdW5pcXVlIGlkIHRoYXQgd2lsbCBiZSB1c2VkIGZvciB0aGUgc3RhY2stbGV2ZWxcbiAgICogY29uc3RydWN0LlxuICAgKiBAcGFyYW0gcHJvcHMgUHJvdmlkZXIgcHJvcGVydGllcyB3aGljaCB3aWxsIG9ubHkgYmUgYXBwbGllZCB3aGVuIHRoZVxuICAgKiBwcm92aWRlciBpcyBmaXJzdCBjcmVhdGVkLlxuICAgKiBAcmV0dXJucyB0aGUgc2VydmljZSB0b2tlbiBvZiB0aGUgY3VzdG9tIHJlc291cmNlIHByb3ZpZGVyLCB3aGljaCBzaG91bGQgYmVcbiAgICogdXNlZCB3aGVuIGRlZmluaW5nIGEgYEN1c3RvbVJlc291cmNlYC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0T3JDcmVhdGUoc2NvcGU6IENvbnN0cnVjdCwgdW5pcXVlaWQ6IHN0cmluZywgcHJvcHM6IEN1c3RvbVJlc291cmNlUHJvdmlkZXJQcm9wcykge1xuICAgIHJldHVybiB0aGlzLmdldE9yQ3JlYXRlUHJvdmlkZXIoc2NvcGUsIHVuaXF1ZWlkLCBwcm9wcykuc2VydmljZVRva2VuO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzdGFjay1sZXZlbCBzaW5nbGV0b24gZm9yIHRoZSBjdXN0b20gcmVzb3VyY2UgcHJvdmlkZXIuXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSBDb25zdHJ1Y3Qgc2NvcGVcbiAgICogQHBhcmFtIHVuaXF1ZWlkIEEgZ2xvYmFsbHkgdW5pcXVlIGlkIHRoYXQgd2lsbCBiZSB1c2VkIGZvciB0aGUgc3RhY2stbGV2ZWxcbiAgICogY29uc3RydWN0LlxuICAgKiBAcGFyYW0gcHJvcHMgUHJvdmlkZXIgcHJvcGVydGllcyB3aGljaCB3aWxsIG9ubHkgYmUgYXBwbGllZCB3aGVuIHRoZVxuICAgKiBwcm92aWRlciBpcyBmaXJzdCBjcmVhdGVkLlxuICAgKiBAcmV0dXJucyB0aGUgc2VydmljZSB0b2tlbiBvZiB0aGUgY3VzdG9tIHJlc291cmNlIHByb3ZpZGVyLCB3aGljaCBzaG91bGQgYmVcbiAgICogdXNlZCB3aGVuIGRlZmluaW5nIGEgYEN1c3RvbVJlc291cmNlYC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0T3JDcmVhdGVQcm92aWRlcihzY29wZTogQ29uc3RydWN0LCB1bmlxdWVpZDogc3RyaW5nLCBwcm9wczogQ3VzdG9tUmVzb3VyY2VQcm92aWRlclByb3BzKSB7XG4gICAgY29uc3QgaWQgPSBgJHt1bmlxdWVpZH1DdXN0b21SZXNvdXJjZVByb3ZpZGVyYDtcbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHNjb3BlKTtcbiAgICBjb25zdCBwcm92aWRlciA9IHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKGlkKSBhcyBDdXN0b21SZXNvdXJjZVByb3ZpZGVyXG4gICAgICA/PyBuZXcgQ3VzdG9tUmVzb3VyY2VQcm92aWRlcihzdGFjaywgaWQsIHByb3BzKTtcblxuICAgIHJldHVybiBwcm92aWRlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBwcm92aWRlcidzIEFXUyBMYW1iZGEgZnVuY3Rpb24gd2hpY2ggc2hvdWxkIGJlIHVzZWQgYXMgdGhlXG4gICAqIGBzZXJ2aWNlVG9rZW5gIHdoZW4gZGVmaW5pbmcgYSBjdXN0b20gcmVzb3VyY2UuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGRlY2xhcmUgY29uc3QgbXlQcm92aWRlcjogQ3VzdG9tUmVzb3VyY2VQcm92aWRlcjtcbiAgICpcbiAgICogbmV3IEN1c3RvbVJlc291cmNlKHRoaXMsICdNeUN1c3RvbVJlc291cmNlJywge1xuICAgKiAgIHNlcnZpY2VUb2tlbjogbXlQcm92aWRlci5zZXJ2aWNlVG9rZW4sXG4gICAqICAgcHJvcGVydGllczoge1xuICAgKiAgICAgbXlQcm9wZXJ0eU9uZTogJ29uZScsXG4gICAqICAgICBteVByb3BlcnR5VHdvOiAndHdvJyxcbiAgICogICB9LFxuICAgKiB9KTtcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzZXJ2aWNlVG9rZW46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgcHJvdmlkZXIncyBBV1MgTGFtYmRhIGZ1bmN0aW9uIHJvbGUuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcm9sZUFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaGFzaCBvZiB0aGUgbGFtYmRhIGNvZGUgYmFja2luZyB0aGlzIHByb3ZpZGVyLiBDYW4gYmUgdXNlZCB0byB0cmlnZ2VyIHVwZGF0ZXNcbiAgICogb24gY29kZSBjaGFuZ2VzLCBldmVuIHdoZW4gdGhlIHByb3BlcnRpZXMgb2YgYSBjdXN0b20gcmVzb3VyY2UgcmVtYWluIHVuY2hhbmdlZC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBjb2RlSGFzaDogc3RyaW5nO1xuXG4gIHByaXZhdGUgcG9saWN5U3RhdGVtZW50cz86IGFueVtdO1xuICBwcml2YXRlIF9yb2xlPzogQ2ZuUmVzb3VyY2U7XG5cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZihzY29wZSk7XG5cbiAgICAvLyB2ZXJpZnkgd2UgaGF2ZSBhbiBpbmRleCBmaWxlIHRoZXJlXG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9wcy5jb2RlRGlyZWN0b3J5LCAnaW5kZXguanMnKSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgY2Fubm90IGZpbmQgJHtwcm9wcy5jb2RlRGlyZWN0b3J5fS9pbmRleC5qc2ApO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YWdpbmdEaXJlY3RvcnkgPSBGaWxlU3lzdGVtLm1rZHRlbXAoJ2Nkay1jdXN0b20tcmVzb3VyY2UnKTtcbiAgICBmc2UuY29weVN5bmMocHJvcHMuY29kZURpcmVjdG9yeSwgc3RhZ2luZ0RpcmVjdG9yeSwgeyBmaWx0ZXI6IChzcmMsIF9kZXN0KSA9PiAhc3JjLmVuZHNXaXRoKCcudHMnKSB9KTtcbiAgICBmcy5jb3B5RmlsZVN5bmMoRU5UUllQT0lOVF9OT0RFSlNfU09VUkNFLCBwYXRoLmpvaW4oc3RhZ2luZ0RpcmVjdG9yeSwgYCR7RU5UUllQT0lOVF9GSUxFTkFNRX0uanNgKSk7XG5cbiAgICBjb25zdCBzdGFnaW5nID0gbmV3IEFzc2V0U3RhZ2luZyh0aGlzLCAnU3RhZ2luZycsIHtcbiAgICAgIHNvdXJjZVBhdGg6IHN0YWdpbmdEaXJlY3RvcnksXG4gICAgfSk7XG5cbiAgICBjb25zdCBhc3NldEZpbGVOYW1lID0gc3RhZ2luZy5yZWxhdGl2ZVN0YWdlZFBhdGgoc3RhY2spO1xuXG4gICAgY29uc3QgYXNzZXQgPSBzdGFjay5zeW50aGVzaXplci5hZGRGaWxlQXNzZXQoe1xuICAgICAgZmlsZU5hbWU6IGFzc2V0RmlsZU5hbWUsXG4gICAgICBzb3VyY2VIYXNoOiBzdGFnaW5nLmFzc2V0SGFzaCxcbiAgICAgIHBhY2thZ2luZzogRmlsZUFzc2V0UGFja2FnaW5nLlpJUF9ESVJFQ1RPUlksXG4gICAgfSk7XG5cbiAgICBpZiAocHJvcHMucG9saWN5U3RhdGVtZW50cykge1xuICAgICAgZm9yIChjb25zdCBzdGF0ZW1lbnQgb2YgcHJvcHMucG9saWN5U3RhdGVtZW50cykge1xuICAgICAgICB0aGlzLmFkZFRvUm9sZVBvbGljeShzdGF0ZW1lbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGNvbmZpZyA9IGdldFByZWNyZWF0ZWRSb2xlQ29uZmlnKHRoaXMsIGAke3RoaXMubm9kZS5wYXRofS9Sb2xlYCk7XG4gICAgY29uc3QgYXNzdW1lUm9sZVBvbGljeURvYyA9IFt7IEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJywgRWZmZWN0OiAnQWxsb3cnLCBQcmluY2lwYWw6IHsgU2VydmljZTogJ2xhbWJkYS5hbWF6b25hd3MuY29tJyB9IH1dO1xuICAgIGNvbnN0IG1hbmFnZWRQb2xpY3lBcm4gPSAnYXJuOiR7QVdTOjpQYXJ0aXRpb259OmlhbTo6YXdzOnBvbGljeS9zZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJztcblxuICAgIC8vIG5lZWQgdG8gaW5pdGlhbGl6ZSB0aGlzIGF0dHJpYnV0ZSwgYnV0IHRoZXJlIHNob3VsZCBuZXZlciBiZSBhbiBpbnN0YW5jZVxuICAgIC8vIHdoZXJlIGNvbmZpZy5lbmFibGVkPXRydWUgJiYgY29uZmlnLnByZXZlbnRTeW50aGVzaXM9dHJ1ZVxuICAgIHRoaXMucm9sZUFybiA9ICcnO1xuICAgIGlmIChjb25maWcuZW5hYmxlZCkge1xuICAgICAgLy8gZ2l2ZXMgcG9saWN5U3RhdGVtZW50cyBhIGNoYW5jZSB0byByZXNvbHZlXG4gICAgICB0aGlzLm5vZGUuYWRkVmFsaWRhdGlvbih7XG4gICAgICAgIHZhbGlkYXRlOiAoKSA9PiB7XG4gICAgICAgICAgUG9saWN5U3ludGhlc2l6ZXIuZ2V0T3JDcmVhdGUodGhpcykuYWRkUm9sZShgJHt0aGlzLm5vZGUucGF0aH0vUm9sZWAsIHtcbiAgICAgICAgICAgIG1pc3Npbmc6ICFjb25maWcucHJlY3JlYXRlZFJvbGVOYW1lLFxuICAgICAgICAgICAgcm9sZU5hbWU6IGNvbmZpZy5wcmVjcmVhdGVkUm9sZU5hbWUgPz8gaWQrJ1JvbGUnLFxuICAgICAgICAgICAgbWFuYWdlZFBvbGljaWVzOiBbeyBtYW5hZ2VkUG9saWN5QXJuOiBtYW5hZ2VkUG9saWN5QXJuIH1dLFxuICAgICAgICAgICAgcG9saWN5U3RhdGVtZW50czogdGhpcy5wb2xpY3lTdGF0ZW1lbnRzID8/IFtdLFxuICAgICAgICAgICAgYXNzdW1lUm9sZVBvbGljeTogYXNzdW1lUm9sZVBvbGljeURvYyBhcyBhbnksXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICB0aGlzLnJvbGVBcm4gPSBTdGFjay5vZih0aGlzKS5mb3JtYXRBcm4oe1xuICAgICAgICByZWdpb246ICcnLFxuICAgICAgICBzZXJ2aWNlOiAnaWFtJyxcbiAgICAgICAgcmVzb3VyY2U6ICdyb2xlJyxcbiAgICAgICAgcmVzb3VyY2VOYW1lOiBjb25maWcucHJlY3JlYXRlZFJvbGVOYW1lLFxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICghY29uZmlnLnByZXZlbnRTeW50aGVzaXMpIHtcbiAgICAgIHRoaXMuX3JvbGUgPSBuZXcgQ2ZuUmVzb3VyY2UodGhpcywgJ1JvbGUnLCB7XG4gICAgICAgIHR5cGU6ICdBV1M6OklBTTo6Um9sZScsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgIFN0YXRlbWVudDogYXNzdW1lUm9sZVBvbGljeURvYyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIE1hbmFnZWRQb2xpY3lBcm5zOiBbXG4gICAgICAgICAgICB7ICdGbjo6U3ViJzogbWFuYWdlZFBvbGljeUFybiB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgUG9saWNpZXM6IExhenkuYW55KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5yZW5kZXJQb2xpY2llcygpIH0pLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICB0aGlzLnJvbGVBcm4gPSBUb2tlbi5hc1N0cmluZyh0aGlzLl9yb2xlLmdldEF0dCgnQXJuJykpO1xuICAgIH1cblxuXG4gICAgY29uc3QgdGltZW91dCA9IHByb3BzLnRpbWVvdXQgPz8gRHVyYXRpb24ubWludXRlcygxNSk7XG4gICAgY29uc3QgbWVtb3J5ID0gcHJvcHMubWVtb3J5U2l6ZSA/PyBTaXplLm1lYmlieXRlcygxMjgpO1xuXG4gICAgY29uc3QgaGFuZGxlciA9IG5ldyBDZm5SZXNvdXJjZSh0aGlzLCAnSGFuZGxlcicsIHtcbiAgICAgIHR5cGU6ICdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBDb2RlOiB7XG4gICAgICAgICAgUzNCdWNrZXQ6IGFzc2V0LmJ1Y2tldE5hbWUsXG4gICAgICAgICAgUzNLZXk6IGFzc2V0Lm9iamVjdEtleSxcbiAgICAgICAgfSxcbiAgICAgICAgVGltZW91dDogdGltZW91dC50b1NlY29uZHMoKSxcbiAgICAgICAgTWVtb3J5U2l6ZTogbWVtb3J5LnRvTWViaWJ5dGVzKCksXG4gICAgICAgIEhhbmRsZXI6IGAke0VOVFJZUE9JTlRfRklMRU5BTUV9LmhhbmRsZXJgLFxuICAgICAgICBSb2xlOiB0aGlzLnJvbGVBcm4sXG4gICAgICAgIFJ1bnRpbWU6IGN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lVG9TdHJpbmcocHJvcHMucnVudGltZSksXG4gICAgICAgIEVudmlyb25tZW50OiB0aGlzLnJlbmRlckVudmlyb25tZW50VmFyaWFibGVzKHByb3BzLmVudmlyb25tZW50KSxcbiAgICAgICAgRGVzY3JpcHRpb246IHByb3BzLmRlc2NyaXB0aW9uID8/IHVuZGVmaW5lZCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5fcm9sZSkge1xuICAgICAgaGFuZGxlci5hZGREZXBlbmRlbmN5KHRoaXMuX3JvbGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm5vZGUudHJ5R2V0Q29udGV4dChjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9FTkFCTEVEX0NPTlRFWFQpKSB7XG4gICAgICBoYW5kbGVyLmFkZE1ldGFkYXRhKGN4YXBpLkFTU0VUX1JFU09VUkNFX01FVEFEQVRBX1BBVEhfS0VZLCBhc3NldEZpbGVOYW1lKTtcbiAgICAgIGhhbmRsZXIuYWRkTWV0YWRhdGEoY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfUFJPUEVSVFlfS0VZLCAnQ29kZScpO1xuICAgIH1cblxuICAgIHRoaXMuc2VydmljZVRva2VuID0gVG9rZW4uYXNTdHJpbmcoaGFuZGxlci5nZXRBdHQoJ0FybicpKTtcbiAgICB0aGlzLmNvZGVIYXNoID0gc3RhZ2luZy5hc3NldEhhc2g7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIElBTSBwb2xpY3kgc3RhdGVtZW50IHRvIHRoZSBpbmxpbmUgcG9saWN5IG9mIHRoZVxuICAgKiBwcm92aWRlcidzIGxhbWJkYSBmdW5jdGlvbidzIHJvbGUuXG4gICAqXG4gICAqICoqUGxlYXNlIG5vdGUqKjogdGhpcyBpcyBhIGRpcmVjdCBJQU0gSlNPTiBwb2xpY3kgYmxvYiwgKm5vdCogYSBgaWFtLlBvbGljeVN0YXRlbWVudGBcbiAgICogb2JqZWN0IGxpa2UgeW91IHdpbGwgc2VlIGluIHRoZSByZXN0IG9mIHRoZSBDREsuXG4gICAqXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGRlY2xhcmUgY29uc3QgbXlQcm92aWRlcjogQ3VzdG9tUmVzb3VyY2VQcm92aWRlcjtcbiAgICpcbiAgICogbXlQcm92aWRlci5hZGRUb1JvbGVQb2xpY3koe1xuICAgKiAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICogICBBY3Rpb246ICdzMzpHZXRPYmplY3QnLFxuICAgKiAgIFJlc291cmNlOiAnKicsXG4gICAqIH0pO1xuICAgKi9cbiAgcHVibGljIGFkZFRvUm9sZVBvbGljeShzdGF0ZW1lbnQ6IGFueSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5wb2xpY3lTdGF0ZW1lbnRzKSB7XG4gICAgICB0aGlzLnBvbGljeVN0YXRlbWVudHMgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5wb2xpY3lTdGF0ZW1lbnRzLnB1c2goc3RhdGVtZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyUG9saWNpZXMoKSB7XG4gICAgaWYgKCF0aGlzLnBvbGljeVN0YXRlbWVudHMpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3QgcG9saWNpZXMgPSBbe1xuICAgICAgUG9saWN5TmFtZTogJ0lubGluZScsXG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIFN0YXRlbWVudDogdGhpcy5wb2xpY3lTdGF0ZW1lbnRzLFxuICAgICAgfSxcbiAgICB9XTtcblxuICAgIHJldHVybiBwb2xpY2llcztcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyRW52aXJvbm1lbnRWYXJpYWJsZXMoZW52PzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkge1xuICAgIGlmICghZW52IHx8IE9iamVjdC5rZXlzKGVudikubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGVudiA9IHsgLi4uZW52IH07IC8vIENvcHlcblxuICAgIC8vIEFsd2F5cyB1c2UgcmVnaW9uYWwgZW5kcG9pbnRzXG4gICAgZW52LkFXU19TVFNfUkVHSU9OQUxfRU5EUE9JTlRTID0gJ3JlZ2lvbmFsJztcblxuICAgIC8vIFNvcnQgZW52aXJvbm1lbnQgc28gdGhlIGhhc2ggb2YgdGhlIGZ1bmN0aW9uIHVzZWQgdG8gY3JlYXRlXG4gICAgLy8gYGN1cnJlbnRWZXJzaW9uYCBpcyBub3QgYWZmZWN0ZWQgYnkga2V5IG9yZGVyICh0aGlzIGlzIGhvdyBsYW1iZGEgZG9lc1xuICAgIC8vIGl0KVxuICAgIGNvbnN0IHZhcmlhYmxlczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhlbnYpLnNvcnQoKTtcblxuICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICAgIHZhcmlhYmxlc1trZXldID0gZW52W2tleV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgVmFyaWFibGVzOiB2YXJpYWJsZXMgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZVRvU3RyaW5nKHg6IEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lKTogc3RyaW5nIHtcbiAgc3dpdGNoICh4KSB7XG4gICAgY2FzZSBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZS5OT0RFSlNfMTI6XG4gICAgY2FzZSBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZS5OT0RFSlNfMTJfWDpcbiAgICAgIHJldHVybiAnbm9kZWpzMTIueCc7XG4gICAgY2FzZSBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZS5OT0RFSlNfMTRfWDpcbiAgICAgIHJldHVybiAnbm9kZWpzMTQueCc7XG4gICAgY2FzZSBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZS5OT0RFSlNfMTZfWDpcbiAgICAgIHJldHVybiAnbm9kZWpzMTYueCc7XG4gIH1cbn1cbiJdfQ==