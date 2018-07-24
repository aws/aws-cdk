using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.InstanceGroupConfigResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-simplescalingpolicyconfiguration.html </remarks>
    public class SimpleScalingPolicyConfigurationProperty : DeputyBase, Amazon.CDK.AWS.EMR.cloudformation.InstanceGroupConfigResource.ISimpleScalingPolicyConfigurationProperty
    {
        /// <summary>``InstanceGroupConfigResource.SimpleScalingPolicyConfigurationProperty.AdjustmentType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-simplescalingpolicyconfiguration.html#cfn-elasticmapreduce-instancegroupconfig-simplescalingpolicyconfiguration-adjustmenttype </remarks>
        [JsiiProperty("adjustmentType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object AdjustmentType
        {
            get;
            set;
        }

        /// <summary>``InstanceGroupConfigResource.SimpleScalingPolicyConfigurationProperty.CoolDown``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-simplescalingpolicyconfiguration.html#cfn-elasticmapreduce-instancegroupconfig-simplescalingpolicyconfiguration-cooldown </remarks>
        [JsiiProperty("coolDown", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object CoolDown
        {
            get;
            set;
        }

        /// <summary>``InstanceGroupConfigResource.SimpleScalingPolicyConfigurationProperty.ScalingAdjustment``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-simplescalingpolicyconfiguration.html#cfn-elasticmapreduce-instancegroupconfig-simplescalingpolicyconfiguration-scalingadjustment </remarks>
        [JsiiProperty("scalingAdjustment", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object ScalingAdjustment
        {
            get;
            set;
        }
    }
}