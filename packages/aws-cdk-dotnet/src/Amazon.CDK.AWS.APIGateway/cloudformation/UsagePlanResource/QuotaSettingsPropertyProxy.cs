using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.APIGateway.cloudformation.UsagePlanResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-quotasettings.html </remarks>
    [JsiiInterfaceProxy(typeof(IQuotaSettingsProperty), "@aws-cdk/aws-apigateway.cloudformation.UsagePlanResource.QuotaSettingsProperty")]
    internal class QuotaSettingsPropertyProxy : DeputyBase, IQuotaSettingsProperty
    {
        private QuotaSettingsPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``UsagePlanResource.QuotaSettingsProperty.Limit``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-quotasettings.html#cfn-apigateway-usageplan-quotasettings-limit </remarks>
        [JsiiProperty("limit", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Limit
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``UsagePlanResource.QuotaSettingsProperty.Offset``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-quotasettings.html#cfn-apigateway-usageplan-quotasettings-offset </remarks>
        [JsiiProperty("offset", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Offset
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``UsagePlanResource.QuotaSettingsProperty.Period``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-quotasettings.html#cfn-apigateway-usageplan-quotasettings-period </remarks>
        [JsiiProperty("period", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Period
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}