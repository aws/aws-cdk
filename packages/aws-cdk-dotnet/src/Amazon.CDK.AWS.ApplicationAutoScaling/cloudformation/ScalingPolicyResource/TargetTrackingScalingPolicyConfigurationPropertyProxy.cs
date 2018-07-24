using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ApplicationAutoScaling.cloudformation.ScalingPolicyResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(ITargetTrackingScalingPolicyConfigurationProperty), "@aws-cdk/aws-applicationautoscaling.cloudformation.ScalingPolicyResource.TargetTrackingScalingPolicyConfigurationProperty")]
    internal class TargetTrackingScalingPolicyConfigurationPropertyProxy : DeputyBase, ITargetTrackingScalingPolicyConfigurationProperty
    {
        private TargetTrackingScalingPolicyConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ScalingPolicyResource.TargetTrackingScalingPolicyConfigurationProperty.CustomizedMetricSpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-customizedmetricspecification </remarks>
        [JsiiProperty("customizedMetricSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-applicationautoscaling.cloudformation.ScalingPolicyResource.CustomizedMetricSpecificationProperty\"}]},\"optional\":true}")]
        public virtual object CustomizedMetricSpecification
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPolicyResource.TargetTrackingScalingPolicyConfigurationProperty.DisableScaleIn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-disablescalein </remarks>
        [JsiiProperty("disableScaleIn", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object DisableScaleIn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPolicyResource.TargetTrackingScalingPolicyConfigurationProperty.PredefinedMetricSpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-predefinedmetricspecification </remarks>
        [JsiiProperty("predefinedMetricSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-applicationautoscaling.cloudformation.ScalingPolicyResource.PredefinedMetricSpecificationProperty\"}]},\"optional\":true}")]
        public virtual object PredefinedMetricSpecification
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPolicyResource.TargetTrackingScalingPolicyConfigurationProperty.ScaleInCooldown``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-scaleincooldown </remarks>
        [JsiiProperty("scaleInCooldown", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ScaleInCooldown
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPolicyResource.TargetTrackingScalingPolicyConfigurationProperty.ScaleOutCooldown``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-scaleoutcooldown </remarks>
        [JsiiProperty("scaleOutCooldown", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ScaleOutCooldown
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPolicyResource.TargetTrackingScalingPolicyConfigurationProperty.TargetValue``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration.html#cfn-applicationautoscaling-scalingpolicy-targettrackingscalingpolicyconfiguration-targetvalue </remarks>
        [JsiiProperty("targetValue", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object TargetValue
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}