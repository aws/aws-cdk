"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EdgeFunction = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const path = require("path");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const ssm = require("@aws-cdk/aws-ssm");
const core_1 = require("@aws-cdk/core");
/**
 * A Lambda@Edge function.
 *
 * Convenience resource for requesting a Lambda function in the 'us-east-1' region for use with Lambda@Edge.
 * Implements several restrictions enforced by Lambda@Edge.
 *
 * Note that this construct requires that the 'us-east-1' region has been bootstrapped.
 * See https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html or 'cdk bootstrap --help' for options.
 *
 * @resource AWS::Lambda::Function
 */
class EdgeFunction extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        this.isBoundToVpc = false;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudfront_experimental_EdgeFunctionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EdgeFunction);
            }
            throw error;
        }
        // Create a simple Function if we're already in us-east-1; otherwise create a cross-region stack.
        const regionIsUsEast1 = !core_1.Token.isUnresolved(this.env.region) && this.env.region === 'us-east-1';
        const { edgeFunction, edgeArn } = regionIsUsEast1
            ? this.createInRegionFunction(props)
            : this.createCrossRegionFunction(id, props);
        this.edgeArn = edgeArn;
        this.functionArn = edgeArn;
        this._edgeFunction = edgeFunction;
        this.functionName = this._edgeFunction.functionName;
        this.grantPrincipal = this._edgeFunction.role;
        this.permissionsNode = this._edgeFunction.permissionsNode;
        this.version = lambda.extractQualifierFromArn(this.functionArn);
        this.architecture = this._edgeFunction.architecture;
        this.resourceArnsForGrantInvoke = this._edgeFunction.resourceArnsForGrantInvoke;
        this.node.defaultChild = this._edgeFunction;
    }
    get lambda() {
        return this._edgeFunction;
    }
    /**
     * Convenience method to make `EdgeFunction` conform to the same interface as `Function`.
     */
    get currentVersion() {
        return this;
    }
    addAlias(aliasName, options = {}) {
        return new lambda.Alias(this._edgeFunction, `Alias${aliasName}`, {
            aliasName,
            version: this._edgeFunction.currentVersion,
            ...options,
        });
    }
    /**
     * Not supported. Connections are only applicable to VPC-enabled functions.
     */
    get connections() {
        throw new Error('Lambda@Edge does not support connections');
    }
    get latestVersion() {
        throw new Error('$LATEST function version cannot be used for Lambda@Edge');
    }
    addEventSourceMapping(id, options) {
        return this.lambda.addEventSourceMapping(id, options);
    }
    addPermission(id, permission) {
        return this.lambda.addPermission(id, permission);
    }
    addToRolePolicy(statement) {
        return this.lambda.addToRolePolicy(statement);
    }
    grantInvoke(identity) {
        return this.lambda.grantInvoke(identity);
    }
    grantInvokeUrl(identity) {
        return this.lambda.grantInvokeUrl(identity);
    }
    metric(metricName, props) {
        return this.lambda.metric(metricName, { ...props, region: EdgeFunction.EDGE_REGION });
    }
    metricDuration(props) {
        return this.lambda.metricDuration({ ...props, region: EdgeFunction.EDGE_REGION });
    }
    metricErrors(props) {
        return this.lambda.metricErrors({ ...props, region: EdgeFunction.EDGE_REGION });
    }
    metricInvocations(props) {
        return this.lambda.metricInvocations({ ...props, region: EdgeFunction.EDGE_REGION });
    }
    metricThrottles(props) {
        return this.lambda.metricThrottles({ ...props, region: EdgeFunction.EDGE_REGION });
    }
    /** Adds an event source to this function. */
    addEventSource(source) {
        return this.lambda.addEventSource(source);
    }
    configureAsyncInvoke(options) {
        return this.lambda.configureAsyncInvoke(options);
    }
    addFunctionUrl(options) {
        return this.lambda.addFunctionUrl(options);
    }
    /** Create a function in-region */
    createInRegionFunction(props) {
        const edgeFunction = new lambda.Function(this, 'Fn', props);
        addEdgeLambdaToRoleTrustStatement(edgeFunction.role);
        return { edgeFunction, edgeArn: edgeFunction.currentVersion.edgeArn };
    }
    /** Create a support stack and function in us-east-1, and a SSM reader in-region */
    createCrossRegionFunction(id, props) {
        const parameterNamePrefix = 'cdk/EdgeFunctionArn';
        if (core_1.Token.isUnresolved(this.env.region)) {
            throw new Error('stacks which use EdgeFunctions must have an explicitly set region');
        }
        // SSM parameter names must only contain letters, numbers, ., _, -, or /.
        const sanitizedPath = this.node.path.replace(/[^\/\w.-]/g, '_');
        const parameterName = `/${parameterNamePrefix}/${this.env.region}/${sanitizedPath}`;
        const functionStack = this.edgeStack(props.stackId);
        const edgeFunction = new lambda.Function(functionStack, id, props);
        addEdgeLambdaToRoleTrustStatement(edgeFunction.role);
        // Store the current version's ARN to be retrieved by the cross region reader below.
        const version = edgeFunction.currentVersion;
        new ssm.StringParameter(edgeFunction, 'Parameter', {
            parameterName,
            stringValue: version.edgeArn,
        });
        const edgeArn = this.createCrossRegionArnReader(parameterNamePrefix, parameterName, version);
        return { edgeFunction, edgeArn };
    }
    createCrossRegionArnReader(parameterNamePrefix, parameterName, version) {
        // Prefix of the parameter ARN that applies to all EdgeFunctions.
        // This is necessary because the `CustomResourceProvider` is a singleton, and the `policyStatement`
        // must work for multiple EdgeFunctions.
        const parameterArnPrefix = this.stack.formatArn({
            service: 'ssm',
            region: EdgeFunction.EDGE_REGION,
            resource: 'parameter',
            resourceName: parameterNamePrefix + '/*',
        });
        const resourceType = 'Custom::CrossRegionStringParameterReader';
        const serviceToken = core_1.CustomResourceProvider.getOrCreate(this, resourceType, {
            codeDirectory: path.join(__dirname, 'edge-function'),
            runtime: core_1.CustomResourceProviderRuntime.NODEJS_14_X,
            policyStatements: [{
                    Effect: 'Allow',
                    Resource: parameterArnPrefix,
                    Action: ['ssm:GetParameter'],
                }],
        });
        const resource = new core_1.CustomResource(this, 'ArnReader', {
            resourceType: resourceType,
            serviceToken,
            properties: {
                Region: EdgeFunction.EDGE_REGION,
                ParameterName: parameterName,
                // This is used to determine when the function has changed, to refresh the ARN from the custom resource.
                //
                // Use the logical id of the function version. Whenever a function version changes, the logical id must be
                // changed for it to take effect - a good candidate for RefreshToken.
                RefreshToken: core_1.Lazy.uncachedString({
                    produce: () => {
                        const cfn = version.node.defaultChild;
                        return this.stack.resolve(cfn.logicalId);
                    },
                }),
            },
        });
        return resource.getAttString('FunctionArn');
    }
    edgeStack(stackId) {
        const stage = core_1.Stage.of(this);
        if (!stage) {
            throw new Error('stacks which use EdgeFunctions must be part of a CDK app or stage');
        }
        const edgeStackId = stackId ?? `edge-lambda-stack-${this.stack.node.addr}`;
        let edgeStack = stage.node.tryFindChild(edgeStackId);
        if (!edgeStack) {
            edgeStack = new core_1.Stack(stage, edgeStackId, {
                env: {
                    region: EdgeFunction.EDGE_REGION,
                    account: core_1.Stack.of(this).account,
                },
            });
        }
        this.stack.addDependency(edgeStack);
        return edgeStack;
    }
}
exports.EdgeFunction = EdgeFunction;
_a = JSII_RTTI_SYMBOL_1;
EdgeFunction[_a] = { fqn: "@aws-cdk/aws-cloudfront.experimental.EdgeFunction", version: "0.0.0" };
EdgeFunction.EDGE_REGION = 'us-east-1';
function addEdgeLambdaToRoleTrustStatement(role) {
    if (iam.Role.isRole(role) && role.assumeRolePolicy) {
        const statement = new iam.PolicyStatement();
        const edgeLambdaServicePrincipal = new iam.ServicePrincipal('edgelambda.amazonaws.com');
        statement.addPrincipals(edgeLambdaServicePrincipal);
        statement.addActions(edgeLambdaServicePrincipal.assumeRoleAction);
        role.assumeRolePolicy.addStatements(statement);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRnZS1mdW5jdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVkZ2UtZnVuY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNkJBQTZCO0FBRzdCLHdDQUF3QztBQUN4Qyw4Q0FBOEM7QUFDOUMsd0NBQXdDO0FBQ3hDLHdDQUl1QjtBQWdCdkI7Ozs7Ozs7Ozs7R0FVRztBQUNILE1BQWEsWUFBYSxTQUFRLGVBQVE7SUFpQnhDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBd0I7UUFDaEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQVZILGlCQUFZLEdBQUcsS0FBSyxDQUFDOzs7Ozs7K0NBUjFCLFlBQVk7Ozs7UUFvQnJCLGlHQUFpRztRQUNqRyxNQUFNLGVBQWUsR0FBRyxDQUFDLFlBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxXQUFXLENBQUM7UUFDaEcsTUFBTSxFQUFFLFlBQVksRUFBRSxPQUFPLEVBQUUsR0FBRyxlQUFlO1lBQy9DLENBQUMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDO1lBQ3BDLENBQUMsQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTlDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBRXZCLElBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDO1FBQzNCLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUM7UUFDcEQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUssQ0FBQztRQUMvQyxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxh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LEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFVLENBQUM7UUFDOUQsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNkLFNBQVMsR0FBRyxJQUFJLFlBQUssQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO2dCQUN4QyxHQUFHLEVBQUU7b0JBQ0gsTUFBTSxFQUFFLFlBQVksQ0FBQyxXQUFXO29CQUNoQyxPQUFPLEVBQUUsWUFBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPO2lCQUNoQzthQUNGLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDcEMsT0FBTyxTQUFTLENBQUM7S0FDbEI7O0FBN01ILG9DQThNQzs7O0FBNU15Qix3QkFBVyxHQUFXLFdBQVcsQ0FBQztBQW9ONUQsU0FBUyxpQ0FBaUMsQ0FBQyxJQUFlO0lBQ3hELElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1FBQ2xELE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzVDLE1BQU0sMEJBQTBCLEdBQUcsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUN4RixTQUFTLENBQUMsYUFBYSxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFDcEQsU0FBUyxDQUFDLFVBQVUsQ0FBQywwQkFBMEIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDaEQ7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgc3NtIGZyb20gJ0Bhd3MtY2RrL2F3cy1zc20nO1xuaW1wb3J0IHtcbiAgQ2ZuUmVzb3VyY2UsXG4gIEN1c3RvbVJlc291cmNlLCBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLCBDdXN0b21SZXNvdXJjZVByb3ZpZGVyUnVudGltZSxcbiAgTGF6eSwgUmVzb3VyY2UsIFN0YWNrLCBTdGFnZSwgVG9rZW4sXG59IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuXG5pbXBvcnQgeyBDb25zdHJ1Y3QsIE5vZGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBjcmVhdGluZyBhIExhbWJkYUBFZGdlIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRWRnZUZ1bmN0aW9uUHJvcHMgZXh0ZW5kcyBsYW1iZGEuRnVuY3Rpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgc3RhY2sgSUQgb2YgTGFtYmRhQEVkZ2UgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gYGVkZ2UtbGFtYmRhLXN0YWNrLSR7cmVnaW9ufWBcbiAgICovXG4gIHJlYWRvbmx5IHN0YWNrSWQ/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBMYW1iZGFARWRnZSBmdW5jdGlvbi5cbiAqXG4gKiBDb252ZW5pZW5jZSByZXNvdXJjZSBmb3IgcmVxdWVzdGluZyBhIExhbWJkYSBmdW5jdGlvbiBpbiB0aGUgJ3VzLWVhc3QtMScgcmVnaW9uIGZvciB1c2Ugd2l0aCBMYW1iZGFARWRnZS5cbiAqIEltcGxlbWVudHMgc2V2ZXJhbCByZXN0cmljdGlvbnMgZW5mb3JjZWQgYnkgTGFtYmRhQEVkZ2UuXG4gKlxuICogTm90ZSB0aGF0IHRoaXMgY29uc3RydWN0IHJlcXVpcmVzIHRoYXQgdGhlICd1cy1lYXN0LTEnIHJlZ2lvbiBoYXMgYmVlbiBib290c3RyYXBwZWQuXG4gKiBTZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9sYXRlc3QvZ3VpZGUvYm9vdHN0cmFwcGluZy5odG1sIG9yICdjZGsgYm9vdHN0cmFwIC0taGVscCcgZm9yIG9wdGlvbnMuXG4gKlxuICogQHJlc291cmNlIEFXUzo6TGFtYmRhOjpGdW5jdGlvblxuICovXG5leHBvcnQgY2xhc3MgRWRnZUZ1bmN0aW9uIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBsYW1iZGEuSVZlcnNpb24ge1xuXG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEVER0VfUkVHSU9OOiBzdHJpbmcgPSAndXMtZWFzdC0xJztcblxuICBwdWJsaWMgcmVhZG9ubHkgZWRnZUFybjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgZnVuY3Rpb25OYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBmdW5jdGlvbkFybjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgZ3JhbnRQcmluY2lwYWw6IGlhbS5JUHJpbmNpcGFsO1xuICBwdWJsaWMgcmVhZG9ubHkgaXNCb3VuZFRvVnBjID0gZmFsc2U7XG4gIHB1YmxpYyByZWFkb25seSBwZXJtaXNzaW9uc05vZGU6IE5vZGU7XG4gIHB1YmxpYyByZWFkb25seSByb2xlPzogaWFtLklSb2xlO1xuICBwdWJsaWMgcmVhZG9ubHkgdmVyc2lvbjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgYXJjaGl0ZWN0dXJlOiBsYW1iZGEuQXJjaGl0ZWN0dXJlO1xuICBwdWJsaWMgcmVhZG9ubHkgcmVzb3VyY2VBcm5zRm9yR3JhbnRJbnZva2U6IHN0cmluZ1tdO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgX2VkZ2VGdW5jdGlvbjogbGFtYmRhLkZ1bmN0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBFZGdlRnVuY3Rpb25Qcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAvLyBDcmVhdGUgYSBzaW1wbGUgRnVuY3Rpb24gaWYgd2UncmUgYWxyZWFkeSBpbiB1cy1lYXN0LTE7IG90aGVyd2lzZSBjcmVhdGUgYSBjcm9zcy1yZWdpb24gc3RhY2suXG4gICAgY29uc3QgcmVnaW9uSXNVc0Vhc3QxID0gIVRva2VuLmlzVW5yZXNvbHZlZCh0aGlzLmVudi5yZWdpb24pICYmIHRoaXMuZW52LnJlZ2lvbiA9PT0gJ3VzLWVhc3QtMSc7XG4gICAgY29uc3QgeyBlZGdlRnVuY3Rpb24sIGVkZ2VBcm4gfSA9IHJlZ2lvbklzVXNFYXN0MVxuICAgICAgPyB0aGlzLmNyZWF0ZUluUmVnaW9uRnVuY3Rpb24ocHJvcHMpXG4gICAgICA6IHRoaXMuY3JlYXRlQ3Jvc3NSZWdpb25GdW5jdGlvbihpZCwgcHJvcHMpO1xuXG4gICAgdGhpcy5lZGdlQXJuID0gZWRnZUFybjtcblxuICAgIHRoaXMuZnVuY3Rpb25Bcm4gPSBlZGdlQXJuO1xuICAgIHRoaXMuX2VkZ2VGdW5jdGlvbiA9IGVkZ2VGdW5jdGlvbjtcbiAgICB0aGlzLmZ1bmN0aW9uTmFtZSA9IHRoaXMuX2VkZ2VGdW5jdGlvbi5mdW5jdGlvbk5hbWU7XG4gICAgdGhpcy5ncmFudFByaW5jaXBhbCA9IHRoaXMuX2VkZ2VGdW5jdGlvbi5yb2xlITtcbiAgICB0aGlzLnBlcm1pc3Npb25zTm9kZSA9IHRoaXMuX2VkZ2VGdW5jdGlvbi5wZXJtaXNzaW9uc05vZGU7XG4gICAgdGhpcy52ZXJzaW9uID0gbGFtYmRhLmV4dHJhY3RRdWFsaWZpZXJGcm9tQXJuKHRoaXMuZnVuY3Rpb25Bcm4pO1xuICAgIHRoaXMuYXJjaGl0ZWN0dXJlID0gdGhpcy5fZWRnZUZ1bmN0aW9uLmFyY2hpdGVjdHVyZTtcbiAgICB0aGlzLnJlc291cmNlQXJuc0ZvckdyYW50SW52b2tlID0gdGhpcy5fZWRnZUZ1bmN0aW9uLnJlc291cmNlQXJuc0ZvckdyYW50SW52b2tlO1xuXG4gICAgdGhpcy5ub2RlLmRlZmF1bHRDaGlsZCA9IHRoaXMuX2VkZ2VGdW5jdGlvbjtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgbGFtYmRhKCk6IGxhbWJkYS5JRnVuY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLl9lZGdlRnVuY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogQ29udmVuaWVuY2UgbWV0aG9kIHRvIG1ha2UgYEVkZ2VGdW5jdGlvbmAgY29uZm9ybSB0byB0aGUgc2FtZSBpbnRlcmZhY2UgYXMgYEZ1bmN0aW9uYC5cbiAgICovXG4gIHB1YmxpYyBnZXQgY3VycmVudFZlcnNpb24oKTogbGFtYmRhLklWZXJzaW9uIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyBhZGRBbGlhcyhhbGlhc05hbWU6IHN0cmluZywgb3B0aW9uczogbGFtYmRhLkFsaWFzT3B0aW9ucyA9IHt9KTogbGFtYmRhLkFsaWFzIHtcbiAgICByZXR1cm4gbmV3IGxhbWJkYS5BbGlhcyh0aGlzLl9lZGdlRnVuY3Rpb24sIGBBbGlhcyR7YWxpYXNOYW1lfWAsIHtcbiAgICAgIGFsaWFzTmFtZSxcbiAgICAgIHZlcnNpb246IHRoaXMuX2VkZ2VGdW5jdGlvbi5jdXJyZW50VmVyc2lvbixcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTm90IHN1cHBvcnRlZC4gQ29ubmVjdGlvbnMgYXJlIG9ubHkgYXBwbGljYWJsZSB0byBWUEMtZW5hYmxlZCBmdW5jdGlvbnMuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGNvbm5lY3Rpb25zKCk6IGVjMi5Db25uZWN0aW9ucyB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdMYW1iZGFARWRnZSBkb2VzIG5vdCBzdXBwb3J0IGNvbm5lY3Rpb25zJyk7XG4gIH1cbiAgcHVibGljIGdldCBsYXRlc3RWZXJzaW9uKCk6IGxhbWJkYS5JVmVyc2lvbiB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCckTEFURVNUIGZ1bmN0aW9uIHZlcnNpb24gY2Fubm90IGJlIHVzZWQgZm9yIExhbWJkYUBFZGdlJyk7XG4gIH1cblxuICBwdWJsaWMgYWRkRXZlbnRTb3VyY2VNYXBwaW5nKGlkOiBzdHJpbmcsIG9wdGlvbnM6IGxhbWJkYS5FdmVudFNvdXJjZU1hcHBpbmdPcHRpb25zKTogbGFtYmRhLkV2ZW50U291cmNlTWFwcGluZyB7XG4gICAgcmV0dXJuIHRoaXMubGFtYmRhLmFkZEV2ZW50U291cmNlTWFwcGluZyhpZCwgb3B0aW9ucyk7XG4gIH1cbiAgcHVibGljIGFkZFBlcm1pc3Npb24oaWQ6IHN0cmluZywgcGVybWlzc2lvbjogbGFtYmRhLlBlcm1pc3Npb24pOiB2b2lkIHtcbiAgICByZXR1cm4gdGhpcy5sYW1iZGEuYWRkUGVybWlzc2lvbihpZCwgcGVybWlzc2lvbik7XG4gIH1cbiAgcHVibGljIGFkZFRvUm9sZVBvbGljeShzdGF0ZW1lbnQ6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQpOiB2b2lkIHtcbiAgICByZXR1cm4gdGhpcy5sYW1iZGEuYWRkVG9Sb2xlUG9saWN5KHN0YXRlbWVudCk7XG4gIH1cbiAgcHVibGljIGdyYW50SW52b2tlKGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgcmV0dXJuIHRoaXMubGFtYmRhLmdyYW50SW52b2tlKGlkZW50aXR5KTtcbiAgfVxuICBwdWJsaWMgZ3JhbnRJbnZva2VVcmwoaWRlbnRpdHk6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50IHtcbiAgICByZXR1cm4gdGhpcy5sYW1iZGEuZ3JhbnRJbnZva2VVcmwoaWRlbnRpdHkpO1xuICB9XG4gIHB1YmxpYyBtZXRyaWMobWV0cmljTmFtZTogc3RyaW5nLCBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5sYW1iZGEubWV0cmljKG1ldHJpY05hbWUsIHsgLi4ucHJvcHMsIHJlZ2lvbjogRWRnZUZ1bmN0aW9uLkVER0VfUkVHSU9OIH0pO1xuICB9XG4gIHB1YmxpYyBtZXRyaWNEdXJhdGlvbihwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5sYW1iZGEubWV0cmljRHVyYXRpb24oeyAuLi5wcm9wcywgcmVnaW9uOiBFZGdlRnVuY3Rpb24uRURHRV9SRUdJT04gfSk7XG4gIH1cbiAgcHVibGljIG1ldHJpY0Vycm9ycyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5sYW1iZGEubWV0cmljRXJyb3JzKHsgLi4ucHJvcHMsIHJlZ2lvbjogRWRnZUZ1bmN0aW9uLkVER0VfUkVHSU9OIH0pO1xuICB9XG4gIHB1YmxpYyBtZXRyaWNJbnZvY2F0aW9ucyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5sYW1iZGEubWV0cmljSW52b2NhdGlvbnMoeyAuLi5wcm9wcywgcmVnaW9uOiBFZGdlRnVuY3Rpb24uRURHRV9SRUdJT04gfSk7XG4gIH1cbiAgcHVibGljIG1ldHJpY1Rocm90dGxlcyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gdGhpcy5sYW1iZGEubWV0cmljVGhyb3R0bGVzKHsgLi4ucHJvcHMsIHJlZ2lvbjogRWRnZUZ1bmN0aW9uLkVER0VfUkVHSU9OIH0pO1xuICB9XG4gIC8qKiBBZGRzIGFuIGV2ZW50IHNvdXJjZSB0byB0aGlzIGZ1bmN0aW9uLiAqL1xuICBwdWJsaWMgYWRkRXZlbnRTb3VyY2Uoc291cmNlOiBsYW1iZGEuSUV2ZW50U291cmNlKTogdm9pZCB7XG4gICAgcmV0dXJuIHRoaXMubGFtYmRhLmFkZEV2ZW50U291cmNlKHNvdXJjZSk7XG4gIH1cbiAgcHVibGljIGNvbmZpZ3VyZUFzeW5jSW52b2tlKG9wdGlvbnM6IGxhbWJkYS5FdmVudEludm9rZUNvbmZpZ09wdGlvbnMpOiB2b2lkIHtcbiAgICByZXR1cm4gdGhpcy5sYW1iZGEuY29uZmlndXJlQXN5bmNJbnZva2Uob3B0aW9ucyk7XG4gIH1cbiAgcHVibGljIGFkZEZ1bmN0aW9uVXJsKG9wdGlvbnM/OiBsYW1iZGEuRnVuY3Rpb25VcmxPcHRpb25zKTogbGFtYmRhLkZ1bmN0aW9uVXJsIHtcbiAgICByZXR1cm4gdGhpcy5sYW1iZGEuYWRkRnVuY3Rpb25Vcmwob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQ3JlYXRlIGEgZnVuY3Rpb24gaW4tcmVnaW9uICovXG4gIHByaXZhdGUgY3JlYXRlSW5SZWdpb25GdW5jdGlvbihwcm9wczogbGFtYmRhLkZ1bmN0aW9uUHJvcHMpOiBGdW5jdGlvbkNvbmZpZyB7XG4gICAgY29uc3QgZWRnZUZ1bmN0aW9uID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnRm4nLCBwcm9wcyk7XG4gICAgYWRkRWRnZUxhbWJkYVRvUm9sZVRydXN0U3RhdGVtZW50KGVkZ2VGdW5jdGlvbi5yb2xlISk7XG5cbiAgICByZXR1cm4geyBlZGdlRnVuY3Rpb24sIGVkZ2VBcm46IGVkZ2VGdW5jdGlvbi5jdXJyZW50VmVyc2lvbi5lZGdlQXJuIH07XG4gIH1cblxuICAvKiogQ3JlYXRlIGEgc3VwcG9ydCBzdGFjayBhbmQgZnVuY3Rpb24gaW4gdXMtZWFzdC0xLCBhbmQgYSBTU00gcmVhZGVyIGluLXJlZ2lvbiAqL1xuICBwcml2YXRlIGNyZWF0ZUNyb3NzUmVnaW9uRnVuY3Rpb24oaWQ6IHN0cmluZywgcHJvcHM6IEVkZ2VGdW5jdGlvblByb3BzKTogRnVuY3Rpb25Db25maWcge1xuICAgIGNvbnN0IHBhcmFtZXRlck5hbWVQcmVmaXggPSAnY2RrL0VkZ2VGdW5jdGlvbkFybic7XG4gICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZCh0aGlzLmVudi5yZWdpb24pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3N0YWNrcyB3aGljaCB1c2UgRWRnZUZ1bmN0aW9ucyBtdXN0IGhhdmUgYW4gZXhwbGljaXRseSBzZXQgcmVnaW9uJyk7XG4gICAgfVxuICAgIC8vIFNTTSBwYXJhbWV0ZXIgbmFtZXMgbXVzdCBvbmx5IGNvbnRhaW4gbGV0dGVycywgbnVtYmVycywgLiwgXywgLSwgb3IgLy5cbiAgICBjb25zdCBzYW5pdGl6ZWRQYXRoID0gdGhpcy5ub2RlLnBhdGgucmVwbGFjZSgvW15cXC9cXHcuLV0vZywgJ18nKTtcbiAgICBjb25zdCBwYXJhbWV0ZXJOYW1lID0gYC8ke3BhcmFtZXRlck5hbWVQcmVmaXh9LyR7dGhpcy5lbnYucmVnaW9ufS8ke3Nhbml0aXplZFBhdGh9YDtcbiAgICBjb25zdCBmdW5jdGlvblN0YWNrID0gdGhpcy5lZGdlU3RhY2socHJvcHMuc3RhY2tJZCk7XG5cbiAgICBjb25zdCBlZGdlRnVuY3Rpb24gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKGZ1bmN0aW9uU3RhY2ssIGlkLCBwcm9wcyk7XG4gICAgYWRkRWRnZUxhbWJkYVRvUm9sZVRydXN0U3RhdGVtZW50KGVkZ2VGdW5jdGlvbi5yb2xlISk7XG5cbiAgICAvLyBTdG9yZSB0aGUgY3VycmVudCB2ZXJzaW9uJ3MgQVJOIHRvIGJlIHJldHJpZXZlZCBieSB0aGUgY3Jvc3MgcmVnaW9uIHJlYWRlciBiZWxvdy5cbiAgICBjb25zdCB2ZXJzaW9uID0gZWRnZUZ1bmN0aW9uLmN1cnJlbnRWZXJzaW9uO1xuICAgIG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKGVkZ2VGdW5jdGlvbiwgJ1BhcmFtZXRlcicsIHtcbiAgICAgIHBhcmFtZXRlck5hbWUsXG4gICAgICBzdHJpbmdWYWx1ZTogdmVyc2lvbi5lZGdlQXJuLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZWRnZUFybiA9IHRoaXMuY3JlYXRlQ3Jvc3NSZWdpb25Bcm5SZWFkZXIocGFyYW1ldGVyTmFtZVByZWZpeCwgcGFyYW1ldGVyTmFtZSwgdmVyc2lvbik7XG5cbiAgICByZXR1cm4geyBlZGdlRnVuY3Rpb24sIGVkZ2VBcm4gfTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQ3Jvc3NSZWdpb25Bcm5SZWFkZXIocGFyYW1ldGVyTmFtZVByZWZpeDogc3RyaW5nLCBwYXJhbWV0ZXJOYW1lOiBzdHJpbmcsIHZlcnNpb246IGxhbWJkYS5WZXJzaW9uKTogc3RyaW5nIHtcbiAgICAvLyBQcmVmaXggb2YgdGhlIHBhcmFtZXRlciBBUk4gdGhhdCBhcHBsaWVzIHRvIGFsbCBFZGdlRnVuY3Rpb25zLlxuICAgIC8vIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2UgdGhlIGBDdXN0b21SZXNvdXJjZVByb3ZpZGVyYCBpcyBhIHNpbmdsZXRvbiwgYW5kIHRoZSBgcG9saWN5U3RhdGVtZW50YFxuICAgIC8vIG11c3Qgd29yayBmb3IgbXVsdGlwbGUgRWRnZUZ1bmN0aW9ucy5cbiAgICBjb25zdCBwYXJhbWV0ZXJBcm5QcmVmaXggPSB0aGlzLnN0YWNrLmZvcm1hdEFybih7XG4gICAgICBzZXJ2aWNlOiAnc3NtJyxcbiAgICAgIHJlZ2lvbjogRWRnZUZ1bmN0aW9uLkVER0VfUkVHSU9OLFxuICAgICAgcmVzb3VyY2U6ICdwYXJhbWV0ZXInLFxuICAgICAgcmVzb3VyY2VOYW1lOiBwYXJhbWV0ZXJOYW1lUHJlZml4ICsgJy8qJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc291cmNlVHlwZSA9ICdDdXN0b206OkNyb3NzUmVnaW9uU3RyaW5nUGFyYW1ldGVyUmVhZGVyJztcbiAgICBjb25zdCBzZXJ2aWNlVG9rZW4gPSBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLmdldE9yQ3JlYXRlKHRoaXMsIHJlc291cmNlVHlwZSwge1xuICAgICAgY29kZURpcmVjdG9yeTogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2VkZ2UtZnVuY3Rpb24nKSxcbiAgICAgIHJ1bnRpbWU6IEN1c3RvbVJlc291cmNlUHJvdmlkZXJSdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgcG9saWN5U3RhdGVtZW50czogW3tcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBSZXNvdXJjZTogcGFyYW1ldGVyQXJuUHJlZml4LFxuICAgICAgICBBY3Rpb246IFsnc3NtOkdldFBhcmFtZXRlciddLFxuICAgICAgfV0sXG4gICAgfSk7XG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ3VzdG9tUmVzb3VyY2UodGhpcywgJ0FyblJlYWRlcicsIHtcbiAgICAgIHJlc291cmNlVHlwZTogcmVzb3VyY2VUeXBlLFxuICAgICAgc2VydmljZVRva2VuLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBSZWdpb246IEVkZ2VGdW5jdGlvbi5FREdFX1JFR0lPTixcbiAgICAgICAgUGFyYW1ldGVyTmFtZTogcGFyYW1ldGVyTmFtZSxcbiAgICAgICAgLy8gVGhpcyBpcyB1c2VkIHRvIGRldGVybWluZSB3aGVuIHRoZSBmdW5jdGlvbiBoYXMgY2hhbmdlZCwgdG8gcmVmcmVzaCB0aGUgQVJOIGZyb20gdGhlIGN1c3RvbSByZXNvdXJjZS5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gVXNlIHRoZSBsb2dpY2FsIGlkIG9mIHRoZSBmdW5jdGlvbiB2ZXJzaW9uLiBXaGVuZXZlciBhIGZ1bmN0aW9uIHZlcnNpb24gY2hhbmdlcywgdGhlIGxvZ2ljYWwgaWQgbXVzdCBiZVxuICAgICAgICAvLyBjaGFuZ2VkIGZvciBpdCB0byB0YWtlIGVmZmVjdCAtIGEgZ29vZCBjYW5kaWRhdGUgZm9yIFJlZnJlc2hUb2tlbi5cbiAgICAgICAgUmVmcmVzaFRva2VuOiBMYXp5LnVuY2FjaGVkU3RyaW5nKHtcbiAgICAgICAgICBwcm9kdWNlOiAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjZm4gPSB2ZXJzaW9uLm5vZGUuZGVmYXVsdENoaWxkIGFzIENmblJlc291cmNlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2sucmVzb2x2ZShjZm4ubG9naWNhbElkKTtcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzb3VyY2UuZ2V0QXR0U3RyaW5nKCdGdW5jdGlvbkFybicpO1xuICB9XG5cbiAgcHJpdmF0ZSBlZGdlU3RhY2soc3RhY2tJZD86IHN0cmluZyk6IFN0YWNrIHtcbiAgICBjb25zdCBzdGFnZSA9IFN0YWdlLm9mKHRoaXMpO1xuICAgIGlmICghc3RhZ2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignc3RhY2tzIHdoaWNoIHVzZSBFZGdlRnVuY3Rpb25zIG11c3QgYmUgcGFydCBvZiBhIENESyBhcHAgb3Igc3RhZ2UnKTtcbiAgICB9XG5cbiAgICBjb25zdCBlZGdlU3RhY2tJZCA9IHN0YWNrSWQgPz8gYGVkZ2UtbGFtYmRhLXN0YWNrLSR7dGhpcy5zdGFjay5ub2RlLmFkZHJ9YDtcbiAgICBsZXQgZWRnZVN0YWNrID0gc3RhZ2Uubm9kZS50cnlGaW5kQ2hpbGQoZWRnZVN0YWNrSWQpIGFzIFN0YWNrO1xuICAgIGlmICghZWRnZVN0YWNrKSB7XG4gICAgICBlZGdlU3RhY2sgPSBuZXcgU3RhY2soc3RhZ2UsIGVkZ2VTdGFja0lkLCB7XG4gICAgICAgIGVudjoge1xuICAgICAgICAgIHJlZ2lvbjogRWRnZUZ1bmN0aW9uLkVER0VfUkVHSU9OLFxuICAgICAgICAgIGFjY291bnQ6IFN0YWNrLm9mKHRoaXMpLmFjY291bnQsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5zdGFjay5hZGREZXBlbmRlbmN5KGVkZ2VTdGFjayk7XG4gICAgcmV0dXJuIGVkZ2VTdGFjaztcbiAgfVxufVxuXG4vKiogUmVzdWx0IG9mIGNyZWF0aW5nIGFuIGluLXJlZ2lvbiBvciBjcm9zcy1yZWdpb24gZnVuY3Rpb24gKi9cbmludGVyZmFjZSBGdW5jdGlvbkNvbmZpZyB7XG4gIHJlYWRvbmx5IGVkZ2VGdW5jdGlvbjogbGFtYmRhLkZ1bmN0aW9uO1xuICByZWFkb25seSBlZGdlQXJuOiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIGFkZEVkZ2VMYW1iZGFUb1JvbGVUcnVzdFN0YXRlbWVudChyb2xlOiBpYW0uSVJvbGUpIHtcbiAgaWYgKGlhbS5Sb2xlLmlzUm9sZShyb2xlKSAmJiByb2xlLmFzc3VtZVJvbGVQb2xpY3kpIHtcbiAgICBjb25zdCBzdGF0ZW1lbnQgPSBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCgpO1xuICAgIGNvbnN0IGVkZ2VMYW1iZGFTZXJ2aWNlUHJpbmNpcGFsID0gbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlZGdlbGFtYmRhLmFtYXpvbmF3cy5jb20nKTtcbiAgICBzdGF0ZW1lbnQuYWRkUHJpbmNpcGFscyhlZGdlTGFtYmRhU2VydmljZVByaW5jaXBhbCk7XG4gICAgc3RhdGVtZW50LmFkZEFjdGlvbnMoZWRnZUxhbWJkYVNlcnZpY2VQcmluY2lwYWwuYXNzdW1lUm9sZUFjdGlvbik7XG4gICAgcm9sZS5hc3N1bWVSb2xlUG9saWN5LmFkZFN0YXRlbWVudHMoc3RhdGVtZW50KTtcbiAgfVxufVxuIl19