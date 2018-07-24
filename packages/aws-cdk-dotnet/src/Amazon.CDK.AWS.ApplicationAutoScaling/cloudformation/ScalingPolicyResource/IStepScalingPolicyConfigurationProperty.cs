using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ApplicationAutoScaling.cloudformation.ScalingPolicyResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration.html </remarks>
    [JsiiInterface(typeof(IStepScalingPolicyConfigurationProperty), "@aws-cdk/aws-applicationautoscaling.cloudformation.ScalingPolicyResource.StepScalingPolicyConfigurationProperty")]
    public interface IStepScalingPolicyConfigurationProperty
    {
        /// <summary>``ScalingPolicyResource.StepScalingPolicyConfigurationProperty.AdjustmentType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-adjustmenttype </remarks>
        [JsiiProperty("adjustmentType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object AdjustmentType
        {
            get;
            set;
        }

        /// <summary>``ScalingPolicyResource.StepScalingPolicyConfigurationProperty.Cooldown``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-cooldown </remarks>
        [JsiiProperty("cooldown", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Cooldown
        {
            get;
            set;
        }

        /// <summary>``ScalingPolicyResource.StepScalingPolicyConfigurationProperty.MetricAggregationType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-metricaggregationtype </remarks>
        [JsiiProperty("metricAggregationType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object MetricAggregationType
        {
            get;
            set;
        }

        /// <summary>``ScalingPolicyResource.StepScalingPolicyConfigurationProperty.MinAdjustmentMagnitude``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-minadjustmentmagnitude </remarks>
        [JsiiProperty("minAdjustmentMagnitude", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object MinAdjustmentMagnitude
        {
            get;
            set;
        }

        /// <summary>``ScalingPolicyResource.StepScalingPolicyConfigurationProperty.StepAdjustments``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-stepscalingpolicyconfiguration-stepadjustments </remarks>
        [JsiiProperty("stepAdjustments", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-applicationautoscaling.cloudformation.ScalingPolicyResource.StepAdjustmentProperty\"}]}}}}]},\"optional\":true}")]
        object StepAdjustments
        {
            get;
            set;
        }
    }
}