"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsApi = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const path = require("path");
const events = require("@aws-cdk/aws-events");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
const sdk_api_metadata_generated_1 = require("./sdk-api-metadata.generated");
const util_1 = require("./util");
const awsSdkMetadata = sdk_api_metadata_generated_1.metadata;
/**
 * Use an AWS Lambda function that makes API calls as an event rule target.
 */
class AwsApi {
    constructor(props) {
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_targets_AwsApiProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AwsApi);
            }
            throw error;
        }
    }
    /**
     * Returns a RuleTarget that can be used to trigger this AwsApi as a
     * result from an EventBridge event.
     */
    bind(rule, id) {
        const handler = new lambda.SingletonFunction(rule, `${rule.node.id}${id}Handler`, {
            code: lambda.Code.fromAsset(path.join(__dirname, 'aws-api-handler'), {
                exclude: ['*.ts'],
            }),
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            uuid: 'b4cf1abd-4e4f-4bc6-9944-1af7ccd9ec37',
            lambdaPurpose: 'AWS',
        });
        checkServiceExists(this.props.service, handler);
        if (this.props.policyStatement) {
            handler.addToRolePolicy(this.props.policyStatement);
        }
        else {
            handler.addToRolePolicy(new iam.PolicyStatement({
                actions: [awsSdkToIamAction(this.props.service, this.props.action)],
                resources: ['*'],
            }));
        }
        // Allow handler to be called from rule
        util_1.addLambdaPermission(rule, handler);
        const input = {
            service: this.props.service,
            action: this.props.action,
            parameters: this.props.parameters,
            catchErrorPattern: this.props.catchErrorPattern,
            apiVersion: this.props.apiVersion,
        };
        return {
            arn: handler.functionArn,
            input: events.RuleTargetInput.fromObject(input),
            targetResource: handler,
        };
    }
}
exports.AwsApi = AwsApi;
_a = JSII_RTTI_SYMBOL_1;
AwsApi[_a] = { fqn: "@aws-cdk/aws-events-targets.AwsApi", version: "0.0.0" };
/**
 * Check if the given service exists in the AWS SDK. If not, a warning will be raised.
 * @param service Service name
 */
function checkServiceExists(service, handler) {
    const sdkService = awsSdkMetadata[service.toLowerCase()];
    if (!sdkService) {
        core_1.Annotations.of(handler).addWarning(`Service ${service} does not exist in the AWS SDK. Check the list of available \
services and actions from https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html`);
    }
}
/**
 * Transform SDK service/action to IAM action using metadata from aws-sdk module.
 */
function awsSdkToIamAction(service, action) {
    const srv = service.toLowerCase();
    const iamService = awsSdkMetadata[srv].prefix || srv;
    const iamAction = action.charAt(0).toUpperCase() + action.slice(1);
    return `${iamService}:${iamAction}`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLWFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImF3cy1hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNkJBQTZCO0FBQzdCLDhDQUE4QztBQUM5Qyx3Q0FBd0M7QUFDeEMsOENBQThDO0FBQzlDLHdDQUE0QztBQUM1Qyw2RUFBd0Q7QUFDeEQsaUNBQTZDO0FBTzdDLE1BQU0sY0FBYyxHQUFtQixxQ0FBUSxDQUFDO0FBNERoRDs7R0FFRztBQUNILE1BQWEsTUFBTTtJQUNqQixZQUE2QixLQUFrQjtRQUFsQixVQUFLLEdBQUwsS0FBSyxDQUFhOzs7Ozs7K0NBRHBDLE1BQU07Ozs7S0FDa0M7SUFFbkQ7OztPQUdHO0lBQ0ksSUFBSSxDQUFDLElBQWtCLEVBQUUsRUFBVztRQUN6QyxNQUFNLE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFtQixFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUU7WUFDL0YsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGlCQUFpQixDQUFDLEVBQUU7Z0JBQ25FLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQzthQUNsQixDQUFDO1lBQ0YsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsZUFBZTtZQUN4QixJQUFJLEVBQUUsc0NBQXNDO1lBQzVDLGFBQWEsRUFBRSxLQUFLO1NBQ3JCLENBQUMsQ0FBQztRQUVILGtCQUFrQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRWhELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUU7WUFDOUIsT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQ3JEO2FBQU07WUFDTCxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztnQkFDOUMsT0FBTyxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkUsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO2FBQ2pCLENBQUMsQ0FBQyxDQUFDO1NBQ0w7UUFFRCx1Q0FBdUM7UUFDdkMsMEJBQW1CLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRW5DLE1BQU0sS0FBSyxHQUFnQjtZQUN6QixPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPO1lBQzNCLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU07WUFDekIsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVTtZQUNqQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQjtZQUMvQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVO1NBQ2xDLENBQUM7UUFFRixPQUFPO1lBQ0wsR0FBRyxFQUFFLE9BQU8sQ0FBQyxXQUFXO1lBQ3hCLEtBQUssRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7WUFDL0MsY0FBYyxFQUFFLE9BQU87U0FDeEIsQ0FBQztLQUNIOztBQTdDSCx3QkE4Q0M7OztBQUVEOzs7R0FHRztBQUNILFNBQVMsa0JBQWtCLENBQUMsT0FBZSxFQUFFLE9BQWlDO0lBQzVFLE1BQU0sVUFBVSxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUN6RCxJQUFJLENBQUMsVUFBVSxFQUFFO1FBQ2Ysa0JBQVcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsT0FBTzt5RkFDZ0MsQ0FBQyxDQUFDO0tBQ3hGO0FBQ0gsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxpQkFBaUIsQ0FBQyxPQUFlLEVBQUUsTUFBYztJQUN4RCxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDbEMsTUFBTSxVQUFVLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUM7SUFDckQsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25FLE9BQU8sR0FBRyxVQUFVLElBQUksU0FBUyxFQUFFLENBQUM7QUFDdEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBldmVudHMgZnJvbSAnQGF3cy1jZGsvYXdzLWV2ZW50cyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBBbm5vdGF0aW9ucyB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgbWV0YWRhdGEgfSBmcm9tICcuL3Nkay1hcGktbWV0YWRhdGEuZ2VuZXJhdGVkJztcbmltcG9ydCB7IGFkZExhbWJkYVBlcm1pc3Npb24gfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIEFXUyBTREsgc2VydmljZSBtZXRhZGF0YS5cbiAqL1xuZXhwb3J0IHR5cGUgQXdzU2RrTWV0YWRhdGEgPSB7W2tleTogc3RyaW5nXTogYW55fTtcblxuY29uc3QgYXdzU2RrTWV0YWRhdGE6IEF3c1Nka01ldGFkYXRhID0gbWV0YWRhdGE7XG5cbi8qKlxuICogUnVsZSB0YXJnZXQgaW5wdXQgZm9yIGFuIEF3c0FwaSB0YXJnZXQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXdzQXBpSW5wdXQge1xuICAvKipcbiAgICogVGhlIHNlcnZpY2UgdG8gY2FsbFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NKYXZhU2NyaXB0U0RLL2xhdGVzdC9pbmRleC5odG1sXG4gICAqL1xuICByZWFkb25seSBzZXJ2aWNlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBzZXJ2aWNlIGFjdGlvbiB0byBjYWxsXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0phdmFTY3JpcHRTREsvbGF0ZXN0L2luZGV4Lmh0bWxcbiAgICovXG4gIHJlYWRvbmx5IGFjdGlvbjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcGFyYW1ldGVycyBmb3IgdGhlIHNlcnZpY2UgYWN0aW9uXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0phdmFTY3JpcHRTREsvbGF0ZXN0L2luZGV4Lmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBwYXJhbWV0ZXJzXG4gICAqL1xuICByZWFkb25seSBwYXJhbWV0ZXJzPzogYW55O1xuXG4gIC8qKlxuICAgKiBUaGUgcmVnZXggcGF0dGVybiB0byB1c2UgdG8gY2F0Y2ggQVBJIGVycm9ycy4gVGhlIGBjb2RlYCBwcm9wZXJ0eSBvZiB0aGVcbiAgICogYEVycm9yYCBvYmplY3Qgd2lsbCBiZSB0ZXN0ZWQgYWdhaW5zdCB0aGlzIHBhdHRlcm4uIElmIHRoZXJlIGlzIGEgbWF0Y2ggYW5cbiAgICogZXJyb3Igd2lsbCBub3QgYmUgdGhyb3duLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGRvIG5vdCBjYXRjaCBlcnJvcnNcbiAgICovXG4gIHJlYWRvbmx5IGNhdGNoRXJyb3JQYXR0ZXJuPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBUEkgdmVyc2lvbiB0byB1c2UgZm9yIHRoZSBzZXJ2aWNlXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3Nkay1mb3ItamF2YXNjcmlwdC92Mi9kZXZlbG9wZXItZ3VpZGUvbG9ja2luZy1hcGktdmVyc2lvbnMuaHRtbFxuICAgKiBAZGVmYXVsdCAtIHVzZSBsYXRlc3QgYXZhaWxhYmxlIEFQSSB2ZXJzaW9uXG4gICAqL1xuICByZWFkb25seSBhcGlWZXJzaW9uPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGFuIEF3c0FwaSB0YXJnZXQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXdzQXBpUHJvcHMgZXh0ZW5kcyBBd3NBcGlJbnB1dCB7XG4gIC8qKlxuICAgKiBUaGUgSUFNIHBvbGljeSBzdGF0ZW1lbnQgdG8gYWxsb3cgdGhlIEFQSSBjYWxsLiBVc2Ugb25seSBpZlxuICAgKiByZXNvdXJjZSByZXN0cmljdGlvbiBpcyBuZWVkZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZXh0cmFjdCB0aGUgcGVybWlzc2lvbiBmcm9tIHRoZSBBUEkgY2FsbFxuICAgKi9cbiAgcmVhZG9ubHkgcG9saWN5U3RhdGVtZW50PzogaWFtLlBvbGljeVN0YXRlbWVudDtcbn1cblxuLyoqXG4gKiBVc2UgYW4gQVdTIExhbWJkYSBmdW5jdGlvbiB0aGF0IG1ha2VzIEFQSSBjYWxscyBhcyBhbiBldmVudCBydWxlIHRhcmdldC5cbiAqL1xuZXhwb3J0IGNsYXNzIEF3c0FwaSBpbXBsZW1lbnRzIGV2ZW50cy5JUnVsZVRhcmdldCB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IEF3c0FwaVByb3BzKSB7fVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgUnVsZVRhcmdldCB0aGF0IGNhbiBiZSB1c2VkIHRvIHRyaWdnZXIgdGhpcyBBd3NBcGkgYXMgYVxuICAgKiByZXN1bHQgZnJvbSBhbiBFdmVudEJyaWRnZSBldmVudC5cbiAgICovXG4gIHB1YmxpYyBiaW5kKHJ1bGU6IGV2ZW50cy5JUnVsZSwgaWQ/OiBzdHJpbmcpOiBldmVudHMuUnVsZVRhcmdldENvbmZpZyB7XG4gICAgY29uc3QgaGFuZGxlciA9IG5ldyBsYW1iZGEuU2luZ2xldG9uRnVuY3Rpb24ocnVsZSBhcyBldmVudHMuUnVsZSwgYCR7cnVsZS5ub2RlLmlkfSR7aWR9SGFuZGxlcmAsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnYXdzLWFwaS1oYW5kbGVyJyksIHtcbiAgICAgICAgZXhjbHVkZTogWycqLnRzJ10sXG4gICAgICB9KSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgdXVpZDogJ2I0Y2YxYWJkLTRlNGYtNGJjNi05OTQ0LTFhZjdjY2Q5ZWMzNycsXG4gICAgICBsYW1iZGFQdXJwb3NlOiAnQVdTJyxcbiAgICB9KTtcblxuICAgIGNoZWNrU2VydmljZUV4aXN0cyh0aGlzLnByb3BzLnNlcnZpY2UsIGhhbmRsZXIpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMucG9saWN5U3RhdGVtZW50KSB7XG4gICAgICBoYW5kbGVyLmFkZFRvUm9sZVBvbGljeSh0aGlzLnByb3BzLnBvbGljeVN0YXRlbWVudCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhhbmRsZXIuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogW2F3c1Nka1RvSWFtQWN0aW9uKHRoaXMucHJvcHMuc2VydmljZSwgdGhpcy5wcm9wcy5hY3Rpb24pXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICAvLyBBbGxvdyBoYW5kbGVyIHRvIGJlIGNhbGxlZCBmcm9tIHJ1bGVcbiAgICBhZGRMYW1iZGFQZXJtaXNzaW9uKHJ1bGUsIGhhbmRsZXIpO1xuXG4gICAgY29uc3QgaW5wdXQ6IEF3c0FwaUlucHV0ID0ge1xuICAgICAgc2VydmljZTogdGhpcy5wcm9wcy5zZXJ2aWNlLFxuICAgICAgYWN0aW9uOiB0aGlzLnByb3BzLmFjdGlvbixcbiAgICAgIHBhcmFtZXRlcnM6IHRoaXMucHJvcHMucGFyYW1ldGVycyxcbiAgICAgIGNhdGNoRXJyb3JQYXR0ZXJuOiB0aGlzLnByb3BzLmNhdGNoRXJyb3JQYXR0ZXJuLFxuICAgICAgYXBpVmVyc2lvbjogdGhpcy5wcm9wcy5hcGlWZXJzaW9uLFxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgYXJuOiBoYW5kbGVyLmZ1bmN0aW9uQXJuLFxuICAgICAgaW5wdXQ6IGV2ZW50cy5SdWxlVGFyZ2V0SW5wdXQuZnJvbU9iamVjdChpbnB1dCksXG4gICAgICB0YXJnZXRSZXNvdXJjZTogaGFuZGxlcixcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGdpdmVuIHNlcnZpY2UgZXhpc3RzIGluIHRoZSBBV1MgU0RLLiBJZiBub3QsIGEgd2FybmluZyB3aWxsIGJlIHJhaXNlZC5cbiAqIEBwYXJhbSBzZXJ2aWNlIFNlcnZpY2UgbmFtZVxuICovXG5mdW5jdGlvbiBjaGVja1NlcnZpY2VFeGlzdHMoc2VydmljZTogc3RyaW5nLCBoYW5kbGVyOiBsYW1iZGEuU2luZ2xldG9uRnVuY3Rpb24pIHtcbiAgY29uc3Qgc2RrU2VydmljZSA9IGF3c1Nka01ldGFkYXRhW3NlcnZpY2UudG9Mb3dlckNhc2UoKV07XG4gIGlmICghc2RrU2VydmljZSkge1xuICAgIEFubm90YXRpb25zLm9mKGhhbmRsZXIpLmFkZFdhcm5pbmcoYFNlcnZpY2UgJHtzZXJ2aWNlfSBkb2VzIG5vdCBleGlzdCBpbiB0aGUgQVdTIFNESy4gQ2hlY2sgdGhlIGxpc3Qgb2YgYXZhaWxhYmxlIFxcXG5zZXJ2aWNlcyBhbmQgYWN0aW9ucyBmcm9tIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NKYXZhU2NyaXB0U0RLL2xhdGVzdC9pbmRleC5odG1sYCk7XG4gIH1cbn1cblxuLyoqXG4gKiBUcmFuc2Zvcm0gU0RLIHNlcnZpY2UvYWN0aW9uIHRvIElBTSBhY3Rpb24gdXNpbmcgbWV0YWRhdGEgZnJvbSBhd3Mtc2RrIG1vZHVsZS5cbiAqL1xuZnVuY3Rpb24gYXdzU2RrVG9JYW1BY3Rpb24oc2VydmljZTogc3RyaW5nLCBhY3Rpb246IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHNydiA9IHNlcnZpY2UudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgaWFtU2VydmljZSA9IGF3c1Nka01ldGFkYXRhW3Nydl0ucHJlZml4IHx8IHNydjtcbiAgY29uc3QgaWFtQWN0aW9uID0gYWN0aW9uLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgYWN0aW9uLnNsaWNlKDEpO1xuICByZXR1cm4gYCR7aWFtU2VydmljZX06JHtpYW1BY3Rpb259YDtcbn1cbiJdfQ==