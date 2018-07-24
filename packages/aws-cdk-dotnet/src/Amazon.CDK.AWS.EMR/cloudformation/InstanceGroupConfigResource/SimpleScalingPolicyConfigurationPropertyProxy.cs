using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.InstanceGroupConfigResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-simplescalingpolicyconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(ISimpleScalingPolicyConfigurationProperty), "@aws-cdk/aws-emr.cloudformation.InstanceGroupConfigResource.SimpleScalingPolicyConfigurationProperty")]
    internal class SimpleScalingPolicyConfigurationPropertyProxy : DeputyBase, Amazon.CDK.AWS.EMR.cloudformation.InstanceGroupConfigResource.ISimpleScalingPolicyConfigurationProperty
    {
        private SimpleScalingPolicyConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``InstanceGroupConfigResource.SimpleScalingPolicyConfigurationProperty.AdjustmentType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-simplescalingpolicyconfiguration.html#cfn-elasticmapreduce-instancegroupconfig-simplescalingpolicyconfiguration-adjustmenttype </remarks>
        [JsiiProperty("adjustmentType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object AdjustmentType
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``InstanceGroupConfigResource.SimpleScalingPolicyConfigurationProperty.CoolDown``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-simplescalingpolicyconfiguration.html#cfn-elasticmapreduce-instancegroupconfig-simplescalingpolicyconfiguration-cooldown </remarks>
        [JsiiProperty("coolDown", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object CoolDown
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``InstanceGroupConfigResource.SimpleScalingPolicyConfigurationProperty.ScalingAdjustment``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-simplescalingpolicyconfiguration.html#cfn-elasticmapreduce-instancegroupconfig-simplescalingpolicyconfiguration-scalingadjustment </remarks>
        [JsiiProperty("scalingAdjustment", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ScalingAdjustment
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}