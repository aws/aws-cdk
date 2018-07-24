using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AutoScalingPlans.cloudformation.ScalingPlanResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-predefinedscalingmetricspecification.html </remarks>
    [JsiiInterface(typeof(IPredefinedScalingMetricSpecificationProperty), "@aws-cdk/aws-autoscalingplans.cloudformation.ScalingPlanResource.PredefinedScalingMetricSpecificationProperty")]
    public interface IPredefinedScalingMetricSpecificationProperty
    {
        /// <summary>``ScalingPlanResource.PredefinedScalingMetricSpecificationProperty.PredefinedScalingMetricType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-predefinedscalingmetricspecification.html#cfn-autoscalingplans-scalingplan-predefinedscalingmetricspecification-predefinedscalingmetrictype </remarks>
        [JsiiProperty("predefinedScalingMetricType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object PredefinedScalingMetricType
        {
            get;
            set;
        }

        /// <summary>``ScalingPlanResource.PredefinedScalingMetricSpecificationProperty.ResourceLabel``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-predefinedscalingmetricspecification.html#cfn-autoscalingplans-scalingplan-predefinedscalingmetricspecification-resourcelabel </remarks>
        [JsiiProperty("resourceLabel", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ResourceLabel
        {
            get;
            set;
        }
    }
}