using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ApplicationAutoScaling.cloudformation.ScalingPolicyResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html </remarks>
    [JsiiInterface(typeof(ITargetTrackingScalingPolicyConfigurationProperty), "@aws-cdk/aws-applicationautoscaling.cloudformation.ScalingPolicyResource.TargetTrackingScalingPolicyConfigurationProperty")]
    public interface ITargetTrackingScalingPolicyConfigurationProperty
    {
        /// <summary>``ScalingPolicyResource.TargetTrackingScalingPolicyConfigurationProperty.CustomizedMetricSpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-customizedmetricspecification </remarks>
        [JsiiProperty("customizedMetricSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-applicationautoscaling.cloudformation.ScalingPolicyResource.CustomizedMetricSpecificationProperty\"}]},\"optional\":true}")]
        object CustomizedMetricSpecification
        {
            get;
            set;
        }

        /// <summary>``ScalingPolicyResource.TargetTrackingScalingPolicyConfigurationProperty.DisableScaleIn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-disablescalein </remarks>
        [JsiiProperty("disableScaleIn", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DisableScaleIn
        {
            get;
            set;
        }

        /// <summary>``ScalingPolicyResource.TargetTrackingScalingPolicyConfigurationProperty.PredefinedMetricSpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-predefinedmetricspecification </remarks>
        [JsiiProperty("predefinedMetricSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-applicationautoscaling.cloudformation.ScalingPolicyResource.PredefinedMetricSpecificationProperty\"}]},\"optional\":true}")]
        object PredefinedMetricSpecification
        {
            get;
            set;
        }

        /// <summary>``ScalingPolicyResource.TargetTrackingScalingPolicyConfigurationProperty.ScaleInCooldown``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-scaleincooldown </remarks>
        [JsiiProperty("scaleInCooldown", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ScaleInCooldown
        {
            get;
            set;
        }

        /// <summary>``ScalingPolicyResource.TargetTrackingScalingPolicyConfigurationProperty.ScaleOutCooldown``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-scaleoutcooldown </remarks>
        [JsiiProperty("scaleOutCooldown", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ScaleOutCooldown
        {
            get;
            set;
        }

        /// <summary>``ScalingPolicyResource.TargetTrackingScalingPolicyConfigurationProperty.TargetValue``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-targetvalue </remarks>
        [JsiiProperty("targetValue", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object TargetValue
        {
            get;
            set;
        }
    }
}