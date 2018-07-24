using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.APIGateway.cloudformation.UsagePlanResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-quotasettings.html </remarks>
    [JsiiInterface(typeof(IQuotaSettingsProperty), "@aws-cdk/aws-apigateway.cloudformation.UsagePlanResource.QuotaSettingsProperty")]
    public interface IQuotaSettingsProperty
    {
        /// <summary>``UsagePlanResource.QuotaSettingsProperty.Limit``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-quotasettings.html#cfn-apigateway-usageplan-quotasettings-limit </remarks>
        [JsiiProperty("limit", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Limit
        {
            get;
            set;
        }

        /// <summary>``UsagePlanResource.QuotaSettingsProperty.Offset``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-quotasettings.html#cfn-apigateway-usageplan-quotasettings-offset </remarks>
        [JsiiProperty("offset", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Offset
        {
            get;
            set;
        }

        /// <summary>``UsagePlanResource.QuotaSettingsProperty.Period``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-usageplan-quotasettings.html#cfn-apigateway-usageplan-quotasettings-period </remarks>
        [JsiiProperty("period", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Period
        {
            get;
            set;
        }
    }
}