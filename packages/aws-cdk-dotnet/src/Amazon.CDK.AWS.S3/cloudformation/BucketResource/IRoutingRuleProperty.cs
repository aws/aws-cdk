using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.S3.cloudformation.BucketResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules.html </remarks>
    [JsiiInterface(typeof(IRoutingRuleProperty), "@aws-cdk/aws-s3.cloudformation.BucketResource.RoutingRuleProperty")]
    public interface IRoutingRuleProperty
    {
        /// <summary>``BucketResource.RoutingRuleProperty.RedirectRule``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules.html#cfn-s3-websiteconfiguration-routingrules-redirectrule </remarks>
        [JsiiProperty("redirectRule", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.RedirectRuleProperty\"}]}}")]
        object RedirectRule
        {
            get;
            set;
        }

        /// <summary>``BucketResource.RoutingRuleProperty.RoutingRuleCondition``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-websiteconfiguration-routingrules.html#cfn-s3-websiteconfiguration-routingrules-routingrulecondition </remarks>
        [JsiiProperty("routingRuleCondition", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-s3.cloudformation.BucketResource.RoutingRuleConditionProperty\"}]},\"optional\":true}")]
        object RoutingRuleCondition
        {
            get;
            set;
        }
    }
}