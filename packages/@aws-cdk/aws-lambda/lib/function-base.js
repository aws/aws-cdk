"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QualifiedFunctionBase = exports.FunctionBase = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const crypto_1 = require("crypto");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const event_invoke_config_1 = require("./event-invoke-config");
const event_source_mapping_1 = require("./event-source-mapping");
const function_url_1 = require("./function-url");
const lambda_generated_1 = require("./lambda.generated");
const util_1 = require("./util");
class FunctionBase extends core_1.Resource {
    constructor() {
        super(...arguments);
        /**
         * Flag to delay adding a warning message until current version is invoked.
         * @internal
         */
        this._warnIfCurrentVersionCalled = false;
        /**
         * Mapping of invocation principals to grants. Used to de-dupe `grantInvoke()` calls.
         * @internal
         */
        this._invocationGrants = {};
        /**
         * Mapping of fucntion URL invocation principals to grants. Used to de-dupe `grantInvokeUrl()` calls.
         * @internal
         */
        this._functionUrlInvocationGrants = {};
    }
    /**
     * A warning will be added to functions under the following conditions:
     * - permissions that include `lambda:InvokeFunction` are added to the unqualified function.
     * - function.currentVersion is invoked before or after the permission is created.
     *
     * This applies only to permissions on Lambda functions, not versions or aliases.
     * This function is overridden as a noOp for QualifiedFunctionBase.
     */
    considerWarningOnInvokeFunctionPermissions(scope, action) {
        const affectedPermissions = ['lambda:InvokeFunction', 'lambda:*', 'lambda:Invoke*'];
        if (affectedPermissions.includes(action)) {
            if (scope.node.tryFindChild('CurrentVersion')) {
                this.warnInvokeFunctionPermissions(scope);
            }
            else {
                this._warnIfCurrentVersionCalled = true;
            }
        }
    }
    warnInvokeFunctionPermissions(scope) {
        core_1.Annotations.of(scope).addWarning([
            "AWS Lambda has changed their authorization strategy, which may cause client invocations using the 'Qualifier' parameter of the lambda function to fail with Access Denied errors.",
            "If you are using a lambda Version or Alias, make sure to call 'grantInvoke' or 'addPermission' on the Version or Alias, not the underlying Function",
            'See: https://github.com/aws/aws-cdk/issues/19273',
        ].join('\n'));
    }
    /**
     * Adds a permission to the Lambda resource policy.
     * @param id The id for the permission construct
     * @param permission The permission to grant to this Lambda function. @see Permission for details.
     */
    addPermission(id, permission) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_Permission(permission);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addPermission);
            }
            throw error;
        }
        if (!this.canCreatePermissions) {
            // FIXME: @deprecated(v2) - throw an error if calling `addPermission` on a resource that doesn't support it.
            return;
        }
        let principal = this.parsePermissionPrincipal(permission.principal);
        let { sourceArn, sourceAccount, principalOrgID } = this.validateConditionCombinations(permission.principal) ?? {};
        const action = permission.action ?? 'lambda:InvokeFunction';
        const scope = permission.scope ?? this;
        this.considerWarningOnInvokeFunctionPermissions(scope, action);
        new lambda_generated_1.CfnPermission(scope, id, {
            action,
            principal,
            functionName: this.functionArn,
            eventSourceToken: permission.eventSourceToken,
            sourceAccount: permission.sourceAccount ?? sourceAccount,
            sourceArn: permission.sourceArn ?? sourceArn,
            principalOrgId: permission.organizationId ?? principalOrgID,
            functionUrlAuthType: permission.functionUrlAuthType,
        });
    }
    /**
     * Adds a statement to the IAM role assumed by the instance.
     */
    addToRolePolicy(statement) {
        if (!this.role) {
            return;
        }
        this.role.addToPrincipalPolicy(statement);
    }
    /**
     * Access the Connections object
     *
     * Will fail if not a VPC-enabled Lambda Function
     */
    get connections() {
        if (!this._connections) {
            // eslint-disable-next-line max-len
            throw new Error('Only VPC-associated Lambda Functions have security groups to manage. Supply the "vpc" parameter when creating the Lambda, or "securityGroupId" when importing it.');
        }
        return this._connections;
    }
    get latestVersion() {
        if (!this._latestVersion) {
            this._latestVersion = new LatestVersion(this);
        }
        return this._latestVersion;
    }
    /**
     * Whether or not this Lambda function was bound to a VPC
     *
     * If this is is `false`, trying to access the `connections` object will fail.
     */
    get isBoundToVpc() {
        return !!this._connections;
    }
    addEventSourceMapping(id, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_EventSourceMappingOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addEventSourceMapping);
            }
            throw error;
        }
        return new event_source_mapping_1.EventSourceMapping(this, id, {
            target: this,
            ...options,
        });
    }
    /**
     * Grant the given identity permissions to invoke this Lambda
     */
    grantInvoke(grantee) {
        const hash = crypto_1.createHash('sha256')
            .update(JSON.stringify({
            principal: grantee.grantPrincipal.toString(),
            conditions: grantee.grantPrincipal.policyFragment.conditions,
        }), 'utf8')
            .digest('base64');
        const identifier = `Invoke${hash}`;
        // Memoize the result so subsequent grantInvoke() calls are idempotent
        let grant = this._invocationGrants[identifier];
        if (!grant) {
            grant = this.grant(grantee, identifier, 'lambda:InvokeFunction', this.resourceArnsForGrantInvoke);
            this._invocationGrants[identifier] = grant;
        }
        return grant;
    }
    /**
     * Grant the given identity permissions to invoke this Lambda Function URL
     */
    grantInvokeUrl(grantee) {
        const identifier = `InvokeFunctionUrl${grantee.grantPrincipal}`; // calls the .toString() of the principal
        // Memoize the result so subsequent grantInvoke() calls are idempotent
        let grant = this._functionUrlInvocationGrants[identifier];
        if (!grant) {
            grant = this.grant(grantee, identifier, 'lambda:InvokeFunctionUrl', [this.functionArn], {
                functionUrlAuthType: function_url_1.FunctionUrlAuthType.AWS_IAM,
            });
            this._functionUrlInvocationGrants[identifier] = grant;
        }
        return grant;
    }
    addEventSource(source) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_IEventSource(source);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addEventSource);
            }
            throw error;
        }
        source.bind(this);
    }
    configureAsyncInvoke(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_EventInvokeConfigOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.configureAsyncInvoke);
            }
            throw error;
        }
        if (this.node.tryFindChild('EventInvokeConfig') !== undefined) {
            throw new Error(`An EventInvokeConfig has already been configured for the function at ${this.node.path}`);
        }
        new event_invoke_config_1.EventInvokeConfig(this, 'EventInvokeConfig', {
            function: this,
            ...options,
        });
    }
    addFunctionUrl(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_FunctionUrlOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addFunctionUrl);
            }
            throw error;
        }
        return new function_url_1.FunctionUrl(this, 'FunctionUrl', {
            function: this,
            ...options,
        });
    }
    /**
     * Returns the construct tree node that corresponds to the lambda function.
     * For use internally for constructs, when the tree is set up in non-standard ways. Ex: SingletonFunction.
     * @internal
     */
    _functionNode() {
        return this.node;
    }
    /**
     * Given the function arn, check if the account id matches this account
     *
     * Function ARNs look like this:
     *
     *   arn:aws:lambda:region:account-id:function:function-name
     *
     * ..which means that in order to extract the `account-id` component from the ARN, we can
     * split the ARN using ":" and select the component in index 4.
     *
     * @returns true if account id of function matches the account specified on the stack, false otherwise.
     *
     * @internal
     */
    _isStackAccount() {
        if (core_1.Token.isUnresolved(this.stack.account) || core_1.Token.isUnresolved(this.functionArn)) {
            return false;
        }
        return this.stack.splitArn(this.functionArn, core_1.ArnFormat.SLASH_RESOURCE_NAME).account === this.stack.account;
    }
    grant(grantee, identifier, action, resourceArns, permissionOverrides) {
        const grant = iam.Grant.addToPrincipalOrResource({
            grantee,
            actions: [action],
            resourceArns,
            // Fake resource-like object on which to call addToResourcePolicy(), which actually
            // calls addPermission()
            resource: {
                addToResourcePolicy: (_statement) => {
                    // Couldn't add permissions to the principal, so add them locally.
                    this.addPermission(identifier, {
                        principal: grantee.grantPrincipal,
                        action: action,
                        ...permissionOverrides,
                    });
                    const permissionNode = this._functionNode().tryFindChild(identifier);
                    if (!permissionNode && !this._skipPermissions) {
                        throw new Error('Cannot modify permission to lambda function. Function is either imported or $LATEST version.\n'
                            + 'If the function is imported from the same account use `fromFunctionAttributes()` API with the `sameEnvironment` flag.\n'
                            + 'If the function is imported from a different account and already has the correct permissions use `fromFunctionAttributes()` API with the `skipPermissions` flag.');
                    }
                    return { statementAdded: true, policyDependable: permissionNode };
                },
                node: this.node,
                stack: this.stack,
                env: this.env,
                applyRemovalPolicy: this.applyRemovalPolicy,
            },
        });
        return grant;
    }
    /**
     * Translate IPrincipal to something we can pass to AWS::Lambda::Permissions
     *
     * Do some nasty things because `Permission` supports a subset of what the
     * full IAM principal language supports, and we may not be able to parse strings
     * outright because they may be tokens.
     *
     * Try to recognize some specific Principal classes first, then try a generic
     * fallback.
     */
    parsePermissionPrincipal(principal) {
        // Try some specific common classes first.
        // use duck-typing, not instance of
        if ('wrapped' in principal) {
            // eslint-disable-next-line dot-notation
            principal = principal['wrapped'];
        }
        if ('accountId' in principal) {
            return principal.accountId;
        }
        if ('service' in principal) {
            return principal.service;
        }
        if ('arn' in principal) {
            return principal.arn;
        }
        const stringEquals = matchSingleKey('StringEquals', principal.policyFragment.conditions);
        if (stringEquals) {
            const orgId = matchSingleKey('aws:PrincipalOrgID', stringEquals);
            if (orgId) {
                // we will move the organization id to the `principalOrgId` property of `Permissions`.
                return '*';
            }
        }
        // Try a best-effort approach to support simple principals that are not any of the predefined
        // classes, but are simple enough that they will fit into the Permission model. Main target
        // here: imported Roles, Users, Groups.
        //
        // The principal cannot have conditions and must have a single { AWS: [arn] } entry.
        const json = principal.policyFragment.principalJson;
        if (Object.keys(principal.policyFragment.conditions).length === 0 && json.AWS) {
            if (typeof json.AWS === 'string') {
                return json.AWS;
            }
            if (Array.isArray(json.AWS) && json.AWS.length === 1 && typeof json.AWS[0] === 'string') {
                return json.AWS[0];
            }
        }
        throw new Error(`Invalid principal type for Lambda permission statement: ${principal.constructor.name}. ` +
            'Supported: AccountPrincipal, ArnPrincipal, ServicePrincipal, OrganizationPrincipal');
        /**
         * Returns the value at the key if the object contains the key and nothing else. Otherwise,
         * returns undefined.
         */
        function matchSingleKey(key, obj) {
            if (Object.keys(obj).length !== 1) {
                return undefined;
            }
            return obj[key];
        }
    }
    validateConditionCombinations(principal) {
        const conditions = this.validateConditions(principal);
        if (!conditions) {
            return undefined;
        }
        const sourceArn = requireString(requireObject(conditions.ArnLike)?.['aws:SourceArn']);
        const sourceAccount = requireString(requireObject(conditions.StringEquals)?.['aws:SourceAccount']);
        const principalOrgID = requireString(requireObject(conditions.StringEquals)?.['aws:PrincipalOrgID']);
        // PrincipalOrgID cannot be combined with any other conditions
        if (principalOrgID && (sourceArn || sourceAccount)) {
            throw new Error('PrincipalWithConditions had unsupported condition combinations for Lambda permission statement: principalOrgID cannot be set with other conditions.');
        }
        return {
            sourceArn,
            sourceAccount,
            principalOrgID,
        };
    }
    validateConditions(principal) {
        if (this.isPrincipalWithConditions(principal)) {
            const conditions = principal.policyFragment.conditions;
            const conditionPairs = util_1.flatMap(Object.entries(conditions), ([operator, conditionObjs]) => Object.keys(conditionObjs).map(key => { return { operator, key }; }));
            // These are all the supported conditions. Some combinations are not supported,
            // like only 'aws:SourceArn' or 'aws:PrincipalOrgID' and 'aws:SourceAccount'.
            // These will be validated through `this.validateConditionCombinations`.
            const supportedPrincipalConditions = [{
                    operator: 'ArnLike',
                    key: 'aws:SourceArn',
                },
                {
                    operator: 'StringEquals',
                    key: 'aws:SourceAccount',
                }, {
                    operator: 'StringEquals',
                    key: 'aws:PrincipalOrgID',
                }];
            const unsupportedConditions = conditionPairs.filter((condition) => !supportedPrincipalConditions.some((supportedCondition) => supportedCondition.operator === condition.operator && supportedCondition.key === condition.key));
            if (unsupportedConditions.length == 0) {
                return conditions;
            }
            else {
                throw new Error(`PrincipalWithConditions had unsupported conditions for Lambda permission statement: ${JSON.stringify(unsupportedConditions)}. ` +
                    `Supported operator/condition pairs: ${JSON.stringify(supportedPrincipalConditions)}`);
            }
        }
        return undefined;
    }
    isPrincipalWithConditions(principal) {
        return Object.keys(principal.policyFragment.conditions).length > 0;
    }
}
exports.FunctionBase = FunctionBase;
_a = JSII_RTTI_SYMBOL_1;
FunctionBase[_a] = { fqn: "@aws-cdk/aws-lambda.FunctionBase", version: "0.0.0" };
class QualifiedFunctionBase extends FunctionBase {
    constructor() {
        super(...arguments);
        this.permissionsNode = this.node;
    }
    get latestVersion() {
        return this.lambda.latestVersion;
    }
    get resourceArnsForGrantInvoke() {
        return [this.functionArn];
    }
    configureAsyncInvoke(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_EventInvokeConfigOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.configureAsyncInvoke);
            }
            throw error;
        }
        if (this.node.tryFindChild('EventInvokeConfig') !== undefined) {
            throw new Error(`An EventInvokeConfig has already been configured for the qualified function at ${this.node.path}`);
        }
        new event_invoke_config_1.EventInvokeConfig(this, 'EventInvokeConfig', {
            function: this.lambda,
            qualifier: this.qualifier,
            ...options,
        });
    }
    considerWarningOnInvokeFunctionPermissions(_scope, _action) {
        // noOp
        return;
    }
}
exports.QualifiedFunctionBase = QualifiedFunctionBase;
_b = JSII_RTTI_SYMBOL_1;
QualifiedFunctionBase[_b] = { fqn: "@aws-cdk/aws-lambda.QualifiedFunctionBase", version: "0.0.0" };
/**
 * The $LATEST version of a function, useful when attempting to create aliases.
 */
class LatestVersion extends FunctionBase {
    constructor(lambda) {
        super(lambda, '$LATEST');
        this.version = '$LATEST';
        this.permissionsNode = this.node;
        this.canCreatePermissions = false;
        this.lambda = lambda;
    }
    get functionArn() {
        return `${this.lambda.functionArn}:${this.version}`;
    }
    get functionName() {
        return `${this.lambda.functionName}:${this.version}`;
    }
    get architecture() {
        return this.lambda.architecture;
    }
    get grantPrincipal() {
        return this.lambda.grantPrincipal;
    }
    get latestVersion() {
        return this;
    }
    get role() {
        return this.lambda.role;
    }
    get edgeArn() {
        throw new Error('$LATEST function version cannot be used for Lambda@Edge');
    }
    get resourceArnsForGrantInvoke() {
        return [this.functionArn];
    }
    addAlias(aliasName, options = {}) {
        return util_1.addAlias(this, this, aliasName, options);
    }
}
function requireObject(x) {
    return x && typeof x === 'object' && !Array.isArray(x) ? x : undefined;
}
function requireString(x) {
    return x && typeof x === 'string' ? x : undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb24tYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZ1bmN0aW9uLWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsbUNBQW9DO0FBR3BDLHdDQUF3QztBQUN4Qyx3Q0FBbUY7QUFJbkYsK0RBQW9GO0FBRXBGLGlFQUF1RjtBQUN2RixpREFBc0Y7QUFFdEYseURBQW1EO0FBRW5ELGlDQUEyQztBQWlOM0MsTUFBc0IsWUFBYSxTQUFRLGVBQVE7SUFBbkQ7O1FBaUVFOzs7V0FHRztRQUNPLGdDQUEyQixHQUFZLEtBQUssQ0FBQztRQUV2RDs7O1dBR0c7UUFDTyxzQkFBaUIsR0FBOEIsRUFBRSxDQUFDO1FBRTVEOzs7V0FHRztRQUNPLGlDQUE0QixHQUE4QixFQUFFLENBQUM7S0FzWHhFO0lBcFhDOzs7Ozs7O09BT0c7SUFDSSwwQ0FBMEMsQ0FBQyxLQUFnQixFQUFFLE1BQWM7UUFDaEYsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLHVCQUF1QixFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3BGLElBQUksbUJBQW1CLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3hDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtnQkFDN0MsSUFBSSxDQUFDLDZCQUE2QixDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzNDO2lCQUFNO2dCQUNMLElBQUksQ0FBQywyQkFBMkIsR0FBRyxJQUFJLENBQUM7YUFDekM7U0FDRjtLQUNGO0lBRVMsNkJBQTZCLENBQUMsS0FBZ0I7UUFDdEQsa0JBQVcsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDO1lBQy9CLG1MQUFtTDtZQUNuTCxxSkFBcUo7WUFDckosa0RBQWtEO1NBQ25ELENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDZjtJQUVEOzs7O09BSUc7SUFDSSxhQUFhLENBQUMsRUFBVSxFQUFFLFVBQXNCOzs7Ozs7Ozs7O1FBQ3JELElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUU7WUFDOUIsNEdBQTRHO1lBQzVHLE9BQU87U0FDUjtRQUVELElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFcEUsSUFBSSxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFLEdBQUcsSUFBSSxDQUFDLDZCQUE2QixDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFbEgsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sSUFBSSx1QkFBdUIsQ0FBQztRQUM1RCxNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztRQUV2QyxJQUFJLENBQUMsMENBQTBDLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRS9ELElBQUksZ0NBQWEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQzNCLE1BQU07WUFDTixTQUFTO1lBQ1QsWUFBWSxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQzlCLGdCQUFnQixFQUFFLFVBQVUsQ0FBQyxnQkFBZ0I7WUFDN0MsYUFBYSxFQUFFLFVBQVUsQ0FBQyxhQUFhLElBQUksYUFBYTtZQUN4RCxTQUFTLEVBQUUsVUFBVSxDQUFDLFNBQVMsSUFBSSxTQUFTO1lBQzVDLGNBQWMsRUFBRSxVQUFVLENBQUMsY0FBYyxJQUFJLGNBQWM7WUFDM0QsbUJBQW1CLEVBQUUsVUFBVSxDQUFDLG1CQUFtQjtTQUNwRCxDQUFDLENBQUM7S0FDSjtJQUVEOztPQUVHO0lBQ0ksZUFBZSxDQUFDLFNBQThCO1FBQ25ELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2QsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUMzQztJQUVEOzs7O09BSUc7SUFDSCxJQUFXLFdBQVc7UUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEIsbUNBQW1DO1lBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsbUtBQW1LLENBQUMsQ0FBQztTQUN0TDtRQUNELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztLQUMxQjtJQUVELElBQVcsYUFBYTtRQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN4QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQy9DO1FBQ0QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0tBQzVCO0lBRUQ7Ozs7T0FJRztJQUNILElBQVcsWUFBWTtRQUNyQixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO0tBQzVCO0lBRU0scUJBQXFCLENBQUMsRUFBVSxFQUFFLE9BQWtDOzs7Ozs7Ozs7O1FBQ3pFLE9BQU8sSUFBSSx5Q0FBa0IsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQ3RDLE1BQU0sRUFBRSxJQUFJO1lBQ1osR0FBRyxPQUFPO1NBQ1gsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7T0FFRztJQUNJLFdBQVcsQ0FBQyxPQUF1QjtRQUN4QyxNQUFNLElBQUksR0FBRyxtQkFBVSxDQUFDLFFBQVEsQ0FBQzthQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUNyQixTQUFTLEVBQUUsT0FBTyxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUU7WUFDNUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLFVBQVU7U0FDN0QsQ0FBQyxFQUFFLE1BQU0sQ0FBQzthQUNWLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwQixNQUFNLFVBQVUsR0FBRyxTQUFTLElBQUksRUFBRSxDQUFDO1FBRW5DLHNFQUFzRTtRQUN0RSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDbEcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUM1QztRQUNELE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFRDs7T0FFRztJQUNJLGNBQWMsQ0FBQyxPQUF1QjtRQUMzQyxNQUFNLFVBQVUsR0FBRyxvQkFBb0IsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMseUNBQXlDO1FBRTFHLHNFQUFzRTtRQUN0RSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsNEJBQTRCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsMEJBQTBCLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JBQ3RGLG1CQUFtQixFQUFFLGtDQUFtQixDQUFDLE9BQU87YUFDakQsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLDRCQUE0QixDQUFDLFVBQVUsQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUN2RDtRQUNELE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFTSxjQUFjLENBQUMsTUFBb0I7Ozs7Ozs7Ozs7UUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNuQjtJQUVNLG9CQUFvQixDQUFDLE9BQWlDOzs7Ozs7Ozs7O1FBQzNELElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUMsS0FBSyxTQUFTLEVBQUU7WUFDN0QsTUFBTSxJQUFJLEtBQUssQ0FBQyx3RUFBd0UsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQzNHO1FBRUQsSUFBSSx1Q0FBaUIsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUU7WUFDL0MsUUFBUSxFQUFFLElBQUk7WUFDZCxHQUFHLE9BQU87U0FDWCxDQUFDLENBQUM7S0FDSjtJQUVNLGNBQWMsQ0FBQyxPQUE0Qjs7Ozs7Ozs7OztRQUNoRCxPQUFPLElBQUksMEJBQVcsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQzFDLFFBQVEsRUFBRSxJQUFJO1lBQ2QsR0FBRyxPQUFPO1NBQ1gsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7OztPQUlHO0lBQ08sYUFBYTtRQUNyQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDbEI7SUFFRDs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ08sZUFBZTtRQUN2QixJQUFJLFlBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxZQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUNsRixPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLGdCQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7S0FDNUc7SUFFTyxLQUFLLENBQ1gsT0FBdUIsRUFDdkIsVUFBaUIsRUFDakIsTUFBYyxFQUNkLFlBQXNCLEVBQ3RCLG1CQUF5QztRQUV6QyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDO1lBQy9DLE9BQU87WUFDUCxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7WUFDakIsWUFBWTtZQUVaLG1GQUFtRjtZQUNuRix3QkFBd0I7WUFDeEIsUUFBUSxFQUFFO2dCQUNSLG1CQUFtQixFQUFFLENBQUMsVUFBVSxFQUFFLEVBQUU7b0JBQ2xDLGtFQUFrRTtvQkFDbEUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUU7d0JBQzdCLFNBQVMsRUFBRSxPQUFPLENBQUMsY0FBZTt3QkFDbEMsTUFBTSxFQUFFLE1BQU07d0JBQ2QsR0FBRyxtQkFBbUI7cUJBQ3ZCLENBQUMsQ0FBQztvQkFFSCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNyRSxJQUFJLENBQUMsY0FBYyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO3dCQUM3QyxNQUFNLElBQUksS0FBSyxDQUFDLGdHQUFnRzs4QkFDNUcseUhBQXlIOzhCQUN6SCxrS0FBa0ssQ0FBQyxDQUFDO3FCQUN6SztvQkFDRCxPQUFPLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsQ0FBQztnQkFDcEUsQ0FBQztnQkFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7Z0JBQ2YsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7Z0JBQ2Isa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjthQUM1QztTQUNGLENBQUMsQ0FBQztRQUVILE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSyx3QkFBd0IsQ0FBQyxTQUF5QjtRQUN4RCwwQ0FBMEM7UUFDMUMsbUNBQW1DO1FBQ25DLElBQUksU0FBUyxJQUFJLFNBQVMsRUFBRTtZQUMxQix3Q0FBd0M7WUFDeEMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNsQztRQUVELElBQUksV0FBVyxJQUFJLFNBQVMsRUFBRTtZQUM1QixPQUFRLFNBQWtDLENBQUMsU0FBUyxDQUFDO1NBQ3REO1FBRUQsSUFBSSxTQUFTLElBQUksU0FBUyxFQUFFO1lBQzFCLE9BQVEsU0FBa0MsQ0FBQyxPQUFPLENBQUM7U0FDcEQ7UUFFRCxJQUFJLEtBQUssSUFBSSxTQUFTLEVBQUU7WUFDdEIsT0FBUSxTQUE4QixDQUFDLEdBQUcsQ0FBQztTQUM1QztRQUVELE1BQU0sWUFBWSxHQUFHLGNBQWMsQ0FBQyxjQUFjLEVBQUUsU0FBUyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN6RixJQUFJLFlBQVksRUFBRTtZQUNoQixNQUFNLEtBQUssR0FBRyxjQUFjLENBQUMsb0JBQW9CLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDakUsSUFBSSxLQUFLLEVBQUU7Z0JBQ1Qsc0ZBQXNGO2dCQUN0RixPQUFPLEdBQUcsQ0FBQzthQUNaO1NBQ0Y7UUFFRCw2RkFBNkY7UUFDN0YsMkZBQTJGO1FBQzNGLHVDQUF1QztRQUN2QyxFQUFFO1FBQ0Ysb0ZBQW9GO1FBQ3BGLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDO1FBQ3BELElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUM3RSxJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsS0FBSyxRQUFRLEVBQUU7Z0JBQUUsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO2FBQUU7WUFDdEQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBRTtnQkFDdkYsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3BCO1NBQ0Y7UUFFRCxNQUFNLElBQUksS0FBSyxDQUFDLDJEQUEyRCxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSTtZQUN2RyxvRkFBb0YsQ0FBQyxDQUFDO1FBRXhGOzs7V0FHRztRQUNILFNBQVMsY0FBYyxDQUFDLEdBQVcsRUFBRSxHQUF3QjtZQUMzRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFBRSxPQUFPLFNBQVMsQ0FBQzthQUFFO1lBRXhELE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLENBQUM7S0FFRjtJQUVPLDZCQUE2QixDQUFDLFNBQXlCO1FBSzdELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV0RCxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQUUsT0FBTyxTQUFTLENBQUM7U0FBRTtRQUV0QyxNQUFNLFNBQVMsR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFDdEYsTUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7UUFDbkcsTUFBTSxjQUFjLEdBQUcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7UUFFckcsOERBQThEO1FBQzlELElBQUksY0FBYyxJQUFJLENBQUMsU0FBUyxJQUFJLGFBQWEsQ0FBQyxFQUFFO1lBQ2xELE1BQU0sSUFBSSxLQUFLLENBQUMscUpBQXFKLENBQUMsQ0FBQztTQUN4SztRQUVELE9BQU87WUFDTCxTQUFTO1lBQ1QsYUFBYTtZQUNiLGNBQWM7U0FDZixDQUFDO0tBQ0g7SUFFTyxrQkFBa0IsQ0FBQyxTQUF5QjtRQUNsRCxJQUFJLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM3QyxNQUFNLFVBQVUsR0FBbUIsU0FBUyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUM7WUFDdkUsTUFBTSxjQUFjLEdBQUcsY0FBTyxDQUM1QixNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUMxQixDQUFDLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQXVCLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxPQUFPLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQzlHLENBQUM7WUFFRiwrRUFBK0U7WUFDL0UsNkVBQTZFO1lBQzdFLHdFQUF3RTtZQUN4RSxNQUFNLDRCQUE0QixHQUFHLENBQUM7b0JBQ3BDLFFBQVEsRUFBRSxTQUFTO29CQUNuQixHQUFHLEVBQUUsZUFBZTtpQkFDckI7Z0JBQ0Q7b0JBQ0UsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLEdBQUcsRUFBRSxtQkFBbUI7aUJBQ3pCLEVBQUU7b0JBQ0QsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLEdBQUcsRUFBRSxvQkFBb0I7aUJBQzFCLENBQUMsQ0FBQztZQUVILE1BQU0scUJBQXFCLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FDakQsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUMvQyxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLFFBQVEsSUFBSSxrQkFBa0IsQ0FBQyxHQUFHLEtBQUssU0FBUyxDQUFDLEdBQUcsQ0FDdkgsQ0FDRixDQUFDO1lBRUYsSUFBSSxxQkFBcUIsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO2dCQUNyQyxPQUFPLFVBQVUsQ0FBQzthQUNuQjtpQkFBTTtnQkFDTCxNQUFNLElBQUksS0FBSyxDQUFDLHVGQUF1RixJQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLElBQUk7b0JBQzlJLHVDQUF1QyxJQUFJLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQzFGO1NBQ0Y7UUFFRCxPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUVPLHlCQUF5QixDQUFDLFNBQXlCO1FBQ3pELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7S0FDcEU7O0FBdGNILG9DQXVjQzs7O0FBRUQsTUFBc0IscUJBQXNCLFNBQVEsWUFBWTtJQUFoRTs7UUFHa0Isb0JBQWUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBaUM3QztJQXhCQyxJQUFXLGFBQWE7UUFDdEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQztLQUNsQztJQUVELElBQVcsMEJBQTBCO1FBQ25DLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDM0I7SUFFTSxvQkFBb0IsQ0FBQyxPQUFpQzs7Ozs7Ozs7OztRQUMzRCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixDQUFDLEtBQUssU0FBUyxFQUFFO1lBQzdELE1BQU0sSUFBSSxLQUFLLENBQUMsa0ZBQWtGLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztTQUNySDtRQUVELElBQUksdUNBQWlCLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1lBQy9DLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTTtZQUNyQixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7WUFDekIsR0FBRyxPQUFPO1NBQ1gsQ0FBQyxDQUFDO0tBQ0o7SUFFTSwwQ0FBMEMsQ0FBQyxNQUFpQixFQUFFLE9BQWU7UUFDbEYsT0FBTztRQUNQLE9BQU87S0FDUjs7QUFuQ0gsc0RBb0NDOzs7QUFFRDs7R0FFRztBQUNILE1BQU0sYUFBYyxTQUFRLFlBQVk7SUFPdEMsWUFBWSxNQUFvQjtRQUM5QixLQUFLLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBTlgsWUFBTyxHQUFHLFNBQVMsQ0FBQztRQUNwQixvQkFBZSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFFekIseUJBQW9CLEdBQUcsS0FBSyxDQUFDO1FBSTlDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0tBQ3RCO0lBRUQsSUFBVyxXQUFXO1FBQ3BCLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDckQ7SUFFRCxJQUFXLFlBQVk7UUFDckIsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUN0RDtJQUVELElBQVcsWUFBWTtRQUNyQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO0tBQ2pDO0lBRUQsSUFBVyxjQUFjO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUM7S0FDbkM7SUFFRCxJQUFXLGFBQWE7UUFDdEIsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVELElBQVcsSUFBSTtRQUNiLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7S0FDekI7SUFFRCxJQUFXLE9BQU87UUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsQ0FBQyxDQUFDO0tBQzVFO0lBRUQsSUFBVywwQkFBMEI7UUFDbkMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUMzQjtJQUVNLFFBQVEsQ0FBQyxTQUFpQixFQUFFLFVBQXdCLEVBQUU7UUFDM0QsT0FBTyxlQUFRLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDakQ7Q0FDRjtBQUVELFNBQVMsYUFBYSxDQUFDLENBQVU7SUFDL0IsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDaEYsQ0FBQztBQUVELFNBQVMsYUFBYSxDQUFDLENBQVU7SUFDL0IsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUNwRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3JlYXRlSGFzaCB9IGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgKiBhcyBjbG91ZHdhdGNoIGZyb20gJ0Bhd3MtY2RrL2F3cy1jbG91ZHdhdGNoJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IEFubm90YXRpb25zLCBBcm5Gb3JtYXQsIElSZXNvdXJjZSwgUmVzb3VyY2UsIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QsIE5vZGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFsaWFzT3B0aW9ucyB9IGZyb20gJy4vYWxpYXMnO1xuaW1wb3J0IHsgQXJjaGl0ZWN0dXJlIH0gZnJvbSAnLi9hcmNoaXRlY3R1cmUnO1xuaW1wb3J0IHsgRXZlbnRJbnZva2VDb25maWcsIEV2ZW50SW52b2tlQ29uZmlnT3B0aW9ucyB9IGZyb20gJy4vZXZlbnQtaW52b2tlLWNvbmZpZyc7XG5pbXBvcnQgeyBJRXZlbnRTb3VyY2UgfSBmcm9tICcuL2V2ZW50LXNvdXJjZSc7XG5pbXBvcnQgeyBFdmVudFNvdXJjZU1hcHBpbmcsIEV2ZW50U291cmNlTWFwcGluZ09wdGlvbnMgfSBmcm9tICcuL2V2ZW50LXNvdXJjZS1tYXBwaW5nJztcbmltcG9ydCB7IEZ1bmN0aW9uVXJsQXV0aFR5cGUsIEZ1bmN0aW9uVXJsT3B0aW9ucywgRnVuY3Rpb25VcmwgfSBmcm9tICcuL2Z1bmN0aW9uLXVybCc7XG5pbXBvcnQgeyBJVmVyc2lvbiB9IGZyb20gJy4vbGFtYmRhLXZlcnNpb24nO1xuaW1wb3J0IHsgQ2ZuUGVybWlzc2lvbiB9IGZyb20gJy4vbGFtYmRhLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBQZXJtaXNzaW9uIH0gZnJvbSAnLi9wZXJtaXNzaW9uJztcbmltcG9ydCB7IGFkZEFsaWFzLCBmbGF0TWFwIH0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGludGVyZmFjZSBJRnVuY3Rpb24gZXh0ZW5kcyBJUmVzb3VyY2UsIGVjMi5JQ29ubmVjdGFibGUsIGlhbS5JR3JhbnRhYmxlIHtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBmdW5jdGlvbk5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGZ1bmN0aW9uQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBJQU0gcm9sZSBhc3NvY2lhdGVkIHdpdGggdGhpcyBmdW5jdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IHJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoaXMgTGFtYmRhIGZ1bmN0aW9uIHdhcyBib3VuZCB0byBhIFZQQ1xuICAgKlxuICAgKiBJZiB0aGlzIGlzIGlzIGBmYWxzZWAsIHRyeWluZyB0byBhY2Nlc3MgdGhlIGBjb25uZWN0aW9uc2Agb2JqZWN0IHdpbGwgZmFpbC5cbiAgICovXG4gIHJlYWRvbmx5IGlzQm91bmRUb1ZwYzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIGAkTEFURVNUYCB2ZXJzaW9uIG9mIHRoaXMgZnVuY3Rpb24uXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGlzIGlzIHJlZmVyZW5jZSB0byBhIG5vbi1zcGVjaWZpYyBBV1MgTGFtYmRhIHZlcnNpb24sIHdoaWNoXG4gICAqIG1lYW5zIHRoZSBmdW5jdGlvbiB0aGlzIHZlcnNpb24gcmVmZXJzIHRvIGNhbiByZXR1cm4gZGlmZmVyZW50IHJlc3VsdHMgaW5cbiAgICogZGlmZmVyZW50IGludm9jYXRpb25zLlxuICAgKlxuICAgKiBUbyBvYnRhaW4gYSByZWZlcmVuY2UgdG8gYW4gZXhwbGljaXQgdmVyc2lvbiB3aGljaCByZWZlcmVuY2VzIHRoZSBjdXJyZW50XG4gICAqIGZ1bmN0aW9uIGNvbmZpZ3VyYXRpb24sIHVzZSBgbGFtYmRhRnVuY3Rpb24uY3VycmVudFZlcnNpb25gIGluc3RlYWQuXG4gICAqL1xuICByZWFkb25seSBsYXRlc3RWZXJzaW9uOiBJVmVyc2lvbjtcblxuICAvKipcbiAgICogVGhlIGNvbnN0cnVjdCBub2RlIHdoZXJlIHBlcm1pc3Npb25zIGFyZSBhdHRhY2hlZC5cbiAgICovXG4gIHJlYWRvbmx5IHBlcm1pc3Npb25zTm9kZTogTm9kZTtcblxuICAvKipcbiAgICogVGhlIHN5c3RlbSBhcmNoaXRlY3R1cmVzIGNvbXBhdGlibGUgd2l0aCB0aGlzIGxhbWJkYSBmdW5jdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGFyY2hpdGVjdHVyZTogQXJjaGl0ZWN0dXJlO1xuXG4gIC8qKlxuICAgKiBUaGUgQVJOKHMpIHRvIHB1dCBpbnRvIHRoZSByZXNvdXJjZSBmaWVsZCBvZiB0aGUgZ2VuZXJhdGVkIElBTSBwb2xpY3kgZm9yIGdyYW50SW52b2tlKCkuXG4gICAqXG4gICAqIFRoaXMgcHJvcGVydHkgaXMgZm9yIGNkayBtb2R1bGVzIHRvIGNvbnN1bWUgb25seS4gWW91IHNob3VsZCBub3QgbmVlZCB0byB1c2UgdGhpcyBwcm9wZXJ0eS5cbiAgICogSW5zdGVhZCwgdXNlIGdyYW50SW52b2tlKCkgZGlyZWN0bHkuXG4gICAqL1xuICByZWFkb25seSByZXNvdXJjZUFybnNGb3JHcmFudEludm9rZTogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gZXZlbnQgc291cmNlIHRoYXQgbWFwcyB0byB0aGlzIEFXUyBMYW1iZGEgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSBpZCBjb25zdHJ1Y3QgSURcbiAgICogQHBhcmFtIG9wdGlvbnMgbWFwcGluZyBvcHRpb25zXG4gICAqL1xuICBhZGRFdmVudFNvdXJjZU1hcHBpbmcoaWQ6IHN0cmluZywgb3B0aW9uczogRXZlbnRTb3VyY2VNYXBwaW5nT3B0aW9ucyk6IEV2ZW50U291cmNlTWFwcGluZztcblxuICAvKipcbiAgICogQWRkcyBhIHBlcm1pc3Npb24gdG8gdGhlIExhbWJkYSByZXNvdXJjZSBwb2xpY3kuXG4gICAqIEBwYXJhbSBpZCBUaGUgaWQgZm9yIHRoZSBwZXJtaXNzaW9uIGNvbnN0cnVjdFxuICAgKiBAcGFyYW0gcGVybWlzc2lvbiBUaGUgcGVybWlzc2lvbiB0byBncmFudCB0byB0aGlzIExhbWJkYSBmdW5jdGlvbi4gQHNlZSBQZXJtaXNzaW9uIGZvciBkZXRhaWxzLlxuICAgKi9cbiAgYWRkUGVybWlzc2lvbihpZDogc3RyaW5nLCBwZXJtaXNzaW9uOiBQZXJtaXNzaW9uKTogdm9pZDtcblxuICAvKipcbiAgICogQWRkcyBhIHN0YXRlbWVudCB0byB0aGUgSUFNIHJvbGUgYXNzdW1lZCBieSB0aGUgaW5zdGFuY2UuXG4gICAqL1xuICBhZGRUb1JvbGVQb2xpY3koc3RhdGVtZW50OiBpYW0uUG9saWN5U3RhdGVtZW50KTogdm9pZDtcblxuICAvKipcbiAgICogR3JhbnQgdGhlIGdpdmVuIGlkZW50aXR5IHBlcm1pc3Npb25zIHRvIGludm9rZSB0aGlzIExhbWJkYVxuICAgKi9cbiAgZ3JhbnRJbnZva2UoaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50O1xuXG4gIC8qKlxuICAgKiBHcmFudCB0aGUgZ2l2ZW4gaWRlbnRpdHkgcGVybWlzc2lvbnMgdG8gaW52b2tlIHRoaXMgTGFtYmRhIEZ1bmN0aW9uIFVSTFxuICAgKi9cbiAgZ3JhbnRJbnZva2VVcmwoaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50O1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGdpdmVuIG5hbWVkIG1ldHJpYyBmb3IgdGhpcyBMYW1iZGFcbiAgICovXG4gIG1ldHJpYyhtZXRyaWNOYW1lOiBzdHJpbmcsIHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIER1cmF0aW9uIG9mIHRoaXMgTGFtYmRhXG4gICAqXG4gICAqIEBkZWZhdWx0IGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIG1ldHJpY0R1cmF0aW9uKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiBpbnZvY2F0aW9ucyBvZiB0aGlzIExhbWJkYVxuICAgKlxuICAgKiBAZGVmYXVsdCBzdW0gb3ZlciA1IG1pbnV0ZXNcbiAgICovXG4gIG1ldHJpY0ludm9jYXRpb25zKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIE1ldHJpYyBmb3IgdGhlIG51bWJlciBvZiB0aHJvdHRsZWQgaW52b2NhdGlvbnMgb2YgdGhpcyBMYW1iZGFcbiAgICpcbiAgICogQGRlZmF1bHQgc3VtIG92ZXIgNSBtaW51dGVzXG4gICAqL1xuICBtZXRyaWNUaHJvdHRsZXMocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcblxuICAvKipcbiAgICogQWRkcyBhbiBldmVudCBzb3VyY2UgdG8gdGhpcyBmdW5jdGlvbi5cbiAgICpcbiAgICogRXZlbnQgc291cmNlcyBhcmUgaW1wbGVtZW50ZWQgaW4gdGhlIEBhd3MtY2RrL2F3cy1sYW1iZGEtZXZlbnQtc291cmNlcyBtb2R1bGUuXG4gICAqXG4gICAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBhZGRzIGFuIFNRUyBRdWV1ZSBhcyBhbiBldmVudCBzb3VyY2U6XG4gICAqIGBgYFxuICAgKiBpbXBvcnQgeyBTcXNFdmVudFNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEtZXZlbnQtc291cmNlcyc7XG4gICAqIG15RnVuY3Rpb24uYWRkRXZlbnRTb3VyY2UobmV3IFNxc0V2ZW50U291cmNlKG15UXVldWUpKTtcbiAgICogYGBgXG4gICAqL1xuICBhZGRFdmVudFNvdXJjZShzb3VyY2U6IElFdmVudFNvdXJjZSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZXMgb3B0aW9ucyBmb3IgYXN5bmNocm9ub3VzIGludm9jYXRpb24uXG4gICAqL1xuICBjb25maWd1cmVBc3luY0ludm9rZShvcHRpb25zOiBFdmVudEludm9rZUNvbmZpZ09wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBBZGRzIGEgdXJsIHRvIHRoaXMgbGFtYmRhIGZ1bmN0aW9uLlxuICAgKi9cbiAgYWRkRnVuY3Rpb25Vcmwob3B0aW9ucz86IEZ1bmN0aW9uVXJsT3B0aW9ucyk6IEZ1bmN0aW9uVXJsO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBMYW1iZGEgZnVuY3Rpb24gZGVmaW5lZCBvdXRzaWRlIG9mIHRoaXMgc3RhY2suXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRnVuY3Rpb25BdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIExhbWJkYSBmdW5jdGlvbi5cbiAgICpcbiAgICogRm9ybWF0OiBhcm46PHBhcnRpdGlvbj46bGFtYmRhOjxyZWdpb24+OjxhY2NvdW50LWlkPjpmdW5jdGlvbjo8ZnVuY3Rpb24tbmFtZT5cbiAgICovXG4gIHJlYWRvbmx5IGZ1bmN0aW9uQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBJQU0gZXhlY3V0aW9uIHJvbGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZnVuY3Rpb24uXG4gICAqXG4gICAqIElmIHRoZSByb2xlIGlzIG5vdCBzcGVjaWZpZWQsIGFueSByb2xlLXJlbGF0ZWQgb3BlcmF0aW9ucyB3aWxsIG5vLW9wLlxuICAgKi9cbiAgcmVhZG9ubHkgcm9sZT86IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogSWQgb2YgdGhlIHNlY3VyaXR5IGdyb3VwIG9mIHRoaXMgTGFtYmRhLCBpZiBpbiBhIFZQQy5cbiAgICpcbiAgICogVGhpcyBuZWVkcyB0byBiZSBnaXZlbiBpbiBvcmRlciB0byBzdXBwb3J0IGFsbG93aW5nIGNvbm5lY3Rpb25zXG4gICAqIHRvIHRoaXMgTGFtYmRhLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYHNlY3VyaXR5R3JvdXBgIGluc3RlYWRcbiAgICovXG4gIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXBJZD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHNlY3VyaXR5IGdyb3VwIG9mIHRoaXMgTGFtYmRhLCBpZiBpbiBhIFZQQy5cbiAgICpcbiAgICogVGhpcyBuZWVkcyB0byBiZSBnaXZlbiBpbiBvcmRlciB0byBzdXBwb3J0IGFsbG93aW5nIGNvbm5lY3Rpb25zXG4gICAqIHRvIHRoaXMgTGFtYmRhLlxuICAgKi9cbiAgcmVhZG9ubHkgc2VjdXJpdHlHcm91cD86IGVjMi5JU2VjdXJpdHlHcm91cDtcblxuICAvKipcbiAgICogU2V0dGluZyB0aGlzIHByb3BlcnR5IGluZm9ybXMgdGhlIENESyB0aGF0IHRoZSBpbXBvcnRlZCBmdW5jdGlvbiBpcyBpbiB0aGUgc2FtZSBlbnZpcm9ubWVudCBhcyB0aGUgc3RhY2suXG4gICAqIFRoaXMgYWZmZWN0cyBjZXJ0YWluIGJlaGF2aW91cnMgc3VjaCBhcywgd2hldGhlciB0aGlzIGZ1bmN0aW9uJ3MgcGVybWlzc2lvbiBjYW4gYmUgbW9kaWZpZWQuXG4gICAqIFdoZW4gbm90IGNvbmZpZ3VyZWQsIHRoZSBDREsgYXR0ZW1wdHMgdG8gYXV0by1kZXRlcm1pbmUgdGhpcy4gRm9yIGVudmlyb25tZW50IGFnbm9zdGljIHN0YWNrcywgaS5lLiwgc3RhY2tzXG4gICAqIHdoZXJlIHRoZSBhY2NvdW50IGlzIG5vdCBzcGVjaWZpZWQgd2l0aCB0aGUgYGVudmAgcHJvcGVydHksIHRoaXMgaXMgZGV0ZXJtaW5lZCB0byBiZSBmYWxzZS5cbiAgICpcbiAgICogU2V0IHRoaXMgdG8gcHJvcGVydHkgKk9OTFkgSUYqIHRoZSBpbXBvcnRlZCBmdW5jdGlvbiBpcyBpbiB0aGUgc2FtZSBhY2NvdW50IGFzIHRoZSBzdGFja1xuICAgKiBpdCdzIGltcG9ydGVkIGluLlxuICAgKiBAZGVmYXVsdCAtIGRlcGVuZHM6IHRydWUsIGlmIHRoZSBTdGFjayBpcyBjb25maWd1cmVkIHdpdGggYW4gZXhwbGljaXQgYGVudmAgKGFjY291bnQgYW5kIHJlZ2lvbikgYW5kIHRoZSBhY2NvdW50IGlzIHRoZSBzYW1lIGFzIHRoaXMgZnVuY3Rpb24uXG4gICAqIEZvciBlbnZpcm9ubWVudC1hZ25vc3RpYyBzdGFja3MgdGhpcyB3aWxsIGRlZmF1bHQgdG8gYGZhbHNlYC5cbiAgICovXG4gIHJlYWRvbmx5IHNhbWVFbnZpcm9ubWVudD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNldHRpbmcgdGhpcyBwcm9wZXJ0eSBpbmZvcm1zIHRoZSBDREsgdGhhdCB0aGUgaW1wb3J0ZWQgZnVuY3Rpb24gQUxSRUFEWSBIQVMgdGhlIG5lY2Vzc2FyeSBwZXJtaXNzaW9uc1xuICAgKiBmb3Igd2hhdCB5b3UgYXJlIHRyeWluZyB0byBkby4gV2hlbiBub3QgY29uZmlndXJlZCwgdGhlIENESyBhdHRlbXB0cyB0byBhdXRvLWRldGVybWluZSB3aGV0aGVyIG9yIG5vdFxuICAgKiBhZGRpdGlvbmFsIHBlcm1pc3Npb25zIGFyZSBuZWNlc3Nhcnkgb24gdGhlIGZ1bmN0aW9uIHdoZW4gZ3JhbnQgQVBJcyBhcmUgdXNlZC4gSWYgdGhlIENESyB0cmllZCB0byBhZGRcbiAgICogcGVybWlzc2lvbnMgb24gYW4gaW1wb3J0ZWQgbGFtYmRhLCBpdCB3aWxsIGZhaWwuXG4gICAqXG4gICAqIFNldCB0aGlzIHByb3BlcnR5ICpPTkxZIElGKiB5b3UgYXJlIGNvbW1pdHRpbmcgdG8gbWFuYWdlIHRoZSBpbXBvcnRlZCBmdW5jdGlvbidzIHBlcm1pc3Npb25zIG91dHNpZGUgb2ZcbiAgICogQ0RLLiBZb3UgYXJlIGFja25vd2xlZGdpbmcgdGhhdCB5b3VyIENESyBjb2RlIGFsb25lIHdpbGwgaGF2ZSBpbnN1ZmZpY2llbnQgcGVybWlzc2lvbnMgdG8gYWNjZXNzIHRoZVxuICAgKiBpbXBvcnRlZCBmdW5jdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHNraXBQZXJtaXNzaW9ucz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBhcmNoaXRlY3R1cmUgb2YgdGhpcyBMYW1iZGEgRnVuY3Rpb24gKHRoaXMgaXMgYW4gb3B0aW9uYWwgYXR0cmlidXRlIGFuZCBkZWZhdWx0cyB0byBYODZfNjQpLlxuICAgKiBAZGVmYXVsdCAtIEFyY2hpdGVjdHVyZS5YODZfNjRcbiAgICovXG4gIHJlYWRvbmx5IGFyY2hpdGVjdHVyZT86IEFyY2hpdGVjdHVyZTtcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEZ1bmN0aW9uQmFzZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSUZ1bmN0aW9uLCBlYzIuSUNsaWVudFZwbkNvbm5lY3Rpb25IYW5kbGVyIHtcbiAgLyoqXG4gICAqIFRoZSBwcmluY2lwYWwgdGhpcyBMYW1iZGEgRnVuY3Rpb24gaXMgcnVubmluZyBhc1xuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGdyYW50UHJpbmNpcGFsOiBpYW0uSVByaW5jaXBhbDtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uLlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGZ1bmN0aW9uTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVJOIGZvIHRoZSBmdW5jdGlvbi5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBmdW5jdGlvbkFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSUFNIHJvbGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZnVuY3Rpb24uXG4gICAqXG4gICAqIFVuZGVmaW5lZCBpZiB0aGUgZnVuY3Rpb24gd2FzIGltcG9ydGVkIHdpdGhvdXQgYSByb2xlLlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIFRoZSBjb25zdHJ1Y3Qgbm9kZSB3aGVyZSBwZXJtaXNzaW9ucyBhcmUgYXR0YWNoZWQuXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgcGVybWlzc2lvbnNOb2RlOiBOb2RlO1xuXG4gIC8qKlxuICAgKiBUaGUgYXJjaGl0ZWN0dXJlIG9mIHRoaXMgTGFtYmRhIEZ1bmN0aW9uLlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGFyY2hpdGVjdHVyZTogQXJjaGl0ZWN0dXJlO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBhZGRQZXJtaXNzaW9uKCkgY2FsbCBhZGRzIGFueSBwZXJtaXNzaW9uc1xuICAgKlxuICAgKiBUcnVlIGZvciBuZXcgTGFtYmRhcywgZmFsc2UgZm9yIHZlcnNpb24gJExBVEVTVCBhbmQgaW1wb3J0ZWQgTGFtYmRhc1xuICAgKiBmcm9tIGRpZmZlcmVudCBhY2NvdW50cy5cbiAgICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSBjYW5DcmVhdGVQZXJtaXNzaW9uczogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIEFSTihzKSB0byBwdXQgaW50byB0aGUgcmVzb3VyY2UgZmllbGQgb2YgdGhlIGdlbmVyYXRlZCBJQU0gcG9saWN5IGZvciBncmFudEludm9rZSgpXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgcmVzb3VyY2VBcm5zRm9yR3JhbnRJbnZva2U6IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSB1c2VyIGRlY2lkZXMgdG8gc2tpcCBhZGRpbmcgcGVybWlzc2lvbnMuXG4gICAqIFRoZSBvbmx5IHVzZSBjYXNlIGlzIGZvciBjcm9zcy1hY2NvdW50LCBpbXBvcnRlZCBsYW1iZGFzXG4gICAqIHdoZXJlIHRoZSB1c2VyIGNvbW1pdHMgdG8gbW9kaWZ5aW5nIHRoZSBwZXJtaXNzc2lvbnNcbiAgICogb24gdGhlIGltcG9ydGVkIGxhbWJkYSBvdXRzaWRlIENESy5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVhZG9ubHkgX3NraXBQZXJtaXNzaW9ucz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEFjdHVhbCBjb25uZWN0aW9ucyBvYmplY3QgZm9yIHRoaXMgTGFtYmRhXG4gICAqXG4gICAqIE1heSBiZSB1bnNldCwgaW4gd2hpY2ggY2FzZSB0aGlzIExhbWJkYSBpcyBub3QgY29uZmlndXJlZCB1c2UgaW4gYSBWUEMuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJvdGVjdGVkIF9jb25uZWN0aW9ucz86IGVjMi5Db25uZWN0aW9ucztcblxuICBwcml2YXRlIF9sYXRlc3RWZXJzaW9uPzogTGF0ZXN0VmVyc2lvbjtcblxuICAvKipcbiAgICogRmxhZyB0byBkZWxheSBhZGRpbmcgYSB3YXJuaW5nIG1lc3NhZ2UgdW50aWwgY3VycmVudCB2ZXJzaW9uIGlzIGludm9rZWQuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJvdGVjdGVkIF93YXJuSWZDdXJyZW50VmVyc2lvbkNhbGxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBNYXBwaW5nIG9mIGludm9jYXRpb24gcHJpbmNpcGFscyB0byBncmFudHMuIFVzZWQgdG8gZGUtZHVwZSBgZ3JhbnRJbnZva2UoKWAgY2FsbHMuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJvdGVjdGVkIF9pbnZvY2F0aW9uR3JhbnRzOiBSZWNvcmQ8c3RyaW5nLCBpYW0uR3JhbnQ+ID0ge307XG5cbiAgLyoqXG4gICAqIE1hcHBpbmcgb2YgZnVjbnRpb24gVVJMIGludm9jYXRpb24gcHJpbmNpcGFscyB0byBncmFudHMuIFVzZWQgdG8gZGUtZHVwZSBgZ3JhbnRJbnZva2VVcmwoKWAgY2FsbHMuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJvdGVjdGVkIF9mdW5jdGlvblVybEludm9jYXRpb25HcmFudHM6IFJlY29yZDxzdHJpbmcsIGlhbS5HcmFudD4gPSB7fTtcblxuICAvKipcbiAgICogQSB3YXJuaW5nIHdpbGwgYmUgYWRkZWQgdG8gZnVuY3Rpb25zIHVuZGVyIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAgICogLSBwZXJtaXNzaW9ucyB0aGF0IGluY2x1ZGUgYGxhbWJkYTpJbnZva2VGdW5jdGlvbmAgYXJlIGFkZGVkIHRvIHRoZSB1bnF1YWxpZmllZCBmdW5jdGlvbi5cbiAgICogLSBmdW5jdGlvbi5jdXJyZW50VmVyc2lvbiBpcyBpbnZva2VkIGJlZm9yZSBvciBhZnRlciB0aGUgcGVybWlzc2lvbiBpcyBjcmVhdGVkLlxuICAgKlxuICAgKiBUaGlzIGFwcGxpZXMgb25seSB0byBwZXJtaXNzaW9ucyBvbiBMYW1iZGEgZnVuY3Rpb25zLCBub3QgdmVyc2lvbnMgb3IgYWxpYXNlcy5cbiAgICogVGhpcyBmdW5jdGlvbiBpcyBvdmVycmlkZGVuIGFzIGEgbm9PcCBmb3IgUXVhbGlmaWVkRnVuY3Rpb25CYXNlLlxuICAgKi9cbiAgcHVibGljIGNvbnNpZGVyV2FybmluZ09uSW52b2tlRnVuY3Rpb25QZXJtaXNzaW9ucyhzY29wZTogQ29uc3RydWN0LCBhY3Rpb246IHN0cmluZykge1xuICAgIGNvbnN0IGFmZmVjdGVkUGVybWlzc2lvbnMgPSBbJ2xhbWJkYTpJbnZva2VGdW5jdGlvbicsICdsYW1iZGE6KicsICdsYW1iZGE6SW52b2tlKiddO1xuICAgIGlmIChhZmZlY3RlZFBlcm1pc3Npb25zLmluY2x1ZGVzKGFjdGlvbikpIHtcbiAgICAgIGlmIChzY29wZS5ub2RlLnRyeUZpbmRDaGlsZCgnQ3VycmVudFZlcnNpb24nKSkge1xuICAgICAgICB0aGlzLndhcm5JbnZva2VGdW5jdGlvblBlcm1pc3Npb25zKHNjb3BlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3dhcm5JZkN1cnJlbnRWZXJzaW9uQ2FsbGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgd2Fybkludm9rZUZ1bmN0aW9uUGVybWlzc2lvbnMoc2NvcGU6IENvbnN0cnVjdCk6IHZvaWQge1xuICAgIEFubm90YXRpb25zLm9mKHNjb3BlKS5hZGRXYXJuaW5nKFtcbiAgICAgIFwiQVdTIExhbWJkYSBoYXMgY2hhbmdlZCB0aGVpciBhdXRob3JpemF0aW9uIHN0cmF0ZWd5LCB3aGljaCBtYXkgY2F1c2UgY2xpZW50IGludm9jYXRpb25zIHVzaW5nIHRoZSAnUXVhbGlmaWVyJyBwYXJhbWV0ZXIgb2YgdGhlIGxhbWJkYSBmdW5jdGlvbiB0byBmYWlsIHdpdGggQWNjZXNzIERlbmllZCBlcnJvcnMuXCIsXG4gICAgICBcIklmIHlvdSBhcmUgdXNpbmcgYSBsYW1iZGEgVmVyc2lvbiBvciBBbGlhcywgbWFrZSBzdXJlIHRvIGNhbGwgJ2dyYW50SW52b2tlJyBvciAnYWRkUGVybWlzc2lvbicgb24gdGhlIFZlcnNpb24gb3IgQWxpYXMsIG5vdCB0aGUgdW5kZXJseWluZyBGdW5jdGlvblwiLFxuICAgICAgJ1NlZTogaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL2lzc3Vlcy8xOTI3MycsXG4gICAgXS5qb2luKCdcXG4nKSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHBlcm1pc3Npb24gdG8gdGhlIExhbWJkYSByZXNvdXJjZSBwb2xpY3kuXG4gICAqIEBwYXJhbSBpZCBUaGUgaWQgZm9yIHRoZSBwZXJtaXNzaW9uIGNvbnN0cnVjdFxuICAgKiBAcGFyYW0gcGVybWlzc2lvbiBUaGUgcGVybWlzc2lvbiB0byBncmFudCB0byB0aGlzIExhbWJkYSBmdW5jdGlvbi4gQHNlZSBQZXJtaXNzaW9uIGZvciBkZXRhaWxzLlxuICAgKi9cbiAgcHVibGljIGFkZFBlcm1pc3Npb24oaWQ6IHN0cmluZywgcGVybWlzc2lvbjogUGVybWlzc2lvbikge1xuICAgIGlmICghdGhpcy5jYW5DcmVhdGVQZXJtaXNzaW9ucykge1xuICAgICAgLy8gRklYTUU6IEBkZXByZWNhdGVkKHYyKSAtIHRocm93IGFuIGVycm9yIGlmIGNhbGxpbmcgYGFkZFBlcm1pc3Npb25gIG9uIGEgcmVzb3VyY2UgdGhhdCBkb2Vzbid0IHN1cHBvcnQgaXQuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHByaW5jaXBhbCA9IHRoaXMucGFyc2VQZXJtaXNzaW9uUHJpbmNpcGFsKHBlcm1pc3Npb24ucHJpbmNpcGFsKTtcblxuICAgIGxldCB7IHNvdXJjZUFybiwgc291cmNlQWNjb3VudCwgcHJpbmNpcGFsT3JnSUQgfSA9IHRoaXMudmFsaWRhdGVDb25kaXRpb25Db21iaW5hdGlvbnMocGVybWlzc2lvbi5wcmluY2lwYWwpID8/IHt9O1xuXG4gICAgY29uc3QgYWN0aW9uID0gcGVybWlzc2lvbi5hY3Rpb24gPz8gJ2xhbWJkYTpJbnZva2VGdW5jdGlvbic7XG4gICAgY29uc3Qgc2NvcGUgPSBwZXJtaXNzaW9uLnNjb3BlID8/IHRoaXM7XG5cbiAgICB0aGlzLmNvbnNpZGVyV2FybmluZ09uSW52b2tlRnVuY3Rpb25QZXJtaXNzaW9ucyhzY29wZSwgYWN0aW9uKTtcblxuICAgIG5ldyBDZm5QZXJtaXNzaW9uKHNjb3BlLCBpZCwge1xuICAgICAgYWN0aW9uLFxuICAgICAgcHJpbmNpcGFsLFxuICAgICAgZnVuY3Rpb25OYW1lOiB0aGlzLmZ1bmN0aW9uQXJuLFxuICAgICAgZXZlbnRTb3VyY2VUb2tlbjogcGVybWlzc2lvbi5ldmVudFNvdXJjZVRva2VuLFxuICAgICAgc291cmNlQWNjb3VudDogcGVybWlzc2lvbi5zb3VyY2VBY2NvdW50ID8/IHNvdXJjZUFjY291bnQsXG4gICAgICBzb3VyY2VBcm46IHBlcm1pc3Npb24uc291cmNlQXJuID8/IHNvdXJjZUFybixcbiAgICAgIHByaW5jaXBhbE9yZ0lkOiBwZXJtaXNzaW9uLm9yZ2FuaXphdGlvbklkID8/IHByaW5jaXBhbE9yZ0lELFxuICAgICAgZnVuY3Rpb25VcmxBdXRoVHlwZTogcGVybWlzc2lvbi5mdW5jdGlvblVybEF1dGhUeXBlLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBzdGF0ZW1lbnQgdG8gdGhlIElBTSByb2xlIGFzc3VtZWQgYnkgdGhlIGluc3RhbmNlLlxuICAgKi9cbiAgcHVibGljIGFkZFRvUm9sZVBvbGljeShzdGF0ZW1lbnQ6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQpIHtcbiAgICBpZiAoIXRoaXMucm9sZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMucm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShzdGF0ZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFjY2VzcyB0aGUgQ29ubmVjdGlvbnMgb2JqZWN0XG4gICAqXG4gICAqIFdpbGwgZmFpbCBpZiBub3QgYSBWUEMtZW5hYmxlZCBMYW1iZGEgRnVuY3Rpb25cbiAgICovXG4gIHB1YmxpYyBnZXQgY29ubmVjdGlvbnMoKTogZWMyLkNvbm5lY3Rpb25zIHtcbiAgICBpZiAoIXRoaXMuX2Nvbm5lY3Rpb25zKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IFZQQy1hc3NvY2lhdGVkIExhbWJkYSBGdW5jdGlvbnMgaGF2ZSBzZWN1cml0eSBncm91cHMgdG8gbWFuYWdlLiBTdXBwbHkgdGhlIFwidnBjXCIgcGFyYW1ldGVyIHdoZW4gY3JlYXRpbmcgdGhlIExhbWJkYSwgb3IgXCJzZWN1cml0eUdyb3VwSWRcIiB3aGVuIGltcG9ydGluZyBpdC4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3Rpb25zO1xuICB9XG5cbiAgcHVibGljIGdldCBsYXRlc3RWZXJzaW9uKCk6IElWZXJzaW9uIHtcbiAgICBpZiAoIXRoaXMuX2xhdGVzdFZlcnNpb24pIHtcbiAgICAgIHRoaXMuX2xhdGVzdFZlcnNpb24gPSBuZXcgTGF0ZXN0VmVyc2lvbih0aGlzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2xhdGVzdFZlcnNpb247XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhpcyBMYW1iZGEgZnVuY3Rpb24gd2FzIGJvdW5kIHRvIGEgVlBDXG4gICAqXG4gICAqIElmIHRoaXMgaXMgaXMgYGZhbHNlYCwgdHJ5aW5nIHRvIGFjY2VzcyB0aGUgYGNvbm5lY3Rpb25zYCBvYmplY3Qgd2lsbCBmYWlsLlxuICAgKi9cbiAgcHVibGljIGdldCBpc0JvdW5kVG9WcGMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5fY29ubmVjdGlvbnM7XG4gIH1cblxuICBwdWJsaWMgYWRkRXZlbnRTb3VyY2VNYXBwaW5nKGlkOiBzdHJpbmcsIG9wdGlvbnM6IEV2ZW50U291cmNlTWFwcGluZ09wdGlvbnMpOiBFdmVudFNvdXJjZU1hcHBpbmcge1xuICAgIHJldHVybiBuZXcgRXZlbnRTb3VyY2VNYXBwaW5nKHRoaXMsIGlkLCB7XG4gICAgICB0YXJnZXQ6IHRoaXMsXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50IHRoZSBnaXZlbiBpZGVudGl0eSBwZXJtaXNzaW9ucyB0byBpbnZva2UgdGhpcyBMYW1iZGFcbiAgICovXG4gIHB1YmxpYyBncmFudEludm9rZShncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgY29uc3QgaGFzaCA9IGNyZWF0ZUhhc2goJ3NoYTI1NicpXG4gICAgICAudXBkYXRlKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgcHJpbmNpcGFsOiBncmFudGVlLmdyYW50UHJpbmNpcGFsLnRvU3RyaW5nKCksXG4gICAgICAgIGNvbmRpdGlvbnM6IGdyYW50ZWUuZ3JhbnRQcmluY2lwYWwucG9saWN5RnJhZ21lbnQuY29uZGl0aW9ucyxcbiAgICAgIH0pLCAndXRmOCcpXG4gICAgICAuZGlnZXN0KCdiYXNlNjQnKTtcbiAgICBjb25zdCBpZGVudGlmaWVyID0gYEludm9rZSR7aGFzaH1gO1xuXG4gICAgLy8gTWVtb2l6ZSB0aGUgcmVzdWx0IHNvIHN1YnNlcXVlbnQgZ3JhbnRJbnZva2UoKSBjYWxscyBhcmUgaWRlbXBvdGVudFxuICAgIGxldCBncmFudCA9IHRoaXMuX2ludm9jYXRpb25HcmFudHNbaWRlbnRpZmllcl07XG4gICAgaWYgKCFncmFudCkge1xuICAgICAgZ3JhbnQgPSB0aGlzLmdyYW50KGdyYW50ZWUsIGlkZW50aWZpZXIsICdsYW1iZGE6SW52b2tlRnVuY3Rpb24nLCB0aGlzLnJlc291cmNlQXJuc0ZvckdyYW50SW52b2tlKTtcbiAgICAgIHRoaXMuX2ludm9jYXRpb25HcmFudHNbaWRlbnRpZmllcl0gPSBncmFudDtcbiAgICB9XG4gICAgcmV0dXJuIGdyYW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50IHRoZSBnaXZlbiBpZGVudGl0eSBwZXJtaXNzaW9ucyB0byBpbnZva2UgdGhpcyBMYW1iZGEgRnVuY3Rpb24gVVJMXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRJbnZva2VVcmwoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQge1xuICAgIGNvbnN0IGlkZW50aWZpZXIgPSBgSW52b2tlRnVuY3Rpb25Vcmwke2dyYW50ZWUuZ3JhbnRQcmluY2lwYWx9YDsgLy8gY2FsbHMgdGhlIC50b1N0cmluZygpIG9mIHRoZSBwcmluY2lwYWxcblxuICAgIC8vIE1lbW9pemUgdGhlIHJlc3VsdCBzbyBzdWJzZXF1ZW50IGdyYW50SW52b2tlKCkgY2FsbHMgYXJlIGlkZW1wb3RlbnRcbiAgICBsZXQgZ3JhbnQgPSB0aGlzLl9mdW5jdGlvblVybEludm9jYXRpb25HcmFudHNbaWRlbnRpZmllcl07XG4gICAgaWYgKCFncmFudCkge1xuICAgICAgZ3JhbnQgPSB0aGlzLmdyYW50KGdyYW50ZWUsIGlkZW50aWZpZXIsICdsYW1iZGE6SW52b2tlRnVuY3Rpb25VcmwnLCBbdGhpcy5mdW5jdGlvbkFybl0sIHtcbiAgICAgICAgZnVuY3Rpb25VcmxBdXRoVHlwZTogRnVuY3Rpb25VcmxBdXRoVHlwZS5BV1NfSUFNLFxuICAgICAgfSk7XG4gICAgICB0aGlzLl9mdW5jdGlvblVybEludm9jYXRpb25HcmFudHNbaWRlbnRpZmllcl0gPSBncmFudDtcbiAgICB9XG4gICAgcmV0dXJuIGdyYW50O1xuICB9XG5cbiAgcHVibGljIGFkZEV2ZW50U291cmNlKHNvdXJjZTogSUV2ZW50U291cmNlKSB7XG4gICAgc291cmNlLmJpbmQodGhpcyk7XG4gIH1cblxuICBwdWJsaWMgY29uZmlndXJlQXN5bmNJbnZva2Uob3B0aW9uczogRXZlbnRJbnZva2VDb25maWdPcHRpb25zKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubm9kZS50cnlGaW5kQ2hpbGQoJ0V2ZW50SW52b2tlQ29uZmlnJykgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBbiBFdmVudEludm9rZUNvbmZpZyBoYXMgYWxyZWFkeSBiZWVuIGNvbmZpZ3VyZWQgZm9yIHRoZSBmdW5jdGlvbiBhdCAke3RoaXMubm9kZS5wYXRofWApO1xuICAgIH1cblxuICAgIG5ldyBFdmVudEludm9rZUNvbmZpZyh0aGlzLCAnRXZlbnRJbnZva2VDb25maWcnLCB7XG4gICAgICBmdW5jdGlvbjogdGhpcyxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYWRkRnVuY3Rpb25Vcmwob3B0aW9ucz86IEZ1bmN0aW9uVXJsT3B0aW9ucyk6IEZ1bmN0aW9uVXJsIHtcbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uVXJsKHRoaXMsICdGdW5jdGlvblVybCcsIHtcbiAgICAgIGZ1bmN0aW9uOiB0aGlzLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjb25zdHJ1Y3QgdHJlZSBub2RlIHRoYXQgY29ycmVzcG9uZHMgdG8gdGhlIGxhbWJkYSBmdW5jdGlvbi5cbiAgICogRm9yIHVzZSBpbnRlcm5hbGx5IGZvciBjb25zdHJ1Y3RzLCB3aGVuIHRoZSB0cmVlIGlzIHNldCB1cCBpbiBub24tc3RhbmRhcmQgd2F5cy4gRXg6IFNpbmdsZXRvbkZ1bmN0aW9uLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByb3RlY3RlZCBfZnVuY3Rpb25Ob2RlKCk6IE5vZGUge1xuICAgIHJldHVybiB0aGlzLm5vZGU7XG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gdGhlIGZ1bmN0aW9uIGFybiwgY2hlY2sgaWYgdGhlIGFjY291bnQgaWQgbWF0Y2hlcyB0aGlzIGFjY291bnRcbiAgICpcbiAgICogRnVuY3Rpb24gQVJOcyBsb29rIGxpa2UgdGhpczpcbiAgICpcbiAgICogICBhcm46YXdzOmxhbWJkYTpyZWdpb246YWNjb3VudC1pZDpmdW5jdGlvbjpmdW5jdGlvbi1uYW1lXG4gICAqXG4gICAqIC4ud2hpY2ggbWVhbnMgdGhhdCBpbiBvcmRlciB0byBleHRyYWN0IHRoZSBgYWNjb3VudC1pZGAgY29tcG9uZW50IGZyb20gdGhlIEFSTiwgd2UgY2FuXG4gICAqIHNwbGl0IHRoZSBBUk4gdXNpbmcgXCI6XCIgYW5kIHNlbGVjdCB0aGUgY29tcG9uZW50IGluIGluZGV4IDQuXG4gICAqXG4gICAqIEByZXR1cm5zIHRydWUgaWYgYWNjb3VudCBpZCBvZiBmdW5jdGlvbiBtYXRjaGVzIHRoZSBhY2NvdW50IHNwZWNpZmllZCBvbiB0aGUgc3RhY2ssIGZhbHNlIG90aGVyd2lzZS5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcm90ZWN0ZWQgX2lzU3RhY2tBY2NvdW50KCk6IGJvb2xlYW4ge1xuICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQodGhpcy5zdGFjay5hY2NvdW50KSB8fCBUb2tlbi5pc1VucmVzb2x2ZWQodGhpcy5mdW5jdGlvbkFybikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3RhY2suc3BsaXRBcm4odGhpcy5mdW5jdGlvbkFybiwgQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUpLmFjY291bnQgPT09IHRoaXMuc3RhY2suYWNjb3VudDtcbiAgfVxuXG4gIHByaXZhdGUgZ3JhbnQoXG4gICAgZ3JhbnRlZTogaWFtLklHcmFudGFibGUsXG4gICAgaWRlbnRpZmllcjpzdHJpbmcsXG4gICAgYWN0aW9uOiBzdHJpbmcsXG4gICAgcmVzb3VyY2VBcm5zOiBzdHJpbmdbXSxcbiAgICBwZXJtaXNzaW9uT3ZlcnJpZGVzPzogUGFydGlhbDxQZXJtaXNzaW9uPixcbiAgKTogaWFtLkdyYW50IHtcbiAgICBjb25zdCBncmFudCA9IGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbE9yUmVzb3VyY2Uoe1xuICAgICAgZ3JhbnRlZSxcbiAgICAgIGFjdGlvbnM6IFthY3Rpb25dLFxuICAgICAgcmVzb3VyY2VBcm5zLFxuXG4gICAgICAvLyBGYWtlIHJlc291cmNlLWxpa2Ugb2JqZWN0IG9uIHdoaWNoIHRvIGNhbGwgYWRkVG9SZXNvdXJjZVBvbGljeSgpLCB3aGljaCBhY3R1YWxseVxuICAgICAgLy8gY2FsbHMgYWRkUGVybWlzc2lvbigpXG4gICAgICByZXNvdXJjZToge1xuICAgICAgICBhZGRUb1Jlc291cmNlUG9saWN5OiAoX3N0YXRlbWVudCkgPT4ge1xuICAgICAgICAgIC8vIENvdWxkbid0IGFkZCBwZXJtaXNzaW9ucyB0byB0aGUgcHJpbmNpcGFsLCBzbyBhZGQgdGhlbSBsb2NhbGx5LlxuICAgICAgICAgIHRoaXMuYWRkUGVybWlzc2lvbihpZGVudGlmaWVyLCB7XG4gICAgICAgICAgICBwcmluY2lwYWw6IGdyYW50ZWUuZ3JhbnRQcmluY2lwYWwhLFxuICAgICAgICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICAgICAgICAuLi5wZXJtaXNzaW9uT3ZlcnJpZGVzLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgY29uc3QgcGVybWlzc2lvbk5vZGUgPSB0aGlzLl9mdW5jdGlvbk5vZGUoKS50cnlGaW5kQ2hpbGQoaWRlbnRpZmllcik7XG4gICAgICAgICAgaWYgKCFwZXJtaXNzaW9uTm9kZSAmJiAhdGhpcy5fc2tpcFBlcm1pc3Npb25zKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBtb2RpZnkgcGVybWlzc2lvbiB0byBsYW1iZGEgZnVuY3Rpb24uIEZ1bmN0aW9uIGlzIGVpdGhlciBpbXBvcnRlZCBvciAkTEFURVNUIHZlcnNpb24uXFxuJ1xuICAgICAgICAgICAgICArICdJZiB0aGUgZnVuY3Rpb24gaXMgaW1wb3J0ZWQgZnJvbSB0aGUgc2FtZSBhY2NvdW50IHVzZSBgZnJvbUZ1bmN0aW9uQXR0cmlidXRlcygpYCBBUEkgd2l0aCB0aGUgYHNhbWVFbnZpcm9ubWVudGAgZmxhZy5cXG4nXG4gICAgICAgICAgICAgICsgJ0lmIHRoZSBmdW5jdGlvbiBpcyBpbXBvcnRlZCBmcm9tIGEgZGlmZmVyZW50IGFjY291bnQgYW5kIGFscmVhZHkgaGFzIHRoZSBjb3JyZWN0IHBlcm1pc3Npb25zIHVzZSBgZnJvbUZ1bmN0aW9uQXR0cmlidXRlcygpYCBBUEkgd2l0aCB0aGUgYHNraXBQZXJtaXNzaW9uc2AgZmxhZy4nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHsgc3RhdGVtZW50QWRkZWQ6IHRydWUsIHBvbGljeURlcGVuZGFibGU6IHBlcm1pc3Npb25Ob2RlIH07XG4gICAgICAgIH0sXG4gICAgICAgIG5vZGU6IHRoaXMubm9kZSxcbiAgICAgICAgc3RhY2s6IHRoaXMuc3RhY2ssXG4gICAgICAgIGVudjogdGhpcy5lbnYsXG4gICAgICAgIGFwcGx5UmVtb3ZhbFBvbGljeTogdGhpcy5hcHBseVJlbW92YWxQb2xpY3ksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGdyYW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYW5zbGF0ZSBJUHJpbmNpcGFsIHRvIHNvbWV0aGluZyB3ZSBjYW4gcGFzcyB0byBBV1M6OkxhbWJkYTo6UGVybWlzc2lvbnNcbiAgICpcbiAgICogRG8gc29tZSBuYXN0eSB0aGluZ3MgYmVjYXVzZSBgUGVybWlzc2lvbmAgc3VwcG9ydHMgYSBzdWJzZXQgb2Ygd2hhdCB0aGVcbiAgICogZnVsbCBJQU0gcHJpbmNpcGFsIGxhbmd1YWdlIHN1cHBvcnRzLCBhbmQgd2UgbWF5IG5vdCBiZSBhYmxlIHRvIHBhcnNlIHN0cmluZ3NcbiAgICogb3V0cmlnaHQgYmVjYXVzZSB0aGV5IG1heSBiZSB0b2tlbnMuXG4gICAqXG4gICAqIFRyeSB0byByZWNvZ25pemUgc29tZSBzcGVjaWZpYyBQcmluY2lwYWwgY2xhc3NlcyBmaXJzdCwgdGhlbiB0cnkgYSBnZW5lcmljXG4gICAqIGZhbGxiYWNrLlxuICAgKi9cbiAgcHJpdmF0ZSBwYXJzZVBlcm1pc3Npb25QcmluY2lwYWwocHJpbmNpcGFsOiBpYW0uSVByaW5jaXBhbCkge1xuICAgIC8vIFRyeSBzb21lIHNwZWNpZmljIGNvbW1vbiBjbGFzc2VzIGZpcnN0LlxuICAgIC8vIHVzZSBkdWNrLXR5cGluZywgbm90IGluc3RhbmNlIG9mXG4gICAgaWYgKCd3cmFwcGVkJyBpbiBwcmluY2lwYWwpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkb3Qtbm90YXRpb25cbiAgICAgIHByaW5jaXBhbCA9IHByaW5jaXBhbFsnd3JhcHBlZCddO1xuICAgIH1cblxuICAgIGlmICgnYWNjb3VudElkJyBpbiBwcmluY2lwYWwpIHtcbiAgICAgIHJldHVybiAocHJpbmNpcGFsIGFzIGlhbS5BY2NvdW50UHJpbmNpcGFsKS5hY2NvdW50SWQ7XG4gICAgfVxuXG4gICAgaWYgKCdzZXJ2aWNlJyBpbiBwcmluY2lwYWwpIHtcbiAgICAgIHJldHVybiAocHJpbmNpcGFsIGFzIGlhbS5TZXJ2aWNlUHJpbmNpcGFsKS5zZXJ2aWNlO1xuICAgIH1cblxuICAgIGlmICgnYXJuJyBpbiBwcmluY2lwYWwpIHtcbiAgICAgIHJldHVybiAocHJpbmNpcGFsIGFzIGlhbS5Bcm5QcmluY2lwYWwpLmFybjtcbiAgICB9XG5cbiAgICBjb25zdCBzdHJpbmdFcXVhbHMgPSBtYXRjaFNpbmdsZUtleSgnU3RyaW5nRXF1YWxzJywgcHJpbmNpcGFsLnBvbGljeUZyYWdtZW50LmNvbmRpdGlvbnMpO1xuICAgIGlmIChzdHJpbmdFcXVhbHMpIHtcbiAgICAgIGNvbnN0IG9yZ0lkID0gbWF0Y2hTaW5nbGVLZXkoJ2F3czpQcmluY2lwYWxPcmdJRCcsIHN0cmluZ0VxdWFscyk7XG4gICAgICBpZiAob3JnSWQpIHtcbiAgICAgICAgLy8gd2Ugd2lsbCBtb3ZlIHRoZSBvcmdhbml6YXRpb24gaWQgdG8gdGhlIGBwcmluY2lwYWxPcmdJZGAgcHJvcGVydHkgb2YgYFBlcm1pc3Npb25zYC5cbiAgICAgICAgcmV0dXJuICcqJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUcnkgYSBiZXN0LWVmZm9ydCBhcHByb2FjaCB0byBzdXBwb3J0IHNpbXBsZSBwcmluY2lwYWxzIHRoYXQgYXJlIG5vdCBhbnkgb2YgdGhlIHByZWRlZmluZWRcbiAgICAvLyBjbGFzc2VzLCBidXQgYXJlIHNpbXBsZSBlbm91Z2ggdGhhdCB0aGV5IHdpbGwgZml0IGludG8gdGhlIFBlcm1pc3Npb24gbW9kZWwuIE1haW4gdGFyZ2V0XG4gICAgLy8gaGVyZTogaW1wb3J0ZWQgUm9sZXMsIFVzZXJzLCBHcm91cHMuXG4gICAgLy9cbiAgICAvLyBUaGUgcHJpbmNpcGFsIGNhbm5vdCBoYXZlIGNvbmRpdGlvbnMgYW5kIG11c3QgaGF2ZSBhIHNpbmdsZSB7IEFXUzogW2Fybl0gfSBlbnRyeS5cbiAgICBjb25zdCBqc29uID0gcHJpbmNpcGFsLnBvbGljeUZyYWdtZW50LnByaW5jaXBhbEpzb247XG4gICAgaWYgKE9iamVjdC5rZXlzKHByaW5jaXBhbC5wb2xpY3lGcmFnbWVudC5jb25kaXRpb25zKS5sZW5ndGggPT09IDAgJiYganNvbi5BV1MpIHtcbiAgICAgIGlmICh0eXBlb2YganNvbi5BV1MgPT09ICdzdHJpbmcnKSB7IHJldHVybiBqc29uLkFXUzsgfVxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoanNvbi5BV1MpICYmIGpzb24uQVdTLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YganNvbi5BV1NbMF0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBqc29uLkFXU1swXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcHJpbmNpcGFsIHR5cGUgZm9yIExhbWJkYSBwZXJtaXNzaW9uIHN0YXRlbWVudDogJHtwcmluY2lwYWwuY29uc3RydWN0b3IubmFtZX0uIGAgK1xuICAgICAgJ1N1cHBvcnRlZDogQWNjb3VudFByaW5jaXBhbCwgQXJuUHJpbmNpcGFsLCBTZXJ2aWNlUHJpbmNpcGFsLCBPcmdhbml6YXRpb25QcmluY2lwYWwnKTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHZhbHVlIGF0IHRoZSBrZXkgaWYgdGhlIG9iamVjdCBjb250YWlucyB0aGUga2V5IGFuZCBub3RoaW5nIGVsc2UuIE90aGVyd2lzZSxcbiAgICAgKiByZXR1cm5zIHVuZGVmaW5lZC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBtYXRjaFNpbmdsZUtleShrZXk6IHN0cmluZywgb2JqOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogYW55IHwgdW5kZWZpbmVkIHtcbiAgICAgIGlmIChPYmplY3Qua2V5cyhvYmopLmxlbmd0aCAhPT0gMSkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG5cbiAgICAgIHJldHVybiBvYmpba2V5XTtcbiAgICB9XG5cbiAgfVxuXG4gIHByaXZhdGUgdmFsaWRhdGVDb25kaXRpb25Db21iaW5hdGlvbnMocHJpbmNpcGFsOiBpYW0uSVByaW5jaXBhbCk6IHtcbiAgICBzb3VyY2VBcm46IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgICBzb3VyY2VBY2NvdW50OiBzdHJpbmcgfCB1bmRlZmluZWQsXG4gICAgcHJpbmNpcGFsT3JnSUQ6IHN0cmluZyB8IHVuZGVmaW5lZCxcbiAgfSB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgY29uZGl0aW9ucyA9IHRoaXMudmFsaWRhdGVDb25kaXRpb25zKHByaW5jaXBhbCk7XG5cbiAgICBpZiAoIWNvbmRpdGlvbnMpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuXG4gICAgY29uc3Qgc291cmNlQXJuID0gcmVxdWlyZVN0cmluZyhyZXF1aXJlT2JqZWN0KGNvbmRpdGlvbnMuQXJuTGlrZSk/LlsnYXdzOlNvdXJjZUFybiddKTtcbiAgICBjb25zdCBzb3VyY2VBY2NvdW50ID0gcmVxdWlyZVN0cmluZyhyZXF1aXJlT2JqZWN0KGNvbmRpdGlvbnMuU3RyaW5nRXF1YWxzKT8uWydhd3M6U291cmNlQWNjb3VudCddKTtcbiAgICBjb25zdCBwcmluY2lwYWxPcmdJRCA9IHJlcXVpcmVTdHJpbmcocmVxdWlyZU9iamVjdChjb25kaXRpb25zLlN0cmluZ0VxdWFscyk/LlsnYXdzOlByaW5jaXBhbE9yZ0lEJ10pO1xuXG4gICAgLy8gUHJpbmNpcGFsT3JnSUQgY2Fubm90IGJlIGNvbWJpbmVkIHdpdGggYW55IG90aGVyIGNvbmRpdGlvbnNcbiAgICBpZiAocHJpbmNpcGFsT3JnSUQgJiYgKHNvdXJjZUFybiB8fCBzb3VyY2VBY2NvdW50KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcmluY2lwYWxXaXRoQ29uZGl0aW9ucyBoYWQgdW5zdXBwb3J0ZWQgY29uZGl0aW9uIGNvbWJpbmF0aW9ucyBmb3IgTGFtYmRhIHBlcm1pc3Npb24gc3RhdGVtZW50OiBwcmluY2lwYWxPcmdJRCBjYW5ub3QgYmUgc2V0IHdpdGggb3RoZXIgY29uZGl0aW9ucy4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgc291cmNlQXJuLFxuICAgICAgc291cmNlQWNjb3VudCxcbiAgICAgIHByaW5jaXBhbE9yZ0lELFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHZhbGlkYXRlQ29uZGl0aW9ucyhwcmluY2lwYWw6IGlhbS5JUHJpbmNpcGFsKTogaWFtLkNvbmRpdGlvbnMgfCB1bmRlZmluZWQge1xuICAgIGlmICh0aGlzLmlzUHJpbmNpcGFsV2l0aENvbmRpdGlvbnMocHJpbmNpcGFsKSkge1xuICAgICAgY29uc3QgY29uZGl0aW9uczogaWFtLkNvbmRpdGlvbnMgPSBwcmluY2lwYWwucG9saWN5RnJhZ21lbnQuY29uZGl0aW9ucztcbiAgICAgIGNvbnN0IGNvbmRpdGlvblBhaXJzID0gZmxhdE1hcChcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoY29uZGl0aW9ucyksXG4gICAgICAgIChbb3BlcmF0b3IsIGNvbmRpdGlvbk9ianNdKSA9PiBPYmplY3Qua2V5cyhjb25kaXRpb25PYmpzIGFzIG9iamVjdCkubWFwKGtleSA9PiB7IHJldHVybiB7IG9wZXJhdG9yLCBrZXkgfTsgfSksXG4gICAgICApO1xuXG4gICAgICAvLyBUaGVzZSBhcmUgYWxsIHRoZSBzdXBwb3J0ZWQgY29uZGl0aW9ucy4gU29tZSBjb21iaW5hdGlvbnMgYXJlIG5vdCBzdXBwb3J0ZWQsXG4gICAgICAvLyBsaWtlIG9ubHkgJ2F3czpTb3VyY2VBcm4nIG9yICdhd3M6UHJpbmNpcGFsT3JnSUQnIGFuZCAnYXdzOlNvdXJjZUFjY291bnQnLlxuICAgICAgLy8gVGhlc2Ugd2lsbCBiZSB2YWxpZGF0ZWQgdGhyb3VnaCBgdGhpcy52YWxpZGF0ZUNvbmRpdGlvbkNvbWJpbmF0aW9uc2AuXG4gICAgICBjb25zdCBzdXBwb3J0ZWRQcmluY2lwYWxDb25kaXRpb25zID0gW3tcbiAgICAgICAgb3BlcmF0b3I6ICdBcm5MaWtlJyxcbiAgICAgICAga2V5OiAnYXdzOlNvdXJjZUFybicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBvcGVyYXRvcjogJ1N0cmluZ0VxdWFscycsXG4gICAgICAgIGtleTogJ2F3czpTb3VyY2VBY2NvdW50JyxcbiAgICAgIH0sIHtcbiAgICAgICAgb3BlcmF0b3I6ICdTdHJpbmdFcXVhbHMnLFxuICAgICAgICBrZXk6ICdhd3M6UHJpbmNpcGFsT3JnSUQnLFxuICAgICAgfV07XG5cbiAgICAgIGNvbnN0IHVuc3VwcG9ydGVkQ29uZGl0aW9ucyA9IGNvbmRpdGlvblBhaXJzLmZpbHRlcihcbiAgICAgICAgKGNvbmRpdGlvbikgPT4gIXN1cHBvcnRlZFByaW5jaXBhbENvbmRpdGlvbnMuc29tZShcbiAgICAgICAgICAoc3VwcG9ydGVkQ29uZGl0aW9uKSA9PiBzdXBwb3J0ZWRDb25kaXRpb24ub3BlcmF0b3IgPT09IGNvbmRpdGlvbi5vcGVyYXRvciAmJiBzdXBwb3J0ZWRDb25kaXRpb24ua2V5ID09PSBjb25kaXRpb24ua2V5LFxuICAgICAgICApLFxuICAgICAgKTtcblxuICAgICAgaWYgKHVuc3VwcG9ydGVkQ29uZGl0aW9ucy5sZW5ndGggPT0gMCkge1xuICAgICAgICByZXR1cm4gY29uZGl0aW9ucztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgUHJpbmNpcGFsV2l0aENvbmRpdGlvbnMgaGFkIHVuc3VwcG9ydGVkIGNvbmRpdGlvbnMgZm9yIExhbWJkYSBwZXJtaXNzaW9uIHN0YXRlbWVudDogJHtKU09OLnN0cmluZ2lmeSh1bnN1cHBvcnRlZENvbmRpdGlvbnMpfS4gYCArXG4gICAgICAgICAgYFN1cHBvcnRlZCBvcGVyYXRvci9jb25kaXRpb24gcGFpcnM6ICR7SlNPTi5zdHJpbmdpZnkoc3VwcG9ydGVkUHJpbmNpcGFsQ29uZGl0aW9ucyl9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByaXZhdGUgaXNQcmluY2lwYWxXaXRoQ29uZGl0aW9ucyhwcmluY2lwYWw6IGlhbS5JUHJpbmNpcGFsKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHByaW5jaXBhbC5wb2xpY3lGcmFnbWVudC5jb25kaXRpb25zKS5sZW5ndGggPiAwO1xuICB9XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBRdWFsaWZpZWRGdW5jdGlvbkJhc2UgZXh0ZW5kcyBGdW5jdGlvbkJhc2Uge1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgbGFtYmRhOiBJRnVuY3Rpb247XG5cbiAgcHVibGljIHJlYWRvbmx5IHBlcm1pc3Npb25zTm9kZSA9IHRoaXMubm9kZTtcblxuICAvKipcbiAgICogVGhlIHF1YWxpZmllciBvZiB0aGUgdmVyc2lvbiBvciBhbGlhcyBvZiB0aGlzIGZ1bmN0aW9uLlxuICAgKiBBIHF1YWxpZmllciBpcyB0aGUgaWRlbnRpZmllciB0aGF0J3MgYXBwZW5kZWQgdG8gYSB2ZXJzaW9uIG9yIGFsaWFzIEFSTi5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vbGFtYmRhL2xhdGVzdC9kZy9BUElfR2V0RnVuY3Rpb25Db25maWd1cmF0aW9uLmh0bWwjQVBJX0dldEZ1bmN0aW9uQ29uZmlndXJhdGlvbl9SZXF1ZXN0UGFyYW1ldGVyc1xuICAgKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IHF1YWxpZmllcjogc3RyaW5nO1xuXG4gIHB1YmxpYyBnZXQgbGF0ZXN0VmVyc2lvbigpIHtcbiAgICByZXR1cm4gdGhpcy5sYW1iZGEubGF0ZXN0VmVyc2lvbjtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcmVzb3VyY2VBcm5zRm9yR3JhbnRJbnZva2UoKSB7XG4gICAgcmV0dXJuIFt0aGlzLmZ1bmN0aW9uQXJuXTtcbiAgfVxuXG4gIHB1YmxpYyBjb25maWd1cmVBc3luY0ludm9rZShvcHRpb25zOiBFdmVudEludm9rZUNvbmZpZ09wdGlvbnMpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5ub2RlLnRyeUZpbmRDaGlsZCgnRXZlbnRJbnZva2VDb25maWcnKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFuIEV2ZW50SW52b2tlQ29uZmlnIGhhcyBhbHJlYWR5IGJlZW4gY29uZmlndXJlZCBmb3IgdGhlIHF1YWxpZmllZCBmdW5jdGlvbiBhdCAke3RoaXMubm9kZS5wYXRofWApO1xuICAgIH1cblxuICAgIG5ldyBFdmVudEludm9rZUNvbmZpZyh0aGlzLCAnRXZlbnRJbnZva2VDb25maWcnLCB7XG4gICAgICBmdW5jdGlvbjogdGhpcy5sYW1iZGEsXG4gICAgICBxdWFsaWZpZXI6IHRoaXMucXVhbGlmaWVyLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBjb25zaWRlcldhcm5pbmdPbkludm9rZUZ1bmN0aW9uUGVybWlzc2lvbnMoX3Njb3BlOiBDb25zdHJ1Y3QsIF9hY3Rpb246IHN0cmluZyk6IHZvaWQge1xuICAgIC8vIG5vT3BcbiAgICByZXR1cm47XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgJExBVEVTVCB2ZXJzaW9uIG9mIGEgZnVuY3Rpb24sIHVzZWZ1bCB3aGVuIGF0dGVtcHRpbmcgdG8gY3JlYXRlIGFsaWFzZXMuXG4gKi9cbmNsYXNzIExhdGVzdFZlcnNpb24gZXh0ZW5kcyBGdW5jdGlvbkJhc2UgaW1wbGVtZW50cyBJVmVyc2lvbiB7XG4gIHB1YmxpYyByZWFkb25seSBsYW1iZGE6IElGdW5jdGlvbjtcbiAgcHVibGljIHJlYWRvbmx5IHZlcnNpb24gPSAnJExBVEVTVCc7XG4gIHB1YmxpYyByZWFkb25seSBwZXJtaXNzaW9uc05vZGUgPSB0aGlzLm5vZGU7XG5cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGNhbkNyZWF0ZVBlcm1pc3Npb25zID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IobGFtYmRhOiBGdW5jdGlvbkJhc2UpIHtcbiAgICBzdXBlcihsYW1iZGEsICckTEFURVNUJyk7XG4gICAgdGhpcy5sYW1iZGEgPSBsYW1iZGE7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGZ1bmN0aW9uQXJuKCkge1xuICAgIHJldHVybiBgJHt0aGlzLmxhbWJkYS5mdW5jdGlvbkFybn06JHt0aGlzLnZlcnNpb259YDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgZnVuY3Rpb25OYW1lKCkge1xuICAgIHJldHVybiBgJHt0aGlzLmxhbWJkYS5mdW5jdGlvbk5hbWV9OiR7dGhpcy52ZXJzaW9ufWA7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGFyY2hpdGVjdHVyZSgpIHtcbiAgICByZXR1cm4gdGhpcy5sYW1iZGEuYXJjaGl0ZWN0dXJlO1xuICB9XG5cbiAgcHVibGljIGdldCBncmFudFByaW5jaXBhbCgpIHtcbiAgICByZXR1cm4gdGhpcy5sYW1iZGEuZ3JhbnRQcmluY2lwYWw7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGxhdGVzdFZlcnNpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHJvbGUoKSB7XG4gICAgcmV0dXJuIHRoaXMubGFtYmRhLnJvbGU7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGVkZ2VBcm4oKTogbmV2ZXIge1xuICAgIHRocm93IG5ldyBFcnJvcignJExBVEVTVCBmdW5jdGlvbiB2ZXJzaW9uIGNhbm5vdCBiZSB1c2VkIGZvciBMYW1iZGFARWRnZScpO1xuICB9XG5cbiAgcHVibGljIGdldCByZXNvdXJjZUFybnNGb3JHcmFudEludm9rZSgpIHtcbiAgICByZXR1cm4gW3RoaXMuZnVuY3Rpb25Bcm5dO1xuICB9XG5cbiAgcHVibGljIGFkZEFsaWFzKGFsaWFzTmFtZTogc3RyaW5nLCBvcHRpb25zOiBBbGlhc09wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiBhZGRBbGlhcyh0aGlzLCB0aGlzLCBhbGlhc05hbWUsIG9wdGlvbnMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlcXVpcmVPYmplY3QoeDogdW5rbm93bik6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIHggJiYgdHlwZW9mIHggPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KHgpID8geCBhcyBhbnkgOiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIHJlcXVpcmVTdHJpbmcoeDogdW5rbm93bik6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIHJldHVybiB4ICYmIHR5cGVvZiB4ID09PSAnc3RyaW5nJyA/IHggOiB1bmRlZmluZWQ7XG59Il19