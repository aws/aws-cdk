using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.InstanceGroupConfigResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingconstraints.html </remarks>
    [JsiiInterfaceProxy(typeof(IScalingConstraintsProperty), "@aws-cdk/aws-emr.cloudformation.InstanceGroupConfigResource.ScalingConstraintsProperty")]
    internal class ScalingConstraintsPropertyProxy : DeputyBase, Amazon.CDK.AWS.EMR.cloudformation.InstanceGroupConfigResource.IScalingConstraintsProperty
    {
        private ScalingConstraintsPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``InstanceGroupConfigResource.ScalingConstraintsProperty.MaxCapacity``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingconstraints.html#cfn-elasticmapreduce-instancegroupconfig-scalingconstraints-maxcapacity </remarks>
        [JsiiProperty("maxCapacity", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object MaxCapacity
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``InstanceGroupConfigResource.ScalingConstraintsProperty.MinCapacity``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-scalingconstraints.html#cfn-elasticmapreduce-instancegroupconfig-scalingconstraints-mincapacity </remarks>
        [JsiiProperty("minCapacity", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object MinCapacity
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}