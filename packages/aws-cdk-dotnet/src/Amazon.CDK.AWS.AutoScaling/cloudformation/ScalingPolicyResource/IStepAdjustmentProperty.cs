using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AutoScaling.cloudformation.ScalingPolicyResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-stepadjustments.html </remarks>
    [JsiiInterface(typeof(IStepAdjustmentProperty), "@aws-cdk/aws-autoscaling.cloudformation.ScalingPolicyResource.StepAdjustmentProperty")]
    public interface IStepAdjustmentProperty
    {
        /// <summary>``ScalingPolicyResource.StepAdjustmentProperty.MetricIntervalLowerBound``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-stepadjustments.html#cfn-autoscaling-scalingpolicy-stepadjustment-metricintervallowerbound </remarks>
        [JsiiProperty("metricIntervalLowerBound", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object MetricIntervalLowerBound
        {
            get;
            set;
        }

        /// <summary>``ScalingPolicyResource.StepAdjustmentProperty.MetricIntervalUpperBound``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-stepadjustments.html#cfn-autoscaling-scalingpolicy-stepadjustment-metricintervalupperbound </remarks>
        [JsiiProperty("metricIntervalUpperBound", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object MetricIntervalUpperBound
        {
            get;
            set;
        }

        /// <summary>``ScalingPolicyResource.StepAdjustmentProperty.ScalingAdjustment``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-stepadjustments.html#cfn-autoscaling-scalingpolicy-stepadjustment-scalingadjustment </remarks>
        [JsiiProperty("scalingAdjustment", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object ScalingAdjustment
        {
            get;
            set;
        }
    }
}