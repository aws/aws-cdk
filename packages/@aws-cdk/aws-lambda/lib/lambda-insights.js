"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaInsightsVersion = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const region_info_1 = require("@aws-cdk/region-info");
const architecture_1 = require("./architecture");
// To add new versions, update fact-tables.ts `CLOUDWATCH_LAMBDA_INSIGHTS_ARNS` and create a new `public static readonly VERSION_A_B_C_D`
/**
 * Version of CloudWatch Lambda Insights
 */
class LambdaInsightsVersion {
    constructor() {
        /**
         * The arn of the Lambda Insights extension
         */
        this.layerVersionArn = '';
    }
    /**
     * Use the insights extension associated with the provided ARN. Make sure the ARN is associated
     * with same region as your function
     *
     * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versions.html
     */
    static fromInsightVersionArn(arn) {
        class InsightsArn extends LambdaInsightsVersion {
            constructor() {
                super(...arguments);
                this.layerVersionArn = arn;
            }
            _bind(_scope, _function) {
                return { arn };
            }
        }
        return new InsightsArn();
    }
    // Use the verison to build the object. Not meant to be called by the user -- user should use e.g. VERSION_1_0_54_0
    static fromInsightsVersion(insightsVersion) {
        class InsightsVersion extends LambdaInsightsVersion {
            constructor() {
                super(...arguments);
                this.layerVersionArn = core_1.Lazy.uncachedString({
                    produce: (context) => getVersionArn(context.scope, insightsVersion),
                });
            }
            _bind(_scope, _function) {
                const arch = _function.architecture?.name ?? architecture_1.Architecture.X86_64.name;
                // Check if insights version is valid. This should only happen if one of the public static readonly versions are set incorrectly
                // or if the version is not available for the Lambda Architecture
                const versionExists = region_info_1.RegionInfo.regions.some(regionInfo => regionInfo.cloudwatchLambdaInsightsArn(insightsVersion, arch));
                if (!versionExists) {
                    throw new Error(`Insights version ${insightsVersion} does not exist.`);
                }
                return {
                    arn: getVersionArn(_scope, insightsVersion, arch),
                };
            }
        }
        return new InsightsVersion();
    }
}
exports.LambdaInsightsVersion = LambdaInsightsVersion;
_a = JSII_RTTI_SYMBOL_1;
LambdaInsightsVersion[_a] = { fqn: "@aws-cdk/aws-lambda.LambdaInsightsVersion", version: "0.0.0" };
/**
 * Version 1.0.54.0
 */
LambdaInsightsVersion.VERSION_1_0_54_0 = LambdaInsightsVersion.fromInsightsVersion('1.0.54.0');
/**
 * Version 1.0.86.0
 */
LambdaInsightsVersion.VERSION_1_0_86_0 = LambdaInsightsVersion.fromInsightsVersion('1.0.86.0');
/**
 * Version 1.0.89.0
 */
LambdaInsightsVersion.VERSION_1_0_89_0 = LambdaInsightsVersion.fromInsightsVersion('1.0.89.0');
/**
 * Version 1.0.98.0
 */
LambdaInsightsVersion.VERSION_1_0_98_0 = LambdaInsightsVersion.fromInsightsVersion('1.0.98.0');
/**
 * Version 1.0.119.0
 */
LambdaInsightsVersion.VERSION_1_0_119_0 = LambdaInsightsVersion.fromInsightsVersion('1.0.119.0');
/**
 * Version 1.0.135.0
 */
LambdaInsightsVersion.VERSION_1_0_135_0 = LambdaInsightsVersion.fromInsightsVersion('1.0.135.0');
/**
 * Version 1.0.143.0
 */
LambdaInsightsVersion.VERSION_1_0_143_0 = LambdaInsightsVersion.fromInsightsVersion('1.0.143.0');
/**
 * Version 1.0.178.0
 */
LambdaInsightsVersion.VERSION_1_0_178_0 = LambdaInsightsVersion.fromInsightsVersion('1.0.178.0');
/**
 * Function to retrieve the correct Lambda Insights ARN from RegionInfo,
 * or create a mapping to look it up at stack deployment time.
 *
 * This function is run on CDK synthesis.
 */
function getVersionArn(scope, insightsVersion, architecture) {
    const scopeStack = core_1.Stack.of(scope);
    const region = scopeStack.region;
    const arch = architecture ?? architecture_1.Architecture.X86_64.name;
    // Region is defined, look up the arn, or throw an error if the version isn't supported by a region
    if (region !== undefined && !core_1.Token.isUnresolved(region)) {
        const arn = region_info_1.RegionInfo.get(region).cloudwatchLambdaInsightsArn(insightsVersion, arch);
        if (arn === undefined) {
            throw new Error(`Insights version ${insightsVersion} is not supported in region ${region}`);
        }
        return arn;
    }
    // Otherwise, need to add a mapping to be looked up at deployment time
    return scopeStack.regionalFact(region_info_1.FactName.cloudwatchLambdaInsightsVersion(insightsVersion, arch));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLWluc2lnaHRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGFtYmRhLWluc2lnaHRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0NBQW1EO0FBQ25ELHNEQUE0RDtBQUU1RCxpREFBOEM7QUFjOUMseUlBQXlJO0FBRXpJOztHQUVHO0FBQ0gsTUFBc0IscUJBQXFCO0lBQTNDO1FBZ0ZFOztXQUVHO1FBQ2Esb0JBQWUsR0FBVyxFQUFFLENBQUM7S0FROUM7SUFsREM7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMscUJBQXFCLENBQUMsR0FBVztRQUM3QyxNQUFNLFdBQVksU0FBUSxxQkFBcUI7WUFBL0M7O2dCQUNrQixvQkFBZSxHQUFHLEdBQUcsQ0FBQztZQUl4QyxDQUFDO1lBSFEsS0FBSyxDQUFDLE1BQWlCLEVBQUUsU0FBb0I7Z0JBQ2xELE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUNqQixDQUFDO1NBQ0Y7UUFDRCxPQUFPLElBQUksV0FBVyxFQUFFLENBQUM7S0FDMUI7SUFFRCxtSEFBbUg7SUFDM0csTUFBTSxDQUFDLG1CQUFtQixDQUFDLGVBQXVCO1FBQ3hELE1BQU0sZUFBZ0IsU0FBUSxxQkFBcUI7WUFBbkQ7O2dCQUNrQixvQkFBZSxHQUFHLFdBQUksQ0FBQyxjQUFjLENBQUM7b0JBQ3BELE9BQU8sRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsZUFBZSxDQUFDO2lCQUNwRSxDQUFDLENBQUM7WUFjTCxDQUFDO1lBWlEsS0FBSyxDQUFDLE1BQWlCLEVBQUUsU0FBb0I7Z0JBQ2xELE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxJQUFJLDJCQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDdEUsZ0lBQWdJO2dCQUNoSSxpRUFBaUU7Z0JBQ2pFLE1BQU0sYUFBYSxHQUFHLHdCQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQywyQkFBMkIsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDM0gsSUFBSSxDQUFDLGFBQWEsRUFBRTtvQkFDbEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsZUFBZSxrQkFBa0IsQ0FBQyxDQUFDO2lCQUN4RTtnQkFDRCxPQUFPO29CQUNMLEdBQUcsRUFBRSxhQUFhLENBQUMsTUFBTSxFQUFFLGVBQWUsRUFBRSxJQUFJLENBQUM7aUJBQ2xELENBQUM7WUFDSixDQUFDO1NBQ0Y7UUFDRCxPQUFPLElBQUksZUFBZSxFQUFFLENBQUM7S0FDOUI7O0FBOUVILHNEQTJGQzs7O0FBMUZDOztHQUVHO0FBQ29CLHNDQUFnQixHQUFHLHFCQUFxQixDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRWhHOztHQUVHO0FBQ29CLHNDQUFnQixHQUFHLHFCQUFxQixDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRWhHOztHQUVHO0FBQ29CLHNDQUFnQixHQUFHLHFCQUFxQixDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRWhHOztHQUVHO0FBQ29CLHNDQUFnQixHQUFHLHFCQUFxQixDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRWhHOztHQUVHO0FBQ29CLHVDQUFpQixHQUFHLHFCQUFxQixDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBRWxHOztHQUVHO0FBQ29CLHVDQUFpQixHQUFHLHFCQUFxQixDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBRWxHOztHQUVHO0FBQ29CLHVDQUFpQixHQUFHLHFCQUFxQixDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBRWxHOztHQUVHO0FBQ29CLHVDQUFpQixHQUFHLHFCQUFxQixDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBc0RwRzs7Ozs7R0FLRztBQUNILFNBQVMsYUFBYSxDQUFDLEtBQWlCLEVBQUUsZUFBdUIsRUFBRSxZQUFxQjtJQUV0RixNQUFNLFVBQVUsR0FBRyxZQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25DLE1BQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7SUFDakMsTUFBTSxJQUFJLEdBQUcsWUFBWSxJQUFJLDJCQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUV0RCxtR0FBbUc7SUFDbkcsSUFBSSxNQUFNLEtBQUssU0FBUyxJQUFJLENBQUMsWUFBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUN2RCxNQUFNLEdBQUcsR0FBRyx3QkFBVSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQywyQkFBMkIsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdEYsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO1lBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQW9CLGVBQWUsK0JBQStCLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDN0Y7UUFDRCxPQUFPLEdBQUcsQ0FBQztLQUNaO0lBRUQsc0VBQXNFO0lBQ3RFLE9BQU8sVUFBVSxDQUFDLFlBQVksQ0FBQyxzQkFBUSxDQUFDLCtCQUErQixDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2xHLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMYXp5LCBTdGFjaywgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEZhY3ROYW1lLCBSZWdpb25JbmZvIH0gZnJvbSAnQGF3cy1jZGsvcmVnaW9uLWluZm8nO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBBcmNoaXRlY3R1cmUgfSBmcm9tICcuL2FyY2hpdGVjdHVyZSc7XG5pbXBvcnQgeyBJRnVuY3Rpb24gfSBmcm9tICcuL2Z1bmN0aW9uLWJhc2UnO1xuXG5cbi8qKlxuICogQ29uZmlnIHJldHVybmVkIGZyb20gYExhbWJkYUluc2lnaHRzVmVyc2lvbi5fYmluZGBcbiAqL1xuaW50ZXJmYWNlIEluc2lnaHRzQmluZENvbmZpZyB7XG4gIC8qKlxuICAgKiBBUk4gb2YgdGhlIExhbWJkYSBJbnNpZ2h0cyBMYXllciBWZXJzaW9uXG4gICAqL1xuICByZWFkb25seSBhcm46IHN0cmluZztcbn1cblxuLy8gVG8gYWRkIG5ldyB2ZXJzaW9ucywgdXBkYXRlIGZhY3QtdGFibGVzLnRzIGBDTE9VRFdBVENIX0xBTUJEQV9JTlNJR0hUU19BUk5TYCBhbmQgY3JlYXRlIGEgbmV3IGBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFZFUlNJT05fQV9CX0NfRGBcblxuLyoqXG4gKiBWZXJzaW9uIG9mIENsb3VkV2F0Y2ggTGFtYmRhIEluc2lnaHRzXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBMYW1iZGFJbnNpZ2h0c1ZlcnNpb24ge1xuICAvKipcbiAgICogVmVyc2lvbiAxLjAuNTQuMFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWRVJTSU9OXzFfMF81NF8wID0gTGFtYmRhSW5zaWdodHNWZXJzaW9uLmZyb21JbnNpZ2h0c1ZlcnNpb24oJzEuMC41NC4wJyk7XG5cbiAgLyoqXG4gICAqIFZlcnNpb24gMS4wLjg2LjBcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVkVSU0lPTl8xXzBfODZfMCA9IExhbWJkYUluc2lnaHRzVmVyc2lvbi5mcm9tSW5zaWdodHNWZXJzaW9uKCcxLjAuODYuMCcpO1xuXG4gIC8qKlxuICAgKiBWZXJzaW9uIDEuMC44OS4wXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFZFUlNJT05fMV8wXzg5XzAgPSBMYW1iZGFJbnNpZ2h0c1ZlcnNpb24uZnJvbUluc2lnaHRzVmVyc2lvbignMS4wLjg5LjAnKTtcblxuICAvKipcbiAgICogVmVyc2lvbiAxLjAuOTguMFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWRVJTSU9OXzFfMF85OF8wID0gTGFtYmRhSW5zaWdodHNWZXJzaW9uLmZyb21JbnNpZ2h0c1ZlcnNpb24oJzEuMC45OC4wJyk7XG5cbiAgLyoqXG4gICAqIFZlcnNpb24gMS4wLjExOS4wXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFZFUlNJT05fMV8wXzExOV8wID0gTGFtYmRhSW5zaWdodHNWZXJzaW9uLmZyb21JbnNpZ2h0c1ZlcnNpb24oJzEuMC4xMTkuMCcpO1xuXG4gIC8qKlxuICAgKiBWZXJzaW9uIDEuMC4xMzUuMFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWRVJTSU9OXzFfMF8xMzVfMCA9IExhbWJkYUluc2lnaHRzVmVyc2lvbi5mcm9tSW5zaWdodHNWZXJzaW9uKCcxLjAuMTM1LjAnKTtcblxuICAvKipcbiAgICogVmVyc2lvbiAxLjAuMTQzLjBcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVkVSU0lPTl8xXzBfMTQzXzAgPSBMYW1iZGFJbnNpZ2h0c1ZlcnNpb24uZnJvbUluc2lnaHRzVmVyc2lvbignMS4wLjE0My4wJyk7XG5cbiAgLyoqXG4gICAqIFZlcnNpb24gMS4wLjE3OC4wXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFZFUlNJT05fMV8wXzE3OF8wID0gTGFtYmRhSW5zaWdodHNWZXJzaW9uLmZyb21JbnNpZ2h0c1ZlcnNpb24oJzEuMC4xNzguMCcpO1xuXG4gIC8qKlxuICAgKiBVc2UgdGhlIGluc2lnaHRzIGV4dGVuc2lvbiBhc3NvY2lhdGVkIHdpdGggdGhlIHByb3ZpZGVkIEFSTi4gTWFrZSBzdXJlIHRoZSBBUk4gaXMgYXNzb2NpYXRlZFxuICAgKiB3aXRoIHNhbWUgcmVnaW9uIGFzIHlvdXIgZnVuY3Rpb25cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvbW9uaXRvcmluZy9MYW1iZGEtSW5zaWdodHMtZXh0ZW5zaW9uLXZlcnNpb25zLmh0bWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUluc2lnaHRWZXJzaW9uQXJuKGFybjogc3RyaW5nKTogTGFtYmRhSW5zaWdodHNWZXJzaW9uIHtcbiAgICBjbGFzcyBJbnNpZ2h0c0FybiBleHRlbmRzIExhbWJkYUluc2lnaHRzVmVyc2lvbiB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgbGF5ZXJWZXJzaW9uQXJuID0gYXJuO1xuICAgICAgcHVibGljIF9iaW5kKF9zY29wZTogQ29uc3RydWN0LCBfZnVuY3Rpb246IElGdW5jdGlvbik6IEluc2lnaHRzQmluZENvbmZpZyB7XG4gICAgICAgIHJldHVybiB7IGFybiB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEluc2lnaHRzQXJuKCk7XG4gIH1cblxuICAvLyBVc2UgdGhlIHZlcmlzb24gdG8gYnVpbGQgdGhlIG9iamVjdC4gTm90IG1lYW50IHRvIGJlIGNhbGxlZCBieSB0aGUgdXNlciAtLSB1c2VyIHNob3VsZCB1c2UgZS5nLiBWRVJTSU9OXzFfMF81NF8wXG4gIHByaXZhdGUgc3RhdGljIGZyb21JbnNpZ2h0c1ZlcnNpb24oaW5zaWdodHNWZXJzaW9uOiBzdHJpbmcpOiBMYW1iZGFJbnNpZ2h0c1ZlcnNpb24ge1xuICAgIGNsYXNzIEluc2lnaHRzVmVyc2lvbiBleHRlbmRzIExhbWJkYUluc2lnaHRzVmVyc2lvbiB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgbGF5ZXJWZXJzaW9uQXJuID0gTGF6eS51bmNhY2hlZFN0cmluZyh7XG4gICAgICAgIHByb2R1Y2U6IChjb250ZXh0KSA9PiBnZXRWZXJzaW9uQXJuKGNvbnRleHQuc2NvcGUsIGluc2lnaHRzVmVyc2lvbiksXG4gICAgICB9KTtcblxuICAgICAgcHVibGljIF9iaW5kKF9zY29wZTogQ29uc3RydWN0LCBfZnVuY3Rpb246IElGdW5jdGlvbik6IEluc2lnaHRzQmluZENvbmZpZyB7XG4gICAgICAgIGNvbnN0IGFyY2ggPSBfZnVuY3Rpb24uYXJjaGl0ZWN0dXJlPy5uYW1lID8/IEFyY2hpdGVjdHVyZS5YODZfNjQubmFtZTtcbiAgICAgICAgLy8gQ2hlY2sgaWYgaW5zaWdodHMgdmVyc2lvbiBpcyB2YWxpZC4gVGhpcyBzaG91bGQgb25seSBoYXBwZW4gaWYgb25lIG9mIHRoZSBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IHZlcnNpb25zIGFyZSBzZXQgaW5jb3JyZWN0bHlcbiAgICAgICAgLy8gb3IgaWYgdGhlIHZlcnNpb24gaXMgbm90IGF2YWlsYWJsZSBmb3IgdGhlIExhbWJkYSBBcmNoaXRlY3R1cmVcbiAgICAgICAgY29uc3QgdmVyc2lvbkV4aXN0cyA9IFJlZ2lvbkluZm8ucmVnaW9ucy5zb21lKHJlZ2lvbkluZm8gPT4gcmVnaW9uSW5mby5jbG91ZHdhdGNoTGFtYmRhSW5zaWdodHNBcm4oaW5zaWdodHNWZXJzaW9uLCBhcmNoKSk7XG4gICAgICAgIGlmICghdmVyc2lvbkV4aXN0cykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW5zaWdodHMgdmVyc2lvbiAke2luc2lnaHRzVmVyc2lvbn0gZG9lcyBub3QgZXhpc3QuYCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBhcm46IGdldFZlcnNpb25Bcm4oX3Njb3BlLCBpbnNpZ2h0c1ZlcnNpb24sIGFyY2gpLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEluc2lnaHRzVmVyc2lvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBhcm4gb2YgdGhlIExhbWJkYSBJbnNpZ2h0cyBleHRlbnNpb25cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBsYXllclZlcnNpb25Bcm46IHN0cmluZyA9ICcnO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBhcm4gb2YgdGhlIExhbWJkYSBJbnNpZ2h0cyBleHRlbnNpb24gYmFzZWQgb24gdGhlXG4gICAqIExhbWJkYSBhcmNoaXRlY3R1cmVcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgX2JpbmQoX3Njb3BlOiBDb25zdHJ1Y3QsIF9mdW5jdGlvbjogSUZ1bmN0aW9uKTogSW5zaWdodHNCaW5kQ29uZmlnO1xufVxuXG4vKipcbiAqIEZ1bmN0aW9uIHRvIHJldHJpZXZlIHRoZSBjb3JyZWN0IExhbWJkYSBJbnNpZ2h0cyBBUk4gZnJvbSBSZWdpb25JbmZvLFxuICogb3IgY3JlYXRlIGEgbWFwcGluZyB0byBsb29rIGl0IHVwIGF0IHN0YWNrIGRlcGxveW1lbnQgdGltZS5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIHJ1biBvbiBDREsgc3ludGhlc2lzLlxuICovXG5mdW5jdGlvbiBnZXRWZXJzaW9uQXJuKHNjb3BlOiBJQ29uc3RydWN0LCBpbnNpZ2h0c1ZlcnNpb246IHN0cmluZywgYXJjaGl0ZWN0dXJlPzogc3RyaW5nKTogc3RyaW5nIHtcblxuICBjb25zdCBzY29wZVN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuICBjb25zdCByZWdpb24gPSBzY29wZVN0YWNrLnJlZ2lvbjtcbiAgY29uc3QgYXJjaCA9IGFyY2hpdGVjdHVyZSA/PyBBcmNoaXRlY3R1cmUuWDg2XzY0Lm5hbWU7XG5cbiAgLy8gUmVnaW9uIGlzIGRlZmluZWQsIGxvb2sgdXAgdGhlIGFybiwgb3IgdGhyb3cgYW4gZXJyb3IgaWYgdGhlIHZlcnNpb24gaXNuJ3Qgc3VwcG9ydGVkIGJ5IGEgcmVnaW9uXG4gIGlmIChyZWdpb24gIT09IHVuZGVmaW5lZCAmJiAhVG9rZW4uaXNVbnJlc29sdmVkKHJlZ2lvbikpIHtcbiAgICBjb25zdCBhcm4gPSBSZWdpb25JbmZvLmdldChyZWdpb24pLmNsb3Vkd2F0Y2hMYW1iZGFJbnNpZ2h0c0FybihpbnNpZ2h0c1ZlcnNpb24sIGFyY2gpO1xuICAgIGlmIChhcm4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnNpZ2h0cyB2ZXJzaW9uICR7aW5zaWdodHNWZXJzaW9ufSBpcyBub3Qgc3VwcG9ydGVkIGluIHJlZ2lvbiAke3JlZ2lvbn1gKTtcbiAgICB9XG4gICAgcmV0dXJuIGFybjtcbiAgfVxuXG4gIC8vIE90aGVyd2lzZSwgbmVlZCB0byBhZGQgYSBtYXBwaW5nIHRvIGJlIGxvb2tlZCB1cCBhdCBkZXBsb3ltZW50IHRpbWVcbiAgcmV0dXJuIHNjb3BlU3RhY2sucmVnaW9uYWxGYWN0KEZhY3ROYW1lLmNsb3Vkd2F0Y2hMYW1iZGFJbnNpZ2h0c1ZlcnNpb24oaW5zaWdodHNWZXJzaW9uLCBhcmNoKSk7XG59XG4iXX0=