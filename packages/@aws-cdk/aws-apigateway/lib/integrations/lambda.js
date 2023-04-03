"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaIntegration = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
const aws_1 = require("./aws");
/**
 * Integrates an AWS Lambda function to an API Gateway method.
 *
 * @example
 *
 *    declare const resource: apigateway.Resource;
 *    declare const handler: lambda.Function;
 *    resource.addMethod('GET', new apigateway.LambdaIntegration(handler));
 *
 */
class LambdaIntegration extends aws_1.AwsIntegration {
    constructor(handler, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_LambdaIntegrationOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, LambdaIntegration);
            }
            throw error;
        }
        const proxy = options.proxy ?? true;
        super({
            proxy,
            service: 'lambda',
            path: `2015-03-31/functions/${handler.functionArn}/invocations`,
            options,
        });
        this.handler = handler;
        this.enableTest = options.allowTestInvoke ?? true;
    }
    bind(method) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_Method(method);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.bind);
            }
            throw error;
        }
        const bindResult = super.bind(method);
        const principal = new iam.ServicePrincipal('apigateway.amazonaws.com');
        const desc = `${core_1.Names.nodeUniqueId(method.api.node)}.${method.httpMethod}.${method.resource.path.replace(/\//g, '.')}`;
        this.handler.addPermission(`ApiPermission.${desc}`, {
            principal,
            scope: method,
            sourceArn: core_1.Lazy.string({ produce: () => method.methodArn }),
        });
        // add permission to invoke from the console
        if (this.enableTest) {
            this.handler.addPermission(`ApiPermission.Test.${desc}`, {
                principal,
                scope: method,
                sourceArn: method.testMethodArn,
            });
        }
        let functionName;
        if (this.handler instanceof lambda.Function) {
            // if not imported, extract the name from the CFN layer to reach
            // the literal value if it is given (rather than a token)
            functionName = this.handler.node.defaultChild.functionName;
        }
        else {
            // imported, just take the function name.
            functionName = this.handler.functionName;
        }
        let deploymentToken;
        if (!core_1.Token.isUnresolved(functionName)) {
            deploymentToken = JSON.stringify({ functionName });
        }
        return {
            ...bindResult,
            deploymentToken,
        };
    }
}
exports.LambdaIntegration = LambdaIntegration;
_a = JSII_RTTI_SYMBOL_1;
LambdaIntegration[_a] = { fqn: "@aws-cdk/aws-apigateway.LambdaIntegration", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGFtYmRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUN4Qyw4Q0FBOEM7QUFDOUMsd0NBQW1EO0FBQ25ELCtCQUF1QztBQTBCdkM7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBYSxpQkFBa0IsU0FBUSxvQkFBYztJQUluRCxZQUFZLE9BQXlCLEVBQUUsVUFBb0MsRUFBRzs7Ozs7OytDQUpuRSxpQkFBaUI7Ozs7UUFLMUIsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7UUFFcEMsS0FBSyxDQUFDO1lBQ0osS0FBSztZQUNMLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLElBQUksRUFBRSx3QkFBd0IsT0FBTyxDQUFDLFdBQVcsY0FBYztZQUMvRCxPQUFPO1NBQ1IsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQztLQUNuRDtJQUVNLElBQUksQ0FBQyxNQUFjOzs7Ozs7Ozs7O1FBQ3hCLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUV2RSxNQUFNLElBQUksR0FBRyxHQUFHLFlBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUV2SCxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsSUFBSSxFQUFFLEVBQUU7WUFDbEQsU0FBUztZQUNULEtBQUssRUFBRSxNQUFNO1lBQ2IsU0FBUyxFQUFFLFdBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQzVELENBQUMsQ0FBQztRQUVILDRDQUE0QztRQUM1QyxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsc0JBQXNCLElBQUksRUFBRSxFQUFFO2dCQUN2RCxTQUFTO2dCQUNULEtBQUssRUFBRSxNQUFNO2dCQUNiLFNBQVMsRUFBRSxNQUFNLENBQUMsYUFBYTthQUNoQyxDQUFDLENBQUM7U0FDSjtRQUVELElBQUksWUFBWSxDQUFDO1FBRWpCLElBQUksSUFBSSxDQUFDLE9BQU8sWUFBWSxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQzNDLGdFQUFnRTtZQUNoRSx5REFBeUQ7WUFDekQsWUFBWSxHQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQW1DLENBQUMsWUFBWSxDQUFDO1NBQ3BGO2FBQU07WUFDTCx5Q0FBeUM7WUFDekMsWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO1NBQzFDO1FBRUQsSUFBSSxlQUFlLENBQUM7UUFDcEIsSUFBSSxDQUFDLFlBQUssQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDckMsZUFBZSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO1NBQ3BEO1FBQ0QsT0FBTztZQUNMLEdBQUcsVUFBVTtZQUNiLGVBQWU7U0FDaEIsQ0FBQztLQUNIOztBQTFESCw4Q0EyREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBMYXp5LCBOYW1lcywgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEF3c0ludGVncmF0aW9uIH0gZnJvbSAnLi9hd3MnO1xuaW1wb3J0IHsgSW50ZWdyYXRpb25Db25maWcsIEludGVncmF0aW9uT3B0aW9ucyB9IGZyb20gJy4uL2ludGVncmF0aW9uJztcbmltcG9ydCB7IE1ldGhvZCB9IGZyb20gJy4uL21ldGhvZCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGFtYmRhSW50ZWdyYXRpb25PcHRpb25zIGV4dGVuZHMgSW50ZWdyYXRpb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIFVzZSBwcm94eSBpbnRlZ3JhdGlvbiBvciBub3JtYWwgKHJlcXVlc3QvcmVzcG9uc2UgbWFwcGluZykgaW50ZWdyYXRpb24uXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2FwaWdhdGV3YXkvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3NldC11cC1sYW1iZGEtcHJveHktaW50ZWdyYXRpb25zLmh0bWwjYXBpLWdhdGV3YXktc2ltcGxlLXByb3h5LWZvci1sYW1iZGEtb3V0cHV0LWZvcm1hdFxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBwcm94eT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEFsbG93IGludm9raW5nIG1ldGhvZCBmcm9tIEFXUyBDb25zb2xlIFVJIChmb3IgdGVzdGluZyBwdXJwb3NlcykuXG4gICAqXG4gICAqIFRoaXMgd2lsbCBhZGQgYW5vdGhlciBwZXJtaXNzaW9uIHRvIHRoZSBBV1MgTGFtYmRhIHJlc291cmNlIHBvbGljeSB3aGljaFxuICAgKiB3aWxsIGFsbG93IHRoZSBgdGVzdC1pbnZva2Utc3RhZ2VgIHN0YWdlIHRvIGludm9rZSB0aGlzIGhhbmRsZXIuIElmIHRoaXNcbiAgICogaXMgc2V0IHRvIGBmYWxzZWAsIHRoZSBmdW5jdGlvbiB3aWxsIG9ubHkgYmUgdXNhYmxlIGZyb20gdGhlIGRlcGxveW1lbnRcbiAgICogZW5kcG9pbnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGFsbG93VGVzdEludm9rZT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogSW50ZWdyYXRlcyBhbiBBV1MgTGFtYmRhIGZ1bmN0aW9uIHRvIGFuIEFQSSBHYXRld2F5IG1ldGhvZC5cbiAqXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgIGRlY2xhcmUgY29uc3QgcmVzb3VyY2U6IGFwaWdhdGV3YXkuUmVzb3VyY2U7XG4gKiAgICBkZWNsYXJlIGNvbnN0IGhhbmRsZXI6IGxhbWJkYS5GdW5jdGlvbjtcbiAqICAgIHJlc291cmNlLmFkZE1ldGhvZCgnR0VUJywgbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oaGFuZGxlcikpO1xuICpcbiAqL1xuZXhwb3J0IGNsYXNzIExhbWJkYUludGVncmF0aW9uIGV4dGVuZHMgQXdzSW50ZWdyYXRpb24ge1xuICBwcml2YXRlIHJlYWRvbmx5IGhhbmRsZXI6IGxhbWJkYS5JRnVuY3Rpb247XG4gIHByaXZhdGUgcmVhZG9ubHkgZW5hYmxlVGVzdDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihoYW5kbGVyOiBsYW1iZGEuSUZ1bmN0aW9uLCBvcHRpb25zOiBMYW1iZGFJbnRlZ3JhdGlvbk9wdGlvbnMgPSB7IH0pIHtcbiAgICBjb25zdCBwcm94eSA9IG9wdGlvbnMucHJveHkgPz8gdHJ1ZTtcblxuICAgIHN1cGVyKHtcbiAgICAgIHByb3h5LFxuICAgICAgc2VydmljZTogJ2xhbWJkYScsXG4gICAgICBwYXRoOiBgMjAxNS0wMy0zMS9mdW5jdGlvbnMvJHtoYW5kbGVyLmZ1bmN0aW9uQXJufS9pbnZvY2F0aW9uc2AsXG4gICAgICBvcHRpb25zLFxuICAgIH0pO1xuXG4gICAgdGhpcy5oYW5kbGVyID0gaGFuZGxlcjtcbiAgICB0aGlzLmVuYWJsZVRlc3QgPSBvcHRpb25zLmFsbG93VGVzdEludm9rZSA/PyB0cnVlO1xuICB9XG5cbiAgcHVibGljIGJpbmQobWV0aG9kOiBNZXRob2QpOiBJbnRlZ3JhdGlvbkNvbmZpZyB7XG4gICAgY29uc3QgYmluZFJlc3VsdCA9IHN1cGVyLmJpbmQobWV0aG9kKTtcbiAgICBjb25zdCBwcmluY2lwYWwgPSBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2FwaWdhdGV3YXkuYW1hem9uYXdzLmNvbScpO1xuXG4gICAgY29uc3QgZGVzYyA9IGAke05hbWVzLm5vZGVVbmlxdWVJZChtZXRob2QuYXBpLm5vZGUpfS4ke21ldGhvZC5odHRwTWV0aG9kfS4ke21ldGhvZC5yZXNvdXJjZS5wYXRoLnJlcGxhY2UoL1xcLy9nLCAnLicpfWA7XG5cbiAgICB0aGlzLmhhbmRsZXIuYWRkUGVybWlzc2lvbihgQXBpUGVybWlzc2lvbi4ke2Rlc2N9YCwge1xuICAgICAgcHJpbmNpcGFsLFxuICAgICAgc2NvcGU6IG1ldGhvZCxcbiAgICAgIHNvdXJjZUFybjogTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiBtZXRob2QubWV0aG9kQXJuIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gYWRkIHBlcm1pc3Npb24gdG8gaW52b2tlIGZyb20gdGhlIGNvbnNvbGVcbiAgICBpZiAodGhpcy5lbmFibGVUZXN0KSB7XG4gICAgICB0aGlzLmhhbmRsZXIuYWRkUGVybWlzc2lvbihgQXBpUGVybWlzc2lvbi5UZXN0LiR7ZGVzY31gLCB7XG4gICAgICAgIHByaW5jaXBhbCxcbiAgICAgICAgc2NvcGU6IG1ldGhvZCxcbiAgICAgICAgc291cmNlQXJuOiBtZXRob2QudGVzdE1ldGhvZEFybixcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGxldCBmdW5jdGlvbk5hbWU7XG5cbiAgICBpZiAodGhpcy5oYW5kbGVyIGluc3RhbmNlb2YgbGFtYmRhLkZ1bmN0aW9uKSB7XG4gICAgICAvLyBpZiBub3QgaW1wb3J0ZWQsIGV4dHJhY3QgdGhlIG5hbWUgZnJvbSB0aGUgQ0ZOIGxheWVyIHRvIHJlYWNoXG4gICAgICAvLyB0aGUgbGl0ZXJhbCB2YWx1ZSBpZiBpdCBpcyBnaXZlbiAocmF0aGVyIHRoYW4gYSB0b2tlbilcbiAgICAgIGZ1bmN0aW9uTmFtZSA9ICh0aGlzLmhhbmRsZXIubm9kZS5kZWZhdWx0Q2hpbGQgYXMgbGFtYmRhLkNmbkZ1bmN0aW9uKS5mdW5jdGlvbk5hbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGltcG9ydGVkLCBqdXN0IHRha2UgdGhlIGZ1bmN0aW9uIG5hbWUuXG4gICAgICBmdW5jdGlvbk5hbWUgPSB0aGlzLmhhbmRsZXIuZnVuY3Rpb25OYW1lO1xuICAgIH1cblxuICAgIGxldCBkZXBsb3ltZW50VG9rZW47XG4gICAgaWYgKCFUb2tlbi5pc1VucmVzb2x2ZWQoZnVuY3Rpb25OYW1lKSkge1xuICAgICAgZGVwbG95bWVudFRva2VuID0gSlNPTi5zdHJpbmdpZnkoeyBmdW5jdGlvbk5hbWUgfSk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICAuLi5iaW5kUmVzdWx0LFxuICAgICAgZGVwbG95bWVudFRva2VuLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==