"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsCustomResource = exports.AwsCustomResourcePolicy = exports.PhysicalResourceId = exports.PhysicalResourceIdReference = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const path = require("path");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const constructs_1 = require("constructs");
const runtime_1 = require("./runtime");
/**
 * Reference to the physical resource id that can be passed to the AWS operation as a parameter.
 */
class PhysicalResourceIdReference {
    constructor() {
        this.creationStack = cdk.captureStackTrace();
    }
    /**
     * toJSON serialization to replace `PhysicalResourceIdReference` with a magic string.
     */
    toJSON() {
        return runtime_1.PHYSICAL_RESOURCE_ID_REFERENCE;
    }
    resolve(_) {
        return runtime_1.PHYSICAL_RESOURCE_ID_REFERENCE;
    }
    toString() {
        return runtime_1.PHYSICAL_RESOURCE_ID_REFERENCE;
    }
}
exports.PhysicalResourceIdReference = PhysicalResourceIdReference;
_a = JSII_RTTI_SYMBOL_1;
PhysicalResourceIdReference[_a] = { fqn: "@aws-cdk/custom-resources.PhysicalResourceIdReference", version: "0.0.0" };
/**
 * Physical ID of the custom resource.
 */
class PhysicalResourceId {
    /**
     * @param responsePath Path to a response data element to be used as the physical id.
     * @param id Literal string to be used as the physical id.
     */
    constructor(responsePath, id) {
        this.responsePath = responsePath;
        this.id = id;
    }
    /**
     * Extract the physical resource id from the path (dot notation) to the data in the API call response.
     */
    static fromResponse(responsePath) {
        return new PhysicalResourceId(responsePath, undefined);
    }
    /**
     * Explicit physical resource id.
     */
    static of(id) {
        return new PhysicalResourceId(undefined, id);
    }
}
exports.PhysicalResourceId = PhysicalResourceId;
_b = JSII_RTTI_SYMBOL_1;
PhysicalResourceId[_b] = { fqn: "@aws-cdk/custom-resources.PhysicalResourceId", version: "0.0.0" };
/**
 * The IAM Policy that will be applied to the different calls.
 */
class AwsCustomResourcePolicy {
    /**
     * @param statements statements for explicit policy.
     * @param resources resources for auto-generated from SDK calls.
     */
    constructor(statements, resources) {
        this.statements = statements;
        this.resources = resources;
    }
    /**
     * Explicit IAM Policy Statements.
     *
     * @param statements the statements to propagate to the SDK calls.
     */
    static fromStatements(statements) {
        return new AwsCustomResourcePolicy(statements, undefined);
    }
    /**
     * Generate IAM Policy Statements from the configured SDK calls.
     *
     * Each SDK call with be translated to an IAM Policy Statement in the form of: `call.service:call.action` (e.g `s3:PutObject`).
     *
     * This policy generator assumes the IAM policy name has the same name as the API
     * call. This is true in 99% of cases, but there are exceptions (for example,
     * S3's `PutBucketLifecycleConfiguration` requires
     * `s3:PutLifecycleConfiguration` permissions, Lambda's `Invoke` requires
     * `lambda:InvokeFunction` permissions). Use `fromStatements` if you want to
     * do a call that requires different IAM action names.
     *
     * @param options options for the policy generation
     */
    static fromSdkCalls(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_custom_resources_SdkCallsPolicyOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromSdkCalls);
            }
            throw error;
        }
        return new AwsCustomResourcePolicy([], options.resources);
    }
}
exports.AwsCustomResourcePolicy = AwsCustomResourcePolicy;
_c = JSII_RTTI_SYMBOL_1;
AwsCustomResourcePolicy[_c] = { fqn: "@aws-cdk/custom-resources.AwsCustomResourcePolicy", version: "0.0.0" };
/**
 * Use this constant to configure access to any resource.
 */
AwsCustomResourcePolicy.ANY_RESOURCE = ['*'];
/**
 * Defines a custom resource that is materialized using specific AWS API calls. These calls are created using
 * a singleton Lambda function.
 *
 * Use this to bridge any gap that might exist in the CloudFormation Coverage.
 * You can specify exactly which calls are invoked for the 'CREATE', 'UPDATE' and 'DELETE' life cycle events.
 *
 */
class AwsCustomResource extends constructs_1.Construct {
    // 'props' cannot be optional, even though all its properties are optional.
    // this is because at least one sdk call must be provided.
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_custom_resources_AwsCustomResourceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AwsCustomResource);
            }
            throw error;
        }
        if (!props.onCreate && !props.onUpdate && !props.onDelete) {
            throw new Error('At least `onCreate`, `onUpdate` or `onDelete` must be specified.');
        }
        if (!props.role && !props.policy) {
            throw new Error('At least one of `policy` or `role` (or both) must be specified.');
        }
        if (props.onCreate && !props.onCreate.physicalResourceId) {
            throw new Error("'physicalResourceId' must be specified for 'onCreate' call.");
        }
        if (!props.onCreate && props.onUpdate && !props.onUpdate.physicalResourceId) {
            throw new Error("'physicalResourceId' must be specified for 'onUpdate' call when 'onCreate' is omitted.");
        }
        for (const call of [props.onCreate, props.onUpdate, props.onDelete]) {
            if (call?.physicalResourceId?.responsePath) {
                AwsCustomResource.breakIgnoreErrorsCircuit([call], 'PhysicalResourceId.fromResponse');
            }
        }
        if (includesPhysicalResourceIdRef(props.onCreate?.parameters)) {
            throw new Error('`PhysicalResourceIdReference` must not be specified in `onCreate` parameters.');
        }
        this.props = props;
        const provider = new lambda.SingletonFunction(this, 'Provider', {
            code: lambda.Code.fromAsset(path.join(__dirname, 'runtime'), {
                exclude: ['*.ts'],
            }),
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            uuid: AwsCustomResource.PROVIDER_FUNCTION_UUID,
            lambdaPurpose: 'AWS',
            timeout: props.timeout || cdk.Duration.minutes(2),
            role: props.role,
            logRetention: props.logRetention,
            functionName: props.functionName,
            vpc: props.vpc,
            vpcSubnets: props.vpcSubnets,
        });
        this.grantPrincipal = provider.grantPrincipal;
        const installLatestAwsSdk = (props.installLatestAwsSdk
            ?? this.node.tryGetContext(cxapi.AWS_CUSTOM_RESOURCE_LATEST_SDK_DEFAULT)
            ?? true);
        if (installLatestAwsSdk && props.installLatestAwsSdk === undefined) {
            // This is dangerous. Add a warning.
            core_1.Annotations.of(this).addWarning([
                'installLatestAwsSdk was not specified, and defaults to true. You probably do not want this.',
                `Set the global context flag \'${cxapi.AWS_CUSTOM_RESOURCE_LATEST_SDK_DEFAULT}\' to false to switch this behavior off project-wide,`,
                'or set the property explicitly to true if you know you need to call APIs that are not in Lambda\'s built-in SDK version.',
            ].join(' '));
        }
        const create = props.onCreate || props.onUpdate;
        this.customResource = new cdk.CustomResource(this, 'Resource', {
            resourceType: props.resourceType || 'Custom::AWS',
            serviceToken: provider.functionArn,
            pascalCaseProperties: true,
            properties: {
                create: create && this.encodeJson(create),
                update: props.onUpdate && this.encodeJson(props.onUpdate),
                delete: props.onDelete && this.encodeJson(props.onDelete),
                installLatestAwsSdk,
            },
        });
        // Create the policy statements for the custom resource function role, or use the user-provided ones
        if (props.policy) {
            const statements = [];
            if (props.policy.statements.length !== 0) {
                // Use custom statements provided by the user
                for (const statement of props.policy.statements) {
                    statements.push(statement);
                }
            }
            else {
                // Derive statements from AWS SDK calls
                for (const call of [props.onCreate, props.onUpdate, props.onDelete]) {
                    if (call && call.assumedRoleArn == null) {
                        const statement = new iam.PolicyStatement({
                            actions: [awsSdkToIamAction(call.service, call.action)],
                            resources: props.policy.resources,
                        });
                        statements.push(statement);
                    }
                    else if (call && call.assumedRoleArn != null) {
                        const statement = new iam.PolicyStatement({
                            actions: ['sts:AssumeRole'],
                            resources: [call.assumedRoleArn],
                        });
                        statements.push(statement);
                    }
                }
            }
            const policy = new iam.Policy(this, 'CustomResourcePolicy', {
                statements: statements,
            });
            if (provider.role !== undefined) {
                policy.attachToRole(provider.role);
            }
            // If the policy was deleted first, then the function might lose permissions to delete the custom resource
            // This is here so that the policy doesn't get removed before onDelete is called
            this.customResource.node.addDependency(policy);
        }
    }
    static breakIgnoreErrorsCircuit(sdkCalls, caller) {
        for (const call of sdkCalls) {
            if (call?.ignoreErrorCodesMatching) {
                throw new Error(`\`${caller}\`` + ' cannot be called along with `ignoreErrorCodesMatching`.');
            }
        }
    }
    /**
     * Returns response data for the AWS SDK call.
     *
     * Example for S3 / listBucket : 'Buckets.0.Name'
     *
     * Use `Token.asXxx` to encode the returned `Reference` as a specific type or
     * use the convenience `getDataString` for string attributes.
     *
     * Note that you cannot use this method if `ignoreErrorCodesMatching`
     * is configured for any of the SDK calls. This is because in such a case,
     * the response data might not exist, and will cause a CloudFormation deploy time error.
     *
     * @param dataPath the path to the data
     */
    getResponseFieldReference(dataPath) {
        AwsCustomResource.breakIgnoreErrorsCircuit([this.props.onCreate, this.props.onUpdate], 'getData');
        return this.customResource.getAtt(dataPath);
    }
    /**
     * Returns response data for the AWS SDK call as string.
     *
     * Example for S3 / listBucket : 'Buckets.0.Name'
     *
     * Note that you cannot use this method if `ignoreErrorCodesMatching`
     * is configured for any of the SDK calls. This is because in such a case,
     * the response data might not exist, and will cause a CloudFormation deploy time error.
     *
     * @param dataPath the path to the data
     */
    getResponseField(dataPath) {
        AwsCustomResource.breakIgnoreErrorsCircuit([this.props.onCreate, this.props.onUpdate], 'getDataString');
        return this.customResource.getAttString(dataPath);
    }
    encodeJson(obj) {
        return cdk.Lazy.uncachedString({ produce: () => cdk.Stack.of(this).toJsonString(obj) });
    }
}
exports.AwsCustomResource = AwsCustomResource;
_d = JSII_RTTI_SYMBOL_1;
AwsCustomResource[_d] = { fqn: "@aws-cdk/custom-resources.AwsCustomResource", version: "0.0.0" };
/**
 * The uuid of the custom resource provider singleton lambda function.
 */
AwsCustomResource.PROVIDER_FUNCTION_UUID = '679f53fa-c002-430c-b0da-5b7982bd2287';
/**
 * Gets awsSdkMetaData from file or from cache
 */
let getAwsSdkMetadata = (() => {
    let _awsSdkMetadata;
    return function () {
        if (_awsSdkMetadata) {
            return _awsSdkMetadata;
        }
        else {
            return _awsSdkMetadata = JSON.parse(fs.readFileSync(path.join(__dirname, 'sdk-api-metadata.json'), 'utf-8'));
        }
    };
})();
/**
 * Returns true if `obj` includes a `PhysicalResourceIdReference` in one of the
 * values.
 * @param obj Any object.
 */
function includesPhysicalResourceIdRef(obj) {
    if (obj === undefined) {
        return false;
    }
    let foundRef = false;
    // we use JSON.stringify as a way to traverse all values in the object.
    JSON.stringify(obj, (_, v) => {
        if (v === runtime_1.PHYSICAL_RESOURCE_ID_REFERENCE) {
            foundRef = true;
        }
        return v;
    });
    return foundRef;
}
/**
 * Transform SDK service/action to IAM action using metadata from aws-sdk module.
 * Example: CloudWatchLogs with putRetentionPolicy => logs:PutRetentionPolicy
 *
 * TODO: is this mapping correct for all services?
 */
function awsSdkToIamAction(service, action) {
    const srv = service.toLowerCase();
    const awsSdkMetadata = getAwsSdkMetadata();
    const iamService = (awsSdkMetadata[srv] && awsSdkMetadata[srv].prefix) || srv;
    const iamAction = action.charAt(0).toUpperCase() + action.slice(1);
    return `${iamService}:${iamAction}`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLWN1c3RvbS1yZXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF3cy1jdXN0b20tcmVzb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUU3Qix3Q0FBd0M7QUFDeEMsOENBQThDO0FBRTlDLHFDQUFxQztBQUNyQyx3Q0FBNEM7QUFDNUMseUNBQXlDO0FBQ3pDLDJDQUF1QztBQUN2Qyx1Q0FBMkQ7QUFFM0Q7O0dBRUc7QUFDSCxNQUFhLDJCQUEyQjtJQUF4QztRQUNrQixrQkFBYSxHQUFhLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0tBZ0JuRTtJQWRDOztPQUVHO0lBQ0ksTUFBTTtRQUNYLE9BQU8sd0NBQThCLENBQUM7S0FDdkM7SUFFTSxPQUFPLENBQUMsQ0FBc0I7UUFDbkMsT0FBTyx3Q0FBOEIsQ0FBQztLQUN2QztJQUVNLFFBQVE7UUFDYixPQUFPLHdDQUE4QixDQUFDO0tBQ3ZDOztBQWhCSCxrRUFpQkM7OztBQUVEOztHQUVHO0FBQ0gsTUFBYSxrQkFBa0I7SUFnQjdCOzs7T0FHRztJQUNILFlBQW9DLFlBQXFCLEVBQWtCLEVBQVc7UUFBbEQsaUJBQVksR0FBWixZQUFZLENBQVM7UUFBa0IsT0FBRSxHQUFGLEVBQUUsQ0FBUztLQUFLO0lBbEIzRjs7T0FFRztJQUNJLE1BQU0sQ0FBQyxZQUFZLENBQUMsWUFBb0I7UUFDN0MsT0FBTyxJQUFJLGtCQUFrQixDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztLQUN4RDtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFVO1FBQ3pCLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDOUM7O0FBZEgsZ0RBcUJDOzs7QUF1SEQ7O0dBRUc7QUFDSCxNQUFhLHVCQUF1QjtJQWtDbEM7OztPQUdHO0lBQ0gsWUFBb0MsVUFBaUMsRUFBa0IsU0FBb0I7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LEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMzQixJQUFJLENBQUMsS0FBSyx3Q0FBOEIsRUFBRTtZQUN4QyxRQUFRLEdBQUcsSUFBSSxDQUFDO1NBQ2pCO1FBRUQsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sUUFBUSxDQUFDO0FBQ2xCLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILFNBQVMsaUJBQWlCLENBQUMsT0FBZSxFQUFFLE1BQWM7SUFDeEQsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ2xDLE1BQU0sY0FBYyxHQUFHLGlCQUFpQixFQUFFLENBQUM7SUFDM0MsTUFBTSxVQUFVLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQztJQUM5RSxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkUsT0FBTyxHQUFHLFVBQVUsSUFBSSxTQUFTLEVBQUUsQ0FBQztBQUN0QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIGxvZ3MgZnJvbSAnQGF3cy1jZGsvYXdzLWxvZ3MnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQW5ub3RhdGlvbnMgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFBIWVNJQ0FMX1JFU09VUkNFX0lEX1JFRkVSRU5DRSB9IGZyb20gJy4vcnVudGltZSc7XG5cbi8qKlxuICogUmVmZXJlbmNlIHRvIHRoZSBwaHlzaWNhbCByZXNvdXJjZSBpZCB0aGF0IGNhbiBiZSBwYXNzZWQgdG8gdGhlIEFXUyBvcGVyYXRpb24gYXMgYSBwYXJhbWV0ZXIuXG4gKi9cbmV4cG9ydCBjbGFzcyBQaHlzaWNhbFJlc291cmNlSWRSZWZlcmVuY2UgaW1wbGVtZW50cyBjZGsuSVJlc29sdmFibGUge1xuICBwdWJsaWMgcmVhZG9ubHkgY3JlYXRpb25TdGFjazogc3RyaW5nW10gPSBjZGsuY2FwdHVyZVN0YWNrVHJhY2UoKTtcblxuICAvKipcbiAgICogdG9KU09OIHNlcmlhbGl6YXRpb24gdG8gcmVwbGFjZSBgUGh5c2ljYWxSZXNvdXJjZUlkUmVmZXJlbmNlYCB3aXRoIGEgbWFnaWMgc3RyaW5nLlxuICAgKi9cbiAgcHVibGljIHRvSlNPTigpIHtcbiAgICByZXR1cm4gUEhZU0lDQUxfUkVTT1VSQ0VfSURfUkVGRVJFTkNFO1xuICB9XG5cbiAgcHVibGljIHJlc29sdmUoXzogY2RrLklSZXNvbHZlQ29udGV4dCk6IGFueSB7XG4gICAgcmV0dXJuIFBIWVNJQ0FMX1JFU09VUkNFX0lEX1JFRkVSRU5DRTtcbiAgfVxuXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiBQSFlTSUNBTF9SRVNPVVJDRV9JRF9SRUZFUkVOQ0U7XG4gIH1cbn1cblxuLyoqXG4gKiBQaHlzaWNhbCBJRCBvZiB0aGUgY3VzdG9tIHJlc291cmNlLlxuICovXG5leHBvcnQgY2xhc3MgUGh5c2ljYWxSZXNvdXJjZUlkIHtcblxuICAvKipcbiAgICogRXh0cmFjdCB0aGUgcGh5c2ljYWwgcmVzb3VyY2UgaWQgZnJvbSB0aGUgcGF0aCAoZG90IG5vdGF0aW9uKSB0byB0aGUgZGF0YSBpbiB0aGUgQVBJIGNhbGwgcmVzcG9uc2UuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21SZXNwb25zZShyZXNwb25zZVBhdGg6IHN0cmluZyk6IFBoeXNpY2FsUmVzb3VyY2VJZCB7XG4gICAgcmV0dXJuIG5ldyBQaHlzaWNhbFJlc291cmNlSWQocmVzcG9uc2VQYXRoLCB1bmRlZmluZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4cGxpY2l0IHBoeXNpY2FsIHJlc291cmNlIGlkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBvZihpZDogc3RyaW5nKTogUGh5c2ljYWxSZXNvdXJjZUlkIHtcbiAgICByZXR1cm4gbmV3IFBoeXNpY2FsUmVzb3VyY2VJZCh1bmRlZmluZWQsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gcmVzcG9uc2VQYXRoIFBhdGggdG8gYSByZXNwb25zZSBkYXRhIGVsZW1lbnQgdG8gYmUgdXNlZCBhcyB0aGUgcGh5c2ljYWwgaWQuXG4gICAqIEBwYXJhbSBpZCBMaXRlcmFsIHN0cmluZyB0byBiZSB1c2VkIGFzIHRoZSBwaHlzaWNhbCBpZC5cbiAgICovXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHJlc3BvbnNlUGF0aD86IHN0cmluZywgcHVibGljIHJlYWRvbmx5IGlkPzogc3RyaW5nKSB7IH1cbn1cblxuLyoqXG4gKiBBbiBBV1MgU0RLIGNhbGwuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXdzU2RrQ2FsbCB7XG4gIC8qKlxuICAgKiBUaGUgc2VydmljZSB0byBjYWxsXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0phdmFTY3JpcHRTREsvbGF0ZXN0L2luZGV4Lmh0bWxcbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2U6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHNlcnZpY2UgYWN0aW9uIHRvIGNhbGxcbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTSmF2YVNjcmlwdFNESy9sYXRlc3QvaW5kZXguaHRtbFxuICAgKi9cbiAgcmVhZG9ubHkgYWN0aW9uOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwYXJhbWV0ZXJzIGZvciB0aGUgc2VydmljZSBhY3Rpb25cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBwYXJhbWV0ZXJzXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0phdmFTY3JpcHRTREsvbGF0ZXN0L2luZGV4Lmh0bWxcbiAgICovXG4gIHJlYWRvbmx5IHBhcmFtZXRlcnM/OiBhbnk7XG5cbiAgLyoqXG4gICAqIFRoZSBwaHlzaWNhbCByZXNvdXJjZSBpZCBvZiB0aGUgY3VzdG9tIHJlc291cmNlIGZvciB0aGlzIGNhbGwuXG4gICAqIE1hbmRhdG9yeSBmb3Igb25DcmVhdGUgY2FsbC5cbiAgICogSW4gb25VcGRhdGUsIHlvdSBjYW4gb21pdCB0aGlzIHRvIHBhc3N0aHJvdWdoIGl0IGZyb20gcmVxdWVzdC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBwaHlzaWNhbCByZXNvdXJjZSBpZFxuICAgKi9cbiAgcmVhZG9ubHkgcGh5c2ljYWxSZXNvdXJjZUlkPzogUGh5c2ljYWxSZXNvdXJjZUlkO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVnZXggcGF0dGVybiB0byB1c2UgdG8gY2F0Y2ggQVBJIGVycm9ycy4gVGhlIGBjb2RlYCBwcm9wZXJ0eSBvZiB0aGVcbiAgICogYEVycm9yYCBvYmplY3Qgd2lsbCBiZSB0ZXN0ZWQgYWdhaW5zdCB0aGlzIHBhdHRlcm4uIElmIHRoZXJlIGlzIGEgbWF0Y2ggYW5cbiAgICogZXJyb3Igd2lsbCBub3QgYmUgdGhyb3duLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGRvIG5vdCBjYXRjaCBlcnJvcnNcbiAgICovXG4gIHJlYWRvbmx5IGlnbm9yZUVycm9yQ29kZXNNYXRjaGluZz86IHN0cmluZztcblxuICAvKipcbiAgICogQVBJIHZlcnNpb24gdG8gdXNlIGZvciB0aGUgc2VydmljZVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zZGstZm9yLWphdmFzY3JpcHQvdjIvZGV2ZWxvcGVyLWd1aWRlL2xvY2tpbmctYXBpLXZlcnNpb25zLmh0bWxcbiAgICogQGRlZmF1bHQgLSB1c2UgbGF0ZXN0IGF2YWlsYWJsZSBBUEkgdmVyc2lvblxuICAgKi9cbiAgcmVhZG9ubHkgYXBpVmVyc2lvbj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHJlZ2lvbiB0byBzZW5kIHNlcnZpY2UgcmVxdWVzdHMgdG8uXG4gICAqICoqTm90ZTogQ3Jvc3MtcmVnaW9uIG9wZXJhdGlvbnMgYXJlIGdlbmVyYWxseSBjb25zaWRlcmVkIGFuIGFudGktcGF0dGVybi4qKlxuICAgKiAqKkNvbnNpZGVyIGZpcnN0IGRlcGxveWluZyBhIHN0YWNrIGluIHRoYXQgcmVnaW9uLioqXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGhlIHJlZ2lvbiB3aGVyZSB0aGlzIGN1c3RvbSByZXNvdXJjZSBpcyBkZXBsb3llZFxuICAgKi9cbiAgcmVhZG9ubHkgcmVnaW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZXN0cmljdCB0aGUgZGF0YSByZXR1cm5lZCBieSB0aGUgY3VzdG9tIHJlc291cmNlIHRvIGEgc3BlY2lmaWMgcGF0aCBpblxuICAgKiB0aGUgQVBJIHJlc3BvbnNlLiBVc2UgdGhpcyB0byBsaW1pdCB0aGUgZGF0YSByZXR1cm5lZCBieSB0aGUgY3VzdG9tXG4gICAqIHJlc291cmNlIGlmIHdvcmtpbmcgd2l0aCBBUEkgY2FsbHMgdGhhdCBjb3VsZCBwb3RlbnRpYWxseSByZXN1bHQgaW4gY3VzdG9tXG4gICAqIHJlc3BvbnNlIG9iamVjdHMgZXhjZWVkaW5nIHRoZSBoYXJkIGxpbWl0IG9mIDQwOTYgYnl0ZXMuXG4gICAqXG4gICAqIEV4YW1wbGUgZm9yIEVDUyAvIHVwZGF0ZVNlcnZpY2U6ICdzZXJ2aWNlLmRlcGxveW1lbnRDb25maWd1cmF0aW9uLm1heGltdW1QZXJjZW50J1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIHJldHVybiBhbGwgZGF0YVxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCB1c2Ugb3V0cHV0UGF0aHMgaW5zdGVhZFxuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0UGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogUmVzdHJpY3QgdGhlIGRhdGEgcmV0dXJuZWQgYnkgdGhlIGN1c3RvbSByZXNvdXJjZSB0byBzcGVjaWZpYyBwYXRocyBpblxuICAgKiB0aGUgQVBJIHJlc3BvbnNlLiBVc2UgdGhpcyB0byBsaW1pdCB0aGUgZGF0YSByZXR1cm5lZCBieSB0aGUgY3VzdG9tXG4gICAqIHJlc291cmNlIGlmIHdvcmtpbmcgd2l0aCBBUEkgY2FsbHMgdGhhdCBjb3VsZCBwb3RlbnRpYWxseSByZXN1bHQgaW4gY3VzdG9tXG4gICAqIHJlc3BvbnNlIG9iamVjdHMgZXhjZWVkaW5nIHRoZSBoYXJkIGxpbWl0IG9mIDQwOTYgYnl0ZXMuXG4gICAqXG4gICAqIEV4YW1wbGUgZm9yIEVDUyAvIHVwZGF0ZVNlcnZpY2U6IFsnc2VydmljZS5kZXBsb3ltZW50Q29uZmlndXJhdGlvbi5tYXhpbXVtUGVyY2VudCddXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gcmV0dXJuIGFsbCBkYXRhXG4gICAqL1xuICByZWFkb25seSBvdXRwdXRQYXRocz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBVc2VkIGZvciBydW5uaW5nIHRoZSBTREsgY2FsbHMgaW4gdW5kZXJseWluZyBsYW1iZGEgd2l0aCBhIGRpZmZlcmVudCByb2xlXG4gICAqIENhbiBiZSB1c2VkIHByaW1hcmlseSBmb3IgY3Jvc3MtYWNjb3VudCByZXF1ZXN0cyB0byBmb3IgZXhhbXBsZSBjb25uZWN0XG4gICAqIGhvc3RlZHpvbmUgd2l0aCBhIHNoYXJlZCB2cGNcbiAgICpcbiAgICogRXhhbXBsZSBmb3IgUm91dGU1MyAvIGFzc29jaWF0ZVZQQ1dpdGhIb3N0ZWRab25lXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gcnVuIHdpdGhvdXQgYXNzdW1pbmcgcm9sZVxuICAgKi9cbiAgcmVhZG9ubHkgYXNzdW1lZFJvbGVBcm4/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgdGhlIGF1dG8tZ2VuZXJhdGlvbiBvZiBwb2xpY2llcyBiYXNlZCBvbiB0aGUgY29uZmlndXJlZCBTREsgY2FsbHMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2RrQ2FsbHNQb2xpY3lPcHRpb25zIHtcblxuICAvKipcbiAgICogVGhlIHJlc291cmNlcyB0aGF0IHRoZSBjYWxscyB3aWxsIGhhdmUgYWNjZXNzIHRvLlxuICAgKlxuICAgKiBJdCBpcyBiZXN0IHRvIHVzZSBzcGVjaWZpYyByZXNvdXJjZSBBUk4ncyB3aGVuIHBvc3NpYmxlLiBIb3dldmVyLCB5b3UgY2FuIGFsc28gdXNlIGBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0VgXG4gICAqIHRvIGFsbG93IGFjY2VzcyB0byBhbGwgcmVzb3VyY2VzLiBGb3IgZXhhbXBsZSwgd2hlbiBgb25DcmVhdGVgIGlzIHVzZWQgdG8gY3JlYXRlIGEgcmVzb3VyY2Ugd2hpY2ggeW91IGRvbid0XG4gICAqIGtub3cgdGhlIHBoeXNpY2FsIG5hbWUgb2YgaW4gYWR2YW5jZS5cbiAgICpcbiAgICogTm90ZSB0aGF0IHdpbGwgYXBwbHkgdG8gQUxMIFNESyBjYWxscy5cbiAgICovXG4gIHJlYWRvbmx5IHJlc291cmNlczogc3RyaW5nW11cblxufVxuXG4vKipcbiAqIFRoZSBJQU0gUG9saWN5IHRoYXQgd2lsbCBiZSBhcHBsaWVkIHRvIHRoZSBkaWZmZXJlbnQgY2FsbHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBBd3NDdXN0b21SZXNvdXJjZVBvbGljeSB7XG5cbiAgLyoqXG4gICAqIFVzZSB0aGlzIGNvbnN0YW50IHRvIGNvbmZpZ3VyZSBhY2Nlc3MgdG8gYW55IHJlc291cmNlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBBTllfUkVTT1VSQ0UgPSBbJyonXTtcblxuICAvKipcbiAgICogRXhwbGljaXQgSUFNIFBvbGljeSBTdGF0ZW1lbnRzLlxuICAgKlxuICAgKiBAcGFyYW0gc3RhdGVtZW50cyB0aGUgc3RhdGVtZW50cyB0byBwcm9wYWdhdGUgdG8gdGhlIFNESyBjYWxscy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVN0YXRlbWVudHMoc3RhdGVtZW50czogaWFtLlBvbGljeVN0YXRlbWVudFtdKSB7XG4gICAgcmV0dXJuIG5ldyBBd3NDdXN0b21SZXNvdXJjZVBvbGljeShzdGF0ZW1lbnRzLCB1bmRlZmluZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIElBTSBQb2xpY3kgU3RhdGVtZW50cyBmcm9tIHRoZSBjb25maWd1cmVkIFNESyBjYWxscy5cbiAgICpcbiAgICogRWFjaCBTREsgY2FsbCB3aXRoIGJlIHRyYW5zbGF0ZWQgdG8gYW4gSUFNIFBvbGljeSBTdGF0ZW1lbnQgaW4gdGhlIGZvcm0gb2Y6IGBjYWxsLnNlcnZpY2U6Y2FsbC5hY3Rpb25gIChlLmcgYHMzOlB1dE9iamVjdGApLlxuICAgKlxuICAgKiBUaGlzIHBvbGljeSBnZW5lcmF0b3IgYXNzdW1lcyB0aGUgSUFNIHBvbGljeSBuYW1lIGhhcyB0aGUgc2FtZSBuYW1lIGFzIHRoZSBBUElcbiAgICogY2FsbC4gVGhpcyBpcyB0cnVlIGluIDk5JSBvZiBjYXNlcywgYnV0IHRoZXJlIGFyZSBleGNlcHRpb25zIChmb3IgZXhhbXBsZSxcbiAgICogUzMncyBgUHV0QnVja2V0TGlmZWN5Y2xlQ29uZmlndXJhdGlvbmAgcmVxdWlyZXNcbiAgICogYHMzOlB1dExpZmVjeWNsZUNvbmZpZ3VyYXRpb25gIHBlcm1pc3Npb25zLCBMYW1iZGEncyBgSW52b2tlYCByZXF1aXJlc1xuICAgKiBgbGFtYmRhOkludm9rZUZ1bmN0aW9uYCBwZXJtaXNzaW9ucykuIFVzZSBgZnJvbVN0YXRlbWVudHNgIGlmIHlvdSB3YW50IHRvXG4gICAqIGRvIGEgY2FsbCB0aGF0IHJlcXVpcmVzIGRpZmZlcmVudCBJQU0gYWN0aW9uIG5hbWVzLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBvcHRpb25zIGZvciB0aGUgcG9saWN5IGdlbmVyYXRpb25cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVNka0NhbGxzKG9wdGlvbnM6IFNka0NhbGxzUG9saWN5T3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3koW10sIG9wdGlvbnMucmVzb3VyY2VzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gc3RhdGVtZW50cyBzdGF0ZW1lbnRzIGZvciBleHBsaWNpdCBwb2xpY3kuXG4gICAqIEBwYXJhbSByZXNvdXJjZXMgcmVzb3VyY2VzIGZvciBhdXRvLWdlbmVyYXRlZCBmcm9tIFNESyBjYWxscy5cbiAgICovXG4gIHByaXZhdGUgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHN0YXRlbWVudHM6IGlhbS5Qb2xpY3lTdGF0ZW1lbnRbXSwgcHVibGljIHJlYWRvbmx5IHJlc291cmNlcz86IHN0cmluZ1tdKSB7fVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIEF3c0N1c3RvbVJlc291cmNlLlxuICpcbiAqIE5vdGUgdGhhdCBhdCBsZWFzdCBvbkNyZWF0ZSwgb25VcGRhdGUgb3Igb25EZWxldGUgbXVzdCBiZSBzcGVjaWZpZWQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXdzQ3VzdG9tUmVzb3VyY2VQcm9wcyB7XG4gIC8qKlxuICAgKiBDbG91ZGZvcm1hdGlvbiBSZXNvdXJjZSB0eXBlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEN1c3RvbTo6QVdTXG4gICAqL1xuICByZWFkb25seSByZXNvdXJjZVR5cGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBV1MgU0RLIGNhbGwgdG8gbWFrZSB3aGVuIHRoZSByZXNvdXJjZSBpcyBjcmVhdGVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSBjYWxsIHdoZW4gdGhlIHJlc291cmNlIGlzIHVwZGF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IG9uQ3JlYXRlPzogQXdzU2RrQ2FsbDtcblxuICAvKipcbiAgICogVGhlIEFXUyBTREsgY2FsbCB0byBtYWtlIHdoZW4gdGhlIHJlc291cmNlIGlzIHVwZGF0ZWRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBjYWxsXG4gICAqL1xuICByZWFkb25seSBvblVwZGF0ZT86IEF3c1Nka0NhbGw7XG5cbiAgLyoqXG4gICAqIFRoZSBBV1MgU0RLIGNhbGwgdG8gbWFrZSB3aGVuIHRoZSByZXNvdXJjZSBpcyBkZWxldGVkXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gY2FsbFxuICAgKi9cbiAgcmVhZG9ubHkgb25EZWxldGU/OiBBd3NTZGtDYWxsO1xuXG4gIC8qKlxuICAgKiBUaGUgcG9saWN5IHRoYXQgd2lsbCBiZSBhZGRlZCB0byB0aGUgZXhlY3V0aW9uIHJvbGUgb2YgdGhlIExhbWJkYVxuICAgKiBmdW5jdGlvbiBpbXBsZW1lbnRpbmcgdGhpcyBjdXN0b20gcmVzb3VyY2UgcHJvdmlkZXIuXG4gICAqXG4gICAqIFRoZSBjdXN0b20gcmVzb3VyY2UgYWxzbyBpbXBsZW1lbnRzIGBpYW0uSUdyYW50YWJsZWAsIG1ha2luZyBpdCBwb3NzaWJsZVxuICAgKiB0byB1c2UgdGhlIGBncmFudFh4eCgpYCBtZXRob2RzLlxuICAgKlxuICAgKiBBcyB0aGlzIGN1c3RvbSByZXNvdXJjZSB1c2VzIGEgc2luZ2xldG9uIExhbWJkYSBmdW5jdGlvbiwgaXQncyBpbXBvcnRhbnRcbiAgICogdG8gbm90ZSB0aGUgdGhhdCBmdW5jdGlvbidzIHJvbGUgd2lsbCBldmVudHVhbGx5IGFjY3VtdWxhdGUgdGhlXG4gICAqIHBlcm1pc3Npb25zL2dyYW50cyBmcm9tIGFsbCByZXNvdXJjZXMuXG4gICAqXG4gICAqIE5vdGUgdGhhdCBhIHBvbGljeSBtdXN0IGJlIHNwZWNpZmllZCBpZiBgcm9sZWAgaXMgbm90IHByb3ZpZGVkLCBhc1xuICAgKiBieSBkZWZhdWx0IGEgbmV3IHJvbGUgaXMgY3JlYXRlZCB3aGljaCByZXF1aXJlcyBwb2xpY3kgY2hhbmdlcyB0byBhY2Nlc3NcbiAgICogcmVzb3VyY2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHBvbGljeSBhZGRlZFxuICAgKlxuICAgKiBAc2VlIFBvbGljeS5mcm9tU3RhdGVtZW50c1xuICAgKiBAc2VlIFBvbGljeS5mcm9tU2RrQ2FsbHNcbiAgICovXG4gIHJlYWRvbmx5IHBvbGljeT86IEF3c0N1c3RvbVJlc291cmNlUG9saWN5O1xuXG4gIC8qKlxuICAgKiBUaGUgZXhlY3V0aW9uIHJvbGUgZm9yIHRoZSBzaW5nbGV0b24gTGFtYmRhIGZ1bmN0aW9uIGltcGxlbWVudGluZyB0aGlzIGN1c3RvbVxuICAgKiByZXNvdXJjZSBwcm92aWRlci4gVGhpcyByb2xlIHdpbGwgYXBwbHkgdG8gYWxsIGBBd3NDdXN0b21SZXNvdXJjZWBcbiAgICogaW5zdGFuY2VzIGluIHRoZSBzdGFjay4gVGhlIHJvbGUgbXVzdCBiZSBhc3N1bWFibGUgYnkgdGhlXG4gICAqIGBsYW1iZGEuYW1hem9uYXdzLmNvbWAgc2VydmljZSBwcmluY2lwYWwuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYSBuZXcgcm9sZSBpcyBjcmVhdGVkXG4gICAqL1xuICByZWFkb25seSByb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBUaGUgdGltZW91dCBmb3IgdGhlIHNpbmdsZXRvbiBMYW1iZGEgZnVuY3Rpb24gaW1wbGVtZW50aW5nIHRoaXMgY3VzdG9tIHJlc291cmNlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5taW51dGVzKDIpXG4gICAqL1xuICByZWFkb25seSB0aW1lb3V0PzogY2RrLkR1cmF0aW9uXG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgZGF5cyBsb2cgZXZlbnRzIG9mIHRoZSBzaW5nbGV0b24gTGFtYmRhIGZ1bmN0aW9uIGltcGxlbWVudGluZ1xuICAgKiB0aGlzIGN1c3RvbSByZXNvdXJjZSBhcmUga2VwdCBpbiBDbG91ZFdhdGNoIExvZ3MuXG4gICAqXG4gICAqIEBkZWZhdWx0IGxvZ3MuUmV0ZW50aW9uRGF5cy5JTkZJTklURVxuICAgKi9cbiAgcmVhZG9ubHkgbG9nUmV0ZW50aW9uPzogbG9ncy5SZXRlbnRpb25EYXlzO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGluc3RhbGwgdGhlIGxhdGVzdCBBV1MgU0RLIHYyLlxuICAgKlxuICAgKiBJZiBub3Qgc3BlY2lmaWVkLCB0aGlzIHVzZXMgd2hhdGV2ZXIgSmF2YVNjcmlwdCBTREsgdmVyc2lvbiBpcyB0aGUgZGVmYXVsdCBpblxuICAgKiBBV1MgTGFtYmRhIGF0IHRoZSB0aW1lIG9mIGV4ZWN1dGlvbi5cbiAgICpcbiAgICogT3RoZXJ3aXNlLCBpbnN0YWxscyB0aGUgbGF0ZXN0IHZlcnNpb24gZnJvbSAnbnBtanMuY29tJy4gVGhlIGluc3RhbGxhdGlvbiB0YWtlc1xuICAgKiBhcm91bmQgNjAgc2Vjb25kcyBhbmQgcmVxdWlyZXMgaW50ZXJuZXQgY29ubmVjdGl2aXR5LlxuICAgKlxuICAgKiBUaGUgZGVmYXVsdCBjYW4gYmUgY29udHJvbGxlZCB1c2luZyB0aGUgY29udGV4dCBrZXlcbiAgICogYEBhd3MtY2RrL2N1c3RvbXJlc291cmNlczppbnN0YWxsTGF0ZXN0QXdzU2RrRGVmYXVsdGAgaXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIHZhbHVlIG9mIGBAYXdzLWNkay9jdXN0b21yZXNvdXJjZXM6aW5zdGFsbExhdGVzdEF3c1Nka0RlZmF1bHRgLCBvdGhlcndpc2UgYHRydWVgXG4gICAqL1xuICByZWFkb25seSBpbnN0YWxsTGF0ZXN0QXdzU2RrPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBuYW1lIGZvciB0aGUgc2luZ2xldG9uIExhbWJkYSBmdW5jdGlvbiBpbXBsZW1lbnRpbmcgdGhpcyBjdXN0b20gcmVzb3VyY2UuXG4gICAqIFRoZSBmdW5jdGlvbiBuYW1lIHdpbGwgcmVtYWluIHRoZSBzYW1lIGFmdGVyIHRoZSBmaXJzdCBBd3NDdXN0b21SZXNvdXJjZSBpcyBjcmVhdGVkIGluIGEgc3RhY2suXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQVdTIENsb3VkRm9ybWF0aW9uIGdlbmVyYXRlcyBhIHVuaXF1ZSBwaHlzaWNhbCBJRCBhbmQgdXNlcyB0aGF0XG4gICAqIElEIGZvciB0aGUgZnVuY3Rpb24ncyBuYW1lLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIE5hbWUgVHlwZS5cbiAgICovXG4gIHJlYWRvbmx5IGZ1bmN0aW9uTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHZwYyB0byBwcm92aXNpb24gdGhlIGxhbWJkYSBmdW5jdGlvbiBpbi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSB0aGUgZnVuY3Rpb24gaXMgbm90IHByb3Zpc2lvbmVkIGluc2lkZSBhIHZwYy5cbiAgICovXG4gIHJlYWRvbmx5IHZwYz86IGVjMi5JVnBjO1xuXG4gIC8qKlxuICAgKiBXaGljaCBzdWJuZXRzIGZyb20gdGhlIFZQQyB0byBwbGFjZSB0aGUgbGFtYmRhIGZ1bmN0aW9uIGluLlxuICAgKlxuICAgKiBPbmx5IHVzZWQgaWYgJ3ZwYycgaXMgc3VwcGxpZWQuIE5vdGU6IGludGVybmV0IGFjY2VzcyBmb3IgTGFtYmRhc1xuICAgKiByZXF1aXJlcyBhIE5BVCBnYXRld2F5LCBzbyBwaWNraW5nIFB1YmxpYyBzdWJuZXRzIGlzIG5vdCBhbGxvd2VkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSBWcGMgZGVmYXVsdCBzdHJhdGVneSBpZiBub3Qgc3BlY2lmaWVkXG4gICAqL1xuICByZWFkb25seSB2cGNTdWJuZXRzPzogZWMyLlN1Ym5ldFNlbGVjdGlvbjtcbn1cblxuLyoqXG4gKiBEZWZpbmVzIGEgY3VzdG9tIHJlc291cmNlIHRoYXQgaXMgbWF0ZXJpYWxpemVkIHVzaW5nIHNwZWNpZmljIEFXUyBBUEkgY2FsbHMuIFRoZXNlIGNhbGxzIGFyZSBjcmVhdGVkIHVzaW5nXG4gKiBhIHNpbmdsZXRvbiBMYW1iZGEgZnVuY3Rpb24uXG4gKlxuICogVXNlIHRoaXMgdG8gYnJpZGdlIGFueSBnYXAgdGhhdCBtaWdodCBleGlzdCBpbiB0aGUgQ2xvdWRGb3JtYXRpb24gQ292ZXJhZ2UuXG4gKiBZb3UgY2FuIHNwZWNpZnkgZXhhY3RseSB3aGljaCBjYWxscyBhcmUgaW52b2tlZCBmb3IgdGhlICdDUkVBVEUnLCAnVVBEQVRFJyBhbmQgJ0RFTEVURScgbGlmZSBjeWNsZSBldmVudHMuXG4gKlxuICovXG5leHBvcnQgY2xhc3MgQXdzQ3VzdG9tUmVzb3VyY2UgZXh0ZW5kcyBDb25zdHJ1Y3QgaW1wbGVtZW50cyBpYW0uSUdyYW50YWJsZSB7XG4gIC8qKlxuICAgKiBUaGUgdXVpZCBvZiB0aGUgY3VzdG9tIHJlc291cmNlIHByb3ZpZGVyIHNpbmdsZXRvbiBsYW1iZGEgZnVuY3Rpb24uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFBST1ZJREVSX0ZVTkNUSU9OX1VVSUQgPSAnNjc5ZjUzZmEtYzAwMi00MzBjLWIwZGEtNWI3OTgyYmQyMjg3JztcblxuICBwcml2YXRlIHN0YXRpYyBicmVha0lnbm9yZUVycm9yc0NpcmN1aXQoc2RrQ2FsbHM6IEFycmF5PEF3c1Nka0NhbGwgfCB1bmRlZmluZWQ+LCBjYWxsZXI6IHN0cmluZykge1xuXG4gICAgZm9yIChjb25zdCBjYWxsIG9mIHNka0NhbGxzKSB7XG4gICAgICBpZiAoY2FsbD8uaWdub3JlRXJyb3JDb2Rlc01hdGNoaW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgXFxgJHtjYWxsZXJ9XFxgYCArICcgY2Fubm90IGJlIGNhbGxlZCBhbG9uZyB3aXRoIGBpZ25vcmVFcnJvckNvZGVzTWF0Y2hpbmdgLicpO1xuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGdyYW50UHJpbmNpcGFsOiBpYW0uSVByaW5jaXBhbDtcblxuICBwcml2YXRlIHJlYWRvbmx5IGN1c3RvbVJlc291cmNlOiBjZGsuQ3VzdG9tUmVzb3VyY2U7XG4gIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IEF3c0N1c3RvbVJlc291cmNlUHJvcHM7XG5cbiAgLy8gJ3Byb3BzJyBjYW5ub3QgYmUgb3B0aW9uYWwsIGV2ZW4gdGhvdWdoIGFsbCBpdHMgcHJvcGVydGllcyBhcmUgb3B0aW9uYWwuXG4gIC8vIHRoaXMgaXMgYmVjYXVzZSBhdCBsZWFzdCBvbmUgc2RrIGNhbGwgbXVzdCBiZSBwcm92aWRlZC5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEF3c0N1c3RvbVJlc291cmNlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgaWYgKCFwcm9wcy5vbkNyZWF0ZSAmJiAhcHJvcHMub25VcGRhdGUgJiYgIXByb3BzLm9uRGVsZXRlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0F0IGxlYXN0IGBvbkNyZWF0ZWAsIGBvblVwZGF0ZWAgb3IgYG9uRGVsZXRlYCBtdXN0IGJlIHNwZWNpZmllZC4nKTtcbiAgICB9XG5cbiAgICBpZiAoIXByb3BzLnJvbGUgJiYgIXByb3BzLnBvbGljeSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdCBsZWFzdCBvbmUgb2YgYHBvbGljeWAgb3IgYHJvbGVgIChvciBib3RoKSBtdXN0IGJlIHNwZWNpZmllZC4nKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMub25DcmVhdGUgJiYgIXByb3BzLm9uQ3JlYXRlLnBoeXNpY2FsUmVzb3VyY2VJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ3BoeXNpY2FsUmVzb3VyY2VJZCcgbXVzdCBiZSBzcGVjaWZpZWQgZm9yICdvbkNyZWF0ZScgY2FsbC5cIik7XG4gICAgfVxuXG4gICAgaWYgKCFwcm9wcy5vbkNyZWF0ZSAmJiBwcm9wcy5vblVwZGF0ZSAmJiAhcHJvcHMub25VcGRhdGUucGh5c2ljYWxSZXNvdXJjZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCIncGh5c2ljYWxSZXNvdXJjZUlkJyBtdXN0IGJlIHNwZWNpZmllZCBmb3IgJ29uVXBkYXRlJyBjYWxsIHdoZW4gJ29uQ3JlYXRlJyBpcyBvbWl0dGVkLlwiKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGNhbGwgb2YgW3Byb3BzLm9uQ3JlYXRlLCBwcm9wcy5vblVwZGF0ZSwgcHJvcHMub25EZWxldGVdKSB7XG4gICAgICBpZiAoY2FsbD8ucGh5c2ljYWxSZXNvdXJjZUlkPy5yZXNwb25zZVBhdGgpIHtcbiAgICAgICAgQXdzQ3VzdG9tUmVzb3VyY2UuYnJlYWtJZ25vcmVFcnJvcnNDaXJjdWl0KFtjYWxsXSwgJ1BoeXNpY2FsUmVzb3VyY2VJZC5mcm9tUmVzcG9uc2UnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaW5jbHVkZXNQaHlzaWNhbFJlc291cmNlSWRSZWYocHJvcHMub25DcmVhdGU/LnBhcmFtZXRlcnMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BQaHlzaWNhbFJlc291cmNlSWRSZWZlcmVuY2VgIG11c3Qgbm90IGJlIHNwZWNpZmllZCBpbiBgb25DcmVhdGVgIHBhcmFtZXRlcnMuJyk7XG4gICAgfVxuXG4gICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuXG4gICAgY29uc3QgcHJvdmlkZXIgPSBuZXcgbGFtYmRhLlNpbmdsZXRvbkZ1bmN0aW9uKHRoaXMsICdQcm92aWRlcicsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAncnVudGltZScpLCB7XG4gICAgICAgIGV4Y2x1ZGU6IFsnKi50cyddLFxuICAgICAgfSksXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIHV1aWQ6IEF3c0N1c3RvbVJlc291cmNlLlBST1ZJREVSX0ZVTkNUSU9OX1VVSUQsXG4gICAgICBsYW1iZGFQdXJwb3NlOiAnQVdTJyxcbiAgICAgIHRpbWVvdXQ6IHByb3BzLnRpbWVvdXQgfHwgY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMiksXG4gICAgICByb2xlOiBwcm9wcy5yb2xlLFxuICAgICAgbG9nUmV0ZW50aW9uOiBwcm9wcy5sb2dSZXRlbnRpb24sXG4gICAgICBmdW5jdGlvbk5hbWU6IHByb3BzLmZ1bmN0aW9uTmFtZSxcbiAgICAgIHZwYzogcHJvcHMudnBjLFxuICAgICAgdnBjU3VibmV0czogcHJvcHMudnBjU3VibmV0cyxcbiAgICB9KTtcbiAgICB0aGlzLmdyYW50UHJpbmNpcGFsID0gcHJvdmlkZXIuZ3JhbnRQcmluY2lwYWw7XG5cbiAgICBjb25zdCBpbnN0YWxsTGF0ZXN0QXdzU2RrID0gKHByb3BzLmluc3RhbGxMYXRlc3RBd3NTZGtcbiAgICAgID8/IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KGN4YXBpLkFXU19DVVNUT01fUkVTT1VSQ0VfTEFURVNUX1NES19ERUZBVUxUKVxuICAgICAgPz8gdHJ1ZSk7XG5cbiAgICBpZiAoaW5zdGFsbExhdGVzdEF3c1NkayAmJiBwcm9wcy5pbnN0YWxsTGF0ZXN0QXdzU2RrID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIFRoaXMgaXMgZGFuZ2Vyb3VzLiBBZGQgYSB3YXJuaW5nLlxuICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkV2FybmluZyhbXG4gICAgICAgICdpbnN0YWxsTGF0ZXN0QXdzU2RrIHdhcyBub3Qgc3BlY2lmaWVkLCBhbmQgZGVmYXVsdHMgdG8gdHJ1ZS4gWW91IHByb2JhYmx5IGRvIG5vdCB3YW50IHRoaXMuJyxcbiAgICAgICAgYFNldCB0aGUgZ2xvYmFsIGNvbnRleHQgZmxhZyBcXCcke2N4YXBpLkFXU19DVVNUT01fUkVTT1VSQ0VfTEFURVNUX1NES19ERUZBVUxUfVxcJyB0byBmYWxzZSB0byBzd2l0Y2ggdGhpcyBiZWhhdmlvciBvZmYgcHJvamVjdC13aWRlLGAsXG4gICAgICAgICdvciBzZXQgdGhlIHByb3BlcnR5IGV4cGxpY2l0bHkgdG8gdHJ1ZSBpZiB5b3Uga25vdyB5b3UgbmVlZCB0byBjYWxsIEFQSXMgdGhhdCBhcmUgbm90IGluIExhbWJkYVxcJ3MgYnVpbHQtaW4gU0RLIHZlcnNpb24uJyxcbiAgICAgIF0uam9pbignICcpKTtcbiAgICB9XG5cbiAgICBjb25zdCBjcmVhdGUgPSBwcm9wcy5vbkNyZWF0ZSB8fCBwcm9wcy5vblVwZGF0ZTtcbiAgICB0aGlzLmN1c3RvbVJlc291cmNlID0gbmV3IGNkay5DdXN0b21SZXNvdXJjZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICByZXNvdXJjZVR5cGU6IHByb3BzLnJlc291cmNlVHlwZSB8fCAnQ3VzdG9tOjpBV1MnLFxuICAgICAgc2VydmljZVRva2VuOiBwcm92aWRlci5mdW5jdGlvbkFybixcbiAgICAgIHBhc2NhbENhc2VQcm9wZXJ0aWVzOiB0cnVlLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBjcmVhdGU6IGNyZWF0ZSAmJiB0aGlzLmVuY29kZUpzb24oY3JlYXRlKSxcbiAgICAgICAgdXBkYXRlOiBwcm9wcy5vblVwZGF0ZSAmJiB0aGlzLmVuY29kZUpzb24ocHJvcHMub25VcGRhdGUpLFxuICAgICAgICBkZWxldGU6IHByb3BzLm9uRGVsZXRlICYmIHRoaXMuZW5jb2RlSnNvbihwcm9wcy5vbkRlbGV0ZSksXG4gICAgICAgIGluc3RhbGxMYXRlc3RBd3NTZGssXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gQ3JlYXRlIHRoZSBwb2xpY3kgc3RhdGVtZW50cyBmb3IgdGhlIGN1c3RvbSByZXNvdXJjZSBmdW5jdGlvbiByb2xlLCBvciB1c2UgdGhlIHVzZXItcHJvdmlkZWQgb25lc1xuICAgIGlmIChwcm9wcy5wb2xpY3kpIHtcbiAgICAgIGNvbnN0IHN0YXRlbWVudHMgPSBbXTtcbiAgICAgIGlmIChwcm9wcy5wb2xpY3kuc3RhdGVtZW50cy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgLy8gVXNlIGN1c3RvbSBzdGF0ZW1lbnRzIHByb3ZpZGVkIGJ5IHRoZSB1c2VyXG4gICAgICAgIGZvciAoY29uc3Qgc3RhdGVtZW50IG9mIHByb3BzLnBvbGljeS5zdGF0ZW1lbnRzKSB7XG4gICAgICAgICAgc3RhdGVtZW50cy5wdXNoKHN0YXRlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIERlcml2ZSBzdGF0ZW1lbnRzIGZyb20gQVdTIFNESyBjYWxsc1xuICAgICAgICBmb3IgKGNvbnN0IGNhbGwgb2YgW3Byb3BzLm9uQ3JlYXRlLCBwcm9wcy5vblVwZGF0ZSwgcHJvcHMub25EZWxldGVdKSB7XG4gICAgICAgICAgaWYgKGNhbGwgJiYgY2FsbC5hc3N1bWVkUm9sZUFybiA9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBzdGF0ZW1lbnQgPSBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgICAgIGFjdGlvbnM6IFthd3NTZGtUb0lhbUFjdGlvbihjYWxsLnNlcnZpY2UsIGNhbGwuYWN0aW9uKV0sXG4gICAgICAgICAgICAgIHJlc291cmNlczogcHJvcHMucG9saWN5LnJlc291cmNlcyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgc3RhdGVtZW50cy5wdXNoKHN0YXRlbWVudCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChjYWxsICYmIGNhbGwuYXNzdW1lZFJvbGVBcm4gIT0gbnVsbCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGVtZW50ID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgICBhY3Rpb25zOiBbJ3N0czpBc3N1bWVSb2xlJ10sXG4gICAgICAgICAgICAgIHJlc291cmNlczogW2NhbGwuYXNzdW1lZFJvbGVBcm5dLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzdGF0ZW1lbnRzLnB1c2goc3RhdGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHBvbGljeSA9IG5ldyBpYW0uUG9saWN5KHRoaXMsICdDdXN0b21SZXNvdXJjZVBvbGljeScsIHtcbiAgICAgICAgc3RhdGVtZW50czogc3RhdGVtZW50cyxcbiAgICAgIH0pO1xuICAgICAgaWYgKHByb3ZpZGVyLnJvbGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwb2xpY3kuYXR0YWNoVG9Sb2xlKHByb3ZpZGVyLnJvbGUpO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGUgcG9saWN5IHdhcyBkZWxldGVkIGZpcnN0LCB0aGVuIHRoZSBmdW5jdGlvbiBtaWdodCBsb3NlIHBlcm1pc3Npb25zIHRvIGRlbGV0ZSB0aGUgY3VzdG9tIHJlc291cmNlXG4gICAgICAvLyBUaGlzIGlzIGhlcmUgc28gdGhhdCB0aGUgcG9saWN5IGRvZXNuJ3QgZ2V0IHJlbW92ZWQgYmVmb3JlIG9uRGVsZXRlIGlzIGNhbGxlZFxuICAgICAgdGhpcy5jdXN0b21SZXNvdXJjZS5ub2RlLmFkZERlcGVuZGVuY3kocG9saWN5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyByZXNwb25zZSBkYXRhIGZvciB0aGUgQVdTIFNESyBjYWxsLlxuICAgKlxuICAgKiBFeGFtcGxlIGZvciBTMyAvIGxpc3RCdWNrZXQgOiAnQnVja2V0cy4wLk5hbWUnXG4gICAqXG4gICAqIFVzZSBgVG9rZW4uYXNYeHhgIHRvIGVuY29kZSB0aGUgcmV0dXJuZWQgYFJlZmVyZW5jZWAgYXMgYSBzcGVjaWZpYyB0eXBlIG9yXG4gICAqIHVzZSB0aGUgY29udmVuaWVuY2UgYGdldERhdGFTdHJpbmdgIGZvciBzdHJpbmcgYXR0cmlidXRlcy5cbiAgICpcbiAgICogTm90ZSB0aGF0IHlvdSBjYW5ub3QgdXNlIHRoaXMgbWV0aG9kIGlmIGBpZ25vcmVFcnJvckNvZGVzTWF0Y2hpbmdgXG4gICAqIGlzIGNvbmZpZ3VyZWQgZm9yIGFueSBvZiB0aGUgU0RLIGNhbGxzLiBUaGlzIGlzIGJlY2F1c2UgaW4gc3VjaCBhIGNhc2UsXG4gICAqIHRoZSByZXNwb25zZSBkYXRhIG1pZ2h0IG5vdCBleGlzdCwgYW5kIHdpbGwgY2F1c2UgYSBDbG91ZEZvcm1hdGlvbiBkZXBsb3kgdGltZSBlcnJvci5cbiAgICpcbiAgICogQHBhcmFtIGRhdGFQYXRoIHRoZSBwYXRoIHRvIHRoZSBkYXRhXG4gICAqL1xuICBwdWJsaWMgZ2V0UmVzcG9uc2VGaWVsZFJlZmVyZW5jZShkYXRhUGF0aDogc3RyaW5nKSB7XG4gICAgQXdzQ3VzdG9tUmVzb3VyY2UuYnJlYWtJZ25vcmVFcnJvcnNDaXJjdWl0KFt0aGlzLnByb3BzLm9uQ3JlYXRlLCB0aGlzLnByb3BzLm9uVXBkYXRlXSwgJ2dldERhdGEnKTtcbiAgICByZXR1cm4gdGhpcy5jdXN0b21SZXNvdXJjZS5nZXRBdHQoZGF0YVBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgcmVzcG9uc2UgZGF0YSBmb3IgdGhlIEFXUyBTREsgY2FsbCBhcyBzdHJpbmcuXG4gICAqXG4gICAqIEV4YW1wbGUgZm9yIFMzIC8gbGlzdEJ1Y2tldCA6ICdCdWNrZXRzLjAuTmFtZSdcbiAgICpcbiAgICogTm90ZSB0aGF0IHlvdSBjYW5ub3QgdXNlIHRoaXMgbWV0aG9kIGlmIGBpZ25vcmVFcnJvckNvZGVzTWF0Y2hpbmdgXG4gICAqIGlzIGNvbmZpZ3VyZWQgZm9yIGFueSBvZiB0aGUgU0RLIGNhbGxzLiBUaGlzIGlzIGJlY2F1c2UgaW4gc3VjaCBhIGNhc2UsXG4gICAqIHRoZSByZXNwb25zZSBkYXRhIG1pZ2h0IG5vdCBleGlzdCwgYW5kIHdpbGwgY2F1c2UgYSBDbG91ZEZvcm1hdGlvbiBkZXBsb3kgdGltZSBlcnJvci5cbiAgICpcbiAgICogQHBhcmFtIGRhdGFQYXRoIHRoZSBwYXRoIHRvIHRoZSBkYXRhXG4gICAqL1xuICBwdWJsaWMgZ2V0UmVzcG9uc2VGaWVsZChkYXRhUGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBBd3NDdXN0b21SZXNvdXJjZS5icmVha0lnbm9yZUVycm9yc0NpcmN1aXQoW3RoaXMucHJvcHMub25DcmVhdGUsIHRoaXMucHJvcHMub25VcGRhdGVdLCAnZ2V0RGF0YVN0cmluZycpO1xuICAgIHJldHVybiB0aGlzLmN1c3RvbVJlc291cmNlLmdldEF0dFN0cmluZyhkYXRhUGF0aCk7XG4gIH1cblxuICBwcml2YXRlIGVuY29kZUpzb24ob2JqOiBhbnkpIHtcbiAgICByZXR1cm4gY2RrLkxhenkudW5jYWNoZWRTdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiBjZGsuU3RhY2sub2YodGhpcykudG9Kc29uU3RyaW5nKG9iaikgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBV1MgU0RLIHNlcnZpY2UgbWV0YWRhdGEuXG4gKi9cbmV4cG9ydCB0eXBlIEF3c1Nka01ldGFkYXRhID0ge1trZXk6IHN0cmluZ106IGFueX07XG5cbi8qKlxuICogR2V0cyBhd3NTZGtNZXRhRGF0YSBmcm9tIGZpbGUgb3IgZnJvbSBjYWNoZVxuICovXG5sZXQgZ2V0QXdzU2RrTWV0YWRhdGEgPSAoKCkgPT4ge1xuICBsZXQgX2F3c1Nka01ldGFkYXRhOiBBd3NTZGtNZXRhZGF0YTtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoX2F3c1Nka01ldGFkYXRhKSB7XG4gICAgICByZXR1cm4gX2F3c1Nka01ldGFkYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gX2F3c1Nka01ldGFkYXRhID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKF9fZGlybmFtZSwgJ3Nkay1hcGktbWV0YWRhdGEuanNvbicpLCAndXRmLTgnKSk7XG4gICAgfVxuICB9O1xufSkoKTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYG9iamAgaW5jbHVkZXMgYSBgUGh5c2ljYWxSZXNvdXJjZUlkUmVmZXJlbmNlYCBpbiBvbmUgb2YgdGhlXG4gKiB2YWx1ZXMuXG4gKiBAcGFyYW0gb2JqIEFueSBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGluY2x1ZGVzUGh5c2ljYWxSZXNvdXJjZUlkUmVmKG9iajogYW55IHwgdW5kZWZpbmVkKSB7XG4gIGlmIChvYmogPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGxldCBmb3VuZFJlZiA9IGZhbHNlO1xuXG4gIC8vIHdlIHVzZSBKU09OLnN0cmluZ2lmeSBhcyBhIHdheSB0byB0cmF2ZXJzZSBhbGwgdmFsdWVzIGluIHRoZSBvYmplY3QuXG4gIEpTT04uc3RyaW5naWZ5KG9iaiwgKF8sIHYpID0+IHtcbiAgICBpZiAodiA9PT0gUEhZU0lDQUxfUkVTT1VSQ0VfSURfUkVGRVJFTkNFKSB7XG4gICAgICBmb3VuZFJlZiA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHY7XG4gIH0pO1xuXG4gIHJldHVybiBmb3VuZFJlZjtcbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm0gU0RLIHNlcnZpY2UvYWN0aW9uIHRvIElBTSBhY3Rpb24gdXNpbmcgbWV0YWRhdGEgZnJvbSBhd3Mtc2RrIG1vZHVsZS5cbiAqIEV4YW1wbGU6IENsb3VkV2F0Y2hMb2dzIHdpdGggcHV0UmV0ZW50aW9uUG9saWN5ID0+IGxvZ3M6UHV0UmV0ZW50aW9uUG9saWN5XG4gKlxuICogVE9ETzogaXMgdGhpcyBtYXBwaW5nIGNvcnJlY3QgZm9yIGFsbCBzZXJ2aWNlcz9cbiAqL1xuZnVuY3Rpb24gYXdzU2RrVG9JYW1BY3Rpb24oc2VydmljZTogc3RyaW5nLCBhY3Rpb246IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHNydiA9IHNlcnZpY2UudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgYXdzU2RrTWV0YWRhdGEgPSBnZXRBd3NTZGtNZXRhZGF0YSgpO1xuICBjb25zdCBpYW1TZXJ2aWNlID0gKGF3c1Nka01ldGFkYXRhW3Nydl0gJiYgYXdzU2RrTWV0YWRhdGFbc3J2XS5wcmVmaXgpIHx8IHNydjtcbiAgY29uc3QgaWFtQWN0aW9uID0gYWN0aW9uLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgYWN0aW9uLnNsaWNlKDEpO1xuICByZXR1cm4gYCR7aWFtU2VydmljZX06JHtpYW1BY3Rpb259YDtcbn1cbiJdfQ==