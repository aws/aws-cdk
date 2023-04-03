"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deployment = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const helpers_internal_1 = require("@aws-cdk/core/lib/helpers-internal");
const apigateway_generated_1 = require("./apigateway.generated");
const restapi_1 = require("./restapi");
/**
 * A Deployment of a REST API.
 *
 * An immutable representation of a RestApi resource that can be called by users
 * using Stages. A deployment must be associated with a Stage for it to be
 * callable over the Internet.
 *
 * Normally, you don't need to define deployments manually. The RestApi
 * construct manages a Deployment resource that represents the latest model. It
 * can be accessed through `restApi.latestDeployment` (unless `deploy: false` is
 * set when defining the `RestApi`).
 *
 * If you manually define this resource, you will need to know that since
 * deployments are immutable, as long as the resource's logical ID doesn't
 * change, the deployment will represent the snapshot in time in which the
 * resource was created. This means that if you modify the RestApi model (i.e.
 * add methods or resources), these changes will not be reflected unless a new
 * deployment resource is created.
 *
 * To achieve this behavior, the method `addToLogicalId(data)` can be used to
 * augment the logical ID generated for the deployment resource such that it
 * will include arbitrary data. This is done automatically for the
 * `restApi.latestDeployment` deployment.
 *
 * Furthermore, since a deployment does not reference any of the REST API
 * resources and methods, CloudFormation will likely provision it before these
 * resources are created, which means that it will represent a "half-baked"
 * model. Use the `node.addDependency(dep)` method to circumvent that. This is done
 * automatically for the `restApi.latestDeployment` deployment.
 */
class Deployment extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_DeploymentProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Deployment);
            }
            throw error;
        }
        this.resource = new LatestDeploymentResource(this, 'Resource', {
            description: props.description,
            restApi: props.api,
        });
        if (props.retainDeployments) {
            this.resource.applyRemovalPolicy(core_1.RemovalPolicy.RETAIN);
        }
        this.api = props.api;
        this.deploymentId = core_1.Lazy.string({ produce: () => this.resource.ref });
        if (props.api instanceof restapi_1.RestApiBase) {
            props.api._attachDeployment(this);
        }
    }
    /**
     * Adds a component to the hash that determines this Deployment resource's
     * logical ID.
     *
     * This should be called by constructs of the API Gateway model that want to
     * invalidate the deployment when their settings change. The component will
     * be resolve()ed during synthesis so tokens are welcome.
     */
    addToLogicalId(data) {
        this.resource.addToLogicalId(data);
    }
    /**
     * Quoting from CloudFormation's docs:
     *
     *   If you create an AWS::ApiGateway::RestApi resource and its methods (using
     *   AWS::ApiGateway::Method) in the same template as your deployment, the
     *   deployment must depend on the RestApi's methods. To create a dependency,
     *   add a DependsOn attribute to the deployment. If you don't, AWS
     *   CloudFormation creates the deployment right after it creates the RestApi
     *   resource that doesn't contain any methods, and AWS CloudFormation
     *   encounters the following error: The REST API doesn't contain any methods.
     *
     * @param method The method to add as a dependency of the deployment
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-deployment.html
     * @see https://github.com/aws/aws-cdk/pull/6165
     * @internal
     */
    _addMethodDependency(method) {
        // adding a dependency between the constructs using `node.addDependency()`
        // will create additional dependencies between `AWS::ApiGateway::Deployment`
        // and the `AWS::Lambda::Permission` resources (children under Method),
        // causing cyclic dependency errors. Hence, falling back to declaring
        // dependencies between the underlying CfnResources.
        this.node.addDependency(method.node.defaultChild);
    }
}
exports.Deployment = Deployment;
_a = JSII_RTTI_SYMBOL_1;
Deployment[_a] = { fqn: "@aws-cdk/aws-apigateway.Deployment", version: "0.0.0" };
class LatestDeploymentResource extends apigateway_generated_1.CfnDeployment {
    constructor(scope, id, props) {
        super(scope, id, {
            description: props.description,
            restApiId: props.restApi.restApiId,
        });
        this.hashComponents = new Array();
        this.api = props.restApi;
        this.originalLogicalId = this.stack.getLogicalId(this);
        this.overrideLogicalId(core_1.Lazy.uncachedString({ produce: () => this.calculateLogicalId() }));
    }
    /**
     * Allows adding arbitrary data to the hashed logical ID of this deployment.
     * This can be used to couple the deployment to the API Gateway model.
     */
    addToLogicalId(data) {
        // if the construct is locked, it means we are already synthesizing and then
        // we can't modify the hash because we might have already calculated it.
        if (this.node.locked) {
            throw new Error('Cannot modify the logical ID when the construct is locked');
        }
        this.hashComponents.push(data);
    }
    calculateLogicalId() {
        const hash = [...this.hashComponents];
        if (this.api instanceof restapi_1.RestApi || this.api instanceof restapi_1.SpecRestApi) { // Ignore IRestApi that are imported
            // Add CfnRestApi to the logical id so a new deployment is triggered when any of its properties change.
            const cfnRestApiCF = this.api.node.defaultChild._toCloudFormation();
            hash.push(this.stack.resolve(cfnRestApiCF));
        }
        let lid = this.originalLogicalId;
        // if hash components were added to the deployment, we use them to calculate
        // a logical ID for the deployment resource.
        if (hash.length > 0) {
            lid += helpers_internal_1.md5hash(hash.map(x => this.stack.resolve(x)).map(c => JSON.stringify(c)).join(''));
        }
        return lid;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlcGxveW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQTJFO0FBQzNFLHlFQUE2RDtBQUU3RCxpRUFBdUQ7QUFFdkQsdUNBQXdFO0FBeUJ4RTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2Qkc7QUFDSCxNQUFhLFVBQVcsU0FBUSxlQUFRO0lBT3RDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQVJSLFVBQVU7Ozs7UUFVbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLHdCQUF3QixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDN0QsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLE9BQU8sRUFBRSxLQUFLLENBQUMsR0FBRztTQUNuQixDQUFDLENBQUM7UUFFSCxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsRUFBRTtZQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLG9CQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDeEQ7UUFFRCxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDckIsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUV0RSxJQUFJLEtBQUssQ0FBQyxHQUFHLFlBQVkscUJBQVcsRUFBRTtZQUNwQyxLQUFLLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25DO0tBQ0Y7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksY0FBYyxDQUFDLElBQVM7UUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDcEM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7O09BZUc7SUFDSSxvQkFBb0IsQ0FBQyxNQUFjO1FBQ3hDLDBFQUEwRTtRQUMxRSw0RUFBNEU7UUFDNUUsdUVBQXVFO1FBQ3ZFLHFFQUFxRTtRQUNyRSxvREFBb0Q7UUFDcEQsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUEyQixDQUFDLENBQUM7S0FDbEU7O0FBOURILGdDQStEQzs7O0FBT0QsTUFBTSx3QkFBeUIsU0FBUSxvQ0FBYTtJQUtsRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW9DO1FBQzVFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLFNBQVMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVM7U0FDbkMsQ0FBQyxDQUFDO1FBUlksbUJBQWMsR0FBRyxJQUFJLEtBQUssRUFBTyxDQUFDO1FBVWpELElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUN6QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDM0Y7SUFFRDs7O09BR0c7SUFDSSxjQUFjLENBQUMsSUFBYTtRQUNqQyw0RUFBNEU7UUFDNUUsd0VBQXdFO1FBQ3hFLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQywyREFBMkQsQ0FBQyxDQUFDO1NBQzlFO1FBRUQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDaEM7SUFFTyxrQkFBa0I7UUFDeEIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUV0QyxJQUFJLElBQUksQ0FBQyxHQUFHLFlBQVksaUJBQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxZQUFZLHFCQUFXLEVBQUUsRUFBRSxvQ0FBb0M7WUFFeEcsdUdBQXVHO1lBQ3ZHLE1BQU0sWUFBWSxHQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQW9CLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUM3RSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7U0FDN0M7UUFFRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUM7UUFFakMsNEVBQTRFO1FBQzVFLDRDQUE0QztRQUM1QyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ25CLEdBQUcsSUFBSSwwQkFBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUMzRjtRQUVELE9BQU8sR0FBRyxDQUFDO0tBQ1o7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExhenksIFJlbW92YWxQb2xpY3ksIFJlc291cmNlLCBDZm5SZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgbWQ1aGFzaCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUvbGliL2hlbHBlcnMtaW50ZXJuYWwnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5EZXBsb3ltZW50IH0gZnJvbSAnLi9hcGlnYXRld2F5LmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBNZXRob2QgfSBmcm9tICcuL21ldGhvZCc7XG5pbXBvcnQgeyBJUmVzdEFwaSwgUmVzdEFwaSwgU3BlY1Jlc3RBcGksIFJlc3RBcGlCYXNlIH0gZnJvbSAnLi9yZXN0YXBpJztcblxuZXhwb3J0IGludGVyZmFjZSBEZXBsb3ltZW50UHJvcHMge1xuICAvKipcbiAgICogVGhlIFJlc3QgQVBJIHRvIGRlcGxveS5cbiAgICovXG4gIHJlYWRvbmx5IGFwaTogSVJlc3RBcGk7XG5cbiAgLyoqXG4gICAqIEEgZGVzY3JpcHRpb24gb2YgdGhlIHB1cnBvc2Ugb2YgdGhlIEFQSSBHYXRld2F5IGRlcGxveW1lbnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZGVzY3JpcHRpb24uXG4gICAqL1xuICByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogV2hlbiBhbiBBUEkgR2F0ZXdheSBtb2RlbCBpcyB1cGRhdGVkLCBhIG5ldyBkZXBsb3ltZW50IHdpbGwgYXV0b21hdGljYWxseSBiZSBjcmVhdGVkLlxuICAgKiBJZiB0aGlzIGlzIHRydWUsIHRoZSBvbGQgQVBJIEdhdGV3YXkgRGVwbG95bWVudCByZXNvdXJjZSB3aWxsIG5vdCBiZSBkZWxldGVkLlxuICAgKiBUaGlzIHdpbGwgYWxsb3cgbWFudWFsbHkgcmV2ZXJ0aW5nIGJhY2sgdG8gYSBwcmV2aW91cyBkZXBsb3ltZW50IGluIGNhc2UgZm9yIGV4YW1wbGVcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHJldGFpbkRlcGxveW1lbnRzPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBIERlcGxveW1lbnQgb2YgYSBSRVNUIEFQSS5cbiAqXG4gKiBBbiBpbW11dGFibGUgcmVwcmVzZW50YXRpb24gb2YgYSBSZXN0QXBpIHJlc291cmNlIHRoYXQgY2FuIGJlIGNhbGxlZCBieSB1c2Vyc1xuICogdXNpbmcgU3RhZ2VzLiBBIGRlcGxveW1lbnQgbXVzdCBiZSBhc3NvY2lhdGVkIHdpdGggYSBTdGFnZSBmb3IgaXQgdG8gYmVcbiAqIGNhbGxhYmxlIG92ZXIgdGhlIEludGVybmV0LlxuICpcbiAqIE5vcm1hbGx5LCB5b3UgZG9uJ3QgbmVlZCB0byBkZWZpbmUgZGVwbG95bWVudHMgbWFudWFsbHkuIFRoZSBSZXN0QXBpXG4gKiBjb25zdHJ1Y3QgbWFuYWdlcyBhIERlcGxveW1lbnQgcmVzb3VyY2UgdGhhdCByZXByZXNlbnRzIHRoZSBsYXRlc3QgbW9kZWwuIEl0XG4gKiBjYW4gYmUgYWNjZXNzZWQgdGhyb3VnaCBgcmVzdEFwaS5sYXRlc3REZXBsb3ltZW50YCAodW5sZXNzIGBkZXBsb3k6IGZhbHNlYCBpc1xuICogc2V0IHdoZW4gZGVmaW5pbmcgdGhlIGBSZXN0QXBpYCkuXG4gKlxuICogSWYgeW91IG1hbnVhbGx5IGRlZmluZSB0aGlzIHJlc291cmNlLCB5b3Ugd2lsbCBuZWVkIHRvIGtub3cgdGhhdCBzaW5jZVxuICogZGVwbG95bWVudHMgYXJlIGltbXV0YWJsZSwgYXMgbG9uZyBhcyB0aGUgcmVzb3VyY2UncyBsb2dpY2FsIElEIGRvZXNuJ3RcbiAqIGNoYW5nZSwgdGhlIGRlcGxveW1lbnQgd2lsbCByZXByZXNlbnQgdGhlIHNuYXBzaG90IGluIHRpbWUgaW4gd2hpY2ggdGhlXG4gKiByZXNvdXJjZSB3YXMgY3JlYXRlZC4gVGhpcyBtZWFucyB0aGF0IGlmIHlvdSBtb2RpZnkgdGhlIFJlc3RBcGkgbW9kZWwgKGkuZS5cbiAqIGFkZCBtZXRob2RzIG9yIHJlc291cmNlcyksIHRoZXNlIGNoYW5nZXMgd2lsbCBub3QgYmUgcmVmbGVjdGVkIHVubGVzcyBhIG5ld1xuICogZGVwbG95bWVudCByZXNvdXJjZSBpcyBjcmVhdGVkLlxuICpcbiAqIFRvIGFjaGlldmUgdGhpcyBiZWhhdmlvciwgdGhlIG1ldGhvZCBgYWRkVG9Mb2dpY2FsSWQoZGF0YSlgIGNhbiBiZSB1c2VkIHRvXG4gKiBhdWdtZW50IHRoZSBsb2dpY2FsIElEIGdlbmVyYXRlZCBmb3IgdGhlIGRlcGxveW1lbnQgcmVzb3VyY2Ugc3VjaCB0aGF0IGl0XG4gKiB3aWxsIGluY2x1ZGUgYXJiaXRyYXJ5IGRhdGEuIFRoaXMgaXMgZG9uZSBhdXRvbWF0aWNhbGx5IGZvciB0aGVcbiAqIGByZXN0QXBpLmxhdGVzdERlcGxveW1lbnRgIGRlcGxveW1lbnQuXG4gKlxuICogRnVydGhlcm1vcmUsIHNpbmNlIGEgZGVwbG95bWVudCBkb2VzIG5vdCByZWZlcmVuY2UgYW55IG9mIHRoZSBSRVNUIEFQSVxuICogcmVzb3VyY2VzIGFuZCBtZXRob2RzLCBDbG91ZEZvcm1hdGlvbiB3aWxsIGxpa2VseSBwcm92aXNpb24gaXQgYmVmb3JlIHRoZXNlXG4gKiByZXNvdXJjZXMgYXJlIGNyZWF0ZWQsIHdoaWNoIG1lYW5zIHRoYXQgaXQgd2lsbCByZXByZXNlbnQgYSBcImhhbGYtYmFrZWRcIlxuICogbW9kZWwuIFVzZSB0aGUgYG5vZGUuYWRkRGVwZW5kZW5jeShkZXApYCBtZXRob2QgdG8gY2lyY3VtdmVudCB0aGF0LiBUaGlzIGlzIGRvbmVcbiAqIGF1dG9tYXRpY2FsbHkgZm9yIHRoZSBgcmVzdEFwaS5sYXRlc3REZXBsb3ltZW50YCBkZXBsb3ltZW50LlxuICovXG5leHBvcnQgY2xhc3MgRGVwbG95bWVudCBleHRlbmRzIFJlc291cmNlIHtcbiAgLyoqIEBhdHRyaWJ1dGUgKi9cbiAgcHVibGljIHJlYWRvbmx5IGRlcGxveW1lbnRJZDogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgYXBpOiBJUmVzdEFwaTtcblxuICBwcml2YXRlIHJlYWRvbmx5IHJlc291cmNlOiBMYXRlc3REZXBsb3ltZW50UmVzb3VyY2U7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IERlcGxveW1lbnRQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLnJlc291cmNlID0gbmV3IExhdGVzdERlcGxveW1lbnRSZXNvdXJjZSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBkZXNjcmlwdGlvbjogcHJvcHMuZGVzY3JpcHRpb24sXG4gICAgICByZXN0QXBpOiBwcm9wcy5hcGksXG4gICAgfSk7XG5cbiAgICBpZiAocHJvcHMucmV0YWluRGVwbG95bWVudHMpIHtcbiAgICAgIHRoaXMucmVzb3VyY2UuYXBwbHlSZW1vdmFsUG9saWN5KFJlbW92YWxQb2xpY3kuUkVUQUlOKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaSA9IHByb3BzLmFwaTtcbiAgICB0aGlzLmRlcGxveW1lbnRJZCA9IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gdGhpcy5yZXNvdXJjZS5yZWYgfSk7XG5cbiAgICBpZiAocHJvcHMuYXBpIGluc3RhbmNlb2YgUmVzdEFwaUJhc2UpIHtcbiAgICAgIHByb3BzLmFwaS5fYXR0YWNoRGVwbG95bWVudCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGNvbXBvbmVudCB0byB0aGUgaGFzaCB0aGF0IGRldGVybWluZXMgdGhpcyBEZXBsb3ltZW50IHJlc291cmNlJ3NcbiAgICogbG9naWNhbCBJRC5cbiAgICpcbiAgICogVGhpcyBzaG91bGQgYmUgY2FsbGVkIGJ5IGNvbnN0cnVjdHMgb2YgdGhlIEFQSSBHYXRld2F5IG1vZGVsIHRoYXQgd2FudCB0b1xuICAgKiBpbnZhbGlkYXRlIHRoZSBkZXBsb3ltZW50IHdoZW4gdGhlaXIgc2V0dGluZ3MgY2hhbmdlLiBUaGUgY29tcG9uZW50IHdpbGxcbiAgICogYmUgcmVzb2x2ZSgpZWQgZHVyaW5nIHN5bnRoZXNpcyBzbyB0b2tlbnMgYXJlIHdlbGNvbWUuXG4gICAqL1xuICBwdWJsaWMgYWRkVG9Mb2dpY2FsSWQoZGF0YTogYW55KSB7XG4gICAgdGhpcy5yZXNvdXJjZS5hZGRUb0xvZ2ljYWxJZChkYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBRdW90aW5nIGZyb20gQ2xvdWRGb3JtYXRpb24ncyBkb2NzOlxuICAgKlxuICAgKiAgIElmIHlvdSBjcmVhdGUgYW4gQVdTOjpBcGlHYXRld2F5OjpSZXN0QXBpIHJlc291cmNlIGFuZCBpdHMgbWV0aG9kcyAodXNpbmdcbiAgICogICBBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCkgaW4gdGhlIHNhbWUgdGVtcGxhdGUgYXMgeW91ciBkZXBsb3ltZW50LCB0aGVcbiAgICogICBkZXBsb3ltZW50IG11c3QgZGVwZW5kIG9uIHRoZSBSZXN0QXBpJ3MgbWV0aG9kcy4gVG8gY3JlYXRlIGEgZGVwZW5kZW5jeSxcbiAgICogICBhZGQgYSBEZXBlbmRzT24gYXR0cmlidXRlIHRvIHRoZSBkZXBsb3ltZW50LiBJZiB5b3UgZG9uJ3QsIEFXU1xuICAgKiAgIENsb3VkRm9ybWF0aW9uIGNyZWF0ZXMgdGhlIGRlcGxveW1lbnQgcmlnaHQgYWZ0ZXIgaXQgY3JlYXRlcyB0aGUgUmVzdEFwaVxuICAgKiAgIHJlc291cmNlIHRoYXQgZG9lc24ndCBjb250YWluIGFueSBtZXRob2RzLCBhbmQgQVdTIENsb3VkRm9ybWF0aW9uXG4gICAqICAgZW5jb3VudGVycyB0aGUgZm9sbG93aW5nIGVycm9yOiBUaGUgUkVTVCBBUEkgZG9lc24ndCBjb250YWluIGFueSBtZXRob2RzLlxuICAgKlxuICAgKiBAcGFyYW0gbWV0aG9kIFRoZSBtZXRob2QgdG8gYWRkIGFzIGEgZGVwZW5kZW5jeSBvZiB0aGUgZGVwbG95bWVudFxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1yZXNvdXJjZS1hcGlnYXRld2F5LWRlcGxveW1lbnQuaHRtbFxuICAgKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay9wdWxsLzYxNjVcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX2FkZE1ldGhvZERlcGVuZGVuY3kobWV0aG9kOiBNZXRob2QpIHtcbiAgICAvLyBhZGRpbmcgYSBkZXBlbmRlbmN5IGJldHdlZW4gdGhlIGNvbnN0cnVjdHMgdXNpbmcgYG5vZGUuYWRkRGVwZW5kZW5jeSgpYFxuICAgIC8vIHdpbGwgY3JlYXRlIGFkZGl0aW9uYWwgZGVwZW5kZW5jaWVzIGJldHdlZW4gYEFXUzo6QXBpR2F0ZXdheTo6RGVwbG95bWVudGBcbiAgICAvLyBhbmQgdGhlIGBBV1M6OkxhbWJkYTo6UGVybWlzc2lvbmAgcmVzb3VyY2VzIChjaGlsZHJlbiB1bmRlciBNZXRob2QpLFxuICAgIC8vIGNhdXNpbmcgY3ljbGljIGRlcGVuZGVuY3kgZXJyb3JzLiBIZW5jZSwgZmFsbGluZyBiYWNrIHRvIGRlY2xhcmluZ1xuICAgIC8vIGRlcGVuZGVuY2llcyBiZXR3ZWVuIHRoZSB1bmRlcmx5aW5nIENmblJlc291cmNlcy5cbiAgICB0aGlzLm5vZGUuYWRkRGVwZW5kZW5jeShtZXRob2Qubm9kZS5kZWZhdWx0Q2hpbGQgYXMgQ2ZuUmVzb3VyY2UpO1xuICB9XG59XG5cbmludGVyZmFjZSBMYXRlc3REZXBsb3ltZW50UmVzb3VyY2VQcm9wcyB7XG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICByZWFkb25seSByZXN0QXBpOiBJUmVzdEFwaTtcbn1cblxuY2xhc3MgTGF0ZXN0RGVwbG95bWVudFJlc291cmNlIGV4dGVuZHMgQ2ZuRGVwbG95bWVudCB7XG4gIHByaXZhdGUgcmVhZG9ubHkgaGFzaENvbXBvbmVudHMgPSBuZXcgQXJyYXk8YW55PigpO1xuICBwcml2YXRlIHJlYWRvbmx5IG9yaWdpbmFsTG9naWNhbElkOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgYXBpOiBJUmVzdEFwaTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTGF0ZXN0RGVwbG95bWVudFJlc291cmNlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiBwcm9wcy5kZXNjcmlwdGlvbixcbiAgICAgIHJlc3RBcGlJZDogcHJvcHMucmVzdEFwaS5yZXN0QXBpSWQsXG4gICAgfSk7XG5cbiAgICB0aGlzLmFwaSA9IHByb3BzLnJlc3RBcGk7XG4gICAgdGhpcy5vcmlnaW5hbExvZ2ljYWxJZCA9IHRoaXMuc3RhY2suZ2V0TG9naWNhbElkKHRoaXMpO1xuICAgIHRoaXMub3ZlcnJpZGVMb2dpY2FsSWQoTGF6eS51bmNhY2hlZFN0cmluZyh7IHByb2R1Y2U6ICgpID0+IHRoaXMuY2FsY3VsYXRlTG9naWNhbElkKCkgfSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93cyBhZGRpbmcgYXJiaXRyYXJ5IGRhdGEgdG8gdGhlIGhhc2hlZCBsb2dpY2FsIElEIG9mIHRoaXMgZGVwbG95bWVudC5cbiAgICogVGhpcyBjYW4gYmUgdXNlZCB0byBjb3VwbGUgdGhlIGRlcGxveW1lbnQgdG8gdGhlIEFQSSBHYXRld2F5IG1vZGVsLlxuICAgKi9cbiAgcHVibGljIGFkZFRvTG9naWNhbElkKGRhdGE6IHVua25vd24pIHtcbiAgICAvLyBpZiB0aGUgY29uc3RydWN0IGlzIGxvY2tlZCwgaXQgbWVhbnMgd2UgYXJlIGFscmVhZHkgc3ludGhlc2l6aW5nIGFuZCB0aGVuXG4gICAgLy8gd2UgY2FuJ3QgbW9kaWZ5IHRoZSBoYXNoIGJlY2F1c2Ugd2UgbWlnaHQgaGF2ZSBhbHJlYWR5IGNhbGN1bGF0ZWQgaXQuXG4gICAgaWYgKHRoaXMubm9kZS5sb2NrZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IG1vZGlmeSB0aGUgbG9naWNhbCBJRCB3aGVuIHRoZSBjb25zdHJ1Y3QgaXMgbG9ja2VkJyk7XG4gICAgfVxuXG4gICAgdGhpcy5oYXNoQ29tcG9uZW50cy5wdXNoKGRhdGEpO1xuICB9XG5cbiAgcHJpdmF0ZSBjYWxjdWxhdGVMb2dpY2FsSWQoKSB7XG4gICAgY29uc3QgaGFzaCA9IFsuLi50aGlzLmhhc2hDb21wb25lbnRzXTtcblxuICAgIGlmICh0aGlzLmFwaSBpbnN0YW5jZW9mIFJlc3RBcGkgfHwgdGhpcy5hcGkgaW5zdGFuY2VvZiBTcGVjUmVzdEFwaSkgeyAvLyBJZ25vcmUgSVJlc3RBcGkgdGhhdCBhcmUgaW1wb3J0ZWRcblxuICAgICAgLy8gQWRkIENmblJlc3RBcGkgdG8gdGhlIGxvZ2ljYWwgaWQgc28gYSBuZXcgZGVwbG95bWVudCBpcyB0cmlnZ2VyZWQgd2hlbiBhbnkgb2YgaXRzIHByb3BlcnRpZXMgY2hhbmdlLlxuICAgICAgY29uc3QgY2ZuUmVzdEFwaUNGID0gKHRoaXMuYXBpLm5vZGUuZGVmYXVsdENoaWxkIGFzIGFueSkuX3RvQ2xvdWRGb3JtYXRpb24oKTtcbiAgICAgIGhhc2gucHVzaCh0aGlzLnN0YWNrLnJlc29sdmUoY2ZuUmVzdEFwaUNGKSk7XG4gICAgfVxuXG4gICAgbGV0IGxpZCA9IHRoaXMub3JpZ2luYWxMb2dpY2FsSWQ7XG5cbiAgICAvLyBpZiBoYXNoIGNvbXBvbmVudHMgd2VyZSBhZGRlZCB0byB0aGUgZGVwbG95bWVudCwgd2UgdXNlIHRoZW0gdG8gY2FsY3VsYXRlXG4gICAgLy8gYSBsb2dpY2FsIElEIGZvciB0aGUgZGVwbG95bWVudCByZXNvdXJjZS5cbiAgICBpZiAoaGFzaC5sZW5ndGggPiAwKSB7XG4gICAgICBsaWQgKz0gbWQ1aGFzaChoYXNoLm1hcCh4ID0+IHRoaXMuc3RhY2sucmVzb2x2ZSh4KSkubWFwKGMgPT4gSlNPTi5zdHJpbmdpZnkoYykpLmpvaW4oJycpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbGlkO1xuICB9XG59XG4iXX0=