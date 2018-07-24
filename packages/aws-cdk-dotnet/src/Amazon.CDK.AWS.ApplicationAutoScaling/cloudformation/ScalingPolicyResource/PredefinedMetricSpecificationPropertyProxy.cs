using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ApplicationAutoScaling.cloudformation.ScalingPolicyResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-predefinedmetricspecification.html </remarks>
    [JsiiInterfaceProxy(typeof(IPredefinedMetricSpecificationProperty), "@aws-cdk/aws-applicationautoscaling.cloudformation.ScalingPolicyResource.PredefinedMetricSpecificationProperty")]
    internal class PredefinedMetricSpecificationPropertyProxy : DeputyBase, IPredefinedMetricSpecificationProperty
    {
        private PredefinedMetricSpecificationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ScalingPolicyResource.PredefinedMetricSpecificationProperty.PredefinedMetricType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-predefinedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-predefinedmetricspecification-predefinedmetrictype </remarks>
        [JsiiProperty("predefinedMetricType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object PredefinedMetricType
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPolicyResource.PredefinedMetricSpecificationProperty.ResourceLabel``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-predefinedmetricspecification.html#cfn-applicationautoscaling-scalingpolicy-predefinedmetricspecification-resourcelabel </remarks>
        [JsiiProperty("resourceLabel", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ResourceLabel
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}