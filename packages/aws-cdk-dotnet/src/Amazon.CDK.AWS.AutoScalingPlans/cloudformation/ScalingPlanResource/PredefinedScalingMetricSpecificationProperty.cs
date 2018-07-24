using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AutoScalingPlans.cloudformation.ScalingPlanResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-predefinedscalingmetricspecification.html </remarks>
    public class PredefinedScalingMetricSpecificationProperty : DeputyBase, IPredefinedScalingMetricSpecificationProperty
    {
        /// <summary>``ScalingPlanResource.PredefinedScalingMetricSpecificationProperty.PredefinedScalingMetricType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-predefinedscalingmetricspecification.html#cfn-autoscalingplans-scalingplan-predefinedscalingmetricspecification-predefinedscalingmetrictype </remarks>
        [JsiiProperty("predefinedScalingMetricType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object PredefinedScalingMetricType
        {
            get;
            set;
        }

        /// <summary>``ScalingPlanResource.PredefinedScalingMetricSpecificationProperty.ResourceLabel``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-predefinedscalingmetricspecification.html#cfn-autoscalingplans-scalingplan-predefinedscalingmetricspecification-resourcelabel </remarks>
        [JsiiProperty("resourceLabel", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ResourceLabel
        {
            get;
            set;
        }
    }
}