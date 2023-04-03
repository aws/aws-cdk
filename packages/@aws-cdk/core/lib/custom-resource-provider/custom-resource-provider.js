"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomResourceProvider = exports.CustomResourceProviderRuntime = void 0;
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
        const id = `${uniqueid}CustomResourceProvider`;
        const stack = stack_1.Stack.of(scope);
        const provider = stack.node.tryFindChild(id)
            ?? new CustomResourceProvider(stack, id, props);
        return provider;
    }
    constructor(scope, id, props) {
        super(scope, id);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLXJlc291cmNlLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY3VzdG9tLXJlc291cmNlLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IseUNBQXlDO0FBQ3pDLDJDQUF1QztBQUN2QyxnQ0FBZ0M7QUFDaEMsb0RBQWdEO0FBQ2hELHNDQUErQztBQUMvQyxrREFBOEM7QUFDOUMsMENBQXVDO0FBQ3ZDLDhCQUFtQztBQUNuQywwREFBaUY7QUFDakYsa0NBQStCO0FBQy9CLGtDQUErQjtBQUMvQixvQ0FBaUM7QUFDakMsb0NBQWlDO0FBRWpDLE1BQU0sbUJBQW1CLEdBQUcsZ0JBQWdCLENBQUM7QUFDN0MsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0FBd0U5RTs7O0dBR0c7QUFDSCxJQUFZLDZCQXNCWDtBQXRCRCxXQUFZLDZCQUE2QjtJQUN2Qzs7T0FFRztJQUNILDJEQUEwQixDQUFBO0lBRTFCOzs7O09BSUc7SUFDSCxvRUFBbUMsQ0FBQTtJQUVuQzs7T0FFRztJQUNILDJEQUEwQixDQUFBO0lBRTFCOztPQUVHO0lBQ0gsMkRBQTBCLENBQUE7QUFDNUIsQ0FBQyxFQXRCVyw2QkFBNkIsR0FBN0IscUNBQTZCLEtBQTdCLHFDQUE2QixRQXNCeEM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCRztBQUNILE1BQWEsc0JBQXVCLFNBQVEsc0JBQVM7SUFDbkQ7Ozs7Ozs7Ozs7O09BV0c7SUFDSSxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQWdCLEVBQUUsUUFBZ0IsRUFBRSxLQUFrQztRQUM5RixPQUFPLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDLFlBQVksQ0FBQztJQUN2RSxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJ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QUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQyxPQUFPO1FBRXpCLGdDQUFnQztRQUNoQyxHQUFHLENBQUMsMEJBQTBCLEdBQUcsVUFBVSxDQUFDO1FBRTVDLDhEQUE4RDtRQUM5RCx5RUFBeUU7UUFDekUsTUFBTTtRQUNOLE1BQU0sU0FBUyxHQUE4QixFQUFFLENBQUM7UUFDaEQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVyQyxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtZQUN0QixTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzNCO1FBRUQsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0NBQ0Y7QUFqUEQsd0RBaVBDO0FBRUQsU0FBUyxxQ0FBcUMsQ0FBQyxDQUFnQztJQUM3RSxRQUFRLENBQUMsRUFBRTtRQUNULEtBQUssNkJBQTZCLENBQUMsU0FBUyxDQUFDO1FBQzdDLEtBQUssNkJBQTZCLENBQUMsV0FBVztZQUM1QyxPQUFPLFlBQVksQ0FBQztRQUN0QixLQUFLLDZCQUE2QixDQUFDLFdBQVc7WUFDNUMsT0FBTyxZQUFZLENBQUM7UUFDdEIsS0FBSyw2QkFBNkIsQ0FBQyxXQUFXO1lBQzVDLE9BQU8sWUFBWSxDQUFDO0tBQ3ZCO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBmc2UgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgQXNzZXRTdGFnaW5nIH0gZnJvbSAnLi4vYXNzZXQtc3RhZ2luZyc7XG5pbXBvcnQgeyBGaWxlQXNzZXRQYWNrYWdpbmcgfSBmcm9tICcuLi9hc3NldHMnO1xuaW1wb3J0IHsgQ2ZuUmVzb3VyY2UgfSBmcm9tICcuLi9jZm4tcmVzb3VyY2UnO1xuaW1wb3J0IHsgRHVyYXRpb24gfSBmcm9tICcuLi9kdXJhdGlvbic7XG5pbXBvcnQgeyBGaWxlU3lzdGVtIH0gZnJvbSAnLi4vZnMnO1xuaW1wb3J0IHsgUG9saWN5U3ludGhlc2l6ZXIsIGdldFByZWNyZWF0ZWRSb2xlQ29uZmlnIH0gZnJvbSAnLi4vaGVscGVycy1pbnRlcm5hbCc7XG5pbXBvcnQgeyBMYXp5IH0gZnJvbSAnLi4vbGF6eSc7XG5pbXBvcnQgeyBTaXplIH0gZnJvbSAnLi4vc2l6ZSc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4uL3N0YWNrJztcbmltcG9ydCB7IFRva2VuIH0gZnJvbSAnLi4vdG9rZW4nO1xuXG5jb25zdCBFTlRSWVBPSU5UX0ZJTEVOQU1FID0gJ19fZW50cnlwb2ludF9fJztcbmNvbnN0IEVOVFJZUE9JTlRfTk9ERUpTX1NPVVJDRSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdub2RlanMtZW50cnlwb2ludC5qcycpO1xuXG4vKipcbiAqIEluaXRpYWxpemF0aW9uIHByb3BlcnRpZXMgZm9yIGBDdXN0b21SZXNvdXJjZVByb3ZpZGVyYC5cbiAqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tUmVzb3VyY2VQcm92aWRlclByb3BzIHtcbiAgLyoqXG4gICAqIEEgbG9jYWwgZmlsZSBzeXN0ZW0gZGlyZWN0b3J5IHdpdGggdGhlIHByb3ZpZGVyJ3MgY29kZS4gVGhlIGNvZGUgd2lsbCBiZVxuICAgKiBidW5kbGVkIGludG8gYSB6aXAgYXNzZXQgYW5kIHdpcmVkIHRvIHRoZSBwcm92aWRlcidzIEFXUyBMYW1iZGEgZnVuY3Rpb24uXG4gICAqL1xuICByZWFkb25seSBjb2RlRGlyZWN0b3J5OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBV1MgTGFtYmRhIHJ1bnRpbWUgYW5kIHZlcnNpb24gdG8gdXNlIGZvciB0aGUgcHJvdmlkZXIuXG4gICAqL1xuICByZWFkb25seSBydW50aW1lOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZTtcblxuICAvKipcbiAgICogQSBzZXQgb2YgSUFNIHBvbGljeSBzdGF0ZW1lbnRzIHRvIGluY2x1ZGUgaW4gdGhlIGlubGluZSBwb2xpY3kgb2YgdGhlXG4gICAqIHByb3ZpZGVyJ3MgbGFtYmRhIGZ1bmN0aW9uLlxuICAgKlxuICAgKiAqKlBsZWFzZSBub3RlKio6IHRoZXNlIGFyZSBkaXJlY3QgSUFNIEpTT04gcG9saWN5IGJsb2JzLCAqbm90KiBgaWFtLlBvbGljeVN0YXRlbWVudGBcbiAgICogb2JqZWN0cyBsaWtlIHlvdSB3aWxsIHNlZSBpbiB0aGUgcmVzdCBvZiB0aGUgQ0RLLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGFkZGl0aW9uYWwgaW5saW5lIHBvbGljeVxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBjb25zdCBwcm92aWRlciA9IEN1c3RvbVJlc291cmNlUHJvdmlkZXIuZ2V0T3JDcmVhdGVQcm92aWRlcih0aGlzLCAnQ3VzdG9tOjpNeUN1c3RvbVJlc291cmNlVHlwZScsIHtcbiAgICogICBjb2RlRGlyZWN0b3J5OiBgJHtfX2Rpcm5hbWV9L215LWhhbmRsZXJgLFxuICAgKiAgIHJ1bnRpbWU6IEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lLk5PREVKU18xNF9YLFxuICAgKiAgIHBvbGljeVN0YXRlbWVudHM6IFtcbiAgICogICAgIHtcbiAgICogICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgKiAgICAgICBBY3Rpb246ICdzMzpQdXRPYmplY3QqJyxcbiAgICogICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICogICAgIH1cbiAgICogICBdLFxuICAgKiB9KTtcbiAgICovXG4gIHJlYWRvbmx5IHBvbGljeVN0YXRlbWVudHM/OiBhbnlbXTtcblxuICAvKipcbiAgICogQVdTIExhbWJkYSB0aW1lb3V0IGZvciB0aGUgcHJvdmlkZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IER1cmF0aW9uLm1pbnV0ZXMoMTUpXG4gICAqL1xuICByZWFkb25seSB0aW1lb3V0PzogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBhbW91bnQgb2YgbWVtb3J5IHRoYXQgeW91ciBmdW5jdGlvbiBoYXMgYWNjZXNzIHRvLiBJbmNyZWFzaW5nIHRoZVxuICAgKiBmdW5jdGlvbidzIG1lbW9yeSBhbHNvIGluY3JlYXNlcyBpdHMgQ1BVIGFsbG9jYXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IFNpemUubWViaWJ5dGVzKDEyOClcbiAgICovXG4gIHJlYWRvbmx5IG1lbW9yeVNpemU/OiBTaXplO1xuXG4gIC8qKlxuICAgKiBLZXktdmFsdWUgcGFpcnMgdGhhdCBhcmUgcGFzc2VkIHRvIExhbWJkYSBhcyBFbnZpcm9ubWVudFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGVudmlyb25tZW50IHZhcmlhYmxlcy5cbiAgICovXG4gIHJlYWRvbmx5IGVudmlyb25tZW50PzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcblxuICAvKipcbiAgICogQSBkZXNjcmlwdGlvbiBvZiB0aGUgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZGVzY3JpcHRpb24uXG4gICAqL1xuICByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcbn1cblxuLyoqXG4gKiBUaGUgbGFtYmRhIHJ1bnRpbWUgdG8gdXNlIGZvciB0aGUgcmVzb3VyY2UgcHJvdmlkZXIuIFRoaXMgYWxzbyBpbmRpY2F0ZXNcbiAqIHdoaWNoIGxhbmd1YWdlIGlzIHVzZWQgZm9yIHRoZSBoYW5kbGVyLlxuICovXG5leHBvcnQgZW51bSBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZSB7XG4gIC8qKlxuICAgKiBOb2RlLmpzIDEyLnhcbiAgICovXG4gIE5PREVKU18xMl9YID0gJ25vZGVqczEyLngnLFxuXG4gIC8qKlxuICAgKiBOb2RlLmpzIDEyLnhcbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBOT0RFSlNfMTRfWGBcbiAgICovXG4gIE5PREVKU18xMiA9ICdkZXByZWNhdGVkX25vZGVqczEyLngnLFxuXG4gIC8qKlxuICAgKiBOb2RlLmpzIDE0LnhcbiAgICovXG4gIE5PREVKU18xNF9YID0gJ25vZGVqczE0LngnLFxuXG4gIC8qKlxuICAgKiBOb2RlLmpzIDE2LnhcbiAgICovXG4gIE5PREVKU18xNl9YID0gJ25vZGVqczE2LngnLFxufVxuXG4vKipcbiAqIEFuIEFXUy1MYW1iZGEgYmFja2VkIGN1c3RvbSByZXNvdXJjZSBwcm92aWRlciwgZm9yIENESyBDb25zdHJ1Y3QgTGlicmFyeSBjb25zdHJ1Y3RzXG4gKlxuICogVGhpcyBpcyBhIHByb3ZpZGVyIGZvciBgQ3VzdG9tUmVzb3VyY2VgIGNvbnN0cnVjdHMsIGJhY2tlZCBieSBhbiBBV1MgTGFtYmRhXG4gKiBGdW5jdGlvbi4gSXQgb25seSBzdXBwb3J0cyBOb2RlSlMgcnVudGltZXMuXG4gKlxuICogPiAqKkFwcGxpY2F0aW9uIGJ1aWxkZXJzIGRvIG5vdCBuZWVkIHRvIHVzZSB0aGlzIHByb3ZpZGVyIHR5cGUqKi4gVGhpcyBpcyBub3RcbiAqID4gYSBnZW5lcmljIGN1c3RvbSByZXNvdXJjZSBwcm92aWRlciBjbGFzcy4gSXQgaXMgc3BlY2lmaWNhbGx5XG4gKiA+IGludGVuZGVkIHRvIGJlIHVzZWQgb25seSBieSBjb25zdHJ1Y3RzIGluIHRoZSBBV1MgQ0RLIENvbnN0cnVjdCBMaWJyYXJ5LCBhbmRcbiAqID4gb25seSBleGlzdHMgaGVyZSBiZWNhdXNlIG9mIHJldmVyc2UgZGVwZW5kZW5jeSBpc3N1ZXMgKGZvciBleGFtcGxlLCBpdCBjYW5ub3RcbiAqID4gdXNlIGBpYW0uUG9saWN5U3RhdGVtZW50YCBvYmplY3RzLCBzaW5jZSB0aGUgYGlhbWAgbGlicmFyeSBhbHJlYWR5IGRlcGVuZHMgb25cbiAqID4gdGhlIENESyBgY29yZWAgbGlicmFyeSBhbmQgd2UgY2Fubm90IGhhdmUgY3ljbGljIGRlcGVuZGVuY2llcykuXG4gKlxuICogSWYgeW91IGFyZSBub3Qgd3JpdGluZyBjb25zdHJ1Y3RzIGZvciB0aGUgQVdTIENvbnN0cnVjdCBMaWJyYXJ5LCB5b3Ugc2hvdWxkXG4gKiB1c2UgdGhlIGBQcm92aWRlcmAgY2xhc3MgaW4gdGhlIGBjdXN0b20tcmVzb3VyY2VzYCBtb2R1bGUgaW5zdGVhZCwgd2hpY2ggaGFzXG4gKiBhIGJldHRlciBBUEkgYW5kIHN1cHBvcnRzIGFsbCBMYW1iZGEgcnVudGltZXMsIG5vdCBqdXN0IE5vZGUuXG4gKlxuICogTi5CLjogV2hlbiB5b3UgYXJlIHdyaXRpbmcgQ3VzdG9tIFJlc291cmNlIFByb3ZpZGVycywgdGhlcmUgYXJlIGEgbnVtYmVyIG9mXG4gKiBsaWZlY3ljbGUgZXZlbnRzIHlvdSBoYXZlIHRvIHBheSBhdHRlbnRpb24gdG8uIFRoZXNlIGFyZSBkb2N1bWVudGVkIGluIHRoZVxuICogUkVBRE1FIG9mIHRoZSBgY3VzdG9tLXJlc291cmNlc2AgbW9kdWxlLiBCZSBzdXJlIHRvIGdpdmUgdGhlIGRvY3VtZW50YXRpb25cbiAqIGluIHRoYXQgbW9kdWxlIGEgcmVhZCwgcmVnYXJkbGVzcyBvZiB3aGV0aGVyIHlvdSBlbmQgdXAgdXNpbmcgdGhlIFByb3ZpZGVyXG4gKiBjbGFzcyBpbiB0aGVyZSBvciB0aGlzIG9uZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEN1c3RvbVJlc291cmNlUHJvdmlkZXIgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAvKipcbiAgICogUmV0dXJucyBhIHN0YWNrLWxldmVsIHNpbmdsZXRvbiBBUk4gKHNlcnZpY2UgdG9rZW4pIGZvciB0aGUgY3VzdG9tIHJlc291cmNlXG4gICAqIHByb3ZpZGVyLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgQ29uc3RydWN0IHNjb3BlXG4gICAqIEBwYXJhbSB1bmlxdWVpZCBBIGdsb2JhbGx5IHVuaXF1ZSBpZCB0aGF0IHdpbGwgYmUgdXNlZCBmb3IgdGhlIHN0YWNrLWxldmVsXG4gICAqIGNvbnN0cnVjdC5cbiAgICogQHBhcmFtIHByb3BzIFByb3ZpZGVyIHByb3BlcnRpZXMgd2hpY2ggd2lsbCBvbmx5IGJlIGFwcGxpZWQgd2hlbiB0aGVcbiAgICogcHJvdmlkZXIgaXMgZmlyc3QgY3JlYXRlZC5cbiAgICogQHJldHVybnMgdGhlIHNlcnZpY2UgdG9rZW4gb2YgdGhlIGN1c3RvbSByZXNvdXJjZSBwcm92aWRlciwgd2hpY2ggc2hvdWxkIGJlXG4gICAqIHVzZWQgd2hlbiBkZWZpbmluZyBhIGBDdXN0b21SZXNvdXJjZWAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldE9yQ3JlYXRlKHNjb3BlOiBDb25zdHJ1Y3QsIHVuaXF1ZWlkOiBzdHJpbmcsIHByb3BzOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUHJvcHMpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRPckNyZWF0ZVByb3ZpZGVyKHNjb3BlLCB1bmlxdWVpZCwgcHJvcHMpLnNlcnZpY2VUb2tlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3RhY2stbGV2ZWwgc2luZ2xldG9uIGZvciB0aGUgY3VzdG9tIHJlc291cmNlIHByb3ZpZGVyLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgQ29uc3RydWN0IHNjb3BlXG4gICAqIEBwYXJhbSB1bmlxdWVpZCBBIGdsb2JhbGx5IHVuaXF1ZSBpZCB0aGF0IHdpbGwgYmUgdXNlZCBmb3IgdGhlIHN0YWNrLWxldmVsXG4gICAqIGNvbnN0cnVjdC5cbiAgICogQHBhcmFtIHByb3BzIFByb3ZpZGVyIHByb3BlcnRpZXMgd2hpY2ggd2lsbCBvbmx5IGJlIGFwcGxpZWQgd2hlbiB0aGVcbiAgICogcHJvdmlkZXIgaXMgZmlyc3QgY3JlYXRlZC5cbiAgICogQHJldHVybnMgdGhlIHNlcnZpY2UgdG9rZW4gb2YgdGhlIGN1c3RvbSByZXNvdXJjZSBwcm92aWRlciwgd2hpY2ggc2hvdWxkIGJlXG4gICAqIHVzZWQgd2hlbiBkZWZpbmluZyBhIGBDdXN0b21SZXNvdXJjZWAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldE9yQ3JlYXRlUHJvdmlkZXIoc2NvcGU6IENvbnN0cnVjdCwgdW5pcXVlaWQ6IHN0cmluZywgcHJvcHM6IEN1c3RvbVJlc291cmNlUHJvdmlkZXJQcm9wcykge1xuICAgIGNvbnN0IGlkID0gYCR7dW5pcXVlaWR9Q3VzdG9tUmVzb3VyY2VQcm92aWRlcmA7XG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZihzY29wZSk7XG4gICAgY29uc3QgcHJvdmlkZXIgPSBzdGFjay5ub2RlLnRyeUZpbmRDaGlsZChpZCkgYXMgQ3VzdG9tUmVzb3VyY2VQcm92aWRlclxuICAgICAgPz8gbmV3IEN1c3RvbVJlc291cmNlUHJvdmlkZXIoc3RhY2ssIGlkLCBwcm9wcyk7XG5cbiAgICByZXR1cm4gcHJvdmlkZXI7XG4gIH1cblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgcHJvdmlkZXIncyBBV1MgTGFtYmRhIGZ1bmN0aW9uIHdoaWNoIHNob3VsZCBiZSB1c2VkIGFzIHRoZVxuICAgKiBgc2VydmljZVRva2VuYCB3aGVuIGRlZmluaW5nIGEgY3VzdG9tIHJlc291cmNlLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBkZWNsYXJlIGNvbnN0IG15UHJvdmlkZXI6IEN1c3RvbVJlc291cmNlUHJvdmlkZXI7XG4gICAqXG4gICAqIG5ldyBDdXN0b21SZXNvdXJjZSh0aGlzLCAnTXlDdXN0b21SZXNvdXJjZScsIHtcbiAgICogICBzZXJ2aWNlVG9rZW46IG15UHJvdmlkZXIuc2VydmljZVRva2VuLFxuICAgKiAgIHByb3BlcnRpZXM6IHtcbiAgICogICAgIG15UHJvcGVydHlPbmU6ICdvbmUnLFxuICAgKiAgICAgbXlQcm9wZXJ0eVR3bzogJ3R3bycsXG4gICAqICAgfSxcbiAgICogfSk7XG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc2VydmljZVRva2VuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIHByb3ZpZGVyJ3MgQVdTIExhbWJkYSBmdW5jdGlvbiByb2xlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHJvbGVBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGhhc2ggb2YgdGhlIGxhbWJkYSBjb2RlIGJhY2tpbmcgdGhpcyBwcm92aWRlci4gQ2FuIGJlIHVzZWQgdG8gdHJpZ2dlciB1cGRhdGVzXG4gICAqIG9uIGNvZGUgY2hhbmdlcywgZXZlbiB3aGVuIHRoZSBwcm9wZXJ0aWVzIG9mIGEgY3VzdG9tIHJlc291cmNlIHJlbWFpbiB1bmNoYW5nZWQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY29kZUhhc2g6IHN0cmluZztcblxuICBwcml2YXRlIHBvbGljeVN0YXRlbWVudHM/OiBhbnlbXTtcbiAgcHJpdmF0ZSBfcm9sZT86IENmblJlc291cmNlO1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ3VzdG9tUmVzb3VyY2VQcm92aWRlclByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuXG4gICAgLy8gdmVyaWZ5IHdlIGhhdmUgYW4gaW5kZXggZmlsZSB0aGVyZVxuICAgIGlmICghZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocHJvcHMuY29kZURpcmVjdG9yeSwgJ2luZGV4LmpzJykpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGNhbm5vdCBmaW5kICR7cHJvcHMuY29kZURpcmVjdG9yeX0vaW5kZXguanNgKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGFnaW5nRGlyZWN0b3J5ID0gRmlsZVN5c3RlbS5ta2R0ZW1wKCdjZGstY3VzdG9tLXJlc291cmNlJyk7XG4gICAgZnNlLmNvcHlTeW5jKHByb3BzLmNvZGVEaXJlY3RvcnksIHN0YWdpbmdEaXJlY3RvcnksIHsgZmlsdGVyOiAoc3JjLCBfZGVzdCkgPT4gIXNyYy5lbmRzV2l0aCgnLnRzJykgfSk7XG4gICAgZnMuY29weUZpbGVTeW5jKEVOVFJZUE9JTlRfTk9ERUpTX1NPVVJDRSwgcGF0aC5qb2luKHN0YWdpbmdEaXJlY3RvcnksIGAke0VOVFJZUE9JTlRfRklMRU5BTUV9LmpzYCkpO1xuXG4gICAgY29uc3Qgc3RhZ2luZyA9IG5ldyBBc3NldFN0YWdpbmcodGhpcywgJ1N0YWdpbmcnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBzdGFnaW5nRGlyZWN0b3J5LFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXNzZXRGaWxlTmFtZSA9IHN0YWdpbmcucmVsYXRpdmVTdGFnZWRQYXRoKHN0YWNrKTtcblxuICAgIGNvbnN0IGFzc2V0ID0gc3RhY2suc3ludGhlc2l6ZXIuYWRkRmlsZUFzc2V0KHtcbiAgICAgIGZpbGVOYW1lOiBhc3NldEZpbGVOYW1lLFxuICAgICAgc291cmNlSGFzaDogc3RhZ2luZy5hc3NldEhhc2gsXG4gICAgICBwYWNrYWdpbmc6IEZpbGVBc3NldFBhY2thZ2luZy5aSVBfRElSRUNUT1JZLFxuICAgIH0pO1xuXG4gICAgaWYgKHByb3BzLnBvbGljeVN0YXRlbWVudHMpIHtcbiAgICAgIGZvciAoY29uc3Qgc3RhdGVtZW50IG9mIHByb3BzLnBvbGljeVN0YXRlbWVudHMpIHtcbiAgICAgICAgdGhpcy5hZGRUb1JvbGVQb2xpY3koc3RhdGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjb25maWcgPSBnZXRQcmVjcmVhdGVkUm9sZUNvbmZpZyh0aGlzLCBgJHt0aGlzLm5vZGUucGF0aH0vUm9sZWApO1xuICAgIGNvbnN0IGFzc3VtZVJvbGVQb2xpY3lEb2MgPSBbeyBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsIEVmZmVjdDogJ0FsbG93JywgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICdsYW1iZGEuYW1hem9uYXdzLmNvbScgfSB9XTtcbiAgICBjb25zdCBtYW5hZ2VkUG9saWN5QXJuID0gJ2Fybjoke0FXUzo6UGFydGl0aW9ufTppYW06OmF3czpwb2xpY3kvc2VydmljZS1yb2xlL0FXU0xhbWJkYUJhc2ljRXhlY3V0aW9uUm9sZSc7XG5cbiAgICAvLyBuZWVkIHRvIGluaXRpYWxpemUgdGhpcyBhdHRyaWJ1dGUsIGJ1dCB0aGVyZSBzaG91bGQgbmV2ZXIgYmUgYW4gaW5zdGFuY2VcbiAgICAvLyB3aGVyZSBjb25maWcuZW5hYmxlZD10cnVlICYmIGNvbmZpZy5wcmV2ZW50U3ludGhlc2lzPXRydWVcbiAgICB0aGlzLnJvbGVBcm4gPSAnJztcbiAgICBpZiAoY29uZmlnLmVuYWJsZWQpIHtcbiAgICAgIC8vIGdpdmVzIHBvbGljeVN0YXRlbWVudHMgYSBjaGFuY2UgdG8gcmVzb2x2ZVxuICAgICAgdGhpcy5ub2RlLmFkZFZhbGlkYXRpb24oe1xuICAgICAgICB2YWxpZGF0ZTogKCkgPT4ge1xuICAgICAgICAgIFBvbGljeVN5bnRoZXNpemVyLmdldE9yQ3JlYXRlKHRoaXMpLmFkZFJvbGUoYCR7dGhpcy5ub2RlLnBhdGh9L1JvbGVgLCB7XG4gICAgICAgICAgICBtaXNzaW5nOiAhY29uZmlnLnByZWNyZWF0ZWRSb2xlTmFtZSxcbiAgICAgICAgICAgIHJvbGVOYW1lOiBjb25maWcucHJlY3JlYXRlZFJvbGVOYW1lID8/IGlkKydSb2xlJyxcbiAgICAgICAgICAgIG1hbmFnZWRQb2xpY2llczogW3sgbWFuYWdlZFBvbGljeUFybjogbWFuYWdlZFBvbGljeUFybiB9XSxcbiAgICAgICAgICAgIHBvbGljeVN0YXRlbWVudHM6IHRoaXMucG9saWN5U3RhdGVtZW50cyA/PyBbXSxcbiAgICAgICAgICAgIGFzc3VtZVJvbGVQb2xpY3k6IGFzc3VtZVJvbGVQb2xpY3lEb2MgYXMgYW55LFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5yb2xlQXJuID0gU3RhY2sub2YodGhpcykuZm9ybWF0QXJuKHtcbiAgICAgICAgcmVnaW9uOiAnJyxcbiAgICAgICAgc2VydmljZTogJ2lhbScsXG4gICAgICAgIHJlc291cmNlOiAncm9sZScsXG4gICAgICAgIHJlc291cmNlTmFtZTogY29uZmlnLnByZWNyZWF0ZWRSb2xlTmFtZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoIWNvbmZpZy5wcmV2ZW50U3ludGhlc2lzKSB7XG4gICAgICB0aGlzLl9yb2xlID0gbmV3IENmblJlc291cmNlKHRoaXMsICdSb2xlJywge1xuICAgICAgICB0eXBlOiAnQVdTOjpJQU06OlJvbGUnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICBTdGF0ZW1lbnQ6IGFzc3VtZVJvbGVQb2xpY3lEb2MsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBNYW5hZ2VkUG9saWN5QXJuczogW1xuICAgICAgICAgICAgeyAnRm46OlN1Yic6IG1hbmFnZWRQb2xpY3lBcm4gfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFBvbGljaWVzOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+IHRoaXMucmVuZGVyUG9saWNpZXMoKSB9KSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5yb2xlQXJuID0gVG9rZW4uYXNTdHJpbmcodGhpcy5fcm9sZS5nZXRBdHQoJ0FybicpKTtcbiAgICB9XG5cblxuICAgIGNvbnN0IHRpbWVvdXQgPSBwcm9wcy50aW1lb3V0ID8/IER1cmF0aW9uLm1pbnV0ZXMoMTUpO1xuICAgIGNvbnN0IG1lbW9yeSA9IHByb3BzLm1lbW9yeVNpemUgPz8gU2l6ZS5tZWJpYnl0ZXMoMTI4KTtcblxuICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgQ2ZuUmVzb3VyY2UodGhpcywgJ0hhbmRsZXInLCB7XG4gICAgICB0eXBlOiAnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgQ29kZToge1xuICAgICAgICAgIFMzQnVja2V0OiBhc3NldC5idWNrZXROYW1lLFxuICAgICAgICAgIFMzS2V5OiBhc3NldC5vYmplY3RLZXksXG4gICAgICAgIH0sXG4gICAgICAgIFRpbWVvdXQ6IHRpbWVvdXQudG9TZWNvbmRzKCksXG4gICAgICAgIE1lbW9yeVNpemU6IG1lbW9yeS50b01lYmlieXRlcygpLFxuICAgICAgICBIYW5kbGVyOiBgJHtFTlRSWVBPSU5UX0ZJTEVOQU1FfS5oYW5kbGVyYCxcbiAgICAgICAgUm9sZTogdGhpcy5yb2xlQXJuLFxuICAgICAgICBSdW50aW1lOiBjdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZVRvU3RyaW5nKHByb3BzLnJ1bnRpbWUpLFxuICAgICAgICBFbnZpcm9ubWVudDogdGhpcy5yZW5kZXJFbnZpcm9ubWVudFZhcmlhYmxlcyhwcm9wcy5lbnZpcm9ubWVudCksXG4gICAgICAgIERlc2NyaXB0aW9uOiBwcm9wcy5kZXNjcmlwdGlvbiA/PyB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX3JvbGUpIHtcbiAgICAgIGhhbmRsZXIuYWRkRGVwZW5kZW5jeSh0aGlzLl9yb2xlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5ub2RlLnRyeUdldENvbnRleHQoY3hhcGkuQVNTRVRfUkVTT1VSQ0VfTUVUQURBVEFfRU5BQkxFRF9DT05URVhUKSkge1xuICAgICAgaGFuZGxlci5hZGRNZXRhZGF0YShjeGFwaS5BU1NFVF9SRVNPVVJDRV9NRVRBREFUQV9QQVRIX0tFWSwgYXNzZXRGaWxlTmFtZSk7XG4gICAgICBoYW5kbGVyLmFkZE1ldGFkYXRhKGN4YXBpLkFTU0VUX1JFU09VUkNFX01FVEFEQVRBX1BST1BFUlRZX0tFWSwgJ0NvZGUnKTtcbiAgICB9XG5cbiAgICB0aGlzLnNlcnZpY2VUb2tlbiA9IFRva2VuLmFzU3RyaW5nKGhhbmRsZXIuZ2V0QXR0KCdBcm4nKSk7XG4gICAgdGhpcy5jb2RlSGFzaCA9IHN0YWdpbmcuYXNzZXRIYXNoO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBJQU0gcG9saWN5IHN0YXRlbWVudCB0byB0aGUgaW5saW5lIHBvbGljeSBvZiB0aGVcbiAgICogcHJvdmlkZXIncyBsYW1iZGEgZnVuY3Rpb24ncyByb2xlLlxuICAgKlxuICAgKiAqKlBsZWFzZSBub3RlKio6IHRoaXMgaXMgYSBkaXJlY3QgSUFNIEpTT04gcG9saWN5IGJsb2IsICpub3QqIGEgYGlhbS5Qb2xpY3lTdGF0ZW1lbnRgXG4gICAqIG9iamVjdCBsaWtlIHlvdSB3aWxsIHNlZSBpbiB0aGUgcmVzdCBvZiB0aGUgQ0RLLlxuICAgKlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBkZWNsYXJlIGNvbnN0IG15UHJvdmlkZXI6IEN1c3RvbVJlc291cmNlUHJvdmlkZXI7XG4gICAqXG4gICAqIG15UHJvdmlkZXIuYWRkVG9Sb2xlUG9saWN5KHtcbiAgICogICBFZmZlY3Q6ICdBbGxvdycsXG4gICAqICAgQWN0aW9uOiAnczM6R2V0T2JqZWN0JyxcbiAgICogICBSZXNvdXJjZTogJyonLFxuICAgKiB9KTtcbiAgICovXG4gIHB1YmxpYyBhZGRUb1JvbGVQb2xpY3koc3RhdGVtZW50OiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMucG9saWN5U3RhdGVtZW50cykge1xuICAgICAgdGhpcy5wb2xpY3lTdGF0ZW1lbnRzID0gW107XG4gICAgfVxuICAgIHRoaXMucG9saWN5U3RhdGVtZW50cy5wdXNoKHN0YXRlbWVudCk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlclBvbGljaWVzKCkge1xuICAgIGlmICghdGhpcy5wb2xpY3lTdGF0ZW1lbnRzKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IHBvbGljaWVzID0gW3tcbiAgICAgIFBvbGljeU5hbWU6ICdJbmxpbmUnLFxuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICBTdGF0ZW1lbnQ6IHRoaXMucG9saWN5U3RhdGVtZW50cyxcbiAgICAgIH0sXG4gICAgfV07XG5cbiAgICByZXR1cm4gcG9saWNpZXM7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlckVudmlyb25tZW50VmFyaWFibGVzKGVudj86IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0pIHtcbiAgICBpZiAoIWVudiB8fCBPYmplY3Qua2V5cyhlbnYpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBlbnYgPSB7IC4uLmVudiB9OyAvLyBDb3B5XG5cbiAgICAvLyBBbHdheXMgdXNlIHJlZ2lvbmFsIGVuZHBvaW50c1xuICAgIGVudi5BV1NfU1RTX1JFR0lPTkFMX0VORFBPSU5UUyA9ICdyZWdpb25hbCc7XG5cbiAgICAvLyBTb3J0IGVudmlyb25tZW50IHNvIHRoZSBoYXNoIG9mIHRoZSBmdW5jdGlvbiB1c2VkIHRvIGNyZWF0ZVxuICAgIC8vIGBjdXJyZW50VmVyc2lvbmAgaXMgbm90IGFmZmVjdGVkIGJ5IGtleSBvcmRlciAodGhpcyBpcyBob3cgbGFtYmRhIGRvZXNcbiAgICAvLyBpdClcbiAgICBjb25zdCB2YXJpYWJsZXM6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoZW52KS5zb3J0KCk7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSB7XG4gICAgICB2YXJpYWJsZXNba2V5XSA9IGVudltrZXldO1xuICAgIH1cblxuICAgIHJldHVybiB7IFZhcmlhYmxlczogdmFyaWFibGVzIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gY3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWVUb1N0cmluZyh4OiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZSk6IHN0cmluZyB7XG4gIHN3aXRjaCAoeCkge1xuICAgIGNhc2UgQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUuTk9ERUpTXzEyOlxuICAgIGNhc2UgQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUuTk9ERUpTXzEyX1g6XG4gICAgICByZXR1cm4gJ25vZGVqczEyLngnO1xuICAgIGNhc2UgQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUuTk9ERUpTXzE0X1g6XG4gICAgICByZXR1cm4gJ25vZGVqczE0LngnO1xuICAgIGNhc2UgQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJ1bnRpbWUuTk9ERUpTXzE2X1g6XG4gICAgICByZXR1cm4gJ25vZGVqczE2LngnO1xuICB9XG59XG4iXX0=