using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AutoScaling.cloudformation.ScalingPolicyResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predefinedmetricspecification.html </remarks>
    [JsiiInterface(typeof(IPredefinedMetricSpecificationProperty), "@aws-cdk/aws-autoscaling.cloudformation.ScalingPolicyResource.PredefinedMetricSpecificationProperty")]
    public interface IPredefinedMetricSpecificationProperty
    {
        /// <summary>``ScalingPolicyResource.PredefinedMetricSpecificationProperty.PredefinedMetricType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predefinedmetricspecification.html#cfn-autoscaling-scalingpolicy-predefinedmetricspecification-predefinedmetrictype </remarks>
        [JsiiProperty("predefinedMetricType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object PredefinedMetricType
        {
            get;
            set;
        }

        /// <summary>``ScalingPolicyResource.PredefinedMetricSpecificationProperty.ResourceLabel``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-predefinedmetricspecification.html#cfn-autoscaling-scalingpolicy-predefinedmetricspecification-resourcelabel </remarks>
        [JsiiProperty("resourceLabel", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ResourceLabel
        {
            get;
            set;
        }
    }
}