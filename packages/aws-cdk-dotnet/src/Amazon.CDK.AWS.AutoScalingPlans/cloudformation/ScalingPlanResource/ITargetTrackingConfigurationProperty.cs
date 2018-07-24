using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AutoScalingPlans.cloudformation.ScalingPlanResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-targettrackingconfiguration.html </remarks>
    [JsiiInterface(typeof(ITargetTrackingConfigurationProperty), "@aws-cdk/aws-autoscalingplans.cloudformation.ScalingPlanResource.TargetTrackingConfigurationProperty")]
    public interface ITargetTrackingConfigurationProperty
    {
        /// <summary>``ScalingPlanResource.TargetTrackingConfigurationProperty.CustomizedScalingMetricSpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-targettrackingconfiguration.html#cfn-autoscalingplans-scalingplan-targettrackingconfiguration-customizedscalingmetricspecification </remarks>
        [JsiiProperty("customizedScalingMetricSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-autoscalingplans.cloudformation.ScalingPlanResource.CustomizedScalingMetricSpecificationProperty\"}]},\"optional\":true}")]
        object CustomizedScalingMetricSpecification
        {
            get;
            set;
        }

        /// <summary>``ScalingPlanResource.TargetTrackingConfigurationProperty.DisableScaleIn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-targettrackingconfiguration.html#cfn-autoscalingplans-scalingplan-targettrackingconfiguration-disablescalein </remarks>
        [JsiiProperty("disableScaleIn", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DisableScaleIn
        {
            get;
            set;
        }

        /// <summary>``ScalingPlanResource.TargetTrackingConfigurationProperty.EstimatedInstanceWarmup``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-targettrackingconfiguration.html#cfn-autoscalingplans-scalingplan-targettrackingconfiguration-estimatedinstancewarmup </remarks>
        [JsiiProperty("estimatedInstanceWarmup", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object EstimatedInstanceWarmup
        {
            get;
            set;
        }

        /// <summary>``ScalingPlanResource.TargetTrackingConfigurationProperty.PredefinedScalingMetricSpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-targettrackingconfiguration.html#cfn-autoscalingplans-scalingplan-targettrackingconfiguration-predefinedscalingmetricspecification </remarks>
        [JsiiProperty("predefinedScalingMetricSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-autoscalingplans.cloudformation.ScalingPlanResource.PredefinedScalingMetricSpecificationProperty\"}]},\"optional\":true}")]
        object PredefinedScalingMetricSpecification
        {
            get;
            set;
        }

        /// <summary>``ScalingPlanResource.TargetTrackingConfigurationProperty.ScaleInCooldown``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-targettrackingconfiguration.html#cfn-autoscalingplans-scalingplan-targettrackingconfiguration-scaleincooldown </remarks>
        [JsiiProperty("scaleInCooldown", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ScaleInCooldown
        {
            get;
            set;
        }

        /// <summary>``ScalingPlanResource.TargetTrackingConfigurationProperty.ScaleOutCooldown``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-targettrackingconfiguration.html#cfn-autoscalingplans-scalingplan-targettrackingconfiguration-scaleoutcooldown </remarks>
        [JsiiProperty("scaleOutCooldown", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ScaleOutCooldown
        {
            get;
            set;
        }

        /// <summary>``ScalingPlanResource.TargetTrackingConfigurationProperty.TargetValue``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-targettrackingconfiguration.html#cfn-autoscalingplans-scalingplan-targettrackingconfiguration-targetvalue </remarks>
        [JsiiProperty("targetValue", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object TargetValue
        {
            get;
            set;
        }
    }
}