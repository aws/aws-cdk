"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaRestApi = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const integrations_1 = require("./integrations");
const restapi_1 = require("./restapi");
/**
 * Defines an API Gateway REST API with AWS Lambda proxy integration.
 *
 * Use the `proxy` property to define a greedy proxy ("{proxy+}") and "ANY"
 * method from the specified path. If not defined, you will need to explicity
 * add resources and methods to the API.
 */
class LambdaRestApi extends restapi_1.RestApi {
    constructor(scope, id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_LambdaRestApiProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, LambdaRestApi);
            }
            throw error;
        }
        if (props.options?.defaultIntegration || props.defaultIntegration) {
            throw new Error('Cannot specify "defaultIntegration" since Lambda integration is automatically defined');
        }
        super(scope, id, {
            defaultIntegration: new integrations_1.LambdaIntegration(props.handler, props.integrationOptions),
            ...props.options,
            ...props,
        });
        if (props.proxy !== false) {
            this.root.addProxy();
            // Make sure users cannot call any other resource adding function
            this.root.addResource = addResourceThrows;
            this.root.addMethod = addMethodThrows;
            this.root.addProxy = addProxyThrows;
        }
    }
}
exports.LambdaRestApi = LambdaRestApi;
_a = JSII_RTTI_SYMBOL_1;
LambdaRestApi[_a] = { fqn: "@aws-cdk/aws-apigateway.LambdaRestApi", version: "0.0.0" };
function addResourceThrows() {
    throw new Error('Cannot call \'addResource\' on a proxying LambdaRestApi; set \'proxy\' to false');
}
function addMethodThrows() {
    throw new Error('Cannot call \'addMethod\' on a proxying LambdaRestApi; set \'proxy\' to false');
}
function addProxyThrows() {
    throw new Error('Cannot call \'addProxy\' on a proxying LambdaRestApi; set \'proxy\' to false');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLWFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxhbWJkYS1hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsaURBQTZFO0FBRzdFLHVDQUFrRDtBQXNDbEQ7Ozs7OztHQU1HO0FBQ0gsTUFBYSxhQUFjLFNBQVEsaUJBQU87SUFDeEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF5Qjs7Ozs7OytDQUR4RCxhQUFhOzs7O1FBRXRCLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxrQkFBa0IsSUFBSSxLQUFLLENBQUMsa0JBQWtCLEVBQUU7WUFDakUsTUFBTSxJQUFJLEtBQUssQ0FBQyx1RkFBdUYsQ0FBQyxDQUFDO1NBQzFHO1FBRUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixrQkFBa0IsRUFBRSxJQUFJLGdDQUFpQixDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixDQUFDO1lBQ2xGLEdBQUcsS0FBSyxDQUFDLE9BQU87WUFDaEIsR0FBRyxLQUFLO1NBQ1QsQ0FBQyxDQUFDO1FBRUgsSUFBSSxLQUFLLENBQUMsS0FBSyxLQUFLLEtBQUssRUFBRTtZQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBRXJCLGlFQUFpRTtZQUNqRSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQztZQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxlQUFlLENBQUM7WUFDdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFDO1NBQ3JDO0tBQ0Y7O0FBcEJILHNDQXFCQzs7O0FBRUQsU0FBUyxpQkFBaUI7SUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxpRkFBaUYsQ0FBQyxDQUFDO0FBQ3JHLENBQUM7QUFFRCxTQUFTLGVBQWU7SUFDdEIsTUFBTSxJQUFJLEtBQUssQ0FBQywrRUFBK0UsQ0FBQyxDQUFDO0FBQ25HLENBQUM7QUFFRCxTQUFTLGNBQWM7SUFDckIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4RUFBOEUsQ0FBQyxDQUFDO0FBQ2xHLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IExhbWJkYUludGVncmF0aW9uLCBMYW1iZGFJbnRlZ3JhdGlvbk9wdGlvbnMgfSBmcm9tICcuL2ludGVncmF0aW9ucyc7XG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tICcuL21ldGhvZCc7XG5pbXBvcnQgeyBQcm94eVJlc291cmNlLCBSZXNvdXJjZSB9IGZyb20gJy4vcmVzb3VyY2UnO1xuaW1wb3J0IHsgUmVzdEFwaSwgUmVzdEFwaVByb3BzIH0gZnJvbSAnLi9yZXN0YXBpJztcblxuZXhwb3J0IGludGVyZmFjZSBMYW1iZGFSZXN0QXBpUHJvcHMgZXh0ZW5kcyBSZXN0QXBpUHJvcHMge1xuICAvKipcbiAgICogVGhlIGRlZmF1bHQgTGFtYmRhIGZ1bmN0aW9uIHRoYXQgaGFuZGxlcyBhbGwgcmVxdWVzdHMgZnJvbSB0aGlzIEFQSS5cbiAgICpcbiAgICogVGhpcyBoYW5kbGVyIHdpbGwgYmUgdXNlZCBhcyBhIHRoZSBkZWZhdWx0IGludGVncmF0aW9uIGZvciBhbGwgbWV0aG9kcyBpblxuICAgKiB0aGlzIEFQSSwgdW5sZXNzIHNwZWNpZmllZCBvdGhlcndpc2UgaW4gYGFkZE1ldGhvZGAuXG4gICAqL1xuICByZWFkb25seSBoYW5kbGVyOiBsYW1iZGEuSUZ1bmN0aW9uO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpYyBMYW1iZGEgaW50ZWdyYXRpb24gb3B0aW9ucy5cbiAgICpcbiAgICogQGRlZmF1bHQgc2VlIGRlZmF1bHRzIGRlZmluZWQgaW4gYExhbWJkYUludGVncmF0aW9uT3B0aW9uc2AuXG4gICAqL1xuICByZWFkb25seSBpbnRlZ3JhdGlvbk9wdGlvbnM/OiBMYW1iZGFJbnRlZ3JhdGlvbk9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIElmIHRydWUsIHJvdXRlIGFsbCByZXF1ZXN0cyB0byB0aGUgTGFtYmRhIEZ1bmN0aW9uXG4gICAqXG4gICAqIElmIHNldCB0byBmYWxzZSwgeW91IHdpbGwgbmVlZCB0byBleHBsaWNpdGx5IGRlZmluZSB0aGUgQVBJIG1vZGVsIHVzaW5nXG4gICAqIGBhZGRSZXNvdXJjZWAgYW5kIGBhZGRNZXRob2RgIChvciBgYWRkUHJveHlgKS5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgcHJveHk/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCB0aGUgYExhbWJkYVJlc3RBcGlQcm9wc2Agbm93IGV4dGVuZHMgYFJlc3RBcGlQcm9wc2AsIHNvIGFsbFxuICAgKiBvcHRpb25zIGFyZSBqdXN0IGF2YWlsYWJsZSBoZXJlLiBOb3RlIHRoYXQgdGhlIG9wdGlvbnMgc3BlY2lmaWVkIGluXG4gICAqIGBvcHRpb25zYCB3aWxsIGJlIG92ZXJyaWRkZW4gYnkgYW55IHByb3BzIHNwZWNpZmllZCBhdCB0aGUgcm9vdCBsZXZlbC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBvcHRpb25zLlxuICAgKi9cbiAgcmVhZG9ubHkgb3B0aW9ucz86IFJlc3RBcGlQcm9wcztcbn1cblxuLyoqXG4gKiBEZWZpbmVzIGFuIEFQSSBHYXRld2F5IFJFU1QgQVBJIHdpdGggQVdTIExhbWJkYSBwcm94eSBpbnRlZ3JhdGlvbi5cbiAqXG4gKiBVc2UgdGhlIGBwcm94eWAgcHJvcGVydHkgdG8gZGVmaW5lIGEgZ3JlZWR5IHByb3h5IChcIntwcm94eSt9XCIpIGFuZCBcIkFOWVwiXG4gKiBtZXRob2QgZnJvbSB0aGUgc3BlY2lmaWVkIHBhdGguIElmIG5vdCBkZWZpbmVkLCB5b3Ugd2lsbCBuZWVkIHRvIGV4cGxpY2l0eVxuICogYWRkIHJlc291cmNlcyBhbmQgbWV0aG9kcyB0byB0aGUgQVBJLlxuICovXG5leHBvcnQgY2xhc3MgTGFtYmRhUmVzdEFwaSBleHRlbmRzIFJlc3RBcGkge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTGFtYmRhUmVzdEFwaVByb3BzKSB7XG4gICAgaWYgKHByb3BzLm9wdGlvbnM/LmRlZmF1bHRJbnRlZ3JhdGlvbiB8fCBwcm9wcy5kZWZhdWx0SW50ZWdyYXRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHNwZWNpZnkgXCJkZWZhdWx0SW50ZWdyYXRpb25cIiBzaW5jZSBMYW1iZGEgaW50ZWdyYXRpb24gaXMgYXV0b21hdGljYWxseSBkZWZpbmVkJyk7XG4gICAgfVxuXG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBkZWZhdWx0SW50ZWdyYXRpb246IG5ldyBMYW1iZGFJbnRlZ3JhdGlvbihwcm9wcy5oYW5kbGVyLCBwcm9wcy5pbnRlZ3JhdGlvbk9wdGlvbnMpLFxuICAgICAgLi4ucHJvcHMub3B0aW9ucywgLy8gZGVwcmVjYXRlZCwgYnV0IHdlIHN0aWxsIHN1cHBvcnRcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuXG4gICAgaWYgKHByb3BzLnByb3h5ICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5yb290LmFkZFByb3h5KCk7XG5cbiAgICAgIC8vIE1ha2Ugc3VyZSB1c2VycyBjYW5ub3QgY2FsbCBhbnkgb3RoZXIgcmVzb3VyY2UgYWRkaW5nIGZ1bmN0aW9uXG4gICAgICB0aGlzLnJvb3QuYWRkUmVzb3VyY2UgPSBhZGRSZXNvdXJjZVRocm93cztcbiAgICAgIHRoaXMucm9vdC5hZGRNZXRob2QgPSBhZGRNZXRob2RUaHJvd3M7XG4gICAgICB0aGlzLnJvb3QuYWRkUHJveHkgPSBhZGRQcm94eVRocm93cztcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gYWRkUmVzb3VyY2VUaHJvd3MoKTogUmVzb3VyY2Uge1xuICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjYWxsIFxcJ2FkZFJlc291cmNlXFwnIG9uIGEgcHJveHlpbmcgTGFtYmRhUmVzdEFwaTsgc2V0IFxcJ3Byb3h5XFwnIHRvIGZhbHNlJyk7XG59XG5cbmZ1bmN0aW9uIGFkZE1ldGhvZFRocm93cygpOiBNZXRob2Qge1xuICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjYWxsIFxcJ2FkZE1ldGhvZFxcJyBvbiBhIHByb3h5aW5nIExhbWJkYVJlc3RBcGk7IHNldCBcXCdwcm94eVxcJyB0byBmYWxzZScpO1xufVxuXG5mdW5jdGlvbiBhZGRQcm94eVRocm93cygpOiBQcm94eVJlc291cmNlIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY2FsbCBcXCdhZGRQcm94eVxcJyBvbiBhIHByb3h5aW5nIExhbWJkYVJlc3RBcGk7IHNldCBcXCdwcm94eVxcJyB0byBmYWxzZScpO1xufVxuIl19