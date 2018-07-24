using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.ClusterResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-simplescalingpolicyconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(ISimpleScalingPolicyConfigurationProperty), "@aws-cdk/aws-emr.cloudformation.ClusterResource.SimpleScalingPolicyConfigurationProperty")]
    internal class SimpleScalingPolicyConfigurationPropertyProxy : DeputyBase, Amazon.CDK.AWS.EMR.cloudformation.ClusterResource.ISimpleScalingPolicyConfigurationProperty
    {
        private SimpleScalingPolicyConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ClusterResource.SimpleScalingPolicyConfigurationProperty.AdjustmentType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-simplescalingpolicyconfiguration.html#cfn-elasticmapreduce-cluster-simplescalingpolicyconfiguration-adjustmenttype </remarks>
        [JsiiProperty("adjustmentType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object AdjustmentType
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ClusterResource.SimpleScalingPolicyConfigurationProperty.CoolDown``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-simplescalingpolicyconfiguration.html#cfn-elasticmapreduce-cluster-simplescalingpolicyconfiguration-cooldown </remarks>
        [JsiiProperty("coolDown", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object CoolDown
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ClusterResource.SimpleScalingPolicyConfigurationProperty.ScalingAdjustment``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-cluster-simplescalingpolicyconfiguration.html#cfn-elasticmapreduce-cluster-simplescalingpolicyconfiguration-scalingadjustment </remarks>
        [JsiiProperty("scalingAdjustment", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ScalingAdjustment
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}