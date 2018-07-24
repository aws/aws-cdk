using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.APIGateway.cloudformation.UsagePlanResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-throttlesettings.html </remarks>
    [JsiiInterface(typeof(IThrottleSettingsProperty), "@aws-cdk/aws-apigateway.cloudformation.UsagePlanResource.ThrottleSettingsProperty")]
    public interface IThrottleSettingsProperty
    {
        /// <summary>``UsagePlanResource.ThrottleSettingsProperty.BurstLimit``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-throttlesettings.html#cfn-apigateway-usageplan-throttlesettings-burstlimit </remarks>
        [JsiiProperty("burstLimit", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object BurstLimit
        {
            get;
            set;
        }

        /// <summary>``UsagePlanResource.ThrottleSettingsProperty.RateLimit``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-throttlesettings.html#cfn-apigateway-usageplan-throttlesettings-ratelimit </remarks>
        [JsiiProperty("rateLimit", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object RateLimit
        {
            get;
            set;
        }
    }
}