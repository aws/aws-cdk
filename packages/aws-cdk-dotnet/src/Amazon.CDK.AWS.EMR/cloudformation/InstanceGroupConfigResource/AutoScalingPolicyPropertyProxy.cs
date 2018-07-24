using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation.InstanceGroupConfigResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-autoscalingpolicy.html </remarks>
    [JsiiInterfaceProxy(typeof(IAutoScalingPolicyProperty), "@aws-cdk/aws-emr.cloudformation.InstanceGroupConfigResource.AutoScalingPolicyProperty")]
    internal class AutoScalingPolicyPropertyProxy : DeputyBase, Amazon.CDK.AWS.EMR.cloudformation.InstanceGroupConfigResource.IAutoScalingPolicyProperty
    {
        private AutoScalingPolicyPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``InstanceGroupConfigResource.AutoScalingPolicyProperty.Constraints``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-autoscalingpolicy.html#cfn-elasticmapreduce-instancegroupconfig-autoscalingpolicy-constraints </remarks>
        [JsiiProperty("constraints", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.InstanceGroupConfigResource.ScalingConstraintsProperty\"}]}}")]
        public virtual object Constraints
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``InstanceGroupConfigResource.AutoScalingPolicyProperty.Rules``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticmapreduce-instancegroupconfig-autoscalingpolicy.html#cfn-elasticmapreduce-instancegroupconfig-autoscalingpolicy-rules </remarks>
        [JsiiProperty("rules", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.InstanceGroupConfigResource.ScalingRuleProperty\"}]}}}}]}}")]
        public virtual object Rules
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}