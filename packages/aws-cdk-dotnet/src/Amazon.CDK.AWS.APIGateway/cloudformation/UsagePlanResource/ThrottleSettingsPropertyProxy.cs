using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.APIGateway.cloudformation.UsagePlanResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-throttlesettings.html </remarks>
    [JsiiInterfaceProxy(typeof(IThrottleSettingsProperty), "@aws-cdk/aws-apigateway.cloudformation.UsagePlanResource.ThrottleSettingsProperty")]
    internal class ThrottleSettingsPropertyProxy : DeputyBase, IThrottleSettingsProperty
    {
        private ThrottleSettingsPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``UsagePlanResource.ThrottleSettingsProperty.BurstLimit``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-throttlesettings.html#cfn-apigateway-usageplan-throttlesettings-burstlimit </remarks>
        [JsiiProperty("burstLimit", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object BurstLimit
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``UsagePlanResource.ThrottleSettingsProperty.RateLimit``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-throttlesettings.html#cfn-apigateway-usageplan-throttlesettings-ratelimit </remarks>
        [JsiiProperty("rateLimit", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object RateLimit
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}