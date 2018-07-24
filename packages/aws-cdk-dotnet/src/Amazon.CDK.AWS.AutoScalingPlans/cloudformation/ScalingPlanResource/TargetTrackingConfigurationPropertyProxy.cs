using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AutoScalingPlans.cloudformation.ScalingPlanResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-targettrackingconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(ITargetTrackingConfigurationProperty), "@aws-cdk/aws-autoscalingplans.cloudformation.ScalingPlanResource.TargetTrackingConfigurationProperty")]
    internal class TargetTrackingConfigurationPropertyProxy : DeputyBase, ITargetTrackingConfigurationProperty
    {
        private TargetTrackingConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ScalingPlanResource.TargetTrackingConfigurationProperty.CustomizedScalingMetricSpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-targettrackingconfiguration.html#cfn-autoscalingplans-scalingplan-targettrackingconfiguration-customizedscalingmetricspecification </remarks>
        [JsiiProperty("customizedScalingMetricSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-autoscalingplans.cloudformation.ScalingPlanResource.CustomizedScalingMetricSpecificationProperty\"}]},\"optional\":true}")]
        public virtual object CustomizedScalingMetricSpecification
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPlanResource.TargetTrackingConfigurationProperty.DisableScaleIn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-targettrackingconfiguration.html#cfn-autoscalingplans-scalingplan-targettrackingconfiguration-disablescalein </remarks>
        [JsiiProperty("disableScaleIn", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object DisableScaleIn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPlanResource.TargetTrackingConfigurationProperty.EstimatedInstanceWarmup``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-targettrackingconfiguration.html#cfn-autoscalingplans-scalingplan-targettrackingconfiguration-estimatedinstancewarmup </remarks>
        [JsiiProperty("estimatedInstanceWarmup", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object EstimatedInstanceWarmup
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPlanResource.TargetTrackingConfigurationProperty.PredefinedScalingMetricSpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-targettrackingconfiguration.html#cfn-autoscalingplans-scalingplan-targettrackingconfiguration-predefinedscalingmetricspecification </remarks>
        [JsiiProperty("predefinedScalingMetricSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-autoscalingplans.cloudformation.ScalingPlanResource.PredefinedScalingMetricSpecificationProperty\"}]},\"optional\":true}")]
        public virtual object PredefinedScalingMetricSpecification
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPlanResource.TargetTrackingConfigurationProperty.ScaleInCooldown``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-targettrackingconfiguration.html#cfn-autoscalingplans-scalingplan-targettrackingconfiguration-scaleincooldown </remarks>
        [JsiiProperty("scaleInCooldown", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ScaleInCooldown
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPlanResource.TargetTrackingConfigurationProperty.ScaleOutCooldown``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-targettrackingconfiguration.html#cfn-autoscalingplans-scalingplan-targettrackingconfiguration-scaleoutcooldown </remarks>
        [JsiiProperty("scaleOutCooldown", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ScaleOutCooldown
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPlanResource.TargetTrackingConfigurationProperty.TargetValue``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-targettrackingconfiguration.html#cfn-autoscalingplans-scalingplan-targettrackingconfiguration-targetvalue </remarks>
        [JsiiProperty("targetValue", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object TargetValue
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}