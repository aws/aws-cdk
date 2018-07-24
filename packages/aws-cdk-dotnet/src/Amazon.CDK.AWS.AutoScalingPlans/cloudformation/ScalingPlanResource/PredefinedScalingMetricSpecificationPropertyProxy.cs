using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AutoScalingPlans.cloudformation.ScalingPlanResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-predefinedscalingmetricspecification.html </remarks>
    [JsiiInterfaceProxy(typeof(IPredefinedScalingMetricSpecificationProperty), "@aws-cdk/aws-autoscalingplans.cloudformation.ScalingPlanResource.PredefinedScalingMetricSpecificationProperty")]
    internal class PredefinedScalingMetricSpecificationPropertyProxy : DeputyBase, IPredefinedScalingMetricSpecificationProperty
    {
        private PredefinedScalingMetricSpecificationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ScalingPlanResource.PredefinedScalingMetricSpecificationProperty.PredefinedScalingMetricType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-predefinedscalingmetricspecification.html#cfn-autoscalingplans-scalingplan-predefinedscalingmetricspecification-predefinedscalingmetrictype </remarks>
        [JsiiProperty("predefinedScalingMetricType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object PredefinedScalingMetricType
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPlanResource.PredefinedScalingMetricSpecificationProperty.ResourceLabel``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-predefinedscalingmetricspecification.html#cfn-autoscalingplans-scalingplan-predefinedscalingmetricspecification-resourcelabel </remarks>
        [JsiiProperty("resourceLabel", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ResourceLabel
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}