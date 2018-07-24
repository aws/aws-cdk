using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AutoScaling.cloudformation.ScalingPolicyResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-targettrackingconfiguration.html </remarks>
    [JsiiInterface(typeof(ITargetTrackingConfigurationProperty), "@aws-cdk/aws-autoscaling.cloudformation.ScalingPolicyResource.TargetTrackingConfigurationProperty")]
    public interface ITargetTrackingConfigurationProperty
    {
        /// <summary>``ScalingPolicyResource.TargetTrackingConfigurationProperty.CustomizedMetricSpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-targettrackingconfiguration.html#cfn-autoscaling-scalingpolicy-targettrackingconfiguration-customizedmetricspecification </remarks>
        [JsiiProperty("customizedMetricSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-autoscaling.cloudformation.ScalingPolicyResource.CustomizedMetricSpecificationProperty\"}]},\"optional\":true}")]
        object CustomizedMetricSpecification
        {
            get;
            set;
        }

        /// <summary>``ScalingPolicyResource.TargetTrackingConfigurationProperty.DisableScaleIn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-targettrackingconfiguration.html#cfn-autoscaling-scalingpolicy-targettrackingconfiguration-disablescalein </remarks>
        [JsiiProperty("disableScaleIn", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DisableScaleIn
        {
            get;
            set;
        }

        /// <summary>``ScalingPolicyResource.TargetTrackingConfigurationProperty.PredefinedMetricSpecification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-targettrackingconfiguration.html#cfn-autoscaling-scalingpolicy-targettrackingconfiguration-predefinedmetricspecification </remarks>
        [JsiiProperty("predefinedMetricSpecification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-autoscaling.cloudformation.ScalingPolicyResource.PredefinedMetricSpecificationProperty\"}]},\"optional\":true}")]
        object PredefinedMetricSpecification
        {
            get;
            set;
        }

        /// <summary>``ScalingPolicyResource.TargetTrackingConfigurationProperty.TargetValue``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscaling-scalingpolicy-targettrackingconfiguration.html#cfn-autoscaling-scalingpolicy-targettrackingconfiguration-targetvalue </remarks>
        [JsiiProperty("targetValue", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object TargetValue
        {
            get;
            set;
        }
    }
}