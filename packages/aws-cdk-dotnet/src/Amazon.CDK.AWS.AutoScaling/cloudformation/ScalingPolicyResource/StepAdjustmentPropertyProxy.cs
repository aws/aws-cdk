using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AutoScaling.cloudformation.ScalingPolicyResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-stepadjustments.html </remarks>
    [JsiiInterfaceProxy(typeof(IStepAdjustmentProperty), "@aws-cdk/aws-autoscaling.cloudformation.ScalingPolicyResource.StepAdjustmentProperty")]
    internal class StepAdjustmentPropertyProxy : DeputyBase, IStepAdjustmentProperty
    {
        private StepAdjustmentPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ScalingPolicyResource.StepAdjustmentProperty.MetricIntervalLowerBound``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-stepadjustments.html#cfn-autoscaling-scalingpolicy-stepadjustment-metricintervallowerbound </remarks>
        [JsiiProperty("metricIntervalLowerBound", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object MetricIntervalLowerBound
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPolicyResource.StepAdjustmentProperty.MetricIntervalUpperBound``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-stepadjustments.html#cfn-autoscaling-scalingpolicy-stepadjustment-metricintervalupperbound </remarks>
        [JsiiProperty("metricIntervalUpperBound", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object MetricIntervalUpperBound
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPolicyResource.StepAdjustmentProperty.ScalingAdjustment``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-stepadjustments.html#cfn-autoscaling-scalingpolicy-stepadjustment-scalingadjustment </remarks>
        [JsiiProperty("scalingAdjustment", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ScalingAdjustment
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}