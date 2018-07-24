using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.InstanceGroupConfigResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingaction.html </remarks>
    [JsiiInterfaceProxy(typeof(IScalingActionProperty), "@aws-cdk/aws-emr.cloudformation.InstanceGroupConfigResource.ScalingActionProperty")]
    internal class ScalingActionPropertyProxy : DeputyBase, Amazon.CDK.AWS.EMR.cloudformation.InstanceGroupConfigResource.IScalingActionProperty
    {
        private ScalingActionPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``InstanceGroupConfigResource.ScalingActionProperty.Market``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingaction.html#cfn-elasticmapreduce-instancegroupconfig-scalingaction-market </remarks>
        [JsiiProperty("market", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Market
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``InstanceGroupConfigResource.ScalingActionProperty.SimpleScalingPolicyConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingaction.html#cfn-elasticmapreduce-instancegroupconfig-scalingaction-simplescalingpolicyconfiguration </remarks>
        [JsiiProperty("simpleScalingPolicyConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.InstanceGroupConfigResource.SimpleScalingPolicyConfigurationProperty\"}]}}")]
        public virtual object SimpleScalingPolicyConfiguration
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}